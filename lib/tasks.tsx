// src/lib/tasks.ts

// Define a Task type for better type safety
type Task = {
  id: number;
  title: string;
  description?: string;
  status?: string;
};

// Base API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/tasks'; // Fallback for safety

// Fetch all tasks for the current user
export const fetchTasks = async (accessToken: string): Promise<Task[]> => {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  const data = await response.json();
  return data;
};

// Add a new task
export const addTask = async (
  accessToken: string,
  title: string,
  description: string,
  status: string
): Promise<Task> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ title, description, status }),
  });

  if (!response.ok) {
    throw new Error('Failed to add task');
  }

  const data = await response.json();
  return data;
};

// Update a task
export const updateTask = async (
  accessToken: string,
  id: number,
  updates: { title?: string; description?: string; status?: string }
): Promise<Task> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update task');
  }

  const data = await response.json();
  return data;
};

// Delete a task
export const deleteTask = async (id: number, accessToken: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
};