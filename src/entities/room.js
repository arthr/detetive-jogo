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
        this.roomSprite = this.scene.add.image(
            roomConfig.x * this.tileSize,
            roomConfig.y * this.tileSize,
            roomConfig.image
        ).setOrigin(0, 0).setDisplaySize(roomConfig.width * this.tileSize, roomConfig.height * this.tileSize);

        // Adiciona uma colisão invisível para a sala
        this.roomCollider = this.scene.physics.add.staticImage(
            roomConfig.x * this.tileSize,
            roomConfig.y * this.tileSize,
            null
        ).setOrigin(0, 0).setDisplaySize(roomConfig.width * this.tileSize, roomConfig.height * this.tileSize).setVisible(false);

        // Define áreas de colisão para a sala
        this.roomCollider.body.setSize(roomConfig.width * this.tileSize, roomConfig.height * this.tileSize);
        this.roomCollider.body.setOffset(0, 0);
        this.roomCollider.body.immovable = true;
        this.roomCollider.body.moves = false;

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
