-- ============================================
-- CORRECCIÓN DE POLÍTICAS RLS - DIAGRAMATOR
-- ============================================
-- Este script corrige las políticas RLS que causan recursión infinita

-- PASO 1: ELIMINAR TODAS LAS POLÍTICAS PROBLEMÁTICAS
-- ============================================

-- Eliminar políticas de diagrams que causan recursión
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propios diagramas" ON diagrams;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propios diagramas" ON diagrams;

-- Eliminar políticas de collaborators que referencian diagrams
DROP POLICY IF EXISTS "Los colaboradores pueden ver sus colaboraciones" ON diagram_collaborators;
DROP POLICY IF EXISTS "Los dueños pueden gestionar colaboradores" ON diagram_collaborators;

-- Eliminar políticas de diagram_folders que referencian diagrams
DROP POLICY IF EXISTS "Los usuarios pueden gestionar la organización" ON diagram_folders;

-- Eliminar políticas de comments que referencian diagrams
DROP POLICY IF EXISTS "Ver comentarios de diagramas accesibles" ON diagram_comments;
DROP POLICY IF EXISTS "Crear comentarios en diagramas accesibles" ON diagram_comments;

-- PASO 2: CREAR POLÍTICAS RLS CORREGIDAS (SIN RECURSIÓN)
-- ============================================

-- POLÍTICAS PARA DIAGRAMS (SIMPLIFICADAS)
CREATE POLICY "diagrams_select_policy" ON diagrams FOR SELECT
  USING (
    user_id = auth.uid() OR
    is_public = true
  );

CREATE POLICY "diagrams_insert_policy" ON diagrams FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "diagrams_update_policy" ON diagrams FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "diagrams_delete_policy" ON diagrams FOR DELETE
  USING (user_id = auth.uid());

-- POLÍTICAS PARA DIAGRAM_COLLABORATORS (SIMPLIFICADAS)
CREATE POLICY "collaborators_select_policy" ON diagram_collaborators FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM diagrams d
      WHERE d.id = diagram_collaborators.diagram_id 
        AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "collaborators_insert_policy" ON diagram_collaborators FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM diagrams d
      WHERE d.id = diagram_collaborators.diagram_id 
        AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "collaborators_update_policy" ON diagram_collaborators FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM diagrams d
      WHERE d.id = diagram_collaborators.diagram_id 
        AND d.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM diagrams d
      WHERE d.id = diagram_collaborators.diagram_id 
        AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "collaborators_delete_policy" ON diagram_collaborators FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM diagrams d
      WHERE d.id = diagram_collaborators.diagram_id 
        AND d.user_id = auth.uid()
    )
  );

-- POLÍTICAS PARA DIAGRAM_FOLDERS (SIMPLIFICADAS)
CREATE POLICY "diagram_folders_select_policy" ON diagram_folders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM diagrams d
      WHERE d.id = diagram_folders.diagram_id 
        AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "diagram_folders_insert_policy" ON diagram_folders FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM diagrams d
      WHERE d.id = diagram_folders.diagram_id 
        AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "diagram_folders_update_policy" ON diagram_folders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM diagrams d
      WHERE d.id = diagram_folders.diagram_id 
        AND d.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM diagrams d
      WHERE d.id = diagram_folders.diagram_id 
        AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "diagram_folders_delete_policy" ON diagram_folders FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM diagrams d
      WHERE d.id = diagram_folders.diagram_id 
        AND d.user_id = auth.uid()
    )
  );

-- POLÍTICAS PARA DIAGRAM_COMMENTS (SIMPLIFICADAS)
CREATE POLICY "comments_select_policy" ON diagram_comments FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM diagrams d
      WHERE d.id = diagram_comments.diagram_id 
        AND (d.user_id = auth.uid() OR d.is_public = true)
    )
  );

CREATE POLICY "comments_insert_policy" ON diagram_comments FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM diagrams d
      WHERE d.id = diagram_comments.diagram_id 
        AND (d.user_id = auth.uid() OR d.is_public = true)
    )
  );

CREATE POLICY "comments_update_policy" ON diagram_comments FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "comments_delete_policy" ON diagram_comments FOR DELETE
  USING (user_id = auth.uid());

-- PASO 3: POLÍTICAS PARA DIAGRAM_VERSIONS
-- ============================================

DROP POLICY IF EXISTS "diagram_versions_select_policy" ON diagram_versions;
CREATE POLICY "diagram_versions_select_policy" ON diagram_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM diagrams d
      WHERE d.id = diagram_versions.diagram_id 
        AND d.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "diagram_versions_insert_policy" ON diagram_versions;
CREATE POLICY "diagram_versions_insert_policy" ON diagram_versions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM diagrams d
      WHERE d.id = diagram_versions.diagram_id 
        AND d.user_id = auth.uid()
    )
  );

-- PASO 4: POLÍTICAS PARA ACTIVITY_LOGS
-- ============================================

DROP POLICY IF EXISTS "activity_logs_select_policy" ON activity_logs;
CREATE POLICY "activity_logs_select_policy" ON activity_logs FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "activity_logs_insert_policy" ON activity_logs;
CREATE POLICY "activity_logs_insert_policy" ON activity_logs FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- PASO 5: VERIFICAR QUE NO HAY POLÍTICAS CIRCULARES
-- ============================================

-- Listar todas las políticas para verificación
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('diagrams', 'diagram_collaborators', 'diagram_folders', 'diagram_comments', 'diagram_versions', 'activity_logs')
ORDER BY tablename, policyname;

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE 'Políticas RLS corregidas exitosamente. La recursión infinita ha sido eliminada.';
END $$;
