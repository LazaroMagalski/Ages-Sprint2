"use strict";

const label_from_currency = document.getElementById('from_currency');
const input_from_ammount = document.getElementById('from_ammount');
const label_to_currency = document.getElementById('to_currency');
const input_to_ammount = document.getElementById('to_ammount');

const tax_info = document.getElementById('tax_info');
const swap = document.getElementById('swap');
//Escutando eventos  com eventListener
label_from_currency.addEventListener('change', calculate);
input_from_ammount.addEventListener('input', calculate);
label_to_currency.addEventListener('change', calculate);
input_to_ammount.addEventListener('input', calculate);
swap.addEventListener('click', infoSwap);

main();
//injetamos via js as opções de cotação
function main() {
    let currency = { "BRL": "Real (BRL)", "EUR": "Euro (EUR)", "USD": "Dólar (USD)" };
    let options = [];
    for (var [key, value] of Object.entries(currency)) {
      options.push(`<option value='${key}'>${value}</option>`);
    }
    label_from_currency.innerHTML = options.join('\n');
    label_to_currency.innerHTML = options.join('\n');
    label_to_currency.value = "USD";
    calculate();
  }
  //realiza a troca de valores
  function infoSwap() {
    event.preventDefault();
    let temp = label_from_currency.value;
    label_from_currency.value = label_to_currency.value;
    label_to_currency.value = temp;
    calculate();
  }
  async function getURL(url) {
    return (await fetch(url)).json();
  }
  async function getImgURL(urlImg) {
    return (await fetch(urlImg)).json();
  }
  
  function getInfoSelect(select) {
    return select.options[select.selectedIndex].text;
  }
  //pega as bandeiras e muda as cores do conversor
  function transform(){
    if(label_from_currency.value == "BRL") {
      fetch("https://restcountries.com/v3.1/name/brasil").then((response) => {
        response.json().then((data)=> {
          document.getElementById('img_amount').src = (data[0].flags.png);
          document.getElementById('logo').src = "convertVerde.png";
          document.body.style.backgroundColor = "#203B2A";
          document.querySelector('h1').style.color = "#6DC038";
          document.getElementById('grid-container').style.boxShadow = "0em 0.8em #6DC038";
        })
      })
      }else if(label_from_currency.value == "EUR") {
        document.getElementById('img_amount').src = 'https://flagcdn.com/eu.svg';
        document.getElementById('logo').src = "convertAzul.png";
        document.body.style.backgroundColor = "#202B3B";
        document.querySelector('h1').style.color = "#5D9CF0";
        document.getElementById('grid-container').style.boxShadow = "0em 0.8em #5D9CF0";
      }else{
        fetch("https://restcountries.com/v3.1/name/United%20States").then((response) => {
          response.json().then((data)=> {
            document.getElementById('img_amount').src = (data[0].flags.png);
            document.getElementById('logo').src = "convertVerm.png";
            document.body.style.backgroundColor = "#461003";
            document.querySelector('h1').style.color = "#FF1A1E";
            document.getElementById('grid-container').style.boxShadow = "0em 0.8em #FF1A1E";
          })
        })
      }
  
      if(label_to_currency.value == "BRL") {
        fetch("https://restcountries.com/v3.1/name/brasil").then((response) => {
          response.json().then((data)=> {
            document.getElementById('img_currency').src = (data[0].flags.png);
          })
        })
      }else if(label_to_currency.value == "EUR") {
        document.getElementById('img_currency').src = 'https://flagcdn.com/eu.svg';
      }else{
        fetch("https://restcountries.com/v3.1/name/United%20States").then((response) => {
          response.json().then((data)=> {
            document.getElementById('img_currency').src = (data[0].flags.png);
          })
        })
      }
  }
  //consulta a api e  converte o valor
  async function calculate() {
    let from = label_from_currency.value;
    let to = label_to_currency.value;
    let { rates } = await getURL(`https://api.exchangerate-api.com/v4/latest/${from}`);
    let rate = rates[to];
    tax_info.innerText = `1 ${getInfoSelect(label_from_currency)} = ${rate} ${getInfoSelect(label_to_currency)}`
    input_to_ammount.value = (input_from_ammount.value * rate).toFixed(2);

    document.getElementById('currency1-name').innerHTML = ` ${getInfoSelect(label_from_currency)}`.toUpperCase();
    document.getElementById('currency2-name').innerHTML = ` ${getInfoSelect(label_to_currency)}`.toUpperCase();

    transform();
    
  }