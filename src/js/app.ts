"use strict";

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;

const initialize = () => {
  canvas = document.querySelector(".js-canvas") as HTMLCanvasElement;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");
};

const render = () => {
  if (ctx == null) {
    return;
  }

  // ctx.shadowBlur = 5;
  // ctx.shadowColor = "blue";
  // ctx.shadowOffsetX = 5;
  // ctx.shadowOffsetY = 5;

  ctx.globalCompositeOperation = "xor";


  // const POINT_COUNT = 3;
  // const polygonPoints = [...Array(POINT_COUNT * 2)].map(() => {
  //   return generateRandomInt(300);
  // });
  // drawPolygon(polygonPoints);
  drawCircle(500, 500, 100);
  drawFan(300, 300, 50, Math.PI / 4, Math.PI * 2, "green");
  drawQuadraticBezier(100, 100, 250, 200, 200, 200);
  drawCubicBezier(100, 100, 250, 200, 200, 200, 240, 240);

  ctx.font = "bold 30px cursive";
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = 'start';
  drawText("testtt", 100, 400, 100);

  const linearGradient = ctx.createLinearGradient(100, 100, 100, 200);
  linearGradient.addColorStop(0.0, "red");
  linearGradient.addColorStop(0.5, "blue");
  linearGradient.addColorStop(1.0, "yellow");

  const radialGradient = ctx.createRadialGradient(250, 0, 50, 250, 0, 300);
  radialGradient.addColorStop(0, "green");
  radialGradient.addColorStop(1, "white");

};


const drawPolygon = (points: number[], color: string | CanvasGradient = "#000") => {
  if (ctx == null) {
    return;
  }
  if (points.length < 2 * 3) {
    return;
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(points[0], points[1]);
  points.forEach((point, index) => {
    if (index < 2) {
      return;
    }
    if (index % 2 === 1) {
      return;
    }
    if (ctx == null) {
      return;
    }
    ctx.lineTo(points[index], points[index + 1]);
  });
  ctx.closePath();
  ctx.fill();
};

const drawCircle = (x: number, y: number, radius: number, color: string | CanvasGradient = "#000") => {
  if (ctx == null) {
    return
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
};

const drawFan = (x: number, y: number, radius: number, startRadian: number, endRadian: number, color: string | CanvasGradient = "#000") => {
  if (ctx == null) {
    return
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, radius, startRadian, endRadian);
  ctx.closePath();
  ctx.fill();
}

const drawQuadraticBezier = (x1: number, y1: number, x2: number, y2: number, cx: number, cy: number, lineWidth = 1, color: string | CanvasGradient = "#000") => {
  if (ctx == null) {
    return;
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(cx, cy, x2, y2);
  // ctx.closePath();
  ctx.stroke();
}

const drawCubicBezier = (x1: number, y1: number, x2: number, y2: number, cx1: number, cy1: number, cx2: number, cy2: number, lineWidth = 1, color: string | CanvasGradient = "#000") => {
  if (ctx == null) {
    return;
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);
  // ctx.closePath();
  ctx.stroke();
}

const drawText = (text: string, x: number, y: number, width: number, color: string | CanvasGradient = "#000") => {
  if (ctx == null) {
    return
  }
  ctx.fillStyle = color;
  ctx.fillText(text, x, y, width)
}


const generateRandomInt = (range: number) => {
  return Math.floor(range * Math.random());
};

window.addEventListener("DOMContentLoaded", () => {
  initialize();
  render();
});
