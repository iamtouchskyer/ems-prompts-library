
import { supabase } from "@/integrations/supabase/client";

export interface Prompt {
  id: string;
  title: string;
  description: string;
  author_id: string;
  tags: string[];
  created_at: string;
}

export const createPrompt = async (title: string, description: string, tags: string[]) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to create prompts');
  }

  const { data, error } = await supabase
    .from('prompts')
    .insert({
      title,
      content: description,
      author_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating prompt:', error);
    throw error;
  }

  // Record the change in history
  await recordChange(data.id, 'create', 'Created new prompt');

  return data;
};

export const updatePrompt = async (id: string, title: string, description: string, tags: string[]) => {
  const { data, error } = await supabase
    .from('prompts')
    .update({
      title,
      content: description,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating prompt:', error);
    throw error;
  }

  await recordChange(id, 'update', 'Updated prompt');

  return data;
};

const recordChange = async (promptId: string, changeType: string, description: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return;

  const { error } = await supabase
    .from('change_history')
    .insert({
      prompt_id: promptId,
      user_id: user.id,
      change_type: changeType,
      change_description: description,
    });

  if (error) {
    console.error('Error recording change:', error);
  }
};
