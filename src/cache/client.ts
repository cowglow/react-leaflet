import { ApolloClient } from "@apollo/client";
import cache from "./cache.ts";

export const client = new ApolloClient({
  uri: "/",
  cache
});