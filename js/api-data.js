/* ============================================================
   API TESTING LAB DATA
   ============================================================ */

const API_METHODS = {
  get: {
    method: 'GET', color: 'var(--pass-light)', label: 'Retrieve a resource',
    description: 'Reads data without modifying anything on the server. Safe to call repeatedly — calling it 100 times has the same effect as calling it once.',
    endpoint: '/api/users/101',
    queryParams: [{ name: 'include', value: 'orders', desc: 'Optionally expand related data' }],
    pathParams: [{ name: 'id', value: '101', desc: 'The user\'s unique identifier' }],
    headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...', 'Accept': 'application/json' },
    requestBody: null,
    responseStatus: 200,
    responseBody: `{
  "id": 101,
  "name": "Asha Rao",
  "email": "asha.rao@example.com",
  "status": "active",
  "createdAt": "2025-11-02T08:15:00Z"
}`,
  },
  post: {
    method: 'POST', color: 'var(--cyan)', label: 'Create a new resource',
    description: 'Creates a brand-new resource on the server. Calling it twice with the same body typically creates two separate resources — it is not idempotent.',
    endpoint: '/api/orders',
    queryParams: [],
    pathParams: [],
    headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...', 'Content-Type': 'application/json' },
    requestBody: `{
  "productId": 55,
  "quantity": 2,
  "shippingAddress": "221B Baker Street"
}`,
    responseStatus: 201,
    responseBody: `{
  "id": 9981,
  "status": "pending",
  "productId": 55,
  "quantity": 2,
  "createdAt": "2026-06-21T10:02:31Z"
}`,
  },
  put: {
    method: 'PUT', color: 'var(--indigo-light)', label: 'Replace a resource entirely',
    description: 'Replaces the full resource with the payload provided. Fields omitted from the body may be reset to defaults — this is idempotent.',
    endpoint: '/api/users/101',
    queryParams: [],
    pathParams: [{ name: 'id', value: '101', desc: 'The user to replace' }],
    headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...', 'Content-Type': 'application/json' },
    requestBody: `{
  "name": "Asha Rao",
  "email": "asha.new@example.com",
  "status": "active"
}`,
    responseStatus: 200,
    responseBody: `{
  "id": 101,
  "name": "Asha Rao",
  "email": "asha.new@example.com",
  "status": "active",
  "updatedAt": "2026-06-21T10:05:11Z"
}`,
  },
  patch: {
    method: 'PATCH', color: 'var(--warn)', label: 'Partially update a resource',
    description: 'Updates only the fields included in the request body — everything else on the resource stays untouched. Generally treated as idempotent.',
    endpoint: '/api/users/101',
    queryParams: [],
    pathParams: [{ name: 'id', value: '101', desc: 'The user to update' }],
    headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...', 'Content-Type': 'application/json' },
    requestBody: `{
  "status": "inactive"
}`,
    responseStatus: 200,
    responseBody: `{
  "id": 101,
  "name": "Asha Rao",
  "email": "asha.new@example.com",
  "status": "inactive",
  "updatedAt": "2026-06-21T10:07:45Z"
}`,
  },
  delete: {
    method: 'DELETE', color: 'var(--fail)', label: 'Remove a resource',
    description: 'Removes the resource. Calling it again on an already-deleted resource typically returns 404 — the end state (resource gone) is idempotent even though the response code may differ.',
    endpoint: '/api/orders/9981',
    queryParams: [],
    pathParams: [{ name: 'id', value: '9981', desc: 'The order to delete' }],
    headers: { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...' },
    requestBody: null,
    responseStatus: 204,
    responseBody: `// 204 No Content — empty body by convention`,
  },
};

const API_METHOD_ORDER = ['get', 'post', 'put', 'patch', 'delete'];

const STATUS_CODES = [
  { code: 200, name: 'OK', category: '2xx', desc: 'Request succeeded; response contains the requested data.' },
  { code: 201, name: 'Created', category: '2xx', desc: 'A new resource was successfully created.' },
  { code: 204, name: 'No Content', category: '2xx', desc: 'Request succeeded, no body returned — typical for DELETE.' },
  { code: 301, name: 'Moved Permanently', category: '3xx', desc: 'Resource has a new permanent URL; clients should update their bookmark.' },
  { code: 304, name: 'Not Modified', category: '3xx', desc: 'Cached version is still valid; no need to re-fetch the body.' },
  { code: 400, name: 'Bad Request', category: '4xx', desc: 'The request is malformed — invalid syntax, missing required fields.' },
  { code: 401, name: 'Unauthorized', category: '4xx', desc: 'Missing or invalid authentication credentials.' },
  { code: 403, name: 'Forbidden', category: '4xx', desc: 'Authenticated, but not permitted to perform this action.' },
  { code: 404, name: 'Not Found', category: '4xx', desc: 'The requested resource doesn\'t exist.' },
  { code: 405, name: 'Method Not Allowed', category: '4xx', desc: 'The HTTP method used isn\'t supported on this endpoint.' },
  { code: 409, name: 'Conflict', category: '4xx', desc: 'Request conflicts with current server state, e.g. duplicate unique field.' },
  { code: 422, name: 'Unprocessable Entity', category: '4xx', desc: 'Syntactically correct but semantically invalid — fails validation rules.' },
  { code: 429, name: 'Too Many Requests', category: '4xx', desc: 'Rate limit exceeded; client should back off and retry later.' },
  { code: 500, name: 'Internal Server Error', category: '5xx', desc: 'An unhandled error occurred on the server.' },
  { code: 502, name: 'Bad Gateway', category: '5xx', desc: 'An upstream server returned an invalid response.' },
  { code: 503, name: 'Service Unavailable', category: '5xx', desc: 'Server is temporarily unable to handle the request, often during maintenance or overload.' },
];

const API_CONCEPTS = [
  { title: 'REST API Basics', text: 'REST treats everything as a "resource" addressed by a URL. Standard HTTP methods (GET, POST, PUT, PATCH, DELETE) define what operation to perform on that resource — there\'s no custom verb per action.' },
  { title: 'JSON Basics', text: 'Most modern APIs exchange data as JSON — key-value pairs, arrays, and nested objects. Testers must understand types (string, number, boolean, null, array, object) to write meaningful assertions.' },
  { title: 'Authentication Concepts', text: 'Bearer tokens (JWT) are the most common scheme — sent in the Authorization header. API keys and OAuth2 flows (client credentials, authorization code) are also common depending on the API\'s audience.' },
  { title: 'Headers', text: 'Beyond Authorization, headers like Content-Type, Accept, and custom X- headers carry metadata about the request/response that affects how it\'s processed — testing the right headers matters as much as the body.' },
];

const API_INTERVIEW_QUESTIONS = [
  { q: 'What is REST, and what makes an API "RESTful"?', a: 'REST (Representational State Transfer) is an architectural style where resources are addressed via URLs and manipulated using standard HTTP methods. A RESTful API is typically stateless, uses these standard verbs consistently, and returns standard status codes.', level: 'Beginner' },
  { q: 'What is the difference between authentication and authorization?', a: 'Authentication verifies who you are (logging in, presenting a valid token). Authorization determines what you\'re allowed to do once authenticated (e.g. whether your role permits deleting a resource).', level: 'Beginner' },
  { q: 'How would you test pagination on a GET endpoint?', a: 'Verify the first page returns the expected page size, the last page returns the remainder correctly, an out-of-range page returns an empty list (not an error), and that page/limit query parameters are validated against bad input like negative numbers.', level: 'Intermediate' },
  { q: 'What is the difference between a 4xx and a 5xx response, and why does that distinction matter in testing?', a: '4xx means the client made a bad request (wrong input, missing auth) — the server is working correctly by rejecting it. 5xx means the server itself failed. Tests should expect specific 4xx codes for bad input, while any 5xx during a test usually signals a real bug, not expected behavior.', level: 'Intermediate' },
  { q: 'How would you design tests for an API with rate limiting?', a: 'Send requests up to the documented limit and confirm they succeed, then send one more and assert a 429 response with the correct Retry-After header; also verify the limit resets after the stated window.', level: 'Advanced' },
  { q: 'How do you approach testing a webhook-based API?', a: 'Since the API calls your system rather than the reverse, you typically stand up a test endpoint (or use a tool that captures inbound requests) to receive the webhook, then assert the payload structure, headers (like a signature for verification), and that retries behave correctly on failure.', level: 'Advanced' },
];
