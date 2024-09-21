'use client';

import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LineChart = () => {
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: labels.map(() => Math.floor(Math.random() * 1000)),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Dataset 2',
                data: labels.map(() => Math.floor(Math.random() * 1000)),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const options = {
        scales: {
            y: {
                title: {
                    display: false,
                    text: 'Y-axis Label',
                },
                display: true,
            },
            x: {
                title: {
                    display: true,
                    text: 'x-axis Label',
                },
                display: true,
            },
        }
    }

    return (
        <div style={{ width: '100%' }} className="rounded-lg border-2 shadow-inner p-4">
            <Line data={data} options={options} />
        </div>
    )
}

export default LineChart;