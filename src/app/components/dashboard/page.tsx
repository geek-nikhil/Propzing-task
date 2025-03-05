// src/app/dashboard/page.tsx (or wherever your Dashboard lives)
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthProvider';
import { fetchTasks, addTask, deleteTask, updateTask } from '@/lib/tasks';

// Define the Task type
type Task = {
  id: number;
  title: string;
  description?: string;
  status?: string;
};

export default function Dashboard() {
  const { session } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState(''); // Form state for adding tasks
  const [description, setDescription] = useState(''); // Form state for adding tasks
  const [editTitle, setEditTitle] = useState(''); // Form state for editing tasks
  const [editDescription, setEditDescription] = useState(''); // Form state for editing tasks

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
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (session) {
      try {
        const newTask = await addTask(session.access_token, title, description, 'pending');
        setTasks([...tasks, newTask]);
        setShowForm(false);
        setTitle(''); // Reset form
        setDescription(''); // Reset form
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
  const handleUpdateTask = async (e: React.FormEvent, taskId: number) => {
    e.preventDefault();
    if (session) {
      try {
        const updatedTask = await updateTask(session.access_token, taskId, {
          title: editTitle,
          description: editDescription,
        });
        setTasks(tasks.map((task) => (task.id === taskId ? updatedTask : task)));
        setEditingTask(null);
        setEditTitle(''); // Reset edit form
        setEditDescription(''); // Reset edit form
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  };

  // Populate edit form when editingTask changes
  useEffect(() => {
    if (editingTask) {
      setEditTitle(editingTask.title);
      setEditDescription(editingTask.description || '');
    }
  }, [editingTask]);

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

      {/* Add Task Form (Inline) */}
      {showForm && (
        <form onSubmit={handleAddTask} className="mb-4 p-4 border rounded-md">
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Task
          </button>
        </form>
      )}

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
                  onClick={() => setEditingTask(task)}
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

      {/* Update Task Form (Inline Popup) */}
      {editingTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Update Task</h2>
            <form onSubmit={(e) => handleUpdateTask(e, editingTask.id)} className="mb-4">
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Title:</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Description:</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Update Task
              </button>
            </form>
            <button
              onClick={() => setEditingTask(null)}
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