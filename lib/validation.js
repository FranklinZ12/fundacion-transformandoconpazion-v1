import * as Yup from 'yup';

export const contactSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(3, 'Nombre muy corto')
    .max(30, 'Nombre muy largo')
    .required('El nombre es requerido'),
  correo: Yup.string()
    .email('Correo inválido')
    .required('El correo es requerido'),
  telefono: Yup.string()
    .min(10, 'Faltan números')
    .max(13, 'Teléfono incorrecto')
    .required('El teléfono es requerido'),
  asunto: Yup.string()
    .min(3, 'Asunto muy corto')
    .max(50, 'Asunto muy largo')
    .required('El asunto es requerido'),
  mensaje: Yup.string()
    .min(4, 'Mensaje muy corto')
    .max(500, 'Máximo 500 caracteres')
    .required('El mensaje es requerido'),
});
