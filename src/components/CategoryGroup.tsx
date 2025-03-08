'use client';
import type React from 'react';
import {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react-native';
import {useTimerContext} from '../context/TimerContext';
import {useTheme} from '../context/ThemeContext';
import TimerItem from './TimerItem';

interface CategoryGroupProps {
  category: string;
  timers: Array<any>;
  onTimerComplete: (timerName: string) => void;
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({
  category,
  timers,
  onTimerComplete,
}) => {
  const [expanded, setExpanded] = useState(true);
  const {startCategory, pauseCategory, resetCategory} = useTimerContext();
  const {colors} = useTheme();

  const hasRunningTimers = timers.some(timer => timer.status === 'running');
  const hasNonCompletedTimers = timers.some(
    timer => timer.status !== 'completed',
  );

  const styles = StyleSheet.create({
    container: {
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 8,
      backgroundColor: colors.card,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 10,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: expanded ? 1 : 0,
      borderBottomColor: colors.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginLeft: 8,
    },
    actions: {
      flexDirection: 'row',
    },
    actionButton: {
      marginLeft: 8,
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.primary + '20',
    },
    disabledButton: {
      opacity: 0.5,
    },
    content: {
      padding: expanded ? 8 : 0,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => setExpanded(!expanded)}>
          {expanded ? (
            <ChevronUp size={20} color={colors.text} />
          ) : (
            <ChevronDown size={20} color={colors.text} />
          )}
          <Text style={styles.title}>{category}</Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              !hasNonCompletedTimers && styles.disabledButton,
            ]}
            onPress={() => startCategory(category)}
            disabled={!hasNonCompletedTimers}>
            <Play size={20} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              !hasRunningTimers && styles.disabledButton,
            ]}
            onPress={() => pauseCategory(category)}
            disabled={!hasRunningTimers}>
            <Pause size={20} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => resetCategory(category)}>
            <RotateCcw size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {expanded && (
        <View style={styles.content}>
          {timers.map(timer => (
            <TimerItem
              key={timer.id}
              timer={timer}
              onComplete={onTimerComplete}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default CategoryGroup;
