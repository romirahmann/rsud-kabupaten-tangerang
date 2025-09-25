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
import { UploadFileForm } from "../../components/modal/UploadFileForm";
import { DeleteConfirmation } from "../../components/modal/DeleteConfirm";
import { EditMetaDataForm } from "../../components/modal/EditMetaData";
import { UploadFileAPI } from "../../components/modal/UploadFileAPI";
import { PulsatingDotsSpinner } from "../../shared/Spinner";

// ✅ Tambahkan komponen Progress Overlay
const UploadProgressOverlay = ({ processed, total }) => (
  <div className="fixed inset-0 z-[99] flex flex-col items-center justify-center bg-gray-900 bg-opacity-60 backdrop-blur-sm">
    <PulsatingDotsSpinner />
    <p className="mt-4 text-white font-semibold">
      Mengupload {processed} dari {total} file...
    </p>
  </div>
);

export function HomePage() {
  const [modalOpen, setModalOpen] = useState({
    showUploadFile: false,
    showUploadFolder: false,
    showEdit: false,
    showDelete: false,
  });
  const [documents, setDocuments] = useState({});
  const [uploadFileAPI, setUploadFileAPI] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  // ✅ State baru untuk melacak progres upload
  const [uploadProgress, setUploadProgress] = useState({
    show: false,
    processed: 0,
    total: 0,
  });

  useEffect(() => {
    fetchDocument();
  }, []);

  // FETCH DATA
  const fetchDocument = async () => {
    try {
      let result = await api.get(`/master/documents`);
      setDocuments(result.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnSearch = async (query) => {
    try {
      if (query && query.trim() !== "") {
        let result = await api.get(`/master/document-search/${query}`);
        // console.log(result.data.data);
        setDocuments(result.data.data);
      } else {
        fetchDocument(); // kalau query kosong, load semua
      }
    } catch (error) {
      console.log(error.response?.data || error);
    }
  };

  const handleOnFilter = async (filter) => {};

  const handleOpenModal = (type) => {
    switch (type) {
      case "VIEW":
        if (selectedDoc) {
          // console.log(selectedDoc);
          getFilePDF(selectedDoc.file_url);
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
  // const handleUploadFolder = async (selectedFolder) => {
  //   if (!selectedFolder || selectedFolder.length === 0) {
  //     setAlert({
  //       show: true,
  //       message: "Please select  folder to proceed",
  //       type: "warning",
  //     });
  //     return;
  //   }

  //   const formData = new FormData();
  //   const paths = [];

  //   for (let file of selectedFolder) {
  //     const relativePath = file.webkitRelativePath;
  //     if (!relativePath) {
  //       setAlert({
  //         show: true,
  //         message: "Path InValid!",
  //         type: "error",
  //       });
  //       return;
  //     }
  //     formData.append("files", file);
  //     paths.push(relativePath);
  //   }

  //   formData.append("paths", JSON.stringify(paths));

  //   try {
  //     await api.post(`/upload-folder`, formData);
  //     setModalOpen({ ...modalOpen, showUploadFolder: false });
  //     setAlert({
  //       show: true,
  //       message: "Folder uploaded successfully",
  //       type: "success",
  //     });
  //     fetchDocument();
  //     setUploading(true);
  //   } catch (error) {
  //     setAlert({
  //       show: true,
  //       message: "Folder uploaded failed",
  //       type: "error",
  //     });
  //     console.log(error.response);
  //   }
  // };

  // ✅ FUNGSI UTAMA: Logika upload folder dengan sistem batch
  const handleUploadFolder = async (fileList) => {
    setModalOpen({ showUploadFolder: false }); // Langsung tutup modal

    if (!fileList || fileList.length === 0) {
      setAlert({
        show: true,
        message: "Tidak ada folder yang dipilih.",
        type: "warning",
      });
      return;
    }

    const files = Array.from(fileList);
    const BATCH_SIZE = 50; // Kirim 50 file per permintaan
    const totalFiles = files.length;

    setUploadProgress({ show: true, processed: 0, total: totalFiles });

    try {
      // 💡 Proses upload dibagi per batch
      for (let i = 0; i < totalFiles; i += BATCH_SIZE) {
        const batch = files.slice(i, i + BATCH_SIZE);
        await uploadBatch(batch);

        // Update progress setelah setiap batch berhasil
        setUploadProgress((prev) => ({
          ...prev,
          processed: Math.min(prev.processed + BATCH_SIZE, totalFiles),
        }));
      }

      setAlert({
        show: true,
        message: "Semua file dalam folder berhasil di-upload!",
        type: "success",
      });
      fetchDocument();
    } catch (error) {
      console.error("Upload batch gagal:", error);
      setAlert({
        show: true,
        message: `Terjadi kesalahan saat meng-upload. Coba lagi. (Error: ${error.message})`,
        type: "error",
      });
    } finally {
      // Sembunyikan overlay loading setelah selesai (baik sukses maupun gagal)
      setUploadProgress({ show: false, processed: 0, total: 0 });
    }
  };

  // Fungsi helper untuk meng-upload satu batch
  const uploadBatch = async (fileBatch) => {
    const formData = new FormData();
    const paths = [];

    for (const file of fileBatch) {
      // Pastikan webkitRelativePath ada untuk validasi
      if (!file.webkitRelativePath) {
        throw new Error(
          "Path file tidak valid. Pastikan Anda menggunakan browser berbasis Chromium."
        );
      }
      formData.append("files", file);
      paths.push(file.webkitRelativePath);
    }
    formData.append("paths", JSON.stringify(paths));

    // Kirim batch ke server
    await api.post(`/upload-folder`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  // Handle Upload File
  const handleUploadFile = async (data) => {
    if (!data) {
      setAlert({
        show: true,
        message: "Data Not Found!",
        type: "warning",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("tanggalScan", data.tanggalScan);
      formData.append("noBox", data.noBox);
      formData.append("norm", data.norm);
      formData.append("namaPasien", data.namaPasien); // ✅ tambahin di sini
      formData.append("tglLahir", data.tglLahir);
      formData.append("jenisDokumen", data.jenisDokumen);
      formData.append("kategori", data.kategori);
      formData.append("layanan", data.layanan);
      formData.append("file", data.file);

      // // 🔎 cek isi formData sebelum upload
      // for (let [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }

      // kirim ke API
      await api.post(`/upload-file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setModalOpen({ ...modalOpen, showUploadFile: false });
      setAlert({
        show: true,
        message: "File uploaded successfully",
        type: "success",
      });

      fetchDocument();
    } catch (error) {
      setAlert({
        show: true,
        message: "File upload failed",
        type: "error",
      });
      console.log(error.response || error);
    }
  };

  const handleDeleted = async () => {
    // console.log(selectedDoc);
    try {
      await api.delete(
        `/master/delete-file?id=${selectedDoc.id}&path=${selectedDoc.file_url}`
      );
      setModalOpen({ showDelete: false });
      setAlert({
        show: true,
        message: "Deleted Successfully!",
        type: "success",
      });
      fetchDocument();
    } catch (error) {
      console.log(error);
      setAlert({
        show: true,
        message: "Deleted Failed!",
        type: "error",
      });
    }
  };

  const handleUpdate = async (data) => {
    if (!selectedDoc) {
      setAlert({
        show: true,
        type: "warning",
        message: "Please select a document to update",
      });
      return;
    }

    try {
      // Kirim update ke API (pakai id dari selectedDoc)
      await api.put(`/master/document/${selectedDoc.id}`, {
        ...data,
      });

      setModalOpen({ ...modalOpen, showEdit: false });
      setAlert({
        show: true,
        type: "success",
        message: "Document updated successfully!",
      });

      fetchDocument(); // refresh data table
    } catch (error) {
      console.log(error.response || error);
      setAlert({
        show: true,
        type: "error",
        message: "Update failed!",
      });
    }
  };

  const handleTipeUploadFile = (e) => {
    const { value } = e.target;

    if (parseInt(value) === 1) {
      setUploadFileAPI(true);
    } else {
      setUploadFileAPI(false);
    }
  };

  const handleUploadFileAPI = async (data) => {
    if (!data) {
      setAlert({
        show: true,
        message: "Data Not Found!",
        type: "warning",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("doklin_code", data.doklin_code);
      formData.append("norm", data.norm);
      formData.append("file", data.file);

      // // 🔎 cek isi formData sebelum upload
      // for (let [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }

      // kirim ke API
      await api.post(`/document/v1/alih-media/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setModalOpen({ ...modalOpen, showUploadFile: false });
      setAlert({
        show: true,
        message: "File uploaded successfully",
        type: "success",
      });

      fetchDocument();
    } catch (error) {
      setAlert({
        show: true,
        message: "File upload failed",
        type: "error",
      });
      console.log(error.response || error);
    }
  };

  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <>
      {/* ✅ Tampilkan Progress Overlay secara global */}
      {uploadProgress.show && (
        <UploadProgressOverlay
          processed={uploadProgress.processed}
          total={uploadProgress.total}
        />
      )}
      <div className="max-w-full">
        <Toolbar
          openModal={handleOpenModal}
          onFilter={handleOnFilter}
          querySearch={handleOnSearch}
          isHomepage={true}
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
        {/* Modal Upload */}
        <Modal
          isOpen={modalOpen.showUploadFile}
          title="Upload File"
          onClose={() => setModalOpen({ showUploadFile: false })}
        >
          <UploadFileForm onSubmit={(data) => handleUploadFile(data)} />
          {/* <div className="mb-4">
            <select
              id="source"
              name="source"
              className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              defaultValue=""
              onChange={handleTipeUploadFile}
            >
              <option value="" disabled>
                -- Jenis Upload --
              </option>
              <option value="1">API</option>
              <option value="2">PADAMA</option>
            </select>
          </div>
          {uploadFileAPI ? (
            <UploadFileAPI onSubmit={(data) => handleUploadFileAPI(data)} />
          ) : (
            <UploadFileForm onSubmit={(data) => handleUploadFile(data)} />
          )} */}
        </Modal>
        {/* upload folder */}
        <Modal
          isOpen={modalOpen.showUploadFolder}
          title="Upload Folder"
          onClose={() => setModalOpen({ showUploadFolder: false })}
        >
          {/* <UploadFolderForm
            onUpload={(files) => handleUploadFolder(files)}
            submitted={uploading}
          /> */}
          <UploadFolderForm onFolderSelect={handleUploadFolder} />
        </Modal>
        <Modal
          isOpen={modalOpen.showEdit}
          title="Edit Data"
          onClose={() => setModalOpen({ showEdit: false })}
        >
          <EditMetaDataForm initialData={selectedDoc} onSubmit={handleUpdate} />
        </Modal>
        <Modal
          isOpen={modalOpen.showDelete}
          title="Delete Data"
          onClose={() => setModalOpen({ showDelete: false })}
        >
          <DeleteConfirmation onDelete={() => handleDeleted()} />
        </Modal>
        {/* MODAL UPLOAD LOADING */}
        <Modal></Modal>
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
