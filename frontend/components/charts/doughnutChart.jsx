import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, DoughnutController } from 'chart.js';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { URL_HISTORY_COMPLETED_DIFFICULTY_COUNT } from '@/lib/configs';
import { get } from '../../api/base';

Chart.register(ArcElement);

const DoughnutChart = (props) => {
  const [graphData, setGraphData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const { username } = props;
  console.log(username);
  const fetchQnsCompletedByDifficulty = async () => {
    const res = await get(URL_HISTORY_COMPLETED_DIFFICULTY_COUNT, { urlParams: { username } });
    console.log(res);
  };
  useEffect(() => {
    setLoading(true);
    fetchQnsCompletedByDifficulty().then((res) => setGraphData(res));
    setLoading(false);
  }, []);
  const labels = ['Easy', 'Medium', 'Hard'];
  const datas = [1, 1, 1];
  const data = {
    labels,
    datasets: [
      {
        data: datas,
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
  if (isLoading) return <p>Loading...</p>;

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
