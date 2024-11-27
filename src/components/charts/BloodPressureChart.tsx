import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity } from 'lucide-react';
import ChartCard from './ChartCard';
import { formatDate } from '../../utils/dateUtils';

interface BloodPressureData {
  created_at: string;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
}

interface Props {
  data: BloodPressureData[];
}

const BloodPressureChart: React.FC<Props> = ({ data }) => {
  const formattedData = data.map(item => ({
    date: formatDate(item.created_at),
    systolic: item.blood_pressure_systolic,
    diastolic: item.blood_pressure_diastolic
  }));

  return (
    <ChartCard
      title="Blood Pressure History"
      icon={Activity}
      iconColor="text-blue-500"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="systolic"
            stroke="#3b82f6"
            name="Systolic"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="diastolic"
            stroke="#60a5fa"
            name="Diastolic"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default BloodPressureChart;