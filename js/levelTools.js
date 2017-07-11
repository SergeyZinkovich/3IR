/**
 * Created by Boris on 10.07.2017.
 */
"use strict"

function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}

var levelTools = function(aelements, arows, acolumns){
    var elements;
    var rows, columns;
    var map;
    setElements(aelements);
    setSize(arows, acolumns);

    function setElements(aelements){
        elements = aelements;
    }

    function setSize(arows, acolumns){
        rows = arows;
        columns = acolumns;
        map = new Array(rows);
        for (var i = 0; i < rows; ++i){
            map[i] = new Array(columns);
            for (var j = 0; j < columns; ++j){
                map[i][j] = {};
            }
        }
    }

    this.swapElements = function(fromX, fromY, toX, toY){
        var buff = map[fromX][fromY];
        map[fromX][fromY] = map[toX][toY];
        map[toX][toY] = buff;
    }

    this.generateLevel = function(){
        for (var i = 0; i < rows; ++i){
            for (var j = 0; j < columns; ++j){
                map[i][j] = elements[randomInteger(0,elements.length-1)];
            }
        }
    }

    this.replaceWithGenerated = function(elementForReplacing){
        for (var i = 0; i < map.length; ++i){
            for (var j = 0; j < map[i].length; ++j){
                if (map[i][j] === elementForReplacing){
                    map[i][j] = elements[randomInteger(0,elements.length-1)];
                }
            }
        }
    }

    this.getMap = function(){
        return(map);
    }
}

/* usage example */
/*
 var myGen = new levelGenerator(['a','b','c'],5,5);
 myGen.generateLevel();
 var myLevel = myGen.getMap();
 console.log(myLevel);

 var myChanger = new levelChanger(myLevel, ['a','b','c']);
 myChanger.replaceWithGenerated('a');
 myLevel = myChanger.getMap();
 console.log(myLevel);
 */