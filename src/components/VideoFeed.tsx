"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import {
  FaceDetector,
  FilesetResolver,
  Detection,
} from "@mediapipe/tasks-vision";
import { Button } from "@mui/material";
import { BOUNDING_BOX_DIMS } from "@/constants/constants";
import { bestDetection } from "@/utils/face-detection-utils";

const VideoFeed = ({
  onCapture,
  btnLabel,
  detectMultipleFaces = false,
}: any) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [faceDetector, setFaceDetector] = useState<FaceDetector | null>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isFaceDetected, setIsFaceDetected] = useState<boolean>(false);
  const [faceBox, setFaceBox] = useState<any>({
    x: null,
    y: null,
    width: null,
    height: null,
  });

  const handleCapture = async () => {
    /* 
    TODO:
        0. If confidence < threshhold, ask user to adjust face.
          0.a. Add a listener with an animation (blinking borders), maybe?
        1. Freeze capture frame
        2. Confirm if user wants to register themselves
        3. API call to BE for storage.
  */
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    // TODO: figure out how to add extra image space on all sides (15%)
    const image_coords = {
      x: Math.min(faceBox.x, canvas.width - faceBox.width),
      y: Math.min(faceBox.y, canvas.height - faceBox.height),
      width: faceBox.width,
      height: faceBox.height,
    };

    const image_coords_padding = {
      x: image_coords.x - 0.15 * image_coords.width,
      y: image_coords.y - 0.25 * image_coords.height,
      width: image_coords.width * 1.3,
      height: image_coords.height * 1.3,
    };

    ctx?.clearRect(0, 0, canvas.width, canvas.height);

    canvas.width = BOUNDING_BOX_DIMS.width;
    canvas.height = BOUNDING_BOX_DIMS.height;

    ctx?.drawImage(
      video,
      image_coords_padding.x,
      image_coords_padding.y,
      image_coords_padding.width,
      image_coords_padding.height,
      0,
      0,
      BOUNDING_BOX_DIMS.width,
      BOUNDING_BOX_DIMS.height
    );

    const image = canvas.toDataURL("image/jpeg");
    // console.log(image);

    if (onCapture) {
      await onCapture(image);
    }
  };

  useEffect(() => {
    const initializeFaceDetector = async () => {
      const vision = await FilesetResolver.forVisionTasks("/models/wasm");
      const detector = await FaceDetector.createFromOptions(vision, {
        minDetectionConfidence: 0.9,
        baseOptions: {
          modelAssetPath: `/models/blaze_face_short_range.tflite`,
          delegate: "CPU",
        },
        runningMode: "VIDEO",
      });
      setFaceDetector(detector);
      if (!canvasRef.current) return;
      setCtx(canvasRef.current.getContext("2d"));
    };

    initializeFaceDetector();

    // Cleanup function to stop the video stream when the component unmounts - TODO: not working!
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    enableWebcam();
  }, [faceDetector]);

  const enableWebcam = async () => {
    if (!faceDetector) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener("loadeddata", predictWebcam);
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const predictWebcam = async () => {
    if (!faceDetector || !videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const startTimeMs = performance.now();
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const detections = faceDetector.detectForVideo(video, startTimeMs);
    displayVideoDetections(detections.detections);

    window.requestAnimationFrame(predictWebcam);
  };

  const displayVideoDetections = (detections: Detection[]) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas || !video || !ctx) return;
    if (detections.length === 0) {
      setIsFaceDetected(false);
      return;
    }
    setIsFaceDetected(true);

    // TODO: Liveness detection will come here

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (detectMultipleFaces) {
      const newBoxes = detections.map((detection) => {
        if (detection.boundingBox) {
          const { originX, originY, width, height } = detection.boundingBox;
          return { x: originX, y: originY, width, height };
        }
      });

      newBoxes.forEach((box, i) => {
        if (box) {
          ctx.strokeStyle = "#FF0000";
          ctx.lineWidth = 2;
          ctx.strokeRect(box.x, box.y, box.width, box.height);

          const confidence = (
            detections[i]?.categories[0]?.score * 100
          ).toFixed(2);
          ctx.fillStyle = "#F16B5E";
          ctx.font = "14px Arial";
          ctx.fillText(
            `Confidence: ${confidence}%`,
            box.x,
            box.y > 20 ? box.y - 10 : box.y + 20
          );
        }
      });
    } else {
      const focusedBox = bestDetection(detections);

      if (focusedBox.boundingBox) {
        const box = {
          x: focusedBox.boundingBox.originX,
          y: focusedBox.boundingBox.originY,
          width: focusedBox.boundingBox.width,
          height: focusedBox.boundingBox.height,
        };

        setFaceBox(box);

        ctx.strokeStyle = "#00FF00";
        ctx.lineWidth = 2;
        ctx.strokeRect(
          focusedBox.boundingBox.originX,
          focusedBox.boundingBox.originY,
          focusedBox.boundingBox.width,
          focusedBox.boundingBox.height
        );

        const confidence = (focusedBox?.categories[0]?.score * 100).toFixed(2);
        ctx.fillStyle = "#00FF00";
        ctx.font = "bold 14px Arial ";
        ctx.fillText(
          `Confidence: ${confidence}%`,
          focusedBox.boundingBox.originX,
          focusedBox.boundingBox.originY > 20
            ? focusedBox.boundingBox.originY - 10
            : focusedBox.boundingBox.originY + 20
        );
      }
    }
  };

  return (
    <>
      <Box>
        <video ref={videoRef} autoPlay style={{ display: "none" }} />
        <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
      </Box>
      <Button
        variant="contained"
        color="primary"
        disabled={!isFaceDetected}
        onClick={() => handleCapture()}
        fullWidth
        sx={{ mt: 2 }}
      >
        {isFaceDetected ? btnLabel : "Detecting Face..."}
      </Button>
    </>
  );
};

export default VideoFeed;
