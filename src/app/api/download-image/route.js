import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import axios from 'axios';
import { createWriteStream } from 'fs';

export async function POST(request) {
  try {
    const { strURL, directorio, nombre } = await request.json();

    // Definir directorios
    const tempDir = path.resolve('./temp'); // O el directorio temporal que prefieras
    const outputDir = path.resolve(directorio);

    // Crear directorio temporal si no existe
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const outputFilePath = path.join(outputDir, nombre);

    // Verificar si la imagen ya existe
    if (fs.existsSync(outputFilePath)) {
      console.log('La imagen ya existe, no se descargará nuevamente.');
      return NextResponse.json({ success: true, message: 'La imagen ya existe.' });
    }

    // Descargar la imagen
    const response = await axios({
      url: strURL,
      responseType: 'stream',
    });

    const tempFilePath = path.join(tempDir, nombre);

    const writer = createWriteStream(tempFilePath);

    response.data.pipe(writer);

    // Esperar a que la descarga termine completamente
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Procesar la imagen (aquí solo se copia como ejemplo)
    fs.copyFileSync(tempFilePath, outputFilePath);

    // Eliminar archivo temporal
    fs.unlinkSync(tempFilePath);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error downloading image:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}