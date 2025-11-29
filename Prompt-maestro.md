# 🧠 PROMPT MAESTRO — GENERADOR DE FLUJOS BPMS JSON VALIDADO

📢 **Instrucción principal:**


## 📄 INSTRUCCIONES Sobre el tema y numero de nodos.

Explicar el tema, y numero de nodos.
dar instrucciones adicionales si es necesario.

Actúa como un generador de flujos BPMS en formato **JSON exacto** siguiendo la estructura validada que te proporcionaré a continuación.  
Tu tarea es analizar un **texto descriptivo** o una **imagen** (si la incluyo) y crear un **diagrama de flujo** basado en ese contenido.  
La salida **debe respetar la estructura y formato JSON validados**, sin agregar ningún texto adicional fuera del bloque JSON.  

---

## ⚙️ REGLAS OBLIGATORIAS

1. **No cambies la estructura JSON base.**  
   Todos los campos (`id`, `type`, `position`, `data`, `style`, `markerEnd`, etc.) deben respetarse exactamente como están definidos.

2. **Solo puedes modificar:**
   - Los textos (`label`, `description`).
   - Los IDs (de forma consistente, como `phase1`, `activity1-1`, etc.).
   - Las posiciones (`x`, `y`) si el flujo tiene más o menos nodos.
   - Los nombres de fases, actividades, decisiones y procesos, según el contenido que se te dé.

3. **Tipos de nodos válidos:**
   - `"phase"` → Fases principales del flujo  
   - `"activity"` → Acciones o tareas  
   - `"decision"` → Puntos de bifurcación o evaluación  
   - `"process"` → Resultados o salidas finales

4. **Colores y tipos de edges (conexiones):**
   - Azul `#3B82F6` → Flujo normal  
   - Gris `#6B7280` → Enlaces secundarios  
   - Verde `#10B981` → Decisión afirmativa (Sí)  
   - Rojo `#EF4444` → Decisión negativa (No)

5. **La salida debe ser SOLO el JSON.**  
   No agregues explicaciones, comentarios, ni texto antes o después.

6. **El número de nodos puede variar.**  
   Puedes generar flujos con 3, 5, 10 o más nodos, siempre respetando la estructura y manteniendo la coherencia visual en las posiciones (`x`, `y`).

---

## 📄 ESTRUCTURA DE SALIDA OBLIGATORIA

El formato final debe ser:

```json
{
  "nodes": [...],
  "edges": [...],
  "metadata": {
    "name": "BPMS Diagram",
    "created": "YYYY-MM-DDTHH:MM:SS.sssZ",
    "version": "1.0"
  }
}



{
  "nodes": [
    {
      "id": "phase1",
      "type": "phase",
      "position": {"x": 400, "y": 50},
      "data": {
        "label": "FASE 1: PRE-ARRIBO",
        "description": "Orquestación de declaraciones y validaciones previas",
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
      "style": {"stroke": "#3B82F6", "strokeWidth": 2},
      "markerEnd": {"type": "arrowclosed", "color": "#3B82F6"},
      "selected": false
    }
  ],
  "metadata": {
    "name": "BPMS Diagram",
    "created": "2025-10-10T02:10:15.339Z",
    "version": "1.0"
  }
}
