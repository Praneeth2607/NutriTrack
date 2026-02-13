import { useState } from "react";
import Card from "../components/Card";
import { registerUser } from "../services/auth";
import { useNavigate } from "react-router-dom";


export default function Register() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    full_name: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
        try {
        await registerUser(form);
        navigate("/login");
        } catch (err) {
        setError(err.data?.message || "Registration failed");
        }

  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Card>
          <h1 className="text-textPrimary text-lg font-semibold mb-1">
            Create account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />

            <input
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />

            <input
              name="full_name"
              placeholder="Full name"
              onChange={handleChange}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />

            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            <p className="text-sm text-textSecondary mt-4 text-center">
                Already have an account?{" "}
                <span
                    onClick={() => navigate("/login")}
                    className="text-primary cursor-pointer"
                >
                    Sign in
                </span>
                </p>


            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white rounded-lg py-2 text-sm font-medium disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
