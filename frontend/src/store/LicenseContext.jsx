/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-refresh/only-export-components */

import { useNavigate } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/axios.service";

const checkLicenseStatus = async () => {
  try {
    try {
      await api.get("/validate-license");

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  } catch (error) {
    console.error("Gagal memvalidasi lisensi:", error);
    return false;
  }
};

const LicenseContext = createContext(null);

export function LicenseProvider({ children }) {
  const [isLicensed, setIsLicensed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validate = async () => {
      const status = await checkLicenseStatus();
      // console.log(status);
      setIsLicensed(status);
      setIsLoading(false);
    };
    validate();
  }, []);

  return (
    <LicenseContext.Provider value={{ isLicensed, isLoading }}>
      {children}
    </LicenseContext.Provider>
  );
}

export function useLicense() {
  const context = useContext(LicenseContext);
  if (!context) {
    throw new Error("useLicense must be used within a LicenseProvider");
  }
  return context;
}
