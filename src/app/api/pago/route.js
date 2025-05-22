import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();

    // Realiza una solicitud POST a la API externa con los datos recibidos
    const res = await axios.post('https://6pgfz886ie.execute-api.us-east-1.amazonaws.com/pago/pago', body);

    // Devuelve la respuesta de la API externa
    return NextResponse.json(res.data);
  } catch (error) {
    // Maneja cualquier error que ocurra durante la solicitud
    console.error('Error al consumir la API externa:', error);
    return NextResponse.json({ message: 'Error al consumir la API externa' }, { status: 500 });
  }
}
