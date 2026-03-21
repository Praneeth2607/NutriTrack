import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../services/profile";

export default function Profile() {
  const [formData, setFormData] = useState({
    age: "", gender: "male", height_cm: "", weight_kg: "",
    activity_level: "sedentary", goal: "maintain"
  });
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile();
        if (data) {
          setFormData({
            age: data.age || "",
            gender: data.gender || "male",
            height_cm: data.height_cm || "",
            weight_kg: data.weight_kg || "",
            activity_level: data.activity_level || "sedentary",
            goal: data.goal || "maintain"
          });
          setStats({
            target_calories: data.target_calories,
            target_protein_g: data.target_protein_g
          });
        }
      } catch (err) {
        console.error("Profile not found or error fetching", err);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await updateProfile(formData);
      setMessage("Profile updated successfully!");
      setStats({
        target_calories: data.target_calories,
        target_protein_g: data.target_protein_g
      });
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Failed to update profile.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Profile & Goals</h2>
      
      {message && <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
            <input type="number" name="height_cm" value={formData.height_cm} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
            <input type="number" name="weight_kg" value={formData.weight_kg} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Activity Level</label>
            <select name="activity_level" value={formData.activity_level} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
              <option value="sedentary">Sedentary</option>
              <option value="light">Lightly Active</option>
              <option value="moderate">Moderately Active</option>
              <option value="active">Very Active</option>
              <option value="very_active">Extra Active</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Goal</label>
            <select name="goal" value={formData.goal} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
              <option value="lose">Lose Weight</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain">Gain Weight</option>
            </select>
          </div>
        </div>

        <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700">
          Save Profile & Calculate Goals
        </button>
      </form>

      {stats && (
        <div className="mt-8 p-4 bg-gray-50 rounded border">
          <h3 className="text-xl font-semibold mb-2">Your Daily Targets</h3>
          <p className="text-lg">Calories: <span className="font-bold text-green-600">{stats.target_calories} kcal</span></p>
          <p className="text-lg">Protein: <span className="font-bold text-blue-600">{stats.target_protein_g} g</span></p>
        </div>
      )}
    </div>
  );
}
