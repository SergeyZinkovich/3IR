/**
 * Created by Boris on 10.07.2017.
 */
"use strict"

function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

var levelGenerator = function(aelements, arows, acolumns){
    var elements;
    var rows, columns;
    var level;
    setElements(aelements);
    setSize(arows, acolumns);

    function setElements(aelements){
        elements = aelements;
    }

    function setSize(arows, acolumns){
        rows = arows;
        columns = acolumns;
        level = new Array(rows);
        for (var i = 0; i < rows; ++i){
            level[i] = new Array(columns);
            for (var j = 0; j < columns; ++j){
                level[i][j] = {};
            }
        }
    }

    this.generateLevel = function(){
        for (var i = 0; i < rows; ++i){
            for (var j = 0; j < columns; ++j){
                var p = randomInteger(0,elements.length-1);
                level[i][j] = elements[p];
                console.log(p);
            }
        }
    }

    this.getLevel = function(){
        return(level);
    }
}

/* usage example */
/*
var myGen = new levelGenerator(['a','b','c'],5,5);
myGen.generateLevel();
console.log(myGen.getLevel());
*/