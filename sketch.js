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
  background(0);

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

  /**
   * Displays the description and options of the current scene.
   */
  display() {
    dialogueSystem.clear();
    dialogueSystem.add_dialogue("Narrator", this.description);
    this.options.forEach((option, index) => {
      dialogueSystem.add_dialogue("Option", `➡️ ${index + 1}: ${option.text}`);
    });
    dialogueSystem.display();
  }

  /**
   * Selects an option based on the given index.
   * 
   * @param {number} index - The index of the option to select.
   * @returns {string|null} - The ID of the next scene if the option is within range, otherwise null.
   */
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

  /**
   * Adds a dialogue to the dialogues array.
   * @param {string} speaker - The speaker of the dialogue.
   * @param {string} message - The message spoken by the speaker.
   */
  add_dialogue(speaker, message) {
    this.dialogues.push({ speaker: speaker, message: `${speaker} says: ${message}` });
  }

  display() {
    textSize(16);
    fill('20FA21');
    let yPos = 50;
    this.dialogues.forEach(dialogue => {
      fill('20FA21');
      text(dialogue.message, 20, yPos, width - 40);
      yPos += 60;
    });
  }

  clear() {
    this.dialogues = [];
  }
}

class DetectiveGame {
  /**
   * Represents the constructor of the game.
   * @constructor
   */
  constructor() {
    this.scenes = this.setupScenes();
    this.currentSceneId = 'start';
    this.gameOver = false;
  }

  /**
   * Sets up the scenes for the game.
   * @returns {Object} An object containing all the scenes for the game.
   */
  setupScenes() {
    return {
      'end': new Scene('end', "🏁 Thank you for playing. The adventure ends here. 🌌", []),
      'start': new Scene('start', "🕵️‍♂️ You wake up in a virtual reality world. There's a 💻 computer with a code matrix to your right, a 🚪 mysterious door to your left, a 📚 dusty old bookshelf filled with tomes of forgotten knowledge straight ahead, and a 🌀 swirling portal on the ground just behind you.", [
        { text: "Hack the code matrix", nextSceneId: 'matrix' },
        { text: "Go through the mysterious door", nextSceneId: 'door' },
        { text: "Examine the bookshelf", nextSceneId: 'bookshelf' },
        { text: "Enter the swirling portal", nextSceneId: 'portal' }
      ]),

      'bookshelf': new Scene('bookshelf', "Approaching the bookshelf, you find an eclectic mix of ancient manuscripts and modern digital texts. A particular volume catches your eye.", [
        { text: "Read the ancient manuscript about virtual worlds", nextSceneId: 'ancient_manuscript' },
        { text: "Inspect a digital text on advanced coding techniques", nextSceneId: 'coding_tome' }
      ]),

      'portal': new Scene('portal', "Stepping into the swirling portal, you're whisked away to a realm that defies the laws of physics, filled with floating islands and ethereal music.", [
        { text: "Explore the nearest floating island", nextSceneId: 'floating_island' },
        { text: "Follow the source of the ethereal music", nextSceneId: 'music_source' }
      ]),

      'ancient_manuscript': new Scene('ancient_manuscript', "The manuscript reveals secrets of the virtual world's creation and hints at hidden powers within it. 📜", [
        { text: "Seek the hidden powers mentioned in the manuscript", nextSceneId: 'hidden_powers' },
        { text: "Return to the starting point to reconsider your options", nextSceneId: 'start' }
      ]),

      'coding_tome': new Scene('coding_tome', "The digital text enhances your understanding of the code matrix, granting you new insights and skills. 💻", [
        { text: "Apply your newfound skills to hack the code matrix", nextSceneId: 'matrix' },
        { text: "Return to the starting point with your enhanced skills", nextSceneId: 'start' }
      ]),

      'floating_island': new Scene('floating_island', "Upon exploring the island, you discover an ancient artifact that seems to resonate with the virtual world's energy. 🏝️", [
        { text: "Examine the artifact", nextSceneId: 'artifact_examination' },
        { text: "Look for a way back to the virtual world's main area", nextSceneId: 'portal_return' }
      ]),

      'music_source': new Scene('music_source', "You find an AI orchestrating music that influences the very fabric of this realm. 🎵", [
        { text: "Learn the music's secrets from the AI", nextSceneId: 'music_secrets' },
        { text: "Return to explore more of the virtual world", nextSceneId: 'portal_return' }
      ]),

      // Additional scenes for new options
      'hidden_powers': new Scene('hidden_powers', "Your quest for the hidden powers takes you on a journey through the most cryptic parts of the virtual world, revealing capabilities you never knew existed. ✨", []),
      'artifact_examination': new Scene('artifact_examination', "The artifact imbues you with a deep connection to the virtual world, altering your perception and interaction with it. 🌀", []),
      'music_secrets': new Scene('music_secrets', "Learning from the AI, you gain the ability to manipulate aspects of the virtual world through music, opening new paths and solutions. 🎶", []),
      'portal_return': new Scene('portal_return', "You find a way back to the main area of the virtual world, now equipped with new knowledge and experiences. 🌌", []),

      'matrix': new Scene('matrix', "You're inside the matrix. Codes and algorithms surround you. 🌐", [
        { text: "Start decoding", nextSceneId: 'decode' },
        { text: "Look for an exit", nextSceneId: 'exit' }
      ]),
      'door': new Scene('door', "The door leads to a room with rebels planning an operation. 🛠️", [
        { text: "Join the rebels", nextSceneId: 'rebel' },
        { text: "Return to the virtual world", nextSceneId: 'start' }
      ]),
      // Continues from the 'matrix' scene
      'decode': new Scene('decode', "You begin to decode the complex algorithms surrounding you, uncovering secrets of the virtual world. 🖥️", [
        { text: "Dive deeper into the code", nextSceneId: 'core' },
        { text: "Retreat and search for another way", nextSceneId: 'matrix' }
      ]),
      'exit': new Scene('exit', "You find a way out of the matrix, leading you to a hidden part of the virtual world. 🚪", [
        { text: "Explore the hidden area", nextSceneId: 'hidden_area' },
        { text: "Return to the main part of the matrix", nextSceneId: 'matrix' }
      ]),
      'core': new Scene('core', "You reach the core of the virtual world, discovering the source of its power. 💾", [
        { text: "Attempt to control the core", nextSceneId: 'control_core' },
        { text: "Destroy the core to free the virtual world", nextSceneId: 'destroy_core' }
      ]),
      'hidden_area': new Scene('hidden_area', "The hidden area reveals a sanctuary of data, holding the virtual world's lost histories. 📚", [
        { text: "Investigate the data", nextSceneId: 'data_sanctuary' },
        { text: "Leave the sanctuary", nextSceneId: 'exit' }
      ]),

      // Continues from the 'door' scene
      'rebel': new Scene('rebel', "You join the rebels, becoming part of their plan to overthrow the oppressive system controlling the virtual world. ✊", [
        { text: "Participate in a daring mission", nextSceneId: 'daring_mission' },
        { text: "Plan and strategize with the rebels", nextSceneId: 'strategy_session' }
      ]),
      'daring_mission': new Scene('daring_mission', "You embark on a daring mission to infiltrate a secure facility and obtain critical information. 🕶️", [
        { text: "Proceed with the infiltration", nextSceneId: 'infiltration' },
        { text: "Reconsider and back out", nextSceneId: 'rebel' }
      ]),
      'strategy_session': new Scene('strategy_session', "In the strategy session, you help devise a master plan to bring down the system. 🗺️", [
        { text: "Lead the charge based on the plan", nextSceneId: 'lead_charge' },
        { text: "Support the plan from behind the scenes", nextSceneId: 'support_role' }
      ]),
      'infiltration': new Scene('infiltration', "You successfully infiltrate the facility, but must choose between securing the data or helping captured rebels. 🏴‍☠️", [
        { text: "Secure the data", nextSceneId: 'secure_data' },
        { text: "Help the rebels", nextSceneId: 'help_rebels' }
      ]),

      // Outcomes and further developments
      'control_core': new Scene('control_core', "You gain control over the core, giving you immense power but also great responsibility. Will you use it wisely? 🌐", []),
      'destroy_core': new Scene('destroy_core', "By destroying the core, you free the virtual world from its constraints, but the future is now uncertain. 🌅", []),
      'data_sanctuary': new Scene('data_sanctuary', "Investigating the data, you uncover truths that could change the virtual world forever. But can you make it known? 🤔", []),
      'secure_data': new Scene('secure_data', "With the critical information in hand, you have the key to dismantling the system. But at what cost? 💻", []),
      'help_rebels': new Scene('help_rebels', "You choose solidarity over the mission, strengthening the rebels' resolve but losing the critical information. 🤝", []),
      'lead_charge': new Scene('lead_charge', "Leading the charge, you become a symbol of the rebellion, inspiring hope and fear in equal measure. 🚩", []),
      'support_role': new Scene('support_role', "From the shadows, you support the rebellion's cause, playing a crucial role in its successes and failures. 🛡️", []),

    };

  }

  /**
   * Returns the current scene.
   * @returns {Scene} The current scene.
   */
  getCurrentScene() {
    return this.scenes[this.currentSceneId];
  }

  /**
   * Handles the player's choice in the game.
   * @param {number} choiceIndex - The index of the selected choice.
   */
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

  /**
   * Transitions to the specified scene.
   * @param {string} nextSceneId - The ID of the next scene to transition to.
   */
  transitionToScene(nextSceneId) {
    if (this.scenes[nextSceneId]) {
      this.currentSceneId = nextSceneId;
      this.getCurrentScene().display();
    } else {
      dialogueSystem.add_dialogue("Narrator", "An unexpected error occurred.");
    }
  }

  /**
   * Resets the game to its initial state.
   */
  resetGame() {
    this.currentSceneId = 'start';
    this.gameOver = false;
    this.getCurrentScene().display();
  }
}
