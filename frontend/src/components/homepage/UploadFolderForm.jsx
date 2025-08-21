/* eslint-disable no-unused-vars */
import { useState } from "react";

export function UploadFolderForm({ onUpload }) {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const handleChange = (e) => {
    setSelectedFiles(e.target.files);
  };
  const handleSubmit = () => {
    onUpload(selectedFiles);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm text-gray-700 dark:text-white">
        Choose your folder!
      </label>
      <input
        type="file"
        webkitdirectory="true"
        directory=""
        multiple
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
      />

      <div className="ms-1">
        <button
          onClick={() => handleSubmit()}
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-80"
        >
          Upload
        </button>
      </div>
    </div>
  );
}
