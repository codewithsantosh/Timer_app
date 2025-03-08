'use client';
import type React from 'react';
import {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {Play, Pause, RotateCcw, Trash2} from 'lucide-react-native';
import {useTimerContext} from '../context/TimerContext';
import {useTheme} from '../context/ThemeContext';
import ProgressBar from './ProgressBar';

interface TimerItemProps {
  timer: any;
  onComplete: (timerName: string) => void;
}

const TimerItem: React.FC<TimerItemProps> = ({timer, onComplete}) => {
  const {startTimer, pauseTimer, resetTimer, deleteTimer} = useTimerContext();
  const {colors} = useTheme();
  const [showHalfwayAlert, setShowHalfwayAlert] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = (timer.duration - timer.remainingTime) / timer.duration;

  const getStatusColor = () => {
    switch (timer.status) {
      case 'running':
        return colors.primary;
      case 'paused':
        return colors.muted;
      case 'completed':
        return colors.accent;
      default:
        return colors.muted;
    }
  };

  const getStatusText = () => {
    switch (timer.status) {
      case 'running':
        return 'Running';
      case 'paused':
        return 'Paused';
      case 'completed':
        return 'Completed';
      default:
        return 'Ready';
    }
  };

  useEffect(() => {
    if (
      timer.halfwayAlert &&
      timer.status === 'running' &&
      !timer.halfwayAlertTriggered &&
      timer.remainingTime <= timer.duration / 2
    ) {
      setShowHalfwayAlert(true);
    }
  }, [timer]);

  useEffect(() => {
    if (showHalfwayAlert) {
      Alert.alert('Halfway Point', `You're halfway through "${timer.name}"!`, [
        {text: 'OK', onPress: () => setShowHalfwayAlert(false)},
      ]);
    }
  }, [showHalfwayAlert, timer.name]);

  useEffect(() => {
    if (timer.status === 'completed' && timer.remainingTime === 0) {
      onComplete(timer.name);
    }
  }, [timer.status, timer.remainingTime, timer.name, onComplete]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Timer',
      `Are you sure you want to delete "${timer.name}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTimer(timer.id),
        },
      ],
    );
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginVertical: 6,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    status: {
      fontSize: 12,
      color: getStatusColor(),
    },
    timeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    time: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
    },
    totalTime: {
      fontSize: 14,
      color: colors.muted,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 8,
    },
    actionButton: {
      marginLeft: 8,
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.primary + '20',
    },
    deleteButton: {
      backgroundColor: colors.accent + '20',
    },
    disabledButton: {
      opacity: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{timer.name}</Text>
        <Text style={styles.status}>{getStatusText()}</Text>
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.time}>{formatTime(timer.remainingTime)}</Text>
        <Text style={styles.totalTime}>/ {formatTime(timer.duration)}</Text>
      </View>

      <ProgressBar progress={progress} />

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}>
          <Trash2 size={20} color={colors.accent} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => resetTimer(timer.id)}>
          <RotateCcw size={20} color={colors.primary} />
        </TouchableOpacity>

        {timer.status === 'running' ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => pauseTimer(timer.id)}>
            <Pause size={20} color={colors.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.actionButton,
              timer.status === 'completed' && styles.disabledButton,
            ]}
            onPress={() => startTimer(timer.id)}
            disabled={timer.status === 'completed'}>
            <Play size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TimerItem;
