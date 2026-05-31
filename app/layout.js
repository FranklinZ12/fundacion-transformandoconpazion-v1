import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Fundación Transformando Con Pazión",
    template: "%s | Fundación TCP",
  },
  description:
    "Fundación sin ánimo de lucro que trabaja con jóvenes, hinchas y comunidad en pro de la sana convivencia, formulando proyectos de paz y transformación social en Medellín.",
  keywords: ["fundación", "transformando con pazión", "Medellín", "Guayabal", "jóvenes", "deporte", "comunidad"],
  openGraph: {
    title: "Fundación Transformando Con Pazión",
    description: "Confianza y transformación social — Medellín, Colombia",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} h-full scroll-smooth`} data-scroll-behavior="smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-[#872075] text-white px-4 py-2 rounded"
        >
          Saltar al contenido principal
        </a>
        <Navbar />
        <main id="main-content" className="flex-1 pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

