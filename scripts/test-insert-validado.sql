-- ============================================
-- TEST: INSERTAR DIAGRAMA CON FORMATO VALIDADO
-- ============================================
-- Este script usa la estructura PROBADA en el canvas

-- Insertar diagrama de prueba con la estructura validada
INSERT INTO diagrams (title, description, data, user_id, is_public)
VALUES (
  'Proceso Aduanero PPU - Test',
  'Diagrama de prueba con estructura validada en canvas',
  '{
    "nodes": [
      {
        "id": "phase1",
        "type": "phase",
        "position": {
          "x": 400,
          "y": 50
        },
        "data": {
          "label": "FASE 1: PRE-ARRIBO",
          "description": "Orquestación de declaraciones y validaciones previas",
          "icon": null
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "activity1-1",
        "type": "activity",
        "position": {
          "x": 200,
          "y": 150
        },
        "data": {
          "label": "Orquestación de la declaración anticipada",
          "description": "PPU recibe y valida declaraciones anticipadas",
          "icon": null
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "decision1",
        "type": "decision",
        "position": {
          "x": 400,
          "y": 250
        },
        "data": {
          "label": "¿Aprobaciones OK?",
          "icon": null
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "result1",
        "type": "process",
        "position": {
          "x": 200,
          "y": 350
        },
        "data": {
          "label": "Rechazar",
          "description": "No se cumple condicionalidad",
          "icon": null
        },
        "selected": false,
        "dragging": false
      },
      {
        "id": "result2",
        "type": "process",
        "position": {
          "x": 600,
          "y": 350
        },
        "data": {
          "label": "Continuar",
          "description": "Proceder a fase de arribo",
          "icon": null
        },
        "selected": false,
        "dragging": false
      }
    ],
    "edges": [
      {
        "id": "e1-1",
        "source": "phase1",
        "target": "activity1-1",
        "type": "smoothstep",
        "style": {
          "stroke": "#3B82F6",
          "strokeWidth": 2
        },
        "markerEnd": {
          "type": "arrowclosed",
          "color": "#3B82F6"
        },
        "selected": false
      },
      {
        "id": "e1-2",
        "source": "activity1-1",
        "target": "decision1",
        "type": "smoothstep",
        "style": {
          "stroke": "#6B7280",
          "strokeWidth": 2
        },
        "markerEnd": {
          "type": "arrowclosed",
          "color": "#6B7280"
        },
        "selected": false
      },
      {
        "id": "e1-3",
        "source": "decision1",
        "target": "result1",
        "type": "smoothstep",
        "style": {
          "stroke": "#EF4444",
          "strokeWidth": 2
        },
        "label": "No",
        "labelStyle": {
          "fill": "#EF4444",
          "fontWeight": 600
        },
        "markerEnd": {
          "type": "arrowclosed",
          "color": "#EF4444"
        },
        "selected": false
      },
      {
        "id": "e1-4",
        "source": "decision1",
        "target": "result2",
        "type": "smoothstep",
        "style": {
          "stroke": "#10B981",
          "strokeWidth": 2
        },
        "label": "Sí",
        "labelStyle": {
          "fill": "#10B981",
          "fontWeight": 600
        },
        "markerEnd": {
          "type": "arrowclosed",
          "color": "#10B981"
        },
        "selected": false
      }
    ],
    "metadata": {
      "name": "BPMS Diagram Test",
      "created": "2025-10-10T02:10:15.339Z",
      "version": "1.0"
    }
  }'::jsonb,
  '00000000-0000-0000-0000-000000000000'::uuid, -- Reemplazar con user_id real
  false
)
RETURNING id, title, created_at;

-- Verificar que se insertó correctamente
SELECT 
  id,
  title,
  description,
  jsonb_array_length(data->'nodes') as total_nodes,
  jsonb_array_length(data->'edges') as total_edges,
  data->'metadata'->>'name' as diagram_name,
  is_public,
  created_at
FROM diagrams
WHERE title = 'Proceso Aduanero PPU - Test'
ORDER BY created_at DESC
LIMIT 1;

-- Verificar estructura de nodos
SELECT 
  id,
  title,
  jsonb_pretty(data->'nodes'->0) as primer_nodo,
  jsonb_pretty(data->'edges'->0) as primera_conexion
FROM diagrams
WHERE title = 'Proceso Aduanero PPU - Test'
LIMIT 1;

-- Limpiar (opcional - descomentar para eliminar el test)
-- DELETE FROM diagrams WHERE title = 'Proceso Aduanero PPU - Test';

