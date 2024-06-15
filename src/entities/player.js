import Phaser from 'phaser';

export default class Player {
    constructor(scene, startRoom, tileSize) {
        this.scene = scene;
        this.tileSize = tileSize;
        this.currentRoom = startRoom; // Define a sala inicial do jogador
        this.sprite = this.scene.physics.add.sprite(
            startRoom.roomSprite.x + (startRoom.roomSprite.displayWidth / 2),
            startRoom.roomSprite.y + (startRoom.roomSprite.displayHeight / 2),
            'player'
        ).setOrigin(0.5, 0.5);
    }

    moveTo(pointer) {
        const targetX = Math.floor(pointer.x / this.tileSize) * this.tileSize;
        const targetY = Math.floor(pointer.y / this.tileSize) * this.tileSize;

        const deltaX = Math.abs(targetX - this.sprite.x);
        const deltaY = Math.abs(targetY - this.sprite.y);

        console.log(`Trying to move to: (${targetX}, ${targetY})`);
        console.log(`Current position: (${this.sprite.x}, ${this.sprite.y})`);
        console.log(`Current room: ${this.currentRoom ? this.currentRoom.name : 'None'}`);

        // Check if player is in a room
        if (this.currentRoom) {
            const doorTiles = this.currentRoom.doors.map(door => ({
                x: door.x * this.tileSize,
                y: door.y * this.tileSize
            }));

            // Allow movement only to doors or secret passage
            const canMoveToDoor = doorTiles.some(tile => tile.x === targetX && tile.y === targetY);
            const canMoveToSecretPassage = this.currentRoom.secretPassage &&
                targetX === this.currentRoom.secretPassage.x * this.tileSize &&
                targetY === this.currentRoom.secretPassage.y * this.tileSize;

            if (canMoveToDoor || canMoveToSecretPassage) {
                this.scene.tweens.add({
                    targets: this.sprite,
                    x: targetX + this.tileSize / 2,
                    y: targetY + this.tileSize / 2,
                    duration: 300,
                    ease: 'Power2',
                    onComplete: () => {
                        if (canMoveToSecretPassage) {
                            this.useSecretPassage();
                        }
                    }
                });
            }
        } else {
            // Allow movement only of one tile at a time in vertical or horizontal direction
            if ((deltaX === this.tileSize && deltaY === 0) || (deltaY === this.tileSize && deltaX === 0)) {
                this.scene.tweens.add({
                    targets: this.sprite,
                    x: targetX + this.tileSize / 2,
                    y: targetY + this.tileSize / 2,
                    duration: 300,
                    ease: 'Power2',
                });
            }
        }
    }

    enterRoom(room) {
        console.log(`Entered room: ${room.name}`);
        this.currentRoom = room;
    }

    leaveRoom() {
        console.log('Left room');
        this.currentRoom = null;
    }

    useSecretPassage() {
        if (this.currentRoom && this.currentRoom.secretPassage) {
            const destinationRoom = this.scene.rooms.find(room => room.name === this.currentRoom.secretPassage.destination);
            if (destinationRoom) {
                const passage = destinationRoom.secretPassage;
                this.sprite.setPosition(passage.x * this.tileSize + this.tileSize / 2, passage.y * this.tileSize + this.tileSize / 2);
                this.currentRoom = destinationRoom;
                console.log(`Used secret passage to: ${destinationRoom.name}`);
            }
        }
    }
}
