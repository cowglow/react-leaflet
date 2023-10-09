import { ApolloClient, InMemoryCache } from "@apollo/client";
import { markerCache } from "./types/marker-type.ts";
import { modeCache } from "./types/marker-mode.ts";

export const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          ...markerCache,
          ...modeCache
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      returnPartialData: true
    }
  }
});