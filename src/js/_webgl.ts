
/**
 * WebGL の API を目的別にまとめたユーティリティクラス
 * @class
 */
export class WebGLUtility {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  currentProgram: WebGLProgram | null;
  beginTime: number;
  nowTime: number;
  attLocation: number[];
  attStride: number[];
  uniLocation:  (WebGLUniformLocation | null)[];
  uniType: ("uniform1i"
    | "uniform1f"
    | "uniform1fv"
    | "uniform2fv"
    | "uniform3fv"
    | "uniform4fv"
    | "uniformMatrix2fv"
    | "uniformMatrix3fv"
    | "uniformMatrix4fv")[]; // 全てではない
  position: number[];
  index: number[];
  vbo: WebGLBuffer[];
  ibo: WebGLBuffer | null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = this.canvas.getContext('webgl');
    if(gl === null){
      throw new Error('webgl not supported');
    }
    this.gl = gl;
    this.currentProgram = null;
    this.beginTime = 0;
    this.nowTime = 0;

    this.attLocation = []
    this.attStride = []
    this.uniLocation = []
    this.uniType = []

    this.position = []
    this.index = []
    this.vbo = []
    this.ibo = null;
  }
  /**
   * ファイルをテキストとして開く
   * @static
   * @param {string} path - 読み込むファイルのパス
   * @return {Promise}
   */
  static loadFile(path: string){
    return new Promise((resolve, reject) => {
      // fetch を使ってファイルにアクセスする
      fetch(path)
        .then((res) => {
          // テキストとして処理する
          return res.text();
        })
        .then((text) => {
          // テキストを引数に Promise を解決する
          resolve(text);
        })
        .catch((err) => {
          // なんらかのエラー
          reject(err);
        });
    });
  }

  set width(w){
    this.canvas.width = w;
  }
  get width(){
    return this.canvas.width;
  }
  set height(h){
    this.canvas.height = h;
  }
  get height(){
    return this.canvas.height;
  }

  loadShader(pathArray: string[]){
    const promises = pathArray.map((path) => {
      return fetch(path).then((response) => {return response.text();})
    });
    return Promise.all(promises);
  }

  set program(prg){
    // gl.useProgram で利用するプログラムオブジェクトを設定できる
    this.gl.useProgram(prg);
    // あとで取り出すこともできるようプロパティに保持しておく
    this.currentProgram = prg;
  }
  get program(){
    return this.currentProgram;
  }

  createShaderObject(source: string, type: "VERTEX_SHADER" | "FRAGMENT_SHADER"){
    const gl = this.gl;
    // 空のシェーダオブジェクトを生成する
    const shader = gl.createShader(gl[type]);
    if (shader === null) {
      throw new Error();
    }
    // シェーダオブジェクトにソースコードを割り当てる
    gl.shaderSource(shader, source);
    // シェーダをコンパイルする
    gl.compileShader(shader);
    // コンパイル後のステータスを確認し問題なければシェーダオブジェクトを返す
    if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    }
    const infoLog = gl.getShaderInfoLog(shader)
    throw new Error(`${infoLog}`);
  }

  createProgramObject(vs: WebGLShader, fs: WebGLShader){
    const gl = this.gl;
    // 空のプログラムオブジェクトを生成する
    const program = gl.createProgram();
    if (program === null) {
      throw new Error();
    }
    // ２つのシェーダをアタッチ（関連付け）する
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    // シェーダオブジェクトをリンクする
    gl.linkProgram(program);
    // リンクが完了するとシェーダオブジェクトは不要になるので削除する
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    // リンク後のステータスを確認し問題なければプログラムオブジェクトを返す
    if(gl.getProgramParameter(program, gl.LINK_STATUS)){
      gl.useProgram(program);
      return program;
    }
    const infoLog = gl.getProgramInfoLog(program)
    throw new Error(`${infoLog}`);

  }

  createVBO(vertexArray: number[]){
    const gl = this.gl;
    // 空のバッファオブジェクトを生成する
    const vbo = gl.createBuffer();
    if (vbo === null) {
      throw new Error();
    }
    // バッファを gl.ARRAY_BUFFER としてバインドする
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    // バインドしたバッファに Float32Array オブジェクトに変換した配列を設定する
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
    // 安全のために最後にバインドを解除してからバッファオブジェクトを返す
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
  }
  createIBO(indexArray: number[]){
    const gl = this.gl;
    // 空のバッファオブジェクトを生成する
    const ibo = gl.createBuffer();
    if (ibo === null) {
      throw new Error();
    }
    // バッファを gl.ELEMENT_ARRAY_BUFFER としてバインドする
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    // バインドしたバッファに Float32Array オブジェクトに変換した配列を設定する
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(indexArray), gl.STATIC_DRAW);
    // 安全のために最後にバインドを解除してからバッファオブジェクトを返す
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
  }
  enableAttribute(vbo: WebGLBuffer[], attLocation: GLint[], attStride: number[], ibo: WebGLBuffer){
    const gl = this.gl;
    vbo.forEach((buffer, index) => {
      // 有効化したいバッファをまずバインドする
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      // 頂点属性ロケーションの有効化を行う
      gl.enableVertexAttribArray(attLocation[index]);
      // 対象のロケーションのストライドやデータ型を設定する
      gl.vertexAttribPointer(attLocation[index], attStride[index], gl.FLOAT, false, 0, 0);
    });
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  }
  setUniform(value: (number | number[])[], uniL: (WebGLUniformLocation | null)[], uniT: string[]){
    const gl = this.gl;
    value.forEach((v, index) => {
      const type = uniT[index];
      // @ts-ignore
      gl[type](uniL[index], v);
    });
  }


  // /**
  //  * テクスチャ用のリソースからテクスチャを生成する
  //  * @param {string} resource - Image や Canvas などのテクスチャ用リソース
  //  * @return {WebGLTexture}
  //  */
  // createTexture(resource){
  //   const gl = this.gl;
  //   // テクスチャオブジェクトを生成
  //   const texture = gl.createTexture();
  //   // アクティブなテクスチャユニット番号を指定する
  //   gl.activeTexture(gl.TEXTURE0);
  //   // テクスチャをアクティブなユニットにバインドする
  //   gl.bindTexture(gl.TEXTURE_2D, texture);
  //   // バインドしたテクスチャにデータを割り当て（ここで画像のロードが完了している必要がある）
  //   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, resource);
  //   // ミップマップを自動生成する
  //   gl.generateMipmap(gl.TEXTURE_2D);
  //   // テクスチャパラメータを設定する
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  //   // 安全の為にテクスチャのバインドを解除してから返す
  //   gl.bindTexture(gl.TEXTURE_2D, null);
  //   return texture;
  // }
  // /**
  //  * キューブマップテクスチャを非同期に生成する Promise を返す
  //  * @param {Array.<string>} source - 読み込む画像のパスの配列
  //  * @param {Array.<number>} target - 画像にそれぞれ対応させるターゲット定数の配列
  //  * @return {Promise} テクスチャを引数に渡して解決する Promise
  //  */
  // createCubeTextureFromFile(source, target){
  //   return new Promise((resolve) => {
  //     const gl = this.gl;
  //     // テクスチャオブジェクトを生成
  //     const texture = gl.createTexture();
  //     // アクティブなテクスチャユニット番号を指定する
  //     gl.activeTexture(gl.TEXTURE0);
  //     // テクスチャをアクティブなユニットにキューブテクスチャとしてバインドする
  //     gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
  //
  //     // 画像を個々に読み込む Promise を生成し配列に入れておく
  //     const promises = source.map((src, index) => {
  //       // 画像の読み込みが完了し、テクスチャに画像を割り当てたら解決する Promise
  //       return new Promise((loadedResolve) => {
  //         // 空の画像オブジェクト
  //         const img = new Image();
  //         // ロード完了時の処理を先に登録
  //         img.addEventListener('load', () => {
  //           // 読み込んだ画像をテクスチャに割り当てる
  //           gl.texImage2D(target[index], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  //           // Promise を解決する
  //           loadedResolve();
  //         }, false);
  //         // 画像のソースを設定
  //         img.src = src;
  //       });
  //     });
  //
  //     // すべての Promise を一気に実行する
  //     Promise.all(promises)
  //       .then(() => {
  //         // ミップマップを自動生成する
  //         gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  //         // テクスチャパラメータを設定する
  //         gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  //         gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  //         gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  //         gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  //         // 安全の為にテクスチャのバインドを解除してから Promise を解決する
  //         gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
  //         // Promise を解決する際、生成したテクスチャを引数から返す
  //         resolve(texture);
  //       });
  //   });
  // }
  // /**
  //  * フレームバッファを生成する
  //  * @param {number} width - フレームバッファの幅
  //  * @param {number} height - フレームバッファの高さ
  //  * @return {object}
  //  * @property {WebGLFramebuffer} framebuffer - フレームバッファオブジェクト
  //  * @property {WebGLRenderbuffer} depthRenderBuffer - 深度バッファ用のレンダーバッファ
  //  * @property {WebGLTexture} texture - カラーバッファ用のテクスチャオブジェクト
  //  */
  // createFramebuffer(width, height){
  //   const gl = this.gl;
  //
  //   const framebuffer       = gl.createFramebuffer();  // フレームバッファ
  //   const depthRenderBuffer = gl.createRenderbuffer(); // レンダーバッファ
  //   const texture           = gl.createTexture();      // テクスチャ
  //   // フレームバッファをバインド
  //   gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  //   // レンダーバッファをバインド
  //   gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
  //   // レンダーバッファを深度バッファとして設定する
  //   gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
  //   // フレームバッファにレンダーバッファを関連付けする
  //   gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
  //   // テクスチャをユニット０にバインド
  //   gl.activeTexture(gl.TEXTURE0);
  //   gl.bindTexture(gl.TEXTURE_2D, texture);
  //   // テクスチャにサイズなどを設定する（ただし中身は null）
  //   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  //   // テクスチャパラメータを設定
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  //   // フレームバッファにテクスチャを関連付けする
  //   gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  //   // すべてのオブジェクトは念の為バインドを解除しておく
  //   gl.bindTexture(gl.TEXTURE_2D, null);
  //   gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  //   gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  //   // 各オブジェクトを、JavaScript のオブジェクトに格納して返す
  //   return {
  //     framebuffer: framebuffer,
  //     depthRenderbuffer: depthRenderBuffer,
  //     texture: texture
  //   };
  // }
  // /**
  //  * 浮動小数点テクスチャのフレームバッファを生成する
  //  * @param {number} width - フレームバッファの幅
  //  * @param {number} height - フレームバッファの高さ
  //  * @return {object}
  //  * @property {WebGLFramebuffer} framebuffer - フレームバッファオブジェクト
  //  * @property {WebGLTexture} texture - カラーバッファ用のテクスチャオブジェクト
  //  */
  // createFramebufferFloat(width, height, format, type){
  //   const gl = this.gl;
  //
  //   const textureFormat = format || gl.RGBA32F;
  //   const textureType = type || gl.FLOAT;
  //
  //   const framebuffer = gl.createFramebuffer(); // フレームバッファ
  //   const texture     = gl.createTexture();     // テクスチャ
  //   // フレームバッファをバインド
  //   gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  //   // テクスチャをユニット０にバインド
  //   gl.activeTexture(gl.TEXTURE0);
  //   gl.bindTexture(gl.TEXTURE_2D, texture);
  //   // 浮動小数点テクスチャとしてフォーマットやサイズなど設定する（ただし中身は null）
  //   gl.texImage2D(gl.TEXTURE_2D, 0, textureFormat, width, height, 0, gl.RGBA, textureType, null);
  //   // テクスチャパラメータを設定
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  //   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  //   // フレームバッファにテクスチャを関連付けする
  //   gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  //   // すべてのオブジェクトは念の為バインドを解除しておく
  //   gl.bindTexture(gl.TEXTURE_2D, null);
  //   gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  //   // 各オブジェクトを、JavaScript のオブジェクトに格納して返す
  //   return {
  //     framebuffer: framebuffer,
  //     texture: texture
  //   };
  // }
}
