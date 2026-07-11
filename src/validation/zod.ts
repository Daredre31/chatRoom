import z from "zod";

 export const joinRoomSchema = z.object({
    serviceSlug:z.string().min(1),
    existingToken: z.string().optional()
})


export const createServiceSchema = z.object({
  serviceName: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be lowercase, hyphen-separated"),
});

  ``
export const registerWorkerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  serviceId: z.string().min(1), // which service this worker belongs to
});