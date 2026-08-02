import LegalPage from '@/pages/LegalPage';
import { STORE, SHIPPING, SHOPIFY_DOMAIN } from '@/lib/shop/site';

const EURO = (n: number) => `${n.toFixed(2).replace('.', ',')}€`;

export function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      officialUrl={`${SHOPIFY_DOMAIN}/policies/privacy-policy`}
      intro={`Questa pagina riassume come ${STORE.legalName} tratta i dati personali di chi visita il sito e acquista online.`}
      sections={[
        {
          heading: 'Titolare del trattamento',
          body: `${STORE.legalName}, ${STORE.address}, ${STORE.zip} ${STORE.city} (${STORE.province}). P.IVA ${STORE.vat}. Per qualsiasi richiesta relativa ai dati personali: ${STORE.email}.`,
        },
        {
          heading: 'Dati raccolti',
          body: 'Raccogliamo nome, email, indirizzo di spedizione e telefono, necessari per evadere gli ordini. I dati di pagamento sono gestiti direttamente dai provider di pagamento tramite Shopify e non transitano né vengono conservati sui nostri sistemi.',
        },
        {
          heading: 'Finalità e base giuridica',
          body: 'I dati sono utilizzati per l’esecuzione del contratto di vendita, per le comunicazioni di servizio relative all’ordine e, solo previo consenso esplicito, per l’invio della newsletter. Il consenso alla newsletter è revocabile in qualsiasi momento.',
        },
        {
          heading: 'Responsabili esterni',
          body: 'Il negozio online opera su piattaforma Shopify, che agisce come responsabile del trattamento. Corrieri e provider di pagamento trattano i dati necessari a consegna e incasso.',
        },
        {
          heading: 'Diritti dell’interessato',
          body: `Hai diritto di accesso, rettifica, cancellazione, limitazione, opposizione e portabilità dei dati, oltre al diritto di reclamo al Garante Privacy. Per esercitarli scrivi a ${STORE.email}.`,
        },
        {
          heading: 'Conservazione',
          body: 'I dati relativi agli ordini sono conservati per dieci anni, come previsto dagli obblighi fiscali e contabili. I dati di iscrizione alla newsletter sono conservati fino alla revoca del consenso.',
        },
      ]}
    />
  );
}

export function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      officialUrl={`${SHOPIFY_DOMAIN}/policies/privacy-policy`}
      intro="Il sito utilizza cookie tecnici e, previo consenso, cookie analitici e di marketing."
      sections={[
        {
          heading: 'Cookie tecnici',
          body: 'Sono necessari al funzionamento del sito: mantengono il contenuto del carrello e la sessione di navigazione. Non richiedono consenso e non possono essere disattivati.',
        },
        {
          heading: 'Cookie analitici e di marketing',
          body: 'Ci aiutano a capire come viene usato il sito e a misurare le campagne. Vengono installati solo dopo il tuo consenso, raccolto tramite il banner alla prima visita.',
        },
        {
          heading: 'Cookie di terze parti',
          body: 'Il checkout e la piattaforma di e-commerce sono gestiti da Shopify, che utilizza cookie propri. La mappa del negozio è incorporata da Google Maps.',
        },
        {
          heading: 'Gestione del consenso',
          body: 'Puoi modificare o revocare le preferenze in qualsiasi momento tramite il banner dei cookie o cancellando i cookie dalle impostazioni del browser.',
        },
      ]}
    />
  );
}

export function TermsPage() {
  return (
    <LegalPage
      title="Condizioni di vendita"
      intro={`Le presenti condizioni regolano gli acquisti effettuati sul sito da ${STORE.legalName}.`}
      sections={[
        {
          heading: 'Ordini',
          body: 'Gli ordini sono soggetti alla disponibilità dei capi in negozio. Riceverai una email di conferma: l’accettazione dell’ordine da parte nostra perfeziona il contratto.',
        },
        {
          heading: 'Prezzi',
          body: `Tutti i prezzi sono espressi in Euro e comprensivi di IVA. Le spese di spedizione, quando dovute, sono indicate al checkout prima della conferma dell’ordine.`,
        },
        {
          heading: 'Pagamenti',
          body: 'Il pagamento avviene sul checkout sicuro Shopify. I metodi accettati sono indicati al momento del pagamento. I dati della carta non transitano sui nostri sistemi.',
        },
        {
          heading: 'Consegna',
          body: `Le spedizioni sono affidate a corriere espresso con consegna indicativa in ${SHIPPING.deliveryTime} dalla presa in carico. È disponibile il ritiro gratuito presso il negozio di ${STORE.city}.`,
        },
        {
          heading: 'Recesso',
          body: `Il consumatore ha ${SHIPPING.returnDays} giorni per esercitare il diritto di recesso ai sensi del Codice del Consumo. Vedi la pagina Diritto di recesso.`,
        },
        {
          heading: 'Garanzia legale',
          body: 'Tutti i prodotti sono coperti dalla garanzia legale di conformità di 24 mesi prevista dal Codice del Consumo.',
        },
        {
          heading: 'Foro e risoluzione delle controversie',
          body: 'Per i consumatori è competente il foro di residenza o domicilio. È inoltre disponibile la piattaforma europea ODR per la risoluzione online delle controversie.',
        },
      ]}
    />
  );
}

export function WithdrawalPage() {
  return (
    <LegalPage
      title="Diritto di recesso"
      officialUrl={`${SHOPIFY_DOMAIN}/policies/refund-policy`}
      intro={`Hai ${SHIPPING.returnDays} giorni di tempo per cambiare idea, come previsto dal Codice del Consumo.`}
      sections={[
        {
          heading: 'Termine',
          body: `Il diritto di recesso si esercita entro ${SHIPPING.returnDays} giorni dal ricevimento della merce, senza obbligo di fornire una motivazione.`,
        },
        {
          heading: 'Come esercitarlo',
          body: `Comunica la volontà di recedere scrivendo a ${STORE.email} o su WhatsApp, indicando il numero d’ordine. Ti invieremo le istruzioni per la restituzione.`,
        },
        {
          heading: 'Condizioni della merce',
          body: 'Il capo deve essere restituito integro, non indossato e con le etichette originali intatte.',
        },
        {
          heading: 'Spese di restituzione',
          body: 'Le spese di spedizione per il reso sono a carico del cliente, salvo il caso di prodotto difettoso o non conforme, in cui sono a nostro carico.',
        },
        {
          heading: 'Rimborso',
          body: `Il rimborso viene effettuato entro ${SHIPPING.returnDays} giorni dal ricevimento della merce resa, con lo stesso metodo di pagamento utilizzato per l’acquisto.`,
        },
      ]}
    />
  );
}

export function ShippingPage() {
  return (
    <LegalPage
      title="Spedizioni e resi"
      officialUrl={`${SHOPIFY_DOMAIN}/policies/refund-policy`}
      sections={[
        {
          heading: 'Spedizione standard',
          body: `Spedizione gratuita per ordini superiori a ${SHIPPING.freeThreshold}€. Sotto questa soglia il costo è ${EURO(SHIPPING.standardCost)}. Consegna in ${SHIPPING.deliveryTime} in Italia.`,
        },
        {
          heading: 'Ritiro in negozio',
          body: `Puoi ritirare gratuitamente il tuo ordine presso il negozio di ${STORE.city}, in ${STORE.address}. Riceverai una email quando l’ordine è pronto.`,
        },
        {
          heading: 'Tracciamento',
          body: 'Non appena la spedizione parte riceverai via email il link per seguire la consegna.',
        },
        {
          heading: 'Resi',
          body: `Hai ${SHIPPING.returnDays} giorni per restituire un prodotto. Il reso è a nostro carico in caso di difetto o non conformità; negli altri casi le spese di restituzione sono a carico del cliente.`,
        },
        {
          heading: 'Cambio taglia',
          body: 'Per il cambio taglia contattaci via email o WhatsApp entro il termine di reso: verifichiamo la disponibilità e organizziamo lo scambio.',
        },
      ]}
    />
  );
}
