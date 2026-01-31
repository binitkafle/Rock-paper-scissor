/* ===============================
   GAME CONFIG
   =============================== */
const choices = [
  { name: "rock", emoji: "🪨", beats: ["scissors", "stone"] },
  { name: "paper", emoji: "📄", beats: ["rock"] },
  { name: "scissors", emoji: "✂️", beats: ["paper"] },
  { name: "stone", emoji: "🪵", beats: ["scissors"] } // Different emoji for clarity
];

/* ===============================
   GAME STATE
   =============================== */
let gameState = { playerScore: 0, botScore: 0, isPlaying: false };

/* ===============================
   DOM ELEMENTS
   =============================== */
let playerChoiceEl, botChoiceEl, resultEl;
let playerScoreEl, botScoreEl;
let themeBtn, choiceButtons, resetBtn;

/* ===============================
   INITIALIZE GAME
   =============================== */
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  playerChoiceEl = document.getElementById("playerChoice");
  botChoiceEl = document.getElementById("botChoice");
  resultEl = document.getElementById("result");
  playerScoreEl = document.getElementById("playerScore");
  botScoreEl = document.getElementById("botScore");
  themeBtn = document.getElementById("themeBtn");
  choiceButtons = document.querySelectorAll(".choice-btn");
  resetBtn = document.getElementById("resetBtn");

  // Theme
  initTheme();
  themeBtn.addEventListener("click", toggleTheme);

  // Game buttons
  choiceButtons.forEach(btn => {
    btn.addEventListener("click", () => startRound(btn.dataset.choice));
  });

  resetBtn.addEventListener("click", resetGame);

  // Animate load
  gsap.from(".game", { opacity: 0, y: 50, duration: 0.8, ease: "power3.out" });
  gsap.from(".player-card", { opacity: 0, x: -30, duration: 0.6, stagger: 0.2, ease: "power2.out" });
  gsap.from(".choice-btn", { opacity: 0, y: 20, duration: 0.6, stagger: 0.1, ease: "power2.out" });

  // Keyboard shortcuts
  document.addEventListener("keydown", handleKeyPress);
});

/* ===============================
   THEME FUNCTIONS
   =============================== */
function initTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  if (saved === "light") document.body.classList.add("light-theme");
}

function toggleTheme() {
  document.body.classList.toggle("light-theme");
  localStorage.setItem("theme", document.body.classList.contains("light-theme") ? "light" : "dark");
  gsap.to(themeBtn, { rotation: 360, duration: 0.6, ease: "back.out" });
}

/* ===============================
   MAIN GAME LOGIC
   =============================== */
function startRound(playerPick) {
  if (gameState.isPlaying) return;
  gameState.isPlaying = true;
  disableAllButtons();

  const playerChoice = choices.find(c => c.name === playerPick);
  playerChoiceEl.textContent = playerChoice.emoji;
  gsap.fromTo(playerChoiceEl, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out" });
  resultEl.textContent = "Bot is choosing...";

  animateBotThinking();

  setTimeout(() => {
    const botChoice = getRandomChoice();
    revealBotChoice(botChoice);
    decideWinner(playerChoice, botChoice);
    enableAllButtons();
    gameState.isPlaying = false;
  }, 2000);
}

/* ===============================
   BOT ANIMATIONS
   =============================== */
function animateBotThinking() {
  const emojis = ["🤔", "🧠", "💭", "⚡"];
  let index = 0;
  const interval = setInterval(() => { botChoiceEl.textContent = emojis[index % emojis.length]; index++; }, 200);
  gsap.to(botChoiceEl, { y: -10, duration: 0.4, repeat: 4, yoyo: true, ease: "power1.inOut" });
  setTimeout(() => clearInterval(interval), 1900);
}

function revealBotChoice(botChoice) {
  gsap.timeline()
    .to(botChoiceEl, { rotationY: 90, duration: 0.3, ease: "back.in" })
    .call(() => { botChoiceEl.textContent = botChoice.emoji; })
    .to(botChoiceEl, { rotationY: 0, duration: 0.3, ease: "back.out" }, "<0.1");
}

/* ===============================
   DECIDE WINNER
   =============================== */
function decideWinner(playerChoice, botChoice) {
  let result = { text: "", winner: "draw" };

  if (playerChoice.name === botChoice.name) {
    result.text = "It's a Draw! 🤝";
  } else if (playerChoice.beats.includes(botChoice.name)) {
    result.text = "You Win! 🎉"; result.winner = "player"; gameState.playerScore++;
  } else {
    result.text = "Bot Wins! 🤖"; result.winner = "bot"; gameState.botScore++;
  }

  updateScoreDisplay();
  displayResult(result);
}

function displayResult(result) {
  resultEl.textContent = result.text;
  gsap.fromTo(resultEl, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out" });

  const colors = { player: "#00ff88", bot: "#ff3860", draw: "#00d4ff" };
  gsap.to(resultEl, { color: colors[result.winner], duration: 0.3 });

  if (result.winner === "player") pulseCard(playerChoiceEl);
  else if (result.winner === "bot") pulseCard(botChoiceEl);
}

function pulseCard(el) {
  gsap.to(el, { scale: 1.2, duration: 0.3, repeat: 1, yoyo: true, ease: "power2.out" });
}

function updateScoreDisplay() {
  gsap.to([playerScoreEl, botScoreEl], { scale: 1.3, duration: 0.3, repeat: 1, yoyo: true, ease: "back.out" });
  playerScoreEl.textContent = gameState.playerScore;
  botScoreEl.textContent = gameState.botScore;
}

function getRandomChoice() { return choices[Math.floor(Math.random() * choices.length)]; }

/* ===============================
   RESET GAME
   =============================== */
function resetGame() {
  if (gameState.playerScore === 0 && gameState.botScore === 0) return;

  gsap.to([playerChoiceEl, botChoiceEl, resultEl], { opacity: 0, scale: 0.8, duration: 0.3, ease: "back.in" });

  setTimeout(() => {
    gameState.playerScore = 0; gameState.botScore = 0;
    playerChoiceEl.textContent = "❔";
    botChoiceEl.textContent = "❔";
    resultEl.textContent = "Make your move!";
    updateScoreDisplay();
    gsap.to([playerChoiceEl, botChoiceEl, resultEl], { opacity: 1, scale: 1, duration: 0.4, ease: "back.out" });
  }, 300);
}

/* ===============================
   BUTTON STATE
   =============================== */
function disableAllButtons() {
  choiceButtons.forEach(btn => btn.disabled = true);
  resetBtn.disabled = true;
}
function enableAllButtons() {
  choiceButtons.forEach(btn => btn.disabled = false);
  resetBtn.disabled = false;
}

/* ===============================
   KEYBOARD SHORTCUTS
   =============================== */
function handleKeyPress(e) {
  if (gameState.isPlaying) return;
  switch(e.key.toLowerCase()) {
    case "r": startRound("rock"); break;
    case "p": startRound("paper"); break;
    case "s": startRound("scissors"); break;
    case "t": startRound("stone"); break;
    case "0": resetGame(); break;
  }
}
