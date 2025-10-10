-- ============================================
-- SCRIPT DE VERIFICACIÓN - DIAGRAMATOR
-- ============================================
-- Ejecuta este script para verificar que todo esté instalado correctamente

-- 1. Verificar tablas
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'profiles', 'diagrams', 'diagram_versions', 
    'diagram_collaborators', 'folders', 'diagram_folders',
    'public_templates', 'activity_logs', 'diagram_comments'
  )
ORDER BY tablename;

-- 2. Verificar funciones
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN (
    'update_updated_at_column', 
    'handle_new_user', 
    'increment_diagram_views',
    'create_diagram_version'
  )
ORDER BY routine_name;

-- 3. Verificar triggers
SELECT 
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 4. Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 5. Verificar vistas
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'VIEW'
  AND table_name IN ('diagrams_with_users', 'user_recent_diagrams')
ORDER BY table_name;

-- 6. Verificar índices
SELECT 
  indexname,
  tablename,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
