import Phaser from 'phaser';
import BootScene from './scenes/BootScene';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#000',
  parent: 'game-container',
  scene: [BootScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth - 150,
    height: window.innerHeight - 100,
  }
};

const game = new Phaser.Game(config);
