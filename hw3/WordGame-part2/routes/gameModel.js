function Game(userId, colors, font, guesses, level, remaining, status, target, timeStamp, view) {
    this.userId = userId;
    this.colors = colors;
    this.font = font;
    this.guesses = guesses;
    this.level = level;
    this.remaining = remaining;
    this.status = status;
    this.target = target;
    this.timeStamp = timeStamp;
    this.view = view;
}
module.exports = Game;

