/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import api from "../../services/axios.service";
import { useRouter } from "@tanstack/react-router";
import { AlertMessage } from "../../shared/Alert";
import { useLicense } from "../../store/LicenseContext";

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-green-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export function LicensePage() {
  const [serialNumber, setSerialNumber] = useState("");
  const [requestCode, setRequestCode] = useState("Generating code...");
  const [isCopied, setIsCopied] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const { refreshLicense } = useLicense();
  const router = useRouter();

  useEffect(() => {
    generateCode();
  }, []);

  const generateCode = async () => {
    try {
      let res = await api.get("/generate-code");
      setRequestCode(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const handleCopyToClipboard = () => {
  //   navigator.clipboard.writeText(requestCode);
  //   setIsCopied(true);

  //   setTimeout(() => {
  //     setIsCopied(false);
  //   }, 2000);
  // };

  const handleActivation = async () => {
    if (!serialNumber.trim()) {
      alert("Serial number tidak boleh kosong.");
      return;
    }

    try {
      let res = await api.post("/activation", { serialNumber });

      if (res.data.status) {
        setAlert({ show: true, type: "success", message: res.data.data });

        router.navigate({ to: "/" });
      } else {
        setAlert({
          show: true,
          type: "error",
          message: "Aktivasi gagal, silakan coba lagi.",
        });
      }
    } catch (error) {
      console.error(error);
      setAlert({ show: true, type: "error", message: "Activation Failed!" });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-6 sm:p-8">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Aktivasi Lisensi
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Aplikasi Anda belum teraktivasi. Silakan ikuti langkah di bawah ini.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="request-code"
              className="block text-sm font-medium text-slate-700"
            >
              Langkah 1: Salin dan kirim kode ini ke pengembang
            </label>
            <div className="mt-1 relative">
              <input
                id="request-code"
                type="text"
                readOnly
                value={requestCode}
                className="w-full bg-gray-100 border-gray-300 rounded-md shadow-sm p-3 font-mono text-sm pr-12"
              />
              {/* <button
                onClick={handleCopyToClipboard}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-indigo-600"
              >
                {isCopied ? <CheckIcon /> : <CopyIcon />}
              </button> */}
            </div>
          </div>

          {/* Langkah 2: Serial Number Input */}
          <div>
            <label
              htmlFor="serial-number"
              className="block text-sm font-medium text-slate-700"
            >
              Langkah 2: Masukkan serial number yang Anda terima
            </label>
            <div className="mt-1">
              <input
                id="serial-number"
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="Contoh: ABCD-EFGH-IJKL-MNOP"
                className="w-full border-gray-300 rounded-md shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <button
              onClick={handleActivation}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Aktivasi Sekarang
            </button>
          </div>
        </div>
      </div>
      {/* ALERTS */}
      {alert.show && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ show: false, type: "", message: "" })}
        />
      )}
    </div>
  );
}
