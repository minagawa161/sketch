"use strict";
import { WebGLUtility } from "../js/_webgl";
import { Pane } from 'tweakpane';

const setup = () => {
  const element = document.querySelector(".js-canvas") as HTMLCanvasElement;
  const utility = new WebGLUtility(element);
  const {gl, canvas} = utility;
  let {
    program,
    attLocation,
    attStride,
    uniLocation,
    uniType,
    position,
    index,
    vbo,
    ibo,
    beginTime,
    nowTime
  } = utility;

  let xScale = 1.0;
  let yScale = 1.0;
  let zScale = 1.0;

  const pane = new Pane();

  const resize = ()=>{
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
  }
  // const mouse = (event: MouseEvent)=>{
  //   const {clientX, clientY} = event;
  //   const width = window.innerWidth;
  //   const height = window.innerHeight;
  //   const x = clientX - width;
  //   const y =
  // }
  const initialize = ()=> {

    const paneAddInputs= ()=>{
      const PARAMS = {
        xScale,
        yScale,
        zScale,
      }
      pane.addInput(PARAMS, "xScale", { min: 0.0, max: 1.0}).on("change", ({value})=> {xScale = value;});
      pane.addInput(PARAMS, "yScale", { min: 0.0, max: 1.0}).on("change", ({value})=> {yScale = value;});
      pane.addInput(PARAMS, "zScale", { min: 0.0, max: 1.0}).on("change", ({value})=> {zScale = value;});
    }
    paneAddInputs();

    utility.loadShader([
      './vs1.vert',
      './fs1.frag',
    ]).then((shaders)=>{
      const vs = utility.createShaderObject(shaders[0], "VERTEX_SHADER");
      const fs = utility.createShaderObject(shaders[1], "FRAGMENT_SHADER");
      program = utility.createProgramObject(vs, fs);

      attLocation = [
        gl.getAttribLocation(program, 'position'),
      ];
      attStride = [
        3,
      ];
      uniLocation = [
        gl.getUniformLocation(program, 'resolution'),
        gl.getUniformLocation(program, 'time'),
        gl.getUniformLocation(program, 'xScale'),
        gl.getUniformLocation(program, 'yScale'),
        gl.getUniformLocation(program, 'zScale'),
      ];
      uniType = [
        'uniform2fv',
        'uniform1f',
        'uniform1f',
        'uniform1f',
        'uniform1f',
      ];

      position = [
        -1.0,  1.0,  0.0,
        1.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
        1.0, -1.0,  0.0,
      ];
      index = [0, 2, 1, 1, 2, 3];
      vbo = [
        utility.createVBO(position),
      ];
      ibo = utility.createIBO(index);

      resize();
      window.addEventListener('resize', resize);

      utility.enableAttribute(vbo, attLocation, attStride, ibo);

      beginTime = Date.now();
    }).then(()=>{
      render();
    })
  }
  const render = ()=>{
    nowTime = (Date.now() - beginTime) / 1000;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    utility.setUniform([[canvas.width, canvas.height], nowTime, xScale, yScale, zScale], uniLocation, uniType)
    gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(render);
  }
  initialize();
}


window.addEventListener("DOMContentLoaded", () => {
  setup();
});
