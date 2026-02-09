/**
 * Cart Helper Functions
 * 
 * ไฟล์นี้เก็บ helper functions สำหรับการจัดการ Shopping Cart
 */

/**
 * Add product to cart by index
 * @param {Page} page - Playwright page object
 * @param {number} index - Product index (0-based)
 */
async function addProductToCart(page, index) {
  await page.locator('.btn_inventory').nth(index).click();
}

/**
 * Add multiple products to cart
 * @param {Page} page - Playwright page object
 * @param {number[]} indices - Array of product indices to add
 */
async function addMultipleProductsToCart(page, indices) {
  for (const index of indices) {
    await addProductToCart(page, index);
  }
}

/**
 * Remove product from cart by index
 * @param {Page} page - Playwright page object
 * @param {number} index - Product index (0-based)
 */
async function removeProductFromCart(page, index) {
  await page.locator('.cart_button').nth(index).click();
}

/**
 * Get cart item count
 * @param {Page} page - Playwright page object
 * @returns {number} - Number of items in cart
 */
async function getCartItemCount(page) {
  try {
    const badgeText = await page.locator('.shopping_cart_badge').textContent();
    return parseInt(badgeText);
  } catch {
    return 0; // Cart is empty if badge doesn't exist
  }
}

/**
 * Navigate to cart page
 * @param {Page} page - Playwright page object
 */
async function goToCart(page) {
  await page.click('.shopping_cart_link');
  await page.waitForURL(/cart\.html/);
}

/**
 * Get all product names in cart
 * @param {Page} page - Playwright page object
 * @returns {string[]} - Array of product names
 */
async function getCartProductNames(page) {
  return await page.locator('.cart_item .inventory_item_name').allTextContents();
}

/**
 * Get all product prices in cart
 * @param {Page} page - Playwright page object
 * @returns {number[]} - Array of prices
 */
async function getCartProductPrices(page) {
  const priceTexts = await page.locator('.cart_item .inventory_item_price').allTextContents();
  return priceTexts.map(price => parseFloat(price.replace('$', '')));
}

/**
 * Clear all items from cart
 * @param {Page} page - Playwright page object
 */
async function clearCart(page) {
  await goToCart(page);
  
  let itemCount = await getCartItemCount(page);
  while (itemCount > 0) {
    await removeProductFromCart(page, 0);
    itemCount = await getCartItemCount(page);
  }
}

/**
 * Check if cart is empty
 * @param {Page} page - Playwright page object
 * @returns {boolean} - True if cart is empty
 */
async function isCartEmpty(page) {
  const count = await getCartItemCount(page);
  return count === 0;
}

module.exports = {
  addProductToCart,
  addMultipleProductsToCart,
  removeProductFromCart,
  getCartItemCount,
  goToCart,
  getCartProductNames,
  getCartProductPrices,
  clearCart,
  isCartEmpty
};
