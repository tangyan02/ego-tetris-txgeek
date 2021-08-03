((global) => {
    var AI = {
        start() {
            selector.search()

            game.playStep('down', 1);
            console.log("max score = " + selector.maxScore)

            //休息继续找
            var sleep = (time) => {
                return new Promise((resolve) => {
                    setTimeout(resolve, time);
                });
            };
            sleep(300).then(() => {
                if (game.tetris.status === 'running') {
                    this.start()
                }
            });

        }
    };

    global.ai = AI;
})(window);