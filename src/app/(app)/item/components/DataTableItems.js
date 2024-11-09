'use client'

import { useEffect, useState, useCallback, useMemo } from "react";
import DataTable from "react-data-table-component";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { DebounceInput } from "react-debounce-input";
import Link from "next/link";
import axios from "@/lib/axios";
import CreateButton from "@/components/CreateButton";
import CustomStylesItem from "./CustomStylesItem";
import ModalItem from "./ModalforItem";
import ActionButtons from "@/components/ActionButtons";
import FormItem from "./FormItem";

const INITIAL_ITEM_STATE = {
    code: '',
    name: '',
    category_id: '',
    unit_id: '',
    price: '',
    description: ''
};

const DataTableItem = () => {
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState({ 
        isOpen: false, 
        mode: '', 
        item: INITIAL_ITEM_STATE 
    });
    const [search, setSearch] = useState('');

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get('/api/items');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    }, []);

    const fetchCategoriesAndUnits = useCallback(async () => {
        try {
            const [categoriesRes, unitsRes] = await Promise.all([
                axios.get('/api/categories'),
                axios.get('/api/units'),
            ]);
            setCategories(categoriesRes.data);
            setUnits(unitsRes.data);
        } catch (error) {
            console.error('Error fetching categories and units:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        Promise.all([fetchData(), fetchCategoriesAndUnits()]);
    }, [fetchData, fetchCategoriesAndUnits]);

    const filteredData = useMemo(() => {
        const lowerSearch = search.toLowerCase().trim();
        return lowerSearch
            ? data.filter(({ name }) => name?.toLowerCase().includes(lowerSearch))
            : data;
    }, [data, search]);

    const handleModalOpen = useCallback((mode, item = INITIAL_ITEM_STATE) => {
        setModalState({ isOpen: true, mode, item });
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
            name: 'Kode Item',
            selector: row => row.code,
            sortable: true,
        },
        {
            name: 'Nama Item',
            cell: row => (
                <Link href={`/item/${row.id}`}>
                    <span className="hover:text-blue-500">{row.name}</span>
                </Link>
            ),
            sortable: true,
        },
        {
            name: 'Kategori Item',
            selector: row => row.category.name,
            sortable: true,
        },
        {
            name: 'UOM',
            selector: row => row.unit.name,
        },
        {
            name: 'Harga',
            selector: row => row.price,
            format: row => row.price?.toLocaleString('id-ID'),
        },
        {
            name: 'Keterangan',
            selector: row => row.description,
            cell: row => row.description?.length > 10 
                ? `${row.description.slice(0, 10)}...` 
                : row.description,
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
        <div>
            <div className="flex justify-between items-center mb-4">
                <CreateButton onClick={() => handleModalOpen('create')}>
                    Tambah Item
                </CreateButton>

                <div className="flex items-center space-x-2">
                    <MagnifyingGlassIcon className="w-6" />
                    <DebounceInput
                        debounceTimeout={300}
                        placeholder="Cari Item..."
                        className="border rounded-lg px-2 py-1 outline-none shadow-inner"
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>
            
            <ModalItem
                isOpen={modalState.isOpen}
                onClose={handleModalClose}
                title={getModalTitle(modalState.mode)}
            >
                <FormItem
                    onSubmit={handleAfterSubmit}
                    data={modalState.item}
                    dataCategories={categories}
                    dataUnits={units}
                    mode={modalState.mode}
                    buttonText={getModalTitle(modalState.mode)}
                />
            </ModalItem>
            
            <DataTable
                columns={columns}
                data={filteredData}
                customStyles={CustomStylesItem}
                pagination
                paginationPerPage={10}
                progressPending={loading}
                highlightOnHover
            />
        </div>
    );
};

export default DataTableItem;