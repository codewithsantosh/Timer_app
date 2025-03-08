'use client';
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
  Vibration,
  Alert,
} from 'react-native';
import { Award } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useAnalytics } from '../context/AnalyticsContext';

interface CompletionModalProps {
  timerName: string;
  onClose: () => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({ timerName, onClose }) => {
  const { colors } = useTheme();
  const { trackEvent } = useAnalytics();
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('Modal opened for:', timerName);
    trackEvent('timer_completion_modal_shown', { timer_name: timerName });
    Vibration.vibrate([0, 500, 200, 500]);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      console.log("Auto-closing modal...");
      onClose();
    }, 5000);

    return () => {
      console.log("Clearing timeout before unmount...");
      clearTimeout(timer);
    };
  }, [timerName, onClose]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal transparent={true} visible={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.container}>
        <Animated.View style={[styles.content, { transform: [{ scale: scaleAnim }] }]}>
          <Animated.View style={[styles.iconContainer, { transform: [{ rotate }] }]}>
            <Award size={40} color={colors.primary} />
          </Animated.View>
          <Text style={styles.title}>Timer Completed!</Text>
          <Text style={styles.message}>
            Congratulations! You've successfully completed "{timerName}".
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => {
            onClose();
          }}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '80%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 16,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CompletionModal;
