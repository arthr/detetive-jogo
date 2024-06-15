import config from './config.js';

console.log(config);

function createRoomList() {
    const roomList = document.getElementById('room-list');
    roomList.innerHTML = ''; // Limpar lista existente
    config.rooms.forEach(room => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" value="${room.id}"> ${room.name}`;
        roomList.appendChild(label);
        roomList.appendChild(document.createElement('br'));
    });
}


createRoomList();