import Phaser from 'phaser';

const vertexShader = `
  precision mediump float;
  attribute vec2 inPosition;
  attribute vec2 inTexCoord;
  attribute float inTexId;
  attribute float inTintEffect;
  attribute vec4 inTint;
  uniform mat4 uProjectionMatrix;
  uniform vec2 uResolution;
  varying vec2 vTextureCoord;
  varying vec4 vTint;
  void main(void) {
    vTextureCoord = inTexCoord;
    vTint = inTint;
    gl_Position = uProjectionMatrix * vec4(inPosition, 0.0, 1.0);
  }
`;

const fragmentShader = `
  precision mediump float;
  varying vec2 vTextureCoord;
  varying vec4 vTint;
  uniform sampler2D uMainSampler;
  uniform float brightness;
  uniform vec3 tint;
  void main(void) {
    vec4 color = texture2D(uMainSampler, vTextureCoord);
    color.rgb += brightness;
    color.rgb *= tint;
    gl_FragColor = color * vTint;
  }
`;

export default class TintBrightnessPipeline extends Phaser.Renderer.WebGL.Pipelines.SinglePipeline {
  constructor(game) {
    super({
      game,
      renderer: game.renderer,
      fragShader: fragmentShader,
      vertShader: vertexShader,
      uniforms: [
        'uProjectionMatrix',
        'uMainSampler',
        'brightness',
        'tint'
      ]
    });
  }

  onBind() {
    //this.set1f('brightness', 0); // Ajusta o brilho
    this.set3f('tint', 0.92, 0.92, 0.92); // Ajusta a tonalidade (offwhite)
  }
}
