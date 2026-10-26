// The Player class. Export it as the default export.
//
// Properties:
// - name
// - times (an array that holds the time it took to solve each riddle)
//
// Methods:
// - recordTime(start, end)
//   - calculate the duration (end - start) and add it to the times array
// - showStats()
//   - show the total time and the average time per riddle

export default class Player {
    constructor(name, times) {
        this.name = name;
        this.times = [];
    }
    recordTime(start, end) {
        this.times.push(end - start);
    }
    showStats() {
        let sum = 0;
        this.times.forEach(time => sum += time);

        let avg = this.times.length === 0 ? 0 : sum / this.times.length;

        console.log(`The total time: ${sum/1000}`);
        console.log(`The average time: ${avg/1000}`);
    }
}