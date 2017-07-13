/**
 * Created by Boris on 10.07.2017.
 */
"use strict"

function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}

function generateWithProbability(elems, chances){
	for (var i = 1; i < chances.length; ++i){
		chances[i] += chances[i-1];
	}
	var p = randomInteger(1,100);
	for (var i = 0; i < chances.length; ++i){
		if (p < chances[i]) return elems[i];
	}
	return elems[0];
}

var GameLevel = function(aelements, arows, acolumns, difficulty){
	var scoreCoeff = 5;
	var numberOfElements = 5;
	var bomb = '-1';
	var numberOfLevels = 25;
	var chances;
    var elements;
    var rows, columns;
    var map;
	var passScore, passTime;
	var upgradeConditions = new Array(aelements.length);
    setElements(aelements);
    setSize(arows, acolumns);

	function generateBombs(){
		var p = generateWithProbability([0,1],[90,10]);
		console.log('p = ',p);
		if (p === 1){
			map[Math.floor(randomInteger(0,rows-1))][Math.floor(randomInteger(0,columns-1))] = bomb;
		}
	}
	
	function setUpgradeConditions(){
		for (var i = 0; i < elements.length; ++i){
			if (upgradeConditions[i] === undefined){
				upgradeConditions[i] = Math.floor(randomInteger(1,3)+(2*Math.max(Math.log(difficulty),1))*passTime/100);
			}
		}		
	}
	
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
		chances = new Array(elements.length);
		chances[0] = 100/(chances.length);
		chances[1] = 100/(chances.length);
		for (var i = 2; i < chances.length; ++i){
			chances[i] = 100/(chances.length);
		}			
		console.log(chances);
		
        for (var i = 0; i < rows; ++i){
            for (var j = 0; j < columns; ++j){
                map[i][j] = generateWithProbability(elements,chances);
            }
        }
		passTime = Math.floor(randomInteger(20, 100));
		passScore = Math.round(passTime*(4*Math.max(Math.log(difficulty),1)));
		setUpgradeConditions();
		generateBombs();
    }

    this.replaceWithGenerated = function(elementForReplacing){
        for (var i = 0; i < map.length; ++i){
            for (var j = 0; j < map[i].length; ++j){
                if (map[i][j] === elementForReplacing){
                    map[i][j] = generateWithProbability(elements,chances);
                }
            }
        }
		generateBombs();
    }
	
	this.getUpgradeConditions = function(){
		return (upgradeConditions);
	}
	
	this.getPassTime = function(){
		return (passTime);
	}
	
	this.getPassScore = function(){
		return (passScore);
	}	

    this.getMap = function(){
        return(map);
    }
}

/* usage example */

 var myGen = new GameLevel(['a','b','c','d','e'],5,5,1);
 myGen.generateLevel();
 myGen.replaceWithGenerated('b');
 var myLevel = myGen.getMap();
 console.log(myLevel);
 console.log(generateWithProbability(['a','b','c'],[10,50,40]));
 