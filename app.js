const instruction = document.querySelector(".instruction");
const gameMenu = document.querySelector(".game-menu");
const playGame = document.querySelector(".play-game");
const player1 = document.querySelector("[name='player1']");
const player2 = document.querySelector("[name='player2']");
const playButton = document.getElementById("play");
const timerElement = document.querySelector(".timer");
const txtTimer = document.getElementById("txtTimer");
const timeBeforePlay = 3;

const listPlayerCountry = [
  "Brazil",
  "England",
  "Spain",
  "Japan",
  "Netherlands",
  "Portugal",
  "Germany",
  "Italy",
];

function showInstruction() {
  instruction.classList.remove("hide");
}

function closeInstruction() {
  instruction.classList.add("hide");
}

function restartGame() {
  window.location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
  playButton.disabled = true;

  function checkInputs() {
    if (player1.value.trim() !== "" && player2.value.trim() !== "") {
      playButton.disabled = false;
    }
  }

  player1.addEventListener("input", checkInputs);
  player2.addEventListener("input", checkInputs);
});

function startGame() {
  initialSetup();
  const ball = new Ball();
}

function initialSetup() {
  gameMenu.classList.add("hide");
  timerElement.classList.remove("hide");
  let time = 1;
  const countdown = setInterval(() => {
    time++;
    txtTimer.innerText = time;

    if (time > timeBeforePlay) {
      txtTimer.innerText = "Start";
      setTimeout(() => {
        timerElement.classList.add("hide");
        playGame.classList.remove("hidden");
      }, 1000);
    }
  }, 1000);
}

class Ball {
  player1Name = "";
  player2Name = "";
  player1Flag = null;
  player2Flag = null;
  level = "";
  ball = "";
  txtTimer = "";
  gamePoint = "";
  gameLayout = "";
  startTime = null;
  container = "";
  countryFlag = "";
  player1Score = 0; // Add score property for player 1
  player2Score = 0; // Add score property for player 2

  constructor() {
    this.player1Name = document.querySelector("[name='player1']").value;
    this.player2Name = document.querySelector("[name='player2']").value;
    this.player1Flag = this.uppercaseFirtLetter(
      document.querySelector("[name='player1country']")?.value || "brazil"
    );
    this.player2Flag = this.uppercaseFirtLetter(
      document.querySelector("[name='player2country']")?.value || "brazil"
    );
    this.ball = document.querySelector('[name="ball"]:checked').value;
    this.level = document.querySelector("[name='level']").value;
    this.gamePoint = document.querySelector(".game-point");
    this.txtTimer = document.querySelector(".timerCount");
    this.container = document.querySelector(".container");
    this.countryFlag = document.querySelector(".country-flag");
    this.flagsItem = document.querySelectorAll(".flag-item");
    this.playerVs = document.querySelector(".name");
    this.gameMenu = document.querySelector(".game-menu");
    this.resultContainer = document.querySelector(".result");
    this.player1Side = document.querySelector(".player1-side");
    this.player2Side = document.querySelector(".player2-side");
    this.items = document.querySelector(".items");
    this.gameLayout = document.querySelector(".play-game");
    this.player1CharIndex = listPlayerCountry.indexOf(this.player1Flag) + 1;
    this.player2CharIndex = listPlayerCountry.indexOf(this.player2Flag) + 1;
    this.gamePointEl();
    // this.randomBackground();
    // this.generateItem();
    setTimeout(() => {
      this.setupTimer();
      this.Flag();
      this.playerNameVs();
      this.initialPlayer();
      this.initialBall();
      this.moveCharacter();
      this.applyGravity(this.ballEl);
      this.startScoreMonitoring();
    }, 1000);
  }

  startScoreMonitoring() {
    setInterval(() => {
      const ballRect = this.ballEl.getBoundingClientRect();
      const player1SideRect = this.player1Side.getBoundingClientRect();
      const player2SideRect = this.player2Side.getBoundingClientRect();

      if (ballRect.right <= player1SideRect.right) {
        this.player2Score++;
        this.gamePointEl();
        setTimeout(() => {
          // this.resetPosition();
        }, 50);
      } else if (ballRect.left >= player2SideRect.left) {
        this.player1Score++;
        this.gamePointEl(); 
        setTimeout(() => {
          // this.resetPosition();
        }, 50);
      }
    }, 100); // Check every 100 milliseconds
  }

  resetPosition() {
    // ball
    this.ballEl.style.left = "475px";
    this.ballEl.top = "300px";

    // character
    this.player1Char.style.left = "200px";
    this.player2Char.style.left = "750px";

    let div = document.createElement("div");
    div.classList.add("goal-animation");
    this.gameLayout.appendChild(div);
  }

  randomBackground() {
    let random = Math.round(Math.random() + 1);
    this.gameLayout.style.backgroundImage = `url(Sprites/background${random}.jpg)`;
  }

  gamePointEl() {
    this.gamePoint.innerHTML = `<div class="game-point">
    <div class="player1-flag">
      <img src="Sprites/Flag/${this.player1Flag}.png" width="55" alt="" />
    </div>
    <div class="scor-point">
      <div class="point">
        <div class="player1-point">${this.player1Score}</div>
        <div class="player2-point">${this.player2Score}</div>  
      </div>

      <div class="timer">
        <h4>TIMER</h4>
        <p class="timerCount">${this.level}</p>
      </div>
    </div>
    <div class="player2-flag">
      <img src="Sprites/Flag/${this.player2Flag}.png" width="55" alt="" />
    </div>
  </div>`;
  }

  moveCharacter() {
    let increment = 0;
    window.onkeydown = (e) => {
      console.log(e);
      let player1SideLocation = this.player1Side.getBoundingClientRect();
      let player2SideLocation = this.player2Side.getBoundingClientRect();

      // a for move left
      if (e.code == "KeyA") {
        increment++;
        increment = increment > 9 ? 0 : increment;
        let player1Position = getComputedStyle(this.player1Char);
        let newLocation = parseInt(player1Position.left.replace("px", "")) + (-20);


        this.player1Char.style.backgroundImage = `url('Sprites/Characters/Character 0${this.player1CharIndex} - ${this.player1Flag}/Move Forward/Move Forward_00${increment}.png')`;
        this.player1Char.style.backgroundSize = "contain";
        this.player1Char.style.transform = "rotateY(180deg)";

        if (
          player1SideLocation.x + this.player1Side.clientWidth >=
          this.player1Char.getBoundingClientRect().x
        ) {
          player1Move += 10;
        } else {
          this.player1Char.style.left = newLocation + "px";
        }
      }

      //  // d for move right
      if (e.code === "KeyD") {
        increment++;
        increment = increment > 9 ? 0 : increment;
        let player1Position = getComputedStyle(this.player1Char);
        let ballPosition = getComputedStyle(this.ballEl);

        let newLocation = parseInt(player1Position.left.replace("px", "")) + 20;

        this.player1Char.style.transform = "rotateY(0deg)";
        this.player1Char.style.backgroundImage = `url('Sprites/Characters/Character 0${this.player1CharIndex} - ${this.player1Flag}/Move Forward/Move Forward_00${increment}.png')`;
        this.player1Char.style.backgroundSize = "contain";

        if (
          this.player1Char.getBoundingClientRect().right >=
          player2SideLocation.right
        ) {
          // player1Move -= 10;
        } else {
          this.player1Char.style.left = newLocation + "px";
        }

        // check collision with the ball
        if (
          this.player1Char.getBoundingClientRect().right >=
          this.ballEl.getBoundingClientRect().left
        ) {
          // Ball bounce effect
          let ballNewPosition =
            parseInt(ballPosition.left.replace("px", "")) + 410;
          if (ballNewPosition < 0) {
            ballNewPosition = 0; // Prevent ball from going out of bounds
          }
          this.ballEl.style.left = ballNewPosition + "px";

          // Optionally, you can add a vertical bounce as well
          let ballVerticalPosition =
            parseInt(ballPosition.top.replace("px", "")) - 130; // Adjust as needed
          if (ballVerticalPosition < 0) {
            ballVerticalPosition = 0; // Prevent ball from going out of bounds
          }
          this.ballEl.style.top = ballVerticalPosition + "px";

          // Apply gravity
          setTimeout(() => {
            this.applyGravity(this.ballEl);
          }, 100);
        }
      }

      //  // space kick ball
      if (e.code === "Space") {
        this.player1Char.style.backgroundImage = `url('Sprites/Characters/Character 0${this.player1CharIndex} - ${this.player1Flag}/Kick/Kick_001.png')`;
        this.player1Char.style.backgroundSize = "contain";

        setTimeout(() => {
          this.player1Char.style.backgroundImage = `url('Sprites/Characters/Character 0${this.player1CharIndex} - ${this.player1Flag}/Idle/Idle_001.png'`;
          this.player1Char.style.backgroundSize = "contain";
          this.player1Char.style.top = "395px";
        }, 200);
      }

      //  // w jump
      if (e.code === "KeyW") {
        let defaultPosition = getComputedStyle(this.player1Char).top;

        this.player1Char.style.top = "290px";
        this.player1Char.style.backgroundImage = `url('Sprites/Characters/Character 0${this.player1CharIndex} - ${this.player1Flag}/Jump/Jump_000.png')`;
        this.player1Char.style.backgroundSize = "contain";

        setTimeout(() => {
          this.player1Char.style.backgroundImage = `url('Sprites/Characters/Character 0${this.player1CharIndex} - ${this.player1Flag}/Idle/Idle_001.png'`;
          this.player1Char.style.backgroundSize = "contain";
          this.player1Char.style.top = "395px";
        }, 200);
      }

      if (e.code === "ArrowLeft") {
        increment++;
        increment = increment > 9 ? 0 : increment;
        let ballPosition = getComputedStyle(this.ballEl);
        let player2Position = getComputedStyle(this.player2Char);

        let newLocation =
          parseInt(player2Position.left.replace("px", "")) + -20;

        this.player2Char.style.transform = "rotateY(180deg)";
        this.player2Char.style.backgroundImage = `url('Sprites/Characters/Character 0${this.player2CharIndex} - ${this.player2Flag}/Move Forward/Move Forward_00${increment}.png')`;
        this.player2Char.style.backgroundSize = "contain";

        // Check collision with goal side
        if (
          this.player1Side.getBoundingClientRect().x +
            this.player1Side.clientWidth >=
          this.player2Char.getBoundingClientRect().x
        ) {
          // player2Move += 10;
        } else {
          this.player2Char.style.left = newLocation + "px";
        }

        // Check collision with the ball
        if (
          this.ballEl.getBoundingClientRect().x + this.ballEl.clientWidth >=
          this.player2Char.getBoundingClientRect().x
        ) {
          // Ball bounce effect
          let ballNewPosition =
            parseInt(ballPosition.left.replace("px", "")) - 410;
          if (ballNewPosition < 0) {
            ballNewPosition = 0; // Prevent ball from going out of bounds
          }
          this.ballEl.style.left = ballNewPosition + "px";

          // Optionally, you can add a vertical bounce as well
          let ballVerticalPosition =
            parseInt(ballPosition.top.replace("px", "")) - 130; // Adjust as needed
          if (ballVerticalPosition < 0) {
            ballVerticalPosition = 0; // Prevent ball from going out of bounds
          }
          this.ballEl.style.top = ballVerticalPosition + "px";

          // Apply gravity
          setTimeout(() => {
            this.applyGravity(this.ballEl);
          }, 100);
        }
      }

      if (e.code === "ArrowRight") {
        increment++;
        increment = increment > 9 ? 0 : increment;
        let player2Position = getComputedStyle(this.player2Char);

        let newLocation = parseInt(player2Position.left.replace("px", "")) + 20;

        this.player2Char.style.transform = "rotateY(0deg)";
        this.player2Char.style.backgroundImage = `url('Sprites/Characters/Character 0${this.player2CharIndex} - ${this.player2Flag}/Move Forward/Move Forward_00${increment}.png')`;
        this.player2Char.style.backgroundSize = "contain";

        if (
          this.player2Char.getBoundingClientRect().x +
            this.player2Char.clientWidth >=
          player2SideLocation.x
        ) {
          player2Move -= 10;
        } else {
          this.player2Char.style.left = newLocation + "px";
        }
      }

      if (e.code === "ArrowUp") {
        this.player2Char.style.top = "290px";
        this.player2Char.style.backgroundImage = `url('Sprites/Characters/Character 0${this.player2CharIndex} - ${this.player2Flag}/Jump/Jump_000.png')`;
        this.player2Char.style.backgroundSize = "contain";

        setTimeout(() => {
          this.player2Char.style.backgroundImage = `url('Sprites/Characters/Character 0${this.player2CharIndex} - ${this.player2Flag}/Idle/Idle_001.png'`;
          this.player2Char.style.backgroundSize = "contain";
          this.player2Char.style.top = "395px";
        }, 200);
      }

      if (e.code === "Enter") {
        this.player2Char.style.backgroundImage = `url('Sprites/Characters/Character 0${this.player2CharIndex} - ${this.player2Flag}/Kick/Kick_001.png')`;
        this.player2Char.style.backgroundSize = "contain";
      }
    };

    window.onkeyup = (e) => {
      this.player1Char.style.backgroundImage = `url('Sprites/Characters/Character 0${this.player1CharIndex} - ${this.player1Flag}/Idle/Idle_001.png'`;
      this.player1Char.style.backgroundSize = "contain";

      this.player2Char.style.backgroundImage = `url('Sprites/Characters/Character 0${this.player2CharIndex} - ${this.player2Flag}/Idle/Idle_001.png'`;
      this.player2Char.style.backgroundSize = "contain";
    };
  }

  setupTimer() {
    this.startTime = setInterval(() => {
      this.level--;
      this.txtTimer.innerHTML = this.level;

      this.gamePointEl();
      if (this.level == 0) {
        clearInterval(this.startTime);
        this.finishGame();
      }
    }, 1000);
  }

  initialPlayer() {
    this.player1Char = document.querySelector(".player1");
    this.player2Char = document.querySelector(".player2");

    let player1Source = this.playerCharacterImage(this.player1Flag);
    let player2Source = this.playerCharacterImage(this.player2Flag);

    this.player1Char.style.backgroundImage = `url('${player1Source}')`;
    this.player1Char.style.backgroundSize = "contain";

    this.player2Char.style.backgroundImage = `url('${player2Source}')`;
    this.player2Char.style.backgroundSize = "contain";

    this.player1CharPosition = getComputedStyle(this.player1Char);
    this.player2CharPosition = getComputedStyle(this.player2Char);
  }

  initialBall() {
    this.ballEl = document.querySelector(".ball");
    this.ballEl.style.backgroundImage = `url('${this.chooseBall(this.ball)}')`;
    this.ballEl.style.backgroundSize = "contain";
    this.defaultPositionBallEl = getComputedStyle(this.ballEl);
  }

  playerCharacterImage(player) {
    let char = "";
    listPlayerCountry.forEach((value, key) => {
      if (value == player) {
        let item = key + 1;
        char = `Sprites/Characters/Character 0${item} - ${value}/Idle/Idle_001.png`;
        return true;
      }
    });
    return char.toString();
  }

  chooseBall(ball) {
    return ball == "ball1" ? "Sprites/Ball 01.png" : "Sprites/Ball 02.png";
  }

  finishGame() {
    let textShowing = ''; 
    if(this.player1Score > this.player2Score){
      textShowing = 'Player 1 Win'; 
    }else if(this.player2Score > this.player1Score){
      textShowing = 'Playe2 2 Win'
    }else{
      textShowing = 'Tie'
    }

    this.container.innerHTML = `<div class="result backInDown">
        <div class="content">Final Result</div>
        <div class="text-result">${textShowing}</div>
        <div> Player 1 Score : ${this.player1Score}</div>
        <div> Player 2 Score : ${this.player2Score}</div>
        <div>
          <button>Save History</button> 
          <button onclick="restartGame()">Restart The Game</button>
        </div>
      </div>`;
  }

  Flag() {
    this.flagsItem.forEach((item, index) => {
      let value = index % 2 == 0 ? 1 : 2;
      let flag = value == 1 ? this.player1Flag : this.player2Flag;
      item.style.backgroundImage = `url(Sprites/Flag/${flag}.png)`;
      item.style.backgroundSize = "cover";
      this.countryFlag.appendChild(item);
    });
  }

  playerNameVs() {
    this.playerVs.innerHTML = `${this.player1Name} vs ${this.player2Name}`;
  }

  uppercaseFirtLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  generateItem() {
    const listItem = [
      "Sprites/Decrease.png",
      "Sprites/Diamond.png",
      "Sprites/Increase.png",
    ];
    let number = -1;

    setInterval(() => {
      number++;

      if (number > 2) {
        number = -1;
      } else {
        const item = document.createElement("div");
        item.className = "item";
        item.style.backgroundImage = `url(${listItem[number]})`;
        item.style.backgroundSize = "contain";

        let RandomX = Math.round(Math.random() * 800);
        let RandomY = Math.round(Math.random() * 470);

        item.style.left = `${RandomX}px`;
        item.style.top = `${200}px`;
        this.items.appendChild(item);
        this.item = document.querySelectorAll(".item");
      }
    }, 5000);
  }

  applyGravity(ball) {
    let gravity = 9.8;
    let ballPositionTop = parseInt(
      getComputedStyle(ball).top.replace("px", "")
    );
    let intervalBall = setInterval(() => {
      ballPositionTop += gravity;
      ball.style.top = ballPositionTop + "px";

      if (ballPositionTop > 450) {
        // Assuming 450 is the ground level
        ballPositionTop = 450;
        ball.style.top = ballPositionTop + "px";
        clearInterval(intervalBall);
      }
    }, 30);
  }

  mathRandomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }
}

// playButton.addEventListener("click", startGame);

const ball = new Ball();
