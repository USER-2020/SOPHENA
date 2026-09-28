export const brand = {
  name: 'SOPHENA',
  domain: 'sophena.online',
  url: 'https://sophena.online',
  tagline: 'Entiende. Decide. Avanza.',
  description: 'SOPHENA te ayuda a entender tus hábitos, controlar impulsos, medir tu progreso y construir cambios que puedas mantener.',
  seo: {
    title: 'SOPHENA — Entiende tus hábitos y transforma tus decisiones',
    description: 'SOPHENA te ayuda a entender tus hábitos, controlar impulsos, medir tu progreso y construir cambios que puedas mantener.'
  },
  colors: {
    dark: {
      bg: '#0D0B12', surface: '#15121C', card: '#211C2C', purple: '#A78BFA',
      purpleStrong: '#8B6EE8', green: '#75D6C4', amber: '#F3C677', danger: '#E17C8C',
      success: '#78CFA4', warning: '#E9B66B', text: '#F7F5FA', muted: '#AAA4B4', faint: '#746E7D'
    },
    light: {
      bg: '#FAF9FC', surface: '#FFFFFF', card: '#F1EEF7', purple: '#8B6EE8',
      purpleStrong: '#7356D6', green: '#4CB8A5', amber: '#C58D2D', danger: '#C95F70',
      success: '#4C9E78', warning: '#B77928', text: '#211C2C', muted: '#625B6C', faint: '#8D8598'
    }
  }
};

export const brandTheme = {
  bg: brand.colors.dark.bg,
  surface: brand.colors.dark.surface,
  card: brand.colors.dark.card,
  purple: brand.colors.dark.purple,
  green: brand.colors.dark.green,
  amber: brand.colors.dark.amber,
  danger: brand.colors.dark.danger
};
