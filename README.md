# Raidy Alejandro - Portfolio

Portfolio personal desplegado en Cloudflare Pages con formulario de contacto.

**URL:** [raidyarenas.dev](https://raidyarenas.dev)

## Stack

- HTML5 + TailwindCSS (CDN)
- Cloudflare Pages (hosting)
- Cloudflare Worker (formulario de contacto)
- Resend (envío de emails)

## Estructura del Proyecto

```
├── index.html      # Página principal
├── 404.html        # Página de error
├── _headers        # Headers de seguridad para Cloudflare
├── sugerencia.md   # Notas para LinkedIn
└── worker/
    ├── contact.js      # Worker para el formulario
    └── wrangler.toml   # Configuración del Worker
```

---

## Comandos

### Git - Subir cambios al sitio

```bash
# Ver estado de los archivos modificados
git status

# Agregar todos los cambios
git add -A

# Crear commit con mensaje descriptivo
git commit -m "Descripción del cambio"

# Subir a GitHub (Cloudflare Pages se actualiza automáticamente)
git push
```

> Cloudflare Pages detecta el push y redespliega el sitio en ~1 minuto.

---

### Worker - Formulario de contacto

Los comandos del Worker se ejecutan desde la carpeta `worker/`:

```bash
cd worker
```

#### Desplegar cambios del Worker

```bash
npx wrangler deploy
```

> Sube el código del Worker a Cloudflare. Los cambios son inmediatos.

#### Ver logs en tiempo real

```bash
npx wrangler tail contact
```

> Muestra los logs del Worker mientras recibe requests. Útil para debuggear.

#### Configurar variables secretas

```bash
npx wrangler secret put NOMBRE_DE_LA_VARIABLE
```

> Agrega o actualiza una variable secreta (como API keys). Te pedirá el valor.

#### Probar Worker localmente

```bash
npx wrangler dev
```

> Levanta el Worker en localhost para probar antes de desplegar.

---

### Resend - Configuración de emails

El Worker usa Resend para enviar emails. La API key está guardada como secret.

```bash
# Actualizar la API key de Resend
cd worker
npx wrangler secret put RESEND_API_KEY
# (pegar la key cuando lo pida)
```

**Dashboard de Resend:** [resend.com/emails](https://resend.com/emails)

---

## Flujo de trabajo típico

### Cambiar contenido del sitio (HTML/CSS)

1. Editar `index.html`
2. `git add -A && git commit -m "Descripción" && git push`
3. Esperar ~1 min, el sitio se actualiza solo

### Cambiar el Worker (formulario/emails)

1. Editar `worker/contact.js`
2. `cd worker && npx wrangler deploy`
3. Los cambios son inmediatos

### Cambiar ambos

1. Editar archivos
2. `cd worker && npx wrangler deploy` (Worker primero)
3. `cd .. && git add -A && git commit -m "Descripción" && git push`

---

## URLs

| Servicio | URL |
|----------|-----|
| Sitio | https://raidyarenas.dev |
| Worker | https://contact.raidy-arenas.workers.dev |
| GitHub | https://github.com/raidyarenas/landing |
| Cloudflare Pages | https://dash.cloudflare.com → Pages |
| Cloudflare Workers | https://dash.cloudflare.com → Workers & Pages |
| Resend | https://resend.com/emails |

---

## Notas

- El sitio usa Tailwind desde CDN, no requiere build
- Los emails llegan a `contacto@raidyarenas.dev`
- El Worker responde desde `noreply@raidyarenas.dev`
- Para agregar el custom domain `contact.raidyarenas.dev` al Worker: Dashboard → Workers → contact → Settings → Domains & Routes
