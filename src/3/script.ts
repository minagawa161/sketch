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

  let u_red_x = .9;
  let u_red_y = 1.0;
  let u_red_time = .2;
  let u_red_static = .0;
  let u_green_x = .5;
  let u_green_y = .6;
  let u_green_time = .25;
  let u_green_static = 75.0;
  let u_blue_x = .7;
  let u_blue_y = .8;
  let u_blue_time = .3;
  let u_blue_static = .0;

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
        u_red_x,
        u_red_y,
        u_red_time,
        u_red_static,
        u_green_x,
        u_green_y,
        u_green_time,
        u_green_static,
        u_blue_x,
        u_blue_y,
        u_blue_time,
        u_blue_static,
      }

      pane.addInput(PARAMS, "u_red_x", { min: 0.0, max: 1.0 }).on("change", ({ value }) => { u_red_x = value; });
      pane.addInput(PARAMS, "u_red_y", { min: 0.0, max: 1.0 }).on("change", ({ value }) => { u_red_y = value; });
      pane.addInput(PARAMS, "u_red_time", { min: 0.0, max: 1.0 }).on("change", ({ value }) => { u_red_time = value; });
      pane.addInput(PARAMS, "u_red_static", { min: 0.0, max: 255.0 }).on("change", ({ value }) => { u_red_static = value; });
      pane.addInput(PARAMS, "u_green_x", { min: 0.0, max: 1.0 }).on("change", ({ value }) => { u_green_x = value; });
      pane.addInput(PARAMS, "u_green_y", { min: 0.0, max: 1.0 }).on("change", ({ value }) => { u_green_y = value; });
      pane.addInput(PARAMS, "u_green_time", { min: 0.0, max: 1.0 }).on("change", ({ value }) => { u_green_time = value; });
      pane.addInput(PARAMS, "u_green_static", { min: 0.0, max: 255.0 }).on("change", ({ value }) => { u_green_static = value; });
      pane.addInput(PARAMS, "u_blue_x", { min: 0.0, max: 1.0 }).on("change", ({ value }) => { u_blue_x = value; });
      pane.addInput(PARAMS, "u_blue_y", { min: 0.0, max: 1.0 }).on("change", ({ value }) => { u_blue_y = value; });
      pane.addInput(PARAMS, "u_blue_time", { min: 0.0, max: 1.0 }).on("change", ({ value }) => { u_blue_time = value; });
      pane.addInput(PARAMS, "u_blue_static", { min: 0.0, max: 255.0 }).on("change", ({ value }) => { u_blue_static = value; });
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
        gl.getUniformLocation(program, "u_resolution"),
        gl.getUniformLocation(program, "u_time"),
        gl.getUniformLocation(program, "u_red_x"),
        gl.getUniformLocation(program, "u_red_y"),
        gl.getUniformLocation(program, "u_red_time"),
        gl.getUniformLocation(program, "u_red_static"),
        gl.getUniformLocation(program, "u_green_x"),
        gl.getUniformLocation(program, "u_green_y"),
        gl.getUniformLocation(program, "u_green_time"),
        gl.getUniformLocation(program, "u_green_static"),
        gl.getUniformLocation(program, "u_blue_x"),
        gl.getUniformLocation(program, "u_blue_y"),
        gl.getUniformLocation(program, "u_blue_time"),
        gl.getUniformLocation(program, "u_blue_static"),
      ];
      uniType = [
        "uniform2fv",
        "uniform1f",
        "uniform1f",
        "uniform1f",
        "uniform1f",
        "uniform1f",
        "uniform1f",
        "uniform1f",
        "uniform1f",
        "uniform1f",
        "uniform1f",
        "uniform1f",
        "uniform1f",
        "uniform1f",
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

    utility.setUniform([[canvas.width, canvas.height], nowTime, u_red_x, u_red_y, u_red_time, u_red_static, u_green_x, u_green_y, u_green_time, u_green_static, u_blue_x, u_blue_y, u_blue_time, u_blue_static], uniLocation, uniType)
    gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(render);
  }
  initialize();
}


window.addEventListener("DOMContentLoaded", () => {
  setup();
});
