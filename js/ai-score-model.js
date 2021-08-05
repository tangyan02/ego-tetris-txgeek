((global) => {
    var ScoreModule = {
        save() {
            var saveInfo = {
                grids: JSON.parse(JSON.stringify(game.tetris.grids))
            }
            return saveInfo
        },
        load(saveInfo) {
            game.tetris.grids = saveInfo.grids
        },
        fiilBrick() {
            //把颜色全部填充一致
            for (var i = 0; i < config.gridConfig.row; i++) {
                for (var j = 0; j < config.gridConfig.col; j++) {
                    if (game.tetris.grids[i][j] != '') {
                        game.tetris.grids[i][j] = 'BRICK'
                    }
                }
            }

            for (var i = 0; i < 4; i++) {
                var row = game.tetris.curBrickInfo.pos[i][1]
                var col = game.tetris.curBrickInfo.pos[i][0]
                if (row >= 0 && col >= 0)
                    game.tetris.grids[row][col] = 'BRICK'
            }
        },
        getScore() {
            var saveInfo = this.save()
            this.fiilBrick()

            //计算模型得分
            var n = 6

            var f = [
                this.functions.curHeight,
                this.functions.lineRemove,
                this.functions.rowBalance,
                this.functions.colBalance,
                this.functions.holes,
                this.functions.wells
            ]

            var c = [
                -8.500158825082766
                , 3.4181268101392694
                , -3.2178882868487753
                , -9.348695305445199
                , -7.899265427351652
                , -3.3855972247263626
            ]

            var t = 0;
            var x = Array()
            for (var i = 0; i < n; i++) {
                x[i] = f[i]()
            }
            for (var i = 0; i < n; i++) {
                t += x[i] * c[i]
            }

            this.load(saveInfo)

            var result = {
                scores: x,
                weight: c,
                total: t
            }
            // console.log("计算得分 " + JSON.stringify(result))
            return result
        },
        functions: {
            curHeight() {
                //下落高度
                return 20 - game.tetris.curBrickCenterPos[1]
            },
            lineRemove() {
                //消除行数
                var count = 0
                for (var i = 0; i < config.gridConfig.row; i++) {
                    var flag = true
                    for (var j = 0; j < config.gridConfig.col; j++) {
                        if (game.tetris.grids[i][j] == '') {
                            flag = false
                        }
                    }
                    if (flag) {
                        count++
                    }
                }
                //得分系数
                var scores = [0, 1, 3, 6, 10]
                return scores[count]
            },
            rowBalance() {
                //行变化成都
                var count = 1
                for (var i = 0; i < config.gridConfig.row; i++) {
                    current = game.tetris.grids[i][0]
                    for (var j = 1; j < config.gridConfig.col; j++) {
                        if (game.tetris.grids[i][j] != game.tetris.grids[i][j - 1]) {
                            current = game.tetris.grids[i][j]
                            count++
                        }
                    }
                }
                return count
            },
            colBalance() {
                //列变化成都
                var count = 1
                for (var j = 0; j < config.gridConfig.col; j++) {
                    current = game.tetris.grids[0][j]
                    for (var i = 1; i < config.gridConfig.row; i++) {
                        if (game.tetris.grids[i][j] != game.tetris.grids[i - 1][j]) {
                            current = game.tetris.grids[i][j]
                            count++
                        }
                    }
                }
                return count
            },
            holes() {
                //灌水算法计算空洞数
                var visited = new Array();
                for (var i = 0; i < config.gridConfig.row; i++) {
                    visited[i] = new Array()
                    for (var j = 0; j < config.gridConfig.col; j++) {
                        visited[i][j] = false;
                    }
                }
                var dx = [0, 0, -1, 1]
                var dy = [1, -1, 0, 0]
                var dfs = (i, j) => {
                    //console.log(i + " " + j)
                    //已访问
                    if (visited[i][j] == true) {
                        return
                    }
                    //遇到方块
                    if (game.tetris.grids[i][j] != '') {
                        return
                    }
                    visited[i][j] = true;
                    for (var k = 0; k < 4; k++) {
                        var x = i + dx[k]
                        var y = j + dy[k]
                        if (x >= 0 && x < config.gridConfig.row &&
                            y >= 0 && y < config.gridConfig.col) {
                            dfs(x, y)
                        }
                    }
                }
                dfs(0, 0)

                var count = 0;
                for (var i = 0; i < config.gridConfig.row; i++) {
                    for (var j = 0; j < config.gridConfig.col; j++) {
                        if (visited[i][j] == false && game.tetris.grids[i][j] == '') {
                            count++
                        }
                    }
                }
                return count
            },
            wells() {
                //判断一个格子是不是井
                var isWell = (i, j) => {
                    if (game.tetris.grids[i][j] != '') {
                        return false
                    }
                    var left, right
                    left = false
                    right = false
                    if (j == 0 || game.tetris.grids[i][j - 1] != '') {
                        left = true
                    }
                    if (j == config.gridConfig.col || game.tetris.grids[i][j + 1] != '') {
                        right = true
                    }
                    return left && right
                }
                var score = 0
                for (var j = 0; j < config.gridConfig.col; j++) {
                    var count = 0
                    for (var i = 0; i < config.gridConfig.row; i++) {
                        if (isWell(i, j)) {
                            count++
                            score += count
                        } else {
                            count = 0
                        }
                    }

                }
                return score
            },
        },
    };

    global.scoreModule = ScoreModule;
})(window);