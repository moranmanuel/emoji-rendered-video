# Emoji Video Renderer

A real-time webcam renderer that replaces every pixel block with the closest matching emoji based on color.

## Demo

https://emoji-rendered-video.vercel.app/

## How it works

- Captures webcam feed and draws each frame to a hidden canvas
- Divides the frame into blocks and calculates the average RGB color of each block
- Matches each block to the closest emoji from a pre-calculated color palette
- Renders the result in real time using canvas

## Tech stack

- React + TypeScript + Vite
- emoji-datasource for the emoji palette
- Canvas API for pixel reading and rendering

## Run locally

```bash
npm install
npm run dev
```
