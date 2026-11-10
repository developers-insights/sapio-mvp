# Evidencia de QA · MVP Sapio

Salida **real** de los chequeos corriendo en un Chromium real (Playwright) sobre el
build de `dist/`, en el commit `febc8aa`. Cada comando sale con código distinto de
cero si algo está en rojo.

```bash
npm run build
npm run qa:responsive   # anchos, temas y consola
npm run qa:i18n         # claves crudas, duplicadas y faltantes, en ES y EN
npm run qa:rutas        # rutas profundas sobre `serve dist` SIN -s
npm run qa:porton       # login por rol, ojito, los 13 "Ver en el demo", modales, consola
npm run qa:evidencia    # pack de capturas
```

---

## 1 · Sin scroll horizontal en los seis anchos

Medido **dentro de la página** con
`document.documentElement.scrollWidth === document.documentElement.clientWidth`,
sobre **31 vistas × 6 anchos × 2 temas = 372 chequeos**.

| Ancho | Chequeos | scrollWidth === clientWidth | Consola |
|---|---|---|---|
| 360 px | 62 | 62/62 true | limpia |
| 390 px | 62 | 62/62 true | limpia |
| 768 px | 62 | 62/62 true | limpia |
| 1024 px | 62 | 62/62 true | limpia |
| 1280 px | 62 | 62/62 true | limpia |
| 1440 px | 62 | 62/62 true | limpia |

```
372/372 chequeos en verde
✓ QA responsive en verde
```

> El servidor estático local (`serve`) a veces corta un socket bajo la carga de 372
> contextos seguidos y aparece un `net::ERR_SOCKET_NOT_CONNECTED`. Eso es ruido del
> arnés, no de la app: cuando el **único** error es de transporte, el chequeo se
> repite una vez. En la corrida final hizo falta **0 reintentos**.

## 2 · Consola limpia en cada vista

La mesa redonda se mide **con el guion simulado corriendo** (9 s de espera).

```
✓ propuesta · workplace · calendario · tareas · documentos · proyectos
✓ proyecto-detalle · notificaciones · mesas · mesa-redonda · chat-lista · chat
✓ asistente · uni-panel · uni-miembros · uni-invitaciones-prof · uni-invitaciones-csv
✓ campus-editor · uni-roles · suscripcion · plat-panel · plat-universidades
✓ plat-universidad-detalle · plat-planes · plat-roles · plat-auditoria
✓ plat-seguridad · plat-marca · campus-publico · proximamente · invitacion
   31/31 vistas sin errores
```

## 3 · Texto real en pantalla (i18n)

Corre sobre las pantallas **renderizadas**, en ES y EN.

```
claves declaradas: 1075
claves usadas en el código: 823
1) claves crudas en pantalla (ES+EN): 0
2) claves duplicadas entre archivos: 0
3) claves usadas que no existen: 0
✓ qa:i18n en verde
```

Además se verificó que la versión en inglés no deje datos en castellano
(facultades, países, carpetas, grupos y cargos):

```
✓ invitaciones · invitaciones-csv · miembros · documentos · campus · universidades
```

## 4 · Contrastes medidos (AA ≥ 4.5:1)

Calculados desde los hex de la paleta del manual y mostrados en `/#/plataforma/marca`.

```
  15.25:1  #101D2B sobre #F6F2E9  Azul noche / Marfil
  17.04:1  #101D2B sobre #FFFFFF  Azul noche / Blanco
   5.49:1  #5E6B72 sobre #FFFFFF  Texto secundario / Blanco
   4.92:1  #5E6B72 sobre #F6F2E9  Texto secundario / Marfil
  15.25:1  #F6F2E9 sobre #101D2B  Marfil / Azul noche
   4.60:1  #FFFFFF sobre #527D79  Blanco / Verde mineral (relleno)
   5.36:1  #456A66 sobre #F6F2E9  Verde mineral texto / Marfil
   5.99:1  #456A66 sobre #FFFFFF  Verde mineral texto / Blanco
   8.19:1  #9BBAB7 sobre #101D2B  Verde mineral 300 / Azul noche
   7.63:1  #C9A974 sobre #101D2B  Champán / Azul noche
   7.55:1  #3A5A57 sobre #FFFFFF  Verde mineral 700 / Blanco
   9.96:1  #25465C sobre #FFFFFF  Azul pizarra / Blanco
   4.95:1  #8A6B38 sobre #FFFFFF  Champán 700 / Blanco
   5.22:1  #9C5B4E sobre #FFFFFF  Rojo terroso / Blanco
✓ los 14 pares medidos cumplen AA
```

> El verde mineral del manual (`#527D79`) da **4.11:1** sobre marfil y **no** llega a
> AA como texto chico. Se mantiene como color de relleno (que sí cumple con texto
> blanco encima) y para TEXTO se usa un token que se aclara en oscuro y se oscurece
> en claro: `--mineral-texto`. Fue un bug real que encontró esta medición.

## 5 · Modales centrados

Desvío entre el centro del modal y el centro del viewport, con `getBoundingClientRect()`.
Centrado con `fixed inset-0 m-auto h-fit`, nunca con `left-1/2 top-1/2 -translate`.

```
✓ 1440×900  Welcome (560×435px) → desvío x=0px   y=-0.01px
✓ 1920×854  Welcome (560×435px) → desvío x=0px   y=-0.01px
✓  375×812  Welcome (343×546px) → desvío x=0px   y=-0.01px
```

> El `-0.01px` es sub-pixel: con alturas impares el centro cae en `.5` y el navegador
> redondea. Es exacto a efectos visuales.

## 6 · Rutas profundas sobre el build

`npx serve dist` **sin** el flag `-s`, entrando directo a cada ruta con hash.
La sesión se siembra con `addInitScript`, así la primera navegación es realmente directa.

```
✓ /#/propuesta                  HTTP 200  notFound=false  texto OK  F5=true
✓ /#/mesa/tesis-metodologia     HTTP 200  notFound=false  texto OK  F5=true
✓ /#/universidad/invitaciones   HTTP 200  notFound=false  texto OK  F5=true
✓ /#/campus/northwood           HTTP 200  notFound=false  texto OK  F5=true
✓ 4/4 rutas profundas cargan y sobreviven a F5
```

## 7 · Portón de calidad

```
── A · El login de cada rol aterriza en /propuesta ──
✓ Súper usuario  → #/propuesta   welcome=true
✓ Universidad    → #/propuesta   welcome=true
✓ Profesor       → #/propuesta   welcome=true
✓ Estudiante     → #/propuesta   welcome=true
✓ Colaborador    → #/propuesta   welcome=true

── B · El ojito de la inversión ──
✓ arranca oculto=true  revela todo=true  vuelve a ocultar=true  oculto tras F5=true

── C · "Ver en el demo" de los 13 módulos ──
✓ módulo  1 → #/plataforma/universidades       rol=super        poblada ✓ retorno ✓ resalte ✓
✓ módulo  2 → #/plataforma/roles               rol=super        poblada ✓ retorno ✓ resalte ✓
✓ módulo  3 → #/universidad/campus-editor      rol=universidad  poblada ✓ retorno ✓ resalte ✓
✓ módulo  4 → #/universidad/invitaciones?tab=profesores   rol=universidad  poblada ✓ retorno ✓ resalte ✓
✓ módulo  5 → #/universidad/invitaciones?tab=estudiantes  rol=universidad  poblada ✓ retorno ✓ resalte ✓
✓ módulo  6 → #/workplace                      rol=estudiante   poblada ✓ retorno ✓ resalte ✓
✓ módulo  7 → #/mesa/tesis-metodologia         rol=estudiante   poblada ✓ retorno ✓ resalte ✓
✓ módulo  8 → #/chat/proyecto-tesis            rol=estudiante   poblada ✓ retorno ✓ resalte ✓
✓ módulo  9 → #/workplace/asistente            rol=estudiante   poblada ✓ retorno ✓ resalte ✓
✓ módulo 10 → #/universidad/suscripcion        rol=universidad  poblada ✓ retorno ✓ resalte ✓
✓ módulo 11 → #/plataforma/panel               rol=super        poblada ✓ retorno ✓ resalte ✓
✓ módulo 12 → #/plataforma/auditoria           rol=super        poblada ✓ retorno ✓ resalte ✓
✓ módulo 13 → #/plataforma/marca               rol=super        poblada ✓ retorno ✓ resalte ✓
   (en los 13, al volver se restaura el rol previo: rolRestaurado=estudiante)

✓ PORTÓN EN VERDE
```

## 8 · El portón falla cuando tiene que fallar

Antes de confiar en él se volvieron a meter dos bugs ya arreglados y se confirmó que
sale en rojo con el detalle correcto. Después se revirtieron los dos.

**Bug 1 — desborde de grilla** (saqué `min-w-0` del listado de universidades recientes):

```
✗ light plat-panel  360px  scrollWidth=361 clientWidth=360 → false
5/6 chequeos en verde
✗ QA responsive EN ROJO: 1 chequeos fallaron
```

**Bug 2 — clave de i18n sin declarar** (borré `app.demoPill` del diccionario):

```
1) claves crudas en pantalla (ES+EN): 1
   es · workplace: app.demoPill
   es · campus-publico: app.demoPill
   en · workplace: app.demoPill
   en · campus-publico: app.demoPill
3) claves usadas que no existen: 1
   app.demoPill
✗ qa:i18n EN ROJO
```

También se endureció el propio arnés: `qa:responsive` ahora **falla** si el filtro
`--ruta=` no coincide con ninguna vista, en vez de pasar en verde con 0 chequeos.

## 9 · Capturas

58 capturas en `qa-salida/evidencia/`: cada vista clave a **1440 y 390 px**, más la
Propuesta con el precio **revelado** y **oculto** en los dos anchos, el modo oscuro
y la versión en inglés.

## 10 · Cosas que esta tanda de QA encontró y se arreglaron

- Verde mineral como texto no llegaba a AA sobre marfil (4.11:1 → 5.36:1).
- Desborde de grilla a 360/390 en el panel de la plataforma y en el detalle de proyecto.
- El botón del asistente tapaba el composer del chat en móvil.
- `text-marfil/78` y similares no se generaban: la escala de opacidad de Tailwind solo
  acepta múltiplos de 5. Se extendió a 0–100.
- El tooltip del tour se iba de pantalla con targets altos (el sidebar) y la animación
  `scale-in` pisaba su `translate` inline en el caso centrado.
- El trailer se remontaba al cambiar de modo y volvía a la escena 1.
- La frase que el Dr. Grant escribe en vivo salía al revés (cada carácter se insertaba
  en el mismo ancla).
- Encabezados de tabla reutilizando claves de otra cosa ("ACTUALIZADO" por "Fecha",
  "ACTIVA" por "Estado", "ENVIADA" por "Estado", "MENSUAL" por "Plan").
- "En -6 días" en tareas ya hechas y "1 VERSIONES" en singular.
- La versión en inglés mostraba datos en castellano (facultades, países, carpetas,
  grupos y el departamento dentro del cargo).
