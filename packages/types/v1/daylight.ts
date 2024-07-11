import { z } from "zod";

const ZDaylightProjectCreate = z.object({
  name: z.string(),
  language: z.string(),
});

const ZDaylightProject = z.object({
  name: z.string(),
  language: z.string(),
  description: z.string().optional(),
  workspace_id: z.string(),
  project_id: z.string(),
});

export type TDaylightProjectCreate = z.infer<typeof ZDaylightProjectCreate>;
export type TDaylightProject = z.infer<typeof ZDaylightProject>;
