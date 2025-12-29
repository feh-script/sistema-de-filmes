const buscarUsers = require('../services/apiService')


class BaseFilmes {
	constructor() {
		this.usuarios = new Map();
		this.listaDeFilmes = [
			{ id: 10, titulo: "Filme X", genero: "Drama", ano: 2021, avaliacoes: [] },
			{ id: 12, titulo: "Filme Y", genero: "Aventura", ano: 2019, avaliacoes: [] },
			{ id: 15, titulo: "Filme Z", genero: "Ação", ano: 2020, avaliacoes: [] }
		];
	}

	async carregarUsers() {
		const dataUsers = await buscarUsers()
		dataUsers.forEach(user =>
			this.usuarios.set(user.id, user)
		);
	}

	gerarAvaliacoes() {
		if (this.usuarios.size === 0) {
			console.log('Execute a função carregarUsers() antes de gerar avaliações');
			return;
		}

		const idsUsuarios = Array.from(this.usuarios.keys());

		this.listaDeFilmes.forEach(filme => {
			const quantAvaliacoes = Math.floor(Math.random() * 5) + 1;

			filme.avaliacoes = Array.from({ length: quantAvaliacoes }, () => {
				const userId = idsUsuarios[Math.floor(Math.random() * idsUsuarios.length)];
				const nota = Math.floor(Math.random() * 5) + 1;
				return { userId, nota };
			});
			// console.log(filme.avaliacoes); // Opcional para debugar
		});
	}

	top3Generos(userId) {
		const avaliacoesPorGeneros = new Map();

		this.listaDeFilmes.forEach(filme => {
			filme.avaliacoes.forEach(avaliacao => {
				if (avaliacao.userId === userId) {
					const genero = filme.genero;
					if (!avaliacoesPorGeneros.has(genero)) {
						avaliacoesPorGeneros.set(genero, []);
					}
					avaliacoesPorGeneros.get(genero).push(avaliacao.nota);
				}
			});
		});

		if (avaliacoesPorGeneros.size === 0) {
			console.log('Esse usuário ainda não avaliou nenhum filme');
			return [];
		}

		const mapMediaNotas = new Map();

		avaliacoesPorGeneros.forEach((notas, genero) => {
			const media = notas.reduce((acc, val) => acc + val, 0) / notas.length;
			mapMediaNotas.set(genero, media);
		});

		const ordenado = Array.from(mapMediaNotas.entries())
			.sort((a, b) => b[1] - a[1]);

		return ordenado.slice(0, 3);
	}

	melhoresGenerosParaIndicar(userId) {
		const top3Avaliacoes = this.top3Generos(userId);
		if (top3Avaliacoes.length === 0) return [];

		const generosPreferidos = top3Avaliacoes.map(([genero]) => genero);

		const filmesParaIndicar = [];

		this.listaDeFilmes.forEach(filme => {
			// Verificar se usuário já avaliou este filme
			const jaAvaliou = filme.avaliacoes.some(avaliacao => avaliacao.userId === userId);

			if (!jaAvaliou && generosPreferidos.includes(filme.genero)) {
				filmesParaIndicar.push(filme);
			}
		});

		return filmesParaIndicar.slice(0, 3);
	}

	analiseDeDados() {
		const mediaDosFilmes = new Map();
		let maiorMediaDeFilme = 0;
		let filmeComMaiorMedia = null;

		this.listaDeFilmes.forEach(filme => {
			const arrayNotas = filme.avaliacoes.map(a => a.nota);
			if (arrayNotas.length === 0) return; // evitar divisão por zero

			const somaDoFilme = arrayNotas.reduce((acc, val) => acc + val, 0) / arrayNotas.length;
			mediaDosFilmes.set(filme.titulo, somaDoFilme);

			if (somaDoFilme > maiorMediaDeFilme) {
				maiorMediaDeFilme = somaDoFilme;
				filmeComMaiorMedia = filme.titulo;
			}
		});

		return { filme: filmeComMaiorMedia, media: maiorMediaDeFilme };
	}

	usersMaisAtivos() {
		const contagem = new Map();

		this.listaDeFilmes.forEach(filme => {
			filme.avaliacoes.forEach(({ userId }) => {
				contagem.set(userId, (contagem.get(userId) || 0) + 1);
			});
		});

		const top3 = Array.from(contagem.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3)
			.map(([id, quantidade]) => ({ usuario: this.usuarios.get(id), avaliacoes: quantidade }));

		return top3;
	}
}

module.exports = { BaseFilmes };