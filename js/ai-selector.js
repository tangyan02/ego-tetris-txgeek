((global) => {
    var Selector = {
        searchCount: 0,
        maxGameInfo: new Array(),
        maxScore: new Array(),
        maxLevel: 3,
        currentRemoveLines: 0,
        maxRotate: [1, 3, 3, 3, 0, 1, 1],//7 种类型方块（I,L,J,T,O,S,Z）的最大旋转次数
        reset() {
            for (i = 0; i <= this.maxLevel; i++) {
                visited.clearVisited(i)
                this.maxGameInfo[i] = null
                this.maxScore[i] = null
            }
            this.searchCount = 0
        },
        search() {
            seq.init()
            visited.init()
            this.reset()
            this.maxGameInfo[0] = histroy.saveFull()

            this.dfs(1, 0)

            for (var i = this.maxLevel; i >= 0; i--) {
                if (this.maxGameInfo[i] != null) {
                    histroy.loadFull(this.maxGameInfo[i])
                    break
                }
            }

            game.render()
            game.playStep('', 0, false, true);
        },
        fillBrick() {
            //填充
            for (var i = 0; i < 4; i++) {
                var row = game.tetris.curBrickInfo.pos[i][1]
                var col = game.tetris.curBrickInfo.pos[i][0]
                if (row >= 0 && col >= 0)
                    game.tetris.grids[row][col] = 'BRICK'
            }
        },
        touchTopCheck() {
            //判断放着位置是否会卡住下一个方块出生位置
            for (var i = 0; i < game.tetris.curBrickInfo.pos.length; i++) {
                for (var j = 0; j < game.tetris.nextBrickRawInfo.pos.length; j++) {
                    if (game.tetris.curBrickInfo.pos[i][0] == game.tetris.nextBrickRawInfo.pos[j][0] &&
                        game.tetris.curBrickInfo.pos[i][1] == game.tetris.nextBrickRawInfo.pos[j][1]
                    )
                        return true
                }
            }
            //判断是否到顶部
            for (var i = 0; i < game.tetris.curBrickInfo.pos.length; i++) {
                if (game.tetris.curBrickInfo.pos[i][1] == 0) {
                    return true
                }
            }
            return false
        },
        //搜索所有落点
        dfs(level, rotateTimes) {
            if (visited.visitedCheck(level)) {
                //console.log("已访问 " + "level = " + level + " stateIndex = " + game.tetris.stateIndex)
                return
            }

            var gaps = game.tetris.getBrickGaps(game.tetris.gridConfig, game.tetris.curBrickInfo, game.tetris.grids)
            // console.log(gaps)
            if (gaps.bottom == 0) {
                // console.log("找到落点:" + game.tetris.curBrickCenterPos + " 方向" + game.tetris.stateIndex)
                if (this.touchTopCheck() == false) {
                    this.searchCount++
                    var score = scoreModel.getScore()
                    if (this.maxScore[level] == null || score.total > this.maxScore[level].total) {
                        this.maxGameInfo[level] = histroy.saveFull()
                        this.maxScore[level] = score
                    }
                }
                if (level < this.maxLevel) {
                    if (this.touchTopCheck() == false) {
                        var saveInfo = histroy.save()
                        this.fillBrick()
                        const ret = game.tetris.update()
                        this.currentRemoveLines += ret.removeLines

                        visited.clearVisited(level + 1)
                        const { isValid, brickCount } = game.tetris.initBrick()
                        if (isValid == true) {
                            this.dfs(level + 1, 0)
                        }

                        this.currentRemoveLines -= ret.removeLines
                        histroy.load(saveInfo)

                    }
                }
            }

            if (gaps.bottom > 0) {
                var saveInfo = histroy.save()
                var move = gaps.bottom > 2 ? gaps.bottom - 1 : 1
                game.playStep('down', move, false);
                this.dfs(level, rotateTimes)
                histroy.load(saveInfo)
            }
            if (gaps.left > 0) {
                var saveInfo = histroy.save()
                game.playStep('left', 1, false);
                this.dfs(level, rotateTimes)
                histroy.load(saveInfo)
            }
            if (gaps.right > 0) {
                var saveInfo = histroy.save()
                game.playStep('right', 1, false);
                this.dfs(level, rotateTimes)
                histroy.load(saveInfo)
            }
            if (rotateTimes < this.maxRotate[game.tetris.shapeIndex]) {
                var saveInfo = histroy.save()
                game.tetris.rotate();
                if (game.tetris.stateIndex != undefined) {
                    this.dfs(level, rotateTimes + 1)
                    histroy.load(saveInfo)
                }
            }
        }
    };

    global.selector = Selector;
})(window);