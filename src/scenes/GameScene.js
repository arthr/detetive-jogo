import Phaser from 'phaser';
import { config } from '../config';
import Room from '../entities/room';
import Player from '../entities/player';
import Board from '../entities/board';

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

        // Cria o jogador
        this.player = new Player(this, 1, 1, TILE_SIZE);

        // Habilita interação com o mouse
        this.input.on('pointerdown', pointer => this.player.moveTo(pointer));
    }
}
