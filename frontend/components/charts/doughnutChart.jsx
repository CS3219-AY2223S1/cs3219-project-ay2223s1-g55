import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';
import { useState, useEffect } from 'react';
import { getQuestionsCompletedByDifficultyCount } from '../../api/index';

Chart.register(ArcElement);

const DoughnutChart = (props) => {
  const [graphData, setGraphData] = useState(null);
  const [labels, setLabels] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { username } = props;
  console.log(username);
  useEffect(() => {
    setLoading(true);
    getQuestionsCompletedByDifficultyCount(username)
      .then((res) => {
        setLabels(Object.keys(res));
        setGraphData(Object.values(res));
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      });
  }, []);
  if (error) return <p>ERROR OCCURED</p>;
  if (isLoading) return <p>Loading...</p>;

  const data = {
    labels,
    datasets: [
      {
        data: graphData,
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
