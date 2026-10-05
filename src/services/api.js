import { supabase, supabaseConfigured } from '../lib/supabase';
import { brand } from '../config/brand';

const LOCAL_KEY = 'sophena-local-state';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

const defaultAchievementCatalog = [
  { id: 'demo-achievement-first-day', slug: 'primer-dia', name: 'Primer día', description: 'Completaste tu primer registro y comenzaste tu proceso.', points: 50, icon: 'shield' },
  { id: 'demo-achievement-first-checkin', slug: 'primer-check-in', name: 'Primer check-in', description: 'Registraste cómo te fue por primera vez.', points: 25, icon: 'sparkles' },
  { id: 'demo-achievement-three-days', slug: 'tres-dias-presente', name: 'Tres días presente', description: 'Completaste 3 días de seguimiento consecutivos.', points: 75, icon: 'award' },
  { id: 'demo-achievement-week', slug: 'una-semana-en-control', name: 'Una semana en control', description: 'Mantuviste una racha de 7 días.', points: 150, icon: 'rocket' },
  { id: 'demo-achievement-first-craving', slug: 'primer-impulso-superado', name: 'Primer impulso superado', description: 'Registraste y superaste tu primer impulso.', points: 100, icon: 'heart' },
  { id: 'demo-achievement-different-choice', slug: 'elegiste-diferente', name: 'Elegiste diferente', description: 'Tomaste una decisión distinta frente a un impulso.', points: 125, icon: 'target' },
  { id: 'demo-achievement-first-saving', slug: 'primer-ahorro', name: 'Primer ahorro', description: 'Registraste tu primer gasto evitado.', points: 75, icon: 'wallet' },
  { id: 'demo-achievement-recovered-money', slug: 'dinero-recuperado', name: 'Dinero recuperado', description: 'Evitaste gastar tus primeros $50.000.', points: 200, icon: 'gift' },
  { id: 'demo-achievement-two-weeks', slug: 'dos-semanas-constantes', name: 'Dos semanas constantes', description: 'Completaste 14 días de seguimiento.', points: 300, icon: 'sparkles' },
  { id: 'demo-achievement-month', slug: 'un-mes-de-avance', name: 'Un mes de avance', description: 'Mantuviste tu proceso durante 30 días.', points: 600, icon: 'rocket' },
  { id: 'demo-achievement-new-version', slug: 'nueva-version', name: 'Nueva versión', description: 'Completaste 90 días de constancia.', points: 1000, icon: 'heart' },
  { id: 'demo-achievement-returned', slug: 'volviste-a-elegirte', name: 'Volviste a elegirte', description: 'Registraste una recaída y retomaste tu proceso.', points: 100, icon: 'flame' },
];

const defaults = {
  profile: { id: 'demo-user', full_name: 'Tu nombre', email: 'tu@sophena.online', points: 0, role: 'super_admin' },
  habits: [{ id: 'demo-smoking', name: 'Cigarrillo', habit_type: 'smoking', goal_type: 'reduce', frequency: 'daily', cost_amount: 84000, cost_frequency: 'week', active: true }],
  habitGoals: [],
  checkins: [], cravingLogs: [], relapseLogs: [], savings: [], rewards: [
    { id: 'demo-cinema', name: 'Cine', points_cost: 300, description: 'Una noche para ti', is_redeemed: false },
    { id: 'demo-headphones', name: 'Audífonos', points_cost: 2000, description: 'Tu próxima playlist', is_redeemed: false },
  ],
  notifications: { weekly_summary: true, monthly_summary: true, checkin_reminders: true, achievements: true, goals: true },
  userNotifications: [],
  achievements: defaultAchievementCatalog,
  userAchievements: [],
  pointTransactions: [],
  appModules: [],
  appSettings: [],
  appThemes: [{ id: 'demo-theme', theme_key: 'sophena-default', name: 'SOPHENA', enabled: true, is_active: true, config: { bg: '#0D0B12', surface: '#15121C', card: '#211C2C', purple: '#A78BFA', green: '#75D6C4', amber: '#F3C677', danger: '#E17C8C' } }],
  feedPosts: [],
};

function readLocal() {
  try {
    const saved = JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}');
    const state = { ...defaults, ...saved };
    if (!saved.achievementCatalogVersion) {
      const existing = state.achievements || [];
      state.achievements = [...existing, ...defaultAchievementCatalog.filter(item => !existing.some(current => current.slug === item.slug))];
      state.achievementCatalogVersion = 1;
      localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
    }
    return state;
  } catch { return defaults; }
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
    if (!supabaseConfigured) {
      const user = localUser();
      await notificationService.createSessionNotification().catch(() => {});
      return { user, error: null, demo: true };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) await notificationService.createSessionNotification().catch(() => {});
    return { user: data.user, error };
  },
  async signUp({ email, password, fullName, onboarding }) {
    if (!supabaseConfigured) {
      const state = readLocal();
      state.profile = { ...state.profile, full_name: fullName || state.profile.full_name, email };
      writeLocal(state);
      await notificationService.createSessionNotification().catch(() => {});
      return { user: state.profile, error: null, demo: true };
    }
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, ...(onboarding ? { sophena_onboarding: onboarding } : {}) } } });
    if (!error && data.session) await notificationService.createSessionNotification().catch(() => {});
    return { user: data.user, session: data.session, error };
  },
  async requestPasswordReset(email) {
    if (!supabaseConfigured) return { error: null, demo: true };
    const redirectBase = window.location.hostname === 'sophena.online' ? brand.url : window.location.origin;
    const redirectTo = `${redirectBase}/reset-password`;
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

const feedCoverBucket = 'feed-covers';
const feedCoverMaxSize = 5 * 1024 * 1024;
const feedCoverMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

export const storageService = {
  async uploadFeedCover(file) {
    if (!supabaseConfigured) throw new Error('Configura Supabase para subir portadas al bucket de imágenes.');
    if (!file) throw new Error('Selecciona una imagen para continuar.');
    if (!feedCoverMimeTypes.includes(file.type)) throw new Error('La portada debe ser JPG, PNG o WebP.');
    if (file.size > feedCoverMaxSize) throw new Error('La portada no puede superar los 5 MB.');

    const user = await currentUser();
    if (!user?.id) throw new Error('Tu sesión expiró. Vuelve a iniciar sesión para subir la portada.');
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeName = file.name.replace(/[^a-z0-9._-]/gi, '-').toLowerCase().slice(-80) || `portada.${extension}`;
    const uniqueId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const path = `${user.id}/${uniqueId}-${safeName}`;
    const { data, error } = await supabase.storage.from(feedCoverBucket).upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false,
    });
    if (error) throw error;
    const { data: publicUrl } = supabase.storage.from(feedCoverBucket).getPublicUrl(data.path);
    return { path: data.path, url: publicUrl.publicUrl, name: file.name };
  },
};

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
const localPointRules = {
  checkin_completed: { points: 10, enabled: true },
  craving_overcome: { points: 15, enabled: true },
  craving_reduced: { points: 8, enabled: true },
  saving_registered: { points: 5, enabled: true },
  saving_bonus: { points: 1, amount_unit: 10000, enabled: true },
};
function localRule(actionKey, state) { const configured = (state.appSettings || []).find(item => item.setting_key === 'point_rules')?.value?.rules || []; return configured.find(rule => rule.action_key === actionKey) || localPointRules[actionKey]; }
export const pointService = {
  list: async () => { const user = await currentUser(); return list('point_transactions', 'pointTransactions', { userColumn: 'user_id', userId: user?.id, order: 'created_at' }); },
  async award({ actionKey, sourceId, amount = 0, metadata = {} }) {
    const user = await currentUser(); if (!user || !sourceId) throw new Error('No se pudo identificar la acción.');
    if (supabaseConfigured) { const { data, error } = await supabase.rpc('award_points', { p_action_key: actionKey, p_source_id: sourceId, p_amount: Number(amount || 0), p_metadata: metadata }); if (error) throw error; return data; }
    const state = readLocal(); const rule = localRule(actionKey, state); if (!rule || rule.enabled === false) return { awarded: false, points: 0, reason: 'rule_disabled' }; const duplicate = (state.pointTransactions || []).some(item => item.user_id === user.id && item.action_key === actionKey && item.source_id === sourceId); if (duplicate) return { awarded: false, points: 0, reason: 'already_awarded' }; const points = actionKey === 'saving_bonus' ? Math.floor(Number(amount || 0) / Math.max(1, Number(rule.amount_unit || 10000))) * Number(rule.points || 0) : Number(rule.points || 0); if (points <= 0) return { awarded: false, points: 0, reason: 'zero_points' }; const transaction = { id: crypto.randomUUID(), user_id: user.id, action_key: actionKey, source_id: sourceId, points, amount: Number(amount || 0), metadata, created_at: new Date().toISOString() }; state.pointTransactions = [transaction, ...(state.pointTransactions || [])]; state.profile = { ...state.profile, points: Number(state.profile?.points || 0) + points }; writeLocal(state); return { awarded: true, points, transaction_id: transaction.id };
  },
};
export const rewardService = {
  list: () => list('rewards', 'rewards', { order: 'created_at' }),
  create: async payload => { const user = await currentUser(); return insert('rewards', { ...payload, user_id: user?.id }, 'rewards'); },
  update: (id, payload) => update('rewards', id, payload, 'rewards'),
  remove: id => remove('rewards', id, 'rewards'),
};
function localAchievementCriteria(state) {
  const completedCheckins = (state.checkins || []).filter(item => item.status === 'completed');
  const dates = [...new Set(completedCheckins.map(item => item.checkin_date).filter(Boolean).map(date => String(date).slice(0, 10)))].sort();
  let streak = 0;
  if (dates.length) {
    const available = new Set(dates); const cursor = new Date(`${dates[dates.length - 1]}T00:00:00Z`);
    while (available.has(cursor.toISOString().slice(0, 10))) { streak += 1; cursor.setUTCDate(cursor.getUTCDate() - 1); }
  }
  const cravings = state.cravingLogs || []; const savings = state.savings || []; const relapses = state.relapseLogs || [];
  const resumedAfterRelapse = relapses.some(relapse => (state.checkins || []).some(checkin => new Date(checkin.created_at || checkin.checkin_date || 0) > new Date(relapse.occurred_at || relapse.created_at || 0)));
  return { 'primer-dia': (state.habits || []).length > 0, 'primer-check-in': completedCheckins.length >= 1, 'tres-dias-presente': streak >= 3, 'una-semana-en-control': streak >= 7, 'primer-impulso-superado': cravings.some(item => item.outcome === 'mucho'), 'elegiste-diferente': cravings.some(item => item.outcome === 'mucho' || item.outcome === 'un_poco'), 'primer-ahorro': savings.length >= 1, 'dinero-recuperado': savings.reduce((total, item) => total + Number(item.amount || 0), 0) >= 50000, 'dos-semanas-constantes': streak >= 14, 'un-mes-de-avance': streak >= 30, 'nueva-version': streak >= 90, 'volviste-a-elegirte': relapses.length > 0 && resumedAfterRelapse };
}
export const userAchievementService = {
  list: async () => { const user = await currentUser(); return list('user_achievements', 'userAchievements', { userColumn: 'user_id', userId: user?.id, order: 'unlocked_at' }); },
  evaluate: async () => {
    const user = await currentUser(); if (!user) throw new Error('SesiÃ³n no iniciada');
    if (supabaseConfigured) { const { data, error } = await supabase.rpc('evaluate_my_achievements'); if (error) throw error; return data || []; }
    const state = readLocal(); const criteria = localAchievementCriteria(state); const unlocked = [];
    for (const achievement of state.achievements || []) if (criteria[achievement.slug]) { const result = await userAchievementService.unlock(achievement.id); if (result.unlocked) unlocked.push({ ...achievement, result }); }
    return unlocked;
  },
  unlock: async achievementId => { const user = await currentUser(); if (!user) throw new Error('Sesión no iniciada'); if (supabaseConfigured) { const { data, error } = await supabase.rpc('unlock_achievement', { p_achievement_id: achievementId }); if (error) throw error; return data; } const state = readLocal(); const alreadyUnlocked = (state.userAchievements || []).some(item => item.user_id === user.id && item.achievement_id === achievementId); if (alreadyUnlocked) return { unlocked: false, points: { awarded: false, points: 0, reason: 'already_unlocked' } }; const item = { id: crypto.randomUUID(), user_id: user.id, achievement_id: achievementId, unlocked_at: new Date().toISOString() }; state.userAchievements = [item, ...(state.userAchievements || [])]; writeLocal(state); const points = await pointService.award({ actionKey: 'achievement_unlocked', sourceId: achievementId }); return { unlocked: true, points };
  },
};
export const notificationService = {
  create: async payload => {
    const item = await insert('user_notifications', payload, 'userNotifications');
    if (!supabaseConfigured) window.dispatchEvent(new Event('sophena:notifications-updated'));
    return item;
  },
  list: async () => {
    const user = await currentUser();
    return list('user_notifications', 'userNotifications', { userColumn: 'user_id', userId: user?.id, order: 'created_at' });
  },
  unreadCount: async () => {
    const user = await currentUser();
    if (!supabaseConfigured) return (readLocal().userNotifications || []).filter(item => item.user_id === user?.id && !item.read_at).length;
    const { count, error } = await supabase.from('user_notifications').select('id', { count: 'exact', head: true }).eq('user_id', user.id).is('read_at', null);
    if (error) throw error;
    return count || 0;
  },
  subscribe: async onEvent => {
    if (!supabaseConfigured) return null;
    const user = await currentUser();
    if (!user?.id) return null;
    const channel = supabase.channel(`user-notifications-${user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'user_notifications', filter: `user_id=eq.${user.id}` }, payload => onEvent?.(payload))
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'user_notifications', filter: `user_id=eq.${user.id}` }, payload => onEvent?.(payload))
      .subscribe();
    return channel;
  },
  markRead: async id => {
    const user = await currentUser();
    if (!supabaseConfigured) {
      const state = readLocal();
      state.userNotifications = (state.userNotifications || []).map(item => item.id === id && item.user_id === user?.id ? { ...item, read_at: new Date().toISOString() } : item);
      writeLocal(state);
      window.dispatchEvent(new Event('sophena:notifications-updated'));
      return state.userNotifications.find(item => item.id === id);
    }
    const { data, error } = await supabase.from('user_notifications').update({ read_at: new Date().toISOString() }).eq('id', id).eq('user_id', user.id).select().single();
    if (error) throw error;
    window.dispatchEvent(new Event('sophena:notifications-updated'));
    return data;
  },
  createSessionNotification: async () => {
    const user = await currentUser();
    if (!user) return null;
    return notificationService.create({ user_id: user.id, notification_type: 'session', title: 'Tu sesión está lista', body: 'SOPHENA está aquí para acompañarte en tu proceso.', action_path: '/app', source_type: 'session' });
  },
  createFeedNotification: async post => {
    if (supabaseConfigured || !post?.id) return null;
    const user = localUser();
    const state = readLocal();
    const exists = (state.userNotifications || []).some(item => item.source_type === 'feed_post' && item.source_id === post.id && item.user_id === user?.id);
    if (exists) return null;
    return notificationService.create({ user_id: user?.id, notification_type: 'feed', title: post.title, body: post.excerpt || post.content || 'Hay una nueva novedad en SOPHENA.', action_path: '/feed', source_type: 'feed_post', source_id: post.id });
  },
  get: async () => {
    if (!supabaseConfigured) return { ...defaults.notifications, ...readLocal().notifications };
    const user = await currentUser();
    const { data, error } = await supabase.from('notification_preferences').select('*').eq('user_id', user.id).maybeSingle();
    if (error) throw error;
    return data || { user_id: user.id, ...defaults.notifications };
  },
  update: async payload => {
    if (!supabaseConfigured) { const state = readLocal(); state.notifications = { ...state.notifications, ...payload }; writeLocal(state); return state.notifications; }
    const user = await currentUser();
    const { data, error } = await supabase.from('notification_preferences').upsert({ user_id: user.id, ...payload, updated_at: new Date().toISOString() }, { onConflict: 'user_id' }).select().single();
    if (error) throw error;
    return data;
  },
};
export const adminService = {
  listUsers: async () => { if (supabaseConfigured) { const { data, error } = await supabase.rpc('list_admin_users'); if (error) throw error; return data || []; } return readLocal().adminUsers || [{ id: 'demo-user', email: readLocal().profile.email, full_name: readLocal().profile.full_name, role: readLocal().profile.role, points: readLocal().profile.points, created_at: new Date().toISOString() }]; },
  inviteUser: async payload => { if (supabaseConfigured) { const { data, error } = await supabase.functions.invoke('admin-create-user', { body: payload }); if (error) throw error; if (data?.error) throw new Error(data.error); return data; } const state = readLocal(); const item = { id: crypto.randomUUID(), email: payload.email, full_name: payload.fullName || '', role: payload.role || 'user', points: 0, created_at: new Date().toISOString() }; state.adminUsers = [item, ...(state.adminUsers || [])]; writeLocal(state); return item; },
  updateUserRole: async (userId, role) => { if (supabaseConfigured) { const { data, error } = await supabase.rpc('admin_update_user_role', { p_user_id: userId, p_role_key: role }); if (error) throw error; return data; } const state = readLocal(); state.adminUsers = (state.adminUsers || []).map(user => user.id === userId ? { ...user, role } : user); writeLocal(state); return state.adminUsers.find(user => user.id === userId); },
  listRoles: () => list('app_roles', 'appRoles', { order: 'created_at' }),
  createRole: payload => insert('app_roles', payload, 'appRoles'),
  listPermissions: () => list('app_permissions', 'appPermissions', { order: 'permission_key' }),
  listRolePermissions: () => list('role_permissions', 'rolePermissions', { order: 'created_at' }),
  setRolePermission: async (roleKey, permissionKey, enabled) => { if (supabaseConfigured) { if (enabled) { const { data, error } = await supabase.from('role_permissions').upsert({ role_key: roleKey, permission_key: permissionKey }).select().single(); if (error) throw error; return data; } const { error } = await supabase.from('role_permissions').delete().eq('role_key', roleKey).eq('permission_key', permissionKey); if (error) throw error; return true; } const state = readLocal(); const existing = (state.rolePermissions || []).find(item => item.role_key === roleKey && item.permission_key === permissionKey); if (enabled && !existing) state.rolePermissions = [...(state.rolePermissions || []), { role_key: roleKey, permission_key: permissionKey }]; if (!enabled) state.rolePermissions = (state.rolePermissions || []).filter(item => !(item.role_key === roleKey && item.permission_key === permissionKey)); writeLocal(state); return true; },
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
  createFeedPost: async payload => { const item = await insert('app_feed_posts', payload, 'feedPosts'); if (!supabaseConfigured && item.published) await notificationService.createFeedNotification(item); return item; },
  updateFeedPost: async (id, payload) => { const item = await update('app_feed_posts', id, payload, 'feedPosts'); if (!supabaseConfigured && item.published) await notificationService.createFeedNotification(item); return item; },
  removeFeedPost: id => remove('app_feed_posts', id, 'feedPosts'),
};

export const themeService = { getActive: async () => { if (supabaseConfigured) { const { data, error } = await supabase.from('app_themes').select('*').eq('is_active', true).eq('enabled', true).maybeSingle(); if (error) throw error; return data; } return readLocal().appThemes?.find(item => item.is_active && item.enabled) || null; } };
export const feedService = {
  list: () => list('app_feed_posts', 'feedPosts', { order: 'published_at' }),
  shareUrl: (postId, version = '') => {
    const encodedPostId = encodeURIComponent(postId);
    const cacheVersion = version ? `&v=${encodeURIComponent(version)}` : '';
    return supabaseConfigured && supabaseUrl
      ? `${supabaseUrl}/functions/v1/share-feed?post=${encodedPostId}${cacheVersion}`
      : `${brand.url}/feed/${encodedPostId}`;
  },
};
export const onboardingService = {
  async savePending(payload) { localStorage.setItem('sophena-pending-onboarding', JSON.stringify(payload)); },
  async completePending() {
    const raw = localStorage.getItem('sophena-pending-onboarding') || localStorage.getItem('nuvora-pending-onboarding');
    const user = await currentUser();
    const pending = raw ? JSON.parse(raw) : user?.user_metadata?.sophena_onboarding || user?.user_metadata?.nuvora_onboarding;
    if (!pending) return false;
    const createdHabits = await Promise.all((pending.habits || []).map(habit => habitService.create(habit)));
    await Promise.all(createdHabits.map(habit => goalService.create({ habit_id: habit.id, target_days: pending.targetDays || 7, reason: pending.reason || 'Salud', status: 'active' })));
    await userAchievementService.evaluate();
    localStorage.removeItem('sophena-pending-onboarding');
    localStorage.removeItem('nuvora-pending-onboarding');
    if (supabaseConfigured && (user?.user_metadata?.sophena_onboarding || user?.user_metadata?.nuvora_onboarding)) await supabase.auth.updateUser({ data: { ...user.user_metadata, sophena_onboarding: null, nuvora_onboarding: null } });
    return true;
  },
};

export const dataApi = { authService, profileService, habitService, goalService, checkinService, cravingService, relapseService, savingService, pointService, rewardService, userAchievementService, notificationService, adminService, storageService, themeService, feedService, onboardingService, isSupabaseConfigured: supabaseConfigured };
