const { test, expect } = require('@playwright/test');

test.describe('Login Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('/');
  });

  test('should display login page correctly', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/Swag Labs/);
    
    // Verify login form elements are visible
    await expect(page.locator('#user-name')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#login-button')).toBeVisible();
  });

  test('should login successfully with standard user', async ({ page }) => {
    // Fill in login credentials
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    
    // Click login button
    await page.click('#login-button');
    
    // Verify successful login by checking URL and page elements
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('should show error message for locked out user', async ({ page }) => {
    // Try to login with locked out user
    await page.fill('#user-name', 'locked_out_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // Verify error message is displayed
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Sorry, this user has been locked out');
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    // Try to login with invalid credentials
    await page.fill('#user-name', 'invalid_user');
    await page.fill('#password', 'wrong_password');
    await page.click('#login-button');
    
    // Verify error message is displayed
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Username and password do not match');
  });

  test('should show error message for empty username', async ({ page }) => {
    // Leave username empty and fill password
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // Verify error message is displayed
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Username is required');
  });

  test('should show error message for empty password', async ({ page }) => {
    // Fill username but leave password empty
    await page.fill('#user-name', 'standard_user');
    await page.click('#login-button');
    
    // Verify error message is displayed
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Password is required');
  });

  test('should be able to close error message', async ({ page }) => {
    // Trigger an error message
    await page.fill('#user-name', 'invalid_user');
    await page.fill('#password', 'wrong_password');
    await page.click('#login-button');
    
    // Verify error message is visible
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    
    // Close error message
    await page.click('.error-button');
    
    // Verify error message is no longer visible
    await expect(errorMessage).not.toBeVisible();
  });

});
