(() => {
'use strict';

const app=document.getElementById('student-app');
const toastEl=document.getElementById('student-toast');
const SUPABASE_URL='https://ctdzmoaftajdkvreyqox.supabase.co';
const SUPABASE_KEY='sb_publishable_DW6EY5_aJ6TShRxhq3x28g_TGJ-kEBJ';
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
let portalData=null;

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const fmtDate=v=>v?new Date(v+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'—';
const pctClass=p=>p>=80?'green':p>=70?'yellow':'red';
const average=arr=>arr.length?arr.reduce((a,b)=>a+b,0)/arr.length:null;
const round1=n=>Math.round(n*10)/10;
function toast(message){toastEl.textContent=message;toastEl.className='student-toast show';clearTimeout(toastEl.t);toastEl.t=setTimeout(()=>toastEl.className='student-toast',2800);}

function renderLogin(error=''){
  app.innerHTML='<div class="student-login">'+
    '<section class="student-login-hero">'+
      '<div class="student-brand"><img src="./vision-logo.jpg" alt="Vision Learning Centre"><div><strong>VISION</strong><span>LEARNING CENTRE</span></div></div>'+
      '<div class="student-hero-copy"><small>STUDENT PROGRESS</small><h1>See your progress.<br><em>Keep moving forward.</em></h1><p>Your scores, percentages, attendance and academic growth — all in one clear place.</p></div>'+
    '</section>'+
    '<section class="student-login-panel"><div class="student-login-card">'+
      '<div class="mini-brand"><img src="./vision-logo.jpg" alt="Vision Learning Centre"><div><strong>Student Progress</strong><span>Vision Learning Centre</span></div></div>'+
      '<h2>Welcome back</h2><p>Enter the phone number registered with Vision and your 4-digit PIN.</p>'+
      (error?'<div class="login-error">'+esc(error)+'</div>':'')+
      '<form id="student-login-form" class="login-form">'+
        '<div class="field"><label>Phone number</label><div class="input-shell"><input name="phone" inputmode="tel" autocomplete="tel" placeholder="+998 99 123 45 67" required></div></div>'+
        '<div class="field"><label>4-digit PIN</label><div class="input-shell"><input class="pin-input" name="pin" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" autocomplete="current-password" type="password" placeholder="••••" required></div></div>'+
        '<button class="login-button" type="submit"><span>Open my progress</span><span>→</span></button>'+
      '</form>'+
      '<div class="login-note">Your PIN is the last four digits of the phone number registered in your Vision student profile. After 5 incorrect attempts, login is temporarily locked.</div>'+
    '</div></section>'+
  '</div>';
  document.getElementById('student-login-form').onsubmit=login;
}

async function login(e){
  e.preventDefault();
  const form=e.currentTarget;
  const btn=form.querySelector('button[type=submit]');
  btn.disabled=true;btn.innerHTML='<span>Checking…</span><span>•••</span>';
  const {data,error}=await sb.functions.invoke('student-portal',{body:{phone:form.phone.value,pin:form.pin.value}});
  if(error){
    let msg=error.message;
    try{const body=await error.context?.json?.();if(body?.error)msg=body.error;}catch{}
    return renderLogin(msg);
  }
  if(data?.error)return renderLogin(data.error);
  if(data?.selection_required&&Array.isArray(data.students)){
    return renderStudentPicker(data.students);
  }
  portalData=data;
  renderPortal();
}

function renderStudentPicker(portals){
  app.innerHTML='<div class="portal"><header class="portal-header"><div class="portal-header-inner"><div class="portal-brand"><img src="./vision-logo.jpg" alt="Vision Learning Centre"><div><strong>Vision Student Progress</strong><span>VISION LEARNING CENTRE</span></div></div><button class="signout" id="picker-signout">Back</button></div></header><main class="portal-main"><section class="student-welcome"><div><small>PARENT ACCESS</small><h1>Choose a student</h1><p>This phone number is linked to more than one active student.</p></div></section><div class="student-picker-grid">'+portals.map((p,i)=>'<button class="student-picker-card" data-index="'+i+'"><div class="picker-avatar">'+esc((p.student.full_name||'?').split(' ').map(x=>x[0]).join('').slice(0,2))+'</div><div><strong>'+esc(p.student.full_name)+'</strong><span>'+esc(p.student.group||'No group')+'</span><small>'+esc(p.student.grade_or_age||'Student')+'</small></div><b>Open →</b></button>').join('')+'</div></main></div>';
  app.querySelectorAll('.student-picker-card').forEach(btn=>btn.onclick=()=>{
    const selected=portals[Number(btn.dataset.index)];
    portalData={ok:true,...selected};
    renderPortal();
  });
  document.getElementById('picker-signout').onclick=()=>renderLogin();
}

function statValue(value,fallback='—'){return value===null||value===undefined?fallback:value;}

function renderPortal(){
  const {student,results,attendance}=portalData;
  const valid=results.filter(r=>Number.isFinite(Number(r.percentage))).map(r=>({...r,percentage:Number(r.percentage)}));
  const percentages=valid.map(r=>r.percentage);
  const latest=valid.length?valid[valid.length-1]:null;
  const avg=percentages.length?round1(average(percentages)):null;
  const best=percentages.length?Math.max(...percentages):null;
  const growth=percentages.length>1?round1(percentages[percentages.length-1]-percentages[0]):null;

  const summary='<div class="summary-grid">'+
    '<section class="summary-card latest-card"><div><span>Latest result</span><strong>'+(latest?esc(latest.percentage)+'%':'No result yet')+'</strong><small>'+(latest?esc(latest.score)+' / '+esc(latest.max_score)+' · '+esc(latest.topic||latest.record_type)+' · '+fmtDate(latest.record_date):'Your first test result will appear here.')+'</small></div><div class="latest-score-bubble">'+(latest?esc(Math.round(latest.percentage))+'%':'—')+'</div></section>'+
    '<section class="summary-card"><span>Overall average</span><strong>'+statValue(avg!==null?avg+'%':null)+'</strong></section>'+
    '<section class="summary-card"><span>Best result</span><strong>'+statValue(best!==null?best+'%':null)+'</strong></section>'+
    '<section class="summary-card"><span>Growth</span><strong>'+statValue(growth!==null?(growth>0?'+':'')+growth+' pts':null)+'</strong></section>'+
  '</div>';

  const chart=valid.length?renderChart(valid):'<div class="empty-progress"><div><strong>No test results yet</strong><p>As soon as your teacher records your first test in Vision CRM, your progress chart will appear here automatically.</p></div></div>';
  const rows=valid.slice().reverse().map(r=>'<div class="result-row"><div><strong>'+esc(r.topic||r.record_type)+'</strong><small>'+esc(r.record_type)+'</small></div><span class="result-score">'+esc(r.score)+' / '+esc(r.max_score)+'</span><span class="result-percent '+pctClass(r.percentage)+'">'+esc(r.percentage)+'%</span><span class="result-date">'+fmtDate(r.record_date)+'</span></div>').join('');
  const latestNote=[...valid].reverse().find(r=>r.teacher_note)?.teacher_note||null;

  app.innerHTML='<div class="portal">'+
    '<header class="portal-header"><div class="portal-header-inner"><div class="portal-brand"><img src="./vision-logo.jpg" alt="Vision Learning Centre"><div><strong>Vision Student Progress</strong><span>VISION LEARNING CENTRE</span></div></div><button class="signout" id="student-signout">Sign out</button></div></header>'+
    '<main class="portal-main">'+
      '<section class="student-welcome"><div><small>YOUR PROGRESS DASHBOARD</small><h1>'+esc(student.full_name)+'</h1><p>'+esc(student.teacher||'Vision Learning Centre')+' · '+esc(student.grade_or_age||'Student')+'</p></div><span class="group-badge">'+esc(student.group||'Unassigned')+'</span></section>'+
      summary+
      '<section class="chart-panel"><div class="chart-head"><div><h2>Your Progress</h2><p>Every bar is one test. Bigger bars mean higher percentages.</p></div><div class="legend"><span><i class="red"></i>Below 70%</span><span><i class="yellow"></i>70–79%</span><span><i class="green"></i>80%+</span></div></div><div class="chart-wrap">'+chart+'</div></section>'+
      '<div class="lower-grid">'+
        '<section class="info-panel"><h3>Recent test results</h3>'+(rows?'<div class="result-list">'+rows+'</div>':'<div class="teacher-note">No test records yet.</div>')+'</section>'+
        '<section class="info-panel"><h3>Learning overview</h3>'+
          '<div class="detail-row"><span>Attendance · last 90 days</span><strong>'+(attendance.rate===null?'No records':esc(attendance.rate)+'%')+'</strong></div>'+
          '<div class="detail-row"><span>Recorded lessons</span><strong>'+esc(attendance.records)+'</strong></div>'+
          '<div class="detail-row"><span>Group</span><strong>'+esc(student.group||'—')+'</strong></div>'+
          '<div class="detail-row"><span>Teacher</span><strong>'+esc(student.teacher||'—')+'</strong></div>'+
          '<div class="detail-row"><span>Schedule</span><strong>'+esc(student.schedule||'—')+'</strong></div>'+
          '<div class="detail-row"><span>Room</span><strong>'+esc(student.room||'—')+'</strong></div>'+
          '<h3 style="margin-top:18px">Latest teacher feedback</h3><div class="teacher-note">'+esc(latestNote||'Teacher feedback will appear here after it is added to a test record.')+'</div>'+
        '</section>'+
      '</div>'+
    '</main>'+
  '</div>';
  document.getElementById('student-signout').onclick=()=>{portalData=null;renderLogin();toast('Signed out.');};
}

function renderChart(results){
  const bars=results.map((r,i)=>{
    const p=Math.max(0,Math.min(100,Number(r.percentage)));
    const label=r.topic||r.record_type||('Test '+(i+1));
    const short=label.length>13?label.slice(0,12)+'…':label;
    const title=esc(label+' — '+p+'% ('+r.score+'/'+r.max_score+') — '+fmtDate(r.record_date));
    return '<div class="result-bar-wrap" title="'+title+'" aria-label="'+title+'"><div class="result-bar '+pctClass(p)+'" style="height:'+p+'%"><span class="bar-value">'+esc(p)+'%</span></div><div class="bar-label">'+esc(short)+'<br>'+esc(new Date(r.record_date+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'}))+'</div></div>';
  }).join('');
  return '<div class="progress-chart"><span class="y-label y100">100</span><span class="y-label y75">75</span><span class="y-label y50">50</span><span class="y-label y25">25</span><span class="y-label y0">0</span><div class="bar-track">'+bars+'</div></div>';
}

renderLogin();
})();