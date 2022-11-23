"use strict";
import { Pane } from 'tweakpane';
import { Canvas2DUtility } from "../js/_canvas2d";
import { Scene } from "../js/_scene";
import Perlin from "../js/_perlin";

// canvas2d
const setup = () => {
  // const pane = new Pane();
  const element = document.querySelector(".js-canvas") as HTMLCanvasElement;
  const utility = new Canvas2DUtility(element);
  const canvas = utility.canvas;
  const ctx = utility.ctx;
  const scene = new Scene();
  const noise = new Perlin();

  const resize = ()=>{
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
  }

  const initialize = ()=> {

    scene.startTime = Date.now();
    resize();
    window.addEventListener('resize', resize);

    // const paneAddInputs= ()=>{
    //   const PARAMS = {
    //     percentage: 50,
    //   }
    //   pane.addInput(PARAMS, "percentage", { min: 1, max: 10})
    // }
    // paneAddInputs();
  }
  const render = ()=>{
    const nowTime = (Date.now() - scene.startTime) / 1000;

    const createBackground = ()=>{
      ctx.fillStyle = "#22153e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const createLines = ()=>{
      const centerY = canvas.height / 2;

      const createNoiseLine = ()=> {
        const lineNumber = 10;
        const segmentNumber = 100;
        const amplitude = centerY / 2;

        const createSinArrays = () =>{
          return [...Array(segmentNumber).keys()].map((i)=>{
            const x = i / (segmentNumber - 1) * canvas.width;
            const radian = i / (segmentNumber - 1) * Math.PI + nowTime;
            const y = amplitude * Math.sin(radian) + centerY;
            return [x, y];
          })
        }

        const createPerlinArrays = ( i = 0 ) => {
          return [...Array(segmentNumber).keys()].map((j)=>{
            const x = j / (segmentNumber - 1) * canvas.width;
            const px = j / (100 + i);
            const py = (nowTime + i) * .5;
            const y = amplitude * noise.perlin2(px, py) + (centerY + i * 20);
            return [x, y];
          })
        }

        // 線を増やす
        [...Array(lineNumber).keys()].forEach(i=>{
          const lineArrays = createPerlinArrays(i);
          // 画面下を覆うように
          const arrays = [...lineArrays, [canvas.width, canvas.height], [0, canvas.height]]
          utility.lines(arrays);

          const createColor = (currentNumber: number, totalNumber: number)=>{
            const h = Math.round((currentNumber / totalNumber) * 60); // 色相
            const s = 100; // 彩度
            const l = Math.round((currentNumber / totalNumber) * 75) + 25; // 明度
            return `hsl(${h}, ${s}%, ${l}%)`
          }
          ctx.fillStyle = createColor(i, lineNumber);
          ctx.fill();
        })
      }

      createNoiseLine();

    }
    createBackground();
    createLines();

    requestAnimationFrame(render);
  }
  initialize();
  render();
}


window.addEventListener("DOMContentLoaded", () => {
  setup();
});
