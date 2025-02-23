'use client';

import CreateButton from "@/components/CreateButton";
import axios from "@/lib/axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import CustomStylesStoreStock from "../../store-stock/components/CustomStylesStoreStock";
import Modal from "../../components/Modal";
import FormRequisition from "./FormRequisition";
import ActionButtons from "@/components/ActionButtons";

const INITIAL_STORE_REQUISITION_STATE = {
    reference_number: '',
    date: '',
    store_id: '',
    remark: '',
};

const DataTableStoreRequisition = () => {
    const [data, setData] = useState([]);
    const [stores, setStores] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState();
    const [sortDirection, setSortDirection] = useState();
    const [modalState, setModalState] = useState({
        isOpen: false,
        mode: '',
        storeRequisition: INITIAL_STORE_REQUISITION_STATE,
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
            const [response, stores, items] = await Promise.all([
                axios.get('/api/storeRequisitions', { params: { 
                    start_date: startDate, 
                    end_date: endDate,
                    page: page,
                    per_page: perPage, 
                    sortColumn: sortColumn,
                    sortDirection: sortDirection,
                }}),
                axios.get('/api/stores'),
                axios.get('/api/items'),
            ]);
            setData(response.data.data);
            setStores(stores.data);
            setItems(items.data);
            setTotalRows(response.data.total);
        } catch (error) {
            console.error('Error fetching Store Stock:', error);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, perPage]);

    useEffect(() => {
        fetchData(currentPage, sortColumn, sortDirection);
    }, [fetchData, currentPage, sortColumn, sortDirection]);

    const handleModalOpen = useCallback((mode, storeRequisition = {
        ...INITIAL_STORE_REQUISITION_STATE,
        date: new Date().toISOString().slice(0, 10)
    }) => {
        setModalState({ isOpen: true, mode, storeRequisition });
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
            case 'create': return 'Tambah SR';
            case 'update': return 'Ubah SR';
            case 'delete': return 'Hapus SR';
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
            sortable: true,
            sortField: 'date',
        },
        {
            name: 'Store',
            selector: row => row.store.name,
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
            <div className="flex items-center justify-between">
                <CreateButton onClick={() => handleModalOpen('create')}>
                    Tambah SR
                </CreateButton>

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
                isOpen={modalState.isOpen}
                onClose={handleModalClose}
                title={getModalTitle(modalState.mode)}
                width={'max-w-4xl'}
            >
                <FormRequisition 
                    onSubmit={handleAfterSubmit}
                    data={modalState.storeRequisition}
                    dataStores={stores}
                    dataItems={items}
                    mode={modalState.mode}
                    buttonText={getModalTitle(modalState.mode)}
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
                sortServer
                onSort={handleSortChange}
                progressPending={loading}
                onRowClicked={row => handleModalOpen('update', row)}
                highlightOnHover
            />
        </>
    )
}

export default DataTableStoreRequisition;