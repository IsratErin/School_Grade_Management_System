import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInUser, createUser } from "../auth/authService";
import { updateProfile } from "firebase/auth";
import { toast } from "react-hot-toast";

interface UserCredentials {
  email: string;
  password: string;
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userfirstname, setUserfirstname] = useState<string>("");
  const [userlastname, setUserlastname] = useState<string>("");

  const userCredentials: UserCredentials = {
    email,
    password,
  };

  const handleRegister = async () => {
    const username = `${userfirstname} ${userlastname}`;
    if (!email || !password || !username) {
      alert("Please enter username, email, and password.");
      return;
    }

    const newUser = await createUser(userCredentials);
    if (newUser) {
      toast.success(`Admin Registration successful!`);
      await updateProfile(newUser, {
        displayName: username, //from firebase.auth().currentUser
      });
    }
    console.log("Creating User with:", userCredentials);
    console.log("New user created:", newUser);
  };

  const handleLogin = async () => {
    if (!email || !password || !userfirstname || !userlastname) {
      alert(
        "Please enter the firstname, lastname, email, and password to log in."
      );
      return;
    }
    const loggedIn = await signInUser(userCredentials);
    if (!loggedIn) {
      alert(
        "Please Register first. If already registered, please provide the correct firstname, lastname, email, and password used while registering the account."
      );
      return;
    }
    toast.success("Logging in successful!");
    setTimeout(() => {
      navigate("/admin-dashboard");
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6">
      <div className="bg-pink-100 p-10 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-8 text-center">👤 Admin Login</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault(); // prevent page reload
            handleLogin();
          }}
          className="space-y-4"
        >
          {/* User Firstname */}
          <div>
            <label
              htmlFor="userfirstname"
              className="block text-m font-medium text-black"
            >
              Firstname:
            </label>

            <input
              id="userfirstname"
              type="text"
              placeholder="Enter your username"
              value={userfirstname}
              onChange={(e) => setUserfirstname(e.target.value)}
              className="placeholder:text-sm mt-1 block w-full px-3 py-2 border border-pink-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          {/* User Lastname */}
          <div>
            <label
              htmlFor="userlastname"
              className="block text-m font-medium text-black"
            >
              Lastname:
            </label>

            <input
              id="userlastname"
              type="text"
              placeholder="Enter your username"
              value={userlastname}
              onChange={(e) => setUserlastname(e.target.value)}
              className="placeholder:text-sm mt-1 block w-full px-3 py-2 border border-pink-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-m font-medium text-black"
            >
              Email:
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="placeholder:text-sm mt-1 block w-full px-3 py-2 border border-pink-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-m font-medium text-black"
            >
              Password:
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="placeholder:text-sm mt-1 block w-full px-3 py-2 border border-pink-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 text-pink-400 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-black">Remember Me</span>
            </label>
            <a
              href="#"
              className="text-sm text-pink-600 hover:text-pink-500 ml-4"
            >
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full font-bold bg-pink-400 text-white py-2 px-4 rounded-md hover:bg-pink-500 focus:outline-pink-300 focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Login
          </button>
          {/* Register button */}
          <button
            onClick={handleRegister}
            className="w-full font-bold bg-gray-200 text-black py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Register
          </button>
        </form>
      </div>

      {/* Student Login Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute bottom-20 right-40 text-m font-bold text-white hover:text-black border-none bg-pink-400 p-2 rounded-md"
      >
        Student Login
      </button>
    </div>
  );
}
