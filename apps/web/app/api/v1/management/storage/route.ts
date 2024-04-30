import { responses } from "@/lib/api/response";
import { NextResponse } from "next/server";
import { env } from "@/env.mjs";
import { putFileToLocalStorage, putFileToS3 } from "@formbricks/lib/storage/service";
import { UPLOADS_DIR, WEBAPP_URL } from "@formbricks/lib/constants";
// import { hasUserEnvironmentAccess } from "@formbricks/lib/environment/auth";
import { authenticateRequest } from "@/app/api/v1/auth";

// api endpoint for uploading public files
// uploaded files will be public, anyone can access the file
// uploading public files requires authentication
// use this to upload files for a specific resource, e.g. a user profile picture or a survey

export async function GET(request: Request) {}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const authentication = await authenticateRequest(request);
    if (!authentication) return responses.notAuthenticatedResponse();
    const accessType = "public"; // public files are accessible by anyone
    const { fileName, contentType, environmentId, fileBuffer, allowedFileExtensions } = await request.json();

    if (!fileName) {
      return responses.badRequestResponse("fileName is required");
    }

    // if (!contentType) {
    //   return responses.badRequestResponse("contentType is required");
    // }

    if (!fileBuffer) {
      return responses.badRequestResponse("no file provided, fileBuffer is required");
    }

    if (!environmentId) {
      return responses.badRequestResponse("environmentId is required");
    }

    if (allowedFileExtensions?.length) {
      const fileExtension = fileName.split(".").pop();
      if (!fileExtension || !allowedFileExtensions.includes(fileExtension)) {
        return responses.badRequestResponse(
          `File extension is not allowed, allowed extensions are: ${allowedFileExtensions.join(", ")}`
        );
      }
    }

    return await uploadPublicFile(
      fileName,
      fileBuffer,
      accessType,
      authentication.environmentId,
      contentType
    );
  } catch (e) {
    throw e;
  }
}

const uploadPublicFile = async (
  fileName: string,
  fileBuffer: Buffer,
  accessType: "public" | "private",
  environmentId,
  contentType?: string
) => {
  // if s3 is not configured, we'll upload to a local folder named uploads

  if (!env.S3_REGION || !env.S3_BUCKET_NAME) {
    try {
      console.log("uploading to local storage");

      await putFileToLocalStorage(fileName, fileBuffer, accessType, environmentId, UPLOADS_DIR, true);

      return responses.successResponse({
        uploaded: true,
        url: `${WEBAPP_URL}/storage/${environmentId}/${accessType}/${fileName}`,
      });
    } catch (err) {
      if (err.name === "FileTooLargeError") {
        return responses.badRequestResponse(err.message);
      }

      return responses.internalServerErrorResponse("Internal server error");
    }
  }

  try {
    // if (!contentType) {
    //   return responses.badRequestResponse("contentType is required");
    // }
    console.log("uploading to AWS S3");
    await putFileToS3(fileName, fileBuffer, accessType, environmentId, true, contentType);

    return responses.successResponse({
      uploaded: true,
      url: `${WEBAPP_URL}/storage/${environmentId}/${accessType}/${fileName}`,
    });
  } catch (err) {
    if (err.name === "FileTooLargeError") {
      return responses.badRequestResponse(err.message);
    }

    return responses.internalServerErrorResponse("Internal server error");
  }
};
