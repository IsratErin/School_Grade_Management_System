/* //get student and all grades by studentID
router.get("/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  const validatedUserId = z.number().positive().safeParse(userId);
  if (!validatedUserId.success) {
    return res.status(422).json({
      error: validatedUserId.error,
    });
  }
  try {
    const student = await prisma.student.findUnique({
      where: { id: validatedUserId.data },
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const validatedStudent = studentSchema.safeParse(student);
    if (!validatedStudent.success) {
      return res.status(500).json({
        message: "Invalid response from server.",
        error: validatedStudent.error,
      });
    }

    const grades = await prisma.grade.findMany({
      where: { studentId: validatedUserId.data },
    });
    if (!grades) {
      return res.json({ message: "No grades or corses registered yet." });
    }
    const subjectIds = grades.map((s) => s.subjectId);
    const subjects = await prisma.subject.findMany({
      where: { id: { in: subjectIds } },
      select: { id: true, name: true, level: true, updatedAt: true },
    });
    const gradeSubjectJoin = grades.map((g) => ({
      grade: g.grade,
      year: g.year,
      subject: subjects.find((s) => s.id === g.subjectId)?.name,
      level: subjects.find((s) => s.id === g.subjectId)?.level,
      timestamp: subjects.find((s) => g.id === s.id)?.updatedAt,
    }));

    res
      .status(200)
      .json({ student: validatedStudent.data, grades: gradeSubjectJoin });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json(error.message);
    }
    res.status(500).json("Error unknown");
  }
}); */
