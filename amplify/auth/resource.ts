import { defineAuth } from "@aws-amplify/backend";
import { postConfirmation } from "./post-confirmation/resource";

/**
 * Cognito (email): login en /admin/login y registro en /admin/registro.
 *
 * Primer administrador:
 * 1) Automático: el primer usuario que **se registra en la web**, confirma el correo y
 *    entra por `PostConfirmation_ConfirmSignUp` pasa al grupo **ADMINS** (Lambda postConfirmation).
 * 2) Manual: en la consola de Cognito, crear usuario y añadirlo al grupo ADMINS.
 *
 * Tras el primer admin, conviene desactivar el registro público en Cognito si no quieres
 * más cuentas auto-creadas (ver comentario en consola / documentación).
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ["ADMINS"],
  triggers: {
    postConfirmation,
  },
  access: (allow) => [
    // addUserToGroup: primer usuario → ADMINS | listUsers: contar CONFIRMED en el pool
    allow.resource(postConfirmation).to(["addUserToGroup", "listUsers"]),
  ],
});
