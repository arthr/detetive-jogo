# Projeto de Jogo de Tabuleiro

## Visão Geral

Este projeto é uma implementação digital de um jogo de tabuleiro clássico, criado usando HTML5, CSS e JavaScript. O tabuleiro do jogo é desenhado em um canvas, com salas, portas e passagens secretas representadas visualmente.

## Estrutura do Projeto

/public
├── index.html
├── css
│ └── styles.css
├── js
│ ├── board.js
│ ├── config.js
│ ├── game.js
│ └── socket.js
/server
├── gameLogic.js
├── server.js
└── utils.js


- **index.html:** O arquivo HTML principal contendo o canvas e a estrutura básica.
- **styles.css:** Arquivo CSS para estilizar a interface do jogo.
- **board.js:** Arquivo JavaScript responsável por desenhar o tabuleiro, salas, portas e passagens secretas no canvas.
- **config.js:** Arquivo de configuração contendo o layout e propriedades das salas, portas e passagens secretas.
- **game.js:** Arquivo JavaScript principal para inicializar e gerenciar a lógica do jogo.
- **socket.js:** Lida com a comunicação via WebSocket para funcionalidade multiplayer.
- **server.js:** Arquivo principal do servidor para executar o backend.
- **gameLogic.js:** Contém a lógica do jogo a ser executada no lado do servidor.
- **utils.js:** Funções utilitárias usadas no código do servidor.

## Começando

### Pré-requisitos

- Node.js e npm instalados

### Instalação

1. Clone o repositório:
    ```bash
    git clone https://github.com/arthr/detetive-jogo.git
    ```

2. Navegue até o diretório do projeto:
    ```bash
    cd detetive-jogo
    ```

3. Instale as dependências:
    ```bash
    npm install
    ```

4. Inicie o servidor:
    ```bash
    npm start
    ```

## Uso

- Abra `index.html` em um navegador para visualizar o tabuleiro do jogo.
- Use o console do navegador para depurar e ver mensagens de log.

## Contribuição

Sinta-se à vontade para abrir issues e pull requests. Contribuições são bem-vindas!

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
