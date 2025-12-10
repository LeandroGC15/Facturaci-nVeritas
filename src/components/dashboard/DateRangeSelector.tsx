import React from 'react';
import { ReportFilters } from '@/types/dashboard';
import { Button } from '@/components/common/Button/Button';

interface DateRangeSelectorProps {
  filters: ReportFilters;
  onFilterChange: (filters: ReportFilters) => void;
}

export const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  filters,
  onFilterChange,
}) => {
  const periods: Array<{ value: ReportFilters['period']; label: string }> = [
    { value: 'daily', label: 'Diario' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensual' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
      {periods.map((period) => (
        <Button
          key={period.value}
          variant={filters.period === period.value ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onFilterChange({ ...filters, period: period.value })}
          className="flex-1 sm:flex-initial"
        >
          {period.label}
        </Button>
      ))}
    </div>
  );
};

