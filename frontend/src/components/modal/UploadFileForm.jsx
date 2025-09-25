/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import api from "../../services/axios.service";

export function UploadFileForm({ onSubmit }) {
  const [form, setForm] = useState({
    tanggalScan: "",
    noBox: "",
    norm: "",
    namaPasien: "",
    tglLahir: "",
    jenisDokumen: "DOKUMEN KLINIS",
    kategori: "",
    layanan: "",
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

    // console.log(files);
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
    // console.log(form);
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
          placeholder="No MR"
          value={form.norm}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label
          htmlFor="noBox"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          No Box
        </label>
        <input
          id="noBox"
          type="text"
          name="noBox"
          placeholder="No Box"
          value={form.noBox}
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
          placeholder="Nama Pasien"
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
          placeholder="Jenis Dokumen"
          value={form.jenisDokumen}
          onChange={handleChange}
          readOnly
          className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white bg-gray-200 outline-none"
        />
      </div>

      {/* Nama File */}
      {/* <div>
        <label
          htmlFor="fileName"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Nama File
        </label>
        <input
          id="fileName"
          type="text"
          name="fileName"
          placeholder="File Name"
          value={form.fileName}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        />
      </div> */}

      {/* Kategori */}
      <div>
        <label
          htmlFor="kategori"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Kategori
        </label>
        <select
          name="kategori"
          placeholder="Kategori"
          id="kategori"
          value={form.kategori}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        >
          {doklin.map((val) => (
            <option value={val.code}> {val.name} </option>
          ))}
        </select>
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

      {/* Layanan */}
      {/* <div>
        <label
          htmlFor="layanan"
          className="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Layanan
        </label>
        <input
          id="layanan"
          type="text"
          name="layanan"
          placeholder="Layanan"
          value={form.layanan}
          onChange={handleChange}
          className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
        />
      </div> */}

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
  );
}
