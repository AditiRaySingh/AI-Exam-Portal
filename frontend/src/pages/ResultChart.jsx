import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ResultChart = ({ result }) => {

  const data = {
    labels: [
      "Score",
      "Total Marks",
      "Correct",
      "Wrong",
      "Percentage"
    ],

    datasets: [
      {
        label: "Exam Result",
        data: [
          result.score,
          result.totalMarks,
          result.correctAnswers,
          result.wrongAnswers,
          result.percentage
        ]
      }
    ]
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        display: true
      }
    },

    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div style={{ width: "700px", margin: "20px auto" }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ResultChart;