import { useState, useEffect } from "react";

const API = "https://strandboeking-api.vercel.app";
const SUPABASE_URL = "https://bdjmxkuovhadqggemugn.supabase.co";
const SUPABASE_KEY = "sb_publishable_g62FHY9rlS_QA7jWRvSjnw_lefk8E0I";

const STYLE = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'DM Sans', sans-serif; }
.app { min-height: 100vh; background: #FDF6EE; color: #1a1a1a; }
.header { background: #fff; border-bottom: 1px solid #E8DDD0; padding: 0 2rem; display: flex; align-items: center; justify-content: space-between; height: 64px; position: sticky; top: 0; z-index: 100; }
.logo { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; color: #C25B20; }
.logo span { color: #1a1a1a; }
.nav-btn { background: none; border: 1.5px solid #C25B20; color: #C25B20; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.nav-btn:hover, .nav-btn.active { background: #C25B20; color: #fff; }
.hero { background: linear-gradient(135deg, #C25B20 0%, #E8824A 50%, #F5A872 100%); color: #fff; padding: 4rem 2rem 3rem; text-align: center; }
.hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(1.8rem, 5vw, 3rem); font-weight: 700; margin-bottom: 0.5rem; }
.hero p { font-size: 1.05rem; opacity: 0.9; }
.stepper { display: flex; justify-content: center; padding: 1.5rem 1rem; background: #fff; border-bottom: 1px solid #E8DDD0; overflow-x: auto; }
.step { display: flex; align-items: center; gap: 8px; padding: 6px 12px; font-size: 13px; font-weight: 500; color: #999; white-space: nowrap; }
.step.active { color: #C25B20; }
.step.done { color: #2D8B5A; }
.step-num { width: 24px; height: 24px; border-radius: 50%; border: 2px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; flex-shrink: 0; }
.step.done .step-num { background: #2D8B5A; border-color: #2D8B5A; color: #fff; }
.step.active .step-num { background: #C25B20; border-color: #C25B20; color: #fff; }
.step-arrow { color: #D0C4B8; font-size: 16px; }
.main { max-width: 780px; margin: 0 auto; padding: 2rem 1rem 4rem; }
.section-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 600; color: #1a1a1a; margin-bottom: 1.5rem; }
.date-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.date-header { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 4px; }
.day-label { text-align: center; font-size: 11px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.05em; padding: 6px 0; }
.date-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-size: 14px; cursor: pointer; border: 1px solid transparent; transition: all 0.15s; background: #fff; color: #1a1a1a; }
.date-cell:hover:not(.past):not(.empty) { border-color: #C25B20; color: #C25B20; }
.date-cell.selected { background: #C25B20; color: #fff; border-color: #C25B20; font-weight: 600; }
.date-cell.today { font-weight: 600; border-color: #E8824A; color: #C25B20; }
.date-cell.past { opacity: 0.35; cursor: not-allowed; }
.date-cell.empty { cursor: default; }
.cal-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.cal-month { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 600; }
.cal-btn { background: none; border: 1px solid #E8DDD0; border-radius: 8px; width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; transition: all 0.15s; color: #666; }
.cal-btn:hover { border-color: #C25B20; color: #C25B20; }
.card { background: #fff; border-radius: 16px; padding: 1.5rem; border: 1px solid #E8DDD0; margin-bottom: 1.5rem; }
.products { display: grid; gap: 16px; }
.product-card { background: #fff; border: 2px solid #E8DDD0; border-radius: 16px; overflow: hidden; transition: all 0.2s; position: relative; }
.product-card.selected { border-color: #C25B20; background: #FFF8F3; }
.product-img { width: 100%; height: 160px; object-fit: cover; background: #F0E8E0; display: flex; align-items: center; justify-content: center; font-size: 3rem; }
.product-img img { width: 100%; height: 100%; object-fit: cover; }
.product-body { padding: 1rem; }
.badge { position: absolute; top: 10px; left: 10px; background: #C25B20; color: #fff; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 10px; text-transform: uppercase; }
.p-name { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 600; margin-bottom: 0.25rem; }
.p-desc { font-size: 13px; color: #777; line-height: 1.5; margin-bottom: 0.75rem; }
.p-footer { display: flex; align-items: center; justify-content: space-between; }
.p-price { font-size: 1.2rem; font-weight: 600; color: #C25B20; }
.p-avail { font-size: 12px; color: #2D8B5A; font-weight: 500; }
.p-avail.low { color: #D44; }
.qty-ctrl { display: flex; align-items: center; gap: 8px; }
.qty-btn { width: 32px; height: 32px; border-radius: 50%; border: 1.5px solid #C25B20; background: none; color: #C25B20; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.qty-btn:hover { background: #C25B20; color: #fff; }
.qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.qty-num { font-weight: 600; font-size: 15px; min-width: 20px; text-align: center; }
.sum-bar { background: #1a1a1a; color: #fff; padding: 1rem 1.5rem; border-radius: 12px; margin: 1rem 0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
.sum-lbl { font-size: 13px; opacity: 0.7; }
.sum-total { font-size: 1.3rem; font-weight: 600; color: #F5A872; }
.form-grid { display: grid; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 13px; font-weight: 500; color: #555; }
.form-input { padding: 12px 14px; border: 1.5px solid #E8DDD0; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #1a1a1a; background: #fff; outline: none; transition: border-color 0.15s; }
.form-input:focus { border-color: #C25B20; }
.form-input.err { border-color: #E24B4A; }
.form-err { font-size: 12px; color: #E24B4A; }
.pay-methods { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin: 1rem 0; }
.pay-m { background: #fff; border: 2px solid #E8DDD0; border-radius: 12px; padding: 1rem; text-align: center; cursor: pointer; transition: all 0.2s; }
.pay-m:hover, .pay-m.selected { border-color: #C25B20; background: #FFF8F3; }
.pay-icon { font-size: 1.8rem; margin-bottom: 6px; }
.pay-name { font-size: 13px; font-weight: 500; color: #555; }
.pay-m.selected .pay-name { color: #C25B20; }
.order-box { background: #fff; border: 1px solid #E8DDD0; border-radius: 12px; padding: 1rem; margin-bottom: 1rem; }
.order-row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #F0E8E0; font-size: 14px; color: #555; }
.order-row:last-child { border-bottom: none; font-weight: 700; font-size: 15px; color: #C25B20; padding-top: 12px; }
.btn-p { background: #C25B20; color: #fff; border: none; padding: 14px 32px; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; width: 100%; }
.btn-p:hover { background: #A84C18; }
.btn-p:disabled { background: #D0C4B8; cursor: not-allowed; }
.btn-s { background: transparent; color: #C25B20; border: 1.5px solid #C25B20; padding: 12px 24px; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.btn-s:hover { background: #FFF8F3; }
.btn-row { display: flex; gap: 10px; margin-top: 1rem; }
.alert { padding: 12px 16px; border-radius: 10px; font-size: 14px; margin-bottom: 1rem; }
.alert.ok { background: #E1F5EE; color: #0F6E56; border: 1px solid #9FE1CB; }
.alert.info { background: #E6F1FB; color: #185FA5; border: 1px solid #B5D4F4; }
.tag { display: inline-block; background: #FFF8F3; border: 1px solid #E8DDD0; border-radius: 6px; padding: 2px 8px; font-size: 12px; color: #888; margin-right: 4px; margin-bottom: 4px; }
.divider { height: 1px; background: #E8DDD0; margin: 1rem 0; }
.mollie-box { background: #fff; border: 2px dashed #E8DDD0; border-radius: 16px; padding: 2rem; text-align: center; }
.progress-bar { height: 4px; background: #F0E8E0; border-radius: 2px; overflow: hidden; margin: 1rem 0; }
.progress-fill { height: 100%; background: #C25B20; border-radius: 2px; animation: prog 2.8s ease-in-out forwards; }
@keyframes prog { from { width: 0% } to { width: 100% } }
.admin-layout { display: grid; grid-template-columns: 220px 1fr; min-height: calc(100vh - 64px); }
.admin-side { background: #1a1a1a; padding: 1.5rem 0; }
.admin-side-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #666; padding: 0 1.25rem; margin-bottom: 0.5rem; }
.admin-nav { display: flex; align-items: center; gap: 10px; padding: 10px 1.25rem; color: #999; font-size: 14px; cursor: pointer; border-left: 3px solid transparent; transition: all 0.15s; }
.admin-nav:hover { color: #fff; background: rgba(255,255,255,0.05); }
.admin-nav.active { color: #F5A872; border-left-color: #F5A872; background: rgba(245,168,114,0.08); }
.admin-main { padding: 2rem; background: #F7F0E8; overflow-y: auto; }
.admin-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
.admin-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 600; }
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 1.5rem; }
.stat { background: #fff; border-radius: 12px; padding: 1rem 1.25rem; border: 1px solid #E8DDD0; }
.stat-lbl { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
.stat-val { font-size: 1.6rem; font-weight: 600; color: #C25B20; font-family: 'Playfair Display', serif; }
.tbl { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #E8DDD0; }
.tbl th { background: #FFF8F3; padding: 10px 14px; text-align: left; font-size: 12px; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #E8DDD0; }
.tbl td { padding: 12px 14px; font-size: 14px; border-bottom: 1px solid #F0E8E0; vertical-align: middle; }
.tbl tr:last-child td { border-bottom: none; }
.tbl tr:hover td { background: #FFF8F3; }
.sbadge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
.sbadge.confirmed { background: #E1F5EE; color: #0F6E56; }
.sbadge.pending { background: #FAEEDA; color: #854F0B; }
.sbadge.cancelled { background: #FCEBEB; color: #A32D2D; }
.icon-btn { background: none; border: 1px solid #E8DDD0; border-radius: 8px; width: 32px; height: 32px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; color: #888; transition: all 0.15s; font-size: 15px; }
.icon-btn:hover { border-color: #C25B20; color: #C25B20; }
.icon-btn.danger:hover { border-color: #E24B4A; color: #E24B4A; }
.prod-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.prod-admin-card { background: #fff; border-radius: 12px; border: 1px solid #E8DDD0; overflow: hidden; }
.prod-admin-img { width: 100%; height: 140px; object-fit: cover; background: #F0E8E0; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; }
.prod-admin-img img { width: 100%; height: 100%; object-fit: cover; }
.prod-admin-body { padding: 1rem; }
.prod-admin-name { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
.prod-admin-desc { font-size: 12px; color: #888; margin-bottom: 8px; line-height: 1.4; }
.prod-admin-footer { display: flex; justify-content: space-between; align-items: center; }
.modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
.modal { background: #fff; border-radius: 20px; padding: 1.5rem; max-width: 540px; width: 100%; max-height: 90vh; overflow-y: auto; }
.modal-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
.modal-title { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 600; }
.close-x { background: none; border: none; font-size: 20px; cursor: pointer; color: #888; }
.upload-area { border: 2px dashed #E8DDD0; border-radius: 12px; padding: 1.5rem; text-align: center; cursor: pointer; transition: all 0.2s; }
.upload-area:hover { border-color: #C25B20; background: #FFF8F3; }
.upload-preview { width: 100%; height: 160px; object-fit: cover; border-radius: 10px; margin-top: 0.75rem; }
@media (max-width: 640px) {
  .admin-layout { grid-template-columns: 1fr; }
  .admin-side { display: none; }
  .header { padding: 0 1rem; }
  .main { padding: 1.25rem 0.75rem 3rem; }
}
`;

const NL_M = ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"];
const NL_D = ["Ma","Di","Wo","Do","Vr","Za","Zo"];

function formatDate(d) {
  if (!d) return "";
  const [y,m,day] = d.split("-");
  return `${parseInt(day)} ${NL_M[parseInt(m)-1]} ${y}`;
}

async function uploadAfbeelding(file) {
  const ext = file.name.split('.').pop();
  const naam = `product-${Date.now()}.${ext}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/product-images/${naam}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': file.type,
      'x-upsert': 'true'
    },
    body: file
  });
  if (!res.ok) throw new Error('Upload mislukt');
  return `${SUPABASE_URL}/storage/v1/object/public/product-images/${naam}`;
}

async function supabaseFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': options.method === 'POST' ? 'return=representation' : undefined,
      ...options.headers
    }
  });
  if (!res.ok) throw new Error(await res.text());
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ─── BEVESTIGINGSPAGINA ───────────────────────────────────────────────────────
export function BevestigingsPagina() {
  const [reservering, setReservering] = useState(null);
  const [laden, setLaden] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nr = params.get("nr");
    if (nr) {
      fetch(`${API}/api/reserveringen`)
        .then(r => r.json())
        .then(data => {
          const res = Array.isArray(data) ? data.find(r => r.reservering_nr === nr) : null;
          setReservering(res || { reservering_nr: nr });
          setLaden(false);
        })
        .catch(() => { setReservering({ reservering_nr: nr }); setLaden(false); });
    } else setLaden(false);
  }, []);

  return (
    <div style={{minHeight:"100vh",background:"#FDF6EE",fontFamily:"DM Sans,sans-serif",padding:"2rem 1rem"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
      {laden ? (
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"60vh"}}>
          <p style={{color:"#888"}}>Reservering ophalen...</p>
        </div>
      ) : (
        <div style={{maxWidth:"560px",margin:"2rem auto",background:"#fff",borderRadius:"20px",padding:"2.5rem",border:"1px solid #E8DDD0",textAlign:"center"}}>
          <div style={{fontSize:"4rem",marginBottom:"1rem"}}>🎉</div>
          <h1 style={{fontFamily:"Playfair Display,serif",fontSize:"1.8rem",fontWeight:700,marginBottom:"0.5rem"}}>Reservering bevestigd!</h1>
          <p style={{color:"#777",fontSize:"15px",marginBottom:"1.5rem",lineHeight:1.5}}>
            {reservering?.naam ? `Bedankt, ${reservering.naam}!` : "Bedankt!"} Je reservering is succesvol ontvangen.
          </p>
          <div style={{background:"#FFF8F3",borderRadius:"12px",padding:"1.25rem",textAlign:"left",marginBottom:"1.5rem"}}>
            {[
              ["Reserveringsnummer", reservering?.reservering_nr],
              ["Datum", reservering?.datum ? formatDate(reservering.datum) : "-"],
              ["Betaalmethode", reservering?.betaal_methode || "Online betaald"],
              ["Totaal betaald", reservering?.totaal ? `€${parseFloat(reservering.totaal).toFixed(2)}` : "-"],
              ["Status", "✅ Bevestigd"],
            ].map(([k,v]) => (
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:"14px",borderBottom:"1px solid #F0E8E0"}}>
                <span style={{color:"#777"}}>{k}</span>
                <span style={{fontWeight:600,color:k==="Reserveringsnummer"?"#C25B20":"inherit"}}>{v}</span>
              </div>
            ))}
          </div>
          <a href="https://www.strandbedhuren.nl" style={{display:"block",background:"#C25B20",color:"#fff",padding:"14px 24px",borderRadius:"12px",textDecoration:"none",fontWeight:600,fontSize:"15px"}}>
            Nieuwe reservering maken
          </a>
        </div>
      )}
    </div>
  );
}

// ─── HOOFD APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("booking");
  const [step, setStep] = useState(1);
  const [producten, setProducten] = useState([]);
  const [ladenProducten, setLadenProducten] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [selDate, setSelDate] = useState("");
  const [calY, setCalY] = useState(new Date().getFullYear());
  const [calM, setCalM] = useState(new Date().getMonth());
  const [qtys, setQtys] = useState({});
  const [cust, setCust] = useState({name:"",email:"",phone:""});
  const [custErr, setCustErr] = useState({});
  const [payM, setPayM] = useState("ideal");
  const [processing, setProcessing] = useState(false);
  const [adminTab, setAdminTab] = useState("reserveringen");
  const [modal, setModal] = useState(null);
  const [prodModal, setProdModal] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Morgen als vroegste datum
  const morgen = new Date();
  morgen.setDate(morgen.getDate() + 1);
  const minDatum = morgen.toISOString().split("T")[0];

  const total = producten.reduce((s,p) => s + (qtys[p.id]||0) * parseFloat(p.prijs), 0);
  const hasProds = producten.some(p => (qtys[p.id]||0) > 0);

  useEffect(() => { laadProducten(); }, []);

  const laadProducten = async () => {
    setLadenProducten(true);
    try {
      const data = await supabaseFetch('producten?actief=eq.true&order=volgorde.asc');
      setProducten(data || []);
      const initQtys = {};
      (data||[]).forEach(p => initQtys[p.id] = 0);
      setQtys(initQtys);
    } catch(e) { console.error(e); }
    setLadenProducten(false);
  };

  const setQty = (id, v) => {
    const p = producten.find(p => p.id === id);
    setQtys(q => ({...q, [id]: Math.max(0, Math.min(v, p?.beschikbaar||0))}));
  };

  const validate = () => {
    const e = {};
    if (!cust.name.trim()) e.name = "Naam is verplicht";
    if (!cust.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Ongeldig e-mailadres";
    if (!cust.phone.match(/^[\d\s+\-()\u0030-\u0039]{8,}$/)) e.phone = "Ongeldig telefoonnummer";
    setCustErr(e);
    return !Object.keys(e).length;
  };

  const handlePay = async () => {
    if (!validate()) return;
    setProcessing(true);
    try {
      const gekozenProducten = producten
        .filter(p => (qtys[p.id]||0) > 0)
        .map(p => ({ id: p.id, naam: p.naam, aantal: qtys[p.id], prijs: parseFloat(p.prijs) }));

      const response = await fetch(`${API}/api/betaling`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datum: selDate,
          producten: gekozenProducten,
          klant: { naam: cust.name, email: cust.email, telefoon: cust.phone },
          methode: payM
        })
      });

      const data = await response.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || "Onbekende fout");
      }
    } catch (err) {
      alert("Er ging iets mis bij het starten van de betaling. Probeer het opnieuw.");
      setProcessing(false);
    }
  };

  // Productbeheer
  const saveProduct = async (prod, fotoFile) => {
    setUploading(true);
    try {
      let afbeelding_url = prod.afbeelding_url;
      if (fotoFile) {
        afbeelding_url = await uploadAfbeelding(fotoFile);
      }

      const data = {
        naam: prod.naam,
        omschrijving: prod.omschrijving,
        prijs: parseFloat(prod.prijs),
        beschikbaar: parseInt(prod.beschikbaar),
        volgorde: parseInt(prod.volgorde) || 0,
        actief: true,
        afbeelding_url
      };

      if (prod.id) {
        await supabaseFetch(`producten?id=eq.${prod.id}`, {
          method: 'PATCH',
          body: JSON.stringify(data)
        });
      } else {
        await supabaseFetch('producten', {
          method: 'POST',
          body: JSON.stringify(data)
        });
      }
      await laadProducten();
      setProdModal(null);
    } catch(e) {
      alert('Opslaan mislukt: ' + e.message);
    }
    setUploading(false);
  };

  const verwijderProduct = async (id) => {
    if (!confirm('Weet je zeker dat je dit product wilt verwijderen?')) return;
    await supabaseFetch(`producten?id=eq.${id}`, { method: 'DELETE' });
    await laadProducten();
  };

  const calCells = () => {
    const first = new Date(calY, calM, 1).getDay();
    const offset = first === 0 ? 6 : first - 1;
    const days = new Date(calY, calM+1, 0).getDate();
    const cells = [];
    for (let i = 0; i < offset; i++) cells.push(<div key={`e${i}`} className="date-cell empty"/>);
    for (let d = 1; d <= days; d++) {
      const ds = `${calY}-${String(calM+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      const past = ds < minDatum;
      const isSel = ds === selDate;
      cells.push(
        <div key={d} className={`date-cell${past?" past":""}${isSel?" selected":""}`}
          onClick={() => !past && setSelDate(ds)}>{d}</div>
      );
    }
    return cells;
  };

  const prevM = () => { if (calM===0){setCalM(11);setCalY(y=>y-1);}else setCalM(m=>m-1); };
  const nextM = () => { if (calM===11){setCalM(0);setCalY(y=>y+1);}else setCalM(m=>m+1); };

  const STEPS = ["Datum","Producten","Gegevens","Betaling"];

  const renderStepper = () => (
    <div className="stepper">
      {STEPS.map((s,i) => (
        <div key={i} style={{display:"flex",alignItems:"center"}}>
          <div className={`step${step===i+1?" active":step>i+1?" done":""}`}>
            <div className="step-num">{step>i+1?"✓":i+1}</div>{s}
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
        <div className="logo">Strand<span>BedHuren</span></div>
        <div style={{display:"flex",gap:8}}>
          <button className="nav-btn active">Boeken</button>
          <button className="nav-btn" onClick={() => setView("admin")}>Beheer →</button>
        </div>
      </header>
      <div className="hero">
        <h1>🌊 Reserveer jouw strandplek</h1>
        <p>Kies datum, producten en betaal direct online</p>
      </div>
      {renderStepper()}
      <div className="main">

        {step===1 && (
          <div>
            <div className="card">
              <div className="section-title">Kies je datum</div>
              <div className="cal-nav">
                <button className="cal-btn" onClick={prevM}>‹</button>
                <span className="cal-month">{NL_M[calM].charAt(0).toUpperCase()+NL_M[calM].slice(1)} {calY}</span>
                <button className="cal-btn" onClick={nextM}>›</button>
              </div>
              <div className="date-header">{NL_D.map(d=><div key={d} className="day-label">{d}</div>)}</div>
              <div className="date-grid">{calCells()}</div>
            </div>
            {selDate && <div className="alert ok">✅ Geselecteerd: <strong>{formatDate(selDate)}</strong></div>}
            <button className="btn-p" disabled={!selDate} onClick={() => setStep(2)}>Verder naar producten →</button>
          </div>
        )}

        {step===2 && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem",flexWrap:"wrap",gap:8}}>
              <div className="section-title" style={{marginBottom:0}}>Kies je producten</div>
              <span className="tag">📅 {formatDate(selDate)}</span>
            </div>
            {ladenProducten ? (
              <div style={{textAlign:"center",padding:"2rem",color:"#888"}}>Producten laden...</div>
            ) : (
              <div className="products">
                {producten.map(p => {
                  const qty = qtys[p.id]||0;
                  const av = p.beschikbaar;
                  return (
                    <div key={p.id} className={`product-card${qty>0?" selected":""}`}>
                      <div className="product-img">
                        {p.afbeelding_url ? <img src={p.afbeelding_url} alt={p.naam}/> : <span>🏖️</span>}
                      </div>
                      <div className="product-body">
                        <div className="p-name">{p.naam}</div>
                        <div className="p-desc">{p.omschrijving}</div>
                        <div className="p-footer">
                          <div>
                            <div className="p-price">€{parseFloat(p.prijs).toFixed(2)}</div>
                            <div className={`p-avail${av<=3?" low":""}`}>{av} beschikbaar</div>
                          </div>
                          <div className="qty-ctrl">
                            <button className="qty-btn" onClick={() => setQty(p.id,qty-1)} disabled={qty===0}>−</button>
                            <span className="qty-num">{qty}</span>
                            <button className="qty-btn" onClick={() => setQty(p.id,qty+1)} disabled={qty>=av}>+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {hasProds && (
              <div className="sum-bar">
                <div><div className="sum-lbl">Totaal</div><div className="sum-total">€{total.toFixed(2)}</div></div>
                <div style={{fontSize:12,color:"#aaa"}}>{producten.filter(p=>(qtys[p.id]||0)>0).map(p=>`${p.naam} ×${qtys[p.id]}`).join(", ")}</div>
              </div>
            )}
            <div className="btn-row">
              <button className="btn-s" onClick={() => setStep(1)}>← Terug</button>
              <button className="btn-p" style={{flex:1}} disabled={!hasProds} onClick={() => setStep(3)}>Verder naar gegevens →</button>
            </div>
          </div>
        )}

        {step===3 && (
          <div>
            <div className="card">
              <div className="section-title">Jouw gegevens</div>
              <div className="form-grid">
                {[["name","Naam","Jan de Boer","text"],["email","E-mailadres","jan@voorbeeld.nl","email"],["phone","Telefoonnummer","06 12345678","tel"]].map(([k,l,ph,t]) => (
                  <div key={k} className="form-group">
                    <label className="form-label">{l} *</label>
                    <input className={`form-input${custErr[k]?" err":""}`} type={t} placeholder={ph} value={cust[k]} onChange={e => setCust(c => ({...c,[k]:e.target.value}))} />
                    {custErr[k] && <span className="form-err">{custErr[k]}</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div style={{fontWeight:600,marginBottom:"0.5rem",fontSize:15}}>Samenvatting</div>
              <div style={{marginBottom:8}}>
                <span className="tag">📅 {formatDate(selDate)}</span>
                {producten.filter(p=>(qtys[p.id]||0)>0).map(p => <span key={p.id} className="tag">{p.naam} ×{qtys[p.id]}</span>)}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",borderTop:"1px solid #E8DDD0",paddingTop:8,marginTop:8}}>
                <span style={{color:"#888",fontSize:14}}>Totaalbedrag</span>
                <span style={{fontWeight:700,fontSize:"1.1rem",color:"#C25B20"}}>€{total.toFixed(2)}</span>
              </div>
            </div>
            <div className="btn-row">
              <button className="btn-s" onClick={() => setStep(2)}>← Terug</button>
              <button className="btn-p" style={{flex:1}} onClick={() => { if(validate()) setStep(4); }}>Verder naar betaling →</button>
            </div>
          </div>
        )}

        {step===4 && (
          <div>
            <div className="card">
              <div className="section-title">Betaalmethode</div>
              <div className="pay-methods">
                {[{id:"ideal",icon:"🏦",name:"iDEAL"},{id:"bancontact",icon:"💳",name:"Bancontact"},{id:"creditcard",icon:"🪙",name:"Creditcard"},{id:"applepay",icon:"🍎",name:"Apple Pay"}].map(m => (
                  <div key={m.id} className={`pay-m${payM===m.id?" selected":""}`} onClick={() => setPayM(m.id)}>
                    <div className="pay-icon">{m.icon}</div>
                    <div className="pay-name">{m.name}</div>
                  </div>
                ))}
              </div>
              <div className="divider"/>
              <div style={{fontWeight:600,marginBottom:"0.75rem",fontSize:15}}>Bestelling</div>
              <div className="order-box">
                {producten.filter(p=>(qtys[p.id]||0)>0).map(p => (
                  <div key={p.id} className="order-row"><span>{p.naam} × {qtys[p.id]}</span><span>€{((qtys[p.id]||0)*parseFloat(p.prijs)).toFixed(2)}</span></div>
                ))}
                <div className="order-row"><span>Datum</span><span style={{fontWeight:400,color:"#777",fontSize:13}}>{formatDate(selDate)}</span></div>
                <div className="order-row"><span>Totaal te betalen</span><span>€{total.toFixed(2)}</span></div>
              </div>
              {processing ? (
                <div className="mollie-box">
                  <div style={{fontWeight:700,marginBottom:6}}>Verbinding met Mollie...</div>
                  <div style={{fontSize:12,color:"#888",marginBottom:4}}>Betaling wordt verwerkt. Even geduld.</div>
                  <div className="progress-bar"><div className="progress-fill"/></div>
                  <div style={{fontSize:11,color:"#bbb"}}>🔒 Beveiligde betaling via Mollie</div>
                </div>
              ) : (
                <>
                  <div className="alert info">🔒 Betaling via <strong>Mollie</strong>. Reservering definitief na succesvolle betaling.</div>
                  <div className="btn-row">
                    <button className="btn-s" onClick={() => setStep(3)}>← Terug</button>
                    <button className="btn-p" style={{flex:1}} onClick={handlePay}>Nu betalen — €{total.toFixed(2)}</button>
                  </div>
                </>
              )}
            </div>
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
        <button className="nav-btn" onClick={() => setView("booking")}>← Website</button>
      </header>
      <div className="admin-layout">
        <aside className="admin-side">
          <div className="admin-side-title">Beheer</div>
          {[
            {id:"reserveringen",icon:"📋",lbl:"Reserveringen"},
            {id:"producten",icon:"🏖️",lbl:"Producten"},
          ].map(t => (
            <div key={t.id} className={`admin-nav${adminTab===t.id?" active":""}`} onClick={() => setAdminTab(t.id)}><span>{t.icon}</span>{t.lbl}</div>
          ))}
        </aside>
        <main className="admin-main">

          {adminTab==="reserveringen" && (
            <>
              <div className="admin-hdr"><div className="admin-title">Reserveringen</div></div>
              <div className="stats">
                <div className="stat"><div className="stat-lbl">Totaal</div><div className="stat-val">{bookings.length}</div></div>
                <div className="stat"><div className="stat-lbl">Bevestigd</div><div className="stat-val" style={{color:"#0F6E56"}}>{bookings.filter(b=>b.status==="confirmed").length}</div></div>
                <div className="stat"><div className="stat-lbl">Omzet</div><div className="stat-val">€{bookings.filter(b=>b.status==="confirmed").reduce((s,b)=>s+(b.total||0),0).toFixed(0)}</div></div>
              </div>
              {bookings.length === 0 ? (
                <div style={{background:"#fff",borderRadius:12,padding:"2rem",textAlign:"center",color:"#888",border:"1px solid #E8DDD0"}}>
                  Nog geen reserveringen. Reserveringen verschijnen hier na de eerste boeking.
                </div>
              ) : (
                <div style={{overflowX:"auto"}}>
                  <table className="tbl">
                    <thead><tr><th>ID</th><th>Naam</th><th>Datum</th><th>Product</th><th>Totaal</th><th>Status</th></tr></thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b.id}>
                          <td style={{fontWeight:700,color:"#C25B20",fontSize:12}}>{b.reservering_nr}</td>
                          <td><div style={{fontWeight:600,fontSize:13}}>{b.naam}</div><div style={{fontSize:11,color:"#aaa"}}>{b.email}</div></td>
                          <td style={{fontSize:12}}>{formatDate(b.datum)}</td>
                          <td style={{fontSize:12}}>{Array.isArray(b.producten) ? b.producten.map(p=>`${p.naam} ×${p.aantal}`).join(", ") : "-"}</td>
                          <td style={{fontWeight:700}}>€{parseFloat(b.totaal||0).toFixed(2)}</td>
                          <td><span className={`sbadge ${b.status}`}>{b.status==="confirmed"?"Bevestigd":b.status==="pending"?"Wachtend":"Geannuleerd"}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {adminTab==="producten" && (
            <>
              <div className="admin-hdr">
                <div className="admin-title">Producten ({producten.length}/10)</div>
                {producten.length < 10 && (
                  <button className="btn-p" style={{width:"auto",padding:"8px 16px",fontSize:13}} onClick={() => setProdModal({naam:"",omschrijving:"",prijs:"",beschikbaar:"",volgorde:producten.length+1,afbeelding_url:""})}>
                    + Nieuw product
                  </button>
                )}
              </div>
              <div className="prod-grid">
                {producten.map(p => (
                  <div key={p.id} className="prod-admin-card">
                    <div className="prod-admin-img">
                      {p.afbeelding_url ? <img src={p.afbeelding_url} alt={p.naam}/> : <span>🏖️</span>}
                    </div>
                    <div className="prod-admin-body">
                      <div className="prod-admin-name">{p.naam}</div>
                      <div className="prod-admin-desc">{p.omschrijving}</div>
                      <div className="prod-admin-footer">
                        <div>
                          <div style={{fontWeight:700,color:"#C25B20"}}>€{parseFloat(p.prijs).toFixed(2)}</div>
                          <div style={{fontSize:12,color:"#888"}}>{p.beschikbaar} beschikbaar</div>
                        </div>
                        <div style={{display:"flex",gap:6}}>
                          <button className="icon-btn" onClick={() => setProdModal({...p})}>✏️</button>
                          <button className="icon-btn danger" onClick={() => verwijderProduct(p.id)}>🗑️</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

        </main>
      </div>

      {prodModal && <ProductModal prod={prodModal} onSave={saveProduct} onClose={() => setProdModal(null)} uploading={uploading} />}
    </div>
  );

  return view==="booking" ? renderBooking() : renderAdmin();
}

function ProductModal({ prod, onSave, onClose, uploading }) {
  const [form, setForm] = useState(prod);
  const [preview, setPreview] = useState(prod.afbeelding_url || null);
  const [fotoFile, setFotoFile] = useState(null);

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFotoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-hdr">
          <div className="modal-title">{prod.id ? "Product bewerken" : "Nieuw product"}</div>
          <button className="close-x" onClick={onClose}>✕</button>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Naam *</label>
            <input className="form-input" value={form.naam} onChange={e => setForm(f=>({...f,naam:e.target.value}))} placeholder="bijv. Ligbed" />
          </div>
          <div className="form-group">
            <label className="form-label">Omschrijving</label>
            <textarea className="form-input" rows={3} value={form.omschrijving} onChange={e => setForm(f=>({...f,omschrijving:e.target.value}))} placeholder="Korte beschrijving van het product..." style={{resize:"vertical"}} />
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div className="form-group">
              <label className="form-label">Prijs (€) *</label>
              <input className="form-input" type="number" min="0" step="0.50" value={form.prijs} onChange={e => setForm(f=>({...f,prijs:e.target.value}))} placeholder="12.50" />
            </div>
            <div className="form-group">
              <label className="form-label">Beschikbaar *</label>
              <input className="form-input" type="number" min="0" value={form.beschikbaar} onChange={e => setForm(f=>({...f,beschikbaar:e.target.value}))} placeholder="40" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Foto</label>
            <label className="upload-area">
              <input type="file" accept="image/*" style={{display:"none"}} onChange={handleFoto} />
              {preview ? (
                <img src={preview} className="upload-preview" alt="preview"/>
              ) : (
                <div>
                  <div style={{fontSize:"2rem",marginBottom:8}}>📷</div>
                  <div style={{fontSize:14,color:"#888"}}>Klik om een foto te uploaden</div>
                  <div style={{fontSize:12,color:"#bbb",marginTop:4}}>JPG, PNG, WEBP — max 5MB</div>
                </div>
              )}
            </label>
            {preview && <button className="btn-s" style={{marginTop:8,fontSize:12,padding:"6px 12px"}} onClick={() => {setPreview(null);setFotoFile(null);setForm(f=>({...f,afbeelding_url:""}));}}>Foto verwijderen</button>}
          </div>
        </div>
        <div style={{marginTop:"1.25rem",display:"flex",gap:8}}>
          <button className="btn-s" onClick={onClose}>Annuleren</button>
          <button className="btn-p" style={{flex:1}} disabled={!form.naam||!form.prijs||uploading} onClick={() => onSave(form, fotoFile)}>
            {uploading ? "Bezig met opslaan..." : "Opslaan"}
          </button>
        </div>
      </div>
    </div>
  );
}
