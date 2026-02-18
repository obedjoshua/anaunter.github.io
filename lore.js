const mural = document.getElementById("mural");
const viewportBox = document.getElementById("viewportBox");
const stripWrapper = document.getElementById("stripWrapper");
const storyText = document.getElementById("storyText");
const markersContainer = document.getElementById("markers");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const sections = [
  "It all began with nothingness. A void. Formless and empty.",
  "Mountains and forests grew. The first beans sprouted.",
  "Adventurers arrived in the Garden, forming the first communities.",
  "A new land was born — shaped by those who dared to explore."
];

let sectionIndex = 0;

let current = 0;
let target = 0;
const ease = 0.05;
const scrollStrength = 0.6;

let maxScroll = 0;

/* ============================= */
/* MARKERS */
/* ============================= */

sections.forEach((_, i) => {
  const dot = document.createElement("span");
  if (i === 0) dot.classList.add("active");
  markersContainer.appendChild(dot);
});

const dots = markersContainer.querySelectorAll("span");

function updateMarkers(index) {
  dots.forEach(d => d.classList.remove("active"));
  dots[index].classList.add("active");
}

/* ============================= */
/* IMAGE LOAD SAFE INIT */
/* ============================= */

function updateMaxScroll() {
  maxScroll = Math.max(0, mural.scrollWidth - window.innerWidth);
}

mural.addEventListener("load", () => {
  updateMaxScroll();
  updateViewportSize();
  updateStory();
});

window.addEventListener("resize", () => {
  updateMaxScroll();
  updateViewportSize();
});

/* ============================= */
/* SMOOTH SCROLL ENGINE */
/* ============================= */

window.addEventListener("wheel", (e) => {

  if (!introFinished) {
    e.preventDefault();
    return;
  }

  e.preventDefault();

  let scrollAmount = 0;

  /* If horizontal scroll (trackpad swipe left/right) */
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    scrollAmount = e.deltaX;
  }
  /* If holding shift → treat vertical as horizontal */
  else if (e.shiftKey) {
    scrollAmount = e.deltaY;
  }
  /* Normal vertical wheel → convert to horizontal */
  else {
    scrollAmount = e.deltaY;
  }

  target += scrollAmount * 0.8;

  target = Math.max(0, Math.min(target, maxScroll));

}, { passive: false });

function animate() {
  current += (target - current) * ease;

  mural.style.transform = `translateX(${-current}px)`;

  updateViewportPosition();
  detectSection();

  requestAnimationFrame(animate);
}

animate();

/* ============================= */
/* SECTION DETECTION */
/* ============================= */

function detectSection() {
  if (maxScroll === 0) return;

  const ratio = current / maxScroll;
  const newIndex = Math.round(ratio * (sections.length - 1));

  if (newIndex !== sectionIndex) {
    sectionIndex = newIndex;
    updateStory();
    updateMarkers(sectionIndex);
  }
}

function updateStory() {
  storyText.textContent = sections[sectionIndex];
}

/* ============================= */
/* VIEWPORT BOX SIZE + POSITION */
/* ============================= */

function updateViewportSize() {
  if (mural.scrollWidth === 0) return;

  const visibleRatio = window.innerWidth / mural.scrollWidth;

  viewportBox.style.width =
    visibleRatio * stripWrapper.offsetWidth + "px";
}

function updateViewportPosition() {
  if (maxScroll === 0) return;

  const ratio = current / maxScroll;

  viewportBox.style.left =
    ratio * (stripWrapper.offsetWidth - viewportBox.offsetWidth) + "px";
}

/* ============================= */
/* DRAG VIEWPORT */
/* ============================= */

let isDragging = false;

viewportBox.addEventListener("mousedown", () => {
  isDragging = true;
  viewportBox.style.cursor = "grabbing";
});

window.addEventListener("mouseup", () => {
  isDragging = false;
  viewportBox.style.cursor = "grab";
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging || maxScroll === 0) return;

  const rect = stripWrapper.getBoundingClientRect();

  let x = e.clientX - rect.left;
  x = Math.max(0, Math.min(x, stripWrapper.offsetWidth));

  const ratio = x / stripWrapper.offsetWidth;

  target = ratio * maxScroll;
});

/* ============================= */
/* ARROWS */
/* ============================= */

nextBtn.addEventListener("click", () => {
  sectionIndex = Math.min(sectionIndex + 1, sections.length - 1);
  snapToSection();
});

prevBtn.addEventListener("click", () => {
  sectionIndex = Math.max(sectionIndex - 1, 0);
  snapToSection();
});

function snapToSection() {
  if (maxScroll === 0) return;

  target = (sectionIndex / (sections.length - 1)) * maxScroll;
  updateStory();
  updateMarkers(sectionIndex);
}

/* ============================= */
/* AUDIO (AUTO PLAY + MUTE) */
/* ============================= */

const audio = document.getElementById("bgMusic");
const muteBtn = document.getElementById("muteBtn");

muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  muteBtn.textContent = audio.muted ? "🔇" : "🔊";
});

window.addEventListener("load", () => {
  audio.pause();
  audio.currentTime = 0;

  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay might be blocked until user interaction
    });
  }
});

const introOverlay = document.getElementById("introOverlay");
const exploreBtn = document.getElementById("exploreBtn");

/* Disable scroll until intro finishes */
let introFinished = false;

window.addEventListener("wheel", (e) => {
  if (!introFinished) {
    e.preventDefault();
  }
}, { passive: false });

exploreBtn.addEventListener("click", () => {

  /* Ensure mural fully loaded before allowing scroll */
  updateMaxScroll();
  updateViewportSize();

  introOverlay.classList.add("hidden");

  setTimeout(() => {
    introOverlay.style.display = "none";
    introFinished = true;
  }, 600);

});
const burger = document.getElementById("burger");

burger.addEventListener("click", () => {

  burger.classList.add("active");

  /* Optional fade transition */
  document.body.style.transition = "opacity 0.4s ease";
  document.body.style.opacity = "0";

  setTimeout(() => {
    window.location.href = "menu.html";
  }, 400);

});
