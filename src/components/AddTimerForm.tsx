'use client';
import type React from 'react';
import {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import {useTimerContext} from '../context/TimerContext';
import {useTheme} from '../context/ThemeContext';

interface AddTimerFormProps {
  existingCategories: string[];
  onSubmit: () => void;
  onCancel: () => void;
}

const AddTimerForm: React.FC<AddTimerFormProps> = ({
  existingCategories,
  onSubmit,
  onCancel,
}) => {
  const {addTimer} = useTimerContext();
  const {colors} = useTheme();

  const [name, setName] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [useNewCategory, setUseNewCategory] = useState(false);
  const [halfwayAlert, setHalfwayAlert] = useState(false);

  const [nameError, setNameError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [categoryError, setCategoryError] = useState('');

  const handleSubmit = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Timer name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    const mins = Number.parseInt(minutes) || 0;
    const secs = Number.parseInt(seconds) || 0;
    const totalSeconds = mins * 60 + secs;

    if (totalSeconds <= 0) {
      setTimeError('Timer duration must be greater than 0');
      isValid = false;
    } else {
      setTimeError('');
    }

    const selectedCategory = useNewCategory ? newCategory.trim() : category;
    if (!selectedCategory) {
      setCategoryError('Category is required');
      isValid = false;
    } else {
      setCategoryError('');
    }

    if (isValid) {
      addTimer({
        name: name.trim(),
        duration: totalSeconds,
        category: selectedCategory,
        halfwayAlert,
      });

      onSubmit();
    }
  };

  const styles = StyleSheet.create({
    container: {
      padding: 16,
    },
    inputGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
      color: colors.text,
    },
    input: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: colors.text,
    },
    errorText: {
      color: colors.accent,
      marginTop: 4,
      fontSize: 14,
    },
    timeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    timeInput: {
      flex: 1,
      marginRight: 8,
    },
    categorySelector: {
      marginBottom: 16,
    },
    categoryOption: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    categoryOptionText: {
      fontSize: 16,
      marginLeft: 8,
      color: colors.text,
    },
    categoriesList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
    },
    categoryChip: {
      backgroundColor: colors.primary + '20',
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
      margin: 4,
    },
    categoryChipSelected: {
      backgroundColor: colors.primary,
    },
    categoryChipText: {
      color: colors.primary,
      fontSize: 14,
    },
    categoryChipTextSelected: {
      color: 'white',
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    switchLabel: {
      fontSize: 16,
      color: colors.text,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 16,
    },
    button: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      marginLeft: 8,
    },
    cancelButton: {
      backgroundColor: colors.muted + '30',
    },
    submitButton: {
      backgroundColor: colors.primary,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    cancelText: {
      color: colors.text,
    },
    submitText: {
      color: 'white',
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Timer Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter timer name"
          placeholderTextColor={colors.muted}
          value={name}
          onChangeText={setName}
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Duration</Text>
        <View style={styles.timeContainer}>
          <View style={styles.timeInput}>
            <TextInput
              style={styles.input}
              placeholder="Minutes"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              value={minutes}
              onChangeText={setMinutes}
            />
          </View>
          <View style={styles.timeInput}>
            <TextInput
              style={styles.input}
              placeholder="Seconds"
              placeholderTextColor={colors.muted}
              keyboardType="number-pad"
              value={seconds}
              onChangeText={setSeconds}
            />
          </View>
        </View>
        {timeError ? <Text style={styles.errorText}>{timeError}</Text> : null}
      </View>

      <View style={styles.categorySelector}>
        <Text style={styles.label}>Category</Text>

        <View style={styles.categoryOption}>
          <TouchableOpacity onPress={() => setUseNewCategory(false)}>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {!useNewCategory && (
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: colors.primary,
                  }}
                />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.categoryOptionText}>
            Select existing category
          </Text>
        </View>

        {!useNewCategory && (
          <View style={styles.categoriesList}>
            {existingCategories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  category === cat && styles.categoryChipSelected,
                ]}
                onPress={() => setCategory(cat)}>
                <Text
                  style={[
                    styles.categoryChipText,
                    category === cat && styles.categoryChipTextSelected,
                  ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
            {existingCategories.length === 0 && (
              <Text style={{color: colors.muted, marginTop: 8}}>
                No categories yet. Create a new one below.
              </Text>
            )}
          </View>
        )}

        <View style={[styles.categoryOption, {marginTop: 16}]}>
          <TouchableOpacity onPress={() => setUseNewCategory(true)}>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {useNewCategory && (
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: colors.primary,
                  }}
                />
              )}
            </View>
          </TouchableOpacity>
          <Text style={styles.categoryOptionText}>Create new category</Text>
        </View>

        {useNewCategory && (
          <TextInput
            style={[styles.input, {marginTop: 8}]}
            placeholder="Enter new category name"
            placeholderTextColor={colors.muted}
            value={newCategory}
            onChangeText={setNewCategory}
          />
        )}

        {categoryError ? (
          <Text style={styles.errorText}>{categoryError}</Text>
        ) : null}
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Halfway Alert</Text>
        <Switch
          value={halfwayAlert}
          onValueChange={setHalfwayAlert}
          trackColor={{false: colors.muted, true: colors.primary + '70'}}
          thumbColor={halfwayAlert ? colors.primary : colors.border}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}>
          <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}>
          <Text style={[styles.buttonText, styles.submitText]}>Add Timer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddTimerForm;
