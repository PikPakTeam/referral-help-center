# 怎样在 PikPak CLI 中使用邀请码？

在注册命令中加入 --affiliate 参数，例如：

```bash
pikpak auth register --affiliate YOUR_CODE
```

工具也可以通过 PIKPAK_AFFILIATE 环境变量传递邀请码。如果两者同时设置，以注册命令中的 --affiliate 参数为准。
