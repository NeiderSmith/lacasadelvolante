import { defineStorage } from "@aws-amplify/backend";

/**
 * Objetos públicos de lectura (invitado) para la web; escritura solo ADMINS.
 * Rutas deben terminar en `/*` (requisito de Amplify Storage).
 */
export const storage = defineStorage({
  name: "lcdvRecursos",
  access: (allow) => ({
    "recursos/categoria/*": [
      allow.guest.to(["read"]),
      allow.groups(["ADMINS"]).to(["read", "write", "delete"]),
    ],
    "recursos/vehiculo/*": [
      allow.guest.to(["read"]),
      allow.groups(["ADMINS"]).to(["read", "write", "delete"]),
    ],
    "recursos/galeria/*": [
      allow.guest.to(["read"]),
      allow.groups(["ADMINS"]).to(["read", "write", "delete"]),
    ],
  }),
});
