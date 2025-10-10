-- ============================================
-- SCRIPT PARA LIMPIAR LOGS DE PRODUCCIÓN
-- ============================================
-- Ejecutar después de que todo funcione correctamente

-- Este script no es SQL, sino instrucciones para limpiar el código

/*
INSTRUCCIONES PARA REMOVER LOGS DE PRODUCCIÓN:

1. En BPMSDiagramWithSupabase.tsx:
   - Remover todos los console.log, console.warn, console.error
   - Mantener solo los logs de error críticos

2. En BPMSDiagram.tsx:
   - Remover todos los console.log de debugging
   - Mantener solo logs de errores importantes

3. En diagramService.ts:
   - Remover todos los console.log
   - Mantener solo manejo de errores

4. En useDiagrams.ts:
   - Remover todos los console.log
   - Mantener solo manejo de errores

COMANDO PARA BUSCAR Y REEMPLAZAR:
- Buscar: console\.log\(
- Reemplazar: // console.log(
- O eliminar completamente las líneas

COMANDO PARA BUSCAR Y REEMPLAZAR CONSOLE.WARN:
- Buscar: console\.warn\(
- Reemplazar: // console.warn(

COMANDO PARA BUSCAR Y REEMPLAZAR CONSOLE.ERROR:
- Buscar: console\.error\(
- Reemplazar: // console.error(
- O mantener solo los críticos
*/
