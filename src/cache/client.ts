import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";

type MarkerType = "DEFAULT" | "CUSTOM"

export const markerType = makeVar<MarkerType>("DEFAULT");

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        marker: {
          read() {
            return markerType;
          }
        }
      }
    }
  }
});
export const client = new ApolloClient({
  cache,
  defaultOptions: {
    watchQuery: {
      returnPartialData: true
    }
  }
});