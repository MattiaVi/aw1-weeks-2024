'use strict';

let sortingOrder = "asc";

function Question(id, text, email, date) {
    this.id =id;
    this.text = text;
    this.email = email;
    this.date = dayjs(date);
    this.answers = [];
  
    this.add = (answer) => {
      this.answers.push(answer);
    }

    this.getAnswers = () => {
        return [...this.answers];
    }

    this.init = () => {
        this.answers = [
            new Answer(1, 'Yes', 'luca.mannella@polito.it', '2024-02-28', -10),
            new Answer(2, 'Not in a million year', 'guido.vanrossum@python.org', '2024-03-01', 5),
            new Answer(3, 'No', 'albert.einstein@relativity.org', '2024-03-11'),
            new Answer(4, 'Then, I don\'t know', 'luca.mannella@polito.it', '2024-03-10')
        ];
    }
}

function Answer(id, text, email, date, score=0) {
    this.id = id;
    this.text = text;
    this.email = email;
    this.score = score;
    this.date = dayjs(date);
  
    this.toString = () => {
      return `${this.username} replied '${this.text}' on ${this.date.format('YYYY-MM-DD')} and got a score of ${this.score}`;
    }
}

/*
 * STRING LITERAL WAY
 * Write directly the HTML inside a string.
 */
function createAnswerRowLiteral(answer) {
    return `<tr id="answer-${answer.id}">
        <td>${answer.date.format("MMMM DD, YYYY")}</td>
        <td>${answer.text}</td>
        <td>${answer.email}</td>
        <td>${answer.score}</td>
        <td>
            <button class="btn btn-warning"><i class='bi bi-arrow-up'></i> </button>
            <button class="btn btn-primary"><i class='bi bi-pencil-square mx-1'> </i></button>
            <button class="btn btn-danger"><i class='bi bi-trash'></i> </button>
        </td>
    </tr>
    `
}

/*
 * CLASSIC WAY
 * Creating every element using DOM methods.
 */
function createAnswerRow(answer) {
    const tr = document.createElement('tr');
    tr.setAttribute('id', `answer-${answer.id}`);

    const tdDate = document.createElement('td');
    tdDate.innerText = answer.date.format("YYYY-MM-DD");
    tr.appendChild(tdDate);

    const tdText = document.createElement('td');
    tdText.innerText = answer.text;
    tr.appendChild(tdText);

    const tdAuthor = document.createElement('td');
    tdAuthor.innerText = answer.email;
    tr.appendChild(tdAuthor);

    const tdScore = document.createElement('td');
    tdScore.innerText = answer.score;
    tr.appendChild(tdScore);

    const tdActions = document.createElement('td');
        const buttonVote = document.createElement('button');
        buttonVote.classList.add('btn', 'btn-warning'); //posso usare le classi bootstrap, siccome importate 
        buttonVote.innerHTML = "<i class='bi bi-arrow-up'></i>" //mettere html dentro oggetto, modo alternativo 
        tdActions.appendChild(buttonVote);

        buttonVote.addEventListener('click', event => {
            console.log(event.target.parentElement.parentElement);  // note that it changes if you click on the drawing or outside of it
            console.log(event.currentTarget.parentElement.parentElement.id);  // with currentTarget it always gets the button
            tdScore.innerText = Number(tdScore.innerText) + 1; //Number perchè inner text è una stringa -> occhio che se ricarico la page rimane questo
            answer.score = answer.score +1; 
        })

        const buttonEdit = document.createElement('button');
        buttonEdit.classList.add('btn', 'btn-primary', 'mx-1'); //mx per dare margine
        buttonEdit.innerHTML = "<i class='bi bi-pencil-square'></i>"
        tdActions.appendChild(buttonEdit);

        const buttonDelete = document.createElement('button');
        buttonDelete.classList.add('btn', 'btn-danger');
        buttonDelete.innerHTML = "<i class='bi bi-trash'></i>"
        tdActions.appendChild(buttonDelete);

        buttonDelete.addEventListener('click', event => {
            console.log(event.currentTarget.parentElement.parentElement.id);
            tr.remove(); //riga sparisce dal dom 
        })
    tr.appendChild(tdActions);

    return tr;
}
//funzione che riceve le rispose e popola la tabella 
function fillAnswersTable(answers) {
    const answerTable = document.getElementById('answers-table'); //prendo la tabella 
    // const answersTable = document.querySelector('#answers-table');  // alternativa 

    //pulisco la tabella, serve pi che altro per il sorting 
    // svuoto ma con struttura 
    answerTable.innerHTML = `<tr id="new-answer-row">
        <td><input class="form-control" type="date"></td>
        <td><input class="form-control" type="text"></td>
        <td><input class="form-control" type="text"></td>
        <td><input class="form-control" type="text" size="3"></td>
        <td><button class="btn btn-success">Add</button></td>
    </tr>
    `
    // svuto brutalmente 
    //answerTable.innerHTML = ""; (modo 2)

    for(const answer of answers) { //itera sulle varie risposte e per ogni risposta costuisce una riga 
        const trAnswer = createAnswerRow(answer);
        answerTable.prepend(trAnswer);  //ricroda sempre di prependere, così form non rimane in cima 

        /*
         * Alternative: using string literal.
         * Note: with this approach event listeners are not enabled!
         */
        // const trAnswer = createAnswerRowLiteral(answer);
        // answerTable.insertAdjacentHTML('afterbegin', trAnswer);  //modo 2 usando html diretto
    }
}
//gestione dello score
function addSortListener(answers) {
    const sortScoreIcon = document.getElementById('sort-score'); //per andare a prendere icona che ho definito 
    sortScoreIcon.addEventListener('click', event => {
        const sortedAnswers = [...answers];
        if(sortingOrder === "asc") {
            sortedAnswers.sort((a,b) => a.score - b.score);  // ordering
            sortingOrder = "desc";                           // changing next sort value
            // updating icon
            sortScoreIcon.classList.remove("bi-sort-numeric-down-alt");
            sortScoreIcon.classList.add("bi-sort-numeric-up");
        }
        else {
            sortedAnswers.sort((a,b) => b.score - a.score);  // ordering
            sortingOrder = "asc";                            // changing next sort value
            // updating icon
            sortScoreIcon.classList.remove("bi-sort-numeric-up");
            sortScoreIcon.classList.add("bi-sort-numeric-down-alt");
        }
        console.log(sortedAnswers);
        fillAnswersTable(sortedAnswers);
    })
}

function main() {
    const question = new Question('Is JS better than Python?', 'Luigi De Russis', '2024-02-27');
    question.init(); //mima in pratica una get a backend che interroga il database
    const answers = question.getAnswers();
    //console.log(answers);  //--> printing answers before start working on them
    fillAnswersTable(answers);
    addSortListener(answers);
}

main();
