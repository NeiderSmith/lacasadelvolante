export type TermsSection = {
  readonly id: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly bullets?: readonly string[];
};

export const TERMS_LAST_UPDATED = "29 de mayo de 2026";

export const TERMS_SECTIONS: readonly TermsSection[] = [
  {
    id: "general",
    title: "1. Información general",
    paragraphs: [
      "El sitio web de La Casa del Volante (en adelante, «el Sitio») es operado desde Bucaramanga, Santander, Colombia, y tiene fines informativos y comerciales relacionados con servicios de tapicería automotriz y compra/venta de vehículos.",
      "Al acceder o utilizar el Sitio aceptas estos términos y condiciones. Si no estás de acuerdo, te pedimos no utilizar el Sitio.",
    ],
  },
  {
    id: "servicios",
    title: "2. Servicios de tapicería automotriz",
    paragraphs: [
      "Las descripciones, imágenes y referencias publicadas tienen carácter orientativo. La cotización definitiva, materiales, tiempos de entrega y alcance del trabajo se confirman por WhatsApp o en el taller antes de iniciar el servicio.",
      "El cliente debe entregar información veraz sobre el estado del vehículo. Trabajos adicionales no previstos en la cotización inicial serán informados antes de ejecutarse.",
    ],
  },
  {
    id: "vehiculos",
    title: "3. Compra y venta de vehículos",
    paragraphs: [
      "Los vehículos mostrados en el Sitio pueden cambiar de disponibilidad sin previo aviso. Precios, kilometraje, equipamiento y condiciones finales se validan directamente con nuestro equipo.",
      "La formalización de cualquier operación de compra o venta está sujeta a verificación documental, acuerdo entre las partes y cumplimiento de la normativa colombiana aplicable.",
    ],
  },
  {
    id: "precios",
    title: "4. Precios, pagos y cotizaciones",
    paragraphs: [
      "Salvo indicación expresa, los precios publicados no constituyen oferta vinculante. Nos reservamos el derecho de modificar tarifas, promociones o inventario.",
      "Formas de pago, anticipos y condiciones comerciales se acuerdan caso a caso al confirmar el servicio o la negociación del vehículo.",
    ],
  },
  {
    id: "garantias",
    title: "5. Garantías y reclamaciones",
    paragraphs: [
      "Las garantías sobre trabajos de tapicería se otorgan según lo pactado en cada cotización y no cubren daños por mal uso, intervenciones de terceros, desgaste normal o modificaciones no autorizadas.",
      "Para reclamaciones relacionadas con un servicio contratado, contáctanos por WhatsApp con tu nombre, descripción del caso y evidencia (fotos o videos) dentro de los plazos acordados.",
    ],
  },
  {
    id: "propiedad",
    title: "6. Propiedad intelectual",
    paragraphs: [
      "Textos, logotipos, fotografías, diseños y demás contenidos del Sitio son propiedad de La Casa del Volante o se usan con autorización. Queda prohibida su reproducción, distribución o uso comercial sin consentimiento previo por escrito.",
    ],
  },
  {
    id: "enlaces",
    title: "7. Enlaces externos",
    paragraphs: [
      "El Sitio puede incluir enlaces a plataformas de terceros (por ejemplo, WhatsApp, Instagram, TikTok o Google Maps). No somos responsables del contenido, políticas o prácticas de esos sitios externos.",
    ],
  },
  {
    id: "datos",
    title: "8. Datos personales",
    paragraphs: [
      "La información que nos compartes por WhatsApp, formularios o visitas al taller se utiliza para atender solicitudes, cotizaciones y operaciones comerciales. No vendemos tus datos personales.",
      "Puedes solicitar actualización o eliminación de datos de contacto escribiéndonos por los canales oficiales indicados en el Sitio.",
    ],
  },
  {
    id: "limitacion",
    title: "9. Limitación de responsabilidad",
    paragraphs: [
      "Hacemos esfuerzos razonables para mantener el Sitio actualizado, pero no garantizamos que esté libre de errores, interrupciones o información desactualizada en todo momento.",
      "El uso del Sitio es bajo tu propia responsabilidad. No seremos responsables por daños indirectos derivados del acceso o imposibilidad de acceso al Sitio, salvo disposición legal en contrario.",
    ],
  },
  {
    id: "modificaciones",
    title: "10. Modificaciones",
    paragraphs: [
      "Podemos actualizar estos términos en cualquier momento. La fecha de última actualización se indicará al inicio del documento. El uso continuado del Sitio después de un cambio implica la aceptación de la versión vigente.",
    ],
  },
  {
    id: "ley",
    title: "11. Ley aplicable",
    paragraphs: [
      "Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia se someterá a los tribunales competentes de Bucaramanga, Santander, salvo norma imperativa distinta.",
    ],
  },
  {
    id: "contacto",
    title: "12. Contacto",
    paragraphs: [
      "Para consultas sobre estos términos, escríbenos por WhatsApp o visita nuestro taller en Carrera 25 # 20-61, Bucaramanga, Santander, Colombia.",
    ],
  },
] as const;
