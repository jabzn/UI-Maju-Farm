'use client';

import { useCallback, useMemo, useState } from "react";
import { CurrentStock, DeleteConfirmation, InputField, SelectField, SubmitButton } from "../../components/FieldForm";
import axios from "@/lib/axios";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import DataTable from "react-data-table-component";
import CustomStylesFormSales from "./CustomStylesFormSales";

const paymentMethod = [
    { id: 'Tunai', name: 'Tunai' },
    { id: 'Kredit', name: 'Kredit' },
]

const INITIAL_EGG_OUT = {
    quantity: '',
    sizeName: '',
    size: [],
    current_stock: '',
    price: '',
    paid_amount: '',
}

const FormSales = ({ onSubmit, data, dataCustomers, dataSizes, mode, buttonText }) => {
    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState({});
    const [eggOut, setEggOut] = useState(INITIAL_EGG_OUT);
    const [size, setSize] = useState('');
    const [eggMovements, setEggMovements] = useState(data.egg_movements || []);
    const [isLoading, setIsLoading] = useState(false);

    const handleChangeSize = useCallback((e) => {
        const selectedSize = e.target.value;
        const size = dataSizes.find(size => size.id === parseInt(selectedSize));
        const currentStock = size?.current_stock || 0;
        const totalStockMovement = eggMovements
            .filter(movement => movement.size.id === size.id)
            .reduce((accumulator, movement) => {
                return accumulator + parseInt(movement.quantity);
            }, 0);
        let latestStock = currentStock - totalStockMovement;

        setSize(size);
        setEggOut(prev => ({
            ...prev,
            sizeName: selectedSize,
            size: size,
            current_stock: latestStock,
        }))
    }, [eggOut.size]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null,
            }));
        }
    }, [errors]);

    const handleQuantityChange = useCallback((e) => {
        const quantity = e.target.value;
        const price = eggOut.price;
        let paidAmount = '';

        if (price !== '' && !isNaN(price)) {
            const priceNum = Number(price);
            paidAmount = quantity * priceNum;
        }
        
        setEggOut(prev => ({ 
            ...prev,
            quantity: quantity,
            paid_amount: paidAmount,
        }));
    }, [eggOut.quantity]);

    const handlePriceChange = useCallback((e) => {
        const price = e.target.value;
        const quantity = eggOut.quantity;
        let paidAmount = '';

        if (quantity !== '' && !isNaN(quantity)) {
            const quantityNum = Number(quantity);
            paidAmount = price * quantityNum;
        }

        setEggOut(prev => ({
            ...prev,
            price: price,
            paid_amount: paidAmount,
        }));
    }, [eggOut.price]);

    const handlePaidAmountChange = useCallback((e) => {
        const paid_amount = e.target.value;
        const quantity = eggOut.quantity;
        let price = '';

        if (quantity !== '' && !isNaN(quantity)) {
            const quantityNum = Number(quantity);
            price = paid_amount / quantityNum;
        }

        setEggOut(prev => ({
            ...prev,
            price: price,
            paid_amount: paid_amount,
        }));
    }, [eggOut.paid_amount]);

    const isDisableAddItem = useMemo(() => {
        return !eggOut.quantity || !eggOut.sizeName || !eggOut.price || !eggOut.paid_amount;
    }, [eggOut]);

    const handleAddEgg = useCallback(() => {
        if (isDisableAddItem) return;

        if (eggOut.current_stock < eggOut.quantity) {
            alert('Stock Telur tidak cukup!');
            return;
        }

        setEggMovements(prev => {
            const newEggList = {
                ...eggOut,
                id: prev.length ? Math.max(...prev.map(eggs => eggs.id)) + 1 : 1
            };
            return [...prev, newEggList];
        });
        setEggOut(INITIAL_EGG_OUT);
    }, [eggOut, isDisableAddItem, eggMovements]);

    const isFormValid = useCallback(() => {
        if (mode === 'delete') return true;
        return formData.customer_id && formData.date && formData.payment_method && eggMovements.length > 0;
    }, [formData, mode, eggMovements]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const submitData = {
                ...formData,
                egg_movements: eggMovements.map(eggs => {
                    return {
                        type: 'sale',
                        quantity: eggs.quantity,
                        size_id: eggs.size.id,
                        price: eggs.price,
                        paid_amount: eggs.paid_amount,
                    }
                })
            }

            const endpoint = '/api/sale' + (mode !== 'create' ? `/${formData.id}` : '');
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
                console.error(`Error ${mode}ing sale:`, responseData?.message || error.message);
                setErrors({ 
                    general: 'An error occurred while processing your request.'
                });
            }
        } finally {
            setIsLoading(false);
        }
    }

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
            name: 'Harga',
            selector: row => row.price,
            format: row => row.price?.toLocaleString('id-ID'),
            sortable: true,
        },
        {
            name: 'Total',
            selector: row => row.paid_amount,
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
            return <DeleteConfirmation label={formData.date + ' ' + formData.customer.name} />;
        }

        return (
            <div className="w-full space-y-2">
                <div className="w-full flex justify-between gap-4">
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
                        label="Customer"
                        name="customer_id"
                        value={formData.customer_id}
                        options={dataCustomers}
                        onChange={handleChange}
                        disabled={isLoading}
                        error={errors.customer_id?.[0]}
                        required
                    />

                    <SelectField
                        className="w-full"
                        label="Metode Pembayaran"
                        name="payment_method"
                        value={formData.payment_method}
                        options={paymentMethod}
                        onChange={handleChange}
                        disabled={isLoading}
                        error={errors.payment_method?.[0]}
                        required
                    />
                </div>

                <hr className="my-4 border-gray-300" />

                <div className="w-full flex items-center justify-center gap-4">
                    <SelectField
                        className="w-full"
                        label="Size Telur"
                        name="size_id"
                        value={eggOut.sizeName}
                        options={dataSizes}
                        onChange={handleChangeSize}
                        disabled={isLoading}
                        error={errors.size_id?.[0]}
                    />

                    <InputField
                        className="w-full"
                        label="Jumlah Rak Telur"
                        name="quantity"
                        type="number"
                        value={eggOut.quantity}
                        onChange={handleQuantityChange}
                        disabled={isLoading}
                        error={errors.quantity?.[0]}
                        autoComplete="off"
                    />

                    <InputField
                        className="w-full"
                        label="Harga"
                        name="price"
                        type="number"
                        value={eggOut.price}
                        onChange={handlePriceChange}
                        disabled={isLoading}
                        error={errors.price?.[0]}
                        autoComplete="off"
                    />

                    <InputField
                        className="w-full"
                        label="Total"
                        name="paid_amount"
                        type="number"
                        value={eggOut.paid_amount}
                        onChange={handlePaidAmountChange}
                        disabled={isLoading}
                        error={errors.paid_amount?.[0]}
                        autoComplete="off"
                    />

                    <CurrentStock
                        className="w-full"
                        label="Stock"
                        name="current_stock"
                        type="number"
                        value={eggOut.current_stock}
                        disabled={true}
                        error={errors.current_stock?.[0]}
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
                    customStyles={CustomStylesFormSales}
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

export default FormSales;