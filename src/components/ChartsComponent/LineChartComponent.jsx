import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChartComponent = ({LineChartData, column1, column2}) => {
  return (
    <ResponsiveContainer width="50%" height={300}>
        <BarChart
            width={500}
            height={300}
            data={LineChartData}
            margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            isAnimationActive={true}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#0088fe" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey={column1} fill="#0088fe" />
            <Bar yAxisId="right" dataKey={column2} fill="#82ca9d" />
        </BarChart>
    </ResponsiveContainer>
  )
}

export default LineChartComponent;
