/* ============================================================
   QUIZ QUESTION BANK
   Each topic has 8 MCQ questions: { q, options[4], correct (index), explanation }
   ============================================================ */

const QUIZ_BANK = {
  selenium: {
    name: 'Selenium', glyph: 'SE',
    questions: [
      { q: 'Which method returns a list of all matching elements without throwing if none are found?', options: ['findElement()', 'findElements()', 'getElement()', 'locateAll()'], correct: 1, explanation: 'findElements() always returns a List — empty if nothing matches — while findElement() throws NoSuchElementException.' },
      { q: 'What is the recommended way to wait for an element to become clickable?', options: ['Thread.sleep(5000)', 'Implicit wait only', 'Explicit WebDriverWait with ExpectedConditions', 'No wait needed'], correct: 2, explanation: 'Explicit waits target a specific condition on a specific element, making tests faster and more reliable than fixed sleeps.' },
      { q: 'Which class is used for complex interactions like drag-and-drop or hover?', options: ['JavascriptExecutor', 'Actions', 'WebDriverWait', 'Select'], correct: 1, explanation: 'The Actions class builds low-level interactions like mouse movement, hover, and drag-and-drop.' },
      { q: 'What does the Page Object Model primarily separate?', options: ['Browsers from drivers', 'Locators/page logic from test logic', 'Java from JavaScript', 'Local from remote execution'], correct: 1, explanation: 'POM isolates page structure and interactions into dedicated classes, keeping test methods focused on test logic.' },
      { q: 'Which exception typically indicates the DOM element you referenced was re-rendered?', options: ['NoSuchElementException', 'TimeoutException', 'StaleElementReferenceException', 'ElementNotInteractableException'], correct: 2, explanation: 'StaleElementReferenceException means the element reference no longer points to a node attached to the current DOM.' },
      { q: 'How do you switch control to a different browser window?', options: ['driver.switchTo().window(handle)', 'driver.switchTo().frame(handle)', 'driver.changeWindow(handle)', 'driver.focus(handle)'], correct: 0, explanation: 'driver.switchTo().window(handle) moves WebDriver\'s focus to the specified window handle.' },
      { q: 'What locator strategy is generally most resistant to DOM structure changes?', options: ['Absolute XPath', 'Index-based locator', 'data-testid attribute', 'Tag name'], correct: 2, explanation: 'A dedicated test attribute like data-testid is stable because it doesn\'t depend on visual structure, styling, or position.' },
      { q: 'What is the W3C WebDriver protocol used for?', options: ['Styling web pages', 'Communication between test code and the browser driver', 'Compiling Java code', 'Running JavaScript in Node'], correct: 1, explanation: 'It defines the HTTP-based commands and responses exchanged between your Selenium client and the browser-specific driver.' },
    ],
  },
  playwright: {
    name: 'Playwright', glyph: 'PW',
    questions: [
      { q: 'What does Playwright do automatically before most actions?', options: ['Take a screenshot', 'Actionability checks (auto-waiting)', 'Clear cookies', 'Restart the browser'], correct: 1, explanation: 'Playwright waits for elements to be visible, stable, and enabled before interacting, removing most manual wait code.' },
      { q: 'What is a browser context in Playwright?', options: ['A CSS selector scope', 'An isolated, incognito-like session', 'A type of locator', 'A test file extension'], correct: 1, explanation: 'Each context has its own cookies and storage, enabling fast, isolated parallel test sessions in one browser instance.' },
      { q: 'Which locator method aligns with how a screen reader would identify an element?', options: ['page.locator(".class")', 'page.getByRole()', 'page.$()', 'page.querySelector()'], correct: 1, explanation: 'getByRole() locates elements by their accessible role and name, doubling as an accessibility check.' },
      { q: 'What does page.route() let you do?', options: ['Change the page URL', 'Intercept and modify network requests', 'Add new DOM elements', 'Switch frames'], correct: 1, explanation: 'page.route() intercepts matching requests so you can mock, modify, or block responses.' },
      { q: 'What does storageState let you reuse across tests?', options: ['Console logs', 'A logged-in session (cookies/storage)', 'Screenshot history', 'Network speed settings'], correct: 1, explanation: 'Saving and loading storageState lets tests start already authenticated instead of logging in every time.' },
      { q: 'What is the Trace Viewer used for?', options: ['Writing new tests faster', 'Visually replaying a test run to debug failures', 'Generating test data', 'Linting code'], correct: 1, explanation: 'Trace Viewer replays DOM snapshots, network calls, and console logs from a recorded test run.' },
      { q: 'Which browsers does Playwright support through one API?', options: ['Only Chromium', 'Chromium, Firefox, and WebKit', 'Only Chrome and Edge', 'Only headless browsers'], correct: 1, explanation: 'Playwright provides one consistent API across all three major browser engines.' },
      { q: 'By default, how isolated are tests in different files when run in parallel?', options: ['They share one browser context', 'Each gets its own isolated context', 'They share cookies', 'Isolation must be configured manually'], correct: 1, explanation: 'Playwright Test gives each test file its own browser context by default, preventing state leakage.' },
    ],
  },
  apiTesting: {
    name: 'API Testing', glyph: 'API',
    questions: [
      { q: 'Which HTTP method is used to partially update a resource?', options: ['PUT', 'PATCH', 'POST', 'GET'], correct: 1, explanation: 'PATCH updates only the fields included in the request body, leaving the rest of the resource untouched.' },
      { q: 'What does a 401 status code mean?', options: ['Resource not found', 'Server error', 'Missing or invalid authentication', 'Request succeeded'], correct: 2, explanation: '401 Unauthorized means the request lacks valid authentication credentials.' },
      { q: 'Which status code indicates a resource was successfully created?', options: ['200', '201', '204', '202'], correct: 1, explanation: '201 Created specifically signals that a new resource now exists as a result of the request.' },
      { q: 'What makes an HTTP method "idempotent"?', options: ['It always returns JSON', 'Repeating it has the same effect as calling it once', 'It requires authentication', 'It only reads data'], correct: 1, explanation: 'Idempotent methods (GET, PUT, DELETE) produce the same end state no matter how many times they\'re called with the same input.' },
      { q: 'What does schema validation check that value-only assertions miss?', options: ['Response time', 'Server location', 'Field names, types, and structure', 'HTTP version'], correct: 2, explanation: 'Schema validation confirms the response shape matches a contract — catching breaking changes like renamed fields.' },
      { q: 'What is the difference between 403 and 404?', options: ['No difference', '403 = forbidden but exists; 404 = doesn\'t exist', '403 = server error; 404 = client error', '404 is deprecated'], correct: 1, explanation: '403 means the resource exists but you lack permission; 404 means it can\'t be found at all (or is deliberately hidden).' },
      { q: 'Where is a Bearer token typically sent?', options: ['In the URL path', 'In the Authorization header', 'In a cookie only', 'In the response body'], correct: 1, explanation: 'Bearer tokens are conventionally sent as "Authorization: Bearer <token>" in the request header.' },
      { q: 'What status code range indicates a server-side failure?', options: ['2xx', '3xx', '4xx', '5xx'], correct: 3, explanation: '5xx codes mean the server itself failed to process an otherwise valid request.' },
    ],
  },
  java: {
    name: 'Java', glyph: 'JV',
    questions: [
      { q: 'What does == compare for objects in Java?', options: ['Logical content equality', 'Reference/memory address', 'String length', 'Hash code only'], correct: 1, explanation: '== compares object references; .equals() is needed for content/logical equality.' },
      { q: 'Which keyword allows a class to inherit from another?', options: ['implements', 'extends', 'inherits', 'super'], correct: 1, explanation: 'extends is used for class inheritance; implements is used for interfaces.' },
      { q: 'What collection type stores unique elements with no defined order?', options: ['List', 'Set', 'Map', 'Array'], correct: 1, explanation: 'Set enforces uniqueness and does not guarantee insertion order (depending on implementation).' },
      { q: 'Which exception type does NOT need to be declared or caught explicitly?', options: ['Checked exception', 'Unchecked exception', 'IOException', 'SQLException'], correct: 1, explanation: 'Unchecked exceptions (RuntimeException subclasses) don\'t require explicit handling at compile time.' },
      { q: 'What does a Java Stream\'s .filter() method do?', options: ['Sorts elements', 'Removes duplicates', 'Selects elements matching a condition', 'Converts to a List'], correct: 2, explanation: 'filter() keeps only elements that satisfy the given predicate.' },
      { q: 'What access modifier restricts a member to only its own class?', options: ['public', 'protected', 'private', 'default'], correct: 2, explanation: 'private members are accessible only within the declaring class.' },
      { q: 'What is method overloading?', options: ['A subclass redefining a parent method', 'Same method name, different parameters, same class', 'Calling a method recursively', 'Hiding a static method'], correct: 1, explanation: 'Overloading lets multiple methods share a name as long as their parameter lists differ.' },
      { q: 'Which annotation marks a method to run before each test in TestNG?', options: ['@Test', '@BeforeMethod', '@Override', '@FunctionalInterface'], correct: 1, explanation: '@BeforeMethod runs before every @Test method in the class.' },
    ],
  },
  sql: {
    name: 'SQL', glyph: 'SQL',
    questions: [
      { q: 'Which clause filters rows BEFORE grouping happens?', options: ['HAVING', 'WHERE', 'GROUP BY', 'ORDER BY'], correct: 1, explanation: 'WHERE filters individual rows; HAVING filters after grouping and aggregation.' },
      { q: 'Which JOIN returns all rows from the left table, with NULLs for unmatched right-table columns?', options: ['INNER JOIN', 'RIGHT JOIN', 'LEFT JOIN', 'CROSS JOIN'], correct: 2, explanation: 'LEFT JOIN keeps every row from the left table regardless of a match on the right.' },
      { q: 'What does COUNT(*) with GROUP BY typically help verify?', options: ['Query syntax', 'Totals/summaries per group', 'Table schema', 'Index usage'], correct: 1, explanation: 'GROUP BY with aggregate functions like COUNT lets you verify totals match what a UI dashboard displays.' },
      { q: 'What enforces that a column\'s value must reference an existing row in another table?', options: ['PRIMARY KEY', 'UNIQUE constraint', 'FOREIGN KEY', 'NOT NULL'], correct: 2, explanation: 'A FOREIGN KEY enforces referential integrity between two tables.' },
      { q: 'What command undoes changes made within an open transaction?', options: ['COMMIT', 'ROLLBACK', 'DELETE', 'REVERT'], correct: 1, explanation: 'ROLLBACK reverts all changes made since the transaction began.' },
      { q: 'What is a common downside of adding more indexes to a table?', options: ['Slower reads', 'Slower writes (INSERT/UPDATE/DELETE)', 'Less storage used', 'No downside'], correct: 1, explanation: 'Indexes speed up reads but every write must also update each index, slowing writes.' },
      { q: 'Which query finds duplicate emails in a users table?', options: ['SELECT * FROM users WHERE email IS NULL', 'SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1', 'SELECT DISTINCT email FROM users', 'DELETE FROM users WHERE email = NULL'], correct: 1, explanation: 'Grouping by email and filtering with HAVING COUNT(*) > 1 surfaces duplicates.' },
      { q: 'What does LIMIT do in a SELECT query?', options: ['Restricts which columns are returned', 'Restricts the number of rows returned', 'Adds a WHERE condition', 'Sorts the result set'], correct: 1, explanation: 'LIMIT caps how many rows the query returns, often paired with ORDER BY.' },
    ],
  },
  git: {
    name: 'Git', glyph: 'GIT',
    questions: [
      { q: 'What is the key difference between git merge and git rebase?', options: ['No difference', 'Rebase rewrites commit history onto a new base; merge preserves it with a merge commit', 'Merge deletes branches', 'Rebase only works on remote repos'], correct: 1, explanation: 'Rebase replays commits onto the target branch for a linear history; merge combines histories with an extra commit.' },
      { q: 'What does git fetch do that git pull does not?', options: ['Nothing — they\'re identical', 'Downloads commits without merging them into your branch', 'Pushes your changes', 'Deletes local branches'], correct: 1, explanation: 'git fetch only updates your local copy of remote branches; git pull also merges/rebases into your current branch.' },
      { q: 'What do the <<<<<<<, =======, >>>>>>> markers indicate?', options: ['A syntax error', 'A merge conflict needing manual resolution', 'A successful merge', 'A deleted file'], correct: 1, explanation: 'These markers surround the conflicting content from each branch during an unresolved merge conflict.' },
      { q: 'What is git stash used for?', options: ['Permanently deleting changes', 'Temporarily shelving uncommitted changes', 'Creating a new repository', 'Renaming a branch'], correct: 1, explanation: 'git stash sets aside uncommitted work so you can switch branches cleanly, then reapply it later.' },
      { q: 'Which command performs a binary search through history to find a regression?', options: ['git blame', 'git bisect', 'git log', 'git diff'], correct: 1, explanation: 'git bisect narrows down which commit introduced a bug by repeatedly testing midpoints between known good/bad commits.' },
      { q: 'What does git reset --hard do?', options: ['Keeps changes staged', 'Discards all changes completely, including working directory', 'Only moves the branch pointer', 'Creates a backup branch'], correct: 1, explanation: '--hard moves the branch pointer and discards all uncommitted changes in the working directory.' },
      { q: 'Where should test secrets/tokens be stored, NOT in a committed file?', options: ['In the README', 'In .gitignore-excluded env files or secret managers', 'In the test class as constants', 'In commit messages'], correct: 1, explanation: 'Secrets should never be committed; use environment variables or secret managers excluded via .gitignore.' },
      { q: 'What is the purpose of a pull request?', options: ['To delete a branch', 'To review changes before merging into a shared branch', 'To compile code', 'To run tests automatically with no review'], correct: 1, explanation: 'A PR is where code (and test code) gets reviewed before being merged into a shared branch like main.' },
    ],
  },
  jenkins: {
    name: 'Jenkins', glyph: 'JK',
    questions: [
      { q: 'What is a Jenkinsfile?', options: ['A log file', 'A pipeline defined as code, usually in Groovy DSL', 'A Java test file', 'A browser plugin'], correct: 1, explanation: 'A Jenkinsfile defines build/test/deploy stages as version-controlled pipeline code.' },
      { q: 'What is the main advantage of Declarative pipelines over Scripted pipelines?', options: ['More flexibility', 'Simpler, more structured syntax that\'s easier to validate', 'Faster execution', 'No need for agents'], correct: 1, explanation: 'Declarative pipelines trade some flexibility for a clearer, more constrained, easier-to-read structure.' },
      { q: 'What plugin commonly renders pass/fail trend graphs from XML test results?', options: ['Git plugin', 'JUnit plugin', 'Docker plugin', 'Slack plugin'], correct: 1, explanation: 'The JUnit plugin parses standard XML test result files and visualizes pass/fail trends on the build page.' },
      { q: 'What is a Jenkins agent?', options: ['A type of test assertion', 'A machine/container that executes pipeline steps', 'A browser extension', 'A Git branch'], correct: 1, explanation: 'Agents execute the actual work defined in pipeline stages, and multiple agents enable distributed/parallel builds.' },
      { q: 'Why use parallel stages in a pipeline?', options: ['To make logs harder to read', 'To run independent suites concurrently and reduce total runtime', 'To disable test reporting', 'It\'s required by Jenkins'], correct: 1, explanation: 'Parallel stages let independent test suites (e.g. different browsers) run concurrently instead of sequentially.' },
      { q: 'What triggers a pipeline to run automatically on every code push?', options: ['A cron schedule only', 'A webhook trigger', 'Manual button click only', 'Email notification'], correct: 1, explanation: 'A webhook from the source control system (e.g. GitHub) notifies Jenkins to start a build on push events.' },
      { q: 'What is "pipeline as code"?', options: ['Writing pipelines exclusively in Python', 'Defining the pipeline in a version-controlled file alongside the app', 'A deprecated Jenkins feature', 'Running pipelines without any configuration'], correct: 1, explanation: 'Pipeline as code means the build/test/deploy definition lives in the repo, versioned like any other code.' },
      { q: 'What should happen on test failure in a well-designed pipeline?', options: ['Nothing — failures are ignored', 'Artifacts (screenshots, logs) are archived for debugging', 'The pipeline deletes itself', 'The repository is reset'], correct: 1, explanation: 'Archiving failure artifacts lets engineers debug without needing to reproduce the failure locally first.' },
    ],
  },
  testng: {
    name: 'TestNG', glyph: 'TNG',
    questions: [
      { q: 'What is the difference between @BeforeMethod and @BeforeClass?', options: ['No difference', '@BeforeMethod runs before every test; @BeforeClass runs once for the class', '@BeforeClass runs more often', '@BeforeMethod is deprecated'], correct: 1, explanation: '@BeforeMethod fires before each @Test; @BeforeClass fires once before any tests in that class run.' },
      { q: 'What does @DataProvider enable?', options: ['Parallel execution only', 'Data-driven testing — running one test method with multiple input sets', 'Skipping tests', 'Custom reporting'], correct: 1, explanation: 'A method annotated @DataProvider supplies multiple rows of data, and the linked @Test runs once per row.' },
      { q: 'What is the key difference between Assert and SoftAssert?', options: ['No difference', 'Assert stops immediately on failure; SoftAssert collects failures and reports together', 'SoftAssert is faster', 'Assert only works with strings'], correct: 1, explanation: 'SoftAssert lets you check multiple independent conditions and see all failures together via assertAll().' },
      { q: 'How do you run only tests tagged "smoke"?', options: ['Delete other tests', 'Use groups in testng.xml to include only "smoke"', 'Rename test methods', 'It\'s not possible in TestNG'], correct: 1, explanation: 'testng.xml\'s <groups><run><include name="smoke"/></run></groups> restricts execution to that group.' },
      { q: 'What does parallel="methods" in testng.xml configure?', options: ['Parallel compilation', 'Running test methods concurrently across threads', 'Parallel git branches', 'Parallel browser installs'], correct: 1, explanation: 'It tells TestNG to execute test methods concurrently using the configured thread-count.' },
      { q: 'What interface lets you implement custom retry logic for flaky tests?', options: ['IRetryAnalyzer', 'IDataProvider', 'IAnnotation', 'ITestResult'], correct: 0, explanation: 'Implementing IRetryAnalyzer and attaching it via @Test(retryAnalyzer=...) enables automatic retries on failure.' },
      { q: 'Where is suite-level configuration (which classes run, thread count) typically defined?', options: ['pom.xml only', 'testng.xml', 'A .properties file', 'It cannot be configured'], correct: 1, explanation: 'testng.xml defines suite structure, included classes/groups, and execution settings like parallelism.' },
      { q: 'Why is overusing @Test(dependsOnMethods) risky?', options: ['It\'s not supported', 'One failure can cascade and hide unrelated bugs', 'It disables reporting', 'It only works with Selenium'], correct: 1, explanation: 'Heavy reliance on test dependencies creates brittle chains where an early failure masks everything downstream.' },
    ],
  },
  junit: {
    name: 'JUnit', glyph: 'JU',
    questions: [
      { q: 'What runs once before all tests in a JUnit 5 class?', options: ['@BeforeEach', '@BeforeAll', '@Test', '@AfterEach'], correct: 1, explanation: '@BeforeAll runs once before any test methods, and the method must be static.' },
      { q: 'How do you assert that a specific exception is thrown in JUnit 5?', options: ['try/catch only', 'assertThrows(Exception.class, () -> {...})', 'assertTrue(exception)', 'It cannot be tested'], correct: 1, explanation: 'assertThrows() executes the lambda and asserts the expected exception type is thrown.' },
      { q: 'What does assertAll() do?', options: ['Runs all test classes', 'Groups multiple assertions so all execute and report together', 'Skips failing assertions silently', 'Disables other assertions'], correct: 1, explanation: 'assertAll() ensures every assertion inside it runs and reports, rather than stopping at the first failure.' },
      { q: 'Which annotation supplies multiple input rows to one test method?', options: ['@Test', '@RepeatedTest', '@ParameterizedTest with a source annotation', '@Disabled'], correct: 2, explanation: '@ParameterizedTest combined with @ValueSource/@CsvSource/@MethodSource runs the test once per supplied value.' },
      { q: 'What is the purpose of @Tag in JUnit 5?', options: ['Adding comments to code', 'Categorizing tests for selective execution', 'Marking deprecated tests', 'Setting timeouts'], correct: 1, explanation: '@Tag("smoke") lets you filter and run subsets of tests via build tool or CI configuration.' },
      { q: 'What replaced JUnit 4\'s @Rule mechanism in JUnit 5?', options: ['@BeforeEach', 'Extensions (@ExtendWith)', '@Disabled', 'Nothing — it still uses @Rule'], correct: 1, explanation: 'JUnit 5\'s extension model unifies and replaces both JUnit 4 rules and runners.' },
      { q: 'What are the three main components of JUnit 5\'s architecture?', options: ['Core, Utils, Runner', 'Platform, Jupiter, Vintage', 'Engine, Reporter, Logger', 'Base, Extended, Legacy'], correct: 1, explanation: 'Platform handles execution, Jupiter is the new programming model, and Vintage supports JUnit 4 backward compatibility.' },
      { q: 'Why should unit tests avoid real network calls or database hits?', options: ['They\'re not allowed by JUnit', 'To keep tests fast and isolated from external failures', 'JUnit blocks network access', 'It\'s a style preference only'], correct: 1, explanation: 'Fast, isolated unit tests don\'t depend on external systems, making them reliable and quick to run.' },
    ],
  },
  cucumber: {
    name: 'Cucumber BDD', glyph: 'CK',
    questions: [
      { q: 'What is Gherkin?', options: ['A Java testing library', 'A structured plain-language syntax for writing scenarios', 'A browser plugin', 'A type of XPath'], correct: 1, explanation: 'Gherkin uses Feature/Scenario/Given/When/Then to describe behavior in readable, structured English.' },
      { q: 'What does a step definition do?', options: ['Defines page styling', 'Implements the actual code behind a Gherkin step', 'Replaces test data', 'Configures the browser'], correct: 1, explanation: 'A step definition method matches a Gherkin line via regex/expression and contains the real automation logic.' },
      { q: 'What is the purpose of a Scenario Outline with Examples?', options: ['To skip tests', 'To run one scenario template across multiple data rows', 'To disable a scenario', 'To document bugs'], correct: 1, explanation: 'Scenario Outline avoids duplicating near-identical scenarios by running the same template against an Examples table.' },
      { q: 'What do @Before and @After hooks do in Cucumber?', options: ['Format reports', 'Run setup/teardown logic around every scenario', 'Define new step types', 'Translate Gherkin to other languages'], correct: 1, explanation: 'Hooks run automatically before/after each scenario, similar to TestNG/JUnit lifecycle annotations.' },
      { q: 'Where should the actual Selenium/Playwright interaction code live in a well-structured Cucumber framework?', options: ['Directly in step definitions', 'In Page Object classes called from thin step definitions', 'In the feature file', 'In the Gherkin Given line'], correct: 1, explanation: 'Keeping step definitions thin and delegating to Page Objects keeps the framework maintainable.' },
      { q: 'What is a common pitfall when scaling BDD across a large team?', options: ['Too few scenarios', 'Step definitions becoming duplicated and inconsistent across teams', 'Gherkin being too fast to write', 'No pitfalls exist'], correct: 1, explanation: 'Without coordination, teams often recreate near-duplicate step definitions instead of reusing existing ones.' },
      { q: 'What should a well-written Gherkin scenario describe?', options: ['Implementation details like CSS classes', 'The user-facing outcome/behavior', 'Internal database queries', 'Server configuration'], correct: 1, explanation: 'Gherkin scenarios should focus on observable behavior and outcomes, not implementation specifics.' },
      { q: 'What lets you run only scenarios tagged @smoke?', options: ['Renaming the feature file', 'Cucumber tag filtering at runtime', 'Deleting other scenarios', 'It is not possible'], correct: 1, explanation: 'Cucumber supports filtering execution by tags, similar to TestNG groups or JUnit @Tag.' },
    ],
  },
};

const QUIZ_TOPIC_ORDER = ['selenium', 'playwright', 'apiTesting', 'java', 'sql', 'git', 'jenkins', 'testng', 'junit', 'cucumber'];
