'use client';

import { useCallback, useState } from "react";
import { DeleteConfirmation, InputField, SelectField, SubmitButton } from "../../components/FieldForm";
import axios from "@/lib/axios";

const FormEggStock = ({ onSubmit, data, dataStores, mode, buttonText }) => {
    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

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

    const calculateRackEggs = useCallback((e) => {
        const quantityEgg = e.target.value;
        const total = parseFloat(quantityEgg / 30).toFixed(2);

        setFormData(prev => ({
            ...prev,
            quantity: quantityEgg,
            rack: total,
        }))
    }, [formData.quantity, formData.rack])

    const isFormValid = useCallback(() => {
        if (mode === 'delete') return true;
        return formData.date && formData.store_id && formData.quantity;
    }, [formData, mode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const endpoint = '/api/eggProduction' + (mode !== 'create' ? `/${data.id}` : '');
            const method = {
                'create': 'post',
                'update': 'put',
                'delete': 'delete'
            }[mode];

            await axios[method](endpoint, formData);
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

    const renderForm = () => {
        if (mode === 'delete') {
            return <DeleteConfirmation label={formData.date + ' ' + formData.store.name} />;
        }

        return (
            <div className="w-full space-y-4">
                <InputField
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

                <InputField
                    label="Jumlah Butir Telur"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={calculateRackEggs}
                    disabled={isLoading}
                    error={errors.quantity?.[0]}
                    autocomplete="off"
                    required
                />

                <InputField
                    label="Jumlah Telur Rusak"
                    name="broken"
                    type="number"
                    value={formData.broken}
                    onChange={handleChange}
                    disabled={isLoading}
                    error={errors.broken?.[0]}
                    autocomplete="off"
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