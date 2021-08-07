((global) => {

    var AI = {
        enable: true,
        showRecord() {
            console.log(JSON.stringify(game.tetris.opRecord))
        },
        main() {
            console.log("方块索引 " + game.tetris.shapeIndex)

            //如果局势不紧张，搜一层，否则层数增加
            if (scoreModel.getCurrentMaxHeight(game.tetris.grids) < 8) {
                selector.maxLevel = 1
            } else {
                selector.maxLevel = 2
            }

            selector.search()

            var level = selector.maxLevel
            for (var i = selector.maxLevel; i >= 0; i--) {
                if (selector.maxGameInfo[i] != null) {
                    level = i
                    break
                }
            }

            console.log("方块数 " + game.tetris.brickCount + "; 得分 " + game.tetris.score
                + " ;决策数 " + selector.searchCount + "; 步骤 " + JSON.stringify(selector.maxScore[level]))
        },
        start(level = 20000) {
            var timer = setInterval(() => {
                if (game.tetris.status === 'running' && level > 0) {
                    if (this.enable == true) {
                        this.main()
                        level--
                    }
                } else {
                    clearInterval(timer)
                }
            }, 1)
        }
    };

    global.ai = AI;
})(window);