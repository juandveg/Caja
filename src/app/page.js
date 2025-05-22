"use client";

import Image from "next/image";
import styles from "@/app/page.module.css";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import WebSocketComponent from '@/components/WebSocketComponent';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem('User');
    const idCaja = localStorage.getItem('ID_Caja');

    if (isLoggedIn) {
      // Redirige a la página de inicio de sesión si la variable no existe
      router.push('/recaudo');
      return; // Sale del useEffect para evitar hacer la petición
    }

    if (idCaja) {
      // Si `ID_Caja` ya está en el localStorage, evita hacer la petición
      setData([{ ID_Caja: idCaja}]); // Configura el estado con el valor existente
      setLoading(false); // Termina la carga
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch('/api', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: 'Caja_TraerID',
            p: [],
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        
        if (result[0].ID_Caja !== undefined) {
          setData(result);
          localStorage.setItem('ID_Caja', result[0].ID_Caja);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Termina la carga
      }
    };
    fetchData();
  }, [router]);

  return (
    <div className={styles.container}>
      {error && <p>Error: {error}</p>}
      {loading ? (
        <div className={styles.loader}></div> // Mostrar el loader mientras carga
      ) : (
        data && (
          <div className={styles.qrContainer}>
            <QRCodeSVG
              value={'turnails://caja/' + data[0].ID_Caja}
              size={320}
              fgColor="#000000"
              bgColor="#ffffff"
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "images/Logo.png",      // Ruta al logo (debe ser accesible públicamente)
                x: undefined,
                y: undefined,
                height: 55,
                width: 55,
                excavate: true,        // Hace que se vea bien el logo
              }}
            />
            <p>Escanea el QR desde la App Turnails para registrar la caja</p>
            <WebSocketComponent data={data[0].ID_Caja}/>
          </div>
        )
      )}
    </div>
  );
}