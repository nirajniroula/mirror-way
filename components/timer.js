export function Timer(canvasId) {
  this.canvas = document.getElementById(canvasId);
  this.context = this.canvas.getContext("2d");
  this.clkWidth = 50;
  this.degree = 0;
  this.counter = 0;
  this.centX = 0;
  this.centY = 0;
  var that = this; // Preserve reference to the Timer instance

  this.frame = function (centerX, centerY) {
    this.centX = centerX;
    this.centY = centerY;

    that.context.clearRect(0, 0, that.canvas.width, that.canvas.height); // Clear the canvas for every frame

    that.context.font = "15pt Monospace";
    that.context.beginPath();
    that.context.arc(centerX, centerY, this.clkWidth, 0, 2 * Math.PI, false);
    that.context.strokeStyle = "#4C3B15";
    that.context.lineWidth = "2";
    that.context.stroke();
    that.context.closePath();

    that.context.beginPath();
    that.context.arc(centerX, centerY, 2, 0, 2 * Math.PI, false); // Draw the center point
    that.context.fillStyle = "#4C3B15";
    that.context.fill();
    that.context.closePath();
  };

  this.tick = function () {
    var rad = (this.degree * Math.PI) / 180; // Convert degrees to radians for the rotation
    var x = this.centX + (this.clkWidth / 2) * Math.cos(rad);
    var y = this.centY + (this.clkWidth / 2) * Math.sin(rad);

    that.context.clearRect(
      this.centX - (3 / 2) * this.clkWidth,
      this.centY + (3 / 2) * this.clkWidth - 20,
      this.clkWidth * 3,
      30
    );
    that.context.clearRect(
      this.centX - this.clkWidth / 2,
      this.centY - this.clkWidth / 2,
      this.clkWidth,
      this.clkWidth
    );

    that.context.beginPath();
    that.context.moveTo(this.centX, this.centY);
    that.context.lineTo(x, y);
    that.context.strokeStyle = "#d43e19"; // Set color for the timer line
    that.context.lineWidth = "2";
    that.context.stroke();
    that.context.closePath();

    that.context.fillText(
      "Time: " + this.counter + (this.counter < 2 ? " Sec" : " Secs"),
      this.centX - (3 / 2) * this.clkWidth,
      this.centY + (3 / 2) * this.clkWidth
    );

    this.degree += 6; // Increase by 6 degrees (360°/60 seconds = 6° per second)
    this.counter++;

    // Call `tick` recursively using setTimeout for each second
    window.setTimeout(function () {
      that.tick();
    }, 1000);
  };

  this.getBest = function () {
    return this.counter;
  };

  // Reset the timer
  this.reset = function () {
    this.degree = 0; // Reset the degree for the arc
    this.counter = 0; // Reset the counter
    that.context.clearRect(0, 0, that.canvas.width, that.canvas.height); // Clear the canvas
    that.frame(this.centX, this.centY); // Redraw the base frame
  };
}
