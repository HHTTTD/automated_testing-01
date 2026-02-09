# Automated Testing for Swag Labs (SauceDemo.com)

โปรเจคนี้เป็น Automated Testing สำหรับเว็บไซต์ [Swag Labs](https://www.saucedemo.com) โดยใช้ **Playwright** และ **JavaScript**

## 📋 สารบัญ

- [การติดตั้ง](#การติดตั้ง)
- [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)
- [การรัน Test](#การรัน-test)
- [Test Cases](#test-cases)
- [User Credentials](#user-credentials)

## 🚀 การติดตั้ง

### ข้อกำหนดเบื้องต้น
- Node.js (version 16 หรือสูงกว่า)
- npm หรือ yarn

### ขั้นตอนการติดตั้ง

1. ติดตั้ง dependencies:
```bash
npm install
```

2. ติดตั้ง Playwright browsers:
```bash
npx playwright install
```

## 📁 โครงสร้างโปรเจค

```
test-01/
├── tests/
│   ├── login.spec.js              # ทดสอบการ Login
│   ├── products.spec.js           # ทดสอบหน้า Products
│   ├── cart.spec.js               # ทดสอบ Shopping Cart
│   ├── checkout.spec.js           # ทดสอบการ Checkout
│   └── e2e-complete-flow.spec.js  # ทดสอบ End-to-End ทั้งหมด
├── playwright.config.js           # การตั้งค่า Playwright
├── package.json
└── README.md
```

## ▶️ การรัน Test

### รัน Test ทั้งหมด
```bash
npm test
```

### รัน Test แบบแสดง Browser (Headed mode)
```bash
npm run test:headed
```

### รัน Test แบบ UI Mode (Interactive)
```bash
npm run test:ui
```

### รัน Test เฉพาะไฟล์
```bash
npx playwright test login.spec.js
```

### รัน Test เฉพาะ Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### ดู Test Report
```bash
npm run test:report
```

### Debug Mode
```bash
npm run test:debug
```

## 📝 Test Cases

### 1. Login Tests (`login.spec.js`)
- ✅ แสดงหน้า Login ได้ถูกต้อง
- ✅ Login สำเร็จด้วย standard_user
- ✅ แสดง Error สำหรับ locked_out_user
- ✅ แสดง Error สำหรับ username/password ผิด
- ✅ แสดง Error เมื่อ username หรือ password ว่าง
- ✅ ปิด Error message ได้

### 2. Products Tests (`products.spec.js`)
- ✅ แสดงสินค้าทั้งหมด (6 items)
- ✅ เรียงสินค้าตามชื่อ (A-Z, Z-A)
- ✅ เรียงสินค้าตามราคา (ต่ำ-สูง, สูง-ต่ำ)
- ✅ ดูรายละเอียดสินค้า
- ✅ กลับจากหน้ารายละเอียดสินค้า
- ✅ เปิด Menu ได้

### 3. Cart Tests (`cart.spec.js`)
- ✅ เพิ่มสินค้าลงตะกร้า
- ✅ เพิ่มหลายสินค้าลงตะกร้า
- ✅ ลบสินค้าออกจากตะกร้า
- ✅ แสดงสินค้าในตะกร้าถูกต้อง
- ✅ Continue Shopping
- ✅ Proceed to Checkout
- ✅ ตะกร้ายังคงมีสินค้าหลัง Logout/Login

### 4. Checkout Tests (`checkout.spec.js`)
- ✅ แสดงฟอร์มข้อมูลการจัดส่ง
- ✅ กรอกข้อมูลสำเร็จ
- ✅ แสดง Error เมื่อข้อมูลไม่ครบ
- ✅ คำนวณราคารวมถูกต้อง
- ✅ ยกเลิกการ Checkout
- ✅ สั่งซื้อสำเร็จ
- ✅ ตะกร้าว่างหลังสั่งซื้อ

### 5. End-to-End Tests (`e2e-complete-flow.spec.js`)
- ✅ ทดสอบการช้อปปิ้งทั้งหมด (Login → Browse → Cart → Checkout)
- ✅ ทดสอบกับ problem_user
- ✅ ทดสอบกับ performance_glitch_user
- ✅ ตรวจสอบ Visual Elements
- ✅ ตรวจสอบการรักษาสถานะระหว่างการนำทาง

## 👤 User Credentials

เว็บไซต์ SauceDemo มี Test Users หลายแบบ:

| Username | Password | Description |
|----------|----------|-------------|
| `standard_user` | `secret_sauce` | User ปกติ (ใช้ได้ทุกฟีเจอร์) |
| `locked_out_user` | `secret_sauce` | User ที่ถูกล็อค |
| `problem_user` | `secret_sauce` | User ที่มีปัญหา UI |
| `performance_glitch_user` | `secret_sauce` | User ที่มีปัญหาด้าน Performance |
| `error_user` | `secret_sauce` | User ที่เจอ Error บางอย่าง |
| `visual_user` | `secret_sauce` | User ที่มีปัญหา Visual |

## 📊 Test Reports

หลังจากรัน Test เสร็จ Playwright จะสร้าง HTML Report ให้อัตโนมัติ ซึ่งสามารถดูได้โดย:

```bash
npm run test:report
```

Report จะแสดง:
- ✅ Test ที่ผ่าน/ไม่ผ่าน
- 📸 Screenshots (เมื่อ Test ล้มเหลว)
- 🎥 Videos (เมื่อ Test ล้มเหลว)
- 📜 Traces (สำหรับการ Debug)

## 🛠️ Configuration

สามารถปรับแต่งการตั้งค่าได้ที่ `playwright.config.js`:

- **Browsers**: Chromium, Firefox, WebKit
- **Timeouts**: 30 วินาที
- **Screenshots**: บันทึกเมื่อ Test ล้มเหลว
- **Videos**: บันทึกเมื่อ Test ล้มเหลว
- **Retries**: ลองใหม่ 2 ครั้งบน CI

## 💡 Tips

1. ใช้ `--headed` เพื่อดูการทำงานของ Browser
2. ใช้ `--debug` เพื่อ Debug Test แบบทีละขั้นตอน
3. ใช้ `--ui` เพื่อใช้ Playwright UI Mode (สะดวกมาก!)
4. ดู [Playwright Documentation](https://playwright.dev) สำหรับข้อมูลเพิ่มเติม


---

