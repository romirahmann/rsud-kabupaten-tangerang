/* eslint-disable no-unused-vars */
import moment from "moment";
import { useState, useEffect } from "react";

export function EditMetaDataForm({ initialData = {}, onSubmit }) {
  const [form, setForm] = useState({
    tanggalScan: "",
    norm: "",
    namaPasien: "",
    tglLahir: "",
    jenisDokumen: "",
    title: "",
    doklin_code: "",
    layanan: "",
  });

  // Populate form kalau ada data awal
  useEffect(() => {
    if (initialData) {
      setForm({
        tanggalScan: moment(initialData.tanggalScan).format("YYYY-MM-DD") || "",
        norm: initialData.norm || "",
        namaPasien: initialData.namaPasien || "",
        tglLahir: moment(initialData.tglLahir).format("YYYY-MM-DD") || "",
        jenisDokumen: initialData.jenisDokumen || "",
        title: initialData.title || "",
        doklin_code: initialData.doklin_code || "",
        layanan: initialData.layanan || "",
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
    onSubmit?.(form);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      {/* Tanggal Scan */}
      <div>
        <label
          htmlFor="tanggalScan"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Tanggal Scan
        </label>
        <input
          id="tanggalScan"
          type="date"
          name="tanggalScan"
          value={form.tanggalScan}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* No MR */}
      <div>
        <label
          htmlFor="norm"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          No MR
        </label>
        <input
          id="norm"
          type="text"
          name="norm"
          value={form.norm}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Nama Pasien */}
      <div>
        <label
          htmlFor="namaPasien"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Nama Pasien
        </label>
        <input
          id="namaPasien"
          type="text"
          name="namaPasien"
          value={form.namaPasien}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Tanggal Lahir */}
      <div>
        <label
          htmlFor="tglLahir"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Tanggal Lahir
        </label>
        <input
          id="tglLahir"
          type="date"
          name="tglLahir"
          value={form.tglLahir}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Jenis Dokumen */}
      <div>
        <label
          htmlFor="jenisDokumen"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Jenis Dokumen
        </label>
        <input
          id="jenisDokumen"
          type="text"
          name="jenisDokumen"
          value={form.jenisDokumen}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Nama File */}
      <div>
        <label
          htmlFor="title"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Nama File
        </label>
        <input
          id="title"
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* doklin_code */}
      <div>
        <label
          htmlFor="doklin_code"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Doklin_code
        </label>
        <input
          id="doklin_code"
          type="text"
          name="doklin_code"
          value={form.doklin_code}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Service Type */}
      <div>
        <label
          htmlFor="layanan"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Jenis Layanan
        </label>
        <select
          name="layanan"
          placeholder="layanan"
          id="layanan"
          value={form.layanan}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        >
          <option value={""} disabled>
            {" "}
            -- Selected --{" "}
          </option>
          <option value={"IGD"}> IGD </option>
          <option value={"IRJ"}> IRJ </option>
          <option value={"IRNA"}> IRNA </option>
        </select>
      </div>

      {/* Tombol Submit */}
      <div className="col-span-2 text-end">
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-80"
        >
          Update
        </button>
      </div>
    </form>
  );
}
