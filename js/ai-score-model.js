((global) => {
    var ScoreModel = {
        scoreGrids: [],
        save() {
            scoreGrids = _.cloneDeep(game.tetris.grids)
        },
        fillBrick() {
            for (var i = 0; i < 4; i++) {
                var row = game.tetris.curBrickInfo.pos[i][1]
                var col = game.tetris.curBrickInfo.pos[i][0]
                if (row >= 0 && col >= 0)
                    scoreGrids[row][col] = 'BRICK'
            }
        },
        getCurrentMaxHeight(scoreGrids) {
            var min = 19
            for (var j = 0; j < config.gridConfig.col; j++) {
                for (var i = 0; i < config.gridConfig.row; i++) {
                    if (scoreGrids[i][j] != "") {
                        if (i < min)
                            min = i
                        break
                    }
                }
            }
            return 19 - min
        },
        getScore() {
            var saveInfo = this.save()
            this.fillBrick()

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
                return curHeight + (scoreModel.getCurrentMaxHeight(scoreGrids)) / 2
            },
            lineRemove() {
                //消除行数
                return selector.currentRemoveLines
            },
            rowBalance() {
                //行变化成都
                var count = 0
                for (var i = 0; i < config.gridConfig.row; i++) {
                    current = scoreGrids[i][0]
                    for (var j = 1; j < config.gridConfig.col; j++) {
                        if (scoreGrids[i][j] != scoreGrids[i][j - 1]) {
                            current = scoreGrids[i][j]
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
                    current = scoreGrids[0][j]
                    for (var i = 1; i < config.gridConfig.row; i++) {
                        if (scoreGrids[i][j] != scoreGrids[i - 1][j]) {
                            current = scoreGrids[i][j]
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
                        if (scoreGrids[i - 1][j] != '' && scoreGrids[i][j] == '') {
                            count++
                        }
                    }
                }
                return count
            },
            wells() {
                //判断一个格子是不是井
                var isWell = (i, j) => {
                    if (scoreGrids[i][j] != '') {
                        return false
                    }
                    var left, right
                    left = false
                    right = false
                    if (j == 0 || scoreGrids[i][j - 1] != '') {
                        left = true
                    }
                    if (j == config.gridConfig.col - 1 || scoreGrids[i][j + 1] != '') {
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

    global.scoreModel = ScoreModel;
})(window);