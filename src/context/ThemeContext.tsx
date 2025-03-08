'use client';
import type React from 'react';
import {createContext, useContext, useState, useEffect} from 'react';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  setTheme: (theme: ThemeType) => void;
  colors: {
    background: string;
    card: string;
    text: string;
    border: string;
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('system');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setThemeState(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Failed to load theme preference', error);
      }
    };

    loadTheme();
  }, []);

  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme preference', error);
    }
  };

  const isDark =
    theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark';

  const colors = {
    background: isDark ? '#121212' : '#f8f9fa',
    card: isDark ? '#1e1e1e' : '#ffffff',
    text: isDark ? '#e0e0e0' : '#212529',
    border: isDark ? '#333333' : '#e9ecef',
    primary: '#6366f1',
    secondary: isDark ? '#4f46e5' : '#818cf8',
    accent: '#f43f5e',
    muted: isDark ? '#6b7280' : '#9ca3af',
  };

  return (
    <ThemeContext.Provider value={{theme, isDark, setTheme, colors}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
