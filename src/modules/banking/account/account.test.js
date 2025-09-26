import { describe, it, expect, vi, afterEach, assert } from "vitest";
import { createAccount, getAccounts, deleteAccount } from "./account.service";
import { HttpBadRequest } from "@httpx/exception";

// On mock le repository
vi.mock("./account.repository", async (importOriginal) => ({
  ...(await importOriginal()),
  createAccountInRepository: vi.fn((data) => ({
    id: 1,
    userId: data.userId,
    iban: data.iban,
    balance: data.balance,
  })),
  getAccountsInRepository: vi.fn((userId) => [
    { id: 1, userId, iban: "FR761234567890", balance: 1000 },
    { id: 2, userId, iban: "FR761111111111", balance: 500 },
  ]),
  deleteAccountInRepository: vi.fn((userId, accountId) => {
    if (accountId === 999) return false; 
    return true;
  }),
}));

describe("Account Service", () => {
  afterEach(() => vi.clearAllMocks());

  it("createAccount réussi", async () => {
    const account = await createAccount(42, {
      iban: "FR761234567890",
      balance: 1000,
    });

    expect(account).toBeDefined();
    expect(account.userId).toBe(42);
    expect(account.iban).toBe("FR761234567890");
    expect(account.balance).toBe(1000);
  });

  it("createAccount échoue avec de mauvais paramètres", async () => {
    try {
      await createAccount(42, { balance: 1000 }); // manque iban
      assert.fail("Should have thrown an error.");
    } catch (e) {
      expect(e).toBeInstanceOf(HttpBadRequest);
      expect(e.statusCode).toBe(400);
    }
  });

  it("getAccounts réussi en vérifiant chaque élément de la liste", async () => {
    const accounts = await getAccounts(42);

    expect(accounts).toHaveLength(2);
    accounts.forEach((acc) => {
      expect(acc).toHaveProperty("id");
      expect(acc).toHaveProperty("iban");
      expect(acc).toHaveProperty("balance");
      expect(acc.userId).toBe(42);
    });
  });

  it("deleteAccount réussi", async () => {
    const result = await deleteAccount(42, 1);

    expect(result).toBe(true);
  });

  it("deleteAccount échoue avec un mauvais id d'Account", async () => {
    try {
      await deleteAccount(42, 999); // faux id
      assert.fail("Should have thrown an error.");
    } catch (e) {
      expect(e).toBeInstanceOf(HttpBadRequest);
      expect(e.statusCode).toBe(400);
    }
  });
});
