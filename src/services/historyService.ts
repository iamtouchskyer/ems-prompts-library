
interface HistoryRecord {
  id: number;
  user_name: string;
  prompt_title: string;
  change_type: string;
  change_description: string;
  created_at: string;
}

export async function fetchHistory(): Promise<HistoryRecord[]> {
  try {
    const response = await fetch('/api/history');
    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
}
