// Typed application-level failures. ports/http/routes/auth.routes.ts maps each of
// these to the exact status code + message the API has always returned — keeping
// that HTTP-shaped decision in ports, not here.
export class MailDeliveryError extends Error {}
export class DuplicateAccountError extends Error {}
export class MemberNotFoundError extends Error {}
export class MemberAlreadyLinkedError extends Error {}
export class AccountNotFoundError extends Error {}
