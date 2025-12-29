const { BaseFilmes } = require('./controllers/filmesController');

const sistema = new BaseFilmes();

async function executarSistema() {

	await sistema.carregarUsers();

	sistema.gerarAvaliacoes();

	console.log('Top 3 gêneros do usuário 1:', sistema.top3Generos(8));             //escolher o id
	console.log('Melhores gêneros para indicar:', sistema.melhoresGenerosParaIndicar(8));
	console.log('Filme com maior média:', sistema.analiseDeDados());
	console.log('Usuários mais ativos:', sistema.usersMaisAtivos());
}

executarSistema()