'use client';
import { useState, useEffect, useRef } from 'react';
import Tarjeta from "@/components/Tarjeta";
import Pagination from "@/components/Paginacion";
import Skeleton from '@/components/Skeleton';

export default function RecaudoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);
  const itemsPerPage = 5;
  const inputRef = useRef(null); // Referencia al input
  const cobrarButtonRef = useRef(null);

  const fetchData = async () => {
    const hoy = new Date().toISOString().split('T')[0];
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: 'Turnos_Sede',
          p: [localStorage.getItem('ID_Sede'), hoy],
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCards = Array.isArray(data) && data.length > 0
    ? data.filter(card => {
      if (searchTerm.startsWith('turnailsÑ--pay-')) { // Lee QR
        const id = searchTerm.replace('turnailsÑ--pay-', '').trim();
        return card.ID_Turno == id; // Filtra por ID
      } else {
        return card.Cliente.toLowerCase().includes(searchTerm.toLowerCase()); // Filtra por cliente
      }
    })
    : [];

  useEffect(() => {
    if (filteredCards.length === 1 && searchTerm.startsWith('turnailsÑ--pay-')) {
      setSelectedCard(filteredCards[0]); // Guarda la tarjeta seleccionada
    }
  }, [filteredCards, searchTerm]);

  useEffect(() => {
    if (selectedCard && cobrarButtonRef.current) {
      cobrarButtonRef.current.click(); // Simula el clic en el botón de cobrar
      setSearchTerm(''); // Limpia el input
    }
  }, [selectedCard]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Asegura que el input tenga el foco
    }
  }, []); // Solo se ejecuta al montar el componente

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = selectedCard ? [selectedCard] : filteredCards.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = selectedCard ? 1 : Math.ceil(filteredCards.length / itemsPerPage);

  const handleCloseModal = () => {
    setSelectedCard(null); // Restablece el estado para mostrar todas las tarjetas
    setCurrentPage(1); // Reinicia la página a la primera
    fetchData();
    if (inputRef.current) {
      inputRef.current.focus(); // Vuelve a enfocar el input
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <input
          ref={inputRef} // Asigna la referencia al input
          type="text"
          placeholder="Buscar por cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', width: '50%', maxWidth: '500px' }}
        />
      </div>

      {loading ? (
        <>
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} />
          ))}
        </>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          {currentItems.map((card, index) => (
            <Tarjeta
              key={index}
              id={card.ID_Turno}
              inicia={card.Hora}
              colaborador={card.Colaborador}
              cliente={card.Cliente}
              duracion={card.Tiempo}
              fin={card.Fin}
              costo={card.Precio}
              onCloseModal={handleCloseModal} // Pasa la función de cierre al componente Tarjeta
              ref={selectedCard && card.ID_Turno === selectedCard.ID_Turno ? cobrarButtonRef : null} // Asigna ref solo al elemento seleccionado
            />
          ))}
          {!selectedCard && (
            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          )}
        </>
      )}
    </div>
  );
}