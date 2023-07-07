import React, { useRef, useEffect } from 'react';

const Canvas = () => {
  const canvasRef = useRef(null);
  const Width = 400;
  const Height = 400;

  const blockSize = 10;
  const widthInBlocks = Width / blockSize;
  const heightInBlocks = Height / blockSize;

  let score = 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const drawBorder = (context, Width, Height) => {
      context.fillStyle = "Gray";
      context.fillRect(0, 0, Width, blockSize);
      context.fillRect(0, Height - blockSize, Width, blockSize);
      context.fillRect(0, 0, blockSize, Height);
      context.fillRect(Width - blockSize, 0, blockSize, Height);
    };

    const drawScore = (context, score, blockSize) => {
      context.font = "20px Courier";
      context.fillStyle = "Black";
      context.textAlign = "left";
      context.textBaseline = "top";
      context.fillText("Score: " + score, blockSize, blockSize);
    };

    const gameOver = (context, Width, Height) => {
      clearInterval(intervalId);
      context.font = "60px Courier";
      context.fillStyle = "Black";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("Game Over", Width / 2, Height / 2);
    };

    const circle = (context, x, y, radius, fillCircle) => {
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2, false);
      if (fillCircle) {
        context.fill();
      } else {
        context.stroke();
      }
    };

    function Block(col, row) {
      this.col = col;
      this.row = row;
    }

    Block.prototype.drawSquare = function (context, color) {
      let x = this.col * blockSize;
      let y = this.row * blockSize;
      context.fillStyle = color;
      context.fillRect(x, y, blockSize, blockSize);
    };

    Block.prototype.drawCircle = function (context, color) {
      let centerX = this.col * blockSize + blockSize / 2;
      let centerY = this.row * blockSize + blockSize / 2;
      context.fillStyle = color;
      circle(context, centerX, centerY, blockSize / 2, true);
    };

    Block.prototype.equal = function (otherBlock) {
      return this.col === otherBlock.col && this.row === otherBlock.row;
    };

    function Snake() {
      this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
      ];
      this.direction = "right";
      this.nextDirection = "right";
    }

    Snake.prototype.draw = function () {
      for (let i = 0; i < this.segments.length; i++) {
        this.segments[i].drawSquare(context, "Blue");
      }
    };

    Snake.prototype.move = function () {
      const head = this.segments[0];
      let newHead;
      this.direction = this.nextDirection;
      switch (this.direction) {
        case "right":
          newHead = new Block(head.col + 1, head.row);
          break;
        case "down":
          newHead = new Block(head.col, head.row + 1);
          break;
        case "left":
          newHead = new Block(head.col - 1, head.row);
          break;
        case "up":
          newHead = new Block(head.col, head.row - 1);
          break;
        default:
          break;
      }

      if (this.checkCollision(newHead)) {
        gameOver(context, Width, Height);
        return;
      }
      this.segments.unshift(newHead);
      if (newHead.equal(apple.position)) {
        score++;
        apple.move();
      } else {
        this.segments.pop();
      }
    };

    Snake.prototype.checkCollision = function (head) {
      const leftCollision = head.col === 0;
      const topCollision = head.row === 0;
      const rightCollision = head.col === widthInBlocks - 1;
      const bottomCollision = head.row === heightInBlocks - 1;
      const wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
      const selfCollision = false;

      for (let i = 0; i < this.segments.length; i++) {
        if (head.equal(this.segments[i])) {
          selfCollision = true;
        }
      }
      return wallCollision || selfCollision;
    };

    Snake.prototype.setDirection = function (newDirection) {
      if (this.direction === "up" && newDirection === "down") {
        return;
      } else if (this.direction === "right" && newDirection === "left") {
        return;
      } else if (this.direction === "down" && newDirection === "up") {
        return;
      } else if (this.direction === "left" && newDirection === "right") {
        return;
      }
      this.nextDirection = newDirection;
    };

    function Apple() {
      this.position = new Block(10, 10);
    }

    Apple.prototype.draw = function () {
      this.position.drawCircle(context, "LimeGreen");
    };

    Apple.prototype.move = function () {
      let randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
      let randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
      this.position = new Block(randomCol, randomRow);
    };

    const snake = new Snake();
    const apple = new Apple();

    const intervalId = setInterval(() => {
      context.clearRect(0, 0, Width, Height);
      drawScore(context, score, blockSize);
      snake.move();
      snake.draw();
      apple.draw();
      drawBorder(context, Width, Height, blockSize);
    }, 100);

    const directions = {
      37: "left",
      38: "up",
      39: "right",
      40: "down"
    };

    const handleKeyDown = (event) => {
      const newDirection = directions[event.keyCode];
      if (newDirection !== undefined) {
        snake.setDirection(newDirection);
      }
    };

    document.body.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.removeEventListener('keydown', handleKeyDown);
      clearInterval(intervalId);
    };
  }, []);

  return <canvas ref={canvasRef} width={Width} height={Height} />;
};

export default Canvas;












