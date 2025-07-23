import React, { Pureomponent } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const RadarChartComponent = ({radarChartData}) => {
    //console.log("ChartData: ", radarChartData);
    radarChartData = radarChartData.filter(item => item.subjectName !==  "Thể Dục");
    console.log("ChartData: ", radarChartData);

    return (
      <ResponsiveContainer width="1000%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subjectName" />
          <PolarRadiusAxis />
          <Radar name="Mike" dataKey="averageScore" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
    );
  

}

export default RadarChartComponent;
