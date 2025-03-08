import {useEffect, useState} from 'react';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  AppState,
  AppStateStatus,
  LogBox,
  Platform,
  StatusBar,
} from 'react-native';
import {Clock, History} from 'lucide-react-native';
import {TimerProvider} from './src/context/TimerContext';
import {ThemeProvider} from './src/context/ThemeContext';

import {AnalyticsProvider} from './src/context/AnalyticsContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import HomeScreen from './src/screens/HomeScreen/HomeScreen';
import SplashScreen from './src/screens/SplashScreen/SplashScreen';
import HistoryScreen from './src/screens/HistoryScreen/HistoryScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        console.log('App state changed to', nextAppState);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <AnalyticsProvider>
          <ThemeProvider>
            <TimerProvider>
              <NavigationContainer>
                <Tab.Navigator
                  screenOptions={({route}) => ({
                    tabBarIcon: ({color, size}) => {
                      if (route.name === 'Timers') {
                        return <Clock size={size} color={color} />;
                      } else if (route.name === 'History') {
                        return <History size={size} color={color} />;
                      }
                      return null;
                    },
                    tabBarActiveTintColor: '#6366f1',
                    tabBarInactiveTintColor: 'gray',
                    headerShown: false,
                    tabBarStyle: {
                      elevation: 2,
                      height: 60,
                      paddingBottom: 8,
                      paddingTop: 8,
                      borderRadius: 100,
                      borderTopWidth: 0,
                      backgroundColor: 'white',
                      marginBottom: 10,
                      marginHorizontal: 30,
                    },

                    tabBarLabelStyle: {
                      fontSize: 10,
                      fontWeight: '500',
                    },
                  })}>
                  <Tab.Screen name="Timers" component={HomeScreen} />
                  <Tab.Screen name="History" component={HistoryScreen} />
                </Tab.Navigator>
              </NavigationContainer>
            </TimerProvider>
          </ThemeProvider>
        </AnalyticsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
