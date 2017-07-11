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
		this.redrawGrid();
    };
	
	Game.prototype.redrawGrid = function(){
		console.log('redraw');
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
	}

    Game.prototype.updateLevel = function(destroyed){
		console.log('update level');
		if (!destroyed)
			return;
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

            this.swapCells(selectedCells.eq(0), selectedCells.eq(1));
            this.gameGrid.children().removeClass('selected-cell');
        }
    };

    Game.prototype.swapCells = function(cell1, cell2) {
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
            400, function() {
                cell1Img.css({'top': 0, 'left': 0});
                cell1Img.attr('src', cell2ImgPath);
        });

        cell2Img.animate({
            'top': CELL_SIZE * (id1[0]-id2[0]) + 'px',
            'left': CELL_SIZE * (id1[1]-id2[1]) + 'px'},
            400, function() {
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
			for (let i = that.level.length - 1; i >= 0; --i) {
				let gemImg = $('#'+i+'-'+j + ' img');//TODO: make function
				if (gemImg.hasClass('destroy')) {
					destCount++;
				}
				else if (destCount > 0) {
					that.dropCell(gemImg, destCount);
					// setTimeout(function() {that.dropCell(gemImg, destCount)}, 1000);
					// function() {
						// var tmp = gemImg;
						// var tmp1
						// setTimeout(function() {that.dropCell(tmp, tmp1)}, 1000);
					// }();
				}
			}
		}
      
		
		setTimeout(function(game) {game.redrawGrid.call(game);}, 2000, this);

    };

    Game.prototype.dropCell = function(gemImg, height) {  
		console.log('cell drops--------------------------');
        gemImg.animate({
		'top': CELL_SIZE * height + 'px'},
        1000, function() {
			console.log('drop callback');
        });
    };
    var game = new Game();
    gGame = game;//debug
});