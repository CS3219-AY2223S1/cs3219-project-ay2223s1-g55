import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, DoughnutController } from 'chart.js';

Chart.register(ArcElement);
const labels = ['Easy', 'Medium', 'Hard'];
const data = {
  labels: ['Easy', 'Medium', 'Hard'],
  datasets: [
    {
      data: [20, 59, 83],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 159, 64)'],
      borderWidth: 1,
      hoverBorderWidth: 8,
      hoverBorderColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 159, 64)'],
    },
  ],
};
const data2 = {
  datasets: [
    {
      data: [10, 20, 30],
    },
  ],
  labels: ['Red', 'Yellow', 'Blue'],
};

const DoughnutChart = () => {
  return (
    <div>
      <h2>Difficulty distribution of completed questions</h2>
      <Doughnut
        data={data}
        width={400}
        height={400}
        options={{
          responsive: true,
          maintainAspectRatio: true,
        }}
      />
    </div>
  );
};

export default DoughnutChart;
