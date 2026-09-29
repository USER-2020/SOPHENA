param(
  [ValidateSet('es', 'en', 'all')]
  [string]$Language = 'all'
)

Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$publicRoot = Join-Path $projectRoot 'public'

function New-RoundedRectanglePath {
  param([int]$X, [int]$Y, [int]$Width, [int]$Height, [int]$Radius)
  $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
  $diameter = $Radius * 2
  $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
  $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
  $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function New-SocialCard {
  param(
    [string]$OutputPath,
    [string]$FirstLine,
    [string]$SecondLine,
    [string]$Tagline,
    [int]$TitleSize = 62
  )

  $width = 1200
  $height = 630
  $bitmap = [System.Drawing.Bitmap]::new($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

  $background = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.Rectangle]::new(0, 0, $width, $height),
    [System.Drawing.Color]::FromArgb(255, 13, 11, 18),
    [System.Drawing.Color]::FromArgb(255, 33, 28, 44),
    35
  )
  $graphics.FillRectangle($background, 0, 0, $width, $height)

  $purpleGlow = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(34, 167, 139, 250))
  $greenGlow = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(28, 117, 214, 196))
  $graphics.FillEllipse($purpleGlow, 810, -70, 360, 360)
  $graphics.FillEllipse($greenGlow, 900, 410, 300, 260)

  $accent = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
    [System.Drawing.Rectangle]::new(92, 105, 74, 74),
    [System.Drawing.Color]::FromArgb(255, 167, 139, 250),
    [System.Drawing.Color]::FromArgb(255, 117, 214, 196),
    35
  )
  $logoPath = New-RoundedRectanglePath 92 105 74 74 24
  $graphics.FillPath($accent, $logoPath)

  $white = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 247, 245, 250))
  $muted = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 170, 164, 180))
  $green = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 117, 214, 196))
  $markFont = [System.Drawing.Font]::new('Segoe UI', 45, [System.Drawing.FontStyle]::Bold)
  $brandFont = [System.Drawing.Font]::new('Segoe UI', 38, [System.Drawing.FontStyle]::Bold)
  $titleFont = [System.Drawing.Font]::new('Segoe UI', $TitleSize, [System.Drawing.FontStyle]::Bold)
  $taglineFont = [System.Drawing.Font]::new('Segoe UI', 22, [System.Drawing.FontStyle]::Regular)

  $graphics.DrawString('S', $markFont, $white, 112, 113)
  $graphics.DrawString('SOPHENA', $brandFont, $white, 190, 117)
  $graphics.DrawString($FirstLine, $titleFont, $white, 96, 240)
  $graphics.DrawString($SecondLine, $titleFont, $green, 96, 317)
  $graphics.DrawString($Tagline, $taglineFont, $muted, 100, 465)

  $purplePen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(190, 167, 139, 250), 2)
  $greenPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(190, 117, 214, 196), 2)
  $graphics.DrawEllipse($purplePen, 790, 260, 380, 124)
  $graphics.DrawEllipse($greenPen, 790, 260, 380, 124)
  $graphics.DrawEllipse($purplePen, 905, 297, 100, 100)
  $graphics.FillEllipse($green, 1020, 285, 16, 16)

  $bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $background.Dispose()
  $purpleGlow.Dispose()
  $greenGlow.Dispose()
  $accent.Dispose()
  $white.Dispose()
  $muted.Dispose()
  $green.Dispose()
  $markFont.Dispose()
  $brandFont.Dispose()
  $titleFont.Dispose()
  $taglineFont.Dispose()
  $purplePen.Dispose()
  $greenPen.Dispose()
  $logoPath.Dispose()
  $bitmap.Dispose()
}

if ($Language -in @('es', 'all')) {
  New-SocialCard (Join-Path $publicRoot 'og-image.png') 'Entiende. Decide.' 'Avanza.' 'Entiende tus habitos - registra tu proceso - celebra cada avance'
}

if ($Language -in @('en', 'all')) {
  New-SocialCard (Join-Path $publicRoot 'og-image-en.png') 'Understand. Decide.' 'Move forward.' 'Understand your habits - track your journey - celebrate every step' 54
}
