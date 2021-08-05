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

            // game.playStep('down', 1);
            game.playStep('', 0, false, true);

            console.log("最大得分 " + JSON.stringify(selector.maxScore))

            //休息继续找
            var sleep = (time) => {
                return new Promise((resolve) => {
                    setTimeout(resolve, time);
                });
            };

            sleep(0).then(() => {
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