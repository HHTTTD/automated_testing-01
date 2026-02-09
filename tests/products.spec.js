const { test, expect } = require('@playwright/test');

test.describe('Products Page', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // Wait for products page to load
    await expect(page).toHaveURL('/inventory.html');
  });

  test('should display all products', async ({ page }) => {
    // Verify products are displayed
    const productItems = page.locator('.inventory_item');
    await expect(productItems).toHaveCount(6);
    
    // Verify each product has required elements
    const firstProduct = productItems.first();
    await expect(firstProduct.locator('.inventory_item_name')).toBeVisible();
    await expect(firstProduct.locator('.inventory_item_desc')).toBeVisible();
    await expect(firstProduct.locator('.inventory_item_price')).toBeVisible();
    await expect(firstProduct.locator('button')).toBeVisible();
  });

  test('should be able to sort products by name (A to Z)', async ({ page }) => {
    // Select sort option
    await page.selectOption('.product_sort_container', 'az');
    
    // Get all product names
    const productNames = await page.locator('.inventory_item_name').allTextContents();
    
    // Verify products are sorted alphabetically
    const sortedNames = [...productNames].sort();
    expect(productNames).toEqual(sortedNames);
  });

  test('should be able to sort products by name (Z to A)', async ({ page }) => {
    // Select sort option
    await page.selectOption('.product_sort_container', 'za');
    
    // Get all product names
    const productNames = await page.locator('.inventory_item_name').allTextContents();
    
    // Verify products are sorted in reverse alphabetical order
    const sortedNames = [...productNames].sort().reverse();
    expect(productNames).toEqual(sortedNames);
  });

  test('should be able to sort products by price (low to high)', async ({ page }) => {
    // Select sort option
    await page.selectOption('.product_sort_container', 'lohi');
    
    // Get all product prices
    const priceTexts = await page.locator('.inventory_item_price').allTextContents();
    const prices = priceTexts.map(price => parseFloat(price.replace('$', '')));
    
    // Verify products are sorted by price (ascending)
    const sortedPrices = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sortedPrices);
  });

  test('should be able to sort products by price (high to low)', async ({ page }) => {
    // Select sort option
    await page.selectOption('.product_sort_container', 'hilo');
    
    // Get all product prices
    const priceTexts = await page.locator('.inventory_item_price').allTextContents();
    const prices = priceTexts.map(price => parseFloat(price.replace('$', '')));
    
    // Verify products are sorted by price (descending)
    const sortedPrices = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sortedPrices);
  });

  test('should be able to view product details', async ({ page }) => {
    // Click on first product
    await page.locator('.inventory_item_name').first().click();
    
    // Verify product details page
    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.locator('.inventory_details_name')).toBeVisible();
    await expect(page.locator('.inventory_details_desc')).toBeVisible();
    await expect(page.locator('.inventory_details_price')).toBeVisible();
    await expect(page.locator('.inventory_details_img')).toBeVisible();
  });

  test('should be able to go back from product details', async ({ page }) => {
    // Click on first product
    await page.locator('.inventory_item_name').first().click();
    await expect(page).toHaveURL(/inventory-item\.html/);
    
    // Click back button
    await page.click('#back-to-products');
    
    // Verify we're back on products page
    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('should display shopping cart badge when empty', async ({ page }) => {
    // Verify cart badge is not visible when cart is empty
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).not.toBeVisible();
  });

  test('should be able to open menu', async ({ page }) => {
    // Click burger menu button
    await page.click('#react-burger-menu-btn');
    
    // Verify menu is open
    await expect(page.locator('.bm-menu')).toBeVisible();
    await expect(page.locator('#inventory_sidebar_link')).toBeVisible();
    await expect(page.locator('#about_sidebar_link')).toBeVisible();
    await expect(page.locator('#logout_sidebar_link')).toBeVisible();
    await expect(page.locator('#reset_sidebar_link')).toBeVisible();
  });

});
