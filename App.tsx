import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  initTaskTable,
  fetchAllTasks,
  insertTaskRecord,
  toggleTaskCompletion,
  deleteTaskRecord,
  TaskRecord,
} from './src/database/taskDao';

export default function App() {
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const loadTasks = useCallback(() => {
    const list = fetchAllTasks();
    setTasks(list);
  }, []);

  useEffect(() => {
    initTaskTable();
    loadTasks();
  }, [loadTasks]);

  const handleAddTask = () => {
    if (!title.trim()) {
      Alert.alert('Помилка', 'Будь ласка, введіть заголовок задачі');
      return;
    }

    const newId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    insertTaskRecord(newId, title.trim(), description.trim());
    
    setTitle('');
    setDescription('');
    loadTasks();
  };

  const handleToggleTask = (id: string, currentStatus: number) => {
    toggleTaskCompletion(id, currentStatus);
    loadTasks();
  };

  // Видалення задачі із БД та оновлення стану
  const handleDeleteTask = (id: string, taskTitle: string) => {
    Alert.alert(
      'Видалення задачі',
      `Ви дійсно бажаєте видалити задачу "${taskTitle}"?`,
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Видалити',
          style: 'destructive',
          onPress: () => {
            deleteTaskRecord(id);
            loadTasks();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <Text style={styles.headerTitle}>TaskFlow 📋</Text>

        {/* Форма створення задачі */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Назва задачі..."
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Опис задачі (необов’язково)..."
            multiline
            numberOfLines={2}
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity style={styles.addBtn} onPress={handleAddTask}>
            <Text style={styles.addBtnText}>Додати задачу ➕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.listTitle}>Список задач:</Text>

        {/* Список усіх задач */}
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Список задач порожній</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <TouchableOpacity
                style={styles.taskTextContainer}
                onPress={() => handleToggleTask(item.id, item.is_completed)}
              >
                <Text
                  style={[
                    styles.taskTitle,
                    item.is_completed === 1 && styles.completedText,
                  ]}
                >
                  {item.is_completed === 1 ? '✅ ' : '⏳ '}
                  {item.title}
                </Text>
                {item.description ? (
                  <Text
                    style={[
                      styles.taskDescription,
                      item.is_completed === 1 && styles.completedText,
                    ]}
                  >
                    {item.description}
                  </Text>
                ) : null}
              </TouchableOpacity>

              {/* Кнопка видалення */}
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDeleteTask(item.id, item.title)}
              >
                <Text style={styles.deleteBtnText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 15,
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  addBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  addBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 15,
    marginTop: 20,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  taskTextContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  taskDescription: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 10,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },
  deleteBtnText: {
    fontSize: 16,
  },
});