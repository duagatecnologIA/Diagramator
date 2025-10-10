# 📁 Scripts de Base de Datos - Diagramator

Esta carpeta contiene todos los scripts SQL necesarios para configurar y mantener la base de datos de Diagramator.

## 📋 Archivos Disponibles

### 🚀 Instalación Inicial

| Archivo | Descripción | Cuándo Usar |
|---------|-------------|-------------|
| `supabase-setup.sql` | **Instalación completa** | Primera vez, instalación completa |
| `supabase-setup-parte1-tablas.sql` | Crear tablas | Instalación paso a paso |
| `supabase-setup-parte2-indices-rls.sql` | Índices y RLS | Después de crear tablas |
| `supabase-setup-parte3-funciones-triggers.sql` | Funciones y triggers | Después de índices |

### 🔧 Mantenimiento y Corrección

| Archivo | Descripción | Cuándo Usar |
|---------|-------------|-------------|
| `script-correccion-completa.sql` | **Corrección completa** | Error de recursión infinita |
| `corregir-politicas-rls.sql` | Solo políticas RLS | Solo problemas de RLS |

### ✅ Verificación

| Archivo | Descripción | Cuándo Usar |
|---------|-------------|-------------|
| `verificar-base-datos.sql` | **Verificación completa** | Después de correcciones |
| `verificar-instalacion.sql` | Verificación básica | Después de instalación |

## 🚀 Guía de Uso

### Primera Instalación

```sql
-- Opción 1: Instalación completa (recomendada)
-- Ejecutar: supabase-setup.sql

-- Opción 2: Instalación paso a paso
-- 1. Ejecutar: supabase-setup-parte1-tablas.sql
-- 2. Ejecutar: supabase-setup-parte2-indices-rls.sql  
-- 3. Ejecutar: supabase-setup-parte3-funciones-triggers.sql
-- 4. Ejecutar: verificar-instalacion.sql
```

### Corrección de Problemas

```sql
-- Si tienes error de recursión infinita:
-- 1. Ejecutar: script-correccion-completa.sql
-- 2. Ejecutar: verificar-base-datos.sql
```

### Verificación Periódica

```sql
-- Para verificar que todo funciona:
-- Ejecutar: verificar-base-datos.sql
```

## ⚠️ Importante

- **Siempre hacer backup** antes de ejecutar scripts de corrección
- **Ejecutar en Supabase SQL Editor** en el orden indicado
- **Verificar resultados** con scripts de verificación
- **No ejecutar scripts múltiples veces** sin necesidad

## 📞 Soporte

Si encuentras problemas:

1. **Revisar logs** de Supabase
2. **Ejecutar verificación** correspondiente
3. **Consultar README principal** del proyecto
4. **Verificar variables de entorno**

---

**¡Todos los scripts están listos para usar!** 🎉
