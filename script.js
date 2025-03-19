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
