'use client'

import DataTable from "react-data-table-component";
import CustomStylesSupplier from "./customStylesSupplier";
import CreateButton from "@/components/CreateButton";
import { useEffect, useState, Fragment, useCallback, useMemo } from "react";
import axios from "@/lib/axios";
import { Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import FormSupplier from "./FormSupplier";
import { DebounceInput } from "react-debounce-input";

const DataTableSupplier = () => {
    const initialSupplierState = {
        name: '',
        address: '',
        contact_person: '',
        phone: '',
        email: '',
        remark: '',
    }
    
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('');
    const [search, setSearch] = useState('');
    const [supplier, setSupplier] = useState(initialSupplierState)

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get('/api/suppliers');
            setData(response.data);
        } catch (error) {
            console.log('error fetching data', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredData = useMemo(() => {
        const lowerSearch = search.toLowerCase();
        return data.filter(({ name, address, contact_person, phone }) => 
            (name ? name.toLowerCase().includes(lowerSearch) : false) ||
            (address ? address.toLowerCase().includes(lowerSearch) : false) ||
            (contact_person ? contact_person.toLowerCase().includes(lowerSearch) : false) ||
            (phone ? phone.toLowerCase().includes(lowerSearch) : false)
        );
    }, [data, search]);

    const openModal = (type = 'create', supplierData = initialSupplierState) => {
        setMode(type);
        setSupplier(supplierData);
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }

    const handleAfterSubmit = () => {
        fetchData();
        closeModal();
    }
    
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
            name: 'Actions',
            cell: (row) => (
                <div className="flex gap-2">
                    <button 
                        className="bg-blue-500 text-white font-bold p-1 rounded-sm shadow-inner" 
                        onClick={() => openModal('update', row)}
                    >
                        Update
                    </button>
                    <button 
                        className="bg-red-500 text-white font-bold p-1 rounded-sm shadow-inner"
                        onClick={() => openModal('delete', row)}
                    >
                        Hapus
                    </button>
                </div>
            ),
        }
    ], []);

    return (
        <div>
            <div className="flex justify-between items-center">
                <CreateButton onClick={() => openModal('create')}>
                    Tambah Supplier
                </CreateButton>

                <div className="flex space-x-2">
                    <MagnifyingGlassIcon
                        className="w-6"
                    />

                    <DebounceInput
                        debounceTimeout={300}
                        placeholder="Cari Supplier..."
                        className="border rounded-lg px-2 py-1 outline-none"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child 
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className={`${mode === 'delete' ? 'w-full max-w-md' : 'w-full max-w-4xl'} transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}>

                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-bold leading-6 text-gray-900 flex justify-between border-b border-b-2 pb-2"
                                    >
                                        <span>
                                            {mode === 'create' 
                                                ? 'Tambah' 
                                                : mode === 'update' 
                                                    ? 'Ubah' 
                                                    : 'Hapus'}
                                        </span>
                                        <button className="hover:text-red-800">
                                            <XMarkIcon className="w-5" onClick={closeModal} />
                                        </button>
                                    </Dialog.Title>

                                    <div className="mt-4">
                                        <FormSupplier
                                            mode={mode}
                                            data={supplier}
                                            onSubmit={handleAfterSubmit}
                                            buttonText={
                                                mode === 'create' 
                                                ? 'Tambah' 
                                                : mode === 'update' 
                                                    ? 'Ubah' 
                                                    : 'Hapus'}
                                        />
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            
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