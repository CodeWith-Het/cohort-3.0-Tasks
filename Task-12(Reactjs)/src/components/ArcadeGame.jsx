import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import Header from "./Header";
import HUD from "./HUD";
import GameOver from "./GameOver";
import Instructions from "./Instructions";


const ArcadeGame = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const animationRef = useRef(null);
    const landmarkerRef = useRef(null);

    // States
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [shots, setShots] = useState(0);
    const [status, setStatus] = useState("Initializing camera...");
    const [mode, setMode] = useState({ text: "No Hand", type: "none" });
    const [isGameOver, setIsGameOver] = useState(false);
    const [flash, setFlash] = useState(false);
    const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
    const [isHit, setIsHit] = useState(false);

    // Mutable Game State (for 60fps loop performance)
    const gameData = useRef({
        active: true, score: 0, lives: 5, shots: 0,
        targetX: 50, targetY: 50, targetHit: false,
        lastHandState: "none", canShoot: true,
        crosshair: { x: 0, y: 0, init: false }
    });

    const SMOOTHING_ALPHA = 0.25;

    const moveTargetRandomly = () => {
        const newX = 10 + Math.random() * 80;
        const newY = 15 + Math.random() * 70;
        setTargetPos({ x: newX, y: newY });
        setIsHit(false);
        gameData.current.targetX = newX;
        gameData.current.targetY = newY;
        gameData.current.targetHit = false;
    };

    const handleMiss = () => {
        gameData.current.lives -= 1;
        setLives(gameData.current.lives);
        if (gameData.current.lives <= 0) {
            gameData.current.active = false;
            setIsGameOver(true);
            setStatus("Game Over!");
        } else {
            moveTargetRandomly();
        }
    };

    const restartGame = () => {
        gameData.current = {
            ...gameData.current,
            active: true, score: 0, lives: 5, shots: 0, targetHit: false, canShoot: true,
            crosshair: { x: 0, y: 0, init: false }
        };
        setScore(0); setLives(5); setShots(0);
        setIsGameOver(false);
        moveTargetRandomly();
    };

    useEffect(() => {
        let lastVideoTime = -1;

        const setupGame = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadeddata = () => {
                        canvasRef.current.width = videoRef.current.videoWidth;
                        canvasRef.current.height = videoRef.current.videoHeight;
                        if (containerRef.current) {
                            containerRef.current.style.aspectRatio = `${videoRef.current.videoWidth} / ${videoRef.current.videoHeight}`;
                        }
                    };
                }

                setStatus("Loading hand model...");
                const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
                landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
                        delegate: "CPU"
                    },
                    runningMode: "VIDEO",
                    numHands: 1
                });
                setStatus("Hand tracker ready. Show one hand.");
                predictWebcam();
            } catch (err) {
                setStatus("Camera error. Please allow permissions.");
            }
        };

        const detectHandState = (landmarks) => {
            const wrist = landmarks[0];
            let extendedCount = 0;
            const tips = [8, 12, 16, 20];
            const pips = [6, 10, 14, 18];
      
            for (let i = 0; i < 4; i++) {
                const tipDist = Math.hypot(landmarks[tips[i]].x - wrist.x, landmarks[tips[i]].y - wrist.y);
                const pipDist = Math.hypot(landmarks[pips[i]].x - wrist.x, landmarks[pips[i]].y - wrist.y);
                if (tipDist > pipDist) extendedCount++;
            }
            return extendedCount >= 3 ? "open" : "fist";
        };

        const drawCrosshair = (ctx, x, y, type) => {
            const color = type === "open" ? "#BFFF00" : "#ff3b3b";
            ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 4;
      
            ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x - 36, y); ctx.lineTo(x + 36, y);
            ctx.moveTo(x, y - 36); ctx.lineTo(x, y + 36);
            ctx.stroke();
            ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
        };

        const predictWebcam = () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (!video || !canvas || !landmarkerRef.current) return;
            const ctx = canvas.getContext('2d');

            if (video.currentTime !== lastVideoTime && video.readyState >= 2) {
                lastVideoTime = video.currentTime;
                const results = landmarkerRef.current.detectForVideo(video, performance.now());

                ctx.clearRect(0, 0, canvas.width, canvas.height);
        
                ctx.save();
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                ctx.restore();

                if (results.landmarks && results.landmarks.length > 0) {
                    const landmarks = results.landmarks[0];
          
                    ctx.strokeStyle = "rgba(191,255,0,0.4)"; ctx.lineWidth = 2; ctx.fillStyle = "#BFFF00";
                    const conns = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [0, 9], [9, 10], [10, 11], [11, 12], [0, 13], [13, 14], [14, 15], [15, 16], [0, 17], [17, 18], [18, 19], [19, 20], [5, 9], [9, 13], [13, 17]];
                    for (let [a, b] of conns) {
                        ctx.beginPath();
                        ctx.moveTo((1 - landmarks[a].x) * canvas.width, landmarks[a].y * canvas.height);
                        ctx.lineTo((1 - landmarks[b].x) * canvas.width, landmarks[b].y * canvas.height);
                        ctx.stroke();
                    }

                    const hState = detectHandState(landmarks);
          
                    if (gameData.current.lastHandState !== hState) {
                        setMode({ text: hState === 'open' ? '🎯 AIM (Open Palm)' : '💥 SHOOT (Fist)', type: hState });
                    }

                    // Palm Center Logic
                    const palmCenterX = (landmarks[0].x + landmarks[9].x) / 2;
                    const palmCenterY = (landmarks[0].y + landmarks[9].y) / 2;
                    const rawX = (1 - palmCenterX) * canvas.width;
                    const rawY = palmCenterY * canvas.height;

                    let ch = gameData.current.crosshair;
                    if (!ch.init) {
                        ch.x = rawX; ch.y = rawY; ch.init = true;
                    } else {
                        ch.x += (rawX - ch.x) * SMOOTHING_ALPHA;
                        ch.y += (rawY - ch.y) * SMOOTHING_ALPHA;
                    }

                    drawCrosshair(ctx, ch.x, ch.y, hState);

                    if (gameData.current.active && hState === "fist" && gameData.current.lastHandState === "open" && gameData.current.canShoot) {
                        gameData.current.shots += 1;
                        setShots(gameData.current.shots);
                        gameData.current.canShoot = false;
            
                        setFlash(true);
                        setTimeout(() => setFlash(false), 100);

                        const rect = containerRef.current.getBoundingClientRect();
                        const domChX = (ch.x / canvas.width) * rect.width;
                        const domChY = (ch.y / canvas.height) * rect.height;
                        const domTx = (gameData.current.targetX / 100) * rect.width;
                        const domTy = (gameData.current.targetY / 100) * rect.height;

                        const dist = Math.sqrt((domChX - domTx) ** 2 + (domChY - domTy) ** 2);
            
                        if (dist <= 60 && !gameData.current.targetHit) {
                            gameData.current.targetHit = true;
                            gameData.current.score += 1;
                            setScore(gameData.current.score);
                            setIsHit(true);
              
                            setTimeout(() => { moveTargetRandomly(); }, 400);
                        } else if (dist > 60) {
                            handleMiss();
                        }
                    }

                    if (hState === "open") gameData.current.canShoot = true;
                    gameData.current.lastHandState = hState;

                } else {
                    if (gameData.current.lastHandState !== 'none') {
                        setMode({ text: 'No Hand', type: 'none' });
                        gameData.current.crosshair.init = false;
                        gameData.current.lastHandState = 'none';
                    }
                }
            }
            animationRef.current = requestAnimationFrame(predictWebcam);
        };

        setupGame();

        return () => {
            cancelAnimationFrame(animationRef.current);
            if (landmarkerRef.current) landmarkerRef.current.close();
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(t => t.stop());
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-mono p-6 flex flex-col items-center overflow-x-hidden">
            <Header />

            <div ref={containerRef} className="relative w-full max-w-5xl rounded-2xl overflow-hidden border border-gray-800 bg-black shadow-2xl">
                <video ref={videoRef} autoPlay playsInline muted className="hidden" />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

                {/* Muzzle Flash Effect */}
                <AnimatePresence>
                    {flash && (
                        <motion.div
                            initial={{ opacity: 0.6 }}
                            animate={{ opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 bg-white z-[5] pointer-events-none"
                        />
                    )}
                </AnimatePresence>

                {/* Animated Target Duck/Explosion */}
                <motion.div
                    className="absolute z-[1] text-[48px] leading-none pointer-events-none -translate-x-1/2 -translate-y-1/2"
                    animate={{
                        left: `${targetPos.x}%`,
                        top: `${targetPos.y}%`,
                        scale: isHit ? 1.6 : 1,
                        rotate: isHit ? [0, -15, 15, -15, 0] : 0
                    }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, duration: 0.4 }}
                >
                    {isHit ? "💥" : "🦆"}
                </motion.div>

                <HUD score={score} lives={lives} shots={shots} />

                {/* Status Text */}
                <div className="absolute top-4 right-4 bg-black/70 px-3 py-2 rounded-lg text-xs text-gray-400 z-10 backdrop-blur-sm border border-gray-800">
                    {status}
                </div>
        
                {/* Dynamic Mode Indicator */}
                <motion.div
                    className={`absolute top-16 right-4 bg-black/80 border-2 px-4 py-2 rounded-lg text-sm font-bold z-10 uppercase tracking-widest backdrop-blur-md ${mode.type === 'open' ? 'border-[#BFFF00] text-[#BFFF00]' :
                            mode.type === 'fist' ? 'border-[#ff3b3b] text-[#ff3b3b]' : 'border-gray-800 text-gray-400'
                        }`}
                    animate={{ scale: mode.type === 'fist' ? 1.1 : 1 }}
                >
                    {mode.text}
                </motion.div>

                <GameOver show={isGameOver} score={score} onRestart={restartGame} />
            </div>

            <Instructions />
      
            <div className="mt-6 text-center text-gray-500 text-xs">
                All hand tracking happens on-device. No video is sent to any server.
            </div>
        </div>
    );
}

export default ArcadeGame;
