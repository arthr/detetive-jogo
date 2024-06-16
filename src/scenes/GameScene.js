import Phaser from 'phaser';
import { config } from '../config';
import Room from '../entities/room';
import Player from '../entities/player';
import Board from '../entities/board';
import { addDebugTilesLayer } from '../utils/debugTilesLayer'; // Importa a camada de depuração
import Pathfinding from '../utils/pathfinding';

const TILE_SIZE = config.tileSize;

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // Cria o tabuleiro
        this.board = new Board(this);

        // Cria a grid para pathfinding (0 = passável, 1 = obstáculo)
        const grid = this.createGrid();

        // Cria o pathfinding
        this.pathfinding = new Pathfinding(grid, TILE_SIZE);

        // Cria as salas
        this.rooms = config.rooms.map(roomConfig => new Room(this, roomConfig, TILE_SIZE));

        // Define a sala inicial do jogador
        const startRoomConfig = config.rooms.find(room => room.name === 'Restaurante'); // Ajuste o nome conforme necessário
        const startRoom = this.rooms.find(room => room.name === startRoomConfig.name);

        // Cria o jogador
        this.player = new Player(this, startRoom, TILE_SIZE);

        // Habilita interação com o mouse
        this.input.on('pointerdown', pointer => this.movePlayerTo(pointer));

        // Adiciona colisão entre o jogador e as salas
        this.rooms.forEach(room => {
            this.physics.add.collider(this.player.sprite, room.roomSprite, () => {
                const doorTiles = room.doors.map(door => ({
                    x: door.x * TILE_SIZE + TILE_SIZE / 2,
                    y: door.y * TILE_SIZE + TILE_SIZE / 2
                }));
                const playerX = Math.floor(this.player.sprite.x);
                const playerY = Math.floor(this.player.sprite.y);
                const isOnDoor = doorTiles.some(tile => tile.x === playerX && tile.y === playerY);
                if (isOnDoor) {
                    this.player.enterRoom(room);
                }
            }, null, this);
        });

        // Adiciona a camada de depuração se estiver ativada
        if (config.debugTileLayer) {
            addDebugTilesLayer(this, this.rooms, TILE_SIZE);
        }
    }

    createGrid() {
        // Cria uma grid inicial onde 0 representa um tile passável e 1 representa um obstáculo
        const grid = [];
        for (let y = 0; y < this.scale.height / TILE_SIZE; y++) {
            const row = [];
            for (let x = 0; x < this.scale.width / TILE_SIZE; x++) {
                row.push(0); // Inicialmente, todos os tiles são passáveis
            }
            grid.push(row);
        }
        // Adicione lógica para marcar obstáculos (por exemplo, paredes, salas, etc.)
        return grid;
    }

    movePlayerTo(pointer) {
        const targetX = Math.floor(pointer.x / TILE_SIZE);
        const targetY = Math.floor(pointer.y / TILE_SIZE);
        const startX = Math.floor(this.player.sprite.x / TILE_SIZE);
        const startY = Math.floor(this.player.sprite.y / TILE_SIZE);

        const path = this.pathfinding.findPath({ x: startX, y: startY }, { x: targetX, y: targetY });

        if (path.length > 0) {
            const tweens = path.map((step, index) => ({
                targets: this.player.sprite,
                x: step.x * TILE_SIZE + TILE_SIZE / 2,
                y: step.y * TILE_SIZE + TILE_SIZE / 2,
                duration: 200,
                delay: index * 200
            }));

            this.tweens.timeline({ tweens });
        }
    }
}
