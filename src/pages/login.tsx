import { Link } from 'react-router-dom'

function LoginPage() {
	return (
		<main className="page-shell">
			<h1>Login</h1>
			<p>Acesse sua conta de autor.</p>
			<Link to="/">Voltar para a Home</Link>
		</main>
	)
}

export default LoginPage
