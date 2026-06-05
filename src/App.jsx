import { useState, useEffect, useCallback } from "react";

const GOOGLE_FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const STYLE = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; }
  .app { min-height: 100vh; background: #FDF6EE; color: #1a1a1a; }

  /* HEADER */
  .header { background: #fff; border-bottom: 1px solid #E8DDD0; padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; height: 64px; position: sticky; top: 0; z-index: 100; }
  .logo { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; color: #C25B20; letter-spacing: -0.02em; }
  .logo span { color: #1a1a1a; }
  .nav-btn { background: none; border: 1.5px solid #C25B20; color: #C25B20; padding: 6px 16px; border-radius: 20px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  .nav-btn:hover { background: #C25B20; color: #fff; }
  .nav-btn.active { background: #C25B20; color: #fff; }

  /* HERO */
  .hero { background: linear-gradient(135deg, #C25B20 0%, #E8824A 50%, #F5A872 100%); color: #fff; padding: 4rem 2rem 3rem; text-align: center; position: relative; overflow: hidden; }
  .hero::before { content: ''; position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
  .hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(1.8rem, 5vw, 3rem); font-weight: 700; margin-bottom: 0.5rem; position: relative; }
  .hero p { font-size: 1.05rem; opacity: 0.9; position: relative; }

  /* STEPPER */
  .stepper { display: flex; justify-content: center; gap: 0; padding: 1.5rem 1rem; background: #fff; border-bottom: 1px solid #E8DDD0; overflow-x: auto; }
  .step { display: flex; align-items: center; gap: 8px; padding: 6px 12px; font-size: 13px; font-weight: 500; color: #999; white-space: nowrap; }
  .step.active { color: #C25B20; }
  .step.done { color: #2D8B5A; }
  .step-num { width: 24px; height: 24px; border-radius: 50%; border: 2px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; flex-shrink: 0; }
  .step.done .step-num { background: #2D8B5A; border-color: #2D8B5A; color: #fff; }
  .step.active .step-num { background: #C25B20; border-color: #C25B20; color: #fff; }
  .step-arrow { color: #D0C4B8; font-size: 16px; }

  /* MAIN CONTENT */
  .main { max-width: 780px; margin: 0 auto; padding: 2rem 1rem 4rem; }

  /* DATE PICKER */
  .section-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 600; color: #1a1a1a; margin-bottom: 1.5rem; }
  .date-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-top: 1rem; }
  .date-header { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 4px; }
  .day-label { text-align: center; font-size: 11px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 0; }
  .date-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-size: 14px; font-weight: 400; cursor: pointer; border: 1px solid transparent; transition: all 0.15s; background: #fff; color: #1a1a1a; }
  .date-cell:hover:not(.disabled):not(.past) { border-color: #C25B20; color: #C25B20; }
  .date-cell.selected { background: #C25B20; color: #fff; border-color: #C25B20; font-weight: 600; }
  .date-cell.today { font-weight: 600; border-color: #E8824A; color: #C25B20; }
  .date-cell.past { opacity: 0.35; cursor: not-allowed; }
  .date-cell.disabled { opacity: 0; cursor: default; }
  .cal-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
  .cal-month { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 600; }
  .cal-btn { background: none; border: 1px solid #E8DDD0; border-radius: 8px; width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; transition: all 0.15s; color: #666; }
  .cal-btn:hover { border-color: #C25B20; color: #C25B20; }

  /* PRODUCT CARDS */
  .products { display: grid; gap: 16px; }
  .product-card { background: #fff; border: 2px solid #E8DDD0; border-radius: 16px; padding: 1.25rem; cursor: pointer; transition: all 0.2s; position: relative; }
  .product-card:hover { border-color: #C25B20; box-shadow: 0 4px 20px rgba(194,91,32,0.1); }
  .product-card.selected { border-color: #C25B20; background: #FFF8F3; }
  .product-card .badge { position: absolute; top: -10px; left: 20px; background: #C25B20; color: #fff; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
  .product-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
  .product-name { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 600; color: #1a1a1a; margin-bottom: 0.25rem; }
  .product-desc { font-size: 13px; color: #777; line-height: 1.5; margin-bottom: 0.75rem; }
  .product-footer { display: flex; align-items: center; justify-content: space-between; }
  .product-price { font-size: 1.2rem; font-weight: 600; color: #C25B20; }
  .product-avail { font-size: 12px; color: #2D8B5A; font-weight: 500; }
  .product-avail.low { color: #D44; }
  .qty-control { display: flex; align-items: center; gap: 8px; }
  .qty-btn { width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid #C25B20; background: none; color: #C25B20; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; font-weight: 300; }
  .qty-btn:hover { background: #C25B20; color: #fff; }
  .qty-num { font-weight: 600; font-size: 15px; min-width: 20px; text-align: center; }

  /* SUMMARY BAR */
  .summary-bar { background: #1a1a1a; color: #fff; padding: 1rem 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
  .summary-label { font-size: 13px; opacity: 0.7; }
  .summary-total { font-size: 1.3rem; font-weight: 600; color: #F5A872; }

  /* FORM */
  .form-grid { display: grid; gap: 16px; }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-size: 13px; font-weight: 500; color: #555; }
  .form-input { padding: 12px 14px; border: 1.5px solid #E8DDD0; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #1a1a1a; background: #fff; transition: border-color 0.15s; outline: none; }
  .form-input:focus { border-color: #C25B20; }
  .form-input.error { border-color: #E24B4A; }
  .form-error { font-size: 12px; color: #E24B4A; }

  /* PAYMENT */
  .pay-methods { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin: 1rem 0; }
  .pay-method { background: #fff; border: 2px solid #E8DDD0; border-radius: 12px; padding: 1rem; text-align: center; cursor: pointer; transition: all 0.2s; }
  .pay-method:hover { border-color: #C25B20; }
  .pay-method.selected { border-color: #C25B20; background: #FFF8F3; }
  .pay-method-icon { font-size: 1.8rem; margin-bottom: 6px; }
  .pay-method-name { font-size: 13px; font-weight: 500; color: #555; }
  .pay-method.selected .pay-method-name { color: #C25B20; }

  /* ORDER SUMMARY */
  .order-box { background: #fff; border: 1px solid #E8DDD0; border-radius: 16px; padding: 1.25rem; margin-bottom: 1.5rem; }
  .order-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #F0E8E0; font-size: 14px; }
  .order-row:last-child { border-bottom: none; font-weight: 600; font-size: 15px; color: #C25B20; padding-top: 12px; }
  .order-row-label { color: #555; }

  /* BUTTONS */
  .btn-primary { background: #C25B20; color: #fff; border: none; padding: 14px 32px; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; width: 100%; letter-spacing: 0.01em; }
  .btn-primary:hover { background: #A84C18; }
  .btn-primary:disabled { background: #D0C4B8; cursor: not-allowed; }
  .btn-secondary { background: transparent; color: #C25B20; border: 1.5px solid #C25B20; padding: 12px 24px; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  .btn-secondary:hover { background: #FFF8F3; }

  /* CONFIRMATION */
  .confirm-card { background: #fff; border-radius: 20px; padding: 2.5rem; text-align: center; border: 1px solid #E8DDD0; }
  .confirm-icon { font-size: 4rem; margin-bottom: 1rem; }
  .confirm-title { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 700; color: #1a1a1a; margin-bottom: 0.5rem; }
  .confirm-sub { color: #777; font-size: 15px; margin-bottom: 1.5rem; line-height: 1.5; }
  .confirm-details { background: #FFF8F3; border-radius: 12px; padding: 1.25rem; text-align: left; margin-bottom: 1.5rem; }
  .confirm-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
  .confirm-row span:first-child { color: #777; }
  .confirm-row span:last-child { font-weight: 500; }

  /* CARD CONTAINER */
  .card { background: #fff; border-radius: 16px; padding: 1.5rem; border: 1px solid #E8DDD0; margin-bottom: 1.5rem; }
  
  /* ADMIN */
  .admin-layout { display: grid; grid-template-columns: 220px 1fr; min-height: calc(100vh - 64px); }
  .admin-sidebar { background: #1a1a1a; padding: 1.5rem 0; }
  .admin-sidebar-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #666; padding: 0 1.25rem; margin-bottom: 0.5rem; }
  .admin-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 1.25rem; color: #999; font-size: 14px; font-weight: 400; cursor: pointer; transition: all 0.15s; border-left: 3px solid transparent; }
  .admin-nav-item:hover { color: #fff; background: rgba(255,255,255,0.05); }
  .admin-nav-item.active { color: #F5A872; border-left-color: #F5A872; background: rgba(245,168,114,0.08); }
  .admin-content { padding: 2rem; background: #F7F0E8; overflow-y: auto; }
  .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
  .admin-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 600; }
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 1.5rem; }
  .stat-card { background: #fff; border-radius: 12px; padding: 1rem 1.25rem; border: 1px solid #E8DDD0; }
  .stat-label { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
  .stat-value { font-size: 1.6rem; font-weight: 600; color: #C25B20; font-family: 'Playfair Display', serif; }
  .stat-sub { font-size: 12px; color: #aaa; margin-top: 2px; }
  .admin-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #E8DDD0; }
  .admin-table th { background: #FFF8F3; padding: 10px 14px; text-align: left; font-size: 12px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #E8DDD0; }
  .admin-table td { padding: 12px 14px; font-size: 14px; border-bottom: 1px solid #F0E8E0; vertical-align: middle; }
  .admin-table tr:last-child td { border-bottom: none; }
  .admin-table tr:hover td { background: #FFF8F3; }
  .status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
  .status-badge.confirmed { background: #E1F5EE; color: #0F6E56; }
  .status-badge.pending { background: #FAEEDA; color: #854F0B; }
  .status-badge.cancelled { background: #FCEBEB; color: #A32D2D; }
  .icon-btn { background: none; border: 1px solid #E8DDD0; border-radius: 8px; width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #888; transition: all 0.15s; font-size: 15px; }
  .icon-btn:hover { border-color: #C25B20; color: #C25B20; }
  .icon-btn.danger:hover { border-color: #E24B4A; color: #E24B4A; }

  /* PRICE EDITOR */
  .price-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
  .price-card { background: #fff; border-radius: 12px; padding: 1.25rem; border: 1px solid #E8DDD0; }
  .price-card-icon { font-size: 2rem; margin-bottom: 8px; }
  .price-card-name { font-weight: 600; font-size: 15px; margin-bottom: 12px; }
  .price-input-row { display: flex; align-items: center; gap: 8px; }
  .price-prefix { font-size: 15px; color: #555; font-weight: 500; }
  .price-input { flex: 1; padding: 8px 10px; border: 1.5px solid #E8DDD0; border-radius: 8px; font-size: 15px; font-weight: 600; color: #C25B20; font-family: 'DM Sans', sans-serif; outline: none; }
  .price-input:focus { border-color: #C25B20; }

  /* AVAIL EDITOR */
  .avail-grid { display: grid; gap: 12px; }
  .avail-row { background: #fff; border-radius: 12px; padding: 1rem 1.25rem; border: 1px solid #E8DDD0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .avail-name { font-weight: 500; font-size: 15px; display: flex; align-items: center; gap: 10px; }
  .avail-controls { display: flex; align-items: center; gap: 12px; }
  .avail-num { font-size: 1.2rem; font-weight: 600; color: #C25B20; min-width: 40px; text-align: center; }

  /* MOLLIE / PAYMENT SIMULATION */
  .mollie-box { background: #fff; border: 2px dashed #E8DDD0; border-radius: 16px; padding: 2rem; text-align: center; }
  .mollie-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; }
  .mollie-sub { font-size: 13px; color: #888; margin-bottom: 1.5rem; line-height: 1.5; }
  .processing-bar { height: 4px; background: #F0E8E0; border-radius: 2px; overflow: hidden; margin: 1rem 0; }
  .processing-fill { height: 100%; background: #C25B20; border-radius: 2px; animation: progress 2.5s ease-in-out forwards; }
  @keyframes progress { from { width: 0%; } to { width: 100%; } }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
  .modal { background: #fff; border-radius: 20px; padding: 1.5rem; max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto; }
  .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 600; }
  .close-btn { background: none; border: none; font-size: 20px; cursor: pointer; color: #888; line-height: 1; }

  /* MISC */
  .divider { height: 1px; background: #E8DDD0; margin: 1.5rem 0; }
  .text-muted { color: #888; font-size: 13px; }
  .alert { padding: 12px 16px; border-radius: 10px; font-size: 14px; margin-bottom: 1rem; }
  .alert.error { background: #FCEBEB; color: #A32D2D; border: 1px solid #F7C1C1; }
  .alert.success { background: #E1F5EE; color: #0F6E56; border: 1px solid #9FE1CB; }
  .alert.info { background: #E6F1FB; color: #185FA5; border: 1px solid #B5D4F4; }
  .flex-between { display: flex; justify-content: space-between; align-items: center; }
  .gap-8 { gap: 8px; }
  .mt-1 { margin-top: 8px; }
  .mb-1 { margin-bottom: 8px; }
  .mt-2 { margin-top: 16px; }
  .tag { display: inline-block; background: #FFF8F3; border: 1px solid #E8DDD0; border-radius: 6px; padding: 2px 8px; font-size: 12px; color: #888; margin-right: 4px; }

  @media (max-width: 640px) {
    .admin-layout { grid-template-columns: 1fr; }
    .admin-sidebar { display: none; }
    .header { padding: 0 1rem; }
    .hero { padding: 2.5rem 1rem 2rem; }
    .main { padding: 1.25rem 0.75rem 3rem; }
  }
`;

const PRODUCTS_INIT = [
  { id: "ligbed", name: "Ligbed", icon: "🏖️", desc: "Comfortabel ligbed met parasol. Inclusief handdoek en drankje bij aankomst.", priceKey: "ligbed", perUnit: "per stuk", popular: false },
  { id: "cabine", name: "Strandcabine", icon: "🏠", desc: "Privé strandcabine met kleedruimte, uitzicht op zee en 2 stoelen.", priceKey: "cabine", perUnit: "per cabine", popular: true },
  { id: "combo", name: "Cabine + Ligbedden", icon: "⭐", desc: "Strandcabine inclusief 2 ligbedden. Perfecte combi voor een volledige stranddag.", priceKey: "combo", perUnit: "per combi", popular: false },
];

const PRICES_INIT = { ligbed: 12.50, cabine: 35.00, combo: 55.00 };
const AVAIL_INIT = { ligbed: 40, cabine: 12, combo: 8 };

const DUMMY_BOOKINGS = [
  { id: "RES-001", name: "Pieter Jansen", email: "p.jansen@email.nl", phone: "0612345678", date: "2026-07-15", product: "Strandcabine", qty: 1, total: 35.00, status: "confirmed", method: "iDEAL", created: "2026-06-03" },
  { id: "RES-002", name: "Lisa de Vries", email: "lisa@mail.nl", phone: "0698765432", date: "2026-07-15", product: "Ligbed × 4", qty: 4, total: 50.00, status: "confirmed", method: "Creditcard", created: "2026-06-03" },
  { id: "RES-003", name: "Ahmed El Amrani", email: "ahmed@mail.nl", phone: "0611223344", date: "2026-07-16", product: "Cabine + Ligbedden", qty: 1, total: 55.00, status: "pending", method: "Bancontact", created: "2026-06-04" },
  { id: "RES-004", name: "Sophie Bakker", email: "sbakker@mail.nl", phone: "0655443322", date: "2026-07-18", product: "Ligbed × 2", qty: 2, total: 25.00, status: "confirmed", method: "Apple Pay", created: "2026-06-04" },
  { id: "RES-005", name: "Marc Vermeer", email: "marc.v@mail.nl", phone: "0677889900", date: "2026-07-20", product: "Strandcabine", qty: 1, total: 35.00, status: "cancelled", method: "iDEAL", created: "2026-06-01" },
];

const NL_MONTHS = ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"];
const NL_DAYS = ["Ma","Di","Wo","Do","Vr","Za","Zo"];

function formatDate(d) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${parseInt(day)} ${NL_MONTHS[parseInt(m)-1]} ${y}`;
}

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { offset, daysInMonth };
}

function genBookingId() {
  return "RES-" + Math.random().toString(36).substr(2,6).toUpperCase();
}

export default function App() {
  const [view, setView] = useState("booking"); // booking | admin
  const [step, setStep] = useState(1);
  const [prices, setPrices] = useState(PRICES_INIT);
  const [avail, setAvail] = useState(AVAIL_INIT);
  const [bookings, setBookings] = useState(DUMMY_BOOKINGS);

  // booking state
  const [selDate, setSelDate] = useState("");
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [quantities, setQuantities] = useState({ ligbed: 0, cabine: 0, combo: 0 });
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [custErrors, setCustErrors] = useState({});
  const [payMethod, setPayMethod] = useState("ideal");
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [adminTab, setAdminTab] = useState("reserveringen");
  const [adminModal, setAdminModal] = useState(null);
  const [manualBooking, setManualBooking] = useState({ name:"",email:"",phone:"",date:"",product:"ligbed",qty:1 });

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const totalAmount = PRODUCTS_INIT.reduce((sum, p) => sum + (quantities[p.id] || 0) * prices[p.priceKey], 0);
  const hasProducts = PRODUCTS_INIT.some(p => quantities[p.id] > 0);

  const setQty = (id, val) => {
    const max = avail[id] || 0;
    setQuantities(q => ({ ...q, [id]: Math.max(0, Math.min(val, max)) }));
  };

  const validateCustomer = () => {
    const errs = {};
    if (!customer.name.trim()) errs.name = "Naam is verplicht";
    if (!customer.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Voer een geldig e-mailadres in";
    if (!customer.phone.match(/^[\d\s+\-()]{8,}$/)) errs.phone = "Voer een geldig telefoonnummer in";
    setCustErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePay = async () => {
    if (!validateCustomer()) return;
    setProcessing(true);
    try {
      const producten = PRODUCTS_INIT
        .filter(p => quantities[p.id] > 0)
        .map(p => ({
          id: p.id,
          naam: p.name,
          aantal: quantities[p.id],
          prijs: prices[p.priceKey]
        }));

      const response = await fetch('https://strandboeking-api.vercel.app/api/betaling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datum: selDate,
          producten,
          klant: {
            naam: customer.name,
            email: customer.email,
            telefoon: customer.phone
          },
          methode: payMethod
        })
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        // Stuur door naar Mollie betaalpagina
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Onbekende fout');
      }
    } catch (err) {
      console.error('Betaalfout:', err);
      alert('Er ging iets mis bij het starten van de betaling. Probeer het opnieuw.');
      setProcessing(false);
    }
  };

  const cancelBooking = (id) => {
    setBookings(bs => bs.map(b => b.id === id ? { ...b, status: "cancelled" } : b));
  };

  const addManualBooking = () => {
    const prod = PRODUCTS_INIT.find(p => p.id === manualBooking.product);
    const nb = {
      id: genBookingId(), name: manualBooking.name, email: manualBooking.email, phone: manualBooking.phone,
      date: manualBooking.date, product: `${prod?.name} × ${manualBooking.qty}`, qty: manualBooking.qty,
      total: prices[prod?.priceKey] * manualBooking.qty, status: "confirmed", method: "Handmatig",
      created: todayStr
    };
    setBookings(b => [nb, ...b]);
    setAdminModal(null);
    setManualBooking({ name:"",email:"",phone:"",date:"",product:"ligbed",qty:1 });
  };

  // CALENDAR
  const renderCalendar = () => {
    const { offset, daysInMonth } = getMonthDays(calYear, calMonth);
    const cells = [];
    for (let i = 0; i < offset; i++) cells.push(<div key={`e${i}`} className="date-cell disabled" />);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const isPast = dateStr < todayStr;
      const isToday = dateStr === todayStr;
      const isSel = dateStr === selDate;
      cells.push(
        <div key={d} className={`date-cell${isPast?" past":""}${isToday?" today":""}${isSel?" selected":""}`}
          onClick={() => !isPast && setSelDate(dateStr)}>{d}</div>
      );
    }
    return cells;
  };

  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y=>y-1); } else setCalMonth(m=>m-1); };
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y=>y+1); } else setCalMonth(m=>m+1); };

  // Steps
  const STEPS = ["Datum","Producten","Gegevens","Betaling","Bevestiging"];

  const renderStepper = () => (
    <div className="stepper">
      {STEPS.map((s, i) => (
        <div key={i} style={{display:"flex",alignItems:"center"}}>
          <div className={`step${step===i+1?" active":step>i+1?" done":""}`}>
            <div className="step-num">{step>i+1?"✓":i+1}</div>
            {s}
          </div>
          {i < STEPS.length-1 && <span className="step-arrow">›</span>}
        </div>
      ))}
    </div>
  );

  const renderBooking = () => (
    <div className="app">
      <style>{STYLE}</style>
      <header className="header">
        <div className="logo">Strand<span>Reserveren</span></div>
        <div style={{display:"flex",gap:8}}>
          <button className={`nav-btn${view==="booking"?" active":""}`} onClick={()=>setView("booking")}>Boeken</button>
          <button className={`nav-btn${view==="admin"?" active":""}`} onClick={()=>setView("admin")}>Beheer</button>
        </div>
      </header>

      {step < 5 && (
        <div className="hero">
          <h1>🌊 Reserveer jouw strandplek</h1>
          <p>Kies je datum, producten en betaal direct online</p>
        </div>
      )}

      {renderStepper()}

      <div className="main">
        {/* STEP 1: DATE */}
        {step===1 && (
          <div>
            <div className="card">
              <p className="section-title">Kies je datum</p>
              <div className="cal-nav">
                <button className="cal-btn" onClick={prevMonth}>‹</button>
                <span className="cal-month">{NL_MONTHS[calMonth].charAt(0).toUpperCase()+NL_MONTHS[calMonth].slice(1)} {calYear}</span>
                <button className="cal-btn" onClick={nextMonth}>›</button>
              </div>
              <div className="date-header">{NL_DAYS.map(d=><div key={d} className="day-label">{d}</div>)}</div>
              <div className="date-grid">{renderCalendar()}</div>
            </div>
            {selDate && (
              <div className="alert success">✅ Geselecteerd: <strong>{formatDate(selDate)}</strong></div>
            )}
            <button className="btn-primary" disabled={!selDate} onClick={()=>setStep(2)}>
              Verder naar producten →
            </button>
          </div>
        )}

        {/* STEP 2: PRODUCTS */}
        {step===2 && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem",flexWrap:"wrap",gap:8}}>
              <p className="section-title" style={{marginBottom:0}}>Kies je producten</p>
              <span className="tag">📅 {formatDate(selDate)}</span>
            </div>
            <div className="products">
              {PRODUCTS_INIT.map(p => {
                const qty = quantities[p.id];
                const av = avail[p.id];
                const price = prices[p.priceKey];
                return (
                  <div key={p.id} className={`product-card${qty>0?" selected":""}`}>
                    {p.popular && <div className="badge">Populair</div>}
                    <div style={{display:"flex",gap:"1rem",alignItems:"flex-start"}}>
                      <div>
                        <div className="product-icon">{p.icon}</div>
                      </div>
                      <div style={{flex:1}}>
                        <div className="product-name">{p.name}</div>
                        <div className="product-desc">{p.desc}</div>
                        <div className="product-footer">
                          <div>
                            <div className="product-price">€{price.toFixed(2)} <span style={{fontWeight:300,fontSize:"0.85rem",color:"#999"}}>{p.perUnit}</span></div>
                            <div className={`product-avail${av<=3?" low":""}`}>{av} beschikbaar</div>
                          </div>
                          <div className="qty-control">
                            <button className="qty-btn" onClick={()=>setQty(p.id,qty-1)} disabled={qty===0}>−</button>
                            <span className="qty-num">{qty}</span>
                            <button className="qty-btn" onClick={()=>setQty(p.id,qty+1)} disabled={qty>=av}>+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {hasProducts && (
              <div className="summary-bar" style={{marginTop:"1.5rem"}}>
                <div>
                  <div className="summary-label">Totaal</div>
                  <div className="summary-total">€{totalAmount.toFixed(2)}</div>
                </div>
                <div style={{fontSize:"13px",color:"#aaa"}}>
                  {PRODUCTS_INIT.filter(p=>quantities[p.id]>0).map(p=>`${p.name} ×${quantities[p.id]}`).join(", ")}
                </div>
              </div>
            )}
            <div style={{display:"flex",gap:10,marginTop:"1rem"}}>
              <button className="btn-secondary" onClick={()=>setStep(1)}>← Terug</button>
              <button className="btn-primary" style={{flex:1}} disabled={!hasProducts} onClick={()=>setStep(3)}>Verder naar gegevens →</button>
            </div>
          </div>
        )}

        {/* STEP 3: CUSTOMER DATA */}
        {step===3 && (
          <div>
            <div className="card">
              <p className="section-title">Jouw gegevens</p>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Volledige naam *</label>
                  <input className={`form-input${custErrors.name?" error":""}`} placeholder="Jan de Boer" value={customer.name} onChange={e=>setCustomer(c=>({...c,name:e.target.value}))} />
                  {custErrors.name && <span className="form-error">{custErrors.name}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">E-mailadres *</label>
                  <input className={`form-input${custErrors.email?" error":""}`} type="email" placeholder="jan@voorbeeld.nl" value={customer.email} onChange={e=>setCustomer(c=>({...c,email:e.target.value}))} />
                  {custErrors.email && <span className="form-error">{custErrors.email}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Telefoonnummer *</label>
                  <input className={`form-input${custErrors.phone?" error":""}`} type="tel" placeholder="06 12345678" value={customer.phone} onChange={e=>setCustomer(c=>({...c,phone:e.target.value}))} />
                  {custErrors.phone && <span className="form-error">{custErrors.phone}</span>}
                </div>
              </div>
            </div>

            <div className="card">
              <p style={{fontWeight:600,marginBottom:"0.75rem",fontSize:"15px"}}>Samenvatting</p>
              <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                <span className="tag">📅 {formatDate(selDate)}</span>
                {PRODUCTS_INIT.filter(p=>quantities[p.id]>0).map(p=>(
                  <span key={p.id} className="tag">{p.icon} {p.name} ×{quantities[p.id]}</span>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid #E8DDD0",paddingTop:8,marginTop:8}}>
                <span style={{color:"#777",fontSize:14}}>Totaalbedrag</span>
                <span style={{fontWeight:700,fontSize:"1.1rem",color:"#C25B20"}}>€{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div style={{display:"flex",gap:10}}>
              <button className="btn-secondary" onClick={()=>setStep(2)}>← Terug</button>
              <button className="btn-primary" style={{flex:1}} onClick={()=>{ if(validateCustomer()) setStep(4); }}>Verder naar betaling →</button>
            </div>
          </div>
        )}

        {/* STEP 4: PAYMENT */}
        {step===4 && (
          <div>
            <div className="card">
              <p className="section-title">Betaalmethode</p>
              <div className="pay-methods">
                {[
                  {id:"ideal",icon:"🏦",name:"iDEAL"},
                  {id:"bancontact",icon:"💳",name:"Bancontact"},
                  {id:"creditcard",icon:"🪙",name:"Creditcard"},
                  {id:"applepay",icon:"🍎",name:"Apple Pay"},
                ].map(m=>(
                  <div key={m.id} className={`pay-method${payMethod===m.id?" selected":""}`} onClick={()=>setPayMethod(m.id)}>
                    <div className="pay-method-icon">{m.icon}</div>
                    <div className="pay-method-name">{m.name}</div>
                  </div>
                ))}
              </div>

              <div className="divider" />

              <p style={{fontWeight:600,marginBottom:"0.75rem",fontSize:"15px"}}>Overzicht bestelling</p>
              <div className="order-box">
                {PRODUCTS_INIT.filter(p=>quantities[p.id]>0).map(p=>(
                  <div key={p.id} className="order-row">
                    <span className="order-row-label">{p.icon} {p.name} × {quantities[p.id]}</span>
                    <span>€{(quantities[p.id]*prices[p.priceKey]).toFixed(2)}</span>
                  </div>
                ))}
                <div className="order-row">
                  <span className="order-row-label">Datum</span>
                  <span style={{fontWeight:400,fontSize:14,color:"#555"}}>{formatDate(selDate)}</span>
                </div>
                <div className="order-row">
                  <span>Totaal te betalen</span>
                  <span>€{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {processing ? (
                <div className="mollie-box">
                  <div className="mollie-title">Verbinding met Mollie...</div>
                  <div className="mollie-sub">Je wordt doorgestuurd naar de betaalpagina.<br/>Even geduld, je betaling wordt verwerkt.</div>
                  <div className="processing-bar"><div className="processing-fill" /></div>
                  <p style={{fontSize:12,color:"#aaa",marginTop:"0.5rem"}}>Beveiligde verbinding via Mollie Payments</p>
                </div>
              ) : (
                <>
                  <div className="alert info" style={{marginBottom:"1rem"}}>
                    🔒 Betaling verloopt veilig via <strong>Mollie</strong>. Je reservering wordt pas definitief na succesvolle betaling.
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <button className="btn-secondary" onClick={()=>setStep(3)}>← Terug</button>
                    <button className="btn-primary" style={{flex:1}} onClick={handlePay}>
                      Nu betalen — €{totalAmount.toFixed(2)}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: CONFIRMATION */}
        {step===5 && confirmed && (
          <div className="confirm-card">
            <div className="confirm-icon">🎉</div>
            <div className="confirm-title">Reservering bevestigd!</div>
            <div className="confirm-sub">Bedankt, <strong>{confirmed.name}</strong>! Je reservering is gelukt.<br/>Een bevestigingsmail is verstuurd naar <strong>{confirmed.email}</strong>.</div>
            <div className="confirm-details">
              <div className="confirm-row"><span>Reserveringsnummer</span><span style={{color:"#C25B20",fontWeight:700}}>{confirmed.id}</span></div>
              <div className="confirm-row"><span>Datum</span><span>{formatDate(confirmed.date)}</span></div>
              <div className="confirm-row"><span>Producten</span><span>{confirmed.items}</span></div>
              <div className="confirm-row"><span>Betaalmethode</span><span>{confirmed.method}</span></div>
              <div className="confirm-row"><span>Totaalbedrag</span><span>€{confirmed.total.toFixed(2)}</span></div>
            </div>
            <div className="alert success" style={{marginBottom:"1rem",textAlign:"left"}}>
              📧 Bevestigingsmail verzonden via Mailgun/SMTP naar {confirmed.email}
            </div>
            <button className="btn-primary" onClick={()=>{setStep(1);setSelDate("");setQuantities({ligbed:0,cabine:0,combo:0});setCustomer({name:"",email:"",phone:""});setConfirmed(null);}}>
              Nieuwe reservering maken
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderAdmin = () => (
    <div className="app">
      <style>{STYLE}</style>
      <header className="header">
        <div className="logo">Strand<span>Admin</span></div>
        <div style={{display:"flex",gap:8}}>
          <button className="nav-btn" onClick={()=>setView("booking")}>← Naar website</button>
        </div>
      </header>
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-title">Beheer</div>
          {[
            {id:"reserveringen",icon:"📋",label:"Reserveringen"},
            {id:"beschikbaarheid",icon:"📊",label:"Beschikbaarheid"},
            {id:"prijzen",icon:"💶",label:"Prijzen"},
          ].map(item=>(
            <div key={item.id} className={`admin-nav-item${adminTab===item.id?" active":""}`} onClick={()=>setAdminTab(item.id)}>
              <span>{item.icon}</span>{item.label}
            </div>
          ))}
        </aside>

        <main className="admin-content">
          {adminTab==="reserveringen" && (
            <div>
              <div className="admin-header">
                <h1 className="admin-title">Reserveringen</h1>
                <button className="btn-primary" style={{width:"auto",padding:"10px 20px",fontSize:13}} onClick={()=>setAdminModal("add")}>
                  + Handmatig toevoegen
                </button>
              </div>

              <div className="stats-grid">
                <div className="stat-card"><div className="stat-label">Totaal</div><div className="stat-value">{bookings.length}</div><div className="stat-sub">reserveringen</div></div>
                <div className="stat-card"><div className="stat-label">Bevestigd</div><div className="stat-value" style={{color:"#0F6E56"}}>{bookings.filter(b=>b.status==="confirmed").length}</div><div className="stat-sub">actief</div></div>
                <div className="stat-card"><div className="stat-label">Omzet</div><div className="stat-value">€{bookings.filter(b=>b.status==="confirmed").reduce((s,b)=>s+b.total,0).toFixed(0)}</div><div className="stat-sub">bevestigd</div></div>
                <div className="stat-card"><div className="stat-label">Openstaand</div><div className="stat-value" style={{color:"#854F0B"}}>{bookings.filter(b=>b.status==="pending").length}</div><div className="stat-sub">in behandeling</div></div>
              </div>

              <div style={{overflowX:"auto"}}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th><th>Naam</th><th>Datum</th><th>Product</th><th>Betaalmethode</th><th>Totaal</th><th>Status</th><th>Acties</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b=>(
                      <tr key={b.id}>
                        <td style={{fontWeight:600,fontSize:13,color:"#C25B20"}}>{b.id}</td>
                        <td>
                          <div style={{fontWeight:500,fontSize:14}}>{b.name}</div>
                          <div style={{fontSize:12,color:"#999"}}>{b.email}</div>
                        </td>
                        <td style={{fontSize:13}}>{formatDate(b.date)}</td>
                        <td style={{fontSize:13}}>{b.product}</td>
                        <td style={{fontSize:13}}>{b.method}</td>
                        <td style={{fontWeight:600,color:"#1a1a1a"}}>€{b.total.toFixed(2)}</td>
                        <td><span className={`status-badge ${b.status}`}>{b.status==="confirmed"?"Bevestigd":b.status==="pending"?"Wachtend":"Geannuleerd"}</span></td>
                        <td>
                          <div style={{display:"flex",gap:6}}>
                            <button className="icon-btn" title="Details" onClick={()=>setAdminModal({type:"detail",booking:b})}>👁</button>
                            {b.status!=="cancelled" && <button className="icon-btn danger" title="Annuleren" onClick={()=>cancelBooking(b.id)}>✕</button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {adminTab==="beschikbaarheid" && (
            <div>
              <div className="admin-header">
                <h1 className="admin-title">Beschikbaarheid beheren</h1>
              </div>
              <div className="alert info" style={{marginBottom:"1.5rem"}}>
                Pas hieronder de beschikbare aantallen aan per product. Wijzigingen zijn direct zichtbaar op de boekingspagina.
              </div>
              <div className="avail-grid">
                {PRODUCTS_INIT.map(p=>(
                  <div key={p.id} className="avail-row">
                    <div className="avail-name">
                      <span style={{fontSize:"1.4rem"}}>{p.icon}</span>
                      <div>
                        <div style={{fontWeight:600}}>{p.name}</div>
                        <div style={{fontSize:12,color:"#999"}}>€{prices[p.priceKey].toFixed(2)} {p.perUnit}</div>
                      </div>
                    </div>
                    <div className="avail-controls">
                      <button className="qty-btn" onClick={()=>setAvail(a=>({...a,[p.id]:Math.max(0,a[p.id]-1)}))}>−</button>
                      <span className="avail-num">{avail[p.id]}</span>
                      <button className="qty-btn" onClick={()=>setAvail(a=>({...a,[p.id]:a[p.id]+1}))}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminTab==="prijzen" && (
            <div>
              <div className="admin-header">
                <h1 className="admin-title">Prijzen instellen</h1>
              </div>
              <div className="alert info" style={{marginBottom:"1.5rem"}}>
                Wijzig hieronder de prijzen per product. Nieuwe prijzen gelden direct voor alle nieuwe reserveringen.
              </div>
              <div className="price-grid">
                {PRODUCTS_INIT.map(p=>(
                  <div key={p.id} className="price-card">
                    <div className="price-card-icon">{p.icon}</div>
                    <div className="price-card-name">{p.name}</div>
                    <div className="text-muted" style={{marginBottom:8,fontSize:12}}>{p.perUnit}</div>
                    <div className="price-input-row">
                      <span className="price-prefix">€</span>
                      <input className="price-input" type="number" min="0" step="0.5" value={prices[p.priceKey]}
                        onChange={e=>setPrices(pr=>({...pr,[p.priceKey]:parseFloat(e.target.value)||0}))} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: add manual booking */}
      {adminModal==="add" && (
        <div className="modal-overlay" onClick={()=>setAdminModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Handmatige reservering</div>
              <button className="close-btn" onClick={()=>setAdminModal(null)}>✕</button>
            </div>
            <div className="form-grid">
              {[["name","Naam"],["email","E-mail"],["phone","Telefoon"]].map(([k,l])=>(
                <div key={k} className="form-group">
                  <label className="form-label">{l}</label>
                  <input className="form-input" value={manualBooking[k]} onChange={e=>setManualBooking(b=>({...b,[k]:e.target.value}))} />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Datum</label>
                <input className="form-input" type="date" value={manualBooking.date} onChange={e=>setManualBooking(b=>({...b,date:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Product</label>
                <select className="form-input" value={manualBooking.product} onChange={e=>setManualBooking(b=>({...b,product:e.target.value}))}>
                  {PRODUCTS_INIT.map(p=><option key={p.id} value={p.id}>{p.name} — €{prices[p.priceKey].toFixed(2)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Aantal</label>
                <input className="form-input" type="number" min="1" value={manualBooking.qty} onChange={e=>setManualBooking(b=>({...b,qty:parseInt(e.target.value)||1}))} />
              </div>
            </div>
            <div style={{marginTop:"1.25rem",display:"flex",gap:8}}>
              <button className="btn-secondary" onClick={()=>setAdminModal(null)}>Annuleren</button>
              <button className="btn-primary" style={{flex:1}} onClick={addManualBooking} disabled={!manualBooking.name||!manualBooking.date}>Reservering aanmaken</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: booking detail */}
      {adminModal?.type==="detail" && (
        <div className="modal-overlay" onClick={()=>setAdminModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{adminModal.booking.id}</div>
              <button className="close-btn" onClick={()=>setAdminModal(null)}>✕</button>
            </div>
            <div className="confirm-details">
              {[
                ["Naam",adminModal.booking.name],
                ["E-mail",adminModal.booking.email],
                ["Telefoon",adminModal.booking.phone],
                ["Datum",formatDate(adminModal.booking.date)],
                ["Product",adminModal.booking.product],
                ["Betaalmethode",adminModal.booking.method],
                ["Totaal",`€${adminModal.booking.total.toFixed(2)}`],
                ["Aangemaakt",formatDate(adminModal.booking.created)],
              ].map(([k,v])=>(
                <div key={k} className="confirm-row">
                  <span>{k}</span><span>{v}</span>
                </div>
              ))}
              <div className="confirm-row">
                <span>Status</span>
                <span className={`status-badge ${adminModal.booking.status}`}>
                  {adminModal.booking.status==="confirmed"?"Bevestigd":adminModal.booking.status==="pending"?"Wachtend":"Geannuleerd"}
                </span>
              </div>
            </div>
            {adminModal.booking.status!=="cancelled" && (
              <button className="btn-primary" style={{background:"#E24B4A",marginTop:"1rem"}} onClick={()=>{cancelBooking(adminModal.booking.id);setAdminModal(null);}}>
                Reservering annuleren
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
      {view==="booking" ? renderBooking() : renderAdmin()}
    </>
  );
}
