---
title: "Configuración de wa"
---

Usa esta página para cambiar el comportamiento de `wa` para un perfil o para todos ellos.

```sh
wa personal config show                     # each setting in force, and where it came from
wa personal config set limit 50             # this profile only
wa config set limit 50 --defaults           # every profile
wa personal config unset limit
```

La configuración se encuentra en `~/.config/whatsapp-cli/config.json`. Nunca guardan un secreto. Cada configuración y variable de entorno se encuentra en la [referencia de configuración](./configuration-reference.md).
