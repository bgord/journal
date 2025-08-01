import { z } from "zod/v4";

const PublicationSpecificationErrors = {
  invalid: "reaction.description.invalid",
};

const PublicationSpecificationMin = 1;
const PublicationSpecificationMax = 64;

export const PublicationSpecification = z
  .string({ message: PublicationSpecificationErrors.invalid })
  .trim()
  .min(PublicationSpecificationMin, { message: PublicationSpecificationErrors.invalid })
  .max(PublicationSpecificationMax, { message: PublicationSpecificationErrors.invalid });
