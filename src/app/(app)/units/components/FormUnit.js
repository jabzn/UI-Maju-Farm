'use client'

import axios from "@/lib/axios";
import { useEffect, useState } from "react";

const FormUnit = ({ onSubmit, data, mode, buttonText }) => {
    const [unit, setUnit] = useState(data);
    const [errors, setErrors] = useState({});
    const [progress, setProgress] = useState(false);
    const isFormValid = unit;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setProgress(true);

        try {
            let response;
            if (mode === 'create') {
                response = await axios.post('/api/unit', unit);
            } else if (mode === 'update') {
                response = await axios.put(`/api/unit/${data.id}`, unit);
            } else if (mode === 'delete') {
                response = await axios.delete(`/api/unit/${data.id}`);
            }
            onSubmit();
        } catch (error) {
            if (error.response) {
                if (error.response.status === 422) {
                    setErrors(error.response.data.errors);
                } else if (error.response.status === 500) {
                    console.error('Server Error:', error.response.data.message);
                } else if (error.response.status === 403) {
                    console.error('Unauthorized:', error.response.data.message);
                }
            }
        } finally {
            setProgress(false);
        }
    }

    return (
        <>
            <form className="space-y-4" onSubmit={handleSubmit}>
                {(mode === 'create' || mode === 'update') && (
                    <div>
                        <input 
                            type="text"
                            id="name"
                            value={unit.name}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-inner focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nama Unit"
                            autoComplete="off"
                            disabled={progress}
                            onChange={(e) => setUnit(prevState => ({ ...prevState, name: e.target.value}))}
                            required
                        />
                        {errors.name && <span className="text-red-500">{errors.name[0]}</span>}
                    </div>
                )}
                {mode === 'delete' && (
                    <div className="text-red-500">
                        <p>Anda yakin ingin menghapus unit "<strong>{unit.name}</strong>"?</p>
                    </div>
                )}
                <div className="flex justify-end space-x-3">
                    <button 
                        type="submit" 
                        className={`${!isFormValid ? 'opacity-50 ' : ''} ${progress ? 'opacity-50' : ''} px-4 py-2 ${mode === 'delete' ? 'bg-red-500 hover:bg-red-900' : 'bg-blue-500 hover:bg-blue-900'} bg-blue-500 text-white rounded-md hover:bg-blue-900`}
                        disabled={!isFormValid}
                    >
                        { buttonText }
                    </button>
                </div>
            </form>
        </>
    )
}

export default FormUnit;