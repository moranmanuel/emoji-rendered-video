import "./App.css"
import { useRef, useEffect } from 'react'

const emojisData = [
    // rojos
    {emoji:"❤️", r:0, g:0, b:0},
    {emoji:"🍎", r:0, g:0, b:0},
    {emoji:"🌹", r:0, g:0, b:0},
    {emoji:"🍓", r:0, g:0, b:0},
    // naranjas
    {emoji:"🥕", r:0, g:0, b:0},
    {emoji:"🍊", r:0, g:0, b:0},
    {emoji:"🧡", r:0, g:0, b:0},
    {emoji:"🦊", r:0, g:0, b:0},
    // amarillos
    {emoji:"💛", r:0, g:0, b:0},
    {emoji:"🌟", r:0, g:0, b:0},
    {emoji:"🍋", r:0, g:0, b:0},
    {emoji:"🌻", r:0, g:0, b:0},
    // verdes
    {emoji:"🌿", r:0, g:0, b:0},
    {emoji:"🍀", r:0, g:0, b:0},
    {emoji:"🥦", r:0, g:0, b:0},
    {emoji:"🌵", r:0, g:0, b:0},
    // azules
    {emoji:"🌊", r:0, g:0, b:0},
    {emoji:"💙", r:0, g:0, b:0},
    {emoji:"🫐", r:0, g:0, b:0},
    {emoji:"🧊", r:0, g:0, b:0},
    // violetas
    {emoji:"💜", r:0, g:0, b:0},
    {emoji:"🍇", r:0, g:0, b:0},
    {emoji:"🌸", r:0, g:0, b:0},
    // marrones
    {emoji:"🪵", r:0, g:0, b:0},
    {emoji:"🍫", r:0, g:0, b:0},
    {emoji:"🐻", r:0, g:0, b:0},
    
    // negros
    {emoji:"🖤", r:0, g:0, b:0},
    {emoji:"🎱", r:0, g:0, b:0},
    {emoji:"🐈‍⬛", r:0, g:0, b:0},
    // piel/marron claro
    {emoji:"🔔", r:0, g:0, b:0},
    {emoji:"🌾", r:0, g:0, b:0},
    {emoji:"⭐", r:0, g:0, b:0},
    {emoji:"👦", r:0, g:0, b:0},

    {emoji:"👧", r:0, g:0, b:0},
    {emoji:"👨", r:0, g:0, b:0},
    {emoji:"👩", r:0, g:0, b:0},
    {emoji:"👴", r:0, g:0, b:0},
    {emoji:"👵", r:0, g:0, b:0},
    {emoji:"🧑", r:0, g:0, b:0},
    {emoji:"👶", r:0, g:0, b:0},
    {emoji:"🐻", r:0, g:0, b:0},
    {emoji:"🦊", r:0, g:0, b:0},
    {emoji:"🐯", r:0, g:0, b:0},
    {emoji:"🦁", r:0, g:0, b:0},
    {emoji:"🐮", r:0, g:0, b:0},
    {emoji:"🐷", r:0, g:0, b:0},
    {emoji:"🐸", r:0, g:0, b:0},
    {emoji:"🐵", r:0, g:0, b:0},
    {emoji:"🦝", r:0, g:0, b:0},
    {emoji:"🍕", r:0, g:0, b:0},
    {emoji:"🥩", r:0, g:0, b:0},
    {emoji:"🍗", r:0, g:0, b:0},
    {emoji:"🌽", r:0, g:0, b:0},
    {emoji:"🥑", r:0, g:0, b:0},
    {emoji:"🫐", r:0, g:0, b:0},
    {emoji:"🍇", r:0, g:0, b:0},
    {emoji:"🍉", r:0, g:0, b:0},
    {emoji:"🥝", r:0, g:0, b:0},
    {emoji:"🌲", r:0, g:0, b:0},
    {emoji:"🌴", r:0, g:0, b:0},
    {emoji:"🍁", r:0, g:0, b:0},
    {emoji:"🌾", r:0, g:0, b:0},
    {emoji:"🪨", r:0, g:0, b:0},
    {emoji:"👑", r:0, g:0, b:0},
    {emoji:"🏆", r:0, g:0, b:0},
    {emoji:"🎸", r:0, g:0, b:0},
    {emoji:"⚽", r:0, g:0, b:0},
    {emoji:"🏀", r:0, g:0, b:0},
    {emoji:"🎾", r:0, g:0, b:0},
    {emoji:"🎱", r:0, g:0, b:0},
    {emoji:"🌑", r:0, g:0, b:0},
    {emoji:"🦇", r:0, g:0, b:0},
    {emoji:"💎", r:0, g:0, b:0},
    {emoji:"🌀", r:0, g:0, b:0},
    {emoji:"🐍", r:0, g:0, b:0},
    {emoji:"🦎", r:0, g:0, b:0},
    {emoji:"🌱", r:0, g:0, b:0},
    {emoji:"🥬", r:0, g:0, b:0}
]

const COLS = 160

export default function App() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const videoCanvasRef = useRef<HTMLCanvasElement>(null)
    const emojiCanvasRef = useRef<HTMLCanvasElement>(null)
    const renderedCanvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (!videoRef.current) return 
                videoRef.current.srcObject = stream
            })
    }, [])

    useEffect(() => {
        const emojiCanvas = emojiCanvasRef.current
        if (!emojiCanvas) return
        const emojiCanvasCtx = emojiCanvas.getContext("2d", { willReadFrequently: true });
        if (!emojiCanvasCtx) return
        emojiCanvas.width = 32
        emojiCanvas.height = 32
        
        for(const emojiData of emojisData) {
            emojiCanvasCtx.clearRect(0, 0, emojiCanvas.width, emojiCanvas.height)
            emojiCanvasCtx.fillText(emojiData.emoji, 10, 20)
            const canvasData = emojiCanvasCtx.getImageData(0, 0, 32, 32)
            const emojiRGBA = canvasData.data
            
            let rTotal = 0
            let gTotal = 0
            let bTotal = 0
            let numberOfPixels = 0            

            for (let i = 0; i < emojiRGBA.length; i+=4) {
                const alpha = emojiRGBA[i+3]
                
                if (alpha > 0) {
                    rTotal += emojiRGBA[i]
                    gTotal += emojiRGBA[i+1]
                    bTotal += emojiRGBA[i+2]
                    numberOfPixels++
                }
            }

            emojiData.r = rTotal / numberOfPixels
            emojiData.g = gTotal / numberOfPixels
            emojiData.b = bTotal / numberOfPixels

            console.log(emojiData);
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
        
        
        function draw() {
            if (!(video && videoCanvas && renderedCanvas && videoCanvasCtx && renderedCanvasCtx)) return
            
            if(video.readyState === video.HAVE_ENOUGH_DATA) {
                videoCanvas.width = video.videoWidth
                videoCanvas.height = video.videoHeight
                renderedCanvas.width = video.videoWidth
                renderedCanvas.height = video.videoHeight

                const dividedByPixels = []
                let dividedByPixelsLine = []
                const blocks = []

                videoCanvasCtx.drawImage(video, 0, 0)
                
                const imageData = videoCanvasCtx.getImageData(0, 0, videoCanvas.width, videoCanvas.height)

                const pixelsRGBA = imageData.data

                for (let i = 0; i <= pixelsRGBA.length; i+=4) {                    
                    const currentPixel = {r: pixelsRGBA[i], g: pixelsRGBA[i+1], b: pixelsRGBA[i+2]}

                    if(i / 4 % videoCanvas.width !== 0 || i == 0) dividedByPixelsLine.push(currentPixel)
                    else {
                        dividedByPixels.push(dividedByPixelsLine)
                        dividedByPixelsLine = []
                        dividedByPixelsLine.push(currentPixel)
                    }
                }

                for (let i = 0; i < videoCanvas.height; i += videoCanvas.width/COLS) {
                    for (let j = 0; j < videoCanvas.width; j += videoCanvas.width/COLS) {
                        let rTotalBlock = 0
                        let gTotalBlock = 0
                        let bTotalBlock = 0

                        for (let fila = 0; fila < videoCanvas.width/COLS; fila++) {
                            for (let columna = 0; columna < videoCanvas.width/COLS; columna++) {
                                rTotalBlock += dividedByPixels[i+fila][j+columna].r
                                gTotalBlock += dividedByPixels[i+fila][j+columna].g
                                bTotalBlock += dividedByPixels[i+fila][j+columna].b
                            }
                        }

                        const r = rTotalBlock/((videoCanvas.width/COLS) ** 2)
                        const g = gTotalBlock/((videoCanvas.width/COLS) ** 2)
                        const b = bTotalBlock/((videoCanvas.width/COLS) ** 2)

                        const block: {x: number, y: number, r: number, g: number, b: number} = {x: j, y: i, r: r, g: g, b: b}
                        
                        blocks.push(block)
                    }
                }

                function getClosestEmoji(blockR: number, blockG: number, blockB: number): string {
                    let closestEmoji = null
                    let closestDistance = Infinity
        
                    for(const emojiData of emojisData) {
                        const distance = (blockR - emojiData.r) ** 2 + (blockG - emojiData.g) ** 2 + (blockB - emojiData.b) ** 2
                        
                        if(distance < closestDistance) {
                            closestEmoji = emojiData.emoji
                            closestDistance = distance
                        }
                    }

                    if (!closestEmoji) throw new Error("ERROR")

                    return closestEmoji
                }

                for (const block of blocks) {                    
                    const closestEmoji = getClosestEmoji(block.r, block.g, block.b)                                        
                    renderedCanvasCtx.font = `${renderedCanvas.width/COLS}px serif`
                    renderedCanvasCtx.textBaseline = "top"
                    renderedCanvasCtx.fillText(closestEmoji, block.x, block.y)
                }
            }

            requestAnimationFrame(draw)
        }

        draw()

    }, [])

    return (
        <div className="container">
            <div className="rendered-video">
                <canvas ref={renderedCanvasRef} />
            </div>
            <div className="real-video">
                <video ref={videoRef} autoPlay />
                <canvas ref={emojiCanvasRef} style={{ display: "none" }} />
                <canvas ref={videoCanvasRef} style={{ display: "none" }} />
            </div>
        </div>
    );
}