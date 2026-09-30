import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const API_URL = 'https://jsonplaceholder.typicode.com'
const SESSION_KEY = 'caderno-session'
const CHANGES_KEY = 'caderno-post-changes'
const DEMO_PASSWORD = 'autor123'

export type Author = { id: number; name: string; username: string; email: string; website: string }
export type Post = { id: number | string; userId: number; title: string; body: string }
type Changes = { posts: Post[]; deletedIds: Array<number | string> }
type BlogState = {
  posts: Post[]
  authors: Author[]
  author: Author | null
  loading: boolean
  error: string
  reload: () => void
  login: (email: string, password: string) => boolean
  logout: () => void
  savePost: (title: string, body: string, post?: Post) => Promise<void>
  deletePost: (post: Post) => Promise<void>
}

const BlogContext = createContext<BlogState | null>(null)

function readChanges(): Changes {
  try {
    const saved = localStorage.getItem(CHANGES_KEY)
    return saved ? JSON.parse(saved) as Changes : { posts: [], deletedIds: [] }
  } catch {
    return { posts: [], deletedIds: [] }
  }
}

export function useBlog() {
  const value = useContext(BlogContext)
  if (!value) throw new Error('useBlog precisa estar dentro do BlogProvider')
  return value
}

export function BlogProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [author, setAuthor] = useState<Author | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY)
      return saved ? JSON.parse(saved) as Author : null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    Promise.all([
      fetch(`${API_URL}/posts`).then((response) => {
        if (!response.ok) throw new Error('Falha ao carregar posts')
        return response.json() as Promise<Post[]>
      }),
      fetch(`${API_URL}/users`).then((response) => {
        if (!response.ok) throw new Error('Falha ao carregar autores')
        return response.json() as Promise<Author[]>
      }),
    ]).then(([remotePosts, remoteAuthors]) => {
      if (!active) return
      const changes = readChanges()
      const deleted = new Set(changes.deletedIds.map(String))
      const overrides = new Map(changes.posts.map((post) => [String(post.id), post]))
      const merged = remotePosts.filter((post) => !deleted.has(String(post.id))).map((post) => overrides.get(String(post.id)) ?? post)
      const remoteIds = new Set(remotePosts.map((post) => String(post.id)))
      const localPosts = changes.posts.filter((post) => !remoteIds.has(String(post.id)) && !deleted.has(String(post.id)))
      setPosts([...localPosts, ...merged])
      setAuthors(remoteAuthors)
      setLoading(false)
    }).catch(() => {
      if (!active) return
      const changes = readChanges()
      const deleted = new Set(changes.deletedIds.map(String))
      setPosts(changes.posts.filter((post) => !deleted.has(String(post.id))))
      setError('Não foi possível conectar ao JSONPlaceholder. Posts salvos neste navegador continuam disponíveis.')
      setLoading(false)
    })
    return () => { active = false }
  }, [reloadKey])

  function login(email: string, password: string) {
    const match = authors.find((item) => item.email.toLowerCase() === email.trim().toLowerCase())
    if (!match || password !== DEMO_PASSWORD) return false
    setAuthor(match)
    localStorage.setItem(SESSION_KEY, JSON.stringify(match))
    return true
  }

  function logout() {
    setAuthor(null)
    localStorage.removeItem(SESSION_KEY)
  }

  async function savePost(title: string, body: string, existing?: Post) {
    if (!author) return
    const id = existing?.id ?? `local-${crypto.randomUUID()}`
    const post: Post = { id, userId: author.id, title, body }
    try {
      await fetch(`${API_URL}/posts${existing ? `/${existing.id}` : ''}`, {
        method: existing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })
    } catch {
      // A cópia local mantém o fluxo disponível quando a API de demonstração estiver offline.
    }
    const changes = readChanges()
    const updated: Changes = {
      ...changes,
      posts: [...changes.posts.filter((item) => String(item.id) !== String(id)), post],
      deletedIds: changes.deletedIds.filter((item) => String(item) !== String(id)),
    }
    localStorage.setItem(CHANGES_KEY, JSON.stringify(updated))
    setPosts((current) => [post, ...current.filter((item) => String(item.id) !== String(id))])
  }

  async function deletePost(post: Post) {
    try {
      await fetch(`${API_URL}/posts/${post.id}`, { method: 'DELETE' })
    } catch {
      // A remoção local continua funcionando quando a API de demonstração estiver offline.
    }
    const changes = readChanges()
    const updated: Changes = {
      posts: changes.posts.filter((item) => String(item.id) !== String(post.id)),
      deletedIds: typeof post.id === 'number' ? [...new Set([...changes.deletedIds.map(String), String(post.id)])] : changes.deletedIds,
    }
    localStorage.setItem(CHANGES_KEY, JSON.stringify(updated))
    setPosts((current) => current.filter((item) => String(item.id) !== String(post.id)))
  }

  return <BlogContext.Provider value={{ posts, authors, author, loading, error, reload: () => setReloadKey((key) => key + 1), login, logout, savePost, deletePost }}>{children}</BlogContext.Provider>
}