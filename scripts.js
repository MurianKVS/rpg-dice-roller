const rollButton = document.getElementById('roll-button');
const resultElement = document.getElementById('result');
const roll = document.getElementById('roll');
const diceOptions = document.querySelectorAll('.dice-option');
const customDice = document.getElementById('custom-dice');

const rollsHistory = document.getElementById('history');

let selectedDice = null;


diceOptions.forEach(option => {
    option.addEventListener('click', () => {
        diceOptions.forEach(opt => {
            opt.classList.remove('selected');
        });
        customDice.classList.remove('selected');
        customDice.value = "";
        option.classList.add('selected');
        selectedDice = Number(option.dataset.value);
    });
});

function rollDice(dice) {
    return Math.floor(Math.random() * (dice - 1 + 1)) + 1;
}

function rollCustomDice(input) {
    input = input.replace(/\s+/g, "");
    const parts = input.split('+');
    let result = 0;
    let rollsList = [];

    parts.forEach(part => {
        if (/^\d+$/.test(part)) { /* for X*/
            const value = parseInt(part, 10);
            result += value;
            rollsList.push(`${value}`);
        } else if (/^d\d+$/i.test(part)) { /* for dX*/
            const dice = parseInt(part.slice(1), 10);
            const roll = rollDice(dice);
            result += roll;
            rollsList.push(`1d${dice}[${roll}]`);
        } else if (/^\d+d\d+$/i.test(part)) { /* for NdX */
            const [count, dice] = part.toLowerCase().split("d").map(Number);
            let rolls = [];
            for (let i = 0; i < count; i++) {
                const roll = rollDice(dice);
                rolls.push(roll);
                result += roll;
            }
            rollsList.push(`${count}d${dice}[${rolls.join(", ")}]`);
        } else {
            throw new Error(`Invalid input: ${part}`);
        }
    });

    return { result, rollsList };
}

function addToHistory(dice, result) {
    const item = document.createElement('p');
    item.classList.add('history-item');
    item.textContent = `${result} ← `;

    const span = document.createElement('span');
    if (dice.length > 1) { span.textContent = `${dice}`; }
    else { span.textContent = `1d${dice}[${result}]`; }
    item.appendChild(span);

    rollsHistory.insertBefore(item, rollsHistory.firstElementChild);

    if (rollsHistory.children.length > 10) {rollsHistory.removeChild(rollsHistory.lastElementChild);}

    rollsHistory.querySelectorAll('p').forEach(p => p.classList.remove('last'));
    item.classList.add('last');
}

function isCritic(dice, result) {
    if (result == dice) return 2;
    if (result == 1) return 1;
    return 0;
}


customDice.addEventListener('input', () => {
    if (customDice.value.trim() !== "") {
        diceOptions.forEach(opt => {
            opt.classList.remove('selected');
        });     
        customDice.classList.add('selected');
        selectedDice = undefined;
    } else {
        customDice.classList.remove('selected');
    }
});

rollButton.addEventListener('click', () => {
    resultElement.textContent = "";
    roll.textContent = "";
    rollButton.textContent = "Rolando..."
    
    setTimeout(()=> {
        if (selectedDice === null) {
            roll.textContent = "Escolha um dado primeiro!";
            rollButton.textContent = "Rolar";
            return;
        } else if (selectedDice === undefined) {
            resultElement.classList.remove('critic');
            resultElement.classList.remove('criticFail');

            let bruteResult = rollCustomDice(customDice.value);
            let result = bruteResult.result;
            let rolls = bruteResult.rollsList.join(" + ");

            resultElement.textContent = result;
            roll.textContent = rolls;
            addToHistory(rolls, result)
            rollButton.textContent = "Rolar";
        } else {
            let result = rollDice(selectedDice);
            let critic = isCritic(selectedDice, result);

            if(critic == 2){
                resultElement.classList.remove('criticFail');
                resultElement.classList.add('critic');
            } else if (critic == 1){
                resultElement.classList.remove('critic');
                resultElement.classList.add('criticFail');
            } else {
                resultElement.classList.remove('critic');
                resultElement.classList.remove('criticFail');
            }

            resultElement.textContent = result;
            roll.textContent = `1d${selectedDice}[${result}]`;
            addToHistory(selectedDice, result);

            rollButton.textContent = "Rolar";
        }
    }, 500)
});