// Cloudflare Pages middleware: redirect only the bare project pages.dev URL
// to the canonical apex domain. Preview branch URLs and the custom domain
// both pass through unchanged.
//
// Why this exists:
// On 2026-05-26 we deleted an account-level Bulk Redirect that mapped
//   *.the-symbiotic-mind.pages.dev -> https://symbiotic-mind.com
// The wildcard caught every preview branch alias too, breaking previews.
// The original intent of that redirect was narrow: stop LinkedIn from
// flagging the bare project URL when a co-author accidentally shared a
// pages.dev link in a post (LinkedIn's link-safety scanner gives shared
// .pages.dev hosts a warning, but does not flag the custom domain).
//
// This middleware restores only that narrow protection — host-equality
// against the bare project hostname — and leaves every other host
// (preview branch aliases, the custom apex domain, deployment SHA URLs)
// to serve content directly.

const PROJECT_PAGES_HOST = "the-symbiotic-mind.pages.dev";
const CANONICAL_ORIGIN = "https://symbiotic-mind.com";

export async function onRequest(context) {
  const requestUrl = new URL(context.request.url);

  if (requestUrl.host === PROJECT_PAGES_HOST) {
    return Response.redirect(
      `${CANONICAL_ORIGIN}${requestUrl.pathname}${requestUrl.search}`,
      301
    );
  }

  return context.next();
}
