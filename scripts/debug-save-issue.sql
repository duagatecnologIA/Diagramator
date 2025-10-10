-- ============================================
-- SCRIPT PARA DEBUGGEAR EL PROBLEMA DE GUARDADO
-- ============================================
-- Este script ayuda a identificar por qué los nodos no se guardan
-- en la base de datos aunque el registro se crea correctamente

-- 1. Verificar la estructura de la tabla diagrams
-- ============================================
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'diagrams' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Ver los últimos diagramas creados con sus datos
-- ============================================
SELECT 
    id,
    title,
    description,
    user_id,
    data,
    jsonb_typeof(data) as data_type,
    jsonb_object_keys(data) as data_keys,
    created_at,
    updated_at
FROM diagrams 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. Verificar si la columna data tiene la estructura esperada
-- ============================================
SELECT 
    id,
    title,
    data->'nodes' as nodes_data,
    data->'edges' as edges_data,
    jsonb_array_length(data->'nodes') as nodes_count,
    jsonb_array_length(data->'edges') as edges_count,
    updated_at
FROM diagrams 
WHERE updated_at > NOW() - INTERVAL '1 hour'
ORDER BY updated_at DESC;

-- 4. Verificar si hay algún trigger que pueda estar interfiriendo
-- ============================================
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'diagrams';

-- 5. Verificar las políticas RLS
-- ============================================
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
WHERE tablename = 'diagrams';

-- 6. Probar insertar un diagrama de prueba con datos JSONB
-- ============================================
INSERT INTO diagrams (
    user_id, 
    title, 
    description, 
    data,
    is_public
) VALUES (
    (SELECT id FROM auth.users LIMIT 1), -- Usar el primer usuario disponible
    'Test Diagram Debug',
    'Diagrama de prueba para debuggear',
    '{"nodes": [{"id": "test-1", "type": "phase", "position": {"x": 100, "y": 100}, "data": {"label": "Test Node"}}], "edges": []}'::jsonb,
    false
) RETURNING id, title, data;

-- 7. Verificar el diagrama de prueba recién creado
-- ============================================
SELECT 
    id,
    title,
    data,
    jsonb_pretty(data) as formatted_data
FROM diagrams 
WHERE title = 'Test Diagram Debug'
ORDER BY created_at DESC 
LIMIT 1;

-- 8. Limpiar el diagrama de prueba (opcional)
-- ============================================
-- DELETE FROM diagrams WHERE title = 'Test Diagram Debug';
