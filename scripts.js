const rollButton = document.getElementById('roll-button');
const resultElement = document.getElementById('result');
const roll = document.getElementById('roll');
const diceOptions = document.querySelectorAll('.dice-option');

const rollsHistory = document.getElementById('history');

let selectedDice = null;


diceOptions.forEach(option => {
    option.addEventListener('click', () => {
        diceOptions.forEach(opt => {
            opt.classList.remove('selected');
        })
        option.classList.add('selected');
        selectedDice = Number(option.dataset.value);
    });
});

function rollDice() {
    return Math.floor(Math.random() * (selectedDice - 1 + 1)) + 1;
}

function addToHistory(dice, result) {
    const item = document.createElement('p');
    item.classList.add('history-item');
    item.textContent = `${result} ← `;

    const span = document.createElement('span');
    span.textContent = `d${dice}(${result})`;
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

rollButton.addEventListener('click', () => {
    resultElement.textContent = "";
    roll.textContent = "";
    rollButton.textContent = "Rolando..."
    
    setTimeout(()=> {
        if (selectedDice === null) {
            roll.textContent = "Escolha um dado primeiro!";
            rollButton.textContent = "Rolar";
            return;
        }

        const result = rollDice();
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
        roll.textContent = `d${selectedDice}(${result})`;
        addToHistory(selectedDice, result);

        rollButton.textContent = "Rolar";
    }, 500)
});