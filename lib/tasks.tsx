// Define a Task type for better type safety
type Task = {
  id: number;
  title: string;
  description?: string;
  status?: string;
};

// Fetch all tasks for the current user
export const fetchTasks = async (accessToken: string): Promise<Task[]> => {
  const response = await fetch('http://localhost:3000/api/tasks', {
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
  const response = await fetch('http://localhost:3000/api/tasks', {
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
  id: number, // Changed to `number` to match the Task type
  updates: { title?: string; description?: string; status?: string }
): Promise<Task> => {
  const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(updates), // Send the updates object directly
  });

  if (!response.ok) {
    throw new Error('Failed to update task');
  }

  const data = await response.json();
  return data;
};

// Delete a task
export const deleteTask = async (
  id: number, // Changed to `number` to match the Task type
  accessToken: string
): Promise<void> => {
  const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
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