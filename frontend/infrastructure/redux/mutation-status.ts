// Shared shape for a slice's single in-flight create/update/delete request,
// correlated back to its caller via `request-id.ts`. See member.slice.ts /
// member.saga.ts for the fullest example of the pattern.
export type MutationStatus = "idle" | "pending" | "succeeded" | "failed";
