"use strict"
var gGame;
$(document).ready(function() {
    console.log('UI loaded')

    const GAME_GRID_WIDTH = 8;
    const GAME_GRID_HEIGHT = 8;
    const CELL_SIZE = 64;

    var Game = function () { 
        //create game grid
        this.isAnimationInProgress = false;
        this.gameGrid = $('#game-grid');
		this.level = engine.getPlayingField();
        $("#game-grid").css({
            'width': CELL_SIZE * GAME_GRID_WIDTH + 'px',
            'height': CELL_SIZE * GAME_GRID_HEIGHT + 'px'
        });
        this.updateLevel(false);
		this.drawGrid();
    };

	Game.prototype.drawGrid = function(argument){
		console.log('draw');
        this.level = engine.getPlayingField(); 
		this.gameGrid.empty();
		//this.level = engine.getPlayingField();
        for (let i = 0; i < GAME_GRID_HEIGHT; ++i) {
            for (let j = 0; j < GAME_GRID_WIDTH; ++j) {
                var id = i + '-' + j;
                this.gameGrid.append('<div id="' + id +'" class="game-cell"><img src="img/diamond-' + this.level[i][j] + '.png"></div>');

                $('#' + id).click({game: this}, function(e) {
                    e.data.game.userClick($(this));
                });
            }
        }

        //var destroyNext = engine.anigilate();
        
    };

    Game.prototype.redrawGrid = function(){
        var that = this;
        console.log('redraw');
        for (let i = 0; i < GAME_GRID_HEIGHT; ++i) {
            for (let j = 0; j < GAME_GRID_WIDTH; ++j) {
                var id = i + '-' + j;
                var gem = this.gameGrid.find('#'+id+' img').attr('src', 'img/diamond-' + this.level[i][j] + '.png');
                gem.removeClass('destroy');
                this.isAnimationInProgress = true;
                console.log('anim lock');
            }
        }

        this.gameGrid.find('img').animate({
            'top': 0,
            'left': 0},
            1000, function() {
            that.isAnimationInProgress = false;
        });

        console.log('anim unlock');
        setTimeout(function(destroyed) {that.updateLevel.call(that, destroyed)}, 1100, engine.anigilate());

        // var destroyNext = engine.anigilate();
        // if(destroyNext) {
        //     this.isAnimationInProgress = true;
        //     console.log('animation blocked');
        //     setTimeout(function(game, destroyNext) {game.updateLevel(destroyNext)}, 500, this, destroyNext);
        // }
        // else {
        //     this.isAnimationInProgress = false;
        //     console.log('animation unblocked');
        // }
    }

    Game.prototype.updateLevel = function(destroyed){
		console.log('update level');
		if (!destroyed) {
            this.isAnimationInProgress = false;
            console.log('animation unblocked');
			return;
        }
		this.destroyGems.call(this, destroyed);
        // this.gameGrid.empty();
		//var destroyNext = engine.anigilate();
		//this.level = engine.getPlayingField();
        // if(destroyNext) {
            // this.isAnimationInProgress = true;
            // console.log('animation blocked');
            // setTimeout(function(game, destroyNext) {game.updateLevel(destroyNext)}, 5000, this, destroyNext);
        // }
        // else {
            // this.isAnimationInProgress = false;
            // console.log('animation unblocked');
        // }
    };

    Game.prototype.userClick = function(cell){
        if (this.isAnimationInProgress) {
            console.log('user click was blocked');
            return;
        }

        cell.addClass('selected-cell');
        var selectedCells = this.gameGrid.children(".selected-cell");
        if (selectedCells.length === 2) {

            this.gameGrid.children().removeClass('selected-cell');
            this.swapCells(selectedCells.eq(0), selectedCells.eq(1));
        }
    };

    Game.prototype.swapCells = function(cell1, cell2) {
        this.isAnimationInProgress = true;
        var that = this;
        var id1 = cell1.attr('id').split('-');
        var id2 = cell2.attr('id').split('-');

        var destroyed = engine.turn(id1[0], id1[1], id2[0], id2[1]);//todo перенести?

        var cell1Img = cell1.find('img');
        var cell2Img = cell2.find('img');
        
        var cell1ImgPath = cell1Img.attr('src');
        var cell2ImgPath = cell2Img.attr('src');

        cell1Img.animate({
            'top': CELL_SIZE * (id2[0]-id1[0]) + 'px',
            'left': CELL_SIZE * (id2[1]-id1[1]) + 'px'},
            1000, function() {
                cell1Img.css({'top': 0, 'left': 0});
                cell1Img.attr('src', cell2ImgPath);
        });

        cell2Img.animate({
            'top': CELL_SIZE * (id1[0]-id2[0]) + 'px',
            'left': CELL_SIZE * (id1[1]-id2[1]) + 'px'},
            1000, function() {
                cell2Img.css({'top': 0, 'left': 0});
                cell2Img.attr('src', cell1ImgPath);
				that.updateLevel(destroyed);
        });
    };

    Game.prototype.destroyGems = function(gems) {
		console.log('destroying');
		if(!gems)
			return;
		
        var that = this;
        gems.forEach(function(gem, index, array) {
            that.gameGrid.find('#'+gem[0]+'-'+gem[1] +' img').addClass('destroy');
		});
		
		for (let j = 0; j < that.level[0].length; ++j) {
			let destCount = 0;
			for (var i = that.level.length - 1; i >= 0; --i) {
				let gemImg = $('#'+i+'-'+j + ' img');//TODO: make function
				if (gemImg.hasClass('destroy')) {
					destCount++;
				}
				if(destCount > 0) {
					that.riseCell($('#'+(i+destCount-1)+'-' + j + ' img'), destCount);
					// setTimeout(function() {that.riseCell(gemImg, destCount)}, 1000);
					// function() {
						// var tmp = gemImg;
						// var tmp1
						// setTimeout(function() {that.riseCell(tmp, tmp1)}, 1000);
					// }();
				}
            }
            for (let k = i+destCount-1; k >= 0; --k) {
                that.riseCell($('#'+k+'-' + j + ' img'), destCount);
            }

		}
      
		
		// setTimeout(function(game) {game.redrawGrid.call(game);}, 4000, this);
        this.redrawGrid();

    };

    Game.prototype.riseCell = function(gemImg, height) {  
		console.log('cell drops--------------------------');
        gemImg.css('top', -1 * CELL_SIZE * height + 'px');
  //       gemImg.animate({
		// 'top': CELL_SIZE * height + 'px'},
  //       2000, function() {
		// 	console.log('drop callback');
  //       });
    };
    var game = new Game();
    gGame = game;//debug
});