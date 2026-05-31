import CurvedHeader from "@/components/ui/CurvedHeader";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contacto",
  description:
    "Ponte en contacto con la Fundación Transformando Con Pazión. Estamos en Guayabal la Colinita, Medellín.",
};

export default function ContactoPage() {
  return (
    <>
      <CurvedHeader title="Contáctanos" subtitle="Estamos para escucharte" />

      <section className="bg-[#f9fafb] px-4 sm:px-10 md:px-20 py-20">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 items-stretch">
          <ContactInfo />

          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-lg">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
