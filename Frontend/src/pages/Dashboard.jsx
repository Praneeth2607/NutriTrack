import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import Card from "../components/Card";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await apiRequest("/user/profile");
        setProfile(data);
      } catch (err) {
        setError("Failed to load profile");
      }
    }

    fetchProfile();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-textSecondary text-sm">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg p-6">
      <h1 className="text-textPrimary text-xl font-semibold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="User Profile">
          <p className="text-sm text-textSecondary">
            <strong>Username:</strong> {profile.username}
          </p>
          <p className="text-sm text-textSecondary">
            <strong>Email:</strong> {profile.email}
          </p>
          <p className="text-sm text-textSecondary">
            <strong>Name:</strong> {profile.full_name || "—"}
          </p>
        </Card>

        <Card title="Next Steps">
          <p className="text-sm text-textSecondary">
            Food tracking and analytics will appear here.
          </p>
        </Card>
      </div>
    </div>
  );
}
