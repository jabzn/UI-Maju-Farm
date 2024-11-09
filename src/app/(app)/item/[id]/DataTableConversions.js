'use client';

import axios from "@/lib/axios";
import CustomStylesConversion from "./CustomStylesConversion";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import CreateButton from "@/components/CreateButton";
import Modal from "../../components/Modal";
import FormItemId from "./FormItemId";
import ActionButtons from "@/components/ActionButtons";

const DataTableConversion = ({ id }) => {
    const INITIAL_UOM_STATE = {
        item_id: id,
        unit_id: '',
        quantity: '',
    };
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [units, setUnits] = useState([]);
    const [modalState, setModalState] = useState({
        isOpen: false,
        mode: '',
        uom: INITIAL_UOM_STATE,
    });

    const fetchData = useCallback(async () => {
        try {
            const [dataRes, unitsRes] = await Promise.all([
                axios.get(`/api/item/${id}`),
                axios.get('/api/units'),
            ])
            setData(dataRes.data);
            setUnits(unitsRes.data);
        } catch (error) {
            console.error('Error fetching categories and units:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleModalOpen = useCallback((mode, uom = INITIAL_UOM_STATE) => {
        setModalState({ isOpen: true, mode, uom });
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
            case 'create': return 'Tambah UOM';
            case 'update': return 'Ubah UOM';
            case 'delete': return 'Hapus UOM';
            default: return '';
        }
    };

    const columns = useMemo(() => [
        {
            name: 'UOM',
            selector: row => row.unit.name,
        },
        {
            name: 'Conversion',
            selector: row => row.quantity,
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
        <div className="space-y-2">
            <h1 className="text-4xl capitalize mb-1">
                {data.name}
            </h1>
            <span className="text-lg text-gray-500">
                Base UOM: <strong>{data.unit?.name}</strong>
            </span>

            <CreateButton onClick={() => handleModalOpen('create')}>
                Tambah UOM
            </CreateButton>

            <Modal
                isOpen={modalState.isOpen}
                onClose={handleModalClose}
                title={getModalTitle(modalState.mode)}
            >
                <FormItemId
                    onSubmit={handleAfterSubmit}
                    data={modalState.uom}
                    dataUnits={units}
                    mode={modalState.mode}
                    buttonText={getModalTitle(modalState.mode)}
                />
            </Modal>

            <DataTable
                columns={columns}
                data={data.conversions}
                customStyles={CustomStylesConversion}
                pagination
                paginationPerPage={10}
                progressPending={loading}
                highlightOnHover
            />
        </div>
    )
}

export default DataTableConversion;