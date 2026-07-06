import "./App.css"
import {useRef, useEffect, useState} from 'react'

const emojisData: Array<{emoji:string, r?: number, g?: number, b?: number}> = [{emoji:"🥕"}, {emoji:"🔔"}, {emoji:"🍊"}, {emoji:"💛"}, {emoji:"🖤"}, {emoji:"🤍"}, {emoji:"❤️"}, {emoji:"💜"}, {emoji:"🧡"}, {emoji:"🌸"}, {emoji:"🍋"}, {emoji:"🌊"}, {emoji:"🌙"}, {emoji:"⭐"}]

export default function App() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const canvas2Ref = useRef<HTMLCanvasElement>(null)
    const canvas3Ref = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (!videoRef.current) return 
                videoRef.current.srcObject = stream
            })
    }, [])

    useEffect(() => {
        const canvas2 = canvas2Ref.current
        if (!canvas2) return
        const ctx2 = canvas2.getContext("2d", { willReadFrequently: true });
        if (!ctx2) return
        canvas2.width = 32
        canvas2.height = 32
        
        for(const emojiData of emojisData) {
            ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
            ctx2.fillText(emojiData.emoji, 0, 0)
            const canvasData = ctx2.getImageData(0, 0, 32, 32)
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
        }
    }, [])

    useEffect(() => {
        const video = videoRef.current
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d", { willReadFrequently: true })
        const canvas3 = canvas3Ref.current
        if (!canvas3) return
        const ctx3 = canvas3.getContext("2d")

        
        function draw() {
            if (!(video && canvas && canvas3 && ctx && ctx3)) return
            if(video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
                canvas3.width = video.videoWidth
                canvas3.height = video.videoHeight

                const emojisGrid = []
                let emojisLine = []
                
                ctx.drawImage(video, 0, 0)
                
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

                const pixelsRGBA = imageData.data

                for (let i = 0; i < pixelsRGBA.length; i+=4) {
                    const r = pixelsRGBA[i]
                    const g = pixelsRGBA[i+1]
                    const b = pixelsRGBA[i+2]

                    const closestEmoji = getClosestEmoji(r, g, b)            

                    if(i / 4 % canvas.width !== 0 || i == 0) emojisLine.push(closestEmoji)
                    else {
                        emojisGrid.push(emojisLine)
                        emojisLine = []
                        emojisLine.push(closestEmoji)
                    }
                }

                for(let i = 0; i < emojisGrid.length; i++) {
                    for(let j = 0; j < emojisGrid[i].length; j++) {
                        const currentEmoji = emojisGrid[i][j]
                        
                        if(!currentEmoji) return

                        ctx3.fillText(currentEmoji, j, i)}
                }
            }

            requestAnimationFrame(draw)
        }

        draw()

        function getClosestEmoji(pixelR: number, pixelG: number, pixelB: number) {
            let closestEmoji = null
            let closestDistance = Infinity

            for(const emojiData of emojisData) {
                // if(!(emojiData.r && emojiData.g && emojiData.b)) return
                const distance = (pixelR - emojiData.r) ** 2 + (pixelG - emojiData.g) ** 2 + (pixelB - emojiData.b) ** 2
                
                if(distance < closestDistance) {
                    closestEmoji = emojiData.emoji
                    closestDistance = distance
                }
            }
            return closestEmoji
        }
    }, [])

    return (
        <div className="container">
            <div className="rendered-video">
                <canvas ref={canvas3Ref} />
            </div>
            <div className="real-video">
                <video ref={videoRef} autoPlay />
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <canvas ref={canvas2Ref} style={{ display: "none" }} />
            </div>
        </div>
    );
}