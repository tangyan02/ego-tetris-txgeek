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
            var n = 3
            var x = [this.functions.lineRemove, this.functions.rowBalance, this.functions.colBalance]
            var c = [1, -1, -1]

            var y = 0;
            for (var i = 0; i < n; i++) {
                y += x[i]() * c[i]
            }

            this.load(saveInfo)
            //console.log("计算得分 " + y)
            return y
        },
        functions: {
            lineRemove() {
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
                var count = 0
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
                var count = 0
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
            }
        },
    };

    global.scoreModule = ScoreModule;
})(window);