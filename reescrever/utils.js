// Funções utilitárias serão adicionadas aqui
const defaultScaleFactor = config.scaleFactor;
let newScaleFactor = defaultScaleFactor;
let scaleValueElement = document.getElementById('scale-value');

// Função para escalar um valor
function scale(value, scaleFactor) {
    return value * scaleFactor;
}

function resetScale() {
    scaleValueElement.textContent = defaultScaleFactor.toFixed(1);
    throttleRedraw();
}

function increaseScale() {
    if (newScaleFactor + 0.1 > 1) {
        this.disable = true;
        return;
    }
    this.disable = false;
    newScaleFactor += 0.1;
    scaleValueElement.textContent = newScaleFactor.toFixed(1);
    throttleRedraw();
}

function decreaseScale() {
    if (newScaleFactor - 0.1 < 0.5) {
        this.disable = true;
        return;
    }
    this.disable = false;
    newScaleFactor -= 0.1;
    scaleValueElement.textContent = newScaleFactor.toFixed(1);
    throttleRedraw();

}

function throttleRedraw() {
    if (this.redrawTimeout) clearTimeout(this.redrawTimeout);
    this.redrawTimeout = setTimeout(() => {
        redrawGame();
    }, 100); // Ajuste o valor do debounce conforme necessário
}

function resizeCanvas() {
    const canvas = document.getElementById('gameCanvas');
    const sidebarWidth = document.querySelector('.sidebar').offsetWidth;
    const newWidth = window.innerWidth - sidebarWidth;
    canvas.width = newWidth;
    canvas.height = newWidth; // Manter quadrado
}

function redrawGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let scaleFactor = newScaleFactor;
    // Ajustar o tamanho do canvas conforme o fator de escala
    canvas.width = scale(config.canvasWidth, newScaleFactor);
    canvas.height = scale(config.canvasHeight, newScaleFactor);
    // Redesenhar o tabuleiro com a nova escala
    initBoard(ctx, { ...config, scaleFactor });
}


