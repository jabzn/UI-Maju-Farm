'use client';

import axios from "@/lib/axios";
import { useEffect, useState } from "react";

const CardStock = () => {
    const [items, setItems] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/items');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching Stock:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [fetchData, items]);

    return (
        <div className="bg-gray-100 rounded-lg shadow-inner p-4 w-1/3">
            <h3 className="font-bold mb-4">Stock in Gudang</h3>

            <div className="border-b border-2 border-gray-300 my-4"></div>

            <ul className="space-y-2">
                {items.map(item => (
                    <li className="flex justify-between" key={item.id}>
                        <span className="font-bold">{item.name}</span>
                        <span className="font-bold">{item.current_stock}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default CardStock;