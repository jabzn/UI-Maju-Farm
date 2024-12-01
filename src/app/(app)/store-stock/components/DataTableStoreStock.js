import DataTable from "react-data-table-component";

const DataTableStoreStock = () => {
    <DataTable
        columns={columns}
        data={data}
        customStyles={customStyles}
        pagination
        fixedHeader
        fixedHeaderScrollHeight="400px"
    />
}

export default DataTableStoreStock;