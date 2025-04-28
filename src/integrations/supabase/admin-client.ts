// This file provides admin functions that bypass RLS without creating a new client instance
import { supabase } from './client';
import type { Database } from '../../types/database';

// Service role key - should be kept secure
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsZGVrbHZhaWlkZWd0dXVxbXRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTgxMzMzOSwiZXhwIjoyMDYxMzg5MzM5fQ.EZeQhmu0hx_NRt-6w0zgbafoxqunpdpRlrf2qvyl8yE";

/**
 * Creates a new user in the users table using the service role key to bypass RLS
 * This function uses the existing Supabase client but adds the service role key for just this operation
 */
export async function createUserWithServiceRole(userData: {
  id: string;
  username: string;
  avatar_url: string | null;
  is_admin: boolean;
}) {
  const response = await fetch(`${supabase.supabaseUrl}/rest/v1/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabase.supabaseKey,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create user: ${JSON.stringify(errorData)}`);
  }

  return await response.json();
}