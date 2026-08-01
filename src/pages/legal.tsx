import LegalPage from '@/pages/LegalPage';

export function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      sections={[
        { heading: 'Titolare del trattamento', body: 'Colorado Store, Corso Vittorio Emanuele II, 42, 83100 Avellino (AV). P.IVA 00000000000. Contatto: privacy@coloradostore.it.' },
        { heading: 'Dati raccolati', body: 'Raccogliamo nome, email, indirizzo di spedizione e telefono necessari per processare gli ordini. I dati di pagamento sono gestiti dal provider di pagamento e non transitano sui nostri server.' },
        { heading: 'Finalità del trattamento', body: 'I dati sono utilizzati per evadere gli ordini, comunicazioni relative al servizio e, previo consenso, newsletter marketing.' },
        { heading: 'Base giuridica', body: 'Il trattamento avviene sulla base del contratto per gli ordini e del consenso per la newsletter. Puoi opporti in qualsiasi momento.' },
        { heading: 'Diritti dell\'interessato', body: 'Hai diritto di accesso, rettifica, cancellazione, limitazione e portabilità. Per esercitare i diritti scrivi a privacy@coloradostore.it.' },
        { heading: 'Conservazione', body: 'I dati di ordine sono conservati per 10 anni per obblighi fiscali. I dati di newsletter fino al ritiro del consenso.' },
      ]}
    />
  );
}

export function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      sections={[
        { heading: 'Cookie tecnici', body: 'Utilizziamo cookie tecnici necessari al funzionamento del sito (carrello, sessione). Non richiedono consenso.' },
        { heading: 'Cookie analitici', body: 'Utilizziamo cookie analitici per comprendere l\'utilizzo del sito. Possono essere disattivati senza compromettere la navigazione.' },
        { heading: 'Cookie di terze parti', body: 'Il checkout utilizza cookie del provider di pagamento. Consulta la privacy policy del provider per dettagli.' },
        { heading: 'Gestione consenso', body: 'Puoi modificare le preferenze sui cookie in qualsiasi momento tramite il banner o le impostazioni del browser.' },
      ]}
    />
  );
}

export function TermsPage() {
  return (
    <LegalPage
      title="Condizioni di vendita"
      sections={[
        { heading: 'Ordini', body: 'Gli ordini sono soggetti a disponibilità. La conferma dell\'ordine costituisce accettazione della proposta. Ti invieremo email di conferma.' },
        { heading: 'Prezzi', body: 'I prezzi sono in Euro e includono IVA. Le spedizioni sono gratuite oltre 99€. Costi aggiuntivi sono mostrati al checkout.' },
        { heading: 'Pagamenti', body: 'Accettiamo carte di credito, PayPal e contrassegno. Il pagamento è sicuro e crittografato.' },
        { heading: 'Consegna', body: 'Le spedizioni sono effettuate entro 2-4 giorni lavorativi. Il ritiro in negozio è disponibile entro 24 ore dall\'ordine.' },
        { heading: 'Recesso', body: 'Hai 14 giorni per esercitare il diritto di recesso. Vedi la pagina Diritto di recesso per le modalità.' },
        { heading: 'Garanzie', body: 'Tutti i prodotti sono coperti dalla garanzia legale di conformità di 24 mesi.' },
      ]}
    />
  );
}

export function WithdrawalPage() {
  return (
    <LegalPage
      title="Diritto di recesso"
      sections={[
        { heading: 'Termine', body: 'Hai 14 giorni dal ricevimento della merce per esercitare il diritto di recesso, senza dover fornire motivazione.' },
        { heading: 'Modalità', body: 'Comunica la volontà di recedere via email a resi@coloradostore.it, indicando il numero d\'ordine. Ti invieremo le istruzioni per la restituzione.' },
        { heading: 'Spese di restituzione', body: 'Le spese di spedizione per la restituzione sono a carico del consumatore, salvo difetto del prodotto.' },
        { heading: 'Rimborso', body: 'Il rimborso viene effettuato entro 14 giorni dal ricevimento della merce, con lo stesso metodo di pagamento utilizzato per l\'acquisto.' },
        { heading: 'Eccezioni', body: 'Il diritto di recesso non si applica a prodotti personalizzati o sigillati aperti.' },
      ]}
    />
  );
}

export function ShippingPage() {
  return (
    <LegalPage
      title="Spedizioni e resi"
      sections={[
        { heading: 'Spedizione standard', body: 'Spedizione gratuita per ordini superiori a 99€. Sotto questa soglia il costo è 6,90€. Consegna in 2-4 giorni lavorativi in Italia.' },
        { heading: 'Ritiro in negozio', body: 'Ritira gratis il tuo ordine in negozio ad Avellino. Pronto in 24 ore — riceverai email di conferma quando l\'ordine è disponibile.' },
        { heading: 'Resi', body: 'Hai 14 giorni per restituire un prodotto. Il reso è gratuito per difetti; in altri casi le spese di restituzione sono a carico del cliente.' },
        { heading: 'Cambi', body: 'Puoi richiedere un cambio taglia entro 14 giorni. Contattaci via email o WhatsApp per organizzare il cambio.' },
        { heading: 'Tracciamento', body: 'Riceverai un link di tracciamento via email non appena la spedizione parte dal nostro magazzino.' },
      ]}
    />
  );
}
