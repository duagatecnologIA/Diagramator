-- ============================================
-- SCRIPT PARA PROBAR EL FLUJO DE GUARDADO
-- ============================================
-- Este script simula exactamente lo que hace la aplicación

-- 1. Limpiar datos de prueba anteriores
-- ============================================
DELETE FROM diagrams WHERE title LIKE 'Test Save Flow%';

-- 2. Crear un diagrama de prueba (simula /new)
-- ============================================
INSERT INTO diagrams (
    user_id, 
    title, 
    description, 
    data,
    is_public
) VALUES (
    (SELECT id FROM auth.users LIMIT 1),
    'Test Save Flow - Inicial',
    'Diagrama de prueba para verificar el flujo de guardado',
    '{"nodes": [], "edges": []}'::jsonb,
    false
) RETURNING id, title, data;

-- 3. Simular actualización con nodos y edges (simula el guardado)
-- ============================================
UPDATE diagrams 
SET 
    data = '{
        "nodes": [
            {
                "id": "node-1",
                "type": "phase",
                "position": {"x": 100, "y": 100},
                "data": {
                    "label": "Inicio",
                    "description": "Nodo de inicio del proceso"
                }
            },
            {
                "id": "node-2", 
                "type": "activity",
                "position": {"x": 300, "y": 100},
                "data": {
                    "label": "Proceso Principal",
                    "description": "Actividad principal del flujo"
                }
            }
        ],
        "edges": [
            {
                "id": "edge-1",
                "source": "node-1",
                "target": "node-2",
                "type": "smoothstep",
                "style": {"stroke": "#3B82F6", "strokeWidth": 2}
            }
        ]
    }'::jsonb
WHERE title = 'Test Save Flow - Inicial'
RETURNING id, title, data, updated_at;

-- 4. Verificar que los datos se guardaron correctamente
-- ============================================
SELECT 
    id,
    title,
    jsonb_array_length(data->'nodes') as nodes_count,
    jsonb_array_length(data->'edges') as edges_count,
    jsonb_pretty(data) as formatted_data,
    updated_at
FROM diagrams 
WHERE title = 'Test Save Flow - Inicial';

-- 5. Simular una segunda actualización (para verificar que funciona múltiples veces)
-- ============================================
UPDATE diagrams 
SET 
    data = jsonb_set(
        data,
        '{nodes}',
        data->'nodes' || '{
            "id": "node-3",
            "type": "decision",
            "position": {"x": 500, "y": 100},
            "data": {
                "label": "¿Continuar?",
                "description": "Punto de decisión"
            }
        }'::jsonb
    )
WHERE title = 'Test Save Flow - Inicial'
RETURNING id, title, data, updated_at;

-- 6. Verificar la segunda actualización
-- ============================================
SELECT 
    id,
    title,
    jsonb_array_length(data->'nodes') as nodes_count,
    jsonb_array_length(data->'edges') as edges_count,
    jsonb_pretty(data) as formatted_data,
    updated_at
FROM diagrams 
WHERE title = 'Test Save Flow - Inicial';

-- 7. Probar con datos que podrían causar problemas
-- ============================================
UPDATE diagrams 
SET 
    data = '{
        "nodes": [
            {
                "id": "node-1",
                "type": "phase",
                "position": {"x": 100, "y": 100},
                "data": {
                    "label": "Nodo con caracteres especiales: áéíóú ñ",
                    "description": "Descripción con emojis 🚀 💡 ⭐"
                }
            }
        ],
        "edges": [],
        "metadata": {
            "created_by": "test",
            "version": "1.0"
        }
    }'::jsonb
WHERE title = 'Test Save Flow - Inicial'
RETURNING id, title, data, updated_at;

-- 8. Verificar que los caracteres especiales se guardaron correctamente
-- ============================================
SELECT 
    id,
    title,
    data->'nodes'->0->'data'->>'label' as node_label,
    data->'nodes'->0->'data'->>'description' as node_description,
    updated_at
FROM diagrams 
WHERE title = 'Test Save Flow - Inicial';

-- 9. Limpiar datos de prueba
-- ============================================
-- DELETE FROM diagrams WHERE title = 'Test Save Flow - Inicial';
