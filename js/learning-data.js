/* ============================================================
   LEARNING TOPIC DATA — single source of truth for all 10 topics.
   Used by: index.html (featured cards), learning.html (full pages)
   ============================================================ */

const TOPIC_DATA = {

  selenium: {
    id: 'selenium', glyph: 'SE', name: 'Selenium', difficulty: 'Intermediate',
    tagline: 'The browser automation library every QA engineer learns first.',
    intro: `Selenium WebDriver is an open-source library that lets you control a real browser programmatically — clicking buttons, filling forms, and reading page content the same way a user would. It's been the industry default for browser automation since the mid-2000s, and most QA job postings still list it as a core requirement.`,
    concepts: [
      { title: 'WebDriver Architecture', text: 'Your test code talks to a browser-specific driver (chromedriver, geckodriver) over HTTP using the W3C WebDriver protocol. The driver translates commands into native browser actions.' },
      { title: 'Locators', text: 'Ways to find elements on a page: ID, Name, Class Name, Tag Name, Link Text, CSS Selector, and XPath. CSS and XPath are the most flexible and most commonly used in real test suites.' },
      { title: 'Waits', text: 'Implicit waits poll the DOM for a fixed timeout globally. Explicit waits (WebDriverWait + ExpectedConditions) wait for a specific condition on a specific element — the recommended approach for reliable tests.' },
      { title: 'Page Object Model (POM)', text: 'A design pattern that separates page structure (locators) from test logic. Each page gets its own class, making tests easier to maintain when the UI changes.' },
      { title: 'Actions Class', text: 'Used for complex interactions Selenium can\'t do with a simple .click() — mouse hover, drag and drop, keyboard combinations, and right-click context menus.' },
      { title: 'Synchronization & Flakiness', text: 'Most Selenium test flakiness comes from racing the browser — clicking before an element is interactable. Proper explicit waits solve the vast majority of "flaky" Selenium tests.' },
    ],
    examples: [
      { title: 'Basic element interaction', code: `WebDriver driver = new ChromeDriver();
driver.get("https://example.com/login");
driver.findElement(By.id("username")).sendKeys("qa_user");
driver.findElement(By.id("password")).sendKeys("Secret123");
driver.findElement(By.cssSelector("button[type='submit']")).click();` },
      { title: 'Explicit wait for a dynamic element', code: `WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement banner = wait.until(
    ExpectedConditions.visibilityOfElementLocated(By.id("success-banner"))
);
assertTrue(banner.getText().contains("Welcome"));` },
      { title: 'Page Object Model snippet', code: `public class LoginPage {
    private WebDriver driver;
    private By usernameField = By.id("username");
    private By loginButton = By.cssSelector("button[type='submit']");

    public LoginPage(WebDriver driver) { this.driver = driver; }

    public void loginAs(String user, String pass) {
        driver.findElement(usernameField).sendKeys(user);
        driver.findElement(By.id("password")).sendKeys(pass);
        driver.findElement(loginButton).click();
    }
}` },
    ],
    bestPractices: [
      'Always prefer explicit waits over Thread.sleep() — hardcoded sleeps make suites slow and still flaky.',
      'Use stable locators (data-testid, id) over brittle XPath chains tied to DOM structure.',
      'Wrap driver setup/teardown in @BeforeMethod / @AfterMethod so every test starts clean.',
      'Keep one assertion concern per test method — it makes failures diagnosable at a glance.',
      'Run tests headless in CI but keep a headed mode available for local debugging.',
    ],
    interviewQuestions: [
      { q: 'What is the difference between findElement() and findElements()?', a: 'findElement() returns the first matching WebElement and throws NoSuchElementException if none is found. findElements() returns a List of all matches, or an empty list if none exist — it never throws.', level: 'Beginner' },
      { q: 'Explain implicit vs explicit wait.', a: 'Implicit wait is set once on the driver and applies to every findElement call globally, polling up to the timeout. Explicit wait targets one specific condition on one element and is the recommended, more reliable approach.', level: 'Beginner' },
      { q: 'How does Selenium WebDriver work internally?', a: 'Your code sends WebDriver protocol commands as JSON over HTTP to a browser driver executable (e.g. chromedriver). The driver translates these into native browser automation calls and returns results back over the same channel.', level: 'Intermediate' },
      { q: 'What is the Page Object Model and why use it?', a: 'POM separates locators and page interactions into dedicated classes, away from test logic. When the UI changes, you update one page class instead of every test that touches that page.', level: 'Intermediate' },
      { q: 'How do you handle a StaleElementReferenceException?', a: 'It means the DOM element you held a reference to was removed or re-rendered. Re-locate the element right before interacting with it, or wrap the interaction in a retry with a fresh findElement call.', level: 'Advanced' },
      { q: 'How would you handle multiple browser windows or tabs?', a: 'Use driver.getWindowHandles() to get all open window handles, then driver.switchTo().window(handle) to move control to the one you need.', level: 'Advanced' },
    ],
    roadmap: ['Locators & basic interactions', 'Waits & synchronization', 'Page Object Model', 'Handling alerts, frames, windows', 'TestNG/JUnit integration', 'Parallel execution & CI'],
  },

  playwright: {
    id: 'playwright', glyph: 'PW', name: 'Playwright', difficulty: 'Intermediate',
    tagline: 'Microsoft\'s modern automation framework, built for speed and reliability.',
    intro: `Playwright is a newer automation framework that controls Chromium, Firefox, and WebKit through a single API. It was designed from the ground up to solve Selenium's biggest pain point — flakiness — with built-in auto-waiting, network interception, and a faster, more reliable architecture.`,
    concepts: [
      { title: 'Auto-waiting', text: 'Playwright automatically waits for elements to be actionable (visible, stable, enabled) before interacting — eliminating most of the manual wait code Selenium requires.' },
      { title: 'Locators API', text: 'getByRole, getByText, getByLabel and getByTestId encourage locating elements the way a user or screen reader would, rather than fragile CSS paths.' },
      { title: 'Browser Contexts', text: 'Each context is an isolated browser session (like an incognito profile) — letting you run many independent test sessions in parallel within a single browser instance, fast.' },
      { title: 'Network Interception', text: 'page.route() lets you intercept, modify, mock, or block network requests — making it trivial to test how a UI behaves under slow networks or API failures.' },
      { title: 'Trace Viewer', text: 'Playwright records a full trace (DOM snapshots, network, console) for every test run, which you can replay visually to debug a failure after the fact.' },
      { title: 'Test Isolation', text: 'Each test gets a fresh browser context by default, so tests don\'t leak cookies or storage state between each other — a common source of Selenium suite flakiness.' },
    ],
    examples: [
      { title: 'Basic test with auto-waiting locators', code: `import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.getByLabel('Username').fill('qa_user');
  await page.getByLabel('Password').fill('Secret123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Welcome')).toBeVisible();
});` },
      { title: 'Mocking an API response', code: `await page.route('**/api/orders', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, status: 'shipped' }]),
  });
});
await page.goto('/orders');
await expect(page.getByText('shipped')).toBeVisible();` },
      { title: 'Parallel contexts for two users', code: `const adminContext = await browser.newContext();
const userContext = await browser.newContext();

const adminPage = await adminContext.newPage();
const userPage = await userContext.newPage();

await adminPage.goto('/admin');
await userPage.goto('/dashboard');
// Both run independently — no shared cookies or storage.` },
    ],
    bestPractices: [
      'Prefer getByRole/getByLabel over CSS selectors — they break less often and double as accessibility checks.',
      'Let Playwright\'s auto-wait do the work; avoid manual waitForTimeout() except as a last resort.',
      'Use storageState to reuse a logged-in session across tests instead of logging in every time.',
      'Turn on trace: "on-first-retry" in CI so failures are debuggable without re-running locally.',
      'Run tests in parallel by default — Playwright\'s context model is built for it.',
    ],
    interviewQuestions: [
      { q: 'How is Playwright different from Selenium?', a: 'Playwright has built-in auto-waiting, native parallelism via browser contexts, network interception, and a single API across Chromium, Firefox, and WebKit — solving flakiness issues that Selenium requires extra code to handle.', level: 'Beginner' },
      { q: 'What is a browser context in Playwright?', a: 'An isolated, incognito-like session within a browser instance. Each context has its own cookies, storage, and cache, which lets multiple independent test sessions run in parallel efficiently.', level: 'Beginner' },
      { q: 'How does Playwright\'s auto-waiting work?', a: 'Before most actions, Playwright performs actionability checks — the element must be attached, visible, stable, and not obscured — and retries until those conditions are met or a timeout is reached, removing the need for manual waits.', level: 'Intermediate' },
      { q: 'How would you test an API failure scenario in the UI?', a: 'Use page.route() to intercept the relevant request and route.fulfill() with an error status code and body, then assert the UI shows the expected error state — without needing the real backend to fail.', level: 'Intermediate' },
      { q: 'What is the Trace Viewer and when would you use it?', a: 'It\'s a visual replay of a test run — DOM snapshots, network calls, and console logs — used to debug CI failures that are hard to reproduce locally.', level: 'Advanced' },
      { q: 'How do you handle authentication once and reuse it across tests?', a: 'Log in once in a setup project, save the session with page.context().storageState({ path }), then load that file in other tests\' context options to start already authenticated.', level: 'Advanced' },
    ],
    roadmap: ['Locators & auto-waiting', 'Assertions & test structure', 'Network interception & mocking', 'Authentication & storage state', 'Visual & trace debugging', 'CI integration & parallel sharding'],
  },

  apiTesting: {
    id: 'apiTesting', glyph: 'API', name: 'API Testing', difficulty: 'Intermediate',
    tagline: 'Testing the contracts that hold every modern application together.',
    intro: `API testing validates the layer underneath the UI — the REST endpoints that exchange data between systems. It's faster and more stable than UI testing, and it's where most regressions are caught earliest in a healthy test pyramid.`,
    concepts: [
      { title: 'REST Fundamentals', text: 'Resources are addressed by URL, and operations on them map to HTTP methods: GET (read), POST (create), PUT (replace), PATCH (partial update), DELETE (remove).' },
      { title: 'Status Codes', text: '2xx means success, 3xx is a redirect, 4xx is a client error (your request was wrong), 5xx is a server error (their system failed). Testing the right status code for the right scenario is a core skill.' },
      { title: 'Request/Response Structure', text: 'A request has a method, URL, headers, and optionally a body. A response has a status code, headers, and a body — usually JSON in modern APIs.' },
      { title: 'Authentication', text: 'Most APIs require a Bearer token in the Authorization header, an API key, or OAuth2 flow. Testing both valid and invalid/expired auth is essential.' },
      { title: 'Schema Validation', text: 'Beyond checking values, validate that the response shape (field names, types, required fields) matches the agreed contract — this catches breaking changes early.' },
      { title: 'Idempotency', text: 'GET, PUT, and DELETE should be idempotent — calling them repeatedly with the same input produces the same result. POST typically is not. Testing this distinguishes senior API testers from beginners.' },
    ],
    examples: [
      { title: 'GET request with query params', code: `GET /api/users?status=active&page=2 HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

# Response: 200 OK
{
  "page": 2,
  "users": [
    { "id": 101, "name": "Asha Rao", "status": "active" }
  ]
}` },
      { title: 'POST request creating a resource', code: `POST /api/orders HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "productId": 55,
  "quantity": 2
}

# Response: 201 Created
{ "id": 9981, "status": "pending", "productId": 55, "quantity": 2 }` },
      { title: 'Negative test — missing auth', code: `GET /api/orders/9981 HTTP/1.1
Host: api.example.com
# No Authorization header

# Response: 401 Unauthorized
{ "error": "Missing or invalid authentication token" }` },
    ],
    bestPractices: [
      'Test the full status code range for each endpoint — happy path (2xx), client errors (4xx), and where reachable, server errors (5xx).',
      'Validate response schema, not just values — a renamed field is a breaking change a value-only check will miss.',
      'Always include at least one negative test per endpoint: bad auth, missing fields, invalid types.',
      'Chain tests realistically — create a resource via POST, then verify it with GET, then clean up with DELETE.',
      'Never hardcode tokens in test code; load them from environment variables or a secrets manager.',
    ],
    interviewQuestions: [
      { q: 'What is the difference between PUT and PATCH?', a: 'PUT replaces the entire resource with the payload provided — fields you omit may be reset. PATCH applies a partial update, changing only the fields included in the request.', level: 'Beginner' },
      { q: 'What does a 401 vs a 403 status code mean?', a: '401 Unauthorized means the request lacks valid authentication credentials. 403 Forbidden means the credentials are valid, but the authenticated user doesn\'t have permission to perform that action.', level: 'Beginner' },
      { q: 'How do you test API response time / performance basics?', a: 'Most API testing tools (Postman, RestAssured) let you assert response time directly, e.g. response.time() should be under a threshold like 500ms — useful as a smoke check, not a substitute for dedicated load testing.', level: 'Intermediate' },
      { q: 'What is schema validation and why does it matter?', a: 'It checks that a response\'s structure — field names, types, nesting, required fields — matches an agreed contract (often a JSON Schema or OpenAPI spec), catching breaking changes that pure value assertions would miss.', level: 'Intermediate' },
      { q: 'How would you test an idempotent vs non-idempotent endpoint?', a: 'For an idempotent endpoint (GET, PUT, DELETE), call it multiple times with the same input and assert the result and system state are identical each time. For POST, the same call repeated should typically create multiple distinct resources, unless idempotency keys are explicitly supported.', level: 'Advanced' },
      { q: 'How do you handle authentication token expiry in an automated test suite?', a: 'Generate a fresh token at the start of a test run (or per test) via the auth endpoint rather than hardcoding one, and add a dedicated test that verifies an expired/invalid token correctly returns 401.', level: 'Advanced' },
    ],
    roadmap: ['HTTP & REST basics', 'Status codes & headers', 'Authentication patterns', 'Schema & contract testing', 'Negative & edge-case testing', 'API automation frameworks (RestAssured/Postman/Playwright APIRequest)'],
  },

  java: {
    id: 'java', glyph: 'JV', name: 'Java', difficulty: 'Beginner',
    tagline: 'The language behind most enterprise automation frameworks.',
    intro: `Java remains the most common language for enterprise test automation frameworks, largely because Selenium, TestNG, JUnit, and Cucumber all have first-class Java support. You don't need to be a software engineer — you need the subset of Java that automation actually uses.`,
    concepts: [
      { title: 'OOP Fundamentals', text: 'Classes, objects, inheritance, and interfaces are the backbone of the Page Object Model and most framework design — understanding them is non-negotiable for maintainable automation.' },
      { title: 'Collections', text: 'List, Set, and Map are used constantly: storing multiple WebElements, deduplicating test data, or mapping test data keys to values.' },
      { title: 'Exception Handling', text: 'try/catch/finally lets you gracefully handle expected failures (like StaleElementReferenceException) instead of letting one bad element crash an entire suite.' },
      { title: 'Streams & Lambdas', text: 'Modern Java code filters and transforms lists functionally — e.g., filtering a List<WebElement> by visibility — instead of verbose for-loops.' },
      { title: 'Annotations', text: '@Test, @BeforeMethod, @Override and custom annotations drive how testing frameworks discover and run your code — understanding them demystifies "framework magic".' },
      { title: 'Access Modifiers & Encapsulation', text: 'public, private, and protected control what other classes can see — critical for designing clean Page Object classes that hide internal locators.' },
    ],
    examples: [
      { title: 'A simple Page Object class', code: `public class LoginPage {
    private WebDriver driver;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
    }

    public void login(String user, String pass) {
        driver.findElement(By.id("user")).sendKeys(user);
        driver.findElement(By.id("pass")).sendKeys(pass);
        driver.findElement(By.id("submit")).click();
    }
}` },
      { title: 'Using Streams to filter test data', code: `List<String> activeUsers = users.stream()
    .filter(u -> u.getStatus().equals("active"))
    .map(User::getName)
    .collect(Collectors.toList());` },
      { title: 'Exception handling around a flaky interaction', code: `try {
    driver.findElement(By.id("banner")).click();
} catch (StaleElementReferenceException e) {
    driver.findElement(By.id("banner")).click(); // retry once
}` },
    ],
    bestPractices: [
      'Use meaningful class and method names — testLoginWithInvalidPassword(), not test3().',
      'Keep test logic and Page Object logic separate; a test method should read like plain English.',
      'Favor composition over deep inheritance chains in framework design — easier to maintain.',
      'Don\'t catch exceptions just to silence them; log or rethrow so failures stay visible.',
      'Use constants for test data (URLs, credentials) instead of scattering magic strings.',
    ],
    interviewQuestions: [
      { q: 'What is the difference between == and .equals() in Java?', a: '== compares references (memory addresses) for objects, or primitive values directly. .equals() compares logical/content equality, which is what you almost always want when comparing Strings or objects.', level: 'Beginner' },
      { q: 'What is the difference between an abstract class and an interface?', a: 'An abstract class can have both implemented and unimplemented methods and supports single inheritance. An interface (pre-Java 8) only declares method signatures and a class can implement multiple interfaces — useful for defining contracts like "Page" across multiple page classes.', level: 'Beginner' },
      { q: 'Why is the Page Object Model implemented using classes?', a: 'Each page becomes a class encapsulating its locators and actions. Test classes then depend on these page classes rather than raw locators, so a UI change only requires updating one class instead of every test.', level: 'Intermediate' },
      { q: 'What is method overloading vs overriding?', a: 'Overloading is having multiple methods with the same name but different parameters in the same class, resolved at compile time. Overriding is a subclass providing its own implementation of a method already defined in its parent class, resolved at runtime.', level: 'Intermediate' },
      { q: 'How would you design a generic retry mechanism in Java for flaky test steps?', a: 'Write a generic method that accepts a Supplier or Runnable, wraps the call in a loop with a max retry count, catches the specific transient exception (like StaleElementReferenceException), and rethrows after the final attempt fails — keeping retry logic in one reusable place rather than duplicated per test.', level: 'Advanced' },
      { q: 'What is the difference between checked and unchecked exceptions, and which matters more in test automation?', a: 'Checked exceptions must be declared or handled at compile time (e.g. IOException); unchecked ones (like RuntimeException and its subclasses, which most Selenium exceptions extend) don\'t require explicit handling. In automation, most exceptions you handle day-to-day are unchecked, but understanding checked exceptions matters when integrating with file I/O or external libraries.', level: 'Advanced' },
    ],
    roadmap: ['Syntax, variables & control flow', 'OOP: classes, inheritance, interfaces', 'Collections & generics', 'Exception handling', 'Streams & lambdas', 'Framework design patterns (POM, Factory, Singleton)'],
  },

  sql: {
    id: 'sql', glyph: 'SQL', name: 'SQL', difficulty: 'Beginner',
    tagline: "Verify the data layer your application's UI never shows you.",
    intro: `SQL lets you verify what actually happened in the database — independent of what the UI claims happened. Backend validation through SQL queries catches bugs that purely UI-level testing structurally cannot see.`,
    concepts: [
      { title: 'SELECT & Filtering', text: 'SELECT, WHERE, ORDER BY, and LIMIT are the foundation — retrieving exactly the rows you need to verify a test outcome.' },
      { title: 'JOINs', text: 'INNER, LEFT, RIGHT, and FULL joins combine related tables — essential when verifying data that spans, say, an orders table and a customers table.' },
      { title: 'Aggregate Functions', text: 'COUNT, SUM, AVG, MIN, MAX with GROUP BY let you verify totals and summaries — e.g., confirming an order count matches what the UI dashboard displays.' },
      { title: 'Constraints & Data Integrity', text: 'PRIMARY KEY, FOREIGN KEY, UNIQUE, and NOT NULL define what should be structurally impossible — useful for designing negative tests that try to violate them.' },
      { title: 'Transactions', text: 'BEGIN, COMMIT, and ROLLBACK group operations atomically. Understanding transactions matters when testing scenarios involving partial failures.' },
      { title: 'Indexes & Query Performance', text: 'Indexes speed up reads at the cost of slower writes. As a tester, knowing this helps you reason about why a query might be slow in a performance test.' },
    ],
    examples: [
      { title: 'Verifying an order was created correctly', code: `SELECT order_id, status, total_amount
FROM orders
WHERE customer_id = 1042
ORDER BY created_at DESC
LIMIT 1;` },
      { title: 'JOIN to verify related data', code: `SELECT o.order_id, c.email, o.status
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
WHERE o.order_id = 9981;` },
      { title: 'Aggregate check matching UI dashboard', code: `SELECT status, COUNT(*) AS total
FROM orders
WHERE created_at >= CURRENT_DATE
GROUP BY status;` },
    ],
    bestPractices: [
      'Never run destructive queries (UPDATE/DELETE without WHERE) against shared environments — scope them tightly and double-check WHERE clauses.',
      'Use a read replica or test database for verification queries when possible, to avoid impacting production data.',
      'Combine UI assertions with a backend SQL check for critical flows — confirming both layers agree catches more bugs.',
      'Parameterize queries in automated checks; never concatenate raw test data into SQL strings (SQL injection risk applies to test tooling too).',
      'Know your schema — keep an ER diagram or schema reference handy so JOINs are written correctly, not guessed.',
    ],
    interviewQuestions: [
      { q: 'What is the difference between WHERE and HAVING?', a: 'WHERE filters individual rows before any grouping happens. HAVING filters groups after a GROUP BY and aggregate functions have been applied.', level: 'Beginner' },
      { q: 'What is the difference between INNER JOIN and LEFT JOIN?', a: 'INNER JOIN returns only rows with matches in both tables. LEFT JOIN returns all rows from the left table, with NULLs filled in for unmatched columns from the right table.', level: 'Beginner' },
      { q: 'How would you find duplicate records in a table?', a: 'Group by the column(s) that should be unique and filter with HAVING COUNT(*) > 1, e.g. SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1.', level: 'Intermediate' },
      { q: 'What is a primary key vs a foreign key?', a: 'A primary key uniquely identifies each row in its own table. A foreign key is a column in one table that references a primary key in another, enforcing referential integrity between them.', level: 'Intermediate' },
      { q: 'How would you test that a database transaction rolled back correctly on failure?', a: 'Trigger the failing condition within the transaction, then query the affected tables afterward and assert none of the partial changes persisted — the state should match exactly what existed before the transaction began.', level: 'Advanced' },
      { q: 'How do indexes affect testing strategy for a high-write system?', a: 'Indexes speed up SELECTs but slow down INSERT/UPDATE/DELETE since each index must also update. When testing a write-heavy feature, it\'s worth verifying performance isn\'t regressed by an over-indexed table, alongside checking correctness.', level: 'Advanced' },
    ],
    roadmap: ['SELECT, WHERE, ORDER BY', 'JOINs across tables', 'Aggregate functions & GROUP BY', 'Subqueries', 'Constraints & data integrity', 'Transactions & isolation levels'],
  },

  git: {
    id: 'git', glyph: 'GIT', name: 'Git', difficulty: 'Beginner',
    tagline: 'Version control for your test code, not just production code.',
    intro: `Test automation code lives in the same repositories as production code, and is managed with the same Git workflows. Every automation engineer needs to be comfortable branching, merging, and resolving conflicts — in test files just as much as application code.`,
    concepts: [
      { title: 'Commits & History', text: 'Each commit is a snapshot of your repo at a point in time. A clean, atomic commit history makes it possible to bisect and find exactly which change introduced a test failure.' },
      { title: 'Branching', text: 'Feature branches let you write or update tests in isolation without affecting the main suite until reviewed and merged.' },
      { title: 'Merging & Rebasing', text: 'Merge preserves full history with a merge commit; rebase replays your commits on top of the latest main, producing a linear history. Teams pick one convention and use it consistently.' },
      { title: 'Conflict Resolution', text: 'When two branches change the same lines, Git can\'t auto-merge — you manually choose which changes to keep. This happens often in shared test files like locator repositories.' },
      { title: 'Pull Requests / Code Review', text: 'PRs are where test code gets reviewed before merging — catching bad locators, missing assertions, or flaky patterns before they hit the main branch.' },
      { title: '.gitignore for Test Artifacts', text: 'Test output (screenshots, videos, reports, node_modules) shouldn\'t be committed — .gitignore keeps the repo clean and reviews focused on actual code changes.' },
    ],
    examples: [
      { title: 'Creating a feature branch for new tests', code: `git checkout -b feature/add-checkout-tests
git add tests/checkout.spec.ts
git commit -m "Add checkout flow test coverage"
git push origin feature/add-checkout-tests` },
      { title: 'Resolving a merge conflict in a locator file', code: `git merge main
# CONFLICT (content): Merge conflict in pages/CheckoutPage.java
# Open the file, manually choose correct locator, remove conflict markers
git add pages/CheckoutPage.java
git commit -m "Resolve locator conflict with main"` },
      { title: 'Useful .gitignore for a test repo', code: `node_modules/
test-results/
playwright-report/
*.log
.env` },
    ],
    bestPractices: [
      'Write small, focused commits — "Add login test" not "Fix stuff" with 40 files changed.',
      'Never commit secrets or tokens, even in test config — use environment variables and .gitignore.',
      'Rebase feature branches onto main before opening a PR to avoid messy merge commits.',
      'Review test code with the same rigor as production code — bad locators are bugs too.',
      'Tag stable releases of your test suite so you can quickly check out "what tests looked like" at a given release.',
    ],
    interviewQuestions: [
      { q: 'What is the difference between git merge and git rebase?', a: 'Merge combines two branch histories with a new merge commit, preserving exactly what happened. Rebase rewrites your branch\'s commits to apply on top of the target branch, producing a cleaner, linear history but altering commit hashes.', level: 'Beginner' },
      { q: 'What is the difference between git fetch and git pull?', a: 'git fetch downloads new commits from the remote without changing your working branch. git pull does a fetch followed by a merge (or rebase) into your current branch automatically.', level: 'Beginner' },
      { q: 'How do you resolve a merge conflict?', a: 'Git marks the conflicting sections in the file with <<<<<<<, =======, and >>>>>>> markers. You edit the file to keep the correct content, remove the markers, then git add and commit to mark the conflict resolved.', level: 'Intermediate' },
      { q: 'What is git stash used for?', a: 'It temporarily shelves uncommitted changes so you can switch branches cleanly, then reapply them later with git stash pop — useful when you need to quickly fix something on another branch mid-work.', level: 'Intermediate' },
      { q: 'How would you find which commit introduced a specific test failure?', a: 'Use git bisect, which performs a binary search through commit history — you mark commits as good or bad, and it narrows down to the exact commit that introduced the regression.', level: 'Advanced' },
      { q: 'What is the difference between git reset --soft, --mixed, and --hard?', a: '--soft moves the branch pointer but keeps changes staged. --mixed (default) moves the pointer and unstages changes but keeps them in the working directory. --hard moves the pointer and discards all changes completely, including working directory edits.', level: 'Advanced' },
    ],
    roadmap: ['Init, add, commit, push', 'Branching strategies', 'Merge vs rebase', 'Resolving conflicts', 'Pull requests & code review', 'Git bisect, stash, cherry-pick'],
  },

  jenkins: {
    id: 'jenkins', glyph: 'JK', name: 'Jenkins', difficulty: 'Intermediate',
    tagline: 'Run your test suite automatically, on every change.',
    intro: `Jenkins is a widely used automation server that runs your test suite automatically — on every commit, on a schedule, or on demand — and reports results without anyone needing to run tests manually. Understanding CI is what separates "I wrote some Selenium scripts" from "I built a test automation pipeline."`,
    concepts: [
      { title: 'Jobs & Pipelines', text: 'A Jenkins "job" runs a defined set of steps. Modern Jenkins favors Pipelines defined in code (Jenkinsfile) over manually configured Freestyle jobs.' },
      { title: 'Jenkinsfile & Pipeline as Code', text: 'A Jenkinsfile, written in Groovy-based DSL, defines stages (Build, Test, Deploy) as version-controlled code that lives alongside your application.' },
      { title: 'Triggers', text: 'Pipelines can run on a webhook (push to repo), a schedule (cron-style), or manually — choosing the right trigger affects how fast your team gets feedback.' },
      { title: 'Agents & Distributed Builds', text: 'Jenkins can distribute work across multiple agent machines, letting you run test suites in parallel across different environments or browsers.' },
      { title: 'Plugins', text: 'Plugins integrate Jenkins with everything from Git and Docker to test reporting tools like Allure or JUnit XML report rendering.' },
      { title: 'Test Reporting', text: 'Jenkins can parse JUnit-style XML test results and display pass/fail trends over time directly on the build page — critical for spotting flaky tests early.' },
    ],
    examples: [
      { title: 'A simple declarative Jenkinsfile', code: `pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps { git 'https://github.com/team/repo.git' }
        }
        stage('Install') {
            steps { sh 'npm install' }
        }
        stage('Run Tests') {
            steps { sh 'npx playwright test' }
        }
    }
    post {
        always {
            junit 'test-results/*.xml'
        }
    }
}` },
      { title: 'Triggering on every pull request', code: `pipeline {
    agent any
    triggers {
        githubPullRequest()
    }
    stages {
        stage('Test') {
            steps { sh 'mvn test' }
        }
    }
}` },
    ],
    bestPractices: [
      'Keep the Jenkinsfile in the same repo as the code it tests — pipeline as code, version controlled like everything else.',
      'Fail fast: run the quickest, highest-signal tests first so broken builds are caught in seconds, not after a 40-minute suite.',
      'Archive test reports and artifacts (screenshots, videos) on failure so debugging doesn\'t require re-running the build.',
      'Use parallel stages to run cross-browser or cross-environment suites concurrently rather than sequentially.',
      'Alert the team (Slack/email) only on status changes (pass→fail, fail→pass), not on every single run — alert fatigue kills signal.',
    ],
    interviewQuestions: [
      { q: 'What is a Jenkinsfile?', a: 'A text file, written in Groovy-based Pipeline DSL, that defines your build/test/deploy pipeline as code. It\'s checked into version control alongside the application so the pipeline evolves with the codebase.', level: 'Beginner' },
      { q: 'What is the difference between Declarative and Scripted pipelines?', a: 'Declarative pipelines use a simpler, structured syntax (pipeline { stages { ... } }) that\'s easier to read and validate. Scripted pipelines use full Groovy code for more flexibility but are harder to maintain.', level: 'Beginner' },
      { q: 'How would you set up a pipeline to run tests only on pull requests?', a: 'Configure a webhook trigger (e.g. GitHub Branch Source plugin) so Jenkins listens for PR events, and scope a pipeline stage or separate job specifically to run on that trigger rather than every push to main.', level: 'Intermediate' },
      { q: 'How does Jenkins integrate with test reporting tools?', a: 'Via plugins — the JUnit plugin parses XML test result files and renders pass/fail trend graphs on the build page; other plugins integrate richer reporting tools like Allure for more detailed dashboards.', level: 'Intermediate' },
      { q: 'How would you design a Jenkins pipeline to run a large UI test suite efficiently?', a: 'Split the suite into independent shards or tags, run them in parallel across multiple agents/stages, fail the build fast on a smoke-test stage before running the full suite, and archive failure artifacts (screenshots, traces) for debugging without re-running locally.', level: 'Advanced' },
      { q: 'What are Jenkins agents and why would you use multiple?', a: 'Agents are machines (or containers) that execute pipeline steps. Using multiple agents lets you distribute work — running different OS/browser combinations in parallel, or isolating heavy builds from the Jenkins controller itself for stability.', level: 'Advanced' },
    ],
    roadmap: ['Jobs vs Pipelines', 'Writing a Jenkinsfile', 'Triggers & webhooks', 'Test report integration', 'Parallel & distributed builds', 'Pipeline security & credentials'],
  },

  testng: {
    id: 'testng', glyph: 'TNG', name: 'TestNG', difficulty: 'Intermediate',
    tagline: 'A testing framework purpose-built for complex automation suites.',
    intro: `TestNG is a Java testing framework inspired by JUnit but built specifically to handle the needs of test automation: flexible test configuration, grouping, parallel execution, and data-driven testing — features that matter once your Selenium suite grows past a handful of tests.`,
    concepts: [
      { title: 'Annotations', text: '@Test, @BeforeMethod, @AfterMethod, @BeforeClass, @BeforeSuite and their @After counterparts define setup/teardown at different scopes — from a single test up to an entire suite.' },
      { title: 'testng.xml Suite Configuration', text: 'An XML file defines which test classes run, in what order, with what parameters, and how many threads — all without touching Java code.' },
      { title: 'Data Providers', text: '@DataProvider lets one test method run multiple times with different input data — essential for testing the same flow across many input combinations.' },
      { title: 'Groups', text: 'Tests can be tagged into groups (e.g. "smoke", "regression") and run selectively — running only smoke tests in a fast CI check, full regression nightly.' },
      { title: 'Parallel Execution', text: 'TestNG can run test methods, classes, or entire suites in parallel threads, configured directly in testng.xml — dramatically cutting suite runtime.' },
      { title: 'Assertions & Soft Assertions', text: 'Regular Assert stops a test on first failure. SoftAssert collects all failures and reports them together at the end — useful when checking multiple independent fields on one page.' },
    ],
    examples: [
      { title: 'Basic TestNG test class', code: `public class LoginTest {
    WebDriver driver;

    @BeforeMethod
    public void setup() {
        driver = new ChromeDriver();
    }

    @Test
    public void validLoginSucceeds() {
        driver.get("https://example.com/login");
        // ... perform login ...
        Assert.assertTrue(driver.getTitle().contains("Dashboard"));
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}` },
      { title: 'Data-driven test with @DataProvider', code: `@DataProvider(name = "loginData")
public Object[][] loginData() {
    return new Object[][] {
        { "user1", "pass1", true },
        { "user2", "wrongpass", false },
    };
}

@Test(dataProvider = "loginData")
public void testLogin(String user, String pass, boolean shouldSucceed) {
    // ... use parameters in the test ...
}` },
      { title: 'testng.xml with groups and parallel threads', code: `<suite name="RegressionSuite" parallel="methods" thread-count="4">
  <test name="SmokeTests">
    <groups>
      <run><include name="smoke"/></run>
    </groups>
    <classes>
      <class name="tests.LoginTest"/>
    </classes>
  </test>
</suite>` },
    ],
    bestPractices: [
      'Use groups deliberately ("smoke", "regression", "api") so CI can run the right subset at the right time.',
      'Prefer @DataProvider over copy-pasted test methods for the same flow with different inputs.',
      'Use SoftAssert only when checking genuinely independent values; use hard Assert when one failure makes the rest meaningless.',
      'Keep testng.xml under version control — suite configuration is part of your test infrastructure, not a throwaway file.',
      'Be cautious enabling parallel="methods" on suites with shared state (like a single static WebDriver) — it causes hard-to-debug race conditions.',
    ],
    interviewQuestions: [
      { q: 'What is the difference between @BeforeMethod and @BeforeClass?', a: '@BeforeMethod runs before every single @Test method in the class. @BeforeClass runs once, before any test methods in that class run — useful for expensive one-time setup like opening a browser.', level: 'Beginner' },
      { q: 'What is a DataProvider in TestNG?', a: 'A method annotated @DataProvider that returns a 2D array (or Iterator) of test data. A @Test method referencing it runs once per row of data, enabling data-driven testing without duplicating test methods.', level: 'Beginner' },
      { q: 'What is the difference between Assert and SoftAssert?', a: 'Assert (hard assertion) throws immediately on failure, stopping the test right there. SoftAssert collects failures without stopping execution, and you call assertAll() at the end to report everything that failed together.', level: 'Intermediate' },
      { q: 'How do you run only a subset of tests using TestNG groups?', a: 'Annotate tests with @Test(groups = {"smoke"}), then in testng.xml use <groups><run><include name="smoke"/></run></groups> to restrict execution to just that group.', level: 'Intermediate' },
      { q: 'How would you implement retry logic for flaky tests in TestNG?', a: 'Implement the IRetryAnalyzer interface with custom retry-count logic, then attach it via @Test(retryAnalyzer = MyRetry.class) — TestNG will automatically re-run a failed test up to the configured number of attempts before marking it failed.', level: 'Advanced' },
      { q: 'How does TestNG handle test dependencies, and when is that risky?', a: '@Test(dependsOnMethods = {"login"}) makes a test run only after another passes. It\'s useful for genuinely sequential flows, but risky as a crutch — over-using dependencies creates brittle suites where one failure cascades and hides unrelated bugs.', level: 'Advanced' },
    ],
    roadmap: ['Annotations & test lifecycle', 'testng.xml suite configuration', 'Data providers', 'Groups & selective execution', 'Parallel execution', 'Listeners & custom reporting'],
  },

  junit: {
    id: 'junit', glyph: 'JU', name: 'JUnit', difficulty: 'Beginner',
    tagline: 'The standard unit testing framework underneath most Java tooling.',
    intro: `JUnit is the most widely used testing framework in the Java ecosystem — many build tools, IDEs, and CI systems have first-class JUnit support out of the box. Even teams using TestNG for end-to-end suites often use JUnit for unit-level testing of utility code.`,
    concepts: [
      { title: 'JUnit 5 Architecture', text: 'JUnit 5 splits into JUnit Platform (test execution), JUnit Jupiter (the new programming model with @Test etc.), and JUnit Vintage (backward compatibility for JUnit 4).' },
      { title: 'Lifecycle Annotations', text: '@BeforeEach, @AfterEach, @BeforeAll, @AfterAll mirror TestNG\'s lifecycle hooks, controlling setup/teardown at the method or class level.' },
      { title: 'Assertions', text: 'assertEquals, assertTrue, assertThrows and assertAll (for grouped/soft-style assertions) form the core verification vocabulary.' },
      { title: 'Parameterized Tests', text: '@ParameterizedTest with @ValueSource, @CsvSource, or @MethodSource runs the same test logic across multiple inputs — JUnit\'s equivalent of TestNG\'s DataProvider.' },
      { title: 'Tags', text: '@Tag("smoke") lets you categorize tests and selectively run subsets via Maven/Gradle filters or CI configuration.' },
      { title: 'Extensions', text: 'JUnit 5\'s extension model (@ExtendWith) lets you hook into the test lifecycle for custom behavior — like injecting a shared WebDriver instance.' },
    ],
    examples: [
      { title: 'Basic JUnit 5 test', code: `class CalculatorTest {

    @Test
    void addsTwoNumbers() {
        Calculator calc = new Calculator();
        assertEquals(5, calc.add(2, 3));
    }

    @Test
    void throwsOnDivideByZero() {
        Calculator calc = new Calculator();
        assertThrows(ArithmeticException.class, () -> calc.divide(10, 0));
    }
}` },
      { title: 'Parameterized test with CSV source', code: `@ParameterizedTest
@CsvSource({
    "user1, pass1, true",
    "user2, wrongpass, false"
})
void testLogin(String user, String pass, boolean expected) {
    assertEquals(expected, authService.login(user, pass));
}` },
      { title: 'Grouped assertions', code: `@Test
void userProfileFieldsAreCorrect() {
    User user = userService.get(101);
    assertAll(
        () -> assertEquals("Asha Rao", user.getName()),
        () -> assertEquals("active", user.getStatus()),
        () -> assertTrue(user.getEmail().contains("@"))
    );
}` },
    ],
    bestPractices: [
      'Name test methods descriptively — shouldThrowExceptionWhenDividingByZero(), not test2().',
      'Use assertAll() to check multiple related fields together so you see every failure, not just the first.',
      'Keep unit tests fast and isolated — no real network calls or database hits; mock dependencies instead.',
      'Use @Tag to separate fast unit tests from slower integration tests, and run them as separate CI stages.',
      'Prefer @ParameterizedTest over near-duplicate test methods that only differ by input values.',
    ],
    interviewQuestions: [
      { q: 'What is the difference between @BeforeEach and @BeforeAll?', a: '@BeforeEach runs before every test method, ideal for resetting state. @BeforeAll runs once before all tests in the class and must be static, used for expensive shared setup.', level: 'Beginner' },
      { q: 'How do you assert that an exception is thrown in JUnit 5?', a: 'Use assertThrows(ExceptionType.class, () -> { code that should throw }) — it returns the thrown exception so you can make further assertions on its message if needed.', level: 'Beginner' },
      { q: 'What is the purpose of assertAll()?', a: 'It groups multiple assertions so that all of them execute and report their results together, even if earlier ones fail — rather than stopping at the first failed assertion like a normal sequence of asserts would.', level: 'Intermediate' },
      { q: 'How do parameterized tests work in JUnit 5?', a: 'Annotate a method with @ParameterizedTest and a source annotation like @ValueSource, @CsvSource, or @MethodSource that supplies the input values; JUnit then runs the test once per supplied value or row.', level: 'Intermediate' },
      { q: 'What are JUnit 5 extensions and how do they differ from JUnit 4 rules?', a: 'Extensions (@ExtendWith) are JUnit 5\'s unified mechanism for hooking into the test lifecycle — replacing both JUnit 4\'s @Rule and runner-based approaches with a single, more composable extension model.', level: 'Advanced' },
      { q: 'How would you structure JUnit tests to run alongside Selenium in a hybrid framework?', a: 'Use a JUnit 5 extension to manage WebDriver setup/teardown around each test method (similar to TestNG\'s @BeforeMethod), and use @Tag to separate fast unit tests from slower Selenium-driven UI tests so CI can run them in distinct, appropriately-scheduled stages.', level: 'Advanced' },
    ],
    roadmap: ['@Test basics & assertions', 'Lifecycle hooks', 'Parameterized tests', 'Tags & selective execution', 'Extensions', 'Integrating with Maven/Gradle & CI'],
  },

  cucumber: {
    id: 'cucumber', glyph: 'CK', name: 'Cucumber BDD', difficulty: 'Intermediate',
    tagline: 'Write tests that double as living documentation, in plain English.',
    intro: `Cucumber implements Behavior-Driven Development (BDD) — writing test scenarios in plain, structured English (Gherkin) that both business stakeholders and engineers can read. The same file that defines "what should happen" is the file that actually drives the automated test.`,
    concepts: [
      { title: 'Gherkin Syntax', text: 'Feature, Scenario, Given, When, Then, And — a small, structured vocabulary for describing behavior in natural language that maps directly to code.' },
      { title: 'Step Definitions', text: 'Each Gherkin line (e.g. "Given I am logged in") maps to a method in code via regex or Cucumber expressions — this is where the actual automation logic lives.' },
      { title: 'Feature Files', text: 'A .feature file groups related scenarios under one feature, often written collaboratively with QA, developers, and product/business stakeholders.' },
      { title: 'Scenario Outline & Examples', text: 'Like a data provider — one scenario template runs multiple times against different rows in an Examples table, avoiding duplicated near-identical scenarios.' },
      { title: 'Hooks', text: '@Before and @After hooks run setup/teardown logic around every scenario, similar to TestNG/JUnit lifecycle annotations.' },
      { title: 'Tags', text: '@smoke, @regression style tags on scenarios let you run targeted subsets, exactly like TestNG groups or JUnit tags.' },
    ],
    examples: [
      { title: 'A Gherkin feature file', code: `Feature: Login

  Scenario: Valid credentials log the user in
    Given I am on the login page
    When I enter username "qa_user" and password "Secret123"
    And I click the login button
    Then I should see the dashboard

  Scenario Outline: Invalid credentials show an error
    Given I am on the login page
    When I enter username "<user>" and password "<pass>"
    Then I should see an error message

    Examples:
      | user     | pass        |
      | qa_user  | wrongpass   |
      | baduser  | Secret123   |` },
      { title: 'Matching step definitions in Java', code: `public class LoginSteps {

    @Given("I am on the login page")
    public void navigateToLogin() {
        driver.get("https://example.com/login");
    }

    @When("I enter username {string} and password {string}")
    public void enterCredentials(String user, String pass) {
        driver.findElement(By.id("user")).sendKeys(user);
        driver.findElement(By.id("pass")).sendKeys(pass);
    }

    @Then("I should see the dashboard")
    public void verifyDashboard() {
        assertTrue(driver.getTitle().contains("Dashboard"));
    }
}` },
    ],
    bestPractices: [
      'Write scenarios from the user\'s perspective and outcome, not implementation detail — "Then I should see an error" not "Then the error div has class red".',
      'Keep step definitions thin — delegate actual interaction logic to Page Object classes, don\'t inline Selenium calls in step methods.',
      'Reuse step definitions across features where the action is genuinely identical — duplication defeats the purpose of living documentation.',
      'Use Scenario Outline + Examples for repetitive variations instead of copy-pasting near-identical scenarios.',
      'Involve actual stakeholders in writing/reviewing feature files — if only engineers read them, you\'ve lost BDD\'s main benefit.',
    ],
    interviewQuestions: [
      { q: 'What is Gherkin?', a: 'A structured, plain-language syntax (Feature, Scenario, Given/When/Then) used to write Cucumber test scenarios in a way that\'s readable by both technical and non-technical stakeholders.', level: 'Beginner' },
      { q: 'What is a step definition?', a: 'A code method that implements the actual behavior behind a Gherkin step line, matched via a regex or Cucumber expression — it\'s where the real automation logic executes when that step runs.', level: 'Beginner' },
      { q: 'What is the difference between Scenario and Scenario Outline?', a: 'A Scenario runs once with hardcoded values. A Scenario Outline is a template that runs once per row in its Examples table, letting you test multiple input variations without duplicating the scenario.', level: 'Intermediate' },
      { q: 'How do Cucumber hooks work?', a: '@Before and @After methods run automatically around every scenario (optionally scoped to specific tags), used for setup like launching a browser and teardown like closing it — similar to TestNG\'s @BeforeMethod/@AfterMethod.', level: 'Intermediate' },
      { q: 'How would you avoid step definition duplication across a large Cucumber suite?', a: 'Write step definitions generically and parameterized rather than scenario-specific, organize them by domain area rather than by feature file, and grep/search before adding a new step to check whether an existing one already covers that action.', level: 'Advanced' },
      { q: 'What are common pitfalls when scaling BDD across a large team?', a: 'Feature files becoming too technical (losing the "living documentation" value), step definitions growing inconsistent or duplicated across teams, and scenarios becoming so granular they\'re effectively unit tests in disguise rather than genuine behavior descriptions.', level: 'Advanced' },
    ],
    roadmap: ['Gherkin syntax basics', 'Writing feature files', 'Step definitions', 'Scenario Outline & Examples', 'Hooks & tags', 'Integrating Cucumber with Selenium/Playwright + CI'],
  },

};

const TOPIC_ORDER = ['selenium', 'playwright', 'apiTesting', 'java', 'sql', 'git', 'jenkins', 'testng', 'junit', 'cucumber'];
