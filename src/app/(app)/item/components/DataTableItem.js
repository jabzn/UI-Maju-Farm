'use client'

import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

const ItemsTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/items')
            .then(response => {
                setData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    const columns = [
        {
            name: 'Kode Item',
            selector: row => row.code,
        },
        {
            name: 'Nama Item',
            selector: row => row.name,
        },
        {
            name: 'Kategori',
            selector: row => row.category,
        },
        {
            name: 'UOM',
            selector: row => row.uom,
        },
        {
            name: 'Keterangan',
            selector: row => row.remark,
        },
    ];

    const customStyles = {
        headCells: {
            style: {
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: '#f4f4f4',
                color: '#4a4a4a',
            },
        },
        headRow: {
            style: {
                backgroundColor: '#1f1f1f',
            },
        },
        rows: {
            style: {
                minHeight: '26px',
            },
        },
    }

    return (
        <>
            <DataTable 
                columns={columns}
                data={data}
                customStyles={customStyles}
                progressPending={loading}
                pagination
                paginationPerPage={12}
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
            />
        </>
    )
}

export default ItemsTable;