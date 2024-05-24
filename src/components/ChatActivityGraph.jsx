import React from 'react';
import { Grid, Typography, CircularProgress } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import '../styles/Activity.css'

const ChatActivityGraph = ({ data, loading }) => {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Chat Activity',
        data: data.map(item => item.messagesCount),
      },
    ],
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item xs={12}>
        <Typography variant="h6" align="center" gutterBottom>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {loading ? (
          <Grid container justifyContent="center">
            <CircularProgress />
          </Grid>
        ) : (
          <BarChart
            series={[{ data: chartData.datasets[0].data }]}
            xAxis={[{ scaleType: 'band', data: chartData.labels }]}
            height={400}
            width={600}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default ChatActivityGraph;