import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "95lxn5hk",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});