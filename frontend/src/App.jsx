/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes/Routes";
import { AuthProvider, useAuth } from "./store/AuthContext";
import { LicenseProvider, useLicense } from "./store/LicenseContext";
import { LoadingScreen } from "./shared/LoadingScreen";
import { AnimatePresence, motion } from "framer-motion";

function AppRouter() {
  const auth = useAuth();
  const license = useLicense();

  const [showInitialLoading, setShowInitialLoading] = useState(true);

  useEffect(() => {
    if (!auth.loading && !license.isLoading) {
      const timer = setTimeout(() => setShowInitialLoading(false), 100);
      return () => clearTimeout(timer);
    }
  }, [auth.loading, license.isLoading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showInitialLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LoadingScreen />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <RouterProvider
              router={router}
              context={{
                auth,
                license,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <LicenseProvider>
        <AppRouter />
      </LicenseProvider>
    </AuthProvider>
  );
}

export default App;
