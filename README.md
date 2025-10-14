# Diagramator

Sistema de diagramas de procesos de negocio inteligentes con integración LLM, autenticación Supabase y conexiones suaves flexibles.

## 🚀 Uso Rápido

### Instalación
```bash
cd Diagramator
npm install
npm run dev
```

### Acceso
- **Desarrollo**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Editor**: http://localhost:3000/editor/[id]
- **Login**: http://localhost:3000/login
- **Nuevo Diagrama**: http://localhost:3000/new

## ✨ Características Principales

### 🎨 Canvas Avanzado
- **4 Tipos de Nodos**: Fase, Actividad, Decisión, Proceso
- **Conexiones Suaves**: Curvas smoothstep optimizadas
- **Edición en Tiempo Real**: Doble click para editar nodos
- **Guardado Automático**: Ctrl+S / ⌘+S para persistir cambios
- **Exportación**: PNG, SVG, JSON con nombres inteligentes

### 🔐 Autenticación Segura
- **Supabase Auth**: Login con email/password
- **Sesiones Persistentes**: Estado mantenido entre recargas
- **Rutas Protegidas**: Acceso controlado a diagramas
- **Logout Seguro**: Cierre de sesión sin errores

### 📊 Dashboard Inteligente
- **Vista de Tarjetas**: Estilo Google Drive minimalista
- **Búsqueda Rápida**: Filtrado en tiempo real
- **Estadísticas**: Contadores de diagramas y vistas
- **Acciones Rápidas**: Duplicar, eliminar, abrir

### 🤖 Integración LLM
- **Copy Prompt**: Botón para copiar prompt maestro
- **Formato JSON Estándar**: Compatible con LLMs
- **Inyección Directa**: Estructura validada para integración

## 📋 Formatos JSON

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
        "size": "small|medium|large|xlarge",
        "fontSize": "small|medium|large|xlarge"
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
        "stroke": "#3B82F6",
        "strokeWidth": 2.5,
        "strokeLinecap": "round",
        "opacity": 0.8
      },
      "markerEnd": {
        "type": "arrowclosed",
        "color": "#3B82F6",
        "width": 14,
        "height": 14,
        "strokeWidth": 1.5
      },
      "data": {
        "label": ""
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

#### 1. Fase (`phase`) - Círculo Azul
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
    "size": "medium",
    "fontSize": "medium"
  }
}
```

#### 2. Actividad (`activity`) - Cuadrado Azul
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
    "size": "medium",
    "fontSize": "medium"
  }
}
```

#### 3. Decisión (`decision`) - Diamante Amarillo
```json
{
  "id": "decision-1",
  "type": "decision",
  "position": { "x": 300, "y": 300 },
  "data": {
    "label": "¿Condición?",
    "color": "#F59E0B",
    "textColor": "#FFFFFF",
    "size": "medium",
    "fontSize": "medium"
  }
}
```

#### 4. Proceso (`process`) - Hexágono Verde
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
    "size": "medium",
    "fontSize": "medium"
  }
}
```

### Conexiones Suaves (Edges)
```json
{
  "id": "edge-1",
  "source": "node-1",
  "target": "node-2",
  "type": "smoothstep",
  "label": "Sí",
  "style": {
    "stroke": "#10B981",
    "strokeWidth": 2.5,
    "strokeLinecap": "round",
    "strokeDasharray": "0",
    "opacity": 0.8
  },
  "markerEnd": {
    "type": "arrowclosed",
    "color": "#10B981",
    "width": 14,
    "height": 14,
    "strokeWidth": 1.5
  },
  "data": {
    "label": ""
  }
}
```

## 🔧 Tecnologías

### Frontend
- **Next.js 15.5.4**: Framework React con App Router
- **@xyflow/react 12.0.0**: Canvas interactivo moderno
- **Tailwind CSS**: Estilos utilitarios
- **TypeScript**: Tipado estático
- **Lucide React**: Iconografía moderna

### Backend
- **Supabase**: BaaS con PostgreSQL
- **Row Level Security**: Seguridad a nivel de fila
- **Auth**: Autenticación integrada
- **Real-time**: Actualizaciones en tiempo real

### Herramientas
- **Turbopack**: Build system rápido
- **ESLint**: Linting de código
- **html-to-image**: Exportación de imágenes

## 🗄️ Base de Datos

### Tabla: `diagrams`
```sql
CREATE TABLE diagrams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  is_template BOOLEAN DEFAULT false,
  thumbnail_url TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla: `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'premium')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
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
      "position": { "x": 0, "y": 0 },
      "data": {
        "color": "#3B82F6",
        "textColor": "#FFFFFF",
        "size": "medium",
        "fontSize": "medium"
      }
    },
    {
      "id": "qualify",
      "type": "activity",
      "label": "Calificar Prospecto",
      "description": "Evaluar si el prospecto cumple criterios",
      "position": { "x": 200, "y": 0 },
      "data": {
        "color": "#3B82F6",
        "textColor": "#1F2937",
        "size": "medium",
        "fontSize": "medium"
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "start",
      "target": "qualify",
      "type": "smoothstep",
      "label": "Iniciar",
      "style": {
        "stroke": "#3B82F6",
        "strokeWidth": 2.5,
        "strokeLinecap": "round",
        "opacity": 0.8
      },
      "markerEnd": {
        "type": "arrowclosed",
        "color": "#3B82F6",
        "width": 14,
        "height": 14
      }
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
- `small`: Compacto (120x80px)
- `medium`: Estándar (160x100px) - Recomendado
- `large`: Prominente (200x120px)
- `xlarge`: Destacado (240x140px)

### Tamaños de Fuente
- `small`: 12px
- `medium`: 14px - Recomendado
- `large`: 16px
- `xlarge`: 18px

## 📤 Exportación

### Formatos Soportados
- **PNG**: Imagen de alta resolución con fondo transparente
- **SVG**: Vector escalable para impresión
- **JSON**: Datos completos del diagrama para integración

### Nombres de Archivo Inteligentes
```
{titulo_limpio}_{fecha}_{hora}.{extension}
```
Ejemplo: `proceso_ventas_2024-01-15_14-30-25.png`

## 🔧 API Endpoints

### Autenticación
```javascript
// Login
POST /auth/v1/token?grant_type=password
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}

// Logout
POST /auth/v1/logout
```

### Diagramas
```javascript
// Crear diagrama
POST /rest/v1/diagrams
{
  "title": "Mi Diagrama",
  "description": "Descripción opcional",
  "data": { /* JSON del diagrama */ },
  "is_public": false
}

// Obtener diagrama
GET /rest/v1/diagrams?id=eq.{uuid}

// Actualizar diagrama
PATCH /rest/v1/diagrams?id=eq.{uuid}
{
  "title": "Título actualizado",
  "data": { /* JSON actualizado */ }
}

// Eliminar diagrama
DELETE /rest/v1/diagrams?id=eq.{uuid}
```

## 🎯 Casos de Uso LLM

### 1. Generación Automática
```python
import json
import requests

def generate_process_diagram(process_description):
    # LLM genera la estructura
    diagram = {
        "nodes": [
            {
                "id": "start",
                "type": "phase",
                "position": {"x": 100, "y": 100},
                "data": {
                    "label": "Inicio",
                    "color": "#3B82F6",
                    "textColor": "#FFFFFF",
                    "size": "medium",
                    "fontSize": "medium"
                }
            }
        ],
        "edges": [],
        "metadata": {
            "title": "Diagrama Generado",
            "version": "1.0"
        }
    }
    
    # Insertar en base de datos
    response = requests.post(
        f"{SUPABASE_URL}/rest/v1/diagrams",
        headers={
            "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            "Content-Type": "application/json",
            "apikey": SUPABASE_ANON_KEY
        },
        json={
            "title": "Diagrama Generado por LLM",
            "description": process_description,
            "data": diagram,
            "is_public": False
        }
    )
    
    return response.json()[0]['id']
```

### 2. Modificación Inteligente
```javascript
async function modifyDiagram(diagramId, modificationRequest) {
    // Obtener diagrama actual
    const { data: diagram } = await supabase
        .from('diagrams')
        .select('data, title')
        .eq('id', diagramId)
        .single();
    
    // LLM modifica la estructura
    const modifiedData = await llmModify(diagram.data, modificationRequest);
    
    // Actualizar en base de datos
    await supabase
        .from('diagrams')
        .update({ 
            data: modifiedData,
            updated_at: new Date().toISOString()
        })
        .eq('id', diagramId);
}
```

## 🚀 Funcionalidades Avanzadas

### Conexiones Suaves Flexibles
- **Tipo smoothstep**: Curvas naturales y elegantes
- **Extremos redondeados**: strokeLinecap: 'round'
- **Líneas más gruesas**: strokeWidth: 2.5px
- **Transparencias sutiles**: opacity optimizada
- **Flechas mejoradas**: 14x14px con bordes definidos
- **Preview punteado**: Línea de conexión con strokeDasharray: '5,5'

### Edición en Tiempo Real
- **Doble click**: Editar nodos directamente
- **Modal avanzado**: Color, tamaño, fuente personalizables
- **Guardado automático**: Cambios persistidos inmediatamente
- **Historial**: Undo/Redo con Ctrl+Z/Ctrl+Y

### Dashboard Inteligente
- **Vista minimalista**: Estilo Google Drive
- **Búsqueda instantánea**: Filtrado en tiempo real
- **Acciones rápidas**: Duplicar, eliminar, abrir
- **Estadísticas**: Contadores automáticos

## 📝 Notas Importantes

1. **IDs únicos**: Usar UUIDs o prefijos únicos para nodos
2. **Posiciones**: Coordenadas x,y en píxeles
3. **Colores**: Formato hexadecimal (#RRGGBB)
4. **Validación**: Verificar estructura antes de insertar
5. **Backup**: Exportar JSON antes de modificaciones masivas
6. **Autenticación**: Requerida para todas las operaciones CRUD
7. **RLS**: Row Level Security activado por defecto

## 🔗 Enlaces Útiles

- [@xyflow/react Documentation](https://xyflow.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🏗️ Estructura del Proyecto

```
Diagramator/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── dashboard/          # Panel de diagramas
│   │   ├── editor/[id]/        # Editor de diagrama específico
│   │   ├── login/              # Página de login
│   │   └── new/                # Crear nuevo diagrama
│   ├── components/             # Componentes React
│   │   ├── Auth/               # Componentes de autenticación
│   │   ├── Dashboard/          # Componentes del dashboard
│   │   ├── BPMSDiagram.tsx     # Canvas principal
│   │   └── BPMSDiagramWithSupabase.tsx # Canvas con persistencia
│   ├── contexts/               # Contextos React
│   │   └── AuthContext.tsx     # Contexto de autenticación
│   ├── hooks/                  # Hooks personalizados
│   │   └── useDiagrams.ts      # Hook para manejo de diagramas
│   ├── lib/                    # Utilidades
│   │   └── supabase.ts         # Cliente de Supabase
│   └── services/               # Servicios
│       └── diagramService.ts   # CRUD de diagramas
├── scripts/                    # Scripts SQL
│   ├── supabase-setup.sql      # Configuración completa
│   ├── supabase-setup-parte1-tablas.sql
│   ├── supabase-setup-parte2-indices-rls.sql
│   └── supabase-setup-parte3-funciones-triggers.sql
├── public/                     # Archivos estáticos
├── .env.local                  # Variables de entorno
├── package.json                # Dependencias
└── README.md                   # Este archivo
```

---

**Diagramator** - Sistema de diagramas de procesos de negocio inteligentes 🚀