// The Riddle class. Export it as the default export.
//
// Properties (received in the constructor):
// - id
// - name
// - taskDescription
// - correctAnswer
//
// Method:
// - ask(prompt)
//   - show the riddle (name and taskDescription) to the player
//   - ask the player for an answer using the `prompt` function that is passed in
//   - keep asking until the answer is correct

export default class Riddle {
    constructor(id, name, taskDescription, correctAnswer, difficulty, timeLimit, hint) {
        this.id = id;
        this.name = name;
        this.taskDescription = taskDescription;
        this.correctAnswer = correctAnswer;
        this.difficulty = difficulty;
        this.timeLimit = timeLimit;
        this.hint = hint;
    }
    ask(prompt) {
        console.log(`Riddle #${this.id} Name: ${this.name}`);
        let answer;
        let penalty = 0;
        do {
            answer = prompt(this.taskDescription + ' ');
            if (answer === 'hint'){
                console.log(this.hint);
                penalty += 10000;
            }

        } while (answer !== this.correctAnswer);
        return penalty;
    }
}
