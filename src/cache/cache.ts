import { InMemoryCache, makeVar } from "@apollo/client";

type MarkerType = "DEFAULT" | "CUSTOM"

const markerType = makeVar<MarkerType>("DEFAULT");
export default new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        markerType: {
          read() {
            return markerType();
          }
        }
      }
    }
  }
});