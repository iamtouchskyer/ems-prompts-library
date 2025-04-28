// This file contains a Supabase client with admin privileges
// Use this client only for operations that require bypassing RLS
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';

const SUPABASE_URL = "https://wldeklvaiidegtuuqmtp.supabase.co";
// 注意：实际部署时应从环境变量中获取此密钥，而不是硬编码
// 这个令牌需要保密，不要在客户端暴露
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsZGVrbHZhaWlkZWd0dXVxbXRwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTgxMzMzOSwiZXhwIjoyMDYxMzg5MzM5fQ.EZeQhmu0hx_NRt-6w0zgbafoxqunpdpRlrf2qvyl8yE"; // 填入您的服务角色密钥

export const adminSupabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);