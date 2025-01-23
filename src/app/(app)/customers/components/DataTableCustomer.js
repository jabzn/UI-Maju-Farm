'use client'

import DataTable from "react-data-table-component";
import CreateButton from "@/components/CreateButton";
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "@/lib/axios";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { DebounceInput } from "react-debounce-input";
import ActionButtons from "@/components/ActionButtons";
import Modal from "../../components/Modal";
import CustomStylesCustomer from "./CustomStylesCustomer";
import FormCustomer from "./FormCustomer";

const INITIAL_CUSTOMER_STATE = {
    name: '',
    address: '',
    contact_person: '',
    email: '',
    phone: '',
    remark: '',
}

const DataTableCustomer = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState({
        isOpen: false,
        mode: '',
        supplier: INITIAL_CUSTOMER_STATE,
    })
    const [search, setSearch] = useState('');

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get('/api/customers');
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredData = useMemo(() => {
        const lowerSearch = search.toLowerCase().trim();
        return lowerSearch
            ? data.filter(({ name }) => name?.toLowerCase().includes(lowerSearch))
            : data;
    }, [data, search]);

    const handleModalOpen = useCallback((mode, customer = INITIAL_CUSTOMER_STATE) => {
        setModalState({ isOpen: true, mode, customer });
    }, []);

    const handleModalClose = useCallback(() => {
        setModalState(prev => ({ ...prev, isOpen: false }));
    }, []);

    const handleAfterSubmit = useCallback(async () => {
        handleModalClose();
        await fetchData();
    }, [fetchData, handleModalClose]);

    const getModalTitle = mode => {
        switch (mode) {
            case 'create': return 'Tambah Customer';
            case 'update': return 'Ubah Customer';
            case 'delete': return 'Hapus Customer';
            default: return '';
        }
    };
    
    const columns = useMemo(() => [
        {
            name: 'Nama Customer',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Alamat',
            selector: row => row.address,
            sortable: true,
        },
        {
            name: 'Contact Person',
            selector: row => row.contact_person,
            sortable: true,
        },
        {
            name: 'No. Telepon',
            selector: row => row.phone,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <ActionButtons
                    onUpdate={() => handleModalOpen('update', row)}
                    onDelete={() => handleModalOpen('delete', row)}
                    row={row}
                />
            ),
        }
    ], []);

    return (
        <div>
            <div className="flex justify-between items-center">
                <CreateButton onClick={() => handleModalOpen('create')}>
                    Tambah Customer
                </CreateButton>

                <div className="flex space-x-2">
                    <MagnifyingGlassIcon className="w-6" />
                    <DebounceInput
                        debounceTimeout={300}
                        placeholder="Cari Customer..."
                        className="border rounded-lg px-2 py-1 outline-none shadow-inner"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Modal
                isOpen={modalState.isOpen}
                onClose={handleModalClose}
                title={getModalTitle(modalState.mode)}
                width="max-w-md"
            >
                <FormCustomer
                    onSubmit={handleAfterSubmit}
                    data={modalState.customer}
                    mode={modalState.mode}
                    buttonText={getModalTitle(modalState.mode)}
                />
            </Modal>
            
            <DataTable
                columns={columns}
                data={filteredData}
                customStyles={CustomStylesCustomer}
                pagination={10}
                progressPending={loading}
                highlightOnHover
            />
        </div>
    )
}

export default DataTableCustomer;