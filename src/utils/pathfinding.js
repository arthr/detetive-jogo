export default class Pathfinding {
    constructor(grid, tileSize) {
        this.grid = grid; // A grid representando o tabuleiro do jogo
        this.tileSize = tileSize;
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
                if (closedSet.includes(neighbor) || !this.isPassable(neighbor.x, neighbor.y)) {
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
        if (this.isValidTile(x + 1, y)) neighbors.push(this.createNode(x + 1, y, node));
        if (this.isValidTile(x - 1, y)) neighbors.push(this.createNode(x - 1, y, node));
        if (this.isValidTile(x, y + 1)) neighbors.push(this.createNode(x, y + 1, node));
        if (this.isValidTile(x, y - 1)) neighbors.push(this.createNode(x, y - 1, node));
        return neighbors;
    }

    // Função para verificar se um tile é válido
    isValidTile(x, y) {
        return x >= 0 && x < this.grid[0].length && y >= 0 && y < this.grid.length;
    }

    // Função para verificar se um tile é passável
    isPassable(x, y) {
        return this.grid[y][x] === 0 || this.grid[y][x] === 2; // 0 representa um tile passável, 2 representa uma porta passável
    }

    // Função para calcular a distância entre dois nós
    distance(nodeA, nodeB) {
        const dx = Math.abs(nodeA.x - nodeB.x);
        const dy = Math.abs(nodeA.y - nodeB.y);
        return dx + dy;
    }
}
