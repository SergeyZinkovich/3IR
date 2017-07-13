"use strict"

$(document).ready(function(){
    console.log('UI loaded')

    const GAME_GRID_WIDTH = 8;
    const GAME_GRID_HEIGHT = 8;
    const CELL_SIZE = 64;

    const FALL_TIME = 500;
    const SWAP_TIME = 400;
    const BOOM_TIME = 500;

    const DEBUG_TIME = 5000;//sec

    var Game = function () { 
		var that = this;
        this.initialize(false);
		this.menu = $('#menu');
		this.menu.click(function() {
			that.hideMenu();
			that.initialize(true);
		});
    };

    Game.prototype.initialize = function(isGenerate){
        console.log('-----INIT---------')
        this.isAnimationInProgress = false;
        this.gameGrid = $('#game-grid');
		this.isDestructionInProgress = false;
        if(isGenerate) {
            engine.generateLevel();
        }

        this.level = engine.getPlayingField();

        //create game grid
        this.statusBox = $('#gem-upgrade-box');
        this.timer = $("#timer");
        this.levelEndTime = new Date().getTime() + engine.getTimeTask() * 1000;
        this.requiredScore = engine.getScoreTask();
        this.waitAnimationInterval = false;

        console.log('req'+ this.requiredScore);

        $("#game").css({
            'width': CELL_SIZE * GAME_GRID_WIDTH + 'px',
            'height': CELL_SIZE * GAME_GRID_HEIGHT + 'px'
        });

		$('#gem-upgrade-box').css('width', CELL_SIZE * GAME_GRID_WIDTH + 'px');

        this.createTimer();
        this.updateStatusBox();
        this.updateLevel(false);
		this.createGrid();

    };

    Game.prototype.createGrid = function(){
		var that = this;
		console.log('draw');
        this.level = engine.getPlayingField(); 
		this.gameGrid.empty();

        for (let i = 0; i < GAME_GRID_HEIGHT; ++i) {
            for (let j = 0; j < GAME_GRID_WIDTH; ++j) {
                var id = i + '-' + j;
                var cell = $('<div id="' + id +'" class="game-cell"><img src="img/diamond-' + this.level[i][j] + '.png"></div>');

                cell.appendTo(this.gameGrid).click({game: this}, function(e) {
                    e.data.game.userClick($(this));
                }).on('dragstart', function(event) {
                    event.preventDefault();
                    that.userClick($(this));
                });
            }
        }
    };

    Game.prototype.redrawGrid = function(){
        var that = this;
        console.log('redraw');
        for (let i = 0; i < GAME_GRID_HEIGHT; ++i) {
            for (let j = 0; j < GAME_GRID_WIDTH; ++j) {
                var id = i + '-' + j;
                // this.gameGrid.find('#'+id+' img').attr('src', 'img/diamond-' + this.level[i][j] + '.png').removeClass('destroyed');
                this.gameGrid.find('#'+id).removeClass('destroyed').find('img').attr('src', 'img/diamond-' + this.level[i][j] + '.png')
            }
        }

        console.log('anim lock');
        this.isAnimationInProgress = true;
        this.gameGrid.find('img').animate({
            'top': 0,
            'left': 0},
            FALL_TIME, function() {
            that.isAnimationInProgress = false;
        });

        setTimeout(function(destroyed) {that.updateLevel(destroyed)}, FALL_TIME+50, engine.annihilate());
    }


    Game.prototype.updateLevel = function(destroyed){
        console.log('updating level');
        this.updateStatusBox();
        this.updateScore();
        this.animateDestruction(destroyed);

        if (engine.levelPassed() && !this.isDestructionInProgress) {
			that.isAnimationInProgress = true;
            console.log('check');
            this.endGame(false);
            return;
        }

    };

    Game.prototype.userClick = function(cell){
        if (this.isAnimationInProgress) {
            console.log('user click was blocked');
            return;
        }

        var prevSelCell = this.gameGrid.find(".selected-cell").first();
        cell.addClass('selected-cell');

        if (prevSelCell.length) {
            this.gameGrid.children().removeClass('selected-cell');
            this.swapCells(prevSelCell, cell);
        }
    };

    Game.prototype.animateSwap = function(cell1, cell2, id1, id2){
        var that = this;
        this.isAnimationInProgress = true;
        var cell1Img = cell1.find('img');
        var cell2Img = cell2.find('img');
        
        var cell1ImgPath = cell1Img.attr('src');
        var cell2ImgPath = cell2Img.attr('src');

        cell1Img.css('z-index', 1000);
        cell2Img.css('z-index', 1000);

        cell1Img.animate({
            'top': CELL_SIZE * (id2[0]-id1[0]) + 'px',
            'left': CELL_SIZE * (id2[1]-id1[1]) + 'px'},
            SWAP_TIME, function() {
                cell1Img.css({'top': 0, 'left': 0, 'z-index': 100}).attr('src', cell2ImgPath);
        });

        cell2Img.animate({
            'top': CELL_SIZE * (id1[0]-id2[0]) + 'px',
            'left': CELL_SIZE * (id1[1]-id2[1]) + 'px'},
            SWAP_TIME, function() {
                cell2Img.css({'top': 0, 'left': 0, 'z-index': 100}).attr('src', cell1ImgPath);
                that.isAnimationInProgress = false;
                console.log('swap ended');
        });
    };

    Game.prototype.swapCells = function(cell1, cell2) {
        var that = this;
        var id1 = cell1.attr('id').split('-');
        var id2 = cell2.attr('id').split('-');

        if (!((Math.abs(id2[0]-id1[0]) === 1 && id2[1] === id1[1]) ||  (Math.abs(id2[1]-id1[1]) === 1 && id2[0] === id1[0]))) {

            cell2.addClass('selected-cell');
            return;
        }

        this.animateSwap(cell1, cell2, id1, id2);

        var nextDestroy = engine.turn(id1[0], id1[1], id2[0], id2[1],)
        if (nextDestroy) {
            setTimeout(function(nextDestr) {that.updateLevel(nextDestr);}, SWAP_TIME + 50, nextDestroy);
            // setTimeout(that.updateLevel, SWAP_TIME + 50, nextDestroy); why not working?
        }
        else {
            setTimeout(function(cell1, cell2, id1, id2) {that.animateSwap(cell1, cell2, id1, id2);}, SWAP_TIME + 50, cell1, cell2, id1, id2);
        }

    };

    Game.prototype.animateDestruction = function(gems){
        var that = this;
        if(!gems) {
			that.isDestructionInProgress = false;
            return;
		}
		that.isDestructionInProgress = true;
		
        gems.forEach(function(gem, index, array) {
            that.gameGrid.find('#'+gem[0]+'-'+gem[1]).addClass('destroyed');
        });
        that.isAnimationInProgress = true;
        setTimeout(function() {
            that.isAnimationInProgress = false;
            that.destroyGems();
        }, BOOM_TIME);

    };

    Game.prototype.destroyGems = function() {
        console.log('destroying');
        
        var that = this;
        //calculating hight
        for (let j = 0; j < that.level[0].length; ++j) {
            let destCount = 0;
            for (var i = that.level.length - 1; i >= 0; --i) {
                let gemImg = $('#' + i + '-' + j);
                if (gemImg.hasClass('destroyed')) {
                    destCount++;
                }
                if(destCount > 0) {
                    that.riseCell($('#'+(i+destCount-1) + '-' + j + ' img'), destCount);
                }
            }
            for (let k = i+destCount-1; k >= 0; --k) {
                that.riseCell($('#'+k+'-' + j + ' img'), destCount);
            }
        }

        this.redrawGrid();
    };

    Game.prototype.riseCell = function(gemImg, height) {  
        console.log('cell drops');
        gemImg.css('top', -1 * CELL_SIZE * height + 'px');
    };

    Game.prototype.updateStatusBox = function(){
        var that = this;
        that.statusBox.find('.gem-status').remove();
        engine.getGemsStatus().forEach(function(elem) {
            $('<div id="s-' + elem[0] + '" class="gem-status"><img src="img/diamond-'+ elem[0] +'.png">:' + elem[1] +'</div>').appendTo(that.statusBox);
        });
    };

    Game.prototype.createTimer = function(){
        var that = this;
        this.timerInterval = setInterval(function(){
            var currTime = new Date().getTime();
            var timeLeft = that.levelEndTime - currTime;
            that.updateTimer(timeLeft >= 0 ? timeLeft : 0);
            if (timeLeft < 0 && !that.isAnimationInProgress && !that.isDestructionInProgress) {
				that.isAnimationInProgress = true;
                clearInterval(that.timerInterval);
                that.timeEnd();
            }
        }, 1000);
		that.updateTimer(that.levelEndTime - new Date().getTime());
    };

    Game.prototype.updateTimer = function(time){
        // this.timer.text(Math.round((this.levelEndTime - new Date().getTime())/1000));
        this.timer.text(Math.round(time/1000));
    };
	
    Game.prototype.timeEnd = function(){
        console.log('time end');
        var that = this;
        clearInterval(this.timerInterval);
        that.showMenu();
        //that.initialize(true);
        // console.log('time is out');
        // var waitAnimationInterval =  setInterval(function(handler){
        //     if(!that.isAnimationInProgress) {
        //         clearInterval(handler);

        //         // that.endGame();
        //     }
        // }, 500, waitAnimationInterval);
        // // this.endGame();
        // this = new Game();
    };

    Game.prototype.endGame = function(){
        var that = this;
        console.log('--------------end-------------');
        clearInterval(this.timerInterval);
        that.initialize(true);
        // console.log(isAnimationFinished);
        // console.log(that.waitAnimationInterval);
        // if (that.waitAnimationInterval) {
        //     return;
        // }
        // if(!isAnimationFinished) {
        //     console.log('set inteval**');
        //     that.waitAnimationInterval = setInterval(function() {
        //         console.log('tick');
        //         if(!that.isAnimationInProgress) {
        //             console.log('tick 2');
        //             clearInterval(that.waitAnimationInterval);
        //             that.waitAnimationInterval = null;
        //             console.log('inteval cleared');
        //             // that.isAnimationInProgress = true;
        //             setTimeout(function() {
        //                 console.log('time out 1');
        //                 that.endGame(true);
        //             }, 200);
        //         }
        //     }, 0);
        // }
        // else {
        //     that.initialize(true);
        // }
    };
	
	Game.prototype.showMenu = function(){
		this.menu.animate({top:'50%'}, 400);
	}
	
	Game.prototype.hideMenu = function(){
		this.menu.animate({top:'-200px'}, 400);
	}
	
    Game.prototype.updateScore = function(){
        $('#score-box').text(engine.getScore() + '/' + this.requiredScore + ' Pts №'+engine.getLevelNumber());
    };

    var game = new Game(false);

});