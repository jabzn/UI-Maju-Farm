'use client';

import CreateButton from "@/components/CreateButton";
import axios from "@/lib/axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import CustomStylesEggStock from "./customStylesEggStock";
import ActionButtons from "@/components/ActionButtons";
import Modal from "../../components/Modal";
import FormEggStock from "./FormEggStock";

const INITIAL_EGG_PRODUCTION_STATE = {
    date: '',
    store_id: '',
};

const DataTableEggStock = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stores, setStores] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState()
    const [sortDirection, setSortDirection] = useState()
    const [store, setStore] = useState([]);
    const [modalState, setModalState] = useState({
        isOpen: false,
        mode: '',
        eggProduction: INITIAL_EGG_PRODUCTION_STATE,
    });
    const [startDate, setStartDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().split('T')[0]
    );
    const [endDate, setEndDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().split('T')[0]
    );

    const fetchData = useCallback(async (page, sortColumn, sortDirection) => {
        try {
            setLoading(true);
            const [response, stores, sizes] = await Promise.all([
                axios.get('/api/eggProductions', { params: {
                    store_id: store,
                    start_date: startDate,
                    end_date: endDate,
                    page: page,
                    per_page: perPage,
                    sortColumn: sortColumn,
                    sortDirection: sortDirection,
                }}),
                axios.get('/api/stores'),
                axios.get('/api/sizes'),
            ]);
            setData(response.data.data);
            setTotalRows(response.data.total);
            setStores(stores.data);
            setSizes(sizes.data);
        } catch (error) {
            console.error('Error fetching Data:', error);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, store, perPage])

    useEffect(() => {
        fetchData(currentPage, sortColumn, sortDirection);
    }, [fetchData, currentPage, sortColumn, sortDirection]);

    const handleModalOpen = useCallback((mode, eggProduction = {
        ...INITIAL_EGG_PRODUCTION_STATE,
        date: new Date().toISOString().slice(0, 10)
    }) => {
        setModalState({ isOpen: true, mode, eggProduction });
    }, []);

    const handleModalClose = useCallback(() => {
        setModalState(prev => ({ ...prev, isOpen: false}));
    }, []);

    const handlePageChange = page => {
        setCurrentPage(page);
    };

    const handleSortChange = (column, sortDirection) => {
        setSortColumn(column.sortField)
        setSortDirection(sortDirection)
    }

    const handleAfterSubmit = useCallback(async () => {
        handleModalClose();
        await fetchData(currentPage);
    }, [fetchData, currentPage, handleModalClose]);

    const getModalTitle = mode => {
        switch (mode) {
            case 'create': return 'Tambah Produksi Telur';
            case 'update': return 'Ubah Produksi Telur';
            case 'delete': return 'Hapus Produksi Telur';
            default: return '';
        }
    };

    const columns = useMemo(() => [
        {
            name: 'Tanggal',
            selector: (row) => new Date(row.date).toLocaleDateString('en-GB'),
            sortable: true,
            sortField: 'date',
        },
        {
            name: 'Kandang',
            selector: (row) => row.store.name,
            sortable: true,
            sortField: 'store_id',
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
    ], []);

    return (
        <>
            <div className="flex items-center justify-between mb-2">
                <CreateButton onClick={() => handleModalOpen('create')}>
                    Tambah Produksi Telur
                </CreateButton>

                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <span className="font-bold">Pilih Store:</span>
                        <select
                            className="border rounded-md px-2 py-1 outline-none shadow-inner w-40"
                            onChange={e => setStore(e.target.value)}
                        >
                            <option value="">Pilih Store</option>
                            {stores.map(store => (
                                <option key={store.id} value={store.id}>{store.name}</option>
                            ))}
                        </select>
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
            </div>

            <Modal
                isOpen={modalState.isOpen}
                onClose={handleModalClose}
                title={getModalTitle(modalState.mode)}
                width={modalState.mode === 'delete' ? 'max-w-md' : 'max-w-2xl'}
            >
                <FormEggStock
                    onSubmit={handleAfterSubmit}
                    data={modalState.eggProduction}
                    dataStores={stores}
                    dataSizes={sizes}
                    mode={modalState.mode}
                    buttonText={getModalTitle(modalState.mode)}
                />
            </Modal>

            <DataTable
                columns={columns}
                data={data}
                customStyles={CustomStylesEggStock}
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

export default DataTableEggStock;