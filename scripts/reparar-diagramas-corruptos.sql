-- ============================================
-- SCRIPT PARA REPARAR DIAGRAMAS CORRUPTOS
-- ============================================
-- Este script identifica y repara diagramas que pueden tener problemas

-- 1. Identificar diagramas con problemas de estructura
-- ============================================
SELECT 
    id,
    title,
    CASE 
        WHEN data IS NULL THEN 'DATA NULL'
        WHEN data = '{}' THEN 'DATA VACÍO'
        WHEN data = '[]' THEN 'DATA ARRAY VACÍO'
        WHEN NOT (data ? 'nodes') THEN 'SIN CAMPO NODES'
        WHEN NOT (data ? 'edges') THEN 'SIN CAMPO EDGES'
        WHEN jsonb_typeof(data->'nodes') != 'array' THEN 'NODES NO ES ARRAY'
        WHEN jsonb_typeof(data->'edges') != 'array' THEN 'EDGES NO ES ARRAY'
        ELSE 'ESTRUCTURA CORRECTA'
    END as problema,
    updated_at
FROM diagrams 
WHERE updated_at > NOW() - INTERVAL '7 days'
ORDER BY updated_at DESC;

-- 2. Reparar diagramas con estructura incorrecta
-- ============================================
UPDATE diagrams 
SET 
    data = '{"nodes": [], "edges": []}'::jsonb,
    updated_at = NOW()
WHERE 
    data IS NULL 
    OR data = '{}' 
    OR data = '[]'
    OR NOT (data ? 'nodes')
    OR NOT (data ? 'edges')
    OR jsonb_typeof(data->'nodes') != 'array'
    OR jsonb_typeof(data->'edges') != 'array';

-- 3. Verificar nodos con estructura incompleta
-- ============================================
SELECT 
    d.id,
    d.title,
    node->>'id' as node_id,
    node->>'type' as node_type,
    CASE 
        WHEN NOT (node ? 'id') THEN 'SIN ID'
        WHEN NOT (node ? 'type') THEN 'SIN TYPE'
        WHEN NOT (node ? 'position') THEN 'SIN POSITION'
        WHEN NOT (node ? 'data') THEN 'SIN DATA'
        WHEN node->'position' IS NULL THEN 'POSITION NULL'
        WHEN node->'data' IS NULL THEN 'DATA NULL'
        ELSE 'ESTRUCTURA CORRECTA'
    END as node_problema
FROM diagrams d,
jsonb_array_elements(d.data->'nodes') as node
WHERE d.updated_at > NOW() - INTERVAL '7 days'
ORDER BY d.updated_at DESC;

-- 4. Reparar nodos con estructura incompleta
-- ============================================
UPDATE diagrams 
SET 
    data = jsonb_set(
        data,
        '{nodes}',
        (
            SELECT jsonb_agg(
                CASE 
                    WHEN node ? 'id' AND node ? 'type' AND node ? 'position' AND node ? 'data'
                    THEN node
                    ELSE jsonb_build_object(
                        'id', COALESCE(node->>'id', 'node-' || generate_random_uuid()),
                        'type', COALESCE(node->>'type', 'activity'),
                        'position', COALESCE(node->'position', '{"x": 100, "y": 100}'::jsonb),
                        'data', COALESCE(node->'data', '{"label": "Nodo reparado"}'::jsonb)
                    )
                END
            )
            FROM jsonb_array_elements(data->'nodes') as node
        )
    ),
    updated_at = NOW()
WHERE EXISTS (
    SELECT 1 
    FROM jsonb_array_elements(data->'nodes') as node
    WHERE NOT (node ? 'id' AND node ? 'type' AND node ? 'position' AND node ? 'data')
);

-- 5. Limpiar edges huérfanos (que referencian nodos que no existen)
-- ============================================
UPDATE diagrams 
SET 
    data = jsonb_set(
        data,
        '{edges}',
        (
            SELECT jsonb_agg(edge)
            FROM jsonb_array_elements(data->'edges') as edge
            WHERE 
                edge->>'source' IN (
                    SELECT node->>'id' 
                    FROM jsonb_array_elements(data->'nodes') as node
                )
                AND edge->>'target' IN (
                    SELECT node->>'id' 
                    FROM jsonb_array_elements(data->'nodes') as node
                )
        )
    ),
    updated_at = NOW()
WHERE EXISTS (
    SELECT 1 
    FROM jsonb_array_elements(data->'edges') as edge
    WHERE 
        edge->>'source' NOT IN (
            SELECT node->>'id' 
            FROM jsonb_array_elements(data->'nodes') as node
        )
        OR edge->>'target' NOT IN (
            SELECT node->>'id' 
            FROM jsonb_array_elements(data->'nodes') as node
        )
);

-- 6. Verificar el resultado de las reparaciones
-- ============================================
SELECT 
    id,
    title,
    jsonb_array_length(data->'nodes') as nodes_count,
    jsonb_array_length(data->'edges') as edges_count,
    CASE 
        WHEN data ? 'nodes' AND data ? 'edges' 
             AND jsonb_typeof(data->'nodes') = 'array' 
             AND jsonb_typeof(data->'edges') = 'array'
        THEN 'REPARADO CORRECTAMENTE'
        ELSE 'AÚN TIENE PROBLEMAS'
    END as estado,
    updated_at
FROM diagrams 
WHERE updated_at > NOW() - INTERVAL '1 hour'
ORDER BY updated_at DESC;

-- 7. Crear un diagrama de prueba para verificar que todo funciona
-- ============================================
INSERT INTO diagrams (
    user_id, 
    title, 
    description, 
    data,
    is_public
) VALUES (
    (SELECT id FROM auth.users LIMIT 1),
    'Test Reparación - ' || NOW()::text,
    'Diagrama de prueba después de reparaciones',
    '{
        "nodes": [
            {
                "id": "test-node-1",
                "type": "phase",
                "position": {"x": 100, "y": 100},
                "data": {"label": "Inicio", "description": "Nodo de prueba"}
            },
            {
                "id": "test-node-2",
                "type": "activity", 
                "position": {"x": 300, "y": 100},
                "data": {"label": "Proceso", "description": "Actividad de prueba"}
            }
        ],
        "edges": [
            {
                "id": "test-edge-1",
                "source": "test-node-1",
                "target": "test-node-2",
                "type": "smoothstep"
            }
        ]
    }'::jsonb,
    false
) RETURNING id, title, jsonb_array_length(data->'nodes') as nodes_count, jsonb_array_length(data->'edges') as edges_count;
