'use client';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Plus, Filter, Sun, Moon, Monitor} from 'lucide-react-native';
import { useTimerContext } from '../../context/TimerContext';
import { useTheme } from '../../context/ThemeContext';
import CategoryGroup from '../../components/CategoryGroup';
import AddTimerForm from '../../components/AddTimerForm';

const HomeScreen = () => {
  const {state} = useTimerContext();
  const {colors, theme, setTheme, isDark} = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [completedTimer, setCompletedTimer] = useState<string | null>(null);

  useEffect(() => {
    const justCompletedTimer = state.timers.find(
      timer => timer.status === 'completed' && timer.remainingTime === 0,
    );

    if (justCompletedTimer && !completedTimer) {
      setCompletedTimer(justCompletedTimer.name);
    }
  }, [state.timers, completedTimer]);

  const filteredCategories = selectedCategory
    ? state.categories.filter(category => category === selectedCategory)
    : state.categories;

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
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '90%',
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
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      color: colors.text,
    },
    filterItem: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingHorizontal: 12,
    },
    filterText: {
      fontSize: 16,
      color: colors.text,
    },
    selectedFilter: {
      backgroundColor: colors.primary + '20',
    },
    themeSelector: {
      marginTop: 20,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 16,
    },
    themeTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 12,
      color: colors.text,
    },
    themeOptions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    themeOption: {
      alignItems: 'center',
      padding: 8,
      borderRadius: 8,
      width: 80,
    },
    themeOptionSelected: {
      backgroundColor: colors.primary + '20',
    },
    themeText: {
      marginTop: 4,
      fontSize: 12,
      color: colors.text,
    },
  });

  const handleClose = () => {
    console.log('Closing Modal...');
    setCompletedTimer(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background}/>
      <View style={styles.header}>
        <Text style={styles.title}>Timers</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setFilterModalVisible(true)}>
            <Filter size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setModalVisible(true)}>
            <Plus size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {state.timers.length === 0 ? (
          <View style={styles.emptyState}>
            <Plus size={48} color={colors.muted} />
            <Text style={styles.emptyStateText}>
              No timers yet. Tap the + button to create your first timer.
            </Text>
          </View>
        ) : (
          <ScrollView>
            {filteredCategories.map(category => (
              <CategoryGroup
                key={category}
                category={category}
                timers={state.timers.filter(
                  timer => timer.category === category,
                )}
                onTimerComplete={timerName => setCompletedTimer(timerName)}
              />
            ))}
          </ScrollView>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Timer</Text>
            <AddTimerForm
              existingCategories={state.categories}
              onSubmit={() => setModalVisible(false)}
              onCancel={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Timers</Text>

            <FlatList
              data={['All Categories', ...state.categories]}
              keyExtractor={item => item}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.filterItem,
                    (item === 'All Categories' && selectedCategory === null) ||
                    item === selectedCategory
                      ? styles.selectedFilter
                      : null,
                  ]}
                  onPress={() => {
                    setSelectedCategory(
                      item === 'All Categories' ? null : item,
                    );
                    setFilterModalVisible(false);
                  }}>
                  <Text style={styles.filterText}>{item}</Text>
                </TouchableOpacity>
              )}
            />

            <View style={styles.themeSelector}>
              <Text style={styles.themeTitle}>Theme</Text>
              <View style={styles.themeOptions}>
                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    theme === 'light' ? styles.themeOptionSelected : null,
                  ]}
                  onPress={() => setTheme('light')}>
                  <Sun size={24} color={colors.text} />
                  <Text style={styles.themeText}>Light</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    theme === 'dark' ? styles.themeOptionSelected : null,
                  ]}
                  onPress={() => setTheme('dark')}>
                  <Moon size={24} color={colors.text} />
                  <Text style={styles.themeText}>Dark</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.themeOption,
                    theme === 'system' ? styles.themeOptionSelected : null,
                  ]}
                  onPress={() => setTheme('system')}>
                  <Monitor size={24} color={colors.text} />
                  <Text style={styles.themeText}>System</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* {completedTimer && (
        <CompletionModal
          timerName={completedTimer}
          onClose={handleClose}
        />
      )} */}
    </SafeAreaView>
  );
};

export default HomeScreen;
