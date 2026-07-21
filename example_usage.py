"""
Complete working example of Virtual Try-On with InsightFace
Shows how to use the fixed tryon.py with strong face visibility
"""

import cv2
import numpy as np
from tryon import VirtualTryOn
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def example_1_basic_usage():
    """
    Example 1: Basic usage with default settings
    Face will be 100% visible with no blending
    """
    logger.info("\n" + "="*60)
    logger.info("EXAMPLE 1: Basic Usage (100% Face Visibility)")
    logger.info("="*60)
    
    # Initialize
    tryon = VirtualTryOn(
        model_path='inswapper_128.onnx',
        device='cuda'
    )
    
    # Load images
    outfit_img = cv2.imread('outfit.jpg')
    user_img = cv2.imread('user_face.jpg')
    
    # Swap faces with default settings (face_strength=1.0)
    result = tryon.swap_face(
        outfit_image=outfit_img,
        user_image=user_img,
        face_strength=1.0  # 100% user face, no blending
    )
    
    # Save result
    if result is not None:
        cv2.imwrite('result_example1.jpg', result)
        logger.info("✅ Result saved: result_example1.jpg")
    else:
        logger.error("❌ Face swap failed")


def example_2_with_blending():
    """
    Example 2: With controlled alpha blending
    Face will be blended with outfit for more natural look
    """
    logger.info("\n" + "="*60)
    logger.info("EXAMPLE 2: With Controlled Blending")
    logger.info("="*60)
    
    tryon = VirtualTryOn(
        model_path='inswapper_128.onnx',
        device='cuda'
    )
    
    outfit_img = cv2.imread('outfit.jpg')
    user_img = cv2.imread('user_face.jpg')
    
    # Swap with 80% user face, 20% blend
    result = tryon.swap_face(
        outfit_image=outfit_img,
        user_image=user_img,
        face_strength=0.8  # 80% user face, 20% blend
    )
    
    if result is not None:
        cv2.imwrite('result_example2_blend80.jpg', result)
        logger.info("✅ Result saved: result_example2_blend80.jpg")


def example_3_multiple_strengths():
    """
    Example 3: Compare different face strength values
    Creates multiple results with different blending levels
    """
    logger.info("\n" + "="*60)
    logger.info("EXAMPLE 3: Multiple Face Strength Values")
    logger.info("="*60)
    
    tryon = VirtualTryOn(
        model_path='inswapper_128.onnx',
        device='cuda'
    )
    
    outfit_img = cv2.imread('outfit.jpg')
    user_img = cv2.imread('user_face.jpg')
    
    # Test different strengths
    strengths = [1.0, 0.9, 0.8, 0.7, 0.5]
    
    for strength in strengths:
        logger.info(f"\n🔄 Processing with face_strength={strength}")
        
        result = tryon.swap_face(
            outfit_image=outfit_img,
            user_image=user_img,
            face_strength=strength
        )
        
        if result is not None:
            filename = f'result_strength_{strength}.jpg'
            cv2.imwrite(filename, result)
            logger.info(f"✅ Saved: {filename}")
        else:
            logger.error(f"❌ Failed for strength={strength}")


def example_4_batch_processing():
    """
    Example 4: Batch process multiple user images with same outfit
    """
    logger.info("\n" + "="*60)
    logger.info("EXAMPLE 4: Batch Processing")
    logger.info("="*60)
    
    tryon = VirtualTryOn(
        model_path='inswapper_128.onnx',
        device='cuda'
    )
    
    # Load outfit once
    outfit_img = cv2.imread('outfit.jpg')
    
    # Process multiple users
    user_images = ['user1.jpg', 'user2.jpg', 'user3.jpg']
    
    for i, user_path in enumerate(user_images):
        logger.info(f"\n🔄 Processing user {i+1}: {user_path}")
        
        user_img = cv2.imread(user_path)
        
        if user_img is None:
            logger.warning(f"⚠️ Could not load {user_path}")
            continue
        
        result = tryon.swap_face(
            outfit_image=outfit_img,
            user_image=user_img,
            face_strength=1.0
        )
        
        if result is not None:
            filename = f'result_user{i+1}.jpg'
            cv2.imwrite(filename, result)
            logger.info(f"✅ Saved: {filename}")


def example_5_complete_pipeline():
    """
    Example 5: Complete pipeline with file I/O
    """
    logger.info("\n" + "="*60)
    logger.info("EXAMPLE 5: Complete Pipeline")
    logger.info("="*60)
    
    tryon = VirtualTryOn(
        model_path='inswapper_128.onnx',
        device='cuda'
    )
    
    # Use the process method for complete pipeline
    success = tryon.process(
        outfit_path='outfit.jpg',
        user_path='user_face.jpg',
        output_path='result_final.jpg',
        face_strength=1.0
    )
    
    if success:
        logger.info("✅ Complete pipeline successful!")
    else:
        logger.error("❌ Pipeline failed")


def example_6_debug_mode():
    """
    Example 6: Debug mode with detailed logging
    """
    logger.info("\n" + "="*60)
    logger.info("EXAMPLE 6: Debug Mode")
    logger.info("="*60)
    
    # Enable debug logging
    logging.getLogger('tryon').setLevel(logging.DEBUG)
    
    tryon = VirtualTryOn(
        model_path='inswapper_128.onnx',
        device='cuda'
    )
    
    outfit_img = cv2.imread('outfit.jpg')
    user_img = cv2.imread('user_face.jpg')
    
    logger.info("🔍 Running with detailed debug output...")
    
    result = tryon.swap_face(
        outfit_image=outfit_img,
        user_image=user_img,
        face_strength=1.0
    )
    
    if result is not None:
        cv2.imwrite('result_debug.jpg', result)
        logger.info("✅ Debug result saved")


def example_7_error_handling():
    """
    Example 7: Proper error handling
    """
    logger.info("\n" + "="*60)
    logger.info("EXAMPLE 7: Error Handling")
    logger.info("="*60)
    
    try:
        tryon = VirtualTryOn(
            model_path='inswapper_128.onnx',
            device='cuda'
        )
        
        # Try to load non-existent files
        outfit_img = cv2.imread('nonexistent_outfit.jpg')
        user_img = cv2.imread('nonexistent_user.jpg')
        
        if outfit_img is None:
            logger.error("❌ Could not load outfit image")
            return
        
        if user_img is None:
            logger.error("❌ Could not load user image")
            return
        
        result = tryon.swap_face(outfit_img, user_img, face_strength=1.0)
        
        if result is None:
            logger.error("❌ Face swap failed - check if faces are detected")
            return
        
        cv2.imwrite('result_error_handled.jpg', result)
        logger.info("✅ Success with error handling")
        
    except Exception as e:
        logger.error(f"❌ Exception caught: {e}")


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    logger.info("\n" + "="*60)
    logger.info("🎬 Virtual Try-On Examples")
    logger.info("="*60)
    
    # Run examples
    # Uncomment the ones you want to run
    
    # example_1_basic_usage()
    # example_2_with_blending()
    # example_3_multiple_strengths()
    # example_4_batch_processing()
    # example_5_complete_pipeline()
    # example_6_debug_mode()
    # example_7_error_handling()
    
    # Or run all
    print("\nChoose an example to run:")
    print("1. Basic usage (100% face visibility)")
    print("2. With controlled blending")
    print("3. Multiple face strength values")
    print("4. Batch processing")
    print("5. Complete pipeline")
    print("6. Debug mode")
    print("7. Error handling")
    
    choice = input("\nEnter choice (1-7): ").strip()
    
    examples = {
        '1': example_1_basic_usage,
        '2': example_2_with_blending,
        '3': example_3_multiple_strengths,
        '4': example_4_batch_processing,
        '5': example_5_complete_pipeline,
        '6': example_6_debug_mode,
        '7': example_7_error_handling,
    }
    
    if choice in examples:
        examples[choice]()
    else:
        logger.error("❌ Invalid choice")
    
    logger.info("\n" + "="*60)
    logger.info("✅ Examples completed")
    logger.info("="*60 + "\n")
