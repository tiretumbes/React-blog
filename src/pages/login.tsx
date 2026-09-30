import { useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

function LoginPage() {
	const [showPassword, setShowPassword] = useState(false)
	const [message, setMessage] = useState('')

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setMessage('A autenticação ainda precisa ser conectada a um serviço seguro.')
	}

	return (
		<main className="login-page">
			<section className="login-layout" aria-labelledby="login-title">
				<aside className="login-aside">
					<Link className="login-back" to="/"><ArrowLeft size={16} /> Voltar ao blog</Link>
					<div className="login-aside-copy">
						<span className="login-monogram">RB</span>
						<p className="login-eyebrow">ESPAÇO DO AUTOR</p>
						<h1>Ideias boas<br />merecem <em>espaço.</em></h1>
						<p>Entre para continuar escrevendo e cuidar dos seus posts.</p>
					</div>
					<span className="login-aside-footer">REACT-BLOG <span>·</span> AUTORES</span>
				</aside>

				<div className="login-form-panel">
					<div className="login-form-heading">
						<span className="login-form-icon"><LockKeyhole size={18} /></span>
						<p className="login-form-kicker">BEM-VINDO DE VOLTA</p>
						<h2 id="login-title">Entrar na sua conta</h2>
						<p>Use seus dados de autor para acessar o painel.</p>
					</div>

					<form className="login-form" onSubmit={handleSubmit}>
						<label htmlFor="login-email">E-mail</label>
						<input id="login-email" name="email" type="email" autoComplete="username" placeholder="voce@exemplo.com" required />

						<label htmlFor="login-password">Senha</label>
						<div className="password-field">
							<input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Digite sua senha" required />
							<button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'} title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>

						<button className="login-submit" type="submit">Entrar <ArrowRight size={17} /></button>
						{message && <p className="login-message" role="status">{message}</p>}
					</form>

					<div className="login-security-note"><ShieldCheck size={16} /><span>A proteção da conta depende de um serviço de autenticação no servidor.</span></div>
				</div>
			</section>
		</main>
	)
}

export default LoginPage
