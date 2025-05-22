
import Navigation from '@/components/Navigation';
import styles from './layout.module.css';

export default function ModulosLayout({ children }) {
  return (
    <>
    <div className={styles.container}>
        <Navigation />
        <main className={styles.mainContent}>
          {children}
        </main>
    </div>
    </>
  );
}