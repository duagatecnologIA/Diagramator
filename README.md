# Diagramator

Sistema de diagramas de procesos de negocio con integración LLM y base de datos.

## 🚀 Uso Rápido

### Instalación
```bash
npm install
npm run dev
```

### Acceso
- **Desarrollo**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Editor**: http://localhost:3000/editor/[id]

## 📋 Formatos JSON

> ✅ **FORMATO VALIDADO**: Ver [FORMATO_FINAL_VALIDADO.md](./FORMATO_FINAL_VALIDADO.md) - ⭐ **PROBADO EN CANVAS**
> 
> 🎯 **Estructura Técnica**: Ver [ESTRUCTURA_JSON_CORRECTA.md](./ESTRUCTURA_JSON_CORRECTA.md) - Revisado del código fuente

## 📤 Formato de Salida (Exportación)

### Estructura Básica
```json
{
  "nodes": [
    {
      "id": "node-1",
      "type": "phase|activity|decision|process",
      "position": { "x": 100, "y": 100 },
      "data": {
        "label": "Título del nodo",
        "description": "Descripción opcional",
        "color": "#3B82F6",
        "textColor": "#FFFFFF",
        "size": "small|medium|large|xlarge"
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "node-1",
      "target": "node-2",
      "type": "smoothstep",
      "label": "Etiqueta opcional",
      "style": {
        "stroke": "#6B7280",
        "strokeWidth": 2
      },
      "markerEnd": {
        "type": "arrowclosed",
        "color": "#6B7280"
      }
    }
  ],
  "metadata": {
    "title": "Nombre del diagrama",
    "created": "2024-01-15T10:30:00.000Z",
    "version": "1.0"
  }
}
```

### Tipos de Nodos

#### 1. Fase (`phase`)
```json
{
  "id": "phase-1",
  "type": "phase",
  "position": { "x": 100, "y": 100 },
  "data": {
    "label": "Fase Principal",
    "description": "Descripción de la fase",
    "color": "#3B82F6",
    "textColor": "#FFFFFF",
    "size": "medium"
  }
}
```

#### 2. Actividad (`activity`)
```json
{
  "id": "activity-1",
  "type": "activity",
  "position": { "x": 200, "y": 200 },
  "data": {
    "label": "Nueva Actividad",
    "description": "Descripción de la actividad",
    "color": "#3B82F6",
    "textColor": "#1F2937",
    "size": "medium"
  }
}
```

#### 3. Decisión (`decision`)
```json
{
  "id": "decision-1",
  "type": "decision",
  "position": { "x": 300, "y": 300 },
  "data": {
    "label": "¿Condición?",
    "color": "#F59E0B",
    "textColor": "#FFFFFF",
    "size": "medium"
  }
}
```

#### 4. Proceso (`process`)
```json
{
  "id": "process-1",
  "type": "process",
  "position": { "x": 400, "y": 400 },
  "data": {
    "label": "Proceso Final",
    "description": "Descripción del proceso",
    "color": "#10B981",
    "textColor": "#FFFFFF",
    "size": "medium"
  }
}
```

### Conexiones (Edges)
```json
{
  "id": "edge-1",
  "source": "node-1",
  "target": "node-2",
  "type": "smoothstep",
  "label": "Sí",
  "style": {
    "stroke": "#10B981",
    "strokeWidth": 2
  },
  "markerEnd": {
    "type": "arrowclosed",
    "color": "#10B981"
  },
  "labelStyle": {
    "fill": "#10B981",
    "fontWeight": 600
  }
}
```

## 🤖 Integración con LLMs

### Estructura para Inyección LLM
```json
{
  "diagram_type": "business_process",
  "title": "Proceso de Ventas",
  "description": "Flujo completo del proceso de ventas",
  "nodes": [
    {
      "id": "start",
      "type": "phase",
      "label": "Inicio del Proceso",
      "description": "Punto de entrada del proceso de ventas",
      "position": { "x": 0, "y": 0 }
    },
    {
      "id": "qualify",
      "type": "activity",
      "label": "Calificar Prospecto",
      "description": "Evaluar si el prospecto cumple criterios",
      "position": { "x": 200, "y": 0 }
    },
    {
      "id": "decision",
      "type": "decision",
      "label": "¿Cumple criterios?",
      "position": { "x": 400, "y": 0 }
    }
  ],
  "edges": [
    {
      "source": "start",
      "target": "qualify",
      "label": "Iniciar"
    },
    {
      "source": "qualify",
      "target": "decision",
      "label": "Evaluar"
    }
  ]
}
```

### Colores por Defecto
```json
{
  "phase": "#3B82F6",
  "activity": "#3B82F6", 
  "decision": "#F59E0B",
  "process": "#10B981"
}
```

### Tamaños Disponibles
- `small`: Compacto
- `medium`: Estándar (recomendado)
- `large`: Prominente
- `xlarge`: Destacado

## 🗄️ Base de Datos

### Tabla: `diagrams`
```sql
CREATE TABLE diagrams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Inserción desde LLM
```javascript
// Ejemplo de inserción
const diagramData = {
  title: "Proceso Generado por LLM",
  description: "Diagrama creado automáticamente",
  data: {
    nodes: [...],
    edges: [...],
    metadata: {...}
  },
  is_public: false
};

await supabase.from('diagrams').insert(diagramData);
```

## 📤 Exportación

### Formatos Soportados
- **PNG**: Imagen de alta resolución
- **SVG**: Vector escalable
- **JSON**: Datos completos del diagrama

### Nombres de Archivo
```
{titulo_limpio}_{fecha}_{hora}.{extension}
```
Ejemplo: `proceso_ventas_2024-01-15_14-30-25.png`

## 🔧 API Endpoints

### Crear Diagrama
```javascript
POST /api/diagrams
{
  "title": "Mi Diagrama",
  "data": { /* JSON del diagrama */ }
}
```

### Obtener Diagrama
```javascript
GET /api/diagrams/{id}
```

### Actualizar Diagrama
```javascript
PUT /api/diagrams/{id}
{
  "data": { /* JSON actualizado */ }
}
```

## 🎯 Casos de Uso LLM

### 1. Generación Automática
```python
# Python ejemplo
import json

def generate_process_diagram(process_description):
    # LLM genera la estructura
    diagram = {
        "nodes": [...],
        "edges": [...],
        "metadata": {...}
    }
    
    # Insertar en base de datos
    response = supabase.table('diagrams').insert({
        'title': 'Diagrama Generado',
        'data': diagram
    }).execute()
    
    return response.data[0]['id']
```

### 2. Modificación Inteligente
```javascript
// JavaScript ejemplo
async function modifyDiagram(diagramId, modificationRequest) {
    // Obtener diagrama actual
    const { data: diagram } = await supabase
        .from('diagrams')
        .select('data')
        .eq('id', diagramId)
        .single();
    
    // LLM modifica la estructura
    const modifiedData = await llmModify(diagram.data, modificationRequest);
    
    // Actualizar en base de datos
    await supabase
        .from('diagrams')
        .update({ data: modifiedData })
        .eq('id', diagramId);
}
```

## 📝 Notas Importantes

1. **IDs únicos**: Usar UUIDs o prefijos únicos para nodos
2. **Posiciones**: Coordenadas x,y en píxeles
3. **Colores**: Formato hexadecimal (#RRGGBB)
4. **Validación**: Verificar estructura antes de insertar
5. **Backup**: Exportar JSON antes de modificaciones masivas

## 🔗 Enlaces Útiles

- [React Flow Documentation](https://reactflow.dev/learn)
- [Supabase Documentation](https://supabase.com/docs)
- [JSON Schema Validator](https://www.jsonschemavalidator.net/)
