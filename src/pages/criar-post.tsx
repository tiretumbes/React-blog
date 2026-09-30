import { useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { createPost } from '../api'

function CriarPostPage() {
	const [title, setTitle] = useState('')
	const [body, setBody] = useState('')
	const [saving, setSaving] = useState(false)
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setSaving(true)
		setMessage('')
		setError('')

		try {
			await createPost({ userId: 1, title: title.trim(), body: body.trim() })
			setMessage('Post enviado. O JSONPlaceholder simula o envio, mas não persiste o post.')
			setTitle('')
			setBody('')
		} catch {
			setError('Não foi possível enviar o post. Verifique sua conexão e tente novamente.')
		} finally {
			setSaving(false)
		}
	}

	return (
		<main className="create-post-page">
			<section className="create-post-panel" aria-labelledby="create-post-title">
				<Link className="create-post-back" to="/"><ArrowLeft size={16} /> Voltar aos posts</Link>
				<div className="create-post-heading">
					<p className="create-post-kicker">ESPAÇO DO AUTOR</p>
					<h1 id="create-post-title">Criar post</h1>
					<p>Organize sua ideia em um título e algumas palavras.</p>
				</div>

				<form className="create-post-form" onSubmit={handleSubmit}>
					<div className="create-post-field-heading">
						<label htmlFor="new-post-title">Título</label>
						<span>{title.length}/120</span>
					</div>
					<input id="new-post-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} placeholder="Escreva o título do post" required />

					<div className="create-post-field-heading create-post-body-label">
						<label htmlFor="new-post-body">Conteúdo</label>
						<span>{body.length}/5000</span>
					</div>
					<textarea id="new-post-body" value={body} onChange={(event) => setBody(event.target.value)} maxLength={5000} rows={10} placeholder="Desenvolva sua ideia..." required />

					<div className="create-post-footer">
						<span className="demo-author">Autor de demonstração · userId 1</span>
						<button type="submit" disabled={saving}>{saving ? 'Enviando...' : <>Publicar post <ArrowRight size={17} /></>}</button>
					</div>
					{message && <p className="create-post-message" role="status"><Check size={16} /> {message}</p>}
					{error && <p className="create-post-error" role="alert">{error}</p>}
				</form>
			</section>
		</main>
	)
}

export default CriarPostPage
