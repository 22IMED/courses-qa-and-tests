import { describe, it, afterEach, expect, vi, assert } from "vitest";
import { createUser, MIN_USER_AGE } from "./user.service";

// On mock le repository pour éviter la vraie base
vi.mock("./user.repository", async (importOriginal) => ({
  ...(await importOriginal()),
  createUserInRepository: vi.fn((data) => {
    return {
      id: 4,
      name: data.name,
      birthday: data.birthday,
    };
  }),
}));

describe("User Service", () => {
  afterEach(() => vi.clearAllMocks());

  it("should trigger an error if user is too young", async () => {
    const today = new Date();

    // On crée une date d’anniversaire qui rend l’utilisateur plus jeune que MIN_USER_AGE
    const tooYoungBirthday = new Date(
      today.getFullYear() - (MIN_USER_AGE - 1),
      today.getMonth(),
      today.getDate()
    );

    try {
      await createUser({
        name: "Baby User",
        birthday: tooYoungBirthday,
      });

      // Si la fonction ne jette pas d’erreur => échec du test
      assert.fail("createUser should trigger an error for too young user.");
    } catch (e) {
      expect(e.name).toBe("HttpForbidden"); // le service envoie Forbidden
      expect(e.statusCode).toBe(403);
    }
  });

  it("should throw HttpForbidden when user is too young", async () => {
  const today = new Date();
  const birthday = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate()); // 10 ans

  await expect(createUser({ name: "Kid", birthday }))
    .rejects.toMatchObject({ name: "HttpForbidden", statusCode: 403 });
});


});
