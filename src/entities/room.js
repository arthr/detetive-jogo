import Phaser from 'phaser';

export default class Room {
    constructor(scene, roomConfig, tileSize) {
        this.scene = scene;
        this.tileSize = tileSize;
        this.name = roomConfig.name;
        this.width = roomConfig.width;
        this.height = roomConfig.height;
        this.x = roomConfig.x;
        this.y = roomConfig.y;
        this.doors = roomConfig.doors;
        this.secretPassage = roomConfig.secretPassage;
        this.createRoom(roomConfig);
    }

    createRoom(roomConfig) {
        // Cria a sala usando a imagem
        this.roomSprite = this.scene.physics.add.staticImage(
            roomConfig.x * this.tileSize,
            roomConfig.y * this.tileSize,
            roomConfig.image
        ).setOrigin(0, 0).setDisplaySize(roomConfig.width * this.tileSize, roomConfig.height * this.tileSize);

        // Define áreas de colisão para a sala
        this.roomSprite.body.setSize(roomConfig.width * this.tileSize, roomConfig.height * this.tileSize);
        this.roomSprite.body.setOffset(0, 0);
        this.roomSprite.body.immovable = true;
        this.roomSprite.body.moves = false;

        // Cria as portas
        roomConfig.doors.forEach(door => {
            this.scene.add.rectangle(
                door.x * this.tileSize,
                door.y * this.tileSize,
                this.tileSize,
                this.tileSize,
                0xff0000,
                0.5
            ).setOrigin(0, 0);
        });
    }
}
