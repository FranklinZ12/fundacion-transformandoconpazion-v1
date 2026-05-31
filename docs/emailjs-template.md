# Plantilla EmailJS — Formulario de Contacto

## Cómo crear la plantilla en emailjs.com

1. Inicia sesión en [emailjs.com](https://www.emailjs.com)
2. Ve a **Email Templates** → **Create New Template**
3. Copia el contenido de abajo en los campos correspondientes
4. Guarda y copia el **Template ID** en tu `.env.local`

---

## Campo: Subject (Asunto del email)

```
Nuevo mensaje de contacto: {{subject}}
```

---

## Campo: Content — Code Editor (HTML)

Pega este HTML directamente en el editor de código de EmailJS:

```html
<div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #111827; max-width: 600px; margin: 0 auto;">

  <!-- Header -->
  <div style="background-color: #872075; border-radius: 8px 8px 0 0; padding: 24px 32px;">
    <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">
      Fundación Transformando Con Pazión
    </h1>
    <p style="margin: 4px 0 0; color: #f3d0ee; font-size: 13px;">
      Nuevo mensaje desde el formulario de contacto
    </p>
  </div>

  <!-- Body -->
  <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; padding: 32px;">

    <p style="margin: 0 0 24px; color: #374151; font-size: 14px;">
      Hola equipo TCP, has recibido un nuevo mensaje. Aquí están los detalles:
    </p>

    <!-- Info table -->
    <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr>
        <td style="padding: 10px 14px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 6px 6px 0 0; width: 120px;">
          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #872075;">Nombre</span>
        </td>
        <td style="padding: 10px 14px; background-color: #ffffff; border: 1px solid #e5e7eb; border-left: none; border-radius: 0 6px 0 0;">
          <span style="font-size: 14px; color: #111827;">{{from_name}}</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; background-color: #faf5fd; border: 1px solid #e5e7eb; border-top: none;">
          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #872075;">Email</span>
        </td>
        <td style="padding: 10px 14px; background-color: #faf5fd; border: 1px solid #e5e7eb; border-top: none; border-left: none;">
          <a href="mailto:{{user_email}}" style="color: #872075; text-decoration: none;">{{user_email}}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none;">
          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #872075;">Teléfono</span>
        </td>
        <td style="padding: 10px 14px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-left: none;">
          <span style="font-size: 14px; color: #111827;">{{phone_number}}</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 14px; background-color: #faf5fd; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 0 6px;">
          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #872075;">Asunto</span>
        </td>
        <td style="padding: 10px 14px; background-color: #faf5fd; border: 1px solid #e5e7eb; border-top: none; border-left: none; border-radius: 0 0 6px 0;">
          <span style="font-size: 14px; color: #111827;">{{subject}}</span>
        </td>
      </tr>
    </table>

    <!-- Message -->
    <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-left: 4px solid #872075; border-radius: 6px; padding: 20px 24px;">
      <p style="margin: 0 0 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #872075;">
        Mensaje
      </p>
      <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.7; white-space: pre-wrap;">{{message}}</p>
    </div>

    <!-- Reply CTA -->
    <div style="margin-top: 28px; text-align: center;">
      <a href="mailto:{{user_email}}"
        style="display: inline-block; background-color: #872075; color: #ffffff; text-decoration: none;
               font-size: 14px; font-weight: 600; padding: 12px 28px; border-radius: 8px;">
        Responder a {{from_name}}
      </a>
    </div>

  </div>

  <!-- Footer -->
  <p style="margin: 16px 0 0; text-align: center; font-size: 11px; color: #9ca3af;">
    Este mensaje fue enviado desde el formulario de contacto de fundaciontcp.com
  </p>

</div>
```

---

## Campo: Reply To

```
{{user_email}}
```

> Esto permite que al darle "Responder" en tu correo, el mensaje vaya directo al remitente.

---

## Variables requeridas

| Variable         | Origen en el formulario |
|-----------------|------------------------|
| `{{from_name}}` | Campo "Tu Nombre"       |
| `{{user_email}}`| Campo "Tu Email"        |
| `{{phone_number}}`| Campo "Teléfono"      |
| `{{subject}}`   | Campo "Asunto"          |
| `{{message}}`   | Campo "Tu mensaje"      |

---

## Configuración en `.env.local`

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

### Dónde encontrar cada valor

| Variable | Ruta en EmailJS |
|----------|----------------|
| `SERVICE_ID` | Email Services → ID del servicio |
| `TEMPLATE_ID` | Email Templates → ID de la plantilla |
| `PUBLIC_KEY` | Account → API Keys → Public Key |
