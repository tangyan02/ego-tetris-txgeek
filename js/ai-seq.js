((global) => {

    var Seq = {
        randomConfig: {
            a: 27073, // 乘子
            M: 32749, // 模数
            C: 17713, // 增量
            v: 12358, // 随机数种子
        },
        shapes: new Array(),
        isInit: false,
        getRandomNum(v) {
            const { a, C, M } = this.randomConfig; // a：乘子，C：模数、C：增量
            return (v * a + C) % M;
        },
        init() {
            if (this.isInit == true) {
                return
            }
            this.isInit = true
            var p = this.randomConfig.v
            var currentCount = game.tetris.brickCount
            while (currentCount < 10010) {
                var { shapeIndex } = game.tetris.getShapeInfo(p, currentCount)
                p = this.getRandomNum(p)
                this.shapes.push(shapeIndex)
                currentCount++
            }
        },
        getDistanceOfI() {
            var currentCount = game.tetris.brickCount
            var result = 0;
            while (true) {
                if (currentCount > 10000) {
                    return 10000
                }
                if (this.shapes[currentCount] == 0 || currentCount > 10000) {
                    return result;
                }
                currentCount++
                result++
            }
        }

    };

    global.seq = Seq;
})(window);