-- ============================================
-- DIAGRAMATOR - SUPABASE DATABASE SETUP
-- ============================================
-- Este script crea todas las tablas, índices, políticas RLS,
-- triggers y funciones necesarias para Diagramator
-- ============================================

-- PASO 1: Crear tablas principales
-- ============================================

-- Tabla de perfiles de usuario (extiende auth.users de Supabase)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company TEXT,
  role TEXT DEFAULT 'user', -- 'user', 'admin', 'premium'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de diagramas
CREATE TABLE diagrams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Nuevo Diagrama',
  description TEXT,
  thumbnail_url TEXT, -- URL de imagen preview del diagrama
  data JSONB NOT NULL, -- JSON con nodes y edges
  metadata JSONB DEFAULT '{}', -- Información adicional (versión, tags, etc.)
  is_public BOOLEAN DEFAULT false,
  is_template BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de versiones de diagramas (historial)
CREATE TABLE diagram_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  diagram_id UUID REFERENCES diagrams(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  data JSONB NOT NULL,
  changes_description TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(diagram_id, version_number)
);

-- Tabla de colaboradores (compartir diagramas)
CREATE TABLE diagram_collaborators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  diagram_id UUID REFERENCES diagrams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  permission TEXT DEFAULT 'view', -- 'view', 'edit', 'admin'
  invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(diagram_id, user_id)
);

-- Tabla de carpetas/categorías
CREATE TABLE folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT DEFAULT 'folder',
  parent_folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla relacional: diagrama-carpeta
CREATE TABLE diagram_folders (
  diagram_id UUID REFERENCES diagrams(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
  PRIMARY KEY (diagram_id, folder_id)
);

-- Tabla de plantillas públicas
CREATE TABLE public_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  diagram_id UUID REFERENCES diagrams(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL, -- 'workflow', 'decision', 'process', etc.
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  downloads_count INTEGER DEFAULT 0,
  rating_avg DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de actividad/logs (opcional pero útil para analytics)
CREATE TABLE activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  diagram_id UUID REFERENCES diagrams(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'create', 'update', 'delete', 'share', 'export', 'view'
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de comentarios (colaboración)
CREATE TABLE diagram_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  diagram_id UUID REFERENCES diagrams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  node_id TEXT, -- ID del nodo al que se refiere el comentario (opcional)
  content TEXT NOT NULL,
  resolved BOOLEAN DEFAULT false,
  parent_comment_id UUID REFERENCES diagram_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PASO 2: Crear índices para optimización
-- ============================================

CREATE INDEX idx_diagrams_user_id ON diagrams(user_id);
CREATE INDEX idx_diagrams_created_at ON diagrams(created_at DESC);
CREATE INDEX idx_diagrams_is_public ON diagrams(is_public) WHERE is_public = true;
CREATE INDEX idx_diagrams_is_template ON diagrams(is_template) WHERE is_template = true;
CREATE INDEX idx_diagram_versions_diagram_id ON diagram_versions(diagram_id);
CREATE INDEX idx_diagram_collaborators_user_id ON diagram_collaborators(user_id);
CREATE INDEX idx_diagram_collaborators_diagram_id ON diagram_collaborators(diagram_id);
CREATE INDEX idx_folders_user_id ON folders(user_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX idx_diagram_comments_diagram_id ON diagram_comments(diagram_id);

-- Índice GIN para búsqueda en JSONB
CREATE INDEX idx_diagrams_data_gin ON diagrams USING GIN (data);
CREATE INDEX idx_diagrams_metadata_gin ON diagrams USING GIN (metadata);

-- PASO 3: Habilitar Row Level Security (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagrams ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagram_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagram_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagram_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagram_comments ENABLE ROW LEVEL SECURITY;

-- PASO 4: Crear políticas RLS
-- ============================================

-- Policies para profiles
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies para diagrams
CREATE POLICY "Los usuarios pueden ver sus propios diagramas"
  ON diagrams FOR SELECT
  USING (
    user_id = auth.uid() OR
    is_public = true OR
    EXISTS (
      SELECT 1 FROM diagram_collaborators
      WHERE diagram_id = diagrams.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Los usuarios pueden crear sus propios diagramas"
  ON diagrams FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Los usuarios pueden actualizar sus propios diagramas o diagramas compartidos con permisos de edición"
  ON diagrams FOR UPDATE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM diagram_collaborators
      WHERE diagram_id = diagrams.id 
        AND user_id = auth.uid() 
        AND permission IN ('edit', 'admin')
    )
  );

CREATE POLICY "Los usuarios pueden eliminar sus propios diagramas"
  ON diagrams FOR DELETE
  USING (user_id = auth.uid());

-- Policies para diagram_collaborators
CREATE POLICY "Los colaboradores pueden ver sus colaboraciones"
  ON diagram_collaborators FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM diagrams
      WHERE diagrams.id = diagram_collaborators.diagram_id 
        AND diagrams.user_id = auth.uid()
    )
  );

CREATE POLICY "Los dueños pueden gestionar colaboradores"
  ON diagram_collaborators FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM diagrams
      WHERE diagrams.id = diagram_collaborators.diagram_id 
        AND diagrams.user_id = auth.uid()
    )
  );

-- Policies para folders
CREATE POLICY "Los usuarios pueden gestionar sus propias carpetas"
  ON folders FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policies para diagram_folders
CREATE POLICY "Los usuarios pueden gestionar la organización de sus diagramas"
  ON diagram_folders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM diagrams
      WHERE diagrams.id = diagram_folders.diagram_id 
        AND diagrams.user_id = auth.uid()
    )
  );

-- Policies para public_templates (todos pueden leer, solo admins pueden modificar)
CREATE POLICY "Todos pueden ver templates públicos"
  ON public_templates FOR SELECT
  TO authenticated
  USING (true);

-- Policies para diagram_comments
CREATE POLICY "Los usuarios pueden ver comentarios de diagramas que tienen acceso"
  ON diagram_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM diagrams
      WHERE diagrams.id = diagram_comments.diagram_id 
        AND (
          diagrams.user_id = auth.uid() OR
          diagrams.is_public = true OR
          EXISTS (
            SELECT 1 FROM diagram_collaborators
            WHERE diagram_collaborators.diagram_id = diagrams.id 
              AND diagram_collaborators.user_id = auth.uid()
          )
        )
    )
  );

CREATE POLICY "Los usuarios pueden crear comentarios en diagramas que tienen acceso"
  ON diagram_comments FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM diagrams
      WHERE diagrams.id = diagram_comments.diagram_id 
        AND (
          diagrams.user_id = auth.uid() OR
          diagrams.is_public = true OR
          EXISTS (
            SELECT 1 FROM diagram_collaborators
            WHERE diagram_collaborators.diagram_id = diagrams.id 
              AND diagram_collaborators.user_id = auth.uid()
          )
        )
    )
  );

-- PASO 5: Crear funciones y triggers
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diagrams_updated_at
  BEFORE UPDATE ON diagrams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folders_updated_at
  BEFORE UPDATE ON folders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diagram_comments_updated_at
  BEFORE UPDATE ON diagram_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para incrementar contador de vistas
CREATE OR REPLACE FUNCTION increment_diagram_views(diagram_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE diagrams
  SET 
    view_count = view_count + 1,
    last_accessed_at = NOW()
  WHERE id = diagram_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 6: Crear vistas útiles
-- ============================================

-- Vista para diagramas con información del usuario
CREATE VIEW diagrams_with_users AS
SELECT 
  d.*,
  p.full_name as owner_name,
  p.avatar_url as owner_avatar,
  p.email as owner_email,
  (
    SELECT COUNT(*)
    FROM diagram_collaborators dc
    WHERE dc.diagram_id = d.id
  ) as collaborators_count,
  (
    SELECT COUNT(*)
    FROM diagram_versions dv
    WHERE dv.diagram_id = d.id
  ) as versions_count
FROM diagrams d
JOIN profiles p ON d.user_id = p.id;

-- Vista para obtener diagramas recientes del usuario
CREATE VIEW user_recent_diagrams AS
SELECT 
  d.*,
  p.full_name as owner_name
FROM diagrams d
JOIN profiles p ON d.user_id = p.id
ORDER BY d.last_accessed_at DESC;

-- ============================================
-- FIN DE LA CONFIGURACIÓN
-- ============================================

-- NOTAS IMPORTANTES:
-- 1. Ejecuta este script en el editor SQL de Supabase
-- 2. Asegúrate de que la autenticación esté habilitada en tu proyecto
-- 3. Configura los proveedores OAuth (Google, GitHub) si los vas a usar
-- 4. Copia las credenciales (URL y ANON KEY) a tu archivo .env.local

