const { readFileSync } = require('fs');
class ServicoCalculoFatura{
  calcularCredito(apre, pecas) {
    let creditos = 0;
    const peca = getPeca(apre, pecas);
    creditos += Math.max(apre.audiencia - 30, 0);
    if (peca.tipo === "comedia") {
        creditos += Math.floor(apre.audiencia / 5);
    }
    return creditos;
  }
  calcularTotalCreditos(fatura, pecas) {
    return fatura.apresentacoes
        .reduce((total, apre) => total + this.calcularCredito(apre, pecas), 0);
  }
  calcularTotalFatura(fatura, pecas) {
    return fatura.apresentacoes
        .reduce((total, apre) => total + this.calcularTotalPeca(apre, pecas), 0);
  }
  calcularTotalPeca(apre, pecas) {
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
}

function getPeca(apresentacao, pecas) {
    return pecas[apresentacao.id];
}


function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2
    }).format(valor / 100);
}


function gerarFaturaStr(fatura, pecas, calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
        faturaStr += `  ${getPeca(apre, pecas).nome}: ${formatarMoeda(calc.calcularTotalPeca(apre, pecas))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura, pecas))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura, pecas)} \n`;
    return faturaStr;
}

function gerarFaturaHTML(fatura, pecas){
  let faturaHTML = `<html>\n<p>Fatura ${fatura.cliente}</p>\n<ul>\n`;
  for (let apre of fatura.apresentacoes) {
      faturaHTML += `<li>${getPeca(apre, pecas).nome}: ${formatarMoeda(calcularTotalPeca(apre, pecas))} (${apre.audiencia} assentos)</li>\n`;
  }
  faturaHTML += `</ul>\n<p>Valor total: ${formatarMoeda(calcularTotalFatura(fatura, pecas))}</p>\n`;
  faturaHTML += `<p>Créditos acumulados: ${calcularTotalCreditos(fatura, pecas)}</p>\n</html>`;
  return faturaHTML;
}
const faturas = JSON.parse(readFileSync('./faturas.json'));
const pecas = JSON.parse(readFileSync('./pecas.json'));
const calc = new ServicoCalculoFatura();

const faturaStr = gerarFaturaStr(faturas, pecas, calc);
console.log(faturaStr);