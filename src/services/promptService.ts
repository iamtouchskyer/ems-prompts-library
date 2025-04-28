
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Prompt {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author_id: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
}

export type CreatePromptInput = Omit<Prompt, 'id' | 'author_id' | 'created_at' | 'updated_at'>;

export const fetchPrompts = async () => {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching prompts:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch prompts:', error);
    return [];
  }
};

export const createPrompt = async (prompt: CreatePromptInput) => {
  try {
    // Check for authenticated session first
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error when creating prompt:', sessionError);
      toast.error('Authentication error. Please try signing in again.');
      throw new Error('Session error');
    }
    
    if (!sessionData.session) {
      console.error('No active session found');
      toast.error('You need to be logged in to create a prompt');
      throw new Error('Not authenticated');
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error when creating prompt:', authError);
      toast.error('You need to be logged in to create a prompt');
      throw new Error('Not authenticated');
    }
    
    const { data, error } = await supabase
      .from('prompts')
      .insert([
        {
          ...prompt,
          author_id: user.id,
        }
      ])
      .select();
    
    if (error) {
      console.error('Error creating prompt:', error);
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error('Failed to create prompt:', error);
    throw error;
  }
};

export const updatePrompt = async (id: string, updates: Partial<Prompt>) => {
  try {
    // Check for authenticated session first
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      toast.error('You need to be logged in to update a prompt');
      throw new Error('Not authenticated');
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error when updating prompt:', authError);
      toast.error('You need to be logged in to update a prompt');
      throw new Error('Not authenticated');
    }
    
    const { data, error } = await supabase
      .from('prompts')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating prompt:', error);
      throw error;
    }
    
    // If successful, record the change history
    await recordChangeHistory(id, 'update', JSON.stringify(updates));
    
    return data[0];
  } catch (error) {
    console.error('Failed to update prompt:', error);
    throw error;
  }
};

export const recordChangeHistory = async (promptId: string, action: string, details: string) => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !sessionData.session) {
      console.warn('Not recording history - user not authenticated');
      return;
    }
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.warn('Not recording history - user not authenticated');
      return;
    }
    
    const { error } = await supabase
      .from('change_history')
      .insert([
        {
          prompt_id: promptId,
          user_id: user.id,
          action: action,
          details: details,
        }
      ]);
    
    if (error) {
      console.error('Error recording change history:', error);
      return;
    }
  } catch (error) {
    console.error('Failed to record change history:', error);
  }
};
