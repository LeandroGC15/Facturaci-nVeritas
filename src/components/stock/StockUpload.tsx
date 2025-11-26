import React, { useRef, useState } from 'react';
import { useStockUpload } from '@/hooks/stock/useStockUpload';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';

export const StockUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isLoading, error, result } = useStockUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await uploadFile(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      // Error manejado por el hook
    }
  };

  return (
    <Card title="Carga Masiva de Stock">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar archivo CSV o Excel
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
          <p className="mt-1 text-sm text-gray-500">
            Formatos soportados: CSV, XLSX, XLS
          </p>
        </div>

        {selectedFile && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              Archivo seleccionado: <strong>{selectedFile.name}</strong>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Tamaño: {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            <p className="font-semibold">Carga completada</p>
            <p className="text-sm mt-1">
              Exitosos: {result.success} | Fallidos: {result.failed}
            </p>
            {result.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-semibold">Errores:</p>
                <ul className="text-xs list-disc list-inside mt-1">
                  {result.errors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={handleUpload}
          isLoading={isLoading}
          disabled={!selectedFile}
          className="w-full"
        >
          Cargar Archivo
        </Button>
      </div>
    </Card>
  );
};

