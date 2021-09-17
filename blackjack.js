const deck = [];
const players = [];
let playerName = "";


const createCard = (suit, value) => {
    return {
        suit: suit,
        value: value
    }
}

const createDeck = () => {
    let suit = "";
    for (let s = 0; s < 4; s++) {
        switch (s) {
            case 0:
                suit = "Clubs";
                break;
            case 1:
                suit = "Diamonds";
                break;
            case 2:
                suit = "Hearts";
                break;
            case 3:
                suit = "Spades";
                break;
            default:
                suit = "Joker";
        }
        for (let v = 0; v < 13; v++) {
            deck.push(createCard(suit, v));
        }
    }
}

const getCard = (arr) => {
    if (arr.length > 0) {
        arr.pop();
    }
    else {
        alert("Out of cards!");
        endGame();
    }
}

const shuffle = (arr) => {
    for (let i = (arr.length-1); i > 0; i--) {
        let k = Math.floor(Math.random() * (i + 1));
        let temp = arr[i];
        arr[i] = arr[k];
        arr[k] = temp;
    }
}

const addPlayer = (name) => {
    return {
        name: name,
        hand: [],
        score: 0,
        bet: 0,
        winnings: 0,
        out: false
    }
}

const reshuffle = (deck, players) => {
    // probably not needed, if deck = 0, game ends
    for (let i = 0; i < players; i++) {
        deck.concat(players[i].hand);
        players[i].hand = [];
    }
    shuffle(deck);
}

const newGame = (num) => {
    for (let n = 1; n <= num; n++) {
        switch (n) {
            case 1:
                players.push(addPlayer(playerName));
                break;
            case num:
                // dealer is last player
                players.push(addPlayer("Dealer"));
                break;
            default:
                players.push(addPlayer("Player " + n));
        }
    }
}

const endRound = () => {
    dealerScore = players[players.length-1].score;
    for (let i = 0; i < players.length-1; i++) {
        if (players[i].score > 21) {
            players[i].winnings -= players[i].bet;
        } else if (dealerScore > 21) {
            players[i].winnings += ((players[i].bet)*2);
        } else if (players[i].score < dealerScore) {
            players[i].winnings -= players[i].bet;
        }
        // if player's score == dealer's, player gets their bet back
    }
    // resets scores and status for next round, and kicks players at $0
    for (let k = 0; k < players.length; k++) {
        players[k].bust = false;
        players[k].score = 0;
        players[k].bet = 0;
        if (players[k].winnings <= 0) {
            players[k].out = true;
        }
    }
}

const endGame = () => {
    // ends the entire game
    // findWinner();
    // reshuffle(deck, players);    no reason to reshuffle deck - if draw is empty, game ends
    // displayWinner();
}