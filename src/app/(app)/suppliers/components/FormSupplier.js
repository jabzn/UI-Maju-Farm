'use client'

import axios from "@/lib/axios";
import { useEffect, useState, useCallback } from "react";
import { DeleteConfirmation, InputField, SubmitButton, TextArea } from "./FieldForm";

const FormSupplier = ({ onSubmit, data, mode, buttonText }) => {
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
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    }, [errors]);

    const isFormValid = useCallback(() => {
        if (mode === 'delete') return true;
        return formData.name;
    }, [formData, mode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const endpoint = '/api/supplier' + (mode !== 'create' ? `/${data.id}` : '');
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
            return <DeleteConfirmation supplierName={formData.name} />;
        }

        return (
            <div className="flex gap-4">
                <div className="w-full space-y-4">
                    <InputField
                        label="Nama Supplier"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={isLoading}
                        error={errors.name?.[0]}
                        required
                        placeholder="Nama Supplier"
                    />
    
                    <InputField
                        label="Alamat Supplier"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={isLoading}
                        error={errors.address?.[0]}
                        placeholder="Alamat Suplier"
                    />
    
                    <InputField
                        label="Contact Person"
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleChange}
                        disabled={isLoading}
                        error={errors.contact_person?.[0]}
                        placeholder="Alamat Suplier"
                    />
    
                    <InputField
                        label="Nomor Telepon"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isLoading}
                        error={errors.phone?.[0]}
                        placeholder="Nomor Telepon"
                        type="number"
                    />
                </div>
                <div className="w-full space-y-4">
                    <InputField
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                        error={errors.email?.[0]}
                        placeholder="Masukan Email"
                    />
                    
                    <TextArea
                        label="Keterangan"
                        name="remark"
                        value={formData.remark}
                        onChange={handleChange}
                        disabled={isLoading}
                        error={errors.remark?.[0]}
                        placeholder="Masukan Keterangan"
                    />
                </div>
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
    );
}

export default FormSupplier;