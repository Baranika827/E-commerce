import cv2
import numpy as np
import logging
from insightface.app import FaceAnalysis
from insightface.model_zoo import get_model

# ------------------------------------------------------------
# Logging Setup
# ------------------------------------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ------------------------------------------------------------
# Virtual Try-On Class
# ------------------------------------------------------------
class VirtualTryOn:

    def __init__(self, model_path="models/inswapper_128.onnx", device="cpu"):
        """
        Initialize Virtual Try-On using InsightFace official swapper

        Args:
            model_path: Path to inswapper_128.onnx
            device: "cpu" or "cuda"
        """

        logger.info("🚀 Initializing Virtual Try-On...")

        # Face Detection Model
        self.face_app = FaceAnalysis(
            name="buffalo_l",
            providers=["CPUExecutionProvider"] if device == "cpu"
            else ["CUDAExecutionProvider", "CPUExecutionProvider"]
        )

        self.face_app.prepare(ctx_id=0 if device == "cuda" else -1)

        # ✅ Correct Swapper Loader
        self.swapper = get_model(model_path, download=False)

        logger.info("✅ Face Detector Loaded (buffalo_l)")
        logger.info("✅ Face Swapper Loaded (inswapper_128)")
        logger.info("🎉 VirtualTryOn Ready!")


    # ------------------------------------------------------------
    # Main Swap Function
    # ------------------------------------------------------------
    def swap_face(self, outfit_img, user_img):
        """
        Swap user's face onto outfit model image

        Args:
            outfit_img: Outfit model photo (BGR)
            user_img: Customer selfie (BGR)

        Returns:
            result_img: Output swapped image
        """

        logger.info("=" * 60)
        logger.info("🔄 Starting Try-On Face Swap...")
        logger.info("=" * 60)

        # Detect Faces
        outfit_faces = self.face_app.get(outfit_img)
        user_faces = self.face_app.get(user_img)

        logger.info(f"Outfit Faces Detected: {len(outfit_faces)}")
        logger.info(f"User Faces Detected: {len(user_faces)}")

        if len(outfit_faces) == 0:
            logger.error("❌ No face detected in outfit image!")
            return None

        if len(user_faces) == 0:
            logger.error("❌ No face detected in user image!")
            return None

        # Use first detected face
        outfit_face = outfit_faces[0]
        user_face = user_faces[0]

        logger.info("✅ Face Detected Successfully")
        logger.info(f"Outfit Face bbox: {outfit_face.bbox}")
        logger.info(f"User Face bbox: {user_face.bbox}")

        # ------------------------------------------------------------
        # ✅ Correct Face Swap
        # ------------------------------------------------------------
        logger.info("🎭 Swapping face now...")

        result_img = self.swapper.get(
            outfit_img,
            outfit_face,
            user_face,
            paste_back=True
        )

        logger.info("✅ Face Swap Done!")

        return result_img


    # ------------------------------------------------------------
    # Full Pipeline (Load → Swap → Save)
    # ------------------------------------------------------------
    def process(self, outfit_path, user_path, output_path):
        """
        Complete pipeline

        Args:
            outfit_path: Model outfit image
            user_path: Customer selfie
            output_path: Save result
        """

        logger.info("\n📂 Loading Images...")

        outfit_img = cv2.imread(outfit_path)
        user_img = cv2.imread(user_path)

        if outfit_img is None:
            logger.error("❌ Outfit image not found!")
            return False

        if user_img is None:
            logger.error("❌ User image not found!")
            return False

        logger.info(f"✅ Outfit Image Shape: {outfit_img.shape}")
        logger.info(f"✅ User Image Shape: {user_img.shape}")

        # Swap Face
        result = self.swap_face(outfit_img, user_img)

        if result is None:
            logger.error("❌ Face Swap Failed!")
            return False

        # Save Output
        cv2.imwrite(output_path, result)
        logger.info(f"💾 Saved Output: {output_path}")

        return True


# ------------------------------------------------------------
# Testing
# ------------------------------------------------------------
if __name__ == "__main__":

    tryon = VirtualTryOn(
        model_path="models/inswapper_128.onnx",
        device="cpu"   # change to "cuda" if GPU works
    )

    success = tryon.process(
        outfit_path="outfit.jpg",
        user_path="user.jpg",
        output_path="result.jpg"
    )

    if success:
        print("\n🎉 Try-On Completed Successfully!")
    else:
        print("\n❌ Try-On Failed!")
