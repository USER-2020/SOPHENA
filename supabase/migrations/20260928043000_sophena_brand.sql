-- Rebranding global de la experiencia a SOPHENA.
update public.app_themes
set
  theme_key = 'sophena-default',
  name = 'SOPHENA',
  config = '{"bg":"#0D0B12","surface":"#15121C","card":"#211C2C","purple":"#A78BFA","green":"#75D6C4","amber":"#F3C677","danger":"#E17C8C"}'::jsonb,
  enabled = true,
  is_active = true,
  updated_at = now()
where theme_key = 'nuvora-default';
