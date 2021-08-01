((global) => {
    var AI = {
        start() {
            selector.search()

            game.playStep('down', 1);

            //休息继续找
            var sleep = (time) => {
                return new Promise((resolve) => {
                    setTimeout(resolve, time);
                });
            };
            sleep(500).then(() => {
                if (game.tetris.status === 'running') {
                    this.start()
                }
            });
        }
    };

    global.ai = AI;
})(window);