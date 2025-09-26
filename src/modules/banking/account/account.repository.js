const accounts = [];

export function createAccount(account) {
  accounts.push(account);
  return account;
}

export function getAccountById(id) {
  return accounts.find(acc => acc.id === id);
}

export function getAllAccounts() {
  return accounts;
}
