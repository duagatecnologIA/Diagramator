import { supabase, Diagram } from '@/lib/supabase';

export const diagramService = {
  // Crear un nuevo diagrama
  async createDiagram(data: {
    title: string;
    description?: string;
    data: any;
    is_public?: boolean;
    thumbnail_url?: string;
  }) {
    const { data: diagram, error } = await supabase
      .from('diagrams')
      .insert([
        {
          ...data,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        },
      ])
      .select()
      .single();

    return { diagram, error };
  },

  // Obtener diagramas del usuario
  async getUserDiagrams(userId: string) {
    const { data, error } = await supabase
      .from('diagrams')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    return { diagrams: data, error };
  },

  // Obtener un diagrama por ID
  async getDiagram(diagramId: string) {
    const { data, error } = await supabase
      .from('diagrams')
      .select('*')
      .eq('id', diagramId)
      .single();

    // Incrementar contador de vistas
    if (data && !error) {
      await supabase.rpc('increment_diagram_views', {
        diagram_uuid: diagramId,
      });
    }

    return { diagram: data, error };
  },

  // Actualizar un diagrama
  async updateDiagram(
    diagramId: string,
    data: Partial<{
      title: string;
      description: string;
      data: any;
      is_public: boolean;
      thumbnail_url: string;
    }>
  ) {
    const { data: diagram, error } = await supabase
      .from('diagrams')
      .update(data)
      .eq('id', diagramId)
      .select()
      .single();

    return { diagram, error };
  },

  // Eliminar un diagrama
  async deleteDiagram(diagramId: string) {
    const { error } = await supabase
      .from('diagrams')
      .delete()
      .eq('id', diagramId);

    return { error };
  },

  // Duplicar un diagrama
  async duplicateDiagram(diagramId: string) {
    const { diagram: original, error: fetchError } = await this.getDiagram(
      diagramId
    );

    if (fetchError || !original) {
      return { diagram: null, error: fetchError };
    }

    const { diagram, error } = await this.createDiagram({
      title: `${original.title} (Copia)`,
      description: original.description || undefined,
      data: original.data,
      is_public: false,
    });

    return { diagram, error };
  },

  // Obtener diagramas públicos
  async getPublicDiagrams(limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('diagrams')
      .select('*, profiles(full_name, avatar_url)')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    return { diagrams: data, error };
  },

  // Obtener templates
  async getTemplates() {
    const { data, error } = await supabase
      .from('diagrams')
      .select('*')
      .eq('is_template', true)
      .order('created_at', { ascending: false });

    return { templates: data, error };
  },

  // Buscar diagramas
  async searchDiagrams(query: string, userId?: string) {
    let queryBuilder = supabase
      .from('diagrams')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

    if (userId) {
      queryBuilder = queryBuilder.eq('user_id', userId);
    } else {
      queryBuilder = queryBuilder.eq('is_public', true);
    }

    const { data, error } = await queryBuilder.order('updated_at', {
      ascending: false,
    });

    return { diagrams: data, error };
  },

  // Obtener diagramas recientes
  async getRecentDiagrams(userId: string, limit = 5) {
    const { data, error } = await supabase
      .from('diagrams')
      .select('*')
      .eq('user_id', userId)
      .order('last_accessed_at', { ascending: false })
      .limit(limit);

    return { diagrams: data, error };
  },

  // Compartir diagrama con colaborador
  async shareWithUser(
    diagramId: string,
    userEmail: string,
    permission: 'view' | 'edit' | 'admin'
  ) {
    // Buscar usuario por email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (profileError || !profile) {
      return { error: new Error('Usuario no encontrado') };
    }

    const currentUser = (await supabase.auth.getUser()).data.user;

    const { data, error } = await supabase
      .from('diagram_collaborators')
      .insert([
        {
          diagram_id: diagramId,
          user_id: profile.id,
          permission,
          invited_by: currentUser?.id,
        },
      ])
      .select()
      .single();

    return { collaborator: data, error };
  },

  // Obtener colaboradores de un diagrama
  async getCollaborators(diagramId: string) {
    const { data, error } = await supabase
      .from('diagram_collaborators')
      .select('*, profiles(full_name, email, avatar_url)')
      .eq('diagram_id', diagramId);

    return { collaborators: data, error };
  },

  // Remover colaborador
  async removeCollaborator(collaboratorId: string) {
    const { error } = await supabase
      .from('diagram_collaborators')
      .delete()
      .eq('id', collaboratorId);

    return { error };
  },

  // Crear versión manual
  async createVersion(
    diagramId: string,
    data: any,
    description?: string
  ) {
    // Obtener último número de versión
    const { data: versions, error: versionError } = await supabase
      .from('diagram_versions')
      .select('version_number')
      .eq('diagram_id', diagramId)
      .order('version_number', { ascending: false })
      .limit(1);

    if (versionError) {
      return { version: null, error: versionError };
    }

    const nextVersion = versions && versions.length > 0 
      ? versions[0].version_number + 1 
      : 1;

    const currentUser = (await supabase.auth.getUser()).data.user;

    const { data: version, error } = await supabase
      .from('diagram_versions')
      .insert([
        {
          diagram_id: diagramId,
          version_number: nextVersion,
          data,
          changes_description: description,
          created_by: currentUser?.id,
        },
      ])
      .select()
      .single();

    return { version, error };
  },

  // Obtener historial de versiones
  async getVersions(diagramId: string) {
    const { data, error } = await supabase
      .from('diagram_versions')
      .select('*, profiles(full_name)')
      .eq('diagram_id', diagramId)
      .order('version_number', { ascending: false });

    return { versions: data, error };
  },

  // Restaurar versión
  async restoreVersion(diagramId: string, versionId: string) {
    // Obtener datos de la versión
    const { data: version, error: versionError } = await supabase
      .from('diagram_versions')
      .select('data')
      .eq('id', versionId)
      .single();

    if (versionError || !version) {
      return { diagram: null, error: versionError };
    }

    // Actualizar diagrama con datos de la versión
    const { diagram, error } = await this.updateDiagram(diagramId, {
      data: version.data,
    });

    return { diagram, error };
  },
};

