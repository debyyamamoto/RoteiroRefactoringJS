const { readFileSync } = require('fs');

function getPeca(apresentacao, pecas) {
    return pecas[apresentacao.id];
}

function calcularTotalPeca(apre, pecas) {
    let total = 0;
    const peca = getPeca(apre, pecas);
    switch (peca.tipo) {
        case "tragedia":
            total = 40000;
            if (apre.audiencia > 30) {
                total += 1000 * (apre.audiencia - 30);
            }
            break;
        case "comedia":
            total = 30000;
            if (apre.audiencia > 20) {
                total += 10000 + 500 * (apre.audiencia - 20);
            }
            total += 300 * apre.audiencia;
            break;
        default:
            throw new Error(`Peça desconhecida: ${peca.tipo}`);
    }
    return total;
}

function calcularCredito(apre, pecas) {
    let creditos = 0;
    const peca = getPeca(apre, pecas);
    creditos += Math.max(apre.audiencia - 30, 0);
    if (peca.tipo === "comedia") {
        creditos += Math.floor(apre.audiencia / 5);
    }
    return creditos;
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2
    }).format(valor / 100);
}

function calcularTotalFatura(fatura, pecas) {
    return fatura.apresentacoes
        .reduce((total, apre) => total + calcularTotalPeca(apre, pecas), 0);
}

function calcularTotalCreditos(fatura, pecas) {
    return fatura.apresentacoes
        .reduce((total, apre) => total + calcularCredito(apre, pecas), 0);
}

function gerarFaturaStr(fatura, pecas) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
        faturaStr += `  ${getPeca(apre, pecas).nome}: ${formatarMoeda(calcularTotalPeca(apre, pecas))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calcularTotalFatura(fatura, pecas))}\n`;
    faturaStr += `Créditos acumulados: ${calcularTotalCreditos(fatura, pecas)} \n`;
    return faturaStr;
}

const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const faturaStr = gerarFaturaStr(faturas, pecas);
console.log(faturaStr);
