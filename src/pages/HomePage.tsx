import '../App.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuthors, getPosts, type Author, type Post } from '../api'

function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([getPosts(), getAuthors()])
      .then(([loadedPosts, loadedAuthors]) => {
        if (!active) return
        setPosts(loadedPosts)
        setAuthors(loadedAuthors)
      })
      .catch(() => {
        if (active) setError('Não foi possível carregar os posts. Tente novamente mais tarde.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [])

  const authorNames = new Map(authors.map((author) => [author.id, author.name]))

  return (
    <main className="home-page">
      <h1>Posts do blog</h1>
      <p className="page-intro">Leia as histórias publicadas pela comunidade.</p>
      {loading && <p role="status">Carregando posts...</p>}
      {error && <p className="error-message" role="alert">{error}</p>}
      <section className="post-list" aria-label="Lista de posts">
        {posts.map((post) => (
          <article className="post-card" key={post.id}>
            <div className="post-content">
              <Link className="post-title" to={`/posts/${post.id}`}><h2>{post.title}</h2></Link>
              <p>{post.body}</p>
            </div>
            <div className="post-author-info">
              <span>Publicado por</span>
              <Link to={`/autores/${post.userId}`}>{authorNames.get(post.userId) ?? `Autor ${post.userId}`}</Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  )

} export default HomePage