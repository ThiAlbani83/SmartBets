
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';

// Registrando os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Dados fictícios: volume de apostas por modalidade esportiva
const sportsBetVolume = [
    { modalidade: 'Futebol', volume: 5000 },
    { modalidade: 'Basquete', volume: 3500 },
    { modalidade: 'Tênis', volume: 3000 },
    { modalidade: 'Corrida de Cavalos', volume: 2500 },
    { modalidade: 'E-Sports', volume: 2000 },
    { modalidade: 'Vôlei', volume: 1800 },
    { modalidade: 'Golfe', volume: 1500 },
];

// Ordenar e selecionar o Top 5
const top5Sports = sportsBetVolume
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5);

const BarGraphsTopSports = () => {
    const labels = top5Sports.map(sport => sport.modalidade);
    const dataValues = top5Sports.map(sport => sport.volume);

    const data = {
        labels,
        datasets: [
            {
                label: 'Volume de Apostas',
                data: dataValues,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)', // Cor para cada barra
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Modalidade Esportiva',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Volume de Apostas',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="flex flex-col justify-center items-center w-[30%] h-[40%] px-8 py-8 shadow-md rounded-lg border border-linesAndBorders">
            <div className="flex items-center text-center">
                <p className="w-full font-bold">Top 5 Modalidades Esportivas</p>
            </div>
            <div className="w-full h-full flex justify-center items-center text-sm mt-2">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default  BarGraphsTopSports ;
