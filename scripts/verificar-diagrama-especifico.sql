-- ============================================
-- SCRIPT PARA VERIFICAR UN DIAGRAMA ESPECÍFICO
-- ============================================
-- Este script te permite verificar los datos de un diagrama específico

-- 1. Reemplaza 'TU_DIAGRAM_ID' con el ID real de tu diagrama
-- ============================================
-- SELECT 
--     id,
--     title,
--     description,
--     user_id,
--     data,
--     jsonb_pretty(data) as formatted_data,
--     jsonb_typeof(data) as data_type,
--     jsonb_object_keys(data) as data_keys,
--     created_at,
--     updated_at
-- FROM diagrams 
-- WHERE id = 'TU_DIAGRAM_ID';

-- 2. Ver los últimos diagramas con sus datos completos
-- ============================================
SELECT 
    id,
    title,
    description,
    user_id,
    jsonb_array_length(data->'nodes') as nodes_count,
    jsonb_array_length(data->'edges') as edges_count,
    data->'nodes' as nodes_data,
    data->'edges' as edges_data,
    updated_at
FROM diagrams 
ORDER BY updated_at DESC 
LIMIT 5;

-- 3. Ver la estructura completa de los nodos del último diagrama
-- ============================================
SELECT 
    id,
    title,
    jsonb_pretty(data->'nodes') as nodes_formatted,
    jsonb_pretty(data->'edges') as edges_formatted
FROM diagrams 
WHERE jsonb_array_length(data->'nodes') > 0
ORDER BY updated_at DESC 
LIMIT 1;

-- 4. Verificar si hay diagramas con datos pero sin nodos visibles
-- ============================================
SELECT 
    id,
    title,
    data,
    CASE 
        WHEN data ? 'nodes' AND jsonb_array_length(data->'nodes') > 0 THEN 'Tiene nodos'
        WHEN data ? 'nodes' AND jsonb_array_length(data->'nodes') = 0 THEN 'Array de nodos vacío'
        WHEN data ? 'nodes' THEN 'Campo nodes presente pero no es array'
        ELSE 'No tiene campo nodes'
    END as nodes_status,
    CASE 
        WHEN data ? 'edges' AND jsonb_array_length(data->'edges') > 0 THEN 'Tiene edges'
        WHEN data ? 'edges' AND jsonb_array_length(data->'edges') = 0 THEN 'Array de edges vacío'
        WHEN data ? 'edges' THEN 'Campo edges presente pero no es array'
        ELSE 'No tiene campo edges'
    END as edges_status,
    updated_at
FROM diagrams 
ORDER BY updated_at DESC 
LIMIT 10;

-- 5. Verificar la estructura de un nodo específico
-- ============================================
SELECT 
    d.id,
    d.title,
    jsonb_array_elements(d.data->'nodes') as node_data,
    jsonb_object_keys(jsonb_array_elements(d.data->'nodes')) as node_keys
FROM diagrams d
WHERE jsonb_array_length(d.data->'nodes') > 0
ORDER BY d.updated_at DESC 
LIMIT 3;

-- 6. Verificar si los nodos tienen la estructura esperada por ReactFlow
-- ============================================
SELECT 
    d.id,
    d.title,
    node->>'id' as node_id,
    node->>'type' as node_type,
    node->'position' as node_position,
    node->'data' as node_data,
    CASE 
        WHEN node ? 'id' AND node ? 'type' AND node ? 'position' AND node ? 'data' 
        THEN 'Estructura completa'
        ELSE 'Estructura incompleta'
    END as structure_status
FROM diagrams d,
jsonb_array_elements(d.data->'nodes') as node
WHERE jsonb_array_length(d.data->'nodes') > 0
ORDER BY d.updated_at DESC 
LIMIT 10;
