import { PrismaClient } from "../src/generated/prisma-client/client.ts";
import { GradeValue } from "../src/generated/prisma-client/enums.ts";

const prisma = new PrismaClient();

const SUBJECTS = [
  "Math",
  "Swedish",
  "English",
  "History",
  "Biology",
  "Chemistry",
  "Religion",
  "Physics",
  "Philosophy",
  "Social Studies",
  "Physical Education",
  "Science",
];

const LEVELS = ["A", "B", "C"];

const FIRST_NAMES = [
  "Alice",
  "Bob",
  "Charlie",
  "Diana",
  "Ethan",
  "Fiona",
  "George",
  "Hannah",
  "Ian",
  "Julia",
  "Kevin",
  "Laura",
  "Michael",
  "Nina",
  "Oscar",
  "Paula",
  "Quentin",
  "Rachel",
  "Sam",
  "Tina",
  "Ulf",
  "Victoria",
  "William",
  "Xenia",
  "Yara",
  "Zane",
];

const LAST_NAMES = [
  "Andersson",
  "Berg",
  "Carlsson",
  "Dahl",
  "Ek",
  "Forsberg",
  "Gustafsson",
  "Holm",
  "Isaksson",
  "Johansson",
  "Karlsson",
  "Lind",
  "Martinsson",
  "Nilsson",
  "Olofsson",
  "Persson",
  "Qvist",
  "Rosen",
  "Svensson",
  "Thorsson",
  "Ulfsson",
  "Vik",
  "Wallin",
  "Xander",
  "Ylva",
  "Zetterberg",
];

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomGrade() {
  const values = Object.values(GradeValue);
  return values[randomInt(0, values.length - 1)];
}

function randomPhone() {
  return "0" + randomInt(700000000, 799999999).toString();
}

function randomPersonNr(existing: Set<string>) {
  let personNr;
  do {
    const year = randomInt(2005, 2010).toString().slice(2, 4);
    const month = String(randomInt(1, 12)).padStart(2, "0");
    const day = String(randomInt(1, 28)).padStart(2, "0");
    const suffix = String(randomInt(0, 9999)).padStart(4, "0");
    personNr = `${year}${month}${day}-${suffix}`;
  } while (existing.has(personNr));
  existing.add(personNr);
  return personNr;
}

function randomAddress() {
  const streets = [
    "Storgatan",
    "Ringvägen",
    "Björkvägen",
    "Skolgatan",
    "Parkvägen",
  ];
  return `${streets[randomInt(0, streets.length - 1)]} ${randomInt(1, 120)}, Stockholm`;
}

// Map level to the intended year
function yearForLevel(level: string) {
  if (level === "A") return 1;
  if (level === "B") return 2;
  if (level === "C") return 3;
  return 0;
}

async function main() {
  console.log("Clearing DB...");
  await prisma.grade.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.student.deleteMany();

  console.log("Seeding subjects...");
  for (const name of SUBJECTS) {
    for (const level of LEVELS) {
      await prisma.subject.create({ data: { name, level } });
    }
  }

  console.log("Seeding students...");
  const students = [];
  const usedPersonNrs = new Set<string>();

  const yearDistribution = [
    ...Array(13).fill(1),
    ...Array(10).fill(2),
    ...Array(7).fill(3),
  ];

  for (let i = 0; i < 30; i++) {
    const firstName = randomFromArray(FIRST_NAMES);
    const lastName = randomFromArray(LAST_NAMES);

    const student = await prisma.student.create({
      data: {
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@school.com`,
        personNr: randomPersonNr(usedPersonNrs),
        year: yearDistribution[i],
        phone: randomPhone(),
        adress: randomAddress(),
      },
    });

    students.push(student);
  }

  console.log("Assigning courses and grades...");
  const allSubjects = await prisma.subject.findMany();

  for (const student of students) {
    const mandatory = ["Math", "Swedish", "English", "Physical Education"];
    const halfA = ["Biology", "Chemistry", "Physics", "Social Studies"];
    const halfB = ["Religion", "Philosophy", "History", "Science"];

    const group = students.indexOf(student) < 15 ? halfA : halfB;
    const enrolledSubjects = [...mandatory, ...group];

    // Create grade records for all levels of all enrolled subjects
    for (const subj of allSubjects.filter((s) =>
      enrolledSubjects.includes(s.name)
    )) {
      const intendedYear = yearForLevel(subj.level);
      const grade = student.year! >= intendedYear ? randomGrade() : null;

      await prisma.grade.create({
        data: {
          studentId: student.id,
          subjectId: subj.id,
          year: intendedYear, // use the level's year
          grade,
        },
      });
    }
  }

  console.log("Seeding complete!");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
});
