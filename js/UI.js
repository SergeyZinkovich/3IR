"use strict"

$(document).ready(function(){
    console.log('UI loaded')

    const GAME_GRID_WIDTH = 8;
    const GAME_GRID_HEIGHT = 8;
    const CELL_SIZE = 64;

    const FALL_TIME = 500;
    const SWAP_TIME = 400;

    var Game = function () { 
        //create game grid
        this.isAnimationInProgress = false;
        this.gameGrid = $('#game-grid');
		this.level = engine.getPlayingField();

        $("#game-grid").css({
            'width': CELL_SIZE * GAME_GRID_WIDTH + 'px',
            'height': CELL_SIZE * GAME_GRID_HEIGHT + 'px'
        });

		$('#status-box').css('width', CELL_SIZE * GAME_GRID_WIDTH + 'px');

        this.updateLevel(false);
		this.createGrid();
    };

	Game.prototype.createGrid = function(){
		console.log('draw');
        this.level = engine.getPlayingField(); 
		this.gameGrid.empty();

        for (let i = 0; i < GAME_GRID_HEIGHT; ++i) {
            for (let j = 0; j < GAME_GRID_WIDTH; ++j) {
                var id = i + '-' + j;
                this.gameGrid.append('<div id="' + id +'" class="game-cell"><img src="img/diamond-' + this.level[i][j] + '.png"></div>');

                $('#' + id).click({game: this}, function(e) {
                    e.data.game.userClick($(this));
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
                var gem = this.gameGrid.find('#'+id+' img').attr('src', 'img/diamond-' + this.level[i][j] + '.png');
                gem.removeClass('destroyed');
            }
        }

        console.log('anim lock');
        this.isAnimationInProgress = true;
        //todo: optimize???
        this.gameGrid.find('img').animate({
            'top': 0,
            'left': 0},
            FALL_TIME, function() {
            that.isAnimationInProgress = false;
        });

        setTimeout(function(destroyed) {that.updateLevel.call(that, destroyed)}, FALL_TIME+50, engine.anigilate());
    }

    Game.prototype.updateLevel = function(destroyed){
		console.log('updating level');
        $('#score-box').text(engine.getScore()+' Points');
        var gemStatus = '';
        engine.getGemsStatus().forEach(function(elem) {gemStatus += '<img src="img/diamond-'+elem[0]+'.png">:' + elem[1]});

        $('#status-box').html(gemStatus);

		if (!destroyed) {
            this.isAnimationInProgress = false;
            console.log('animation unblocked');
			return;
        }
		this.destroyGems.call(this, destroyed);
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

        if (!((Math.abs(id2[0]-id1[0]) === 1 && id2[1] === id1[1]) ||  (Math.abs(id2[1]-id1[1]) === 1 && id2[0] === id1[0]))) {
            this.isAnimationInProgress = false;
            return;
        }

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
                cell1Img.css({'top': 0, 'left': 0});
                cell1Img.css('z-index', 100);
                cell1Img.attr('src', cell2ImgPath);
        });

        cell2Img.animate({
            'top': CELL_SIZE * (id1[0]-id2[0]) + 'px',
            'left': CELL_SIZE * (id1[1]-id2[1]) + 'px'},
            SWAP_TIME, function() {
                cell2Img.css({'top': 0, 'left': 0});
                cell2Img.attr('src', cell1ImgPath);
                cell2Img.css('z-index', 100);
        //         if (that.validateTurn(id1[0], id1[1], id2[0], id2[1])) {
				    // that.updateLevel(destroyed);
                //}
                that.validateTurn(id1[0], id1[1], id2[0], id2[1]);
        });
        // setTimeout(function(that) {that.validateTurn.call(that, id1[0], id1[1], id2[0], id2[1]);},  SWAP_TIME + 100, that);
    };

    Game.prototype.validateTurn = function(i1, j1, i2, j2){
        var that = this;
        var nextDestroy = engine.turn(i1, j1, i2, j2);
        if (nextDestroy) {
            this.updateLevel(nextDestroy);
        }
        else {
            var cell1Img = $('#'+i1+'-'+j1+' img');
            var cell2Img = $('#'+i2+'-'+j2 +' img');

            var cell1ImgPath = cell1Img.attr('src');
            var cell2ImgPath = cell2Img.attr('src');

            cell1Img.css('z-index', 1000);
            cell2Img.css('z-index', 1000);

            cell1Img.animate({
                'top': CELL_SIZE * (i2-i1) + 'px',
                'left': CELL_SIZE * (j2-j1) + 'px'},
                SWAP_TIME, function() {
                    cell1Img.css({'top': 0, 'left': 0});
                    cell1Img.css('z-index', 100);
                    cell1Img.attr('src', cell2ImgPath);
            });

            cell2Img.animate({
                'top': CELL_SIZE * (i1-i2) + 'px',
                'left': CELL_SIZE * (j1-j2) + 'px'},
                SWAP_TIME, function() {
                    cell2Img.css({'top': 0, 'left': 0});
                    cell2Img.attr('src', cell1ImgPath);
                    cell2Img.css('z-index', 100);
                    that.updateLevel(false);//nothing to destroy
                    //}
            });
        }

        // else {
        //     // cell1Img.css('z-index', 1000);
        //     // cell2Img.css('z-index', 1000);
        //     $('#'+i1+'-'+j1).animate({
        //         'top': CELL_SIZE * (i2-i1) + 'px',
        //         'left': CELL_SIZE * (j2-j1) + 'px'},
        //         SWAP_TIME, function() {
        //             $('#'+i1+'-'+j1).css('z-index', 100);
        //     });

        //     $('#'+i2+'-'+j2).animate({
        //         'top': CELL_SIZE * (i1-i2) + 'px',
        //         'left': CELL_SIZE * (j1-j2) + 'px'},
        //         SWAP_TIME, function() {
        //             $('#'+i2+'-'+j2).css('z-index', 100);
        //              that.updateLevel(false);//nothing to destroy
        //     });
        // }
    };

    Game.prototype.destroyGems = function(gems) {
		console.log('destroying');
		if(!gems)
			return;
		
        var that = this;
        gems.forEach(function(gem, index, array) {
            that.gameGrid.find('#'+gem[0]+'-'+gem[1] +' img').addClass('destroyed');
		});
		
        //calculating hight
		for (let j = 0; j < that.level[0].length; ++j) {
			let destCount = 0;
			for (var i = that.level.length - 1; i >= 0; --i) {
				let gemImg = $('#' + i + '-' + j + ' img');
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

    var game = new Game();
});