var url = "/";
var primus = Primus.connect(url, {
  reconnect: {
    max: Infinity // Number: The max delay before we try to reconnect.
      ,
    min: 500 // Number: The minimum delay before we try reconnect.
      ,
    retries: 10 // Number: How many times we should try to reconnect.
  }
});

//tellers voor antwoorden
var voteCounter1 = 0;
var voteCounter2 = 0;

// client ontvangt data van server
primus.on('data', function message(data) {
  console.log('received message from server:', data);

  //als er in data een stem is, functie uitvoeren
  if (data.data.vote) {
    vote(data.data.vote);
  }
  // als vraag en antwoorden in data staan, functie uitvoeren
  if (data.data.question && data.data.answer1 && data.data.answer2) {
    createPoll(data.data.question, data.data.answer1, data.data.answer2);
  }
 
  //stemmen op antwoorden
  document.querySelector(".answer1").addEventListener('click', eventListener1);
  document.querySelector(".answer2").addEventListener('click', eventListener2);
});

//formulier van "/createpoll" versturen
if (checkClass(".form__input--ask")) {
  document.querySelector(".form__input--ask").addEventListener("click", function (e) {

    primus.write({
      question: document.querySelector(".form__input--question").value,
      answer1: document.querySelector(".form__input--answer1").value,
      answer2: document.querySelector(".form__input--answer2").value
      //question: "asked question"
    })
    e.preventDefault;
  });
}

//checken of deze classe wel bestaat
function checkClass(className) {
  if (document.querySelector(className)) {
    return true;
  }
}

// vraag en antwoorden laten verschijnen op "/"
function createPoll(question, answer1, answer2) {
  //titel verandern in vraag
  var title = document.querySelector(".title");
  if (title) {
    title.innerHTML = question;
  }

  //als er al antwoorden zijn, tekst veranderen
  if (checkClass(".answer1") && checkClass(".answer2")) {
    document.querySelector(".answer1").innerHTML = answer1;
    document.querySelector(".answer2").innerHTML = answer2;
  }
  //antwoorden aanmaken met functies
  else {
    createAnswer(answer1, "answer1", voteCounter1);
    createAnswer(answer2, "answer2", voteCounter2);
  }
}
//a aanmaken voor antwoord
function createAnswer(answer, classname, counter) {
  var container = document.querySelector(".container");
  var a = document.createElement('a');
  a.className = "answer " + classname + " low";
  a.innerHTML = answer;
  a.href = "#";
  container.appendChild(a);
}

//stem optellen bij juiste antwoord
function vote(vote) {
  var vote1 = document.querySelector(".answer1");
  var vote2 = document.querySelector(".answer2");
  if (vote == "answer1") {
    voteCounter1++;
    countVote(voteCounter1, vote1, 'answer1');
  }
  if (vote == "answer2") {
    voteCounter2++;
    countVote(voteCounter2, vote2, 'answer2');
  }
}

//css antwoord aanpassen ten gevolge van aantal stemmen
function countVote(counter, vote, classname) {
  console.log(vote.innerHTML + ': ' + counter);
  if (counter < 1) {
    vote.className = "answer " + classname + " low";
  } else if (counter < 5) {
    vote.className = "answer " + classname + " medium-low";
  }else if (counter < 7) {
    vote.className = "answer " + classname + " medium";
  }else if (counter < 10) {
    vote.className = "answer " + classname + " medium-high";
  }else {
    vote.className = "answer " + classname + " high";
  }
}

//stemmen naar server sturen
function eventListener1(){
  primus.write({
    vote: "answer1",
  })
}
function eventListener2(){
  primus.write({
    vote: "answer2",
  })
}
