import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2">Create LifeOS Account</h1>
        <p className="text-gray-400 mb-6">Start managing your daily system</p>

        <input
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 mb-4 outline-none focus:border-purple-500"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 mb-4 outline-none focus:border-purple-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 mb-6 outline-none focus:border-purple-500"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-purple-500 hover:bg-purple-600 py-3 rounded-lg font-semibold"
        >
          Register
        </button>

        <p className="text-gray-400 text-sm mt-5 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;