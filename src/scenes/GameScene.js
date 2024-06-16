import Phaser from 'phaser';
import { config } from '../config';
import Room from '../entities/room';
import Player from '../entities/player';
import Board from '../entities/board';
import Pathfinding from '../utils/pathfinding';

const TILE_SIZE = config.tileSize;

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // Cria o tabuleiro
        this.board = new Board(this);

        // Cria as salas
        this.rooms = config.rooms.map(roomConfig => new Room(this, roomConfig, TILE_SIZE));

        // Cria a grid para pathfinding (0 = caminho, 1 = sala, 2 = porta)
        const grid = this.createGrid();

        // Cria o pathfinding
        this.pathfinding = new Pathfinding(grid, TILE_SIZE);

        // Define a sala inicial do jogador
        const startRoomConfig = config.rooms.find(room => room.name === 'Restaurante'); // Ajuste o nome conforme necessário
        const startRoom = this.rooms.find(room => room.name === startRoomConfig.name);

        // Cria o jogador
        this.player = new Player(this, startRoom, TILE_SIZE);

        // Habilita interação com o mouse
        this.input.on('pointerdown', pointer => this.handlePointerDown(pointer));

        // Adiciona a camada de depuração do pathfinding se estiver ativada
        if (config.debugPathfinding) {
            this.addDebugPathfindingLayer();
        }
    }

    createGrid() {
        // Cria uma grid inicial onde 0 representa um caminho, 1 representa uma sala, e 2 representa uma porta
        const grid = [];
        for (let y = 0; y < Math.ceil(this.scale.height / TILE_SIZE); y++) {
            const row = [];
            for (let x = 0; x < Math.ceil(this.scale.width / TILE_SIZE); x++) {
                row.push(0); // Inicialmente, todos os tiles são caminhos
            }
            grid.push(row);
        }

        // Marcar as salas e portas na grid
        this.rooms.forEach(room => {
            for (let y = room.y; y < room.y + room.height; y++) {
                for (let x = room.x; x < room.x + room.width; x++) {
                    if (this.isValidTile(x, y)) {
                        grid[y][x] = 1; // Marca como sala
                    }
                }
            }
            room.doors.forEach(door => {
                if (this.isValidTile(door.x, door.y)) {
                    grid[door.y][door.x] = 2; // Marca as portas como passáveis
                }
            });
        });

        return grid;
    }

    // Função para verificar se um tile é válido dentro da grid
    isValidTile(x, y) {
        return x >= 0 && x < Math.ceil(this.scale.width / TILE_SIZE) && y >= 0 && y < Math.ceil(this.scale.height / TILE_SIZE);
    }

    handlePointerDown(pointer) {
        const targetX = Math.floor(pointer.x / TILE_SIZE);
        const targetY = Math.floor(pointer.y / TILE_SIZE);
        const startX = Math.floor(this.player.sprite.x / TILE_SIZE);
        const startY = Math.floor(this.player.sprite.y / TILE_SIZE);

        const targetTile = this.pathfinding.grid[targetY] && this.pathfinding.grid[targetY][targetX];

        if (targetTile === 0 || targetTile === 2) { // Caminho ou porta
            this.movePlayerTo({ x: targetX, y: targetY });
        }
    }

    movePlayerTo(target, onComplete) {
        const startX = Math.floor(this.player.sprite.x / TILE_SIZE);
        const startY = Math.floor(this.player.sprite.y / TILE_SIZE);

        const path = this.pathfinding.findPath({ x: startX, y: startY }, target);

        if (path.length > 0) {
            this.moveAlongPath(path, onComplete);
        }
    }

    moveAlongPath(path, onComplete) {
        const tweens = [];

        path.forEach((step, index) => {
            tweens.push(this.tweens.add({
                targets: this.player.sprite,
                x: step.x * TILE_SIZE + TILE_SIZE / 2,
                y: step.y * TILE_SIZE + TILE_SIZE / 2,
                duration: 200,
                ease: 'Linear',
                delay: index * 200,
                onComplete: index === path.length - 1 ? onComplete : undefined
            }));
        });
    }

    addDebugPathfindingLayer() {
        const graphics = this.add.graphics();

        for (let y = 0; y < this.pathfinding.grid.length; y++) {
            for (let x = 0; x < this.pathfinding.grid[y].length; x++) {
                const tile = this.pathfinding.grid[y][x];
                let color;
                switch (tile) {
                    case 0: color = 0x00ff00; break; // Caminho
                    case 1: color = 0x0000ff; break; // Sala
                    case 2: color = 0xffff00; break; // Porta
                }
                graphics.fillStyle(color, 0.5);
                graphics.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}
