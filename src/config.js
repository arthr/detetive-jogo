export const config = {
    scaleFactor: 1,
    gridSize: 25,
    showCoordinates: false,
    doorsColor: 'rgba(255, 255, 255, 0.8)',
    secretPassageColor: 'rgba(255, 165, 0, 0.8)',
    rooms: [
        { id: 1, x: 0, y: 0, width: 7, height: 5, name: 'Restaurante', imageUrl: './assets/images/restaurante.webp', doors: [{ x: 7, y: 2, direction: 'left' }] },
        { id: 2, x: 10, y: 0, width: 6, height: 6, name: 'Prefeitura', imageUrl: './assets/images/prefeitura.webp', doors: [{ x: 11, y: 6, direction: 'up' }], secretPassage: { x: 12, y: 0, direction: 'up', destination: 'Estação de Trem' } },
        { id: 3, x: 19, y: 0, width: 6, height: 6, name: 'Banco', imageUrl: './assets/images/banco.webp', doors: [{ x: 21, y: 6, direction: 'up' }] },
        { id: 4, x: 0, y: 7, width: 6, height: 4, name: 'Hospital', imageUrl: './assets/images/hospital.webp', doors: [{ x: 6, y: 8, direction: 'left' }, { x: 1, y: 11, direction: 'up' }], secretPassage: { x: 0, y: 9, direction: 'left', destination: 'Mansão' } },
        { id: 5, x: 0, y: 12, width: 6, height: 6, name: 'Floricultura', imageUrl: './assets/images/floricultura.webp', doors: [{ x: 6, y: 14, direction: 'left' }, { x: 1, y: 18, direction: 'up' }] },
        { id: 6, x: 0, y: 20, width: 6, height: 5, name: 'Cemitério', imageUrl: './assets/images/cemiterio.webp', doors: [{ x: 6, y: 21, direction: 'left' }, { x: 3, y: 19, direction: 'down' }] },
        { id: 7, x: 9, y: 19, width: 7, height: 6, name: 'Estação de Trem', imageUrl: './assets/images/estacao-de-trem.webp', doors: [{ x: 8, y: 23, direction: 'right' }, { x: 16, y: 20, direction: 'left' }], secretPassage: { x: 12, y: 24, direction: 'down', destination: 'Prefeitura' } },
        { id: 8, x: 19, y: 8, width: 6, height: 4, name: 'Mansão', imageUrl: './assets/images/mansao.webp', doors: [{ x: 18, y: 10, direction: 'right' }, { x: 23, y: 7, direction: 'down' }], secretPassage: { x: 24, y: 10, direction: 'right', destination: 'Hospital' } },
        { id: 9, x: 19, y: 13, width: 6, height: 5, name: 'Hotel', imageUrl: './assets/images/hotel.webp', doors: [{ x: 18, y: 15, direction: 'right' }, { x: 24, y: 12, direction: 'down' }] },
        { id: 10, x: 19, y: 20, width: 6, height: 5, name: 'Boate', imageUrl: './assets/images/boate.webp', doors: [{ x: 18, y: 22, direction: 'right' }, { x: 23, y: 19, direction: 'down' }] },
        { id: 11, x: 9, y: 7, width: 7, height: 10, name: 'Praça Central', imageUrl: './assets/images/praca-central.webp', doors: [{ x: 8, y: 12, direction: 'right' }, { x: 16, y: 12, direction: 'left' }] }
    ]
};
