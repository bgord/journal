import { z } from "zod/v4";

export const PublicationSpecificationErrors = { invalid: "publication.specification.invalid" };

const PublicationSpecificationMin = 1;
const PublicationSpecificationMax = 64;

export const PublicationSpecification = z
  .string(PublicationSpecificationErrors.invalid)
  .trim()
  .min(PublicationSpecificationMin, PublicationSpecificationErrors.invalid)
  .max(PublicationSpecificationMax, PublicationSpecificationErrors.invalid);

export type PublicationSpecificationType = z.infer<typeof PublicationSpecification>;
