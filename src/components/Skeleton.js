import styles from './Skeleton.module.css';

export default function Skeleton() {
  return (
    <div className={styles.skeletonContainer}>
        <div className={styles.skeletonCard}>
            <div className={styles.skeletonHeader}></div>
            <div className={styles.skeletonBody}></div>
            <div className={styles.skeletonFooter}></div>
        </div>
    </div>
  );
}