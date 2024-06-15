const canvas = document.getElementById('gameCanvas');
const sidebarWidth = document.querySelector('.sidebar').offsetWidth;
const newWidth = window.innerWidth - sidebarWidth;

const config = {
    scaleFactor: 1,
    canvasWidth: newWidth,
    canvasHeight: newWidth,
    gridSize: 25,
    showCoordinates: false,
    doorsColor: 'rgba(255, 255, 255, 0.8)',
    secretPassageColor: 'rgba(255, 165, 0, 0.8)',
    rooms: [
        { x: 0, y: 0, width: 7, height: 5, name: 'Restaurante', imageUrl: 'images/restaurante.webp', doors: [{ x: 7, y: 2, direction: 'left' }] },
        { x: 10, y: 0, width: 6, height: 6, name: 'Prefeitura', imageUrl: 'images/prefeitura.webp', doors: [{ x: 11, y: 6, direction: 'up' }], secretPassage: { x: 12, y: 0, direction: 'up', destination: 'Estação de Trem' } },
        { x: 19, y: 0, width: 6, height: 6, name: 'Banco', imageUrl: 'images/banco.webp', doors: [{ x: 21, y: 6, direction: 'up' }] },
        { x: 0, y: 7, width: 6, height: 4, name: 'Hospital', imageUrl: 'images/hospital.webp', doors: [{ x: 6, y: 8, direction: 'left' }, { x: 1, y: 11, direction: 'up' }], secretPassage: { x: 0, y: 9, direction: 'left', destination: 'Mansão' } },
        { x: 0, y: 12, width: 6, height: 6, name: 'Floricultura', imageUrl: 'images/floricultura.webp', doors: [{ x: 6, y: 14, direction: 'left' }, { x: 1, y: 18, direction: 'up' }] },
        { x: 0, y: 20, width: 6, height: 5, name: 'Cemitério', imageUrl: 'images/cemiterio.webp', doors: [{ x: 6, y: 21, direction: 'left' }, { x: 3, y: 19, direction: 'down' }] },
        { x: 9, y: 19, width: 7, height: 6, name: 'Estação de Trem', imageUrl: 'images/estacao-de-trem.webp', doors: [{ x: 8, y: 23, direction: 'right' }, { x: 16, y: 20, direction: 'left' }], secretPassage: { x: 12, y: 24, direction: 'down', destination: 'Prefeitura' } },
        { x: 19, y: 8, width: 6, height: 4, name: 'Mansão', imageUrl: 'images/mansao.webp', doors: [{ x: 18, y: 10, direction: 'right' }, { x: 23, y: 7, direction: 'down' }], secretPassage: { x: 24, y: 10, direction: 'right', destination: 'Hospital' } },
        { x: 19, y: 13, width: 6, height: 5, name: 'Hotel', imageUrl: 'images/hotel.webp', doors: [{ x: 18, y: 15, direction: 'right' }, { x: 24, y: 12, direction: 'down' }] },
        { x: 19, y: 20, width: 6, height: 5, name: 'Boate', imageUrl: 'images/boate.webp', doors: [{ x: 18, y: 22, direction: 'right' }, { x: 23, y: 19, direction: 'down' }] },
        { x: 9, y: 7, width: 7, height: 10, name: 'Praça Central', imageUrl: 'images/praca-central.webp', doors: [{ x: 8, y: 12, direction: 'right' }, { x: 16, y: 12, direction: 'left' }] }
    ]
};
