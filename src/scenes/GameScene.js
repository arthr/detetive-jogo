import Phaser from 'phaser';
import { config } from '../config';
import Room from '../entities/room';
import Player from '../entities/player';
import Board from '../entities/board';
import { addDebugLayer } from '../utils/debugLayer'; // Importa a camada de depuração

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

        // Define a sala inicial do jogador
        const startRoomConfig = config.rooms.find(room => room.name === 'Restaurante'); // Ajuste o nome conforme necessário
        const startRoom = this.rooms.find(room => room.name === startRoomConfig.name);

        // Cria o jogador
        this.player = new Player(this, startRoom, TILE_SIZE);

        // Habilita interação com o mouse
        this.input.on('pointerdown', pointer => this.player.moveTo(pointer));

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

        // Adiciona a camada de depuração
        addDebugLayer(this, this.rooms, TILE_SIZE);
    }
}
