import Phaser from 'phaser';
import { config } from '../config';

const TILE_SIZE = config.tileSize;

export default class Board {
    constructor(scene) {
        this.scene = scene;
        this.tileSize = TILE_SIZE;
        this.createBoard();
        if (config.showCoordinates) {
            this.showTileCoordinates();
        }
        if (config.showTileBorders) {
            this.showTileBorders();
        }
    }

    createBoard() {
        this.scene.add.tileSprite(0, 0, this.scene.scale.width, this.scene.scale.height, 'board').setOrigin(0, 0);
    }

    showTileCoordinates() {
        for (let y = 0; y < Math.floor(this.scene.scale.height / this.tileSize); y++) {
            for (let x = 0; x < Math.floor(this.scene.scale.width / this.tileSize); x++) {
                this.scene.add.text(
                    x * this.tileSize,
                    y * this.tileSize,
                    `(${x},${y})`,
                    { fontSize: '12px', fill: '#fff' }
                ).setOrigin(0, 0);
            }
        }
    }

    showTileBorders() {
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(1, 0x000000, 0.3);

        for (let y = 0; y < Math.floor(this.scene.scale.height / this.tileSize); y++) {
            for (let x = 0; x < Math.floor(this.scene.scale.width / this.tileSize); x++) {
                graphics.strokeRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
            }
        }
    }
}
