import { prisma } from "@formbricks/database";
import { NextResponse } from "next/server";
import { authenticateRequest } from "@/app/api/v1/auth";
import { responses } from "@/lib/api/response";

export async function GET(request: Request) {
  const authentication = await authenticateRequest(request);
  if (!authentication) return responses.notAuthenticatedResponse();
  const environment = await prisma.environment.findUnique({
    where: {
      id: authentication.environmentId,
    },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      type: true,
      product: {
        select: {
          id: true,
          name: true,
        },
      },
      widgetSetupCompleted: true,
    },
  });
  if (!environment) {
    return new Response("Not authenticated", {
      status: 401,
    });
  }
  return NextResponse.json(environment);
}
