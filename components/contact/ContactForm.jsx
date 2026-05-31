"use client";

import { Formik, Field, Form, ErrorMessage } from "formik";
import { toast, ToastContainer } from "react-toastify";
import emailjs from "@emailjs/browser";
import { contactSchema } from "@/lib/validation";
import "react-toastify/dist/ReactToastify.css";

const initialValues = {
  nombre: "",
  correo: "",
  telefono: "",
  asunto: "",
  mensaje: "",
};

const inputClass =
  "w-full rounded-xl py-3 px-4 text-gray-800 text-sm bg-gray-50 border border-gray-200 outline-none focus:border-[#872075] focus:ring-2 focus:ring-[#872075]/20 transition placeholder-gray-400";

const fields = [
  { name: "nombre",   type: "text",  label: "Nombre completo",   placeholder: "¿Cómo te llamas?" },
  { name: "correo",   type: "email", label: "Correo electrónico", placeholder: "tucorreo@ejemplo.com" },
  { name: "telefono", type: "tel",   label: "Teléfono",           placeholder: "+57 300 000 0000" },
  { name: "asunto",   type: "text",  label: "Asunto",             placeholder: "¿En qué te podemos ayudar?" },
];

export default function ContactForm() {
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        {
          subject: values.asunto,
          from_name: values.nombre,
          user_email: values.correo,
          phone_number: values.telefono,
          message: values.mensaje,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );
      if (result.text === "OK") {
        toast.success("¡Gracias por enviar tu mensaje!", { position: "bottom-center", autoClose: 2000 });
        resetForm();
      }
    } catch {
      toast.error("Ocurrió algún error. Intenta de nuevo.", { position: "bottom-center", autoClose: 2000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900">Envíanos un mensaje</h2>
        <p className="mt-1 text-sm text-gray-500">Te respondemos en menos de 24 horas.</p>
      </div>

      <Formik initialValues={initialValues} validationSchema={contactSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {fields.map((f) => (
                <div key={f.name}>
                  <label htmlFor={f.name} className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                    {f.label}
                  </label>
                  <Field
                    id={f.name}
                    name={f.name}
                    type={f.type}
                    placeholder={f.placeholder}
                    className={inputClass}
                  />
                  <ErrorMessage name={f.name} component="small" className="error-message" />
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="mensaje" className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                Mensaje
              </label>
              <Field
                id="mensaje"
                name="mensaje"
                as="textarea"
                rows={5}
                placeholder="Cuéntanos cómo podemos ayudarte..."
                className={`${inputClass} resize-none`}
              />
              <ErrorMessage name="mensaje" component="small" className="error-message" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn bg-[#872075] hover:bg-[#6a195b] text-white border-none text-base font-bold py-3 rounded-xl disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner loading-sm" />
                  Enviando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-paper-plane" aria-hidden="true" />
                  Enviar mensaje
                </span>
              )}
            </button>
          </Form>
        )}
      </Formik>
      <ToastContainer position="bottom-center" autoClose={2000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
    </>
  );
}
