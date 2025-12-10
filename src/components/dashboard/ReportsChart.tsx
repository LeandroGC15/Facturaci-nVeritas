import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ReportData } from '@/types/dashboard';
import { formatters } from '@/utils/formatters';

interface ReportsChartProps {
  data: ReportData[];
  type?: 'line' | 'bar';
}

export const ReportsChart: React.FC<ReportsChartProps> = ({
  data,
  type = 'line',
}) => {
  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => formatters.date(value, 'dd/MM')}
          />
          <YAxis />
          <Tooltip
            formatter={(value: number) => formatters.currency(value)}
            labelFormatter={(label) => formatters.date(label, 'dd/MM/yyyy')}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#0ea5e9"
            fill="#0ea5e9"
            name="Total"
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#10b981"
            fill="#10b981"
            name="Cantidad"
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => formatters.date(value, 'dd/MM')}
        />
        <YAxis />
        <Tooltip
          formatter={(value: number) => formatters.currency(value)}
          labelFormatter={(label) => formatters.date(label, 'dd/MM/yyyy')}
        />
        <Legend />
        <Bar
          dataKey="value"
          fill="#0ea5e9"
          name="Total"
        />
        <Bar
          dataKey="count"
          fill="#10b981"
          name="Cantidad"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

