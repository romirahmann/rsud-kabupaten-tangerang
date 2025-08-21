/* eslint-disable no-unused-vars */
import { Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Topbar } from "./Topbar";

export function MainLayout() {
  const [userLogin, setUserLogin] = useState("");

  useEffect(() => {
    setUserLogin(JSON.parse(sessionStorage.getItem("user")));
  }, []);

  return (
    <>
      <div className="max-w-full ">
        <div className="topbar">
          <Topbar userData={userLogin} />
        </div>
        <Outlet />
      </div>
    </>
  );
}
