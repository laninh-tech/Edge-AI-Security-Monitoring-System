<div align="center">

# 🛡️ Edge-AI Security Dashboard

### Real-time Smart Security Monitoring System

[![YOLOv8](https://img.shields.io/badge/YOLOv8-Nano-blue?style=flat-square&logo=yolo)](https://github.com/ultralytics/ultralytics)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Flask](https://img.shields.io/badge/Flask-3.x-000000?style=flat-square&logo=flask)](https://flask.palletsprojects.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📖 Giới thiệu | Overview

**Edge-AI Security Dashboard** là một hệ thống giám sát an ninh thông minh sử dụng công nghệ AI tiên tiến để phát hiện và theo dõi đối tượng theo thời gian thực. Dự án được xây dựng với YOLOv8, OpenCV và React, cung cấp giao diện web hiện đại để giám sát camera, phân tích sự kiện và quản lý cảnh báo.

**Edge-AI Security Dashboard** is an intelligent security monitoring system using cutting-edge AI technology for real-time object detection and tracking. Built with YOLOv8, OpenCV, and React, it provides a modern web interface for camera monitoring, event analysis, and alert management.

---

## ✨ Tính năng chính | Key Features

### 🎯 AI Detection
- **YOLOv8 Object Detection**: Phát hiện đối tượng với độ chính xác cao
- **Real-time Processing**: Xử lý video trực tiếp từ webcam với FPS cao
- **Multi-class Detection**: Nhận diện người, xe hơi, xe tải, xe máy và nhiều đối tượng khác
- **Smart Alerts**: Cảnh báo thông minh dựa trên độ tin cậy và loại đối tượng

### 📊 Dashboard & Analytics
- **Live Video Feed**: Luồng video trực tiếp với bounding boxes và labels
- **Performance Monitoring**: Theo dõi FPS, GPU load, memory usage real-time
- **Event Logs**: Lịch sử các sự kiện phát hiện với timestamps và confidence scores
- **Interactive Charts**: Biểu đồ hiệu suất và thống kê động

### 🎨 Modern UI/UX
- **Responsive Design**: Giao diện đáp ứng, tối ưu cho mọi thiết bị
- **Dark Theme**: Theme tối chuyên nghiệp, dễ nhìn
- **Real-time Updates**: Cập nhật dữ liệu tức thì qua Server-Sent Events (SSE)
- **Intuitive Navigation**: Điều hướng trực quan với nhiều module

---

## 🛠️ Công nghệ sử dụng | Tech Stack

### Backend
- **Python 3.x** - Core programming language
- **Flask** - Web framework
- **YOLOv8 (Ultralytics)** - Object detection model
- **OpenCV** - Computer vision processing
- **Flask-CORS** - Cross-origin resource sharing

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool & dev server
- **TailwindCSS 4.1** - Utility-first CSS framework
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

### Additional Tools
- **Node.js & Express** - TypeScript server
- **SQLite (better-sqlite3)** - Local database
- **Google Generative AI** - AI capabilities enhancement

---

## 📋 Yêu cầu | Prerequisites

### Phần mềm cần thiết | Required Software

```bash
# Node.js (v18 or higher)
node --version

# Python (v3.8 or higher)
python --version

# npm hoặc yarn
npm --version
```

### Thư viện Python | Python Dependencies

```bash
pip install flask flask-cors ultralytics opencv-python psutil
```

---

## 🚀 Cài đặt | Installation

### 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd "Edge-AI Security Dashboard"
```

### 2️⃣ Cài đặt Frontend Dependencies | Install Frontend Dependencies

```bash
npm install
```

### 3️⃣ Cài đặt Python Dependencies | Install Python Dependencies

```bash
pip install -r requirements.txt
# Hoặc cài đặt thủ công:
pip install flask flask-cors ultralytics opencv-python psutil
```

### 4️⃣ Cấu hình Environment Variables (Optional)

Tạo file `.env.local` nếu cần sử dụng Gemini API:

```env
GEMINI_API_KEY=your_api_key_here
```

---

## 🎬 Chạy ứng dụng | Running the Application

### Phương pháp 1: Chạy tự động (Windows)

```bash
run_all.bat
```

Script này sẽ tự động khởi động cả backend Python và frontend React.

### Phương pháp 2: Chạy thủ công

#### Terminal 1 - Backend AI (Python)
```bash
python python_server.py
```
Server sẽ chạy tại: `http://localhost:5000`

#### Terminal 2 - Frontend (React)
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: `http://localhost:5173`

---

## 📡 API Endpoints

### Backend Python Server (Port 5000)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/video_feed` | GET | MJPEG video stream với bounding boxes |
| `/api/stream` | GET | Server-Sent Events cho real-time updates |
| `/api/logs` | GET | Lấy danh sách event logs |
| `/api/logs` | DELETE | Xóa tất cả logs |
| `/api/trigger` | POST | Trigger detection thủ công |
| `/api/system` | GET | Thông tin system stats |

### Frontend TypeScript Server (Port 5173)

Vite dev server với hot module replacement (HMR)

---

## 📁 Cấu trúc dự án | Project Structure

```
Edge-AI Security Dashboard/
├── src/
│   ├── App.tsx              # Main React component
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles
├── python_server.py         # Flask backend với YOLOv8
├── server.ts                # TypeScript Express server
├── yolov8n.pt              # YOLOv8 Nano model weights
├── run_all.bat             # Windows startup script
├── package.json            # Node dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite configuration
├── metadata.json           # Project metadata
└── README.md              # This file
```

---

## 🎯 Cách sử dụng | Usage Guide

### 1️⃣ Dashboard View
- Xem video feed trực tiếp từ webcam
- Theo dõi biểu đồ FPS và hiệu suất
- Xem thống kê hệ thống (GPU load, Memory usage)

### 2️⃣ Camera Feeds
- Quản lý nhiều nguồn camera
- Xem chi tiết từng feed

### 3️⃣ Event Logs
- Xem lịch sử các detection events
- Filter theo loại đối tượng hoặc timestamp
- Clear logs khi cần

### 4️⃣ Manual Triggers
- Test hệ thống bằng cách trigger detection thủ công
- Simulate các loại sự kiện khác nhau

---

## ⚙️ Cấu hình | Configuration

### YOLOv8 Model

Mặc định sử dụng `yolov8n.pt` (Nano version) để đảm bảo tốc độ. Bạn có thể thay đổi model trong `python_server.py`:

```python
# Thay đổi model size
model = YOLO('yolov8s.pt')  # Small
model = YOLO('yolov8m.pt')  # Medium
model = YOLO('yolov8l.pt')  # Large
model = YOLO('yolov8x.pt')  # Extra Large
```

### Camera Source

Thay đổi nguồn camera trong `python_server.py`:

```python
# Webcam mặc định
camera = cv2.VideoCapture(0)

# Webcam khác
camera = cv2.VideoCapture(1)

# Video file
camera = cv2.VideoCapture('path/to/video.mp4')

# RTSP stream
camera = cv2.VideoCapture('rtsp://...')
```

### Detection Confidence

Điều chỉnh ngưỡng confidence trong `python_server.py`:

```python
if conf > 0.5:  # Thay đổi giá trị này (0.0 - 1.0)
    # Process detection
```

---

## 🐛 Troubleshooting

### Camera không hoạt động
- Kiểm tra camera đã được kết nối và cấp quyền
- Thử thay đổi camera index (0, 1, 2,...)
- Đảm bảo không có app nào khác đang sử dụng camera

### Model không load được
- Kiểm tra file `yolov8n.pt` có tồn tại
- Chạy lại download nếu cần: `yolo download model=yolov8n.pt`

### CORS Errors
- Đảm bảo Flask-CORS đã được cài đặt
- Kiểm tra ports đúng (5000 cho backend, 5173 cho frontend)

### FPS thấp
- Sử dụng model nhỏ hơn (yolov8n)
- Giảm resolution của camera
- Tối ưu confidence threshold

---

## 🚀 Build cho Production

### Build Frontend

```bash
npm run build
```

Kết quả được tạo trong thư mục `dist/`

### Deploy

Triển khai `dist/` folder lên static hosting (Vercel, Netlify, etc.)
Backend Python có thể deploy lên cloud platforms (AWS, GCP, Azure, etc.)

---

## 📝 Scripts

```json
{
  "dev": "tsx server.ts",           // Start development server
  "build": "vite build",            // Build for production
  "preview": "vite preview",        // Preview production build
  "lint": "tsc --noEmit",          // Type checking
  "clean": "rm -rf dist"           // Clean build directory
}
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- [Ultralytics YOLOv8](https://github.com/ultralytics/ultralytics) - Object detection model
- [OpenCV](https://opencv.org/) - Computer vision library
- [React](https://react.dev/) - Frontend framework
- [TailwindCSS](https://tailwindcss.com/) - CSS framework

---

<div align="center">

### ⭐ Nếu dự án này hữu ích, hãy cho một star nhé!

Made with ❤️ using AI & Open Source

</div>
