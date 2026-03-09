# 📐 Architecture Documentation

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Edge-AI Security Dashboard               │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│   Frontend (React)   │◄───────►│  Backend (Flask)     │
│   Port: 5173         │   HTTP  │  Port: 5000          │
│                      │   SSE   │                      │
│  - React 19          │         │  - YOLOv8 Model      │
│  - TypeScript        │         │  - OpenCV Processing │
│  - TailwindCSS       │         │  - Video Streaming   │
│  - Recharts          │         │  - Detection API     │
└──────────────────────┘         └──────────────────────┘
         ▲                                  ▲
         │                                  │
         │                                  │
         ▼                                  ▼
┌──────────────────────┐         ┌──────────────────────┐
│   Browser Client     │         │    Camera/Video      │
│   (User Interface)   │         │    Input Source      │
└──────────────────────┘         └──────────────────────┘
```

---

## 📦 Component Architecture

### Frontend Architecture

```
src/
├── App.tsx                    # Main application component
│   ├── State Management       # React useState hooks
│   ├── API Functions          # Fetch calls to backend
│   ├── SSE Connection         # Real-time data stream
│   └── UI Components          # Dashboard UI elements
│
├── main.tsx                   # React entry point
└── index.css                  # Global styles
```

#### Key Frontend Components:

1. **Dashboard View**
   - Live video feed display
   - Performance metrics (FPS, GPU, Memory)
   - Real-time charts
   - Detection logs

2. **Sidebar Navigation**
   - Multiple view modes
   - System status indicators
   - Demo controls

3. **Metric Cards**
   - KPI displays
   - Icon indicators
   - Real-time updates

### Backend Architecture

```
python_server.py
├── Configuration              # Constants and settings
├── Model Loading              # YOLOv8 initialization
├── Camera Initialization      # OpenCV VideoCapture
├── Video Frame Generator      # MJPEG stream
├── Detection Processing       # Object detection logic
└── Flask Routes               # REST API endpoints
```

#### Key Backend Components:

1. **Video Processing Pipeline**
   ```
   Camera Input → Frame Capture → YOLO Detection → 
   Draw Bounding Boxes → Encode JPEG → Stream to Client
   ```

2. **Detection Flow**
   ```
   YOLO Model → Bounding Boxes → Confidence Filter → 
   Alert Check → Detection Log → Send via SSE
   ```

3. **API Endpoints**
   - `/video_feed` - MJPEG stream
   - `/api/stream` - SSE for real-time data
   - `/api/logs` - Detection logs
   - `/api/trigger` - Manual detection trigger
   - `/api/system` - System information
   - `/api/health` - Health check

---

## 🔄 Data Flow

### 1. Video Stream Flow

```
┌─────────────┐
│   Camera    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ OpenCV Capture  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ YOLOv8 Detection│
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Draw Overlays  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  JPEG Encoding  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  MJPEG Stream   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Browser Display │
└─────────────────┘
```

### 2. Real-time Data Flow (SSE)

```
┌──────────────────┐
│  Backend Loop    │ (Every 1 second)
└────────┬─────────┘
         │
         ├──► Get FPS
         ├──► Get System Metrics
         ├──► Pop Detection Log
         │
         ▼
┌──────────────────┐
│   JSON Payload   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   SSE Channel    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Frontend Update │
│  - Charts        │
│  - Metrics       │
│  - Logs          │
└──────────────────┘
```

---

## 🎯 Detection Algorithm

### YOLOv8 Object Detection Pipeline

```python
# 1. Frame Acquisition
frame = camera.read()

# 2. YOLO Inference
results = model(frame, verbose=False)

# 3. Process Each Detection
for box in results.boxes:
    # Extract coordinates
    x1, y1, x2, y2 = box.xyxy[0]
    
    # Get confidence and class
    confidence = box.conf[0]
    class_id = box.cls[0]
    class_name = model.names[class_id]
    
    # Filter by threshold
    if confidence > THRESHOLD:
        # Create detection record
        detection = {
            "type": class_name,
            "confidence": confidence,
            "bbox": [x1, y1, x2, y2],
            "alert": should_alert(class_name, confidence)
        }
        
        # Draw visualization
        draw_box(frame, detection)
```

### Alert Logic

```python
def should_trigger_alert(class_name, confidence):
    """
    Alerts are triggered when:
    1. Object is in ALERT_CLASSES (person, car, truck, motorcycle)
    2. Confidence > ALERT_THRESHOLD (0.7)
    """
    return (
        class_name in ALERT_CLASSES and 
        confidence > ALERT_THRESHOLD
    )
```

---

## 🔧 Configuration System

### Python Backend Configuration

```python
# python_server.py
CAMERA_SOURCE = 0              # Webcam index or video path
YOLO_MODEL_PATH = 'yolov8n.pt' # Model file
CONFIDENCE_THRESHOLD = 0.5     # Minimum detection confidence
ALERT_THRESHOLD = 0.7          # Alert trigger confidence
ALERT_CLASSES = [...]          # Classes that trigger alerts
MAX_DETECTIONS = 20            # Detection buffer size
JPEG_QUALITY = 80              # Stream quality
```

### Frontend Configuration

```typescript
// App.tsx
const API_BASE_URL = 'http://localhost:5000';
const SSE_ENDPOINT = `${API_BASE_URL}/api/stream`;
const VIDEO_FEED_URL = `${API_BASE_URL}/video_feed`;
const MAX_LOGS = 50;
```

---

## 📊 State Management

### Frontend State

```typescript
interface AppState {
  // Performance data for charts
  perfData: PerformanceData[];
  
  // Current active view
  activeTab: string;
  
  // Detection logs
  logs: DetectionLog[];
  
  // System metrics
  systemStats: {
    fps: string;
    gpuLoad: number;
    memoryUsage: string;
  };
}
```

### Backend State

```python
current_stats = {
    "fps": float,              # Current FPS
    "detections": [            # Detection buffer
        {
            "id": int,
            "type": str,
            "confidence": float,
            "location": str,
            "time": str,
            "alert": bool
        }
    ]
}
```

---

## 🚀 Performance Optimization

### Backend Optimizations

1. **Model Choice**
   - YOLOv8n (Nano) for speed
   - Can upgrade to larger models for accuracy

2. **Frame Processing**
   - Configurable JPEG quality
   - Efficient numpy operations
   - Reuse NumPy arrays when possible

3. **Streaming**
   - MJPEG for low latency
   - Threaded Flask server
   - Efficient image encoding

### Frontend Optimizations

1. **React Rendering**
   - useEffect for side effects
   - Memoization where needed
   - Efficient state updates

2. **Chart Updates**
   - Sliding window (last 20 data points)
   - Disable animations for real-time charts
   - Efficient data structure

3. **Network**
   - SSE for efficient real-time updates
   - Single video stream connection
   - Minimal API calls

---

## 🔐 Security Architecture

### Authentication (Not Implemented - Future)

```
┌──────────────┐
│    Client    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Auth Proxy  │ (Future: JWT/OAuth)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Backend    │
└──────────────┘
```

### Current Security Measures

1. **CORS Policy**
   - Configured for local development
   - Should be restricted in production

2. **Input Validation**
   - API endpoints validate input
   - Type checking on frontend

3. **Error Handling**
   - No sensitive info in error messages
   - Logging for debugging

---

## 📈 Scalability Considerations

### Current Limitations

- Single camera support
- In-memory detection logs
- No persistent storage
- Single-threaded detection

### Future Scalability

```
┌─────────────────┐
│  Load Balancer  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│ Node 1 │ │ Node 2 │  (Multiple detection nodes)
└───┬────┘ └───┬────┘
    │          │
    └────┬─────┘
         ▼
┌─────────────────┐
│    Database     │  (Persistent storage)
└─────────────────┘
```

---

## 🛠️ Development Workflow

### Setup

```bash
# 1. Install dependencies
npm install
pip install -r requirements.txt

# 2. Configure environment
cp .env.example .env.local

# 3. Start development servers
python python_server.py  # Terminal 1
npm run dev              # Terminal 2
```

### Build & Deploy

```bash
# Build frontend
npm run build

# Test production build
npm run preview

# Deploy
# - Frontend: dist/ → Static hosting
# - Backend: python_server.py → Cloud platform
```

---

## 🐛 Debugging

### Frontend Debugging

```javascript
// Enable React DevTools
// Check console for SSE connection status
console.log('SSE connected:', eventSource.readyState);

// Monitor state updates
useEffect(() => {
  console.log('Logs updated:', logs);
}, [logs]);
```

### Backend Debugging

```python
# Enable debug logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Monitor frame processing
logger.debug(f"Processed frame {frame_count}, FPS: {fps}")

# Check detection results
logger.info(f"Detections: {len(detections)}")
```

---

## 📚 Technology Stack Details

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.0 | UI Framework |
| TypeScript | 5.8 | Type Safety |
| Vite | 6.2 | Build Tool |
| TailwindCSS | 4.1 | Styling |
| Recharts | 3.7 | Charts |
| Lucide React | 0.546 | Icons |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.8+ | Core Language |
| Flask | 3.x | Web Framework |
| YOLOv8 | Latest | Object Detection |
| OpenCV | Latest | Video Processing |
| psutil | Latest | System Monitoring |

---

<div align="center">

**For more information, see [README.md](README.md)**

</div>
