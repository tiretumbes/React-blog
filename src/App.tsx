
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PostPage from './pages/PostPage'
import AuthorPage from './pages/AuthorPage'
import LoginPage from './pages/login'
import CriarPostPage from './pages/criar-post'
import './App.css'

function App() {
	return (
		<BrowserRouter>
			<header className="app-header">
				<nav aria-label="Navegação principal">
					<h1 className="app-title">REACT-BLOG</h1>
					<ul>
						<li><Link to="/">Home</Link></li>
						<li><Link to="/login">Login</Link></li>
						<li><Link to="/criar-post">Criar post</Link></li>
					</ul>
				</nav>
			</header>

			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/posts/:postId" element={<PostPage />} />
				<Route path="/autores/:authorId" element={<AuthorPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/criar-post" element={<CriarPostPage />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App