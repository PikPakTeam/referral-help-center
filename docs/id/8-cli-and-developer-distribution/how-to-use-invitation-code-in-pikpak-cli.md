# Bagaimana cara menggunakan kode saya di PikPak CLI?

Tambahkan opsi `--affiliate` pada perintah pendaftaran, misalnya:

```bash
pikpak auth register --affiliate YOUR_CODE
```

Alat juga dapat meneruskan kode melalui variabel lingkungan `PIKPAK_AFFILIATE`. Jika keduanya diatur, opsi `--affiliate` pada perintah pendaftaran yang akan diprioritaskan.
