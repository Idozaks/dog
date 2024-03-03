let game;
let dialogueSystem;
let userInput, submitButton;

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
      text(`${dialogue.speaker} says: ${dialogue.message}`, 20, yPos);
      yPos += 24;
    });
  }

  clear() {
    this.dialogues = [];
  }
}

class DetectiveGame {
  constructor() {
    this.scenes = this.setupScenes();
    this.currentScene = this.scenes.start;
  }

  setupScenes() {
    const scenes = {
      end: new Scene("end", "Thank you for playing. The adventure ends here.", []),
      outdoor: new Scene("outdoor", "You find yourself in a beautiful garden. There's a path leading back inside.", [
        { text: "Go back inside", nextSceneId: "end" }
      ]),
      cave: new Scene("cave", "You explore the dark cave and find a treasure chest.", [
        { text: "Open the chest", nextSceneId: "end" },
        { text: "Leave the chest and exit the cave", nextSceneId: "outdoor" }
      ]),
      start: new Scene("start", "You wake up in a mysterious room. There's a door to your right and a cave to your left.", [
        { text: "Enter the cave", nextSceneId: "cave" },
        { text: "Go through the door", nextSceneId: "outdoor" }
      ])
    };

    return scenes;
  }

  transitionToScene(sceneId) {
    if (this.scenes[sceneId]) {
      this.currentScene = this.scenes[sceneId];
      this.currentScene.display();
    } else {
      dialogueSystem.add_dialogue("Narrator", "An unexpected error occurred.");
      dialogueSystem.display();
    }
  }

  handlePlayerChoice(choiceIndex) {
    const selectedOption = this.currentScene.options[choiceIndex];
    if (selectedOption) {
      this.transitionToScene(selectedOption.nextSceneId);
    } else {
      dialogueSystem.add_dialogue("Narrator", "Please select a valid option.");
      dialogueSystem.display();
    }
  }
}

function setup() {
  createCanvas(400, 800);
  dialogueSystem = new Dialogue();
  game = new DetectiveGame();

  userInput = createInput('');
  userInput.position(20, height - 40);
  userInput.size(width - 140);

  submitButton = createButton('Submit');
  submitButton.position(userInput.x + userInput.width + 10, userInput.y);
  submitButton.mousePressed(handleSubmitInput);

  game.currentScene.display();
}

function draw() {
  background(220);
}

function handleSubmitInput() {
  const choiceIndex = parseInt(userInput.value()) - 1;
  userInput.value('');
  game.handlePlayerChoice(choiceIndex);
}
