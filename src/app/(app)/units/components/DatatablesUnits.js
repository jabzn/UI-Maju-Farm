'use client'

import DataTable from "react-data-table-component";
import CustomStylesUnits from "./CustomStylesUnits";
import CreateButton from "@/components/CreateButton";
import { useEffect, useState, Fragment, useCallback, useMemo } from "react";
import axios from "@/lib/axios";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import FormUnit from "./FormUnit";

const DataTableUnit = () => {
    const initialUnit = {
        name: '',
    };

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('');
    const [unit, setUnit] = useState(initialUnit);

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get('/api/units');
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

    const openModal = (type = 'create', unit = initialUnit) => {
        setMode(type);
        setUnit(unit);
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
            name: 'No.',
            selector: (row, index) => index + 1,
        },
        {
            name: 'Nama Unit',
            selector: row => row.name,
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
    ]);

    return (
        <div>
            <CreateButton onClick={() => openModal()}>
                Tambah Satuan
            </CreateButton>
            
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
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-bold leading-6 text-gray-900 flex justify-between border-b-2 pb-2"
                                    >
                                        <span>{ mode === 'create' ? 'Tambah Satuan' : (mode === 'update' ? 'Ubah Satuan' : 'Hapus Satuan') }
                                        </span>
                                        <button className="hover:text-red-800">
                                            <XMarkIcon className="w-5" onClick={closeModal} />
                                        </button>
                                    </Dialog.Title>

                                    <div className="mt-4">
                                        <FormUnit 
                                            onSubmit={handleAfterSubmit} 
                                            mode={mode} 
                                            data={unit}
                                            buttonText={mode === 'create' ? 'Create' : (mode === 'update' ? 'Update' : 'Delete')} 
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
                data={data}
                customStyles={CustomStylesUnits}
                pagination={10}
                progressPending={loading}
            />
        </div>
    )
}

export default DataTableUnit;