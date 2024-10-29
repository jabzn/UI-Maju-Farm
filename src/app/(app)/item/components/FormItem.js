'use client'

import { useEffect, useState, useCallback, memo } from "react";
import axios from "@/lib/axios";
import { 
    DeleteConfirmation, 
    InputField, 
    SelectField, 
    SubmitButton, 
    TextArea 
} from "./FieldForm";

const FormItem = ({ onSubmit, data, dataCategories, dataUnits, mode, buttonText }) => {
    const [formData, setFormData] = useState(data);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setFormData(data);
    }, [data]);
    
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
        return formData.name && formData.code && formData.category_id && formData.unit_id;
    }, [formData, mode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const endpoint = '/api/item' + (mode !== 'create' ? `/${data.id}` : '');
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
                console.error(`Error ${mode}ing item:`, responseData?.message || error.message);
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
            return <DeleteConfirmation itemName={formData.name} />;
        }

        return (
            <div className="w-full space-y-4">
                <InputField
                    label="Kode Item"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    disabled={isLoading}
                    error={errors.code?.[0]}
                    required
                    placeholder="Kode Item"
                />

                <InputField
                    label="Nama Item"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    error={errors.name?.[0]}
                    required
                    placeholder="Nama Item"
                />

                <SelectField
                    label="Kategori Item"
                    name="category_id"
                    value={formData.category_id}
                    options={dataCategories}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="Pilih Kategori"
                    error={errors.category_id?.[0]}
                />

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
                    label="Harga"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    disabled={isLoading}
                    error={errors.price?.[0]}
                    placeholder="Harga Item"
                />

                <TextArea
                    label="Keterangan"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={isLoading}
                    error={errors.description?.[0]}
                />
            </div>
        );
    };

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
    );
};

export default FormItem;