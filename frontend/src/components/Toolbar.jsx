/* eslint-disable no-unused-vars */
import { FaEdit, FaEye, FaFileUpload, FaUpload, FaTrash } from "react-icons/fa";
import { Search } from "../shared/Search";
import { useAuth } from "../store/AuthContext";

export function Toolbar({ openModal, querySearch, isHomepage = false }) {
  const { user } = useAuth();

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
                onClick={() => isHomepage && openModal("VIEW")}
                disabled={!isHomepage}
                className={`border p-2 text-xl rounded-md ${
                  isHomepage
                    ? "hover:bg-primary hover:text-white text-blue-900 border-primary dark:border-secondary dark:text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <FaEye />
              </button>
            </div>

            {/* 3. Tambahkan "penjaga" (user &&) sebelum mengakses roleId */}
            {/* Tombol-tombol ini sekarang hanya akan muncul jika user ada DAN rolenya = 1 */}
            {user && user.roleId === 1 && (
              <>
                {/* UPLOAD FILE */}
                <div className="toolItem">
                  <button
                    onClick={() => isHomepage && openModal("FILE")}
                    disabled={!isHomepage}
                    className={`border p-2 text-xl rounded-md ${
                      isHomepage
                        ? "hover:bg-primary hover:text-white text-green-800 border-primary dark:border-secondary dark:text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <FaFileUpload />
                  </button>
                </div>

                {/* UPLOAD FOLDER */}
                <div className="toolItem">
                  <button
                    onClick={() => isHomepage && openModal("FOLDER")}
                    disabled={!isHomepage}
                    className={`border p-2 text-xl rounded-md ${
                      isHomepage
                        ? "hover:bg-primary hover:text-white text-yellow-800 border-primary dark:border-secondary dark:text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <FaUpload />
                  </button>
                </div>

                {/* EDIT */}
                <div className="toolItem">
                  <button
                    onClick={() => openModal("EDIT")}
                    className="border hover:bg-primary hover:text-white border-primary p-2 text-xl rounded-md text-green-800 dark:border-secondary dark:text-white"
                  >
                    <FaEdit />
                  </button>
                </div>

                {/* DELETE */}
                <div className="toolItem">
                  <button
                    onClick={() => openModal("DELETE")}
                    className="border hover:bg-primary hover:text-white border-primary p-2 text-xl rounded-md text-red-800 dark:border-secondary dark:text-white"
                  >
                    <FaTrash />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Search */}
          <div className="search space-y-3 md:space-y-0 md:flex items-center gap-2">
            <Search
              onChange={handleOnChange}
              value=""
              className="w-full md:w-[30em] focus:outline-primary border rounded-xl border-primary dark:bg-transparent dark:placeholder:text-gray-100 dark:border-secondary dark:text-white dark:outline-secondary"
            />
          </div>
        </div>
      </div>
    </>
  );
}
