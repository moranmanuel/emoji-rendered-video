import { useEffect, useRef, useState } from "react";
import "./App.css"
import { closestEmoji } from "./emoji-palette";

const BLOCK_SIZE = 10;

export default function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [grid, setGrid] = useState([]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function draw() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        console.log(frame.data); // array de píxeles [R, G, B, A, R, G, B, A, ...]
      }
      requestAnimationFrame(draw);
    }

    draw();
  }, []);

  return (
    <div className="container">
      <div className="emoji-canvas">
        {/* acá va el canvas con emojis */}
      </div>
      <div className="camera-feed">
        <video ref={videoRef} autoPlay />
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
}