'use client';

import type React from 'react';
import {createContext, useContext} from 'react';

type EventParams = Record<string, any>;

interface AnalyticsContextType {
  trackEvent: (eventName: string, params?: EventParams) => void;
  trackScreen: (screenName: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined,
);

export const AnalyticsProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const trackEvent = (eventName: string, params?: EventParams) => {
    console.log(`[Analytics] Event: ${eventName}`, params || {});
  };

  const trackScreen = (screenName: string) => {
    console.log(`[Analytics] Screen: ${screenName}`);
  };

  return (
    <AnalyticsContext.Provider value={{trackEvent, trackScreen}}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
