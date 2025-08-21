/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import api from "../../services/axios.service";
import { SkeletonPage } from "../../shared/Skeleton";
import { AnimatePresence, motion } from "motion/react";
import { AlertMessage } from "../../shared/Alert";
import { Toolbar } from "../../components/Toolbar";
import { TableHomepage } from "../../components/homepage/TableHomepage";
import { Modal } from "../../shared/Modal";
import { UploadFolderForm } from "../../components/homepage/UploadFolderForm";

export function HomePage() {
  const [menuIsActive, setMenuIsActive] = useState("payable");
  const [modalOpen, setModalOpen] = useState({
    showUploadFile: false,
    showUploadFolder: false,
    showEdit: false,
    showDelete: false,
  });
  const [documents, setDocuments] = useState({});

  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    fetchDocument();
  }, []);

  // FETCH DATA
  const fetchDocument = async () => {
    try {
      let result = await api.get(`/master/documents/${""}`);
      // console.log(api);
      setDocuments(result.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnSearch = async (query) => {};

  const handleOnFilter = async (filter) => {};

  const handleOpenModal = (type) => {
    switch (type) {
      case "VIEW":
        if (selectedDoc) {
          // console.log(selectedDoc);
          getFilePDF(selectedDoc.filePath);
          break;
        }
        setAlert({
          show: true,
          message: "Please select a document to proceed",
          type: "warning",
        });
        break;
      case "FILE":
        setModalOpen({ showUploadFile: true });
        break;
      case "FOLDER":
        setModalOpen({ showUploadFolder: true });
        break;
      case "EDIT":
        if (selectedDoc) {
          setModalOpen({ showEdit: true });
          break;
        }

        setAlert({
          show: true,
          message: "Please select a document to proceed",
          type: "warning",
        });
        break;
      case "DELETE":
        if (selectedDoc) {
          setModalOpen({ showDelete: true });
          break;
        }

        setAlert({
          show: true,
          message: "Please select a document to proceed",
          type: "warning",
        });
        break;
      default:
        break;
    }
  };

  const getFilePDF = async (filePath) => {
    try {
      let res = await api.get(`/master/file-url?filePath=${filePath}`);
      let data = res.data.data;
      window.open(data, "_blank");
    } catch (error) {
      console.log(error.response);
    }
  };

  // Handle Upload Folder
  const handleUploadFolder = async (selectedFolder) => {
    if (!selectedFolder || selectedFolder.length === 0) {
      setAlert({
        show: true,
        message: "Please select  folder to proceed",
        type: "warning",
      });
      return;
    }

    const formData = new FormData();
    const paths = [];

    for (let file of selectedFolder) {
      const relativePath = file.webkitRelativePath;
      if (!relativePath) {
        setAlert({
          show: true,
          message: "Path InValid!",
          type: "error",
        });
        return;
      }
      formData.append("files", file);
      paths.push(relativePath);
    }

    formData.append("paths", JSON.stringify(paths));

    try {
      await api.post(`/upload-folder`, formData);
      setModalOpen({ ...modalOpen, showUploadFolder: false });
      setAlert({
        show: true,
        message: "Folder uploaded successfully",
        type: "success",
      });
    } catch (error) {
      setAlert({
        show: true,
        message: "Folder uploaded failed",
        type: "error",
      });
      console.log(error.response);
    }
  };

  // Handle Upload File

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
          onFilter={handleOnFilter}
          querySearch={handleOnSearch}
        />
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
                  <TableHomepage
                    data={documents}
                    selectedData={setSelectedDoc}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* MODALS */}
        <Modal
          isOpen={modalOpen.showUploadFolder}
          title="Upload Folder"
          onClose={() => setModalOpen({ showUploadFolder: false })}
        >
          <UploadFolderForm onUpload={(files) => handleUploadFolder(files)} />
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
