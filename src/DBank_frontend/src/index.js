import { DBank_backend } from "../../declarations/DBank_backend";

window.addEventListener("load", async function () {
  DBank_backend.amount(await DBank_backend.getRate());
  update();
});

document.querySelector(".settings").addEventListener("click", async function () {
  DBank_backend.amount(await DBank_backend.getRate());
  update();
  if (document.querySelector(".settingscontainer").style.display == "flex") {
    document.querySelector(".settings").style.transform = "";
    document.querySelector(".settingscontainer").style.animation = "fade_out_show 0.5s";
    await sleep(500);
    DBank_backend.updateRate(isNaN(parseFloat(document.getElementById("user-rate").value)) ? parseFloat("0.00") : parseFloat(document.getElementById("user-rate").value));
    update();
    document.getElementById("user-rate").value = "";
    document.querySelector(".settingscontainer").style.display = "none";
  }
  else {
    document.querySelector(".settings").style.transform = "rotate(-90deg)";
    document.querySelector(".settingscontainer").style.animation = "fade_in_show 0.5s";
    document.querySelector(".settingscontainer").style.display = "flex";
    document.querySelector("#user-rate").value = await DBank_backend.getRate();
  }
});

document.querySelector(".refresh").addEventListener("click", async function () {
  document.querySelector(".refresh").style.pointerEvents="none";
  document.querySelector(".refresh").classList.add("fa-spin");
  DBank_backend.amount(await DBank_backend.getRate());
  update();
  document.querySelector(".refresh").classList.remove("fa-spin");
  document.querySelector(".refresh").style.removeProperty('pointer-events');

});

document.getElementById("toggle").addEventListener("change", function () {
  togg();
  if (document.getElementById("user-amount").value.length != 0) {
    document.querySelector("#submit-btn").value = document.querySelector("#submit-btn").value+" $"+document.getElementById("user-amount").value;
  }
});


document.getElementById("user-amount").addEventListener("input", function () {
  if (document.getElementById("user-amount").value >= 0) {
    if (document.querySelector("#submit-btn").value.includes("$")) {
      document.querySelector("#submit-btn").value = document.querySelector("#submit-btn").value.split("$")[0] + "$" + document.getElementById("user-amount").value;
    }
    else {
      document.querySelector("#submit-btn").value = document.querySelector("#submit-btn").value + " $" + document.getElementById("user-amount").value;
    }
  }
    if (document.getElementById("user-amount").value.length == 0) {
      document.querySelector("#submit-btn").value = document.querySelector("#submit-btn").value.split(" $")[0];
    }
});

// document.getElementById("user-rate").addEventListener("input", function () { 
//   DBank_backend.updateRate(parseFloat(document.getElementById("user-rate").value));
//   update();
// });

document.querySelector("#user-amount").onkeypress = function (event) {
  var charCode = (event.which) ? event.which : event.keyCode;
  if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
    return false;
  return true;
};

document.querySelector("#user-rate").onkeypress = function (event) {
  var charCode = (event.which) ? event.which : event.keyCode;
  if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
    return false;
  return true;
};


document.querySelector("form").addEventListener("submit", async function (event) {
  event.preventDefault();
  event.target.querySelector("#submit-btn").setAttribute("disabled", true);
  event.target.querySelector("#submit-btn").style.display="None";
  event.target.querySelector(".spinner").style.display = "block";
  DBank_backend.amount(await DBank_backend.getRate());
  update();
  if (document.getElementById("toggle").checked) {
    if (document.getElementById("user-amount").value.length != 0) {
      await DBank_backend.withdraw(parseFloat(document.getElementById("user-amount").value));
    }
  }
  else {
    if (document.getElementById("user-amount").value.length != 0) {
      await DBank_backend.deposit(parseFloat(document.getElementById("user-amount").value));
    }
  }
  event.target.querySelector("#submit-btn").removeAttribute("disabled");
  event.target.querySelector(".spinner").style.display = "None";
  togg();
  event.target.querySelector("#submit-btn").style.display="block";
  update();
  document.querySelector("form").reset();
});

async function update() {
  document.getElementById("value").innerText = Math.round(await DBank_backend.checkBal() * 100) / 100;
  document.querySelector(".rate-title").innerText = "Interest Rate: " + await DBank_backend.getRate() + "%";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function togg() {
  if (document.getElementById("toggle").checked) {
    document.querySelector(".depwit_title").innerText = "Withdraw Here";
    document.querySelector("#user-amount").placeholder = "Enter amount to Withdraw";
    document.querySelector("#submit-btn").value = "Click To Withdraw";
  }
  else {
    document.querySelector(".depwit_title").innerText = "Deposit Here";
    document.querySelector("#user-amount").placeholder = "Enter amount to Deposit";
    document.querySelector("#submit-btn").value = "Click To Deposit";
  }
}