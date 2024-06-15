import Phaser from 'phaser';

export default class Player {
    constructor(scene, x, y, tileSize) {
        this.scene = scene;
        this.tileSize = tileSize;
        this.sprite = this.scene.physics.add.sprite(x * this.tileSize, y * this.tileSize, 'player').setOrigin(0.5, 0.5);
    }

    moveTo(pointer) {
        const targetX = Math.floor(pointer.x / this.tileSize) * this.tileSize;
        const targetY = Math.floor(pointer.y / this.tileSize) * this.tileSize;

        this.scene.tweens.add({
            targets: this.sprite,
            x: targetX + this.tileSize / 2,
            y: targetY + this.tileSize / 2,
            duration: 300,
            ease: 'Power2',
        });
    }
}
