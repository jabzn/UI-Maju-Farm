'use client';

import ActionButtons from "@/components/ActionButtons";
import CreateButton from "@/components/CreateButton";
import axios from "@/lib/axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import CustomStylesStore from "./customStyles";
import Modal from "../../components/Modal";
import FormStore from "./FormStore";

const INITIAL_STORE_STATE = {
    name: '',
    type: '',
}
const DataTableStore = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState({
        isOpen: false,
        mode: '',
        supplier: INITIAL_STORE_STATE,
    });

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get('/api/stores');
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleModalOpen = useCallback((mode, store = INITIAL_STORE_STATE) => {
        setModalState({ isOpen: true, mode, store });
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
            case 'create': return 'Tambah Store';
            case 'update': return 'Update Store';
            case 'delete': return 'Hapus Store';
            default: return '';
        }
    };

    const columns = useMemo(() => [
        {
            name: 'Nama Store',
            selector: row => row.name,
        },
        {
            name: 'Type',
            selector: row => row.type,
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
            <CreateButton onClick={() => handleModalOpen('create')}>
                Tambah Store
            </CreateButton>

            <Modal
                isOpen={modalState.isOpen}
                onClose={handleModalClose}
                title={getModalTitle(modalState.mode)}
                width="max-w-lg"
            >
                <FormStore
                    onSubmit={handleAfterSubmit}
                    data={modalState.store}
                    mode={modalState.mode}
                    buttonText={getModalTitle(modalState.mode)}
                />
            </Modal>

            <DataTable
                columns={columns}
                data={data}
                customStyles={CustomStylesStore}
                pagination={10}
                progressPending={loading}
                highlightOnHover
            />
        </div>
    )
}

export default DataTableStore;