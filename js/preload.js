"use strict"
$(window).on("load", function(){

    var preload = $('.preload');
    for (let i=0; i <= 24; ++i) {
        preload.append('<img src="img/diamond-'+i+'.png">');
    }
    preload.append('<img src="img/bomb.png">');
    preload.append('<img src="img/boom.png">');
    preload.append('<img src="img/select.png">');



    var music = $('#music');
    music.prop('volume', 0.05);

    $('#play-music').click(function() {
        if(music.prop("paused")) {
            music.trigger('play');
        }
        else {
            music.trigger("pause");
        }
    });
});