---
title: "Recetas"
---

Tareas completas que puedes encargar a tu agente, cada una con una petición para copiar y los comandos que el agente
ejecuta. Dan por hecho que ya has [iniciado sesión](./installation.md), elegido carpetas y
[conectado tu agente](./mcp.md). Cambia el perfil, las rutas y los nombres por los tuyos. Los de aquí son ejemplos.

**En esta página:**

1. [Encuentra un contrato y cita sus condiciones](#find-a-contract-and-quote-its-terms)
2. [Responde a partir de un archivo fuera de las carpetas elegidas](#answer-from-a-file-outside-the-chosen-folders)
3. [Ordena las facturas del año pasado en un archivo](#tidy-last-years-invoices-into-an-archive)
4. [Comparte un archivo y cierra el enlace después](#share-a-file-and-close-the-link-later)
5. [Pon en el Disk un informe que escribió el agente](#put-a-report-the-agent-wrote-on-the-disk)
6. [Edita un archivo con tu agente](#edit-a-file-with-your-agent)
7. [Deshaz un borrado](#undo-a-delete)
8. [Mantén la copia al día cada mañana](#keep-the-copy-current-every-morning)

## Encuentra un contrato y cita sus condiciones

```text prompt
Use ydisk CLI with profile personal. Find the contract with Harbour Ltd in my Disk folders.
Quote the payment terms and the notice period, and give me the file's path on the Disk. Do not change any files.
```

```sh
ydisk personal search "Harbour Ltd contract" --json
ydisk personal documents show 1a2b3c --json
```

El agente busca en la copia y luego lee el texto completo del mejor resultado. Si la copia está desactualizada,
ejecuta antes `ydisk personal sync`.

## Responde a partir de un archivo fuera de las carpetas elegidas

```text prompt
Use ydisk CLI with profile personal. Open /Work/Q3/report.xlsx on my Disk and tell me the total for September.
```

```sh
ydisk personal files download /Work/Q3/report.xlsx --json
```

`files download` sin `--output` responde con el texto del archivo, así que no se guarda nada en tu ordenador. Un texto
de más de 200 000 caracteres se corta y dice `truncated: true`. Para las celdas mismas, con sus fórmulas,
`ydisk personal files sheets show /Work/Q3/report.xlsx` las da por dirección.

## Ordena las facturas del año pasado en un archivo

```text prompt
Use ydisk CLI with profile personal. Move every invoice from 2025 in /Documents/Invoices to /Archive/Invoices-2025.
Show me the list before you move anything.
```

```sh
ydisk personal files list --folder /Documents/Invoices --json
ydisk personal files create /Archive/Invoices-2025
ydisk personal files move /Documents/Invoices/2025-03.pdf --folder /Archive/Invoices-2025 --dry-run
ydisk personal files move /Documents/Invoices/2025-03.pdf --folder /Archive/Invoices-2025
```

`--dry-run` muestra lo que haría un movimiento sin hacerlo. Un movimiento conserva las etiquetas y las notas del
archivo en la copia.

## Comparte un archivo y cierra el enlace después

```text prompt
Use ydisk CLI with profile personal. Make a public link to /Documents/Flat/lease-2026.pdf so I can send it to Bob.
```

```sh
ydisk personal files publish /Documents/Flat/lease-2026.pdf
ydisk personal files unpublish /Documents/Flat/lease-2026.pdf
```

Cualquiera que tenga un enlace público puede abrir el archivo. En un terminal la herramienta pregunta antes. Por MCP
sigue el permiso `files.share`, mira [conexión del agente](./mcp.md#decide-what-the-agent-may-change).

## Pon en el Disk un informe que escribió el agente

```text prompt
Use ydisk CLI with profile personal. Save the summary you just wrote as summary.md in /Reports on my Disk.
```

```sh
ydisk personal files upload ./summary.md --folder /Reports
```

Una subida rechaza los archivos de credenciales, los perfiles de navegador y las carpetas de WireCat, así que un
agente no puede enviarlos al Disk por error.

## Edita un archivo con tu agente

El agente lee el archivo, lo edita y lo escribe de vuelta con el `sha256` que leyó. Si alguien cambió el archivo
mientras tanto, la escritura se rechaza y no se sube nada: el agente lo lee otra vez y repite la edición. Lo que
reemplazó cada edición se guarda en este ordenador.

Una nota de Markdown:

```text prompt
Use ydisk CLI with profile personal. In /Notes/plan.md on my Disk, tick "send the invoice" and add
"call the bank" under Friday. Keep everything else as it is.
```

```sh
ydisk personal files download /Notes/plan.md --json
ydisk personal files update /Notes/plan.md --expected-fingerprint <sha256 from the download> < plan.md
```

La descarga da el texto completo y su `sha256`. Un texto cortado a los 200 000 caracteres no tiene `sha256`, así que
nunca se puede escribir de vuelta.

Una hoja de cálculo:

```text prompt
Use ydisk CLI with profile personal. In /Work/budget.xlsx, set the March rent to 1300 and mark it paid.
```

```sh
ydisk personal files sheets show /Work/budget.xlsx "Sheet1!A1:D20" --json
ydisk personal files sheets update /Work/budget.xlsx "Sheet1!B3:C3" --values '[[1300, "paid"]]' --expected-fingerprint <sha256>
```

Solo cambian esas celdas; el formato, las otras hojas y las fórmulas se mantienen. Una celda con fórmula se rechaza salvo
que el agente añada `--replace`.

Un documento de Word:

```text prompt
Use ydisk CLI with profile personal. In /Work/letter.docx, replace the second paragraph with
"The pond opens on Monday." and add "Kind regards, Anna" at the end.
```

```sh
ydisk personal files documents show /Work/letter.docx --json
ydisk personal files documents update /Work/letter.docx --payload '[{"index": 1, "text": "The pond opens on Monday."}, {"insert_after": 5, "text": "Kind regards, Anna"}]' --expected-fingerprint <sha256>
```

Los párrafos conservan su estilo. Un párrafo con un cambio controlado, una imagen, un comentario o un enlace se rechaza
con el motivo, para que el agente te lo diga.

Para deshacer una edición:

```sh
ydisk personal files history /Work/letter.docx
ydisk personal files restore /Work/letter.docx <version> --expected-fingerprint <sha256 the file has now>
```

## Deshaz un borrado

```text prompt
Use ydisk CLI with profile personal. I deleted old.pdf from my Disk by mistake. Bring it back.
```

```sh
ydisk personal api trash-resources-list --json
ydisk personal files restore trash:/old.pdf
```

`files delete` mueve un archivo a la papelera del Disk, así que puede volver hasta que se vacíe la papelera.

## Mantén la copia al día cada mañana

Nada se sincroniza en segundo plano. Para tener una copia fresca cada mañana, ejecuta `sync` desde el programador de
tu sistema, como cron en Linux y macOS:

```text
0 8 * * * ydisk personal sync --quiet
```

La línea ejecuta la sincronización a las 8:00 todos los días. Si cron no encuentra `ydisk`, usa la ruta completa que
imprime `which ydisk`. Ejecuta `ydisk personal status` para ver cuándo terminó la última sincronización.
