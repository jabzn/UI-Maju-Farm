'use client'

import axios from "@/lib/axios";
import { useEffect, useState } from "react";

const FormSupplier = ({ onSubmit, data, mode, buttonText }) => {
    const [supplier, setSupplier] = useState(data)
    const [errors, setErrors] = useState({});
    const [progress, setProgress] = useState(false);
    const isFormValid = supplier.name;

    useEffect(() => {
        setSupplier(data)
    }, [data]);
    
    const handleDataChange = (e) => {
        setSupplier((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setProgress(true);

        try {
            let response;
            if (mode === 'create') {
                response = await axios.post('/api/supplier', supplier);
            } else if (mode === 'update') {
                response = await axios.put(`/api/supplier/${data.id}`, supplier);
            } else if (mode === 'delete') {
                response = await axios.delete(`/api/supplier/${data.id}`);
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
                    <div className="flex justify-between gap-2">
                        <div className="w-full space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700">
                                    Nama Supplier
                                </label>
                                <input 
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={supplier.name}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-inner focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nama Supplier"
                                    autoComplete="off"
                                    disabled={progress}
                                    onChange={handleDataChange}
                                    required
                                />
                                {errors.name && <span className="text-red-500">{errors.name[0]}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700">
                                    Alamat
                                </label>
                                <input 
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={supplier.address}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-inner focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Alamat Supplier"
                                    autoComplete="off"
                                    disabled={progress}
                                    onChange={handleDataChange}
                                />
                                {errors.address && <span className="text-red-500">{errors.address[0]}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700">
                                    Contact Person
                                </label>
                                <input 
                                    type="text"
                                    id="contact_person"
                                    name="contact_person"
                                    value={supplier.contact_person}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-inner focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Contact Person"
                                    autoComplete="off"
                                    disabled={progress}
                                    onChange={handleDataChange}
                                />
                                {errors.contact_person && <span className="text-red-500">{errors.contact_person[0]}</span>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">
                                    Nomor Telepon
                                </label>
                                <input 
                                    type="number"
                                    id="phone"
                                    name="phone"
                                    value={supplier.phone}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-inner focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nomor Telepon/HP"
                                    autoComplete="off"
                                    disabled={progress}
                                    onChange={handleDataChange}
                                />
                                {errors.phone && <span className="text-red-500">{errors.phone[0]}</span>}
                            </div>
                        </div>
                        <div className="w-full space-y-2">
                            <div>
                                <label className="block text-sm font-bold text-gray-700">
                                    Email
                                </label>
                                <input 
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={supplier.email}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-inner focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Alamat Email"
                                    autoComplete="off"
                                    disabled={progress}
                                    onChange={handleDataChange}
                                />
                                {errors.email && <span className="text-red-500">{errors.email[0]}</span>}
                            </div>

                            <div>
                                <label htmlFor="remark" className="block text-sm font-bold text-gray-700">
                                    Keterangan
                                </label>
                                <textarea 
                                    id="remark"
                                    name="remark"
                                    value={supplier.remark}
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-inner focus:ring-blue-500 focus:border-blue-500 h-48"
                                    placeholder="Keterangan"
                                    autoComplete="off"
                                    disabled={progress}
                                    onChange={handleDataChange}
                                ></textarea>
                                {errors.remark && <span className="text-red-500">{errors.remark[0]}</span>}
                            </div>
                        </div>
                    </div>
                    
                )}
                {mode === 'delete' && (
                    <div className="text-red-500">
                        <p>Ingin menghapus "{supplier.name}" dari list Supplier?</p>
                    </div>
                )}
                <div className="flex justify-end space-x-3">
                    <button 
                        type="submit" 
                        className={`${!isFormValid ? 'opacity-50 ' : ''} ${progress ? 'opacity-50' : ''} px-4 py-2 ${mode === 'delete' ? 'bg-red-500 hover:bg-red-900' : 'bg-blue-500 hover:bg-blue-900'} bg-blue-500 text-white rounded-md hover:bg-blue-900`}
                        disabled={!isFormValid || progress}
                    >
                        { buttonText }
                    </button>
                </div>
            </form>
        </>
    )
}

export default FormSupplier;