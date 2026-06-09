# 🎮 GameTunes – Game Boy Music Player

Widget de escritorio con estética retro Game Boy para reproducir música desde YouTube.

![Electron](https://img.shields.io/badge/Electron-28-blue) ![YouTube API](https://img.shields.io/badge/YouTube-Data%20API%20v3-red)

## ✨ Características

- Diseño retro inspirado en el Game Boy original
- Búsqueda y reproducción de música desde YouTube
- Visualizador EQ animado
- Always-on-top: flota sobre todas las ventanas
- Controles desde la bandeja del sistema (tray)
- Atajos de teclado multimedia

## 🚀 Instalación

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/gametunes.git
cd gametunes

# Instala dependencias
npm install

# Configura tu API key
cp .env.example .env
# Edita .env y agrega tu YouTube Data API v3 key

# Ejecuta la app
npm start
```

## 🔑 API Key

Necesitas una API key de [YouTube Data API v3](https://console.cloud.google.com/).

1. Ve a Google Cloud Console
2. Crea un proyecto y habilita YouTube Data API v3
3. Genera una API key
4. Agrégala en el archivo `.env`

## 🎮 Controles

| Botón | Acción |
|-------|--------|
| A | Play / Pause |
| B | Buscar canción |
| ◄ / ► | Anterior / Siguiente |
| ▲ / ▼ | Retroceder / Avanzar 10s |
| VOL- / VOL+ | Bajar / Subir volumen |

## 🛠 Tecnologías

- [Electron.js](https://www.electronjs.org/)
- [YouTube Data API v3](https://developers.google.com/youtube/v3)
- YouTube IFrame API
- HTML / CSS / JavaScript vanilla

## 👤 Autor

**Fabián Baeza** – [LinkedIn](https://www.linkedin.com/in/fabian-mauricio-baeza-velarde-320ab8295/)
