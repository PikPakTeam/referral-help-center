# 怎樣在 PikPak CLI 中使用邀請碼？

在註冊命令中加入 `--affiliate` 參數，例如：

```bash
pikpak auth register --affiliate YOUR_CODE
```

工具也可以透過 `PIKPAK_AFFILIATE` 環境變數傳遞邀請碼。如果兩者同時設定，以註冊命令中的 `--affiliate` 參數為準。
