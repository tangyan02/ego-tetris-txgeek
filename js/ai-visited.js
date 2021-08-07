((global) => {

    var Visited = {
        visitedInfo: [],
        isInit: false,
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
        visitedCheck(level) {
            if (this.visitedInfo[level][game.tetris.curBrickCenterPos[0]][game.tetris.curBrickCenterPos[1]][game.tetris.stateIndex] != null) {
                return true
            }
            this.visitedInfo[level][game.tetris.curBrickCenterPos[0]][game.tetris.curBrickCenterPos[1]][game.tetris.stateIndex] = true;
            return false
        },
    };

    global.visited = Visited;
})(window);