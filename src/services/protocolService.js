import { supabase } from '../lib/supabase';

export const protocolService = {
  async getUserProtocol(userId) {
    const { data, error } = await supabase
      .from('user_protocols')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user protocol:', error);
      throw error;
    }

    return data;
  },

  async canRegenerateProtocol(userId) {
    const protocol = await this.getUserProtocol(userId);

    if (!protocol) {
      return { canRegenerate: true, reason: 'no_protocol' };
    }

    const expiresAt = new Date(protocol.expires_at);
    const now = new Date();

    if (now >= expiresAt) {
      return { canRegenerate: true, reason: 'expired' };
    }

    const daysRemaining = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));
    return {
      canRegenerate: false,
      reason: 'not_expired',
      daysRemaining,
      expiresAt: protocol.expires_at
    };
  },

  async generateProtocol(userId) {
    const { baseProtocol } = await import('./baseProtocol.js');

    const protocolData = {
      overall_completion: 0,
      day_streak: 0,
      todays_journey: baseProtocol.protocol_30_days[0].objectives,
      protocol_30_days: baseProtocol.protocol_30_days
    };

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const { data: savedProtocol, error: saveError } = await supabase
      .from('user_protocols')
      .upsert({
        user_id: userId,
        protocol_data: protocolData,
        quiz_answers: {},
        created_at: now.toISOString(),
        last_regenerated_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        overall_completion: 0,
        day_streak: 0,
        current_day: 1,
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving protocol:', saveError);
      throw saveError;
    }

    await this.saveObjectivesToDatabase(userId, savedProtocol.id, protocolData.protocol_30_days);

    return savedProtocol;
  },

  async saveObjectivesToDatabase(userId, protocolId, protocolDays) {
    await supabase
      .from('user_objectives')
      .delete()
      .eq('protocol_id', protocolId);

    const objectives = protocolDays.flatMap(day =>
      day.objectives.map(obj => ({
        user_id: userId,
        protocol_id: protocolId,
        day_number: day.day,
        objective_type: obj.type,
        title: obj.title,
        description: obj.description,
        completed: false,
      }))
    );

    const { error } = await supabase
      .from('user_objectives')
      .insert(objectives);

    if (error) {
      console.error('Error saving objectives:', error);
      throw error;
    }
  },

  async getUserObjectives(userId, dayNumber = null) {
    let query = supabase
      .from('user_objectives')
      .select('*')
      .eq('user_id', userId)
      .order('day_number', { ascending: true })
      .order('objective_type', { ascending: true });

    if (dayNumber !== null) {
      query = query.eq('day_number', dayNumber);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching objectives:', error);
      throw error;
    }

    return data;
  },

  async updateObjectiveCompletion(objectiveId, completed) {
    const { error } = await supabase
      .from('user_objectives')
      .update({
        completed,
        completed_at: completed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', objectiveId);

    if (error) {
      console.error('Error updating objective:', error);
      throw error;
    }
  },

  async updateProtocolProgress(userId, updates) {
    const { error } = await supabase
      .from('user_protocols')
      .update({
        ...updates,
        last_regenerated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating protocol progress:', error);
      throw error;
    }
  },
};
