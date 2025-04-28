
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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

export const createPrompt = async (prompt: Omit<Prompt, 'id' | 'author_id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You need to be logged in to create a prompt',
        variant: 'destructive'
      });
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
      toast({
        title: 'Error',
        description: 'Failed to create prompt',
        variant: 'destructive'
      });
      throw error;
    }
    
    toast({
      title: 'Success',
      description: 'Prompt created successfully'
    });
    
    return data[0];
  } catch (error) {
    console.error('Failed to create prompt:', error);
    throw error;
  }
};

export const updatePrompt = async (id: string, updates: Partial<Prompt>) => {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating prompt:', error);
      toast({
        title: 'Error',
        description: 'Failed to update prompt',
        variant: 'destructive'
      });
      throw error;
    }
    
    toast({
      title: 'Success',
      description: 'Prompt updated successfully'
    });
    
    return data[0];
  } catch (error) {
    console.error('Failed to update prompt:', error);
    throw error;
  }
};

export const recordChangeHistory = async (promptId: string, action: string, details: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
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
