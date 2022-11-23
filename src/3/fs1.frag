precision mediump float;
uniform vec2 resolution; // 算出した解像度
uniform float time;
uniform vec2 mouse;
varying vec2  vTexCoord; // 参考のために入れているだけ
uniform float xScale;
uniform float yScale;
uniform float zScale;

#define PI 3.14159265359

float plot(vec2 st, float pct){
  return smoothstep( pct - 0.02, pct, st.y) - smoothstep( pct, pct + 0.02, st.y);
}

void main(){
  // gl_FragCoord　フラグメントシェーダが実行されているピクセル位置
  // -1 ~ 1の正規化された空間に変換
//  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / max(resolution.x, resolution.y); // (-1, -1) ~ (1, 1)
//  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y); // (-1, -1) ~ (1, 1)
  vec2 st = (gl_FragCoord.xy * 2.0 - resolution) / resolution;

  // float x = pow(st.x, 2.0);
 float x =(sqrt(st.x));
//  float x = step(.5, st.x);
//  float x = smoothstep(0.0, 0.2, st.x);
//  float x = smoothstep(0.2,0.5,st.x) - smoothstep(0.5,0.8,st.x);
//  float x = smoothstep(0.2,0.5,st.x) - smoothstep(0.5,0.8,st.x);
//  float x = ceil(sin(st.x + time)) + floor(sin(st.x + time));
//  float x = mod(st.x, 1.0);
//  float x = fract(st.x);

  vec3 color = vec3(x);

  // plot a line
  float pct = plot(st, x);
  color = ( 1.0 - pct ) * color + pct * vec3(0.0,1.0,0.0);

  gl_FragColor = vec4(color, 1.0);


//  if (st.x < -1.0 || st.x > 1.0) {
//    gl_FragColor = vec4(vec3(0.0), 1.0);
//  }
}

