'use client';

import axios from "@/lib/axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { DebounceInput } from "react-debounce-input";
import CustomStylesStoreStock from "./CustomStylesStoreStock";
import Modal from "../../components/Modal";
import DataTableStockCard from "./DataTableStockCard";

const DataTableStoreStock = () => {
    const [data, setData] = useState();
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [modal, setModal] = useState({
        isOpen: false,
        storeStock: {},
    });
    const [item, setItem] = useState({});
    const [startDate, setStartDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().split('T')[0]
    );
    const [endDate, setEndDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().split('T')[0]
    );

    const fetchData = useCallback(async (page) => {
        try {
            setLoading(true);
            const response = await axios.get('/api/storeStocks', { 
                params: { 
                    search: search, 
                    start_date: startDate, 
                    end_date: endDate,
                    page: page, 
                    per_page: perPage, 
                }});
            setData(response.data.data);
            setTotalRows(response.data.total);
        } catch (error) {
            console.error('Error fetching Store Stock:', error);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, search, perPage]);

    useEffect(() => {
        fetchData(currentPage);
    }, [fetchData, currentPage]);

    const handlePageChange = page => {
        setCurrentPage(page);
    };

    const handleModalOpen = useCallback((row) => {
        setModal({ isOpen: true, storeStock: row });
    }, []);

    const handleModalClose = useCallback(() => {
        setModal(prev => ({ ...prev, isOpen: false}));
    }, []);

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
    };

    const columns = useMemo(() => [
        {
            name: 'ID',
            selector: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: 'Kategori',
            selector: row => row.category.name,
            sortable: true,
        },
        {
            name: 'Item',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Unit',
            selector: row => row.unit.name,
            sortable: true,
        },
        {
            name: 'Current Stock',
            selector: row => row.current_stock.toLocaleString('id-ID'),
            sortable: true,
        },
        {
            name: 'Unit Price',
            selector: row => row.totalPrice ? (row.totalPrice / row.current_stock).toLocaleString('id-ID') : '',
            sortable: true,
        },
        {
            name: 'Total Price',
            selector: row => row.totalPrice.toLocaleString('id-ID'),
            sortable: true,
        },
    ], [handleModalOpen]);

    return (
        <>
            <div className="flex items-center justify-between mb-2">
                <div className="flex space-x-2 items-center">
                    <DebounceInput
                        debounceTimeout={300}
                        className="border rounded-md px-2 py-1 outline-none shadow-inner"
                        onChange={e => setSearch(e.target.value)}
                    />

                    <span>Cari Item</span>
                </div>

                <div className="flex items-center space-x-2">
                    <span className="text-gray-700">Tanggal</span>
                    <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="border rounded-md px-2 py-1 outline-none shadow-inner"
                    />
                    <span className="text-gray-700">s/d</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="border rounded-md px-2 py-1 outline-none shadow-inner"
                    />
                </div>
            </div>

            <Modal
                isOpen={modal.isOpen}
                onClose={handleModalClose}
                title={modal.storeStock.name}
                width={'max-w-7xl'}
            >
                <DataTableStockCard
                    storeStock={modal.storeStock}
                />
            </Modal>

            <DataTable
                columns={columns}
                data={data}
                customStyles={CustomStylesStoreStock}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangePage={handlePageChange}
                paginationRowsPerPageOptions={[]}
                paginationPerPage={perPage}
                progressPending={loading}
                onRowClicked={row => handleModalOpen(row)}
                highlightOnHover
            />
        </>
    )
}

export default DataTableStoreStock;