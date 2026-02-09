const { test, expect } = require('@playwright/test');

test.describe('Shopping Cart Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // Wait for products page to load
    await expect(page).toHaveURL('/inventory.html');
  });

  test('should add product to cart from products page', async ({ page }) => {
    // Get first "Add to cart" button
    const addToCartButton = page.locator('.btn_inventory').first();
    await addToCartButton.click();
    
    // Verify button text changes to "Remove"
    await expect(addToCartButton).toHaveText('Remove');
    
    // Verify cart badge shows 1 item
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('should add multiple products to cart', async ({ page }) => {
    // Add 3 products to cart
    const addToCartButtons = page.locator('.btn_inventory');
    await addToCartButtons.nth(0).click();
    await addToCartButtons.nth(1).click();
    await addToCartButtons.nth(2).click();
    
    // Verify cart badge shows 3 items
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
  });

  test('should remove product from cart on products page', async ({ page }) => {
    // Add product to cart
    const productButton = page.locator('.btn_inventory').first();
    await productButton.click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    
    // Remove product from cart
    await productButton.click();
    
    // Verify button text changes back to "Add to cart"
    await expect(productButton).toHaveText('Add to cart');
    
    // Verify cart badge is not visible
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('should add product to cart from product details page', async ({ page }) => {
    // Navigate to product details
    await page.locator('.inventory_item_name').first().click();
    await expect(page).toHaveURL(/inventory-item\.html/);
    
    // Add product to cart
    await page.click('.btn_inventory');
    
    // Verify button text changes to "Remove"
    await expect(page.locator('.btn_inventory')).toHaveText('Remove');
    
    // Verify cart badge shows 1 item
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('should navigate to cart page', async ({ page }) => {
    // Add product to cart
    await page.locator('.btn_inventory').first().click();
    
    // Click cart icon
    await page.click('.shopping_cart_link');
    
    // Verify cart page is displayed
    await expect(page).toHaveURL('/cart.html');
    await expect(page.locator('.title')).toHaveText('Your Cart');
  });

  test('should display added products in cart', async ({ page }) => {
    // Get product name and price from products page
    const productName = await page.locator('.inventory_item_name').first().textContent();
    const productPrice = await page.locator('.inventory_item_price').first().textContent();
    
    // Add product to cart
    await page.locator('.btn_inventory').first().click();
    
    // Navigate to cart
    await page.click('.shopping_cart_link');
    
    // Verify product is in cart with correct details
    await expect(page.locator('.cart_item')).toHaveCount(1);
    await expect(page.locator('.inventory_item_name')).toHaveText(productName);
    await expect(page.locator('.inventory_item_price')).toHaveText(productPrice);
  });

  test('should display multiple products in cart', async ({ page }) => {
    // Add 2 products to cart
    await page.locator('.btn_inventory').nth(0).click();
    await page.locator('.btn_inventory').nth(1).click();
    
    // Navigate to cart
    await page.click('.shopping_cart_link');
    
    // Verify 2 products are in cart
    await expect(page.locator('.cart_item')).toHaveCount(2);
  });

  test('should remove product from cart page', async ({ page }) => {
    // Add 2 products to cart
    await page.locator('.btn_inventory').nth(0).click();
    await page.locator('.btn_inventory').nth(1).click();
    
    // Navigate to cart
    await page.click('.shopping_cart_link');
    await expect(page.locator('.cart_item')).toHaveCount(2);
    
    // Remove first product
    await page.locator('.cart_button').first().click();
    
    // Verify only 1 product remains
    await expect(page.locator('.cart_item')).toHaveCount(1);
    
    // Verify cart badge shows 1 item
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('should continue shopping from cart', async ({ page }) => {
    // Add product and go to cart
    await page.locator('.btn_inventory').first().click();
    await page.click('.shopping_cart_link');
    
    // Click continue shopping button
    await page.click('#continue-shopping');
    
    // Verify we're back on products page
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('should proceed to checkout from cart', async ({ page }) => {
    // Add product and go to cart
    await page.locator('.btn_inventory').first().click();
    await page.click('.shopping_cart_link');
    
    // Click checkout button
    await page.click('#checkout');
    
    // Verify we're on checkout page
    await expect(page).toHaveURL('/checkout-step-one.html');
    await expect(page.locator('.title')).toHaveText('Checkout: Your Information');
  });

  test('should maintain cart items after logout and login', async ({ page }) => {
    // Add product to cart
    await page.locator('.btn_inventory').first().click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    
    // Logout
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    
    // Login again
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // Verify cart still has 1 item
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

});
