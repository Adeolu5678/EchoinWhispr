# EchoinWhispr Android Icon Resources

## Current Structure

### Adaptive Icons (Android 8.0+ / API 26+)
- `mipmap-anydpi-v26/ic_launcher.xml` - Adaptive icon declaration
- `mipmap-anydpi-v26/ic_launcher_round.xml` - Round adaptive icon
- `drawable/ic_launcher_background.xml` - Background layer (gradient #6C63FF → #A78BFA)
- `drawable/ic_launcher_foreground.xml` - Foreground layer (whisper/speech bubble icon)

### Legacy Icons (Android < 8.0)
PNG icons in mipmap folders (currently default Flutter icons):
- `mipmap-mdpi/` - 48x48px
- `mipmap-hdpi/` - 72x72px
- `mipmap-xhdpi/` - 96x96px
- `mipmap-xxhdpi/` - 144x144px
- `mipmap-xxxhdpi/` - 192x192px

## Generating Production Icons

### Option 1: flutter_launcher_icons (Recommended)

Add to `pubspec.yaml`:
```yaml
dev_dependencies:
  flutter_launcher_icons: ^0.13.1

flutter_launcher_icons:
  android: true
  ios: false
  image_path: "assets/icon/app_icon.png"
  adaptive_icon_background: "#6C63FF"
  adaptive_icon_foreground: "assets/icon/app_icon_foreground.png"
```

Run: `flutter pub run flutter_launcher_icons`

### Option 2: Android Studio Image Asset Studio
1. Open Android Studio
2. Right-click `res` folder → New → Image Asset
3. Select your icon image
4. Configure foreground and background layers
5. Preview across different shapes

### Option 3: Online Tools
- makeappicon.com
- appicon.co
- romannurik.github.io/AndroidAssetStudio

## Icon Design Guidelines

### Adaptive Icon Safe Zone
- Foreground content must fit within 66% of the icon (72dp circle in 108dp canvas)
- Content outside safe zone may be masked by launcher shapes
- Background should extend to full 108dp canvas

### Recommended Sizes
| Density | Scale | Icon Size |
|---------|-------|-----------|
| mdpi    | 1x    | 48x48     |
| hdpi    | 1.5x  | 72x72     |
| xhdpi   | 2x    | 96x96     |
| xxhdpi  | 3x    | 144x144   |
| xxxhdpi | 4x    | 192x192   |

### Master Image Size
Create a 1024x1024px master icon for best quality across all densities.

## App Theme Colors
- Primary: `#6C63FF` (Purple-Blue)
- Accent: `#A78BFA` (Light Purple)
- Foreground Icon: `#FFFFFF` (White)

## Placeholder Status
The PNG files in mipmap-* folders are currently the default Flutter icons.
Replace them with custom icons before release.