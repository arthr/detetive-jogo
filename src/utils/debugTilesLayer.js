export function addDebugTilesLayer(scene, rooms, tileSize) {
    const graphics = scene.add.graphics();
    graphics.lineStyle(1, 0x000000, 0.2); // Estilo de linha para a grade

    // Desenha os tiles
    for (let y = 0; y < scene.scale.height / tileSize; y++) {
        for (let x = 0; x < scene.scale.width / tileSize; x++) {
            const isDoorTile = rooms.some(room =>
                room.doors.some(door => door.x === x && door.y === y)
            );
            const isRoomTile = rooms.some(room =>
                x >= room.roomSprite.x / tileSize &&
                x < (room.roomSprite.x + room.roomSprite.displayWidth) / tileSize &&
                y >= room.roomSprite.y / tileSize &&
                y < (room.roomSprite.y + room.roomSprite.displayHeight) / tileSize
            );

            let color = 0x00ff00; // Verde para tiles normais

            if (isDoorTile) {
                color = 0xff0000; // Vermelho para tiles de portas
                
            } else if (isRoomTile) {
                color = 0x0000ff; // Azul para tiles de salas
            }

            graphics.fillStyle(color, 0.6); // Define a cor com transparência
            graphics.fillRect(x * tileSize, y * tileSize, tileSize, tileSize); // Desenha o retângulo
            graphics.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize); // Desenha a grade
        }
    }
}
