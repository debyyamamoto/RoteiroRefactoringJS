const { readFileSync } = require('fs');
class Repositorio{
  constructor() {
    this.pecas = JSON.parse(readFileSync('./pecas.json'));
  }

  getPeca(apre) {
    return this.pecas[apre.id];
  }

}
class ServicoCalculoFatura{
  constructor(repo) {
    this.repo = repo;
  }
  calcularCredito(apre) {
    let creditos = 0;
    creditos += Math.max(apre.audiencia - 30, 0);
    if (this.repo.getPeca(apre).tipo === "comedia") {
        creditos += Math.floor(apre.audiencia / 5);
    }
    return creditos;
  }
  calcularTotalCreditos(fatura) {
    return fatura.apresentacoes
        .reduce((total, apre) => total + this.calcularCredito(apre), 0);
  }
  calcularTotalFatura(fatura) {
    return fatura.apresentacoes
        .reduce((total, apre) => total + this.calcularTotalPeca(apre), 0);
  }
  calcularTotalPeca(apre) {
    let total = 0;
    switch (this.repo.getPeca(apre).tipo) {
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

function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2
    }).format(valor / 100);
}


function gerarFaturaStr(fatura, calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
        faturaStr += `  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalPeca(apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura)} \n`;
    return faturaStr;
}

function gerarFaturaHTML(fatura, pecas){
  let faturaHTML = `<html>\n<p>Fatura ${fatura.cliente}</p>\n<ul>\n`;
  for (let apre of fatura.apresentacoes) {
      faturaHTML += `<li>${getPeca(apre).nome}: ${formatarMoeda(calcularTotalPeca(apre, pecas))} (${apre.audiencia} assentos)</li>\n`;
  }
  faturaHTML += `</ul>\n<p>Valor total: ${formatarMoeda(calcularTotalFatura(fatura, pecas))}</p>\n`;
  faturaHTML += `<p>Créditos acumulados: ${calcularTotalCreditos(fatura, pecas)}</p>\n</html>`;
  return faturaHTML;
}
const faturas = JSON.parse(readFileSync('./faturas.json'));
const calc = new ServicoCalculoFatura(new Repositorio);

const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);