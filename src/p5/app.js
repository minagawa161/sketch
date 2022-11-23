"use strict";

import p5 from "p5";

window.addEventListener("DOMContentLoaded", () => {
  const sketch = (p) => {
    const backgroundColor = [250, 255];
    p.setup = () => {
      p.createCanvas(window.innerWidth, window.innerHeight);
      p.background(backgroundColor);
      p.smooth();
      p.strokeWeight(1);
      p.stroke(0, 30);
      p.line(0, p.height / 2, p.width, p.height / 2); // 真ん中の線

      const stepX = 10;
      let lastX = 0;
      let lastY = 0;
      let time = 0;
      let angle = 0;

      p.strokeWeight(5);
      p.stroke(100, 200, 0, 255);
      for (let x = 0; x < p.width; x += stepX) {
        // const y = p.height * 0.5 + Math.random() * 100 - 100 / 2;
        const y = p.height * 0.5 + p.noise(angle) * 100 - 100 / 2;
        // const y =
        //   p.height * 0.5 + noise.perlin2(x / 100, angle / 100) * 100 - 100 / 2;

        // const y = p.height * 0.5 + noise.perlin2(x, time) * 100;
        // const y =
        //   p.height * 0.5 + Math.pow(Math.sin(angle), 3) * p.noise(angle) * 50;

        p.line(x, y, lastX, lastY);
        lastX = x;
        lastY = y;
        angle += 0.1;
        // time += 0.1;
      }
    };

    p.draw = () => {};
  };
  new p5(sketch);
});

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
