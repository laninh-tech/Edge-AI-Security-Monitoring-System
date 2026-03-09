"""
Edge-AI Security Dashboard - Backend Server
Real-time object detection using YOLOv8 and OpenCV

This Flask server provides:
- Video streaming with object detection overlays
- Server-Sent Events for real-time metrics
- Detection logging and management
"""

import cv2
import json
import time
import logging
from datetime import datetime
from typing import Dict, List, Generator, Any
import psutil
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from ultralytics import YOLO

# ======================================
# Configuration Constants
# ======================================
CAMERA_SOURCE = 0  # 0 for default webcam, or path to video file
YOLO_MODEL_PATH = 'yolov8n.pt'
CONFIDENCE_THRESHOLD = 0.5
ALERT_THRESHOLD = 0.7
ALERT_CLASSES = ['person', 'car', 'truck', 'motorcycle']
MAX_DETECTIONS_IN_MEMORY = 20
JPEG_QUALITY = 80
SSE_UPDATE_INTERVAL = 1.0  # seconds
FLASK_HOST = '0.0.0.0'
FLASK_PORT = 5000

# Color definitions (BGR format for OpenCV)
COLOR_PERSON = (0, 255, 0)     # Green
COLOR_VEHICLE = (0, 0, 255)    # Red
COLOR_DEFAULT = (255, 0, 0)    # Blue

# ======================================
# Logging Configuration
# ======================================
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ======================================
# Flask App Initialization
# ======================================
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend on different ports

# ======================================
# Model and Camera Initialization
# ======================================
try:
    logger.info(f"Loading YOLOv8 model from {YOLO_MODEL_PATH}...")
    model = YOLO(YOLO_MODEL_PATH)
    logger.info("✓ YOLOv8 model loaded successfully")
except Exception as e:
    logger.error(f"✗ Failed to load YOLO model: {e}")
    raise

try:
    logger.info(f"Initializing camera (source: {CAMERA_SOURCE})...")
    camera = cv2.VideoCapture(CAMERA_SOURCE)
    if not camera.isOpened():
        raise RuntimeError("Failed to open camera")
    logger.info("✓ Camera initialized successfully")
except Exception as e:
    logger.error(f"✗ Failed to initialize camera: {e}")
    raise

# ======================================
# Global State
# ======================================
current_stats: Dict[str, Any] = {
    "fps": 0.0,
    "detections": []
}

detection_id_counter = 10000



# ======================================
# Helper Functions
# ======================================

def get_next_detection_id() -> int:
    """Generate unique detection ID"""
    global detection_id_counter
    detection_id_counter += 1
    return detection_id_counter


def get_class_color(class_name: str) -> tuple:
    """
    Get color for bounding box based on object class
    
    Args:
        class_name: Name of the detected object class
        
    Returns:
        BGR color tuple
    """
    if class_name == 'person':
        return COLOR_PERSON
    elif class_name in ['car', 'truck', 'motorcycle']:
        return COLOR_VEHICLE
    return COLOR_DEFAULT


def should_trigger_alert(class_name: str, confidence: float) -> bool:
    """
    Determine if detection should trigger an alert
    
    Args:
        class_name: Name of the detected object class
        confidence: Detection confidence score (0-1)
        
    Returns:
        True if alert should be triggered
    """
    return class_name in ALERT_CLASSES and confidence > ALERT_THRESHOLD


def draw_detection_box(frame, x1: int, y1: int, x2: int, y2: int, 
                       label: str, color: tuple) -> None:
    """
    Draw bounding box and label on frame
    
    Args:
        frame: OpenCV frame
        x1, y1, x2, y2: Bounding box coordinates
        label: Text label to display
        color: BGR color tuple
    """
    # Draw bounding box
    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
    
    # Calculate label size and position
    label_size, baseline = cv2.getTextSize(
        label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 2
    )
    y1_label = max(y1, label_size[1] + 10)
    
    # Draw label background
    cv2.rectangle(
        frame,
        (x1, y1_label - label_size[1] - 10),
        (x1 + label_size[0], y1_label + baseline - 10),
        color,
        cv2.FILLED
    )
    
    # Draw label text
    cv2.putText(
        frame,
        label,
        (x1, y1_label - 10),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.5,
        (255, 255, 255),
        2
    )


def reinitialize_camera() -> bool:
    """
    Attempt to reinitialize camera connection
    
    Returns:
        True if successful, False otherwise
    """
    global camera
    try:
        logger.warning("Attempting to reinitialize camera...")
        camera.release()
        time.sleep(1)
        camera = cv2.VideoCapture(CAMERA_SOURCE)
        if camera.isOpened():
            logger.info("✓ Camera reinitialized successfully")
            return True
        return False
    except Exception as e:
        logger.error(f"✗ Camera reinitialization failed: {e}")
        return False


# ======================================
# Video Stream Generator
# ======================================

def generate_frames() -> Generator[bytes, None, None]:
    """
    Generate video frames with YOLO object detection
    
    Yields:
        MJPEG frame bytes
    """
    global current_stats
    prev_time = time.time()
    frame_count = 0
    
    logger.info("Starting video frame generation...")
    
    while True:
        success, frame = camera.read()
        
        if not success:
            logger.warning("Failed to read frame from camera")
            # Try to reset video if it's a file
            camera.set(cv2.CAP_PROP_POS_FRAMES, 0)
            success, frame = camera.read()
            
            if not success:
                # Attempt camera reinitialization
                if not reinitialize_camera():
                    time.sleep(1)
                continue
        
        frame_count += 1
        
        try:
            # Run YOLO detection
            results = model(frame, verbose=False)
            
            # Calculate FPS
            curr_time = time.time()
            time_diff = curr_time - prev_time
            fps = 1 / time_diff if time_diff > 0 else 0
            prev_time = curr_time
            current_stats["fps"] = fps
            
            # Process detections
            detections = []
            for result in results:
                boxes = result.boxes
                for box in boxes:
                    # Extract box data
                    x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())
                    conf = float(box.conf[0])
                    cls = int(box.cls[0])
                    class_name = model.names[cls]
                    
                    # Filter by confidence threshold
                    if conf < CONFIDENCE_THRESHOLD:
                        continue
                    
                    # Create detection record
                    detection = {
                        "id": get_next_detection_id(),
                        "type": class_name.capitalize(),
                        "confidence": round(conf, 2),
                        "location": "Live Camera Feed",
                        "time": datetime.now().strftime("%H:%M:%S"),
                        "alert": should_trigger_alert(class_name, conf)
                    }
                    detections.append(detection)
                    
                    # Draw on frame
                    color = get_class_color(class_name)
                    label = f"{class_name} {conf:.2f}"
                    draw_detection_box(frame, x1, y1, x2, y2, label, color)
            
            # Update detection buffer
            if detections:
                current_stats["detections"].extend(detections)
                # Keep only recent detections
                if len(current_stats["detections"]) > MAX_DETECTIONS_IN_MEMORY:
                    current_stats["detections"] = \
                        current_stats["detections"][-MAX_DETECTIONS_IN_MEMORY:]
            
            # Encode frame as JPEG
            ret, buffer = cv2.imencode(
                '.jpg',
                frame,
                [cv2.IMWRITE_JPEG_QUALITY, JPEG_QUALITY]
            )
            
            if not ret:
                logger.error("Failed to encode frame")
                continue
            
            frame_bytes = buffer.tobytes()
            
            # Yield MJPEG frame
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
                   
        except Exception as e:
            logger.error(f"Error processing frame {frame_count}: {e}")
            continue



# ======================================
# Flask Routes
# ======================================

@app.route('/video_feed')
def video_feed():
    """
    MJPEG video stream endpoint with object detection overlays
    
    Returns:
        MJPEG stream response
    """
    logger.info("Client connected to video feed")
    return Response(
        generate_frames(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )


@app.route('/api/stream')
def stream():
    """
    Server-Sent Events endpoint for real-time metrics and detections
    
    Returns:
        SSE stream response
    """
    def event_stream() -> Generator[str, None, None]:
        """Generate SSE events with system metrics and detections"""
        logger.info("Client connected to SSE stream")
        
        while True:
            try:
                # Get system metrics
                mem = psutil.virtual_memory()
                memory_usage = round(mem.used / (1024**3), 1)
                
                # Simulate GPU load (replace with actual GPU monitoring if available)
                # For real GPU monitoring, use: pynvml or GPUtil
                gpu_load = int(psutil.cpu_percent() * 0.8)  # Approximate
                
                # Get next detection if available
                new_detection = None
                if current_stats["detections"]:
                    new_detection = current_stats["detections"].pop(0)
                
                # Prepare data payload
                data = {
                    "fps": f'{current_stats["fps"]:.1f}',
                    "gpuLoad": gpu_load,
                    "memoryUsage": f'{memory_usage}',
                    "newDetection": new_detection
                }
                
                yield f"data: {json.dumps(data)}\n\n"
                time.sleep(SSE_UPDATE_INTERVAL)
                
            except GeneratorExit:
                logger.info("Client disconnected from SSE stream")
                break
            except Exception as e:
                logger.error(f"SSE Error: {e}")
                break
    
    return Response(
        event_stream(),
        content_type='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no'
        }
    )


@app.route('/api/logs', methods=['GET'])
def get_logs():
    """
    Get detection logs
    
    Returns:
        JSON array of detection logs (currently empty - implement DB if needed)
    """
    # This endpoint returns empty array as detections are sent via SSE
    # Implement database storage if persistent logs are needed
    return jsonify([])


@app.route('/api/logs', methods=['DELETE'])
def clear_logs():
    """
    Clear all detection logs
    
    Returns:
        JSON success response
    """
    global current_stats
    current_stats["detections"].clear()
    logger.info("Detection logs cleared")
    return jsonify({"success": True, "message": "Logs cleared"})


@app.route('/api/trigger', methods=['POST'])
def trigger_detection():
    """
    Manually trigger a test detection
    
    Request Body:
        type (str): Object type
        location (str): Detection location
        alert (bool): Whether to trigger alert
    
    Returns:
        JSON response with detection ID
    """
    try:
        data = request.get_json() or {}
        
        detection = {
            "id": get_next_detection_id(),
            "type": data.get('type', 'Test'),
            "confidence": round(0.85 + (0.15 * (1 if data.get('alert') else 0)), 2),
            "location": data.get('location', 'Manual Trigger'),
            "time": datetime.now().strftime("%H:%M:%S"),
            "alert": data.get('alert', False)
        }
        
        current_stats["detections"].append(detection)
        logger.info(f"Manual detection triggered: {detection['type']}")
        
        return jsonify({
            "success": True,
            "id": detection['id'],
            "detection": detection
        })
        
    except Exception as e:
        logger.error(f"Error triggering detection: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/system', methods=['GET'])
def get_system_info():
    """
    Get system information and status
    
    Returns:
        JSON with system stats
    """
    try:
        mem = psutil.virtual_memory()
        cpu_percent = psutil.cpu_percent(interval=0.1)
        
        return jsonify({
            "status": "operational",
            "model": YOLO_MODEL_PATH,
            "camera_source": CAMERA_SOURCE,
            "fps": round(current_stats["fps"], 1),
            "cpu_usage": cpu_percent,
            "memory_used_gb": round(mem.used / (1024**3), 2),
            "memory_total_gb": round(mem.total / (1024**3), 2),
            "memory_percent": mem.percent,
            "uptime_seconds": time.time() - app.config.get('START_TIME', time.time())
        })
    except Exception as e:
        logger.error(f"Error getting system info: {e}")
        return jsonify({"status": "error", "error": str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    
    Returns:
        JSON health status
    """
    return jsonify({
        "status": "healthy",
        "service": "edge-ai-security-dashboard",
        "version": "2.4.1"
    })


# ======================================
# Error Handlers
# ======================================

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {error}")
    return jsonify({"error": "Internal server error"}), 500


# ======================================
# Cleanup Handler
# ======================================

def cleanup():
    """Release resources on shutdown"""
    logger.info("Shutting down server...")
    try:
        camera.release()
        logger.info("✓ Camera released")
    except Exception as e:
        logger.error(f"Error releasing camera: {e}")


# ======================================
# Main Entry Point
# ======================================

if __name__ == '__main__':
    import atexit
    
    # Register cleanup handler
    atexit.register(cleanup)
    
    # Store start time
    app.config['START_TIME'] = time.time()
    
    logger.info("=" * 50)
    logger.info("Edge-AI Security Dashboard - Backend Server")
    logger.info("=" * 50)
    logger.info(f"Model: {YOLO_MODEL_PATH}")
    logger.info(f"Camera: {CAMERA_SOURCE}")
    logger.info(f"Confidence Threshold: {CONFIDENCE_THRESHOLD}")
    logger.info(f"Alert Threshold: {ALERT_THRESHOLD}")
    logger.info(f"Starting server on {FLASK_HOST}:{FLASK_PORT}")
    logger.info("=" * 50)
    
    try:
        app.run(
            host=FLASK_HOST,
            port=FLASK_PORT,
            threaded=True,
            debug=False
        )
    except KeyboardInterrupt:
        logger.info("\nReceived shutdown signal")
        cleanup()
    except Exception as e:
        logger.error(f"Server error: {e}")
        cleanup()
        raise
