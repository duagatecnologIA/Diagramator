-- ============================================
-- PARTE 3: FUNCIONES Y TRIGGERS
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
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_diagrams_updated_at ON diagrams;
CREATE TRIGGER update_diagrams_updated_at
  BEFORE UPDATE ON diagrams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_folders_updated_at ON folders;
CREATE TRIGGER update_folders_updated_at
  BEFORE UPDATE ON folders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_diagram_comments_updated_at ON diagram_comments;
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
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
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

-- Función para crear versión automáticamente cuando se actualiza un diagrama
CREATE OR REPLACE FUNCTION create_diagram_version()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo crear versión si el data cambió
  IF OLD.data IS DISTINCT FROM NEW.data THEN
    INSERT INTO diagram_versions (diagram_id, version_number, data, created_by)
    VALUES (
      NEW.id,
      COALESCE((
        SELECT MAX(version_number) + 1
        FROM diagram_versions
        WHERE diagram_id = NEW.id
      ), 1),
      OLD.data,
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para versiones automáticas (opcional - puedes desactivarlo si prefieres control manual)
-- CREATE TRIGGER on_diagram_update_create_version
--   BEFORE UPDATE ON diagrams
--   FOR EACH ROW EXECUTE FUNCTION create_diagram_version();

-- VISTAS ÚTILES
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

CREATE OR REPLACE VIEW user_recent_diagrams AS
SELECT 
  d.*,
  p.full_name as owner_name
FROM diagrams d
JOIN profiles p ON d.user_id = p.id
ORDER BY d.last_accessed_at DESC;
