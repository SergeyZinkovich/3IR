"use strict"
console.log('engine loaded');

var gameStatus = 0;
var score = 0;
var gems = [0, 1, 2, 3, 4];
var myGen = new levelGenerator(gems, 8, 8);
myGen.generateLevel();
var playingField = myGen.getLevel();
check();

function turn(fromX, fromY, toX, toY){
	let buff = playingField[fromX][fromY];
	playingField[fromX][fromY] = playingField[toX][toY];		
	playingField[toX][toY] = buff;
	check();
}

function check(){
	while (true){
		if (!anigilate()){return;}
	}
}

function getPlayingField(){
	return playingField;
}

function anigilate(){
	let beg;
	for (let i = 0; i < playingField.length; i++){
		beg = 0;
		for (let j = 0; j < playingField[0].length; j++){
			if ((playingField[i][j] != playingField[i][beg]) || (j === playingField[0].length - 1)){
				if (playingField[i][j] === playingField[i][beg]){j++;}
				if (j - beg > 2){
					let ans = [];
					for (let h = beg; h < j; h++){
						playingField[i][h] = -1;
						ans.push([i, h]);
					}
					gemFall(ans);
					doGen();
					return ans;
				}
				else{
					beg = j;
				}
			}
		}
	}
	for (let i = 0; i < playingField[0].length; i++){
		beg = 0;
		for (let j = 0; j < playingField.length; j++){
			if ((playingField[j][i] != playingField[beg][i]) || (j === playingField.length - 1)){
				if (playingField[j][i] === playingField[beg][i]){j++;}
				if (j - beg > 2){
					let ans = [];
					for (let h = beg; h < j; h++){
						playingField[h][i] = -1;
						ans.push([h, i]);
					}
					gemFall(ans);
					doGen();
					return ans;
				}
				else{
					beg = j;
				}
			}
		}
	}
	return false;
}

function canAnigilate(){
	let beg;
	for (let i = 0; i < playingField.length; i++){
		beg = 0;
		for (let j = 0; j < playingField[0].length; j++){
			if ((playingField[i][j] != playingField[i][beg]) || (j === playingField[0].length - 1)){
				if (playingField[i][j] === playingField[i][beg]){j++;}
				if (j - beg > 2){
					return true;
				}
				else{
					beg = j;
				}
			}
		}
	}
	for (let i = 0; i < playingField[0].length; i++){
		beg = 0;
		for (let j = 0; j < playingField.length; j++){
			if ((playingField[j][i] != playingField[beg][i]) || (j === playingField.length - 1)){
				if (playingField[j][i] === playingField[beg][i]){j++;}
				if (j - beg > 2){
					return true;
				}
				else{
					beg = j;
				}
			}
		}
	}
	return false;
}

function gemFall(line){
	let buff;
	console.log(playingField);
	console.log("LINE", line);
	for (let i = line[0][1]; i <= line[line.length - 1][1]; i++){
		for (let j = line[0][0]; j <= line[line.length - 1][0]; j++){
			let h = j;
			while ((h > 0) && (playingField[h - 1][i] !== -1)){
				buff = playingField[h - 1][i];
				playingField[h - 1][i] = playingField[h][i];
				playingField[h][i] = buff;
				h--;
			}
		}
	}
	console.log(playingField);
}

function doGen(){
	let myChanger = new levelChanger(playingField, gems);
	myChanger.replaceWithGenerated(-1);
	playingField = myChanger.getLevel();
}