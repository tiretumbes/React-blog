import { ArrowUpRight, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

export function SiteFooter() {
  return <footer className="site-footer"><Link className="brand footer-brand" to="/"><span className="brand-mark"><BookOpen size={17} /></span><span>caderno<span className="brand-period">.</span></span></Link><span>UM LUGAR PARA IDEIAS QUE FICAM.</span><a href="#top" aria-label="Voltar ao topo">VOLTAR AO TOPO <ArrowUpRight size={13} /></a></footer>
}