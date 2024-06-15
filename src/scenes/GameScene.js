import Phaser from 'phaser';
import { config } from '../config';
import Room from '../entities/room';
import Player from '../entities/player';

const TILE_SIZE = config.tileSize;

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'board').setOrigin(0, 0);

        // Cria as salas
        this.rooms = config.rooms.map(roomConfig => new Room(this, roomConfig, TILE_SIZE));

        // Cria o jogador
        this.player = new Player(this, 1, 1, TILE_SIZE);

        // Habilita interação com o mouse
        this.input.on('pointerdown', pointer => this.player.moveTo(pointer));

        // Mostra as coordenadas e bordas dos tiles se a opção estiver ativada no config
        if (config.showCoordinates) {
            this.showTileCoordinates();
        }
        if (config.showTileBorders) {
            this.showTileBorders();
        }
    }

    showTileCoordinates() {
        for (let y = 0; y < Math.floor(this.scale.height / TILE_SIZE); y++) {
            for (let x = 0; x < Math.floor(this.scale.width / TILE_SIZE); x++) {
                this.add.text(
                    x * TILE_SIZE,
                    y * TILE_SIZE,
                    `(${x},${y})`,
                    { fontSize: '12px', fill: '#fff' }
                ).setOrigin(0, 0);
            }
        }
    }

    showTileBorders() {
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0xffffff, 0.3);

        for (let y = 0; y < Math.floor(this.scale.height / TILE_SIZE); y++) {
            for (let x = 0; x < Math.floor(this.scale.width / TILE_SIZE); x++) {
                graphics.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}
