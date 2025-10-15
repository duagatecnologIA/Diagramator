# 🔧 Configuración del Proyecto

## Variables de Entorno Requeridas

Para que el proyecto funcione correctamente, necesitas crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

### 1. Supabase (Opcional - para autenticación)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

**Cómo obtener las credenciales de Supabase:**
1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Ve a Settings > API
5. Copia la URL del proyecto y la clave anónima

### 2. OpenAI (Requerido - para el chat AI)
```bash
OPENAI_API_KEY=sk-tu_clave_de_openai_aqui
```

**Cómo obtener la API key de OpenAI:**
1. Ve a [platform.openai.com](https://platform.openai.com)
2. Inicia sesión o crea una cuenta
3. Ve a API Keys
4. Crea una nueva API key
5. Copia la clave generada

## Crear el archivo .env.local

1. En la raíz del proyecto, crea un archivo llamado `.env.local`
2. Copia el contenido de arriba y reemplaza los valores con tus credenciales reales
3. Guarda el archivo

## Estado Actual

- ✅ **Chat AI**: Funciona con OpenAI (requiere API key)
- ⚠️ **Autenticación**: Funciona en modo sin autenticación si no hay Supabase configurado
- ✅ **Diagramas**: Funcionan completamente sin autenticación

## Notas

- Sin Supabase configurado, la aplicación funcionará en modo "demo" sin persistencia de datos
- Con Supabase configurado, tendrás autenticación completa y guardado de diagramas
- El chat AI requiere obligatoriamente la API key de OpenAI para funcionar
