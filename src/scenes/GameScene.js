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
        const grid = this.board.createGrid(this.rooms);

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
            this.board.addDebugPathfindingLayer(grid, this.rooms);
        }
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
        } else {
            // Se o jogador está fora da sala, pode mover para caminho ou entrar em uma sala através de uma porta
            if (targetTile === 0 || targetTile === 2) {
                this.movePlayerTo({ x: targetX, y: targetY });
            } else if (targetTile === 3 && this.isPlayerOnDoor(startX, startY, targetX, targetY)) {
                this.movePlayerToRoom({ x: targetX, y: targetY });
            }
        }
    }

    movePlayerTo(target, onComplete) {
        const startX = Math.floor(this.player.sprite.x / TILE_SIZE);
        const startY = Math.floor(this.player.sprite.y / TILE_SIZE);

        const path = this.pathfinding.findPath({ x: startX, y: startY }, target);
        console.log(startX, startY, target, path);

        // Filtra o caminho para ignorar tiles que estão dentro das salas
        const filteredPath = path.filter(step => this.pathfinding.grid[step.y][step.x] !== 3);
        console.log('Filtered Path:', filteredPath);

        // Verifica se o caminho encontrado excede o limite de movimento
        if (filteredPath.length > config.maxMovement) {
            console.log(`Movimento excede o limite de ${config.maxMovement} tiles`);
            return;
        }

        if (path.length > 0) {
            this.player.moveAlongPath(path, onComplete);
        }
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
}
