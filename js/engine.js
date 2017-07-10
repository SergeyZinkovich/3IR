"use strict"
console.log('engine loaded');

var PlaingField = [[1, 0, 1, 3, 4], [0, 2, 2, 2, 2], [1, 2, 2, 2, 2], [2, 1, 3, 4, 4], [1, 3, 4, 2, 2]];
var GameStatus = 0;
var Score = 0;
var myGen = new levelGenerator([1, 2], 8, 8);
myGen.generateLevel();
var PlaingField = myGen.getLevel();
Check();

function Turn(FromX, FromY, ToX, ToY){
	let buff = PlaingField[FromX][FromY];
	PlaingField[FromX][FromY] = PlaingField[ToY][ToY];
	PlaingField[ToY][ToY] = PlaingField[buff[0]][buff[1]];
	Check();
}

function Check(){
	while (true){
		if (!Anigilate()){return;}
		DoGen();
	}
}

function GetPlaingField(){
	return PlaingField;
}

function Anigilate(){
	let beg;
	for (let i = 0; i < PlaingField.length; i++){
		beg = 0;
		for (let j = 0; j < PlaingField[0].length; j++){
			if ((PlaingField[i][j] != PlaingField[i][beg]) || (j === PlaingField[0].length - 1)){
				if (PlaingField[i][j] === PlaingField[i][beg]){j++;}
				if (j - beg > 2){
					for (let h = beg; h < j; h++){
						PlaingField[i][h] = 0;
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
	for (let i = 0; i < PlaingField[0].length; i++){
		beg = 0;
		for (let j = 0; j < PlaingField.length; j++){
		console.log(i, j, beg);
			if ((PlaingField[j][i] != PlaingField[beg][i]) || (j === PlaingField.length - 1)){
				if (PlaingField[j][i] === PlaingField[beg][i]){j++;}
				if (j - beg > 2){
					for (let h = beg; h < j; h++){
						PlaingField[h][i] = 0;
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
	let myChanger = new levelChanger(PlaingField, [1, 2]);
	myChanger.replaceWithGenerated(0);
	PlaingField = myChanger.getLevel();
}