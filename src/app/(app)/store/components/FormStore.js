import axios from "@/lib/axios";
import { useCallback, useState } from "react";
import { DeleteConfirmation, InputField, SubmitButton, TextArea } from "./FieldForm";

const FormStore = ({ onSubmit, data, mode, buttonText }) => {
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
        return formData.name && formData.type;
    }, [formData, mode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const endpoint = '/api/store' + (mode !== 'create' ? `/${data.id}` : '');
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
                console.error(`Error ${mode}ing store:`, responseData?.message || error.message);
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
            return <DeleteConfirmation storeName={formData.name} />;
        }

        return (
            <div className="w-full space-y-4">
                <InputField
                    label="Nama Store"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    error={errors.name?.[0]}
                    required
                    placeholder="Nama Store"
                />

                <InputField
                    label="Tipe Store"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    disabled={isLoading}
                    error={errors.type?.[0]}
                    required
                    placeholder="Tipe Store"
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

export default FormStore;