((global) => {
    var Selector = {
        visitedInfo: [],
        searchCount: 0,
        maxGameInfo: new Array(),
        maxScore: new Array(),
        isInit: false,
        maxLevel: 2,
        currentRemoveLines: 0,
        maxRotate: [1, 3, 3, 3, 0, 1, 1],//7 种类型方块（I,L,J,T,O,S,Z）的最大旋转次数
        init() {
            if (this.isInit == true) {
                return
            }
            var InitMaxLevel = 6
            this.visitedInfo = new Array()
            for (var l = 0; l <= InitMaxLevel; l++) {
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
            for (i = 0; i <= this.maxLevel; i++) {
                this.clearVisited(i)
                this.maxGameInfo[i] = null
                this.maxScore[i] = null
            }
            this.searchCount = 0
        },
        search() {
            this.init()
            this.reset()
            this.maxGameInfo[0] = this.saveFull()

            this.dfs(1, 0)

            for (var i = this.maxLevel; i >= 0; i--) {
                if (this.maxGameInfo[i] != null) {
                    this.loadFull(this.maxGameInfo[i])
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
        saveFull() {
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
                opRecord: _.cloneDeep(game.tetris.opRecord),
            }
            return saveInfo
        },
        loadFull(saveInfo) {
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
            game.tetris.opRecord = saveInfo.opRecord
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
                opLenth: game.tetris.opRecord.length,
                opLast: game.tetris.opRecord[game.tetris.opRecord.length - 1]
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
            while (game.tetris.opRecord.length != saveInfo.opLenth) {
                game.tetris.opRecord.pop()
            }
            game.tetris.opRecord[game.tetris.opRecord.length - 1] = saveInfo.opLast
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

            var gaps = game.tetris.getBrickGaps(game.tetris.gridConfig, game.tetris.curBrickInfo, game.tetris.grids)
            // console.log(gaps)
            if (gaps.bottom == 0) {
                // console.log("找到落点:" + game.tetris.curBrickCenterPos + " 方向" + game.tetris.stateIndex)
                if (this.touchTopCheck() == false) {
                    this.searchCount++
                    var score = scoreModel.getScore()
                    if (this.maxScore[level] == null || score.total > this.maxScore[level].total) {
                        this.maxGameInfo[level] = this.saveFull()
                        this.maxScore[level] = score
                    }
                }
                if (level < this.maxLevel) {
                    if (this.touchTopCheck() == false) {
                        var saveInfo = this.save()
                        this.fillBrick()
                        const ret = game.tetris.update()
                        this.currentRemoveLines += ret.removeLines

                        this.clearVisited(level + 1)
                        const { isValid, brickCount } = game.tetris.initBrick()
                        if (isValid == true) {
                            this.dfs(level + 1, 0)
                        }

                        this.currentRemoveLines -= ret.removeLines
                        this.load(saveInfo)

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
            if (rotateTimes < this.maxRotate[game.tetris.shapeIndex]) {
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