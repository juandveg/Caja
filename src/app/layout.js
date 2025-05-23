import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Caja Turnails',
  icons: {
    icon: '/favicon.ico',
  },
  description: 'App de reacudo Turnails',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <main>{children}</main>
        <ToastContainer />
      </body>
    </html>
  );
}
