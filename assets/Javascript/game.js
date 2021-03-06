//GAME NOT RENDERING CHARACTER IMAGES ON GITHUB PAGES

//Document.ready function to make sure page is loaded before attempting to handle game logic
$(document).ready(function() {

    // Created character objects for player to choose their character and the enemy that will be defending against them
    let characters = {
      'Gehrman': {
        name: 'Gehrman',
        picture: "assets/images/gehrman.jpg",
        health: 100,
        attack: 10,
        counterAttack: 15
      },
      'Lady Maria': {
        name: 'Lady Maria',
        picture: "assets/images/maria.jpg",
        health: 115,
        attack: 12,
        counterAttack: 5
      },
      'Ludwig the Accursed': {
        name: 'Ludwig the Accursed',
        picture: "assets/images/ludwig.jpg",
        health: 150,
        attack: 6,
        counterAttack: 20
      },
      'Father Gascoigne': {
        name: 'Father Gascoigne',
        picture: "assets/images/gascoigne.jpg",
        health: 175,
        attack: 8,
        counterAttack: 25
      }
    };
    let currentCharacter;
    let currentDefender;
    let combatants = [];
    let turnCounter = 1;
    let killCount = 0;
  
    // drawGame function creates each of the elements of the game field
    let drawGame = function(character, drawArea, makeChar) {
      let charDiv = $("<div class='character' data-name='" + character.name + "'>");
      let charName = $("<div class='character-name'>").text(character.name);
      let charImage = $("<img alt='image' class='character-image'>").attr("src", character.picture);
      let charHealth = $("<div class='character-health'>").text(character.health);
      charDiv.append(charName).append(charImage).append(charHealth);
      $(drawArea).append(charDiv);
      // Conditional statement that allows the game to separeate the unchosen characters into enemies
      //and the chosen enemy into the defender against the player character
      if (makeChar == 'enemy') {
        $(charDiv).addClass("enemy");
      } else if (makeChar == 'defender') {
        currentDefender = character;
        $(charDiv).addClass("chosen-enemy");
      }
    };
  
    // Controls game output and notifies the user of the outcome of the fight
    let outputMessage = function(message) {
      let gameMesageSet = $("#gameOutput");
      let newMessage = $("<div>").text(message);
      gameMesageSet.append(newMessage);
  
      if (message == 'clearMessage') {
        gameMesageSet.text('');
      }
    };
  
    //Creates all of the character portraits
    let drawCharacters = function(charObj, areaDraw) {
      if (areaDraw == '#characters-section') {
        $(areaDraw).empty();
        for (let key in charObj) {
          if (charObj.hasOwnProperty(key)) {
            drawGame(charObj[key], areaDraw, '');
          }
        }
      }
      //Creates chosen player character
      if (areaDraw == '#chosen-character') {
        drawGame(charObj, areaDraw, '');
      }
      //Creates enemies to choose from
      if (areaDraw == '#available-to-attack-section') {
        for (let i = 0; i < charObj.length; i++) {
          drawGame(charObj[i], areaDraw, 'enemy');
        }
        //Allows the user to choose an enemy to become a defender
        //Keeps the user from adding more than one enemy at a time
        $(document).on('click', '.enemy', function() {
          name = ($(this).data('name'));
          if ($('#defender').children().length === 0) {
            drawCharacters(name, '#defender');
            $(this).hide();
            outputMessage("clearMessage");
          }
        });
      }
      //Creates the defender portrait from the chosen enemy
      if (areaDraw == '#defender') {
        $(areaDraw).empty();
        for (let i = 0; i < combatants.length; i++) {
          if (combatants[i].name == charObj) {
            drawGame(combatants[i], areaDraw, 'defender');
          }
        }
      }
      //Re-draws player character with updated health value after combat is initiated by the attack button
      if (areaDraw == 'playerDamage') {
        $('#defender').empty();
        drawGame(charObj, '#defender', 'defender');
      }
      //Re-draws enemy character with updated health value after combat is initiated by the attack button
      if (areaDraw == 'enemyDamage') {
        $('#chosen-character').empty();
        drawGame(charObj, '#chosen-character', '');
      }
      //Clears defender portrait from the game field and sends message to the user that they have won and to choose another defender
      if (areaDraw == 'enemyDefeated') {
        $('#defender').empty();
        let gameStateMessage = "You have defated " + charObj.name + ". Choose another enemy to fight.";
        outputMessage(gameStateMessage);
      }
    };
    //Draws characters to the appropriate section
    drawCharacters(characters, '#characters-section');
    $(document).on('click', '.character', function() {
      name = $(this).data('name');
      if (!currentCharacter) {
        currentCharacter = characters[name];
        for (let key in characters) {
          if (key != name) {
            combatants.push(characters[key]);
          }
        }
        $("#characters-section").hide();
        drawCharacters(currentCharacter, '#chosen-character');
        drawCharacters(combatants, '#available-to-attack-section');
      }
    });
  
    // Logic to allow combat to be calculated when the attack button is clicked
    $("#attack-button").on("click", function() {
      if ($('#defender').children().length !== 0) {
        let attackMessage = "You attacked " + currentDefender.name + " for " + (currentCharacter.attack * turnCounter) + " damage.";
        outputMessage("clearMessage");
        currentDefender.health = currentDefender.health - (currentCharacter.attack * turnCounter);
  
        if (currentDefender.health > 0) {
          drawCharacters(currentDefender, 'playerDamage');
          let counterAttackMessage = currentDefender.name + " attacked you back for " + currentDefender.counterAttack + " damage.";
          outputMessage(attackMessage);
          outputMessage(counterAttackMessage);
  
          currentCharacter.health = currentCharacter.health - currentDefender.counterAttack;
          drawCharacters(currentCharacter, 'enemyDamage');
          if (currentCharacter.health <= 0) {
            outputMessage("clearMessage");
            restartGame("You been defeated!   Game Over!");
            $("#attack-button").unbind("click");
          }
        } else {
          drawCharacters(currentDefender, 'enemyDefeated');
          killCount++;
          if (killCount >= 3) {
            outputMessage("clearMessage");
            restartGame("You have Won! Game Over!");
          }
        }
        turnCounter++;
      } else {
        outputMessage("clearMessage");
        outputMessage("There is nothing to attack.");
      }
    });
  
    //Restart button is drawn when there are no enemies left to fight and restarts the game when clikced
    let restartGame = function(inputEndGame) {
      let restart = $('<button>Restart</button>').click(function() {
        location.reload();
      });
      let gameState = $("<div>").text(inputEndGame);
      $("body").append(gameState);
      $("body").append(restart);
    };
  
  });