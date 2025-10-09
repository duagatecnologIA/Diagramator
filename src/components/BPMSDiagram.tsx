'use client';

import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  NodeTypes,
  Position,
  Handle,
  ConnectionLineType,
  MarkerType,
  EdgeTypes,
  ReactFlowProvider,
  useReactFlow,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Ship, 
  FileText, 
  Shield, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  DollarSign,
  Truck,
  Lock,
  Camera,
  X
} from 'lucide-react';

// Definir tipos de nodos personalizados
const nodeTypes: NodeTypes = {
  phase: PhaseNode,
  activity: ActivityNode,
  decision: DecisionNode,
  process: ProcessNode,
};

// Nodo para las fases principales
function PhaseNode({ data }: { data: any }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-xl border-4 border-blue-300 min-w-[400px] text-center relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-300 border-2 border-white"
      />
      <div className="flex items-center justify-center gap-3 mb-3">
        {data.icon}
        <h3 className="text-xl font-bold">{data.label}</h3>
      </div>
      <p className="text-sm text-blue-100">{data.description}</p>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-300 border-2 border-white"
      />
    </div>
  );
}

// Nodo para actividades
function ActivityNode({ data }: { data: any }) {
  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg p-3 shadow-md min-w-[250px] relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
      <div className="flex items-center gap-2 mb-1">
        {data.icon}
        <h4 className="font-semibold text-gray-800">{data.label}</h4>
      </div>
      <p className="text-sm text-gray-600">{data.description}</p>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-gray-400 border-2 border-white"
      />
    </div>
  );
}

// Nodo para decisiones
function DecisionNode({ data }: { data: any }) {
  return (
    <div className="bg-yellow-100 border-2 border-yellow-400 rounded-full p-4 shadow-md min-w-[120px] min-h-[120px] flex items-center justify-center relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-yellow-500 border-2 border-white"
      />
      <div className="text-center">
        {data.icon}
        <p className="text-sm font-semibold text-yellow-800 mt-1">{data.label}</p>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-yellow-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Left}
        className="w-3 h-3 bg-yellow-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-yellow-500 border-2 border-white"
      />
    </div>
  );
}

// Nodo para procesos
function ProcessNode({ data }: { data: any }) {
  return (
    <div className="bg-green-100 border-2 border-green-400 rounded-lg p-3 shadow-md min-w-[200px] relative">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
      <div className="flex items-center gap-2 mb-1">
        {data.icon}
        <h4 className="font-semibold text-green-800">{data.label}</h4>
      </div>
      <p className="text-sm text-green-700">{data.description}</p>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
    </div>
  );
}

// Componente interno para manejar la lógica del diagrama
function BPMSDiagramInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { deleteElements } = useReactFlow();

  // Estados para el historial de undo/redo
  const [history, setHistory] = React.useState<{nodes: Node[], edges: Edge[]}[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Función para guardar el estado actual en el historial
  const saveToHistory = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    const newState = { nodes: [...newNodes], edges: [...newEdges] };
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newState);
      return newHistory.slice(-50); // Mantener solo los últimos 50 estados
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  // Función para deshacer (Ctrl+Z)
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(prev => prev - 1);
    }
  }, [historyIndex, history, setNodes, setEdges]);

  // Función para rehacer (Ctrl+Y)
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(prev => prev + 1);
    }
  }, [historyIndex, history, setNodes, setEdges]);

  // Función para eliminar elementos seleccionados
  const onDelete = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    const selectedEdges = edges.filter(edge => edge.selected);
    
    if (selectedNodes.length > 0 || selectedEdges.length > 0) {
      // Guardar estado antes de eliminar
      saveToHistory(nodes, edges);
      deleteElements({ nodes: selectedNodes, edges: selectedEdges });
    }
  }, [deleteElements, nodes, edges, saveToHistory]);

  // Manejar teclas de atajo
  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
      event.preventDefault();
      undo();
    } else if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
      event.preventDefault();
      redo();
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      onDelete();
    }
  }, [undo, redo, onDelete]);

  // Definir los nodos del diagrama organizados por fases
  const initialNodes: Node[] = useMemo(() => [
    // ========== FASE 1: PRE-ARRIBO ==========
    {
      id: 'phase1',
      type: 'phase',
      position: { x: 400, y: 50 },
      data: {
        label: 'FASE 1: PRE-ARRIBO',
        description: 'Orquestación de declaraciones y validaciones previas',
        icon: <Ship className="w-6 h-6" />
      },
    },
    {
      id: 'activity1-1',
      type: 'activity',
      position: { x: 200, y: 150 },
      data: {
        label: 'Orquestación de la declaración anticipada',
        description: 'PPU recibe y valida declaraciones anticipadas, cruza con manifiestos y listas de carga',
        icon: <FileText className="w-5 h-5 text-blue-600" />
      },
    },
    {
      id: 'activity1-2',
      type: 'activity',
      position: { x: 600, y: 150 },
      data: {
        label: 'Condicionalidad por vistos buenos',
        description: 'Consulta VUCE en tiempo real, aplica reglas de control previo',
        icon: <Shield className="w-5 h-5 text-blue-600" />
      },
    },
    {
      id: 'decision1',
      type: 'decision',
      position: { x: 400, y: 250 },
      data: {
        label: '¿Aprobaciones OK?',
        icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />
      },
    },
    {
      id: 'result1',
      type: 'process',
      position: { x: 200, y: 350 },
      data: {
        label: 'Rechazar',
        description: 'No se cumple condicionalidad',
        icon: <X className="w-5 h-5 text-red-600" />
      },
    },
    {
      id: 'result2',
      type: 'process',
      position: { x: 600, y: 350 },
      data: {
        label: 'Continuar',
        description: 'Proceder a fase de arribo',
        icon: <CheckCircle className="w-5 h-5 text-green-600" />
      },
    },

    // ========== FASE 2: ARRIBO ==========
    {
      id: 'phase2',
      type: 'phase',
      position: { x: 400, y: 500 },
      data: {
        label: 'FASE 2: ARRIBO',
        description: 'Selectividad, inspección y verificación de integridad física',
        icon: <Eye className="w-6 h-6" />
      },
    },
    {
      id: 'activity2-1',
      type: 'activity',
      position: { x: 200, y: 600 },
      data: {
        label: 'Selectividad e inspección en muelle',
        description: 'Inspección no intrusiva, registro audiovisual y rayos X',
        icon: <Camera className="w-5 h-5 text-blue-600" />
      },
    },
    {
      id: 'activity2-2',
      type: 'activity',
      position: { x: 600, y: 600 },
      data: {
        label: 'Integridad física de unidades',
        description: 'Lectura de sellos, verificación de dispositivos de seguridad',
        icon: <Lock className="w-5 h-5 text-blue-600" />
      },
    },

    // ========== FASE 3: POST-SELECTIVIDAD ==========
    {
      id: 'phase3',
      type: 'phase',
      position: { x: 400, y: 800 },
      data: {
        label: 'FASE 3: POST-SELECTIVIDAD',
        description: 'Pago, levante, retiro y tránsito aduanero',
        icon: <CheckCircle className="w-6 h-6" />
      },
    },
    {
      id: 'activity3-1',
      type: 'activity',
      position: { x: 200, y: 900 },
      data: {
        label: 'Pago posterior y levante',
        description: 'Habilitación de pagos, consolidación de vistos buenos, emisión de levante',
        icon: <DollarSign className="w-5 h-5 text-blue-600" />
      },
    },
    {
      id: 'activity3-2',
      type: 'activity',
      position: { x: 600, y: 900 },
      data: {
        label: 'Tránsito aduanero',
        description: 'Autorización con número de sello, monitoreo de operación',
        icon: <Truck className="w-5 h-5 text-blue-600" />
      },
    },
  ], []);

  // Definir las conexiones entre nodos organizadas por fases con flechas direccionales
  const initialEdges: Edge[] = useMemo(() => [
    // ========== CONEXIONES FASE 1: PRE-ARRIBO ==========
    { 
      id: 'e1-1', 
      source: 'phase1', 
      target: 'activity1-1', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' },
      style: { stroke: '#3B82F6', strokeWidth: 2 }
    },
    { 
      id: 'e1-2', 
      source: 'phase1', 
      target: 'activity1-2', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' },
      style: { stroke: '#3B82F6', strokeWidth: 2 }
    },
    { 
      id: 'e1-3', 
      source: 'activity1-1', 
      target: 'decision1', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6B7280' },
      style: { stroke: '#6B7280', strokeWidth: 2 }
    },
    { 
      id: 'e1-4', 
      source: 'activity1-2', 
      target: 'decision1', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6B7280' },
      style: { stroke: '#6B7280', strokeWidth: 2 }
    },
    { 
      id: 'e1-5', 
      source: 'decision1', 
      target: 'result1', 
      type: 'smoothstep', 
      label: 'No',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#EF4444' },
      style: { stroke: '#EF4444', strokeWidth: 2 },
      labelStyle: { fill: '#EF4444', fontWeight: 600 }
    },
    { 
      id: 'e1-6', 
      source: 'decision1', 
      target: 'result2', 
      type: 'smoothstep', 
      label: 'Sí',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' },
      style: { stroke: '#10B981', strokeWidth: 2 },
      labelStyle: { fill: '#10B981', fontWeight: 600 }
    },

    // ========== CONEXIONES ENTRE FASES ==========
    { 
      id: 'e2-1', 
      source: 'result2', 
      target: 'phase2', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' },
      style: { stroke: '#3B82F6', strokeWidth: 3 }
    },

    // ========== CONEXIONES FASE 2: ARRIBO ==========
    { 
      id: 'e2-2', 
      source: 'phase2', 
      target: 'activity2-1', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' },
      style: { stroke: '#3B82F6', strokeWidth: 2 }
    },
    { 
      id: 'e2-3', 
      source: 'phase2', 
      target: 'activity2-2', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' },
      style: { stroke: '#3B82F6', strokeWidth: 2 }
    },

    // ========== CONEXIONES ENTRE FASES ==========
    { 
      id: 'e3-1', 
      source: 'activity2-1', 
      target: 'phase3', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6B7280' },
      style: { stroke: '#6B7280', strokeWidth: 2 }
    },
    { 
      id: 'e3-2', 
      source: 'activity2-2', 
      target: 'phase3', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#6B7280' },
      style: { stroke: '#6B7280', strokeWidth: 2 }
    },

    // ========== CONEXIONES FASE 3: POST-SELECTIVIDAD ==========
    { 
      id: 'e3-3', 
      source: 'phase3', 
      target: 'activity3-1', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' },
      style: { stroke: '#3B82F6', strokeWidth: 2 }
    },
    { 
      id: 'e3-4', 
      source: 'phase3', 
      target: 'activity3-2', 
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3B82F6' },
      style: { stroke: '#3B82F6', strokeWidth: 2 }
    },
  ], []);

  // Inicializar nodos y edges
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    // Guardar estado inicial en el historial
    saveToHistory(initialNodes, initialEdges);
  }, [setNodes, setEdges, saveToHistory]);

  // Guardar estado en historial cuando cambian los nodos o edges (excepto en undo/redo)
  React.useEffect(() => {
    if (historyIndex === -1 || (history.length > 0 && history[historyIndex]?.nodes !== nodes)) {
      // Solo guardar si no es una operación de undo/redo
      const timeoutId = setTimeout(() => {
        saveToHistory(nodes, edges);
      }, 100); // Debounce para evitar guardar demasiado frecuentemente
      
      return () => clearTimeout(timeoutId);
    }
  }, [nodes, edges, historyIndex, history, saveToHistory]);

  return (
    <div className="w-full h-screen">
      <div className="h-16 bg-gray-800 text-white flex items-center justify-between px-6">
        <h1 className="text-2xl font-bold">Diagrama BPMS - Proceso Portuario y Aduanero por Fases</h1>
        <div className="text-sm text-gray-300">
          <span className="mr-4">🖱️ Arrastra nodos</span>
          <span className="mr-4">🔗 Conecta con handles</span>
          <span className="mr-4">↶ Ctrl+Z para deshacer</span>
          <span className="mr-4">🗑️ Delete para eliminar</span>
          <span>🔍 Zoom con rueda</span>
        </div>
      </div>
      <div className="h-[calc(100vh-4rem)] relative" onKeyDown={onKeyDown} tabIndex={0}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          connectionLineType={ConnectionLineType.SmoothStep}
          defaultEdgeOptions={{
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { strokeWidth: 2 }
          }}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          selectNodesOnDrag={false}
          panOnDrag={true}
          zoomOnScroll={true}
          panOnScroll={false}
          preventScrolling={false}
          minZoom={0.1}
          maxZoom={2}
          deleteKeyCode={null} // Deshabilitamos la eliminación por tecla por defecto
          multiSelectionKeyCode={['Meta', 'Ctrl']} // Cmd/Ctrl para selección múltiple
          selectionKeyCode={['Meta', 'Ctrl']} // Cmd/Ctrl para selección
        >
          <Controls 
            showInteractive={true}
            showFitView={true}
            showZoom={true}
          />
          <Panel position="top-right" className="bg-white rounded-lg shadow-lg p-3 space-y-2">
            <div className="text-xs text-gray-600 mb-2 font-medium">Herramientas de Edición</div>
            
            {/* Botones de Undo/Redo */}
            <div className="flex space-x-1">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                title="Deshacer (Ctrl+Z)"
              >
                ↶
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                title="Rehacer (Ctrl+Y)"
              >
                ↷
              </button>
            </div>

            {/* Botón de Eliminar */}
            <button
              onClick={onDelete}
              className="w-full px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!nodes.some(node => node.selected) && !edges.some(edge => edge.selected)}
            >
              🗑️ Eliminar Seleccionados
            </button>
            
            <div className="text-xs text-gray-500 mt-2">
              <div>• Click para seleccionar</div>
              <div>• Cmd/Ctrl + Click para múltiple</div>
              <div>• Ctrl+Z para deshacer</div>
              <div>• Ctrl+Y para rehacer</div>
              <div>• Delete/Backspace para eliminar</div>
            </div>
          </Panel>
          <Background variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>
    </div>
  );
}

// Componente principal que envuelve con ReactFlowProvider
export default function BPMSDiagram() {
  return (
    <ReactFlowProvider>
      <BPMSDiagramInner />
    </ReactFlowProvider>
  );
}
