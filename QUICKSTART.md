# ⚡ Quick Start Guide

Hướng dẫn nhanh để chạy Edge-AI Security Dashboard trong 5 phút!

---

## 🎯 Yêu cầu tối thiểu | Minimum Requirements

- ✅ **Windows OS** (hoặc Linux/Mac với điều chỉnh nhỏ)
- ✅ **Python 3.8+** đã cài đặt
- ✅ **Node.js 18+** đã cài đặt
- ✅ **Webcam** hoạt động
- ✅ **4GB RAM** tối thiểu
- ✅ **Kết nối Internet** (lần đầu cài đặt)

---

## 🚀 5 Bước Cài Đặt | 5 Steps to Run

### Bước 1️⃣: Tải về dự án

```bash
# Git clone hoặc download ZIP và giải nén
cd "Edge-AI Security Dashboard"
```

### Bước 2️⃣: Cài đặt Node.js dependencies

```bash
npm install
```

⏱️ Thời gian: ~2-3 phút

### Bước 3️⃣: Cài đặt Python dependencies

```bash
pip install flask flask-cors ultralytics opencv-python psutil
```

⏱️ Thời gian: ~3-5 phút (tùy tốc độ mạng)

> **Lưu ý**: YOLOv8 sẽ tự động tải model `yolov8n.pt` (~6MB) lần đầu chạy nếu chưa có

### Bước 4️⃣: Chạy ứng dụng

#### 🪟 Windows - Cách đơn giản nhất:
```bash
run_all.bat
```

Hoặc

#### 🖥️ Cách thủ công (tất cả OS):

**Terminal 1 - Python Backend:**
```bash
python python_server.py
```

**Terminal 2 - React Frontend:**
```bash
npm run dev
```

### Bước 5️⃣: Mở trình duyệt

Truy cập: **http://localhost:5173**

🎉 **Xong! Dashboard đang chạy!**

---

## ✅ Kiểm tra hoạt động | Verify Installation

Sau khi chạy, bạn nên thấy:

### Terminal Python:
```
✓ Loading YOLOv8 model...
✓ Model loaded successfully
✓ Camera initialized
* Running on http://127.0.0.1:5000
```

### Terminal Node.js:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Trình duyệt:
- ✓ Giao diện dashboard hiển thị
- ✓ Video feed từ webcam
- ✓ Biểu đồ FPS cập nhật
- ✓ Không có lỗi console

---

## 🐛 Lỗi thường gặp | Common Issues

### ❌ Lỗi: "Camera không hoạt động"

**Nguyên nhân**: Camera không được phát hiện hoặc đang được sử dụng

**Giải pháp**:
```python
# Mở python_server.py, thay đổi dòng:
camera = cv2.VideoCapture(0)  # Thử đổi 0 thành 1 hoặc 2
```

---

### ❌ Lỗi: "ModuleNotFoundError: No module named 'cv2'"

**Nguyên nhân**: OpenCV chưa được cài đặt

**Giải pháp**:
```bash
pip install opencv-python
```

---

### ❌ Lỗi: "CORS policy error"

**Nguyên nhân**: Frontend và backend chạy sai port

**Giải pháp**: Đảm bảo:
- Backend chạy ở port 5000
- Frontend chạy ở port 5173
- Không có ứng dụng nào khác dùng các port này

Kiểm tra:
```bash
# Xem port đang sử dụng
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

---

### ❌ Lỗi: "torch not found" hoặc CUDA errors

**Nguyên nhân**: PyTorch chưa được cài đặt đúng

**Giải pháp**:
```bash
# CPU only (nhẹ hơn)
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Với CUDA GPU support
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

---

### ❌ FPS quá thấp (< 10 FPS)

**Nguyên nhân**: Máy yếu hoặc model quá nặng

**Giải pháp**:
1. Giảm resolution camera
2. Tăng confidence threshold
3. Đã dùng model nano nhẹ nhất rồi

---

### ❌ Port 5000 hoặc 5173 đã được sử dụng

**Giải pháp**:

**Windows:**
```bash
# Tìm process đang dùng port
netstat -ano | findstr :5000

# Kill process (thay PID bằng số thực tế)
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Tìm và kill process
lsof -ti:5000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

---

## 🎯 Tiếp theo làm gì? | What's Next?

### 1️⃣ Tùy chỉnh cấu hình

Chỉnh sửa `python_server.py`:

```python
# Thay đổi confidence threshold
if conf > 0.5:  # Tăng lên 0.7 để ít detection hơn

# Thay đổi FPS limit
time.sleep(0.033)  # ~30 FPS

# Thêm object classes khác vào alert
if class_name in ['person', 'car', 'dog', 'cat']:
    # Trigger alert
```

### 2️⃣ Test với video file

```python
# Thay vì webcam, dùng video file
camera = cv2.VideoCapture('path/to/your/video.mp4')
```

### 3️⃣ Thêm RTSP stream

```python
# Kết nối camera IP
camera = cv2.VideoCapture('rtsp://username:password@ip:port/stream')
```

### 4️⃣ Tối ưu hóa hiệu suất

- Sử dụng GPU nếu có (CUDA)
- Giảm resolution frame
- Tăng confidence threshold
- Skip frames nếu cần

---

## 📚 Tài liệu chi tiết | Full Documentation

Đọc thêm trong [README.md](README.md) để biết:
- Chi tiết tất cả features
- API endpoints documentation
- Cấu hình nâng cao
- Deployment guides
- Contributing guidelines

---

## 💡 Tips & Tricks

### 🎨 Thay đổi màu bounding boxes

Trong `python_server.py`:
```python
# Màu RGB (B, G, R trong OpenCV)
color = (0, 255, 0)     # Xanh lá
color = (255, 0, 0)     # Xanh dương
color = (0, 0, 255)     # Đỏ
color = (255, 255, 0)   # Cyan
color = (255, 0, 255)   # Magenta
```

### 📊 Thay đổi giới hạn logs

Trong `python_server.py`:
```python
# Giữ nhiều logs hơn trong memory
if len(current_stats["detections"]) > 100:  # Mặc định: 20
    current_stats["detections"] = current_stats["detections"][-100:]
```

### ⚡ Tăng tốc độ xử lý

```python
# Giảm quality của JPEG stream
ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 60])  # Thấp hơn = nhanh hơn

# Skip frames
if frame_count % 2 == 0:  # Chỉ xử lý mỗi frame thứ 2
    # Process frame
```

---

## 🆘 Cần trợ giúp? | Need Help?

- 📖 Đọc [README.md](README.md)
- 🐛 Báo lỗi tại [Issues](https://github.com/yourusername/edge-ai-security-dashboard/issues)
- 💬 Hỏi trong [Discussions](https://github.com/yourusername/edge-ai-security-dashboard/discussions)
- 📧 Email: your.email@example.com

---

## 🎓 Demo & Screenshots

Thêm screenshots của bạn vào thư mục `docs/images/`:
- `dashboard-screenshot.png`
- `video-feed-screenshot.png`
- `alerts-screenshot.png`

---

<div align="center">

### ⭐ Nếu hữu ích, đừng quên star repo nhé!

**Chúc bạn sử dụng vui vẻ!** 🚀

Made with ❤️ and ☕

</div>
