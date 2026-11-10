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
import { getAllRiddles, createRiddle, updateRiddle, deleteRiddle } from "./api/riddlesApi.js";
import { createPlayer, findPlayerByName, getAllPlayers, updatePlayer } from "./api/playersApi.js";

let riddle = {
    "name": "Easy Math",
    "taskDescription": "What is 11 + 13?",
    "correctAnswer": "24",
    "difficulty": "hard",
    "timelimit": 3000,
    "hint": "(10 + 10) + (1 + 3)"
}
console.log("Welcome to the riddle game");
let menu = 1

do {
    menu = prompt(`
    ===== RIDDLE GAME =====
    1. Play the game
    2. Create a new riddle
    3. Read all riddles
    4. Update an existing riddle
    5. Delete a riddle
    6. View leaderboard
    0. Exit
    `)

    switch (menu) {
        case "0":
            console.log("Goodbye! Thanks for playing!");
            break;
        case "1":
            await playGame();
            break;

        case "2":
            await handleCreateRiddle();
            break;

        case "3":
            const riddles = await getAllRiddles();
            console.log(riddles);
            break;

        case "4":
            await handleUpdateRiddle();
            break;

        case "5":
            const idDelete = prompt("Enter the riddle ID: ");
            const isDeleted = await deleteRiddle(idDelete);
            console.log("is deleted: " + isDeleted);
            break;

        case "6":
            await viewLeaderboard();
            break;

        default:
            console.log("Invalid choice");
            break;
    }
} while (menu !== '0');

async function handleCreateRiddle() {
    console.log(`Creating a new riddle`);
    const name = prompt("Enter the riddle name: ");
    const taskDescription = prompt("Enter the riddle description: ");
    const correctAnswer = prompt("Enter the correct answer: ");
    const difficulty = prompt("Enter the difficulty (easy / medium / hard): ");
    const timelimit = Number(prompt("Enter the time limit in seconds: ")) * 1000;
    const hint = prompt("Enter a hint for the riddle: ");
    try {
        const riddle = await createRiddle({
            name,
            taskDescription,
            correctAnswer,
            difficulty,
            timelimit,
            hint
        });

        console.log("The riddle was created successfully.");
        console.log(riddle);
    }
    catch (error) {
        console.log("Failed to create the riddle.");
    }
}

async function handleUpdateRiddle() {
    const idUpdate = prompt("Enter the riddle ID: ");
    console.log(`Updating a riddle`);
    const name = prompt("Enter the riddle name: ");
    const taskDescription = prompt("Enter the riddle description: ");
    const correctAnswer = prompt("Enter the correct answer: ");
    const difficulty = prompt("Enter the difficulty (easy / medium / hard): ");
    const timelimit = Number(prompt("Enter the time limit in seconds: "));
    const hint = prompt("Enter a hint for the riddle: ");
    try {
        const riddle = await updateRiddle(idUpdate, {
            name,
            taskDescription,
            correctAnswer,
            difficulty,
            timelimit,
            hint
        });

        console.log("The riddle was updated successfully.");
        console.log(riddle);
    }
    catch (error) {
        console.log("Failed to update the riddle.");
    }
}

// טבלת מובילים
async function viewLeaderboard() {
    try {
        let players = await getAllPlayers();
        if (players.length === 0) {
            console.log("The leaderboard is empty.");
            return;
        }
        players = players
            .filter(player => player.lowestTime !== null)
            .sort((a, b) => a.lowestTime - b.lowestTime);
        console.log(players);
    }
    catch (error) {
        console.log("Failed to load the leaderboard.");
    }
}

async function playGame() {
    const name = prompt("What is your name? ");
    let player;

    try {
        player = await findPlayerByName(name);

        if (!player) {
            player = await createPlayer(name);
            console.log(`Hello ${player.name}! Welcome to the riddle game.`);
        }
        else {
            console.log(`
            Hello ${player.name}! Welcome to the riddle game.
            Your previous lowest time was ${player.lowestTime / 1000} seconds.
        `);
        }
    }
    catch (error) {
        console.log("Failed to retrieve or create player. Please try again later.");
        return;
    }
    const playerClass = new Player(name);
    const level = prompt("Choose difficulty: easy / medium / hard: ");

    const riddles = await getAllRiddles();
    if (riddles.length === 0) {
        console.log(`ERROR!!! We were unable to retrieve the riddles. Please try again later.`);
        return;
    }
    else {
        let riddleFilter = riddles.filter((item) => {
            return item.difficulty === level;
        });

        if (riddleFilter.length === 0) {
            console.log("No riddles found for this difficulty!");
            return;
        }

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

            playerClass.recordTime(start, end);

            if (playerClass.times[playerClass.times.length - 1] > item.timelimit) {
                console.log(`TOO SLOW! 5 seconds penalty applied.`);
                playerClass.times[playerClass.times.length - 1] += (5000 + penalty);
            }
        });

        const { total, avg } = playerClass.showStats();
        if (player.lowestTime === null || player.lowestTime > total) {
            try {
                player.lowestTime = total;
                await updatePlayer(player);

                console.log(`🏆 Congratulations ${playerClass.name}!
                NEW RECORD! Your new best time is ${total} seconds!
                You have a new personal record! 🎉`);
            }
            catch (error) {
                console.log("Failed to update your record. Please try again later.");
            }
        }
        else
            console.log(`The total time: ${total}`)
        console.log(`The average time: ${avg}`)
    }
}