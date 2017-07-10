/**
 * Created by Boris on 10.07.2017.
 */
"use strict"

function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
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
                level[i][j] = elements[randomInteger(0,elements.length-1)];
            }
        }
    }

    this.getLevel = function(){
        return(level);
    }
}

var levelChanger = function(alevel, aelements){
    var level = alevel;
    var elements = aelements;

    this.replaceWithGenerated = function(elementForReplacing){
        for (var i = 0; i < level.length; ++i){
            for (var j = 0; j < level[i].length; ++j){
                if (level[i][j] === elementForReplacing){
                    level[i][j] = elements[randomInteger(0,elements.length-1)];
                }
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
var myLevel = myGen.getLevel();
console.log(myLevel);

var myChanger = new levelChanger(myLevel, ['a','b','c']);
myChanger.replaceWithGenerated('a');
myLevel = myChanger.getLevel();
console.log(myLevel);
*/