import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const LANGUAGE_STORAGE_KEY = 'sophena-language';
export const SUPPORTED_LANGUAGES = ['es', 'en'];

const translations = [
  ['Entiende · Decide · Avanza', 'Understand · Decide · Move forward'],
  ['Ya tengo una cuenta', 'I already have an account'],
  ['Comenzar', 'Get started'],
  ['Un espacio privado para avanzar a tu ritmo', 'A private space to move forward at your own pace'],
  ['Tus hábitos', 'Your habits'],
  ['cuentan una historia.', 'tell a story.'],
  ['SOPHENA te ayuda a entender tus patrones, controlar impulsos y construir cambios que puedas mantener.', 'SOPHENA helps you understand your patterns, manage urges, and build lasting change.'],
  ['día 12', 'day 12'],
  ['Tu proceso', 'Your journey'],
  ['Racha actual', 'Current streak'],
  ['Recuperado', 'Recovered'],
  ['Nuevo logro', 'New achievement'],
  ['Entiende tus patrones. Decide con intención.', 'Understand your patterns. Decide with intention.'],
  ['Tus datos siempre son tuyos', 'Your data always belongs to you'],
  ['← Volver', '← Back'],
  ['← Atrás', '← Back'],
  ['BIENVENIDO DE VUELTA', 'WELCOME BACK'],
  ['Tu progreso', 'Your progress'],
  ['te espera.', 'is waiting for you.'],
  ['Continúa construyendo la versión de ti que quieres ver.', 'Keep building the version of yourself you want to see.'],
  ['Contraseña', 'Password'],
  ['Ocultar', 'Hide'],
  ['Mostrar', 'Show'],
  ['Recuérdame', 'Remember me'],
  ['¿Olvidaste tu contraseña?', 'Forgot your password?'],
  ['Iniciar sesión', 'Sign in'],
  ['¿Aún no tienes cuenta?', "Don't have an account yet?"],
  ['Crear una', 'Create one'],
  ['Entrando…', 'Signing in…'],
  ['RECUPERACIÓN SEGURA', 'SECURE RECOVERY'],
  ['Volver al inicio de sesión', 'Back to sign in'],
  ['Vuelve a', 'Come back'],
  ['entrar.', 'in.'],
  ['Escribe tu correo y te enviaremos un enlace seguro para crear una nueva contraseña.', 'Enter your email and we will send you a secure link to create a new password.'],
  ['Enviando…', 'Sending…'],
  ['Enviar enlace', 'Send link'],
  ['NUEVA CONTRASEÑA', 'NEW PASSWORD'],
  ['Crea una clave', 'Create a'],
  ['nueva.', 'new password.'],
  ['Nueva contraseña', 'New password'],
  ['Confirmar contraseña', 'Confirm password'],
  ['Actualizar contraseña', 'Update password'],
  ['Guardando…', 'Saving…'],
  ['EMPECEMOS POR TI', "LET'S START WITH YOU"],
  ['¿Cómo quieres', 'How do you want to'],
  ['empezar?', 'get started?'],
  ['Crea tu cuenta para guardar cada avance.', 'Create your account to save every step forward.'],
  ['Tu nombre', 'Your name'],
  ['¿Cómo te llamamos?', 'What should we call you?'],
  ['Mínimo 6 caracteres', 'At least 6 characters'],
  ['Repite tu contraseña', 'Repeat your password'],
  ['TU PUNTO DE PARTIDA', 'YOUR STARTING POINT'],
  ['¿Qué quieres', 'What do you want to'],
  ['mejorar?', 'improve?'],
  ['Elige uno o varios hábitos.', 'Choose one or more habits.'],
  ['Cigarrillo', 'Smoking'],
  ['Redes sociales', 'Social media'],
  ['Comida compulsiva', 'Compulsive eating'],
  ['Videojuegos', 'Gaming'],
  ['Compras impulsivas', 'Impulse shopping'],
  ['Cafeína', 'Caffeine'],
  ['Otro hábito', 'Another habit'],
  ['Nombre del hábito personalizado', 'Custom habit name'],
  ['UN OBJETIVO A TU MEDIDA', 'A GOAL THAT FITS YOU'],
  ['¿Qué quieres', 'What do you want to'],
  ['lograr?', 'achieve?'],
  ['Define un objetivo amable y realista.', 'Set a kind and realistic goal.'],
  ['Dejar completamente', 'Quit completely'],
  ['Reducir', 'Reduce'],
  ['Controlar frecuencia', 'Control frequency'],
  ['Cero días, un paso a la vez', 'Zero days, one step at a time'],
  ['Menos, con intención', 'Less, with intention'],
  ['Tú decides el ritmo', 'You set the pace'],
  ['¿Cuánto gastas aproximadamente?', 'How much do you spend approximately?'],
  ['por semana', 'per week'],
  ['por día', 'per day'],
  ['por mes', 'per month'],
  ['TU MOTIVACIÓN', 'YOUR MOTIVATION'],
  ['Tu plan empieza', 'Your plan starts'],
  ['con una razón.', 'with a reason.'],
  ['Ya tienes todo listo. Tus datos se guardarán de forma segura.', 'You are all set. Your data will be stored securely.'],
  ['Salud', 'Health'],
  ['Dinero', 'Money'],
  ['Familia', 'Family'],
  ['Productividad', 'Productivity'],
  ['Disciplina', 'Discipline'],
  ['Bienestar', 'Well-being'],
  ['Primera meta sugerida', 'Suggested first goal'],
  ['Crear mi plan', 'Create my plan'],
  ['Continuar', 'Continue'],
  ['Preparando...', 'Preparing...'],
  ['Configurando SOPHENA', 'SETTING UP SOPHENA'],
  ['Creando tu perfil', 'Creating your profile'],
  ['Diseñando tu experiencia', 'Designing your experience'],
  ['Guardando tus objetivos', 'Saving your goals'],
  ['Todo listo', 'All set'],
  ['CUENTA CREADA', 'ACCOUNT CREATED'],
  ['Verifica tu correo', 'Verify your email'],
  ['para entrar.', 'to sign in.'],
  ['Ir a iniciar sesión', 'Go to sign in'],
  ['Lo haré más tarde', 'I will do it later'],
  ['ESPACIO PERSONAL', 'PERSONAL SPACE'],
  ['Hola,', 'Hello,'],
  ['Nivel explorador', 'Explorer level'],
  ['Configuración', 'Settings'],
  ['Inicio', 'Home'],
  ['Progreso', 'Progress'],
  ['Metas', 'Goals'],
  ['Metas & recompensas', 'Goals & rewards'],
  ['Perfil', 'Profile'],
  ['Novedades', 'Updates'],
  ['Documentación', 'Documentation'],
  ['Notificaciones', 'Notifications'],
  ['Abrir perfil', 'Open profile'],
  ['Abrir menú de usuario', 'Open user menu'],
  ['MÓDULO PERSONALIZADO', 'CUSTOM MODULE'],
  ['Una nueva experiencia para acompañar tu proceso.', 'A new experience to support your journey.'],
  ['Tu siguiente paso', 'Your next step'],
  ['Registrar un avance', 'Log a step forward'],
  ['VISTA GENERAL', 'OVERVIEW'],
  ['Tu progreso,', 'Your progress,'],
  ['visible.', 'made visible.'],
  ['Cargando tus registros...', 'Loading your records...'],
  ['Cada registro refleja tu proceso real.', 'Every entry reflects your real journey.'],
  ['Datos reales', 'Real data'],
  ['Tu constancia', 'Your consistency'],
  ['Objetivo cumplido', 'Goal completed'],
  ['Impulso registrado', 'Urge logged'],
  ['Sin registro', 'No entry'],
  ['CUMPLIMIENTO REAL', 'REAL COMPLETION'],
  ['Tu avance está tomando forma. Sigue a tu ritmo.', 'Your progress is taking shape. Keep going at your pace.'],
  ['Todavía no hay check-ins en este periodo.', 'There are no check-ins in this period yet.'],
  ['ESTA SEMANA', 'THIS WEEK'],
  ['LECTURAS CLAVE', 'KEY INSIGHTS'],
  ['Lo que tus datos cuentan', 'What your data tells you'],
  ['TU MOTIVACIÓN EXTRA', 'YOUR EXTRA MOTIVATION'],
  ['Recompénsate por', 'Reward yourself for'],
  ['avanzar.', 'moving forward.'],
  ['Todo lo que ves aquí corresponde a tu cuenta.', 'Everything you see here belongs to your account.'],
  ['XP disponibles', 'XP available'],
  ['Logros', 'Achievements'],
  ['Mis recompensas', 'My rewards'],
  ['RECOMPENSA', 'REWARD'],
  ['Crear recompensa', 'Create reward'],
  ['Guardar recompensa', 'Save reward'],
  ['Cancelar', 'Cancel'],
  ['Nombre', 'Name'],
  ['Descripción', 'Description'],
  ['Puntos', 'Points'],
  ['TU PERFIL', 'YOUR PROFILE'],
  ['Datos sincronizados', 'Data synced'],
  ['TU INFORMACIÓN', 'YOUR INFORMATION'],
  ['Cuenta', 'Account'],
  ['Datos personales', 'Personal details'],
  ['Hábitos y objetivos', 'Habits and goals'],
  ['Actividad registrada', 'Logged activity'],
  ['Privacidad', 'Privacy'],
  ['Tus datos son tuyos', 'Your data belongs to you'],
  ['Cerrar sesión', 'Sign out'],
  ['TU IMPACTO', 'YOUR IMPACT'],
  ['Desde que empezaste', 'Since you started'],
  ['dinero recuperado', 'money recovered'],
  ['racha actual', 'current streak'],
  ['impulsos superados', 'urges overcome'],
  ['Editar tu perfil', 'Edit your profile'],
  ['Nombre completo', 'Full name'],
  ['Guardar cambios', 'Save changes'],
  ['Registrar', 'Log'],
  ['CHECK-IN DE HOY', "TODAY'S CHECK-IN"],
  ['¿Cómo te fue hoy?', 'How did today go?'],
  ['Registrar cómo te sientes toma menos de un minuto.', 'Logging how you feel takes less than a minute.'],
  ['TU ACTIVIDAD', 'YOUR ACTIVITY'],
  ['Últimos 7 días', 'Last 7 days'],
  ['Cumplimiento', 'Completion'],
  ['RECUERDA', 'REMEMBER'],
  ['Lo estás', "You're"],
  ['haciendo bien.', 'doing well.'],
  ['La constancia no es hacerlo perfecto. Es volver a elegirte.', "Consistency is not about being perfect. It's about choosing yourself again."],
  ['Un pequeño insight', 'A small insight'],
  ['Acceso restringido', 'Restricted access'],
  ['Volver a SOPHENA', 'Back to SOPHENA'],
  ['Idioma', 'Language'],
  ['Cambiar idioma', 'Change language']
];

const dictionary = { es: new Map(translations.map(([es]) => [es, es])), en: new Map(translations) };
const reverseDictionary = { es: new Map(translations.map(([es, en]) => [en, es])), en: new Map(translations.map(([es, en]) => [en, en])) };

export function getInitialLanguage() {
  if (typeof window === 'undefined') return 'es';
  const pathLanguage = window.location.pathname.match(/^\/(es|en)(?:\/|$)/)?.[1];
  if (SUPPORTED_LANGUAGES.includes(pathLanguage)) return pathLanguage;
  const queryLanguage = new URLSearchParams(window.location.search).get('lang')?.toLowerCase();
  if (SUPPORTED_LANGUAGES.includes(queryLanguage)) return queryLanguage;
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (SUPPORTED_LANGUAGES.includes(stored)) return stored;
  return window.navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'es';
}

function translateValue(value, language) {
  const trimmed = value.trim();
  if (!trimmed) return value;
  const map = language === 'en' ? dictionary.en : reverseDictionary.es;
  const translated = map.get(trimmed);
  return translated ? value.replace(trimmed, translated) : value;
}

function translateDocument(root, language) {
  if (!root) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    if (node.parentElement?.closest('script, style, code, pre, textarea')) return;
    const translated = translateValue(node.nodeValue, language);
    if (translated !== node.nodeValue) node.nodeValue = translated;
  });
  root.querySelectorAll('input, textarea, select, button, [title], [aria-label], [alt]').forEach(element => {
    ['placeholder', 'title', 'aria-label', 'alt'].forEach(attribute => {
      if (element.hasAttribute(attribute)) {
        const value = element.getAttribute(attribute);
        const translated = translateValue(value, language);
        if (translated !== value) element.setAttribute(attribute, translated);
      }
    });
  });
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);
  const value = useMemo(() => ({
    language,
    setLanguage: next => setLanguage(SUPPORTED_LANGUAGES.includes(next) ? next : 'es'),
    t: valueToTranslate => dictionary[language].get(valueToTranslate) || valueToTranslate
  }), [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'en'
      ? 'SOPHENA — Understand your habits and transform your decisions'
      : 'SOPHENA — Entiende tus hábitos y transforma tus decisiones';
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    translateDocument(document.getElementById('root'), language);
    const observer = new MutationObserver(() => translateDocument(document.getElementById('root'), language));
    observer.observe(document.getElementById('root'), { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [language]);

  return React.createElement(LanguageContext.Provider, { value }, children);
}

export function useLanguage() {
  return useContext(LanguageContext) || { language: 'es', setLanguage: () => {}, t: value => value };
}

export function LanguageSwitch({ embedded = false, className = '' } = {}) {
  const { language, setLanguage } = useLanguage();
  const english = language === 'en';
  const changeLanguage = nextLanguage => {
    const currentPath = window.location.pathname;
    const hasLanguagePrefix = /^\/(es|en)(?:\/|$)/.test(currentPath);
    const nextPath = hasLanguagePrefix
      ? currentPath.replace(/^\/(es|en)(?=\/|$)/, `/${nextLanguage}`)
      : `/${nextLanguage}${currentPath === '/' ? '/' : currentPath}`;
    setLanguage(nextLanguage);
    if (nextPath !== currentPath) window.location.assign(`${nextPath}${window.location.search}${window.location.hash}`);
  };
  const switchClassName = ['language-switch', embedded ? 'language-switch-embedded' : 'language-switch-global', className].filter(Boolean).join(' ');
  return React.createElement('label', { className: switchClassName, title: english ? 'Change language / Cambiar idioma' : 'Cambiar idioma / Change language' },
    React.createElement('span', { className: 'language-switch-label' }, 'ES'),
    React.createElement('input', { type: 'checkbox', role: 'switch', 'aria-label': english ? 'Switch to Spanish' : 'Cambiar a inglés', checked: english, onChange: event => changeLanguage(event.target.checked ? 'en' : 'es') }),
    React.createElement('span', { className: 'language-switch-track' }, React.createElement('span')),
    React.createElement('span', { className: 'language-switch-label' }, 'EN')
  );
}
