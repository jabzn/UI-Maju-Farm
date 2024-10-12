'use client'

import axios from "@/lib/axios";
import { useState } from "react";

const Form = ({ onSubmit, updateName, categoryId, mode, buttonText }) => {
    const [name, setName] = useState(updateName);
    const [errors, setErrors] = useState({});
    const [progress, setProgress] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            setProgress(true);
            const request = mode === 'create'
                ? axios.post('/api/category', { name }) 
                : mode === 'update'
                    ? axios.put(`/api/category/${categoryId}`, { name })
                    : axios.delete(`/api/category/${categoryId}`);
            const response = await request;
            onSubmit();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error('An Unexpedted Error Occured:', error);
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
                            value={name}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-inner focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nama Kategori"
                            autoComplete="off"
                            onChange={(e) => setName(e.target.value)}
                        />
                        {errors.name && <span className="text-red-500">{errors.name[0]}</span>}
                    </div>
                )}
                {mode === 'delete' && (
                    <div className="text-red-500">
                        <p>Anda yakin ingin menghapus kategori <strong>{name}</strong>?</p>
                    </div>
                )}
                <div className="flex justify-end space-x-3">
                    <button 
                        type="submit" 
                        className={`${name === '' ? 'opacity-50 ' : ''} ${progress ? 'opacity-50' : ''} px-4 py-2 ${mode === 'delete' ? 'bg-red-500 hover:bg-red-900' : 'bg-blue-500 hover:bg-blue-900'} bg-blue-500 text-white rounded-md hover:bg-blue-900`}
                        disabled={name === ''}
                    >
                        { buttonText }
                    </button>
                </div>
            </form>
        </>
    )
}

export default Form;