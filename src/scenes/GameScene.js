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

        // Cria a grid para pathfinding (0 = caminho, 1 = obstáculo, 2 = porta, 3 = sala)
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
        // Cria uma grid inicial onde 0 representa um caminho, 1 representa um obstáculo, 2 representa uma porta, e 3 representa uma sala
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

        if (this.player.currentRoom) {
            // Se o jogador está dentro de uma sala, só pode sair através das portas
            if (targetTile === 2 && this.isDoorOfCurrentRoom(targetX, targetY)) {
                this.movePlayerTo({ x: targetX, y: targetY }, () => {
                    this.player.currentRoom = null;
                });
            }
        } else if (this.isPlayerOnDoor(startX, startY, targetX, targetY)) {
            // Se o jogador está fora da sala, pode mover para caminho ou entrar em uma sala através de uma porta
            if (targetTile === 3 || targetTile === 0) {
                this.movePlayerToRoom({ x: targetX, y: targetY });
            }
        } else {
            if (targetTile === 0 || targetTile === 2) {
                this.movePlayerTo({ x: targetX, y: targetY });
            }
        }
    }

    movePlayerTo(target, onComplete) {
        const startX = Math.floor(this.player.sprite.x / TILE_SIZE);
        const startY = Math.floor(this.player.sprite.y / TILE_SIZE);

        let path = this.pathfinding.findPath({ x: startX, y: startY }, target);
        console.log(startX, startY, target, path);

        // Verifica o limite de movimento, ignorando tiles dentro das salas
        const movementTiles = path.filter(step => this.pathfinding.grid[step.y][step.x] !== 3);
        console.log('Filtered Path (Movement Tiles):', movementTiles);

        if (movementTiles.length > config.maxMovement) {
            console.log(`Movimento excede o limite de ${config.maxMovement} tiles`);
            return;
        }

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

        this.tweens.addMultiple(tweens);
    }

    movePlayerToRoom(target) {
        // Mover jogador para dentro da sala
        const room = this.rooms.find(room => {
            return target.x >= room.x && target.x < room.x + room.width &&
                target.y >= room.y && target.y < room.y + room.height;
        });

        if (room && this.isPlayerOnDoor(Math.floor(this.player.sprite.x / TILE_SIZE), Math.floor(this.player.sprite.y / TILE_SIZE), target.x, target.y)) {
            const targetX = (room.x + room.width / 2) * TILE_SIZE;
            const targetY = (room.y + room.height / 2) * TILE_SIZE;

            this.tweens.add({
                targets: this.player.sprite,
                x: targetX,
                y: targetY,
                duration: 200,
                ease: 'Linear'
            });

            this.player.currentRoom = room;
        }
    }

    isPlayerOnDoor(playerX, playerY, targetX, targetY) {
        const targetRoom = this.rooms.find(room => {
            return targetX >= room.x && targetX < room.x + room.width &&
                targetY >= room.y && targetY < room.y + room.height;
        });

        if (!targetRoom) return false;

        return targetRoom.doors.some(door => door.x === playerX && door.y === playerY);
    }

    isDoorOfCurrentRoom(targetX, targetY) {
        const room = this.player.currentRoom;
        if (!room) return false;
        return room.doors.some(door => door.x === targetX && door.y === targetY);
    }

    addDebugPathfindingLayer() {
        const graphics = this.add.graphics();

        // Desenha os caminhos, obstáculos e portas
        for (let y = 0; y < this.pathfinding.grid.length; y++) {
            for (let x = 0; x < this.pathfinding.grid[y].length; x++) {
                const tile = this.pathfinding.grid[y][x];
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
                    this.add.text(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2, tile, {
                        fontSize: '12px',
                        color: '#ffffff',
                        align: 'center'
                    }).setOrigin(0.5);
                }
            }
        }

        // Desenha as salas como blocos únicos
        this.rooms.forEach(room => {
            graphics.fillStyle(0x0000ff, 0.5); // Cor para as salas
            graphics.fillRect(room.x * TILE_SIZE, room.y * TILE_SIZE, room.width * TILE_SIZE, room.height * TILE_SIZE);

            // Adiciona o número do tipo do tile no centro da sala
            this.add.text(
                (room.x + room.width / 2) * TILE_SIZE,
                (room.y + room.height / 2) * TILE_SIZE,
                '3',
                { fontSize: '12px', color: '#ffffff', align: 'center' }
            ).setOrigin(0.5);
        });
    }
}
