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
        // var level = getPlayingField();

        $("#game-grid").css({
            'width': CELL_SIZE * GAME_GRID_WIDTH + 'px',
            'height': CELL_SIZE * GAME_GRID_HEIGHT + 'px'
        });
        this.updateLevel();
    };

    Game.prototype.updateLevel = function(argument){
        this.gameGrid.empty();
        this.level = getPlayingField(); 
        for (let i = 0; i < GAME_GRID_HEIGHT; ++i) {
            for (let j = 0; j < GAME_GRID_WIDTH; ++j) {
                var id = i + '-' + j;
                this.gameGrid.append('<div id="' + id +'" class="game-cell"><img src="img/diamond-' + this.level[i][j] + '.png"></div>');

                $('#' + id).click({game: this}, function() {
                    game.userClick($(this));
                });
            }
        }

        if(anigilate()) {
            this.isAnimationInProgress = true;
            console.log('animation blocked');
            setTimeout(function(game) {game.updateLevel()}, 1000, this);
        }
        else {
            this.isAnimationInProgress = false;
            console.log('animation unblocked');
        }
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

        turn(id1[0], id1[1], id2[0], id2[1]);//todo перенести?

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
                that.updateLevel();
        });
        
    };

    // Game.prototype.destroyBlocks = function(blocks) {
    //     var that = this;
    //     blocks.forEach(function(block, index, array) {
    //         that.gameGrid.find('#'+block[0]+'-'+block[1] +' img').addClass('destroy');

    //         for (let j = this.gameGrid[0].length - 1) {
    //             let destCount = 0;
    //             for (let i = this.gameGrid.length - 1; i >= 0; --i) {
    //                 let cell = $('#'+i+'-'+j);//TODO: make funtion
    //                 if (cell.hasClass('destroy')) {
    //                     destCount++;
    //                 }
    //                 else if (destCount > 0) {
    //                     that.dropCell(cell, destCount);
    //                 }
    //             }
    //         }
    //     });


    // };

    // Game.prototype.dropCell = function(cell, height) {  
    //     var id = cell.attr('id').split('-');
    //     var cellImg = cell1.find('img');

    // };
    var game = new Game();
    gGame = game;//debug
});