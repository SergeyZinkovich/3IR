"use strict"
console.log('engine loaded');

var GameStatus = 0;
var Score = 0;
var myGen = new levelGenerator([1, 2], 8, 8);
myGen.generateLevel();
var PlayingField = myGen.getLevel();
Check();

function Turn(FromX, FromY, ToX, ToY){
	let buff = PlayingField[FromX][FromY];
	PlayingField[FromX][FromY] = PlayingField[ToY][ToY];
	PlayingField[ToY][ToY] = PlayingField[buff[0]][buff[1]];
	Check();
}

function Check(){
	while (true){
		if (!Anigilate()){return;}
		DoGen();
	}
}

function GetPlayingField(){
	return PlayingField;
}

function Anigilate(){
	let beg;
	for (let i = 0; i < PlayingField.length; i++){
		beg = 0;
		for (let j = 0; j < PlayingField[0].length; j++){
			if ((PlayingField[i][j] != PlayingField[i][beg]) || (j === PlayingField[0].length - 1)){
				if (PlayingField[i][j] === PlayingField[i][beg]){j++;}
				if (j - beg > 2){
					for (let h = beg; h < j; h++){
						PlayingField[i][h] = 0;
					}
					DoGen();
					return [[i, beg], [i, j - 1]];
				}
				else{
					beg = j;
				}
			}
		}
	}
	for (let i = 0; i < PlayingField[0].length; i++){
		beg = 0;
		for (let j = 0; j < PlayingField.length; j++){
			if ((PlayingField[j][i] != PlayingField[beg][i]) || (j === PlayingField.length - 1)){
				if (PlayingField[j][i] === PlayingField[beg][i]){j++;}
				if (j - beg > 2){
					for (let h = beg; h < j; h++){
						PlayingField[h][i] = 0;
					}
					DoGen();
					return [[beg, i], [j - 1, i]];
				}
				else{
					beg = j;
				}
			}
		}
	}
	return false;
}

function DoGen(){
	let myChanger = new levelChanger(PlayingField, [1, 2]);
	myChanger.replaceWithGenerated(0);
	PlayingField = myChanger.getLevel();
}