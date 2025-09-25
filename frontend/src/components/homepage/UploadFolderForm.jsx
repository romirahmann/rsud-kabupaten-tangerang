// 💡 DIUBAH: Komponen ini sekarang jauh lebih sederhana.
// Tidak ada lagi state internal atau tombol submit.
// Upload akan dipicu langsung dari event `onChange`.

export function UploadFolderForm({ onFolderSelect }) {
  const handleFileChange = (e) => {
    // Langsung panggil fungsi dari parent saat folder dipilih
    if (e.target.files && e.target.files.length > 0) {
      onFolderSelect(e.target.files);
    }
  };

  return (
    <div className="space-y-4">
      <label
        htmlFor="folder-upload"
        className="block text-sm font-medium text-gray-700 dark:text-white"
      >
        Pilih folder untuk di-upload
      </label>
      <p className="text-xs text-gray-500">
        Proses upload akan dimulai secara otomatis setelah Anda memilih folder
        dan menekan "Upload" pada dialog browser.
      </p>
      <input
        id="folder-upload"
        type="file"
        webkitdirectory="true"
        directory=""
        multiple
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
    </div>
  );
}
