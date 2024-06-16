import Phaser from 'phaser';
import { config } from '../config';

const TILE_SIZE = config.tileSize;

export default class Player {
    constructor(scene, startRoom, tileSize) {
        this.scene = scene;
        this.tileSize = tileSize;
        this.sprite = this.scene.physics.add.sprite(
            (startRoom.x + (startRoom.width / 2)) * tileSize,
            (startRoom.y + (startRoom.height / 2)) * tileSize,
            'player'
        );
        this.currentRoom = startRoom;
    }

    moveAlongPath(path, onComplete) {
        const tweens = [];

        path.forEach((step, index) => {
            tweens.push(this.scene.tweens.add({
                targets: this.sprite,
                x: step.x * TILE_SIZE + TILE_SIZE / 2,
                y: step.y * TILE_SIZE + TILE_SIZE / 2,
                duration: 200,
                ease: 'Linear',
                delay: index * 200,
                onComplete: index === path.length - 1 ? onComplete : undefined
            }));
        });

        this.scene.tweens.addMultiple(tweens);
    }
}
