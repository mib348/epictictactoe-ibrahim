class TicTacToeGame {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.scores = { X: 0, O: 0 };
        this.ai = new TicTacToeAI();
        this.lastMove = null;
        this.soundEnabled = false;
        this.audioContext = null;
        
        this.initializeGame();
        this.initializeSounds();
        this.updateSoundDebug('Sound system initialized');
    }

    async initializeSounds() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.updateSoundDebug('Audio context created successfully');
        } catch (error) {
            this.updateSoundDebug(`Failed to create audio context: ${error.message}`);
            return;
        }

        const soundTestBtn = document.getElementById('soundTest');
        soundTestBtn.addEventListener('click', async () => {
            this.updateSoundDebug('Testing sound...');
            await this.enableSound();
            await this.playTestSound();
        });

        // Enable sound on first user interaction
        document.addEventListener('click', () => {
            if (!this.soundEnabled) {
                this.enableSound();
            }
        }, { once: true });
    }

    async enableSound() {
        try {
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            this.soundEnabled = true;
            this.updateSoundDebug('Sound enabled successfully');
            this.showToast('Sound enabled! 🔊', 'text-green-400');
        } catch (error) {
            this.updateSoundDebug(`Failed to enable sound: ${error.message}`);
            this.showToast('Failed to enable sound ❌', 'text-red-400');
        }
    }

    async createSound(frequency, duration, type = 'sine') {
        if (!this.soundEnabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);

        return new Promise(resolve => {
            setTimeout(resolve, duration * 1000);
        });
    }

    async playTestSound() {
        try {
            await this.createSound(440, 0.1); // A4 note
            this.updateSoundDebug('Test sound played successfully');
        } catch (error) {
            this.updateSoundDebug(`Failed to play test sound: ${error.message}`);
            this.showToast('Sound test failed ❌', 'text-red-400');
        }
    }

    async playMoveSound() {
        await this.createSound(440, 0.1); // A4 note
    }

    async playWinSound() {
        await this.createSound(523.25, 0.1); // C5 note
        await this.createSound(659.25, 0.1); // E5 note
        await this.createSound(783.99, 0.2); // G5 note
    }

    async playDrawSound() {
        await this.createSound(392, 0.1); // G4 note
        await this.createSound(329.63, 0.2); // E4 note
    }

    async playRoastSound() {
        await this.createSound(587.33, 0.1, 'square'); // D5 note with square wave
        await this.createSound(493.88, 0.2, 'square'); // B4 note with square wave
    }

    initializeGame() {
        this.initializeBoard();
        this.initializeEventListeners();
        this.updateTurnIndicator();
        this.showToast('Your turn! Show that AI who\'s boss! 🎮', 'text-indigo-400');
    }

    initializeBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'win', 'draw');
            cell.style.animation = 'none';
            cell.offsetHeight;
            cell.style.animation = null;
        });
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameOver = false;
    }

    initializeEventListeners() {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });

        document.getElementById('newGame').addEventListener('click', () => this.resetGame());

        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.ai.setDifficulty(e.target.value);
            this.resetGame();
        });
    }

    handleCellClick(cell) {
        const index = cell.dataset.index;
        
        if (this.board[index] === '' && !this.gameOver && this.currentPlayer === 'X') {
            this.makeMove(index);
            
            if (!this.gameOver) {
                setTimeout(async () => await this.makeAIMove(), 500);
            }
        }
    }

    async makeMove(index) {
        if (this.board[index] === '' && !this.gameOver) {
            this.board[index] = this.currentPlayer;
            const cell = document.querySelector(`[data-index="${index}"]`);
            cell.classList.add(this.currentPlayer.toLowerCase());
            
            try {
                await this.playMoveSound();
                this.updateSoundDebug(`Played move sound for ${this.currentPlayer}`);
            } catch (error) {
                this.updateSoundDebug(`Failed to play move sound: ${error.message}`);
            }
            
            window.gameUtils.animations.placeSymbol(cell);
            
            this.lastMove = index;
            await this.checkGameEnd();
            
            if (!this.gameOver) {
                this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
                this.updateTurnIndicator();
            }
        }
    }

    async makeAIMove() {
        if (this.gameOver) return;

        const aiMove = this.ai.makeMove([...this.board]);
        const wasBlock = this.checkIfMoveWasBlock(aiMove);
        
        await this.makeMove(aiMove);
        
        if (!this.gameOver) {
            try {
                if (wasBlock) {
                    await this.playRoastSound();
                    this.showToast(window.gameUtils.getRandomRoast('aiBlock'), 'text-yellow-400');
                } else if (this.isWinningSetup(aiMove)) {
                    await this.playRoastSound();
                    this.showToast(window.gameUtils.getRandomRoast('aiSetup'), 'text-red-400');
                }
            } catch (error) {
                this.updateSoundDebug(`Failed to play roast sound: ${error.message}`);
            }
        }
    }

    checkIfMoveWasBlock(move) {
        const testBoard = [...this.board];
        testBoard[move] = 'X';
        return window.gameUtils.checkWinner(testBoard) !== null;
    }

    isWinningSetup(move) {
        const testBoard = [...this.board];
        testBoard[move] = 'O';
        for (let i = 0; i < testBoard.length; i++) {
            if (testBoard[i] === '') {
                const nextBoard = [...testBoard];
                nextBoard[i] = 'O';
                if (window.gameUtils.checkWinner(nextBoard)) {
                    return true;
                }
            }
        }
        return false;
    }

    async checkGameEnd() {
        const result = window.gameUtils.checkWinner(this.board);
        
        if (result) {
            this.gameOver = true;
            this.scores[result.winner]++;
            this.updateScores();
            
            const winningCells = result.combination.map(index => 
                document.querySelector(`[data-index="${index}"]`)
            );
            winningCells.forEach(cell => cell.classList.add('win'));
            window.gameUtils.animations.highlightWinner(winningCells);
            
            try {
                await this.playWinSound();
                this.updateSoundDebug('Played win sound');
            } catch (error) {
                this.updateSoundDebug(`Failed to play win sound: ${error.message}`);
            }
            
            const message = result.winner === 'X' 
                ? window.gameUtils.getRandomRoast('playerWin')
                : window.gameUtils.getRandomRoast('aiWin');
            this.showToast(message, result.winner === 'X' ? 'text-indigo-400' : 'text-pink-500');
            
        } else if (window.gameUtils.isDraw(this.board)) {
            this.gameOver = true;
            document.querySelectorAll('.cell').forEach(cell => 
                cell.classList.add('draw')
            );
            
            try {
                await this.playDrawSound();
                this.updateSoundDebug('Played draw sound');
            } catch (error) {
                this.updateSoundDebug(`Failed to play draw sound: ${error.message}`);
            }
            
            this.showToast(window.gameUtils.getRandomRoast('draw'), 'text-purple-400');
        }
    }

    updateTurnIndicator() {
        const turnDiv = document.querySelector('.player-turn');
        turnDiv.textContent = `Current Turn: ${this.currentPlayer === 'X' ? 'Your' : 'AI\'s'} turn`;
        turnDiv.classList.toggle('active', this.currentPlayer === 'X');
    }

    updateScores() {
        const playerScore = document.querySelector('.player-score span');
        const aiScore = document.querySelector('.ai-score span');
        
        playerScore.textContent = this.scores.X;
        aiScore.textContent = this.scores.O;
        
        window.gameUtils.animations.updateScore(this.scores.X > this.scores.O ? playerScore : aiScore);
    }

    showToast(message, colorClass = 'text-white') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${colorClass} font-roboto-mono`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3500);
    }

    updateSoundDebug(message) {
        const debugDiv = document.getElementById('soundDebug');
        if (debugDiv) {
            const timestamp = new Date().toLocaleTimeString();
            debugDiv.innerHTML = `[${timestamp}] ${message}`;
            console.log(`Sound Debug: ${message}`);
        }
    }

    resetGame() {
        this.initializeBoard();
        this.updateTurnIndicator();
        this.showToast('Game reset! Your turn! 🎮', 'text-indigo-400');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new TicTacToeGame();
});