"use client";
import styles from './Tabla.module.css';
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const ReportTable = () => {
    const [idspa, setidSpa] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
      const id_spa = localStorage.getItem('ID_Spa');
      setidSpa(id_spa);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!idspa) return;

            setLoading(true); // Inicia la carga
            const hoy = new Date().toISOString().split('T')[0];

            try {
                const response = await fetch('/api', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        q: 'Rep_Recaudo_Hoy',
                        p: [idspa,hoy],
                    }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                console.log(result);
                setData(result);

            } catch (err) {
                console.error(err.message);
            } finally {
                setLoading(false); // Finaliza la carga
            }
        };

        fetchData();
    }, [idspa]);

    const totalSum = data.reduce((sum, row) => sum + row.Total, 0);

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet([...data, { Metodo: 'Total', Total: totalSum }]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

        // Generar el archivo Excel
        XLSX.writeFile(workbook, "reporte.xlsx");
    };

    return (
        <div>
            <button className={styles.downloadButton} onClick={downloadExcel}>Descargar Excel</button>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Método</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="2" className={styles.centerAlign}>Cargando datos...</td>
                            </tr>
                        ) : (
                            <>
                                {data.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.Metodo}</td>
                                        <td className={styles.rightAlign}>{row.Total}</td>
                                    </tr>
                                ))}
                                {/* Fila para mostrar la suma total */}
                                <tr>
                                    <td><strong>Total General</strong></td>
                                    <td className={styles.rightAlign}><strong>{totalSum}</strong></td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportTable;