import "./Appp.css"
import {useState, useEffect, useRef} from "react"

export default function App() {
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const canvas2Ref = useRef(null)
    const emojisData = [{emoji:"🥕"}, {emoji:"🔔"}, {emoji:"🌿"}, {emoji:"🍊"}, {emoji:"💛"}, {emoji:"🖤"}, {emoji:"🤍"}, {emoji:"❤️"}, {emoji:"💜"}, {emoji:"🧡"}, {emoji:"🌸"}, {emoji:"🍋"}, {emoji:"🌊"}, {emoji:"🌙"}, {emoji:"⭐"}]

    const [emojiGrid, setEmojiGrid] = useState()
    
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream
            })
    }, [])

    useEffect(() => {
        for(const emojiData of emojisData) {
            const canvas2 = canvas2Ref.current
            const ctx2 = canvas2.getContext("2d")
            canvas2.width = 32
            canvas2.height = 32

            ctx2.clearRect(0, 0, canvas2.width, canvas2.height)
            ctx2.fillText(emojiData.emoji, 0, 0)
            const canvasData = ctx2.getImageData(0, 0, 32, 32)
            const emojiRGBA = canvasData.data
            let rTotal = 0
            let gTotal = 0
            let bTotal = 0
            let numberOfPixels = 0

            for (let i = 0; i < emojiRGBA.length; i+=4) {
                const alpha = emojiRGBA[i+3] > 0
                
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
        const ctx = canvas.getContext("2d", { willReadFrequently: true })

        let emojiGridShown = false
        
        function draw() {
            if(video.readyState === video.HAVE_ENOUGH_DATA) {
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight

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

                    if(i / 4 <= canvas.width - 1) emojisLine.push(closestEmoji)
                    else {
                        emojisGrid.push(emojisLine)
                        emojisLine = []
                    }
                }

                setEmojiGrid(emojisGrid)

                if(!emojiGridShown) {
                    console.log(emojisGrid[0])
                    emojiGridShown = true
                }
                
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

        function getClosestEmoji(pixelR, pixelG, pixelB) {
            let closestEmoji = null
            let closestDistance = Infinity

            for(const emojiData of emojisData) { 
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
                {/* <video ref={videoRef} autoPlay /> */}
            </div>
            <div className="real-video">
                <video ref={videoRef} autoPlay />
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <canvas ref={canvas2Ref} style={{ display: "none" }}/>
                {/* <canvas ref={canvas3Ref} style={{ display: "none" }} /> */}
            </div>
        </div>
    );
}