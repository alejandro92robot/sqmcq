// src/types/devices.ts
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