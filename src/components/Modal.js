import styles from './Modal.module.css';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function Modal({ isOpen, onClose, turnoId, nombreCliente, nombreColaborador, fechaHoraTurno }) {
  const [data, setData] = useState([]);
  const [anticipo, setAnticipo] = useState(0); // Estado separado para el anticipo
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [metodoPago, setMetodoPago] = useState('1');
  const [spa, setSpa] = useState(null);
  const [cajero, setCajero] = useState(null);
  const [logo, setLogo] = useState(null);
  const [idusuario, setIDusuario] = useState(null);

  const metodoPagoMap = {
    '1': 'Efectivo',
    '2': 'Tarjeta de Crédito/Débito',
    '3': 'Transferencia Bancaria',
    '4': 'Nequi',
    '5': 'Daviplata',
    '6': 'Bono',
    '7': 'Garantia'
  };


  useEffect(() => {
    const imagen = localStorage.getItem('Logo');
    setLogo(imagen);
    const spaname = localStorage.getItem('Spa');
    setSpa(spaname);
    const iduser = localStorage.getItem('ID_User');
    setIDusuario(iduser);
    const ncajero = localStorage.getItem('User');
    setCajero(ncajero);
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: 'Datos_Turno',
            p: [turnoId],
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();

        // Extrae el anticipo del primer elemento sin eliminarlo
        if (result.length > 0) {
          setAnticipo(result[0].Anticipo);
        }
        setData(result); // Mantiene todos los elementos en data

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, turnoId]);

  if (!isOpen) return null;

  // Maneja la actualización de los valores de los servicios
  const handleServiceChange = (index, value) => {
    const updatedData = [...data];
    updatedData[index].Precio = parseFloat(value);
    setData(updatedData);
  };

  // Maneja la actualización del valor del anticipo
  const handleAnticipoChange = (value) => {
    setAnticipo(parseFloat(value));
  };

  const playSound = () => {
    const audio = new Audio('/sounds/exito.mp3'); // Ruta del archivo de sonido
    audio.play();
  };

  // Calcula el total restando el anticipo de la suma de los precios de los servicios
  const total = data.reduce((acc, servicio) => acc + servicio.Precio, 0) - anticipo;

  const handleConfirm = async () => {
    const observacion = document.getElementById('observacion').value;

const printContent = `
      <html>
<head>
  <style>
    @page {
      size: auto;
      margin: -6;
    }
    .printable {
        width: 52mm; /* Para impresoras de 58mm */
        max-width: 100%;
        margin: 0 auto;
        padding: 5px; /* Evita que el contenido toque los bordes */
        font-family: Arial, sans-serif;
        font-size: 12px; /* Tamaño de texto más grande sin cortar */
        text-align: left;
        word-wrap: break-word;
    }
    .header {
      margin-bottom: 3px;
      text-align: center;
      font-size: 12px;
    }
    .title {
      font-size: 14px; /* Ajusta el tamaño del título */
      margin-bottom: 5px;
    }
    .businessInfo {
      margin-top: 10px;
      text-align: center;
    }
    .businessLogo {
      max-width: 50px;
      height: auto;
    }
    .businessName {
      font-size: 12px;
      font-weight: bold;
    }
    .clientInfo {
      margin-top: 1px;
      text-align: left;
    }
    .clientInfo p {
  margin: 2px 0; /* Reduce el espacio vertical */
  line-height: 1.5; /* Ajusta la altura de línea */
  }
    .smallText {
      font-size: 10px;
    }
    .services {
      margin-top: 10px;
    }
    .serviceTable {
      width: 100%;
      border-collapse: collapse;
    }
    .serviceTable th,
    .serviceTable td {
      border: 1px solid #ddd;
      padding: 2px 0;
      font-size: 10px;
    }
    .serviceTable th {
      background-color: #f4f4f4;
      text-align: left; /* Alinea los nombres a la izquierda */
    }
    .align-right {
      text-align: right; /* Alinea los valores a la derecha */
    }
    .align-left {
      text-align: left;
    }
    .totalRow {
      font-weight: bold;
    }
    .footer {
      text-align: center;
      margin-top: 2px;
      font-size: 10px;
    }
  </style>
</head>
<body>
  <div class="printable">
    <div class="header">
      <h1 class="title">Recibo de Pago</h1>
      <div class="businessInfo">
        <img src="/images/${logo}" class="businessLogo" alt="Logo del Negocio">
        <p class="businessName">${spa}</p>
      </div>
      <div class="clientInfo">
        <p class="smallText"><strong>ID:</strong> ${turnoId}</p>
        <p class="smallText"><strong>Cajero:</strong> ${cajero}</p>
        <p class="smallText"><strong>Cliente:</strong> ${nombreCliente}</p>
        <p class="smallText"><strong>Colaborador:</strong> ${nombreColaborador}</p>
        <p class="smallText"><strong>Fecha del Turno:</strong> ${fechaHoraTurno}</p>
        <p class="smallText"><strong>Método de Pago:</strong> ${metodoPagoMap[metodoPago]}</p>
      </div>
    </div>

    <div class="services">
      <h2>Servicios</h2>
      <table class="serviceTable">
        <thead>
          <tr>
            <th>Servicio</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="align-left">Anticipo</td>
            <td class="align-right">-$${anticipo}</td>
          </tr>
          ${data.map(servicio => `
            <tr>
              <td class="align-left">${servicio.Nombre}</td>
              <td class="align-right">$${servicio.Precio}</td>
            </tr>
          `).join('')}
          <tr class="totalRow">
            <td>Total</td>
            <td class="align-right">$${total}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="footer">
      <p>¡Gracias por preferirnos! ❤</p>
      <p>${new Date().toLocaleString()}</p> <!-- Hora actual -->
      <img src="/images/Logo.png" class="businessLogo">
      <p>www.turnails.com</p>
    </div>
  </div>
</body>
</html>
    `;

    const fetchDatos = async () => {
      try {
        const response = await fetch('/api/pago', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            p: [turnoId,total,idusuario,metodoPago,observacion],
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Recibo</title>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
    
    await fetchDatos();
    toast.success('Pago registrado exitosamente.');
    playSound();
    // Lógica para manejar la confirmación del pago
    //console.log('Pago confirmado');
    onClose(); // Cierra el modal después de confirmar
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>x</button>
        <h2>Confirmar Cobro</h2>
        <p>ID del turno: {turnoId}</p>
        
        <form className={styles.paymentForm}>
          <div className={styles.servicesList}>
            <div className={styles.serviceItem}>
              <span>Anticipo</span>
              <input
                type="number"
                value={anticipo}
                onChange={(e) => handleAnticipoChange(e.target.value)}
                className={styles.serviceInput}
              />
            </div>
            {data.map((servicio, index) => (
              <div key={index} className={styles.serviceItem}>
                <span>{servicio.Nombre}</span>
                <input
                  type="number"
                  value={servicio.Precio}
                  onChange={(e) => handleServiceChange(index, e.target.value)}
                  className={styles.serviceInput}
                />
              </div>
            ))}
            <div className={styles.total}>
              <strong>Total: ${total}</strong>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="metodoPago">Método de Pago:</label>
            <select   id="metodoPago" 
                name="metodoPago"
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className={styles.serviceInput}>
              <option value="1">Efectivo</option>
              <option value="2">Tarjeta de Crédito/Débito</option>
              <option value="3">Transferencia Bancaria</option>
              <option value="4">Nequi</option>
              <option value="5">Daviplata</option>
              <option value="6">Bono</option>
              <option value="7">Garantia</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="observacion">Observación:</label>
            <textarea id="observacion" name="observacion" rows="3"></textarea>
          </div>

          <button type="button" onClick={handleConfirm} className={styles.confirmButton}>Confirmar</button>
        </form>
      </div>    
    </div>
  );
}