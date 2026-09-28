import { supabase, supabaseConfigured } from '../lib/supabase';

const LOCAL_KEY = 'sophena-local-state';

const defaults = {
  profile: { id: 'demo-user', full_name: 'Tu nombre', email: 'tu@sophena.online', points: 0, role: 'super_admin' },
  habits: [{ id: 'demo-smoking', name: 'Cigarrillo', habit_type: 'smoking', goal_type: 'reduce', frequency: 'daily', cost_amount: 84000, cost_frequency: 'week', active: true }],
  habitGoals: [],
  checkins: [], cravingLogs: [], relapseLogs: [], savings: [], rewards: [
    { id: 'demo-cinema', name: 'Cine', points_cost: 300, description: 'Una noche para ti', is_redeemed: false },
    { id: 'demo-headphones', name: 'Audífonos', points_cost: 2000, description: 'Tu próxima playlist', is_redeemed: false },
  ],
  notifications: { weekly_summary: true, monthly_summary: true, checkin_reminders: true, achievements: true, goals: true },
  achievements: [],
  userAchievements: [],
  appModules: [],
  appSettings: [],
  appThemes: [{ id: 'demo-theme', theme_key: 'sophena-default', name: 'SOPHENA', enabled: true, is_active: true, config: { bg: '#0D0B12', surface: '#15121C', card: '#211C2C', purple: '#A78BFA', green: '#75D6C4', amber: '#F3C677', danger: '#E17C8C' } }],
  feedPosts: [],
};

function readLocal() {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}') }; } catch { return defaults; }
}
function writeLocal(state) { localStorage.setItem(LOCAL_KEY, JSON.stringify(state)); return state; }
function localUser() { return readLocal().profile; }

async function currentUser() {
  if (!supabaseConfigured) return localUser();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export const authService = {
  async signIn(email, password) {
    if (!supabaseConfigured) return { user: localUser(), error: null, demo: true };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { user: data.user, error };
  },
  async signUp({ email, password, fullName, onboarding }) {
    if (!supabaseConfigured) {
      const state = readLocal();
      state.profile = { ...state.profile, full_name: fullName || state.profile.full_name, email };
      writeLocal(state);
      return { user: state.profile, error: null, demo: true };
    }
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, ...(onboarding ? { sophena_onboarding: onboarding } : {}) } } });
    return { user: data.user, session: data.session, error };
  },
  async requestPasswordReset(email) {
    if (!supabaseConfigured) return { error: null, demo: true };
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    return { error };
  },
  async updatePassword(password) {
    if (!supabaseConfigured) return { error: null, demo: true };
    const { data, error } = await supabase.auth.updateUser({ password });
    return { user: data.user, error };
  },
  async signOut() { if (supabaseConfigured) await supabase.auth.signOut(); },
  onAuthStateChange(callback) { return supabaseConfigured ? supabase.auth.onAuthStateChange(callback) : { data: { subscription: { unsubscribe() {} } } }; },
  currentUser,
};

async function insert(table, payload, localKey) {
  if (supabaseConfigured) { const { data, error } = await supabase.from(table).insert(payload).select().single(); if (error) throw error; return data; }
  const state = readLocal(); const item = { id: crypto.randomUUID(), created_at: new Date().toISOString(), ...payload }; state[localKey] = [item, ...(state[localKey] || [])]; writeLocal(state); return item;
}
async function list(table, localKey, options = {}) {
  if (supabaseConfigured) {
    let query = supabase.from(table).select(options.select || '*');
    if (options.userColumn) query = query.eq(options.userColumn, options.userId);
    if (options.order) query = query.order(options.order, { ascending: false });
    const { data, error } = await query; if (error) throw error; return data || [];
  }
  return readLocal()[localKey] || [];
}
async function update(table, id, payload, localKey) {
  if (supabaseConfigured) { const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single(); if (error) throw error; return data; }
  const state = readLocal(); const items = state[localKey] || []; const index = items.findIndex(item => item.id === id); if (index < 0) throw new Error('Registro no encontrado'); items[index] = { ...items[index], ...payload, updated_at: new Date().toISOString() }; writeLocal(state); return items[index];
}
async function remove(table, id, localKey) {
  if (supabaseConfigured) { const { error } = await supabase.from(table).delete().eq('id', id); if (error) throw error; return true; }
  const state = readLocal(); state[localKey] = (state[localKey] || []).filter(item => item.id !== id); writeLocal(state); return true;
}

export const profileService = {
  async get() { const user = await currentUser(); if (!supabaseConfigured) return localUser(); if (!user) throw new Error('Sesión no iniciada'); const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single(); if (error) throw error; return { ...data, email: user.email }; },
  async update(payload) { const user = await currentUser(); if (!supabaseConfigured) { const state = readLocal(); state.profile = { ...state.profile, ...payload }; writeLocal(state); return state.profile; } return update('profiles', user.id, payload, 'profile'); },
};

export const habitService = {
  list: async () => { const user = await currentUser(); return list('habits', 'habits', { userColumn: 'user_id', userId: user?.id, order: 'created_at' }); },
  create: async payload => { const user = await currentUser(); return insert('habits', { ...payload, user_id: user?.id }, 'habits'); },
  update: (id, payload) => update('habits', id, payload, 'habits'),
  remove: id => remove('habits', id, 'habits'),
};
export const goalService = {
  list: () => list('habit_goals', 'habitGoals', { order: 'created_at' }),
  create: payload => insert('habit_goals', payload, 'habitGoals'),
  update: (id, payload) => update('habit_goals', id, payload, 'habitGoals'),
  remove: id => remove('habit_goals', id, 'habitGoals'),
};

export const checkinService = {
  list: () => list('daily_checkins', 'checkins', { order: 'checkin_date' }),
  create: async payload => { const user = await currentUser(); return insert('daily_checkins', { ...payload, user_id: user?.id }, 'checkins'); },
};
export const cravingService = {
  list: () => list('craving_logs', 'cravingLogs', { order: 'created_at' }),
  create: async payload => { const user = await currentUser(); return insert('craving_logs', { ...payload, user_id: user?.id }, 'cravingLogs'); },
  update: (id, payload) => update('craving_logs', id, payload, 'cravingLogs'),
};
export const relapseService = { create: async payload => { const user = await currentUser(); return insert('relapse_logs', { ...payload, user_id: user?.id }, 'relapseLogs'); } };
export const savingService = {
  list: () => list('savings', 'savings', { order: 'created_at' }),
  create: async payload => { const user = await currentUser(); return insert('savings', { ...payload, user_id: user?.id }, 'savings'); },
  remove: id => remove('savings', id, 'savings'),
};
export const rewardService = {
  list: () => list('rewards', 'rewards', { order: 'created_at' }),
  create: async payload => { const user = await currentUser(); return insert('rewards', { ...payload, user_id: user?.id }, 'rewards'); },
  update: (id, payload) => update('rewards', id, payload, 'rewards'),
  remove: id => remove('rewards', id, 'rewards'),
};
export const userAchievementService = { list: async () => { const user = await currentUser(); return list('user_achievements', 'userAchievements', { userColumn: 'user_id', userId: user?.id, order: 'unlocked_at' }); } };
export const notificationService = {
  get: async () => { if (!supabaseConfigured) return readLocal().notifications; const user = await currentUser(); const { data, error } = await supabase.from('notification_preferences').select('*').eq('user_id', user.id).single(); if (error) throw error; return data; },
  update: async payload => { if (!supabaseConfigured) { const state = readLocal(); state.notifications = { ...state.notifications, ...payload }; writeLocal(state); return state.notifications; } const user = await currentUser(); return update('notification_preferences', user.id, payload, 'notifications'); },
};
export const adminService = {
  listAchievements: () => list('achievements', 'achievements', { order: 'name' }),
  createAchievement: payload => insert('achievements', payload, 'achievements'),
  updateAchievement: (id, payload) => update('achievements', id, payload, 'achievements'),
  removeAchievement: id => remove('achievements', id, 'achievements'),
  listModules: () => list('app_modules', 'appModules', { order: 'sort_order' }),
  createModule: payload => insert('app_modules', payload, 'appModules'),
  updateModule: (id, payload) => update('app_modules', id, payload, 'appModules'),
  removeModule: id => remove('app_modules', id, 'appModules'),
  listSettings: () => list('app_settings', 'appSettings', { order: 'setting_key' }),
  upsertSetting: async payload => {
    if (supabaseConfigured) { const user = await currentUser(); const { data, error } = await supabase.from('app_settings').upsert({ ...payload, updated_by: user?.id, updated_at: new Date().toISOString() }).select().single(); if (error) throw error; return data; }
    const state = readLocal(); const existing = (state.appSettings || []).find(item => item.setting_key === payload.setting_key); if (existing) Object.assign(existing, payload); else state.appSettings = [...(state.appSettings || []), payload]; writeLocal(state); return payload;
  },
  listThemes: () => list('app_themes', 'appThemes', { order: 'updated_at' }),
  createTheme: payload => insert('app_themes', payload, 'appThemes'),
  updateTheme: (id, payload) => update('app_themes', id, payload, 'appThemes'),
  removeTheme: id => remove('app_themes', id, 'appThemes'),
  activateTheme: async id => {
    if (supabaseConfigured) {
      const { error: deactivateError } = await supabase.from('app_themes').update({ is_active: false }).neq('id', id);
      if (deactivateError) throw deactivateError;
      const { data, error } = await supabase.from('app_themes').update({ is_active: true, enabled: true }).eq('id', id).select().single();
      if (error) throw error; return data;
    }
    const state = readLocal(); state.appThemes = (state.appThemes || []).map(item => ({ ...item, is_active: item.id === id })); writeLocal(state); return state.appThemes.find(item => item.id === id);
  },
  listFeedPosts: () => list('app_feed_posts', 'feedPosts', { order: 'published_at' }),
  createFeedPost: payload => insert('app_feed_posts', payload, 'feedPosts'),
  updateFeedPost: (id, payload) => update('app_feed_posts', id, payload, 'feedPosts'),
  removeFeedPost: id => remove('app_feed_posts', id, 'feedPosts'),
};

export const themeService = { getActive: async () => { if (supabaseConfigured) { const { data, error } = await supabase.from('app_themes').select('*').eq('is_active', true).eq('enabled', true).maybeSingle(); if (error) throw error; return data; } return readLocal().appThemes?.find(item => item.is_active && item.enabled) || null; } };
export const feedService = { list: () => list('app_feed_posts', 'feedPosts', { order: 'published_at' }) };
export const onboardingService = {
  async savePending(payload) { localStorage.setItem('sophena-pending-onboarding', JSON.stringify(payload)); },
  async completePending() {
    const raw = localStorage.getItem('sophena-pending-onboarding') || localStorage.getItem('nuvora-pending-onboarding');
    const user = await currentUser();
    const pending = raw ? JSON.parse(raw) : user?.user_metadata?.sophena_onboarding || user?.user_metadata?.nuvora_onboarding;
    if (!pending) return false;
    const createdHabits = await Promise.all((pending.habits || []).map(habit => habitService.create(habit)));
    await Promise.all(createdHabits.map(habit => goalService.create({ habit_id: habit.id, target_days: pending.targetDays || 7, reason: pending.reason || 'Salud', status: 'active' })));
    localStorage.removeItem('sophena-pending-onboarding');
    localStorage.removeItem('nuvora-pending-onboarding');
    if (supabaseConfigured && (user?.user_metadata?.sophena_onboarding || user?.user_metadata?.nuvora_onboarding)) await supabase.auth.updateUser({ data: { ...user.user_metadata, sophena_onboarding: null, nuvora_onboarding: null } });
    return true;
  },
};

export const dataApi = { authService, profileService, habitService, goalService, checkinService, cravingService, relapseService, savingService, rewardService, userAchievementService, notificationService, adminService, themeService, feedService, onboardingService, isSupabaseConfigured: supabaseConfigured };
