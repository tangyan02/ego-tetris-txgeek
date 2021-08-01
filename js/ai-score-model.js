((global) => {
    var ScoreModule = {
        getScore() {
            return Math.ceil(Math.random() * 10);
        }
    };

    global.scoreModule = ScoreModule;
})(window);