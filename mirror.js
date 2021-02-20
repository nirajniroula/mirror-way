; (function () {
  "use strict";

  function Curve() {

    this.canvas = document.getElementById('play');
    this.context = this.canvas.getContext('2d');

    var that = this;

    var canWidth = this.canvas.width;
    var canHeight = this.canvas.height;

    var ROW = 3;
    var COL = 3;
    var PAD = 20;

    var partCanWd = canWidth / COL;
    var partCanHt = canHeight / ROW;

    var partCanCount = 0;
    var lineWd = 40;
    this.cordArray = [];

    function generateCurve(randStartX, randStartY, randPull1X, randPull1Y, randPull2X, randPull2Y, randEndX, randEndY) {

      var startX = randStartX;
      var startY = randStartY;

      var puller1X = randPull1X;
      var puller1Y = randPull1Y;

      var puller2X = randPull2X;
      var puller2Y = randPull2Y;

      var endX = randEndX;
      var endY = randEndY;

      that.context.beginPath();
      that.context.moveTo(randStartX, randStartY);
      that.context.bezierCurveTo(puller1X, puller1Y, puller2X, puller2Y, endX, endY);
      that.context.lineWidth = lineWd;
      that.context.lineCap = 'round';
      that.context.strokeStyle = '#D2CE5B';
      that.context.stroke();
      that.context.closePath();

      partCanCount++;
    };

    this.cordGenerator = function (marker_, timer_) {
      var ultStartX = 0;
      var ultStartY = 0;

      var ultEndX = 0;
      var ultEndY = 0;

      var centX = partCanWd + (partCanWd / 2);
      var centY = partCanHt + (partCanHt / 2);

      that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);

      timer_.frame(centX, centY);

      for (var i = 0; i < ROW; i++) {
        for (var j = 0; j < COL; j++) {
          if (i === 0) {
            if (j === 0) {
              //First Cell Path

              var randStartX = Math.floor((Math.random() * partCanWd) + (j * partCanWd) + PAD);
              var randStartY = (i + 1) * partCanHt + PAD;

              var randEndX = (j + 1) * partCanWd;
              var randEndY = Math.floor((Math.random() * partCanHt) + (i * partCanHt) + PAD);

              marker_.drawLoadMarker(randStartX, randStartY);
              that.cordArray.push(randStartY);

              ultStartX = randStartX;
              ultStartY = randStartY;

              ultEndX = randEndX;
              ultEndY = randEndY;
            }
            if (j === 1) {
              //Second Cell Path
              var randStartX = ultEndX;
              var randStartY = ultEndY;

              var randEndX = (j + 1) * partCanWd;
              var randEndY = Math.floor((Math.random() * partCanHt) + (i * partCanHt) + PAD);

              that.cordArray.push(randStartX);

              ultEndX = randEndX;
              ultEndY = randEndY;
            }
            if (j === 2) {
              //Third Cell Path

              var randStartX = ultEndX;
              var randStartY = ultEndY;

              var randEndX = Math.floor((Math.random() * partCanWd) + (j * partCanWd) - PAD);
              var randEndY = (i + 1) * partCanHt + PAD;

              ultEndX = randEndX;
              ultEndY = randEndY;

            }
          }

          if (i === 1) {
            if (j === 0) {
              var randStartX = ultStartX;
              var randStartY = ultStartY;

              var randEndX = Math.floor((Math.random() * partCanWd) + (j * partCanWd) + PAD);
              var randEndY = (i + 1) * partCanHt;

              that.cordArray.push(randStartY);

              ultStartX = randEndX;
              ultStartY = randEndY;
            }
            if (j === 2) {
              var randStartX = ultEndX;
              var randStartY = ultEndY;

              var randEndX = Math.floor((Math.random() * partCanWd) + (j * partCanWd) - PAD);
              var randEndY = (i + 1) * partCanHt;

              ultEndX = randEndX;
              ultEndY = randEndY;
            }
          }

          if (i === 2) {
            if (j === 0) {
              var randStartX = ultStartX;
              var randStartY = ultStartY;

              var randEndX = (j + 1) * partCanWd + PAD;
              var randEndY = Math.floor((Math.random() * partCanHt) + (i * partCanHt) - PAD);

              ultStartX = randEndX;
              ultStartY = randEndY;
            }
            if (j === 1) {
              var randStartX = ultStartX;
              var randStartY = ultStartY;

              var randEndX = (j + 1) * partCanWd;
              var randEndY = Math.floor((Math.random() * partCanHt) + (i * partCanHt) - PAD);

              ultStartX = randEndX;
              ultStartY = randEndY;
            }
            if (j === 2) {
              var randStartX = ultStartX;
              var randStartY = ultStartY;

              var randEndX = ultEndX;
              var randEndY = ultEndY;

            }
          }

          var randPull1X = Math.floor((Math.random() * partCanWd) + (j * partCanWd));
          var randPull1Y = Math.floor((Math.random() * partCanHt) + (i * partCanHt));
          var randPull2X = Math.floor((Math.random() * partCanWd) + (j * partCanWd));
          var randPull2Y = Math.floor((Math.random() * partCanHt) + (i * partCanHt));



          if (!(i === 1 && j === 1)) {
            generateCurve(randStartX, randStartY, randPull1X, randPull1Y, randPull2X, randPull2Y, randEndX, randEndY);
          }
          partCanCount++;
        }
      }
    };

  };


  function Marker() {

    var that = this;
    this.canvasMarker = document.getElementById('marker');
    this.contextMarker = this.canvasMarker.getContext('2d');

    var markPosX = 0;
    var markPosY = 0;

    this.setMarkPos = function (markX_, markY_) {
      markPosX = markX_;
      markPosY = markY_;

    };

    this.getMarkPos = function () {
      return {
        x: markPosX,
        y: markPosY

      }
    };

    this.drawLoadMarker = function (markX_, markY_) {
      that.contextMarker.clearRect(0, 0, that.canvasMarker.width, that.canvasMarker.height);
      var initPosX = markX_;
      var initPosY = markY_;

      that.setMarkPos(initPosX, initPosY);
      that.contextMarker.beginPath();
      that.contextMarker.moveTo(initPosX, initPosY);

      that.contextMarker.arc(initPosX, initPosY, 5, 0, 2 * Math.PI);
      that.contextMarker.lineWidth = '1';
      that.contextMarker.fillStyle = '#d43e19';
      that.contextMarker.fill();
      that.contextMarker.closePath();
    };
  };

  function Timer() {

    this.canvas = document.getElementById('timer');
    this.context = this.canvas.getContext('2d');
    var clkWidth = 50;
    var degree = 0;
    var that = this;
    var counter = 0;

    var centX;
    var centY;

    this.frame = function (centerX, centerY) {
      centX = centerX;
      centY = centerY;

      that.context.font = "15pt Monospace";
      that.context.beginPath();
      that.context.arc(centerX, centerY, clkWidth, 0, 2 * Math.PI, false);
      that.context.strokeStyle = '#4C3B15';
      that.context.lineWidth = '2';
      that.context.stroke();
      that.context.closePath();


      that.context.beginPath();
      that.context.moveTo(centerX, centerY);
      that.context.arc(centerX, centerY, 2, 0, 2 * Math.PI, false);
      that.context.fillStyle = '#4C3B15';
      that.context.fill();
      that.context.closePath();
    };

    this.tick = function () {
      that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);
      that.frame(centX, centY);
      var rad = degree * Math.PI / 180;
      var x = centX + clkWidth / 2 * Math.cos(rad);
      var y = centY + clkWidth / 2 * Math.sin(rad);
      that.context.moveTo(centX, centY);
      that.context.lineTo(x, y);
      that.context.strokeStyle = '#d43e19';
      that.context.lineWidth = '2';
      that.context.stroke();
      that.context.closePath();
      that.context.fillText("Time: " + counter + (counter < 2 ? " Sec" : " Secs"), centX - (3 / 2 * clkWidth), centY + (3 / 2 * clkWidth));

      degree = degree + (Math.PI * 2);
      counter++;
      window.setTimeout(function () { that.tick(); }, 1000);
    };

    this.getBest = function () {
      return counter;
    };
  };

  function Info() {
    var bestLabel = document.getElementById('h-value');
    var levelLabel = document.getElementById('l-value');

    this.setBestLevel = function (best_, level_) {
      bestLabel.innerHTML = best_;
      levelLabel.innerHTML = level_;
    };
  };

  function MirrorPath() {

    var marker = new Marker();
    var curve = new Curve();
    var timer = new Timer();
    var info = new Info();

    var markPointX;
    var markPointY;

    var checkCountClk = 0;
    var checkCountAntiClk = 0;
    var isMouseDown = false;

    var playFlag = false;

    var highScore = 0;
    var level = 0;

    var playBtn = document.getElementById('btn');
    playBtn.onclick = function () {
      playFlag = true;
      playBtn.style.display = 'none';
      timer.tick();
    };

    function getMousePos(event) {
      var mouseX = event.pageX - marker.contextMarker.canvas.offsetLeft;
      var mouseY = event.pageY - marker.contextMarker.canvas.offsetTop;
      return {
        x: mouseX,
        y: mouseY
      }
    };


    marker.contextMarker.canvas.addEventListener('mousedown', function (event) {
      if (event.which === 1 && playFlag) {
        isMouseDown = true;
        event.target.setCapture();
        //getMousePos(event).x;
      }
    });

    window.addEventListener("mouseup", function (event) {
      isMouseDown = false;
    });

    marker.contextMarker.canvas.addEventListener("mousemove", function (event) {
      if (isMouseDown && playFlag) {
        drawLine(getMousePos(event).x, getMousePos(event).y);
      }
    });

    var ptX = 0;
    var ptY = 0;


    function drawLine(x_, y_) {

      var markPointX = marker.getMarkPos().x;
      var markPointY = marker.getMarkPos().y;

      var markerPos = checkMousePos(x_, y_, ptX, ptY);
      checkPoint(markerPos.x, markerPos.y);
      checkBoundary(markerPos.x, markerPos.y);
      marker.drawLoadMarker(markerPos.x, markerPos.y);

      curve.context.beginPath();

      curve.context.moveTo(markPointX, markPointY);
      curve.context.lineTo(markerPos.x, markerPos.y);

      ptX = x_;
      ptY = y_;

      markPointX = markerPos.x;
      markPointY = markerPos.y;
      curve.context.lineWidth = '2';
      curve.context.strokeStyle = '#d43e19';
      curve.context.stroke();
      curve.context.closePath();
    };

    function checkMousePos(currX, currY, preX, preY) {
      var markX = marker.getMarkPos().x; //make a function that gives position of marker
      var markY = marker.getMarkPos().y;
      if (currY > preY) {
        markY--;
        if (currX < preX) {
          markX--;
        }
        if (currX < preX) {
          markX++;
        }
        //set the updated values of marker
      }

      if (currY < preY) {
        markY++;
        if (currX > preX) {
          markX++;
        }
        if (currX < preX) {
          markX--;
        }
      }

      if (currX > preX) {
        markX++;
        if (currY < preY) {
          markY++;
        }
        if (currY > preY) {
          markY--;
        }
      }

      if (currX < preX) {
        markX--;
        if (currY < preY) {
          markY++;
        }
        if (currY > preY) {
          markY--;
        }
      }

      return {
        x: markX,
        y: markY
      }
    };

    function checkPoint(checkX, checkY) {
      //console.log(curve.cordArray);
      if (checkY < curve.cordArray[0]) {
        console.log("Y-less");
      }
      if (checkY > curve.cordArray[0]) {
        console.log("Y-greater");
      }

      if (checkX < curve.cordArray[1]) {
        console.log("X-less");
      }
      if (checkX > curve.cordArray[1]) {
        console.log("X-greater");
      }

      // if ((checkCountClk < 2 || checkCountAntiClk < 2) && checkY > curve.cordArray[0]) {
      //   checkCountClk = 0;
      //   checkCountAntiClk = 0;
      //   console.log(checkCountClk + "A" + checkCountAntiClk);
      // }

      // if ((checkCountClk === 2 || checkCountAntiClk === 2) && checkY === curve.cordArray[0]) {
      //   checkCountClk++;
      //   console.log(checkCountClk + "B" + checkCountAntiClk);

      // }

      // if (checkCountAntiClk === 1 && checkX === curve.cordArray[1]) {
      //   checkCountClk--;
      //   checkCountAntiClk++;
      //   console.log(checkCountClk + "C" + checkCountAntiClk);

      // }

      // if (checkCountClk === 1 && checkY === curve.cordArray[2]) {
      //   checkCountClk++;
      //   checkCountAntiClk--;
      //   console.log(checkCountClk + "D" + checkCountAntiClk);

      // }

      // if (checkCountClk === 0 && checkX === curve.cordArray[1]) {
      //   checkCountClk++;
      //   checkCountAntiClk--;
      //   console.log(checkCountClk + "E" + checkCountAntiClk);

      // }

      // if (checkCountAntiClk === 0 && checkY === curve.cordArray[2]) {
      //   checkCountAntiClk++;
      //   checkCountClk--;
      //   console.log(checkCountClk + "F" + checkCountAntiClk);

      // }
    };

    function checkBoundary(xPix, yPix) {
      var pixel = curve.context.getImageData(xPix, yPix, 1, 1).data;
      if (pixel[0] === 212 && pixel[1] === 62 && pixel[2] === 25 && pixel[3] === 255 && (checkCountAntiClk === 3 || checkCountClk === 3)) {
        console.log('Level Up');
        isMouseDown = false;

        level = getCookie("mirror-lev");
        level++;
        getCookie("mirror-hs") < timer.getBest() ? highScore = timer.getBest() : highScore = getCookie("mirror-hs");
        setCookie('mirror-hs', highScore, 5);
        setCookie('mirror-lev', level, 5);
        console.log(highScore);
        alert('Level Up');

        window.location.reload();
      }
      if (pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0 && pixel[3] === 0) {
        console.log('Game Over');
        isMouseDown = false;
        alert('Game Over!');
        window.location.reload();
      }
    };

    function setCookie(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toGMTString();
      document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    function getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    };

    function checkCookie() {
      var hs = getCookie("mirror-hs");
      var lev = getCookie("mirror-lev");
      if (hs != "") {
        info.setBestLevel(hs, lev);
        console.log('yeshighscore', lev);
      } else {
        console.log('nohighscore', lev);
        setCookie("mirror-hs", highScore, 0);
        setCookie("mirror-lev", level, 0);
        info.setBestLevel(0, 0);
      }
    };

    function init() {

      curve.cordGenerator(marker, timer);
      //info.setBestLevel(highScore, level);
      if (!getCookie("mirror-lev") === 0) {
        playBtn.innerHTML = 'PLAY AGAIN';
      } else {
        playBtn.innerHTML = 'PLAY';
      }
      markPointX = 0;
      markPointY = 0;
    };

    window.onload = checkCookie();
    // window.scrollTo(0, document.body.scrollHeight);
    init();


  };

  window.MirrorPath = MirrorPath;

})();
