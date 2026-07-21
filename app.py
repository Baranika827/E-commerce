"""
FastAPI backend for Virtual Try-On with InsightFace inswapper
Handles face swapping with strong, visible results
"""

from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import io
import os
from pathlib import Path
import logging
from tryon import VirtualTryOn
import uvicorn

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(title="Virtual Try-On API", version="1.0.0")

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize VirtualTryOn
try:
    tryon = VirtualTryOn(
        model_path='inswapper_128.onnx',
        device='cuda'
    )
    logger.info("✅ VirtualTryOn initialized successfully")
except Exception as e:
    logger.error(f"❌ Failed to initialize VirtualTryOn: {e}")
    tryon = None

# Create temp directory
TEMP_DIR = Path("temp_images")
TEMP_DIR.mkdir(exist_ok=True)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "Virtual Try-On API",
        "model": "InsightFace inswapper_128.onnx",
        "device": "cuda" if tryon else "not_initialized"
    }


@app.post("/api/tryon")
async def virtual_tryon(
    outfit_image: UploadFile = File(...),
    user_image: UploadFile = File(...),
    face_strength: float = Form(1.0)
):
    """
    Perform virtual try-on
    
    Args:
        outfit_image: Image with model wearing outfit
        user_image: Image with user's face
        face_strength: Face visibility (0.0-1.0)
                      1.0 = full face, no blending
                      0.5 = 50% blend
    
    Returns:
        Result image with user's face on outfit
    """
    
    if tryon is None:
        raise HTTPException(status_code=500, detail="Model not initialized")
    
    if not (0.0 <= face_strength <= 1.0):
        raise HTTPException(status_code=400, detail="face_strength must be between 0.0 and 1.0")
    
    try:
        logger.info(f"\n{'='*60}")
        logger.info(f"📥 Received virtual try-on request")
        logger.info(f"   Face strength: {face_strength}")
        logger.info(f"{'='*60}")
        
        # Read uploaded files
        outfit_bytes = await outfit_image.read()
        user_bytes = await user_image.read()
        
        # Convert to numpy arrays
        outfit_nparr = np.frombuffer(outfit_bytes, np.uint8)
        user_nparr = np.frombuffer(user_bytes, np.uint8)
        
        # Decode images
        outfit_img = cv2.imdecode(outfit_nparr, cv2.IMREAD_COLOR)
        user_img = cv2.imdecode(user_nparr, cv2.IMREAD_COLOR)
        
        if outfit_img is None or user_img is None:
            logger.error("❌ Failed to decode images")
            raise HTTPException(status_code=400, detail="Invalid image format")
        
        logger.info(f"✅ Outfit image: {outfit_img.shape}")
        logger.info(f"✅ User image: {user_img.shape}")
        
        # Perform face swap
        logger.info(f"\n🔄 Starting face swap...")
        result = tryon.swap_face(outfit_img, user_img, face_strength=face_strength)
        
        if result is None:
            logger.error("❌ Face swap failed")
            raise HTTPException(status_code=400, detail="Face swap failed - could not detect faces")
        
        logger.info(f"✅ Face swap successful: {result.shape}")
        
        # Encode result
        success, result_bytes = cv2.imencode('.jpg', result, [cv2.IMWRITE_JPEG_QUALITY, 95])
        
        if not success:
            logger.error("❌ Failed to encode result")
            raise HTTPException(status_code=500, detail="Failed to encode result image")
        
        logger.info(f"✅ Result encoded: {len(result_bytes)} bytes")
        logger.info(f"{'='*60}\n")
        
        # Return as file
        return FileResponse(
            io.BytesIO(result_bytes.tobytes()),
            media_type="image/jpeg",
            filename="tryon_result.jpg"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error during face swap: {e}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@app.post("/api/tryon/debug")
async def virtual_tryon_debug(
    outfit_image: UploadFile = File(...),
    user_image: UploadFile = File(...),
    face_strength: float = Form(1.0)
):
    """
    Virtual try-on with detailed debug information
    
    Returns:
        JSON with result image (base64) and debug logs
    """
    
    if tryon is None:
        raise HTTPException(status_code=500, detail="Model not initialized")
    
    try:
        logger.info(f"\n{'='*60}")
        logger.info(f"🔍 DEBUG MODE: Virtual try-on request")
        logger.info(f"{'='*60}")
        
        # Read uploaded files
        outfit_bytes = await outfit_image.read()
        user_bytes = await user_image.read()
        
        # Convert to numpy arrays
        outfit_nparr = np.frombuffer(outfit_bytes, np.uint8)
        user_nparr = np.frombuffer(user_bytes, np.uint8)
        
        # Decode images
        outfit_img = cv2.imdecode(outfit_nparr, cv2.IMREAD_COLOR)
        user_img = cv2.imdecode(user_nparr, cv2.IMREAD_COLOR)
        
        if outfit_img is None or user_img is None:
            raise HTTPException(status_code=400, detail="Invalid image format")
        
        # Perform face swap
        result = tryon.swap_face(outfit_img, user_img, face_strength=face_strength)
        
        if result is None:
            raise HTTPException(status_code=400, detail="Face swap failed")
        
        # Encode result to base64
        success, result_bytes = cv2.imencode('.jpg', result, [cv2.IMWRITE_JPEG_QUALITY, 95])
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to encode result")
        
        import base64
        result_base64 = base64.b64encode(result_bytes.tobytes()).decode('utf-8')
        
        return JSONResponse({
            "status": "success",
            "message": "Face swap completed",
            "result_image": f"data:image/jpeg;base64,{result_base64}",
            "result_shape": result.shape,
            "face_strength": face_strength
        })
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Virtual Try-On API",
        "version": "1.0.0",
        "model": "InsightFace inswapper_128.onnx",
        "endpoints": {
            "health": "/health",
            "tryon": "/api/tryon (POST)",
            "tryon_debug": "/api/tryon/debug (POST)"
        },
        "usage": {
            "endpoint": "/api/tryon",
            "method": "POST",
            "parameters": {
                "outfit_image": "Image file with model wearing outfit",
                "user_image": "Image file with user's face",
                "face_strength": "Float 0.0-1.0 (default: 1.0 = full face visibility)"
            }
        }
    }


if __name__ == "__main__":
    logger.info("\n" + "="*60)
    logger.info("🚀 Starting Virtual Try-On API Server")
    logger.info("="*60)
    logger.info("📍 Server: http://localhost:8000")
    logger.info("📚 Docs: http://localhost:8000/docs")
    logger.info("="*60 + "\n")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
