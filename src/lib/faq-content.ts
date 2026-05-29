export type FaqItem = {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
};

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: "cotizacion",
    question: "¿Cómo solicito una cotización?",
    answer:
      "Escríbenos por WhatsApp con fotos del interior o del vehículo, el modelo y el trabajo que deseas (volante, tablero, asientos, interior completo o compra/venta). Te orientamos con tiempos, materiales y rango de inversión antes de agendar.",
  },
  {
    id: "tiempos",
    question: "¿Cuánto demora un trabajo de tapicería?",
    answer:
      "Depende del alcance: un volante o palanca puede tomar pocos días; interiores completos o tableros suelen requerir más tiempo por secado, pruebas y acabados. Al cotizar te damos un estimado realista según tu vehículo y la disponibilidad del taller.",
  },
  {
    id: "materiales",
    question: "¿Qué materiales utilizan?",
    answer:
      "Trabajamos con cuero, alcántara, vinilos premium y combinaciones personalizadas. Te mostramos muestras y te recomendamos la opción más adecuada según uso diario, estilo y presupuesto.",
  },
  {
    id: "cobertura",
    question: "¿Atienden fuera de Bucaramanga?",
    answer:
      "Nuestro taller está en Bucaramanga y atendemos con frecuencia clientes del área metropolitana: Floridablanca, Girón y Piedecuesta. Para otras ciudades, consúltanos por WhatsApp según el tipo de servicio.",
  },
  {
    id: "vehiculos",
    question: "¿Cómo funciona la compra o venta de vehículos?",
    answer:
      "Publicamos ejemplos del inventario en la web; precio y disponibilidad se confirman contigo por WhatsApp. Si quieres vender tu vehículo, envíanos fotos, kilometraje y datos básicos para evaluarlo y orientarte.",
  },
  {
    id: "precios-web",
    question: "¿Los precios publicados en la web son finales?",
    answer:
      "Los valores mostrados son referenciales. El precio final puede variar según estado del vehículo, negociación, documentación y condiciones acordadas al momento de la compra. Siempre confirmamos contigo antes de cerrar cualquier operación.",
  },
  {
    id: "garantia",
    question: "¿Ofrecen garantía en sus trabajos?",
    answer:
      "Sí. Los trabajos de tapicería cuentan con garantía sobre mano de obra y materiales acordados en la cotización, sujeta a uso normal del vehículo. Te explicamos alcance y plazos al aprobar el servicio.",
  },
  {
    id: "horario",
    question: "¿Cuál es el horario de atención?",
    answer:
      "Atendemos de lunes a sábado, de 8:00 a. m. a 6:00 p. m. Te recomendamos escribir antes de visitarnos para confirmar disponibilidad y evitar esperas.",
  },
] as const;
