((global) => {

    var AI = {
        showRecord() {
            console.log(JSON.stringify(game.tetris.opRecord))
        },
        main() {
            selector.search()

            // game.playStep('down', 1);
            game.playStep('', 0, false, true);

            console.log("最大得分 " + JSON.stringify(selector.maxScore))
        },
        start() {
            setInterval(() => {
                if (game.tetris.status === 'running') {
                    this.main()
                }
            }, 1)
        }
    };

    global.ai = AI;
})(window);