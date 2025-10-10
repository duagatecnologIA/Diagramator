-- ============================================
-- PARTE 2: ÍNDICES Y ROW LEVEL SECURITY
-- ============================================

-- ÍNDICES
CREATE INDEX IF NOT EXISTS idx_diagrams_user_id ON diagrams(user_id);
CREATE INDEX IF NOT EXISTS idx_diagrams_created_at ON diagrams(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diagrams_is_public ON diagrams(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_diagrams_is_template ON diagrams(is_template) WHERE is_template = true;
CREATE INDEX IF NOT EXISTS idx_diagram_versions_diagram_id ON diagram_versions(diagram_id);
CREATE INDEX IF NOT EXISTS idx_diagram_collaborators_user_id ON diagram_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_diagram_collaborators_diagram_id ON diagram_collaborators(diagram_id);
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diagram_comments_diagram_id ON diagram_comments(diagram_id);
CREATE INDEX IF NOT EXISTS idx_diagrams_data_gin ON diagrams USING GIN (data);
CREATE INDEX IF NOT EXISTS idx_diagrams_metadata_gin ON diagrams USING GIN (metadata);

-- HABILITAR RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagrams ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagram_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagram_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagram_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagram_comments ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS RLS PARA PROFILES
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON profiles;
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON profiles;
CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- POLÍTICAS RLS PARA DIAGRAMS
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propios diagramas" ON diagrams;
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

DROP POLICY IF EXISTS "Los usuarios pueden crear sus propios diagramas" ON diagrams;
CREATE POLICY "Los usuarios pueden crear sus propios diagramas"
  ON diagrams FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propios diagramas" ON diagrams;
CREATE POLICY "Los usuarios pueden actualizar sus propios diagramas"
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

DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus propios diagramas" ON diagrams;
CREATE POLICY "Los usuarios pueden eliminar sus propios diagramas"
  ON diagrams FOR DELETE
  USING (user_id = auth.uid());

-- POLÍTICAS RLS PARA COLLABORATORS
DROP POLICY IF EXISTS "Los colaboradores pueden ver sus colaboraciones" ON diagram_collaborators;
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

DROP POLICY IF EXISTS "Los dueños pueden gestionar colaboradores" ON diagram_collaborators;
CREATE POLICY "Los dueños pueden gestionar colaboradores"
  ON diagram_collaborators FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM diagrams
      WHERE diagrams.id = diagram_collaborators.diagram_id 
        AND diagrams.user_id = auth.uid()
    )
  );

-- POLÍTICAS RLS PARA FOLDERS
DROP POLICY IF EXISTS "Los usuarios pueden gestionar sus propias carpetas" ON folders;
CREATE POLICY "Los usuarios pueden gestionar sus propias carpetas"
  ON folders FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- POLÍTICAS RLS PARA DIAGRAM_FOLDERS
DROP POLICY IF EXISTS "Los usuarios pueden gestionar la organización" ON diagram_folders;
CREATE POLICY "Los usuarios pueden gestionar la organización"
  ON diagram_folders FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM diagrams
      WHERE diagrams.id = diagram_folders.diagram_id 
        AND diagrams.user_id = auth.uid()
    )
  );

-- POLÍTICAS RLS PARA PUBLIC_TEMPLATES
DROP POLICY IF EXISTS "Todos pueden ver templates públicos" ON public_templates;
CREATE POLICY "Todos pueden ver templates públicos"
  ON public_templates FOR SELECT
  TO authenticated
  USING (true);

-- POLÍTICAS RLS PARA COMMENTS
DROP POLICY IF EXISTS "Ver comentarios de diagramas accesibles" ON diagram_comments;
CREATE POLICY "Ver comentarios de diagramas accesibles"
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

DROP POLICY IF EXISTS "Crear comentarios en diagramas accesibles" ON diagram_comments;
CREATE POLICY "Crear comentarios en diagramas accesibles"
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

