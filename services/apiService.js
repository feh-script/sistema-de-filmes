async function buscarUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            throw new Error('Erro na requisição');
        }
        return await response.json();
    } catch (erro) {
        console.error('Erro ao carregar usuários:', erro);
        return []
    }

}

module.exports = buscarUsers