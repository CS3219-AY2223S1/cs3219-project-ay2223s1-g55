import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { URL_HISTORY_COMPLETED_MONTHS_COUNT } from '@/lib/configs';
import { get } from '../../api/base';

export default function LineChart(props) {
  const [graphData, setGraphData] = useState(null);
  const [labels, setLabels] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { username } = props;
  const monthMapping = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const fetchQnsCompletedByMonths = async () => {
    const res = await get(URL_HISTORY_COMPLETED_MONTHS_COUNT, { urlParams: { username } });
    return res;
  };
  useEffect(() => {
    let unsubscribed = false;
    setLoading(true);
    fetchQnsCompletedByMonths()
      .then((res) => {
        console.log(res);
        if (!unsubscribed) {
          setLabels(res.map((item) => monthMapping[item.month - 1]));
          setGraphData(res.map((item) => item.count));
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      });
    return () => {
      unsubscribed = true;
      console.log('cancelled useEffect');
    };
  }, []);

  const canvasEl = useRef(null);

  const colors = {
    purple: {
      default: 'rgba(149, 76, 233, 1)',
      half: 'rgba(149, 76, 233, 0.5)',
      quarter: 'rgba(149, 76, 233, 0.25)',
      zero: 'rgba(149, 76, 233, 0)',
    },
    indigo: {
      default: 'rgba(80, 102, 120, 1)',
      quarter: 'rgba(80, 102, 120, 0.25)',
    },
  };

  useEffect(() => {
    const ctx = canvasEl.current.getContext('2d');
    // const ctx = document.getElementById("myChart");

    const gradient = ctx.createLinearGradient(0, 16, 0, 600);
    gradient.addColorStop(0, colors.purple.half);
    gradient.addColorStop(0.65, colors.purple.quarter);
    gradient.addColorStop(1, colors.purple.zero);

    const data = {
      labels,
      datasets: [
        {
          backgroundColor: gradient,
          label: 'Questions completed',
          data: graphData,
          fill: true,
          borderWidth: 2,
          borderColor: colors.purple.default,
          lineTension: 0.2,
          pointBackgroundColor: colors.purple.default,
          pointRadius: 3,
        },
      ],
    };
    const config = {
      type: 'line',
      data,
    };
    const myLineChart = new Chart(ctx, config);

    return function cleanup() {
      console.log('cleaning up');
      console.log(myLineChart);
      if (myLineChart) {
        myLineChart.destroy();
      }
    };
  }, [graphData, labels]);

  if (error) return <p>ERROR OCCURED</p>;
  if (isLoading) return <p>Loading...</p>;
  return (
    <div>
      <h2>Question Done over the months</h2>
      <canvas id='myChart' ref={canvasEl} height='430' />
    </div>
  );
}
