import { Curve } from "./components/curve.js";
import { Info } from "./components/info.js";
import { Marker } from "./components/marker.js";
import { Timer } from "./components/timer.js";

class MirrorPath {
  constructor() {
    this.marker = new Marker("marker");
    this.curve = new Curve("play");
    this.timer = new Timer("timer");
    this.info = new Info("h-value", "l-value");
    this.playFlag = false;
    this.isMouseDown = false;
    this.mirrorEffectEnabled = true; // Mirror effect is on by default
    this.highScore = 0;
    this.level = 0;
    this.ptX = 0;
    this.ptY = 0;

    this.checkpoints; // Initialize checkpoints array
    this.checkpointCount = 0; // Initialize checkpoint count
    this.visitedCheckpoints = new Set(); // Keep track of visited checkpoints

    // Store references to event listeners for cleanup
    this.eventListeners = {
      btnClick: null,
      keyDown: null,
      keyUp: null,
      mouseMove: null,
      mirrorToggle: null,
    };

    this.init();
  }

  init() {
    this.gameStopped = false;
    this.curve.cordGenerator(this.marker, this.timer);
    this.checkpoints = this.curve.checkPoints;
    this.setupEventListeners();
    this.checkCookie();
  }

  restartGame() {
    this.level = 0; // Reset level
    this.highScore = 0; // Reset high score (optional)
    document.getElementById("gameOverScreen").style.display = "none";
    document.getElementById("levelUpScreen").style.display = "none";
    this.timer.reset(); // Reset timer
    this.checkpoints = null;
    this.checkpointCount = 0; // Initialize checkpoint count
    this.visitedCheckpoints = new Set(); // Keep track of visited checkpoints
    // Clean up existing listeners
    this.removeEventListeners();
    this.init(); // Reinitialize game
  }

  // setupEventListeners() {
  //   document
  //     .getElementById("btn")
  //     .addEventListener("click", () => this.startGame());
  //   this.marker.contextMarker.canvas.addEventListener("mousedown", (event) =>
  //     this.handleMouseDown(event)
  //   );
  //   window.addEventListener("mouseup", () => (this.isMouseDown = false));
  //   this.marker.contextMarker.canvas.addEventListener("mousemove", (event) =>
  //     this.handleMouseMove(event)
  //   );
  // }

  setupEventListeners() {
    // Remove existing listeners (if any) to avoid duplicates
    this.removeEventListeners();

    // Add new listeners and store their references
    const btn = document.getElementById("btn");
    if (btn) {
      this.eventListeners.btnClick = () => this.startGame();
      btn.addEventListener("click", this.eventListeners.btnClick);
    }

    this.eventListeners.keyDown = (event) => this.handleKeyDown(event);
    window.addEventListener("keydown", this.eventListeners.keyDown);

    this.eventListeners.keyUp = (event) => this.handleKeyUp(event);
    window.addEventListener("keyup", this.eventListeners.keyUp);

    this.eventListeners.mouseMove = (event) => this.handleMouseMove(event);
    this.marker.contextMarker.canvas.addEventListener(
      "mousemove",
      this.eventListeners.mouseMove
    );

    const mirrorToggle = document.getElementById("mirror-effect");
    if (mirrorToggle) {
      this.eventListeners.mirrorToggle = (event) => {
        this.mirrorEffectEnabled = event.target.checked;
        this.restartGame();
      };
      mirrorToggle.addEventListener("change", this.eventListeners.mirrorToggle);
    }
  }

  removeEventListeners() {
    const btn = document.getElementById("btn");
    if (btn && this.eventListeners.btnClick) {
      btn.removeEventListener("click", this.eventListeners.btnClick);
    }

    if (this.eventListeners.keyDown) {
      window.removeEventListener("keydown", this.eventListeners.keyDown);
    }

    if (this.eventListeners.keyUp) {
      window.removeEventListener("keyup", this.eventListeners.keyUp);
    }

    if (this.eventListeners.mouseMove) {
      this.marker.contextMarker.canvas.removeEventListener(
        "mousemove",
        this.eventListeners.mouseMove
      );
    }

    const mirrorToggle = document.getElementById("mirror-effect");
    if (mirrorToggle && this.eventListeners.mirrorToggle) {
      mirrorToggle.removeEventListener(
        "change",
        this.eventListeners.mirrorToggle
      );
    }

    // Clear all listener references
    this.eventListeners = {
      btnClick: null,
      keyDown: null,
      keyUp: null,
      mouseMove: null,
      mirrorToggle: null,
    };
  }

  handleKeyDown(event) {
    if (event.code === "Space" && this.playFlag) {
      event.preventDefault(); // Prevent page scrolling
      this.isMouseDown = true; // Activate marker movement
      document.body.style.cursor = "none"; // Hide actual cursor
    }
  }

  handleKeyUp(event) {
    if (event.code === "Space") {
      this.isMouseDown = false; // Stop marker movement
      document.body.style.cursor = "default"; // Restore cursor
    }
  }

  startGame() {
    this.playFlag = true;
    document.getElementById("btn").style.display = "none";
    this.timer.tick();
  }

  handleMouseDown(event) {
    if (event.which === 1 && this.playFlag) {
      this.isMouseDown = true;
      event.target.setCapture();
      const { x, y } = this.getMousePos(event);
      this.startX = x; // Set starting point
      this.startY = y; // Set starting point
      this.direction = null; // Reset direction
    }
  }

  handleMouseMove(event) {
    if (this.isMouseDown && this.playFlag) {
      const { x, y } = this.getMousePos(event);
      this.drawLine(x, y);
    }
  }

  getMousePos(event) {
    const canvas = this.marker.contextMarker.canvas;
    return {
      x: event.pageX - canvas.offsetLeft,
      y: event.pageY - canvas.offsetTop,
    };
  }

  drawLine(x, y) {
    const { x: markX, y: markY } = this.marker.getMarkPos();
    let markerPos;
    if (this.mirrorEffectEnabled) {
      markerPos = this.checkMouseMirrorPos(x, y, this.ptX, this.ptY);
    } else {
      markerPos = this.checkMousePos(x, y, this.ptX, this.ptY);
    }

    // this.checkPoint(markerPos.x, markerPos.y);
    this.checkBoundary(markerPos.x, markerPos.y);
    this.marker.drawLoadMarker(markerPos.x, markerPos.y);

    const ctx = this.curve.context;
    ctx.beginPath();
    ctx.globalCompositeOperation = "source-over";
    ctx.moveTo(markX, markY);
    ctx.lineTo(markerPos.x, markerPos.y);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.closePath();

    this.ptX = x;
    this.ptY = y;
  }

  //Without mirror effect
  checkMousePos(currX, currY, preX, preY) {
    let { x: markX, y: markY } = this.marker.getMarkPos();
    markX += Math.sign(currX - preX);
    markY += Math.sign(currY - preY);
    return { x: markX, y: markY };
  }

  //With mirror effect
  checkMouseMirrorPos(currX, currY, preX, preY) {
    let { x: markX, y: markY } = this.marker.getMarkPos();

    // Apply mirror effect: Flip the X coordinate
    markX = this.curve.canvas.width - markX; // Flip horizontally

    // Update marker position based on mouse movement
    markX += Math.sign(currX - preX);
    markY += Math.sign(currY - preY);

    // Flip the X coordinate back for rendering
    markX = this.curve.canvas.width - markX;

    return { x: markX, y: markY };
  }

  hasCompletedRound(x, y) {
    return (
      this.checkpointCount >= 7 &&
      Math.hypot(x - this.checkpoints[0].x, y - this.checkpoints[0].y) < 15
    );
  }

  checkBoundary(x, y) {
    const pixel = this.curve.context.getImageData(x, y, 1, 1).data;

    // Handle outside boundary (game over)
    if (pixel.every((val) => val === 0) && !this.gameStopped) {
      this.showGameOverAnimation();
      this.gameStopped = true; // Set flag to prevent multiple calls
    }

    // Check if near a checkpoint
    this.checkpoints.forEach((checkpoint, index) => {
      if (
        !this.visitedCheckpoints.has(index) && // Check if already visited
        Math.hypot(x - checkpoint.x, y - checkpoint.y) < 20 // Check distance
      ) {
        this.visitedCheckpoints.add(index); // Mark as visited
        this.checkpointCount++;
        if (this.checkpointCount !== 1) {
          this.showConfetti();
        }
      }
    });

    if (this.hasCompletedRound(x, y) && !this.gameStopped) {
      this.showLevelUpAnimation();
      this.gameStopped = true; // Set flag to prevent multiple calls
      this.level = Number(this.getCookie("mirror-lev")) + 1;
      this.highScore =
        this.highScore === 0
          ? this.timer.getBest()
          : Math.min(this.getCookie("mirror-hs"), this.timer.getBest());
      this.setCookie("mirror-hs", this.highScore, 5);
      this.setCookie("mirror-lev", this.level, 5);
    }
  }

  // // Function to show the game-over animation
  showGameOverAnimation() {
    document.getElementById("gameOverScreen").style.display = "flex";
  }

  showLevelUpAnimation() {
    document.getElementById("levelUpScreen").style.display = "flex";
    this.showConfetti();
  }

  showConfetti() {
    confetti({
      particleCount: 500,
      spread: 360,
      origin: { y: 0.6 },
    });
  }

  setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
  }

  getCookie(name) {
    return (
      document.cookie
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith(name + "="))
        ?.split("=")[1] || ""
    );
  }

  checkCookie() {
    const hs = this.getCookie("mirror-hs");
    const lev = this.getCookie("mirror-lev");
    this.info.setBestLevel(hs || 0, lev || 0);
  }
}
const game = new MirrorPath();
// window.onload = () => game;
window.restartGame = () => game.restartGame();
