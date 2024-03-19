"use server";

import { getEnvironment } from "@formbricks/lib/environment/service";
import { getProductByEnvironmentId } from "@formbricks/lib/product/service";

export async function getData(environmentId: string) {
  const environment = await getEnvironment(environmentId);
  const product = await getProductByEnvironmentId(environmentId);

  return {
    initialEnvironment: environment,
    initialProduct: product,
  };
}
