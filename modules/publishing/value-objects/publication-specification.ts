import { z } from "zod/v4";

export const PublicationSpecificationErrors = { Invalid: "publication.specification.invalid" };

const PublicationSpecificationMin = 1;
const PublicationSpecificationMax = 64;

export const PublicationSpecification = z
  .string(PublicationSpecificationErrors.Invalid)
  .min(PublicationSpecificationMin, PublicationSpecificationErrors.Invalid)
  .max(PublicationSpecificationMax, PublicationSpecificationErrors.Invalid);

export type PublicationSpecificationType = z.infer<typeof PublicationSpecification>;
