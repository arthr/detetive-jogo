import Phaser from 'phaser';
import TintBrightnessPipeline from '../pipelines/TintBrightnessPipeline';
import playerPiece from '../../assets/images/player.png';
import tileBackground from '../../assets/images/tile.png';
import boardBackground from '../../assets/images/board.png';
import hospitalBackground from '../../assets/images/hospital.png';
import restauranteBackground from '../../assets/images/restaurante.png';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        this.load.image('board', boardBackground);
        this.load.image('hospital', hospitalBackground);
        this.load.image('restaurante', restauranteBackground);
        this.load.image('player', playerPiece);
        this.load.image('tile-bg', tileBackground);
    }

    create() {
        this.scene.start('GameScene');
        // Registrando o pipeline customizado
        this.game.renderer.pipelines.add('TintBrightness', new TintBrightnessPipeline(this.game));
    }
}
