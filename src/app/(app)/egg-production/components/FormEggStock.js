'use client';

import { useCallback, useMemo, useState } from "react";
import { DeleteConfirmation, InputField, SelectField, SubmitButton } from "../../components/FieldForm";
import axios from "@/lib/axios";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import DataTable from "react-data-table-component";
import CustomStylesEggForm from "./CustomStylesEggForm";

const INITIAL_EGG_IN = {
    quantity: '',
    sizeName: '',
    size: [],
}

const FormEggStock = ({ onSubmit, data, dataStores, dataSizes, mode, buttonText }) => {
    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [size, setSize] = useState('');
    const [eggIn, setEggIn] = useState(INITIAL_EGG_IN);
    const [eggMovements, setEggMovements] = useState(data.egg_movements || []);

    const handleChangeSize = useCallback((e) => {
        const selectedSize = e.target.value;
        const size = dataSizes.find(size => size.id === parseInt(selectedSize));

        setSize(size);
        setEggIn(prev => ({
            ...prev,
            sizeName: selectedSize,
            size: size,
        }))
    });

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    }, [errors]);

    const isFormValid = useCallback(() => {
        if (mode === 'delete') return true;
        return formData.date && formData.store_id && eggMovements.length > 0;
    }, [formData, mode, eggMovements]);

    const isDisableAddItem = useMemo(() => {
        return !eggIn.quantity || !eggIn.sizeName;
    }, [eggIn]);

    const handleAddEgg = useCallback(() => {
        if (isDisableAddItem) return;

        setEggMovements(prev => {
            const newEggList = {
                ...eggIn,
                id: prev.length ? Math.max(...prev.map(eggs => eggs.id)) + 1 : 1
            };
            return [...prev, newEggList];
        });
        setEggIn(INITIAL_EGG_IN);
    }, [eggIn, isDisableAddItem, eggMovements]);

    const handleEggInput = useCallback((e) => {
        const { name, value } = e.target;
        setEggIn(prev => ({
            ...prev,
            [name]: value
        }));
    }, [eggMovements]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const submitData = {
                ...formData,
                egg_movements: eggMovements.map(eggs => {
                    return {
                        type: 'production',
                        quantity: eggs.quantity,
                        size_id: eggs.size.id,
                    }
                })
            }

            const endpoint = '/api/eggProduction' + (mode !== 'create' ? `/${data.id}` : '');
            const method = {
                'create': 'post',
                'update': 'put',
                'delete': 'delete'
            }[mode];

            await axios[method](endpoint, submitData);
            onSubmit();
        } catch (error) {
            const responseData = error.response?.data;
            
            if (error.response?.status === 422) {
                setErrors(responseData.errors);
            } else {
                console.error(`Error ${mode}ing production:`, responseData?.message || error.message);
                setErrors({ 
                    general: 'An error occurred while processing your request.'
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const columns = useMemo(() => [
        {
            name: 'No',
            selector: (row, index) => index + 1,
        },
        {
            name: 'Telur (Rak)',
            selector: row => row.quantity,
            sortable: true,
        },
        {
            name: 'Size',
            selector: row => row.size.name,
            sortable: true,
        },
        {
            name: 'Action',
            cell: row => (
                <button 
                    className="bg-red-500 text-white font-bold p-1 rounded-sm shadow-inner hover:bg-red-900" 
                    type="button"
                    onClick={() => setEggMovements(prev => prev.filter(eggs => eggs.id !== row.id))}
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            ),
        }
    ], []);

    const renderForm = () => {
        if (mode === 'delete') {
            return <DeleteConfirmation label={formData.date + ' ' + formData.store.name} />;
        }

        return (
            <div className="w-full space-y-4">
                <div className="flex items-center justify-center space-x-2">
                    <InputField
                        className="w-full"
                        label="Tanggal"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        disabled={isLoading}
                        error={errors.date?.[0]}
                        required
                    />

                    <SelectField
                        className="w-full"
                        label="Store"
                        name="store_id"
                        value={formData.store_id}
                        options={dataStores}
                        onChange={handleChange}
                        disabled={isLoading}
                        placeholder="Pilih Store"
                        error={errors.store_id?.[0]}
                        required
                    />
                </div>

                <hr className="my-4 border-gray-300" />

                <div className="flex items-center justify-center gap-2">
                    <InputField
                        className="w-full"
                        label="Jumlah Rak Telur"
                        name="quantity"
                        type="number"
                        value={eggIn.quantity}
                        onChange={handleEggInput}
                        disabled={isLoading}
                        error={errors.quantity?.[0]}
                        autoComplete="off"
                    />

                    <SelectField
                        className="w-full"
                        label="Size Telur"
                        name="size_id"
                        value={eggIn.sizeName}
                        options={dataSizes}
                        onChange={handleChangeSize}
                        disabled={isLoading}
                        error={errors.size_id?.[0]}
                    />

                    <button 
                        className={`flex bg-blue-500 px-2 py-2 items-center self-bottom rounded ${isDisableAddItem ? 'opacity-50 bg-gray-500' : ''}`}
                        onClick={handleAddEgg}
                        disabled={isDisableAddItem}
                        type="button"
                    >
                        <PlusIcon className="w-5 h-5 text-white" />
                    </button>
                </div>

                <DataTable
                    columns={columns}
                    data={eggMovements}
                    customStyles={CustomStylesEggForm}
                    fixedHeader
                    highlightOnHover
                />
            </div>
        )
    }

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {errors.general && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {errors.general}
                </div>
            )}
            
            {renderForm()}

            <div className="flex justify-end space-x-3">
                <SubmitButton
                    isValid={isFormValid()}
                    isLoading={isLoading}
                    mode={mode}
                    buttonText={buttonText}
                />
            </div>
        </form>
    )
}

export default FormEggStock;