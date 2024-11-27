import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Heart } from 'lucide-react';
import ChartCard from './ChartCard';
import { formatDate } from '../../utils/dateUtils';

interface HeartRateData {
  created_at: string;
  heart_rate: number;
}

interface Props {
  data: HeartRateData[];
}

const HeartRateChart: React.FC<Props> = ({ data }) => {
  const formattedData = data.map(item => ({
    date: formatDate(item.created_at),
    heartRate: item.heart_rate
  }));

  return (
    <ChartCard
      title="Heart Rate Trends"
      icon={Heart}
      iconColor="text-red-500"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="heartRate"
            stroke="#ef4444"
            name="Heart Rate (bpm)"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default HeartRateChart;