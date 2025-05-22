// src/components/Sidebar.js
"use client";
import styles from './Navigation.module.css';
import Link from 'next/link';
import { mdiCash100, mdiChartAreaspline, mdiCog, mdiPower } from '@mdi/js';
import Icon from '@mdi/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const Sidebar = () => {
  const pathname = usePathname(); // Obtener la ruta actual
  /*const usuario = localStorage.getItem('User')
  const imagen = localStorage.getItem('Logo')*/

  const [usuario, setUsuario] = useState(null);
  const [spa, setSpa] = useState(null);
  const [imagen, setImagen] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('User');
    setUsuario(user);
    const spaname = localStorage.getItem('Spa');
    setSpa(spaname);
    const image = localStorage.getItem('imgPerfil');
    setImagen(image);
  }, []);

  const handleLogout = () => {
    // Elimina las variables de localStorage y sessionStorage
    localStorage.removeItem('ID_User');
    localStorage.removeItem('ID_Spa');
    localStorage.removeItem('ID_Sede');
    localStorage.removeItem('Logo');
    localStorage.removeItem('User');
    localStorage.removeItem('Spa');
    localStorage.removeItem('imgPerfil');

    // Opcional: Redirige a la página de inicio o a una página de login
    window.location.href = '/'; // Puedes ajustar la URL a la que necesites redirigir
  };

  return (
    <div className={styles.sidebar}>
      {/* Sección de usuario */}
      <div className={styles.userSection}>
        <span className={styles.spaName}>{spa}</span>
        <img 
          src={`/images/${imagen}`}// Reemplaza con la ruta de la imagen del usuario
          alt="User"
          className={styles.userImage}
        />
        <span className={styles.userName}>{usuario}</span>
      </div>
      
      <div className={styles.navContainer}>
        <nav>
          <ul>
            <li className={pathname === '/recaudo' ? styles.active : ''}>
              <Link href="/recaudo">
                <Icon path={mdiCash100} size={1} className={styles.icon} />
                <span className={styles.text}>Recaudo</span>
              </Link>
            </li>
            <li className={pathname === '/reportes' ? styles.active : ''}>
              <Link href="/reportes">
                <Icon path={mdiChartAreaspline} size={1} className={styles.icon} />
                <span className={styles.text}>Reportes</span>
              </Link>
            </li>
            <li className={pathname === '/configuracion' ? styles.active : ''}>
              <Link href="/configuracion">
                <Icon path={mdiCog} size={1} className={styles.icon} />
                <span className={styles.text}>Configuracion</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Opción de cerrar sesión */}
      <div className={styles.logoutContainer}>
      <a href="#" onClick={(e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del enlace
        handleLogout();
      }} className={styles.logout}>
          <Icon path={mdiPower} size={1} className={styles.icon} />
          <span className={styles.text}>Cerrar sesión</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;