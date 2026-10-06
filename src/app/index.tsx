import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Finish mobile app project',
    completed: false,
  },
  {
    id: '2',
    title: 'Review React Native notes',
    completed: false,
  },
  {
    id: '3',
    title: 'Submit weekly assignment',
    completed: true,
  },
];

const TASKS_STORAGE_KEY = '@mobile_task_manager_tasks';

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved tasks when the home screen opens.
  useEffect(() => {
    loadTasks();
  }, []);

  // Save the current tasks whenever the task list changes.
  useEffect(() => {
    if (!isLoading) {
      saveTasks();
    }
  }, [tasks, isLoading]);

  // Load the saved tasks from AsyncStorage.
  async function loadTasks() {
    try {
      const savedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);

      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Save the current task list to AsyncStorage.
  async function saveTasks() {
    try {
      await AsyncStorage.setItem(
        TASKS_STORAGE_KEY,
        JSON.stringify(tasks)
      );
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  }

  // Toggle a task between completed and incomplete.
  function toggleTask(id: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  // Remove a task from the task list.
  function deleteTask(id: string) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  }

  // Create a new task and add it to the task list.
  function addTask() {
    const title = newTaskTitle.trim();

    if (!title) {
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
    setNewTaskTitle('');
    setIsAddingTask(false);
  }

  // Cancel the add-task form and clear the input field.
  function cancelAddingTask() {
    setNewTaskTitle('');
    setIsAddingTask(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>My Tasks</Text>

        <Text style={styles.subtitle}>
          Keep track of what you need to get done.
        </Text>

        <View style={styles.taskList}>
          {tasks.map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <Pressable
                style={styles.taskContent}
                onPress={() => toggleTask(task.id)}
              >
                <View
                  style={[
                    styles.checkbox,
                    task.completed && styles.checkboxCompleted,
                  ]}
                >
                  {task.completed && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>

                <Text
                  style={[
                    styles.taskTitle,
                    task.completed && styles.taskCompleted,
                  ]}
                >
                  {task.title}
                </Text>
              </Pressable>

              <Pressable
                style={styles.deleteButton}
                onPress={() => deleteTask(task.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          ))}
        </View>

        {isAddingTask ? (
          <View style={styles.addTaskContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter a task..."
              placeholderTextColor="#9CA3AF"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              autoFocus
              onSubmitEditing={addTask}
              returnKeyType="done"
            />

            <View style={styles.buttonRow}>
              <Pressable
                style={styles.cancelButton}
                onPress={cancelAddingTask}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={styles.saveButton}
                onPress={addTask}
              >
                <Text style={styles.saveButtonText}>Add Task</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            style={styles.addButton}
            onPress={() => setIsAddingTask(true)}
          >
            <Text style={styles.addButtonText}>+ Add Task</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#6B7280',
  },

  taskList: {
    marginTop: 32,
    gap: 12,
  },

  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#166534',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  checkboxCompleted: {
    backgroundColor: '#166534',
  },

  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  taskTitle: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },

  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },

  deleteButton: {
    marginLeft: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  deleteButtonText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },

  addTaskContainer: {
    marginTop: 28,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },

  cancelButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },

  saveButton: {
    flex: 1,
    backgroundColor: '#166534',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  addButton: {
    marginTop: 28,
    backgroundColor: '#D97706',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});