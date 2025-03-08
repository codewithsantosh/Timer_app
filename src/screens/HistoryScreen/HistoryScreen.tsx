'use client';
import {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Share,
  Modal,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Clock, Download, Trash2} from 'lucide-react-native';
import {useTimerContext} from '../../context/TimerContext';
import {useTheme} from '../../context/ThemeContext';

const HistoryScreen = () => {
  const {state, clearHistory, exportData} = useTimerContext();
  const {colors} = useTheme();
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleExport = async () => {
    try {
      const jsonData = await exportData();
      await Share.share({
        message: jsonData,
        title: 'Timer Data Export',
      });
    } catch (error) {
      Alert.alert('Export Failed', 'Could not export timer data.');
    }
  };

  const handleClearHistory = () => {
    setConfirmModalVisible(false);
    clearHistory();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    iconButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: colors.primary + '20',
    },
    content: {
      flex: 1,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.muted,
      textAlign: 'center',
      marginTop: 12,
    },
    historyItem: {
      backgroundColor: colors.card,
      padding: 16,
      marginHorizontal: 16,
      marginTop: 16,
      borderRadius: 8,
      shadowColor: '#333',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 5,
    },

    historyItemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    historyItemName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    historyItemCategory: {
      fontSize: 14,
      color: colors.primary,
    },
    historyItemDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    historyItemTime: {
      fontSize: 14,
      color: colors.muted,
    },
    historyItemDuration: {
      fontSize: 14,
      color: colors.muted,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: colors.text,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 16,
    },
    modalButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginLeft: 8,
      borderRadius: 8,
    },
    cancelButton: {
      backgroundColor: colors.muted + '30',
    },
    confirmButton: {
      backgroundColor: colors.accent,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    cancelText: {
      color: colors.text,
    },
    confirmText: {
      color: 'white',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} />
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={handleExport}>
            <Download size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setConfirmModalVisible(true)}>
            <Trash2 size={24} color={colors.accent} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {state.history.length === 0 ? (
          <View style={styles.emptyState}>
            <Clock size={48} color={colors.muted} />
            <Text style={styles.emptyStateText}>
              No timer history yet. Complete a timer to see it here.
            </Text>
          </View>
        ) : (
          <FlatList
            data={state.history}
            keyExtractor={item => item.id + item.completedAt.toString()}
            renderItem={({item}) => (
              <View style={styles.historyItem}>
                <View style={styles.historyItemHeader}>
                  <Text style={styles.historyItemName}>{item.name}</Text>
                  <Text style={styles.historyItemCategory}>
                    {item.category}
                  </Text>
                </View>
                <View style={styles.historyItemDetails}>
                  <Text style={styles.historyItemTime}>
                    {formatDate(item.completedAt)}
                  </Text>
                  <Text style={styles.historyItemDuration}>
                    Duration: {formatDuration(item.duration)}
                  </Text>
                </View>
              </View>
            )}
          />
        )}
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Clear History</Text>
            <Text style={{color: colors.text}}>
              Are you sure you want to clear all timer history? This action
              cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setConfirmModalVisible(false)}>
                <Text style={[styles.buttonText, styles.cancelText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleClearHistory}>
                <Text style={[styles.buttonText, styles.confirmText]}>
                  Clear
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HistoryScreen;
