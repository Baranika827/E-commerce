import Replicate from 'replicate';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { faceImage, outfitImage } = req.body;

    if (!faceImage || !outfitImage) {
      return res.status(400).json({ error: 'Missing required images' });
    }

    // Initialize Replicate
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN || '',
    });

    console.log('🚀 Starting AI generation...');

    // Use InstantID model for face swapping with outfit preservation
    const output = await replicate.run(
      "zsxkib/instant-id:d3e7f9e7e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8",
      {
        input: {
          image: outfitImage,
          face_image: faceImage,
          prompt: "high quality photo, professional lighting, detailed face, natural skin texture",
          negative_prompt: "blurry, distorted, low quality, cartoon, anime, painting, illustration",
          num_inference_steps: 30,
          guidance_scale: 7.5,
          seed: Math.floor(Math.random() * 1000000),
        }
      }
    );

    console.log('✅ Generation complete');

    return res.status(200).json({
      success: true,
      image: output,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('❌ Generation error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Generation failed',
    });
  }
}
