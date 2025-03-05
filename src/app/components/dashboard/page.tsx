'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthProvider';
import { fetchTasks, addTask, deleteTask, updateTask } from '@/lib/tasks';
import TaskForm from '../taskform/page'; // Ensure the correct import path

// Define the Task type (can be moved to a separate `types.ts` file for reusability)
type Task = {
  id: number;
  title: string;
  description?: string; // Optional field
  status?: string; // Optional field (if needed)
};

export default function Dashboard() {
  const { session } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch tasks when the component mounts or the session changes
  useEffect(() => {
    if (session) {
      setLoading(true);
      fetchTasks(session.access_token)
        .then((data) => {
          setTasks(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching tasks:', error);
          setLoading(false);
        });
    }
  }, [session]);

  // Handle adding a new task
 const handleAddTask = async (title: string, description: string) => {
  if (session) {
    try {
      const newTask = await addTask(session.access_token, title, description, 'pending');
      setTasks([...tasks, newTask]);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }
};

  // Handle deleting a task
  const handleDeleteTask = async (taskId: number) => {
    if (session) {
      try {
        await deleteTask(taskId, session.access_token);
        setTasks(tasks.filter((task) => task.id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  // Handle updating a task
  const handleUpdateTask = async (taskId: number, updates: { title: string; description: string }) => {
    if (session) {
      try {
        const updatedTask = await updateTask(session.access_token, taskId, updates);
        setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
        setEditingTask(null);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  // Show loading state
  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        {showForm ? 'Cancel' : 'Add Task'}
      </button>
      {showForm && <TaskForm onSubmit={handleAddTask} />}

      {/* Task List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <p className="text-gray-600">No tasks found.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="p-4 border rounded-md">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-gray-600">{task.description}</p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => setEditingTask(task)} // Open the popup form for editing
                  className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Popup Form for Updating Tasks */}
      {editingTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Task</h2>
                    <TaskForm
          onSubmit={(title, description) => handleUpdateTask(editingTask.id, { title, description })}
          initialValues={{
            title: editingTask.title,
            description: editingTask.description || '', // Provide a default value if description is undefined
          }}
        />
            <button
              onClick={() => setEditingTask(null)} // Close the popup
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}