"use strict";
import { angleToRadian } from "../js/_utility";
import { Canvas2DUtility } from "../js/_canvas2d";
import { Scene } from "../js/_scene";
import Perlin from "../js/_perlin";
import { Pane } from 'tweakpane';

// canvas2d
const setup = () => {
  const element = document.querySelector(".js-canvas") as HTMLCanvasElement;
  const utility = new Canvas2DUtility(element);
  const {canvas, ctx} = utility;
  const scene = new Scene();
  const noise = new Perlin();
  const pane = new Pane();

  const resize = ()=>{
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
  }

  const initialize = ()=> {
    scene.startTime = Date.now();
    resize();
    window.addEventListener('resize', resize);

    const paneAddInputs= ()=>{
      const PARAMS = {
        percentage: 50,
      }
      pane.addInput(PARAMS, "percentage", { min: 1, max: 100})
    }
    paneAddInputs();
  }
  const render = ()=>{
    const nowTime = (Date.now() - scene.startTime) / 1000;

    const createBackground = ()=>{
      // https://randoma11y.com/
      // {
      //   color: #02f46b;
      //   background-color: #1c303d;
      // }
      ctx.fillStyle = "#1c303d";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const createCenterLine = ()=>{
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#fff";
        utility.lines([[0, utility.centerY], [canvas.width, utility.centerY]])
        ctx.stroke();
        utility.lines([[utility.centerX, 0], [utility.centerX, canvas.height]])
        ctx.stroke();
      }
      createCenterLine();
    }

    // https://ikeryou.hatenablog.com/entry/2018/01/07/104729
    const createCircles = ()=> {
      // 円上に円を描画
      for (let angle = 0; angle <= 360; angle += 360 / 120) {
        const radian = angleToRadian(angle);
        const radius = Math.min(canvas.width, canvas.height) / 2;
        const x = utility.centerX + Math.cos(radian) * radius;
        const y = utility.centerY + Math.sin(radian) * radius;
        utility.ellipse(x, y, 10, 10);
        utility.stroke("#02f46b");
      }

      // let radius = 0;
      // for (let angle = 0; angle < 360 * 4; angle += 360 / 120) {
      //   radius += 1;
      //   const radian = angleToRadian(angle);
      //   const x = utility.centerX + Math.cos(radian) * radius;
      //   const y = utility.centerY + Math.sin(radian) * radius;
      //   utility.ellipse(x, y, 20, 20);
      //   utility.fill("yellow")
      // }
    }

    const createLines = ()=>{
      // 一周を何回するか
      const times = 1;
      // 円を何分割するか
      const number = 360 / 8; // 8分割
      // 0から始まるので1足りなくなる
      const lineArraysLength = (360 * times) / number + 1;
      // for文で360を回すと粗過ぎたり、余計な計算をしたりしそうだったから先に計算
      const lineArrays = [...Array(lineArraysLength).keys()].map((item)=> {
        const angle = item * number;
        const radian = angleToRadian(angle);
        const radius = Math.min(canvas.width, canvas.height) / 2 * (item  / (lineArraysLength - 1));
        const x = utility.centerX + Math.cos(radian) * radius;
        const y = utility.centerY + Math.sin(radian) * radius;
        return [x, y];
      })
      utility.lines(lineArrays);
      utility.stroke("#02f46b");
    }

    createBackground();
    // createCircles();
    createLines();

    requestAnimationFrame(render);
  }
  initialize();
  render();
}


window.addEventListener("DOMContentLoaded", () => {
  setup();
});
