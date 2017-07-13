"use strict"
console.log('engine loaded');

var Engine = function (){
	
    this.turn = function(fromX, fromY, toX, toY){
		gameLevel.swapElements(fromX, fromY, toX, toY);
		playingField = gameLevel.getMap();
		console.log(playingField);
		if (!this.canAnnihilate()){
			gameLevel.swapElements(fromX, fromY, toX, toY);
			playingField = gameLevel.getMap();
			return false;
		}
        return this.annihilate();
    }

	function annihilateAll(){
		while (true){
			if (!(this.annihilate())){return;}
		}
	}

	this.getPlayingField = function(){
		return playingField;
	}
	
	this.getScore = function(){
		return score;
	}

	this.annihilate = function(){
		let beg;
		let ans = [];
		for (let i = 0; i < playingField.length; i++){
			beg = 0;
			for (let j = 0; j < playingField[0].length; j++){
				if (!((playingField[i][j] === playingField[i][j - 1]) || (playingField[i][j - 1] === "-1") || (playingField[i][j] === "-1")) || (j === playingField.length - 1)){
					if ((j === playingField.length - 1) && ((playingField[i][j] === playingField[i][j - 1]) || 
						((playingField[i][j - 1] === "-1") && (playingField[i][j] === playingField[i][j - 2])) || (playingField[i][j] === "-1"))){j++;}
					if (j - beg > 2){
						for (let h = beg; h < j; h++){
							ans.push([i, h, playingField[i][h]]);
						}
					}
					beg = j;
				}
				if ((playingField[i][j - 1] === "-1") && (playingField[i][j] !== playingField[i][j - 2])){beg = j - 1;}
			}
		}
		for (let i = 0; i < playingField[0].length; i++){
			beg = 0;
			for (let j = 0; j < playingField.length; j++){
				if (!((j > 0 && playingField[j][i] === playingField[j - 1][i]) || (j > 0 && playingField[j - 1][i] === "-1") || (playingField[j][i] === "-1")) || (j === playingField.length - 1)){
					if ((j === playingField.length - 1) && ((j > 0 && playingField[j][i] === playingField[j - 1][i]) || 
						((j > 0 && playingField[j - 1][i] === "-1") && (j > 1 && playingField[j][i] === playingField[j - 2][i])) || (playingField[j][i] === "-1"))){j++;}
					if (j - beg > 2){
						for (let h = beg; h < j; h++){
							ans.push([h, i, playingField[h][i]]);
						}
					}
					beg = j;
				}
				if ((j > 1 && j < playingField.length) && ((playingField[j - 1][i] === "-1") && (playingField[j][i] !== playingField[j - 2][i]))){beg = j - 1;}
			}
		}
		for (let i = 0; i < ans.length; i++){
			playingField[ans[i][0]][ans[i][1]] = -3;
			if (ans[i][2] === "-1"){
				let arr = popBomb(ans[i][0], ans[i][1]);
				for (let j = 0; j < arr.length; j++){
					ans.push(arr[j]);
				}
			}
		}
		if (ans.length > 0){
			updateScore(ans);
			updateCollectedGems(ans);
			dropGems(ans);
			doGen();
			console.log(playingField);
			return ans;
		}
		else{
			return false;
		}
	}
	
	function popBomb(a, b){
		let ans = [];
		for (let i = 0; i < playingField.length; i++){
			ans.push([i, b, playingField[i][b]]);
			playingField[i][b] = -3;
		}
		for (let i = 0; i < playingField[a].length; i++){
			ans.push([a, i, playingField[a][i]]);
			playingField[a][i] = -3;
		}
		return ans;
	}
	
	function updateScore(arr){
		if (gameStatus === 0){return;}
		for (let i = 0; i < arr.length; i++){
			score += Math.floor(5 * (1 + Math.floor((arr[i][2] / gems.length) + 1) / 10));
		}
	}

	this.canAnnihilate = function(){
		let beg;
		for (let i = 0; i < playingField.length; i++){
			beg = 0;
			for (let j = 0; j < playingField[0].length; j++){
				if (!((playingField[i][j] === playingField[i][j - 1]) || (playingField[i][j - 1] === "-1") || (playingField[i][j] === "-1")) || (j === playingField.length - 1)){
					if ((j === playingField.length - 1) && ((playingField[i][j] === playingField[i][j - 1]) || 
						((playingField[i][j - 1] === "-1") && (playingField[i][j] === playingField[i][j - 2])) || (playingField[i][j] === "-1"))){j++;}
					if (j - beg > 2){
						return true;
					}
					else{
						beg = j;
					}
				}
				if ((playingField[i][j - 1] === "-1") && (playingField[i][j] !== playingField[i][j - 2])){beg = j - 1;}
			}
		}
		for (let i = 0; i < playingField[0].length; i++){
			beg = 0;
			for (let j = 0; j < playingField.length; j++){
				if (!((j > 0 && playingField[j][i] === playingField[j - 1][i]) || (j > 0 && playingField[j - 1][i] === "-1") || (playingField[j][i] === "-1")) || (j === playingField.length - 1)){
					if ((j === playingField.length - 1) && ((j > 0 && playingField[j][i] === playingField[j - 1][i]) || 
						((j > 0 && playingField[j - 1][i] === "-1") && (j > 1 && playingField[j][i] === playingField[j - 2][i])) || (playingField[j][i] === "-1"))){j++;}
					if (j - beg > 2){
						return true;
					}
					else{
						beg = j;
					}
				}
				if ((j > 1 && j < playingField.length) && ((playingField[j - 1][i] === "-1") && (playingField[j][i] !== playingField[j - 2][i]))){beg = j - 1;}
			}
		}
		return false;
	}

	function dropGems(line){
		let buff;
		for (let i = 0; i < line.length; i++){
			let h = line[i][0];
			let k = line[i][1];
			while ((h > 0) && (playingField[h - 1][k] !== -1)){
				buff = playingField[h - 1][k];
				playingField[h - 1][k] = playingField[h][k];
				playingField[h][k] = buff;
				h--;
			}
		}
	}

	function doGen(){
		gameLevel.replaceWithGenerated(-3);
        playingField = gameLevel.getMap();
	}
	
	function replaceUpgradedGem(gem){
		for (let i = 0; i < playingField.length; i++){
			for (let j = 0; j < playingField[0].length; j++){
				if (playingField[i][j] === gem){
					playingField[i][j] += gems.length;
				}
			}
		}
	}
	
	function updateCollectedGems(arr){
		if (gameStatus === 0){return;}
		for (let i = 0; i < arr.length; i++){
			gemsCount[arr[i][2] % gems.length]++;
		}
		upgradeGems();
	}
	
	function upgradeGems(){
		for (let i = 0; i < gemsCount.length; i++){
			if ((gemsCount[i] >= gemsTasks[i]) && (Math.floor(gems[i] / gems.length) < 4)){
				replaceUpgradedGem(gems[i]);
				gems[i] += gems.length;
				gemsCount[i] = 0;
			}
		}
	}
	
	this.getGemsStatus = function(){
		let ans = [];
		for (let i = 0; i < gems.length; i++){
			let buff = gemsTasks[i] - gemsCount[i];
			if ((buff < 0) || Math.floor(gems[i] / gems.length) === 4){
				buff = "max"
			}
			ans.push([gems[i], buff]);
		}
		return ans;
	}
	
	this.getTimeTask = function(){
		return timeTask;
	}
	
	this.getScoreTask = function(){
		return scoreTask;
	}
	
	this.levelPassed = function(){
		if (score >= scoreTask){
			return true;	
		}
		else{
			return false;
		}
	}
	
	this.getLevelNumber = function(){
		return levelNumber;
	}
	
	this.nextLevel = function(){
		levelNumber++;
		generateLevel();
	}
	
	this.replayLevel = function(){
		generateLevel();
	}
	
	function generateLevel(){
		gameStatus = 0;
		score = 0;
		gems = [0, 1, 2, 3, 4];
		gemsCount = [0, 0, 0, 0, 0]; 
		gameLevel = new GameLevel(gems, 8, 8, levelNumber);
		gameLevel.generateLevel();
		playingField = gameLevel.getMap();
		gemsTasks = gameLevel.getUpgradeConditions();
		timeTask = gameLevel.getPassTime();
		scoreTask = gameLevel.getPassScore();
		annihilateAll.apply(this);
		gameStatus = 1;
	}
	
	var levelNumber = 1;
	var gameStatus;
	var score;
	var gems;
	var gemsCount; 
	var gameLevel;
	var playingField;
	var gemsTasks;
	var timeTask;
	var scoreTask;
	generateLevel.apply(this);
}

var engine = new Engine();