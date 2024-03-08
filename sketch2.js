let game;
let dialogueSystem;
let replayButton;

function setup() createCanvas(800, 600);
dialogueSystem = new Dialogue();
game = new DetectiveGame();
game.getCurre {
  ntScene().display();

  replayButton = createButton('Replay');
  replayButton.position(width / 2 - 30, height - 75); // Adjust button position
  replayButton.mousePressed(restartGame);
  replayButton.hide(); // Hide the button until the game is over
}

function draw() {
  background(220);
  dialogueSystem.display();
}

function keyPressed() {
  if (!game.gameOver) {
    let numChoice = parseInt(key) - 1; // Convert key '1', '2', '3' to 0, 1, 2
    if (!isNaN(numChoice) && numChoice < game.getCurrentScene().options.length) {
      game.handlePlayerChoice(numChoice);
    }
  }
}

function restartGame() {
  game.resetGame();
  replayButton.hide(); // Hide the replay button
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
      dialogueSystem.add_dialogue("Option", `${index + 1}: ${option.text}`);
    });
    dialogueSystem.display();
  }

  selectOption(index) {
    if (index >= 0 && index < this.options.length) {
      return this.options[index].nextSceneId;
    }
    return this.id;
  }
}

class Dialogue {
  constructor() {
    this.dialogues = [];
  }

  add_dialogue(speaker, message) {
    this.dialogues.push({ speaker: speaker, message: message });
  }

  display() {
    textSize(16);
    let yPos = 50;
    this.dialogues.forEach(dialogue => {
      text(dialogue.speaker + " says: ", 20, yPos);
      yPos += 20;
      text(dialogue.message, 20, yPos, width - 40);
      yPos += 60;
    });
  }

  clear() {
    this.dialogues = [];
  }
}

class DetectiveGame {
  constructor() {
    this.scenes = this.setupScenes();
    this.currentSceneId = 'start';
    this.gameOver = false;
  }

  setupScenes() {
    let scenes = {
      'end': new Scene('end', "Thank you for playing. The adventure ends here.", []),
      // ... Other scenes ...
      'start': new Scene('start', "You wake up in a mysterious room. There's a door to your right and a cave to your left.", [
        { text: "Enter the cave", nextSceneId: 'cave' },
        { text: "Go through the door", nextSceneId: 'outdoor' }
      ]),
      // Add more scenes as needed
    };
    return scenes;
  }

  getCurrentScene() {
    return this.scenes[this.currentSceneId];
  }

  handlePlayerChoice(choiceIndex) {
    if (this.gameOver) {
      console.log("The game is over. No more choices can be made.");
      return; // If the game is over, ignore further key presses
    }

    const currentScene = this.getCurrentScene();
    console.log(`Current scene is: ${this.currentSceneId}`);

    if (choiceIndex < currentScene.options.length) {
      const nextSceneId = currentScene.selectOption(choiceIndex);
      console.log(`Player chose option ${choiceIndex}, transitioning to scene: ${nextSceneId}`);

      this.transitionToScene(nextSceneId);

      if (nextSceneId === 'end') {
        this.gameOver = true;
        replayButton.show(); // Show the replay button
      }
    } else {
      dialogueSystem.add_dialogue("Narrator", "Please select a valid option.");
      dialogueSystem.display();
    }
  }

  // https://chat.openai.com/c/07bd203f-42cd-444d-946a-15def0381898

  transitionToScene(nextSceneId) {
    if (this.scenes[nextSceneId]) {
      this.currentSceneId = nextSceneId;
      this.getCurrentScene().display();
    } else {
      dialogueSystem.add_dialogue("Narrator", "An unexpected error occurred.");
    }
  }

  resetGame() {
    this.currentSceneId = 'start';
    this.gameOver = false;
    this.getCurrentScene().display();
  }
}

// Continue with the rest of the classes and functions...
