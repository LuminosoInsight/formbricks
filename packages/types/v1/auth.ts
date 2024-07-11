import { z } from "zod";
import { ZProfile } from "./profile";

const ZAuthSession = z.object({
  user: ZProfile,
});

const ZDaylightUser = z.object({
  username: z.string(),
  full_name: z.string(),
  global_permissions: z.array(z.string()),
});

const ZAuthenticationApiKey = z.object({
  type: z.literal("apiKey"),
  environmentId: z.string(),
  daylightUser: ZDaylightUser,
});

export type TDaylightUser = z.infer<typeof ZDaylightUser>;
export type TAuthSession = z.infer<typeof ZAuthSession>;
export type TAuthenticationApiKey = z.infer<typeof ZAuthenticationApiKey>;
