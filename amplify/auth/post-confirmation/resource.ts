import { defineFunction } from "@aws-amplify/backend";

/** Trigger Cognito postConfirmation: primer registro confirmado desde la web → grupo ADMINS. */
export const postConfirmation = defineFunction({
  name: "post-confirmation",
});
