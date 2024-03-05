import { TAuthenticationApiKey, TDaylightUser } from "@formbricks/types/v1/auth";
import { DatabaseError, InvalidInputError, ResourceNotFoundError } from "@formbricks/types/v1/errors";
import { responses } from "@/lib/api/response";
import { NextResponse } from "next/server";
import { LUMI_API_URL, FORMBRICKS_PASSWORD, WEBAPP_URL } from "@formbricks/lib/constants";
import { prisma } from "@formbricks/database";
import { createUser } from "@/lib/users/users";

async function getDaylightUserData(token: string): Promise<TDaylightUser | NextResponse> {
  try {
    const response = await fetch(`${LUMI_API_URL}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    const resObj = await response.json();
    if (response.ok) {
      return resObj;
    } else {
      throw new Error("Something went wrong!");
    }
  } catch (e) {
    return handleErrorResponse(e);
  }
}

export async function authenticateRequest(request: Request): Promise<TAuthenticationApiKey | null> {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey) {
    const daylightUserData = await getDaylightUserData(apiKey);

    if (!daylightUserData || daylightUserData instanceof NextResponse) return null;

    let existedUser: any = await prisma.user.findFirst({
      where: {
        email: daylightUserData.username,
      },
    });

    if (!existedUser) {
      await createUser(
        daylightUserData.full_name,
        daylightUserData.username,
        FORMBRICKS_PASSWORD as string,
        null,
        WEBAPP_URL
      );
    }

    existedUser = await prisma.user.findFirst({
      where: {
        email: daylightUserData.username,
      },
      include: {
        memberships: {
          include: {
            team: {
              include: {
                products: {
                  include: {
                    environments: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (existedUser) {
      return {
        type: "apiKey",
        environmentId: existedUser?.memberships[0].team.products[0].environments.find(
          (item: Record<string, string>) => item.type === "production"
        ).id,
      };
    }
    return null;
  }
  return null;
}

export function handleErrorResponse(error: any): NextResponse {
  switch (error.message) {
    case "NotAuthenticated":
      return responses.notAuthenticatedResponse();
    case "Unauthorized":
      return responses.unauthorizedResponse();
    default:
      if (
        error instanceof DatabaseError ||
        error instanceof InvalidInputError ||
        error instanceof ResourceNotFoundError
      ) {
        return responses.badRequestResponse(error.message);
      }
      return responses.internalServerErrorResponse("Some error occurred");
  }
}
