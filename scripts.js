let resultsArray = [];
let orgResultsArray = []; // array to calculate minimum move

let coinContainerElement = document.getElementById("coin-container");
let messageElement = document.getElementById("message");
let clicksElement = document.getElementById("clicks");

let generateButton = document.getElementById("generate-button");
generateButton.addEventListener("click", generateCoins);

let resetButton = document.getElementById("reset-button");
resetButton.addEventListener("click", reset);

let submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", submit);

let clicks = 0;
Submit_disableButton()   //disable the submit button on start


function generateCoins() {
  let sizeInput = document.getElementById("array-size-input");
  let size = sizeInput.value;
  // check size 
  if (size <0) {
    (Swal.fire('Hell Man !!!!!\n\nType a Positive Number!!!')).then ( function() {
      window.location.reload()
    })
  }

  if (size == 0) {
    (Swal.fire('Number entered should be\n more than Zero !!!')).then ( function() {
      window.location.reload()
    })
  }

  // if (size >30) {
  //   (Swal.fire('Range is 1-30\n Please Try Again !!!!!!')).then( function () {
  //     window.location.reload()
  //   })
  // }
  resultsArray = Array.from({ length: size }, () => Math.floor(Math.random() * 2) === 0 ? "H" : "T");
  orgResultsArray = [...resultsArray];     // store the original resultsArray

  renderCoins();
  hideMessage();
  checkConsecutiveTails();
  resetClicks();
  enableButton()    //enable the submit button on after coins are rendered
//   globalThis.arr_c = resultsArray
  console.log("orgResultsArray (global variable) = ",orgResultsArray)
}

function renderCoins() {
  coinContainerElement.innerHTML = "";
  for (let i = 0; i < resultsArray.length; i++) {
    let coinElement = document.createElement("div");
    coinElement.classList.add("coin");
    coinElement.textContent = resultsArray[i];
    coinElement.addEventListener("click", flipCoin.bind(null, i));
    coinContainerElement.appendChild(coinElement);
  }
  console.log("renderCoins=", resultsArray)
}


function flipCoin(index) {
  if (resultsArray[index] === "T") {
    clicks++;
    if (index < resultsArray.length - 1 && resultsArray[index + 1] === "T") {
      if (Swal.fire({
            title: 'Change all consecutive tails?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Winner --> Choose No!!',
            confirmButtonText: 'Loser --> Choose Yes!!'
            }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                '"T" --> "H" ',
                'Consecutive tails changed to head.',
                // 'success'
                )

                for (let i = index; i < resultsArray.length && resultsArray[i] === "T"; i++) {
                    resultsArray[i] = "H";
                }
                renderCoins();
                checkConsecutiveTails();
                updateClicks();
            } else {
              clicks--;
              updateClicks()
              console.log("function == checkConsecutiveTails_false(index)")
              checkConsecutiveTails_false(index)
            }
            })
      ) {
        
      } else {
        resultsArray[index] = "H";
      }
    } else {
      resultsArray[index] = "H";
    }
  }
  renderCoins();
  checkConsecutiveTails();
  updateClicks();
}

function checkConsecutiveTails() {
    // console.log("var = ", heads_up(arr_c))
  let count = 0;
  let message = "";
  for (let i = 0; i < resultsArray.length; i++) {
    if (resultsArray[i] === "T") {
      count++;

      if (count > 2) {
        message = "Hint: You have more than two consecutive tails. You can only change the first consecutive tail.";
        break;
      }
    } else {
      count = 0;
    }
  }
  showMessage(message);
}

function showMessage(message) {
  messageElement.textContent = message;
}

function hideMessage() {
  messageElement.textContent = "";
}

function reset() {
  resultsArray = [];
  coinContainerElement.innerHTML = "";
  hideMessage();
  resetClicks();
  // window.location.reload()
}

function submit() {
    let optimised_clicks = heads_up(orgResultsArray);
    // let optimised_clicks = heads_up(arr_c)
    console.log(optimised_clicks, clicks)

  if (optimised_clicks === clicks){
    // alert("win")
    (Swal.fire({
        title: 'You Win!!!!!!!!!',
        width: 600,
        padding: '3em',
        color: '#716add',
        background: '#fff',
        backdrop: `rgba(0,0,123,0.4)
                    url("trophy.gif")
                    left top
                    no-repeat `
})).then(function(){ 
  window.location.reload();
  }
);
  } else{
    // alert("lost")
        (Swal.fire({
            icon: 'error',
            title: 'YOU LOSE!!!!',
            text: `Total clicks from player = ${clicks}`,
            footer: `Minimun clicks required to solve = ${optimised_clicks}`,
        })).then(function(){ 
  window.location.reload();
  }
);
  }
}

function resetClicks() {
  clicks = 0;
  updateClicks();
  Generate_enableButton()
  Submit_disableButton()
}

function updateClicks() {
  clicksElement.textContent = "Clicks on Tails: " + clicks;

//   if (clicks === 0){
//     alert("Congrats you won!!!!!!");
//   }
}

function Submit_disableButton(){
  submitButton.disabled = true;
}

function enableButton(){
  submitButton.disabled = false;
  Generate_disableutton()
}

function Generate_disableutton(){
  generateButton.disabled = true;
}

function Generate_enableButton(){
  generateButton.disabled = false;
}


function checkConsecutiveTails_false(index) {
  resultsArray[index] = "H";
  // if (resultsArray[index - 1] === "T") {
  //   resultsArray[index] = "H";
  // }
  renderCoins()
  console.log("again")
  clicks++;
}



// to find optimal solution
function heads_up(arr_coins) {
    let total_flips = 0;
    
    for (let i = 0; i < arr_coins.length; i++) {
      if (arr_coins[i] == "T") {
        if (arr_coins[i + 1] == "H" || i + 1 == arr_coins.length) {
          total_flips += 1;
          arr_coins[i] = "H";
        //   console.log(arr_coins, "\t\t", total_flips, "tail with (or next) head (not consective tail)\t\t\t");
        } else {
          total_flips += 1;
          let j = i;
          while (j < arr_coins.length && arr_coins[j] == "T") {
            arr_coins[j] = "H";
            j += 1;
          }
        //   console.log(arr_coins, "\t\t", total_flips, "tails in succession with head in d end (or consective tail that ends with head))\t\t\t");
        }
      }
    }
    return total_flips;
  }
  
//   let arr_coins = ["T", "H", "T", "T", "H", "T", "H"];
//   let arr_coins = ["T", "T", "H", "T", "T", "T", "T", "H", "T", "T", "T", "T", "T", "T", "T", "T", "H", "T", "T", "T", "T"];
  
//   console.log(arr_coins, "list");
//   let arr_coins = resultsArray
//   let total_flips = heads_up(arr_coins);
  
//   console.log("\nfinal output = ", arr_coins);
  
//   console.log("Total flips = ", total_flips);


// console.log("sfddcdscdscsASdcxpokjhgcxz")


function bgcolor(color) {
      if (color === 'red'){
        document.getElementById("bodyhtml").style.backgroundColor = "red";
      } else if (color === 'lightblue') {
        document.getElementById("bodyhtml").style.backgroundColor = "lightblue";
      }else if (color === '#2991d6') {
        document.getElementById("bodyhtml").style.backgroundColor = "#2991d6";
    }else if (color === '#FDB813') {
        document.getElementById("bodyhtml").style.backgroundColor = "#FDB813";
    }else if (color === '#ee782e') {
        document.getElementById("bodyhtml").style.backgroundColor = "#ee782e";
    }
  }

