// src/services/devices.ts
import { api } from './api';

// ✅ Exportar tipos
export interface SensorReading {
  id: string;
  deviceId: string;
  iodineConcentration: number;
  temperature: number;
  humidity: number;
  xrfIntensity: number;
  measurementDuration: number;
  status: 'pending' | 'processed' | 'error';
  timestamp: string;
  rawData?: {
    spectrum: number[];
    peaks: Array<{ channel: number; intensity: number }>;
    baseline: number;
    noise: number;
  };
  qualityMetrics?: {
    signalToNoise: number;
    peakResolution: number;
    baselineStability: number;
    calibrationOffset: number;
  };
}

export interface Device {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'calibrating';
  lastSeen: string;
  lastReading?: SensorReading;
  configuration: {
    samplingRate: number;
    calibrationFactor: number;
    safetyLimits: {
      maxIodineConcentration: number;
      maxTemperature: number;
    };
  };
}

export interface AnalyticsData {
  concentrationStats: {
    average: number;
    min: number;
    max: number;
    standardDeviation: number;
    sampleCount: number;
  };
  trendAnalysis: {
    trend: 'increasing' | 'decreasing' | 'stable';
    slope: number;
    confidence: number;
  };
  efficiencyMetrics: {
    uptime: number;
    measurementSuccessRate: number;
    calibrationAccuracy: number;
  };
}

export const devicesService = {
  async getDevices(): Promise<Device[]> {
    return api.get<Device[]>('/devices');
  },

  async getDeviceReadings(deviceId: string, hours: number = 24): Promise<SensorReading[]> {
    return api.get<SensorReading[]>(`/devices/readings/${deviceId}?hours=${hours}`);
  },

  async getDeviceStats(deviceId: string): Promise<any> {
    return api.get(`/devices/stats/${deviceId}`);
  },

  async getAnalytics(deviceId: string, days: number = 7): Promise<AnalyticsData> {
    return api.get<AnalyticsData>(`/analytics/dashboard/${deviceId}?days=${days}`);
  },

  async sendControlCommand(deviceId: string, command: string, parameters?: any): Promise<any> {
    return api.post(`/devices/${deviceId}/control`, {
      command,
      parameters,
    });
  },

  // Raspberry Pi Simulation
  async startSimulation(deviceId: string, intervalMs: number = 3000): Promise<any> {
    return api.post(`/raspberry/simulate/${deviceId}/start`, { intervalMs });
  },

  async stopSimulation(deviceId: string): Promise<any> {
    return api.post(`/raspberry/simulate/${deviceId}/stop`);
  },

  async singleMeasurement(deviceId: string): Promise<any> {
    return api.post(`/raspberry/simulate/${deviceId}/single`);
  },

  async getRaspberryStatus(deviceId: string): Promise<any> {
    return api.get(`/raspberry/simulate/${deviceId}/status`);
  },
};