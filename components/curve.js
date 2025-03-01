export function Curve(canvasId) {
  this.canvas = document.getElementById(canvasId);
  this.context = this.canvas.getContext("2d");
  this.cordArray = [];
  this.checkPoints = [];

  this.drawStartMarker = function (markX, markY) {
    this.context.beginPath();
    this.context.arc(markX, markY, 20, 0, 2 * Math.PI);
    this.context.fillStyle = "#2E658C";
    this.context.fill();
    this.context.closePath();
  };

  this.generateCurve = function (
    randStartX,
    randStartY,
    randPull1X,
    randPull1Y,
    randPull2X,
    randPull2Y,
    randEndX,
    randEndY,
    lineWd
  ) {
    this.context.beginPath();
    this.context.moveTo(randStartX, randStartY);
    this.context.bezierCurveTo(
      randPull1X,
      randPull1Y,
      randPull2X,
      randPull2Y,
      randEndX,
      randEndY
    );

    this.context.lineWidth = lineWd;
    // this.context.globalCompositeOperation = "destination-over";
    this.context.lineCap = "round";
    this.context.strokeStyle = "#D2CE5B";
    this.context.stroke();
    this.context.closePath();
  };

  this.cordGenerator = function (marker, timer) {
    var canWidth = this.canvas.width;
    var canHeight = this.canvas.height;
    var ROW = 3;
    var COL = 3;
    var PAD = 20;
    var partCanWd = canWidth / COL;
    var partCanHt = canHeight / ROW;
    var lineWd = 40;
    this.checkPoints = [];

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    timer.frame(partCanWd + partCanWd / 2, partCanHt + partCanHt / 2);

    var ultStartX = 0;
    var ultStartY = 0;

    var ultEndX = 0;
    var ultEndY = 0;

    for (var i = 0; i < ROW; i++) {
      for (var j = 0; j < COL; j++) {
        var randStartX, randStartY, randEndX, randEndY;

        if (i === 0) {
          if (j === 0) {
            randStartX = Math.floor(
              Math.random() * partCanWd + j * partCanWd + PAD
            );
            randStartY = (i + 1) * partCanHt + PAD;
            randEndX = (j + 1) * partCanWd;
            randEndY = Math.floor(
              Math.random() * partCanHt + i * partCanHt + PAD
            );

            marker.drawLoadMarker(randStartX, randStartY);
            // this.drawStartMarker(randStartX, randStartY);
            this.cordArray.push(randStartY);

            ultStartX = randStartX;
            ultStartY = randStartY;
            ultEndX = randEndX;
            ultEndY = randEndY;
          } else if (j === 1) {
            randStartX = ultEndX;
            randStartY = ultEndY;
            randEndX = (j + 1) * partCanWd;
            randEndY = Math.floor(
              Math.random() * partCanHt + i * partCanHt + PAD
            );

            this.cordArray.push(randStartX);

            ultEndX = randEndX;
            ultEndY = randEndY;
          } else if (j === 2) {
            randStartX = ultEndX;
            randStartY = ultEndY;
            randEndX = Math.floor(
              Math.random() * partCanWd + j * partCanWd - PAD
            );
            randEndY = (i + 1) * partCanHt + PAD;

            ultEndX = randEndX;
            ultEndY = randEndY;
          }
        }

        if (i === 1) {
          if (j === 0) {
            randStartX = ultStartX;
            randStartY = ultStartY;
            randEndX = Math.floor(
              Math.random() * partCanWd + j * partCanWd + PAD
            );
            randEndY = (i + 1) * partCanHt;

            this.cordArray.push(randStartY);

            ultStartX = randEndX;
            ultStartY = randEndY;
          } else if (j === 2) {
            randStartX = ultEndX;
            randStartY = ultEndY;
            randEndX = Math.floor(
              Math.random() * partCanWd + j * partCanWd - PAD
            );
            randEndY = (i + 1) * partCanHt;

            ultEndX = randEndX;
            ultEndY = randEndY;
          }
        }

        if (i === 2) {
          if (j === 0) {
            randStartX = ultStartX;
            randStartY = ultStartY;
            randEndX = (j + 1) * partCanWd + PAD;
            randEndY = Math.floor(
              Math.random() * partCanHt + i * partCanHt - PAD
            );

            ultStartX = randEndX;
            ultStartY = randEndY;
          } else if (j === 1) {
            randStartX = ultStartX;
            randStartY = ultStartY;
            randEndX = (j + 1) * partCanWd;
            randEndY = Math.floor(
              Math.random() * partCanHt + i * partCanHt - PAD
            );

            ultStartX = randEndX;
            ultStartY = randEndY;
          } else if (j === 2) {
            randStartX = ultStartX;
            randStartY = ultStartY;
            randEndX = ultEndX;
            randEndY = ultEndY;
            this.drawStartMarker(randStartX, randStartY);
          }
        }

        var randPull1X = Math.floor(Math.random() * partCanWd + j * partCanWd);
        var randPull1Y = Math.floor(Math.random() * partCanHt + i * partCanHt);
        var randPull2X = Math.floor(Math.random() * partCanWd + j * partCanWd);
        var randPull2Y = Math.floor(Math.random() * partCanHt + i * partCanHt);

        if (!(i === 1 && j === 1)) {
          this.generateCurve(
            randStartX,
            randStartY,
            randPull1X,
            randPull1Y,
            randPull2X,
            randPull2Y,
            randEndX,
            randEndY,
            lineWd
          );
          this.cordArray.push(randStartX, randStartY, randEndX, randEndY);

          const point = { x: randStartX, y: randStartY };
          // Check if the point already exists in the array
          if (
            !this.checkPoints.find((p) => p.x === point.x && p.y === point.y)
          ) {
            this.checkPoints.push(point);
          }
          this.drawStartMarker(randStartX, randStartY);
        }
      }
    }
  };
}
