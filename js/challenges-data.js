/* ============================================================
   CODING CHALLENGES DATA
   ============================================================ */

const CHALLENGE_DATA = {

  xpath: {
    label: 'XPath Challenges', glyph: '//',
    items: [
      { id: 'xpath-1', difficulty: 'Beginner', title: 'Select a button by its visible text',
        html: `<button id="submit-btn">Submit Order</button>`,
        prompt: 'Write an XPath expression that selects the button using only its visible text "Submit Order".',
        hint: 'The text() function combined with the equals operator targets exact visible text.',
        solution: `//button[text()='Submit Order']` },
      { id: 'xpath-2', difficulty: 'Beginner', title: 'Select an input by partial placeholder',
        html: `<input type="text" placeholder="Enter your email address">`,
        prompt: 'Write an XPath that matches this input using only part of its placeholder text — "email".',
        hint: 'contains() lets you match a substring instead of the full attribute value.',
        solution: `//input[contains(@placeholder, 'email')]` },
      { id: 'xpath-3', difficulty: 'Intermediate', title: 'Select the 2nd row of a table',
        html: `<table>
  <tr><td>Row 1</td></tr>
  <tr><td>Row 2</td></tr>
  <tr><td>Row 3</td></tr>
</table>`,
        prompt: 'Write an XPath that selects exactly the second <tr> in this table.',
        hint: 'XPath indices are 1-based, not 0-based like most programming languages.',
        solution: `//table/tr[2]` },
      { id: 'xpath-4', difficulty: 'Intermediate', title: 'Select a sibling element',
        html: `<div class="form-group">
  <label>Username</label>
  <input type="text">
</div>`,
        prompt: 'Starting from the <label> containing "Username", write an XPath that selects the following sibling <input>.',
        hint: 'following-sibling:: navigates forward among siblings of the current node.',
        solution: `//label[text()='Username']/following-sibling::input` },
      { id: 'xpath-5', difficulty: 'Advanced', title: 'Select an element by multiple conditions',
        html: `<button class="btn" data-action="delete" disabled>Delete</button>
<button class="btn" data-action="delete">Delete</button>`,
        prompt: 'Write an XPath that selects only the enabled (non-disabled) "Delete" button.',
        hint: 'Combine an attribute condition with not() to exclude disabled elements.',
        solution: `//button[@data-action='delete' and not(@disabled)]` },
      { id: 'xpath-6', difficulty: 'Advanced', title: 'Select a parent from a child match',
        html: `<div class="card" id="card-99">
  <span class="status">Error</span>
</div>`,
        prompt: 'Starting from the <span> with text "Error", write an XPath that selects its parent <div class="card">.',
        hint: 'parent:: or ".." moves up one level from the matched node.',
        solution: `//span[text()='Error']/parent::div[@class='card']` },
    ],
  },

  cssSelectors: {
    label: 'CSS Selector Challenges', glyph: '#',
    items: [
      { id: 'css-1', difficulty: 'Beginner', title: 'Select by ID',
        html: `<input id="search-box" type="text">`,
        prompt: 'Write a CSS selector that targets this input using its ID.',
        hint: 'The # symbol prefixes an ID selector.',
        solution: `#search-box` },
      { id: 'css-2', difficulty: 'Beginner', title: 'Select all elements with a class',
        html: `<div class="card">A</div>
<div class="card">B</div>`,
        prompt: 'Write a CSS selector that matches every element with the class "card".',
        hint: 'The . symbol prefixes a class selector.',
        solution: `.card` },
      { id: 'css-3', difficulty: 'Intermediate', title: 'Select an attribute value match',
        html: `<input type="checkbox" name="terms">`,
        prompt: 'Write a CSS selector that targets checkbox inputs specifically (not all inputs).',
        hint: 'Attribute selectors use square brackets: [attribute="value"].',
        solution: `input[type="checkbox"]` },
      { id: 'css-4', difficulty: 'Intermediate', title: 'Select a direct child',
        html: `<ul class="menu">
  <li>Item 1</li>
  <li>Item 2</li>
</ul>`,
        prompt: 'Write a CSS selector that targets only <li> elements that are direct children of .menu.',
        hint: 'The > combinator restricts matches to direct children only, not all descendants.',
        solution: `.menu > li` },
      { id: 'css-5', difficulty: 'Advanced', title: 'Select the nth element',
        html: `<div class="row">A</div>
<div class="row">B</div>
<div class="row">C</div>`,
        prompt: 'Write a CSS selector that targets only the third .row element.',
        hint: ':nth-of-type(n) selects an element based on its position among siblings of the same type.',
        solution: `.row:nth-of-type(3)` },
      { id: 'css-6', difficulty: 'Advanced', title: 'Select an element NOT matching a condition',
        html: `<button class="btn" disabled>Save</button>
<button class="btn">Cancel</button>`,
        prompt: 'Write a CSS selector that matches .btn elements that are NOT disabled.',
        hint: 'The :not() pseudo-class excludes elements matching its argument.',
        solution: `.btn:not([disabled])` },
    ],
  },

  selenium: {
    label: 'Selenium Challenges', glyph: 'SE',
    items: [
      { id: 'sel-1', difficulty: 'Beginner', title: 'Wait for an element before clicking',
        html: `// A button that appears 2 seconds after page load`,
        prompt: 'Write Selenium Java code that waits up to 10 seconds for a button with id "late-button" to become clickable, then clicks it.',
        hint: 'Use WebDriverWait with ExpectedConditions.elementToBeClickable().',
        solution: `WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(By.id("late-button")));
btn.click();` },
      { id: 'sel-2', difficulty: 'Intermediate', title: 'Handle a JS alert',
        html: `// Clicking #delete-btn triggers a native confirm() dialog`,
        prompt: 'Write Selenium code that clicks the delete button, then dismisses (cancels) the resulting confirm dialog.',
        hint: 'Use driver.switchTo().alert() to access the dialog, then .dismiss() for Cancel.',
        solution: `driver.findElement(By.id("delete-btn")).click();
Alert alert = driver.switchTo().alert();
alert.dismiss();` },
      { id: 'sel-3', difficulty: 'Advanced', title: 'Retry on StaleElementReferenceException',
        html: `// A banner element that re-renders periodically`,
        prompt: 'Write a small Java method that attempts to click a button by ID, retrying once if a StaleElementReferenceException is thrown.',
        hint: 'Wrap the click in a try/catch, re-locate the element fresh inside the catch block, then click again.',
        solution: `public void clickWithRetry(WebDriver driver, String id) {
    try {
        driver.findElement(By.id(id)).click();
    } catch (StaleElementReferenceException e) {
        driver.findElement(By.id(id)).click();
    }
}` },
    ],
  },

  playwright: {
    label: 'Playwright Challenges', glyph: 'PW',
    items: [
      { id: 'pw-1', difficulty: 'Beginner', title: 'Fill a form and submit',
        html: `// A login form with labeled Username and Password fields, and a Sign in button`,
        prompt: 'Write a Playwright test that fills in the username and password fields by their labels, then clicks "Sign in".',
        hint: 'Use page.getByLabel() for the fields and page.getByRole("button", { name }) for the button.',
        solution: `await page.getByLabel('Username').fill('qa_user');
await page.getByLabel('Password').fill('Secret123');
await page.getByRole('button', { name: 'Sign in' }).click();` },
      { id: 'pw-2', difficulty: 'Intermediate', title: 'Mock a failed API response',
        html: `// The page calls GET /api/orders on load`,
        prompt: 'Write Playwright code that intercepts GET /api/orders and forces a 500 error response, then asserts an error banner becomes visible.',
        hint: 'Use page.route() with route.fulfill({ status: 500 }) before navigating.',
        solution: `await page.route('**/api/orders', route =>
  route.fulfill({ status: 500, body: JSON.stringify({ error: 'Server error' }) })
);
await page.goto('/orders');
await expect(page.getByText('Something went wrong')).toBeVisible();` },
      { id: 'pw-3', difficulty: 'Advanced', title: 'Reuse an authenticated session',
        html: `// Logging in is slow; reuse the session across tests`,
        prompt: 'Write Playwright code that logs in once, saves the storage state to a file, then describe how a later test would reuse it.',
        hint: 'Use page.context().storageState({ path }) to save, and the storageState option in test config or browser.newContext() to reuse.',
        solution: `// One-time setup
await page.goto('/login');
await page.getByLabel('Username').fill('qa_user');
await page.getByLabel('Password').fill('Secret123');
await page.getByRole('button', { name: 'Sign in' }).click();
await page.context().storageState({ path: 'auth.json' });

// Reused in later tests
const context = await browser.newContext({ storageState: 'auth.json' });` },
    ],
  },
};

const CHALLENGE_CATEGORY_ORDER = ['xpath', 'cssSelectors', 'selenium', 'playwright'];
