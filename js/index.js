
var Calc = {
  firstNum: null,
  operator: "",
  secondNum: null,
  screen: {
    top: $("#current"),
    bottom: $("#equation")
  },
  current: []
}

function calculateValue(){
  var result;

  switch(Calc.operator){
    case "+":
      result = Calc.firstNum + Calc.secondNum;
      break;

    case "-":
      result = Calc.firstNum - Calc.secondNum;
      break;

    case "X":
      result = Calc.firstNum * Calc.secondNum;
      break;

    case "/":
      result = Calc.firstNum / Calc.secondNum;
      break;

    default:
      console.log("Error: ", Calc.operator);
  }

  return result;
}

function updateScreen(top,bottom){
  // Hide any error messages when button is pressed.
  $(".alert-danger").hide("slow");

  // Change top/bottom to 0 is empty or null
  if(top === "" || top === null){
    top = 0;
  }
  if(bottom === "" || bottom === null){
    bottom = 0;
  }

  Calc.screen.top.html(top);
  Calc.screen.bottom.html(bottom);
}

function handleNumBtnPress(){
  var botValue;
  Calc.current.push($(this).text());

  if(Calc.operator === ""){
    botValue = Calc.current.join("");
  }
  else{
    botValue = Calc.screen.bottom.text() + $(this).text();
  }


  updateScreen(Calc.current.join(""),botValue);
}

function handleBackPress(){
  //Check if pressing backspace when operator is selected.
  // if so, return (do nothing)
  if(Calc.operator !== "" && Calc.current.length === 0){
      return;
  }

  var botValue;

  if(Calc.current.length !== 0){
    Calc.current.pop();
  }

  //Check how to update the bot screen
  if(Calc.operator === ""){
    botValue = Calc.current.join("");
  }else{
    botValue = Calc.screen.bottom.text().split(" ")[0] +
      " " + Calc.operator + " " + Calc.current.join("");
  }

  updateScreen(Calc.current.join(""), botValue);
}

function handleClearPress(){
  Calc.current = [];
  Calc.operator = "";
  Calc.firstNum = null;
  Calc.secondNum = null;

  updateScreen(0,0);
}

function percentNum(){
  var currentNum;
  var botValue;

  if(Calc.current.length === 0 && Calc.firstNum === null){
    return;
  }

  if(Calc.firstNum !== null && Calc.current.length === 0){
    currentNum = Calc.firstNum;
  }else{
    currentNum = parseFloat(Calc.current.join(""));
  }

  if(Number.isInteger(currentNum)){
    currentNum /= 100;
  }else{
    currentNum *=100;
  }

  Calc.current = currentNum.toString().split("");

  if(Calc.operator === ""){
    botValue = currentNum.toString();
  }else{
    botValue = Calc.screen.bottom.text().split(" ")[0] +
      " " + Calc.operator + " " +
      currentNum.toString();
  }
  updateScreen(currentNum.toString(),botValue);

}

function negateNum(){
  var currentNum;
  var botValue;

  // If no number was entered, do nothing.
  if(Calc.current.length === 0 && Calc.firstNum === null){
    return;
  }

  if(Calc.firstNum !== null && Calc.current.length === 0){
    currentNum = Calc.firstNum;
  }else{
    currentNum = parseFloat(Calc.current.join(""));
  }

  currentNum *= -1;

  Calc.current = currentNum.toString().split("");

  if(Calc.operator === ""){
    botValue = currentNum.toString();
  }else{
    botValue = Calc.screen.bottom.text().split(" ")[0] +
      " " + Calc.operator + " " +
      currentNum.toString();
  }
  updateScreen(currentNum.toString(),botValue);

}

function handleUnaryOpBtnPress(){
    switch($(this).text()){
      case "%":
        percentNum();
        break;
      case "+/-":
        negateNum();
        break;

      default:
        break;
    }
}

function handleOpBtnPress(){
  if(Calc.operator === ""){
    if(Calc.firstNum === null){
      Calc.firstNum = parseFloat(Calc.current.join(""));
    }
    Calc.current = [];
  }else if(Calc.operator !== "" && Calc.current.length != 0){
    handleEqualPress();
  }


  Calc.operator = $(this).text();

  updateScreen(Calc.operator,Calc.firstNum + " " + Calc.operator + " ");

}

function checkError(){
  /* An error occurs in the following situations:
   *  - "=" is pressed after the first number has been pressed
   *  - An invalid number exists in the equation
   */
  var error = false;
  var message = "Please enter a valid equation. Check the numbers you have \
  entered are valid numbers";

  if( (!Calc.firstNum && Calc.firstNum !== 0) ||
      ((Calc.operator !== "" && !Calc.secondNum) && (Calc.secondNum !=0))){
    // Show alert message
    $("#err-message").html(message);
    $(".alert").show("slow");
    error = true;
  }
  return error
}

function handleEqualPress(){
  var topValue;
  var botValue;

  Calc.secondNum = parseFloat(Calc.current.join(""));

  // do nothing if number then "=" is pressed (no op or second num)
  // do nothing if error occurs (see: checkError)
  if(Calc.firstNum === null || checkError()){
    return;
  }

  topValue = calculateValue();
  botValue = Calc.screen.bottom.text() + " = " + topValue;

  // Reset values
  Calc.operator = "";
  Calc.current = [];
  Calc.firstNum = topValue;
  Calc.secondNum = null;

  updateScreen(topValue,botValue);
}

$(document).ready(function(){
  // Keep error message hidden
  $(".alert-danger").hide();

  // Handle each button press
  $(".num-btn").click(handleNumBtnPress);
  $(".unary-op-btn").click(handleUnaryOpBtnPress);
  $(".op-btn").click(handleOpBtnPress);
  $("#back-btn").click(handleBackPress);
  $("#clear-btn").click(handleClearPress);
  $("#equal-btn").click(handleEqualPress);

});
