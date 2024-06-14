function initBoard(ctx, config) {
    const { scaleFactor, gridSize, rooms, showCoordinates, doorsColor, secretPassageColor } = config;
    const canvas = ctx.canvas; // Obter a referência do canvas

    const quadradoLargura = canvas.width / gridSize;
    const quadradoAltura = canvas.height / gridSize;

    const images = {};

    // Carregar imagens
    rooms.forEach(room => {
        if (room.imageUrl) {
            const img = new Image();
            img.src = room.imageUrl;
            images[room.name] = img;
        }
    });

    // Função para desenhar a grade
    function drawGrid() {
        ctx.strokeStyle = '#000';
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                const posX = x * quadradoLargura;
                const posY = y * quadradoAltura;

                ctx.beginPath();
                ctx.rect(posX, posY, quadradoLargura, quadradoAltura);
                ctx.stroke();

                if (showCoordinates) {
                    ctx.fillStyle = 'green';
                    ctx.fillText(`X`, posX + 5, posY + 10);
                    ctx.fillStyle = 'black';
                    ctx.fillText(`${x}`, posX + 15, posY + 10);

                    ctx.fillStyle = 'blue';
                    ctx.fillText(`Y`, posX + 5, posY + 25);
                    ctx.fillStyle = 'black';
                    ctx.fillText(`${y}`, posX + 15, posY + 25);
                }
            }
        }
    }

    // Função para desenhar o nome do quarto
    function writeRoomName(room, x, y, width, height) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '25px Arial Black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'black'; // Adicionar sombra
        ctx.shadowOffsetX = 1; // Definir deslocamento horizontal da sombra
        ctx.shadowOffsetY = 2; // Definir deslocamento vertical da sombra
        ctx.shadowBlur = 0; // Aumentar o desfoque da sombra
        ctx.fillText(room.name.toUpperCase(), x + width / 2, y + height / 2);
    }

    function drawRooms(room, quadradoLargura, quadradoAltura) {
        room.doors.forEach(door => {
            const doorX = door.x * quadradoLargura;
            const doorY = door.y * quadradoAltura;
            drawPassage(doorX, doorY, quadradoLargura, quadradoAltura, door.direction, doorsColor);
        });
    }

    // Função para desenhar passagens secretas
    function drawSecretPassage(room, quadradoLargura, quadradoAltura) {
        if (room.secretPassage) {
            const { x, y, direction } = room.secretPassage;
            const passageX = x * quadradoLargura;
            const passageY = y * quadradoAltura;
            drawPassage(passageX, passageY, quadradoLargura, quadradoAltura, direction, secretPassageColor);
        }
    }

    // Função para desenhar portas e passagens secretas
    function drawPassage(x, y, width, height, direction, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        switch (direction) {
            case 'up':
                ctx.moveTo(x + width / 2, y);
                ctx.lineTo(x + width / 4, y + height / 2);
                ctx.lineTo(x + (3 * width) / 4, y + height / 2);
                break;
            case 'down':
                ctx.moveTo(x + width / 2, y + height);
                ctx.lineTo(x + width / 4, y + height / 2);
                ctx.lineTo(x + (3 * width) / 4, y + height / 2);
                break;
            case 'left':
                ctx.moveTo(x, y + height / 2);
                ctx.lineTo(x + width / 2, y + height / 4);
                ctx.lineTo(x + width / 2, y + (3 * height) / 4);
                break;
            case 'right':
                ctx.moveTo(x + width, y + height / 2);
                ctx.lineTo(x + width / 2, y + height / 4);
                ctx.lineTo(x + width / 2, y + (3 * height) / 4);
                break;
        }
        ctx.fill();
    }

    // Função para desenhar o tabuleiro
    function drawBoard() {
        ctx.fillStyle = '#d3d3d3';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Desenhar a grade
        drawGrid();

        // Desenhar quartos
        rooms.forEach(room => {
            const x = room.x * quadradoLargura;
            const y = room.y * quadradoAltura;
            const width = room.width * quadradoLargura;
            const height = room.height * quadradoAltura;

            // Desenhar imagem de fundo ou cor de fundo padrão
            if (images[room.name]) {
                images[room.name].onload = () => {
                    ctx.drawImage(images[room.name], x, y, width, height);
                    writeRoomName(room, x, y, width, height);
                    // Desenhar passagens secretas
                    drawSecretPassage(room, quadradoLargura, quadradoAltura);
                };
            } else {
                ctx.fillStyle = '#a9a9a9'; // Cor de fundo padrão
                ctx.fillRect(x, y, width, height);
                writeRoomName(room, x, y, width, height);
            }

            // Desenhar borda
            ctx.strokeStyle = '#666';
            ctx.shadowColor = 'black'; // Adicionar sombra
            ctx.shadowOffsetX = 0; // Definir deslocamento horizontal da sombra
            ctx.shadowOffsetY = 0; // Definir deslocamento vertical da sombra
            ctx.shadowBlur = 7;
            ctx.strokeRect(x, y, width, height);

            // Desenhar portas
            drawRooms(room, quadradoLargura, quadradoAltura);

        });
    }

    drawBoard();
}
