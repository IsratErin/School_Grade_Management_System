import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }
    navigate('/student-grades'); 
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6">
      <div className="bg-pink-100 p-10 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-8 text-center">👤 Login</h2>

        <div className="space-y-4">
          
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
            onClick={handleLogin}
            className="w-full font-bold bg-pink-400 text-white py-2 px-4 rounded-md hover:bg-pink-500 focus:outline-pink-300 focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Login
          </button>
        </div>
      </div>

      {/* Admin Button (Navigate) */}
      <button
        onClick={() => navigate('/admin-login')}
        className="absolute bottom-20 right-40 text-m font-bold text-white hover:text-black border-none bg-pink-400 p-2 rounded-md"
      >
        Admin
      </button>
    </div>
  );
}
