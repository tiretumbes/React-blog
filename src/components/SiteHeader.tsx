import { useState } from 'react'
import { ArrowUpRight, BookOpen, CircleUserRound, LogOut, Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useBlog } from '../context/BlogContext'

export function SiteHeader() {
  const { author, logout } = useBlog()
  const [menuOpen, setMenuOpen] = useState(false)
  return <header className="site-header"><div className="header-inner">
    <Link className="brand" to="/" aria-label="Caderno, página inicial"><span className="brand-mark"><BookOpen size={19} strokeWidth={2.2} /></span><span>caderno<span className="brand-period">.</span></span></Link>
    <button className="mobile-menu-button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
    <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`}>
      <NavLink to="/" onClick={() => setMenuOpen(false)}>Explorar</NavLink>
      {author ? <><NavLink to="/painel" onClick={() => setMenuOpen(false)}>Meu painel</NavLink><span className="nav-author"><CircleUserRound size={17} /> {author.name.split(' ')[0]}</span><button className="nav-logout" onClick={() => { logout(); setMenuOpen(false) }} aria-label="Sair"><LogOut size={17} /><span>Sair</span></button></> : <Link className="nav-login" to="/login" onClick={() => setMenuOpen(false)}>Área do autor <ArrowUpRight size={15} /></Link>}
    </nav>
  </div></header>
}