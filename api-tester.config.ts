/**
 * API tester (Scalar) — privacy and external-service settings.
 *
 * The API tester page (/api-tester) is rendered by Scalar (https://scalar.com). Besides rendering the
 * OpenAPI file and sending requests from the reader's browser to a device, Scalar offers features
 * that contact Scalar's own servers or other third parties. Each of them is listed here with a
 * description of what it does and what information leaves the reader's browser, and can be switched
 * on or off. Everything that talks to an external site is OFF by default.
 *
 * "Visitor data" below means what any web request reveals to the receiving site: the visitor's IP
 * address, browser and operating system (User-Agent), language, the referring page, and any cookies
 * that site sets. Scalar's hosted pages additionally load third-party analytics/marketing scripts
 * (observed: vector.co, apollo.io, usefathom.com), which set their own cookies.
 *
 * This object is read by docusaurus.config.ts. If a second tester instance is ever added (for
 * example for another API version), give it its own entry of the same shape.
 */

export type DeveloperToolbar = 'never' | 'localhost' | 'always';

export type ApiTesterConfig = {
  /**
   * Where the Scalar renderer script is loaded from at page load (pinned version).
   * External site: cdn.jsdelivr.net (jsDelivr CDN). Sent: visitor data only (a normal script
   * download); nothing about the API or the reader's requests. To stop using the CDN, host the
   * file yourself under static/ and point this URL at it.
   */
  rendererCdn: string;

  /**
   * "Test Request" button on every operation, which opens the in-page request client ("Send").
   * External site: none. Requests go from the reader's browser directly to the device/server the
   * reader selected (my.ence.do or 192.168.7.1), with the headers, token and body the reader typed.
   * Nothing is sent to Scalar. (Requires the device's CORS `origin` setting to allow the site
   * origin and its TLS certificate to be trusted by the browser.)
   */
  testRequestButton: boolean;

  /**
   * Route the in-page client's requests through Scalar's proxy instead of sending them directly.
   * '' = direct (recommended); 'https://proxy.scalar.com' = Scalar's proxy.
   * External site when set: proxy.scalar.com. Sent: EVERY request the reader sends — target URL,
   * all headers including the Authorization bearer token, the request body — and the device's
   * response, plus visitor data. Not useful here anyway: the device is on a USB-local network the
   * proxy cannot reach.
   */
  requestProxy: string;

  /**
   * "Open API Client" button (bottom of the sidebar and in the client header): opens Scalar's
   * hosted client at https://client.scalar.com in a new tab.
   * External site: client.scalar.com (+ its analytics/marketing third parties). Sent: the absolute
   * URL of the OpenAPI file as a query parameter; the hosted page then downloads the whole OpenAPI
   * document from this site; afterwards every request the reader sends from that hosted client
   * (URLs, headers, tokens, bodies, responses) is handled by that site; plus visitor data.
   * Known to fail from a local preview ("Failed to import document": the hosted site cannot reach
   * the preview server).
   */
  openApiClientLink: boolean;

  /**
   * "Ask AI" (Scalar Agent) chat about the API.
   * External site: api.scalar.com / scalar.com (+ its third parties). Sent: the whole OpenAPI
   * document ("temporarily uploaded to Scalar's servers", per Scalar's consent text), every
   * question the reader types and the conversation, visitor data. Subject to Scalar's Terms and
   * Privacy Policy; needs a paid Agent key for production use.
   */
  askAi: boolean;

  /**
   * "Generate MCP" buttons (VS Code / Cursor): create a Model Context Protocol server for the API
   * on Scalar's platform.
   * External site: api.scalar.com (via proxy.scalar.com). Sent: the whole OpenAPI document
   * (uploaded to Scalar's share/upload endpoint), visitor data.
   */
  generateMcp: boolean;

  /**
   * Developer toolbar ("Developer Tools / Configure / Share / Deploy"), by default shown only when
   * the site runs on localhost. "Share" uploads the whole OpenAPI document to Scalar (temporary
   * link, deleted after 7 days); "Deploy" leads to Scalar's hosting offer. "Configure" is local.
   * External site when used: api.scalar.com / scalar.com. Sent: the OpenAPI document (Share),
   * visitor data.
   */
  developerToolbar: DeveloperToolbar;

  /**
   * Scalar usage analytics (only active if Scalar's analytics plugin is loaded).
   * External site: scalar.com. Sent: usage events and visitor data.
   */
  telemetry: boolean;
};

const apiTesterConfig: ApiTesterConfig = {
  rendererCdn: 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.72.1',
  testRequestButton: true,
  requestProxy: '',
  openApiClientLink: false,
  askAi: false,
  generateMcp: false,
  developerToolbar: 'never',
  telemetry: false,
};

export default apiTesterConfig;
