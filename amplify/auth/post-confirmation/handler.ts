import type { PostConfirmationTriggerHandler } from "aws-lambda";
import {
  AdminAddUserToGroupCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognito = new CognitoIdentityProviderClient({});

/**
 * Solo registro propio confirmado por email (no AdminConfirm ni otros triggers).
 * Si en el pool hay exactamente un usuario CONFIRMED, es el primero → ADMINS.
 *
 * Riesgo residual: carrera muy improbable entre dos primeros confirmados; en producción
 * estricta, desactiva el registro público tras crear el primer admin.
 */
export const handler: PostConfirmationTriggerHandler = async (event) => {
  if (event.triggerSource !== "PostConfirmation_ConfirmSignUp") {
    return event;
  }

  const { userPoolId, userName } = event;

  let confirmedCount = 0;
  let paginationToken: string | undefined;

  do {
    const page = await cognito.send(
      new ListUsersCommand({
        UserPoolId: userPoolId,
        Limit: 60,
        PaginationToken: paginationToken,
      }),
    );

    for (const u of page.Users ?? []) {
      if (u.UserStatus === "CONFIRMED") {
        confirmedCount += 1;
      }
    }

    paginationToken = page.PaginationToken;
  } while (paginationToken);

  if (confirmedCount === 1) {
    await cognito.send(
      new AdminAddUserToGroupCommand({
        UserPoolId: userPoolId,
        Username: userName,
        GroupName: "ADMINS",
      }),
    );
  }

  return event;
};
