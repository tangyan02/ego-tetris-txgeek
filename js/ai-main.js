((global) => {
    ``
    var AI = {
        showRecord() {
            console.log(JSON.stringify(game.tetris.opRecord))
        },
        main() {
            selector.search()

            console.log("方块数 " + game.tetris.brickCount + "; 得分 " + game.tetris.score
                + " ;决策数 " + selector.stateCount + "; 步骤 " + JSON.stringify(selector.maxScore))
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