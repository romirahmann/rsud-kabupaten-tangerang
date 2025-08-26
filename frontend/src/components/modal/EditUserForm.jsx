/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";

export function EditUserForm({ initialData = {}, onSubmit }) {
  const [form, setForm] = useState({
    username: "",
    roleId: 2, // default User
    password: "",
  });

  // Populate form kalau ada data awal
  useEffect(() => {
    if (initialData) {
      setForm({
        username: initialData.username || "",
        roleId: initialData.roleId || 2,
        password: "", // kosongkan supaya tidak auto-isi
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Jangan kirim password kalau kosong saat update
    const payload = { ...form };
    if (!payload.password) {
      delete payload.password;
    }
    onSubmit?.(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      {/* Username */}
      <div className="col-span-2">
        <label
          htmlFor="username"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      {/* Role Select */}
      <div className="col-span-2">
        <label
          htmlFor="roleId"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Role
        </label>
        <select
          id="roleId"
          name="roleId"
          value={form.roleId}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          required
        >
          <option value={1}>Admin</option>
          <option value={2}>User</option>
        </select>
      </div>

      {/* Password (opsional untuk update) */}

      {/* Tombol Submit */}
      <div className="col-span-2 text-end">
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-80"
        >
          {initialData?.id ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
