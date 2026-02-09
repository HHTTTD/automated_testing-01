const { test, expect } = require('@playwright/test');

test.describe('End-to-End Complete Flow', () => {
  
  test('should complete full shopping journey from login to checkout', async ({ page }) => {
    // Step 1: Navigate to website
    await page.goto('/');
    await expect(page).toHaveTitle(/Swag Labs/);
    
    // Step 2: Login
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL('/inventory.html');
    
    // Step 3: Browse products and sort by price (low to high)
    await page.selectOption('.product_sort_container', 'lohi');
    
    // Step 4: View product details
    const firstProductName = await page.locator('.inventory_item_name').first().textContent();
    await page.locator('.inventory_item_name').first().click();
    await expect(page).toHaveURL(/inventory-item\.html/);
    await expect(page.locator('.inventory_details_name')).toHaveText(firstProductName);
    
    // Step 5: Add product to cart from details page
    await page.click('.btn_inventory');
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    
    // Step 6: Go back to products
    await page.click('#back-to-products');
    await expect(page).toHaveURL('/inventory.html');
    
    // Step 7: Add two more products to cart
    await page.locator('.btn_inventory').nth(1).click();
    await page.locator('.btn_inventory').nth(2).click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
    
    // Step 8: View shopping cart
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL('/cart.html');
    await expect(page.locator('.cart_item')).toHaveCount(3);
    
    // Step 9: Remove one product from cart
    await page.locator('.cart_button').last().click();
    await expect(page.locator('.cart_item')).toHaveCount(2);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    
    // Step 10: Proceed to checkout
    await page.click('#checkout');
    await expect(page).toHaveURL('/checkout-step-one.html');
    
    // Step 11: Fill checkout information
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '10001');
    await page.click('#continue');
    
    // Step 12: Verify checkout overview
    await expect(page).toHaveURL('/checkout-step-two.html');
    await expect(page.locator('.cart_item')).toHaveCount(2);
    
    // Verify price calculation
    const subtotalText = await page.locator('.summary_subtotal_label').textContent();
    const taxText = await page.locator('.summary_tax_label').textContent();
    const totalText = await page.locator('.summary_total_label').textContent();
    
    const subtotal = parseFloat(subtotalText.match(/[\d.]+/)[0]);
    const tax = parseFloat(taxText.match(/[\d.]+/)[0]);
    const total = parseFloat(totalText.match(/[\d.]+/)[0]);
    
    expect(total).toBeCloseTo(subtotal + tax, 2);
    
    // Step 13: Complete order
    await page.click('#finish');
    await expect(page).toHaveURL('/checkout-complete.html');
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    
    // Step 14: Verify cart is empty
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
    
    // Step 15: Return to products
    await page.click('#back-to-products');
    await expect(page).toHaveURL('/inventory.html');
    
    // Step 16: Logout
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await expect(page).toHaveURL('/');
  });

  test('should handle product problem user scenario', async ({ page }) => {
    // Login with problem user
    await page.goto('/');
    await page.fill('#user-name', 'problem_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // Note: problem_user has various UI issues
    await expect(page).toHaveURL('/inventory.html');
    
    // Try to add product and checkout
    await page.locator('.btn_inventory').first().click();
    await page.click('.shopping_cart_link');
    await page.click('#checkout');
    
    // Fill checkout info
    await page.fill('#first-name', 'Jane');
    await page.fill('#last-name', 'Smith');
    await page.fill('#postal-code', '20002');
    await page.click('#continue');
    
    // problem_user has UI bugs - fields might be swapped or not filled correctly
    // So we verify either success OR expected error
    try {
      // Try to verify we reached overview page (might work sometimes)
      await expect(page).toHaveURL(/checkout-step-two\.html/, { timeout: 5000 });
      console.log('✓ problem_user checkout succeeded (unexpected but OK)');
    } catch {
      // Or verify error message appears (expected behavior with problem_user)
      const errorMessage = page.locator('[data-test="error"]');
      await expect(errorMessage).toBeVisible();
      console.log('✓ problem_user shows expected error (UI bug detected)');
    }
  });

  test('should handle performance glitch user', async ({ page }) => {
    // Login with performance_glitch_user
    await page.goto('/');
    await page.fill('#user-name', 'performance_glitch_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // This user has performance issues, so increase timeout
    await expect(page).toHaveURL('/inventory.html', { timeout: 10000 });
    
    // Complete basic shopping flow
    await page.locator('.btn_inventory').first().click();
    await page.click('.shopping_cart_link');
    await expect(page.locator('.cart_item')).toHaveCount(1);
    
    // Proceed to checkout
    await page.click('#checkout');
    await page.fill('#first-name', 'Performance');
    await page.fill('#last-name', 'Test');
    await page.fill('#postal-code', '30003');
    await page.click('#continue');
    
    await page.click('#finish');
    await expect(page).toHaveURL('/checkout-complete.html', { timeout: 10000 });
  });

  test('should verify visual elements are displayed correctly', async ({ page }) => {
    // Login
    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // Verify header elements
    await expect(page.locator('.app_logo')).toBeVisible();
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
    await expect(page.locator('#react-burger-menu-btn')).toBeVisible();
    
    // Verify product images are displayed
    const productImages = page.locator('.inventory_item_img');
    const imageCount = await productImages.count();
    expect(imageCount).toBeGreaterThan(0);
    
    // Verify footer
    await expect(page.locator('.footer')).toBeVisible();
  });

  test('should maintain shopping experience across navigation', async ({ page }) => {
    // Login and add products
    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // Add product
    await page.locator('.btn_inventory').first().click();
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');
    
    // Navigate to different pages and verify cart badge persists
    await page.locator('.inventory_item_name').first().click();
    await expect(cartBadge).toHaveText('1');
    
    await page.click('#back-to-products');
    await expect(cartBadge).toHaveText('1');
    
    await page.click('.shopping_cart_link');
    await expect(cartBadge).toHaveText('1');
    
    await page.click('#continue-shopping');
    await expect(cartBadge).toHaveText('1');
  });

});
