'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Copy, Check, Upload, FileText, Image, XCircle, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  files?: UploadedFile[];
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateDiagram: (jsonData: any) => void;
}

const PROMPT_MAESTRO = `# 🧠 PROMPT MAESTRO — GENERADOR DE FLUJOS BPMS JSON VALIDADO

📢 **Instrucción principal:**

## 📄 INSTRUCCIONES Sobre el tema y numero de nodos.

**Las instrucciones vienen dictadas por el usuario**

Actúa como un generador de flujos BPMS en formato **JSON exacto** siguiendo la estructura validada que te proporcionaré a continuación.  
Tu tarea es analizar un **texto descriptivo**, **imágenes** o **archivos PDF** (si los incluyo) y crear un **diagrama de flujo** basado en ese contenido.  

**IMPORTANTE:** Si el usuario adjunta archivos (imágenes o PDFs), debes:
1. **Analizar directamente** el contenido de las imágenes adjuntas
2. **Extraer información** sobre procesos, flujos, decisiones y actividades visibles
3. **Generar el JSON** basado en el análisis visual del contenido
4. **Identificar nodos** como fases, actividades, decisiones y procesos en la imagen
5. **Crear conexiones** lógicas entre los elementos identificados

**ANÁLISIS DE IMÁGENES:** Puedes ver y analizar imágenes directamente. Examina el contenido visual para identificar:
- Diagramas de flujo existentes
- Procesos de negocio documentados
- Decisiones y bifurcaciones
- Actividades y tareas
- Fases del proceso

La salida **debe respetar la estructura y formato JSON validados**, sin agregar ningún texto adicional fuera del bloque JSON.  

---

## ⚙️ REGLAS OBLIGATORIAS

1. **No cambies la estructura JSON base.**  
   Todos los campos (\`id\`, \`type\`, \`position\`, \`data\`, \`style\`, \`markerEnd\`, etc.) deben respetarse exactamente como están definidos.

2. **Solo puedes modificar:**
   - Los textos (\`label\`, \`description\`).
   - Los IDs (de forma consistente, como \`phase1\`, \`activity1-1\`, etc.).
   - Las posiciones (\`x\`, \`y\`) si el flujo tiene más o menos nodos.
   - Los nombres de fases, actividades, decisiones y procesos, según el contenido que se te dé.

3. **Tipos de nodos válidos:**
   - \`"phase"\` → Fases principales del flujo  
   - \`"activity"\` → Acciones o tareas  
   - \`"decision"\` → Puntos de bifurcación o evaluación  
   - \`"process"\` → Resultados o salidas finales

4. **Colores y tipos de edges (conexiones):**
   - Azul \`#3B82F6\` → Flujo normal  
   - Gris \`#6B7280\` → Enlaces secundarios  
   - Verde \`#10B981\` → Decisión afirmativa (Sí)  
   - Rojo \`#EF4444\` → Decisión negativa (No)

5. **La salida debe ser SOLO el JSON.**  
   No agregues explicaciones, comentarios, ni texto antes o después.

6. **El número de nodos puede variar.**  
   Puedes generar flujos con 3, 5, 10 o más nodos, siempre respetando la estructura y manteniendo la coherencia visual en las posiciones (\`x\`, \`y\`).

---

## 📄 ESTRUCTURA DE SALIDA OBLIGATORIA

El formato final debe ser:

\`\`\`json
{
  "nodes": [...],
  "edges": [...],
  "metadata": {
    "name": "BPMS Diagram",
    "created": "YYYY-MM-DDTHH:MM:SS.sssZ",
    "version": "1.0"
  }
}
\`\`\`

**Ejemplo de estructura completa:**

\`\`\`json
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
\`\`\``;

export default function ChatModal({ isOpen, onClose, onGenerateDiagram }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  // Inicializar mensaje de bienvenida cuando se abre el modal
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `¡Hola! Soy DIAGRAMATOR, tu asistente especializado en generar diagramas BPMS. 

Puedo ayudarte a crear diagramas de flujo de procesos de negocio basados en descripciones de texto o análisis de imágenes.

**También puedes subir archivos:**
• 📄 PDFs con procesos documentados
• 🖼️ Imágenes de diagramas existentes (puedo analizarlas directamente)
• 📋 Documentos de texto

**Ejemplos de lo que puedo crear:**
• Procesos de ventas
• Flujos de aprobación
• Workflows de atención al cliente
• Procesos de onboarding
• Y mucho más...

¿Qué proceso te gustaría diagramar?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);

  // Funciones para manejar archivos
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    console.log('Archivos recibidos:', files);
    
    Array.from(files).forEach(file => {
      console.log('Procesando archivo:', file.name, file.type, file.size);
      
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newFile: UploadedFile = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type,
            size: file.size,
            url: e.target?.result as string
          };
          console.log('Archivo procesado:', newFile);
          setUploadedFiles(prev => [...prev, newFile]);
        };
        reader.readAsDataURL(file);
      } else {
        console.log('Tipo de archivo no soportado:', file.type);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearConversation = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: `¡Hola! Soy DIAGRAMATOR, tu asistente especializado en generar diagramas BPMS. 

Puedo ayudarte a crear diagramas de flujo de procesos de negocio basados en descripciones de texto o análisis de imágenes.

**También puedes subir archivos:**
• 📄 PDFs con procesos documentados
• 🖼️ Imágenes de diagramas existentes (puedo analizarlas directamente)
• 📋 Documentos de texto

**Ejemplos de lo que puedo crear:**
• Procesos de ventas
• Flujos de aprobación
• Workflows de atención al cliente
• Procesos de onboarding
• Y mucho más...

¿Qué proceso te gustaría diagramar?`,
        timestamp: new Date()
      }
    ]);
    setInput('');
    setUploadedFiles([]);
    setCopySuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && uploadedFiles.length === 0) || isLoading) return;

    console.log('Enviando mensaje con archivos:', uploadedFiles);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined
    };

    console.log('Mensaje creado:', userMessage);

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setUploadedFiles([]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content,
            files: msg.files
          })),
          prompt: PROMPT_MAESTRO
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      // Leer el stream de respuesta
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No se pudo leer la respuesta');

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      let fullContent = '';
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullContent += chunk;

        // Actualizar el mensaje con el contenido parcial
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, content: fullContent }
              : msg
          )
        );
      }

      // Detectar JSON en la respuesta final y generar diagrama
      const jsonMatch = fullContent.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        try {
          const jsonData = JSON.parse(jsonMatch[1]);
          onGenerateDiagram(jsonData);
        } catch (e) {
          console.error('Error parsing JSON:', e);
        }
      }

    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess('Copiado');
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  const formatTime = (message: any) => {
    if (message.createdAt) {
      return new Date(message.createdAt).toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    return new Date().toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/20">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">DIAGRAMATOR</h2>
              <p className="text-sm text-gray-500">Asistente de Diagramas BPMS</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearConversation}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
              title="Borrar conversación"
            >
              <Trash2 className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  
                  {/* Mostrar archivos si existen */}
                  {message.files && message.files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.files.map((file) => (
                        <div key={file.id} className={`flex items-center gap-2 p-2 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-blue-500/20' 
                            : 'bg-gray-200'
                        }`}>
                          {file.type.startsWith('image/') ? (
                            <Image className="w-4 h-4 text-blue-500" />
                          ) : (
                            <FileText className="w-4 h-4 text-blue-500" />
                          )}
                          <span className="text-xs truncate">{file.name}</span>
                          <span className="text-xs opacity-70">({formatFileSize(file.size)})</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(message.content)}
                      className="mt-2 p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Copiar respuesta"
                    >
                      {copySuccess === message.id ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTime(message)}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-100 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div 
          className={`p-6 border-t border-gray-200 transition-colors ${
            isDragOver ? 'bg-blue-50 border-blue-300' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Área de archivos subidos */}
          {uploadedFiles.length > 0 && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Archivos adjuntos:</span>
                <button
                  onClick={() => setUploadedFiles([])}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Limpiar todo
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                    {file.type.startsWith('image/') ? (
                      <Image className="w-4 h-4 text-blue-500" />
                    ) : (
                      <FileText className="w-4 h-4 text-blue-500" />
                    )}
                    <span className="text-xs truncate max-w-32">{file.name}</span>
                    <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón sutil para subir archivos */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mb-3 p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2 text-sm"
          >
            <Upload className="w-4 h-4" />
            Adjuntar archivos (PDF, PNG, JPG, GIF)
          </button>

          {/* Indicador de drag & drop */}
          {isDragOver && (
            <div className="mb-3 p-3 bg-blue-100 border-2 border-dashed border-blue-400 rounded-lg text-center">
              <Upload className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-sm text-blue-700 font-medium">Suelta los archivos aquí</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.png,.jpg,.jpeg,.gif"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />

          <form onSubmit={handleSubmit} className="flex gap-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Describe el proceso que quieres diagramar..."
              className="flex-1 p-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || (!input.trim() && uploadedFiles.length === 0)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
