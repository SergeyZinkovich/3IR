$(document).ready(function() {
    console.log('UI loaded')

    const GAME_GRID_WIDTH = 8;
    const GAME_GRID_HEIGHT = 8;
    const CELL_SIZE = 100;

    //create game grid
    var gameGrid = $('#game-grid');
    for (let i = 0; i < GAME_GRID_HEIGHT; ++i) {
        for (let j = 0; j < GAME_GRID_WIDTH; ++j) {
            var id = i + '-' + j;
            if (j === 3) {
                gameGrid.append('<div id="' + id +'" class="game-cell"><img src="img/diamond-blue.png"></div>');
            }
            else {
                gameGrid.append('<div id="' + id +'" class="game-cell"><img src="img/diamond-red.png"></div>');
            }
            // $('#' + id).css('background-color', getRandomColor());
            $('#' + id).click({gameGrid: gameGrid}, userClick);
        }
    }


    function userClick(e) {
        $(this).addClass('selected-cell');
        var selectedCells = e.data.gameGrid.children(".selected-cell");
        if (selectedCells.length === 2) {
            swapCells(selectedCells.eq(0), selectedCells.eq(1));
            gameGrid.children().removeClass('selected-cell');
        }
    };

    function swapCells(cell1, cell2) {
        var id1 = cell1.attr('id').split('-');
        var id2 = cell2.attr('id').split('-');


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
        });
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (let i = 0; i < 6; ++i) {
            color += letters[Math.floor(Math.random() * 16)];
        }
      return color;
    };
});