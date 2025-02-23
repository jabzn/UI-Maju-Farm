'use client';

import { useCallback, useState } from "react";
import { DeleteConfirmation, InputField, SelectField, SubmitButton } from "./FieldForm";
import axios from "@/lib/axios";

const FormItemId = ({ onSubmit, data, dataUnits, mode, buttonText }) => {
    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when field is modified
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    }, [errors]);

    const isFormValid = useCallback(() => {
        if (mode === 'delete') return true;
        return formData.unit_id && formData.quantity;
    }, [formData, mode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const endpoint = '/api/item/' + data.item_id + '/conversion' + (mode !== 'create' ? `/${data.id}` : '');
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
                console.error(`Error ${mode}ing uom:`, responseData?.message || error.message);
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
            return <DeleteConfirmation />;;
        }

        return (
            <div className="w-full space-y-4">
                <SelectField
                    label="UOM"
                    name="unit_id"
                    value={formData.unit_id}
                    options={dataUnits}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="Pilih Unit"
                    error={errors.unit_id?.[0]}
                />
                
                <InputField
                    label="Quantity Conversion"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    disabled={isLoading}
                    error={errors.quantity?.[0]}
                    required
                    autoComplete="off"
                    placeholder="Kuantitas Konversi"
                />
            </div>
        );
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

export default FormItemId;