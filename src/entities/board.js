import Phaser from 'phaser';
import { config } from '../config';

const TILE_SIZE = config.tileSize;

export default class Board {
    constructor(scene) {
        this.scene = scene;
        this.tileSize = TILE_SIZE;
        this.createBoard();
        if (config.showCoordinates) {
            this.showTileCoordinates(config.coordinateColor);
        }
        if (config.showTileBorders) {
            this.showTileBorders(config.tileBorderColorNumber);
        }
    }

    createBoard() {
        // Desenha a grade do tabuleiro com a imagem de fundo para cada tile
        for (let y = 0; y < this.scene.scale.height / this.tileSize; y++) {
            for (let x = 0; x < this.scene.scale.width / this.tileSize; x++) {
                const tile = this.scene.add.image(
                    x * this.tileSize + this.tileSize / 2,
                    y * this.tileSize + this.tileSize / 2,
                    'tile-bg'
                ).setDisplaySize(this.tileSize, this.tileSize);

                // Aplica o pipeline ao tile
                tile.setPipeline('TintBrightness');
            }
        }
    }

    showTileCoordinates(color) {
        for (let y = 0; y < Math.floor(this.scene.scale.height / this.tileSize); y++) {
            for (let x = 0; x < Math.floor(this.scene.scale.width / this.tileSize); x++) {
                this.scene.add.text(
                    x * this.tileSize,
                    y * this.tileSize,
                    `(${x},${y})`,
                    { fontSize: '12px', fill: color }
                ).setOrigin(0, 0);
            }
        }
    }

    showTileBorders(color) {
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(1, color, 1);

        for (let y = 0; y < Math.floor(this.scene.scale.height / this.tileSize); y++) {
            for (let x = 0; x < Math.floor(this.scene.scale.width / this.tileSize); x++) {
                graphics.strokeRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
            }
        }
    }

    createGrid(rooms) {
        const grid = [];
        for (let y = 0; y < Math.ceil(this.scene.scale.height / TILE_SIZE); y++) {
            const row = [];
            for (let x = 0; x < Math.ceil(this.scene.scale.width / TILE_SIZE); x++) {
                row.push(0); // Inicialmente, todos os tiles são caminhos
            }
            grid.push(row);
        }

        // Marcar as salas e portas na grid
        rooms.forEach(room => {
            for (let y = 0; y < room.height; y++) {
                for (let x = 0; x < room.width; x++) {
                    const gridX = room.x + x;
                    const gridY = room.y + y;
                    if (this.isValidTile(gridX, gridY)) {
                        grid[gridY][gridX] = 3; // Marca como sala
                    }
                }
            }
            room.doors.forEach(door => {
                if (this.isValidTile(door.x, door.y)) {
                    grid[door.y][door.x] = 2; // Marca as portas como passáveis
                }
            });
        });

        console.log('Grid:', grid);

        return grid;
    }

    isValidTile(x, y) {
        return x >= 0 && x < Math.ceil(this.scene.scale.width / TILE_SIZE) && y >= 0 && y < Math.ceil(this.scene.scale.height / TILE_SIZE);
    }

    addDebugPathfindingLayer(grid, rooms) {
        const graphics = this.scene.add.graphics();

        // Desenha os caminhos, obstáculos e portas
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                const tile = grid[y][x];
                let color;
                switch (tile) {
                    case 0: color = 0x00ff00; break; // Caminho
                    case 1: color = 0xff0000; break; // Obstáculo
                    case 2: color = 0xffff00; break; // Porta
                }
                graphics.fillStyle(color, 0.5);
                graphics.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

                // Adiciona o número do tipo do tile no centro se não for uma sala
                if (tile !== 3) {
                    this.scene.add.text(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, tile, {
                        fontSize: '12px',
                        color: '#ffffff',
                        align: 'center'
                    }).setOrigin(0.5);
                }
            }
        }

        // Desenha as salas como blocos únicos
        rooms.forEach(room => {
            graphics.fillStyle(0x0000ff, 0.5); // Cor para as salas
            graphics.fillRect(room.x * TILE_SIZE, room.y * TILE_SIZE, room.width * TILE_SIZE, room.height * TILE_SIZE);

            // Adiciona o número do tipo do tile no centro da sala
            this.scene.add.text(
                (room.x + room.width / 2) * TILE_SIZE,
                (room.y + room.height / 2) * TILE_SIZE,
                '3',
                { fontSize: '12px', color: '#ffffff', align: 'center' }
            ).setOrigin(0.5);
        });
    }
}
