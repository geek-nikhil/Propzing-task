

// Fetch all tasks for the current user
export const fetchTasks = async (accessToken: string) => {
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
) => {
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
  id: string,
  updates: { title?: string; description?: string; status?: string }
) => {
    console.log(updates?.title)
  const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ title:updates.title , description : updates.description , status : 'pending' }),
  });

  if (!response.ok) {
    throw new Error('Failed to update task');
  }

  const data = await response.json();
  return data;
};

// Delete a task
export const deleteTask = async ( id: string,accessToken: string) => {
    console.log(id)
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

  return response;
};