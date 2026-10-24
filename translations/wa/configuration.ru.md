---
title: "Настройки wa"
---

Используйте эту страницу, чтобы изменить поведение `wa` для одного профиля или для всех из них.

```sh
wa personal config show                     # each setting in force, and where it came from
wa personal config set limit 50             # this profile only
wa config set limit 50 --defaults           # every profile
wa personal config unset limit
```

Настройки находятся в `~/.config/whatsapp-cli/config.json`. Они никогда не хранят секретов. Все настройки и переменные среды находятся в [справке по конфигурации](./configuration-reference.md).
