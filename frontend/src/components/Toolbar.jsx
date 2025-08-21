/* eslint-disable no-unused-vars */
import {
  FaCloudUploadAlt,
  FaEdit,
  FaEye,
  FaFileUpload,
  FaFolderPlus,
  FaUpload,
} from "react-icons/fa";
import { Search } from "../shared/Search";

import { useEffect, useState } from "react";

export function Toolbar({ openModal, querySearch }) {
  const [userLogin, setUserLogin] = useState([]);

  useEffect(() => {
    setUserLogin(JSON.parse(sessionStorage.getItem("user")));
  }, []);

  const handleOnChange = (e) => {
    let query = e.target.value;
    querySearch(query);
  };

  return (
    <>
      <div className="max-w-full bg-white dark:bg-gray-900 px-5 py-3 shadow-md">
        <div className="toolbar space-y-3 md:space-y-0 md:flex justify-between items-center">
          <div className="toolbar flex gap-2">
            {/* VIEW */}
            <div className="toolItem">
              <button
                onClick={() => openModal("VIEW")}
                className="border border-primary hover:bg-primary hover:text-white p-2 text-xl rounded-md text-blue-900 dark:border-secondary dark:text-white"
              >
                <FaEye />
              </button>
            </div>

            {/* UPLOAD FOLDER */}
            {userLogin.roleId === 3 || userLogin.roleId === 1 ? (
              <div className="toolItem">
                <button
                  onClick={() => openModal("FOLDER")}
                  className="border hover:bg-primary hover:text-white border-primary p-2 text-xl rounded-md text-yellow-800 dark:border-secondary dark:text-white"
                >
                  <FaUpload />
                </button>
              </div>
            ) : (
              ""
            )}
          </div>

          {/* Search + Filter */}
          <div className="search space-y-3 md:space-y-0 md:flex items-center gap-2">
            <Search
              onChange={handleOnChange}
              value=""
              className="w-full md:w-[30em] focus:outline-primary border rounded-xl border-primary dark:bg-transparent dark:placeholder:text-gray-100 dark:border-secondary dark:text-white dark:outline-secondary"
            />
          </div>
        </div>

        {/* Filter Box */}
      </div>
    </>
  );
}
