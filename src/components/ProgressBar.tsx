import type React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '../context/ThemeContext';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({progress}) => {
  const {colors} = useTheme();

  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  const getProgressColor = () => {
    if (clampedProgress < 0.3) return colors.accent;
    if (clampedProgress < 0.7) return colors.primary;
    return '#10b981';
  };

  const styles = StyleSheet.create({
    container: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progress: {
      height: '100%',
      width: `${clampedProgress * 100}%`,
      backgroundColor: getProgressColor(),
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.progress} />
    </View>
  );
};

export default ProgressBar;
