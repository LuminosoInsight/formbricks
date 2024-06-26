import { notFound, redirect } from "next/navigation";
import { getShortUrl } from "@formbricks/lib/shortUrl/service";
import { ZShortUrlId } from "@formbricks/types/v1/shortUrl";

export default async function ShortUrlPage({ params }) {
  if (!params.shortUrlId) {
    notFound();
  }

  if (ZShortUrlId.safeParse(params.shortUrlId).success !== true) {
    // return not found if unable to parse short url id
    notFound();
  }

  let shortUrl;

  try {
    shortUrl = await getShortUrl(params.shortUrlId);
  } catch (error) {
    console.error(error.message);
  }

  if (shortUrl) {
    redirect(shortUrl.url);
  }

  // return not found if short url not found
  notFound();
}
