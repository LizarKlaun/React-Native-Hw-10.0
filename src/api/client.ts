// Клієнт для підключення до зовнішнього API
export const API_BASE_URL = 'https://api.example.com';

export const fetchRemoteTasks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('API Fetch Error:', error);
    return [];
  }
};