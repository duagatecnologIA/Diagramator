-- ============================================
-- SCRIPT PARA VERIFICAR DATOS DE DIAGRAMAS
-- ============================================
-- Este script ayuda a verificar exactamente qué datos se están guardando

-- 1. Ver estructura de la tabla diagrams
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

-- 2. Ver los últimos 10 diagramas creados
-- ============================================
SELECT 
    id,
    title,
    description,
    user_id,
    created_at,
    updated_at,
    jsonb_typeof(data) as data_type,
    CASE 
        WHEN jsonb_typeof(data) = 'object' THEN jsonb_object_keys(data)
        ELSE 'No es objeto'
    END as data_keys
FROM diagrams 
ORDER BY created_at DESC 
LIMIT 10;

-- 3. Verificar el contenido de la columna data en detalle
-- ============================================
SELECT 
    id,
    title,
    data,
    jsonb_pretty(data) as formatted_data,
    CASE 
        WHEN data ? 'nodes' THEN jsonb_array_length(data->'nodes')
        ELSE 0
    END as nodes_count,
    CASE 
        WHEN data ? 'edges' THEN jsonb_array_length(data->'edges')
        ELSE 0
    END as edges_count,
    updated_at
FROM diagrams 
WHERE updated_at > NOW() - INTERVAL '24 hours'
ORDER BY updated_at DESC;

-- 4. Verificar si hay diagramas con data vacío o null
-- ============================================
SELECT 
    id,
    title,
    CASE 
        WHEN data IS NULL THEN 'NULL'
        WHEN data = '{}' THEN 'OBJETO VACÍO'
        WHEN data = '[]' THEN 'ARRAY VACÍO'
        WHEN data = 'null'::jsonb THEN 'NULL JSONB'
        ELSE 'CON DATOS'
    END as data_status,
    data,
    updated_at
FROM diagrams 
ORDER BY updated_at DESC 
LIMIT 10;

-- 5. Verificar si los nodos tienen la estructura esperada
-- ============================================
SELECT 
    d.id,
    d.title,
    jsonb_array_length(d.data->'nodes') as total_nodes,
    jsonb_array_length(d.data->'edges') as total_edges,
    -- Ver estructura del primer nodo si existe
    CASE 
        WHEN jsonb_array_length(d.data->'nodes') > 0 THEN 
            jsonb_object_keys(d.data->'nodes'->0)
        ELSE 'Sin nodos'
    END as first_node_keys,
    -- Ver estructura del primer edge si existe
    CASE 
        WHEN jsonb_array_length(d.data->'edges') > 0 THEN 
            jsonb_object_keys(d.data->'edges'->0)
        ELSE 'Sin edges'
    END as first_edge_keys
FROM diagrams d
WHERE d.data ? 'nodes' AND jsonb_array_length(d.data->'nodes') > 0
ORDER BY d.updated_at DESC 
LIMIT 5;

-- 6. Verificar triggers en la tabla diagrams
-- ============================================
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement,
    action_orientation
FROM information_schema.triggers 
WHERE event_object_table = 'diagrams'
ORDER BY trigger_name;

-- 7. Verificar políticas RLS
-- ============================================
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'diagrams'
ORDER BY policyname;

-- 8. Probar insertar un diagrama de prueba con estructura completa
-- ============================================
INSERT INTO diagrams (
    user_id, 
    title, 
    description, 
    data,
    is_public
) VALUES (
    (SELECT id FROM auth.users LIMIT 1),
    'Test Diagram - Estructura Completa',
    'Diagrama de prueba con estructura completa de nodos y edges',
    '{
        "nodes": [
            {
                "id": "node-1",
                "type": "phase",
                "position": {"x": 100, "y": 100},
                "data": {
                    "label": "Inicio",
                    "description": "Nodo de inicio"
                }
            },
            {
                "id": "node-2", 
                "type": "activity",
                "position": {"x": 300, "y": 100},
                "data": {
                    "label": "Proceso",
                    "description": "Actividad principal"
                }
            }
        ],
        "edges": [
            {
                "id": "edge-1",
                "source": "node-1",
                "target": "node-2",
                "type": "smoothstep"
            }
        ]
    }'::jsonb,
    false
) RETURNING id, title, data;

-- 9. Verificar el diagrama de prueba recién creado
-- ============================================
SELECT 
    id,
    title,
    jsonb_pretty(data) as formatted_data,
    jsonb_array_length(data->'nodes') as nodes_count,
    jsonb_array_length(data->'edges') as edges_count
FROM diagrams 
WHERE title = 'Test Diagram - Estructura Completa'
ORDER BY created_at DESC 
LIMIT 1;

-- 10. Limpiar diagramas de prueba (ejecutar solo si quieres limpiar)
-- ============================================
-- DELETE FROM diagrams WHERE title LIKE 'Test Diagram%';
