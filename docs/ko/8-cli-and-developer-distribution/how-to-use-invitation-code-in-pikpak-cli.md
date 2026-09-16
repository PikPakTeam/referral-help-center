# PikPak CLI에서 내 코드를 어떻게 사용하나요?

등록 명령에 `--affiliate` 옵션을 추가하세요. 예를 들면 다음과 같습니다:

```bash
pikpak auth register --affiliate YOUR_CODE
```

도구는 `PIKPAK_AFFILIATE` 환경 변수를 통해서도 코드를 전달할 수 있습니다. 둘 다 설정된 경우 등록 명령의 `--affiliate` 옵션이 우선합니다.
