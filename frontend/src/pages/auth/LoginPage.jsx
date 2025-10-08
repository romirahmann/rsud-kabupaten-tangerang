/* eslint-disable no-unused-vars */
import { useRouter } from "@tanstack/react-router";
import { AlertMessage } from "../../shared/Alert";
import { useState } from "react";
import api from "../../services/axios.service";
import { useAuth } from "../../store/AuthContext";

export function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const router = useRouter();
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "",
  });
  const { login } = useAuth();

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setAlert({
        show: true,
        message: "Username & Password is required",
        type: "warning",
      });
    }
    // console.log(formData);

    try {
      let res = await api.post(
        "/oauth/token?client_id=7F6E6D5T.ALIHMEDIA&client_secret=@BuanaAlihMedia1&grant_type=password",
        formData
      );
      let loginInfo = res.data.data;

      let user = {
        fullname: loginInfo.fullname,
        hospital_code: loginInfo.hospital_code,
        hospital_name: loginInfo.hospital_name,
        client_id: loginInfo.client_id,
        roleId: loginInfo.roleId,
        roleName: loginInfo.roleName,
        default_timezone: loginInfo.default_timezone,
        scope: loginInfo.scope,
        jti: loginInfo.jti,
        expires_in: loginInfo.expires_in,
        timezone: loginInfo.timezone,
        token_type: loginInfo.token_type,
      };
      let token = loginInfo.access_token;

      // console.log(user, token);
      let saveSession = login(user, token);

      if (saveSession) {
        setAlert({
          show: true,
          message: "Login Successfully!",
          type: "success",
        });
        setTimeout(() => {
          router.navigate({ to: "/" });
        }, 1500);
        return;
      }

      setAlert({
        show: true,
        message: `Login Failed!`,
        type: "error",
      });
    } catch (error) {
      setAlert({
        show: true,
        message: `Login Failed ! Please cek your username & password`,
        type: "error",
      });
    }
  };
  return (
    <>
      <div
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/rsud-tangerang/images/background.JPG')",
        }}
      >
        {/* Overlay Blur + Darken */}
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-0"></div>

        {/* Main Content */}
        <div className="relative z-10 w-[90%] max-w-6xl grid grid-cols-1 md:grid-cols-2 overflow-hidden min-h-[40rem]  bg-opacity-90 rounded-lg ">
          {/* BRAND SECTION */}
          <div className="hidden md:flex flex-col justify-center items-center bg-transparent/70 text-white p-10 ">
            <div className="text-center mt-6">
              <h1 className="font-extrabold text-4xl">INTEKA</h1>
              <h1 className="font-extrabold text-2xl">
                "Aplikasi Document Manager"
              </h1>
              <h2 className="text-lg mt-2">RSUD KABUPATEN TANGERANG</h2>
            </div>
          </div>

          {/* LOGIN FORM */}
          <div className="flex flex-col justify-center bg-gray-100 p-10 ">
            <div className="title md:hidden flex flex-col items-center">
              <img
                src="/rsud-tangerang/icons/folder.png"
                className="w-[5em] text-center"
                alt="Folder Icon"
              />
              <div className="text-center mt-2">
                <h1 className="font-extrabold text-2xl">File Manager</h1>
                <h2 className="text-sm text-gray-600 ">
                  Document Accounting & Finance
                </h2>
              </div>
            </div>

            <form
              onSubmit={handleSubmitLogin}
              className="w-full md:mt-0 mt-7 max-w-sm mx-auto space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600">Please login to your account</p>
              </div>

              <div>
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  onChange={handleOnChange}
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="username"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  onChange={handleOnChange}
                  className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
      <div>
        {alert.show && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() =>
              setAlert({
                show: false,
                type: "",
                message: "",
              })
            }
          />
        )}
      </div>
    </>
  );
}
