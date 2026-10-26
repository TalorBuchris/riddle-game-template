// Entry point of the game. Run it with: node app.js
//
// This file should:
// 1. Import PromptSync (from 'prompt-sync') and create the `prompt` function.
// 2. Import the Riddle class, the Player class, and the array of all riddles (from riddles/index.js).
// 3. Show a welcome message and ask the player for their name, then create a Player object.
// 4. Loop over all riddles. For each riddle:
//    - save the start time (Date.now())
//    - create a Riddle object and call its ask() method
//    - save the end time (Date.now())
//    - save the time using player.recordTime()
// 5. After the loop, call player.showStats() to show total time and average time per riddle.

import PromptSync from "prompt-sync";
const prompt = PromptSync();

import Player from "./classes/Player.js";
import Riddle from "./classes/Riddle.js";
import riddles from "./riddles/index.js";

console.log("Welcome to the riddle game");
const name = prompt("What is your name? ");
const player = new Player(name);

const level = prompt("Choose difficulty: easy / medium / hard: ");

let riddleFilter = riddles.filter((item) => {
    return item.difficulty === level;
});

// Shuffle riddles using Fisher-Yates
for (let i = riddleFilter.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [riddleFilter[i], riddleFilter[j]] = [riddleFilter[j], riddleFilter[i]];
}

console.log(`To get a hint, type "hint", but 10 seconds will be added to your time.`);

riddleFilter.forEach((item) => {
    let start = Date.now();

    let riddle = new Riddle(
        item.id,
        item.name,
        item.taskDescription,
        item.correctAnswer,
        item.difficulty,
        item.timelimit,
        item.hint
    );

    let penalty = riddle.ask(prompt);

    let end = Date.now();

    player.recordTime(start, end);

    if (player.times[player.times.length - 1] > item.timelimit) {
        console.log(`TOO SLOW! 5 seconds penalty applied.`);
        player.times[player.times.length - 1] += (5000 + penalty);
    }
});

player.showStats();