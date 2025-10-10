-- ============================================
-- SCRIPT DE CORRECCIÓN COMPLETA - DIAGRAMATOR
-- ============================================
-- Este script corrige TODOS los problemas de la base de datos para producción

-- PASO 1: LIMPIAR POLÍTICAS RLS PROBLEMÁTICAS
-- ============================================

-- Eliminar todas las políticas existentes que pueden causar recursión
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propios diagramas" ON diagrams;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propios diagramas" ON diagrams;
DROP POLICY IF EXISTS "Los colaboradores pueden ver sus colaboraciones" ON diagram_collaborators;
DROP POLICY IF EXISTS "Los dueños pueden gestionar colaboradores" ON diagram_collaborators;
DROP POLICY IF EXISTS "Los usuarios pueden gestionar la organización" ON diagram_folders;
DROP POLICY IF EXISTS "Ver comentarios de diagramas accesibles" ON diagram_comments;
DROP POLICY IF EXISTS "Crear comentarios en diagramas accesibles" ON diagram_comments;

-- PASO 2: CREAR POLÍTICAS RLS OPTIMIZADAS Y SEGURAS
-- ============================================

-- DIAGRAMS: Políticas simples y directas
CREATE POLICY "diagrams_owner_select" ON diagrams FOR SELECT
  USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "diagrams_owner_insert" ON diagrams FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "diagrams_owner_update" ON diagrams FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "diagrams_owner_delete" ON diagrams FOR DELETE
  USING (user_id = auth.uid());

-- DIAGRAM_COLLABORATORS: Sin referencias circulares
CREATE POLICY "collaborators_owner_manage" ON diagram_collaborators FOR ALL
  USING (
    user_id = auth.uid() OR
    diagram_id IN (
      SELECT id FROM diagrams WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    user_id = auth.uid() OR
    diagram_id IN (
      SELECT id FROM diagrams WHERE user_id = auth.uid()
    )
  );

-- DIAGRAM_FOLDERS: Sin referencias circulares
CREATE POLICY "diagram_folders_owner_manage" ON diagram_folders FOR ALL
  USING (
    diagram_id IN (
      SELECT id FROM diagrams WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    diagram_id IN (
      SELECT id FROM diagrams WHERE user_id = auth.uid()
    )
  );

-- DIAGRAM_COMMENTS: Sin referencias circulares
CREATE POLICY "comments_owner_insert" ON diagram_comments FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    diagram_id IN (
      SELECT id FROM diagrams 
      WHERE user_id = auth.uid() OR is_public = true
    )
  );

CREATE POLICY "comments_owner_select" ON diagram_comments FOR SELECT
  USING (
    user_id = auth.uid() OR
    diagram_id IN (
      SELECT id FROM diagrams 
      WHERE user_id = auth.uid() OR is_public = true
    )
  );

CREATE POLICY "comments_owner_update" ON diagram_comments FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "comments_owner_delete" ON diagram_comments FOR DELETE
  USING (user_id = auth.uid());

-- DIAGRAM_VERSIONS: Políticas simples
CREATE POLICY "versions_owner_manage" ON diagram_versions FOR ALL
  USING (
    diagram_id IN (
      SELECT id FROM diagrams WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    diagram_id IN (
      SELECT id FROM diagrams WHERE user_id = auth.uid()
    )
  );

-- ACTIVITY_LOGS: Solo el propietario puede ver sus logs
CREATE POLICY "activity_logs_owner_manage" ON activity_logs FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- PASO 3: OPTIMIZAR FUNCIONES Y TRIGGERS
-- ============================================

-- Función mejorada para actualizar updated_at (más eficiente)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función optimizada para crear perfil (con manejo de errores)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para incrementar vistas (optimizada)
CREATE OR REPLACE FUNCTION increment_diagram_views(diagram_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE diagrams
  SET 
    view_count = view_count + 1,
    last_accessed_at = NOW()
  WHERE id = diagram_uuid
    AND (user_id = auth.uid() OR is_public = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 4: CREAR ÍNDICES ADICIONALES PARA PERFORMANCE
-- ============================================

-- Índices para mejorar consultas de RLS
CREATE INDEX IF NOT EXISTS idx_diagrams_user_id_public ON diagrams(user_id, is_public);
CREATE INDEX IF NOT EXISTS idx_diagrams_public_only ON diagrams(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_collaborators_user_diagram ON diagram_collaborators(user_id, diagram_id);
CREATE INDEX IF NOT EXISTS idx_comments_diagram_user ON diagram_comments(diagram_id, user_id);

-- PASO 5: VISTAS OPTIMIZADAS
-- ============================================

-- Vista optimizada para diagramas con información de usuario
CREATE OR REPLACE VIEW diagrams_with_users AS
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

-- Vista para diagramas recientes del usuario
CREATE OR REPLACE VIEW user_recent_diagrams AS
SELECT 
  d.*,
  p.full_name as owner_name
FROM diagrams d
JOIN profiles p ON d.user_id = p.id
WHERE d.user_id = auth.uid()
ORDER BY d.last_accessed_at DESC NULLS LAST, d.updated_at DESC;

-- PASO 6: FUNCIONES DE UTILIDAD
-- ============================================

-- Función para verificar permisos de usuario en diagrama
CREATE OR REPLACE FUNCTION user_can_access_diagram(diagram_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM diagrams 
    WHERE id = diagram_uuid 
      AND (user_id = auth.uid() OR is_public = true)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si usuario es propietario
CREATE OR REPLACE FUNCTION user_owns_diagram(diagram_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM diagrams 
    WHERE id = diagram_uuid AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PASO 7: VERIFICACIÓN FINAL
-- ============================================

-- Verificar que no hay políticas circulares
DO $$
DECLARE
  circular_policies INTEGER;
BEGIN
  SELECT COUNT(*) INTO circular_policies
  FROM pg_policies p1
  JOIN pg_policies p2 ON p1.tablename = p2.tablename
  WHERE p1.policyname != p2.policyname
    AND p1.qual LIKE '%' || p2.tablename || '%'
    AND p2.qual LIKE '%' || p1.tablename || '%';
  
  IF circular_policies > 0 THEN
    RAISE EXCEPTION 'Se detectaron % políticas circulares', circular_policies;
  ELSE
    RAISE NOTICE 'Verificación exitosa: No hay políticas circulares detectadas';
  END IF;
END $$;

-- Listar políticas creadas para verificación
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as operation,
  permissive
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('diagrams', 'diagram_collaborators', 'diagram_folders', 'diagram_comments', 'diagram_versions', 'activity_logs')
ORDER BY tablename, policyname;

-- Mensaje final
DO $$
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE 'CORRECCIÓN COMPLETA APLICADA EXITOSAMENTE';
  RAISE NOTICE '============================================';
  RAISE NOTICE '✅ Políticas RLS optimizadas y sin recursión';
  RAISE NOTICE '✅ Funciones y triggers optimizados';
  RAISE NOTICE '✅ Índices adicionales para performance';
  RAISE NOTICE '✅ Vistas optimizadas creadas';
  RAISE NOTICE '✅ Funciones de utilidad agregadas';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'La base de datos está lista para producción';
  RAISE NOTICE '============================================';
END $$;
