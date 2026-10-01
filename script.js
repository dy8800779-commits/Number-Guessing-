/* =====================================================
   GUESS THE NUMBER
   Created by Dipesh Yadav
===================================================== */


/* =====================================================
   GAME SETTINGS
===================================================== */

const difficulties = {

    easy: {
        name: "EASY",
        time: 60,
        attempts: 7
    },

    medium: {
        name: "MEDIUM",
        time: 30,
        attempts: 5
    },

    hard: {
        name: "HARD",
        time: 15,
        attempts: 3
    }

};


/* =====================================================
   GAME VARIABLES
===================================================== */

let difficulty = "easy";

let secretNumber = 0;

let attempts = 0;

let maxAttempts = 7;

let score = 100;

let highScore = 0;

let timeLimit = 60;

let timeLeft = 60;

let timerInterval = null;

let gameActive = false;


/* =====================================================
   GET HTML ELEMENTS
===================================================== */

const difficultyDisplay =
    document.getElementById("difficultyDisplay");

const timerDisplay =
    document.getElementById("timer");

const attemptsDisplay =
    document.getElementById("attempts");

const maxAttemptsDisplay =
    document.getElementById("maxAttempts");

const scoreDisplay =
    document.getElementById("score");

const highScoreDisplay =
    document.getElementById("highScore");

const timerProgress =
    document.getElementById("timerProgress");

const guessInput =
    document.getElementById("guessInput");

const guessBtn =
    document.getElementById("guessBtn");

const newGameBtn =
    document.getElementById("newGameBtn");

const message =
    document.getElementById("message");

const analysisText =
    document.getElementById("analysisText");

const history =
    document.getElementById("history");

const sideScore =
    document.getElementById("sideScore");

const sideAttempts =
    document.getElementById("sideAttempts");

const sideTimer =
    document.getElementById("sideTimer");

const resultModal =
    document.getElementById("resultModal");

const modalIcon =
    document.getElementById("modalIcon");

const modalTitle =
    document.getElementById("modalTitle");

const modalText =
    document.getElementById("modalText");

const finalScore =
    document.getElementById("finalScore");

const modalNewGame =
    document.getElementById("modalNewGame");


/* =====================================================
   SOUND SYSTEM
   Replaces C Beep()
===================================================== */

let audioContext = null;


function playTone(
    frequency,
    duration = 200
) {

    try {

        if (!audioContext) {

            audioContext =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();

        }

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        oscillator.frequency.value =
            frequency;

        oscillator.type = "square";

        gain.gain.value = 0.04;

        oscillator.connect(gain);

        gain.connect(
            audioContext.destination
        );

        oscillator.start();

        setTimeout(() => {

            oscillator.stop();

        }, duration);

    } catch (error) {

        console.log(
            "Audio unavailable"
        );

    }

}


/* =====================================================
   START GAME
===================================================== */

function startGame() {

    clearInterval(timerInterval);

    const settings =
        difficulties[difficulty];

    timeLimit =
        settings.time;

    maxAttempts =
        settings.attempts;

    timeLeft =
        timeLimit;

    attempts = 0;

    score = 100;

    secretNumber =
        Math.floor(
            Math.random() * 100
        ) + 1;

    gameActive = true;


    /* Reset UI */

    difficultyDisplay.textContent =
        settings.name;

    timerDisplay.textContent =
        timeLeft;

    attemptsDisplay.textContent =
        attempts;

    maxAttemptsDisplay.textContent =
        maxAttempts;

    scoreDisplay.textContent =
        score;

    sideScore.textContent =
        score;

    sideAttempts.textContent =
        maxAttempts;

    sideTimer.textContent =
        timeLeft + "s";


    timerProgress.style.width =
        "100%";


    message.textContent =
        "Enter your first guess.";

    message.style.color =
        "#8ea0a6";


    analysisText.textContent =
        "Waiting for your first input...";


    history.innerHTML =
        `<div class="empty-history">
            NO GUESSES YET
        </div>`;


    guessInput.value = "";

    guessInput.disabled = false;

    guessBtn.disabled = false;


    closeModal();


    guessInput.focus();


    /* Start timer */

    timerInterval =
        setInterval(updateTimer, 1000);

}


/* =====================================================
   TIMER
===================================================== */

function updateTimer() {

    if (!gameActive) {

        return;

    }

    timeLeft--;

    if (timeLeft < 0) {

        timeLeft = 0;

    }


    timerDisplay.textContent =
        timeLeft;

    sideTimer.textContent =
        timeLeft + "s";


    const percentage =
        (timeLeft / timeLimit) * 100;


    timerProgress.style.width =
        percentage + "%";


    if (timeLeft <= 10) {

        timerProgress.style.background =
            "#ff3158";

    } else {

        timerProgress.style.background =
            "#00ff88";

    }


    if (timeLeft <= 0) {

        endGame(
            "time"
        );

    }

}


/* =====================================================
   SUBMIT GUESS
===================================================== */

function submitGuess() {

    if (!gameActive) {

        return;

    }


    const guess =
        Number(
            guessInput.value
        );


    /* Invalid input */

    if (
        !Number.isInteger(guess) ||
        guess < 1 ||
        guess > 100
    ) {

        message.textContent =
            "Enter a valid number between 1 and 100.";

        message.style.color =
            "#ffd84d";

        analysisText.textContent =
            "Input rejected. Valid range: 1–100.";

        playTone(
            300,
            150
        );

        return;

    }


    attempts++;


    attemptsDisplay.textContent =
        attempts;


    sideAttempts.textContent =
        Math.max(
            0,
            maxAttempts - attempts
        );


    /* ================================================
       CORRECT
    ================================================ */

    if (guess === secretNumber) {

        playTone(
            500,
            150
        );

        setTimeout(
            () => playTone(700, 150),
            160
        );

        setTimeout(
            () => playTone(900, 150),
            320
        );


        addHistory(
            guess,
            "CORRECT",
            true
        );


        message.textContent =
            "✓ CORRECT GUESS!";

        message.style.color =
            "#00ff88";


        analysisText.textContent =
            "Target successfully identified.";


        endGame(
            "win"
        );

        return;

    }


    /* ================================================
       WRONG GUESS
    ================================================ */

    score -= 10;


    if (score < 0) {

        score = 0;

    }


    scoreDisplay.textContent =
        score;

    sideScore.textContent =
        score;


    /* Too Low */

    if (guess < secretNumber) {

        playTone(
            3000,
            150
        );

        setTimeout(
            () => playTone(3500, 150),
            170
        );


        message.textContent =
            "TOO LOW";

        message.style.color =
            "#ff3158";


        analysisText.textContent =
            "Your guess is below the target number.";

        addHistory(
            guess,
            "TOO LOW",
            false
        );

    }


    /* Too High */

    else {

        playTone(
            7000,
            150
        );

        setTimeout(
            () => playTone(6500, 150),
            170
        );


        message.textContent =
            "TOO HIGH";

        message.style.color =
            "#ff3158";


        analysisText.textContent =
            "Your guess is above the target number.";

        addHistory(
            guess,
            "TOO HIGH",
            false
        );

    }


    guessInput.value = "";

    guessInput.focus();


    /* Attempts finished */

    if (
        attempts >= maxAttempts
    ) {

        endGame(
            "attempts"
        );

    }

}


/* =====================================================
   ADD HISTORY
===================================================== */

function addHistory(
    guess,
    result,
    correct = false
) {

    const empty =
        history.querySelector(
            ".empty-history"
        );


    if (empty) {

        empty.remove();

    }


    const item =
        document.createElement(
            "div"
        );


    item.className =
        "history-item";


    item.innerHTML = `

        <span class="history-number">
            #${attempts}
            &nbsp;&nbsp;
            ${guess}
        </span>

        <span
            class="history-result
            ${correct ? "correct" : ""}"
        >
            ${result}
        </span>

    `;


    history.prepend(item);

}


/* =====================================================
   END GAME
===================================================== */

function endGame(reason) {

    gameActive = false;

    clearInterval(
        timerInterval
    );


    guessInput.disabled = true;

    guessBtn.disabled = true;


    /* WIN */

    if (reason === "win") {

        if (score > highScore) {

            highScore = score;

            highScoreDisplay.textContent =
                highScore;

        }


        modalIcon.textContent =
            "✓";

        modalIcon.style.color =
            "#00ff88";

        modalIcon.style.borderColor =
            "#00ff88";


        modalTitle.textContent =
            "CORRECT GUESS";

        modalTitle.style.color =
            "#00ff88";


        modalText.textContent =
            `You found the secret number: ${secretNumber}`;


        finalScore.textContent =
            score;


        setTimeout(
            showModal,
            500
        );

    }


    /* TIME OVER */

    else if (reason === "time") {

        playTone(
            200,
            800
        );


        modalIcon.textContent =
            "!";

        modalIcon.style.color =
            "#ff3158";

        modalIcon.style.borderColor =
            "#ff3158";


        modalTitle.textContent =
            "TIME OVER";

        modalTitle.style.color =
            "#ff3158";


        modalText.textContent =
            `The correct number was ${secretNumber}.`;


        finalScore.textContent =
            score;


        message.textContent =
            "TIME OVER";

        message.style.color =
            "#ff3158";


        analysisText.textContent =
            "Mission failed: time limit exceeded.";


        showModal();

    }


    /* ATTEMPTS OVER */

    else if (reason === "attempts") {

        playTone(
            200,
            800
        );


        modalIcon.textContent =
            "!";

        modalIcon.style.color =
            "#ff3158";

        modalIcon.style.borderColor =
            "#ff3158";


        modalTitle.textContent =
            "NO ATTEMPTS LEFT";

        modalTitle.style.color =
            "#ff3158";


        modalText.textContent =
            `The correct number was ${secretNumber}.`;


        finalScore.textContent =
            score;


        message.textContent =
            "NO ATTEMPTS LEFT";

        message.style.color =
            "#ff3158";


        analysisText.textContent =
            "Mission failed: maximum attempts reached.";


        showModal();

    }

}


/* =====================================================
   MODAL
===================================================== */

function showModal() {

    resultModal.classList.add(
        "show"
    );

}


function closeModal() {

    resultModal.classList.remove(
        "show"
    );

}


/* =====================================================
   DIFFICULTY BUTTONS
===================================================== */

const difficultyButtons =
    document.querySelectorAll(
        ".difficulty-btn"
    );


difficultyButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                difficultyButtons
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );


                difficulty =
                    button.dataset.difficulty;


                startGame();

            }
        );

    }
);


/* =====================================================
   BUTTON EVENTS
===================================================== */

guessBtn.addEventListener(
    "click",
    submitGuess
);


newGameBtn.addEventListener(
    "click",
    startGame
);


modalNewGame.addEventListener(
    "click",
    startGame
);


/* =====================================================
   ENTER KEY
===================================================== */

guessInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            submitGuess();

        }

    }
);


/* =====================================================
   INITIALIZE GAME
===================================================== */

startGame();