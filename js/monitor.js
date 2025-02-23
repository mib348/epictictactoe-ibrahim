// Enhanced console logging
(function() {
    // Store original console methods
    const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info
    };

    // Enhance console.log
    console.log = function(...args) {
        const timestamp = new Date().toISOString();
        originalConsole.log(`[${timestamp}] LOG:`, ...args);
    };

    // Enhance console.error
    console.error = function(...args) {
        const timestamp = new Date().toISOString();
        originalConsole.error(`[${timestamp}] ERROR:`, ...args);
    };

    // Enhance console.warn
    console.warn = function(...args) {
        const timestamp = new Date().toISOString();
        originalConsole.warn(`[${timestamp}] WARN:`, ...args);
    };

    // Enhance console.info
    console.info = function(...args) {
        const timestamp = new Date().toISOString();
        originalConsole.info(`[${timestamp}] INFO:`, ...args);
    };

    // Add some debug logging for game events
    window.addEventListener('DOMContentLoaded', () => {
        console.info('Game initialized');
    });

    // Log all moves
    const originalMakeMove = TicTacToeGame.prototype.makeMove;
    TicTacToeGame.prototype.makeMove = function(index) {
        console.log(`Move made at position ${index} by ${this.currentPlayer}`);
        return originalMakeMove.call(this, index);
    };

    // Log AI decisions
    const originalAIMakeMove = TicTacToeAI.prototype.makeMove;
    TicTacToeAI.prototype.makeMove = function(board) {
        const move = originalAIMakeMove.call(this, board);
        console.log(`AI (${this.difficulty}) chose position ${move}`);
        return move;
    };

    // Log game end states
    const originalCheckGameEnd = TicTacToeGame.prototype.checkGameEnd;
    TicTacToeGame.prototype.checkGameEnd = function() {
        const result = window.gameUtils.checkWinner(this.board);
        if (result) {
            console.info(`Game ended with winner: ${result.winner}`);
        } else if (window.gameUtils.isDraw(this.board)) {
            console.info('Game ended in a draw');
        }
        return originalCheckGameEnd.call(this);
    };
})(); 