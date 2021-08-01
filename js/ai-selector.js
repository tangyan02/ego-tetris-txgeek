((global) => {
    var Selector = {
        isVisited: [],
        maxGameInfo: null,
        maxScore: -1,
        show() {
            console.log(game.tetris.curBrickCenterPos)
            console.log(game.tetris.opRecord)
            console.log(game.tetris.gridConfig, game.tetris.curBrickInfo, game.tetris.grids)
        },
        init() {
            this.isVisited = new Array();
            for (var i = 0; i < 10; i++) {
                this.isVisited[i] = new Array();
                for (var j = 0; j < 20; j++) {
                    this.isVisited[i][j] = null
                }
            }
            this.maxGameInfo = null
            this.maxScore = -1
        },
        search() {
            this.init()
            //this.show()
            this.dfs(0)

            this.load(this.maxGameInfo)
        },
        save() {
            var saveInfo = {
                curBrickCenterPos: game.tetris.curBrickCenterPos,
                opRecord: JSON.parse(JSON.stringify(game.tetris.opRecord)),
                curBrickInfo: JSON.parse(JSON.stringify(game.tetris.curBrickInfo))
            }
            return saveInfo
        },
        load(saveInfo) {
            game.tetris.curBrickCenterPos = saveInfo.curBrickCenterPos
            game.tetris.opRecord = saveInfo.opRecord
            game.tetris.curBrickInfo = saveInfo.curBrickInfo
            game.render(true)
        },
        visitedCheck(level) {
            var visitRecord = this.isVisited[game.tetris.curBrickCenterPos[0]][game.tetris.curBrickCenterPos[1]];
            if (this.isVisited[game.tetris.curBrickCenterPos[0]][game.tetris.curBrickCenterPos[1]] != null) {
                if (level > visitRecord.level) {
                    return true
                }
            }
            if (visitRecord == null) {
                visitRecord = {
                    level: level
                }
            }
            visitRecord.level = level
            this.isVisited[game.tetris.curBrickCenterPos[0]][game.tetris.curBrickCenterPos[1]] = visitRecord
            return false
        },
        //搜索所有落点
        dfs(level) {
            if (this.visitedCheck(level)) {
                return
            }
            gaps = game.tetris.getBrickGaps(game.tetris.gridConfig, game.tetris.curBrickInfo, game.tetris.grids)

            if (gaps.bottom == 0) {
                // console.log("找到落点:" + game.tetris.curBrickCenterPos)
                var score = scoreModule.getScore()
                if (score > this.maxScore) {
                    this.maxGameInfo = this.save()
                    this.maxScore = score
                }
            }
            if (gaps.bottom > 0) {
                var saveInfo = this.save()
                game.playStep('down', 1, false);
                this.dfs(level + 1)
                this.load(saveInfo)
            }
            if (gaps.left > 0) {
                var saveInfo = this.save()
                game.playStep('left', 1, false);
                this.dfs(level + 1)
                this.load(saveInfo)
            }
            if (gaps.right > 0) {
                var saveInfo = this.save()
                game.playStep('right', 1, false);
                this.dfs(level + 1)
                this.load(saveInfo)
            }
        }
    };

    global.selector = Selector;
})(window);