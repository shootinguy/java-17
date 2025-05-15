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
};

function build_deck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);  // Example: "A-S"
        }
    }
}

function shuffle_deck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function start_game() {
    hidden = deck.pop();
    dealer_sum += get_value(hidden);
    dealer_ace_count += check_ace(hidden);

    // Show one card hidden
    let hidden_img = document.createElement("img");
    hidden_img.id = "hidden";
    hidden_img.src = "./cards/BACK.png";
    document.querySelector("#dealer_cards").append(hidden_img);

    // Dealer draws until 18+
    while (dealer_sum < 18) {
        let card_img = document.createElement("img");
        let card = deck.pop();

        card_img.src = "./cards/" + card + ".png";
        dealer_sum += get_value(card);
        dealer_ace_count += check_ace(card);
        document.querySelector("#dealer_cards").append(card_img);
    }

    // Player draws 2
    for (let i = 0; i < 2; i++) {
        let card_img = document.createElement("img");
        let card = deck.pop();

        card_img.src = "./cards/" + card + ".png";
        your_sum += get_value(card);
        your_ace_count += check_ace(card);
        document.querySelector("#your_cards").append(card_img);
    }

    document.querySelector("#hit").addEventListener("click", hit);
    document.querySelector("#stay").addEventListener("click", stay);
}

function hit() {
    if (!can_hit) return;

    let card_img = document.createElement("img");
    let card = deck.pop();

    card_img.src = "./cards/" + card + ".png";
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
    document.querySelector("#hidden").src = "./cards/" + hidden + ".png";

    let message;

    if (your_sum > 21) {
        message = "You bust!";
    } else if (dealer_sum > 21) {
        message = "You win!";
    } else if (your_sum === dealer_sum) {
        message = "House wins!"; // not a tie
    } else if (your_sum > dealer_sum) {
        message = "You win!";
    } else {
        message = "You lose!";
    }

    document.querySelector("#dealer_sum").innerText = dealer_sum;
    document.querySelector("#your_sum").innerText = your_sum;
    document.querySelector("#results").innerText = message;
}

function get_value(card) {
    let value = card.split("-")[0];

    if (isNaN(value)) {
        if (value === "A") return 11;
        return 10;
    }

    return parseInt(value);
}

function check_ace(card) {
    return card.startsWith("A") ? 1 : 0;
}

function reduce_ace(sum, ace_count) {
    while (sum > 21 && ace_count > 0) {
        sum -= 10;
        ace_count--;
    }
    return sum;
}
