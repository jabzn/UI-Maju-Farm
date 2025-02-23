import DataTable from "react-data-table-component";
import CustomStylesStockCard from "./CustomStylesStockCard";

const DataTableStockCard = ({ storeStock }) => {
    const columns = [
        {
            name: 'No.',
            selector: (row, index) => index + 1,
        },
        {
            name: 'Tanggal',
            selector: row => row.date,
            format: row => new Date(row.date).toLocaleDateString('id-ID'),
        },
        {
            name: 'Stock In',
            selector: row => row.type === 'in' ? row.quantity : '',
        },
        {
            name: 'Stock Out',
            selector: row => row.type === 'out' ? row.quantity : '',
        },
        {
            name: 'Price per Unit',
            selector: row => new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
            }).format(row.total_price / row.quantity),
        },
        {
            name: 'Total Price',
            selector: row => new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
            }).format(row.total_price),
        },
    ];

    return (
        <>
            <DataTable
                data={storeStock.entries}
                columns={columns}
                customStyles={CustomStylesStockCard}
                pagination
                paginationRowsPerPageOptions={[]}
            />
        </>
    )
}

export default DataTableStockCard;