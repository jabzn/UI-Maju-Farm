'use client'

import DataTable from "react-data-table-component";
import CustomStylesCategories from "./CustomStylesCategories";
import Form from "./FormCategory";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Dialog, Transition } from "@headlessui/react";
import { useState, useEffect, Fragment } from "react";
import axios from "@/lib/axios";
import CreateButton from "@/components/CreateButton";

const DataTableCategory = () => {
    const columns = [
        {
            name: 'Nama Kategory',
            selector: row => row.name,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="flex gap-2">
                    <button 
                        className="text-blue-500" 
                        onClick={() => handleUpdateCategory(row)}
                    >
                        <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button 
                        className="text-red-500"
                        onClick={() => handleDeleteCategory(row)}
                    >
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
            ),
        },
    ];

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [category, setCategory] = useState('');
    const [categoryId, setCategoryId] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('')
    const [title, setTitle] = useState(false);

    const closeModal = () => {
        setIsOpen(false);
        setCategory('');
    }

    const openModal = () => {
        setIsOpen(true);
        setMode('create');
    }

    const handleAfterSubmit = () => {
        fetchData();
        closeModal();
    }

    const handleUpdateCategory = (category) => {
        setMode('update');
        setIsOpen(true);
        setCategory(category.name);
        setCategoryId(category.id);
    }

    const handleDeleteCategory = (category) => {
        setMode('delete');
        setCategory(category.name);
        setCategoryId(category.id);
        setIsOpen(true);
    }

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/categories');
            setData(response.data);
        } catch (error) {
            console.log('error fetching data', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();

        if (mode === 'create') {
            setTitle('Tambah');
        } else if (mode === 'update') {
            setTitle('Edit');
        } else if (mode === 'delete') {
            setTitle('Hapus');
        }
    }, [mode]);

    return (
        <div>
            <CreateButton onClick={openModal}>
                Tambah Kategori
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
                                        className="text-lg font-bold leading-6 text-gray-900"
                                    >
                                        { title }
                                    </Dialog.Title>

                                    <div className="mt-4">
                                        <Form 
                                            onSubmit={handleAfterSubmit}
                                            categoryId={categoryId}
                                            updateName={category}
                                            mode={mode}
                                            buttonText={title}
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
                customStyles={CustomStylesCategories}
                progressPending={loading}
                pagination
                paginationPerPage={9}
            />
        </div>
    )
}

export default DataTableCategory;