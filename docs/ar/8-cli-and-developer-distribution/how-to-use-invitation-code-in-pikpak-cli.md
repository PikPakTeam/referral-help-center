# كيف أستخدم رمزي مع PikPak CLI؟

أضف خيار `--affiliate` إلى أمر التسجيل، على سبيل المثال:

```bash
pikpak auth register --affiliate YOUR_CODE
```

يمكن للأداة أيضًا تمرير الرمز عبر متغير البيئة `PIKPAK_AFFILIATE`. إذا تم ضبط الاثنين معًا، فسيأخذ خيار `--affiliate` في أمر التسجيل الأولوية.
