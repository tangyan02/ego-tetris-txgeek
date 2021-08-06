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
                this.functions.landingHeight,
                this.functions.lineRemove,
                this.functions.rowBalance,
                this.functions.colBalance,
                this.functions.holes,
                this.functions.wells
            ]

            var c = [
                -4.500158825082766
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
            landingHeight() {
                //下落高度
                var curHeight = 19 - game.tetris.curBrickCenterPos[1]
                var min = 19
                for (var j = 0; j < config.gridConfig.col; j++) {
                    for (var i = 0; i < config.gridConfig.row; i++) {
                        if (game.tetris.grids[i][j] != "") {
                            if (i < min)
                                min = i
                            break
                        }
                    }
                }
                return curHeight + (19 - min) / 2
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
                // return scores[count]
                return count
            },
            rowBalance() {
                //行变化成都
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
                //列变化成都
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
            },
            holes() {
                var count = 0;
                for (var i = 1; i < config.gridConfig.row; i++) {
                    for (var j = 0; j < config.gridConfig.col; j++) {
                        if (game.tetris.grids[i - 1][j] != '' && game.tetris.grids[i][j] == '') {
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
                    if (j == config.gridConfig.col - 1 || game.tetris.grids[i][j + 1] != '') {
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