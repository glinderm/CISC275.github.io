let playerName = "";
let inputBid = 0;
let gameOver = false;
let roundOver = false;

const testDeck = createDeck();
printDeck(testDeck);

const printDeck = (deck) => {
    for (let i = 0; i < deck.length; i++) {
        console.log("Card: " + deck[i].name + ", " + deck[i].suit + ": " + deck[i].value);
    }
}

const playGame = (numPlayers, players) => {
    const players = newGame(numPlayers);
    const deck = createDeck();
    const discard = [];
    shuffle(deck);
    while (gameOver == false) {
        deal(deck, players);
        makeBids(players);
        while (roundOver == false) {
            for (let i = 0; i < players.length; i++) {
                takeTurn(players[i], deck);
            }
        }
        reshuffle(deck, players, discard, gameOver);
        inputBid = 0;
        roundOver = false;
    }
    endGame(players, deck);
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

const createCard = (suit, value, name) => {
    return {
        suit: suit,
        value: value,
        name: name
    }
}

const nameCard = (suit, value) => {
    let name = "";
    if (value <= 10) {
        name += value;
    } else {
        if (value == 11) {
            name += "Jack";
        } else if (value == 12) {
            name += "Queen";
        } else if (value == 13) {
            name += "King";
        } else {
            name += "Ace";
        }
    }
    name += " of " + suit;
}

const createDeck = () => {
    const deck = [];
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
        for (let v = 2; v < 15; v++) {
            if (v <= 10) {
                deck.push(createCard(suit, v, nameCard(suit, v)));
            } else if (v < 14) {
                deck.push(createCard(suit, 10, nameCard(suit, v)));
            } else {
                deck.push(createCard(suit, 14, nameCard(suit, v)));
            }
            
        }
    }
    return deck;
}

const scoreHand = (hand) => {
    // takes in players[i].hand, player[i].score should be set to return
    let totalScore = 0;
    let aceCount = 0;
    for (let i = 0; i < hand.length; i++) {
        if (hand[i].value == 14) {
            // ace
            aceCount += 1;
        } else {
            totalScore += hand[i].value;
        }
    }
    for (let a = 0; a < aceCount; a++) {
        if (totalScore + 10 > 21) {
            totalScore += 1;
        } else {
            totalScore += 10;
        }
    }
    return totalScore;
}

const getCard = (deck, player) => {
    // hand = players[x].hand
    if (deck.length > 0) {
        player.hand.push(deck.pop());
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
            players[i].score = scoreHand(players[i].hand);
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

const discard = (discard, players) => {
    for (let i = 0; i < players.length; i++) {
        shiftCards(players[i].hand, discard);
    }
}

const newGame = (numplayers) => {
    let players = [];
    for (let n = 1; n <= num; n++) {
        switch (n) {
            case 1:
                players.push(addPlayer(playerName, "human"));
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
    return players;
}

const takeTurn = (player, deck) => {
    // player = players[current]
    let hasPlayed = false;
    if (player.type == "human") {
        while (hasPlayed == false) {
            // wait for key/button event, and set hasPlayed = true
            // bidButton.onclick = bid(player.winnings, player.bet, inputBid);
            playerTurn(player.hand, hasPlayed);
        }
    } else {
        while (hasPlayed == false) {
            if (player.score >= 17) {
                if (player.score > 21) {
                    player.stand = true;
                    hasPlayed = true;
                } else {
                    if (player.type == "dealer") {
                        hasPlayed = true;
                    } else {
                        if (player.score < 18) {
                            getCard(deck, player.hand);
                            players[i].score = scoreHand(players[i].hand);
                        } else {
                            hasPlayed = true;
                        }
                    }
                }
            } else {
                getCard(deck, player.hand);
                players[i].score = scoreHand(players[i].hand);
            }
        }
    }
}

const buttonPress = () => {
    // bidButton - updates bid amount, does not end turn
    // hitButton - gives player card, ends turn
    // standButton - ends turn, sets player.stand = true
}

const playerTurn = (hand, hasPlayed) => {
    // include button press handling etc
    hasPlayed = true;
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

const endGame = (players, deck) => {
    // ends the entire game
    displayWinner(findWinner(players), players);
    // reshuffle(deck, players);    no reason to reshuffle deck - if draw is empty, game ends
}