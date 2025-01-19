import DataTable from "react-data-table-component";
import CustomStylesStockCard from "./CustomStylesStockCard";

const DataTableStockCard = ({ storeStock }) => {
    const columns = [
        {
            name: 'No.',
            selector: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: 'Tanggal',
            selector: row => row.date,
            sortable: true,
        },
        {
            name: 'Stock In',
            selector: row => row.type === 'in' ? row.total_quantity.toLocaleString('id-ID') : '',
            sortable: true,
        },
        {
            name: 'Stock Out',
            selector: row => row.type === 'out' ? row.total_quantity.toLocaleString('id-ID') : '',
            sortable: true,
        },
        {
            name: 'Price per Unit',
            selector: row => row.price.toLocaleString('id-ID'),
            sortable: true,
        },
        {
            name: 'Total Price',
            selector: row => row.total_price.toLocaleString('id-ID'),
            sortable: true,
        },
    ];

    return (
        <>
            <DataTable
                data={storeStock.stock_movements}
                columns={columns}
                customStyles={CustomStylesStockCard}
                pagination
                paginationRowsPerPageOptions={[]}
            />
        </>
    )
}

export default DataTableStockCard;