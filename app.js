(() => {
'use strict';

const app = document.getElementById('app');
const toastEl = document.getElementById('toast');
const modalRoot = document.getElementById('modal-root');

function renderBootError(message){
  app.className='';
  app.innerHTML='<div class="auth-wrap"><section class="auth-panel" style="grid-column:1/-1"><div class="auth-card"><h2>Vision CRM could not start</h2><p class="sub">'+String(message||'Please check your connection and reload the page.')+'</p><button class="btn btn-primary btn-block" id="boot-reload">Reload CRM</button></div></section></div>';
  document.getElementById('boot-reload')?.addEventListener('click',()=>location.reload());
}

if(!window.supabase?.createClient){
  renderBootError('The secure CRM library did not load. Check your internet connection and reload the page.');
  return;
}

const SUPABASE_URL = 'https://ctdzmoaftajdkvreyqox.supabase.co';
const SUPABASE_KEY = 'sb_publishable_DW6EY5_aJ6TShRxhq3x28g_TGJ-kEBJ';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

const state = {
  session: null,
  profile: null,
  staff: null,
  route: 'dashboard',
  sidebarOpen: false,
  cache: {},
  filters: {
    paymentMonth: localYM(),
    paymentStatus: 'attention',
    reportMonth: localYM(),
    expenseMonth: localYM(),
    payrollMonth: localYM()
  },
};

const NAV = [
  { id:'dashboard', label:'Dashboard', icon:'⌂', roles:['owner','admin','teacher','cashier'], group:'Overview' },
  { id:'leads', label:'Leads', icon:'◎', roles:['owner','admin'], group:'Students' },
  { id:'students', label:'Students', icon:'◉', roles:['owner','admin','teacher','cashier'], group:'Students' },
  { id:'groups', label:'Groups', icon:'▦', roles:['owner','admin','teacher','cashier'], group:'Students' },
  { id:'attendance', label:'Attendance', icon:'✓', roles:['owner','admin','teacher'], group:'Teaching' },
  { id:'academic', label:'Academic Records', icon:'✎', roles:['owner','admin','teacher'], group:'Teaching' },
  { id:'payments', label:'Payments', icon:'₸', roles:['owner','admin','cashier'], group:'Finance' },
  { id:'expenses', label:'Expenses', icon:'↘', roles:['owner','admin'], group:'Finance' },
  { id:'staff', label:'Staff & Payroll', icon:'♙', roles:['owner','admin'], group:'Management' },
  { id:'reports', label:'Reports', icon:'▥', roles:['owner','admin'], group:'Management' },
  { id:'users', label:'User Accounts', icon:'⚙', roles:['owner','admin'], group:'Management' },
  { id:'settings', label:'Settings', icon:'◌', roles:['owner','admin'], group:'Management' },
];

const PAGE_META = {
  dashboard:['Dashboard','A live view of Vision Learning Centre'],
  leads:['Leads','Track enquiries and trial students'],
  students:['Students','Manage active, paused and former students'],
  groups:['Groups','Classes, schedules, teachers and fees'],
  attendance:['Attendance','Record lesson attendance quickly'],
  academic:['Academic Records','Scores, progress and teacher notes'],
  payments:['Payments','Monthly student fee collection'],
  expenses:['Expenses','Operating costs and centre spending'],
  staff:['Staff & Payroll','Team records and salary payments'],
  reports:['Reports','Revenue, costs and operational indicators'],
  users:['User Accounts','Create administrator, teacher and cashier logins'],
  settings:['Settings','Centre name, currency and default fees'],
};

const fmtMoney = n => new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(Number(n||0)) + ' so‘m';
const fmtDate = d => d ? new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(d+'T00:00:00')) : '—';
function pad2(n){return String(n).padStart(2,'0');}
function localYMD(d=new Date()){return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());}
function localYM(d=new Date()){return d.getFullYear()+'-'+pad2(d.getMonth()+1);}
function localCalendarDate(value){
  if(value instanceof Date)return value;
  if(!value)return new Date();
  const s=String(value);
  if(/^\d{4}-\d{2}$/.test(s))return new Date(Number(s.slice(0,4)),Number(s.slice(5,7))-1,1,12);
  if(/^\d{4}-\d{2}-\d{2}$/.test(s))return new Date(Number(s.slice(0,4)),Number(s.slice(5,7))-1,Number(s.slice(8,10)),12);
  return new Date(value);
}
function monthStart(value){
  if(typeof value==='string'&&/^\d{4}-\d{2}$/.test(value))return value+'-01';
  const d=localCalendarDate(value);
  return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-01';
}
function monthEnd(value){
  const d=localCalendarDate(value);
  return localYMD(new Date(d.getFullYear(),d.getMonth()+1,0,12));
}
const today = () => localYMD();
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const initials = name => (name||'V').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
const humanize = v => String(v ?? '').replaceAll('_',' ').replace(/\b\w/g,m=>m.toUpperCase());
const paymentMethodLabel = v => ({cash:'Cash',card_transfer:'Card / Transfer',other:'Other'})[v] || humanize(v);
function uiIcon(name){
  const paths={
    dashboard:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    leads:'<circle cx="10" cy="8" r="3.5"/><path d="M3.5 20c.8-4 3.1-6 6.5-6 2 0 3.6.7 4.7 2"/><path d="M18 11v6M15 14h6"/>',
    students:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    groups:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 10v10M15 10v10"/>',
    attendance:'<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16.5 8.5"/>',
    academic:'<path d="M4 19V5M4 19h16"/><path d="m7 15 4-4 3 2 5-6"/>',
    payments:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M7 15h3"/>',
    expenses:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6"/>',
    staff:'<circle cx="9" cy="8" r="3.5"/><path d="M3 20c.7-4 2.8-6 6-6s5.3 2 6 6"/><path d="M18 8h3M19.5 6.5v3"/>',
    reports:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    users:'<path d="M12 3 4.5 6v5c0 4.8 3.1 8.1 7.5 10 4.4-1.9 7.5-5.2 7.5-10V6L12 3Z"/><circle cx="12" cy="10" r="2.5"/><path d="M8.5 16c.8-2 2-3 3.5-3s2.7 1 3.5 3"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/>',
    refresh:'<path d="M20 6v5h-5"/><path d="M20 11a8 8 0 1 0 1 5"/>',
    logout:'<path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    alert:'<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v4M12 17h.01"/>'
  };
  const body=paths[name]||paths.dashboard;
  return '<svg class="ui-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+body+'</svg>';
}
const val = (form, name) => form.elements[name]?.value?.trim?.() ?? form.elements[name]?.value ?? '';
const checked = (form,name) => !!form.elements[name]?.checked;
const role = () => state.profile?.role || 'teacher';
const can = (...roles) => roles.includes(role()) || (role()==='senior_manager' && roles.includes('owner'));
const withTimeout = (promise, ms=20000, message='The request took too long. Please try again.') => {
  let timer;
  return Promise.race([
    Promise.resolve(promise),
    new Promise((_,reject)=>{ timer=setTimeout(()=>reject(new Error(message)),ms); })
  ]).finally(()=>clearTimeout(timer));
};
const query = async (promise) => {
  const {data,error} = await withTimeout(promise);
  if (error) throw error;
  return data;
};
function toast(message,type='success'){
  toastEl.textContent=message; toastEl.className='toast show '+type;
  clearTimeout(toastEl._t); toastEl._t=setTimeout(()=>toastEl.className='toast',3200);
}
function fail(err){
  console.error(err);
  toast(err?.message || 'Something went wrong.','error');
}
function closeModal(){ modalRoot.innerHTML=''; }
function openModal(title, body, onSubmit, submitLabel='Save'){
  modalRoot.innerHTML = '<div class="modal-backdrop"><div class="modal"><form id="modal-form">'+
    '<div class="modal-head"><h3>'+esc(title)+'</h3><button class="icon-btn" type="button" data-close>×</button></div>'+
    '<div class="modal-body">'+body+'</div>'+
    '<div class="modal-foot"><button class="btn btn-secondary" type="button" data-close>Cancel</button><button class="btn btn-primary" type="submit">'+esc(submitLabel)+'</button></div>'+
    '</form></div></div>';
  bindPasswordToggle(modalRoot);
  modalRoot.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeModal);
  modalRoot.querySelector('.modal-backdrop').onclick=e=>{ if(e.target.classList.contains('modal-backdrop')) closeModal(); };
  modalRoot.querySelector('#modal-form').onsubmit=async e=>{
    e.preventDefault();
    const btn=e.currentTarget.querySelector('[type=submit]'); btn.disabled=true; btn.textContent='Saving…';
    try{ await onSubmit(e.currentTarget); closeModal(); await renderRoute(); toast('Saved successfully.'); }
    catch(err){ fail(err); btn.disabled=false; btn.textContent=submitLabel; }
  };
}
function field(label,name,value='',type='text',extra=''){
  return '<div class="field"><label>'+esc(label)+'</label><input class="input" type="'+type+'" name="'+name+'" value="'+esc(value)+'" '+extra+'></div>';
}
function selectField(label,name,options,value=''){
  return '<div class="field"><label>'+esc(label)+'</label><select class="select" name="'+name+'">'+options.map(o=>{
    const [v,l]=Array.isArray(o)?o:[o,o]; return '<option value="'+esc(v)+'" '+(String(v)===String(value)?'selected':'')+'>'+esc(l)+'</option>';
  }).join('')+'</select></div>';
}
function textArea(label,name,value=''){
  return '<div class="field span-2"><label>'+esc(label)+'</label><textarea class="textarea" name="'+name+'">'+esc(value)+'</textarea></div>';
}
function actionButton(label,action,id,kind='secondary'){
  return '<button class="btn btn-sm btn-'+kind+'" data-action="'+action+'" data-id="'+esc(id)+'">'+esc(label)+'</button>';
}
function empty(message='No records yet.'){ return '<div class="empty"><strong>Nothing here yet</strong>'+esc(message)+'</div>'; }

async function loadIdentity(){
  if(!state.session){ state.profile=null; state.staff=null; return; }
  const uid=state.session.user.id;
  const [profile,staff] = await Promise.all([
    query(sb.from('profiles').select('*').eq('id',uid).maybeSingle()),
    query(sb.from('staff').select('*').eq('user_id',uid).maybeSingle())
  ]);
  state.profile=profile || {id:uid,full_name:state.session.user.email,role:'teacher'};
  state.staff=staff;
}
function allowedRoutes(){
  return NAV.filter(n=>n.roles.includes(role()) || (role()==='senior_manager' && n.roles.includes('owner')));
}
function shellContext(){
  const meta=PAGE_META[state.route]||['Vision CRM',''];
  const allowed=allowedRoutes();
  const current=allowed.find(n=>n.id===state.route)||allowed[0];
  const activeGroup=current?.group||'Overview';
  const groups=[...new Set(allowed.map(n=>n.group))];
  const categoryIcon={Overview:'dashboard',Students:'students',Teaching:'academic',Finance:'payments',Management:'settings'};
  const defaults={Overview:'dashboard',Students:'students',Teaching:'attendance',Finance:'payments',Management:'reports'};
  const categoryNav=groups.map(g=>'<button type="button" class="category-tab '+(g===activeGroup?'active':'')+'" data-category="'+esc(g)+'"><span>'+uiIcon(categoryIcon[g]||'dashboard')+'</span>'+esc(g)+'</button>').join('');
  const subNav=allowed.filter(n=>n.group===activeGroup).map(n=>'<button type="button" class="subnav-tab '+(n.id===state.route?'active':'')+'" data-route="'+n.id+'">'+esc(n.label)+'</button>').join('');
  return {meta,allowed,defaults,categoryNav,subNav};
}
function bindShellNavigation(ctx){
  document.querySelectorAll('[data-route]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();go(b.dataset.route);});
  document.querySelectorAll('[data-category]').forEach(b=>b.onclick=e=>{
    e.preventDefault();e.stopPropagation();
    const group=b.dataset.category;
    const preferred=ctx.defaults[group];
    const target=ctx.allowed.find(n=>n.group===group&&n.id===preferred)||ctx.allowed.find(n=>n.group===group);
    if(target) go(target.id);
  });
  document.getElementById('signout').onclick=async()=>{await sb.auth.signOut();};
  document.getElementById('refresh')?.addEventListener('click',()=>renderRoute(true));
}
function updateShellChrome(){
  const ctx=shellContext();
  const category=document.querySelector('.category-nav');
  const subnav=document.querySelector('.subnav');
  const title=document.querySelector('.page-title h1');
  const subtitle=document.querySelector('.page-title p');
  if(category) category.innerHTML=ctx.categoryNav;
  if(subnav) subnav.innerHTML=ctx.subNav;
  if(title) title.textContent=ctx.meta[0];
  if(subtitle) subtitle.textContent=ctx.meta[1];
  bindShellNavigation(ctx);
}
function routePanel(routeName){
  return app.querySelector('.route-page[data-route-page="'+routeName+'"]');
}
function activateRoutePanel(routeName){
  const pages=app.querySelectorAll('.route-page');
  let found=false;
  pages.forEach(page=>{
    const active=page.dataset.routePage===routeName;
    page.hidden=!active;
    page.classList.toggle('active',active);
    if(active){
      found=true;
      page.classList.remove('route-panel-in');
      void page.offsetWidth;
      page.classList.add('route-panel-in');
    }
  });
  return found;
}
function renderShell(content,routeName=state.route,activate=true){
  const ctx=shellContext();
  const existing=app.querySelector('.top-shell');
  if(existing){
    if(activate) updateShellChrome();
    const contentEl=app.querySelector('.content');
    if(contentEl){
      let panel=routePanel(routeName);
      if(!panel){
        panel=document.createElement('section');
        panel.className='route-page';
        panel.dataset.routePage=routeName;
        panel.hidden=true;
        contentEl.appendChild(panel);
      }
      panel.innerHTML=content;
      panel.dataset.loadedAt=String(Date.now());
      if(activate) activateRoutePanel(routeName);
    }
    return;
  }
  app.className='';
  app.innerHTML =
    '<div class="shell top-shell">'+
      '<header class="app-header">'+
        '<div class="app-header-main">'+
          '<div class="app-brand"><img src="./vision-logo.jpg" alt="Vision Learning Centre"><div><strong>Vision CRM</strong><span>Vision Learning Centre</span></div></div>'+
          '<div class="app-user">'+
            '<button type="button" class="btn btn-secondary desktop-only" id="refresh">'+uiIcon('refresh')+'<span>Refresh</span></button>'+
            '<span class="role-chip desktop-only">'+esc(humanize(role()))+'</span>'+
            '<div class="user-chip"><div class="avatar">'+esc(initials(state.profile?.full_name))+'</div><div class="user-chip-copy"><strong>'+esc(state.profile?.full_name||'User')+'</strong><span>'+esc(humanize(role()))+'</span></div></div>'+
            '<button type="button" id="signout" class="icon-btn signout-icon" title="Sign out" aria-label="Sign out">'+uiIcon('logout')+'</button>'+
          '</div>'+
        '</div>'+
        '<nav class="category-nav">'+ctx.categoryNav+'</nav>'+
        '<nav class="subnav">'+ctx.subNav+'</nav>'+
      '</header>'+
      '<main class="main top-main">'+
        '<header class="pagebar"><div class="page-title"><h1>'+esc(ctx.meta[0])+'</h1><p>'+esc(ctx.meta[1])+'</p></div></header>'+
        '<div class="content"><section class="route-page active route-panel-in" data-route-page="'+esc(routeName)+'" data-loaded-at="'+Date.now()+'">'+content+'</section></div>'+
      '</main>'+
    '</div>';
  bindShellNavigation(ctx);
}
function go(routeName){
  if(!allowedRoutes().some(n=>n.id===routeName)) routeName='dashboard';
  if(state.route===routeName && app.querySelector('.top-shell')) return;
  state.route=routeName; state.sidebarOpen=false;
  history.replaceState(null,'','#'+routeName);
  updateShellChrome();
  const cached=routePanel(routeName);
  if(cached){
    activateRoutePanel(routeName);
    const age=Date.now()-Number(cached.dataset.loadedAt||0);
    if(age>60000) void renderRoute(true,true);
    return;
  }
  void renderRoute(false,true);
}

function passwordInput(label,name,extra=''){
  return '<div class="field"><label>'+esc(label)+'</label><div class="password-wrap"><input class="input password-input" type="password" name="'+name+'" '+extra+'><button class="password-toggle" type="button" aria-label="Show password" title="Show password"><span class="eye-open">◉</span><span class="eye-closed">—</span></button></div></div>';
}
function bindPasswordToggle(root=document){
  root.querySelectorAll('.password-toggle').forEach(btn=>{
    btn.onclick=()=>{
      const input=btn.closest('.password-wrap')?.querySelector('input');
      if(!input)return;
      const show=input.type==='password';
      input.type=show?'text':'password';
      btn.classList.toggle('is-visible',show);
      btn.setAttribute('aria-label',show?'Hide password':'Show password');
      btn.setAttribute('title',show?'Hide password':'Show password');
    };
  });
}
function renderLogin(error=''){
  app.className='';
  const mailIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>';
  const lockIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>';
  app.innerHTML =
    '<div class="auth-wrap auth-login premium-auth">'+
      '<section class="auth-hero premium-auth-hero">'+
        '<div class="hero-photo" aria-hidden="true"></div>'+
        '<div class="hero-overlay" aria-hidden="true"></div>'+
        '<div class="hero-orbit hero-orbit-one" aria-hidden="true"></div>'+
        '<div class="hero-orbit hero-orbit-two" aria-hidden="true"></div>'+
        '<div class="premium-hero-content">'+
          '<div class="premium-brand"><img src="./vision-logo.jpg" alt="Vision Learning Centre logo"><div><strong>VISION</strong><span>LEARNING CENTRE</span></div></div>'+
          '<div class="premium-copy">'+
            '<span class="premium-kicker">VISION CRM</span>'+
            '<h1>Everything your<br>centre needs,<br><em>in one clear system.</em></h1>'+
            '<p>Students, groups, attendance, payments, staff and academic progress — securely managed in one place.</p>'+
          '</div>'+
          '<div class="premium-feature-grid">'+
            '<div class="premium-feature-card"><span class="feature-icon">'+uiIcon('students')+'</span><div><strong>Students</strong><small>Manage with ease</small></div></div>'+
            '<div class="premium-feature-card"><span class="feature-icon">'+uiIcon('attendance')+'</span><div><strong>Attendance</strong><small>Track in real time</small></div></div>'+
            '<div class="premium-feature-card"><span class="feature-icon">'+uiIcon('payments')+'</span><div><strong>Payments</strong><small>Simple & secure</small></div></div>'+
            '<div class="premium-feature-card"><span class="feature-icon">'+uiIcon('reports')+'</span><div><strong>Reports</strong><small>Insights that matter</small></div></div>'+
          '</div>'+
          '<div class="premium-hero-footer"><span></span><div><strong>Vision Learning Centre</strong><small>Internal management system</small></div></div>'+
        '</div>'+
        '<div class="floating-card float-one"><span>'+uiIcon('academic')+'</span><strong>Smarter<br>Education</strong></div>'+
        '<div class="floating-card float-two"><span>'+uiIcon('reports')+'</span><strong>A Brighter<br>Tomorrow</strong></div>'+
      '</section>'+
      '<section class="auth-panel premium-auth-panel">'+
        '<div class="auth-ambient ambient-one" aria-hidden="true"></div><div class="auth-ambient ambient-two" aria-hidden="true"></div>'+
        '<div class="auth-card premium-login-card">'+
          '<div class="login-brand premium-login-brand"><img src="./vision-logo.jpg" alt="Vision Learning Centre"><div><strong>Vision CRM</strong><span>Secure staff access</span></div></div>'+
          '<div class="login-heading premium-login-heading"><span class="login-kicker">WELCOME TO VISION</span><h2>Welcome back</h2><p class="sub">Enter your account details to continue.</p></div>'+
          (error?'<div class="login-error">'+esc(error)+'</div>':'')+
          '<form id="login-form" class="form-grid premium-login-form">'+
            '<div class="field premium-field"><label>Email address</label><div class="login-input-shell"><span class="login-input-icon">'+mailIcon+'</span><input class="input" type="email" name="email" required autocomplete="email" placeholder="you@example.com"></div></div>'+
            '<div class="field premium-field"><label>Password</label><div class="password-wrap login-input-shell"><span class="login-input-icon">'+lockIcon+'</span><input class="input password-input" type="password" name="password" required autocomplete="current-password" placeholder="Enter your password"><button class="password-toggle" type="button" aria-label="Show password" title="Show password"><span class="eye-open">◉</span><span class="eye-closed">—</span></button></div></div>'+
            '<div class="login-form-row"><span class="secure-note"><span class="secure-dot"></span>Protected staff access</span><button class="link-btn" type="button" id="forgot">Forgot password?</button></div>'+
            '<button class="btn btn-primary btn-block login-submit premium-signin" type="submit"><span>Sign in</span><span aria-hidden="true">→</span></button>'+
          '</form>'+
          '<div class="premium-login-divider"><span></span><b>VISION</b><span></span></div>'+
          '<div class="login-trust"><span class="trust-icon">'+uiIcon('students')+'</span><div><strong>Built for your centre.</strong><span>Vision Learning Centre staff only</span></div></div>'+
        '</div>'+
        '<div class="premium-panel-footer">More than learning. <strong>A brighter tomorrow.</strong></div>'+
      '</section>'+
    '</div>';
  bindPasswordToggle(app);
  document.getElementById('login-form').onsubmit=async e=>{
    e.preventDefault();
    const b=e.currentTarget.querySelector('[type="submit"]'); b.disabled=true;b.innerHTML='<span>Signing in…</span><span class="signin-spinner" aria-hidden="true"></span>';
    const {error}=await sb.auth.signInWithPassword({email:val(e.currentTarget,'email'),password:val(e.currentTarget,'password')});
    if(error){renderLogin(error.message);}
  };
  document.getElementById('forgot').onclick=()=>{
    openModal('Reset password',field('Account email','email','','email','required'),async f=>{
      const email=val(f,'email');
      const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});
      if(error) throw error;
      toast('Password reset email sent.');
    },'Send reset link');
  };
}
function renderPasswordUpdate(forced=false){
  app.className='';
  const title=forced?'Change your temporary password.':'Set a new password.';
  const copy=forced?'For security, you must create your own password before entering Vision CRM.':'Choose a strong password for your Vision CRM account.';
  app.innerHTML='<div class="auth-wrap"><section class="auth-hero"><div class="auth-logo"><img src="./vision-logo.jpg" alt="Vision Learning Centre logo"><div><strong>VISION</strong><span>LEARNING CENTRE</span></div></div><div class="auth-hero-copy"><div class="eyebrow">ACCOUNT SECURITY</div><h1>'+esc(title)+'</h1><p>'+esc(copy)+'</p></div><div></div></section><section class="auth-panel"><div class="auth-card"><div class="login-brand"><img src="./vision-logo.jpg" alt="Vision Learning Centre"><div><strong>Vision CRM</strong><span>Secure account access</span></div></div><h2>'+esc(title)+'</h2><p class="sub">Use at least 8 characters.</p><form id="pw-form" class="form-grid">'+passwordInput('New password','password','required minlength="8" autocomplete="new-password"')+'<button class="btn btn-primary btn-block" type="submit">Update password</button></form></div></section></div>';
  bindPasswordToggle(app);
  document.getElementById('pw-form').onsubmit=async e=>{
    e.preventDefault();
    const {error}=await sb.auth.updateUser({password:val(e.currentTarget,'password')});
    if(error) return fail(error);
    if(forced){
      const {data,error:clearError}=await sb.functions.invoke('manage-users',{body:{action:'clear_first_login'}});
      if(clearError) return fail(clearError);
      if(data?.error) return fail(new Error(data.error));
      await loadIdentity();
    }
    toast('Password updated.');
    state.route='dashboard';
    await renderRoute();
  };
}

async function dashboardPage(){
  const first=monthStart();
  const last=monthEnd(first);
  const supportStartDate=new Date();
  supportStartDate.setDate(supportStartDate.getDate()-90);
  const supportStart=supportStartDate.toISOString().slice(0,10);
  const isTeacher=role()==='teacher';
  const isAdmin=role()==='admin';
  const [students,groups,payments,attendance,academic,leads] = await Promise.all([
    query(sb.from('students').select('id,full_name,status,group_id,monthly_fee,discount_amount,is_free_place').eq('status','active')),
    query(sb.from('groups').select('id,name,capacity,active,default_monthly_fee,schedule,room,meeting_days,start_time,end_time,teacher_id,staff(full_name)').eq('active',true)),
    can('owner','admin','cashier') ? query(sb.from('payments').select('id,amount,paid_at,fee_month,student_id,voided_at').eq('fee_month',first).is('voided_at',null)) : Promise.resolve([]),
    can('owner','admin','teacher') ? query(sb.from('attendance').select('id,status,lesson_date,student_id').gte('lesson_date',first).lte('lesson_date',last)) : Promise.resolve([]),
    (isTeacher||isAdmin) ? query(sb.from('academic_records').select('id,student_id,record_date,record_type,score,max_score,topic').gte('record_date',supportStart).not('score','is',null).not('max_score','is',null).order('record_date',{ascending:false})) : Promise.resolve([]),
    isAdmin ? query(sb.from('leads').select('id,full_name,phone,parent_phone,interested_course,status,next_follow_up,created_at').order('created_at',{ascending:false})) : Promise.resolve([])
  ]);

  const expected=students.reduce((s,x)=>s+(x.is_free_place?0:Math.max(0,Number(x.monthly_fee)-Number(x.discount_amount))),0);
  const attendanceRate=attendance.length?Math.round(attendance.filter(x=>x.status==='present'||x.status==='late').length/attendance.length*100):0;
  const paidByStudent=new Map();
  payments.forEach(p=>paidByStudent.set(p.student_id,(paidByStudent.get(p.student_id)||0)+Number(p.amount||0)));
  const revenue=students.reduce((total,s)=>{
    if(s.is_free_place)return total;
    const due=Math.max(0,Number(s.monthly_fee)-Number(s.discount_amount));
    return total+Math.min(due,paidByStudent.get(s.id)||0);
  },0);
  const overpaymentTotal=students.reduce((total,s)=>{
    if(s.is_free_place)return total;
    const due=Math.max(0,Number(s.monthly_fee)-Number(s.discount_amount));
    return total+Math.max(0,(paidByStudent.get(s.id)||0)-due);
  },0);
  const unpaid=students.filter(s=>{
    if(s.is_free_place)return false;
    const due=Math.max(0,Number(s.monthly_fee)-Number(s.discount_amount));
    return (paidByStudent.get(s.id)||0)<due;
  });

  const attendanceByStudent=new Map();
  attendance.forEach(a=>{
    const item=attendanceByStudent.get(a.student_id)||{attended:0,total:0};
    item.total+=1;
    if(a.status==='present'||a.status==='late') item.attended+=1;
    attendanceByStudent.set(a.student_id,item);
  });

  const scoresByStudent=new Map();
  academic.forEach(r=>{
    const score=Number(r.score);
    const max=Number(r.max_score);
    if(!Number.isFinite(score)||!Number.isFinite(max)||max<=0) return;
    const list=scoresByStudent.get(r.student_id)||[];
    if(list.length<3) list.push(Math.max(0,Math.min(100,score/max*100)));
    scoresByStudent.set(r.student_id,list);
  });

  const groupNameById=new Map(groups.map(g=>[g.id,g.name]));
  const supportStudents=(isTeacher||isAdmin) ? students.map(s=>{
    const reasons=[];
    const att=attendanceByStudent.get(s.id);
    let attRate=null;
    if(att?.total){
      attRate=Math.round(att.attended/att.total*100);
      if(attRate<75) reasons.push('Attendance '+attRate+'%');
    }
    const scores=scoresByStudent.get(s.id)||[];
    let testAverage=null;
    if(scores.length){
      testAverage=Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);
      if(testAverage<70) reasons.push('Test average '+testAverage+'%');
    }
    return {...s,reasons,attRate,testAverage,group_name:groupNameById.get(s.group_id)||'Unassigned'};
  }).filter(s=>s.reasons.length).sort((a,b)=>{
    const aScore=Math.min(a.attRate??100,a.testAverage??100);
    const bScore=Math.min(b.attRate??100,b.testAverage??100);
    return aScore-bScore;
  }) : [];

  const dayName=new Date().toLocaleDateString('en-US',{weekday:'long'});
  const dayAliases={
    Sunday:['sunday','sun'],
    Monday:['monday','mon'],
    Tuesday:['tuesday','tue','tues'],
    Wednesday:['wednesday','wed'],
    Thursday:['thursday','thu','thur','thurs'],
    Friday:['friday','fri'],
    Saturday:['saturday','sat']
  };
  const scheduleMatchesToday=g=>{
    if(Array.isArray(g.meeting_days)&&g.meeting_days.length) return g.meeting_days.includes(dayName);
    const text=String(g.schedule||'').toLowerCase().trim();
    if(!text) return false;
    if(text.includes('every day')||text.includes('daily')) return true;
    return (dayAliases[dayName]||[]).some(alias=>new RegExp('(^|[^a-z])'+alias+'([^a-z]|$)','i').test(text));
  };
  const todayGroups=(isTeacher||isAdmin) ? groups.filter(g=>scheduleMatchesToday(g)) : [];

  const followUpsDue=isAdmin ? leads.filter(l=>l.next_follow_up && l.next_follow_up<=today() && !['enrolled','lost'].includes(l.status)) : [];
  const newLeads=isAdmin ? leads.filter(l=>l.status==='new') : [];
  const todayAttendance=attendance.filter(a=>a.lesson_date===today());
  const todayAttendanceRate=todayAttendance.length?Math.round(todayAttendance.filter(a=>a.status==='present'||a.status==='late').length/todayAttendance.length*100):0;

  const fill=groups.reduce((a,g)=>a+students.filter(s=>s.group_id===g.id).length,0);
  const capacity=groups.reduce((a,g)=>a+Number(g.capacity||0),0);
  const greeting=new Date().getHours()<12?'Good morning':new Date().getHours()<18?'Good afternoon':'Good evening';
  const quickActions=[
    ['students','Students','students'],
    ...(can('owner','admin','cashier')?[['payments','Payments','payments']]:[]),
    ...(can('owner','admin','teacher')?[['attendance','Attendance','attendance']]:[]),
    ...(can('owner','admin')?[['expenses','Expenses','expenses']]:[])
  ];


  if(isAdmin){
    const adminQuickActions=[
      ['leads','Leads','leads'],
      ['students','Students','students'],
      ['attendance','Attendance','attendance'],
      ['payments','Payments','payments']
    ];
    const todayClassesPanel='<section class="panel"><div class="panel-head"><div><h2>Today\'s classes</h2><p>'+esc(dayName)+' · live teaching schedule</p></div><span class="badge '+(todayGroups.length?'info':'')+'">'+todayGroups.length+' class'+(todayGroups.length===1?'':'es')+'</span></div><div class="panel-body">'+
      (todayGroups.length
        ? '<div class="list">'+todayGroups.map(g=>{const count=students.filter(s=>s.group_id===g.id).length;const details=[formattedGroupSchedule(g),g.staff?.full_name||'No teacher assigned',g.room?'Room '+g.room:null,count+' student'+(count===1?'':'s')].filter(Boolean).join(' · ');return '<div class="list-item"><div class="list-main"><strong>'+esc(g.name)+'</strong><span>'+esc(details)+'</span></div><span class="badge success">Today</span></div>';}).join('')+'</div>'
        : '<div class="section-note">No active groups are scheduled for '+esc(dayName)+'.</div>')+
      '</div></section>';

    const followUpPanel='<section class="panel"><div class="panel-head"><div><h2>Lead follow-ups</h2><p>People who need contact today or are already overdue</p></div><span class="badge '+(followUpsDue.length?'warn':'success')+'">'+followUpsDue.length+' due</span></div><div class="panel-body">'+
      (followUpsDue.length
        ? '<div class="list">'+followUpsDue.slice(0,8).map(l=>'<div class="list-item"><div class="list-main"><strong>'+esc(l.full_name)+'</strong><span>'+esc([l.interested_course,l.phone||l.parent_phone].filter(Boolean).join(' · ')||'Lead')+'</span></div><div class="row-actions"><span class="badge '+(l.next_follow_up<today()?'danger':'warn')+'">'+(l.next_follow_up<today()?'Overdue':'Today')+'</span></div></div>').join('')+'</div>'
        : '<div class="section-note">No lead follow-ups are due today.</div>')+
      (newLeads.length?'<div class="section-note" style="margin-top:12px"><strong>'+newLeads.length+' new lead'+(newLeads.length===1?'':'s')+'</strong> still waiting for first contact.</div>':'')+
      '</div></section>';

    const paymentPanel='<section class="panel"><div class="panel-head"><div><h2>Payment attention</h2><p>This month\'s unpaid and partially paid students</p></div><span class="badge '+(unpaid.length?'warn':'success')+'">'+unpaid.length+' student'+(unpaid.length===1?'':'s')+'</span></div><div class="panel-body">'+
      '<div class="section-note"><strong>'+Math.round(expected?revenue/expected*100:0)+'% collected</strong> · '+fmtMoney(Math.max(0,expected-revenue))+' outstanding this month.</div>'+
      (unpaid.length
        ? '<div class="list" style="margin-top:12px">'+unpaid.slice(0,8).map(s=>{const due=Math.max(0,Number(s.monthly_fee)-Number(s.discount_amount));const paid=paidByStudent.get(s.id)||0;const balance=Math.max(0,due-paid);return '<div class="list-item"><div class="list-main"><strong>'+esc(s.full_name)+'</strong><span>'+esc(groupNameById.get(s.group_id)||'Unassigned')+'</span></div><span class="badge '+(paid>0?'warn':'danger')+'">'+fmtMoney(balance)+' due</span></div>';}).join('')+'</div>'
        : '<div class="section-note" style="margin-top:12px">All current student fees are fully paid or free.</div>')+
      '</div></section>';

    const adminSupportPanel='<section class="panel"><div class="panel-head"><div><h2>Students needing extra support</h2><p>Attendance below 75% or recent test average below 70%</p></div><span class="badge '+(supportStudents.length?'warn':'success')+'">'+supportStudents.length+' student'+(supportStudents.length===1?'':'s')+'</span></div><div class="panel-body">'+
      (supportStudents.length
        ? '<div class="list">'+supportStudents.slice(0,10).map(s=>'<div class="list-item"><div class="list-main"><strong>'+esc(s.full_name)+'</strong><span>'+esc(s.group_name)+'</span></div><div class="row-actions">'+s.reasons.map(r=>'<span class="badge warn">'+esc(r)+'</span>').join('')+'</div></div>').join('')+'</div>'
        : '<div class="section-note">No students currently fall below the support thresholds.</div>')+
      '</div></section>';

    return '<section class="dashboard-welcome"><div><span class="internal-eyebrow">VISION LEARNING CENTRE · ADMINISTRATION</span><h2>'+greeting+', '+esc((state.profile?.full_name||'').split(' ')[0]||'there')+'.</h2><p>Here is what needs administrative attention today.</p></div><div class="quick-actions">'+adminQuickActions.map(a=>'<button class="quick-action" data-route="'+a[0]+'"><span>'+uiIcon(a[2])+'</span>'+a[1]+'</button>').join('')+'</div></section>'+
      '<div class="cards dashboard-cards">'+
        statCard('Active students',students.length,'Across '+groups.length+' active groups','students')+
        statCard('Active groups',groups.length,'Currently running classes','groups')+
        statCard("Today\'s classes",todayGroups.length,dayName+' teaching schedule','attendance')+
        statCard('Follow-ups due',followUpsDue.length,(newLeads.length?newLeads.length+' new lead'+(newLeads.length===1?'':'s')+' waiting':'Lead pipeline is clear'),'alert')+
      '</div>'+
      '<div class="grid-2">'+todayClassesPanel+followUpPanel+'</div>'+
      '<div class="grid-2" style="margin-top:16px">'+paymentPanel+adminSupportPanel+'</div>'+
      '<section class="panel" style="margin-top:16px"><div class="panel-head"><div><h2>Attendance snapshot</h2><p>Centre-wide attendance monitoring</p></div></div><div class="panel-body"><div class="finance-summary"><div class="finance-kpi"><span>This month</span><strong>'+attendanceRate+'%</strong></div><div class="finance-kpi"><span>Today</span><strong>'+todayAttendanceRate+'%</strong></div><div class="finance-kpi"><span>Today records</span><strong>'+todayAttendance.length+'</strong></div><div class="finance-kpi"><span>Month records</span><strong>'+attendance.length+'</strong></div></div></div></section>';
  }

  const teacherSupportPanel=isTeacher
    ? '<section class="panel"><div class="panel-head"><div><h2>Students needing extra support</h2><p>Based on this month\'s attendance and the latest three scored assessments from the last 90 days.</p></div><span class="badge '+(supportStudents.length?'warn':'success')+'">'+supportStudents.length+' student'+(supportStudents.length===1?'':'s')+'</span></div><div class="panel-body">'+
      (supportStudents.length
        ? '<div class="list">'+supportStudents.slice(0,10).map(s=>'<div class="list-item"><div class="list-main"><strong>'+esc(s.full_name)+'</strong><span>'+esc(s.group_name)+'</span></div><div class="row-actions">'+s.reasons.map(r=>'<span class="badge warn">'+esc(r)+'</span>').join('')+'</div></div>').join('')+'</div>'
        : '<div class="section-note">No students currently fall below the support thresholds. Attendance must be below 75% or the recent test average below 70% to appear here.</div>')+
      '</div></section>'
    : '';

  return '<section class="dashboard-welcome"><div><span class="internal-eyebrow">VISION LEARNING CENTRE</span><h2>'+greeting+', '+esc((state.profile?.full_name||'').split(' ')[0]||'there')+'.</h2><p>Here is what needs your attention today.</p></div><div class="quick-actions">'+quickActions.map(a=>'<button class="quick-action" data-route="'+a[0]+'"><span>'+uiIcon(a[2])+'</span>'+a[1]+'</button>').join('')+'</div></section>'+
  '<div class="cards dashboard-cards '+(can('owner','admin','cashier')?'has-finance':'')+'">'+
    statCard(isTeacher?'My active students':'Active students',students.length,isTeacher?'Across '+groups.length+' assigned active groups':'Across '+groups.length+' active groups','students')+
    (can('owner','admin','cashier')?statCard('Expected this month',fmtMoney(expected),'Total scheduled student fees','payments'):'')+
    statCard(can('owner','admin','cashier')?'Collected this month':'My active groups',can('owner','admin','cashier')?fmtMoney(revenue):groups.length,can('owner','admin','cashier')?Math.round(expected?revenue/expected*100:0)+'% collected · '+fmtMoney(Math.max(0,expected-revenue))+' outstanding':'Assigned teaching view','payments')+
    statCard(can('owner','admin','teacher')?(isTeacher?'Attendance this month':'Attendance rate'):'Group capacity',can('owner','admin','teacher')?attendanceRate+'%':(capacity?Math.round(fill/capacity*100):0)+'%',can('owner','admin','teacher')?attendance.length+' attendance records':fill+' / '+capacity+' places','attendance')+
    statCard(can('owner','admin','cashier')?'Unpaid students':'Students needing support',can('owner','admin','cashier')?unpaid.length:supportStudents.length,can('owner','admin','cashier')?'Current month':'Attendance <75% or tests <70%','alert')+
  '</div>'+
  '<div class="grid-2"><section class="panel"><div class="panel-head"><div><h2>Groups overview</h2><p>Current occupancy and monthly fee</p></div></div><div class="panel-body">'+
    (groups.length?'<div class="kpi-list">'+groups.map(g=>{const c=students.filter(s=>s.group_id===g.id).length;const pct=Math.min(100,Math.round(c/Number(g.capacity||1)*100));return '<div class="kpi-line"><div class="kpi-line-head"><strong>'+esc(g.name)+'</strong><span>'+c+' / '+g.capacity+'</span></div><div class="progress"><span style="width:'+pct+'%"></span></div><div class="muted" style="font-size:11px">'+fmtMoney(g.default_monthly_fee)+' default fee</div></div>';}).join('')+'</div>':empty('No active groups.'))+
  '</div></section><section class="panel"><div class="panel-head"><div><h2>'+ (can('owner','admin','cashier')?'Payment attention':"Today's teaching") +'</h2><p>'+ (can('owner','admin','cashier')?'Students without a payment this month':dayName+' · groups scheduled today') +'</p></div></div><div class="panel-body">'+
    (can('owner','admin','cashier')
      ? ((overpaymentTotal>0?'<div class="section-note correction-note"><strong>Payment correction needed</strong><br>'+fmtMoney(overpaymentTotal)+' is above students\' expected fees this month. Review Finance → Payments history.</div>':'')+(unpaid.length?'<div class="list">'+unpaid.slice(0,8).map(s=>{const due=Math.max(0,Number(s.monthly_fee)-Number(s.discount_amount));const paid=paidByStudent.get(s.id)||0;const balance=Math.max(0,due-paid);const status=paid>0?'Partial':'Unpaid';return '<div class="list-item"><div class="list-main"><strong>'+esc(s.full_name)+'</strong><span>'+fmtMoney(balance)+' remaining</span></div><span class="badge '+(paid>0?'warn':'danger')+'">'+status+'</span></div>';}).join('')+'</div>':overpaymentTotal>0?'':empty('All current fees are fully paid or free.')))
      : (todayGroups.length
          ? '<div class="list">'+todayGroups.map(g=>{const count=students.filter(s=>s.group_id===g.id).length;const detail=[formattedGroupSchedule(g),g.room?'Room '+g.room:null,count+' student'+(count===1?'':'s')].filter(Boolean).join(' · ');return '<div class="list-item"><div class="list-main"><strong>'+esc(g.name)+'</strong><span>'+esc(detail)+'</span></div><span class="badge success">Today</span></div>';}).join('')+'</div>'
          : '<div class="section-note">No assigned groups are scheduled for '+esc(dayName)+'. Groups appear here automatically when their schedule includes today\'s day.</div>'))+
  '</div></section></div>'+
  teacherSupportPanel;
}
function statCard(label,value,note,icon){return '<div class="stat"><div class="stat-top"><span class="stat-label">'+esc(label)+'</span><span class="stat-icon">'+uiIcon(icon)+'</span></div><div class="stat-value">'+esc(value)+'</div><div class="stat-note">'+esc(note)+'</div></div>';}

async function studentsPage(){
  const feeMonth=monthStart();
  const [students,groups,payments]=await Promise.all([
    query(sb.from('students').select('*, groups(name,teacher_id,staff(full_name))').order('full_name')),
    query(sb.from('groups').select('id,name,default_monthly_fee').eq('active',true).order('name')),
    can('owner','admin','cashier')?query(sb.from('payments').select('student_id,amount,fee_month,voided_at').eq('fee_month',feeMonth).is('voided_at',null)):Promise.resolve([])
  ]);
  state.cache.groups=groups;
  const paidMap=new Map();
  payments.forEach(p=>paidMap.set(p.student_id,(paidMap.get(p.student_id)||0)+Number(p.amount||0)));
  const search=(state.filters.studentSearch||'').toLowerCase();
  const statusFilter=state.filters.studentStatus||'active';
  const decorated=students.map(s=>{
    const due=s.is_free_place?0:Math.max(0,Number(s.monthly_fee||0)-Number(s.discount_amount||0));
    const paid=paidMap.get(s.id)||0;
    const balance=Math.max(0,due-paid);
    const payment_status=s.is_free_place?'free':paid<=0?'unpaid':balance>0?'partial':'paid';
    return {...s,due,paid,balance,payment_status};
  });
  const visible=decorated.filter(s=>{
    const matchesStatus=statusFilter==='all'||s.status===statusFilter;
    const hay=[s.full_name,s.phone,s.parent_phone,s.grade_or_age,s.groups?.name].filter(Boolean).join(' ').toLowerCase();
    return matchesStatus&&(!search||hay.includes(search));
  });
  const activeCount=decorated.filter(s=>s.status==='active').length;
  const attention=decorated.filter(s=>s.status==='active'&&(s.payment_status==='partial'||s.payment_status==='unpaid')).length;
  const freeCount=decorated.filter(s=>s.status==='active'&&s.is_free_place).length;
  const add=can('owner','admin','cashier')?'<button class="btn btn-primary" data-action="student-new">'+uiIcon('plus')+'Add student</button>':'';
  const rows=visible.map(s=>'<tr class="student-row" data-student-open="'+s.id+'">'+
    '<td><div class="student-identity"><div class="student-avatar">'+esc(initials(s.full_name))+'</div><div><strong>'+esc(s.full_name)+'</strong><span>'+esc(s.phone||s.parent_phone||'No phone')+'</span></div></div></td>'+
    '<td><span class="course-pill">'+esc(s.groups?.name||'Unassigned')+'</span><div class="muted row-sub">'+esc(s.groups?.staff?.full_name||'No teacher')+'</div></td>'+
    '<td>'+fmtDate(s.join_date)+'</td>'+
    (can('owner','admin','cashier')?'<td class="num"><strong class="'+(s.balance>0?'balance-due':'balance-clear')+'">'+(s.is_free_place?'—':fmtMoney(s.balance))+'</strong><div class="muted row-sub">'+(s.is_free_place?'Free place':s.payment_status==='paid'?'Paid this month':humanize(s.payment_status))+'</div></td>':'')+
    '<td><span class="badge '+(s.status==='active'?'success':s.status==='paused'?'warn':'')+'">'+esc(humanize(s.status))+'</span></td>'+
    '<td class="student-actions"><button class="kebab-btn" data-student-menu="'+s.id+'" title="Student actions" aria-label="Student actions">•••</button></td>'+
  '</tr>').join('');
  setTimeout(()=>bindStudentActions(decorated,groups),0);
  const headers=[['Student',''],['Group',''],['Joined',''],...(can('owner','admin','cashier')?[['Balance','num']]:[]),['Status',''],['','']];
  return '<div class="student-summary">'+
    '<div class="mini-metric"><span>Active students</span><strong>'+activeCount+'</strong></div>'+
    '<div class="mini-metric"><span>Groups</span><strong>'+groups.length+'</strong></div>'+
    (can('owner','admin','cashier')?'<div class="mini-metric attention"><span>Need payment attention</span><strong>'+attention+'</strong></div><div class="mini-metric"><span>Free places</span><strong>'+freeCount+'</strong></div>':'')+
  '</div>'+
  '<section class="panel student-operations"><div class="panel-head"><div><h2>Students</h2><p>Search, review balances and open a complete student profile.</p></div>'+add+'</div>'+
    '<div class="panel-body">'+
      '<div class="student-toolbar"><div class="student-search">'+uiIcon('students')+'<input id="student-search" placeholder="Search student, phone or group…" value="'+esc(state.filters.studentSearch||'')+'"></div>'+
      '<div class="status-chips student-status-chips">'+
        '<button class="status-chip '+(statusFilter==='active'?'active':'')+'" data-student-status="active">Active</button>'+
        '<button class="status-chip '+(statusFilter==='paused'?'active':'')+'" data-student-status="paused">Paused</button>'+
        '<button class="status-chip '+(statusFilter==='left'?'active':'')+'" data-student-status="left">Left</button>'+
        '<button class="status-chip '+(statusFilter==='all'?'active':'')+'" data-student-status="all">All</button>'+
      '</div></div>'+
      (rows?'<div class="table-wrap student-table"><table><thead><tr>'+headers.map(h=>'<th class="'+(h[1]||'')+'">'+esc(h[0])+'</th>').join('')+'</tr></thead><tbody>'+rows+'</tbody></table></div>':empty('No students match these filters.'))+
    '</div></section>';
}
function studentForm(s={},groups=[]){
  const groupOpts=[['','Unassigned'],...groups.map(g=>[g.id,g.name])];
  return '<div class="form-cols">'+
    field('Full name','full_name',s.full_name||'','','required')+
    field('Grade / age','grade_or_age',s.grade_or_age||'')+
    field('Student phone','phone',s.phone||'','tel')+
    field('Parent phone','parent_phone',s.parent_phone||'','tel')+
    selectField('Group','group_id',groupOpts,s.group_id||'')+
    field('Join date','join_date',s.join_date||today(),'date')+
    field('Monthly fee','monthly_fee',s.monthly_fee??'', 'number','min="0" step="1"')+
    field('Discount amount','discount_amount',s.discount_amount??0,'number','min="0" step="1"')+
    selectField('Status','status',[['active','Active'],['paused','Paused'],['left','Left']],s.status||'active')+
    '<div class="field"><label>Free place</label><label class="inline-check"><input type="checkbox" name="is_free_place" '+(s.is_free_place?'checked':'')+'> Student studies free</label></div>'+
    textArea('Notes','notes',s.notes||'')+'</div>';
}
function bindStudentActions(students,groups){
  document.querySelector('[data-action="student-new"]')?.addEventListener('click',()=>openModal('Add student',studentForm({},groups),async f=>{
    const gid=val(f,'group_id'); const g=groups.find(x=>x.id===gid);
    const payload={full_name:val(f,'full_name'),grade_or_age:val(f,'grade_or_age')||null,phone:val(f,'phone')||null,parent_phone:val(f,'parent_phone')||null,group_id:gid||null,join_date:val(f,'join_date')||today(),monthly_fee:Number(val(f,'monthly_fee')||g?.default_monthly_fee||0),discount_amount:Number(val(f,'discount_amount')||0),is_free_place:checked(f,'is_free_place'),status:val(f,'status'),notes:val(f,'notes')||null};
    if(payload.discount_amount>payload.monthly_fee&&!payload.is_free_place)throw new Error('Discount cannot be greater than the monthly fee.');
    await query(sb.from('students').insert(payload));
  }));
  document.querySelectorAll('[data-student-open]').forEach(row=>row.onclick=e=>{
    if(e.target.closest('[data-student-menu]'))return;
    openStudentProfile(row.dataset.studentOpen,'overview',groups);
  });
  document.querySelectorAll('[data-student-menu]').forEach(btn=>btn.onclick=e=>{
    e.stopPropagation();
    const s=students.find(x=>x.id===btn.dataset.studentMenu);
    openStudentQuickActions(s,groups);
  });
  const searchEl=document.getElementById('student-search');
  if(searchEl){
    let timer;
    searchEl.oninput=()=>{clearTimeout(timer);timer=setTimeout(()=>{state.filters.studentSearch=searchEl.value;renderRoute();},250);};
  }
  document.querySelectorAll('[data-student-status]').forEach(b=>b.onclick=()=>{state.filters.studentStatus=b.dataset.studentStatus;renderRoute();});
}
function openStudentQuickActions(student,groups){
  const body='<div class="action-sheet">'+
    '<button type="button" class="action-sheet-btn" data-student-action="profile"><span>'+uiIcon('students')+'</span><div><strong>Open profile</strong><small>Payments, attendance and progress</small></div></button>'+
    (can('owner','admin','cashier')?'<button type="button" class="action-sheet-btn" data-student-action="payment"><span>'+uiIcon('payments')+'</span><div><strong>Record payment</strong><small>Record this student\'s fee payment</small></div></button>':'')+
    (can('owner','admin','cashier')?'<button type="button" class="action-sheet-btn" data-student-action="edit"><span>'+uiIcon('settings')+'</span><div><strong>Edit details</strong><small>Group, fee, phone and status</small></div></button>':'')+
  '</div>';
  openModal(student.full_name,body,async()=>{},'Close');
  const form=modalRoot.querySelector('#modal-form');
  const submit=form.querySelector('[type=submit]'); if(submit) submit.style.display='none';
  form.querySelectorAll('[data-student-action]').forEach(b=>b.onclick=()=>{
    const action=b.dataset.studentAction; closeModal();
    if(action==='profile')openStudentProfile(student.id,'overview',groups);
    if(action==='payment')openStudentPayment(student);
    if(action==='edit')openStudentEdit(student,groups);
  });
}
function openStudentEdit(student,groups){
  openModal('Edit student',studentForm(student,groups),async f=>{
    const payload={full_name:val(f,'full_name'),grade_or_age:val(f,'grade_or_age')||null,phone:val(f,'phone')||null,parent_phone:val(f,'parent_phone')||null,group_id:val(f,'group_id')||null,join_date:val(f,'join_date'),monthly_fee:Number(val(f,'monthly_fee')||0),discount_amount:Number(val(f,'discount_amount')||0),is_free_place:checked(f,'is_free_place'),status:val(f,'status'),notes:val(f,'notes')||null};
    if(payload.discount_amount>payload.monthly_fee&&!payload.is_free_place)throw new Error('Discount cannot be greater than the monthly fee.');
    await query(sb.from('students').update(payload).eq('id',student.id));
  });
}
function openStudentPayment(student){
  const currentMonth=localYM();
  const due=student.is_free_place?0:Math.max(0,Number(student.monthly_fee||0)-Number(student.discount_amount||0));
  if(student.is_free_place){toast('This student is marked as a free place.','error');return;}
  openModal('Record payment · '+student.full_name,'<div class="form-cols">'+
    field('Course month','fee_month',currentMonth,'month','required')+
    field('Amount','amount','','number','required min="1" step="1"')+
    field('Paid date','paid_at',today(),'date','required')+
    selectField('Method','method',[['cash','Cash'],['card_transfer','Card / transfer'],['other','Other']],'cash')+
    field('Reference','reference','')+
    textArea('Notes','notes','')+'</div>',async form=>{
      const m=val(form,'fee_month');
      const monthKey=m+'-01';
      const existing=await query(sb.from('payments').select('amount,voided_at').eq('student_id',student.id).eq('fee_month',monthKey).is('voided_at',null));
      const paid=existing.reduce((a,p)=>a+Number(p.amount||0),0);
      const remaining=Math.max(0,due-paid);
      const amount=Number(val(form,'amount'));
      if(amount<=0)throw new Error('Enter a valid payment amount.');
      if(m===currentMonth&&amount>remaining)throw new Error('This is more than the remaining balance ('+fmtMoney(remaining)+').');
      await query(sb.from('payments').insert({student_id:student.id,fee_month:monthKey,amount,paid_at:val(form,'paid_at'),method:val(form,'method'),reference:val(form,'reference')||null,notes:val(form,'notes')||null,created_by:state.session.user.id}));
    },'Save payment');
  const monthEl=modalRoot.querySelector('[name=fee_month]');
  const amountEl=modalRoot.querySelector('[name=amount]');
  const recalc=async()=>{
    const m=monthEl.value;
    const monthKey=m+'-01';
    const existing=await query(sb.from('payments').select('amount,voided_at').eq('student_id',student.id).eq('fee_month',monthKey).is('voided_at',null));
    const paid=existing.reduce((a,p)=>a+Number(p.amount||0),0);
    const remaining=Math.max(0,due-paid);
    amountEl.value=remaining>0?remaining:'';
    amountEl.disabled=remaining<=0;
    if(remaining<=0) toast('This course month is already fully paid.','error');
  };
  monthEl.onchange=()=>void recalc();
  void recalc();
}
async function openStudentProfile(studentId,tab='overview',groups=[]){
  try{
    modalRoot.innerHTML='<div class="drawer-backdrop"><aside class="student-drawer"><div class="drawer-loading">Loading student profile…</div></aside></div>';
    modalRoot.querySelector('.drawer-backdrop').onclick=e=>{if(e.target.classList.contains('drawer-backdrop'))closeModal();};
    const monthFirst=monthStart();
    const ninety=new Date();ninety.setDate(ninety.getDate()-90);
    const ninetyDate=localYMD(ninety);
    const [student,payments,attendance,academic]=await Promise.all([
      query(sb.from('students').select('*, groups(name,level,schedule,room,staff(full_name))').eq('id',studentId).single()),
      query(sb.from('payments').select('*').eq('student_id',studentId).is('voided_at',null).order('fee_month',{ascending:false}).order('paid_at',{ascending:false}).limit(60)),
      query(sb.from('attendance').select('*').eq('student_id',studentId).gte('lesson_date',ninetyDate).order('lesson_date',{ascending:false}).limit(100)),
      query(sb.from('academic_records').select('*').eq('student_id',studentId).order('record_date',{ascending:false}).limit(50))
    ]);
    const monthPaid=payments.filter(p=>p.fee_month===monthFirst).reduce((a,p)=>a+Number(p.amount||0),0);
    const due=student.is_free_place?0:Math.max(0,Number(student.monthly_fee||0)-Number(student.discount_amount||0));
    const balance=Math.max(0,due-monthPaid);
    const paymentStatus=student.is_free_place?'free':monthPaid<=0?'unpaid':balance>0?'partial':'paid';
    const present=attendance.filter(a=>a.status==='present'||a.status==='late').length;
    const attendanceRate=attendance.length?Math.round(present/attendance.length*100):0;
    const tabs=['overview','payments','attendance','academic','notes'];
    const tabLabels={overview:'Overview',payments:'Payments',attendance:'Attendance',academic:'Academic',notes:'Notes'};
    const tabNav=tabs.map(t=>'<button class="drawer-tab '+(tab===t?'active':'')+'" data-profile-tab="'+t+'">'+tabLabels[t]+'</button>').join('');
    let body='';
    if(tab==='overview'){
      body='<div class="profile-grid">'+
        '<div class="profile-card"><span>Group</span><strong>'+esc(student.groups?.name||'Unassigned')+'</strong><small>'+esc(student.groups?.staff?.full_name||'No teacher')+'</small></div>'+
        '<div class="profile-card"><span>Monthly fee</span><strong>'+fmtMoney(due)+'</strong><small>'+(student.discount_amount?fmtMoney(student.discount_amount)+' discount':'No discount')+'</small></div>'+
        '<div class="profile-card"><span>Current balance</span><strong class="'+(balance>0?'balance-due':'balance-clear')+'">'+(student.is_free_place?'Free':fmtMoney(balance))+'</strong><small>'+humanize(paymentStatus)+'</small></div>'+
        '<div class="profile-card"><span>Attendance · 90 days</span><strong>'+attendanceRate+'%</strong><small>'+attendance.length+' recorded lessons</small></div>'+
      '</div>'+
      '<div class="profile-section"><h4>Contact & enrolment</h4><div class="detail-list">'+
        detailRow('Student phone',student.phone||'—')+detailRow('Parent phone',student.parent_phone||'—')+detailRow('Grade / age',student.grade_or_age||'—')+detailRow('Joined',fmtDate(student.join_date))+detailRow('Status',humanize(student.status))+
      '</div></div>'+
      '<div class="profile-section"><h4>Class information</h4><div class="detail-list">'+detailRow('Schedule',student.groups?.schedule||'—')+detailRow('Room',student.groups?.room||'—')+detailRow('Level',student.groups?.level||'—')+'</div></div>';
    }else if(tab==='payments'){
      const rows=payments.map(p=>'<tr><td>'+new Date(p.fee_month+'T00:00:00').toLocaleDateString('en-GB',{month:'short',year:'numeric'})+'</td><td>'+fmtDate(p.paid_at)+'</td><td class="num">'+fmtMoney(p.amount)+'</td><td>'+paymentMethodLabel(p.method)+'</td></tr>').join('');
      body=rows?'<div class="table-wrap drawer-table"><table><thead><tr><th>Course month</th><th>Paid on</th><th class="num">Amount</th><th>Method</th></tr></thead><tbody>'+rows+'</tbody></table></div>':empty('No payments recorded for this student.');
    }else if(tab==='attendance'){
      const rows=attendance.map(a=>'<tr><td>'+fmtDate(a.lesson_date)+'</td><td><span class="badge '+(a.status==='present'?'success':a.status==='late'?'warn':'danger')+'">'+humanize(a.status)+'</span></td><td>'+esc(a.notes||'—')+'</td></tr>').join('');
      body='<div class="drawer-summary-line"><span>90-day attendance rate</span><strong>'+attendanceRate+'%</strong></div>'+(rows?'<div class="table-wrap drawer-table"><table><thead><tr><th>Date</th><th>Status</th><th>Note</th></tr></thead><tbody>'+rows+'</tbody></table></div>':empty('No attendance records yet.'));
    }else if(tab==='academic'){
      const rows=academic.map(r=>'<tr><td>'+fmtDate(r.record_date)+'</td><td>'+esc(r.record_type)+'</td><td>'+esc(r.topic||'—')+'</td><td>'+(r.score==null?'—':esc(r.score)+' / '+esc(r.max_score??'—'))+'</td></tr>').join('');
      body=rows?'<div class="table-wrap drawer-table"><table><thead><tr><th>Date</th><th>Type</th><th>Topic</th><th>Score</th></tr></thead><tbody>'+rows+'</tbody></table></div>':empty('No academic records yet.');
    }else{
      body='<div class="profile-notes">'+(student.notes?'<p>'+esc(student.notes).replace(/\n/g,'<br>')+'</p>':empty('No student notes yet.'))+'</div>';
    }
    modalRoot.innerHTML='<div class="drawer-backdrop"><aside class="student-drawer">'+
      '<div class="drawer-head"><button class="icon-btn drawer-close" aria-label="Close">×</button><div class="profile-hero"><div class="student-avatar large">'+esc(initials(student.full_name))+'</div><div><h3>'+esc(student.full_name)+'</h3><p>'+esc(student.groups?.name||'Unassigned')+' · '+esc(student.grade_or_age||'Student')+'</p><div class="profile-badges"><span class="badge '+(student.status==='active'?'success':student.status==='paused'?'warn':'')+'">'+humanize(student.status)+'</span>'+(can('owner','admin','cashier')?'<span class="badge payment-'+paymentStatus+'">'+humanize(paymentStatus)+'</span>':'')+'</div></div></div>'+
      '<div class="drawer-actions">'+(can('owner','admin','cashier')&&!student.is_free_place?'<button class="btn btn-primary" data-profile-action="payment">'+uiIcon('payments')+'Payment</button>':'')+(can('owner','admin','cashier')?'<button class="btn btn-secondary" data-profile-action="edit">Edit</button>':'')+'</div></div>'+
      '<nav class="drawer-tabs">'+tabNav+'</nav><div class="drawer-body">'+body+'</div>'+
    '</aside></div>';
    modalRoot.querySelector('.drawer-close').onclick=closeModal;
    modalRoot.querySelector('.drawer-backdrop').onclick=e=>{if(e.target.classList.contains('drawer-backdrop'))closeModal();};
    modalRoot.querySelectorAll('[data-profile-tab]').forEach(b=>b.onclick=()=>openStudentProfile(student.id,b.dataset.profileTab,groups));
    modalRoot.querySelector('[data-profile-action="payment"]')?.addEventListener('click',()=>{closeModal();openStudentPayment(student);});
    modalRoot.querySelector('[data-profile-action="edit"]')?.addEventListener('click',()=>{closeModal();openStudentEdit(student,groups.length?groups:state.cache.groups||[]);});
  }catch(e){closeModal();fail(e);}
}
function detailRow(label,value){return '<div class="detail-row"><span>'+esc(label)+'</span><strong>'+esc(value)+'</strong></div>';}

async function groupsPage(){
  const [groups,staff,students]=await Promise.all([
    query(sb.from('groups').select('*, staff(full_name)').order('name')),
    can('owner','admin')?query(sb.from('staff').select('id,full_name,role_title,active').eq('active',true).order('full_name')):Promise.resolve([]),
    query(sb.from('students').select('id,group_id,status').eq('status','active'))
  ]);
  const rows=groups.map(g=>{const n=students.filter(s=>s.group_id===g.id).length;return '<tr><td><strong>'+esc(g.name)+'</strong><div class="muted">'+esc(g.level||'')+'</div></td><td>'+esc(formattedGroupSchedule(g))+'</td><td>'+esc(g.staff?.full_name||'—')+'</td><td>'+n+' / '+g.capacity+'</td><td class="num">'+fmtMoney(g.default_monthly_fee)+'</td><td><span class="badge '+(g.active?'success':'')+'">'+(g.active?'Active':'Inactive')+'</span></td><td>'+(can('owner','admin')?actionButton('Edit','group-edit',g.id):'')+'</td></tr>';}).join('');
  setTimeout(()=>bindGroupActions(groups,staff),0);
  return tablePage('Class groups',can('owner','admin')?'<button class="btn btn-primary" data-action="group-new">'+uiIcon('plus')+'Add group</button>':'',[['Group',''],['Schedule',''],['Teacher',''],['Students',''],['Default fee','num'],['Status',''],['','']],rows,'No groups found.');
}
function groupForm(g={},staff=[]){
  const days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const selected=new Set(Array.isArray(g.meeting_days)?g.meeting_days:[]);
  const dayChecks='<div class="field span-2"><label>Teaching days</label><div class="weekday-checks">'+days.map(d=>'<label class="inline-check weekday-check"><input type="checkbox" name="meeting_days" value="'+d+'" '+(selected.has(d)?'checked':'')+'> '+d+'</label>').join('')+'</div></div>';
  return '<div class="form-cols">'+
    field('Group name','name',g.name||'','','required')+
    field('Level','level',g.level||'')+
    dayChecks+
    field('Start time','start_time',g.start_time?String(g.start_time).slice(0,5):'','time','required')+
    field('End time','end_time',g.end_time?String(g.end_time).slice(0,5):'','time','required')+
    field('Room','room',g.room||'')+
    selectField('Teacher','teacher_id',[['','Unassigned'],...staff.map(s=>[s.id,s.full_name])],g.teacher_id||'')+
    field('Capacity','capacity',g.capacity??20,'number','min="1"')+
    field('Default monthly fee','default_monthly_fee',g.default_monthly_fee??0,'number','min="0"')+
    field('Start date','start_date',g.start_date||'','date')+
    '<div class="field"><label>Status</label><label class="inline-check"><input type="checkbox" name="active" '+(g.active!==false?'checked':'')+'> Active group</label></div></div>';
}
function selectedGroupDays(form){
  return [...form.querySelectorAll('input[name="meeting_days"]:checked')].map(x=>x.value);
}
function formattedGroupSchedule(g){
  const days=Array.isArray(g.meeting_days)&&g.meeting_days.length?g.meeting_days.join(' / '):'';
  const start=g.start_time?String(g.start_time).slice(0,5):'';
  const end=g.end_time?String(g.end_time).slice(0,5):'';
  const time=start&&end?start+'–'+end:(start||end);
  return [days,time].filter(Boolean).join(' · ') || g.schedule || '—';
}
function bindGroupActions(groups,staff){
  document.querySelector('[data-action="group-new"]')?.addEventListener('click',()=>openModal('Add group',groupForm({},staff),async f=>{
    const meeting_days=selectedGroupDays(f);
    if(!meeting_days.length) throw new Error('Choose at least one teaching day.');
    const start_time=val(f,'start_time');
    const end_time=val(f,'end_time');
    if(start_time && end_time && end_time<=start_time) throw new Error('End time must be later than start time.');
    await query(sb.from('groups').insert({name:val(f,'name'),level:val(f,'level')||null,meeting_days,start_time:start_time||null,end_time:end_time||null,schedule:null,room:val(f,'room')||null,teacher_id:val(f,'teacher_id')||null,capacity:Number(val(f,'capacity')||20),default_monthly_fee:Number(val(f,'default_monthly_fee')||0),start_date:val(f,'start_date')||null,active:checked(f,'active')}));
  }));
  document.querySelectorAll('[data-action="group-edit"]').forEach(b=>b.onclick=()=>{const g=groups.find(x=>x.id===b.dataset.id);openModal('Edit group',groupForm(g,staff),async f=>{
    const meeting_days=selectedGroupDays(f);
    if(!meeting_days.length) throw new Error('Choose at least one teaching day.');
    const start_time=val(f,'start_time');
    const end_time=val(f,'end_time');
    if(start_time && end_time && end_time<=start_time) throw new Error('End time must be later than start time.');
    await query(sb.from('groups').update({name:val(f,'name'),level:val(f,'level')||null,meeting_days,start_time:start_time||null,end_time:end_time||null,schedule:null,room:val(f,'room')||null,teacher_id:val(f,'teacher_id')||null,capacity:Number(val(f,'capacity')||20),default_monthly_fee:Number(val(f,'default_monthly_fee')||0),start_date:val(f,'start_date')||null,active:checked(f,'active')}).eq('id',g.id));
  });});
}

async function leadsPage(){
  const [leads,groups]=await Promise.all([
    query(sb.from('leads').select('*').order('created_at',{ascending:false})),
    query(sb.from('groups').select('id,name,default_monthly_fee').eq('active',true).order('name'))
  ]);
  const rows=leads.map(l=>'<tr><td><strong>'+esc(l.full_name)+'</strong><div class="muted">'+esc(l.grade_or_age||'')+'</div></td><td>'+esc(l.phone||l.parent_phone||'—')+'</td><td>'+esc(l.interested_course||'—')+'</td><td>'+esc(l.source||'—')+'</td><td><span class="badge info">'+esc(humanize(l.status))+'</span></td><td>'+fmtDate(l.next_follow_up)+'</td><td><div class="action-row">'+actionButton('Edit','lead-edit',l.id)+(l.status!=='enrolled'&&l.status!=='lost'?actionButton('Enroll','lead-enroll',l.id,'primary'):'')+'</div></td></tr>').join('');
  setTimeout(()=>bindLeadActions(leads,groups),0);
  return '<div class="section-note"><strong>Lead pipeline</strong><br>Track enquiries from first contact through trial lesson and enrollment. Use <strong>Enroll</strong> to turn a lead into a student without retyping their details.</div>'+tablePage('Prospective students','<button class="btn btn-primary" data-action="lead-new">'+uiIcon('plus')+'Add lead</button>',[['Name',''],['Phone',''],['Course',''],['Source',''],['Status',''],['Follow-up',''],['','']],rows,'No leads yet.');
}
function leadForm(l={}){
  return '<div class="form-cols">'+field('Full name','full_name',l.full_name||'','','required')+field('Grade / age','grade_or_age',l.grade_or_age||'')+field('Phone','phone',l.phone||'','tel')+field('Parent phone','parent_phone',l.parent_phone||'','tel')+field('Interested course','interested_course',l.interested_course||'')+field('Source','source',l.source||'')+
  selectField('Status','status',[['new','New'],['contacted','Contacted'],['trial_booked','Trial booked'],['trial_attended','Trial attended'],['enrolled','Enrolled'],['lost','Lost']],l.status||'new')+field('Next follow-up','next_follow_up',l.next_follow_up||'','date')+textArea('Notes','notes',l.notes||'')+'</div>';
}
function bindLeadActions(leads,groups){
  document.querySelector('[data-action="lead-new"]')?.addEventListener('click',()=>openModal('Add lead',leadForm(),async f=>query(sb.from('leads').insert({full_name:val(f,'full_name'),grade_or_age:val(f,'grade_or_age')||null,phone:val(f,'phone')||null,parent_phone:val(f,'parent_phone')||null,interested_course:val(f,'interested_course')||null,source:val(f,'source')||null,status:val(f,'status'),next_follow_up:val(f,'next_follow_up')||null,notes:val(f,'notes')||null}))));
  document.querySelectorAll('[data-action="lead-edit"]').forEach(b=>b.onclick=()=>{const l=leads.find(x=>x.id===b.dataset.id);openModal('Edit lead',leadForm(l),async f=>query(sb.from('leads').update({full_name:val(f,'full_name'),grade_or_age:val(f,'grade_or_age')||null,phone:val(f,'phone')||null,parent_phone:val(f,'parent_phone')||null,interested_course:val(f,'interested_course')||null,source:val(f,'source')||null,status:val(f,'status'),next_follow_up:val(f,'next_follow_up')||null,notes:val(f,'notes')||null}).eq('id',l.id)));});
  document.querySelectorAll('[data-action="lead-enroll"]').forEach(b=>b.onclick=()=>{
    const l=leads.find(x=>x.id===b.dataset.id);
    const groupOpts=[['','Unassigned'],...groups.map(g=>[g.id,g.name])];
    const body='<div class="section-note span-2">This creates an active student record and marks the lead as enrolled.</div><div class="form-cols">'+
      field('Full name','full_name',l.full_name||'','','required')+
      field('Grade / age','grade_or_age',l.grade_or_age||'')+
      field('Student phone','phone',l.phone||'','tel')+
      field('Parent phone','parent_phone',l.parent_phone||'','tel')+
      selectField('Group','group_id',groupOpts,'')+
      field('Join date','join_date',today(),'date','required')+
      field('Monthly fee','monthly_fee','','number','min="0" step="1"')+
      field('Discount amount','discount_amount',0,'number','min="0" step="1"')+
      '<div class="field"><label>Free place</label><label class="inline-check"><input type="checkbox" name="is_free_place"> Student studies free</label></div>'+
      textArea('Student notes','notes',l.notes||'')+'</div>';
    openModal('Enroll '+l.full_name,body,async form=>{
      const gid=val(form,'group_id');
      const group=groups.find(g=>g.id===gid);
      const feeRaw=val(form,'monthly_fee');
      await query(sb.from('students').insert({
        full_name:val(form,'full_name'),grade_or_age:val(form,'grade_or_age')||null,
        phone:val(form,'phone')||null,parent_phone:val(form,'parent_phone')||null,
        group_id:gid||null,join_date:val(form,'join_date')||today(),
        monthly_fee:Number(feeRaw||group?.default_monthly_fee||0),
        discount_amount:Number(val(form,'discount_amount')||0),
        is_free_place:checked(form,'is_free_place'),status:'active',notes:val(form,'notes')||null
      }));
      await query(sb.from('leads').update({status:'enrolled',next_follow_up:null}).eq('id',l.id));
    },'Enroll student');
    const groupEl=modalRoot.querySelector('[name=group_id]');
    const feeEl=modalRoot.querySelector('[name=monthly_fee]');
    const setFee=()=>{const g=groups.find(x=>x.id===groupEl.value);if(g&&!feeEl.value)feeEl.value=g.default_monthly_fee||0;};
    groupEl.onchange=setFee;
  });
}
async function paymentsPage(){
  const selectedMonth=state.filters.paymentMonth||localYM();
  const feeMonth=selectedMonth+'-01';
  const [payments,students,groups,history]=await Promise.all([
    query(sb.from('payments').select('id,student_id,fee_month,amount,paid_at,method,reference,notes,voided_at').eq('fee_month',feeMonth).is('voided_at',null).order('paid_at',{ascending:false})),
    query(sb.from('students').select('id,full_name,group_id,monthly_fee,discount_amount,is_free_place,status').eq('status','active').order('full_name')),
    query(sb.from('groups').select('id,name').order('name')),
    query(sb.from('payments').select('id,student_id,fee_month,amount,paid_at,method,reference,voided_at,students(full_name)').is('voided_at',null).order('paid_at',{ascending:false}).limit(20))
  ]);
  const groupMap=new Map(groups.map(g=>[g.id,g.name]));
  const paidMap=new Map();
  const paymentDetailsMap=new Map();
  payments.forEach(p=>{
    paidMap.set(p.student_id,(paidMap.get(p.student_id)||0)+Number(p.amount||0));
    const list=paymentDetailsMap.get(p.student_id)||[];
    list.push(p);
    paymentDetailsMap.set(p.student_id,list);
  });
  const feeRows=students.map(s=>{
    const expected=s.is_free_place?0:Math.max(0,Number(s.monthly_fee||0)-Number(s.discount_amount||0));
    const paid=paidMap.get(s.id)||0;
    const balance=Math.max(0,expected-paid);
    const overpaid=Math.max(0,paid-expected);
    const status=s.is_free_place?'free':paid<=0?'unpaid':balance>0?'partial':overpaid>0?'overpaid':'paid';
    const transactions=(paymentDetailsMap.get(s.id)||[]).sort((a,b)=>String(b.paid_at).localeCompare(String(a.paid_at)));
    const latestPayment=transactions[0]||null;
    const methods=[...new Set(transactions.map(p=>paymentMethodLabel(p.method)))];
    return {...s,expected,paid,balance,overpaid,payment_status:status,transactions,latestPayment,paymentMethods:methods};
  });
  const counts={paid:feeRows.filter(x=>x.payment_status==='paid').length,partial:feeRows.filter(x=>x.payment_status==='partial').length,unpaid:feeRows.filter(x=>x.payment_status==='unpaid').length,free:feeRows.filter(x=>x.payment_status==='free').length,overpaid:feeRows.filter(x=>x.payment_status==='overpaid').length};
  const expectedTotal=feeRows.reduce((a,x)=>a+x.expected,0);
  const collected=feeRows.reduce((a,x)=>a+Math.min(x.paid,x.expected),0);
  const outstanding=feeRows.reduce((a,x)=>a+x.balance,0);
  const overpaidTotal=feeRows.reduce((a,x)=>a+x.overpaid,0);
  const statusFilter=state.filters.paymentStatus||'attention';
  const attentionCount=counts.unpaid+counts.partial;
  const paymentRowsHtml=list=>list.map(s=>'<tr>'+
    '<td><strong>'+esc(s.full_name)+'</strong><div class="muted">'+esc(groupMap.get(s.group_id)||'Unassigned')+'</div></td>'+
    '<td class="num">'+fmtMoney(s.expected)+'</td>'+
    '<td class="num">'+fmtMoney(s.paid)+'</td>'+
    '<td class="num"><strong>'+fmtMoney(s.balance)+'</strong>'+(s.overpaid>0?'<div class="muted row-sub balance-due">+'+fmtMoney(s.overpaid)+' over</div>':'')+'</td>'+
    '<td>'+(s.latestPayment?'<strong class="payment-detail-main">'+fmtDate(s.latestPayment.paid_at)+'</strong><div class="muted row-sub">'+(s.transactions.length>1?s.transactions.length+' payments':'1 payment')+'</div>':'<span class="muted">—</span>')+'</td>'+
    '<td>'+(s.paymentMethods.length?'<span class="method-label">'+esc(s.paymentMethods.join(' + '))+'</span>':'<span class="muted">—</span>')+'</td>'+
    '<td><span class="badge payment-'+s.payment_status+'">'+humanize(s.payment_status)+'</span></td>'+
    '<td>'+
      ((s.payment_status==='unpaid'||s.payment_status==='partial')
        ?'<button class="btn btn-sm btn-primary" data-action="payment-prefill" data-id="'+s.id+'">'+uiIcon('payments')+'Pay</button>'
        :s.payment_status==='paid'
          ?'<span class="completed-label">✓ Completed</span>'
          :s.payment_status==='free'
            ?'<span class="muted">No payment needed</span>'
            :'<span class="correction-label">Review history ↓</span>')+
    '</td>'+
  '</tr>').join('');
  const paymentPanels={
    attention:{
      title:'Needs payment',
      description:'These students still have a balance for this course month.',
      rows:feeRows.filter(x=>x.payment_status==='unpaid'||x.payment_status==='partial'),
      empty:'Everyone has completed payment for this month.'
    },
    paid:{
      title:'Paid students',
      description:'These students have completed their payment for this course month.',
      rows:feeRows.filter(x=>x.payment_status==='paid'),
      empty:'No students have fully paid yet.'
    },
    free:{
      title:'Free places',
      description:'These students are not expected to pay for this course month.',
      rows:feeRows.filter(x=>x.payment_status==='free'),
      empty:'No free-place students.'
    },
    overpaid:{
      title:'Corrections',
      description:'These students have payments above their expected fee and need review.',
      rows:feeRows.filter(x=>x.payment_status==='overpaid'),
      empty:'No payment corrections needed.'
    }
  };
  const historyRows=history.map(p=>'<tr><td>'+fmtDate(p.paid_at)+'</td><td><strong>'+esc(p.students?.full_name||'Student')+'</strong></td><td>'+new Date(p.fee_month+'T00:00:00').toLocaleDateString('en-GB',{month:'short',year:'numeric'})+'</td><td class="num">'+fmtMoney(p.amount)+'</td><td>'+esc(paymentMethodLabel(p.method))+'</td><td><div class="action-row"><span>'+esc(p.reference||'—')+'</span>'+(can('owner','admin','cashier')?'<button class="btn btn-sm btn-danger" data-action="payment-void" data-id="'+p.id+'">Correct</button>':'')+'</div></td></tr>').join('');
  setTimeout(()=>bindPaymentActions(students,feeRows),0);
  return '<div class="finance-summary">'+
    '<div class="finance-kpi"><span>Expected</span><strong>'+fmtMoney(expectedTotal)+'</strong></div>'+
    '<div class="finance-kpi success"><span>Collected</span><strong>'+fmtMoney(collected)+'</strong></div>'+
    '<div class="finance-kpi danger"><span>Outstanding</span><strong>'+fmtMoney(outstanding)+'</strong></div>'+
    '<div class="finance-kpi"><span>Collection rate</span><strong>'+(expectedTotal?Math.round(collected/expectedTotal*100):0)+'%</strong></div>'+
  '</div>'+
  (overpaidTotal>0?'<div class="section-note correction-note"><strong>Correction needed:</strong> '+fmtMoney(overpaidTotal)+' exceeds expected fees for this month. Use <strong>Correct</strong> in payment history for duplicate or mistaken entries.</div>':'')+
  '<section class="panel"><div class="panel-head"><div><h2>Monthly fee status</h2><p>See exactly who has paid, partially paid, or still owes for the selected course month.</p></div><div class="payment-head-actions"><div class="month-control"><label>Course month</label><input class="input" id="payment-month-filter" type="month" value="'+esc(selectedMonth)+'"></div><button class="btn btn-primary" data-action="payment-new">'+uiIcon('plus')+'Record payment</button></div></div>'+
    '<div class="panel-body">'+
      '<div class="payment-spaces">'+
        '<button type="button" class="payment-space attention '+(statusFilter==='attention'?'active':'')+'" data-payment-status="attention"><span class="payment-space-icon">'+uiIcon('alert')+'</span><span class="payment-space-copy"><strong>Needs payment</strong><small>Unpaid or partially paid</small></span><b>'+attentionCount+'</b></button>'+
        '<button type="button" class="payment-space paid '+(statusFilter==='paid'?'active':'')+'" data-payment-status="paid"><span class="payment-space-icon">'+uiIcon('attendance')+'</span><span class="payment-space-copy"><strong>Paid</strong><small>Balance fully cleared</small></span><b>'+counts.paid+'</b></button>'+
        '<button type="button" class="payment-space free '+(statusFilter==='free'?'active':'')+'" data-payment-status="free"><span class="payment-space-icon">'+uiIcon('students')+'</span><span class="payment-space-copy"><strong>Free places</strong><small>No monthly payment due</small></span><b>'+counts.free+'</b></button>'+
        '<button type="button" class="payment-space correction '+(statusFilter==='overpaid'?'active':'')+'" data-payment-status="overpaid"><span class="payment-space-icon">'+uiIcon('refresh')+'</span><span class="payment-space-copy"><strong>Corrections</strong><small>Overpayments to review</small></span><b>'+counts.overpaid+'</b></button>'+
      '</div>'+
      '<div class="payment-panel-stack">'+Object.entries(paymentPanels).map(([key,p])=>'<div class="payment-status-panel" data-payment-panel="'+key+'" '+(statusFilter===key?'':'hidden')+'>'+
        '<div class="payment-space-title"><div><h3>'+esc(p.title)+'</h3><p>'+esc(p.description)+'</p></div>'+(key==='attention'?'<span class="queue-count">'+attentionCount+' remaining</span>':'')+'</div>'+
        (p.rows.length?'<div class="table-wrap"><table><thead><tr><th>Student</th><th class="num">Fee</th><th class="num">Paid</th><th class="num">Balance</th><th>Paid on</th><th>Method</th><th>Status</th><th></th></tr></thead><tbody>'+paymentRowsHtml(p.rows)+'</tbody></table></div>':empty(p.empty))+
      '</div>').join('')+'</div>'+
    '</div></section>'+
    '<div class="section-spacer"></div>'+
    tablePage('Recent payment history','',[['Paid on',''],['Student',''],['Course month',''],['Amount','num'],['Method',''],['Reference','']],historyRows,'No payments recorded yet.');
}
function bindPaymentActions(students,feeRows){
  const openPayment=(studentId='')=>{
    if(!students.length){toast('Add an active student first.','error');return;}
    const selectedMonth=state.filters.paymentMonth||localYM();
    const owing=feeRows.filter(x=>x.payment_status==='unpaid'||x.payment_status==='partial');
    const initialId=studentId||owing[0]?.id||students[0].id;
    const body='<div class="form-cols">'+
      selectField('Student','student_id',students.map(s=>[s.id,s.full_name]),initialId)+
      field('Course month','fee_month',selectedMonth,'month','required')+
      field('Amount','amount','','number','required min="1" step="1"')+
      field('Paid date','paid_at',today(),'date','required')+
      selectField('Method','method',[['cash','Cash'],['card_transfer','Card / transfer'],['other','Other']],'cash')+
      field('Reference','reference','')+
      '<div class="span-2 payment-hint" id="payment-hint"></div>'+
      textArea('Notes','notes','')+'</div>';
    openModal('Record student payment',body,async form=>{
      const sid=val(form,'student_id');
      const row=feeRows.find(x=>x.id===sid);
      const amount=Number(val(form,'amount'));
      if(!amount||amount<=0)throw new Error('Enter a valid payment amount.');
      if(row?.is_free_place)throw new Error('This student is marked as a free place and does not owe a monthly fee.');
      if(row && amount>row.balance && val(form,'fee_month')===selectedMonth)throw new Error('This payment is higher than the remaining balance ('+fmtMoney(row.balance)+').');
      const m=val(form,'fee_month');
      await query(sb.from('payments').insert({student_id:sid,fee_month:m+'-01',amount,paid_at:val(form,'paid_at'),method:val(form,'method'),reference:val(form,'reference')||null,notes:val(form,'notes')||null,created_by:state.session.user.id}));
    },'Save payment');
    const studentEl=modalRoot.querySelector('[name=student_id]');
    const monthEl=modalRoot.querySelector('[name=fee_month]');
    const amountEl=modalRoot.querySelector('[name=amount]');
    const hint=modalRoot.querySelector('#payment-hint');
    const refreshHint=()=>{
      const row=feeRows.find(x=>x.id===studentEl.value);
      if(!row){hint.textContent='';return;}
      if(monthEl.value!==selectedMonth){
        const s=students.find(x=>x.id===studentEl.value);
        const due=s?.is_free_place?0:Math.max(0,Number(s?.monthly_fee||0)-Number(s?.discount_amount||0));
        amountEl.value=due||'';
        hint.innerHTML='<span>Different month selected.</span> Suggested full fee: <strong>'+fmtMoney(due)+'</strong>';
        return;
      }
      amountEl.value=row.balance>0?row.balance:'';
      amountEl.disabled=row.balance<=0||row.is_free_place;
      hint.innerHTML=row.is_free_place
        ?'<span class="badge payment-free">Free place</span> No payment is required.'
        :row.balance<=0
          ?'<span class="badge payment-paid">Fully paid</span> This month is already fully paid. Use payment history to correct a mistaken payment.'
          :'Fee: <strong>'+fmtMoney(row.expected)+'</strong> · Paid: <strong>'+fmtMoney(row.paid)+'</strong> · Remaining: <strong>'+fmtMoney(row.balance)+'</strong>';
    };
    studentEl.onchange=refreshHint;monthEl.onchange=refreshHint;refreshHint();
  };
  document.querySelector('[data-action="payment-new"]')?.addEventListener('click',()=>openPayment());
  document.querySelectorAll('[data-action="payment-prefill"]').forEach(b=>b.onclick=()=>openPayment(b.dataset.id));
  document.getElementById('payment-month-filter')?.addEventListener('change',e=>{state.filters.paymentMonth=e.target.value;renderRoute();});
  document.querySelectorAll('[data-payment-status]').forEach(b=>b.onclick=e=>{
    e.preventDefault();
    e.stopPropagation();
    const next=b.dataset.paymentStatus;
    state.filters.paymentStatus=next;
    document.querySelectorAll('[data-payment-status]').forEach(x=>x.classList.toggle('active',x.dataset.paymentStatus===next));
    document.querySelectorAll('[data-payment-panel]').forEach(panel=>{panel.hidden=panel.dataset.paymentPanel!==next;});
    return false;
  });
  document.querySelectorAll('[data-action="payment-void"]').forEach(b=>b.onclick=()=>{
    const paymentId=b.dataset.id;
    openModal('Correct payment','<div class="section-note">This will keep the payment in the audit trail but remove it from balances and reports.</div>'+textArea('Reason','void_reason','Duplicate or incorrect payment'),async form=>{
      const reason=val(form,'void_reason');
      if(!reason)throw new Error('Enter a reason for the correction.');
      await query(sb.from('payments').update({voided_at:new Date().toISOString(),voided_by:state.session.user.id,void_reason:reason}).eq('id',paymentId));
    },'Confirm correction');
  });
}
async function attendancePage(){
  const [students,groups]=await Promise.all([
    query(sb.from('students').select('id,full_name,group_id,status').eq('status','active').order('full_name')),
    query(sb.from('groups').select('id,name').eq('active',true).order('name'))
  ]);
  if(!groups.length){
    return '<section class="panel"><div class="panel-body">'+empty('Create or activate a group before taking attendance.')+(can('owner','admin')?'<div class="empty-action"><button class="btn btn-primary" data-route="groups">Open Groups</button></div>':'')+'</div></section>';
  }
  const selectedGroup=groups[0].id;
  setTimeout(()=>setupAttendance(students,groups,selectedGroup),0);
  return '<section class="panel"><div class="panel-head"><div><h2>Take attendance</h2><p>Choose the class and date, then mark each learner.</p></div><span class="badge info">'+students.length+' active students</span></div><div class="panel-body"><div class="toolbar attendance-toolbar"><div class="toolbar-left"><select class="select" id="att-group">'+groups.map(g=>'<option value="'+g.id+'">'+esc(g.name)+'</option>').join('')+'</select><input class="input" id="att-date" type="date" value="'+today()+'"></div><div class="toolbar-right"><button class="btn btn-primary" id="att-save">Save attendance</button></div></div><div id="att-list">'+empty('Loading students…')+'</div></div></section>';
}
function setupAttendance(students,groups,groupId){
  const groupEl=document.getElementById('att-group'),dateEl=document.getElementById('att-date'),list=document.getElementById('att-list'),save=document.getElementById('att-save');
  const load=async()=>{
    const gid=groupEl.value, date=dateEl.value; const members=students.filter(s=>s.group_id===gid);
    if(!members.length){list.innerHTML=empty('This group has no active students.');return;}
    try{
      const records=await query(sb.from('attendance').select('*').eq('lesson_date',date).in('student_id',members.map(x=>x.id)));
      const map=new Map(records.map(r=>[r.student_id,r]));
      list.innerHTML='<div class="table-wrap"><table><thead><tr><th>Student</th><th>Status</th><th>Note</th></tr></thead><tbody>'+members.map(s=>{const r=map.get(s.id);return '<tr data-student="'+s.id+'"><td><strong>'+esc(s.full_name)+'</strong></td><td><select class="select att-status"><option value="present" '+(!r||r.status==='present'?'selected':'')+'>Present</option><option value="late" '+(r?.status==='late'?'selected':'')+'>Late</option><option value="absent" '+(r?.status==='absent'?'selected':'')+'>Absent</option></select></td><td><input class="input att-note" value="'+esc(r?.notes||'')+'" placeholder="Optional note"></td></tr>';}).join('')+'</tbody></table></div>';
    }catch(e){fail(e);}
  };
  groupEl.onchange=load; dateEl.onchange=load; load();
  save.onclick=async()=>{
    const rows=[...list.querySelectorAll('tr[data-student]')]; if(!rows.length)return;
    save.disabled=true;save.textContent='Saving…';
    try{
      const payload=rows.map(r=>({student_id:r.dataset.student,lesson_date:dateEl.value,status:r.querySelector('.att-status').value,notes:r.querySelector('.att-note').value||null,marked_by:state.session.user.id}));
      await query(sb.from('attendance').upsert(payload,{onConflict:'student_id,lesson_date'})); toast('Attendance saved.');
    }catch(e){fail(e);}finally{save.disabled=false;save.textContent='Save attendance';}
  };
}

async function academicPage(){
  const [records,students]=await Promise.all([
    query(sb.from('academic_records').select('*, students(full_name)').order('record_date',{ascending:false}).limit(500)),
    query(sb.from('students').select('id,full_name,status').eq('status','active').order('full_name'))
  ]);
  const rows=records.map(r=>'<tr><td>'+fmtDate(r.record_date)+'</td><td><strong>'+esc(r.students?.full_name||'Student')+'</strong></td><td>'+esc(r.record_type)+'</td><td>'+esc(r.topic||'—')+'</td><td>'+(r.score==null?'—':esc(r.score)+' / '+esc(r.max_score??'—'))+'</td><td>'+esc(r.teacher_note||'—')+'</td></tr>').join('');
  setTimeout(()=>document.querySelector('[data-action=academic-new]')?.addEventListener('click',()=>openModal('Add academic record','<div class="form-cols">'+selectField('Student','student_id',students.map(s=>[s.id,s.full_name]))+field('Date','record_date',today(),'date','required')+field('Record type','record_type','Progress check','','required')+field('Topic','topic','')+field('Score','score','','number','min="0" step="0.01"')+field('Max score','max_score','100','number','min="0.01" step="0.01"')+textArea('Teacher note','teacher_note','')+'</div>',async f=>query(sb.from('academic_records').insert({student_id:val(f,'student_id'),record_date:val(f,'record_date'),record_type:val(f,'record_type'),topic:val(f,'topic')||null,score:val(f,'score')===''?null:Number(val(f,'score')),max_score:val(f,'max_score')===''?null:Number(val(f,'max_score')),teacher_note:val(f,'teacher_note')||null,created_by:state.session.user.id})))),0);
  return tablePage('Academic progress','<button class="btn btn-primary" data-action="academic-new">'+uiIcon('plus')+'Add record</button>',[['Date',''],['Student',''],['Type',''],['Topic',''],['Score',''],['Teacher note','']],rows,'No academic records yet.');
}

async function expensesPage(){
  const expenses=await query(sb.from('expenses').select('*').order('expense_date',{ascending:false}).limit(500));
  const rows=expenses.map(e=>'<tr><td>'+fmtDate(e.expense_date)+'</td><td>'+esc(e.category)+'</td><td>'+esc(e.description||'—')+'</td><td class="num">'+fmtMoney(e.amount)+'</td><td>'+esc(humanize(e.method))+'</td></tr>').join('');
  setTimeout(()=>document.querySelector('[data-action=expense-new]')?.addEventListener('click',()=>openModal('Add expense','<div class="form-cols">'+field('Date','expense_date',today(),'date','required')+selectField('Category','category',['Rent','Utilities','Learning Materials','Marketing','CRM / Software','Maintenance','Equipment','Office Supplies','Taxes / YATT','Transport','Other'],'Utilities')+field('Amount','amount','','number','required min="1"')+selectField('Method','method',[['cash','Cash'],['card_transfer','Card / transfer'],['other','Other']],'cash')+textArea('Description','description','')+'</div>',async f=>query(sb.from('expenses').insert({expense_date:val(f,'expense_date'),category:val(f,'category'),amount:Number(val(f,'amount')),method:val(f,'method'),description:val(f,'description')||null,created_by:state.session.user.id})))),0);
  return tablePage('Centre expenses','<button class="btn btn-primary" data-action="expense-new">'+uiIcon('plus')+'Add expense</button>',[['Date',''],['Category',''],['Description',''],['Amount','num'],['Method','']],rows,'No expenses recorded.');
}

async function staffPage(){
  const [staff,payroll,userResult]=await Promise.all([
    query(sb.from('staff').select('*').order('full_name')),
    query(sb.from('payroll').select('*, staff(full_name)').order('paid_at',{ascending:false}).limit(300)),
    sb.functions.invoke('manage-users',{body:{action:'list'}})
  ]);
  const users=userResult.error?[]:(userResult.data?.users||[]);
  const userMap=new Map(users.map(u=>[u.id,u]));
  const staffWithAccounts=staff.map(s=>({...s,account:s.user_id?userMap.get(s.user_id)||null:null}));
  const rows=staffWithAccounts.map(s=>'<tr><td><strong>'+esc(s.full_name)+'</strong><div class="muted">'+esc(s.account?.email||'No CRM login')+'</div></td><td>'+esc(s.role_title||'—')+'</td><td>'+esc(s.phone||'—')+'</td><td class="num">'+fmtMoney(s.monthly_salary)+'</td><td><span class="badge '+(s.active?'success':'')+'">'+(s.active?'Active':'Inactive')+'</span></td><td>'+actionButton('Edit','staff-edit',s.id)+'</td></tr>').join('');
  setTimeout(()=>bindStaffActions(staffWithAccounts),0);
  const staffTable=tablePage('Staff records','<button class="btn btn-primary" data-action="staff-new">'+uiIcon('plus')+'Add staff</button>',[['Name',''],['Role',''],['Phone',''],['Monthly salary','num'],['Status',''],['','']],rows,'No staff records.');
  const pRows=payroll.map(p=>'<tr><td>'+fmtDate(p.paid_at)+'</td><td>'+esc(p.staff?.full_name||'Staff')+'</td><td>'+new Date(p.salary_month+'T00:00:00').toLocaleDateString('en-GB',{month:'long',year:'numeric'})+'</td><td class="num">'+fmtMoney(p.amount)+'</td><td>'+esc(p.notes||'—')+'</td></tr>').join('');
  setTimeout(()=>document.querySelector('[data-action=payroll-new]')?.addEventListener('click',()=>openModal('Record payroll','<div class="form-cols">'+selectField('Staff member','staff_id',staff.filter(s=>s.active).map(s=>[s.id,s.full_name]))+field('Salary month','salary_month',monthStart().slice(0,7),'month','required')+field('Amount','amount','','number','required min="1"')+field('Paid date','paid_at',today(),'date','required')+textArea('Notes','notes','')+'</div>',async f=>{const m=val(f,'salary_month');return query(sb.from('payroll').insert({staff_id:val(f,'staff_id'),salary_month:m+'-01',amount:Number(val(f,'amount')),paid_at:val(f,'paid_at'),notes:val(f,'notes')||null,created_by:state.session.user.id}));})),0);
  return staffTable+'<div style="height:16px"></div>'+tablePage('Payroll history',staff.some(s=>s.active)?'<button class="btn btn-primary" data-action="payroll-new">'+uiIcon('plus')+'Record salary</button>':'<button class="btn btn-primary" disabled>No active staff</button>',[['Paid on',''],['Staff',''],['Salary month',''],['Amount','num'],['Notes','']],pRows,'No payroll entries.');
}
function staffForm(s={}){
  const staffRoleOptions=(can('owner')||s.role_title==='Owner'||s.role_title==='Senior Manager')
    ? [['Owner','Owner'],['Senior Manager','Senior Manager'],['Administrator','Administrator'],['Teacher','Teacher'],['Cashier','Cashier']]
    : [['Administrator','Administrator'],['Teacher','Teacher'],['Cashier','Cashier']];
  const accountSection=s.user_id
    ? '<div class="span-2 linked-account-box"><div><strong>Linked CRM account</strong><span>This staff member can sign in to Vision CRM.</span></div><span class="badge info">'+esc(humanize(s.account?.role||''))+'</span></div>'+
      field('Email address','email',s.account?.email||'','email','required')+
      selectField('CRM access role','account_role',can('owner')?[['owner','Owner'],['senior_manager','Senior Manager'],['admin','Administrator'],['teacher','Teacher'],['cashier','Cashier']]:[['teacher','Teacher'],['cashier','Cashier']],s.account?.role||((s.role_title||'').toLowerCase().includes('owner')?'owner':(s.role_title||'').toLowerCase().includes('senior manager')?'senior_manager':(s.role_title||'').toLowerCase().includes('admin')?'admin':(s.role_title||'').toLowerCase().includes('cash')?'cashier':'teacher'))
    : '<div class="span-2 linked-account-box muted-account"><div><strong>No CRM login linked</strong><span>This staff profile does not currently have a login account.</span></div></div>';
  return '<div class="form-cols">'+
    field('Full name','full_name',s.full_name||'','','required')+
    selectField('Role','role_title',staffRoleOptions,s.role_title||'Teacher')+
    field('Phone','phone',s.phone||'','tel')+
    field('Monthly salary','monthly_salary',s.monthly_salary??0,'number','min="0"')+
    field('Start date','start_date',s.start_date||'','date')+
    '<div class="field"><label>Status</label><label class="inline-check"><input type="checkbox" name="active" '+(s.active!==false?'checked':'')+'> Active staff member</label></div>'+
    accountSection+
  '</div>';
}
function bindStaffActions(staff){
  document.querySelector('[data-action=staff-new]')?.addEventListener('click',()=>openModal('Add staff member',staffForm(),async f=>query(sb.from('staff').insert({full_name:val(f,'full_name'),role_title:val(f,'role_title')||null,phone:val(f,'phone')||null,monthly_salary:Number(val(f,'monthly_salary')||0),start_date:val(f,'start_date')||null,active:checked(f,'active')}))));
  document.querySelectorAll('[data-action=staff-edit]').forEach(b=>b.onclick=()=>{
    const s=staff.find(x=>x.id===b.dataset.id);
    const footer='<div class="danger-zone"><div><strong>Permanent deletion</strong><span>Only available if this person has no CRM history or active assignments.</span></div><button type="button" class="btn btn-danger" id="staff-delete">Delete permanently</button></div>';
    openModal('Edit staff member',staffForm(s)+footer,async f=>{
      const fullName=val(f,'full_name');
      const phone=val(f,'phone')||null;
      await query(sb.from('staff').update({
        full_name:fullName,
        role_title:val(f,'role_title')||null,
        phone,
        monthly_salary:Number(val(f,'monthly_salary')||0),
        start_date:val(f,'start_date')||null,
        active:checked(f,'active')
      }).eq('id',s.id));
      if(s.user_id){
        const {data,error}=await sb.functions.invoke('manage-users',{body:{
          action:'edit_account',
          user_id:s.user_id,
          full_name:fullName,
          email:val(f,'email'),
          phone,
          role:val(f,'account_role')
        }});
        if(error)throw error;
        if(data?.error)throw new Error(data.error);
      }
    });
    document.getElementById('staff-delete')?.addEventListener('click',()=>{
      openModal('Delete '+s.full_name+' permanently','<div class="login-error"><strong>This cannot be undone.</strong><br>The CRM will refuse the deletion if this person has any history or active assignments.</div>'+field('Type DELETE to confirm','confirm_delete','','text','required autocomplete="off"'),async form=>{
        if(val(form,'confirm_delete')!=='DELETE')throw new Error('Type DELETE exactly to confirm.');
        const {data,error}=await sb.functions.invoke('manage-users',{body:{action:'delete_staff',staff_id:s.id}});
        if(error){
          const context=error?.context;
          let detail='';
          try{
            const payload=await context?.json?.();
            if(payload?.blockers?.length)detail='\n'+payload.blockers.join(' • ');
            throw new Error((payload?.error||error.message)+detail);
          }catch(parseErr){
            if(parseErr instanceof Error && parseErr.message!==error.message)throw parseErr;
            throw error;
          }
        }
        if(data?.error){
          const detail=data.blockers?.length?' '+data.blockers.join(' • '):'';
          throw new Error(data.error+detail);
        }
      },'Delete permanently');
    });
  });
}

async function reportsPage(){
  const selectedMonth=state.filters.reportMonth||localYM();
  const monthFirst=selectedMonth+'-01';
  const monthLast=monthEnd(selectedMonth);
  const [students,groups,payments,expenses,payroll] = await Promise.all([
    query(sb.from('students').select('id,status,monthly_fee,discount_amount,is_free_place,group_id')),
    query(sb.from('groups').select('id,name,capacity,active')),
    query(sb.from('payments').select('amount,paid_at,fee_month,student_id,voided_at').eq('fee_month',monthFirst).is('voided_at',null)),
    query(sb.from('expenses').select('amount,expense_date,category').gte('expense_date',monthFirst).lte('expense_date',monthLast)),
    query(sb.from('payroll').select('amount,paid_at,salary_month,staff_id').eq('salary_month',monthFirst))
  ]);
  const active=students.filter(s=>s.status==='active');
  const expected=active.reduce((s,x)=>s+(x.is_free_place?0:Math.max(0,Number(x.monthly_fee)-Number(x.discount_amount))),0);
  const reportPaidMap=new Map();
  payments.forEach(p=>reportPaidMap.set(p.student_id,(reportPaidMap.get(p.student_id)||0)+Number(p.amount||0)));
  const collected=active.reduce((total,s)=>{
    if(s.is_free_place)return total;
    const due=Math.max(0,Number(s.monthly_fee)-Number(s.discount_amount));
    return total+Math.min(due,reportPaidMap.get(s.id)||0);
  },0);
  const cashReceived=payments.reduce((s,x)=>s+Number(x.amount),0);
  const overpayments=Math.max(0,cashReceived-collected);
  const operating=expenses.reduce((s,x)=>s+Number(x.amount),0);
  const salary=payroll.reduce((s,x)=>s+Number(x.amount),0);
  const outstanding=Math.max(0,expected-collected);
  const collectionRate=expected?Math.min(100,Math.round(collected/expected*100)):0;
  const net=cashReceived-operating-salary;
  const categoryTotals=new Map();
  expenses.forEach(e=>categoryTotals.set(e.category,(categoryTotals.get(e.category)||0)+Number(e.amount)));
  const expenseRows=[...categoryTotals.entries()].sort((a,b)=>b[1]-a[1]).map(([category,amount])=>'<tr><td>'+esc(category)+'</td><td class="num">'+fmtMoney(amount)+'</td></tr>').join('');
  const groupRows=groups.filter(g=>g.active).map(g=>{const n=active.filter(s=>s.group_id===g.id).length;const pct=Math.round(n/Number(g.capacity||1)*100);return '<tr><td>'+esc(g.name)+'</td><td>'+n+'</td><td>'+g.capacity+'</td><td><div class="occupancy-cell"><span>'+pct+'%</span><div class="progress"><span style="width:'+Math.min(100,pct)+'%"></span></div></div></td></tr>';}).join('');
  setTimeout(()=>document.getElementById('report-month-filter')?.addEventListener('change',e=>{state.filters.reportMonth=e.target.value;renderRoute();}),0);
  return '<section class="report-toolbar"><div><span class="internal-eyebrow">MONTHLY PERFORMANCE</span><h2>'+new Date(monthFirst+'T00:00:00').toLocaleDateString('en-GB',{month:'long',year:'numeric'})+'</h2><p>Fee collection, operating costs, payroll and centre capacity.</p></div><div class="month-control"><label>Report month</label><input class="input" id="report-month-filter" type="month" value="'+esc(selectedMonth)+'"></div></section>'+
  '<div class="report-grid">'+
    reportCard('Expected fees',fmtMoney(expected))+
    reportCard('Fees collected',fmtMoney(collected))+
    reportCard('Cash received',fmtMoney(cashReceived))+
    reportCard('Outstanding',fmtMoney(outstanding))+
    reportCard('Collection rate',collectionRate+'%')+
    reportCard('Operating expenses',fmtMoney(operating))+
    reportCard('Payroll',fmtMoney(salary))+
    reportCard('Net cash',fmtMoney(net))+
    (overpayments>0?reportCard('Overpayment to review',fmtMoney(overpayments)):'')+
  '</div><div class="section-spacer"></div>'+
  '<div class="grid-2"><section class="panel"><div class="panel-head"><div><h2>Group occupancy</h2><p>Current active students against group capacity</p></div></div><div class="panel-body">'+(groupRows?'<div class="table-wrap"><table><thead><tr><th>Group</th><th>Students</th><th>Capacity</th><th>Occupancy</th></tr></thead><tbody>'+groupRows+'</tbody></table></div>':empty('No active groups.'))+'</div></section>'+
  '<section class="panel"><div class="panel-head"><div><h2>Expense breakdown</h2><p>Operating expenses by category for this month</p></div></div><div class="panel-body">'+(expenseRows?'<div class="table-wrap"><table><thead><tr><th>Category</th><th class="num">Amount</th></tr></thead><tbody>'+expenseRows+'</tbody></table></div>':empty('No operating expenses this month.'))+'</div></section></div>';
}
function reportCard(label,value){return '<div class="report-card"><h3>'+esc(label)+'</h3><div class="report-value">'+esc(value)+'</div></div>';}

async function usersPage(){
  const [userResult,staff]=await Promise.all([
    sb.functions.invoke('manage-users',{body:{action:'list'}}),
    query(sb.from('staff').select('id,user_id,full_name,role_title,phone,active').order('full_name'))
  ]);
  const {data,error}=userResult;
  if(error) throw error;
  const users=data?.users||[];
  const rows=users.map(u=>'<tr><td><strong>'+esc(u.full_name||'—')+'</strong><div class="muted">'+esc(u.email||'')+'</div></td><td><span class="badge info">'+esc(humanize(u.role))+'</span></td><td><span class="badge '+(u.active?'success':'danger')+'">'+(u.active?'Active':'Inactive')+'</span></td><td>'+fmtDate((u.last_sign_in_at||'').slice(0,10))+'</td><td>'+(u.id!==state.session.user.id?'<div class="action-row">'+actionButton('Edit','user-edit',u.id)+actionButton('Change role','user-role',u.id)+(u.active?actionButton('Deactivate','user-deactivate',u.id,'danger'):'<span class="muted">Deactivated</span>')+'</div>':'<span class="muted">Current user</span>')+'</td></tr>').join('');
  setTimeout(()=>bindUserActions(users,staff),0);
  return '<div class="section-note"><strong>Staff access</strong><br>Create Owner, Senior Manager, Administrator, Teacher or Cashier login accounts and link them to an existing staff record when possible. Owner-level users can assign Owner, Senior Manager or Administrator access.</div>'+tablePage('Login accounts','<button class="btn btn-primary" data-action="user-new">'+uiIcon('plus')+'Create account</button>',[['User',''],['Role',''],['Status',''],['Last sign-in',''],['','']],rows,'No accounts found.');
}
function bindUserActions(users,staff){
  document.querySelector('[data-action=user-new]')?.addEventListener('click',()=>{
    const available=staff.filter(s=>s.active&&!s.user_id);
    const staffOptions=[['','Create a new staff record'],...available.map(s=>[s.id,s.full_name+' — '+(s.role_title||'Staff')])];
    openModal('Create login account','<div class="form-cols">'+selectField('Link staff record','staff_id',staffOptions,'')+field('Full name','full_name','','','required')+field('Email','email','','email','required')+passwordInput('Temporary password','password','required minlength="8" autocomplete="new-password"')+field('Phone','phone','','tel')+selectField('Role','role',can('owner')?[['owner','Owner'],['senior_manager','Senior Manager'],['admin','Administrator'],['teacher','Teacher'],['cashier','Cashier']]:[['teacher','Teacher'],['cashier','Cashier']],'teacher')+'</div>',async f=>{
      const {data,error}=await sb.functions.invoke('manage-users',{body:{action:'create',full_name:val(f,'full_name'),email:val(f,'email'),password:val(f,'password'),phone:val(f,'phone'),role:val(f,'role'),staff_id:val(f,'staff_id')||null}});
      if(error){
        try{
          const payload=await error.context?.json?.();
          throw new Error(payload?.error||error.message);
        }catch(e){
          if(e instanceof Error && e.message!==error.message)throw e;
          throw error;
        }
      }
      if(data?.error)throw new Error(data.error);
    },'Create account');
    const staffEl=modalRoot.querySelector('[name=staff_id]');
    staffEl.onchange=()=>{
      const s=available.find(x=>x.id===staffEl.value);
      if(!s)return;
      modalRoot.querySelector('[name=full_name]').value=s.full_name||'';
      modalRoot.querySelector('[name=phone]').value=s.phone||'';
      const rt=(s.role_title||'').toLowerCase();
      modalRoot.querySelector('[name=role]').value=rt.includes('owner')&&can('owner')?'owner':rt.includes('senior manager')&&can('owner')?'senior_manager':rt.includes('admin')&&can('owner')?'admin':rt.includes('cash')?'cashier':'teacher';
    };
  });
  document.querySelectorAll('[data-action=user-edit]').forEach(b=>b.onclick=()=>{
    const u=users.find(x=>x.id===b.dataset.id);
    const s=staff.find(x=>x.user_id===u.id);
    openModal('Edit login account','<div class="form-cols">'+
      field('Full name','full_name',u.full_name||'','','required')+
      field('Email address','email',u.email||'','email','required')+
      field('Phone','phone',s?.phone||'','tel')+
      selectField('Role','role',can('owner')?[['owner','Owner'],['senior_manager','Senior Manager'],['admin','Administrator'],['teacher','Teacher'],['cashier','Cashier']]:[['teacher','Teacher'],['cashier','Cashier']],u.role)+
      '<div class="span-2 section-note">This updates the linked CRM login and staff profile together.</div>'+
    '</div>',async f=>{
      const {data,error}=await sb.functions.invoke('manage-users',{body:{
        action:'edit_account',
        user_id:u.id,
        full_name:val(f,'full_name'),
        email:val(f,'email'),
        phone:val(f,'phone'),
        role:val(f,'role')
      }});
      if(error)throw error;
      if(data?.error)throw new Error(data.error);
    },'Save changes');
  });
  document.querySelectorAll('[data-action=user-role]').forEach(b=>b.onclick=()=>{const u=users.find(x=>x.id===b.dataset.id);openModal('Change role',selectField('Role','role',can('owner')?[['owner','Owner'],['senior_manager','Senior Manager'],['admin','Administrator'],['teacher','Teacher'],['cashier','Cashier']]:[['teacher','Teacher'],['cashier','Cashier']],u.role),async f=>{const {data,error}=await sb.functions.invoke('manage-users',{body:{action:'set_role',user_id:u.id,role:val(f,'role')}});if(error)throw error;if(data?.error)throw new Error(data.error);},'Update role');});
  document.querySelectorAll('[data-action=user-deactivate]').forEach(b=>b.onclick=async()=>{if(!confirm('Deactivate this user account?'))return;try{const {data,error}=await sb.functions.invoke('manage-users',{body:{action:'deactivate',user_id:b.dataset.id}});if(error)throw error;if(data?.error)throw new Error(data.error);await renderRoute();toast('Account deactivated.');}catch(e){fail(e);}});
}

async function settingsPage(){
  const s=await query(sb.from('centre_settings').select('*').eq('id',1).single());
  setTimeout(()=>{document.getElementById('settings-form').onsubmit=async e=>{e.preventDefault();const b=e.currentTarget.querySelector('button');b.disabled=true;try{await query(sb.from('centre_settings').update({centre_name:val(e.currentTarget,'centre_name'),currency:val(e.currentTarget,'currency'),junior_default_fee:Number(val(e.currentTarget,'junior_default_fee')||0),senior_default_fee:Number(val(e.currentTarget,'senior_default_fee')||0),updated_at:new Date().toISOString()}).eq('id',1));toast('Settings updated.');}catch(err){fail(err);}finally{b.disabled=false;}};},0);
  return '<section class="panel"><div class="panel-head"><div><h2>Centre settings</h2><p>Core values used across the CRM</p></div></div><div class="panel-body"><form id="settings-form"><div class="form-cols">'+field('Centre name','centre_name',s.centre_name,'','required')+field('Currency','currency',s.currency,'','required')+field('Grades 3–6 default fee','junior_default_fee',s.junior_default_fee,'number','min="0"')+field('Grades 7–11 & adults default fee','senior_default_fee',s.senior_default_fee,'number','min="0"')+'</div><div style="margin-top:16px"><button class="btn btn-primary" type="submit">Save settings</button></div></form></div></section>';
}

function tablePage(title,actions,headers,rows,emptyMessage){
  return '<section class="panel"><div class="panel-head"><div><h2>'+esc(title)+'</h2></div>'+actions+'</div><div class="panel-body">'+(rows?'<div class="table-wrap"><table><thead><tr>'+headers.map(h=>'<th class="'+(h[1]||'')+'">'+esc(h[0])+'</th>').join('')+'</tr></thead><tbody>'+rows+'</tbody></table></div>':empty(emptyMessage))+'</div></section>';
}

let routeRenderGeneration=0;
let routePreloadStarted=false;
async function routeContent(routeName){
  switch(routeName){
    case 'dashboard': return await dashboardPage();
    case 'leads': return await leadsPage();
    case 'students': return await studentsPage();
    case 'groups': return await groupsPage();
    case 'attendance': return await attendancePage();
    case 'academic': return await academicPage();
    case 'payments': return await paymentsPage();
    case 'expenses': return await expensesPage();
    case 'staff': return await staffPage();
    case 'reports': return await reportsPage();
    case 'users': return await usersPage();
    case 'settings': return await settingsPage();
    default: return await dashboardPage();
  }
}
async function preloadRoute(routeName){
  if(routePanel(routeName)||routeName===state.route) return;
  try{
    const content=await routeContent(routeName);
    if(!state.session||routePanel(routeName)) return;
    renderShell(content,routeName,false);
  }catch(e){
    console.warn('Route preload skipped:',routeName,e);
  }
}
function scheduleRoutePreload(){
  if(routePreloadStarted) return;
  routePreloadStarted=true;
  const queue=allowedRoutes().map(n=>n.id).filter(id=>id!==state.route);
  let index=0;
  const next=()=>{
    if(index>=queue.length||!state.session) return;
    const id=queue[index++];
    preloadRoute(id).finally(()=>setTimeout(next,180));
  };
  if('requestIdleCallback' in window) requestIdleCallback(next,{timeout:700});
  else setTimeout(next,350);
}
async function renderRoute(force=false,navigation=false){
  if(!state.session){renderLogin();return;}
  if(!state.profile) await loadIdentity();
  const hash=(location.hash||'').replace('#','');
  if(hash && allowedRoutes().some(n=>n.id===hash)) state.route=hash;
  if(!allowedRoutes().some(n=>n.id===state.route)) state.route='dashboard';

  const generation=++routeRenderGeneration;
  const requestedRoute=state.route;
  const cached=routePanel(requestedRoute);

  if(navigation&&cached&&!force){
    activateRoutePanel(requestedRoute);
    return;
  }

  try{
    const content=await routeContent(requestedRoute);
    if(generation!==routeRenderGeneration || requestedRoute!==state.route) return;
    renderShell(content,requestedRoute,true);
    scheduleRoutePreload();
  }catch(e){
    if(generation!==routeRenderGeneration) return;
    console.error(e);
    const errorContent='<section class="panel"><div class="panel-body"><div class="login-error"><strong>Could not load this page.</strong><br>'+esc(e.message||e)+'</div><button type="button" class="btn btn-primary" id="retry">Try again</button></div></section>';
    renderShell(errorContent,requestedRoute,true);
    setTimeout(()=>{const retry=document.getElementById('retry');if(retry)retry.onclick=()=>renderRoute(true);},0);
  }
}

let authGeneration=0;

async function applySession(session,{render=true}={}){
  state.session=session;
  if(!session){
    state.profile=null;
    state.staff=null;
    if(render) renderLogin();
    return;
  }
  await loadIdentity();
  if(render){
    if(state.profile?.role!=='owner' && state.profile?.must_change_password) renderPasswordUpdate(true);
    else await renderRoute();
  }
}

async function handleAuthEvent(event,session,generation){
  if(generation!==authGeneration) return;
  try{
    if(event==='PASSWORD_RECOVERY'){
      state.session=session;
      renderPasswordUpdate();
      return;
    }
    if(event==='SIGNED_OUT'){
      await applySession(null);
      return;
    }
    if(event==='TOKEN_REFRESHED'){
      state.session=session;
      return;
    }
    if(event==='SIGNED_IN' || event==='USER_UPDATED'){
      await applySession(session);
    }
  }catch(e){
    console.error(e);
    fail(e);
    if(event!=='TOKEN_REFRESHED') renderLogin(e.message);
  }
}

sb.auth.onAuthStateChange((event,session)=>{
  if(event==='INITIAL_SESSION') return;
  const generation=++authGeneration;
  setTimeout(()=>{ void handleAuthEvent(event,session,generation); },0);
});

(async function init(){
  try{
    const result=await withTimeout(
      sb.auth.getSession(),
      15000,
      'Vision CRM could not restore your login session. Please reload the page.'
    );
    if(result.error) throw result.error;
    await applySession(result.data.session);
  }catch(e){
    console.error(e);
    state.session=null;
    state.profile=null;
    state.staff=null;
    renderLogin(e.message||'Could not start Vision CRM.');
  }
})();
})();
