import * as v from "valibot";

export const PublicationSpecificationErrors = { Invalid: "publication.specification.invalid" };

const PublicationSpecificationMin = 1;
const PublicationSpecificationMax = 64;

export const PublicationSpecification = v.pipe(
  v.string(PublicationSpecificationErrors.Invalid),
  v.minLength(PublicationSpecificationMin, PublicationSpecificationErrors.Invalid),
  v.maxLength(PublicationSpecificationMax, PublicationSpecificationErrors.Invalid),
);

export type PublicationSpecificationType = v.InferOutput<typeof PublicationSpecification>;
