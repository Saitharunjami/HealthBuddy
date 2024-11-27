import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface ChartCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  children: ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, icon: Icon, iconColor, children }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="h-[300px]">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;