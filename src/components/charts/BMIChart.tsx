import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Scale } from 'lucide-react';
import ChartCard from './ChartCard';
import { formatDate } from '../../utils/dateUtils';

interface BMIData {
  created_at: string;
  bmi: number;
}

interface Props {
  data: BMIData[];
}

const BMIChart: React.FC<Props> = ({ data }) => {
  const formattedData = data.map(item => ({
    date: formatDate(item.created_at),
    bmi: item.bmi
  }));

  return (
    <ChartCard
      title="BMI Tracking"
      icon={Scale}
      iconColor="text-green-500"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="bmi"
            stroke="#22c55e"
            fill="#bbf7d0"
            name="BMI"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default BMIChart;