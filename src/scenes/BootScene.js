import Phaser from 'phaser';
import boardBackground from '../../assets/images/board.png';
import hospitalBackground from '../../assets/images/hospital.png';
import playerPiece from '../../assets/images/player.png';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        this.load.image('board', boardBackground);
        this.load.image('hospital', hospitalBackground);
        this.load.image('player', playerPiece);
    }

    create() {
        this.scene.start('GameScene');
    }
}
