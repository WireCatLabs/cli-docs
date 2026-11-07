---
title: "Bitrix24"
---

`b24` es una herramienta de línea de comandos de WireCat para los datos de ventas de un portal de Bitrix24, desde la
terminal, desde scripts y desde agentes de IA. Lee y cambia negociaciones, prospectos, contactos (`people`) y empresas
(`organizations`), y lee embudos, etapas, productos y empleados (`users`). `sync` copia embudos, empresas, contactos,
negociaciones y prospectos al almacén local de WireCat, del que leen `deals`, `leads`, `pipelines` y `stages`, también
sin conexión; los contactos, las empresas, los productos y los empleados se leen del portal.

Inicia sesión con un webhook entrante del portal y actúa con los derechos del empleado que creó ese webhook.
`b24 <profile> session status --check` dice quién es.

Empieza por la [instalación](./installation.md) y sigue con el [uso](./usage.md).
