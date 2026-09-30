import { Link } from 'react-router-dom'

function CriarPostPage() {
	return (
		<main className="page-shell">
			<h1>Criar post</h1>
			<p>Esta é a página de criação de posts.</p>
			<Link to="/">Voltar para a Home</Link>
		</main>
	)
}

export default CriarPostPage
