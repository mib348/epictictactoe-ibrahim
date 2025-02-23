class TicTacToeAI {
    constructor() {
        this.difficulty = 'medium';
    }

    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    makeMove(board) {
        switch (this.difficulty) {
            case 'easy':
                return this.makeEasyMove(board);
            case 'medium':
                return Math.random() < 0.7 ? this.makeMediumMove(board) : this.makeEasyMove(board);
            case 'hard':
                return this.makeHardMove(board);
            default:
                return this.makeMediumMove(board);
        }
    }

    makeEasyMove(board) {
        const emptyCells = window.gameUtils.getEmptyCells(board);
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    makeMediumMove(board) {
        // First try to win
        const winningMove = this.findWinningMove(board, 'O');
        if (winningMove !== null) return winningMove;

        // Then try to block player from winning
        const blockingMove = this.findWinningMove(board, 'X');
        if (blockingMove !== null) {
            return blockingMove;
        }

        // Take center if available
        if (board[4] === '') return 4;

        // Take corners if available
        const corners = [0, 2, 6, 8].filter(i => board[i] === '');
        if (corners.length > 0) {
            return corners[Math.floor(Math.random() * corners.length)];
        }

        // Take any available edge
        const edges = [1, 3, 5, 7].filter(i => board[i] === '');
        if (edges.length > 0) {
            return edges[Math.floor(Math.random() * edges.length)];
        }

        // Take any available space
        return this.makeEasyMove(board);
    }

    makeHardMove(board) {
        return this.minimax(board, 'O').index;
    }

    findWinningMove(board, player) {
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                const testBoard = [...board];
                testBoard[i] = player;
                if (window.gameUtils.checkWinner(testBoard)) {
                    return i;
                }
            }
        }
        return null;
    }

    minimax(board, player, depth = 0, alpha = -Infinity, beta = Infinity) {
        const emptyCells = window.gameUtils.getEmptyCells(board);

        if (window.gameUtils.checkWinner(board)?.winner === 'X') {
            return { score: -10 + depth };
        }
        if (window.gameUtils.checkWinner(board)?.winner === 'O') {
            return { score: 10 - depth };
        }
        if (emptyCells.length === 0) {
            return { score: 0 };
        }

        let moves = [];

        for (let i = 0; i < emptyCells.length; i++) {
            let move = {};
            move.index = emptyCells[i];

            board[emptyCells[i]] = player;

            if (player === 'O') {
                const result = this.minimax(board, 'X', depth + 1, alpha, beta);
                move.score = result.score;
                alpha = Math.max(alpha, result.score);
            } else {
                const result = this.minimax(board, 'O', depth + 1, alpha, beta);
                move.score = result.score;
                beta = Math.min(beta, result.score);
            }

            board[emptyCells[i]] = '';
            moves.push(move);

            // Alpha-beta pruning
            if (alpha >= beta) break;
        }

        let bestMove;
        if (player === 'O') {
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }
}

// Export AI
window.TicTacToeAI = TicTacToeAI; 