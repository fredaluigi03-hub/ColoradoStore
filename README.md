# Colorado Store — storefront

Front-end custom per **Colorado Store** (GD S.R.L., Avellino), rivenditore ufficiale Levi's.
Il negozio gira su **Shopify**: questo progetto è la vetrina, il catalogo e il checkout
restano di Shopify.

## Come funziona

```
Shopify (coloradostore.it)          questo progetto
├── catalogo, giacenze, prezzi  ──► scripts/sync-catalog.mjs ──► public/catalog.json
├── checkout e pagamenti        ◄── permalink /cart/{variantId}:{qty}
├── modulo contatti             ◄── POST /contact
└── policy privacy e resi       ◄── link diretti
```

Nessun backend nostro, nessun dato di pagamento sui nostri server.

## Comandi

```bash
npm install
npm run dev        # sviluppo
npm run sync       # riscarica catalogo, immagini editoriali e sitemap da Shopify
npm run build      # build di produzione
npm run typecheck
npm run lint
```

## Aggiornare il catalogo

`npm run sync` legge gli endpoint pubblici `.json` di Shopify e rigenera:

- `public/catalog.json` — prodotti, varianti, prezzi, disponibilità, collection
- `src/lib/shop/editorial.ts` — immagini editoriali scelte dal catalogo reale
- `public/sitemap.xml` — una URL per prodotto e collection

Va rilanciato quando il negozio cambia assortimento. Con un cron settimanale in CI
il sito resta allineato da solo.

### Passare all'API live

`src/lib/shop/index.ts` è l'unico punto da toccare: le interfacce in `types.ts`
sono già modellate sulla Shopify Storefront API. Con uno Storefront access token
si sostituisce `loadCatalog()` con le query GraphQL e il resto dell'app non cambia.
Solo allora prezzi e giacenze diventano in tempo reale.

## Da completare prima del go-live

1. **Prerender.** È una SPA: i meta per pagina sono impostati via JS. Google li
   vede, Facebook e WhatsApp no. Serve prerender in build (`vite-plugin-prerender`,
   `react-snap`) o passaggio a Next.js/Astro.
2. **Fallback SPA sull'hosting.** Tutte le route devono servire `index.html`
   (Netlify `_redirects`, Vercel `rewrites`, o `try_files` su nginx).
3. **Condizioni di vendita e spedizioni.** Su Shopify esistono solo
   `privacy-policy` e `refund-policy`. Termini di servizio e policy spedizioni
   vanno scritti e fatti validare.
4. **Autorizzazione Levi's.** L'uso del marchio e della dicitura "rivenditore
   ufficiale" va coperto da autorizzazione scritta di Levi Strauss Italia.
5. **Analytics.** Nessuno script installato. Va caricato solo nel ramo
   `accepted` di `src/components/CookieBanner.tsx`.

## Struttura

```
scripts/sync-catalog.mjs    sincronizzazione da Shopify (generatore)
src/lib/shop/site.ts        dati reali del negozio: unica fonte per contatti
src/lib/shop/index.ts       data layer — punto di sostituzione per l'API live
src/lib/shop/editorial.ts   GENERATO — non modificare a mano
src/lib/meta.ts             meta e JSON-LD per pagina
```
