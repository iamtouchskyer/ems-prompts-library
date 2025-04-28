import { supabase } from "@/integrations/supabase/client";

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
    // 使用Supabase客户端直接查询change_history表
    const { data, error } = await supabase
      .from('change_history')
      .select(`
        id,
        change_type,
        change_description,
        created_at,
        users!change_history_user_id_fkey (username),
        prompts!change_history_prompt_id_fkey (title)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // 转换数据格式以匹配HistoryRecord接口
    return (data || []).map(record => ({
      id: record.id,
      user_name: record.users?.username || 'Anonymous',
      prompt_title: record.prompts?.title || 'Unknown',
      change_type: record.change_type,
      change_description: record.change_description,
      created_at: record.created_at
    }));
  } catch (error) {
    console.error('Error fetching history:', error);
    return [];
  }
}
