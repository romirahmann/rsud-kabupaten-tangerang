/* eslint-disable no-unused-vars */
import moment from "moment";
import { Table } from "../../shared/Table";

export function TableUsers({ data = [], selectedData, filter = [] }) {
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
    { header: "Username", key: "username" },
    { header: "Role", key: "roleName" },
  ];

  return (
    <>
      <Table data={data} columns={columns} rowsPerPage={filter.perPage || 15} />
    </>
  );
}
