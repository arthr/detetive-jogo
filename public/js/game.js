document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Ajustar o tamanho do canvas conforme o fator de escala
    canvas.width = scale(config.canvasWidth, config.scaleFactor);
    canvas.height = scale(config.canvasHeight, config.scaleFactor);

    // Inicializar o tabuleiro e outros elementos
    initBoard(ctx, config);
    // initCharacters(ctx, config);
    // initItems(ctx, config);
});
