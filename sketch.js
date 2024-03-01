let game;
let dialogueSystem;
let userInput, submitButton; 
const witnessName = "Neighborhood Squirrel"; 

function setup() {
  createCanvas(600, 400);
  game = new DetectiveGame();
  dialogueSystem = new Dialogue();
  userInput = createInput('');
  submitButton = createButton('Submit'); 

  // Setup positions for input elements
  userInput.position(20, height - 40); 
  submitButton.position(userInput.x + userInput.width + 10, userInput.y);
  submitButton.mousePressed(handleSubmitInput);

  dialogueSystem.add_dialogue(witnessName, "The humans are acting strange...something's missing! *Scampers up a tree*");
}

function draw() {
  background(220);
  displayEvidence(); 
  displayDialogue();
  displayActions(); 
}


function displayEvidence() {
  text("Evidence:", 20, 30);
  for (let i = 0; i < game.evidence.length; i++) {
    let y = 50 + i * 20; 
    text(game.evidence[i].evidence, 20, y);
    text(` - ${game.evidence[i].witness}`, 150, y);
  }
}

function displayDialogue() {
  text(dialogueSystem.getCurrentDialogue(), 20, height - 100);
}

function displayActions() {
  // Placeholder: Implement suggestion of actions based on game state
}

function handleSubmitInput() {
  let currentInput = userInput.value();
  handlePlayerAction(currentInput); 
  userInput.value('');
}

function handlePlayerAction(action) {
  // Update game state/display based on the player's submitted input
  let result = game.perform_action(action);
  if (result) {
    dialogueSystem.add_dialogue("You", result);
  }
}

class DetectiveGame {
  constructor() {
    this.evidence = []; 
    this.witnesses = [];
    this.currentLocation = "park"; 
  }

  perform_action(action) {
    if (action === "sniff park") {
      return this.investigate_park();
    } // ... add more actions here
  }

  investigate_park() {
    this.addEvidence("metallic scent", witnessName); 
    return "You sniff intently... the air is thick with the scent of another dog... and something... metallic?";
  }

  add_evidence(evidence, witness) { 
    this.evidence.push({ evidence: evidence, witness: witness }); 
  }

  suggest_actions() { 
    if (this.currentLocation === "park") {
      return ["sniff park", "question local cat"]; 
    } // ... add more
  }
}

class Dialogue {
  constructor() {
    this.dialogues = [];
  }

  add_dialogue(speaker, message) {
    this.dialogues.push({ speaker: speaker, message: message });
  }

  getCurrentDialogue() {
    if (this.dialogues.length > 0) {
      return this.dialogues[0].speaker + " says: " + this.dialogues[0].message;
    } else {
      return "";
    }
  }
}
