"use strict";

const label_from_currency = document.getElementById('from_currency');
const input_from_ammount = document.getElementById('from_ammount');
const label_to_currency = document.getElementById('to_currency');
const input_to_ammount = document.getElementById('to_ammount');

const tax_info = document.getElementById('tax_info');
const swap = document.getElementById('swap');

label_from_currency.addEventListener('change', calculate);
input_from_ammount.addEventListener('input', calculate);
label_to_currency.addEventListener('change', calculate);
input_to_ammount.addEventListener('input', calculate);
swap.addEventListener('click', infoSwap);

main();
function main() {
    let currency = { "BRL": "Real (BRL)", "EUR": "Euro (EUR)", "USD": "Dólar (USD)" };
    let options = [];
    for (var [key, value] of Object.entries(currency)) {
      options.push(`<option value='${key}'>${value}</option>`);
    }
    label_from_currency.innerHTML = options.join('\n');
    label_to_currency.innerHTML = options.join('\n');
    calculate();
  }
  
  function infoSwap() {
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
  
  async function calculate() {
    let from = label_from_currency.value;
    let to = label_to_currency.value;
    let { rates } = await getURL(`https://api.exchangerate-api.com/v4/latest/${from}`);
    let rate = rates[to];
    tax_info.innerText = `1 ${getInfoSelect(label_from_currency)} = ${rate} ${getInfoSelect(label_to_currency)}`
    input_to_ammount.value = (input_from_ammount.value * rate).toFixed(2);

    document.getElementById('currency1-name').innerHTML = ` ${getInfoSelect(label_from_currency)}`.toUpperCase();
    document.getElementById('currency2-name').innerHTML = ` ${getInfoSelect(label_to_currency)}`.toUpperCase();

    if(label_from_currency.value == "BRL") {
    fetch("https://restcountries.com/v3.1/name/brasil").then((response) => {
      response.json().then((data)=> {
        document.getElementById('img_amount').src = (data[0].flags.png);
      })
    })
    }else if(label_from_currency.value == "EUR") {
      document.getElementById('img_amount').src = 'https://flagcdn.com/eu.svg';
    }else{
      fetch("https://restcountries.com/v3.1/name/United%20States").then((response) => {
        response.json().then((data)=> {
          document.getElementById('img_amount').src = (data[0].flags.png);
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
    //
  }
  const ctx = document.getElementById('graficoCotacao').getContext('2d');
  let graficoCotacao;

async function buscarCotacao() {
    try {
        const resposta = await fetch("https://api.exchangerate-api.com/v4/latest/BRL");
        const dados = await resposta.json();
        return dados.rates.USD; 
    } catch (erro) {
        console.error("Erro ao buscar cotação:", erro);
        return null;
    }
}
async function atualizarGrafico() {
  const cotacao = await buscarCotacao();
  if (!cotacao) return;

  const agora = new Date().toLocaleTimeString();

  if (!graficoCotacao) {
      graficoCotacao = new Chart(ctx, {
          type: 'line',
          data: {
              labels: [agora],
              datasets: [{
                  label: "Cotação BRL/USD",
                  data: [cotacao],
                  borderColor: '#6DC038', /* Linha verde */
                  backgroundColor: 'rgba(109, 192, 56, 0.2)', /* Verde transparente */
                  borderWidth: 2,
                  pointBackgroundColor: '#6DC038'
              }]
          },
          options: {
              plugins: {
                  legend: {
                      labels: { color: '#FFFFFF' } // Texto branco
                  }
              },
              scales: {
                  x: { ticks: { color: '#FFFFFF' } },
                  y: { ticks: { color: '#FFFFFF' } }
              }
          }
      });
  } else {
      graficoCotacao.data.labels.push(agora);
      graficoCotacao.data.datasets[0].data.push(cotacao);

      if (graficoCotacao.data.labels.length > 10) {
          graficoCotacao.data.labels.shift();
          graficoCotacao.data.datasets[0].data.shift();
      }

      graficoCotacao.update();
  }
}

setInterval(atualizarGrafico, 5000);
  