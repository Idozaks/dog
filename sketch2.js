let game;
let dialogueSystem;
let replayButton;

function setup() {
  createCanvas(800, 600);
  dialogueSystem = new Dialogue();
  game = new DetectiveGame();
  game.getCurrentScene().display();

  replayButton = createButton('🔄 Replay');
  replayButton.position(width / 2 - replayButton.width / 2, height / 2);
  replayButton.mousePressed(restartGame);
  replayButton.hide();
}

function draw() {
  background(0); // Set background to black
  dialogueSystem.display();
}

function keyPressed() {
  if (!game.gameOver) {
    const numChoice = parseInt(key) - 1;
    if (!isNaN(numChoice) && numChoice < game.getCurrentScene().options.length) {
      game.handlePlayerChoice(numChoice);
    }
  }
}

function restartGame() {
  game.resetGame();
  replayButton.hide();
}

class Scene {
  constructor(id, description, options) {
    this.id = id;
    this.description = description;
    this.options = options;
  }

  display() {
    dialogueSystem.clear();
    dialogueSystem.add_dialogue("Narrator", this.description);
    this.options.forEach((option, index) => {
      dialogueSystem.add_dialogue("Option", `➡️ ${index + 1}: ${option.text}`);
    });
    dialogueSystem.display();
  }

  selectOption(index) {
    if (index >= 0 && index < this.options.length) {
      return this.options[index].nextSceneId;
    }
    return null; // Stay on the current scene if the choice is out of range
  }
}

class Dialogue {
  constructor() {
    this.dialogues = [];
  }

  add_dialogue(speaker, message) {
    this.dialogues.push({ speaker: speaker, message: `${speaker} says: ${message}` });
  }

  display() {
    fill(0, 255, 0); // Set text to Matrix green
    textSize(16);
    let yPos = 50;
    this.dialogues.forEach(dialogue => {
      text(dialogue.message, 20, yPos, width - 40);
      yPos += 60;
    });
  }

  clear() {
    this.dialogues = [];
  }
}

class DetectiveGame {
  currentScene;
  constructor() {
    this.scenes = this.setupScenes();
    this.currentSceneId = 'start';
    this.gameOver = false;
  }

  setupScenes() {
    return {
      'end': new Scene('end', "🏁 Thank you for playing. The adventure ends here. 🌌", []),
      'start': new Scene('start', "🕵️‍♂️ You wake up in a virtual reality world. There's a 💻 computer with a code matrix to your right and a 🚪 mysterious door to your left.", [
        { text: "Hack the code matrix", nextSceneId: 'matrix' },
        { text: "Go through the mysterious door", nextSceneId: 'door' }
      ]),
      'matrix': new Scene('matrix', "You're inside the matrix. Codes and algorithms surround you. 🌐", [
        { text: "Start decoding", nextSceneId: 'decode' },
        { text: "Look for an exit", nextSceneId: 'exit' }
      ]),
      'door': new Scene('door', "The door leads to a room with rebels planning an operation. 🛠️", [
        { text: "Join the rebels", nextSceneId: 'rebel' },
        { text: "Return to the virtual world", nextSceneId: 'start' }
      ]),
      // Add more scenes and options as needed
    };
  }

  getCurrentScene() {
    return this.scenes[this.currentSceneId];
  }

  handlePlayerChoice(choiceIndex) {
    if (this.gameOver) {
      dialogueSystem.add_dialogue("Narrator", "The game is over. Click the button to replay.");
      replayButton.show();
      return;
    }

    const currentScene = this.getCurrentScene();
    if (currentScene.options[choiceIndex]) {
      const nextSceneId = currentScene.selectOption(choiceIndex);
      this.transitionToScene(nextSceneId);

      if (nextSceneId === 'end') {
        this.gameOver = true;
        replayButton.show();
      }
    } else {
      dialogueSystem.add_dialogue("Narrator", "Please select a valid option.");
    }
    dialogueSystem.display();
  }

  transitionToScene(nextSceneId) {
    if (this.scenes[nextSceneId]) {
      this.currentSceneId = nextSceneId;
      this.currentScene = this.getCurrentScene();
    } else {
      dialogueSystem.add_dialogue("Narrator", "An unexpected error occurred.");
    }}}

