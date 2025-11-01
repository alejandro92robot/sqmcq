// src/components/dashboard/RaspberryMonitor.tsx
import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { devicesService } from '../services/devices';
import type { SensorReading } from '../types/devices';

interface RaspberryMonitorProps {
  deviceId: string;
}

export const RaspberryMonitor: React.FC<RaspberryMonitorProps> = ({ deviceId }) => {
  const { sensorData, lastMessage } = useWebSocket(deviceId);
  const [deviceStatus, setDeviceStatus] = useState<any>(null);
  const [isSimulatorRunning, setIsSimulatorRunning] = useState(false);

  useEffect(() => {
    loadDeviceStatus();
  }, [deviceId]);

  const loadDeviceStatus = async () => {
    try {
      const status = await devicesService.getRaspberryStatus(deviceId);
      setDeviceStatus(status);
      setIsSimulatorRunning(status.simulatorRunning);
    } catch (error) {
      console.error('Error loading device status:', error);
    }
  };

  const currentReading: SensorReading | null = sensorData.length > 0 ? sensorData[sensorData.length - 1] : null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Monitor en Tiempo Real</h2>
      
      {/* Estado de conexión */}
      <div className="mb-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Conectado</span>
        </div>
      </div>

      {/* Datos del sensor */}
      {currentReading && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Concentración</p>
            <p className="text-2xl font-bold">
              {/* ✅ Verificar si concentration existe, usar valor por defecto */}
              {(currentReading.iodineConcentration || 0).toFixed(3)} ppm
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Temperatura</p>
            <p className="text-2xl font-bold">
              {/* ✅ Verificar si temperature existe, usar valor por defecto */}
              {(currentReading.temperature || 0).toFixed(1)}°C
            </p>
          </div>
        </div>
      )}

      {/* Estado del dispositivo */}
      {deviceStatus && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold mb-2">Estado del Dispositivo</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Simulador:</span>
              <span className={`ml-2 ${isSimulatorRunning ? 'text-green-600' : 'text-red-600'}`}>
                {isSimulatorRunning ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Última actualización:</span>
              <span className="ml-2">
                {deviceStatus.lastUpdate ? new Date(deviceStatus.lastUpdate).toLocaleTimeString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Último mensaje */}
      {lastMessage && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          {/* ✅ Convertir lastMessage a string si es necesario */}
          <p className="text-sm text-blue-800">
            {typeof lastMessage === 'string' ? lastMessage : JSON.stringify(lastMessage)}
          </p>
        </div>
      )}
    </div>
  );
};