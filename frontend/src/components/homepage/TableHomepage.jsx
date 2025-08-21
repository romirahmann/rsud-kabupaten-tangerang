/* eslint-disable no-unused-vars */
import moment from "moment";
import { Table } from "../../shared/Table";

export function TableHomepage({ data = [], selectedData, filter = [] }) {
  const handleSelected = (row, checked) => {
    selectedData(row);
  };
  const columns = [
    {
      header: "",
      key: "__checkbox",
      render: (_, row) => (
        <input
          type="checkbox"
          onChange={(e) => {
            const checked = e.target.checked;
            handleSelected(row, checked);
          }}
        />
      ),
    },
    {
      header: "Tanggal Scan",
      key: "tanggalScan",
      render: (val) =>
        val ? moment(val, "YYYYMMDD").format("DD MMM YYYY") : "-",
    },
    { header: "NO MR", key: "noMr" },
    { header: "Nama Pasien", key: "namaPasien" },
    {
      header: "Tanggal lahir",
      key: "tglLahir",
      render: (val) => (val ? moment(val).format("DD MMM YYYY") : "-"),
    },
    { header: "Jenis Dokumen", key: "jenisDokumen" },
    { header: "Kategori", key: "kategori" },
    { header: "Layanan", key: "layanan" },
    { header: "Filename", key: "filename" },
  ];
  return (
    <>
      <Table data={data} columns={columns} rowsPerPage={filter.perPage || 15} />
    </>
  );
}
