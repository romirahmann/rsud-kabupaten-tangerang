import { useEffect, useState } from "react";
import api from "../../services/axios.service";

/* eslint-disable no-unused-vars */
export function UploadFileAPI({ onSubmit }) {
  const [form, setForm] = useState({
    doklin_code: "",
    norm: "",
    title: "",
    file: null,
  });
  const [doklin, setDoklin] = useState([]);

  useEffect(() => {
    fetchDoklin();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const fetchDoklin = async () => {
    try {
      let result = await api.get("/document/v1/alih-media/master-doklin");
      setDoklin(result.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {/* No MR */}
        <div>
          <label
            htmlFor="doklin_code"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Doklin Code
          </label>
          <select
            name="doklin_code"
            placeholder="Doklin Code"
            id="doklin_code"
            value={form.doklin_code}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          >
            {doklin.map((val) => (
              <option value={val.code}> {val.name} </option>
            ))}
          </select>
        </div>

        {/* No MR */}
        <div>
          <label
            htmlFor="norm"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            NoRM
          </label>
          <input
            id="norm"
            type="text"
            name="norm"
            placeholder="norm"
            value={form.norm}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Upload File */}
        <div className="col-span-2">
          <label
            htmlFor="file"
            className="text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Pilih File
          </label>
          <input
            id="file"
            type="file"
            name="file"
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Tombol Submit */}
        <div className="col-span-2 text-end">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-80"
          >
            Upload
          </button>
        </div>
      </form>
    </>
  );
}
