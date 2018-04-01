var url = "/";
var primus = Primus.connect(url, {
  reconnect: {
      max: Infinity // Number: The max delay before we try to reconnect.
    , min: 500 // Number: The minimum delay before we try reconnect.
    , retries: 10 // Number: How many times we should try to reconnect.
  }
});

primus.on('data', function message(data){

  console.log('received message from server:', data.data.question);

  var title = document.querySelector(".title");
  if(title){
    title.innerHTML = data.data.question;
  }
  
  if(document.querySelector(".answer1") && document.querySelector(".answer2")){
    document.querySelector(".answer1").innerHTML = data.data.answer1;
    document.querySelector(".answer2").innerHTML = data.data.answer2;
  }
  else{
    var container = document.querySelector(".container");
    if(container){
      var a1 = document.createElement('a');
      a1.className = "answer answer1";
      a1.href = "#";
      a1.innerHTML = data.data.answer1;
      var a2 = document.createElement('a');
      a2.className = "answer answer2";
      a2.href = "#";
      a2.innerHTML = data.data.answer2;
        
    }
    container.appendChild(a1);
    container.appendChild(a2);
  }
  

});

document.querySelector(".form__input--ask").addEventListener("click", function(e){
  
  primus.write({
    question: document.querySelector(".form__input--question").value,
    answer1: document.querySelector(".form__input--answer1").value,
    answer2: document.querySelector(".form__input--answer2").value
    //question: "asked question"
  })
  e.preventDefault;
});