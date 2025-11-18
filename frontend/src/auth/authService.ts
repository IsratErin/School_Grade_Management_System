import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  validatePassword,
} from "firebase/auth";

const auth = getAuth();

interface userCredential {
  email: string;
  password: string;
}

// create a new user with email and password
const createUser = async (userCredential: userCredential) => {
  try {
    const password = await validatePassword(auth, userCredential.password);
    if (!password.isValid) {
      const needsLowerCase = password.containsLowercaseLetter !== true;
      const needsUpperCase = password.containsUppercaseLetter !== true;
      throw new Error(
        `Password validation failed. Missing: ${
          needsLowerCase ? "lowercase letter " : ""
        }${needsUpperCase ? "uppercase letter" : ""}`.trim()
      );
    }
    const newUser = await createUserWithEmailAndPassword(
      auth,
      userCredential.email,
      userCredential.password
    );
    return newUser.user;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating new user:", error.message);
    }
  }
};

// sign in an existing user with email and password
const signInUser = async (userCredential: userCredential) => {
  try {
    const existingUser = await signInWithEmailAndPassword(
      auth,
      userCredential.email,
      userCredential.password
    );
    return existingUser.user;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error signing in user:", error.message);
    }
  }
};

// sign out the current user
const signOutUser = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error signing out user:", error.message);
    }
  }
};
export { createUser, signInUser, signOutUser };
