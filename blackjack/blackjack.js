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

const getCard = (deck, hand) => {
    // hand = players[x].hand
    if (deck.length > 0) {
        hand.push(deck.pop());
    }
    else {
        alert("Out of cards!");
        endGame();
    }
}

const deal = (deck, players) => {
    for (let i = 0; i < players.length; i++) {
        getcard(deck, players[i].hand);
    }
}

const bid = (winnings, bet, stake) => {
    if (stake <= winnings) {
        bet = stake;
    } else {
        return -1;
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
        out: false,
        dealer: false
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

const newGame = (num, deck, players) => {
    for (let n = 1; n <= num; n++) {
        switch (n) {
            case 1:
                players.push(addPlayer(playerName));
                break;
            case num:
                // dealer is last player
                const dealer = addPlayer("Dealer");
                dealer.dealer = true;
                players.push(dealer);
                break;
            default:
                players.push(addPlayer("Player " + n));
        }
    }
    deal(deck, players);
}

const endRound = (players) => {
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

const findWinner = (players) => {
    let biggestPot = 0;
    let drawPool = [];
    for (let p = 0; p < players.length; p++) {
        if (players[p].winnings >= biggestPot) {
            biggestPot = players[p].winnings;
        }
    }
    for (let i = 0; i < players.length; i++) {
        if (players[i].winnings == biggestPot) {
            drawPool.push(i);
        }
    }
    return drawPool;
}

const displayWinner = (drawpool, players) => {
    if (drawpool == 1) {
        console.log(players[drawpool[0]] + " is the winner!");
    } else if (drawpool > 1) {
        console.log("Tie!");
    } else {
        console.log("Something has gone terribly wrong. The house wins!");
    }
}

const endGame = (players) => {
    // ends the entire game
    displayWinner(findWinner(players), players);
    // reshuffle(deck, players);    no reason to reshuffle deck - if draw is empty, game ends
}