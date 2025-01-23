'use client';

import { useCallback, useState } from "react";
import { DeleteConfirmation, InputField, SubmitButton } from "../../components/FieldForm";
import axios from "@/lib/axios";

const FormCustomer = ({ onSubmit, data, mode, buttonText }) => {
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

    const isFormValid = useCallback(() => {
        if (mode === 'delete') return true;
        return formData.name;
    }, [formData, mode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const endpoint = '/api/customer' + (mode !== 'create' ? `/${data.id}` : '');
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
                console.error(`Error ${mode}ing Customer:`, responseData?.message || error.message);
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
            return <DeleteConfirmation label={formData.name} />;
        }

        return (
            <div className="w-full space-y-4">
                <InputField
                    label="Nama Customer"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    error={errors.name?.[0]}
                />

                <InputField
                    label="Alamat"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={isLoading}
                    error={errors.address?.[0]}
                />

                <InputField
                    label="Contact Person"
                    name="contact_person"
                    type="text"
                    value={formData.contact_person}
                    onChange={handleChange}
                    disabled={isLoading}
                    error={errors.contact_person?.[0]}
                />

                <InputField
                    label="Email"
                    name="email"
                    type="text"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    error={errors.email?.[0]}
                />

                <InputField
                    label="Nomor Telepon"
                    name="phone"
                    type="number"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
                    error={errors.phone?.[0]}
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

export default FormCustomer;