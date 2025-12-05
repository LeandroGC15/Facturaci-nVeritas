import React, { useState } from 'react';
import { useMetrics } from '@/hooks/dashboard/useMetrics';
import { useReports } from '@/hooks/dashboard/useReports';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { ReportsChart } from '@/components/dashboard/ReportsChart';
import { DateRangeSelector } from '@/components/dashboard/DateRangeSelector';
import { Card } from '@/components/common/Card/Card';
import { Loading } from '@/components/common/Loading/Loading';
import { ReportFilters } from '@/types/dashboard';
import { formatters } from '@/utils/formatters';
import { Button } from '@/components/common/Button/Button';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { metrics, isLoading: metricsLoading } = useMetrics();
  const { report, isLoading: reportsLoading, fetchReports } = useReports();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ReportFilters>({
    period: 'daily',
  });

  React.useEffect(() => {
    fetchReports(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  if (metricsLoading) {
    return <Loading fullScreen message="Cargando métricas..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Button onClick={() => navigate('/stock')}>
          Gestionar Stock
        </Button>
      </div>

      {/* Métricas principales */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricsCard
            title="Total de Productos"
            value={metrics.totalProducts}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
          />
          <MetricsCard
            title="Total de Facturas"
            value={metrics.totalInvoices}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <MetricsCard
            title="Ingresos"
            value={formatters.currency(metrics.revenue)}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <MetricsCard
            title="Productos con Stock Bajo"
            value={metrics.lowStockItems}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />
        </div>
      )}

      {/* Reportes */}
      <Card
        title="Reportes"
        actions={
          <DateRangeSelector filters={filters} onFilterChange={setFilters} />
        }
      >
        {reportsLoading ? (
          <Loading message="Cargando reportes..." />
        ) : report && report.data.length > 0 ? (
          <ReportsChart data={report.data} type="line" />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No hay datos para el período seleccionado
          </div>
        )}
      </Card>
    </div>
  );
};

