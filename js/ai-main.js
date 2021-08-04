((global) => {

    var AI = {
        showRecord() {
            console.log(JSON.stringify(game.tetris.opRecord))
        },
        start(count) {
            if (count == 0) {
                console.log(JSON.stringify(game.tetris.opRecord))
                return;
            }
            selector.search()

            game.playStep('down', 1);

            console.log("max score = " + selector.maxScore)

            //休息继续找
            var sleep = (time) => {
                return new Promise((resolve) => {
                    setTimeout(resolve, time);
                });
            };
            sleep(1).then(() => {
                if (game.tetris.status === 'running') {
                    this.start(count - 1)
                } else {
                    console.log(JSON.stringify(game.tetris.opRecord))
                }
            });

        }
    };

    global.ai = AI;
})(window);