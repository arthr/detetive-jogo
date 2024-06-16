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
        console.log(`Player initialized in room: ${this.currentRoom.name}`);
    }

    moveTo(pointer) {
        const targetX = Math.floor(pointer.x / this.tileSize) * this.tileSize + this.tileSize / 2;
        const targetY = Math.floor(pointer.y / this.tileSize) * this.tileSize + this.tileSize / 2;

        const deltaX = Math.abs(targetX - this.sprite.x);
        const deltaY = Math.abs(targetY - this.sprite.y);

        console.log(`Trying to move to: (${targetX}, ${targetY})`);
        console.log(`Current position: (${this.sprite.x}, ${this.sprite.y})`);
        console.log(`Current room: ${this.currentRoom ? this.currentRoom.name : 'None'}`);

        if (this.currentRoom) {
            // Check if the player wants to move to a door tile to leave the room
            const doorTiles = this.currentRoom.doors.map(door => ({
                x: door.x * this.tileSize + this.tileSize / 2,
                y: door.y * this.tileSize + this.tileSize / 2
            }));

            const isMovingToDoor = doorTiles.some(tile => tile.x === targetX && tile.y === targetY);

            if (isMovingToDoor) {
                this.scene.tweens.add({
                    targets: this.sprite,
                    x: targetX,
                    y: targetY,
                    duration: 300,
                    ease: 'Power2',
                    onComplete: () => {
                        console.log(`Moved to door: (${targetX}, ${targetY})`);
                        this.leaveRoom();
                    }
                });
            }
        } else {
            // Allow movement only of one tile at a time in vertical or horizontal direction
            if ((deltaX === this.tileSize && deltaY === 0) || (deltaY === this.tileSize && deltaX === 0)) {
                this.scene.tweens.add({
                    targets: this.sprite,
                    x: targetX,
                    y: targetY,
                    duration: 300,
                    ease: 'Power2',
                    onComplete: () => {
                        console.log(`Moved to: (${targetX}, ${targetY})`);

                        // Check if the player clicked on a room area while standing on a door tile
                        this.scene.rooms.forEach(room => {
                            const doorTiles = room.doors.map(door => ({
                                x: door.x * this.tileSize + this.tileSize / 2,
                                y: door.y * this.tileSize + this.tileSize / 2
                            }));
                            const isOnDoor = doorTiles.some(tile => tile.x === this.sprite.x && tile.y === this.sprite.y);
                            const clickedOnRoom = pointer.x >= room.roomSprite.x && pointer.x <= room.roomSprite.x + room.roomSprite.displayWidth &&
                                pointer.y >= room.roomSprite.y && pointer.y <= room.roomSprite.y + room.roomSprite.displayHeight;
                            if (isOnDoor && clickedOnRoom) {
                                this.enterRoom(room);
                            }
                        });
                    }
                });
            }
        }
    }

    enterRoom(room) {
        console.log(`Entered room: ${room.name}`);
        this.currentRoom = room;
        this.sprite.setPosition(
            room.roomSprite.x + room.roomSprite.displayWidth / 2,
            room.roomSprite.y + room.roomSprite.displayHeight / 2
        ); // Move player to the center of the room
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
