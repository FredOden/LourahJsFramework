
function Player(name, userType) {
	var walet;
	var score;
	var coups = [];
	var hand = new Array(7);
	this.getUser = () => user;
	this.getScore = () => score;
	this.getCoups = () => coups;
	this.pickLetters = () => {
		if (bag.length === 0) return;
		for(var i = 0; i<hand.length; i++) {
			if (!hand[i]) {
				hand[i] = bag.pickLetter();
				}
			}
		};
	}
	
Player.HUMAN = "Human";
Player.MACHINE = "Machine";
