import { gameState } from '../common/gamestate.js';
class GameManager {
    state = gameState.LOBBY;
}

export const gameManager = new GameManager();