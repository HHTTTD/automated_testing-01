/**
 * Login Helper Functions
 * 
 * ไฟล์นี้เก็บ helper functions สำหรับการ Login
 * เพื่อให้สามารถ reuse ได้ในหลายๆ test
 */

/**
 * Login to the application
 * @param {Page} page - Playwright page object
 * @param {string} username - Username to login with
 * @param {string} password - Password to login with
 */
async function login(page, username, password) {
  await page.goto('/');
  await page.fill('#user-name', username);
  await page.fill('#password', password);
  await page.click('#login-button');
  
  // Wait for navigation to complete
  await page.waitForURL(/inventory\.html/);
}

/**
 * Login as standard user
 * @param {Page} page - Playwright page object
 */
async function loginAsStandardUser(page) {
  await login(page, 'standard_user', 'secret_sauce');
}

/**
 * Login as problem user
 * @param {Page} page - Playwright page object
 */
async function loginAsProblemUser(page) {
  await login(page, 'problem_user', 'secret_sauce');
}

/**
 * Login as performance glitch user
 * @param {Page} page - Playwright page object
 */
async function loginAsPerformanceUser(page) {
  await login(page, 'performance_glitch_user', 'secret_sauce');
}

/**
 * Logout from the application
 * @param {Page} page - Playwright page object
 */
async function logout(page) {
  await page.click('#react-burger-menu-btn');
  await page.click('#logout_sidebar_link');
  await page.waitForURL('/');
}

/**
 * Check if user is logged in
 * @param {Page} page - Playwright page object
 * @returns {boolean} - True if logged in, false otherwise
 */
async function isLoggedIn(page) {
  try {
    await page.waitForSelector('.inventory_list', { timeout: 2000 });
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  login,
  loginAsStandardUser,
  loginAsProblemUser,
  loginAsPerformanceUser,
  logout,
  isLoggedIn
};
