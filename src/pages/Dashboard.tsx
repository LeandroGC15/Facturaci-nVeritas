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
            title="Total Facturado"
            value={formatters.currency(metrics.totalInvoiced)}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            title="Valor Promedio"
            value={formatters.currency(metrics.averageInvoiceValue)}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
          <MetricsCard
            title="Productos Activos"
            value={metrics.topProducts.length}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
          />
        </div>
      )}

      {/* Productos más vendidos */}
      {metrics && metrics.topProducts.length > 0 && (
        <Card title="Productos Más Vendidos">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metrics.topProducts.slice(0, 5).map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatters.currency(product.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
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

