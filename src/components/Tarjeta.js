import { useState, forwardRef } from 'react';
import styles from './Tarjeta.module.css';
import Modal from './Modal';

const Tarjeta = forwardRef(({ id, inicia, colaborador, cliente, duracion, fin, costo, onCloseModal }, ref) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (onCloseModal) {
      onCloseModal(); // Llama a la función de cierre del modal en el componente padre
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.turnoId}>ID: {id}</span>
      </div>
      <div className={styles.details}>
        <p><strong>Hora de inicio:</strong> {inicia}</p>
        <p><strong>Cliente:</strong> {cliente}</p>
        <p><strong>Colaborador:</strong> {colaborador}</p>
        <p><strong>Duración:</strong> {duracion}</p>
        <p><strong>Hora de finalización:</strong> {fin}</p>
        <p><strong>Costo:</strong> ${costo}</p>
      </div>
      <div className={styles.footer}>
        <button className={styles.cobrarButton} onClick={handleOpenModal} ref={ref}>
          Cobrar
        </button>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} turnoId={id} nombreCliente={cliente} nombreColaborador={colaborador} fechaHoraTurno={inicia}/>
      </div>
    </div>
  );
});

export default Tarjeta;