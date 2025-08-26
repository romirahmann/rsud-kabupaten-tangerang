/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import api from "../../services/axios.service";
import { SkeletonPage } from "../../shared/Skeleton";
import { AnimatePresence, motion } from "motion/react";
import { AlertMessage } from "../../shared/Alert";
import { Toolbar } from "../../components/Toolbar";
import { Modal } from "../../shared/Modal";
import { TableUsers } from "../../components/homepage/TableUsers";
import { EditUserForm } from "../../components/modal/EditUserForm"; // ✅ ganti form
import { Link } from "@tanstack/react-router";
import { AddUserForm } from "../../components/modal/AddUser";

export function UserPage() {
  const [modalOpen, setModalOpen] = useState({
    showEdit: false,
    showAdd: false,
    showDelete: false,
  });

  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ FETCH DATA USERS
  const fetchUsers = async () => {
    try {
      setLoading(true);
      let result = await api.get(`/master/users`);
      setUsers(result.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SEARCH
  const handleOnSearch = async (query) => {
    try {
      let result = await api.get(`/master/user-search?search=${query}`);
      setUsers(result.data.data);
    } catch (error) {
      console.log(error.response?.data || error);
    }
  };

  // ✅ OPEN MODAL
  const handleOpenModal = (type) => {
    switch (type) {
      case "EDIT":
        if (selectedUser) {
          setModalOpen({ showEdit: true });
          break;
        }
        setAlert({
          show: true,
          message: "Please select a user to proceed",
          type: "warning",
        });
        break;
      case "DELETE":
        if (selectedUser) {
          setModalOpen({ showDelete: true });
          break;
        }
        setAlert({
          show: true,
          message: "Please select a user to delete",
          type: "warning",
        });
        break;
      case "ADD":
        setModalOpen({ showAdd: true });
        break;
      default:
        break;
    }
  };

  // ✅ CREATE USER
  const handleAddUser = async (data) => {
    try {
      await api.post(`/master/user`, data);
      setModalOpen({ showAdd: false });
      setAlert({
        show: true,
        type: "success",
        message: "User created successfully!",
      });
      fetchUsers();
    } catch (error) {
      console.log(error.response || error);
      setAlert({
        show: true,
        type: "error",
        message: "Failed to create user!",
      });
    }
  };

  // ✅ UPDATE USER
  const handleUpdate = async (data) => {
    if (!selectedUser) {
      setAlert({
        show: true,
        type: "warning",
        message: "Please select a user to update",
      });
      return;
    }

    try {
      await api.put(`/master/user/${selectedUser.userId}`, { ...data });
      setModalOpen({ ...modalOpen, showEdit: false });
      setAlert({
        show: true,
        type: "success",
        message: "User updated successfully!",
      });
      fetchUsers();
    } catch (error) {
      console.log(error.response || error);
      setAlert({
        show: true,
        type: "error",
        message: "Update failed!",
      });
    }
  };

  // ✅ DELETE USER
  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await api.delete(`/master/user/${selectedUser.userId}`);
      setModalOpen({ showDelete: false });
      setAlert({
        show: true,
        type: "success",
        message: "User deleted successfully!",
      });
      fetchUsers();
    } catch (error) {
      console.log(error.response || error);
      setAlert({
        show: true,
        type: "error",
        message: "Delete failed!",
      });
    }
  };

  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <>
      <div className="max-w-full">
        <Toolbar
          openModal={handleOpenModal}
          querySearch={handleOnSearch}
          isHomepage={false}
        />
        {/* ✅ BACK TO HOMEPAGE + ADD USER */}
        <div className="flex gap-2 items-center mb-4">
          <Link
            to="/"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            ← Back to Homepage
          </Link>

          {/* ✅ ADD USER BUTTON */}
          <button
            onClick={() => setModalOpen({ showAdd: true })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            + Add User
          </button>
        </div>
        <div className="mainContent mt-5">
          <div className="mainContent dark:bg-gray-900 bg-white rounded-b-lg p-5">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="skeleton"
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <SkeletonPage />
                </motion.div>
              ) : (
                <div>
                  <TableUsers data={users} selectedData={setSelectedUser} />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MODALS */}
        {/* Add User */}
        <Modal
          isOpen={modalOpen.showAdd}
          title="Add User"
          onClose={() => setModalOpen({ showAdd: false })}
        >
          <AddUserForm onSubmit={handleAddUser} />
        </Modal>

        {/* Edit User */}
        <Modal
          isOpen={modalOpen.showEdit}
          title="Edit User"
          onClose={() => setModalOpen({ showEdit: false })}
        >
          <EditUserForm initialData={selectedUser} onSubmit={handleUpdate} />
        </Modal>

        {/* Delete User */}
        <Modal
          isOpen={modalOpen.showDelete}
          title="Delete User"
          onClose={() => setModalOpen({ showDelete: false })}
        >
          <div className="text-center">
            <p className="mb-4">
              Are you sure you want to delete <b>{selectedUser?.username}</b>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setModalOpen({ showDelete: false })}
                className="bg-gray-300 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>

        {/* ALERTS */}
        {alert.show && (
          <AlertMessage
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ show: false, type: "", message: "" })}
          />
        )}
      </div>
    </>
  );
}
