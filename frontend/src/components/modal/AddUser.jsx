/* eslint-disable no-unused-vars */
import { useState } from "react";

export function AddUserForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    username: "",

    password: "",
    roleId: 2, // default role user biasa
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username */}
      <div>
        <label className="block text-sm font-medium">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium">Role</label>
        <select
          name="roleId"
          value={formData.roleId}
          onChange={handleChange}
          className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:text-white"
        >
          <option value={1}>Admin</option>
          <option value={2}>User</option>
        </select>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Save
        </button>
      </div>
    </form>
  );
}
