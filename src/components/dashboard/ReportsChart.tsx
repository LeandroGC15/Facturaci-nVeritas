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
  const ChartComponent = type === 'line' ? LineChart : BarChart;
  const DataComponent = type === 'line' ? Line : Bar;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ChartComponent data={data}>
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
        <DataComponent
          type="monotone"
          dataKey="value"
          stroke="#0ea5e9"
          fill="#0ea5e9"
          name="Total"
        />
        <DataComponent
          type="monotone"
          dataKey="count"
          stroke="#10b981"
          fill="#10b981"
          name="Cantidad"
        />
      </ChartComponent>
    </ResponsiveContainer>
  );
};

