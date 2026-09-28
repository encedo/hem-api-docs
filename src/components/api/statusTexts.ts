/** Default titles for HTTP status codes (from the "Response codes" table in General information). */
const STATUS_TEXTS: Record<string, string> = {
  '200': 'Operation successful',
  '201': 'Created',
  '202': 'Accepted',
  '204': 'No content',
  '400': 'Incorrect argument(s)',
  '401': 'Missing or invalid JWT_TOKEN',
  '403': 'Incorrect access scope',
  '404': 'Not found',
  '406': 'Operation failed',
  '409': 'Incorrect internal state',
  '411': 'Protocol error - Content-Length required',
  '412': 'Protocol error - CORS validation failed',
  '413': 'Protocol error - request body too big',
  '418': 'TLS connection required',
  '500': 'Internal server error',
};

export default STATUS_TEXTS;
