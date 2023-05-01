attribute vec3  position;
varying   vec2  vTexCoord;

void main(){
    // テクスチャ座標に相当する値は頂点座標から算出できる
    vTexCoord = position.xy * 0.5 + 0.5; // 0 ~ 1

    gl_Position = vec4(position, 1.0);
}
