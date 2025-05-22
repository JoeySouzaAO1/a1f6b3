import type { Form } from '../types/form';

const API_BASE_URL = 'http://localhost:3000';

export const fetchFormGraph = async (): Promise<Form[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/forms`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch form graph: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching form graph:', error);
    throw error;
  }
};