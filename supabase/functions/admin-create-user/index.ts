import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const authorization = request.headers.get('Authorization');
    if (!authorization) return new Response(JSON.stringify({ error: 'Sesión no iniciada' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const caller = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authorization } } });
    const { data: { user } } = await caller.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: 'Sesión no iniciada' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: callerProfile } = await admin.from('profiles').select('role').eq('id', user.id).single();
    if (callerProfile?.role !== 'super_admin') return new Response(JSON.stringify({ error: 'Solo un superadmin puede invitar usuarios' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const { email, fullName, role } = await request.json();
    if (!email || !role) throw new Error('Correo y rol son obligatorios');
    const { data: roleRow } = await admin.from('app_roles').select('role_key').eq('role_key', role).single();
    if (!roleRow) throw new Error('El rol seleccionado no existe');
    const redirectTo = `${Deno.env.get('APP_URL') || 'https://sophena.online'}/login`;
    const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, { data: { full_name: fullName || '' }, redirectTo });
    if (inviteError) throw inviteError;
    const { error: profileError } = await admin.from('profiles').update({ email, full_name: fullName || '', role, updated_at: new Date().toISOString() }).eq('id', invited.user.id);
    if (profileError) throw profileError;
    return new Response(JSON.stringify({ id: invited.user.id, email, full_name: fullName || '', role }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'No se pudo crear la invitación' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
