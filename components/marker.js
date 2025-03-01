export function Marker(canvasId) {
  this.canvasMarker = document.getElementById(canvasId);
  if (!this.canvasMarker) {
    console.error("Canvas not found:", canvasId);
    return;
  }

  this.contextMarker = this.canvasMarker.getContext("2d");

  // Ensure canvas has dimensions
  if (this.canvasMarker.width === 0 || this.canvasMarker.height === 0) {
    this.canvasMarker.width = 500;
    this.canvasMarker.height = 500;
  }

  this.markPosX = 0;
  this.markPosY = 0;

  this.drawLoadMarker = function (markX, markY) {
    if (isNaN(markX) || isNaN(markY)) {
      console.error("Invalid marker position:", markX, markY);
      return;
    }
    this.contextMarker.clearRect(
      0,
      0,
      this.canvasMarker.width,
      this.canvasMarker.height
    );

    this.markPosX = markX;
    this.markPosY = markY;

    this.contextMarker.beginPath();
    this.contextMarker.arc(markX, markY, 5, 0, 2 * Math.PI);
    this.contextMarker.fillStyle = "white";
    this.contextMarker.fill();
    this.contextMarker.closePath();
  };

  this.getMarkPos = function () {
    return { x: this.markPosX, y: this.markPosY };
  };
}
