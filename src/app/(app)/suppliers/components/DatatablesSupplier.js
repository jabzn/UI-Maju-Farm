'use client'

import DataTable from "react-data-table-component";
import CustomStylesSupplier from "./customStylesSupplier";
import CreateButton from "@/components/CreateButton";
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "@/lib/axios";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { DebounceInput } from "react-debounce-input";
import ActionButtons from "@/components/ActionButtons";
import Modal from "../../components/Modal";
import FormSupplier from "./FormSupplier";

const INITIAL_SUPPLIER_STATE = {
    name: '',
    address: '',
    contact_person: '',
    phone: '',
    email: '',
    remark: '',
}

const DataTableSupplier = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState({
        isOpen: false,
        mode: '',
        supplier: INITIAL_SUPPLIER_STATE,
    })
    const [search, setSearch] = useState('');

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get('/api/suppliers');
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching items:', error);
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

    const handleModalOpen = useCallback((mode, supplier = INITIAL_SUPPLIER_STATE) => {
        setModalState({ isOpen: true, mode, supplier });
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
            case 'create': return 'Tambah Item';
            case 'update': return 'Ubah Item';
            case 'delete': return 'Hapus Item';
            default: return '';
        }
    };
    
    const columns = useMemo(() => [
        {
            name: 'Nama Supplier',
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
            name: 'Keterangan',
            selector: row => row.remark,
            cell: row => row.remark?.length > 10
                ? `${row.remark.slice(0, 10)}...`
                : row.remark,
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
                    Tambah Supplier
                </CreateButton>

                <div className="flex space-x-2">
                    <MagnifyingGlassIcon className="w-6" />
                    <DebounceInput
                        debounceTimeout={300}
                        placeholder="Cari Supplier..."
                        className="border rounded-lg px-2 py-1 outline-none shadow-inner"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Modal
                isOpen={modalState.isOpen}
                onClose={handleModalClose}
                title={getModalTitle(modalState.mode)}
                width="max-w-4xl"
            >
                <FormSupplier 
                    onSubmit={handleAfterSubmit}
                    data={modalState.supplier}
                    mode={modalState.mode}
                    buttonText={getModalTitle(modalState.mode)}
                />
            </Modal>
            
            <DataTable
                columns={columns}
                data={filteredData}
                customStyles={CustomStylesSupplier}
                pagination={10}
                progressPending={loading}
                highlightOnHover
            />
        </div>
    )
}

export default DataTableSupplier;