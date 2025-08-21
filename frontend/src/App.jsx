import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes/Routes";
import { AuthProvider } from "./store/AuthContext";

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
