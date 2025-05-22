// app/components/Footer.js
import Link from 'next/link';

const Footer = () => {
  return (
    <footer style={{ textAlign: 'center', padding: '1rem', background: '#f1f1f1', marginTop: '2rem' }}>
      <p>&copy; {new Date().getFullYear()} Mi Aplicación. Todos los derechos reservados.</p>
      <nav>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={{ display: 'inline', marginRight: '1rem' }}>
            <Link href="/privacy-policy">Política de Privacidad</Link>
          </li>
          <li style={{ display: 'inline', marginRight: '1rem' }}>
            <Link href="/terms-of-service">Términos de Servicio</Link>
          </li>
          <li style={{ display: 'inline', marginRight: '1rem' }}>
            <Link href="/contact">Contacto</Link>
          </li>
        </ul>
      </nav>
      <div>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a> | 
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a> | 
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
    </footer>
  );
};

export default Footer;
