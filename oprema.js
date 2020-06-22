function toEnvironment(json) {
    let currentEnvironment = new Environment();
    let tuples = Object.entries(json);
    for (let i = 0; i < tuples.length; i++) {
        currentEnvironment[tuples[i][0]] = tuples[i][1];
    }
    return currentEnvironment;
}

function fixedQuantity(quantity) {
    return (environment) => quantity;
}

function alwaysDisplay() {
    return (environment) => true;
}

function buildItem(name, quantityFunction, displayFunction) {
    let item = { name: name, quantity: fixedQuantity(1), display: alwaysDisplay() };
    if (quantityFunction)
        item.quantity = quantityFunction;
    if (displayFunction)
        item.display = displayFunction;
    return item;
}

function checkboxToggled(checkbox, index) {
    environment.checked[index] = checkbox.checked;
    saveDataToStorage(environment);

    let row = checkbox.parentElement.parentElement;
    if (checkbox.checked) {
        row.className += " done";
    } else {
        row.className = row.className.replace("done", "").trim();
    }
}

function buildListElement(item, environment, index) {
    let row = document.createElement("tr");

    let checkboxColumn = document.createElement("td");
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "uk-checkbox";
    checkboxColumn.appendChild(checkbox);
    row.appendChild(checkboxColumn);

    let quantityColumn = document.createElement("td");
    quantityColumn.className = "quantity";
    quantityColumn.innerText = item.quantity(environment);
    row.appendChild(quantityColumn);

    let itemColumn = document.createElement("td");
    itemColumn.innerHTML = item.name;
    row.appendChild(itemColumn);

    let isChecked = false;
    if (index < environment.checked.length) {
        if (environment.checked[index] != null)
            isChecked = environment.checked[index];
    }
    checkbox.checked = isChecked;

    if (isChecked)
        checkbox.parentElement.parentElement.className = "done";

    row.onclick = function(event) {
        let e = event || window.event;
        let target = e.target || e.srcElement;
        if (target != checkbox) {
            checkbox.checked = !checkbox.checked;
            checkboxToggled(checkbox, index);
        }
    }

    checkbox.onchange = function(event) {
        checkboxToggled(checkbox, index);
    };

    return row;
}

function buildList(equipment, environment) {
    let list = document.getElementById("list");
    list.innerHTML = "";

    for (let i = 0; i < equipment.length; i++) {
        let item = equipment[i];
        if (item.display(environment)) {
            let element = buildListElement(item, environment, i);
            list.appendChild(element);
        }
    }
}

function loadDataFromStorage() {
    let data = localStorage.getItem('environment');
    if (!data)
        return new Environment();
    return toEnvironment(JSON.parse(data));
}

function saveDataToStorage(environment) {
    let data = JSON.stringify(environment);
    localStorage.setItem('environment', data);
}

function clearDataFromStorage() {
    localStorage.removeItem('environment');
}

function customize() {
    questions = QUESTIONS.slice();
    UIkit.modal(document.getElementById("customize"), {}).show();
    nextQuestion();
}

function nextQuestion() {
    if (questions.length > 0) {
        displayQuestion(questions.shift());
    } else {
        UIkit.modal(document.getElementById("customize")).hide();
        buildList(EQUIPMENT, environment);
    }
}

function displayQuestion(question) {
    let questionElement = document.getElementById("question");
    questionElement.innerText = question.question;

    if ('emoji' in question) {
        let emojiElement = document.getElementById("emoji");
        emojiElement.innerText = question.emoji;
    }

    let answersElement = document.getElementById("answers");
    answersElement.innerHTML = "";
    for (let i = 0; i < question.answers.length; i++) {
        let answer = question.answers[i];

        let answerElement = document.createElement("button");
        answerElement.className = "uk-button uk-button-default uk-width-1-1";
        answerElement.innerText = answer.answer;
        answerElement.onclick = function(event) {
            answer.callback(environment);
            saveDataToStorage(environment);
            nextQuestion();
        }
        answersElement.appendChild(answerElement);
    }
}

var environment, questions = [];

window.onload = function() {
    // Load data from storage
    environment = loadDataFromStorage();
    buildList(EQUIPMENT, environment);

    document.getElementById("button-customize").onclick = customize;

    document.getElementById("button-reset").onclick = function() {
        UIkit.modal.confirm('Želite res ponastaviti seznam?', {labels: { cancel: 'Prekliči', ok: 'Ponastavi'}}).then(function() {
            clearDataFromStorage();
            environment = loadDataFromStorage();
            buildList(EQUIPMENT, environment);
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }, function () {
        });
    }

    UIkit.util.on('#customize', 'hide', function () {
        buildList(EQUIPMENT, environment);
    });
}