// src/components/WebSocketComponent.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const WebSocketComponent = ({ data }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const ws = new WebSocket('wss://7u2tyhmum5.execute-api.us-east-1.amazonaws.com/production/');
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket Connected');
      ws.send(JSON.stringify({"action": "qr","ID": data}
      ))
    };

    ws.onmessage = (event) => {
      const message = event.data;
      const data = JSON.parse(message);
      const tipo = data.Tipo;
      console.log(message)

      if (tipo === 'Login'){

        const downloadImage = async (strURL, directorio, nombre) => {
          setLoading(true);
          setError(null);
        
          try {
            const response = await fetch('/api/download-image', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                strURL: strURL,
                directorio: directorio,
                nombre: nombre,
              }),
            });
        
            const result = await response.json();
            if (!result.success) {
              throw new Error(result.error || 'Error al descargar la imagen');
            }
        
            //alert('Imagen descargada exitosamente');
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };
        
        // Función para descargar múltiples imágenes
        const downloadMultipleImages = async () => {
          try {
            // Descargar la primera imagen
            await downloadImage('https://imgturnails.s3.amazonaws.com/usuario/' + data.imgPerfil, './public/images', data.imgPerfil);
        
            // Descargar la segunda imagen
            await downloadImage('https://imgturnails.s3.amazonaws.com/spa/' + data.Logo, './public/images', data.Logo);
        
            //alert('Imágenes descargadas exitosamente');
          } catch (error) {
            setError(error.message);
          }
        };
        
        // Llamar a la función de descarga múltiple
        downloadMultipleImages();
        localStorage.setItem('ID_Spa', data.ID_Spa);
        localStorage.setItem('Spa', data.Spa);
        localStorage.setItem('ID_Sede', data.ID_Sede);
        localStorage.setItem('ID_User', data.ID_Usuario);
        localStorage.setItem('User', data.Nombre);
        localStorage.setItem('Logo', data.Logo);
        localStorage.setItem('imgPerfil', data.imgPerfil);
        router.push('/recaudo');
      }
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && inputMessage) {
      socket.send(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div>
    </div>
  );
};

export default WebSocketComponent;
