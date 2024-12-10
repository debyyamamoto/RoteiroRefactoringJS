const { formatarMoeda } = require("./util");

function gerarFaturaStr(fatura, calc) {
  let faturaStr = `Fatura ${fatura.cliente}\n`;
  for (let apre of fatura.apresentacoes) {
    faturaStr += `  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalPeca(apre))} (${apre.audiencia} assentos)\n`;
  }
  faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura))}\n`;
  faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura)} \n`;
  return faturaStr;
}

module.exports = gerarFaturaStr;

function gerarFaturaHTML(fatura, pecas){
    let faturaHTML = `<html>\n<p>Fatura ${fatura.cliente}</p>\n<ul>\n`;
    for (let apre of fatura.apresentacoes) {
        faturaHTML += `<li>${getPeca(apre).nome}: ${formatarMoeda(calcularTotalPeca(apre, pecas))} (${apre.audiencia} assentos)</li>\n`;
    }
    faturaHTML += `</ul>\n<p>Valor total: ${formatarMoeda(calcularTotalFatura(fatura, pecas))}</p>\n`;
    faturaHTML += `<p>Créditos acumulados: ${calcularTotalCreditos(fatura, pecas)}</p>\n</html>`;
    return faturaHTML;
  }