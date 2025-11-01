/*import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  CircularProgress,
  AppBar,
  Toolbar,
  Container,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Sensors as SensorsIcon,
  LocationOn as LocationIcon,
  OnlinePrediction as OnlineIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Speed as SpeedIcon,
  CalendarToday as CalendarIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Diamond as DiamondIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { devicesService } from '../services/devices';
import type { Device, AnalyticsData } from '../services/devices';
import { RaspberryMonitor } from '../components/RaspberryMonitor';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const devicesData = await devicesService.getDevices();
      setDevices(devicesData);
      if (devicesData.length > 0) {
        setSelectedDevice(devicesData[0]);
        loadAnalytics(devicesData[0].id);
      }
    } catch (error) {
      console.error('Error loading devices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnalytics = async (deviceId: string) => {
    try {
      const analyticsData = await devicesService.getAnalytics(deviceId);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleDeviceChange = (device: Device) => {
    setSelectedDevice(device);
    loadAnalytics(device.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'success';
      case 'calibrating': return 'warning';
      case 'offline': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircleIcon />;
      case 'calibrating': return <WarningIcon />;
      case 'offline': return <WarningIcon />;
      default: return <WarningIcon />;
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box textAlign="center">
          <CircularProgress 
            size={60} 
            sx={{ 
              color: '#d4af37',
              mb: 2 
            }} 
          />
          <Typography variant="h6" sx={{ color: '#f8fafc' }}>
            Cargando Sistema de Monitoreo...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      pb: 4
    }}>
      {/* Header 
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1a3a5f 0%, #0f243d 100%)',
          borderBottom: '2px solid #d4af37',
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <DiamondIcon sx={{ mr: 2, color: '#d4af37', fontSize: 32 }} />
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                SQM MINERÍA - Panel de Control
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Sistema de Monitoreo de Yodo en Tiempo Real
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              avatar={<Avatar sx={{ bgcolor: '#d4af37' }}>{user?.firstName?.[0]}</Avatar>}
              label={`${user?.firstName} ${user?.lastName}`}
              variant="outlined"
              sx={{ 
                color: 'white',
                borderColor: 'rgba(212, 175, 55, 0.5)',
                background: 'rgba(212, 175, 55, 0.1)',
              }}
            />
            <Button
              color="inherit"
              onClick={logout}
              startIcon={<LogoutIcon />}
              sx={{
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: 2,
                px: 2,
                '&:hover': {
                  background: 'rgba(212, 175, 55, 0.1)',
                }
              }}
            >
              Salir
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Selector de Dispositivos 
        <Card 
          elevation={8}
          sx={{
            mb: 4,
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                color: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <SensorsIcon sx={{ color: '#d4af37' }} />
              Seleccionar Dispositivo de Monitoreo
            </Typography>
            
            {/* Grid de dispositivos usando Box 
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              justifyContent: { xs: 'center', md: 'flex-start' }
            }}>
              {devices.map(device => (
                <Box 
                  key={device.id}
                  sx={{ 
                    width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)', lg: 'calc(25% - 12px)' },
                    minWidth: { xs: '100%', sm: 280 }
                  }}
                >
                  <Card
                    elevation={4}
                    onClick={() => handleDeviceChange(device)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: selectedDevice?.id === device.id 
                        ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(26, 58, 95, 0.3) 100%)'
                        : 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.8) 100%)',
                      border: selectedDevice?.id === device.id 
                        ? '2px solid #d4af37' 
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      p: 2,
                      height: '100%',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        border: '2px solid rgba(212, 175, 55, 0.5)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                          {device.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationIcon fontSize="small" />
                          {device.location}
                        </Typography>
                      </Box>
                      <Chip
                        icon={getStatusIcon(device.status)}
                        label={device.status}
                        color={getStatusColor(device.status)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        Última conexión
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#e2e8f0' }}>
                        {new Date(device.lastSeen).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Contenido Principal *
        {selectedDevice && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', lg: 'row' }, 
            gap: 3 
          }}>
            {/* Monitor en Tiempo Real - Ocupa 2/3 en desktop *
            <Box sx={{ 
              width: { xs: '100%', lg: '66.666%' },
              flexShrink: 0
            }}>
              <RaspberryMonitor deviceId={selectedDevice.id} />
            </Box>

            {/* Analytics Sidebar - Ocupa 1/3 en desktop *
            <Box sx={{ 
              width: { xs: '100%', lg: '33.333%' },
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}>
              
              {/* Estadísticas Principales *
              {analytics && (
                <Card 
                  elevation={8}
                  sx={{
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 3,
                        color: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <AnalyticsIcon sx={{ color: '#d4af37' }} />
                      Métricas Principales (24h)
                    </Typography>

                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <TrendingUpIcon sx={{ color: '#d4af37' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Concentración Promedio"
                          secondary={
                            <Typography variant="h6" sx={{ color: '#f8fafc', mt: 0.5 }}>
                              {analytics.concentrationStats.average.toFixed(3)} ppm
                            </Typography>
                          }
                          sx={{ color: '#cbd5e1' }}
                        />
                      </ListItem>
                      
                      <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                      
                      <ListItem>
                        <ListItemText 
                          primary="Rango de Concentración"
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="body2" sx={{ color: '#f8fafc' }}>
                                Mín: {analytics.concentrationStats.min.toFixed(3)} ppm
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#f8fafc' }}>
                                Máx: {analytics.concentrationStats.max.toFixed(3)} ppm
                              </Typography>
                            </Box>
                          }
                          sx={{ color: '#cbd5e1' }}
                        />
                      </ListItem>

                      <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />

                      <ListItem>
                        <ListItemIcon>
                          <OnlineIcon sx={{ 
                            color: analytics.trendAnalysis.trend === 'increasing' ? '#ef4444' :
                                   analytics.trendAnalysis.trend === 'decreasing' ? '#10b981' : '#6b7280'
                          }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Tendencia Actual"
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  color: analytics.trendAnalysis.trend === 'increasing' ? '#ef4444' :
                                         analytics.trendAnalysis.trend === 'decreasing' ? '#10b981' : '#6b7280',
                                  fontWeight: 600
                                }}
                              >
                                {analytics.trendAnalysis.trend === 'increasing' ? '↗ Ascendente' :
                                 analytics.trendAnalysis.trend === 'decreasing' ? '↘ Descendente' : '→ Estable'}
                              </Typography>
                              <Chip 
                                label={`${analytics.trendAnalysis.confidence.toFixed(1)}%`}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  color: '#d4af37',
                                  borderColor: '#d4af37'
                                }}
                              />
                            </Box>
                          }
                          sx={{ color: '#cbd5e1' }}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              )}

              {/* Eficiencia del Sistema *
              {analytics && (
                <Card 
                  elevation={8}
                  sx={{
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 3,
                        color: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <SpeedIcon sx={{ color: '#d4af37' }} />
                      Eficiencia del Sistema
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {/* Disponibilidad *
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                            Disponibilidad
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                            {analytics.efficiencyMetrics.uptime.toFixed(1)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={analytics.efficiencyMetrics.uptime}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: 'rgba(255,255,255,0.1)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#10b981'
                            }
                          }}
                        />
                      </Box>

                      {/* Tasa de Éxito *
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                            Tasa de Éxito
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                            {analytics.efficiencyMetrics.measurementSuccessRate.toFixed(1)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={analytics.efficiencyMetrics.measurementSuccessRate}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: 'rgba(255,255,255,0.1)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#3b82f6'
                            }
                          }}
                        />
                      </Box>

                      {/* Precisión Calibración *
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                            Precisión Calibración
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                            {analytics.efficiencyMetrics.calibrationAccuracy.toFixed(1)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={analytics.efficiencyMetrics.calibrationAccuracy}
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: 'rgba(255,255,255,0.1)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#8b5cf6'
                            }
                          }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Información del Sistema *
              <Card 
                elevation={8}
                sx={{
                  background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2,
                      color: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <CalendarIcon sx={{ color: '#d4af37' }} />
                    Estado del Sistema
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Dispositivos Activos"
                        secondary={
                          <Typography variant="body2" sx={{ color: '#f8fafc' }}>
                            {devices.filter(d => d.status === 'online').length} de {devices.length}
                          </Typography>
                        }
                        sx={{ color: '#cbd5e1' }}
                      />
                    </ListItem>
                    
                    <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                    
                    <ListItem>
                      <ListItemText 
                        primary="Última Actualización"
                        secondary={
                          <Typography variant="body2" sx={{ color: '#f8fafc' }}>
                            {new Date().toLocaleTimeString()}
                          </Typography>
                        }
                        sx={{ color: '#cbd5e1' }}
                      />
                    </ListItem>

                    <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />

                    <ListItem>
                      <ListItemText 
                        primary="Modo Operación"
                        secondary={
                          <Chip 
                            label="Monitoreo Continuo"
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(16, 185, 129, 0.2)',
                              color: '#10b981',
                              mt: 0.5
                            }}
                          />
                        }
                        sx={{ color: '#cbd5e1' }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};
*/

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  CircularProgress,
  AppBar,
  Toolbar,
  Container,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Sensors as SensorsIcon,
  LocationOn as LocationIcon,
  OnlinePrediction as OnlineIcon,
  TrendingUp as TrendingUpIcon,
  Analytics as AnalyticsIcon,
  Speed as SpeedIcon,
  CalendarToday as CalendarIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Diamond as DiamondIcon,
  Thermostat as ThermostatIcon,
  Timeline as TimelineIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

// ✅ Interfaces para los datos estáticos
interface Device {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline' | 'calibrating';
  lastSeen: string;
  sensorType: string;
}

interface SensorReading {
  concentration: number;
  temperature: number;
  humidity: number;
  pressure: number;
  timestamp: string;
}

interface AnalyticsData {
  concentrationStats: {
    average: number;
    min: number;
    max: number;
    standardDeviation: number;
  };
  trendAnalysis: {
    trend: 'increasing' | 'decreasing' | 'stable';
    confidence: number;
    changeRate: number;
  };
  efficiencyMetrics: {
    uptime: number;
    measurementSuccessRate: number;
    calibrationAccuracy: number;
    dataQuality: number;
  };
  alerts: {
    type: 'warning' | 'critical' | 'info';
    message: string;
    timestamp: string;
  }[];
}

// ✅ Datos estáticos de simulación
const STATIC_DEVICES: Device[] = [
  {
    id: '1',
    name: 'SQM-001',
    location: 'Laboratorio Principal',
    status: 'online',
    lastSeen: new Date().toISOString(),
    sensorType: 'Espectrómetro RX'
  },
  {
    id: '2',
    name: 'SQM-002',
    location: 'Área de Producción',
    status: 'calibrating',
    lastSeen: new Date(Date.now() - 300000).toISOString(), // 5 min atrás
    sensorType: 'Fluorescencia RX'
  },
  {
    id: '3',
    name: 'SQM-003',
    location: 'Almacén Reactivos',
    status: 'online',
    lastSeen: new Date(Date.now() - 120000).toISOString(), // 2 min atrás
    sensorType: 'Analizador Yodo'
  },
  {
    id: '4',
    name: 'SQM-004',
    location: 'Planta Procesamiento',
    status: 'offline',
    lastSeen: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
    sensorType: 'Monitor Continuo'
  }
];

const STATIC_SENSOR_READINGS: SensorReading[] = [
  {
    concentration: 0.523,
    temperature: 23.4,
    humidity: 45.2,
    pressure: 1013.2,
    timestamp: new Date().toISOString()
  },
  {
    concentration: 0.518,
    temperature: 23.1,
    humidity: 46.8,
    pressure: 1012.8,
    timestamp: new Date(Date.now() - 60000).toISOString()
  },
  {
    concentration: 0.528,
    temperature: 23.7,
    humidity: 44.9,
    pressure: 1013.5,
    timestamp: new Date(Date.now() - 120000).toISOString()
  }
];

const STATIC_ANALYTICS: AnalyticsData = {
  concentrationStats: {
    average: 0.523,
    min: 0.489,
    max: 0.567,
    standardDeviation: 0.023
  },
  trendAnalysis: {
    trend: 'stable',
    confidence: 95.5,
    changeRate: 0.002
  },
  efficiencyMetrics: {
    uptime: 99.2,
    measurementSuccessRate: 98.7,
    calibrationAccuracy: 97.3,
    dataQuality: 96.8
  },
  alerts: [
    {
      type: 'warning',
      message: 'Calibración programada para SQM-002',
      timestamp: new Date(Date.now() + 3600000).toISOString()
    },
    {
      type: 'info',
      message: 'Mantenimiento preventivo completado',
      timestamp: new Date(Date.now() - 86400000).toISOString()
    }
  ]
};

// ✅ Servicio simulado
class MockDevicesService {
  async getDevices(): Promise<Device[]> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));
    return STATIC_DEVICES;
  }

  async getAnalytics(deviceId: string): Promise<AnalyticsData> {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(deviceId);
    return STATIC_ANALYTICS;
  }

  async getSensorReadings(deviceId: string): Promise<SensorReading[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(deviceId);
    return STATIC_SENSOR_READINGS;
  }
}

const mockDevicesService = new MockDevicesService();

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const devicesData = await mockDevicesService.getDevices();
      setDevices(devicesData);
      
      if (devicesData.length > 0) {
        const firstDevice = devicesData[0];
        setSelectedDevice(firstDevice);
        
        // Cargar datos en paralelo para mejor performance
        await Promise.all([
          loadAnalytics(firstDevice.id),
          loadSensorReadings(firstDevice.id)
        ]);
      }
      
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnalytics = async (deviceId: string) => {
    try {
      const analyticsData = await mockDevicesService.getAnalytics(deviceId);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const loadSensorReadings = async (deviceId: string) => {
    try {
      const readings = await mockDevicesService.getSensorReadings(deviceId);
      setSensorReadings(readings);
    } catch (error) {
      console.error('Error loading sensor readings:', error);
    }
  };

  const handleDeviceChange = async (device: Device) => {
    setSelectedDevice(device);
    setIsLoading(true);
    
    try {
      await Promise.all([
        loadAnalytics(device.id),
        loadSensorReadings(device.id)
      ]);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error switching device:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'success';
      case 'calibrating': return 'warning';
      case 'offline': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircleIcon />;
      case 'calibrating': return <WarningIcon />;
      case 'offline': return <WarningIcon />;
      default: return <WarningIcon />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  };

  if (isLoading && devices.length === 0) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box textAlign="center">
          <CircularProgress 
            size={60} 
            sx={{ 
              color: '#d4af37',
              mb: 2 
            }} 
          />
          <Typography variant="h6" sx={{ color: '#f8fafc', mb: 1 }}>
            Inicializando Sistema de Monitoreo
          </Typography>
          <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
            Conectando con dispositivos SQM...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100vw',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      pb: 4
    }}>
      {/* Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1a3a5f 0%, #0f243d 100%)',
          borderBottom: '2px solid #d4af37',
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <DiamondIcon sx={{ mr: 2, color: '#d4af37', fontSize: 32 }} />
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                SQM MINERÍA - Panel de Control
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Sistema de Monitoreo • {lastUpdate && `Última actualización: ${lastUpdate}`}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              avatar={<Avatar sx={{ bgcolor: '#d4af37' }}>{user?.firstName?.[0]}</Avatar>}
              label={`${user?.firstName} ${user?.lastName}`}
              variant="outlined"
              sx={{ 
                color: 'white',
                borderColor: 'rgba(212, 175, 55, 0.5)',
                background: 'rgba(212, 175, 55, 0.1)',
              }}
            />
            <Button
              color="inherit"
              onClick={logout}
              startIcon={<LogoutIcon />}
              sx={{
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: 2,
                px: 2,
                '&:hover': {
                  background: 'rgba(212, 175, 55, 0.1)',
                }
              }}
            >
              Salir
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Selector de Dispositivos */}
        <Card 
          elevation={8}
          sx={{
            mb: 4,
            background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                color: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <SensorsIcon sx={{ color: '#d4af37' }} />
              Dispositivos de Monitoreo ({devices.length})
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2,
              justifyContent: { xs: 'center', md: 'flex-start' }
            }}>
              {devices.map(device => (
                <Box 
                  key={device.id}
                  sx={{ 
                    width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 11px)', lg: 'calc(25% - 12px)' },
                    minWidth: { xs: '100%', sm: 280 }
                  }}
                >
                  <Card
                    elevation={4}
                    onClick={() => handleDeviceChange(device)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: selectedDevice?.id === device.id 
                        ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(26, 58, 95, 0.3) 100%)'
                        : 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.8) 100%)',
                      border: selectedDevice?.id === device.id 
                        ? '2px solid #d4af37' 
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      p: 2,
                      height: '100%',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        border: '2px solid rgba(212, 175, 55, 0.5)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                          {device.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationIcon fontSize="small" />
                          {device.location}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', mt: 0.5 }}>
                          {device.sensorType}
                        </Typography>
                      </Box>
                      <Chip
                        icon={getStatusIcon(device.status)}
                        label={device.status}
                        color={getStatusColor(device.status)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        Última conexión
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#e2e8f0' }}>
                        {new Date(device.lastSeen).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Contenido Principal */}
        {selectedDevice && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', lg: 'row' }, 
            gap: 3 
          }}>
            {/* Columna Principal - 2/3 del ancho */}
            <Box sx={{ 
              width: { xs: '100%', lg: '66.666%' },
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}>
              
              {/* Alertas del Sistema */}
              {analytics && analytics.alerts.length > 0 && (
                <Card 
                  elevation={8}
                  sx={{
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 2,
                        color: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <SecurityIcon sx={{ color: '#d4af37' }} />
                      Alertas del Sistema
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {analytics.alerts.map((alert, index) => (
                        <Alert 
                          key={index}
                          severity={getAlertColor(alert.type)}
                          sx={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                          }}
                        >
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {alert.message}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                              {new Date(alert.timestamp).toLocaleString()}
                            </Typography>
                          </Box>
                        </Alert>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Lecturas en Tiempo Real */}
              <Card 
                elevation={8}
                sx={{
                  background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 3,
                      color: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <TimelineIcon sx={{ color: '#d4af37' }} />
                    Lecturas en Tiempo Real - {selectedDevice.name}
                  </Typography>

                  {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress sx={{ color: '#d4af37' }} />
                    </Box>
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 2,
                      justifyContent: 'space-between'
                    }}>
                      {/* Concentración */}
                      <Box sx={{ 
                        width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 8px)' },
                        minWidth: 120
                      }}>
                        <Card variant="outlined" sx={{ p: 2, textAlign: 'center', background: 'rgba(255,255,255,0.05)', height: '100%' }}>
                          <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 700, mb: 1 }}>
                            {sensorReadings[0]?.concentration.toFixed(3)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                            Concentración (ppm)
                          </Typography>
                        </Card>
                      </Box>

                      {/* Temperatura */}
                      <Box sx={{ 
                        width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 8px)' },
                        minWidth: 120
                      }}>
                        <Card variant="outlined" sx={{ p: 2, textAlign: 'center', background: 'rgba(255,255,255,0.05)', height: '100%' }}>
                          <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                            {sensorReadings[0]?.temperature.toFixed(1)}
                            <ThermostatIcon fontSize="small" />
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                            Temperatura (°C)
                          </Typography>
                        </Card>
                      </Box>

                      {/* Humedad */}
                      <Box sx={{ 
                        width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 8px)' },
                        minWidth: 120
                      }}>
                        <Card variant="outlined" sx={{ p: 2, textAlign: 'center', background: 'rgba(255,255,255,0.05)', height: '100%' }}>
                          <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700, mb: 1 }}>
                            {sensorReadings[0]?.humidity.toFixed(1)}%
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                            Humedad
                          </Typography>
                        </Card>
                      </Box>

                      {/* Presión */}
                      <Box sx={{ 
                        width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(25% - 8px)' },
                        minWidth: 120
                      }}>
                        <Card variant="outlined" sx={{ p: 2, textAlign: 'center', background: 'rgba(255,255,255,0.05)', height: '100%' }}>
                          <Typography variant="h4" sx={{ color: '#8b5cf6', fontWeight: 700, mb: 1 }}>
                            {sensorReadings[0]?.pressure.toFixed(1)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                            Presión (hPa)
                          </Typography>
                        </Card>
                      </Box>
                    </Box>
                  )}

                  {/* Últimas lecturas */}
                  {!isLoading && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" sx={{ color: '#cbd5e1', mb: 2 }}>
                        Historial de Lecturas
                      </Typography>
                      <List dense>
                        {sensorReadings.slice(0, 3).map((reading, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <TrendingUpIcon sx={{ color: '#d4af37' }} />
                            </ListItemIcon>
                            <ListItemText 
                              primary={`${reading.concentration.toFixed(3)} ppm`}
                              secondary={`${new Date(reading.timestamp).toLocaleTimeString()} • ${reading.temperature.toFixed(1)}°C`}
                              sx={{ 
                                color: '#f8fafc',
                                '& .MuiListItemText-secondary': { color: '#94a3b8' }
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>

            {/* Sidebar - 1/3 del ancho */}
            <Box sx={{ 
              width: { xs: '100%', lg: '33.333%' },
              display: 'flex',
              flexDirection: 'column',
              gap: 3
            }}>
              
              {/* Estadísticas Principales */}
              {analytics && (
                <Card 
                  elevation={8}
                  sx={{
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 3,
                        color: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <AnalyticsIcon sx={{ color: '#d4af37' }} />
                      Métricas Principales (24h)
                    </Typography>

                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <TrendingUpIcon sx={{ color: '#d4af37' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Concentración Promedio"
                          secondary={
                            <Typography variant="h6" sx={{ color: '#f8fafc', mt: 0.5 }}>
                              {analytics.concentrationStats.average.toFixed(3)} ppm
                            </Typography>
                          }
                          sx={{ color: '#cbd5e1' }}
                        />
                      </ListItem>
                      
                      <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                      
                      <ListItem>
                        <ListItemText 
                          primary="Rango de Concentración"
                          secondary={
                            <Box sx={{ mt: 0.5 }}>
                              <Typography variant="body2" sx={{ color: '#f8fafc' }}>
                                Mín: {analytics.concentrationStats.min.toFixed(3)} ppm
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#f8fafc' }}>
                                Máx: {analytics.concentrationStats.max.toFixed(3)} ppm
                              </Typography>
                            </Box>
                          }
                          sx={{ color: '#cbd5e1' }}
                        />
                      </ListItem>

                      <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />

                      <ListItem>
                        <ListItemIcon>
                          <OnlineIcon sx={{ 
                            color: analytics.trendAnalysis.trend === 'increasing' ? '#ef4444' :
                                   analytics.trendAnalysis.trend === 'decreasing' ? '#10b981' : '#6b7280'
                          }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Tendencia Actual"
                          secondary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  color: analytics.trendAnalysis.trend === 'increasing' ? '#ef4444' :
                                         analytics.trendAnalysis.trend === 'decreasing' ? '#10b981' : '#6b7280',
                                  fontWeight: 600
                                }}
                              >
                                {analytics.trendAnalysis.trend === 'increasing' ? '↗ Ascendente' :
                                 analytics.trendAnalysis.trend === 'decreasing' ? '↘ Descendente' : '→ Estable'}
                              </Typography>
                              <Chip 
                                label={`${analytics.trendAnalysis.confidence.toFixed(1)}%`}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  color: '#d4af37',
                                  borderColor: '#d4af37'
                                }}
                              />
                            </Box>
                          }
                          sx={{ color: '#cbd5e1' }}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              )}

              {/* Eficiencia del Sistema */}
              {analytics && (
                <Card 
                  elevation={8}
                  sx={{
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: 3,
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 3,
                        color: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <SpeedIcon sx={{ color: '#d4af37' }} />
                      Eficiencia del Sistema
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {[
                        { label: 'Disponibilidad', value: analytics.efficiencyMetrics.uptime, color: '#10b981' },
                        { label: 'Tasa de Éxito', value: analytics.efficiencyMetrics.measurementSuccessRate, color: '#3b82f6' },
                        { label: 'Precisión Calibración', value: analytics.efficiencyMetrics.calibrationAccuracy, color: '#8b5cf6' },
                        { label: 'Calidad de Datos', value: analytics.efficiencyMetrics.dataQuality, color: '#d4af37' }
                      ].map((metric, index) => (
                        <Box key={index}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ color: '#cbd5e1' }}>
                              {metric.label}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#f8fafc', fontWeight: 600 }}>
                              {metric.value.toFixed(1)}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={metric.value}
                            sx={{ 
                              height: 8, 
                              borderRadius: 4,
                              bgcolor: 'rgba(255,255,255,0.1)',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: metric.color
                              }
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Información del Sistema */}
              <Card 
                elevation={8}
                sx={{
                  background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2,
                      color: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <CalendarIcon sx={{ color: '#d4af37' }} />
                    Estado del Sistema
                  </Typography>
                  
                  <List dense>
                    <ListItem>
                      <ListItemText 
                        primary="Dispositivos Activos"
                        secondary={
                          <Typography variant="body2" sx={{ color: '#f8fafc' }}>
                            {devices.filter(d => d.status === 'online').length} de {devices.length}
                          </Typography>
                        }
                        sx={{ color: '#cbd5e1' }}
                      />
                    </ListItem>
                    
                    <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />
                    
                    <ListItem>
                      <ListItemText 
                        primary="Última Actualización"
                        secondary={
                          <Typography variant="body2" sx={{ color: '#f8fafc' }}>
                            {lastUpdate}
                          </Typography>
                        }
                        sx={{ color: '#cbd5e1' }}
                      />
                    </ListItem>

                    <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />

                    <ListItem>
                      <ListItemText 
                        primary="Modo Operación"
                        secondary={
                          <Chip 
                            label="Monitoreo Continuo"
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(16, 185, 129, 0.2)',
                              color: '#10b981',
                              mt: 0.5
                            }}
                          />
                        }
                        sx={{ color: '#cbd5e1' }}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};