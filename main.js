let dealer_sum = 0;
let your_sum = 0;
let dealer_ace_count = 0;
let your_ace_count = 0;
let hidden;
let deck;
let can_hit = true;

window.onload = function() {
    build_deck();
    shuffle_deck();
    start_game();
}

function build_deck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);
        }
    }
}

function shuffle_deck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function start_game() {
    hidden = deck.pop();
    dealer_sum += get_value(hidden);
    dealer_ace_count += check_ace(hidden);

    while (dealer_sum < 18) {
        let card_img = document.createElement("img");
        let card = deck.pop();

        card_img.src = "./cards/" + convert_card_to_filename(card);
        dealer_sum += get_value(card);
        dealer_ace_count += check_ace(card);
        document.querySelector("#dealer_cards").append(card_img);
    }

    for (let i = 0; i < 2; i++) {
        let card_img = document.createElement("img");
        let card = deck.pop();

        card_img.src = "./cards/" + convert_card_to_filename(card);
        your_sum += get_value(card);
        your_ace_count += check_ace(card);
        document.querySelector("#your_cards").append(card_img);
    }

    document.querySelector("#hit").addEventListener("click", hit);
    document.querySelector("#stay").addEventListener("click", stay);
}

function hit() {
    if (!can_hit) {
        return;
    }

    let card_img = document.createElement("img");
    let card = deck.pop();

    card_img.src = "./cards/" + convert_card_to_filename(card);
    your_sum += get_value(card);
    your_ace_count += check_ace(card);
    document.querySelector("#your_cards").append(card_img);

    if (reduce_ace(your_sum, your_ace_count) > 21) {
        can_hit = false;
    }
}

function stay() {
    dealer_sum = reduce_ace(dealer_sum, dealer_ace_count);
    your_sum = reduce_ace(your_sum, your_ace_count);

    can_hit = false;
    document.querySelector("#hidden").src = "./cards/" + convert_card_to_filename(hidden);

    let message;

    if (your_sum > 21) {
        message = "You bust!";
    }
    else if (dealer_sum > 21) {
        message = "You win!";
    }
    else if (your_sum === dealer_sum) {
        message = "House wins!"; //not a tie
    }
    else if (your_sum > dealer_sum) {
        message = "You win!";
    }
    else {
        message = "You lose!";
    }

    document.querySelector("#dealer_sum").innerText = dealer_sum;
    document.querySelector("#your_sum").innerText = your_sum;
    document.querySelector("#results").innerText = message;
}

function get_value(card) {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) {
        if (value === "A") {
            return 11;
        }

        return 10;
    }

    return parseInt(value);
}

function check_ace(card) {
    if (card[0] === "A") {
        return 1;
    }

    return 0;
}

function reduce_ace(player_sum, player_ace_count) {
    while (player_sum > 21 && player_ace_count > 0) {
        player_sum -= 10;
        player_ace_count -= 1;
    }

    return player_sum;
}

function convert_card_to_filename(card) {
    const [value, suit] = card.split("-");

    const valueMap = {
        "A": "ace",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9",
        "10": "10",
        "J": "jack",
        "Q": "queen",
        "K": "king"
    };

    const suitMap = {
        "C": "clubs",
        "D": "diamonds",
        "H": "hearts",
        "S": "spades"
    };

    return `${valueMap[value]}_of_${suitMap[suit]}.png`;
}
