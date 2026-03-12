import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';

const DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mergedImage, setMergedImage] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const lastX = useRef<number>(0);
  const lastY = useRef<number>(0);

  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    lastX.current = clientX - rect.left;
    lastY.current = clientY - rect.top;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault();
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const currentX = clientX - rect.left;
    const currentY = clientY - rect.top;

    ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lastX.current, lastY.current);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    lastX.current = currentX;
    lastY.current = currentY;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const mergeImageAndSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !capturedImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create new image from the captured photo
    const img = new Image();
    img.onload = () => {
      // Draw the captured photo
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Signature is already drawn on canvas
      // Convert to final merged image
      const mergedDataUrl = canvas.toDataURL('image/png');
      setMergedImage(mergedDataUrl);
    };
    img.src = capturedImage;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/list')}
          className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Back to List
        </button>

        <h1 className="text-3xl font-bold mb-8">Employee Details - ID: {id}</h1>

        {!mergedImage ? (
          <div className="space-y-8">
            {!capturedImage ? (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Capture Photo</h2>
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full rounded-lg"
                />
                <button
                  onClick={capturePhoto}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Capture Photo
                </button>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Sign over Photo</h2>
                <div className="relative">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full rounded-lg"
                  />
                  <canvas
                    ref={canvasRef}
                    width={640}
                    height={480}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="absolute top-0 left-0 w-full h-full cursor-crosshair"
                    style={{ touchAction: 'none' }}
                  />
                </div>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => {
                      const canvas = canvasRef.current;
                      const ctx = canvas?.getContext('2d');
                      if (ctx) {
                        ctx.clearRect(0, 0, canvas!.width, canvas!.height);
                      }
                    }}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                  >
                    Clear Signature
                  </button>
                  <button
                    onClick={mergeImageAndSignature}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Merge & Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Merged Image</h2>
            <img src={mergedImage} alt="Merged" className="w-full rounded-lg" />
            <button
              onClick={() => navigate('/analytics')}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              View Analytics
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsPage;
