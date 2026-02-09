/**
 * Example Test with Helper Functions
 * 
 * ไฟล์นี้แสดงตัวอย่างการใช้ helper functions
 * เพื่อทำให้โค้ด test สั้นและอ่านง่ายขึ้น
 */

const { test, expect } = require('@playwright/test');
const { loginAsStandardUser, logout } = require('./helpers/login-helper');
const { 
  addProductToCart, 
  addMultipleProductsToCart, 
  getCartItemCount, 
  goToCart,
  clearCart
} = require('./helpers/cart-helper');

test.describe('Examples Using Helper Functions', () => {

  test('Example 1: Login using helper', async ({ page }) => {
    // แทนที่จะเขียนโค้ด login ทั้งหมด
    // ใช้ helper function แค่บรรทัดเดียว!
    await loginAsStandardUser(page);
    
    // ตรวจสอบว่า login สำเร็จ
    await expect(page).toHaveURL(/inventory\.html/);
    console.log('✓ Logged in successfully using helper!');
  });

  test('Example 2: Add products using helper', async ({ page }) => {
    // Login
    await loginAsStandardUser(page);
    
    // เพิ่มสินค้า 3 ชิ้นลงตะกร้า
    await addMultipleProductsToCart(page, [0, 1, 2]);
    
    // ตรวจสอบจำนวนสินค้าในตะกร้า
    const count = await getCartItemCount(page);
    expect(count).toBe(3);
    console.log(`✓ Added ${count} products to cart!`);
  });

  test('Example 3: Complete flow with helpers', async ({ page }) => {
    // 1. Login
    await loginAsStandardUser(page);
    
    // 2. เพิ่มสินค้าลงตะกร้า
    await addProductToCart(page, 0);
    await addProductToCart(page, 1);
    
    // 3. ตรวจสอบจำนวนในตะกร้า
    let count = await getCartItemCount(page);
    expect(count).toBe(2);
    
    // 4. ไปที่หน้าตะกร้า
    await goToCart(page);
    
    // 5. ตรวจสอบว่าอยู่ในหน้าตะกร้า
    await expect(page).toHaveURL(/cart\.html/);
    
    console.log('✓ Complete flow executed successfully!');
  });

  test('Example 4: Clear cart using helper', async ({ page }) => {
    // Login และเพิ่มสินค้า
    await loginAsStandardUser(page);
    await addMultipleProductsToCart(page, [0, 1, 2, 3]);
    
    // ตรวจสอบว่ามีสินค้าในตะกร้า
    let count = await getCartItemCount(page);
    expect(count).toBe(4);
    console.log(`Cart has ${count} items`);
    
    // ล้างตะกร้า
    await clearCart(page);
    
    // ตรวจสอบว่าตะกร้าว่าง
    count = await getCartItemCount(page);
    expect(count).toBe(0);
    console.log('✓ Cart cleared successfully!');
  });

  test('Example 5: Login and logout', async ({ page }) => {
    // Login
    await loginAsStandardUser(page);
    await expect(page).toHaveURL(/inventory\.html/);
    console.log('✓ Logged in');
    
    // Logout
    await logout(page);
    await expect(page).toHaveURL('/');
    console.log('✓ Logged out');
  });

  test('Example 6: Shopping journey', async ({ page }) => {
    // 1. Login
    await loginAsStandardUser(page);
    console.log('Step 1: Logged in ✓');
    
    // 2. เพิ่มสินค้า
    await addMultipleProductsToCart(page, [0, 2, 4]);
    console.log('Step 2: Added products ✓');
    
    // 3. ตรวจสอบตะกร้า
    const count = await getCartItemCount(page);
    expect(count).toBe(3);
    console.log(`Step 3: Cart has ${count} items ✓`);
    
    // 4. ไปที่หน้าตะกร้า
    await goToCart(page);
    console.log('Step 4: Navigated to cart ✓');
    
    // 5. Proceed to checkout
    await page.click('#checkout');
    await expect(page).toHaveURL(/checkout-step-one\.html/);
    console.log('Step 5: Proceeded to checkout ✓');
    
    console.log('✓ Complete shopping journey finished!');
  });

});

/**
 * สรุป: ข้อดีของการใช้ Helper Functions
 * 
 * 1. โค้ดสั้นลง อ่านง่ายขึ้น
 * 2. สามารถ reuse ได้หลายที่
 * 3. ถ้ามีการเปลี่ยนแปลง แก้ที่เดียวได้ทุกที่
 * 4. ทำให้ test มีโครงสร้างที่ดีขึ้น
 * 5. ง่ายต่อการ maintain
 * 
 * วิธีสร้าง Helper Functions ของคุณเอง:
 * 
 * 1. สร้างไฟล์ใน tests/helpers/
 * 2. เขียน functions ที่ต้องการ
 * 3. Export functions ด้วย module.exports
 * 4. Import และใช้ในไฟล์ test
 * 
 * ตัวอย่าง:
 * 
 * // ในไฟล์ my-helper.js
 * async function myFunction(page) {
 *   // โค้ดของคุณ
 * }
 * module.exports = { myFunction };
 * 
 * // ในไฟล์ test
 * const { myFunction } = require('./helpers/my-helper');
 * await myFunction(page);
 */
