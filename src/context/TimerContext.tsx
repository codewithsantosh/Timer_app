'use client';
import type React from 'react';
import {createContext, useContext, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Timer = {
  id: string;
  name: string;
  duration: number;
  remainingTime: number;
  category: string;
  status: 'idle' | 'running' | 'paused' | 'completed';
  createdAt: number;
  halfwayAlert: boolean;
  halfwayAlertTriggered: boolean;
};

export type TimerHistory = {
  id: string;
  name: string;
  category: string;
  duration: number;
  completedAt: number;
};

type TimerState = {
  timers: Timer[];
  history: TimerHistory[];
  categories: string[];
};

type TimerAction =
  | {type: 'LOAD_DATA'; payload: TimerState}
  | {type: 'ADD_TIMER'; payload: Timer}
  | {type: 'UPDATE_TIMER'; payload: Timer}
  | {type: 'DELETE_TIMER'; payload: string}
  | {type: 'COMPLETE_TIMER'; payload: {timerId: string; completedAt: number}}
  | {type: 'RESET_TIMER'; payload: string}
  | {type: 'START_TIMER'; payload: string}
  | {type: 'PAUSE_TIMER'; payload: string}
  | {type: 'TICK_TIMER'; payload: string}
  | {type: 'START_CATEGORY'; payload: string}
  | {type: 'PAUSE_CATEGORY'; payload: string}
  | {type: 'RESET_CATEGORY'; payload: string}
  | {type: 'CLEAR_HISTORY'}
  | {type: 'TRIGGER_HALFWAY_ALERT'; payload: string};

type TimerContextType = {
  state: TimerState;
  dispatch: React.Dispatch<TimerAction>;
  addTimer: (
    timer: Omit<
      Timer,
      'id' | 'createdAt' | 'status' | 'remainingTime' | 'halfwayAlertTriggered'
    >,
  ) => void;
  startTimer: (id: string) => void;
  pauseTimer: (id: string) => void;
  resetTimer: (id: string) => void;
  deleteTimer: (id: string) => void;
  startCategory: (category: string) => void;
  pauseCategory: (category: string) => void;
  resetCategory: (category: string) => void;
  clearHistory: () => void;
  exportData: () => Promise<string>;
};

const initialState: TimerState = {
  timers: [],
  history: [],
  categories: [],
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'LOAD_DATA':
      return action.payload;

    case 'ADD_TIMER': {
      const newCategories = !state.categories.includes(action.payload.category)
        ? [...state.categories, action.payload.category]
        : state.categories;

      return {
        ...state,
        timers: [...state.timers, action.payload],
        categories: newCategories,
      };
    }

    case 'UPDATE_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload.id ? action.payload : timer,
        ),
      };

    case 'DELETE_TIMER': {
      const updatedTimers = state.timers.filter(
        timer => timer.id !== action.payload,
      );
      const usedCategories = new Set(
        updatedTimers.map(timer => timer.category),
      );
      const updatedCategories = state.categories.filter(category =>
        usedCategories.has(category),
      );

      return {
        ...state,
        timers: updatedTimers,
        categories: updatedCategories,
      };
    }

    case 'COMPLETE_TIMER': {
      const {timerId, completedAt} = action.payload;
      const timer = state.timers.find(t => t.id === timerId);

      if (!timer) return state;

      const historyEntry: TimerHistory = {
        id: timer.id,
        name: timer.name,
        category: timer.category,
        duration: timer.duration,
        completedAt,
      };

      return {
        ...state,
        timers: state.timers.map(t =>
          t.id === timerId ? {...t, status: 'completed', remainingTime: 0} : t,
        ),
        history: [historyEntry, ...state.history],
      };
    }

    case 'RESET_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload
            ? {
                ...timer,
                remainingTime: timer.duration,
                status: 'idle',
                halfwayAlertTriggered: false,
              }
            : timer,
        ),
      };

    case 'START_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload && timer.status !== 'completed'
            ? {...timer, status: 'running'}
            : timer,
        ),
      };

    case 'PAUSE_TIMER':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload && timer.status === 'running'
            ? {...timer, status: 'paused'}
            : timer,
        ),
      };

    case 'TICK_TIMER': {
      const timer = state.timers.find(t => t.id === action.payload);

      if (!timer || timer.status !== 'running') return state;

      const newRemainingTime = Math.max(0, timer.remainingTime - 1);
      const newStatus = newRemainingTime === 0 ? 'completed' : 'running';

      if (newRemainingTime === 0) {
        const historyEntry: TimerHistory = {
          id: timer.id,
          name: timer.name,
          category: timer.category,
          duration: timer.duration,
          completedAt: Date.now(),
        };

        return {
          ...state,
          timers: state.timers.map(t =>
            t.id === action.payload
              ? {...t, remainingTime: newRemainingTime, status: newStatus}
              : t,
          ),
          history: [historyEntry, ...state.history],
        };
      }

      return {
        ...state,
        timers: state.timers.map(t =>
          t.id === action.payload ? {...t, remainingTime: newRemainingTime} : t,
        ),
      };
    }

    case 'START_CATEGORY':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.category === action.payload && timer.status !== 'completed'
            ? {...timer, status: 'running'}
            : timer,
        ),
      };

    case 'PAUSE_CATEGORY':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.category === action.payload && timer.status === 'running'
            ? {...timer, status: 'paused'}
            : timer,
        ),
      };

    case 'RESET_CATEGORY':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.category === action.payload
            ? {
                ...timer,
                remainingTime: timer.duration,
                status: 'idle',
                halfwayAlertTriggered: false,
              }
            : timer,
        ),
      };

    case 'CLEAR_HISTORY':
      return {
        ...state,
        history: [],
      };

    case 'TRIGGER_HALFWAY_ALERT':
      return {
        ...state,
        timers: state.timers.map(timer =>
          timer.id === action.payload
            ? {...timer, halfwayAlertTriggered: true}
            : timer,
        ),
      };

    default:
      return state;
  }
}

export const TimerProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('timerData');
        if (storedData) {
          dispatch({type: 'LOAD_DATA', payload: JSON.parse(storedData)});
        }
      } catch (error) {
        console.error('Failed to load data from storage', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('timerData', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save data to storage', error);
      }
    };

    saveData();
  }, [state]);

  useEffect(() => {
    const interval = setInterval(() => {
      state.timers.forEach(timer => {
        if (timer.status === 'running') {
          dispatch({type: 'TICK_TIMER', payload: timer.id});

          if (
            timer.halfwayAlert &&
            !timer.halfwayAlertTriggered &&
            timer.remainingTime <= timer.duration / 2
          ) {
            dispatch({type: 'TRIGGER_HALFWAY_ALERT', payload: timer.id});
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.timers]);

  const addTimer = (
    timerData: Omit<
      Timer,
      'id' | 'createdAt' | 'status' | 'remainingTime' | 'halfwayAlertTriggered'
    >,
  ) => {
    const newTimer: Timer = {
      ...timerData,
      id: Date.now().toString(),
      createdAt: Date.now(),
      status: 'idle',
      remainingTime: timerData.duration,
      halfwayAlertTriggered: false,
    };

    dispatch({type: 'ADD_TIMER', payload: newTimer});
  };

  const startTimer = (id: string) => {
    dispatch({type: 'START_TIMER', payload: id});
  };

  const pauseTimer = (id: string) => {
    dispatch({type: 'PAUSE_TIMER', payload: id});
  };

  const resetTimer = (id: string) => {
    dispatch({type: 'RESET_TIMER', payload: id});
  };

  const deleteTimer = (id: string) => {
    dispatch({type: 'DELETE_TIMER', payload: id});
  };

  const startCategory = (category: string) => {
    dispatch({type: 'START_CATEGORY', payload: category});
  };

  const pauseCategory = (category: string) => {
    dispatch({type: 'PAUSE_CATEGORY', payload: category});
  };

  const resetCategory = (category: string) => {
    dispatch({type: 'RESET_CATEGORY', payload: category});
  };

  const clearHistory = () => {
    dispatch({type: 'CLEAR_HISTORY'});
  };

  const exportData = async (): Promise<string> => {
    try {
      const jsonData = JSON.stringify(state, null, 2);
      return jsonData;
    } catch (error) {
      console.error('Failed to export data', error);
      throw error;
    }
  };

  return (
    <TimerContext.Provider
      value={{
        state,
        dispatch,
        addTimer,
        startTimer,
        pauseTimer,
        resetTimer,
        deleteTimer,
        startCategory,
        pauseCategory,
        resetCategory,
        clearHistory,
        exportData,
      }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
};
