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
      render: (val) => moment(val).format("DD MMM YYYY"),
    },

    { header: "NORM", key: "norm" },
    { header: "NO BOX", key: "noBox" },
    {
      header: "Doklin Code",
      key: "doklin_code",
    },
    { header: "Doklin Name", key: "doklin_name" },
    { header: "Nama Pasien", key: "namaPasien" },
    {
      header: "Tanggal Lahir",
      key: "tglLahir",
      render: (val) => moment(val).format("DD MMM YYYY"),
    },
    // {
    //   header: "Jenis Dokumen",
    //   key: "jenisDokumen",
    // },
    {
      header: "Layanan",
      key: "layanan",
    },
    {
      header: "Title",
      key: "title",
    },

    { header: "Description", key: "description" },
    // {
    //   header: "Created At",
    //   key: "created_date_string",
    //   render: (val) => moment(val).format("DD MMM YYYY"),
    // },
    { header: "File Url", key: "file_url" },
  ];
  return (
    <>
      <Table data={data} columns={columns} rowsPerPage={filter.perPage || 15} />
    </>
  );
}
