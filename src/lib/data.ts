import heroA from "@/assets/img/hero-a.jpg";
import heroB from "@/assets/img/hero-b.jpg";
import benita from "@/assets/img/benita.jpg";
import mobileBar from "@/assets/img/mobile-bar.jpg";
import smoke from "@/assets/img/cocktail-smoke.jpg";
import coupe from "@/assets/img/cocktail-coupe.jpg";
import spritz from "@/assets/img/cocktail-spritz.jpg";
import toast from "@/assets/img/toast.jpg";
import ingredients from "@/assets/img/ingredients.jpg";

export const IMG = { heroA, heroB, benita, mobileBar, smoke, coupe, spritz, toast, ingredients };

export const BRAND = {
  name: "Benita",
  full: "Benita Bar Co.",
  line: "Private Bartending & Mobile Bar",
  est: "Est. 2013",
  email: "hello@benitabar.co",
  phone: "(415) 555-0182",
  studio: "Studio & Cellar — 118 Vine Street, Napa, CA",
  areas: ["Napa Valley", "San Francisco", "Sonoma", "Lake Tahoe", "Carmel", "Marin"],
  hours: [
    ["Consultations", "Tue – Sat · 10am – 6pm"],
    ["Event service", "Seven days · 6am – 2am"],
    ["Cellar tastings", "By appointment"],
  ],
};

/* ------------------------------------------------------------------ STATS */
export const STATS = [
  { value: 12, suffix: "", label: "Years behind the bar" },
  { value: 480, suffix: "+", label: "Events poured" },
  { value: 96, suffix: "", label: "Signature recipes" },
  { value: 100, suffix: "%", label: "Five-star hosts" },
];

export const TICKER = [
  "Weddings",
  "Handcrafted Cocktails",
  "Corporate Gatherings",
  "Birthdays",
  "Private Parties",
  "Bespoke Drink Menus",
  "Upscale Celebrations",
  "Zero-Proof Pairings",
];

/* ---------------------------------------------------------------- SERVICES */
export type Service = {
  num: string;
  title: string;
  desc: string;
  bullets: string[];
  img: string;
};

export const SERVICES: Service[] = [
  {
    num: "01",
    title: "Private Bartending",
    desc: "One bar, one host, your room. Benita works in your home or venue with full mise en place — ice, glassware, garnish, and an unhurried pour.",
    bullets: ["Solo or two-bartender service", "Full bar setup & teardown", "Guest-facing hospitality"],
    img: benita,
  },
  {
    num: "02",
    title: "The Mobile Bar",
    desc: "A hand-built walnut bar on brass wheels, a converted 1968 trailer, or a marble-topped island — styled to your room and dressed with florals.",
    bullets: ["Three bar formats", "Floral & candle styling", "Indoor / outdoor rated"],
    img: mobileBar,
  },
  {
    num: "03",
    title: "Signature Menu Design",
    desc: "We write a drink list that reads like your story — named for the people, places and seasons that matter, printed on cotton card stock.",
    bullets: ["Tasting session included", "Custom letterpress menu", "Paired to your caterer"],
    img: ingredients,
  },
  {
    num: "04",
    title: "Cocktail Masterclass",
    desc: "Forty-five minutes of hands-on craft before service — shaking, stirring, expressing oils — so your guests arrive at the bar already fluent.",
    bullets: ["Up to 24 guests per round", "Take-home recipe cards", "Kit rental available"],
    img: smoke,
  },
  {
    num: "05",
    title: "Full-Service Bar Catering",
    desc: "Sourcing, chilling, stocking, staffing and clearing. You host; we carry the weight of the room from first ice run to last call.",
    bullets: ["Premium spirit program", "Bar-back & server support", "Late-night espresso cart"],
    img: toast,
  },
  {
    num: "06",
    title: "Zero-Proof Pairings",
    desc: "Non-alcoholic drinks built with the same rigor — house ferments, shrubs, seedlip-style aperitifs and clarified juices, never an afterthought.",
    bullets: ["House shrubs & cordials", "Clarified juice program", "Identical glassware & garnish"],
    img: spritz,
  },
];

/* ----------------------------------------------------------------- COCKTAILS */
export type Cat = "signature" | "classic" | "seasonal" | "zero";
export type Cocktail = {
  id: string;
  name: string;
  cat: Cat;
  base: string;
  glass: string;
  garnish: string;
  strength: number;
  ingredients: string[];
  notes: string;
  img?: string;
};

export const CATS: { id: Cat; label: string; blurb: string }[] = [
  { id: "signature", label: "Signature", blurb: "Written for the house — recipes you will not find on any other bar" },
  { id: "classic", label: "Classic", blurb: "The canon, stirred with discipline and poured without fuss" },
  { id: "seasonal", label: "Seasonal", blurb: "Built around what the market gave us that week" },
  { id: "zero", label: "Zero-Proof", blurb: "Same glass, same garnish, same intention — no alcohol" },
];

export const COCKTAILS: Cocktail[] = [
  {
    id: "late-bloomer",
    name: "The Late Bloomer",
    cat: "signature",
    base: "Gin · Elderflower",
    glass: "Coupe",
    garnish: "Cucumber ribbon, thyme sprig",
    strength: 3,
    ingredients: ["Cucumber-infused gin", "St-Germain elderflower", "Charred lemon", "Dry prosecco float", "Thyme oil"],
    notes: "Benita's house welcome pour. Bright, floral, faintly savoury — the drink that gets a room talking.",
    img: spritz,
  },
  {
    id: "amber-vow",
    name: "Amber Vow",
    cat: "signature",
    base: "Rye · Honey",
    glass: "Rocks, single sphere",
    garnish: "Torched orange coin, cacao nib",
    strength: 4,
    ingredients: ["100-proof rye", "Wildflower honey syrup", "Amaro Nonino", "Orange & cacao bitters"],
    notes: "Our most-booked wedding cocktail. Stirred thirty seconds, rested one, served at cellar temperature.",
    img: smoke,
  },
  {
    id: "velvet-hour",
    name: "Velvet Hour",
    cat: "signature",
    base: "Mezcal · Blackberry",
    glass: "Nick & Nora",
    garnish: "Rosemary smoke, blackberry skewer",
    strength: 4,
    ingredients: ["Espadín mezcal", "Blackberry shrub", "Lime cordial", "Agave", "Smoked rosemary"],
    notes: "Poured under a cloche of rosemary smoke at the bar — theatrical, and worth the extra four seconds.",
  },
  {
    id: "cellar-no9",
    name: "Cellar No. 9",
    cat: "signature",
    base: "Cognac · Espresso",
    glass: "Coupe",
    garnish: "Salted cacao rim, single bean",
    strength: 5,
    ingredients: ["VSOP cognac", "Cold-brew espresso", "Crème de cacao", "Vanilla bean", "Sea salt"],
    notes: "Built for the last hour of the party, when the dancing slows and the conversation deepens.",
    img: coupe,
  },
  {
    id: "boulevardier",
    name: "Boulevardier",
    cat: "classic",
    base: "Bourbon · Campari",
    glass: "Rocks",
    garnish: "Expressed orange peel",
    strength: 5,
    ingredients: ["12-year bourbon", "Campari", "Sweet vermouth", "Orange bitters"],
    notes: "Equal parts, stirred over a hand-cut cube. The measure of a bartender who respects restraint.",
  },
  {
    id: "french-75",
    name: "French 75",
    cat: "classic",
    base: "Gin · Champagne",
    glass: "Flute",
    garnish: "Lemon twist",
    strength: 3,
    ingredients: ["London dry gin", "Fresh lemon", "Cane sugar", "Grower champagne"],
    notes: "The toast drink. Sharp, dry, effervescent — we build two hundred of these a season.",
  },
  {
    id: "espresso-martini",
    name: "Espresso Martini",
    cat: "classic",
    base: "Vodka · Espresso",
    glass: "Coupe",
    garnish: "Three-bean float",
    strength: 4,
    ingredients: ["Pot-still vodka", "Double espresso", "Coffee liqueur", "Demerara"],
    notes: "Shaken hard for a proper crema. Ordered at 11pm, every single event, without exception.",
  },
  {
    id: "negroni-bianco",
    name: "Negroni Bianco",
    cat: "classic",
    base: "Gin · Suze",
    glass: "Rocks",
    garnish: "Grapefruit peel, olive leaf",
    strength: 4,
    ingredients: ["Clarified milk-washed gin", "Suze", "Cocchi Americano", "Grapefruit bitters"],
    notes: "Pale, silken, bitter in the way that makes you reach for a second one before you mean to.",
  },
  {
    id: "fig-sage",
    name: "Fig Leaf & Sage",
    cat: "seasonal",
    base: "Rum · Fig",
    glass: "Coupe",
    garnish: "Crisp sage leaf, fig wedge",
    strength: 3,
    ingredients: ["Aged agricole rum", "Fig leaf syrup", "Fried sage", "Lime", "Coconut cream rinse"],
    notes: "September through November, when the figs are heavy and the sage has turned woodsy.",
  },
  {
    id: "blood-paloma",
    name: "Blood Orange Paloma",
    cat: "seasonal",
    base: "Tequila · Citrus",
    glass: "Highball",
    garnish: "Chilli-salt rim, dehydrated citrus",
    strength: 3,
    ingredients: ["Blanco tequila", "Blood orange", "Grapefruit soda", "Lime", "Ancho salt"],
    notes: "Winter citrus, tapped the morning of the event. Bright enough to cut through a rich menu.",
  },
  {
    id: "tomato-maria",
    name: "Tomato Water Maria",
    cat: "seasonal",
    base: "Mezcal · Tomato",
    glass: "Highball",
    garnish: "Celery leaf, peppercorn",
    strength: 3,
    ingredients: ["Clarified heirloom tomato water", "Espadín mezcal", "Sherry vinegar", "Celery bitters"],
    notes: "Crystal-clear and savoury — the brunch-service drink that stops people mid-conversation.",
  },
  {
    id: "garden-gimlet",
    name: "Garden Gimlet",
    cat: "seasonal",
    base: "Gin · Herb",
    glass: "Coupe",
    garnish: "Pea shoot, lime wheel",
    strength: 3,
    ingredients: ["Cucumber gin", "Sugar snap cordial", "Lime", "Basil", "Verjus"],
    notes: "Spring service. Green, cold, and made within an hour of the herbs leaving the garden.",
  },
  {
    id: "no-groni",
    name: "Smoked Cherry No-groni",
    cat: "zero",
    base: "Zero-proof",
    glass: "Rocks",
    garnish: "Smoked cherry, orange peel",
    strength: 0,
    ingredients: ["Non-alcoholic bitter aperitif", "Sour cherry shrub", "Seedlip grove", "Smoked ice"],
    notes: "Bitter, dark and serious. Guests who drink and guests who don't cannot tell which glass is which.",
  },
  {
    id: "yuzu-tonic",
    name: "Cucumber Yuzu Tonic",
    cat: "zero",
    base: "Zero-proof",
    glass: "Copa",
    garnish: "Cucumber ribbon, yuzu zest",
    strength: 0,
    ingredients: ["Yuzu cordial", "Cucumber press", "Fever-tree tonic", "Shiso", "Sea salt"],
    notes: "Long, saline, refreshing — the drink that keeps a summer garden party moving until dark.",
  },
  {
    id: "hibiscus-fizz",
    name: "Hibiscus Fizz",
    cat: "zero",
    base: "Zero-proof",
    glass: "Flute",
    garnish: "Dried hibiscus, lemon twist",
    strength: 0,
    ingredients: ["Hibiscus & rosehip syrup", "Lemon", "Aquafaba", "Sparkling verjus"],
    notes: "Our toast glass for the sober-curious bride, groom, or CEO. Blush pink, bone dry.",
  },
];

/* ----------------------------------------------------------------- PROCESS */
export const PROCESS = [
  {
    num: "01",
    title: "The Conversation",
    body: "A forty-minute call, no charge. We talk about the room, the guest list, the hour you want people to feel something — and the drinks you already love.",
    meta: "Week 1",
  },
  {
    num: "02",
    title: "The Tasting",
    body: "You sit at my bar. We taste five or six candidates, adjust sweetness, bitterness and strength, and lock the menu in writing.",
    meta: "Week 2 – 3",
  },
  {
    num: "03",
    title: "The Sourcing",
    body: "Spirits ordered, produce bought from market the morning of, syrups and shrubs bottled, ice programme confirmed, glassware counted twice.",
    meta: "Week of",
  },
  {
    num: "04",
    title: "The Arrival",
    body: "Ninety minutes before your first guest. Bar built, dressed, lit, chilled and styled — then wiped down and left immaculate.",
    meta: "Event day",
  },
  {
    num: "05",
    title: "The Pour",
    body: "Service, water rounds, quiet crowd management, and a spotless teardown at last call. You never see a bottle run dry.",
    meta: "Last call",
  },
];

/* ---------------------------------------------------------------- PACKAGES */
export type Pkg = {
  id: string;
  name: string;
  kicker: string;
  tagline: string;
  base: number;
  perGuest: number;
  hours: string;
  guests: string;
  includes: string[];
  featured?: boolean;
};

export const PACKAGES: Pkg[] = [
  {
    id: "pour",
    name: "The Pour",
    kicker: "Essential",
    tagline: "A superb bartender, a tight menu, your room.",
    base: 780,
    perGuest: 11,
    hours: "4 hours",
    guests: "Up to 60 guests",
    includes: [
      "Solo bartender, 4 hours of service",
      "Two signature cocktails + wine & beer",
      "Portable bar & full mise en place",
      "Premium ice, glassware for 60",
      "Setup and spotless teardown",
    ],
  },
  {
    id: "house",
    name: "The House",
    kicker: "Most requested",
    tagline: "The mobile bar, a bespoke menu, and the room transformed.",
    base: 1650,
    perGuest: 18,
    hours: "5 hours",
    guests: "Up to 150 guests",
    featured: true,
    includes: [
      "Hand-built mobile bar, styled & lit",
      "Four signature cocktails, tasting included",
      "Full spirit, wine, beer & mixer programme",
      "Bar-back support, 5 hours of service",
      "Letterpress menu cards for every guest",
      "Glassware, ice and garnish for 150",
    ],
  },
  {
    id: "estate",
    name: "The Estate",
    kicker: "Full luxury",
    tagline: "Everything, everywhere, from first toast to last call.",
    base: 3200,
    perGuest: 26,
    hours: "7 hours",
    guests: "Unlimited",
    includes: [
      "Two bartenders + bar-back, 7 hours",
      "Cocktail masterclass for up to 24 guests",
      "Rare-spirit & champagne programme",
      "Floral and candle bar styling",
      "Zero-proof pairing bar, fully staffed",
      "Late-night espresso cart",
      "Rehearsal or welcome-party credit",
    ],
  },
];

export const ADDONS = [
  { id: "masterclass", name: "Cocktail Masterclass", price: 650, desc: "45 minutes, up to 24 guests" },
  { id: "floral", name: "Floral Bar Styling", price: 420, desc: "Seasonal arrangements & candles" },
  { id: "zeroproof", name: "Zero-Proof Pairing Bar", price: 320, desc: "Four crafted non-alcoholic drinks" },
  { id: "espresso", name: "Late-Night Espresso Cart", price: 380, desc: "Espresso martinis & coffee service" },
  { id: "extra", name: "Additional Service Hour", price: 180, desc: "Extend the bar past last call" },
  { id: "glassware", name: "Crystal Glassware Upgrade", price: 9, perGuest: true, desc: "Hand-blown coupe & rocks service" },
];

export const BAR_STYLES = [
  { id: "walnut", name: "Classic Walnut", desc: "Dark oak, brass rail, amber light", swatch: ["#281914", "#A77B56"] },
  { id: "marble", name: "Brass & Marble", desc: "Honed stone top, polished fittings", swatch: ["#F5EFE5", "#C7A477"] },
  { id: "floral", name: "Blush Floral", desc: "Garden roses, taper candles, linen", swatch: ["#F5E8E9", "#D4A1AA"] },
  { id: "noir", name: "Minimal Noir", desc: "Matte black, single spotlight, ice", swatch: ["#1A1512", "#493027"] },
];

export const EVENT_TYPES = [
  "Wedding",
  "Birthday",
  "Corporate",
  "Private Party",
  "Anniversary",
  "Masterclass",
  "Welcome Dinner",
  "Launch Event",
];

/* ----------------------------------------------------------------- GALLERY */
export const GALLERY = [
  { img: mobileBar, cat: "Wedding", caption: "Garden ceremony bar · Napa Valley", span: "md:col-span-7 md:row-span-2", ratio: "aspect-[4/5]" },
  { img: smoke, cat: "Signature", caption: "Smoked Amber Vow · private dining", span: "md:col-span-5", ratio: "aspect-[4/3]" },
  { img: toast, cat: "Celebration", caption: "Last call toast · 220 guests", span: "md:col-span-5", ratio: "aspect-[4/3]" },
  { img: benita, cat: "Behind the bar", caption: "Benita · Sonoma estate, October", span: "md:col-span-6", ratio: "aspect-[16/11]" },
  { img: coupe, cat: "Cocktail", caption: "Cellar No. 9 · coupe service", span: "md:col-span-6", ratio: "aspect-[16/11]" },
  { img: ingredients, cat: "Mise en place", caption: "Market morning, 6am", span: "md:col-span-4", ratio: "aspect-[3/4]" },
  { img: spritz, cat: "Zero-proof", caption: "Hibiscus Fizz · bridal brunch", span: "md:col-span-4", ratio: "aspect-[3/4]" },
  { img: heroB, cat: "Evening", caption: "Velvet Hour · plum-light service", span: "md:col-span-4", ratio: "aspect-[3/4]" },
];

/* ------------------------------------------------------------ TESTIMONIALS */
export const TESTIMONIALS = [
  {
    quote:
      "Benita read our room the way a good sommelier reads a table. By nine o'clock every guest believed the bar had been built for them personally. The menu cards are now framed in our hallway.",
    name: "Amara & Julien Okafor",
    role: "Wedding, 220 guests",
    place: "Stonebridge Estate, Napa",
  },
  {
    quote:
      "We hired her for a board dinner and immediately rebooked for three more. Punctual, immaculate, discreet — and the zero-proof pairing meant our CFO finally stopped drinking soda water.",
    name: "Dana Whitfield",
    role: "Chief of Staff, Halden Group",
    place: "Corporate series, San Francisco",
  },
  {
    quote:
      "The masterclass was the whole party. Forty-year-olds shaking tins like they'd done it their lives. She taught, poured, cleaned and vanished — I never once had to think about the bar.",
    name: "Marcus Bell",
    role: "50th birthday, 60 guests",
    place: "Private residence, Tiburon",
  },
  {
    quote:
      "Every drink tasted like it had been considered. The Fig Leaf & Sage is still the thing people mention to me a year later. Worth every cent and then some.",
    name: "Priya Raman",
    role: "Anniversary dinner, 40 guests",
    place: "Carmel Highlands",
  },
  {
    quote:
      "She arrived before dawn with crates of ice and market citrus, styled the bar with candles, and left the kitchen cleaner than she found it. Absolute professional.",
    name: "Elena Sandoval",
    role: "Wedding planner, Sandoval & Co.",
    place: "Sonoma Coast",
  },
];

/* --------------------------------------------------------------------- FAQ */
export const FAQ = [
  {
    q: "How far in advance should we book?",
    a: "For weddings and peak-season dates (May – October), six to nine months is ideal, and we hold a limited number of Saturdays each season. Smaller private dinners can often be arranged with three weeks' notice — ask, and we will tell you honestly whether the date is realistic.",
  },
  {
    q: "Do you provide the alcohol, or do we?",
    a: "Either. The House and Estate packages include a full sourcing programme with a premium spirit list you approve in advance. If you would rather supply your own — a family cellar, a favourite negociant, a case from a vineyard — we simply charge for service, ice, glassware and garnish.",
  },
  {
    q: "What does the bar physically look like in our space?",
    a: "Four formats: the hand-built walnut mobile bar (2.1m × 1.1m), the 1968 converted trailer, a marble-topped island for interiors, or a minimal matte-black station for galleries and lofts. Each needs roughly 3m × 3m plus a power point and level ground.",
  },
  {
    q: "Can you handle guests who don't drink?",
    a: "Always, and with equal seriousness. Every menu includes at least two zero-proof builds using house shrubs, clarified juices and non-alcoholic aperitifs — served in identical glassware with identical garnish so nobody at the table feels short-changed.",
  },
  {
    q: "What is your cancellation and deposit policy?",
    a: "A 30% deposit secures the date; the balance is due fourteen days before service. Cancellations more than sixty days out are refunded in full less a small planning fee. Inside sixty days the deposit transfers to another date within twelve months.",
  },
  {
    q: "Are you insured and venue-approved?",
    a: "Fully — $2M general liability and liquor liability, with certificates of insurance issued to you and your venue on request. We are on the preferred vendor list at fourteen venues across Napa, Sonoma and the Bay Area, and we carry RBS and food-handler certification.",
  },
  {
    q: "How do you price an event?",
    a: "A flat package base plus a per-guest rate for stock, ice, glassware and labour, with optional add-ons. The estimate tool on this page gives you a realistic figure in seconds; your written quote after the consultation call matches it to within five percent.",
  },
];

/* ------------------------------------------------------------------- PRESS */
export const PRESS = [
  { name: "Éclat Magazine", line: "“The most considered private bar on the West Coast.”" },
  { name: "Coast & Cellar", line: "“Ten bartenders to book before your wedding.”" },
  { name: "Spirited Awards", line: "Finalist — Best Independent Mobile Bar" },
  { name: "The Vine Journal", line: "“A drink list that reads like a love letter.”" },
];
