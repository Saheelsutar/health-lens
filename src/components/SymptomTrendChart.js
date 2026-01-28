import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export function SymptomTrendChart({ data, colors }) {
  const screenWidth = Dimensions.get('window').width - 60;
  
  // Format data for chart
  const labels = data.map(d => {
    const date = new Date(d.date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }).slice(-7); // Last 7 days
  
  const datasets = [
    {
      data: data.slice(-7).map(d => d.fever),
      color: () => '#FF6B6B',
      strokeWidth: 2
    },
    {
      data: data.slice(-7).map(d => d.cough),
      color: () => '#4ECDC4',
      strokeWidth: 2
    },
    {
      data: data.slice(-7).map(d => d.headache),
      color: () => '#95E1D3',
      strokeWidth: 2
    }
  ];
  
  return (
    <LineChart
      data={{
        labels: labels,
        datasets: datasets,
        legend: ["Fever", "Cough", "Headache"]
      }}
      width={screenWidth}
      height={110}
      chartConfig={{
        backgroundColor: colors.background,
        backgroundGradientFrom: colors.background,
        backgroundGradientTo: colors.background,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(123, 97, 255, ${opacity})`,
        style: { borderRadius: 16 }
      }}
      bezier
      style={{ borderRadius: 14 }}
    />
  );
}