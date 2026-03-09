# 📝 Changelog

All notable changes to the Edge-AI Security Dashboard project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### 🎯 Planned Features
- Multi-camera support with camera management UI
- Advanced alert configuration with custom rules
- Video recording and playback functionality
- Email/SMS notification system
- User authentication and role-based access
- Historical analytics and reporting
- TensorRT optimization for NVIDIA GPUs
- Docker containerization
- Mobile app integration
- Cloud deployment guides

---

## [2.4.1] - 2026-03-09

### 📚 Documentation
- Complete README rewrite with comprehensive documentation
- Added CONTRIBUTING.md guide for contributors
- Created detailed .env.example template
- Enhanced .gitignore with Python and Node.js patterns
- Added MIT LICENSE file
- Created CHANGELOG.md for version tracking

### 🔧 Configuration
- Added requirements.txt for Python dependencies
- Improved environment variable configuration
- Better project structure documentation

---

## [2.4.0] - Initial Version

### ✨ Features
- **YOLOv8 Integration**: Real-time object detection using YOLOv8n model
- **Live Video Feed**: MJPEG streaming from webcam with detection overlays
- **Real-time Dashboard**: React-based modern UI with dark theme
- **Server-Sent Events (SSE)**: Real-time data updates without polling
- **Performance Monitoring**: FPS, GPU load, and memory usage tracking
- **Interactive Charts**: Live performance visualization using Recharts
- **Event Logging**: Historical detection logs with timestamps
- **Smart Alerts**: Configurable alert system based on object type and confidence
- **Multi-object Detection**: Person, car, truck, motorcycle, and 80+ COCO classes
- **Responsive Design**: Mobile-friendly interface with TailwindCSS

### 🛠️ Backend (Python Flask)
- Flask REST API server
- OpenCV video capture and processing
- YOLOv8 model inference
- System resource monitoring with psutil
- CORS support for frontend integration

### 🎨 Frontend (React + TypeScript)
- React 19 with TypeScript
- Vite build tool for fast development
- TailwindCSS 4.1 for styling
- Lucide React icons
- Framer Motion for animations
- Recharts for data visualization
- Multiple view modes (Dashboard, Cameras, Events, Nodes, Settings)

### 🚀 Developer Experience
- TypeScript for type safety
- Hot module replacement (HMR)
- Windows batch script for easy startup
- Separate TypeScript and Python servers
- Clean project structure

---

## Version History Summary

| Version | Date | Highlights |
|---------|------|------------|
| 2.4.1 | 2026-03-09 | Documentation overhaul |
| 2.4.0 | - | Initial release with core features |

---

## 🔗 Links

- [Repository](https://github.com/yourusername/edge-ai-security-dashboard)
- [Issues](https://github.com/yourusername/edge-ai-security-dashboard/issues)
- [Releases](https://github.com/yourusername/edge-ai-security-dashboard/releases)

---

## 📋 Changelog Categories

This changelog uses the following categories:

- **✨ Features**: New features and capabilities
- **🐛 Bug Fixes**: Bug fixes and corrections
- **🔧 Configuration**: Configuration and setup changes
- **📚 Documentation**: Documentation updates
- **🎨 UI/UX**: User interface and experience improvements
- **⚡ Performance**: Performance improvements
- **🔒 Security**: Security updates and fixes
- **♻️ Refactor**: Code refactoring without changing functionality
- **🗑️ Deprecated**: Features marked for removal
- **🚫 Removed**: Removed features
- **🧪 Testing**: Test additions and improvements

---

<div align="center">

For breaking changes and migration guides, please check the [documentation](README.md).

</div>
