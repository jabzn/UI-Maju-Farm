'use client';

import CreateButton from "@/components/CreateButton";
import axios from "@/lib/axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import ActionButtons from "@/components/ActionButtons";
import Modal from "../../components/Modal";
import CustomStylesSales from "./CustomStylesSales";
import { DebounceInput } from "react-debounce-input";
import FormSales from "./FormSales";

const INITIAL_SALES_STATE = {
    customer_id: '',
    date: '',
    reference_number: '',
    payment_method: '',
    status: '',
    size: '',
    quantity: '',
    paid_amount: '',
    notes: '',
};

const paginationComponentOptions = {
    noRowsPerPage: true,
}

const fields = [
    { value: 'reference_number', label: 'Ref' },
    { value: 'customer_name', label: 'Customer' },
    { value: 'size', label: 'Size' },
]

const DataTableSales = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortColumn, setSortColumn] = useState()
    const [sortDirection, setSortDirection] = useState()
    const [search, setSearch] = useState('');
    const [field, setField] = useState([]);
    const [modalState, setModalState] = useState({
        isOpen: false,
        mode: '',
        sales: INITIAL_SALES_STATE,
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
            const [response, customers, sizes] = await Promise.all([
                axios.get('/api/sales', { params: {
                    field: field,
                    search: search,
                    start_date: startDate,
                    end_date: endDate,
                    page: page,
                    per_page: perPage,
                    sortColumn: sortColumn,
                    sortDirection: sortDirection,
                }}),
                axios.get('/api/customers'),
                axios.get('/api/sizes', {
                    params: {
                        startDate: startDate,
                        endDate: endDate,
                    }
                }),
            ]);
            setData(response.data.data);
            setTotalRows(response.data.total);
            setCustomers(customers.data);
            setSizes(sizes.data);
        } catch (error) {
            console.error('Error fetching Data:', error);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate, search, perPage])

    useEffect(() => {
        fetchData(currentPage, sortColumn, sortDirection);
    }, [fetchData, currentPage, sortColumn, sortDirection]);

    const handleModalOpen = useCallback((mode, sales = {
        ...INITIAL_SALES_STATE,
        date: new Date().toISOString().slice(0, 10),
    }) => {
        setModalState({ isOpen: true, mode, sales });
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
            case 'create': return 'Tambah Penjualan';
            case 'update': return 'Ubah Penjualan';
            case 'delete': return 'Hapus Penjualan';
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
            name: 'REF',
            selector: (row) => row.reference_number,
            sortable: true,
            sortField: 'reference_number',
        },
        {
            name: 'Customer',
            selector: (row) => row.customer.name,
            sortable: true,
            sortField: 'customer',
        },
        {
            name: 'Payment',
            selector: (row) => row.payment_method.toUpperCase(),
            sortable: true,
            sortField: 'payment_method',
        },
        {
            name: 'Status',
            selector: (row) => row.status.toUpperCase(),
            sortable: true,
            sortField: 'status',
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
                    Tambah Penjualan
                </CreateButton>

                <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                        <select
                            className="border rounded-l-md px-2 py-1 outline-none shadow-inner w-40"
                            onChange={e => setField(e.target.value)}
                        >
                            <option value=""></option>
                            {fields.map(field => (
                                <option key={field.value} value={field.value}>{field.label}</option>
                            ))}
                        </select>

                        <div>
                            <DebounceInput
                                debounceTimeout={300}
                                className="border rounded-r-md px-2 py-1 outline-none shadow-inner w-40"
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
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
                width={modalState.mode === 'delete' ? 'max-w-md' : 'max-w-4xl'}
            >
                <FormSales
                    onSubmit={handleAfterSubmit}
                    data={modalState.sales}
                    dataCustomers={customers}
                    dataSizes={sizes}
                    mode={modalState.mode}
                    buttonText={getModalTitle(modalState.mode)}
                />
            </Modal>

            <DataTable
                columns={columns}
                data={data}
                customStyles={CustomStylesSales}
                pagination
                paginationServer
                paginationComponentOptions={paginationComponentOptions}
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

export default DataTableSales;