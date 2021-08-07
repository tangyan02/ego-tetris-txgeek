((global) => {

    var Histroy = {
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
    };

    global.histroy = Histroy;
})(window);