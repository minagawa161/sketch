precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_red_x;
uniform float u_red_y;
uniform float u_red_time;
uniform float u_red_static;
uniform float u_green_x;
uniform float u_green_y;
uniform float u_green_time;
uniform float u_green_static;
uniform float u_blue_x;
uniform float u_blue_y;
uniform float u_blue_time;
uniform float u_blue_static;

// webgl-noise
// Description : Array and textureless GLSL 2D/3D/4D simplex noise functions.
//      Author : Ian McEwan,Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20201014(stegu)
//     License : Copyright(C)2011 Ashima Arts.All rights reserved.
//               Distributed under the MIT License.See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise

vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2, p2),dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m = m * m;
  return 105.0 * dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

float rgb_static = 255.0;

void main(){
  vec2 st = gl_FragCoord.xy / max(u_resolution.x, u_resolution.y);

  vec3 red = vec3(u_red_x, u_red_y, u_time * u_red_time);
  vec3 green = vec3(u_green_x, u_green_y, u_time * u_green_time);
  vec3 blue = vec3(u_blue_x, u_blue_y, u_time * u_blue_time);

  float r = snoise(vec3(red.x * st.x, red.y * st.y, red.z));
  float g = snoise(vec3(green.x * st.x, green.y * st.y, green.z));
  float b = snoise(vec3(blue.x * st.x, blue.y * st.y, blue.z));

  // 0.0 〜 1.0に調整
  gl_FragColor = vec4(
    ((r + 1.0) / 2.0 * (rgb_static - u_red_static) + u_red_static) / rgb_static,
    ((g + 1.0) / 2.0 * (rgb_static - u_green_static) + u_green_static) / rgb_static,
    ((b + 1.0) / 2.0 * (rgb_static - u_blue_static) + u_blue_static) / rgb_static,
    1.0
  );
}
