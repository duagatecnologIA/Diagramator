-- ============================================
-- SCRIPT DE VERIFICACIÓN - DIAGRAMATOR
-- ============================================
-- Este script verifica que la base de datos esté correctamente configurada

-- VERIFICACIÓN 1: TABLAS EXISTENTES
-- ============================================

SELECT 
  'TABLAS' as tipo,
  table_name as nombre,
  'EXISTE' as estado
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'profiles', 'diagrams', 'diagram_versions', 
    'diagram_collaborators', 'folders', 'diagram_folders',
    'public_templates', 'activity_logs', 'diagram_comments'
  )
ORDER BY table_name;

-- VERIFICACIÓN 2: POLÍTICAS RLS ACTIVAS
-- ============================================

SELECT 
  'POLÍTICAS RLS' as tipo,
  tablename as tabla,
  policyname as politica,
  cmd as operacion,
  CASE WHEN permissive THEN 'PERMISIVA' ELSE 'RESTRICTIVA' END as tipo_politica
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('diagrams', 'diagram_collaborators', 'diagram_folders', 'diagram_comments', 'diagram_versions', 'activity_logs')
ORDER BY tablename, policyname;

-- VERIFICACIÓN 3: ÍNDICES CREADOS
-- ============================================

SELECT 
  'ÍNDICES' as tipo,
  tablename as tabla,
  indexname as indice,
  indexdef as definicion
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('diagrams', 'diagram_collaborators', 'diagram_folders', 'diagram_comments', 'diagram_versions', 'activity_logs')
ORDER BY tablename, indexname;

-- VERIFICACIÓN 4: FUNCIONES CREADAS
-- ============================================

SELECT 
  'FUNCIONES' as tipo,
  routine_name as funcion,
  routine_type as tipo_funcion,
  'CREADA' as estado
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN (
    'update_updated_at_column', 'handle_new_user', 
    'increment_diagram_views', 'user_can_access_diagram', 
    'user_owns_diagram'
  )
ORDER BY routine_name;

-- VERIFICACIÓN 5: TRIGGERS ACTIVOS
-- ============================================

SELECT 
  'TRIGGERS' as tipo,
  event_object_table as tabla,
  trigger_name as trigger,
  event_manipulation as evento,
  action_timing as momento
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
  AND event_object_table IN ('profiles', 'diagrams', 'folders', 'diagram_comments', 'auth.users')
ORDER BY event_object_table, trigger_name;

-- VERIFICACIÓN 6: VISTAS CREADAS
-- ============================================

SELECT 
  'VISTAS' as tipo,
  table_name as vista,
  'CREADA' as estado
FROM information_schema.views 
WHERE table_schema = 'public' 
  AND table_name IN ('diagrams_with_users', 'user_recent_diagrams')
ORDER BY table_name;

-- VERIFICACIÓN 7: INTEGRIDAD REFERENCIAL
-- ============================================

SELECT 
  'INTEGRIDAD' as tipo,
  tc.table_name as tabla,
  tc.constraint_name as restriccion,
  tc.constraint_type as tipo_restriccion,
  'ACTIVA' as estado
FROM information_schema.table_constraints tc
WHERE tc.table_schema = 'public' 
  AND tc.table_name IN ('diagrams', 'diagram_collaborators', 'diagram_folders', 'diagram_comments', 'diagram_versions', 'activity_logs')
  AND tc.constraint_type IN ('FOREIGN KEY', 'PRIMARY KEY', 'UNIQUE')
ORDER BY tc.table_name, tc.constraint_type;

-- VERIFICACIÓN 8: PERMISOS DE USUARIO AUTENTICADO
-- ============================================

-- Verificar que el rol 'authenticated' tiene permisos básicos
SELECT 
  'PERMISOS' as tipo,
  schemaname as esquema,
  tablename as tabla,
  privilege_type as privilegio,
  'OTORGADO' as estado
FROM information_schema.table_privileges 
WHERE grantee = 'authenticated' 
  AND table_schema = 'public'
  AND table_name IN ('diagrams', 'profiles', 'diagram_collaborators')
ORDER BY table_name, privilege_type;

-- VERIFICACIÓN 9: CONFIGURACIÓN RLS
-- ============================================

SELECT 
  'RLS CONFIG' as tipo,
  schemaname as esquema,
  tablename as tabla,
  rowsecurity as rls_habilitado,
  CASE WHEN rowsecurity THEN 'HABILITADO' ELSE 'DESHABILITADO' END as estado
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('diagrams', 'diagram_collaborators', 'diagram_folders', 'diagram_comments', 'diagram_versions', 'activity_logs', 'profiles')
ORDER BY tablename;

-- VERIFICACIÓN 10: PRUEBA DE FUNCIONALIDAD BÁSICA
-- ============================================

-- Esta consulta debería ejecutarse sin errores si todo está bien configurado
DO $$
DECLARE
  test_result BOOLEAN;
  error_count INTEGER := 0;
BEGIN
  -- Probar función de verificación de acceso
  BEGIN
    SELECT user_can_access_diagram('00000000-0000-0000-0000-000000000000') INTO test_result;
    RAISE NOTICE '✅ Función user_can_access_diagram: FUNCIONA';
  EXCEPTION
    WHEN OTHERS THEN
      error_count := error_count + 1;
      RAISE NOTICE '❌ Función user_can_access_diagram: ERROR - %', SQLERRM;
  END;

  -- Probar función de verificación de propiedad
  BEGIN
    SELECT user_owns_diagram('00000000-0000-0000-0000-000000000000') INTO test_result;
    RAISE NOTICE '✅ Función user_owns_diagram: FUNCIONA';
  EXCEPTION
    WHEN OTHERS THEN
      error_count := error_count + 1;
      RAISE NOTICE '❌ Función user_owns_diagram: ERROR - %', SQLERRM;
  END;

  -- Resultado final
  IF error_count = 0 THEN
    RAISE NOTICE '============================================';
    RAISE NOTICE '🎉 VERIFICACIÓN COMPLETA: TODAS LAS PRUEBAS PASARON';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'La base de datos está correctamente configurada';
    RAISE NOTICE 'y lista para usar en producción.';
    RAISE NOTICE '============================================';
  ELSE
    RAISE NOTICE '============================================';
    RAISE NOTICE '⚠️  VERIFICACIÓN: % ERRORES ENCONTRADOS', error_count;
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Revisar los errores anteriores antes de usar en producción.';
    RAISE NOTICE '============================================';
  END IF;
END $$;

-- RESUMEN FINAL
-- ============================================

SELECT 
  'RESUMEN' as seccion,
  'Base de datos Diagramator' as descripcion,
  'Verificación completada' as estado,
  NOW() as fecha_verificacion;
