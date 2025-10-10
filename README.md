# 📊 Diagramator

Una aplicación web moderna para crear diagramas de procesos de negocio interactivos, inspirada en el diseño limpio de Google.

## ✨ Características

### 🎨 **Interfaz Moderna**
- Diseño limpio inspirado en Google
- Banner elegante con gradientes sutiles y textura
- Modales con fondo transparente y desenfoque
- Tipografía optimizada y colores balanceados

### 🔧 **Funcionalidades Principales**

#### **Creación de Nodos**
- **4 tipos de nodos**: Fase, Actividad, Decisión, Proceso
- **Personalización completa**: Colores, texto, tamaño
- **4 tamaños**: Pequeño, Mediano, Grande, Extra Grande
- **Cambio de tipo**: Sin eliminar el nodo, manteniendo posición y contenido

#### **Gestión de Diagramas**
- **Plantillas predefinidas**: Workflow Básico, Árbol de Decisión, Vacío
- **Importación JSON**: Pegar directamente desde el portapapeles (Ctrl+V)
- **Exportación múltiple**: PNG, SVG, JSON
- **Historial completo**: Undo/Redo con Ctrl+Z/Ctrl+Y

#### **Interacciones Avanzadas**
- **Selección múltiple**: Ctrl+Click para seleccionar varios nodos
- **Seleccionar todo**: Ctrl+A para seleccionar todos los nodos
- **Duplicación**: Ctrl+D para duplicar elementos seleccionados
- **Copia/Pegado**: Ctrl+C/Ctrl+V para copiar y pegar elementos
- **Atajos de teclado**: Sistema completo de shortcuts

## 🚀 **Instalación y Uso**

### **Requisitos**
- Node.js 18+ 
- npm o yarn

### **Instalación**
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/diagramator.git
cd diagramator

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Abrir en el navegador
# http://localhost:3001
```

### **Comandos Disponibles**
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construcción para producción
npm run preview      # Vista previa de producción
npm run lint         # Verificar código
```

## 📖 **Guía de Uso**

### **Crear un Diagrama**

1. **Seleccionar herramienta**: Click en los botones del panel izquierdo
2. **Crear nodo**: Click en el canvas para colocar el nodo
3. **Conectar nodos**: Drag desde los handles (puntos de conexión)
4. **Editar nodo**: Doble click para abrir el modal de edición

### **Atajos de Teclado**

| Atajo | Función |
|-------|---------|
| `Ctrl+A` | Seleccionar todos los nodos |
| `Ctrl+C` | Copiar elementos seleccionados |
| `Ctrl+V` | Pegar elementos o importar JSON |
| `Ctrl+D` | Duplicar elementos seleccionados |
| `Ctrl+Z` | Deshacer |
| `Ctrl+Y` | Rehacer |
| `Ctrl+S` | Exportar como JSON |
| `Delete` | Eliminar elementos seleccionados |
| `Esc` | Cancelar modo de herramienta |

### **Personalización de Nodos**

#### **Modal de Edición**
- **Título y Descripción**: Campos de texto editables
- **Colores**: Selector de color para fondo y texto
- **Tipo de nodo**: Cambio entre Fase, Actividad, Decisión, Proceso
- **Tamaño**: 4 opciones de tamaño con vista previa
- **Vista previa**: Mini nodo que muestra cambios en tiempo real

#### **Tipos de Nodos**

| Tipo | Forma | Uso | Colores por defecto |
|------|-------|-----|-------------------|
| **Fase** | Rectángulo redondeado | Procesos principales | Azul |
| **Actividad** | Rectángulo con icono | Tareas específicas | Gris |
| **Decisión** | Círculo con icono | Puntos de decisión | Amarillo |
| **Proceso** | Rectángulo con check | Procesos finales | Verde |

## 📋 **Estructura JSON para LLMs**

### **Formato para IA**

Para generar diagramas con IA (ChatGPT, Claude, etc.), usa esta estructura:

```json
{
  "nodes": [
    {
      "id": "unique_id",
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
      "id": "unique_edge_id",
      "source": "source_node_id",
      "target": "target_node_id",
      "label": "Etiqueta opcional",
      "style": { "stroke": "#3B82F6", "strokeWidth": 2 }
    }
  ]
}
```

### **Ejemplo Completo**

```json
{
  "nodes": [
    {
      "id": "start",
      "type": "phase",
      "position": { "x": 200, "y": 100 },
      "data": {
        "label": "Inicio del Proceso",
        "description": "Punto de partida del workflow",
        "color": "#10B981",
        "textColor": "#FFFFFF",
        "size": "medium"
      }
    },
    {
      "id": "task1",
      "type": "activity",
      "position": { "x": 200, "y": 250 },
      "data": {
        "label": "Realizar Tarea",
        "description": "Descripción de la actividad",
        "color": "#3B82F6",
        "textColor": "#FFFFFF",
        "size": "medium"
      }
    },
    {
      "id": "decision",
      "type": "decision",
      "position": { "x": 200, "y": 400 },
      "data": {
        "label": "¿Aprobado?",
        "color": "#EAB308",
        "textColor": "#FFFFFF",
        "size": "medium"
      }
    },
    {
      "id": "end",
      "type": "process",
      "position": { "x": 400, "y": 550 },
      "data": {
        "label": "Proceso Completado",
        "description": "Fin del workflow",
        "color": "#EF4444",
        "textColor": "#FFFFFF",
        "size": "medium"
      }
    }
  ],
  "edges": [
    {
      "id": "e1",
      "source": "start",
      "target": "task1",
      "style": { "stroke": "#3B82F6", "strokeWidth": 2 }
    },
    {
      "id": "e2",
      "source": "task1",
      "target": "decision",
      "style": { "stroke": "#3B82F6", "strokeWidth": 2 }
    },
    {
      "id": "e3",
      "source": "decision",
      "target": "end",
      "label": "Sí",
      "style": { "stroke": "#10B981", "strokeWidth": 2 }
    }
  ]
}
```

### **Prompt para IA**

```
Crea un diagrama de proceso de negocio en formato JSON con esta estructura:

- Usa tipos: "phase" (procesos principales), "activity" (tareas), "decision" (decisiones), "process" (finales)
- Colores: azul (#3B82F6), verde (#10B981), amarillo (#EAB308), rojo (#EF4444), gris (#6B7280)
- Tamaños: "small", "medium", "large", "xlarge"
- Posiciones: coordenas x,y (recomiendo espaciado de 150-200px)
- Conexiones: source y target deben coincidir con IDs de nodos

[Describe tu proceso aquí]

Responde SOLO con el JSON, sin explicaciones adicionales.
```

## 🛠 **Tecnologías**

- **Frontend**: React 18, TypeScript
- **UI**: Tailwind CSS
- **Diagramas**: ReactFlow
- **Iconos**: Lucide React
- **Build**: Vite

## 📁 **Estructura del Proyecto**

```
src/
├── components/
│   └── BPMSDiagram.tsx    # Componente principal
├── app/
│   ├── globals.css        # Estilos globales
│   └── layout.tsx         # Layout de la aplicación
└── main.tsx              # Punto de entrada
```

## 🎯 **Casos de Uso**

- **Diagramas de procesos de negocio**
- **Workflows de aprobación**
- **Flujos de trabajo organizacionales**
- **Mapas de procesos**
- **Diagramas de decisión**
- **Prototipos de UX**

## 🔄 **Importación/Exportación**

### **Importar JSON**
1. Copia el JSON al portapapeles
2. Presiona `Ctrl+V` o click en "📥 Importar JSON"
3. El diagrama se carga automáticamente

### **Exportar**
- **PNG**: Imagen de alta calidad
- **SVG**: Vector escalable
- **JSON**: Datos del diagrama para reutilizar

## 🎨 **Personalización**

### **Colores Disponibles**
- **Azul**: `#3B82F6` (por defecto)
- **Verde**: `#10B981` 
- **Amarillo**: `#EAB308`
- **Rojo**: `#EF4444`
- **Gris**: `#6B7280`
- **Personalizados**: Cualquier color hexadecimal

### **Tamaños de Nodos**
- **Pequeño**: Compacto para diagramas densos
- **Mediano**: Tamaño estándar (por defecto)
- **Grande**: Más prominente
- **Extra Grande**: Para elementos principales

## 🚀 **Próximas Características**

- [ ] Colaboración en tiempo real
- [ ] Más tipos de nodos
- [ ] Temas personalizables
- [ ] Exportación a PDF
- [ ] Integración con APIs
- [ ] Modo presentación

## 🤝 **Contribuir**

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

**Diagramator** - Crea diagramas de procesos de negocio de forma intuitiva y profesional 🚀