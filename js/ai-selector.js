((global) => {
    var Selector = {
        visitedInfo: [],
        maxGameInfo: null,
        maxScore: -1,
        show() {
            console.log(game.tetris.curBrickCenterPos)
            console.log(game.tetris.opRecord)
            console.log(game.tetris.gridConfig, game.tetris.curBrickInfo, game.tetris.grids)
        },
        init() {
            this.visitedInfo = new Array()
            for (var i = 0; i < 10; i++) {
                this.visitedInfo[i] = new Array()
                for (var j = 0; j < 20; j++) {
                    this.visitedInfo[i][j] = new Array()
                    for (var k = 0; k < 5; k++) {
                        this.visitedInfo[i][j][k] = null;
                    }
                }
            }
            this.maxGameInfo = null
            this.maxScore = null
        },
        search() {
            this.init()
            //this.show()
            this.dfs(0, game.tetris.stateIndex)

            this.load(this.maxGameInfo)
        },
        save() {
            var saveInfo = {
                grids: JSON.parse(JSON.stringify(game.tetris.grids)),
                curBrickCenterPos: JSON.parse(JSON.stringify(game.tetris.curBrickCenterPos)),
                opRecord: JSON.parse(JSON.stringify(game.tetris.opRecord)),
                curBrickInfo: JSON.parse(JSON.stringify(game.tetris.curBrickInfo)),
                stateIndex: JSON.parse(JSON.stringify(game.tetris.stateIndex)),
                curBrickRawInfo: JSON.parse(JSON.stringify(game.tetris.curBrickRawInfo))
            }
            return saveInfo
        },
        load(saveInfo) {
            game.tetris.curBrickCenterPos = saveInfo.curBrickCenterPos
            game.tetris.opRecord = saveInfo.opRecord
            game.tetris.curBrickInfo = saveInfo.curBrickInfo
            game.tetris.stateIndex = saveInfo.stateIndex
            game.tetris.grids = saveInfo.grids
            game.tetris.curBrickRawInfo = saveInfo.curBrickRawInfo
            game.render(true)
        },
        visitedCheck() {
            if (this.visitedInfo[game.tetris.curBrickCenterPos[0]][game.tetris.curBrickCenterPos[1]][game.tetris.stateIndex] != null) {
                return true
            }
            this.visitedInfo[game.tetris.curBrickCenterPos[0]][game.tetris.curBrickCenterPos[1]][game.tetris.stateIndex] = true;
            return false
        },
        //搜索所有落点
        dfs() {
            if (this.visitedCheck()) {
                //console.log("已访问 " + "level = " + level + " stateIndex = " + game.tetris.stateIndex)
                return
            }
            gaps = game.tetris.getBrickGaps(game.tetris.gridConfig, game.tetris.curBrickInfo, game.tetris.grids)

            if (gaps.bottom == 0) {
                // console.log("找到落点:" + game.tetris.curBrickCenterPos + " 方向" + game.tetris.stateIndex)
                var score = scoreModule.getScore()
                if (this.maxScore == null || score.total > this.maxScore.total) {
                    this.maxGameInfo = this.save()
                    this.maxScore = score
                }
            }
            if (gaps.bottom > 0) {
                var saveInfo = this.save()
                game.playStep('down', 1, false);
                this.dfs()
                this.load(saveInfo)
            }
            if (gaps.left > 0) {
                var saveInfo = this.save()
                game.playStep('left', 1, false);
                this.dfs()
                this.load(saveInfo)
            }
            if (gaps.right > 0) {
                var saveInfo = this.save()
                game.playStep('right', 1, false);
                this.dfs()
                this.load(saveInfo)
            }
            for (var i = 0; i < 3; i++) {
                var saveInfo = this.save()
                game.tetris.rotate();
                // game.render();
                if (game.tetris.stateIndex != undefined) {
                    this.dfs()
                    this.load(saveInfo)
                }
            }


        }
    };

    global.selector = Selector;
})(window);