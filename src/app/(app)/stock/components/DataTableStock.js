'use client'

import ActionButtons from "@/components/ActionButtons";
import axios from "@/lib/axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import CustomStylesStock from "./CustomStylesStock";
import CreateButton from "@/components/CreateButton";
import Modal from "../../components/Modal";
import FormTransaction from "./FormTransaction";
import { DebounceInput } from "react-debounce-input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const INITIAL_STOCK_TRANSACTION_STATE = {
    reference_number: '',
    date: '',
    supplier_id: '',
    remark: '',
};

const DatatableStock = () => {
    const [data, setData] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState()
    const [sortDirection, setSortDirection] = useState()
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().split('T')[0]
    );
    const [endDate, setEndDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().split('T')[0]
    );
    const [modalState, setModalState] = useState({ 
        isOpen: false,
        mode: '', 
        stockTransaction: INITIAL_STOCK_TRANSACTION_STATE,
    });

    const fetchData = useCallback(async (page, sortColumn, sortDirection) => {
        try {
            setLoading(true);
            const [response, suppliers, items] = await Promise.all([
                axios.get('/api/stockTransactions', { params: { 
                    page: page, 
                    per_page: perPage, 
                    search: search, 
                    start_date: startDate, 
                    end_date: endDate,
                    sortColumn: sortColumn,
                    sortDirection: sortDirection,
                }}),
                axios.get('/api/suppliers'),
                axios.get('/api/items'),
            ]);
            setData(response.data.data);
            setSuppliers(suppliers.data);
            setItems(items.data);
            setTotalRows(response.data.total);
        } catch (error) {
            console.error('Error fetching stock transactions:', error);
        } finally {
            setLoading(false);
        }
    }, [perPage, search, startDate, endDate]);

    useEffect(() => {
        fetchData(currentPage, sortColumn, sortDirection);
    }, [fetchData, currentPage, sortColumn, sortDirection]);

    const handlePageChange = page => {
        setCurrentPage(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setPerPage(newPerPage);
        setCurrentPage(page);
    };

    const handleSortChange = (column, sortDirection) => {
        setSortColumn(column.sortField)
        setSortDirection(sortDirection)
    }

    const handleModalOpen = useCallback((mode, stockTransaction = {
        ...INITIAL_STOCK_TRANSACTION_STATE,
        date: new Date().toISOString().slice(0, 10)
    }) => {
        setModalState({ isOpen: true, mode, stockTransaction });
    }, []);

    const handleModalClose = useCallback(() => {
        setModalState(prev => ({ ...prev, isOpen: false }));
    }, []);

    const handleAfterSubmit = useCallback(async () => {
        handleModalClose();
        await fetchData(currentPage);
    }, [fetchData, currentPage, handleModalClose]);

    const getModalTitle = mode => {
        switch (mode) {
            case 'create': return 'Tambah Transaksi Stock';
            case 'update': return 'Ubah Transaksi Stock';
            case 'delete': return 'Hapus Transaksi Stock';
            default: return '';
        }
    };

    const columns = useMemo(() => [
        {
            name: 'REF',
            selector: row => row.reference_number,
            sortable: true,
            sortField: 'reference_number',
        },
        {
            name: 'Tanggal',
            selector: row => row.date,
            format: row => new Date(row.date).toLocaleDateString('id-ID'),
            sortable: true,
            sortField: 'date',
        },
        {
            name: 'Supplier',
            selector: row => row.supplier.name,
            sortable: true,
            sortField: 'supplier_id',
        },
        {
            name: 'Remark',
            selector: row => row.remark?.length > 20 ? `${row.remark.slice(0, 17)}...` : row.remark,
        },
        {
            name: 'Actions',
            cell: row => (
                <ActionButtons 
                    onUpdate={() => handleModalOpen('update', row)}
                    onDelete={() => handleModalOpen('delete', row)}
                    row={row}
                />
            ),
        }
    ], [handleModalOpen]);

    return (
        <>
            <div className="flex justify-between items-center mb-2">
                <CreateButton onClick={() => handleModalOpen('create')}>
                    Tambah Transaksi
                </CreateButton>

                <div className="flex items-center space-x-2">
                    <span className="text-gray-700">Tanggal</span>
                    <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="border rounded-sm px-2 py-1 outline-none shadow-inner"
                    />
                    <span className="text-gray-700">s/d</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="border rounded-sm px-2 py-1 outline-none shadow-inner"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <MagnifyingGlassIcon className="w-6" />
                    <DebounceInput
                        debounceTimeout={300}
                        placeholder="Cari Supplier ..."
                        className="border rounded-sm px-2 py-1 outline-none shadow-inner"
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Modal
                isOpen={modalState.isOpen}
                onClose={handleModalClose}
                title={getModalTitle(modalState.mode)}
                width={modalState.mode === 'delete' ? 'max-w-lg' : 'max-w-6xl'}
            >
                <FormTransaction
                    onSubmit={handleAfterSubmit}
                    data={modalState.stockTransaction}
                    dataSuppliers={suppliers}
                    dataItems={items}
                    mode={modalState.mode}
                    buttonText={getModalTitle(modalState.mode)}
                />
            </Modal>

            <DataTable
                columns={columns}
                data={data}
                customStyles={CustomStylesStock}
                pagination
                paginationServer
                paginationTotalRows={totalRows}
                onChangePage={handlePageChange}
                paginationRowsPerPageOptions={[]}
                paginationPerPage={perPage}
                sortServer
                onSort={handleSortChange}
                progressPending={loading}
                onRowClicked={row => handleModalOpen('update', row)}
                highlightOnHover
            />
        </>
    )
}

export default DatatableStock;