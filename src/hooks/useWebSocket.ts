// src/hooks/useWebSocket.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export const useWebSocket = (deviceId?: string) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [sensorData, setSensorData] = useState<any[]>([]);

  const connect = useCallback(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No authentication token available');
      return;
    }

    const socket = io('http://localhost:3001/devices', {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      
      if (deviceId) {
        socket.emit('subscribe_to_device', { deviceId });
      }
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socket.on('connection_established', (data) => {
      console.log('WebSocket connection established:', data);
    });

    socket.on('real_time_reading', (message: WebSocketMessage) => {
      console.log('Real-time data received:', message);
      setLastMessage(message);
      
      if (message.type === 'sensor_reading') {
        setSensorData(prev => [...prev.slice(-99), message.data]);
      }
    });

    socket.on('device_alert', (alert) => {
      console.log('Alert received:', alert);
      // Mostrar notificación al usuario
      if (Notification.permission === 'granted') {
        new Notification('Alerta del Sistema SQM', {
          body: alert.message,
          icon: '/favicon.ico',
        });
      }
    });

    socket.on('exception', (error) => {
      console.error('WebSocket error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, [deviceId]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const sendCommand = useCallback((command: string, parameters?: any) => {
    if (socketRef.current && deviceId) {
      socketRef.current.emit('device_control', {
        deviceId,
        command,
        parameters,
      });
    }
  }, [deviceId]);

  const requestHistory = useCallback((hours: number = 24) => {
    if (socketRef.current && deviceId) {
      socketRef.current.emit('request_history', {
        deviceId,
        hours,
      });
    }
  }, [deviceId]);

  useEffect(() => {
    const cleanup = connect();
    return () => {
      cleanup?.();
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    sensorData,
    sendCommand,
    requestHistory,
    disconnect,
    connect,
  };
};