const { test, expect } = require('@playwright/test');

test.describe('Checkout Process', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login and add product to cart before each test
    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // Add product to cart
    await page.locator('.btn_inventory').first().click();
    
    // Navigate to cart
    await page.click('.shopping_cart_link');
    
    // Proceed to checkout
    await page.click('#checkout');
    await expect(page).toHaveURL('/checkout-step-one.html');
  });

  test('should display checkout information form', async ({ page }) => {
    // Verify form elements are visible
    await expect(page.locator('.title')).toHaveText('Checkout: Your Information');
    await expect(page.locator('#first-name')).toBeVisible();
    await expect(page.locator('#last-name')).toBeVisible();
    await expect(page.locator('#postal-code')).toBeVisible();
    await expect(page.locator('#continue')).toBeVisible();
    await expect(page.locator('#cancel')).toBeVisible();
  });

  test('should successfully complete checkout information', async ({ page }) => {
    // Fill in checkout information
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');
    
    // Click continue button
    await page.click('#continue');
    
    // Verify we're on checkout overview page
    await expect(page).toHaveURL('/checkout-step-two.html');
    await expect(page.locator('.title')).toHaveText('Checkout: Overview');
  });

  test('should show error for missing first name', async ({ page }) => {
    // Fill in only last name and postal code
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');
    
    // Click continue button
    await page.click('#continue');
    
    // Verify error message is displayed
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('First Name is required');
  });

  test('should show error for missing last name', async ({ page }) => {
    // Fill in only first name and postal code
    await page.fill('#first-name', 'John');
    await page.fill('#postal-code', '12345');
    
    // Click continue button
    await page.click('#continue');
    
    // Verify error message is displayed
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Last Name is required');
  });

  test('should show error for missing postal code', async ({ page }) => {
    // Fill in only first name and last name
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    
    // Click continue button
    await page.click('#continue');
    
    // Verify error message is displayed
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Postal Code is required');
  });

  test('should cancel checkout from information page', async ({ page }) => {
    // Click cancel button
    await page.click('#cancel');
    
    // Verify we're back on cart page
    await expect(page).toHaveURL('/cart.html');
    await expect(page.locator('.title')).toHaveText('Your Cart');
  });

  test('should display checkout overview correctly', async ({ page }) => {
    // Complete checkout information
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');
    await page.click('#continue');
    
    // Verify checkout overview page
    await expect(page).toHaveURL('/checkout-step-two.html');
    await expect(page.locator('.title')).toHaveText('Checkout: Overview');
    
    // Verify cart items are displayed
    await expect(page.locator('.cart_item')).toHaveCount(1);
    
    // Verify payment and shipping information
    await expect(page.locator('.summary_info')).toBeVisible();
    await expect(page.locator('.summary_subtotal_label')).toBeVisible();
    await expect(page.locator('.summary_tax_label')).toBeVisible();
    await expect(page.locator('.summary_total_label')).toBeVisible();
  });

  test('should calculate total price correctly', async ({ page }) => {
    // Complete checkout information
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');
    await page.click('#continue');
    
    // Get price values
    const subtotalText = await page.locator('.summary_subtotal_label').textContent();
    const taxText = await page.locator('.summary_tax_label').textContent();
    const totalText = await page.locator('.summary_total_label').textContent();
    
    // Extract numeric values
    const subtotal = parseFloat(subtotalText.match(/[\d.]+/)[0]);
    const tax = parseFloat(taxText.match(/[\d.]+/)[0]);
    const total = parseFloat(totalText.match(/[\d.]+/)[0]);
    
    // Verify total = subtotal + tax
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test('should cancel checkout from overview page', async ({ page }) => {
    // Complete checkout information
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');
    await page.click('#continue');
    
    // Click cancel button
    await page.click('#cancel');
    
    // Verify we're back on products page
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('should complete checkout successfully', async ({ page }) => {
    // Complete checkout information
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');
    await page.click('#continue');
    
    // Click finish button
    await page.click('#finish');
    
    // Verify we're on checkout complete page
    await expect(page).toHaveURL('/checkout-complete.html');
    await expect(page.locator('.title')).toHaveText('Checkout: Complete!');
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    await expect(page.locator('.complete-text')).toBeVisible();
  });

  test('should clear cart after successful checkout', async ({ page }) => {
    // Complete checkout information
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');
    await page.click('#continue');
    
    // Click finish button
    await page.click('#finish');
    
    // Verify cart badge is not visible (cart is empty)
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('should navigate back to products after checkout complete', async ({ page }) => {
    // Complete entire checkout process
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');
    await page.click('#continue');
    await page.click('#finish');
    
    // Click back home button
    await page.click('#back-to-products');
    
    // Verify we're back on products page
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('should complete checkout with multiple products', async ({ page }) => {
    // Go back to products page
    await page.click('#cancel');
    await expect(page).toHaveURL('/cart.html');
    await page.click('#continue-shopping');
    
    // Add 2 more products
    await page.locator('.btn_inventory').nth(1).click();
    await page.locator('.btn_inventory').nth(2).click();
    
    // Go to cart and checkout
    await page.click('.shopping_cart_link');
    await page.click('#checkout');
    
    // Complete checkout information
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');
    await page.click('#continue');
    
    // Verify 3 products in checkout overview
    await expect(page.locator('.cart_item')).toHaveCount(3);
    
    // Complete checkout
    await page.click('#finish');
    
    // Verify success
    await expect(page).toHaveURL('/checkout-complete.html');
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  });

});
