const bgDisplay = document.getElementById("bgDisplay");
const title = document.getElementById("title");
const cat = document.getElementById("cat");
const eatBtn = document.getElementById("eatBtn");
const playBtn = document.getElementById("playBtn");
const sleepBtn = document.getElementById("sleepBtn");
const restart = document.getElementById("restart");
const hearts = [
  document.getElementById("heart1"), // Tied to hunger
  document.getElementById("heart2"), // Tied to happiness
  document.getElementById("heart3")  // Tied to energy
];

let hunger = 100, happiness = 100, energy = 100;
let isAlive = true;
let decayRate = 1;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function startSequence() {
  // Initial state: pixel cat + bg1 + title
  bgDisplay.style.backgroundImage = "url('assets/bg1.png')";
  cat.classList.add("pixel-cat");
  cat.style.backgroundImage = "url('assets/catpixel.png')";
  title.textContent = "Tamagotchi Virtual Pet Game";

  // Hide hearts at start
  document.querySelector(".heart-container").classList.add("hidden");

  // Set initial opacity to 0
  title.style.opacity = 0;
  cat.style.opacity = 0;
  bgDisplay.style.opacity = 0;

  await delay(100);
  title.style.animation = "fadeIn 2s ease-in-out forwards";
  cat.style.animation = "fadeIn 2s ease-in-out 1s forwards";
  bgDisplay.style.animation = "fadeIn 2s ease-in-out forwards";

  await delay(3000); // Stay on intro screen

  // Fade out intro
  bgDisplay.style.animation = "fadeOut 1s ease-in-out forwards";
  cat.style.animation = "fadeOut 1s ease-in-out forwards";
  title.style.animation = "fadeOut 1s ease-in-out forwards";

  await delay(1500); // Wait for fade

  // Game background and real cat
  cat.classList.remove("pixel-cat");
  bgDisplay.style.backgroundImage = "url('assets/bg2.png')";
  cat.style.backgroundImage = "url('assets/normalcat.png')";

  bgDisplay.style.animation = "fadeIn 2s ease-in-out forwards";
  cat.style.animation = "fadeIn 2s ease-in-out forwards";

  // Show hearts now
  document.querySelector(".heart-container").classList.remove("hidden");
  updateHearts();
}

function updateHearts() {
  if (!isAlive) {
    hearts.forEach((heart) => (heart.style.opacity = 0.3));
    return;
  }

  // Death if any stat hits 0
  if (hunger <= 0 || happiness <= 0 || energy <= 0) {
    isAlive = false;
    cat.style.backgroundImage = "url('assets/dead.gif')";
    eatBtn.disabled = true;
    playBtn.disabled = true;
    sleepBtn.disabled = true;
    hearts.forEach((heart) => (heart.style.opacity = 0.3));
    return;
  }

  const averageStat = (hunger + happiness + energy) / 3;
  const heartCount = Math.ceil(averageStat / 33.34); // 0–3 hearts

  hearts.forEach((heart, index) => {
    heart.style.opacity = index < heartCount ? 1 : 0.3;
  });
}

function decreaseStats() {
  if (!isAlive) return;
  hunger = Math.max(0, hunger - decayRate);
  happiness = Math.max(0, happiness - decayRate);
  energy = Math.max(0, energy - decayRate);
  updateHearts();
  decayRate += 0.1; // Gradually increase difficulty
}

setInterval(decreaseStats, 1000); // Every 1 sec

function playAnimation(gifUrl) {
  if (!isAlive) return;
  cat.classList.remove("pixel-cat");
  cat.style.backgroundImage = `url('${gifUrl}')`;
  setTimeout(() => {
    if (isAlive) {
      cat.style.backgroundImage = "url('assets/normalcat.png')";
    }
  }, 2000);
}

eatBtn.addEventListener("click", () => {
  if (!isAlive) return;
  hunger = Math.min(100, hunger + 20);
  playAnimation("assets/eat.gif");
  updateHearts();
});

playBtn.addEventListener("click", () => {
  if (!isAlive) return;
  happiness = Math.min(100, happiness + 20);
  playAnimation("assets/play.gif");
  updateHearts();
});

sleepBtn.addEventListener("click", () => {
  if (!isAlive) return;
  energy = Math.min(100, energy + 20);
  playAnimation("assets/sleep.gif");
  updateHearts();
});

restart.addEventListener("click", () => {
  // Reset state first
  hunger = 100;
  happiness = 100;
  energy = 100;
  decayRate = 1;
  isAlive = true;
  eatBtn.disabled = false;
  playBtn.disabled = false;
  sleepBtn.disabled = false;
  cat.style.left = '236px'; // Reset cat position
  updateHearts();

  // Animate reset
  bgDisplay.style.animation = "fadeOut 1s ease-in-out forwards";
  cat.classList.add("pixel-cat");
  cat.style.backgroundImage = "url('assets/catpixel.png')";
  cat.style.animation = "fadeOut 1s ease-in-out forwards";
  title.style.animation = "fadeOut 1s ease-in-out forwards";

  setTimeout(() => {
    bgDisplay.style.backgroundImage = "url('assets/bg1.png')";
    bgDisplay.style.animation = "fadeIn 2s ease-in-out forwards";
    title.style.animation = "fadeIn 2s ease-in-out forwards";
    cat.style.animation = "fadeIn 2s ease-in-out 1s forwards";
    startSequence();
  }, 1500);
});

// Add keyboard controls for cat movement
document.addEventListener('keydown', (event) => {
  if (!isAlive) return;
  const currentLeft = parseFloat(cat.style.left || '236'); // Default to 236px
  const step = 5; // Pixels to move per key press
  const minLeft = 164; // Left edge of bg-display
  const maxLeft = 296; // Right edge of bg-display minus cat width (227 - 95 = 132 + 164 = 296)

  if (event.key === 'ArrowLeft') {
    cat.style.left = `${Math.max(minLeft, currentLeft - step)}px`;
  } else if (event.key === 'ArrowRight') {
    cat.style.left = `${Math.min(maxLeft, currentLeft + step)}px`;
  }
});

// Start the intro
startSequence();
updateHearts();