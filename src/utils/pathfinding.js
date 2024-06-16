export default class Pathfinding {
    constructor(grid, tileSize) {
        this.grid = grid; // A grid representando o tabuleiro do jogo
        this.tileSize = tileSize;
        this.rooms = this.extractRooms(grid); // Extraímos as salas da grid para uso posterior
    }

    // Função para extrair salas da grid
    extractRooms(grid) {
        const rooms = [];
        const visited = new Set();

        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x] === 3 && !visited.has(`${x},${y}`)) {
                    const room = this.floodFillRoom(x, y, grid, visited);
                    rooms.push(room);
                }
            }
        }

        return rooms;
    }

    // Função de flood fill para detectar a sala
    floodFillRoom(x, y, grid, visited) {
        const room = { tiles: [], x, y, width: 0, height: 0 };
        const queue = [{ x, y }];
        const directions = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 }
        ];

        while (queue.length > 0) {
            const { x, y } = queue.shift();
            if (visited.has(`${x},${y}`) || grid[y][x] !== 3) continue;

            visited.add(`${x},${y}`);
            room.tiles.push({ x, y });
            room.width = Math.max(room.width, x - room.x + 1);
            room.height = Math.max(room.height, y - room.y + 1);

            directions.forEach(dir => {
                const newX = x + dir.x;
                const newY = y + dir.y;
                if (this.isValidTile(newX, newY) && !visited.has(`${newX},${newY}`)) {
                    queue.push({ x: newX, y: newY });
                }
            });
        }

        return room;
    }

    // Função para encontrar o caminho mais curto usando o algoritmo A*
    findPath(start, goal) {
        const openSet = [];
        const closedSet = [];
        const startNode = this.createNode(start.x, start.y, null);
        const goalNode = this.createNode(goal.x, goal.y, null);

        openSet.push(startNode);

        while (openSet.length > 0) {
            let currentNode = openSet[0];
            for (let i = 1; i < openSet.length; i++) {
                if (openSet[i].f < currentNode.f || (openSet[i].f === currentNode.f && openSet[i].h < currentNode.h)) {
                    currentNode = openSet[i];
                }
            }

            if (currentNode.x === goalNode.x && currentNode.y === goalNode.y) {
                return this.retracePath(startNode, currentNode);
            }

            openSet.splice(openSet.indexOf(currentNode), 1);
            closedSet.push(currentNode);

            this.getNeighbors(currentNode).forEach(neighbor => {
                if (closedSet.includes(neighbor)) {
                    return;
                }

                const tentativeG = currentNode.g + this.distance(currentNode, neighbor);

                if (!openSet.includes(neighbor) || tentativeG < neighbor.g) {
                    neighbor.g = tentativeG;
                    neighbor.h = this.distance(neighbor, goalNode);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = currentNode;

                    if (!openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                    }
                }
            });
        }

        return []; // Nenhum caminho encontrado
    }

    // Função para criar um nó
    createNode(x, y, parent) {
        return {
            x,
            y,
            g: 0,
            h: 0,
            f: 0,
            parent
        };
    }

    // Função para retracear o caminho de volta ao ponto inicial
    retracePath(startNode, endNode) {
        const path = [];
        let currentNode = endNode;
        while (currentNode !== startNode) {
            path.push({ x: currentNode.x, y: currentNode.y });
            currentNode = currentNode.parent;
        }
        path.reverse();
        return path;
    }

    // Função para obter vizinhos de um nó
    getNeighbors(node) {
        const neighbors = [];
        const { x, y } = node;

        if (this.isValidTile(x + 1, y) && this.isPassable(x + 1, y, node)) neighbors.push(this.createNode(x + 1, y, node));
        if (this.isValidTile(x - 1, y) && this.isPassable(x - 1, y, node)) neighbors.push(this.createNode(x - 1, y, node));
        if (this.isValidTile(x, y + 1) && this.isPassable(x, y + 1, node)) neighbors.push(this.createNode(x, y + 1, node));
        if (this.isValidTile(x, y - 1) && this.isPassable(x, y - 1, node)) neighbors.push(this.createNode(x, y - 1, node));

        return neighbors;
    }

    // Função para verificar se um tile é válido
    isValidTile(x, y) {
        const valid = x >= 0 && x < this.grid[0].length && y >= 0 && y < this.grid.length;
        return valid;
    }

    // Função para verificar se um tile é passável
    isPassable(x, y, currentNode) {
        const tile = this.grid[y][x];
        const currentTile = this.grid[currentNode.y][currentNode.x];
        const passable = tile === 0 || tile === 2 || (tile === 3 && currentTile === 3);

        return passable;
    }

    // Função para verificar se uma sala é passável
    isRoomPassable(x, y) {
        const room = this.rooms.find(room => room.tiles.some(tile => tile.x === x && tile.y === y));
        if (!room) return false;

        // Verifica se estamos entrando ou saindo da sala através de uma porta
        return room.tiles.some(tile => this.grid[tile.y][tile.x] === 2);
    }

    // Função para calcular a distância entre dois nós
    distance(nodeA, nodeB) {
        const dx = Math.abs(nodeA.x - nodeB.x);
        const dy = Math.abs(nodeA.y - nodeB.y);
        return dx + dy;
    }
}
