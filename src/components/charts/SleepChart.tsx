import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Moon } from 'lucide-react';
import ChartCard from './ChartCard';
import { formatDate } from '../../utils/dateUtils';

interface SleepData {
  created_at: string;
  sleep_hours: number;
}

interface Props {
  data: SleepData[];
}

const SleepChart: React.FC<Props> = ({ data }) => {
  const formattedData = data.map(item => ({
    date: formatDate(item.created_at),
    sleepHours: item.sleep_hours
  }));

  return (
    <ChartCard
      title="Sleep Pattern"
      icon={Moon}
      iconColor="text-purple-500"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 12]} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="sleepHours"
            fill="#a855f7"
            name="Sleep Duration (hours)"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default SleepChart;