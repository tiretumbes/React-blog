import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getAuthor, getAuthorPosts, type Author, type Post } from '../api'

function AuthorPage() {
  const { authorId } = useParams()
  const id = Number(authorId)
  const [author, setAuthor] = useState<Author | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    if (!Number.isInteger(id) || id < 1) {
      setError('Autor não encontrado.')
      setLoading(false)
      return () => { active = false }
    }

    Promise.all([getAuthor(id), getAuthorPosts(id)])
      .then(([loadedAuthor, loadedPosts]) => {
        if (!active) return
        setAuthor(loadedAuthor)
        setPosts(loadedPosts)
      })
      .catch(() => {
        if (active) setError('Não foi possível carregar os posts deste autor.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [id])

  if (loading) return <main className="author-page"><p role="status">Carregando autor...</p></main>
  if (error || !author) return <main className="author-page"><p className="error-message" role="alert">{error || 'Autor não encontrado.'}</p><Link to="/">Voltar aos posts</Link></main>

  return (
    <main className="author-page">
      <Link className="back-link" to="/">← Voltar aos posts</Link>
      <h1>Posts de {author.name}</h1>
      <section className="author-post-list" aria-label={`Posts de ${author.name}`}>
        {posts.map((post) => (
          <article className="author-post-card" key={post.id}>
            <h2><Link to={`/posts/${post.id}`}>{post.title}</Link></h2>
            <p>{post.body}</p>
          </article>
        ))}
      </section>
      {!posts.length && <p>Este autor ainda não publicou posts.</p>}
    </main>
  )
}

export default AuthorPage