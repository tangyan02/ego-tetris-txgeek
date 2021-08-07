((global) => {
    var Selector = {
        visitedInfo: [],
        stateCount: 0,
        maxGameInfo: null,
        maxScore: -1,
        isInit: false,
        maxLevel: 1,
        init() {
            if (this.isInit == true) {
                return
            }
            this.visitedInfo = new Array()
            for (var l = 0; l <= this.maxLevel; l++) {
                this.visitedInfo[l] = new Array()
                for (var i = 0; i < 10; i++) {
                    this.visitedInfo[l][i] = new Array()
                    for (var j = 0; j < 20; j++) {
                        this.visitedInfo[l][i][j] = new Array()
                        for (var k = 0; k < 5; k++) {
                            this.visitedInfo[l][i][j][k] = null;
                        }
                    }
                }
            }
            this.isInit = true
        },
        clearVisited(level) {
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 20; j++) {
                    for (var k = 0; k < 5; k++) {
                        this.visitedInfo[level][i][j][k] = null;
                    }
                }
            }
        },
        reset() {
            for (i = 0; i <= this.maxLevel; i++)
                this.clearVisited(i)
            this.maxGameInfo = null
            this.maxScore = null
            this.stateCount = 0
        },
        search() {
            this.init()
            this.reset()
            this.dfs(1, 0)
            this.load(this.maxGameInfo)


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
        save() {
            var saveInfo = {
                shapeIndex: _.cloneDeep(game.tetris.shapeIndex),
                stateIndex: _.cloneDeep(game.tetris.stateIndex),
                grids: _.cloneDeep(game.tetris.grids),
                brickCount: _.cloneDeep(game.tetris.brickCount),
                curRandomNum: _.cloneDeep(game.tetris.curRandomNum),

                curBrickCenterPos: _.cloneDeep(game.tetris.curBrickCenterPos),
                curBrickRawInfo: _.cloneDeep(game.tetris.curBrickRawInfo),
                curBrickInfo: _.cloneDeep(game.tetris.curBrickInfo),
                brickCount: _.cloneDeep(game.tetris.brickCount),
                nextBrickRawInfo: _.cloneDeep(game.tetris.nextBrickRawInfo),
                score: _.cloneDeep(game.tetris.score),
                // opRecord: _.cloneDeep(game.tetris.opRecord),
            }
            return saveInfo
        },
        load(saveInfo) {
            game.tetris.shapeIndex = saveInfo.shapeIndex
            game.tetris.stateIndex = saveInfo.stateIndex
            game.tetris.grids = saveInfo.grids
            game.tetris.brickCount = saveInfo.brickCount
            game.tetris.curRandomNum = saveInfo.curRandomNum

            game.tetris.curBrickCenterPos = saveInfo.curBrickCenterPos
            game.tetris.curBrickRawInfo = saveInfo.curBrickRawInfo
            game.tetris.curRandomNum = saveInfo.curRandomNum
            game.tetris.curBrickInfo = saveInfo.curBrickInfo
            game.tetris.nextBrickRawInfo = saveInfo.nextBrickRawInfo
            game.tetris.score = saveInfo.score
            // game.tetris.opRecord = saveInfo.opRecord
            while (true) {
                var last = game.tetris.opRecord[game.tetris.opRecord.length - 1]
                if (last == 'N') {
                    break
                }
                game.tetris.opRecord.pop()
            }
        },
        visitedCheck(level) {
            if (this.visitedInfo[level][game.tetris.curBrickCenterPos[0]][game.tetris.curBrickCenterPos[1]][game.tetris.stateIndex] != null) {
                return true
            }
            this.visitedInfo[level][game.tetris.curBrickCenterPos[0]][game.tetris.curBrickCenterPos[1]][game.tetris.stateIndex] = true;
            return false
        },
        //搜索所有落点
        dfs(level, rotateTimes) {
            if (this.visitedCheck(level)) {
                //console.log("已访问 " + "level = " + level + " stateIndex = " + game.tetris.stateIndex)
                return
            }

            gaps = game.tetris.getBrickGaps(game.tetris.gridConfig, game.tetris.curBrickInfo, game.tetris.grids)
            if (gaps.bottom == 0) {
                // console.log("找到落点:" + game.tetris.curBrickCenterPos + " 方向" + game.tetris.stateIndex)
                if (level < this.maxLevel) {
                    var saveInfo = this.save()
                    this.fillBrick()
                    this.clearVisited(level + 1)
                    game.tetris.initBrick()

                    this.dfs(level + 1, rotateTimes)
                    this.load(saveInfo)
                } else {
                    this.stateCount++
                    var score = scoreModule.getScore()
                    if (this.maxScore == null || score.total > this.maxScore.total) {
                        this.maxGameInfo = this.save()
                        this.maxScore = score
                    }
                }
            }

            if (gaps.bottom > 0) {
                var saveInfo = this.save()
                game.playStep('down', 1, false);
                this.dfs(level, rotateTimes)
                this.load(saveInfo)
            }
            if (gaps.left > 0) {
                var saveInfo = this.save()
                game.playStep('left', 1, false);
                this.dfs(level, rotateTimes)
                this.load(saveInfo)
            }
            if (gaps.right > 0) {
                var saveInfo = this.save()
                game.playStep('right', 1, false);
                this.dfs(level, rotateTimes)
                this.load(saveInfo)
            }
            if (rotateTimes < 4) {
                var saveInfo = this.save()
                game.tetris.rotate();
                if (game.tetris.stateIndex != undefined) {
                    this.dfs(level, rotateTimes + 1)
                    this.load(saveInfo)
                }
            }
        }
    };

    global.selector = Selector;
})(window);