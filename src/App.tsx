import "./App.css"
import { useRef, useEffect, useState } from 'react'
import data from 'emoji-datasource/emoji.json'

let emojisData: Array<{emoji: string, r: number, g: number, b: number}> = []

const emojiCache = new Map<string, string>();

const CACHE_VERSION = "2"

export default function App() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const videoCanvasRef = useRef<HTMLCanvasElement>(null)
    const emojiCanvasRef = useRef<HTMLCanvasElement>(null)
    const renderedCanvasRef = useRef<HTMLCanvasElement>(null)
    const [cols, setCols] = useState(20)

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (!videoRef.current) return 
                videoRef.current.srcObject = stream
            })
    }, [])

    useEffect(() => {
        emojiCache.clear()

        const savedVersion = localStorage.getItem("emojiCacheVersion")

        if (savedVersion !== CACHE_VERSION) {
            localStorage.removeItem("emojisData")
            localStorage.setItem("emojiCacheVersion", CACHE_VERSION)
        }

        const cached = localStorage.getItem('emojisData')
        
        if (cached) {
            emojisData = JSON.parse(cached)
        } else {
            const emojiCanvas = emojiCanvasRef.current
            if (!emojiCanvas) return
            const emojiCanvasCtx = emojiCanvas.getContext("2d", { willReadFrequently: true });
            if (!emojiCanvasCtx) return
            emojiCanvas.width = 64
            emojiCanvas.height = 64

            emojiCanvasCtx.font = "32px sans-serif";
            emojiCanvasCtx.textAlign = "center";
            emojiCanvasCtx.textBaseline = "middle";
            
            for (const emoji of data) {
                const emojiText = String.fromCodePoint(...emoji.unified.split('-').map((u: string) => parseInt(u, 16)))
            
                emojiCanvasCtx.clearRect(0, 0, emojiCanvas.width, emojiCanvas.height)
                emojiCanvasCtx.fillText(emojiText, 16, 16)
                const canvasData = emojiCanvasCtx.getImageData(0, 0, emojiCanvas.width, emojiCanvas.height)
                const emojiRGBA = canvasData.data
                
                let rTotal = 0
                let gTotal = 0
                let bTotal = 0
                let numberOfPixels = 0            

                for (let i = 0; i < emojiRGBA.length; i+=4) {
                    const alpha = emojiRGBA[i+3]
                    const weight = alpha / 255

                    if (alpha > 0) {
                        rTotal += emojiRGBA[i] * weight
                        gTotal += emojiRGBA[i+1] * weight
                        bTotal += emojiRGBA[i+2] * weight
                        numberOfPixels++
                    }
                }
                
                if(numberOfPixels < 600) continue
                
                const r = rTotal / numberOfPixels
                const g = gTotal / numberOfPixels
                const b = bTotal / numberOfPixels
        
                if(r == 0 && g == 0 && b == 0) continue

                const emojiData = {emoji: emojiText, r: r, g: g, b: b}
                emojisData.push(emojiData)
            }

            localStorage.setItem('emojisData', JSON.stringify(emojisData))
        }
    }, [])

    useEffect(() => {
        const video = videoRef.current
        const videoCanvas = videoCanvasRef.current
        if (!videoCanvas) return
        const videoCanvasCtx = videoCanvas.getContext("2d", { willReadFrequently: true })
        const renderedCanvas = renderedCanvasRef.current
        if (!renderedCanvas) return
        const renderedCanvasCtx = renderedCanvas.getContext("2d")
        let animationId: number
        
        let lastFrame = 0
        function draw(timestamp: number) {
            if (timestamp - lastFrame > 66) {
                lastFrame = timestamp
                if (!(video && videoCanvas && renderedCanvas && videoCanvasCtx && renderedCanvasCtx)) return
                
                if(video.readyState === video.HAVE_ENOUGH_DATA) {
                    videoCanvas.width = video.videoWidth
                    videoCanvas.height = video.videoHeight
                    renderedCanvas.width = video.videoWidth
                    renderedCanvas.height = video.videoHeight

                    const longSide = Math.max(videoCanvas.width, videoCanvas.height)
                    const BLOCK_SIZE = Math.floor(longSide / cols)

                    videoCanvasCtx.drawImage(video, 0, 0)
                    
                    const imageData = videoCanvasCtx.getImageData(0, 0, videoCanvas.width, videoCanvas.height)

                    const pixelsRGBA = imageData.data

                    renderedCanvasCtx.font = `${BLOCK_SIZE*0.8}px serif`
                    renderedCanvasCtx.textBaseline = "top"

                    for (let i = 0; i + BLOCK_SIZE <= videoCanvas.height; i += BLOCK_SIZE) {
                        const row: string[] = []
                        for (let j = 0; j + BLOCK_SIZE <= videoCanvas.width; j += BLOCK_SIZE) {
                            let rTotalBlock = 0
                            let gTotalBlock = 0
                            let bTotalBlock = 0
    
                            for (let fila = 0; fila < BLOCK_SIZE; fila++) {
                                for (let columna = 0; columna < BLOCK_SIZE; columna++) {
                                    const index = ((i + fila) * videoCanvas.width + (j + columna)) * 4
                                    rTotalBlock += pixelsRGBA[index]
                                    gTotalBlock += pixelsRGBA[index + 1]
                                    bTotalBlock += pixelsRGBA[index + 2]
                                }
                            }

                            const r = rTotalBlock/((BLOCK_SIZE) ** 2)
                            const g = gTotalBlock/((BLOCK_SIZE) ** 2)
                            const b = bTotalBlock/((BLOCK_SIZE) ** 2)
                            
                            const closestEmoji = getClosestEmoji(r, g, b)

                            renderedCanvasCtx.fillText(closestEmoji, j, i)
                        }
                    }
                    
                    function getClosestEmoji(blockR: number, blockG: number, blockB: number): string {
                        let closestEmoji = null
                        let closestDistance = Infinity

                        const key = `${blockR},${blockG},${blockB}`;

                        const cachedEmoji = emojiCache.get(key);

                        if (cachedEmoji) return cachedEmoji
                        else {
                            for(const emojiData of emojisData) {
                                const distance = (blockR - emojiData.r) ** 2 + (blockG - emojiData.g) ** 2 + (blockB - emojiData.b) ** 2
                            
                                if(distance < closestDistance) {
                                    closestEmoji = emojiData.emoji
                                    closestDistance = distance
                                }
                            }

                            if (!closestEmoji) throw new Error("ERROR")
                                
                            emojiCache.set(key, closestEmoji);
    
                            return closestEmoji
                        }   
                    }
                }
            }
            animationId = requestAnimationFrame(draw)
        }

        animationId = requestAnimationFrame(draw)

        return () => cancelAnimationFrame(animationId)
    }, [cols])

    return (
        <div className = "container">
            <div className="videos">
                <div className="rendered-video">
                    <canvas ref={renderedCanvasRef} />
                </div>
                <div className="real-video">
                    <video ref={videoRef} autoPlay />
                    <canvas ref={emojiCanvasRef} style={{ display: "none" }} />
                    <canvas ref={videoCanvasRef} style={{ display: "none" }} />
                </div>
            </div>
            <div className="cols-options">
                <p>Grids:</p>
                <input 
                    type="range" 
                    list="cols-options" 
                    value={cols}
                    min={20}
                    max={200}
                    onChange={(e) => {setCols(Number(e.target.value))}}
                    className="cols-options-slider"
                />
                <p>{cols}</p>
            </div>
        </div>
    );
}