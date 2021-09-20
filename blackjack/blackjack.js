const deck = [];
const players = [];
const discard = [];
let playerName = "";
let inputBid = 0;
let gameOver = false;
let roundOver = false;

const playGame = (numPlayers, deck, players) => {
    newGame(numPlayers, players);
    createDeck();
    shuffle(deck);
    while (gameOver == false) {
        deal(deck, players);
        makeBids(players);
        while (roundOver == false) {
            for (let i = 0; i < players.length; i++) {
                takeTurn(players[i]);
            }
        }
        reshuffle(deck, players, discard, gameOver);
        inputBid = 0;
        roundOver = false;
    }
    endGame(players);
}

const addPlayer = (name, type) => {
    return {
        name: name,
        hand: [],
        score: 0,
        bet: 0,
        stake: 0,
        winnings: 0,
        stand: false,
        type: type
    }
}

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
        if (deck.length <= 0) {
            gameOver = true;
            return -1;
        } else {
            getcard(deck, players[i].hand);
            getcard(deck, players[i].hand);
        }
    }
}

const bid = (winnings, bet, stake) => {
    if (stake <= winnings) {
        bet = stake;
        stake = 0;
    } else {
        return -1;
    }
}

const makeBids = (players) => {
    for (let i = 0; i < players.length-1; i++) {
        bid(players[i].winnings, players[i].bet, players[i].stake);
    }
}

const blackjack = (players) => {
    
    for (let i = 0; i < players.length-1; i++) {
        if (players[players.length+1].score == 21) {
            if (players[i].score != 21) {
                players[i].winnings -= players[i].bet;
            }
            roundOver = true;
        } else if (players[i].score == 21) {
            players[i].winnings += (players[i].bet * 1.5)
            players[i].stand = true;
        }
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

const reshuffle = (deck, players) => {
    for (let i = 0; i < players.length; i++) {
        shiftCards(players[i].hand, deck);
    }
    shiftCards(discard, deck);
}

const reshuffle = (deck, players, discard, gameOver) => {
    for (let i = 0; i < players.length; i++) {
        if (gameOver == true) {
            shiftCards(players[i].hand, deck);
        } else {
            shiftCards(players[i].hand, discard);
        }
    }
    if (gameOver == true) {
        shiftCards(discard, deck);
        shuffle(deck);
    }
}

const shiftCards = (src, dst) => {
    for (let i = 0; i < src.length; i++) {
        dst.push(src.pop());
    }
}

const discard = (players) => {
    for (let i = 0; i < players.length; i++) {
        shiftCards(players[i].hand, discard);
    }
}

const newGame = (numplayers) => {
    for (let n = 1; n <= num; n++) {
        switch (n) {
            case 1:
                players.push(addPlayer(playerName, "player"));
                break;
            case num:
                // dealer is last player
                players.push(addPlayer("Dealer", "dealer"));
                break;
            default:
                players.push(addPlayer(("Player " + n), "AI"));
                break;
        }
    }
}

const takeTurn = (player) => {
    // player = players[current]
    let hasPlayed = false;
    while (hasPlayed == false) {
        // wait for key/button event, and set hasPlayed = true
        bidButton.onclick = bid(player.winnings, player.bet, inputBid);
        
    }
}

const buttonPress = () => {
    // bidButton - updates bid amount, does not end turn
    // hitButton - gives player card, ends turn
    // standButton - ends turn, sets player.stand = true
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
            players[k].stand = true;
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