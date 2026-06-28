import "./Appp.css"
import {useState, useEffect, useRef} from "react"

export default function App() {
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const canvas2Ref = useRef(null)
    const canvas3Ref = useRef(null)
    const [emojiGrid, setEmojiGrid] = useState()
    
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream
            })
    }, [])

    useEffect(() => {
        const video = videoRef.current
        const canvas = canvasRef.current
        const canvas2 = canvas2Ref.current
        const ctx = canvas.getContext("2d", { willReadFrequently: true })
        const ctx2 = canvas2.getContext("2d")
        
        function draw() {
            if(video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth
                canvas2.width = video.videoWidth
                canvas.height = video.videoHeight
                canvas2.height = video.videoHeight
                

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
                    
                    // const newPixel = { x: (i / 4 - 1) % canvas.width, y: Math.floor(i / 4 / canvas.width), emoji: closestEmoji }
            
                    if(i / 4 <= canvas.width) emojisLine.push(closestEmoji)
                    else {
                        emojisGrid.push(emojisLine)
                        emojisLine = []
                    }
                }

                setEmojiGrid(emojisGrid)
            }

            requestAnimationFrame(draw)
        }

        draw()

        // const colors = [
        //     { emoji: "⬛", r: 30,  g: 30,  b: 30  },
        //     { emoji: "⬜", r: 240, g: 240, b: 240 },
        //     { emoji: "🟥", r: 196, g: 30,  b: 30  },
        //     { emoji: "🟧", r: 230, g: 126, b: 34  },
        //     { emoji: "🟨", r: 241, g: 196, b: 15  },
        //     { emoji: "🟩", r: 39,  g: 174, b: 96  },
        //     { emoji: "🟦", r: 41,  g: 128, b: 185 },
        //     { emoji: "🟫", r: 139, g: 90,  b: 43  },
        //     { emoji: "🟪", r: 142, g: 68,  b: 173 }
        // ]

        const emojis = ["🥕", "🔔", "🌿", "🍊", "💛", "🖤", "🤍", "❤️", "💜", "🧡", "🌸", "🍋", "🌊", "🌙", "⭐"]

        function getClosestEmoji(pixelR, pixelG, pixelB) {
            let closestEmoji = null
            let closestDistance = Infinity

            for(const emoji of emojis) {
                const {emojiR, emojiG, emojiB} = getEmojiRGB(emoji)
 
                const distance = (pixelR - emojiR) ** 2 + (pixelG - emojiG) ** 2 + (pixelB - emojiB) ** 2
                
                if(distance < closestDistance){
                    closestEmoji = color
                    closestDistance = distance
                }
            }

            return closestEmoji
        }

        function getEmojiRGB(emoji) {
            const canvas3 = canvas3Ref.current
            const ctx3 = canvas3.getContext("2d")

            ctx3.fillText(emoji, 0, 0)
            const canvasData = ctx3.getImageData(0, 0, 1, 0)

            return {
                emojiR: canvasData.data[0],
                emojiG: canvasData.data[1],
                emojiB: canvasData.data[2]
            }
        }

    }, [])

    return (
        <div className="container">
            <div className="rendered-video">
                <canvas ref={canvas2Ref} />
            </div>
            <div className="real-video">
                <video ref={videoRef} autoPlay />
                <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>
        </div>
    );
}