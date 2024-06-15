import Phaser from 'phaser';
import { config } from '../config';

const TILE_SIZE = config.tileSize;

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // Adiciona o tabuleiro como uma tileSprite
        this.board = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'board').setOrigin(0, 0);

        // Adiciona uma peça de jogador como exemplo na posição inicial (1, 1) do grid
        this.player = this.add.sprite(config.tileSize / 2, config.tileSize / 2, 'player');

        // Habilita interação com o mouse
        this.input.on('pointerdown', this.movePlayer, this);

        // Define as áreas das salas
        this.defineRooms();
    }

    defineRooms() {
        this.rooms = this.physics.add.staticGroup();  // Grupo para as salas estáticas

        config.rooms.forEach(room => {
            // Cria a sala usando a imagem
            const roomSprite = this.rooms.create(
                room.x * TILE_SIZE,
                room.y * TILE_SIZE,
                room.image
            ).setOrigin(0, 0).setDisplaySize(room.width * TILE_SIZE, room.height * TILE_SIZE);

            // Define áreas de colisão para a sala
            this.physics.add.existing(roomSprite);
            roomSprite.body.setSize(room.width * TILE_SIZE, room.height * TILE_SIZE);
            roomSprite.body.setOffset(0, 0);
            roomSprite.body.immovable = true;
            roomSprite.body.moves = false;

            // Cria as portas
            room.doors.forEach(door => {
                this.add.rectangle(
                    door.x * TILE_SIZE,
                    door.y * TILE_SIZE,
                    TILE_SIZE,
                    TILE_SIZE,
                    0xff0000,
                    0.5
                ).setOrigin(0, 0);
            });
        });

        // Adiciona colisão entre o jogador e as salas
        this.physics.add.collider(this.player, this.rooms);
    }

    movePlayer(pointer) {
        // Converte coordenadas do mouse para o grid de 25x25
        const targetX = Math.floor(pointer.x / config.tileSize) * config.tileSize;
        const targetY = Math.floor(pointer.y / config.tileSize) * config.tileSize;

        // Move a peça do jogador para a célula clicada
        this.tweens.add({
            targets: this.player,
            x: targetX + this.player.width / 2,
            y: targetY + this.player.width / 2,
            duration: 300,
            ease: 'Power2',
        });
    }

    update() {
        // Lógica de atualização do jogo, se necessário
    }
}
