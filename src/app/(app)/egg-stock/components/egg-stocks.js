'use client';

import axios from "@/lib/axios";
import { useCallback, useEffect, useState } from "react"
import CardStockEgg from "./CardStockEgg";
import FilterDate from "./TitleEggStockandDate";

const EggStockStore = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 2).toISOString().split('T')[0]
    );
    const [endDate, setEndDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString().split('T')[0]
    );

    const fetchEggStock = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/eggStock', { params: {
                start_date: startDate,
                end_date: endDate,
            }});
            setData(response.data);
        } catch (error) {
            console.error('Error fetching egg stock data', error);
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);
    
    useEffect(() => {
        fetchEggStock();
    }, [fetchEggStock]);

    const handleModal = useCallback((data) => {
        console.log(data);
    });

    return (
        <div>
            <FilterDate
                title={"Stock Telur"}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
            />

            <div className="flex justify-between space-x-4 lg:w-2/4 w-full">
                <CardStockEgg 
                    title={"Stock Telur Kandang"}
                    data={data}
                    onClick={handleModal}
                />

                <CardStockEgg 
                    title={"Stock Telur Endekado"}
                    data={data}
                    onClick={handleModal}
                />
            </div>
        </div>
    )
}

export default EggStockStore;