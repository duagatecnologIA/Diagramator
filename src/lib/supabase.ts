import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos de TypeScript para la base de datos
export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  company: string | null;
  role: 'user' | 'admin' | 'premium';
  created_at: string;
  updated_at: string;
};

export type Diagram = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  data: {
    nodes: any[];
    edges: any[];
    metadata?: any;
  };
  metadata: Record<string, any>;
  is_public: boolean;
  is_template: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
};

export type DiagramCollaborator = {
  id: string;
  diagram_id: string;
  user_id: string;
  permission: 'view' | 'edit' | 'admin';
  invited_by: string | null;
  created_at: string;
};

export type Folder = {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  parent_folder_id: string | null;
  created_at: string;
  updated_at: string;
};

export type DiagramComment = {
  id: string;
  diagram_id: string;
  user_id: string;
  node_id: string | null;
  content: string;
  resolved: boolean;
  parent_comment_id: string | null;
  created_at: string;
  updated_at: string;
};

