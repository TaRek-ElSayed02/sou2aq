# تعليمات تكوين Subdomains على localhost

## على Windows:

1. افتح Notepad كـ Administrator
   - ابحث عن Notepad في Start Menu
   - اضغط بـ زر اليمين واختر "Run as administrator"

2. افتح الملف:
   ```
   C:\Windows\System32\drivers\etc\hosts
   ```

3. أضف في نهاية الملف:
   ```
   127.0.0.1 localhost
   127.0.0.1 sub.localhost
   127.0.0.1 shop.localhost
   127.0.0.1 myshop.localhost
   ```

4. احفظ الملف (Ctrl+S)

5. فتح بريتش:
   ```
   ipconfig /flushdns
   ```

---

## على Mac/Linux:

1. افتح Terminal

2. عدّل ملف hosts:
   ```bash
   sudo nano /etc/hosts
   ```

3. أضف في نهاية الملف:
   ```
   127.0.0.1 localhost
   127.0.0.1 sub.localhost
   127.0.0.1 shop.localhost
   127.0.0.1 myshop.localhost
   ```

4. احفظ (Ctrl+X ثم Y ثم Enter)

5. مسح DNS cache:
   ```bash
   sudo dscacheutil -flushcache
   ```

---

بعد التكوين، ستتمكن من زيارة:
- http://sub.localhost:3000/
- http://shop.localhost:3000/
- http://myshop.localhost:3000/
