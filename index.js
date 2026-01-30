/* ============================================
   GAME CONFIGURATION
   ============================================ */
const choices = [
  { name: "rock", emoji: "🪨", beats: ["scissors", "stone"] },
  { name: "paper", emoji: "📄", beats: ["rock"] },
  { name: "scissors", emoji: "✂️", beats: ["paper"] },
  { name: "stone", emoji: "🪨", beats: ["scissors"] }
];

/* ============================================
   GAME STATE
   ============================================ */
let gameState = {
  playerScore: 0,
  botScore: 0,
  isPlaying: false
};

/* ============================================
   DOM ELEMENTS
   ============================================ */
const playerChoiceEl = document.getElementById("playerChoice");
const botChoiceEl = document.getElementById("botChoice");
const resultEl = document.getElementById("result");
const playerScoreEl = document.getElementById("playerScore");
const botScoreEl = document.getElementById("botScore");
const themeBtn = document.getElementById("themeBtn");
const choiceButtons = document.querySelectorAll(".choice-btn");
const resetBtn = document.querySelector(".reset-btn");

/* ============================================
   THEME TOGGLE FUNCTIONALITY
   ============================================ */
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  }
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  const isLight = document.body.classList.contains("light-theme");
  localStorage.setItem("theme", isLight ? "light" : "dark");

  // Animate theme button
  gsap.to(themeBtn, {
    rotation: 360,
    duration: 0.6,
    ease: "back.out"
  });
});

/* ============================================
   MAIN GAME LOGIC
   ============================================ */
function startRound(playerPick) {
  if (gameState.isPlaying) return;
  gameState.isPlaying = true;

  // Disable all buttons
  disableAllButtons();

  // Find player choice
  const playerChoice = choices.find(c => c.name === playerPick);

  // Animate player choice with GSAP
  gsap.fromTo(
    playerChoiceEl,
    { scale: 0.5, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5, ease: "back.out" }
  );

  playerChoiceEl.textContent = playerChoice.emoji;
  resultEl.textContent = "Bot is choosing...";

  // Bot thinking animation
  animateBotThinking();

  // Simulate bot decision delay
  setTimeout(() => {
    const botChoice = getRandomChoice();
    revealBotChoice(botChoice);
    decideWinner(playerChoice, botChoice);
    enableAllButtons();
    gameState.isPlaying = false;
  }, 2000);
}

/* ============================================
   BOT THINKING ANIMATION
   ============================================ */
function animateBotThinking() {
  const emojis = ["🤔", "🧠", "💭", "⚡"];
  let index = 0;

  const thinkingInterval = setInterval(() => {
    botChoiceEl.textContent = emojis[index % emojis.length];
    index++;
  }, 200);

  // Bounce animation while thinking
  gsap.to(botChoiceEl, {
    y: -10,
    duration: 0.4,
    repeat: 4,
    yoyo: true,
    ease: "power1.inOut"
  });

  setTimeout(() => clearInterval(thinkingInterval), 1900);
}

/* ============================================
   BOT CHOICE REVEAL ANIMATION
   ============================================ */
function revealBotChoice(botChoice) {
  // Flip animation for bot choice
  gsap.timeline()
    .to(botChoiceEl, {
      rotationY: 90,
      duration: 0.3,
      ease: "back.in"
    })
    .call(() => {
      botChoiceEl.textContent = botChoice.emoji;
    })
    .to(botChoiceEl, {
      rotationY: 0,
      duration: 0.3,
      ease: "back.out"
    }, "<0.1");
}

/* ============================================
   WINNER DECISION LOGIC
   ============================================ */
function decideWinner(playerChoice, botChoice) {
  let result = {
    text: "",
    winner: "draw"
  };

  if (playerChoice.name === botChoice.name) {
    result.text = "It's a Draw! 🤝";
    result.winner = "draw";
  } else if (playerChoice.beats.includes(botChoice.name)) {
    result.text = "You Win! 🎉";
    result.winner = "player";
    gameState.playerScore++;
  } else {
    result.text = "Bot Wins! 🤖";
    result.winner = "bot";
    gameState.botScore++;
  }

  // Update score display with animation
  updateScoreDisplay();
  displayResult(result);
}

/* ============================================
   DISPLAY RESULT WITH ANIMATION
   ============================================ */
function displayResult(result) {
  // Animate result text
  gsap.fromTo(
    resultEl,
    { scale: 0.5, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.5, ease: "back.out" }
  );

  resultEl.textContent = result.text;

  // Change text color based on result
  if (result.winner === "player") {
    gsap.to(resultEl, { color: "#00ff88", duration: 0.3 });
  } else if (result.winner === "bot") {
    gsap.to(resultEl, { color: "#ff3860", duration: 0.3 });
  } else {
    gsap.to(resultEl, { color: "#00d4ff", duration: 0.3 });
  }

  // Pulse animation for winning cards
  if (result.winner === "player") {
    pulseCard(playerChoiceEl);
  } else if (result.winner === "bot") {
    pulseCard(botChoiceEl);
  }
}

/* ============================================
   PULSE ANIMATION FOR WINNING CARD
   ============================================ */
function pulseCard(element) {
  gsap.to(element, {
    scale: 1.2,
    duration: 0.3,
    repeat: 1,
    yoyo: true,
    ease: "power2.out"
  });
}

/* ============================================
   UPDATE SCORE DISPLAY
   ============================================ */
function updateScoreDisplay() {
  // Animate score numbers
  gsap.to(playerScoreEl, {
    scale: 1.3,
    duration: 0.3,
    yoyo: true,
    repeat: 1,
    ease: "back.out"
  });

  gsap.to(botScoreEl, {
    scale: 1.3,
    duration: 0.3,
    yoyo: true,
    repeat: 1,
    ease: "back.out"
  });

  playerScoreEl.textContent = gameState.playerScore;
  botScoreEl.textContent = gameState.botScore;
}

/* ============================================
   GET RANDOM BOT CHOICE
   ============================================ */
function getRandomChoice() {
  return choices[Math.floor(Math.random() * choices.length)];
}

/* ============================================
   RESET GAME
   ============================================ */
function resetGame() {
  // Confirm reset
  if (
    gameState.playerScore === 0 &&
    gameState.botScore === 0
  ) {
    return; // No need to reset if already at 0
  }

  // Animate reset
  gsap.to([playerChoiceEl, botChoiceEl, resultEl], {
    opacity: 0,
    scale: 0.8,
    duration: 0.3,
    ease: "back.in"
  });

  setTimeout(() => {
    gameState.playerScore = 0;
    gameState.botScore = 0;
    playerChoiceEl.textContent = "❔";
    botChoiceEl.textContent = "❔";
    resultEl.textContent = "Make your move!";
    playerScoreEl.textContent = "0";
    botScoreEl.textContent = "0";

    // Animate back in
    gsap.to([playerChoiceEl, botChoiceEl, resultEl], {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: "back.out"
    });
  }, 300);
}

/* ============================================
   BUTTON STATE MANAGEMENT
   ============================================ */
function disableAllButtons() {
  choiceButtons.forEach(btn => btn.disabled = true);
  resetBtn.disabled = true;
}

function enableAllButtons() {
  choiceButtons.forEach(btn => btn.disabled = false);
  resetBtn.disabled = false;
}

/* ============================================
   ADD CLICK ANIMATIONS TO BUTTONS
   ============================================ */
choiceButtons.forEach(btn => {
  btn.addEventListener("click", function() {
    // Animate button click
    gsap.to(this, {
      scale: 0.95,
      duration: 0.1
    });

    gsap.to(this, {
      scale: 1,
      duration: 0.2,
      delay: 0.1,
      ease: "back.out"
    });
  });
});

resetBtn.addEventListener("click", function() {
  gsap.to(this, {
    scale: 0.95,
    duration: 0.1
  });

  gsap.to(this, {
    scale: 1,
    duration: 0.2,
    delay: 0.1,
    ease: "back.out"
  });
});

/* ============================================
   INITIALIZE GAME
   ============================================ */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();

  // Animate game container on load
  gsap.from(".game", {
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: "power3.out"
  });

  // Stagger animation for result section
  gsap.from(".player-card", {
    opacity: 0,
    x: -30,
    duration: 0.6,
    stagger: 0.2,
    ease: "power2.out"
  });

  gsap.from(".choice-btn", {
    opacity: 0,
    y: 20,
    duration: 0.6,
    stagger: 0.1,
    ease: "power2.out"
  });
});

/* ============================================
   KEYBOARD SHORTCUTS
   ============================================ */
document.addEventListener("keydown", (e) => {
  if (gameState.isPlaying) return;

  switch(e.key.toLowerCase()) {
    case "r":
      startRound("rock");
      break;
    case "p":
      startRound("paper");
      break;
    case "s":
      startRound("scissors");
      break;
    case "t":
      startRound("stone");
      break;
    case "0":
      resetGame();
      break;
  }
});
