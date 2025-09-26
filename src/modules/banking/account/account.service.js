import { z } from "zod";
import { HttpBadRequest } from "@httpx/exception";
import {
  createAccountInRepository,
  getAccountsInRepository,
  deleteAccountInRepository,
} from "./account.repository";

// Schéma de validation
const AccountSchema = z.object({
  iban: z.string().min(5), 
  balance: z.number().nonnegative(),
});

//Crée un compte bancaire pour un utilisateur
export async function createAccount(userId, data) {
  const result = AccountSchema.safeParse(data);

  if (!result.success) {
    throw new HttpBadRequest(result.error);
  }

  return createAccountInRepository({
    userId,
    ...result.data,
  });
}

//Récupère tous les comptes d’un utilisateur
export async function getAccounts(userId) {
  return getAccountsInRepository(userId);
}

//Supprime un compte bancaire par userId et accountId
export async function deleteAccount(userId, accountId) {
  const deleted = await deleteAccountInRepository(userId, accountId);

  if (!deleted) {
    throw new HttpBadRequest("Account not found or cannot be deleted");
  }

  return true;
}
