# 🎨 Diagramator - Diagramas de Procesos de Negocio Inteligentes

> **Sistema completo de creación de diagramas de procesos de negocio con autenticación, guardado en tiempo real y colaboración.**

## 📋 Tabla de Contenidos

- [🚀 Inicio Rápido](#-inicio-rápido)
- [🔧 Configuración de Base de Datos](#-configuración-de-base-de-datos)
- [🚨 Corrección de Problemas](#-corrección-de-problemas)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🎯 Funcionalidades](#-funcionalidades)
- [⌨️ Atajos de Teclado](#️-atajos-de-teclado)
- [🔐 Autenticación](#-autenticación)
- [💾 Sistema de Guardado](#-sistema-de-guardado)
- [📊 Base de Datos](#-base-de-datos)
- [🛠️ Desarrollo](#️-desarrollo)

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd Diagramator/Diagramator
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env.local
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

4. **Configurar base de datos** (ver sección [🔧 Configuración de Base de Datos](#-configuración-de-base-de-datos))

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

6. **Abrir en el navegador**
```
http://localhost:3000
```

## 🔧 Configuración de Base de Datos

### Opción 1: Instalación Completa (Recomendada)

```sql
-- Ejecutar en Supabase SQL Editor
-- Copiar y pegar todo el contenido de: scripts/supabase-setup.sql
```

### Opción 2: Instalación por Partes

Si prefieres ejecutar paso a paso:

1. **Crear tablas**
```sql
-- Ejecutar: scripts/supabase-setup-parte1-tablas.sql
```

2. **Configurar índices y RLS**
```sql
-- Ejecutar: scripts/supabase-setup-parte2-indices-rls.sql
```

3. **Crear funciones y triggers**
```sql
-- Ejecutar: scripts/supabase-setup-parte3-funciones-triggers.sql
```

4. **Verificar instalación**
```sql
-- Ejecutar: scripts/verificar-instalacion.sql
```

## 🚨 Corrección de Problemas

### Error: "infinite recursion detected in policy for relation 'diagrams'"

**Síntomas:**
- Error 500 al intentar guardar
- Mensaje "Error al guardar" en el banner
- Console muestra recursión infinita en RLS

**Solución:**
```sql
-- Ejecutar en Supabase SQL Editor
-- Copiar y pegar todo el contenido de: scripts/script-correccion-completa.sql
```

**Verificación:**
```sql
-- Ejecutar después de la corrección
-- Copiar y pegar todo el contenido de: scripts/verificar-base-datos.sql
```

## 📁 Estructura del Proyecto

```
Diagramator/
├── scripts/                          # Scripts de base de datos
│   ├── supabase-setup.sql            # Instalación completa
│   ├── supabase-setup-parte1-tablas.sql
│   ├── supabase-setup-parte2-indices-rls.sql
│   ├── supabase-setup-parte3-funciones-triggers.sql
│   ├── script-correccion-completa.sql # Corrección de problemas
│   ├── verificar-instalacion.sql     # Verificación básica
│   └── verificar-base-datos.sql      # Verificación completa
├── src/
│   ├── app/                          # Páginas Next.js
│   ├── components/                   # Componentes React
│   ├── contexts/                     # Contextos React
│   ├── hooks/                        # Hooks personalizados
│   ├── lib/                          # Utilidades
│   └── services/                     # Servicios
├── package.json                      # Dependencias y scripts
└── README.md                         # Este archivo
```

## ⌨️ Atajos de Teclado

### Guardado
- `Ctrl+S` / `⌘+S`: **Guardar en Supabase** (con autenticación)

### Navegación y Selección
- `Ctrl+A` / `⌘+A`: Seleccionar todo
- `Esc`: Volver al modo selección
- `Delete` / `Backspace`: Eliminar selección

### Edición
- `Ctrl+C` / `⌘+C`: Copiar
- `Ctrl+V` / `⌘+V`: Pegar
- `Ctrl+D` / `⌘+D`: Duplicar
- `Ctrl+Z` / `⌘+Z`: Deshacer
- `Ctrl+Y` / `⌘+Y`: Rehacer

## 💾 Sistema de Guardado

### Estados de Guardado

| Estado | Color | Descripción |
|--------|-------|-------------|
| `saved` | 🟢 Verde | Guardado correctamente |
| `saving` | 🔵 Azul | Guardando... |
| `unsaved` | 🟠 Naranja | Cambios sin guardar |
| `error` | 🔴 Rojo | Error al guardar |

### Auto-guardado
- **Intervalo**: Cada 30 segundos
- **Trigger**: Cambios en el diagrama
- **Feedback**: Indicador visual en banner

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Servidor de producción
npm run lint         # Linter
```

### Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, Lucide React
- **Diagramas**: ReactFlow 11
- **Backend**: Supabase (PostgreSQL, Auth, RLS)

---

## 🎉 ¡Listo para Usar!

**Diagramator está completamente configurado y listo para crear diagramas de procesos de negocio profesionales.**

### Próximos Pasos:

1. ✅ **Configurar base de datos** con los scripts
2. ✅ **Ejecutar corrección** si hay problemas
3. ✅ **Crear tu primer diagrama** con Ctrl+S
4. ✅ **Compartir con tu equipo** usando colaboración

**¡Disfruta creando diagramas inteligentes!** 🎨✨