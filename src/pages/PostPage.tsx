import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getAuthors, getPost, getPostComments, sendComment, type Author, type Comment, type Post } from '../api'

function PostPage() {
  const { postId } = useParams()
  const id = Number(postId)
  const [post, setPost] = useState<Post | null>(null)
  const [author, setAuthor] = useState<Author | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    if (!Number.isInteger(id) || id < 1) {
      setError('Post não encontrado.')
      setLoading(false)
      return () => { active = false }
    }

    Promise.all([getPost(id), getAuthors(), getPostComments(id)])
      .then(([loadedPost, authors, loadedComments]) => {
        if (!active) return
        setPost(loadedPost)
        setAuthor(authors.find((item) => item.id === loadedPost.userId) ?? null)
        setComments(loadedComments.filter((comment) => comment.approved !== false))
      })
      .catch(() => {
        if (active) setError('Não foi possível carregar este post.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [id])

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!post) return
    const form = event.currentTarget
    const formData = new FormData(form)
    setSending(true)
    setMessage('')
    try {
      await sendComment({
        postId: post.id,
        name: String(formData.get('name')),
        email: String(formData.get('email')),
        body: String(formData.get('body')),
      })
      setMessage('Comentário enviado para aprovação.')
      form.reset()
    } catch {
      setMessage('Não foi possível enviar o comentário. Tente novamente.')
    } finally {
      setSending(false)
    }
  }

  if (loading) return <main className="detail-page"><p role="status">Carregando post...</p></main>
  if (error || !post) return <main className="detail-page"><p className="error-message" role="alert">{error || 'Post não encontrado.'}</p><Link to="/">Voltar aos posts</Link></main>

  return (
    <main className="detail-page">
      <Link className="back-link" to="/">← Voltar aos posts</Link>
      <article className="full-post">
        <div className="post-content">
          <h1>{post.title}</h1>
          <p className="full-post-body">{post.body}</p>
        </div>
        <div className="post-author-info">
          <span>Publicado por</span>
          <Link to={`/autores/${post.userId}`}>{author?.name ?? `Autor ${post.userId}`}</Link>
        </div>
      </article>

      <section className="comments-section">
        <h2>Comentários ({comments.length})</h2>
        {comments.length ? comments.map((comment) => (
          <article className="comment-item" key={comment.id}>
            <h3>{comment.name}</h3>
            <p className="comment-email">{comment.email}</p>
            <p>{comment.body}</p>
          </article>
        )) : <p>Ainda não há comentários aprovados.</p>}
      </section>

      <section className="comment-form-section">
        <h2>Deixe um comentário</h2>
        <form className="comment-form" onSubmit={submitComment}>
          <label htmlFor="comment-name">Nome</label>
          <input id="comment-name" name="name" autoComplete="name" required />
          <label htmlFor="comment-email">E-mail</label>
          <input id="comment-email" name="email" type="email" autoComplete="email" required />
          <label htmlFor="comment-body">Comentário</label>
          <textarea id="comment-body" name="body" rows={4} required />
          <button type="submit" disabled={sending}>{sending ? 'Enviando...' : 'Enviar comentário'}</button>
          {message && <p role="status">{message}</p>}
        </form>
      </section>
    </main>
  )
}

export default PostPage