# PikPak CLIで自分のコードを使うにはどうすればよいですか？

登録コマンドに `--affiliate` オプションを追加します。例:

```bash
pikpak auth register --affiliate YOUR_CODE
```

ツール側で `PIKPAK_AFFILIATE` 環境変数を通じてコードを渡すこともできます。両方が設定されている場合は、登録コマンドの `--affiliate` オプションが優先されます。
