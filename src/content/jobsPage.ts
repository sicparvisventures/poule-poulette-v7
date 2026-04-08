export type JobsLocale = "nl" | "en" | "fr";

export type LocalizedText = Record<JobsLocale, string>;

export type JobOpening = {
  id: string;
  title: LocalizedText;
  type: string;
  place: string;
  summary: LocalizedText;
  responsibilities: Record<JobsLocale, readonly string[]>;
  profile: Record<JobsLocale, readonly string[]>;
  offer: Record<JobsLocale, readonly string[]>;
  practical: Record<JobsLocale, readonly string[]>;
  process: Record<JobsLocale, readonly string[]>;
};

export const jobsPageCopy = {
  title: "Jobs",
  intro: {
    nl: "Werken in een team dat tempo, warmte en kwaliteit combineert. Van zaal tot keuken: we zoeken mensen die energie geven aan elk service-moment.",
    en: "Work with a team that combines pace, warmth and quality. From floor to kitchen, we are looking for people who bring energy to every service moment.",
    fr: "Travailler dans une equipe qui combine rythme, chaleur et qualite. De la salle a la cuisine, nous cherchons des profils qui apportent de l'energie a chaque service.",
  },
  ctaPrimary: {
    nl: "Stuur je kandidatuur",
    en: "Send your application",
    fr: "Envoyer votre candidature",
  },
  ctaSecondary: {
    nl: "Bekijk locaties",
    en: "View locations",
    fr: "Voir les adresses",
  },
  mailto: "jobs@poulepoulette.com",
  modalCta: {
    nl: "Solliciteer voor deze rol",
    en: "Apply for this role",
    fr: "Postuler pour ce role",
  },
};

export const jobsUI = {
  backHome: { nl: "Home", en: "Home", fr: "Accueil" },
  menu: { nl: "Menu", en: "Menu", fr: "Menu" },
  applyNow: { nl: "Apply now", en: "Apply now", fr: "Postuler" },
  whatYouDo: {
    nl: "Wat je doet",
    en: "What you will do",
    fr: "Vos missions",
  },
  profile: {
    nl: "Jouw profiel",
    en: "Your profile",
    fr: "Votre profil",
  },
  offer: {
    nl: "Wat wij bieden",
    en: "What we offer",
    fr: "Ce que nous offrons",
  },
  practical: {
    nl: "Praktisch",
    en: "Practical",
    fr: "Informations pratiques",
  },
  process: {
    nl: "Sollicitatieproces",
    en: "Application process",
    fr: "Processus de recrutement",
  },
  close: { nl: "Sluiten", en: "Close", fr: "Fermer" },
  formTitle: {
    nl: "Jouw kandidatuur",
    en: "Your application",
    fr: "Votre candidature",
  },
  formIntro: {
    nl: "Vul de kerngegevens in. Ons team neemt snel contact op.",
    en: "Share the key details. Our team will contact you shortly.",
    fr: "Renseignez les informations essentielles. Notre equipe vous recontacte rapidement.",
  },
  labels: {
    fullName: { nl: "Naam", en: "Full name", fr: "Nom complet" },
    email: { nl: "E-mail", en: "E-mail", fr: "E-mail" },
    phone: { nl: "Telefoon", en: "Phone", fr: "Telephone" },
    preferredLocation: {
      nl: "Voorkeurslocatie",
      en: "Preferred location",
      fr: "Adresse preferee",
    },
    availability: {
      nl: "Beschikbaarheid",
      en: "Availability",
      fr: "Disponibilite",
    },
    motivation: { nl: "Motivatie", en: "Motivation", fr: "Motivation" },
    cvUrl: { nl: "CV of LinkedIn", en: "CV or LinkedIn", fr: "CV ou LinkedIn" },
  },
  placeholders: {
    preferredLocation: {
      nl: "Bijv. Antwerpen, Brussel...",
      en: "Example: Antwerp, Brussels...",
      fr: "Exemple : Anvers, Bruxelles...",
    },
    availability: {
      nl: "Bijv. Full-time, weekends mogelijk",
      en: "Example: Full-time, weekends possible",
      fr: "Exemple : Temps plein, weekends possibles",
    },
    motivation: {
      nl: "Vertel kort waarom je bij Poule & Poulette wil werken.",
      en: "Tell us briefly why you want to join Poule & Poulette.",
      fr: "Expliquez brièvement pourquoi vous voulez rejoindre Poule & Poulette.",
    },
    cvUrl: {
      nl: "https://...",
      en: "https://...",
      fr: "https://...",
    },
  },
  submit: {
    idle: { nl: "Verzend kandidatuur", en: "Send application", fr: "Envoyer la candidature" },
    sending: { nl: "Bezig met verzenden...", en: "Sending...", fr: "Envoi en cours..." },
  },
  success: {
    nl: "Bedankt, je kandidatuur is goed ontvangen.",
    en: "Thanks, your application has been received.",
    fr: "Merci, votre candidature a bien ete recue.",
  },
  errors: {
    required: {
      nl: "Vul alle verplichte velden in.",
      en: "Please fill in all required fields.",
      fr: "Veuillez remplir tous les champs obligatoires.",
    },
    submit: {
      nl: "Er liep iets mis. Probeer opnieuw.",
      en: "Something went wrong. Please try again.",
      fr: "Un probleme est survenu. Veuillez reessayer.",
    },
  },
} as const;

export const jobsMarqueePhrases = [
  "Good Chicken",
  "Great Team",
  "Fun Loving Food Moments",
  "Grow With Us",
];

export const jobsOpenings: readonly JobOpening[] = [
  {
    id: "floor-host",
    title: {
      nl: "Floor Host",
      en: "Floor Host",
      fr: "Floor Host",
    },
    type: "Part-time / Full-time",
    place: "Antwerpen · Gent · Brussel",
    summary: {
      nl: "Je verwelkomt gasten, houdt de serviceflow strak en bewaakt de energie op de vloer tijdens piekservice.",
      en: "You welcome guests, keep service flow sharp and maintain energy on the floor during peak moments.",
      fr: "Vous accueillez les clients, gardez un service fluide et maintenez l'energie en salle pendant les pics.",
    },
    responsibilities: {
      nl: [
        "Je ontvangt gasten en begeleidt hen vlot naar tafel of takeaway-flow.",
        "Je houdt overzicht op zaal, timing en samenwerking met bar en keuken.",
        "Je communiceert helder over menu, allergenen en suggesties.",
      ],
      en: [
        "Welcome guests and guide them smoothly to table or takeaway flow.",
        "Maintain overview of floor operations, timing and team coordination.",
        "Communicate clearly about menu options, allergens and recommendations.",
      ],
      fr: [
        "Accueillir les clients et les orienter vers la salle ou le flux takeaway.",
        "Garder une vue claire sur le service, le timing et la coordination.",
        "Communiquer clairement sur la carte, les allergenes et les suggestions.",
      ],
    },
    profile: {
      nl: [
        "Je bent gastgericht, energiek en houdt van service met ritme.",
        "Je blijft rustig bij drukte en meerdere tafels tegelijk.",
        "Weekend- en avondshifts passen in je planning.",
      ],
      en: [
        "You are guest-focused, energetic and enjoy service with pace.",
        "You stay calm under pressure with multiple tables at once.",
        "Evening and weekend shifts fit your availability.",
      ],
      fr: [
        "Vous etes orienté client, dynamique et aimez le rythme du service.",
        "Vous restez calme sous pression avec plusieurs tables en meme temps.",
        "Les shifts du soir et du week-end vous conviennent.",
      ],
    },
    offer: {
      nl: [
        "Een sterk team met duidelijke coaching op de vloer.",
        "Flexibele roosters en ruimte om door te groeien.",
        "Marktconforme verloning en maaltijdvoordelen.",
      ],
      en: [
        "A strong team with clear coaching on the floor.",
        "Flexible schedules and room to grow.",
        "Competitive salary and meal benefits.",
      ],
      fr: [
        "Une equipe solide avec un coaching clair sur le terrain.",
        "Des horaires flexibles et des perspectives d'evolution.",
        "Une remuneration competitive et des avantages repas.",
      ],
    },
    practical: {
      nl: ["Contract: part-time of full-time.", "Shifts tussen ontbijt, lunch en avondservice."],
      en: ["Contract: part-time or full-time.", "Shifts across breakfast, lunch and evening service."],
      fr: ["Contrat : temps partiel ou temps plein.", "Shifts sur petit-dejeuner, lunch et service du soir."],
    },
    process: {
      nl: ["Online kandidatuur", "Screening call", "Interview in vestiging", "Testshift", "Aanbod en opstart"],
      en: ["Online application", "Screening call", "In-store interview", "Trial shift", "Offer and onboarding"],
      fr: ["Candidature en ligne", "Appel de screening", "Entretien en restaurant", "Shift test", "Offre et onboarding"],
    },
  },
  {
    id: "kitchen-crew",
    title: {
      nl: "Kitchen Crew",
      en: "Kitchen Crew",
      fr: "Kitchen Crew",
    },
    type: "Full-time",
    place: "Antwerpen · Leuven · Brussel",
    summary: {
      nl: "Je werkt mee aan mise-en-place en service met focus op snelheid, kwaliteit en consistente plate-up.",
      en: "You support prep and service with focus on speed, quality and consistent plate-up.",
      fr: "Vous participez a la mise en place et au service avec un focus sur la vitesse, la qualite et la regularite.",
    },
    responsibilities: {
      nl: [
        "Je bereidt service en prep volgens receptuur en timing.",
        "Je bewaakt food safety, houdbaarheid en nette werkstations.",
        "Je communiceert snel met pass en zaal tijdens drukte.",
      ],
      en: [
        "Prepare service and mise-en-place according to recipe and timing.",
        "Maintain food safety, shelf life and clean stations.",
        "Coordinate quickly with pass and floor team during peaks.",
      ],
      fr: [
        "Preparer la mise en place et le service selon les recettes et le timing.",
        "Garantir la securite alimentaire et des postes propres.",
        "Communiquer rapidement avec le pass et la salle en periode de pointe.",
      ],
    },
    profile: {
      nl: [
        "Je werkt graag in team en houdt van een snel ritme.",
        "Je bent nauwkeurig en hebt oog voor detail en hygiëne.",
        "Flexibele beschikbaarheid tijdens piekuren en weekends.",
      ],
      en: [
        "You enjoy teamwork and a fast pace.",
        "You are precise with strong attention to detail and hygiene.",
        "Flexible availability during peak hours and weekends.",
      ],
      fr: [
        "Vous aimez le travail d'equipe et un rythme soutenu.",
        "Vous etes rigoureux avec le sens du detail et de l'hygiene.",
        "Disponibilite flexible pendant les pics et les week-ends.",
      ],
    },
    offer: {
      nl: [
        "Professionele onboarding met duidelijke standaarden.",
        "Stabiel uurrooster en ondersteuning van ervaren collega’s.",
        "Doorgroei naar station lead of shift lead.",
      ],
      en: [
        "Professional onboarding with clear standards.",
        "Stable schedule and support from experienced colleagues.",
        "Growth path toward station lead or shift lead.",
      ],
      fr: [
        "Onboarding professionnel avec des standards clairs.",
        "Planning stable et soutien d'une equipe experimentee.",
        "Evolution possible vers station lead ou shift lead.",
      ],
    },
    practical: {
      nl: ["Contract: full-time.", "Vroege en late shifts afhankelijk van vestiging."],
      en: ["Contract: full-time.", "Early and late shifts depending on location."],
      fr: ["Contrat : temps plein.", "Shifts du matin et du soir selon le restaurant."],
    },
    process: {
      nl: ["Online kandidatuur", "Screening", "Gesprek met manager", "Praktische proef", "Aanbod en planning"],
      en: ["Online application", "Screening", "Manager interview", "Practical trial", "Offer and planning"],
      fr: ["Candidature en ligne", "Screening", "Entretien manager", "Essai pratique", "Offre et planning"],
    },
  },
  {
    id: "shift-lead",
    title: {
      nl: "Shift Lead",
      en: "Shift Lead",
      fr: "Shift Lead",
    },
    type: "Full-time",
    place: "Meerdere vestigingen",
    summary: {
      nl: "Je coacht het team op de shift, bewaakt service en standaarden en grijpt snel in waar nodig.",
      en: "You coach the team on shift, safeguard service standards and intervene quickly when needed.",
      fr: "Vous coachez l'equipe en shift, garantissez les standards de service et intervenez rapidement.",
    },
    responsibilities: {
      nl: [
        "Je opent/sluit mee en verdeelt rollen voor vlotte service.",
        "Je stuurt collega’s aan op tempo, prioriteit en kwaliteit.",
        "Je behandelt operationele issues en gastfeedback.",
      ],
      en: [
        "Support opening/closing and assign roles for smooth service.",
        "Coach team members on pace, priorities and quality.",
        "Handle operational issues and guest feedback.",
      ],
      fr: [
        "Participer a l'ouverture/fermeture et distribuer les roles.",
        "Accompagner l'equipe sur le rythme, les priorites et la qualite.",
        "Gerer les problemes operationnels et les retours clients.",
      ],
    },
    profile: {
      nl: [
        "Ervaring met teamcoaching in horeca of retail service.",
        "Je bent besluitvaardig en houdt overzicht onder druk.",
        "Je combineert operationele discipline met people skills.",
      ],
      en: [
        "Experience in team coaching in hospitality or retail service.",
        "You are decisive and keep overview under pressure.",
        "You combine operational discipline with people skills.",
      ],
      fr: [
        "Experience en coaching d'equipe en horeca ou retail service.",
        "Vous etes decisif et gardez une vue d'ensemble sous pression.",
        "Vous combinez discipline operationnelle et competences humaines.",
      ],
    },
    offer: {
      nl: [
        "Leiderschapsrol met impact op servicekwaliteit en teamgroei.",
        "Begeleiding en groeipad binnen meerdere vestigingen.",
        "Competitief loonpakket en voordelen.",
      ],
      en: [
        "Leadership role with impact on service quality and team growth.",
        "Guidance and growth path across multiple locations.",
        "Competitive compensation and benefits.",
      ],
      fr: [
        "Role de leadership avec impact sur la qualite et l'equipe.",
        "Accompagnement et evolution sur plusieurs adresses.",
        "Package salarial competitif et avantages.",
      ],
    },
    practical: {
      nl: ["Contract: full-time.", "Variabele uurroosters met weekendrotatie."],
      en: ["Contract: full-time.", "Variable schedules with weekend rotation."],
      fr: ["Contrat : temps plein.", "Horaires variables avec rotation week-end."],
    },
    process: {
      nl: ["Online kandidatuur", "Eerste interview", "Tweede gesprek", "Proefmoment", "Finale beslissing"],
      en: ["Online application", "First interview", "Second interview", "Trial day", "Final decision"],
      fr: ["Candidature en ligne", "Premier entretien", "Deuxieme entretien", "Journee test", "Decision finale"],
    },
  },
];
