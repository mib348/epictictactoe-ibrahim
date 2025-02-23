// Winning combinations for Tic Tac Toe
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Roasting messages for different game situations
const ROASTS = {
    aiWin: [
        "Is that all you've got? My circuits aren't even warm yet! 🤖",
        "Calculate that loss! Maybe try checkers instead? 😎",
        "ERROR 404: Player skills not found! 😂",
        "I could win this in my sleep mode! 💤",
        "Did you just let an AI beat you? Embarrassing! 🎭"
    ],
    playerWin: [
        "You got lucky this time, human! 🎲",
        "My algorithms must need debugging... 🐛",
        "Impossible! I demand a rematch! 😤",
        "You haven't seen my final form yet! 🔄",
        "Well played... for a human! 👀"
    ],
    draw: [
        "A draw? I was going easy on you! 🤝",
        "Perfectly balanced, as all things should be! ⚖️",
        "Neither of us lost, but did either of us really win? 🤔",
        "Draw? More like bore! Let's go again! 🔄",
        "You're not bad... but you're not good either! 😏"
    ],
    aiBlock: [
        "Nice try! But I saw that coming from a mile away! 🔍",
        "Did you really think that would work? 😂",
        "Your moves are so predictable! 📖",
        "Better luck next time! 🍀",
        "Not on my watch! ⚡"
    ],
    aiSetup: [
        "Check and mate in 2 moves! 😈",
        "I'm playing 4D chess while you're playing tic-tac-toe! 🧠",
        "Watch and learn! 🎓",
        "This is what peak performance looks like! 💪",
        "You're in trouble now! 🌪️"
    ]
};

// Get a random roast message for a given situation
function getRandomRoast(situation) {
    const messages = ROASTS[situation];
    return messages[Math.floor(Math.random() * messages.length)];
}

// Check if there's a winner
function checkWinner(board) {
    for (const combination of WINNING_COMBINATIONS) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return {
                winner: board[a],
                combination: combination
            };
        }
    }
    return null;
}

// Check if the game is a draw
function isDraw(board) {
    return board.every(cell => cell !== '');
}

// Get all empty cells from the board
function getEmptyCells(board) {
    return board.reduce((cells, cell, index) => {
        if (cell === '') cells.push(index);
        return cells;
    }, []);
}

// Animation utilities using GSAP
const animations = {
    // Animate symbol placement
    placeSymbol: (element) => {
        gsap.from(element, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            ease: "back.out(1.7)"
        });
    },

    // Animate winning line
    highlightWinner: (elements) => {
        gsap.to(elements, {
            backgroundColor: "rgba(99, 102, 241, 0.3)",
            scale: 1.1,
            stagger: 0.1,
            duration: 0.3,
            yoyo: true,
            repeat: -1
        });
    },

    // Animate score update
    updateScore: (element) => {
        gsap.from(element, {
            scale: 1.5,
            duration: 0.3,
            ease: "power2.out"
        });
    },

    // Show game message
    showMessage: (element) => {
        gsap.from(element, {
            y: -20,
            opacity: 0,
            duration: 0.5,
            ease: "power2.out"
        });
    }
};

// Export utilities
window.gameUtils = {
    WINNING_COMBINATIONS,
    getRandomRoast,
    checkWinner,
    isDraw,
    getEmptyCells,
    animations
}; 