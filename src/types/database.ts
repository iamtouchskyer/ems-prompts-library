
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          is_admin: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar_url?: string | null;
          is_admin?: boolean;
          created_at?: string;
        };
      };
      prompts: {
        Row: {
          id: string;
          title: string;
          content: string;
          author_id: string;
          created_at: string;
          updated_at: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
      };
    };
  };
}
