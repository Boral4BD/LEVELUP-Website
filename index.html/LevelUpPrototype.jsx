const { useState, useEffect, useRef, useMemo } = React;

/* ==================================================================
   LEVELUP — competitive fitness gaming platform
   Console-menu UI, AI form tracking, clans, ladders, store.
   ================================================================== */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

.lu {
  --void:#05080F; --line:rgba(255,255,255,.13); --line2:rgba(255,255,255,.07);
  --ice:#F0F5FF; --dim:#93A3C4;
  --blue:#2B7BFF; --cyan:#4FD8FF; --gold:#FFC85C; --mint:#5CF0B0; --heat:#FF7A5C;
  --glass:rgba(255,255,255,.055); --glass2:rgba(255,255,255,.10);
  --rim:inset 0 1px 0 rgba(255,255,255,.22);
  --drop:0 10px 30px rgba(0,0,0,.34);
  --display:'Manrope','Inter',system-ui,sans-serif;
  --body:'Inter',system-ui,-apple-system,sans-serif;
  --mono:'IBM Plex Mono',ui-monospace,Menlo,monospace;
  font-family:var(--body); color:var(--ice); background:var(--void);
  min-height:100vh; display:flex; justify-content:center;
}
.lu * { box-sizing:border-box; }
.lu button { font-family:inherit; color:inherit; background:none; border:none; cursor:pointer; padding:0; }
.lu button:focus-visible { outline:2px solid var(--cyan); outline-offset:3px; border-radius:16px; }
.lu button[disabled] { cursor:not-allowed; }
.lu input { font-family:inherit; }

.shell { width:100%; max-width:540px; min-height:100vh; position:relative; overflow:hidden;
  display:flex; flex-direction:column;
  background:
    radial-gradient(620px 620px at 10% 4%, rgba(43,123,255,.34), transparent 62%),
    radial-gradient(540px 540px at 94% 30%, rgba(150,88,255,.26), transparent 62%),
    radial-gradient(600px 600px at 34% 92%, rgba(79,216,255,.20), transparent 62%),
    radial-gradient(420px 420px at 88% 78%, rgba(255,120,90,.13), transparent 66%),
    linear-gradient(180deg, #080D1B, #04070F);
  background-attachment:fixed,fixed,fixed,fixed,fixed;
}
.scan-ov { position:fixed; inset:0; pointer-events:none; z-index:9;
  background:radial-gradient(125% 92% at 50% -4%, transparent 52%, rgba(0,0,0,.42) 100%); }

/* ---- glass primitive ---- */
.g { position:relative; background:var(--glass); border:1px solid var(--line); border-radius:24px;
  -webkit-backdrop-filter:blur(24px) saturate(175%); backdrop-filter:blur(24px) saturate(175%);
  box-shadow:var(--drop), var(--rim); }
.g::before { content:''; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
  background:linear-gradient(158deg, rgba(255,255,255,.15), rgba(255,255,255,0) 44%); }

.dsp { font-family:var(--display); font-weight:800; letter-spacing:-.02em; line-height:1.05; }
.mono { font-family:var(--mono); font-variant-numeric:tabular-nums; }
.eyebrow { font-family:var(--mono); font-size:9.5px; letter-spacing:.2em; text-transform:uppercase; color:var(--dim); }
.lu .wm, .lu .mlbl, .lu .hname, .lu .streak-n, .lu .ring-lvl, .lu .repbig, .lu .big, .lu .clantag,
.lu .pos, .lu .av, .lu .cta, .lu .send, .lu .qty span, .lu .stepper span, .lu .ttl, .lu .pd-t,
.lu .mark, .lu .amt, .lu .over .t { font-family:var(--display); font-weight:800; letter-spacing:-.02em; }

/* ---- top bar ---- */
.top { display:flex; align-items:center; gap:11px; padding:13px 16px; position:sticky; top:0; z-index:20;
  background:rgba(8,13,27,.55); -webkit-backdrop-filter:blur(26px) saturate(180%);
  backdrop-filter:blur(26px) saturate(180%); border-bottom:1px solid var(--line2); }
.top .ttl { font-size:16px; }
.back { width:36px; height:36px; border-radius:50%; font-size:14px; color:var(--ice);
  display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:.22s;
  background:var(--glass); border:1px solid var(--line); box-shadow:var(--rim);
  -webkit-backdrop-filter:blur(16px); backdrop-filter:blur(16px); }
.back:hover { background:var(--glass2); }
.back:active { transform:scale(.92); }
.purse { margin-left:auto; display:flex; align-items:center; gap:9px; }
.purse b { font-family:var(--mono); font-size:11.5px; font-weight:500; padding:6px 11px; border-radius:999px;
  background:var(--glass); border:1px solid var(--line2); }

/* ---- layout ---- */
.body { flex:1; padding:16px 16px 30px; position:relative; z-index:2; }
.sect { margin-bottom:24px; }
.sect-hd { display:flex; align-items:center; gap:11px; margin-bottom:12px; }
.rule { flex:1; height:1px; background:var(--line2); }
.card { position:relative; background:var(--glass); border:1px solid var(--line); border-radius:22px;
  padding:16px; -webkit-backdrop-filter:blur(22px) saturate(170%); backdrop-filter:blur(22px) saturate(170%);
  box-shadow:var(--drop), var(--rim); }
.card + .card { margin-top:11px; }

.bar { height:8px; border-radius:999px; overflow:hidden;
  background:rgba(0,0,0,.32); box-shadow:inset 0 1px 2px rgba(0,0,0,.5); }
.bar > i { display:block; height:100%; border-radius:999px; transition:width 1s cubic-bezier(.2,.8,.2,1);
  box-shadow:0 0 12px rgba(79,216,255,.5); }
.bar-lbl { display:flex; justify-content:space-between; margin:10px 0 6px;
  font-family:var(--mono); font-size:9.5px; letter-spacing:.14em; text-transform:uppercase; color:var(--dim); }

.cta { width:100%; padding:16px; border-radius:999px; font-size:15px; color:#03101E;
  background:linear-gradient(135deg, #7DE6FF, #2B7BFF 62%, #4E5BFF);
  box-shadow:0 12px 30px rgba(43,123,255,.42), inset 0 1px 0 rgba(255,255,255,.5);
  transition:transform .22s cubic-bezier(.3,1.3,.4,1), filter .2s; }
.cta:hover { filter:brightness(1.08); }
.cta:active { transform:scale(.97); }
.cta[disabled] { background:var(--glass); color:var(--dim); box-shadow:var(--rim); filter:none; }
.ghost { width:100%; padding:14px; border-radius:999px; color:var(--ice); font-size:13px; font-weight:600;
  background:var(--glass); border:1px solid var(--line); box-shadow:var(--rim);
  -webkit-backdrop-filter:blur(18px); backdrop-filter:blur(18px); transition:.22s; }
.ghost:hover { background:var(--glass2); }
.ghost:active { transform:scale(.98); }
.ghost[disabled] { color:var(--dim); }

.chip { font-family:var(--mono); font-size:9px; letter-spacing:.12em; text-transform:uppercase;
  padding:4px 9px; border-radius:999px; border:1px solid currentColor; }
.pill { font-family:var(--mono); font-size:9.5px; padding:4px 10px; border-radius:999px;
  background:var(--glass); border:1px solid var(--line); color:var(--dim); }

/* ---- segmented control ---- */
.tabs2 { display:flex; gap:4px; padding:4px; border-radius:999px; margin-bottom:16px;
  background:rgba(255,255,255,.05); border:1px solid var(--line2);
  -webkit-backdrop-filter:blur(20px) saturate(170%); backdrop-filter:blur(20px) saturate(170%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.13); }
.tabs2 button { flex:1; padding:10px 6px; border-radius:999px; font-size:12.5px; font-weight:600;
  color:var(--dim); display:flex; align-items:center; justify-content:center; transition:.25s; }
.tabs2 button[data-on="1"] { color:#04101F; background:linear-gradient(135deg,#8FEBFF,#4FA6FF);
  box-shadow:0 5px 16px rgba(43,123,255,.4), inset 0 1px 0 rgba(255,255,255,.55); }

/* ---- main menu ---- */
.mainmenu { flex:1; display:flex; flex-direction:column; padding:22px 16px 24px; position:relative; z-index:2; }
.wm { font-size:clamp(42px,12vw,58px); line-height:.92; text-transform:uppercase; margin:0; letter-spacing:-.035em; }
.wm em { font-style:normal; background:linear-gradient(120deg,#8FEBFF,#2B7BFF 70%,#8E5CFF);
  -webkit-background-clip:text; background-clip:text; color:transparent; }
.tagline { font-family:var(--mono); font-size:9.5px; letter-spacing:.3em; text-transform:uppercase;
  color:var(--dim); margin-top:12px; }

.opcard { display:flex; align-items:center; gap:14px; position:relative; }
.hname { font-size:19px; }
.hsub { font-family:var(--mono); font-size:10px; margin-top:5px; letter-spacing:.08em; }
.streak-n { font-size:22px; color:var(--gold); line-height:1; }

.cutw { display:block; width:100%; text-align:left; position:relative; border-radius:24px; overflow:hidden;
  background:var(--glass); border:1px solid var(--line);
  -webkit-backdrop-filter:blur(24px) saturate(175%); backdrop-filter:blur(24px) saturate(175%);
  box-shadow:var(--drop), var(--rim); transition:transform .25s cubic-bezier(.3,1.2,.4,1), background .25s, box-shadow .25s; }
.cutw::before { content:''; position:absolute; inset:0; pointer-events:none;
  background:linear-gradient(158deg, rgba(255,255,255,.15), rgba(255,255,255,0) 46%); }
button.cutw:hover { background:var(--glass2); box-shadow:0 14px 38px rgba(0,0,0,.4), 0 0 0 1px rgba(79,216,255,.35), var(--rim); }
button.cutw:active { transform:scale(.985); }
.cutw.on { background:rgba(79,216,255,.13); border-color:rgba(79,216,255,.42);
  box-shadow:0 12px 34px rgba(43,123,255,.28), var(--rim); }
.cutw.gold { background:rgba(255,200,92,.13); border-color:rgba(255,200,92,.42); }
.cuti { position:relative; padding:16px; }
.cutw + .cutw { margin-top:11px; }

.mrow { display:flex; align-items:center; }
.mbar { width:4px; min-height:36px; border-radius:999px; align-self:stretch; margin-right:15px;
  background:rgba(255,255,255,.16); transition:.25s; }
.cutw.on .mbar, button.cutw:hover .mbar { background:linear-gradient(180deg,#8FEBFF,#2B7BFF);
  box-shadow:0 0 16px rgba(79,216,255,.75); }
.mlbl { font-size:19px; }
.mmeta { font-family:var(--mono); font-size:9.5px; letter-spacing:.1em; text-transform:uppercase;
  color:var(--dim); margin-top:6px; }
.marrow { margin-left:auto; font-size:15px; color:var(--dim); padding-left:10px; transition:.25s; }
button.cutw:hover .marrow { color:var(--cyan); transform:translateX(3px); }
.mflag { margin-left:auto; display:flex; align-items:center; gap:9px; padding-left:10px; }

.badge { min-width:21px; height:21px; padding:0 7px; border-radius:999px; background:linear-gradient(135deg,#FF9E7A,#FF5C7A);
  color:#2A0710; font-family:var(--mono); font-size:10px; font-weight:600; display:flex; align-items:center;
  justify-content:center; flex-shrink:0; box-shadow:0 3px 10px rgba(255,92,122,.45); }
.dotb { display:inline-flex; align-items:center; justify-content:center; min-width:17px; height:17px;
  padding:0 5px; margin-left:7px; border-radius:999px; background:linear-gradient(135deg,#FF9E7A,#FF5C7A);
  color:#2A0710; font-size:9px; font-weight:700; }

/* ---- quests ---- */
.q { display:flex; align-items:flex-start; gap:13px; padding:15px; margin-bottom:10px; border-radius:22px;
  background:var(--glass); border:1px solid var(--line); box-shadow:var(--drop), var(--rim);
  -webkit-backdrop-filter:blur(22px) saturate(170%); backdrop-filter:blur(22px) saturate(170%); }
.q[data-done="1"] { background:rgba(92,240,176,.11); border-color:rgba(92,240,176,.36); }
.box { width:24px; height:24px; border-radius:50%; border:1.5px solid rgba(255,255,255,.22); flex-shrink:0;
  display:flex; align-items:center; justify-content:center; font-size:12px; color:#03130C; margin-top:2px; transition:.2s; }
.q[data-done="1"] .box { background:linear-gradient(135deg,#8CFFCD,#3ED897); border-color:transparent;
  box-shadow:0 3px 12px rgba(92,240,176,.5); }
.q-t { font-weight:600; font-size:14.5px; }
.q-r { font-family:var(--mono); font-size:10px; margin-top:6px; letter-spacing:.05em; }

/* ---- session ---- */
.ex { display:flex; align-items:center; gap:12px; width:100%; padding:14px 15px; margin-bottom:10px;
  border-radius:22px; text-align:left; transition:.22s;
  background:var(--glass); border:1px solid var(--line); box-shadow:var(--drop), var(--rim);
  -webkit-backdrop-filter:blur(22px) saturate(170%); backdrop-filter:blur(22px) saturate(170%); }
.ex:hover { background:var(--glass2); }
.ex[data-on="1"] { background:rgba(79,216,255,.13); border-color:rgba(79,216,255,.42); }
.ex-n { font-weight:600; font-size:14.5px; }
.ex-k { font-family:var(--mono); font-size:9.5px; color:var(--dim); margin-top:5px; letter-spacing:.05em; }
.ex-x { margin-left:auto; font-family:var(--mono); font-size:10.5px; color:var(--cyan); text-align:right; }

.stepper { display:flex; border-radius:999px; overflow:hidden; background:var(--glass);
  border:1px solid var(--line); box-shadow:var(--rim); }
.stepper button { width:46px; height:48px; font-family:var(--mono); font-size:19px; color:var(--ice); transition:.18s; }
.stepper button:hover { background:rgba(255,255,255,.10); }
.stepper span { min-width:76px; display:flex; align-items:center; justify-content:center; font-size:18px; }

.pop { position:absolute; left:50%; bottom:130px; transform:translateX(-50%); z-index:40; pointer-events:none;
  font-family:var(--display); font-weight:800; font-size:34px; color:var(--cyan);
  text-shadow:0 0 34px rgba(79,216,255,.85); animation:rise 1.1s ease-out forwards; }
@keyframes rise { 0%{opacity:0;transform:translate(-50%,16px) scale(.82)} 20%{opacity:1}
  100%{opacity:0;transform:translate(-50%,-62px) scale(1.08)} }

/* ---- form tracker ---- */
.cam { position:relative; aspect-ratio:3/4; border-radius:28px; overflow:hidden;
  border:1px solid var(--line); box-shadow:0 20px 50px rgba(0,0,0,.5), var(--rim);
  background:linear-gradient(168deg, rgba(20,32,60,.85), rgba(8,13,26,.9) 58%, rgba(4,7,15,.95)); }
.cam-grid { position:absolute; inset:0; opacity:.45;
  background-image:linear-gradient(rgba(79,216,255,.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(79,216,255,.08) 1px, transparent 1px);
  background-size:30px 30px; }
.brk { position:absolute; width:30px; height:30px; border:2.5px solid rgba(79,216,255,.85); }
.brk.tl { top:16px; left:16px; border-right:0; border-bottom:0; border-radius:14px 0 0 0; }
.brk.tr { top:16px; right:16px; border-left:0; border-bottom:0; border-radius:0 14px 0 0; }
.brk.bl { bottom:16px; left:16px; border-right:0; border-top:0; border-radius:0 0 0 14px; }
.brk.br { bottom:16px; right:16px; border-left:0; border-top:0; border-radius:0 0 14px 0; }
.rec { position:absolute; top:22px; left:56px; display:flex; align-items:center; gap:7px; padding:5px 11px;
  border-radius:999px; background:rgba(10,6,10,.5); -webkit-backdrop-filter:blur(14px); backdrop-filter:blur(14px);
  font-family:var(--mono); font-size:9.5px; letter-spacing:.16em; color:#FFB6A4; }
.rec i { width:8px; height:8px; border-radius:50%; background:#FF5C5C; animation:blink 1.1s infinite;
  box-shadow:0 0 10px rgba(255,92,92,.9); }
@keyframes blink { 50% { opacity:.25 } }
.camtime { position:absolute; top:22px; right:56px; padding:5px 11px; border-radius:999px;
  background:rgba(10,14,24,.5); -webkit-backdrop-filter:blur(14px); backdrop-filter:blur(14px);
  font-family:var(--mono); font-size:9.5px; letter-spacing:.12em; color:var(--dim); }
.camhud { position:absolute; left:12px; right:12px; bottom:12px; padding:15px 18px; border-radius:22px;
  display:flex; align-items:flex-end; gap:14px;
  background:rgba(10,16,30,.42); border:1px solid var(--line);
  -webkit-backdrop-filter:blur(26px) saturate(180%); backdrop-filter:blur(26px) saturate(180%);
  box-shadow:var(--rim); }
.repbig { font-size:48px; line-height:.92; }
.cue { position:absolute; left:50%; transform:translateX(-50%); bottom:124px; white-space:nowrap;
  padding:7px 15px; border-radius:999px; background:rgba(10,16,30,.5);
  -webkit-backdrop-filter:blur(18px); backdrop-filter:blur(18px); border:1px solid var(--line);
  font-family:var(--mono); font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--cyan); }
.formring { margin-left:auto; text-align:right; }

/* ---- data ---- */
.sb { width:100%; border-collapse:collapse; }
.sb th { font-family:var(--mono); font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:var(--dim);
  text-align:right; padding:0 0 9px; font-weight:500; }
.sb th:first-child, .sb td:first-child { text-align:left; }
.sb td { font-family:var(--mono); font-size:12.5px; text-align:right; padding:10px 0; border-top:1px solid var(--line2); }
.sb td:first-child { font-family:var(--body); font-weight:500; }
.mvp { color:var(--gold); }
.stat { display:flex; justify-content:space-between; gap:12px; padding:10px 0; }
.stat + .stat { border-top:1px solid var(--line2); }
.stat span:first-child { font-family:var(--mono); font-size:10.5px; letter-spacing:.08em;
  text-transform:uppercase; color:var(--dim); }
.stat span:last-child { font-family:var(--mono); font-size:13.5px; text-align:right; }
.big { font-size:60px; color:var(--cyan); line-height:1; text-shadow:0 0 50px rgba(79,216,255,.55); }

/* ---- store ---- */
.grid { display:grid; grid-template-columns:1fr 1fr; gap:11px; }
.wide { grid-column:span 2; }
.prod { position:relative; border-radius:22px; overflow:hidden; text-align:left; width:100%;
  display:flex; flex-direction:column; transition:.25s cubic-bezier(.3,1.2,.4,1);
  background:var(--glass); border:1px solid var(--line); box-shadow:var(--drop), var(--rim);
  -webkit-backdrop-filter:blur(22px) saturate(170%); backdrop-filter:blur(22px) saturate(170%); }
.prod:hover { background:var(--glass2); transform:translateY(-3px);
  box-shadow:0 18px 42px rgba(0,0,0,.42), 0 0 0 1px rgba(79,216,255,.3), var(--rim); }
.prod:active { transform:scale(.985); }
.prod-img { aspect-ratio:4/3; display:flex; align-items:center; justify-content:center; position:relative;
  border-bottom:1px solid var(--line2);
  background:radial-gradient(closest-side at 50% 42%, rgba(43,123,255,.34), transparent 78%); }
.prod-img svg { width:76%; height:76%; }
.prod-img::after { content:''; position:absolute; left:18%; right:18%; bottom:11%; height:9px; border-radius:50%;
  background:radial-gradient(closest-side, rgba(79,216,255,.34), transparent 75%); }
.prod-b { padding:13px; display:flex; flex-direction:column; gap:6px; flex:1; }
.prod-t { font-weight:600; font-size:13px; line-height:1.3; }
.prod-d { font-family:var(--mono); font-size:8.5px; color:var(--dim); line-height:1.6; }
.prod-p { font-family:var(--mono); font-size:11.5px; margin-top:auto; padding-top:4px; }
.tagpill { position:absolute; top:9px; left:9px; font-family:var(--mono); font-size:8px; letter-spacing:.12em;
  text-transform:uppercase; padding:4px 9px; border-radius:999px; color:var(--dim);
  background:rgba(8,13,27,.55); border:1px solid var(--line);
  -webkit-backdrop-filter:blur(14px); backdrop-filter:blur(14px); }

.row { display:flex; align-items:center; gap:13px; padding:14px; margin-bottom:10px; border-radius:22px;
  background:var(--glass); border:1px solid var(--line); box-shadow:var(--drop), var(--rim);
  -webkit-backdrop-filter:blur(22px) saturate(170%); backdrop-filter:blur(22px) saturate(170%); }
.row-t { font-weight:600; font-size:13.5px; }
.row-d { font-family:var(--mono); font-size:9.5px; color:var(--dim); margin-top:5px; letter-spacing:.04em; line-height:1.55; }
.buy { margin-left:auto; flex-shrink:0; padding:9px 14px; border-radius:999px; font-size:11.5px; font-weight:600;
  color:var(--dim); background:var(--glass); border:1px solid var(--line); transition:.22s; }
.buy[data-can="1"] { color:#2A1C00; background:linear-gradient(135deg,#FFDC8F,#FFB43C); border-color:transparent;
  box-shadow:0 5px 16px rgba(255,180,60,.4), inset 0 1px 0 rgba(255,255,255,.5); }
.buy[data-can="1"]:active { transform:scale(.95); }
.buy[data-got="1"] { color:var(--mint); background:rgba(92,240,176,.14); border-color:rgba(92,240,176,.4); }
.mark { width:50px; height:50px; flex-shrink:0; border-radius:16px; display:flex; align-items:center;
  justify-content:center; font-size:11.5px; border:1px solid var(--line);
  background:linear-gradient(140deg, rgba(79,216,255,.34), rgba(43,123,255,.16)); box-shadow:var(--rim); }

/* ---- product detail ---- */
.hero-img { aspect-ratio:1/1; border-radius:28px; position:relative; display:flex; align-items:center;
  justify-content:center; margin-bottom:18px; border:1px solid var(--line); box-shadow:var(--drop), var(--rim);
  background:radial-gradient(closest-side at 50% 42%, rgba(43,123,255,.36), transparent 78%),
    linear-gradient(160deg, rgba(255,255,255,.07), transparent 50%); }
.hero-img svg { width:74%; height:74%; }
.pd-t { font-size:25px; line-height:1.1; }
.pd-tag { font-family:var(--mono); font-size:10.5px; color:var(--cyan); margin-top:9px; letter-spacing:.08em; }
.pd-price { display:flex; align-items:baseline; gap:12px; margin:17px 0 19px; padding:15px; border-radius:22px;
  background:var(--glass); border:1px solid var(--line); box-shadow:var(--rim);
  -webkit-backdrop-filter:blur(22px); backdrop-filter:blur(22px); }
.pd-price .amt { font-size:27px; }
.pd-body { font-size:14px; line-height:1.75; color:#C9D5EE; }
.feat { display:flex; gap:11px; align-items:flex-start; padding:10px 0; font-size:13px; line-height:1.5; }
.feat + .feat { border-top:1px solid var(--line2); }
.feat i { color:var(--mint); font-style:normal; flex-shrink:0; }
.spec { display:flex; justify-content:space-between; gap:14px; padding:10px 0; font-family:var(--mono); font-size:11.5px; }
.spec + .spec { border-top:1px solid var(--line2); }
.spec b { color:var(--dim); font-weight:400; letter-spacing:.06em; text-transform:uppercase; font-size:10px; }
.qty { display:flex; border-radius:999px; overflow:hidden; flex-shrink:0;
  background:var(--glass); border:1px solid var(--line); box-shadow:var(--rim); }
.qty button { width:44px; height:48px; font-family:var(--mono); font-size:18px; color:var(--ice); transition:.18s; }
.qty button:hover { background:rgba(255,255,255,.10); }
.qty span { min-width:42px; display:flex; align-items:center; justify-content:center; font-size:16px; }
.qty.sm button { width:34px; height:34px; font-size:14px; }
.qty.sm span { min-width:32px; font-size:13px; }
.bagbtn { position:relative; width:36px; height:36px; border-radius:50%; display:flex; align-items:center;
  justify-content:center; background:var(--glass); border:1px solid var(--line); box-shadow:var(--rim); transition:.22s; }
.bagbtn:hover { background:var(--glass2); }
.bagbtn i { position:absolute; top:-6px; right:-6px; min-width:18px; height:18px; padding:0 5px; border-radius:999px;
  background:linear-gradient(135deg,#FF9E7A,#FF5C7A); color:#2A0710; font-family:var(--mono); font-size:9px;
  font-style:normal; font-weight:700; display:flex; align-items:center; justify-content:center; }
.bl { display:flex; gap:13px; padding:13px; margin-bottom:10px; border-radius:22px; align-items:center;
  background:var(--glass); border:1px solid var(--line); box-shadow:var(--drop), var(--rim);
  -webkit-backdrop-filter:blur(22px); backdrop-filter:blur(22px); }
.bl-img { width:64px; height:64px; flex-shrink:0; border-radius:18px; display:flex; align-items:center;
  justify-content:center; overflow:hidden; border:1px solid var(--line2);
  background:radial-gradient(closest-side at 50% 45%, rgba(43,123,255,.28), transparent 80%); }
.bl-img svg { width:82%; height:82%; }
.rm { font-family:var(--mono); font-size:9.5px; letter-spacing:.1em; text-transform:uppercase;
  color:var(--dim); transition:.18s; }
.rm:hover { color:var(--heat); }

/* ---- people ---- */
.fr { display:flex; align-items:center; gap:12px; padding:11px 13px; border-radius:20px;
  border:1px solid transparent; transition:.22s; }
.fr:hover { background:rgba(255,255,255,.04); }
.fr[data-me="1"] { background:rgba(79,216,255,.12); border-color:rgba(79,216,255,.34); box-shadow:var(--rim); }
.av { width:40px; height:40px; border-radius:14px; flex-shrink:0; display:flex; align-items:center;
  justify-content:center; font-size:14px; border:1px solid var(--line2);
  background:linear-gradient(140deg, rgba(255,255,255,.14), rgba(255,255,255,.04)); box-shadow:var(--rim); }
.dot { width:7px; height:7px; border-radius:50%; display:inline-block; margin-right:6px; }
.pos { font-size:15px; width:27px; color:var(--dim); }
.crown { font-family:var(--mono); font-size:9px; letter-spacing:.12em; text-transform:uppercase; color:var(--gold); }
.cc { font-family:var(--mono); font-size:8.5px; letter-spacing:.1em; color:var(--dim); border:1px solid var(--line);
  border-radius:999px; padding:3px 7px; margin-left:8px; }

/* ---- rank ---- */
.ring-wrap { display:flex; flex-direction:column; align-items:center; padding:6px 0 20px; }
.ring { position:relative; width:196px; height:196px; }
.ring-in { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
.ring-lvl { font-size:54px; line-height:1; }
.perk { display:flex; align-items:center; gap:11px; padding:11px 0; font-size:13.5px; }
.perk + .perk { border-top:1px solid var(--line2); }
.tick { width:20px; height:20px; border-radius:50%; border:1.5px solid rgba(255,255,255,.22); flex-shrink:0;
  display:flex; align-items:center; justify-content:center; font-size:11px; color:#03131F; }
.perk[data-on="1"] .tick { background:linear-gradient(135deg,#9FF0FF,#3FA8FF); border-color:transparent;
  box-shadow:0 3px 12px rgba(79,216,255,.5); }
.perk[data-on="0"] { color:var(--dim); }

/* ---- clans ---- */
.clantag { width:48px; height:48px; flex-shrink:0; border-radius:16px; display:flex; align-items:center;
  justify-content:center; font-size:11.5px; color:#E8FBFF; border:1px solid var(--line);
  background:linear-gradient(140deg, rgba(79,216,255,.36), rgba(43,123,255,.16)); box-shadow:var(--rim); }
.clantag.lg { width:88px; height:88px; font-size:20px; border-radius:28px; }
.inp { width:100%; padding:14px 16px; border-radius:999px; color:var(--ice); font-size:14px;
  background:var(--glass); border:1px solid var(--line); box-shadow:var(--rim);
  -webkit-backdrop-filter:blur(18px); backdrop-filter:blur(18px); transition:.22s; }
.inp:focus { outline:none; border-color:rgba(79,216,255,.6); background:var(--glass2); }
.inp::placeholder { color:var(--dim); }
.inp.tagin { font-family:var(--display); font-weight:800; text-transform:uppercase; letter-spacing:.14em; text-align:center; }
.contrib { height:5px; border-radius:999px; background:rgba(0,0,0,.3); overflow:hidden; margin-top:7px; }
.contrib > i { display:block; height:100%; border-radius:999px; background:linear-gradient(90deg,#8FEBFF,#2B7BFF); }
.payout { position:relative; border-radius:24px; padding:17px; margin-bottom:16px;
  border:1px solid rgba(255,200,92,.4);
  background:linear-gradient(140deg, rgba(255,200,92,.18), rgba(255,255,255,.05) 60%);
  -webkit-backdrop-filter:blur(22px) saturate(170%); backdrop-filter:blur(22px) saturate(170%);
  box-shadow:0 12px 34px rgba(0,0,0,.35), var(--rim); }

/* ---- chat ---- */
.chatbox { max-height:48vh; overflow-y:auto; margin-bottom:14px; padding:2px;
  display:flex; flex-direction:column; gap:14px; }
.msg { display:flex; gap:10px; align-items:flex-end; }
.msg[data-mine="1"] { flex-direction:row-reverse; }
.msg .av { width:32px; height:32px; font-size:11px; border-radius:12px; }
.mcol { display:flex; flex-direction:column; min-width:0; max-width:80%; }
.msg[data-mine="1"] .mcol { align-items:flex-end; }
.msg-hd { font-family:var(--mono); font-size:8.5px; letter-spacing:.12em; text-transform:uppercase;
  color:var(--dim); margin-bottom:6px; padding:0 4px; }
.bub { padding:11px 15px; border-radius:20px; font-size:14px; line-height:1.5; overflow-wrap:anywhere;
  background:var(--glass); border:1px solid var(--line); box-shadow:var(--rim);
  -webkit-backdrop-filter:blur(18px); backdrop-filter:blur(18px); border-bottom-left-radius:7px; }
.msg[data-mine="1"] .bub { border-bottom-left-radius:20px; border-bottom-right-radius:7px; color:#04121F;
  background:linear-gradient(135deg,#8FEBFF,#3F9BFF); border-color:transparent;
  box-shadow:0 6px 20px rgba(43,123,255,.36), inset 0 1px 0 rgba(255,255,255,.5); }
.sysmsg { text-align:center; font-family:var(--mono); font-size:9.5px; letter-spacing:.08em;
  color:var(--dim); line-height:1.6; }
.composer { display:flex; gap:9px; }
.send { width:52px; flex-shrink:0; border-radius:999px; font-size:16px; color:#03101E;
  background:linear-gradient(135deg,#7DE6FF,#2B7BFF);
  box-shadow:0 8px 22px rgba(43,123,255,.42), inset 0 1px 0 rgba(255,255,255,.5); transition:.2s; }
.send:active { transform:scale(.94); }
.send[disabled] { background:var(--glass); color:var(--dim); box-shadow:var(--rim); }

/* ---- search ---- */
.search { display:flex; gap:9px; margin-bottom:16px; }
.clearbtn { width:46px; flex-shrink:0; border-radius:999px; color:var(--dim); font-size:14px;
  background:var(--glass); border:1px solid var(--line); box-shadow:var(--rim); transition:.2s; }
.clearbtn:hover { color:var(--heat); }

/* ---- floating nav ---- */
.nav { display:flex; position:sticky; bottom:14px; margin:6px 16px 14px; padding:6px; border-radius:999px;
  z-index:20; background:rgba(255,255,255,.07); border:1px solid var(--line);
  -webkit-backdrop-filter:blur(30px) saturate(185%); backdrop-filter:blur(30px) saturate(185%);
  box-shadow:0 14px 40px rgba(0,0,0,.5), var(--rim); }
.nav button { flex:1; padding:9px 0 8px; border-radius:999px; display:flex; flex-direction:column;
  align-items:center; gap:4px; color:var(--dim); transition:.25s; }
.nav button[data-on="1"] { color:#04101F; background:linear-gradient(135deg,#8FEBFF,#4FA6FF);
  box-shadow:0 5px 16px rgba(43,123,255,.4), inset 0 1px 0 rgba(255,255,255,.55); }
.nav button:not([data-on="1"]):hover { color:var(--ice); background:rgba(255,255,255,.07); }
.nav span { font-size:9.5px; font-weight:600; letter-spacing:.02em; }

/* ---- overlays ---- */
.over { position:absolute; inset:0; z-index:60; padding:28px; display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:14px; text-align:center; animation:fade .35s ease-out;
  background:rgba(5,9,18,.62); -webkit-backdrop-filter:blur(34px) saturate(180%);
  backdrop-filter:blur(34px) saturate(180%); }
@keyframes fade { from{opacity:0} to{opacity:1} }
.over .t { font-size:40px; animation:punch .55s cubic-bezier(.2,1.6,.3,1); }
@keyframes punch { from{transform:scale(.55);opacity:0} to{transform:scale(1);opacity:1} }
.toast { position:absolute; left:16px; right:16px; bottom:88px; z-index:50; padding:14px 17px; border-radius:999px;
  font-family:var(--mono); font-size:11.5px; color:#0B2A1E; letter-spacing:.04em; animation:up .35s cubic-bezier(.3,1.3,.4,1);
  background:linear-gradient(135deg,#96FFD3,#3ED897);
  box-shadow:0 12px 32px rgba(62,216,151,.4), inset 0 1px 0 rgba(255,255,255,.5); }
.reveal { opacity:0; animation:up .6s cubic-bezier(.25,1.1,.35,1) forwards; }
@keyframes up { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
.empty { text-align:center; padding:34px 20px; border-radius:24px;
  background:var(--glass); border:1px solid var(--line); box-shadow:var(--rim);
  -webkit-backdrop-filter:blur(20px); backdrop-filter:blur(20px); }
.empty p { font-family:var(--mono); font-size:11px; color:var(--dim); line-height:1.8; margin:10px 0 0; }

@media (prefers-reduced-motion: reduce) {
  .lu *, .lu *::after, .lu *::before { animation:none !important; transition:none !important; }
  .lu .reveal { opacity:1 !important; }
}
@media (max-width:370px) { .grid { grid-template-columns:1fr; } .wide { grid-column:span 1; } }
`;

/* ============================ DATA ============================ */

const TIERS = [
  { name: "BRONZE", c: "#C77B4A" }, { name: "SILVER", c: "#B9C6DE" },
  { name: "GOLD", c: "#FFC43D" }, { name: "PLATINUM", c: "#4FD8FF" },
  { name: "DIAMOND", c: "#7FA8FF" }, { name: "MASTER", c: "#C08BFF" },
  { name: "APEX", c: "#FF6B4A" },
];
const DIVS = ["III", "II", "I"];
const XP_DIV = 1800, XP_TIER = XP_DIV * 3, XP_LVL = 850;

const EX = {
  pushup: { name: "Push-ups", kit: "Push-up stand", unit: "reps", xp: 3, step: 5, start: 15, cam: true },
  pullup: { name: "Pull-ups", kit: "Pull-up grips", unit: "reps", xp: 9, step: 1, start: 5, cam: true },
  squat:  { name: "Band squats", kit: "Resistance bands", unit: "reps", xp: 4, step: 5, start: 15, cam: true },
  row:    { name: "Band rows", kit: "Resistance bands", unit: "reps", xp: 4, step: 5, start: 12, cam: true },
  plank:  { name: "Plank", kit: "Training mat", unit: "sec", xp: 1.4, step: 15, start: 45, cam: false },
  roller: { name: "Ab rollout", kit: "Ab grips", unit: "reps", xp: 7, step: 2, start: 8, cam: true },
  run:    { name: "Run", kit: "Tracked by phone", unit: "m", xp: 0.14, step: 250, start: 1000, cam: false },
};

const LOADOUTS = [
  { id: "full",   name: "Full clear", desc: "All seven stations", ex: Object.keys(EX) },
  { id: "upper",  name: "Upper",      desc: "Stand and bands",    ex: ["pushup", "pullup", "row"] },
  { id: "core",   name: "Core",       desc: "Mat and grips",      ex: ["plank", "roller", "squat"] },
  { id: "cardio", name: "Cardio",     desc: "Run and burn",       ex: ["run", "squat", "plank"] },
];

const QUESTS0 = [
  { id: "q1", label: "50 push-ups",     ex: "pushup", target: 50,   diff: "Medium", xp: 500, coins: 100, base: 12 },
  { id: "q2", label: "1 km run",        ex: "run",    target: 1000, diff: "Easy",   xp: 200, coins: 50,  base: 0 },
  { id: "q3", label: "30 band squats",  ex: "squat",  target: 30,   diff: "Hard",   xp: 460, coins: 150, base: 5 },
  { id: "q4", label: "2 minutes plank", ex: "plank",  target: 120,  diff: "Medium", xp: 460, coins: 150, base: 30 },
];
const DIFF_C = { Easy: "var(--mint)", Medium: "var(--blue)", Hard: "var(--heat)" };

/* Gift cards. Brand names are used as plain text references to real products,
   the way any rewards app lists what it redeems for. No logos or artwork are
   reproduced — each card carries an abstract mark drawn for this app. */
const CARDS = [
  { id: "g1",  t: "Fortnite",           v: "1,000 V-Bucks",     coins: 1900, k: "FN" },
  { id: "g2",  t: "Valorant",           v: "1,050 VP",          coins: 1900, k: "VAL" },
  { id: "g3",  t: "Rocket League",      v: "1,100 Credits",     coins: 1750, k: "RL" },
  { id: "g4",  t: "Epic Games",         v: "$25 gift card",     coins: 2400, k: "EPIC" },
  { id: "g5",  t: "Roblox",             v: "800 Robux",         coins: 1100, k: "RBX" },
  { id: "g6",  t: "Steam",              v: "$20 wallet credit", coins: 1950, k: "STM" },
  { id: "g7",  t: "PlayStation Store",  v: "$20 credit",        coins: 1950, k: "PSN" },
  { id: "g8",  t: "Xbox",               v: "$20 credit",        coins: 1950, k: "XBX" },
  { id: "g9",  t: "Nintendo eShop",     v: "$20 credit",        coins: 1950, k: "NIN" },
  { id: "g10", t: "League of Legends",  v: "1,380 Riot Points", coins: 2100, k: "LOL" },
];
const CASH = [
  { id: "c1", t: "PayPal transfer",  v: "$10. One to two business days.", coins: 1200, k: "$" },
  { id: "c2", t: "Bank transfer",    v: "$25 minimum. Three days.",       coins: 2900, k: "$" },
  { id: "c3", t: "Retail gift card", v: "$20 at partner retailers.",      coins: 2200, k: "$" },
];

const SHOP = {
  Kit: [
    { id: "s1", t: "LEVELUP kit bag", price: 149, coins: null,
      tag: "The whole system, one bag.", d: "Moulded inserts for every piece.",
      long: "Everything in the kit has a moulded slot, so the bag packs the same way every time and nothing rattles loose on the walk to the park. Built for gear that gets thrown in a car boot four times a week.",
      feat: ["Moulded inserts for every piece of the kit", "Vented side pocket sized for the rolled mat",
        "Lockable zips on the main compartment", "Padded strap plus reinforced grab handles"],
      spec: [["Capacity", "42 L"], ["Weight", "1.9 kg"], ["Material", "900D ripstop"],
        ["Dimensions", "62 × 30 × 28 cm"], ["Warranty", "2 years"]] },
    { id: "s2", t: "Push-up stand", price: 89, coins: null,
      tag: "Two stations in one frame.", d: "Adjustable, converts to pull-up grips.",
      long: "Deeper range of motion than the floor, and the handles rotate so your wrists stay neutral through the whole set. Pull the grips off the base and they clip onto any doorframe bar.",
      feat: ["Rotating handles reduce wrist strain", "Grips detach for pull-ups on a doorframe bar",
        "Non-slip rubber feet", "Folds flat in about five seconds"],
      spec: [["Load rating", "180 kg"], ["Width", "45–70 cm"], ["Handle height", "16 cm"],
        ["Weight", "2.4 kg"], ["Material", "Powder-coated steel"]] },
    { id: "s3", t: "Resistance band set", price: 45, coins: 4200,
      tag: "Five tensions, one pouch.", d: "5 kg through 35 kg.",
      long: "Colour-coded loops you can stack to hit any resistance between 5 and 90 kg. The carabiners clip onto the push-up stand, turning it into an anchor point for rows and pull-downs.",
      feat: ["Five colour-coded loops", "Stack bands for combined resistance",
        "Carabiners clip to the push-up stand", "Mesh carry pouch included"],
      spec: [["Tensions", "5 / 10 / 15 / 25 / 35 kg"], ["Length", "208 cm"], ["Material", "Natural latex"],
        ["Weight", "1.1 kg"], ["Warranty", "1 year"]] },
    { id: "s4", t: "Ab grips", price: 35, coins: 3300,
      tag: "A wheel that won't fold you in half.", d: "Rolling grips with a wrist lock.",
      long: "The dual-wheel base is wide enough that it tracks straight instead of wobbling sideways, and the wrist lock stops the rollover that ends most people's first attempt at an ab wheel.",
      feat: ["Wrist lock prevents rollover", "Dual-wheel base tracks straight",
        "Knurled grips hold with sweaty hands", "Fits the kit bag side pocket"],
      spec: [["Wheel diameter", "18 cm"], ["Load rating", "150 kg"], ["Weight", "0.9 kg"],
        ["Material", "TPR over steel core"]] },
    { id: "s5", t: "Phone tripod mount", price: 39, coins: 3600,
      tag: "The angle the tracker needs.", d: "Sets the camera for form tracking.",
      long: "Form tracking only works if the camera sees your whole body from the side. The legs are marked at the two heights the app asks for, so you set it once and stop guessing where to prop your phone.",
      feat: ["Height marks matched to the app's camera guide", "Ball head rotates a full 360°",
        "Bluetooth remote included", "Rubber feet grip the training mat"],
      spec: [["Height", "22–140 cm"], ["Phone width", "55–90 mm"], ["Folded", "22 cm"],
        ["Weight", "0.6 kg"], ["Head", "Ball head, 360°"]] },
  ],
  Apparel: [
    { id: "s6", t: "Training mat", price: 59, coins: 5400,
      tag: "Marked for hand placement.", d: "8 mm, grip base, rolls into the bag.",
      long: "Alignment marks printed on the surface show where hands and feet go for the six main stations, which matters more than it sounds once the form tracker starts scoring you on it.",
      feat: ["Alignment marks for each station", "Closed-cell surface wipes clean",
        "Grip base holds on timber and concrete", "Carry strap included"],
      spec: [["Thickness", "8 mm"], ["Size", "183 × 61 cm"], ["Weight", "1.3 kg"], ["Material", "NBR foam"]] },
    { id: "s7", t: "Shaker bottle", price: 25, coins: 2300,
      tag: "Your rank, printed on it.", d: "700 ml, rank badge on the side.",
      long: "The badge panel takes a new season sticker each time the ladder resets, so the bottle ends up as a record of where you finished. Petty motivation, but it works.",
      feat: ["Season rank badge panel", "Wire whisk ball", "Leak-proof flip cap", "Dishwasher safe"],
      spec: [["Capacity", "700 ml"], ["Material", "Tritan, BPA-free"], ["Weight", "0.2 kg"],
        ["Colours", "Void, Ice, Plasma"]] },
    { id: "s8", t: "Training tee", price: 45, coins: 4100,
      tag: "Sleeve colour tracks your tier.", d: "Breathable, rank colour on the sleeve.",
      long: "Cut for movement rather than the gym mirror. The sleeve panel comes in your current tier colour, and a replacement sleeve costs postage when you rank up.",
      feat: ["Tier colour on the sleeve panel", "Mesh back panel for airflow",
        "Flatlock seams, no chafe", "Reflective logo for night runs"],
      spec: [["Sizes", "XS–3XL"], ["Fabric", "92% poly / 8% elastane"], ["Weight", "140 gsm"],
        ["Care", "Cold machine wash"]] },
    { id: "s9", t: "Joggers", price: 69, coins: 6200,
      tag: "Pockets that hold a phone at pace.", d: "Tapered fit, zip pockets.",
      long: "Zip pockets sit high on the thigh so a phone doesn't swing while you run, which matters when the phone is the thing counting your distance.",
      feat: ["Zip pockets positioned for running", "Tapered leg, elastic cuffs",
        "Drawcord waist", "Gusseted crotch for squat depth"],
      spec: [["Sizes", "XS–3XL"], ["Fabric", "88% poly / 12% elastane"], ["Inseam", "74 cm"],
        ["Care", "Cold machine wash"]] },
  ],
};
const ALL_ITEMS = [...SHOP.Kit, ...SHOP.Apparel];
const itemOf = (id) => ALL_ITEMS.find((i) => i.id === id);

const FRIENDS0 = [
  { name: "kaz_", week: 5840, on: true }, { name: "novaflick", week: 4610, on: true },
  { name: "brendo.exe", week: 3990, on: false }, { name: "mint_777", week: 2870, on: true },
  { name: "hollowpine", week: 2240, on: false },
];
const DIRECTORY = [
  { name: "quietfrost", week: 3410, on: true }, { name: "j.orbit", week: 1980, on: false },
  { name: "vexrail", week: 4720, on: true }, { name: "sable.tv", week: 8200, on: true },
  { name: "ronin_ka", week: 7400, on: false }, { name: "dust.9", week: 6900, on: true },
  { name: "peakform", week: 6100, on: true }, { name: "holloway", week: 5300, on: false },
  { name: "tarnish", week: 4900, on: true }, { name: "vireo", week: 4400, on: true },
  { name: "mossgrove", week: 3900, on: false }, { name: "ketch", week: 3600, on: true },
  { name: "sunder", week: 3200, on: false }, { name: "palefox", week: 2950, on: true },
  { name: "brack", week: 2600, on: true }, { name: "nim", week: 2300, on: false },
  { name: "stray", week: 2050, on: true }, { name: "fenwick", week: 1800, on: false },
  { name: "tarn", week: 1550, on: true }, { name: "vell", week: 1300, on: true },
  { name: "mirek", week: 1100, on: false }, { name: "corvid_88", week: 3300, on: true },
  { name: "lyre.k", week: 3150, on: false }, { name: "arden_v", week: 2800, on: true },
];

const GLOBAL_TOP = [
  { name: "sable.tv", week: 48200, cc: "JP" }, { name: "ronin_ka", week: 44900, cc: "KR" },
  { name: "dust.9", week: 41600, cc: "US" }, { name: "peakform", week: 39100, cc: "DE" },
  { name: "holloway", week: 36800, cc: "AU" }, { name: "tarnish", week: 35200, cc: "BR" },
  { name: "vireo", week: 33400, cc: "GB" }, { name: "mossgrove", week: 31900, cc: "CA" },
  { name: "q.rune", week: 30500, cc: "SE" }, { name: "palefox", week: 29200, cc: "AU" },
];
const GLOBAL_PLAYERS = 128400;

const CLANS0 = [
  { id: "k1", tag: "VOID", name: "Void Athletics", members: 18, base: 58400, last: 1 },
  { id: "k2", tag: "IRON", name: "Iron Circuit", members: 22, base: 54900, last: 3 },
  { id: "k3", tag: "NOVA", name: "Nova Collective", members: 15, base: 47300, last: 2 },
  { id: "k4", tag: "GRND", name: "The Grind", members: 12, base: 39800, last: 5 },
  { id: "k5", tag: "APEX", name: "Apex Reach", members: 9, base: 31600, last: 4 },
  { id: "k6", tag: "DAWN", name: "First Light", members: 11, base: 26400, last: 7 },
];
const CLAN_REWARDS = [
  { place: "1st", from: 1, to: 1, xp: 5000, coins: 2500 },
  { place: "2nd", from: 2, to: 2, xp: 3000, coins: 1500 },
  { place: "3rd", from: 3, to: 3, xp: 2000, coins: 1000 },
  { place: "4th–10th", from: 4, to: 10, xp: 800, coins: 400 },
  { place: "Everyone else", from: 11, to: 9999, xp: 200, coins: 100 },
];
const rewardFor = (pl) => CLAN_REWARDS.find((t) => pl >= t.from && pl <= t.to);
const ROSTER_NAMES = ["sable.tv", "ronin_ka", "dust.9", "peakform", "holloway", "tarnish", "vireo",
  "mossgrove", "ketch", "sunder", "palefox", "brack", "nim", "stray", "fenwick", "tarn"];
const rosterFor = (c) => {
  const n = Math.min(c.members, 7);
  const w = Array.from({ length: n }, (_, i) => 1 / (i + 1.6));
  const tot = w.reduce((a, b) => a + b, 0);
  return w.map((x, i) => ({
    name: ROSTER_NAMES[(c.id.charCodeAt(1) * 5 + i * 3) % ROSTER_NAMES.length],
    week: Math.round(c.base * x / tot),
  }));
};
const CHAT_LINES = [
  "who's doing the plank quest tonight",
  "cleared 50 pushups, that hard tag is a lie",
  "we're 4k off Nova, someone go for a run",
  "form tracker keeps docking me on rollouts lol",
  "new bands turned up, 35 kg is brutal",
  "payout hit this morning, nice work everyone",
];

const PERKS = [
  { t: "Ranked ladder", tier: 0 }, { t: "Daily quests", tier: 0 },
  { t: "Custom avatars", tier: 2 }, { t: "Advanced analytics", tier: 3 },
  { t: "Exclusive quests", tier: 4 }, { t: "Coin multiplier ×1.5", tier: 5 },
];
const CUES = ["Depth is good", "Keep your hips level", "Lock out at the top",
  "Slow the descent", "Elbows tucked in", "Full range, don't cut it"];

/* =========================== HELPERS =========================== */

const nf = (n) => Math.round(n).toLocaleString("en-AU");
const ord = (n) => { const s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
const rankOf = (xp) => {
  const t = Math.min(TIERS.length - 1, Math.floor(xp / XP_TIER));
  const rem = xp - t * XP_TIER;
  const d = Math.min(2, Math.floor(rem / XP_DIV));
  return { t, d, into: rem - d * XP_DIV, name: TIERS[t].name, div: DIVS[d], c: TIERS[t].c };
};
const nextRank = (xp) => {
  const at = (Math.floor(xp / XP_DIV) + 1) * XP_DIV;
  const r = rankOf(at);
  return { name: r.name, div: r.div, c: r.c, need: at - xp };
};
const levelOf = (xp) => Math.floor(xp / XP_LVL) + 1;
const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/* ========================= COMPONENTS ========================= */

function Emblem({ tier, div, size = 52 }) {
  const c = TIERS[tier].c;
  return (
    <svg width={size * 0.86} height={size} viewBox="0 0 86 100" aria-hidden="true">
      <polygon points="43,3 83,26 83,74 43,97 3,74 3,26" fill="none" stroke={c} strokeWidth="4" opacity=".45" />
      <polygon points="43,14 73,32 73,68 43,86 13,68 13,32" fill={c} opacity=".14" />
      {[0, 1, 2].map((i) => (
        <polygon key={i} fill={c} opacity={i <= 2 - div ? 1 : 0.16}
          points={`43,${33 + i * 15} 60,${45 + i * 15} 43,${40 + i * 15} 26,${45 + i * 15}`} />
      ))}
    </svg>
  );
}

function Ring({ pct, level, color }) {
  const R = 76, C = 2 * Math.PI * R;
  return (
    <div className="ring">
      <svg width="196" height="196" viewBox="0 0 196 196" aria-hidden="true">
        <defs>
          <linearGradient id="luRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4FD8FF" /><stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <circle cx="98" cy="98" r={R} fill="none" stroke="#141F38" strokeWidth="13" />
        <circle cx="98" cy="98" r={R} fill="none" stroke="url(#luRing)" strokeWidth="13" strokeLinecap="butt"
          strokeDasharray={C} strokeDashoffset={C * (1 - pct)} transform="rotate(-90 98 98)"
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1)" }} />
      </svg>
      <div className="ring-in">
        <div className="eyebrow">level</div>
        <div className="ring-lvl">{level}</div>
      </div>
    </div>
  );
}

const ART = {
  s1: (<g>
    <path d="M12 38h76a5 5 0 0 1 5 5v17a8 8 0 0 1-8 8H15a8 8 0 0 1-8-8V43a5 5 0 0 1 5-5z" fill="url(#luProd)" />
    <path d="M37 38v-5a6 6 0 0 1 6-6h14a6 6 0 0 1 6 6v5" /><path d="M7 52h86" />
    <path d="M40 44h20" opacity=".55" /><path d="M20 60h12" opacity=".35" /></g>),
  s2: (<g>
    <path d="M18 64V48a11 11 0 0 1 11-11h3a11 11 0 0 1 11 11v16" fill="url(#luProd)" />
    <path d="M57 64V48a11 11 0 0 1 11-11h3a11 11 0 0 1 11 11v16" fill="url(#luProd)" />
    <path d="M12 66h36M52 66h36" /><path d="M26 37h9M63 37h9" opacity=".45" /></g>),
  s3: (<g>
    <path d="M18 28c19 17 45 17 64 0" /><path d="M18 41c19 17 45 17 64 0" opacity=".7" />
    <path d="M18 54c19 17 45 17 64 0" opacity=".45" />
    <circle cx="15" cy="26" r="5" fill="url(#luProd)" /><circle cx="85" cy="26" r="5" fill="url(#luProd)" /></g>),
  s4: (<g>
    <circle cx="50" cy="44" r="19" fill="url(#luProd)" /><circle cx="50" cy="44" r="6" fill="url(#luProd)" />
    <path d="M31 44H21M69 44h10" />
    <rect x="7" y="37" width="14" height="14" rx="5" fill="url(#luProd)" />
    <rect x="79" y="37" width="14" height="14" rx="5" fill="url(#luProd)" /></g>),
  s5: (<g>
    <rect x="37" y="9" width="26" height="40" rx="4" fill="url(#luProd)" />
    <path d="M44 15h12" opacity=".55" /><path d="M50 49v9" />
    <circle cx="50" cy="59" r="3.5" fill="url(#luProd)" />
    <path d="M50 62 33 74M50 62l17 12M50 62v12" /></g>),
  s6: (<g>
    <path d="M22 30h56a14 14 0 0 1 0 28H22z" fill="url(#luProd)" />
    <ellipse cx="22" cy="44" rx="10" ry="14" fill="url(#luProd)" />
    <ellipse cx="22" cy="44" rx="3.5" ry="5" opacity=".6" /><path d="M62 30v28" opacity=".35" /></g>),
  s7: (<g>
    <path d="M36 30h28v29a8 8 0 0 1-8 8H44a8 8 0 0 1-8-8V30z" fill="url(#luProd)" />
    <rect x="33" y="18" width="34" height="12" rx="4" fill="url(#luProd)" />
    <path d="M44 11h12v7H44z" fill="url(#luProd)" />
    <path d="M36 45h28M36 54h28" opacity=".4" /></g>),
  s8: (<g>
    <path d="M39 18 21 27l6 13 9-4v33h28V36l9 4 6-13-18-9z" fill="url(#luProd)" />
    <path d="M39 18a11 11 0 0 0 22 0" /><path d="M58 55h8" opacity=".45" /></g>),
  s9: (<g>
    <rect x="32" y="14" width="36" height="10" rx="2" fill="url(#luProd)" />
    <path d="M33 24l-2 42h14l5-29 5 29h14l-2-42z" fill="url(#luProd)" />
    <path d="M32 33h36" opacity=".35" /></g>),
};
const ProdDefs = () => (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
    <defs>
      <linearGradient id="luProd" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%" stopColor="#4FD8FF" stopOpacity=".42" />
        <stop offset="55%" stopColor="#2B7BFF" stopOpacity=".20" />
        <stop offset="100%" stopColor="#2B7BFF" stopOpacity=".04" />
      </linearGradient>
    </defs>
  </svg>
);
const ProductArt = ({ id, photo }) => (
  photo ? <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    : <svg viewBox="0 0 100 80" fill="none" stroke="var(--cyan)" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ART[id]}</svg>
);

const Cut = ({ on, gold, onClick, children, style, pad = 14 }) => {
  const cls = `cutw${on ? " on" : ""}${gold ? " gold" : ""}`;
  const inner = <div className="cuti" style={{ padding: pad }}>{children}</div>;
  return onClick
    ? <button className={cls} style={style} onClick={onClick}>{inner}</button>
    : <div className={cls} style={style}>{inner}</div>;
};

/* side-view push-up figure driven by a 0–1 phase */
function Figure({ phase, station }) {
  const d = (1 - Math.cos(phase * Math.PI * 2)) / 2;             // 0 top, 1 bottom
  const sy = station === "squat" ? 30 : 34 + d * 15;              // shoulder y
  const sx = station === "squat" ? 50 : 42;
  const hipY = station === "squat" ? 44 + d * 16 : sy + 4;
  const hipX = station === "squat" ? 52 : 62;
  const headY = sy - 7, headX = station === "squat" ? sx : 35;
  const handX = 34, handY = 62;
  const elX = (sx + handX) / 2 + d * 7, elY = (sy + handY) / 2;
  const kneeX = station === "squat" ? 60 : 74, kneeY = station === "squat" ? 52 + d * 8 : hipY + 4;
  const footX = station === "squat" ? 50 : 86, footY = 66;
  const J = ({ x, y, r = 2.6 }) => <circle cx={x} cy={y} r={r} fill="var(--cyan)" />;
  return (
    <svg viewBox="0 0 100 80" width="100%" height="100%" aria-hidden="true"
      style={{ position: "absolute", inset: 0 }}>
      <g stroke="var(--cyan)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity=".95">
        <circle cx={headX} cy={headY} r="5.2" />
        <path d={`M${sx} ${sy} L${hipX} ${hipY} L${kneeX} ${kneeY} L${footX} ${footY}`} />
        {station === "squat"
          ? <path d={`M${sx} ${sy} L${sx - 12} ${sy + 2}`} />
          : <path d={`M${sx} ${sy} L${elX} ${elY} L${handX} ${handY}`} />}
      </g>
      <J x={sx} y={sy} /><J x={hipX} y={hipY} /><J x={kneeX} y={kneeY} />
      <J x={footX} y={footY} r="2.2" />
      {station !== "squat" && <><J x={elX} y={elY} /><J x={handX} y={handY} r="2.2" /></>}
      <rect x={Math.min(headX, footX) - 9} y={Math.min(headY, sy) - 10}
        width={Math.abs(footX - headX) + 18} height={footY - Math.min(headY, sy) + 18}
        fill="none" stroke="var(--cyan)" strokeWidth="0.8" strokeDasharray="4 4" opacity=".5" />
    </svg>
  );
}

const PATHS = {
  home: "M3 11l9-8 9 8M6 10v11h12V10",
  compete: "M5 21h14M8 21V9M12 21V4M16 21v-8",
  clans: "M9 11a4 4 0 100-8 4 4 0 000 8zM2 21c0-4 3-6 7-6s7 2 7 6M17 8a3 3 0 100-6M18 21c0-3-1-5-3-6",
};
const Icon = ({ n, c = "currentColor", s = 21 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.7"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={PATHS[n]} /></svg>
);

/* ============================ APP ============================ */

function LevelUpPrototype() {
  const [screen, setScreen] = useState("menu");
  const [p, setP] = useState({ handle: "Boral", xp: 19100, coins: 1240, streak: 12, week: 3120 });
  const [quests, setQuests] = useState(QUESTS0);
  const [claimedQ, setClaimedQ] = useState([]);
  const [loadout, setLoadout] = useState("full");
  const [sets, setSets] = useState([]);
  const [active, setActive] = useState(null);
  const [reps, setReps] = useState(0);
  const [pop, setPop] = useState(null);
  const [summary, setSummary] = useState(null);
  const [promo, setPromo] = useState(null);
  const [owned] = useState([]);
  const [redeemed] = useState([]);
  const [friends, setFriends] = useState(FRIENDS0);
  const [toast, setToast] = useState(null);
  const [rewardTab, setRewardTab] = useState("cards");
  const [shopTab, setShopTab] = useState("Kit");
  const [competeTab, setCompeteTab] = useState("friends");
  const [clanTab, setClanTab] = useState("clan");
  const [ringPct, setRingPct] = useState(0);
  const [sumXp, setSumXp] = useState(0);
  const [bag, setBag] = useState([]);
  const [openItem, setOpenItem] = useState(null);
  const [pdQty, setPdQty] = useState(1);
  const [query, setQuery] = useState("");
  /* tracker */
  const [track, setTrack] = useState(null);   // { station, reps, form[], secs, running, phase }
  /* clans */
  const [clans, setClans] = useState(CLANS0);
  const [clanId, setClanId] = useState(null);
  const [clanClaimed, setClanClaimed] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTag, setNewTag] = useState("");
  const [chat, setChat] = useState([]);
  const [unread, setUnread] = useState(0);
  const [draft, setDraft] = useState("");
  const popId = useRef(0);
  const chatEnd = useRef(null);

  const r = rankOf(p.xp), nxt = nextRank(p.xp), lvl = levelOf(p.xp);
  const sessionXp = sets.reduce((a, s) => a + s.xp, 0);
  const streakMult = 1 + Math.min(p.streak, 25) * 0.02;

  const qProgress = (q) => {
    const live = sets.filter((s) => s.ex === q.ex).reduce((a, s) => a + s.reps, 0);
    return Math.min(q.target, q.base + live);
  };
  const openQ = quests.filter((q) => qProgress(q) < q.target).length;
  const readyLoot = [...CARDS, ...CASH].filter((x) => p.coins >= x.coins && !redeemed.includes(x.id)).length;
  const onlineN = friends.filter((f) => f.on).length;

  const ladder = useMemo(() => (
    [...friends.map((f) => ({ ...f, me: false })), { name: p.handle, week: p.week, on: true, me: true }]
      .sort((a, b) => b.week - a.week)
  ), [friends, p.week, p.handle]);
  const myPos = ladder.findIndex((f) => f.me) + 1;

  const clanTotal = (c) => c.base + (c.id === clanId ? p.week : 0);
  const clanBoard = useMemo(() => (
    clans.map((c) => ({ ...c, total: clanTotal(c) })).sort((a, b) => b.total - a.total)
  ), [clans, clanId, p.week]);
  const myClan = clanBoard.find((c) => c.id === clanId) || null;
  const myClanPos = myClan ? clanBoard.findIndex((c) => c.id === clanId) + 1 : null;

  const globalPos = Math.max(11, Math.round(120000 / (1 + p.week / 900)));
  const nearby = [
    { name: "corvid_88", week: Math.round(p.week * 1.06), pos: globalPos - 2 },
    { name: "lyre.k", week: Math.round(p.week * 1.02), pos: globalPos - 1 },
    { name: p.handle, week: p.week, pos: globalPos, me: true },
    { name: "tenpin", week: Math.round(p.week * 0.97), pos: globalPos + 1 },
    { name: "arden_v", week: Math.round(p.week * 0.93), pos: globalPos + 2 },
  ];

  const bagCount = bag.reduce((a, b) => a + b.qty, 0);
  const bagTotal = bag.reduce((a, b) => a + itemOf(b.id).price * b.qty, 0);
  const bagCoins = bag.length && bag.every((b) => itemOf(b.id).coins)
    ? bag.reduce((a, b) => a + itemOf(b.id).coins * b.qty, 0) : null;

  const flash = (m) => { setToast(m); setTimeout(() => setToast(null), 2200); };

  /* ---- effects ---- */
  useEffect(() => {
    if (screen !== "rank") { setRingPct(0); return; }
    const id = setTimeout(() => setRingPct(r.into / XP_DIV), 200);
    return () => clearTimeout(id);
  }, [screen, r.into]);

  useEffect(() => {
    if (screen !== "summary" || !summary) return;
    setSumXp(summary.before);
    const id = setTimeout(() => setSumXp(summary.after), 420);
    return () => clearTimeout(id);
  }, [screen, summary]);

  /* tracker loop: advances the figure, counts a rep each cycle */
  useEffect(() => {
    if (!track || !track.running) return;
    const id = setInterval(() => {
      setTrack((t) => {
        if (!t || !t.running) return t;
        const step = 1 / 40;                       // 40 ticks per rep, 40ms each = 1.6s
        const ph = t.phase + step;
        if (ph >= 1) {
          const score = 79 + Math.floor(Math.random() * 21);
          return { ...t, phase: 0, reps: t.reps + 1, form: [...t.form, score],
            cue: CUES[Math.floor(Math.random() * CUES.length)], ticks: t.ticks + 1 };
        }
        return { ...t, phase: ph, ticks: t.ticks + 1 };
      });
    }, 40);
    return () => clearInterval(id);
  }, [track && track.running]);

  useEffect(() => {
    if (screen === "clans" && clanTab === "chat") {
      setUnread(0);
      chatEnd.current?.scrollIntoView({ block: "end" });
    }
  }, [screen, clanTab, chat.length]);

  /* ---- session ---- */
  const openStation = (id) => { if (active === id) { setActive(null); return; } setActive(id); setReps(EX[id].start); };

  const commitSet = (id, n, form) => {
    const xp = Math.round(n * EX[id].xp * (form / 100));
    setSets((s) => [...s, { ex: id, reps: n, form, xp }]);
    const k = ++popId.current;
    setPop({ k, xp });
    setTimeout(() => setPop((x) => (x && x.k === k ? null : x)), 1100);
  };

  const logManual = () => {
    if (!active || reps <= 0) return;
    commitSet(active, reps, 78 + Math.floor(Math.random() * 22));
    setActive(null);
  };

  const startTracker = (id) => {
    setTrack({ station: id, reps: 0, form: [], phase: 0, ticks: 0, running: true, cue: "Get in frame" });
    setScreen("tracker");
  };
  const saveTracked = () => {
    if (!track || !track.reps) { setTrack(null); setScreen("session"); return; }
    const avg = Math.round(track.form.reduce((a, b) => a + b, 0) / track.form.length);
    commitSet(track.station, track.reps, avg);
    setTrack(null); setActive(null); setScreen("session");
  };

  const endSession = () => {
    const boosted = Math.round(sessionXp * streakMult);
    const cleared = quests.filter((q) => qProgress(q) >= q.target && !claimedQ.includes(q.id));
    const bonusXp = cleared.reduce((a, q) => a + q.xp, 0);
    const bonusCoins = cleared.reduce((a, q) => a + q.coins, 0);
    const totalXp = boosted + bonusXp;
    const coins = Math.round(totalXp / 12) + bonusCoins;

    const by = {};
    sets.forEach((s) => {
      by[s.ex] = by[s.ex] || { ex: s.ex, sets: 0, reps: 0, xp: 0, form: 0 };
      by[s.ex].sets++; by[s.ex].reps += s.reps; by[s.ex].xp += s.xp; by[s.ex].form += s.form;
    });
    const rows = Object.values(by).map((v) => ({ ...v, form: Math.round(v.form / v.sets) })).sort((a, b) => b.xp - a.xp);
    const avgForm = sets.length ? Math.round(sets.reduce((a, s) => a + s.form, 0) / sets.length) : 0;
    const before = p.xp, after = before + totalXp;

    setSummary({ rows, base: sessionXp, mult: streakMult, cleared, bonusXp, bonusCoins, totalXp, coins, before, after, avgForm });
    setQuests((qs) => qs.map((q) => ({ ...q, base: qProgress(q) })));
    setClaimedQ((c) => [...c, ...cleared.map((q) => q.id)]);
    setP((v) => ({ ...v, xp: after, coins: v.coins + coins, week: v.week + totalXp }));
    const rb = rankOf(before), ra = rankOf(after);
    if (ra.t > rb.t || (ra.t === rb.t && ra.d > rb.d)) setPromo(ra);
    if (clanId) setChat((c) => [...c, { sys: true, text: `${p.handle} logged ${nf(totalXp)} XP for the clan` }]);
    setActive(null);
    setScreen("summary");
  };

  /* ---- store ----
     Redemption and checkout are intentionally not wired up here — this is a
     public preview, so no real coins, cards, or cash ever change hands. */
  const openProduct = (id) => { setOpenItem(id); setPdQty(1); setScreen("product"); };
  const addToBag = (id, qty) => {
    setBag((b) => {
      const at = b.find((x) => x.id === id);
      return at ? b.map((x) => (x.id === id ? { ...x, qty: x.qty + qty } : x)) : [...b, { id, qty }];
    });
    flash(`${itemOf(id).t} added to bag`);
  };
  const bumpQty = (id, d) => setBag((b) => b.map((x) => (x.id === id ? { ...x, qty: x.qty + d } : x)).filter((x) => x.qty > 0));

  /* ---- social ---- */
  const addFriend = (s) => { setFriends((f) => [...f, s]); flash(`${s.name} added`); };
  const seedChat = (c) => {
    const roster = rosterFor(c);
    const msgs = CHAT_LINES.slice(0, 4).map((text, i) => ({
      who: roster[i % roster.length].name, text, time: `${(4 - i) * 11}m`,
    }));
    msgs.push({ sys: true, text: `You joined ${c.name}` });
    setChat(msgs);
    setUnread(4);
  };
  const joinClan = (c) => {
    setClanId(c.id); setClanClaimed(false); setCreating(false); setClanTab("clan");
    seedChat(c); flash(`Joined ${c.name}`);
  };
  const leaveClan = () => {
    const n = myClan?.name;
    if (myClan?.own) setClans((cs) => cs.filter((c) => c.id !== clanId));
    setClanId(null); setClanClaimed(false); setChat([]); setUnread(0);
    flash(`Left ${n}`);
  };
  const createClan = () => {
    const name = newName.trim(), tag = newTag.trim().toUpperCase();
    if (name.length < 3 || tag.length < 2) return;
    const c = { id: `own${Date.now()}`, tag: tag.slice(0, 4), name, members: 1, base: 0, last: null, own: true };
    setClans((cs) => [...cs, c]);
    setClanId(c.id); setClanClaimed(false); setCreating(false); setClanTab("clan");
    setChat([{ sys: true, text: `You founded ${name}. Invite people from Friends.` }]);
    setUnread(0); setNewName(""); setNewTag("");
    flash(`${name} created`);
  };
  const claimPayout = () => {
    if (!myClan || !myClan.last || clanClaimed) return;
    const rw = rewardFor(myClan.last);
    const before = p.xp, after = before + rw.xp;
    setP((v) => ({ ...v, xp: after, coins: v.coins + rw.coins }));
    setClanClaimed(true);
    const rb = rankOf(before), ra = rankOf(after);
    if (ra.t > rb.t || (ra.t === rb.t && ra.d > rb.d)) setPromo(ra);
    flash(`Payout claimed · +${nf(rw.xp)} XP, ◆ ${nf(rw.coins)}`);
  };
  const sendMsg = () => {
    const t = draft.trim();
    if (!t) return;
    setChat((c) => [...c, { who: p.handle, text: t, time: "now", mine: true }]);
    setDraft("");
  };

  /* ============================ SCREENS ============================ */

  const MENU = [
    { k: "quests",  n: "Train",   m: openQ ? `${openQ} quest${openQ > 1 ? "s" : ""} open today` : "all quests cleared", b: openQ },
    { k: "clans",   n: "Clans",   m: myClan ? `${myClan.tag} · ${ord(myClanPos)} of ${clanBoard.length}` : "not in a clan", b: unread },
    { k: "compete", n: "Compete", m: `${ord(myPos)} of ${ladder.length} friends · ${nf(globalPos)} global` },
    { k: "rank",    n: "Rank",    m: `${nf(nxt.need)} xp to ${nxt.name} ${nxt.div}` },
    { k: "rewards", n: "Rewards", m: `${nf(p.coins)} coins ready`, b: readyLoot },
    { k: "shop",    n: "Shop",    m: bagCount ? `${bagCount} in your bag` : "kit and apparel", b: bagCount },
    { k: "friends", n: "Friends", m: `${onlineN} of ${friends.length} online` },
  ];

  const menuView = (
    <div className="mainmenu">
      <div className="reveal" style={{ animationDelay: "40ms", marginBottom: 16 }}>
        <h1 className="wm">Level<em>up</em></h1>
        <div className="tagline">Train · Rank · Cash out</div>
        <div style={{ marginTop: 10 }}>
          <span className="chip" style={{ color: "var(--gold)" }}>Interactive preview · resets on refresh</span>
        </div>
      </div>

      <div className="reveal" style={{ animationDelay: "130ms", marginBottom: 16 }}>
        <Cut>
          <div className="opcard">
            <Emblem tier={r.t} div={r.d} size={54} />
            <div>
              <div className="hname">{p.handle}</div>
              <div className="hsub" style={{ color: r.c }}>{r.name} {r.div} · LVL {lvl}</div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div className="streak-n">{p.streak}</div>
              <div className="eyebrow">day streak</div>
            </div>
          </div>
          <div className="bar-lbl"><span>rank progress</span><span>{nf(r.into)} / {XP_DIV} XP</span></div>
          <div className="bar"><i style={{ width: `${(r.into / XP_DIV) * 100}%`, background: `linear-gradient(90deg,var(--cyan),${r.c})` }} /></div>
        </Cut>
      </div>

      <div style={{ marginTop: "auto" }}>
        {MENU.map((it, i) => (
          <div className="reveal" key={it.k} style={{ animationDelay: `${210 + i * 60}ms`, marginBottom: 9 }}>
            <Cut onClick={() => setScreen(it.k)}>
              <div className="mrow">
                <span className="mbar" />
                <div>
                  <div className="mlbl">{it.n}</div>
                  <div className="mmeta">{it.m}</div>
                </div>
                <div className="mflag">
                  {it.b ? <span className="badge">{it.b}</span> : null}
                  <span className="marrow">▸</span>
                </div>
              </div>
            </Cut>
          </div>
        ))}
      </div>

      <div className="reveal" style={{ animationDelay: "660ms", display: "flex", justifyContent: "space-between",
        marginTop: 16, fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".16em",
        textTransform: "uppercase", color: "var(--dim)" }}>
        <span style={{ color: "var(--mint)" }}>● Kit paired · tripod ready</span>
        <span>Season 1 · 0.4</span>
      </div>
    </div>
  );

  const questsView = (
    <div className="body">
      <div className="sect">
        <div className="sect-hd"><span className="eyebrow">resets in 9h 12m</span><div className="rule" /></div>
        {quests.map((q) => {
          const pr = qProgress(q), done = pr >= q.target;
          return (
            <div className="q" key={q.id} data-done={done ? 1 : 0}>
              <div className="box">{done ? "✓" : ""}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span className="q-t">{q.label}</span>
                  <span className="chip" style={{ color: DIFF_C[q.diff] }}>{q.diff}</span>
                </div>
                <div className="q-r">
                  <span style={{ color: "var(--cyan)" }}>{q.xp} XP</span>
                  <span style={{ color: "var(--dim)" }}> · </span>
                  <span style={{ color: "var(--gold)" }}>◆ {q.coins}</span>
                  <span style={{ color: "var(--dim)" }}> · {nf(pr)}/{nf(q.target)}</span>
                </div>
                <div className="bar" style={{ marginTop: 8, height: 5 }}>
                  <i style={{ width: `${(pr / q.target) * 100}%`, background: done ? "var(--mint)" : DIFF_C[q.diff] }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sect">
        <div className="sect-hd"><span className="eyebrow">loadout</span><div className="rule" /></div>
        <div className="grid">
          {LOADOUTS.map((l) => (
            <Cut key={l.id} on={loadout === l.id} pad={13} onClick={() => setLoadout(l.id)} style={{ marginTop: 0 }}>
              <div className="mlbl" style={{ fontSize: 13, color: loadout === l.id ? "var(--cyan)" : "var(--ice)" }}>{l.name}</div>
              <div className="mmeta">{l.desc}</div>
            </Cut>
          ))}
        </div>
      </div>

      <button className="cta" onClick={() => { setSets([]); setScreen("session"); }}>Start session</button>
      <p className="mono" style={{ fontSize: 10, color: "var(--dim)", textAlign: "center", marginTop: 11, letterSpacing: ".08em" }}>
        Streak multiplier ×{streakMult.toFixed(2)} applies at session end
      </p>
    </div>
  );

  const sessionView = (
    <div className="body">
      <div className="sect-hd" style={{ marginBottom: 14 }}>
        <span className="eyebrow">session live</span><div className="rule" />
        <span className="mono" style={{ fontSize: 12.5, color: "var(--cyan)" }}>{nf(sessionXp)} XP</span>
      </div>

      {LOADOUTS.find((l) => l.id === loadout).ex.map((id) => {
        const e = EX[id], done = sets.filter((s) => s.ex === id), on = active === id;
        const unitWord = e.unit === "sec" ? "sec" : e.unit === "m" ? "metre" : "rep";
        return (
          <div key={id}>
            <button className="ex" data-on={on ? 1 : 0} onClick={() => openStation(id)} aria-expanded={on}>
              <div>
                <div className="ex-n">{e.name}</div>
                <div className="ex-k">{e.kit} · {e.xp} XP / {unitWord}</div>
              </div>
              <div className="ex-x">
                {done.length ? `${done.length} set${done.length > 1 ? "s" : ""} · ${nf(done.reduce((a, s) => a + s.xp, 0))} XP` : "—"}
              </div>
            </button>

            {on && (
              <div style={{ padding: "2px 0 13px" }}>
                {e.cam && (
                  <>
                    <button className="cta" style={{ padding: 14, fontSize: 14 }} onClick={() => startTracker(id)}>
                      ▶ Track with camera
                    </button>
                    <div style={{ height: 9 }} />
                  </>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                  <div className="stepper">
                    <button onClick={() => setReps((v) => Math.max(0, v - e.step))} aria-label="Fewer">−</button>
                    <span>{nf(reps)}</span>
                    <button onClick={() => setReps((v) => v + e.step)} aria-label="More">+</button>
                  </div>
                  <button className="ghost" style={{ flex: 1, padding: 15 }} onClick={logManual} disabled={reps <= 0}>
                    Log {e.unit} manually
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: 18 }}>
        <button className="cta" onClick={endSession} disabled={!sets.length}>
          {sets.length ? `End session · ${sets.length} set${sets.length > 1 ? "s" : ""}` : "Log a set to finish"}
        </button>
        <div style={{ height: 9 }} />
        <button className="ghost" onClick={() => { setSets([]); setActive(null); setScreen("quests"); }}>Abandon</button>
      </div>
    </div>
  );

  const trackerView = track && (() => {
    const e = EX[track.station];
    const secs = Math.floor(track.ticks * 40 / 1000);
    const live = track.form.length ? track.form[track.form.length - 1] : 0;
    const avg = track.form.length ? Math.round(track.form.reduce((a, b) => a + b, 0) / track.form.length) : 0;
    return (
      <div className="body">
        <div className="cam">
          <div className="cam-grid" />
          <span className="brk tl" /><span className="brk tr" /><span className="brk bl" /><span className="brk br" />
          {track.running && <div className="rec"><i />REC</div>}
          <div className="camtime">{mmss(secs)}</div>
          <Figure phase={track.phase} station={track.station} />
          <div className="cue">{track.cue}</div>
          <div className="camhud">
            <div>
              <div className="eyebrow">{e.name}</div>
              <div className="repbig">{track.reps}</div>
            </div>
            <div className="formring">
              <div className="eyebrow">form</div>
              <div className="dsp" style={{ fontSize: 26, color: live >= 90 ? "var(--mint)" : live >= 82 ? "var(--cyan)" : "var(--gold)" }}>
                {live || "—"}{live ? "%" : ""}
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ margin: "14px 0" }}>
          <div className="stat"><span>Reps counted</span><span>{track.reps}</span></div>
          <div className="stat"><span>Average form</span><span>{avg ? `${avg}%` : "—"}</span></div>
          <div className="stat"><span>XP if you stop now</span>
            <span style={{ color: "var(--cyan)" }}>{nf(track.reps * e.xp * (avg || 0) / 100)}</span></div>
        </div>

        <button className="cta" onClick={() => setTrack((t) => ({ ...t, running: !t.running }))}>
          {track.running ? "❚❚ Pause tracking" : "▶ Resume tracking"}
        </button>
        <div style={{ height: 9 }} />
        <button className="ghost" onClick={saveTracked} disabled={!track.reps}>
          {track.reps ? `Save set · ${track.reps} ${e.unit}` : "No reps counted yet"}
        </button>
        <div style={{ height: 9 }} />
        <button className="ghost" onClick={() => { setTrack(null); setScreen("session"); }}>Discard</button>

        <p className="mono" style={{ fontSize: 9.5, color: "var(--dim)", marginTop: 16, lineHeight: 1.8, letterSpacing: ".05em" }}>
          Simulated capture for this prototype. In the product the phone camera drives the skeleton and the form score.
        </p>
      </div>
    );
  })();

  const summaryView = summary && (() => {
    const rr = rankOf(sumXp);
    return (
      <div className="body">
        <div className="sect-hd"><span className="eyebrow">session complete</span><div className="rule" /></div>
        <div style={{ textAlign: "center", padding: "14px 0" }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>experience earned</div>
          <div className="big">{nf(summary.totalXp)}</div>
          <div className="mono" style={{ color: "var(--gold)", fontSize: 14, marginTop: 11 }}>◆ +{nf(summary.coins)} coins</div>
        </div>

        <div className="card" style={{ marginBottom: 18 }}>
          <div className="bar-lbl"><span style={{ color: rr.c }}>{rr.name} {rr.div}</span><span>{nf(rr.into)} / {XP_DIV}</span></div>
          <div className="bar"><i style={{ width: `${(rr.into / XP_DIV) * 100}%`, background: `linear-gradient(90deg,var(--cyan),${rr.c})` }} /></div>
        </div>

        <div className="sect">
          <div className="sect-hd"><span className="eyebrow">scoreboard</span><div className="rule" /></div>
          <table className="sb">
            <thead><tr><th>Station</th><th>Sets</th><th>Volume</th><th>Form</th><th>XP</th></tr></thead>
            <tbody>
              {summary.rows.map((row, i) => (
                <tr key={row.ex} className={i === 0 ? "mvp" : ""}>
                  <td className={i === 0 ? "mvp" : ""}>{EX[row.ex].name}{i === 0 ? " ★" : ""}</td>
                  <td>{row.sets}</td>
                  <td>{nf(row.reps)}{EX[row.ex].unit === "sec" ? "s" : EX[row.ex].unit === "m" ? "m" : ""}</td>
                  <td>{row.form}%</td>
                  <td>{nf(row.xp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sect">
          <div className="sect-hd"><span className="eyebrow">breakdown</span><div className="rule" /></div>
          <div className="card">
            <div className="stat"><span>Base XP</span><span>{nf(summary.base)}</span></div>
            <div className="stat"><span>Streak multiplier</span><span style={{ color: "var(--gold)" }}>×{summary.mult.toFixed(2)}</span></div>
            <div className="stat"><span>Quests cleared</span>
              <span style={{ color: summary.cleared.length ? "var(--mint)" : "var(--dim)" }}>
                {summary.cleared.length ? `${summary.cleared.length} · +${nf(summary.bonusXp)} XP` : "none"}</span></div>
            <div className="stat"><span>Average form</span><span>{summary.avgForm}%</span></div>
          </div>
        </div>

        <button className="cta" onClick={() => { setSets([]); setSummary(null); setScreen("menu"); }}>Back to menu</button>
      </div>
    );
  })();

  const rewardsView = (
    <div className="body">
      <div className="tabs2">
        <button data-on={rewardTab === "cards" ? 1 : 0} onClick={() => setRewardTab("cards")}>Game cards</button>
        <button data-on={rewardTab === "cash" ? 1 : 0} onClick={() => setRewardTab("cash")}>Cash out</button>
      </div>
      {(rewardTab === "cards" ? CARDS : CASH).map((x) => {
        const got = redeemed.includes(x.id), can = p.coins >= x.coins && !got;
        return (
          <div className="row" key={x.id}>
            <div className="mark">{x.k}</div>
            <div style={{ minWidth: 0 }}>
              <div className="row-t">{x.t}</div>
              <div className="row-d">{x.v}</div>
            </div>
            <button className="buy" data-can={can ? 1 : 0} data-got={got ? 1 : 0}
              disabled title={can ? "Preview only — not redeemable here" : `Need ${nf(x.coins - p.coins)} more coins`}>
              {can ? `◆ ${nf(x.coins)}` : `Need ${nf(x.coins - p.coins)}`}
            </button>
          </div>
        );
      })}
      <p className="mono" style={{ fontSize: 10, color: "var(--dim)", marginTop: 16, lineHeight: 1.8, letterSpacing: ".05em" }}>
        Preview only — this demo doesn't send real codes or cash. In the full app, redemptions are fulfilled within the hour.
      </p>
    </div>
  );

  const rankView = (
    <div className="body">
      <div className="ring-wrap">
        <Ring pct={ringPct} level={lvl} color={r.c} />
        <div className="dsp" style={{ fontSize: 21, color: r.c, marginTop: 17 }}>{r.name} {r.div}</div>
        <div className="mono" style={{ fontSize: 10.5, color: "var(--dim)", marginTop: 9, letterSpacing: ".12em" }}>
          NEXT · {nxt.name} {nxt.div} · {nf(nxt.need)} XP TO GO
        </div>
      </div>
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="stat"><span>Total XP</span><span style={{ color: "var(--cyan)" }}>{nf(p.xp)}</span></div>
        <div className="stat"><span>XP this week</span><span>{nf(p.week)}</span></div>
        <div className="stat"><span>Next level at</span><span>{nf(lvl * XP_LVL)} XP</span></div>
        <div className="stat"><span>Global position</span><span>{nf(globalPos)}</span></div>
      </div>
      <div className="sect-hd"><span className="eyebrow">tier perks</span><div className="rule" /></div>
      <div className="card">
        {PERKS.map((pk) => (
          <div className="perk" key={pk.t} data-on={r.t >= pk.tier ? 1 : 0}>
            <div className="tick">{r.t >= pk.tier ? "✓" : ""}</div>
            <span style={{ flex: 1 }}>{pk.t}</span>
            {r.t < pk.tier && <span className="pill">{TIERS[pk.tier].name}</span>}
          </div>
        ))}
      </div>
    </div>
  );

  const competeView = (
    <div className="body">
      <div className="tabs2">
        <button data-on={competeTab === "friends" ? 1 : 0} onClick={() => setCompeteTab("friends")}>Friends</button>
        <button data-on={competeTab === "global" ? 1 : 0} onClick={() => setCompeteTab("global")}>Global</button>
      </div>

      {competeTab === "friends" ? (
        <>
          <div className="sect-hd"><span className="eyebrow">week 12 · resets monday</span><div className="rule" /></div>
          {ladder.map((f, i) => (
            <div className="fr" key={f.name} data-me={f.me ? 1 : 0}>
              <div className="pos" style={{ color: f.me ? "var(--cyan)" : undefined }}>{i + 1}</div>
              <div className="av" style={{ color: f.me ? "var(--cyan)" : "var(--dim)" }}>{f.name[0].toUpperCase()}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{f.name}</div>
                <div className="ex-k">{rankOf(f.me ? p.xp : 9000 + f.week).name}</div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div className="mono" style={{ fontSize: 12.5 }}>{nf(f.week)} XP</div>
                {i === 0 && <div className="crown">leader</div>}
              </div>
            </div>
          ))}
          <p className="mono" style={{ fontSize: 10, color: "var(--dim)", marginTop: 16, lineHeight: 1.8, letterSpacing: ".05em" }}>
            Top three keep a placement badge for the following week.
          </p>
        </>
      ) : (
        <>
          <div className="sect-hd"><span className="eyebrow">top 10 worldwide</span><div className="rule" /></div>
          {GLOBAL_TOP.map((g, i) => (
            <div className="fr" key={g.name}>
              <div className="pos" style={i < 3 ? { color: "var(--gold)" } : undefined}>{i + 1}</div>
              <div className="av" style={{ color: "var(--dim)" }}>{g.name[0].toUpperCase()}</div>
              <div style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{g.name}</div>
                  <div className="ex-k">{rankOf(20000 + g.week).name}</div>
                </div>
                <span className="cc">{g.cc}</span>
              </div>
              <div className="mono" style={{ marginLeft: "auto", fontSize: 12.5 }}>{nf(g.week)} XP</div>
            </div>
          ))}
          <div className="sect-hd" style={{ marginTop: 20 }}><span className="eyebrow">around you</span><div className="rule" /></div>
          {nearby.map((n) => (
            <div className="fr" key={n.name} data-me={n.me ? 1 : 0}>
              <div className="pos mono" style={{ width: 54, fontSize: 11, color: n.me ? "var(--cyan)" : "var(--dim)" }}>{nf(n.pos)}</div>
              <div className="av" style={{ color: n.me ? "var(--cyan)" : "var(--dim)" }}>{n.name[0].toUpperCase()}</div>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{n.name}</div>
              <div className="mono" style={{ marginLeft: "auto", fontSize: 12.5 }}>{nf(n.week)} XP</div>
            </div>
          ))}
          <p className="mono" style={{ fontSize: 10, color: "var(--dim)", marginTop: 16, lineHeight: 1.8, letterSpacing: ".05em" }}>
            You are {nf(globalPos)} of {nf(GLOBAL_PLAYERS)} players this week.
          </p>
        </>
      )}
    </div>
  );

  /* ---- clans ---- */
  const clanLadder = (
    <>
      <div className="sect-hd"><span className="eyebrow">clan ladder · week 12</span><div className="rule" /></div>
      {clanBoard.map((c, i) => (
        <div className="fr" key={c.id} data-me={c.id === clanId ? 1 : 0}>
          <div className="pos" style={i < 3 ? { color: "var(--gold)" } : undefined}>{i + 1}</div>
          <div className="clantag" style={{ width: 37, height: 37, fontSize: 9.5 }}>{c.tag}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>{c.name}</div>
            <div className="ex-k">{c.members} member{c.members > 1 ? "s" : ""} · {nf(c.total)} XP</div>
          </div>
          <div style={{ marginLeft: "auto", flexShrink: 0 }}>
            {c.id === clanId
              ? <span className="pill" style={{ color: "var(--cyan)", borderColor: "var(--cyan)" }}>Yours</span>
              : clanId ? null
              : <button className="buy" data-can="1" onClick={() => joinClan(c)}>Join</button>}
          </div>
        </div>
      ))}

      <div className="sect-hd" style={{ marginTop: 22 }}><span className="eyebrow">weekly payout by place</span><div className="rule" /></div>
      <div className="card">
        {CLAN_REWARDS.map((t) => (
          <div className="spec" key={t.place}>
            <b style={{ color: myClanPos && myClanPos >= t.from && myClanPos <= t.to ? "var(--cyan)" : undefined }}>{t.place}</b>
            <span>
              <span style={{ color: "var(--cyan)" }}>+{nf(t.xp)} XP</span>
              <span style={{ color: "var(--dim)" }}> · </span>
              <span style={{ color: "var(--gold)" }}>◆ {nf(t.coins)}</span>
            </span>
          </div>
        ))}
      </div>
      <p className="mono" style={{ fontSize: 10, color: "var(--dim)", marginTop: 14, lineHeight: 1.8, letterSpacing: ".05em" }}>
        Every member receives the full payout, not a split of it.
      </p>
    </>
  );

  const clanHome = myClan && (() => {
    const roster = myClan.own
      ? [{ name: p.handle, week: p.week, me: true }]
      : [...rosterFor(myClan), { name: p.handle, week: p.week, me: true }].sort((a, b) => b.week - a.week);
    const top = Math.max(1, roster[0].week);
    return (
      <>
        {myClan.last && !clanClaimed && (
          <div className="payout">
            <div className="eyebrow" style={{ color: "var(--gold)" }}>week 11 payout</div>
            <div className="dsp" style={{ fontSize: 15, margin: "9px 0 6px" }}>
              {myClan.name} finished {ord(myClan.last)}
            </div>
            <div className="mono" style={{ fontSize: 12 }}>
              <span style={{ color: "var(--cyan)" }}>+{nf(rewardFor(myClan.last).xp)} XP</span>
              <span style={{ color: "var(--dim)" }}> · </span>
              <span style={{ color: "var(--gold)" }}>◆ {nf(rewardFor(myClan.last).coins)}</span>
            </div>
            <button className="cta" style={{ marginTop: 12, padding: 13, fontSize: 13 }} onClick={claimPayout}>Claim payout</button>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "4px 0 18px" }}>
          <div className="clantag lg">{myClan.tag}</div>
          <div className="dsp" style={{ fontSize: 19, marginTop: 14, textAlign: "center" }}>{myClan.name}</div>
          <div className="mono" style={{ fontSize: 10.5, color: "var(--dim)", marginTop: 8, letterSpacing: ".12em" }}>
            {ord(myClanPos)} OF {clanBoard.length} · WEEK 12
          </div>
        </div>

        <div className="card" style={{ marginBottom: 18 }}>
          <div className="stat"><span>Clan XP this week</span><span style={{ color: "var(--cyan)" }}>{nf(myClan.total)}</span></div>
          <div className="stat"><span>Your contribution</span><span>{nf(p.week)} XP</span></div>
          <div className="stat"><span>Members</span><span>{myClan.members}</span></div>
          <div className="stat"><span>Last week</span>
            <span style={{ color: myClan.last ? "var(--gold)" : "var(--dim)" }}>
              {myClan.last ? `${ord(myClan.last)} place` : "first season"}</span></div>
          <div className="stat"><span>If the week ended now</span>
            <span style={{ color: "var(--mint)" }}>
              +{nf(rewardFor(myClanPos).xp)} XP · ◆ {nf(rewardFor(myClanPos).coins)}</span></div>
        </div>

        <div className="sect-hd">
          <span className="eyebrow">roster{myClan.members > roster.length ? ` · top ${roster.length} of ${myClan.members}` : ""}</span>
          <div className="rule" />
        </div>
        {roster.map((m, i) => (
          <div className="fr" key={m.name} data-me={m.me ? 1 : 0}>
            <div className="pos" style={{ color: m.me ? "var(--cyan)" : undefined }}>{i + 1}</div>
            <div className="av" style={{ color: m.me ? "var(--cyan)" : "var(--dim)" }}>{m.name[0].toUpperCase()}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{m.name}{i === 0 ? " ★" : ""}</div>
              <div className="contrib"><i style={{ width: `${(m.week / top) * 100}%` }} /></div>
            </div>
            <div className="mono" style={{ fontSize: 12, flexShrink: 0 }}>{nf(m.week)}</div>
          </div>
        ))}

        <div style={{ height: 22 }} />
        <button className="ghost" onClick={leaveClan}>Leave clan</button>
      </>
    );
  })();

  const chatView = (
    <>
      <div className="chatbox">
        {chat.map((m, i) => m.sys ? (
          <div className="sysmsg" key={i}>— {m.text} —</div>
        ) : (
          <div className="msg" key={i} data-mine={m.mine ? 1 : 0}>
            <div className="av" style={{ color: m.mine ? "var(--cyan)" : "var(--dim)" }}>{m.who[0].toUpperCase()}</div>
            <div className="mcol">
              <div className="msg-hd">{m.who} · {m.time}</div>
              <div className="bub">{m.text}</div>
            </div>
          </div>
        ))}
        <div ref={chatEnd} />
      </div>
      <div className="composer">
        <input className="inp" placeholder="Message your clan" value={draft} maxLength={180}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") sendMsg(); }} />
        <button className="send" onClick={sendMsg} disabled={!draft.trim()} aria-label="Send">➤</button>
      </div>
      <p className="mono" style={{ fontSize: 9.5, color: "var(--dim)", marginTop: 12, lineHeight: 1.8, letterSpacing: ".05em" }}>
        Session results post here automatically so the clan can see who's pulling weight.
      </p>
    </>
  );

  const clansView = (
    <div className="body">
      {myClan ? (
        <>
          <div className="tabs2">
            <button data-on={clanTab === "clan" ? 1 : 0} onClick={() => setClanTab("clan")}>Clan</button>
            <button data-on={clanTab === "chat" ? 1 : 0} onClick={() => setClanTab("chat")}>
              Chat{unread ? <span className="dotb">{unread}</span> : null}
            </button>
            <button data-on={clanTab === "ladder" ? 1 : 0} onClick={() => setClanTab("ladder")}>Ladder</button>
          </div>
          {clanTab === "clan" && clanHome}
          {clanTab === "chat" && chatView}
          {clanTab === "ladder" && clanLadder}
        </>
      ) : (
        <>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="dsp" style={{ fontSize: 14 }}>You're not in a clan</div>
            <p className="mono" style={{ fontSize: 10.5, color: "var(--dim)", lineHeight: 1.8, margin: "9px 0 13px" }}>
              Clans pool everyone's weekly XP. The higher the clan finishes, the bigger the payout for every member.
            </p>
            {creating ? (
              <>
                <input className="inp" placeholder="Clan name" value={newName} maxLength={22}
                  onChange={(e) => setNewName(e.target.value)} />
                <div style={{ height: 8 }} />
                <input className="inp tagin" placeholder="TAG" value={newTag} maxLength={4}
                  onChange={(e) => setNewTag(e.target.value.toUpperCase())} />
                <div style={{ height: 10 }} />
                <button className="cta" style={{ padding: 13, fontSize: 13 }}
                  disabled={newName.trim().length < 3 || newTag.trim().length < 2} onClick={createClan}>
                  {newName.trim().length < 3 ? "Name needs 3 letters"
                    : newTag.trim().length < 2 ? "Tag needs 2 letters" : "Create clan"}
                </button>
                <div style={{ height: 8 }} />
                <button className="ghost" onClick={() => setCreating(false)}>Cancel</button>
              </>
            ) : (
              <button className="cta" style={{ padding: 13, fontSize: 13 }} onClick={() => setCreating(true)}>Create a clan</button>
            )}
          </div>
          {clanLadder}
        </>
      )}
    </div>
  );

  /* ---- store ---- */
  const shopView = (
    <div className="body">
      <div className="tabs2">
        {Object.keys(SHOP).map((k) => (
          <button key={k} data-on={shopTab === k ? 1 : 0} onClick={() => setShopTab(k)}>{k}</button>
        ))}
      </div>
      <div className="grid">
        {SHOP[shopTab].map((it) => {
          const got = owned.includes(it.id), inBag = bag.find((b) => b.id === it.id);
          return (
            <button className="prod" key={it.id} onClick={() => openProduct(it.id)}>
              <div className="prod-img">
                <span className="tagpill" style={
                  got ? { color: "var(--mint)", borderColor: "var(--mint)" }
                    : inBag ? { color: "var(--cyan)", borderColor: "var(--cyan)" } : undefined}>
                  {got ? "Ordered" : inBag ? `In bag · ${inBag.qty}` : it.coins ? "Coins ok" : "Card only"}
                </span>
                <ProductArt id={it.id} photo={it.photo} />
              </div>
              <div className="prod-b">
                <div className="prod-t">{it.t}</div>
                <div className="prod-d">{it.tag}</div>
                <div className="prod-p">
                  ${it.price}
                  {it.coins ? <span style={{ color: "var(--dim)" }}> · <span style={{ color: "var(--gold)" }}>◆ {nf(it.coins)}</span></span> : null}
                </div>
                <span className="mono" style={{ fontSize: 9, color: "var(--cyan)", letterSpacing: ".14em", textTransform: "uppercase" }}>
                  View details →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const productView = openItem && (() => {
    const it = itemOf(openItem);
    const inBag = bag.find((b) => b.id === it.id);
    return (
      <div className="body">
        <div className="hero-img"><ProductArt id={it.id} photo={it.photo} /></div>
        <div className="pd-t">{it.t}</div>
        <div className="pd-tag">{it.tag}</div>
        <div className="pd-price">
          <span className="amt">${it.price}</span>
          {it.coins
            ? <span className="mono" style={{ fontSize: 13, color: "var(--gold)" }}>or ◆ {nf(it.coins)}</span>
            : <span className="mono" style={{ fontSize: 11, color: "var(--dim)" }}>card only</span>}
          {inBag && <span className="pill" style={{ marginLeft: "auto", color: "var(--cyan)", borderColor: "var(--cyan)" }}>{inBag.qty} in bag</span>}
        </div>
        <p className="pd-body" style={{ margin: "0 0 20px" }}>{it.long}</p>

        <div className="sect">
          <div className="sect-hd"><span className="eyebrow">what you get</span><div className="rule" /></div>
          <div className="card">{it.feat.map((f) => <div className="feat" key={f}><i>✓</i><span>{f}</span></div>)}</div>
        </div>
        <div className="sect">
          <div className="sect-hd"><span className="eyebrow">specifications</span><div className="rule" /></div>
          <div className="card">{it.spec.map(([k, v]) => <div className="spec" key={k}><b>{k}</b><span>{v}</span></div>)}</div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div className="qty">
            <button onClick={() => setPdQty((q) => Math.max(1, q - 1))} aria-label="Fewer">−</button>
            <span>{pdQty}</span>
            <button onClick={() => setPdQty((q) => Math.min(9, q + 1))} aria-label="More">+</button>
          </div>
          <button className="cta" style={{ flex: 1, fontSize: 14 }} onClick={() => { addToBag(it.id, pdQty); setPdQty(1); }}>
            Add to bag · ${it.price * pdQty}
          </button>
        </div>
        <div style={{ height: 9 }} />
        <button className="ghost" onClick={() => setScreen("bag")}>{bagCount ? `Go to bag · ${bagCount}` : "Bag is empty"}</button>
      </div>
    );
  })();

  const bagView = (
    <div className="body">
      {!bag.length ? (
        <div className="empty">
          <div className="dsp" style={{ fontSize: 15 }}>Your bag is empty</div>
          <p>Coins from your sessions cover most of the kit.</p>
          <button className="cta" style={{ marginTop: 18 }} onClick={() => setScreen("shop")}>Browse the shop</button>
        </div>
      ) : (
        <>
          <div className="sect-hd"><span className="eyebrow">{bagCount} item{bagCount > 1 ? "s" : ""}</span><div className="rule" /></div>
          {bag.map((b) => {
            const it = itemOf(b.id);
            return (
              <div className="bl" key={b.id}>
                <div className="bl-img"><ProductArt id={it.id} photo={it.photo} /></div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="row-t">{it.t}</div>
                  <div className="mono" style={{ fontSize: 11.5, marginTop: 5 }}>
                    ${it.price * b.qty}
                    {it.coins ? <span style={{ color: "var(--gold)" }}> · ◆ {nf(it.coins * b.qty)}</span> : null}
                  </div>
                  <button className="rm" style={{ marginTop: 7 }} onClick={() => setBag((x) => x.filter((y) => y.id !== b.id))}>Remove</button>
                </div>
                <div className="qty sm">
                  <button onClick={() => bumpQty(b.id, -1)} aria-label="Fewer">−</button>
                  <span>{b.qty}</span>
                  <button onClick={() => bumpQty(b.id, 1)} aria-label="More">+</button>
                </div>
              </div>
            );
          })}
          <div className="card" style={{ margin: "16px 0" }}>
            <div className="stat"><span>Subtotal</span><span>${bagTotal}</span></div>
            <div className="stat"><span>Shipping</span><span style={{ color: "var(--mint)" }}>Free over $80</span></div>
            <div className="stat"><span>Coin price</span>
              <span style={{ color: bagCoins ? "var(--gold)" : "var(--dim)" }}>{bagCoins ? `◆ ${nf(bagCoins)}` : "not available"}</span></div>
            <div className="stat"><span>Your coins</span><span>◆ {nf(p.coins)}</span></div>
          </div>
          <button className="cta" disabled title="Preview only — checkout isn't connected here">
            Checkout disabled in preview
          </button>
          <p className="mono" style={{ fontSize: 10, color: "var(--dim)", marginTop: 12, lineHeight: 1.8, letterSpacing: ".05em", textAlign: "center" }}>
            This bag is for browsing only — no card or coins are charged. Real checkout ships in the full app.
          </p>
        </>
      )}
    </div>
  );

  const friendsView = (() => {
    const q = query.trim().toLowerCase();
    const have = new Set(friends.map((f) => f.name));
    const results = q
      ? DIRECTORY.filter((d) => d.name.toLowerCase().includes(q)).slice(0, 12)
      : DIRECTORY.filter((d) => !have.has(d.name)).slice(0, 4);
    return (
      <div className="body">
        <div className="search">
          <input className="inp" placeholder="Search players by handle" value={query}
            onChange={(e) => setQuery(e.target.value)} />
          {query && <button className="clearbtn" onClick={() => setQuery("")} aria-label="Clear search">✕</button>}
        </div>

        {q ? (
          <>
            <div className="sect-hd">
              <span className="eyebrow">{results.length} result{results.length === 1 ? "" : "s"} for “{query.trim()}”</span>
              <div className="rule" />
            </div>
            {results.length === 0 ? (
              <div className="empty">
                <div className="dsp" style={{ fontSize: 14 }}>No players found</div>
                <p>Handles are exact. Ask them to send you theirs,<br />or share yours: <b style={{ color: "var(--cyan)" }}>{p.handle}</b></p>
              </div>
            ) : results.map((d) => {
              const already = have.has(d.name);
              return (
                <div className="fr" key={d.name}>
                  <div className="av" style={{ color: "var(--dim)" }}>{d.name[0].toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{d.name}</div>
                    <div className="ex-k">
                      <span className="dot" style={{ background: d.on ? "var(--mint)" : "var(--line)" }} />
                      {rankOf(9000 + d.week).name} · {nf(d.week)} XP
                    </div>
                  </div>
                  <button className="buy" data-can={already ? 0 : 1} data-got={already ? 1 : 0}
                    style={{ marginLeft: "auto" }} disabled={already} onClick={() => addFriend(d)}>
                    {already ? "Friends" : "Add"}
                  </button>
                </div>
              );
            })}
          </>
        ) : (
          <>
            <div className="sect-hd"><span className="eyebrow">{onlineN} online · {friends.length} total</span><div className="rule" /></div>
            {friends.map((f) => (
              <div className="fr" key={f.name}>
                <div className="av">{f.name[0].toUpperCase()}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{f.name}</div>
                  <div className="ex-k">
                    <span className="dot" style={{ background: f.on ? "var(--mint)" : "var(--line)" }} />
                    {f.on ? "Online" : "Offline"} · {rankOf(9000 + f.week).name}
                  </div>
                </div>
                <div className="mono" style={{ marginLeft: "auto", fontSize: 12 }}>{nf(f.week)} XP</div>
              </div>
            ))}
            <div className="sect-hd" style={{ marginTop: 22 }}><span className="eyebrow">suggested</span><div className="rule" /></div>
            {results.map((d) => (
              <div className="fr" key={d.name}>
                <div className="av" style={{ color: "var(--dim)" }}>{d.name[0].toUpperCase()}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{d.name}</div>
                  <div className="ex-k">{rankOf(9000 + d.week).name} · suggested</div>
                </div>
                <button className="buy" data-can="1" style={{ marginLeft: "auto" }} onClick={() => addFriend(d)}>Add</button>
              </div>
            ))}
          </>
        )}
      </div>
    );
  })();

  /* ---------------------- registry ---------------------- */
  const SCREENS = {
    menu: menuView, quests: questsView, session: sessionView, tracker: trackerView, summary: summaryView,
    rewards: rewardsView, rank: rankView, compete: competeView, clans: clansView,
    shop: shopView, product: productView, bag: bagView, friends: friendsView,
  };
  const TITLES = {
    quests: "Daily quests", session: "Session", tracker: "Form tracker", summary: "Results",
    rewards: "Redeem rewards", rank: "My level & rank", compete: "Compete",
    clans: myClan ? myClan.name : "Clans", shop: "Shop", friends: "Friends",
    product: openItem ? itemOf(openItem).t : "Product", bag: "Your bag",
  };
  const BACK = { session: "quests", tracker: "session", summary: "menu", product: "shop", bag: "shop" };
  const SHOW_BAG = ["shop", "product", "bag"];
  const NO_NAV = ["session", "tracker", "summary"];

  return (
    <div className="lu">
      <style>{CSS}</style>
      <ProdDefs />
      <div className="shell">
        <div className="scan-ov" />

        {screen !== "menu" && (
          <div className="top">
            <button className="back" onClick={() => setScreen(BACK[screen] || "menu")} aria-label="Back">◂</button>
            <div className="ttl">{TITLES[screen]}</div>
            <span className="chip" style={{ color: "var(--gold)", flexShrink: 0 }}>Preview</span>
            <div className="purse">
              {!SHOW_BAG.includes(screen) && <b style={{ color: "var(--cyan)" }}>{nf(p.xp)} XP</b>}
              <b style={{ color: "var(--gold)" }}>◆ {nf(p.coins)}</b>
              {SHOW_BAG.includes(screen) && (
                <button className="bagbtn" onClick={() => setScreen("bag")} aria-label={`Bag, ${bagCount} items`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cyan)"
                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 6h16l-1.5 13H5.5zM9 6a3 3 0 016 0" />
                  </svg>
                  {bagCount > 0 && <i>{bagCount}</i>}
                </button>
              )}
            </div>
          </div>
        )}

        {SCREENS[screen]}

        {!NO_NAV.includes(screen) && (
          <nav className="nav">
            {[["menu", "Menu", "home"], ["clans", "Clans", "clans"], ["compete", "Compete", "compete"]].map(([k, l, ic]) => (
              <button key={k} data-on={screen === k ? 1 : 0} onClick={() => setScreen(k)}>
                <Icon n={ic} />
                <span>{l}</span>
              </button>
            ))}
          </nav>
        )}

        {pop && <div className="pop" key={pop.k}>+{pop.xp}</div>}
        {toast && <div className="toast">✓ {toast}</div>}

        {promo && (
          <div className="over" role="alert">
            <Emblem tier={promo.t} div={promo.d} size={110} />
            <div className="eyebrow" style={{ color: "var(--gold)", letterSpacing: ".4em" }}>promoted</div>
            <div className="t" style={{ color: promo.c }}>{promo.name} {promo.div}</div>
            <p className="mono" style={{ fontSize: 11, color: "var(--dim)", maxWidth: 250, lineHeight: 1.8 }}>
              Your friends see this on the ladder tomorrow morning.
            </p>
            <button className="cta" style={{ maxWidth: 210, marginTop: 4 }} onClick={() => setPromo(null)}>Nice</button>
          </div>
        )}
      </div>
    </div>
  );
}


module.exports = { LevelUpPrototype };
