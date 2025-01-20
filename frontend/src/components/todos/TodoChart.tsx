import React from 'react';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TodoStats {
  date: string;
  completed: number;
  total: number;
}

interface TodoChartProps {
  data: TodoStats[];
}

export const TodoChart: React.FC<TodoChartProps> = ({ data }) => {
  const chartData: ChartData<'line'> = {
    labels: data.map(item => format(new Date(item.date), 'd')),
    datasets: [
      {
        label: 'Completed Tasks',
        data: data.map(item => item.completed),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Total Tasks',
        data: data.map(item => item.total),
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.5)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(156, 163, 175)',
        },
      },
      tooltip: {
        callbacks: {
          title: (context: any) => {
            const dataIndex = context[0].dataIndex;
            return format(new Date(data[dataIndex].date), 'MMM d, yyyy');
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        title: {
          display: true,
          text: 'Day of Month',
          color: 'rgb(156, 163, 175)',
        },
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: 'rgb(156, 163, 175)',
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Number of Tasks',
          color: 'rgb(156, 163, 175)',
        },
      },
    },
  };

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
}; 