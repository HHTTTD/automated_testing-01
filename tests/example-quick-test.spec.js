/**
 * Quick Example Test
 * 
 * ไฟล์นี้เป็นตัวอย่างการเขียน test แบบง่ายๆ
 * สำหรับเริ่มต้นเรียนรู้ Playwright
 */

const { test, expect } = require('@playwright/test');

test.describe('Quick Start Examples', () => {
  
  // ตัวอย่างที่ 1: การเปิดเว็บไซต์และตรวจสอบ Title
  test('Example 1: Check website title', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await expect(page).toHaveTitle(/Swag Labs/);
    console.log('✓ Website title is correct!');
  });

  // ตัวอย่างที่ 2: การ Login พื้นฐาน
  test('Example 2: Simple login test', async ({ page }) => {
    // เปิดเว็บไซต์
    await page.goto('https://www.saucedemo.com');
    
    // กรอกข้อมูล
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    
    // คลิกปุ่ม Login
    await page.click('#login-button');
    
    // ตรวจสอบว่า Login สำเร็จ
    await expect(page).toHaveURL(/inventory/);
    console.log('✓ Login successful!');
  });

  // ตัวอย่างที่ 3: การใช้ Screenshot
  test('Example 3: Take screenshot', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    
    // ถ่ายภาพหน้าจอ
    await page.screenshot({ path: 'screenshots/login-page.png' });
    console.log('✓ Screenshot saved to screenshots/login-page.png');
  });

  // ตัวอย่างที่ 4: การรอ Element
  test('Example 4: Wait for element', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    
    // รอจนกว่า element จะปรากฏ
    await page.waitForSelector('#login-button');
    
    // ตรวจสอบว่า element มองเห็นได้
    await expect(page.locator('#login-button')).toBeVisible();
    console.log('✓ Login button is visible!');
  });

  // ตัวอย่างที่ 5: การนับจำนวน Elements
  test('Example 5: Count products after login', async ({ page }) => {
    // Login
    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // นับจำนวนสินค้า
    const productCount = await page.locator('.inventory_item').count();
    console.log(`Found ${productCount} products`);
    
    // ตรวจสอบว่ามี 6 สินค้า
    expect(productCount).toBe(6);
    console.log('✓ Product count is correct!');
  });

  // ตัวอย่างที่ 6: การดึงข้อความจาก Element
  test('Example 6: Get text from element', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // ดึงชื่อสินค้าแรก
    const firstProductName = await page.locator('.inventory_item_name').first().textContent();
    console.log(`First product: ${firstProductName}`);
    
    // ตรวจสอบว่าชื่อสินค้าไม่ว่าง
    expect(firstProductName).not.toBe('');
    console.log('✓ Product name retrieved successfully!');
  });

  // ตัวอย่างที่ 7: การใช้ Custom Timeout
  test('Example 7: Custom timeout', async ({ page }) => {
    // ตั้งค่า timeout เป็น 10 วินาที
    test.setTimeout(10000);
    
    await page.goto('https://www.saucedemo.com', { 
      waitUntil: 'networkidle' // รอจน network หยุดทำงาน
    });
    
    await expect(page.locator('#login-button')).toBeVisible({ timeout: 5000 });
    console.log('✓ Page loaded within timeout!');
  });

});

/**
 * วิธีรันไฟล์นี้:
 * 
 * 1. รัน test ทั้งหมดในไฟล์นี้:
 *    npx playwright test example-quick-test.spec.js
 * 
 * 2. รันแบบเห็น browser:
 *    npx playwright test example-quick-test.spec.js --headed
 * 
 * 3. รัน test เดียว:
 *    npx playwright test example-quick-test.spec.js -g "Simple login test"
 * 
 * 4. รันใน debug mode:
 *    npx playwright test example-quick-test.spec.js --debug
 */
