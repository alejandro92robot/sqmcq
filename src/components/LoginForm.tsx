import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  Typography,
  Paper,
  Fade,
  Zoom,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Login as LoginIcon,
  Security as SecurityIcon,
  Diamond as DiamondIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

// Puedes reemplazar esta URL con tu propia imagen minera
const MINING_IMAGE_URL = "https://www.radioudec.cl/wp-content/uploads/2024/05/royalty.jpg";

export const LoginForm: React.FC = () => {
  const { login, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 🔧 Redirigir automáticamente cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData);
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh', // Cambiado de minHeight a height fijo
      width: '100vw',
      overflow: 'hidden', // Previene scroll en el contenedor principal
      position: 'fixed', // Fija la posición para evitar scroll
      top: 0,
      left: 0
    }}>
      {/* Columna del Formulario */}
      <Box 
        sx={{ 
          width: isMobile ? '100%' : '50%',
          height: '100%', // Ocupa toda la altura
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          position: 'relative',
          overflow: 'hidden', // Previene scroll interno
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 152, 0, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(26, 58, 95, 0.25) 0%, transparent 50%)
            `,
            animation: 'pulse 4s ease-in-out infinite alternate',
          },
          '@keyframes pulse': {
            '0%': { opacity: 0.6 },
            '100%': { opacity: 1 }
          }
        }}
      >
        {/* Partículas de fondo */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(2px 2px at 20% 30%, #d4af37 50%, transparent 100%),
              radial-gradient(2px 2px at 40% 70%, #ff9800 50%, transparent 100%),
              radial-gradient(2px 2px at 60% 20%, #1a3a5f 50%, transparent 100%),
              radial-gradient(2px 2px at 80% 50%, #d4af37 50%, transparent 100%),
              radial-gradient(2px 2px at 30% 80%, #ff9800 50%, transparent 100%)
            `,
            backgroundSize: '100% 100%',
            animation: 'float 20s infinite linear',
            '@keyframes float': {
              '0%': { transform: 'translateY(0px) translateX(0px)' },
              '25%': { transform: 'translateY(-20px) translateX(10px)' },
              '50%': { transform: 'translateY(0px) translateX(20px)' },
              '75%': { transform: 'translateY(20px) translateX(10px)' },
              '100%': { transform: 'translateY(0px) translateX(0px)' },
            }
          }}
        />

        {/* Contenedor del formulario */}
        <Box sx={{ 
          width: '100%', 
          maxWidth: 400, 
          px: 3, 
          position: 'relative', 
          zIndex: 1,
        }}>
          <Zoom in={true} timeout={800}>
            <Paper
              elevation={24}
              sx={{
                padding: { xs: 3, sm: 4, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                borderRadius: 3,
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                boxShadow: `
                  0 25px 50px rgba(0, 0, 0, 0.5),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #d4af37 0%, #ff9800 50%, #d4af37 100%)',
                }
              }}
            >
              {/* Header con iconos */}
              <Box sx={{ textAlign: 'center', mb: 3, width: '100%' }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mb: 2,
                    position: 'relative'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      width: 70,
                      height: 70,
                      background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
                      borderRadius: '50%',
                      animation: 'glow 2s ease-in-out infinite alternate',
                      '@keyframes glow': {
                        '0%': { opacity: 0.4, transform: 'scale(1)' },
                        '100%': { opacity: 0.8, transform: 'scale(1.1)' },
                      }
                    }}
                  />
                  <DiamondIcon sx={{ fontSize: 40, color: '#d4af37', mr: 2, zIndex: 1 }} />
                </Box>
                
                <Typography 
                  component="h1" 
                  variant="h4" 
                  gutterBottom 
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(45deg, #d4af37 30%, #ff9800 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 2px 10px rgba(212, 175, 55, 0.3)',
                    mb: 1,
                    fontSize: { xs: '1.75rem', sm: '2rem' }
                  }}
                >
                  SQM MINERÍA
                </Typography>
                
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)',
                    mb: 0.5,
                    fontWeight: 500,
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  Sistema de Monitoreo de Yodo
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: { xs: '0.75rem', sm: '0.8rem' }
                  }}
                >
                  Fluorescencia de Rayos X - Control y Análisis
                </Typography>
              </Box>

              <Fade in={true} timeout={1000}>
                <Box 
                  component="form" 
                  onSubmit={handleSubmit} 
                  sx={{ 
                    width: '100%',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  {error && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 2,
                        background: 'rgba(244, 67, 54, 0.1)',
                        border: '1px solid rgba(244, 67, 54, 0.3)',
                        borderRadius: 2,
                        color: '#ff6b6b',
                        '& .MuiAlert-icon': {
                          color: '#ff6b6b'
                        }
                      }}
                    >
                      {error}
                    </Alert>
                  )}
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={formData.email}
                    onChange={handleChange}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          borderWidth: 2,
                        },
                        '&:hover fieldset': {
                          borderColor: '#d4af37',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#d4af37',
                          boxShadow: '0 0 0 2px rgba(212, 175, 55, 0.1)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#d4af37',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#d4af37' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Contraseña"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        color: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          borderWidth: 2,
                        },
                        '&:hover fieldset': {
                          borderColor: '#d4af37',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#d4af37',
                          boxShadow: '0 0 0 2px rgba(212, 175, 55, 0.1)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#d4af37',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#d4af37' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ 
                      mt: 1,
                      mb: 2, 
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #d4af37 30%, #ff9800 90%)',
                      fontSize: '1rem',
                      fontWeight: 700,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      boxShadow: '0 8px 25px rgba(212, 175, 55, 0.3)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transition: 'left 0.5s',
                      },
                      '&:hover::before': {
                        left: '100%',
                      },
                      '&:hover': {
                        background: 'linear-gradient(45deg, #b8941f 30%, #e68900 90%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 35px rgba(212, 175, 55, 0.4)',
                      },
                      '&:active': {
                        transform: 'translateY(0px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                    disabled={isLoading}
                    startIcon={
                      isLoading ? 
                        <CircularProgress size={20} sx={{ color: 'white' }} /> : 
                        <LoginIcon />
                    }
                  >
                    {isLoading ? 'VERIFICANDO ACCESO...' : 'ACCESO A PLATAFORMA'}
                  </Button>

                  {/* Footer informativo */}
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      mt: 2, 
                      pt: 2, 
                      borderTop: '1px solid rgba(255, 255, 255, 0.1)' 
                    }}
                  >
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '0.7rem'
                      }}
                    >
                      ® Sistema seguro - Solo personal autorizado
                    </Typography>
                  </Box>
                </Box>
              </Fade>
            </Paper>
          </Zoom>
        </Box>
      </Box>

      {/* Columna de la Imagen - Solo en desktop */}
      {!isMobile && (
        <Box 
          sx={{
            width: '50%',
            height: '100%',
            backgroundImage: `url(${MINING_IMAGE_URL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            overflow: 'hidden', // Previene scroll en la imagen también
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(26, 58, 95, 0.3) 0%, rgba(13, 29, 48, 0.5) 100%)',
            }
          }}
        >
          {/* Texto superpuesto en la imagen */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 60,
              left: 40,
              right: 40,
              color: 'white',
              zIndex: 2
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                fontSize: { md: '1.5rem', lg: '1.75rem' }
              }}
            >
              Tecnología Minera Avanzada
            </Typography>
            <Typography 
              variant="body1"
              sx={{
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                opacity: 0.9,
                fontSize: { md: '1rem', lg: '1.1rem' }
              }}
            >
              Monitoreo en tiempo real de procesos mineros con la más alta tecnología en fluorescencia de rayos X
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};