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
  users:['User Accounts','Create teacher and cashier logins'],
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
const can = (...roles) => roles.includes(role());
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
  return NAV.filter(n=>n.roles.includes(role()));
}
function renderShell(content){
  const meta=PAGE_META[state.route]||['Vision CRM',''];
  const allowed=allowedRoutes();
  const current=allowed.find(n=>n.id===state.route)||allowed[0];
  const activeGroup=current?.group||'Overview';
  const groups=[...new Set(allowed.map(n=>n.group))];
  const categoryIcon={Overview:'dashboard',Students:'students',Teaching:'academic',Finance:'payments',Management:'settings'};
  const defaults={Overview:'dashboard',Students:'students',Teaching:'attendance',Finance:'payments',Management:'reports'};
  const categoryNav=groups.map(g=>'<button class="category-tab '+(g===activeGroup?'active':'')+'" data-category="'+esc(g)+'"><span>'+uiIcon(categoryIcon[g]||'dashboard')+'</span>'+esc(g)+'</button>').join('');
  const subNav=allowed.filter(n=>n.group===activeGroup).map(n=>'<button class="subnav-tab '+(n.id===state.route?'active':'')+'" data-route="'+n.id+'">'+esc(n.label)+'</button>').join('');
  app.className='';
  app.innerHTML =
    '<div class="shell top-shell">'+
      '<header class="app-header">'+
        '<div class="app-header-main">'+
          '<div class="app-brand"><img src="./vision-logo.jpg" alt="Vision Learning Centre"><div><strong>Vision CRM</strong><span>Vision Learning Centre</span></div></div>'+
          '<div class="app-user">'+
            '<button class="btn btn-secondary desktop-only" id="refresh">'+uiIcon('refresh')+'<span>Refresh</span></button>'+
            '<span class="role-chip desktop-only">'+esc(humanize(role()))+'</span>'+
            '<div class="user-chip"><div class="avatar">'+esc(initials(state.profile?.full_name))+'</div><div class="user-chip-copy"><strong>'+esc(state.profile?.full_name||'User')+'</strong><span>'+esc(humanize(role()))+'</span></div></div>'+
            '<button id="signout" class="icon-btn signout-icon" title="Sign out" aria-label="Sign out">'+uiIcon('logout')+'</button>'+
          '</div>'+
        '</div>'+
        '<nav class="category-nav">'+categoryNav+'</nav>'+
        '<nav class="subnav">'+subNav+'</nav>'+
      '</header>'+
      '<main class="main top-main">'+
        '<header class="pagebar"><div class="page-title"><h1>'+esc(meta[0])+'</h1><p>'+esc(meta[1])+'</p></div></header>'+
        '<div class="content">'+content+'</div>'+
      '</main>'+
    '</div>';
  document.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>go(b.dataset.route));
  document.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{
    const group=b.dataset.category;
    const preferred=defaults[group];
    const target=allowed.find(n=>n.group===group&&n.id===preferred)||allowed.find(n=>n.group===group);
    if(target) go(target.id);
  });
  document.getElementById('signout').onclick=async()=>{await sb.auth.signOut();};
  document.getElementById('refresh')?.addEventListener('click',()=>renderRoute(true));
}
function go(routeName){
  if(!allowedRoutes().some(n=>n.id===routeName)) routeName='dashboard';
  state.route=routeName; state.sidebarOpen=false;
  history.replaceState(null,'','#'+routeName);
  renderRoute();
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
  app.innerHTML =
    '<div class="auth-wrap auth-login">'+
      '<section class="auth-hero">'+
        '<div class="auth-logo"><img src="./vision-logo.jpg" alt="Vision Learning Centre logo"><div><strong>VISION</strong><span>LEARNING CENTRE</span></div></div>'+
        '<div class="auth-hero-copy"><div class="eyebrow">VISION CRM</div><h1>Everything your centre needs,<br>in one clear system.</h1><p>Students, groups, attendance, payments, staff and academic progress — securely managed in one place.</p><div class="auth-badges"><span class="auth-badge">Students</span><span class="auth-badge">Attendance</span><span class="auth-badge">Payments</span><span class="auth-badge">Reports</span></div></div>'+
        '<div class="auth-footer-note">Vision Learning Centre • Internal management system</div>'+
      '</section>'+
      '<section class="auth-panel"><div class="auth-card">'+
        '<div class="login-brand"><img src="./vision-logo.jpg" alt="Vision Learning Centre"><div><strong>Vision CRM</strong><span>Secure staff access</span></div></div>'+
        '<div class="login-heading"><h2>Welcome back</h2><p class="sub">Enter your account details to continue.</p></div>'+
        (error?'<div class="login-error">'+esc(error)+'</div>':'')+
        '<form id="login-form" class="form-grid">'+
          field('Email address','email','','email','required autocomplete="email" placeholder="you@example.com"')+
          passwordInput('Password','password','required autocomplete="current-password" placeholder="Enter your password"')+
          '<button class="btn btn-primary btn-block login-submit" type="submit"><span>Sign in</span><span aria-hidden="true">→</span></button>'+
        '</form>'+
        '<div class="auth-help"><span>Vision Learning Centre staff only</span><button class="link-btn" id="forgot">Forgot password?</button></div>'+
      '</div></section></div>';
  bindPasswordToggle(app);
  document.getElementById('login-form').onsubmit=async e=>{
    e.preventDefault();
    const b=e.currentTarget.querySelector('[type="submit"]'); b.disabled=true;b.innerHTML='<span>Signing in…</span>';
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
function renderPasswordUpdate(){
  app.className='';
  app.innerHTML='<div class="auth-wrap"><section class="auth-hero"><div class="auth-logo"><img src="./vision-logo.jpg" alt="Vision Learning Centre logo"><div><strong>VISION</strong><span>LEARNING CENTRE</span></div></div><div class="auth-hero-copy"><div class="eyebrow">ACCOUNT SECURITY</div><h1>Set a new password.</h1><p>Choose a strong password for your Vision CRM account.</p></div><div></div></section><section class="auth-panel"><div class="auth-card"><div class="login-brand"><img src="./vision-logo.jpg" alt="Vision Learning Centre"><div><strong>Vision CRM</strong><span>Secure account access</span></div></div><h2>New password</h2><p class="sub">Use at least 8 characters.</p><form id="pw-form" class="form-grid">'+passwordInput('New password','password','required minlength="8" autocomplete="new-password"')+'<button class="btn btn-primary btn-block" type="submit">Update password</button></form></div></section></div>';
  bindPasswordToggle(app);
  document.getElementById('pw-form').onsubmit=async e=>{
    e.preventDefault(); const {error}=await sb.auth.updateUser({password:val(e.currentTarget,'password')});
    if(error) return fail(error); toast('Password updated.'); state.route='dashboard'; await renderRoute();
  };
}

async function dashboardPage(){
  const first=monthStart();
  const last=monthEnd(first);
  const [students,groups,payments,attendance] = await Promise.all([
    query(sb.from('students').select('id,full_name,status,group_id,monthly_fee,discount_amount,is_free_place').eq('status','active')),
    query(sb.from('groups').select('id,name,capacity,active,default_monthly_fee').eq('active',true)),
    can('owner','admin','cashier') ? query(sb.from('payments').select('id,amount,paid_at,fee_month,student_id,voided_at').eq('fee_month',first).is('voided_at',null)) : Promise.resolve([]),
    can('owner','admin','teacher') ? query(sb.from('attendance').select('id,status,lesson_date,student_id').gte('lesson_date',first).lte('lesson_date',last)) : Promise.resolve([])
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
  const fill=groups.reduce((a,g)=>a+students.filter(s=>s.group_id===g.id).length,0);
  const capacity=groups.reduce((a,g)=>a+Number(g.capacity||0),0);
  const greeting=new Date().getHours()<12?'Good morning':new Date().getHours()<18?'Good afternoon':'Good evening';
  const quickActions=[
    ['students','Students','students'],
    ...(can('owner','admin','cashier')?[['payments','Payments','payments']]:[]),
    ...(can('owner','admin','teacher')?[['attendance','Attendance','attendance']]:[]),
    ...(can('owner','admin')?[['expenses','Expenses','expenses']]:[])
  ];
  return '<section class="dashboard-welcome"><div><span class="internal-eyebrow">VISION LEARNING CENTRE</span><h2>'+greeting+', '+esc((state.profile?.full_name||'').split(' ')[0]||'there')+'.</h2><p>Here is what needs your attention today.</p></div><div class="quick-actions">'+quickActions.map(a=>'<button class="quick-action" data-route="'+a[0]+'"><span>'+uiIcon(a[2])+'</span>'+a[1]+'</button>').join('')+'</div></section>'+
  '<div class="cards">'+
    statCard('Active students',students.length,'Across '+groups.length+' active groups','students')+
    statCard(can('owner','admin','cashier')?'Collected this month':'My active groups',can('owner','admin','cashier')?fmtMoney(revenue):groups.length,can('owner','admin','cashier')?Math.round(expected?revenue/expected*100:0)+'% of expected fees':'Assigned teaching view','payments')+
    statCard(can('owner','admin','teacher')?'Attendance rate':'Group capacity',can('owner','admin','teacher')?attendanceRate+'%':(capacity?Math.round(fill/capacity*100):0)+'%',can('owner','admin','teacher')?attendance.length+' attendance records':fill+' / '+capacity+' places','attendance')+
    statCard(can('owner','admin','cashier')?'Unpaid students':'Active learners',can('owner','admin','cashier')?unpaid.length:students.length,can('owner','admin','cashier')?'Current month':'Visible to your account','alert')+
  '</div>'+
  '<div class="grid-2"><section class="panel"><div class="panel-head"><div><h2>Groups overview</h2><p>Current occupancy and monthly fee</p></div></div><div class="panel-body">'+
    (groups.length?'<div class="kpi-list">'+groups.map(g=>{const c=students.filter(s=>s.group_id===g.id).length;const pct=Math.min(100,Math.round(c/Number(g.capacity||1)*100));return '<div class="kpi-line"><div class="kpi-line-head"><strong>'+esc(g.name)+'</strong><span>'+c+' / '+g.capacity+'</span></div><div class="progress"><span style="width:'+pct+'%"></span></div><div class="muted" style="font-size:11px">'+fmtMoney(g.default_monthly_fee)+' default fee</div></div>';}).join('')+'</div>':empty('No active groups.'))+
  '</div></section><section class="panel"><div class="panel-head"><div><h2>'+ (can('owner','admin','cashier')?'Payment attention':'Today') +'</h2><p>'+ (can('owner','admin','cashier')?'Students without a payment this month':'Teaching snapshot') +'</p></div></div><div class="panel-body">'+
    (can('owner','admin','cashier') ? ((overpaymentTotal>0?'<div class="section-note correction-note"><strong>Payment correction needed</strong><br>'+fmtMoney(overpaymentTotal)+' is above students\' expected fees this month. Review Finance → Payments history.</div>':'')+(unpaid.length?'<div class="list">'+unpaid.slice(0,8).map(s=>{const due=Math.max(0,Number(s.monthly_fee)-Number(s.discount_amount));const paid=paidByStudent.get(s.id)||0;const balance=Math.max(0,due-paid);const status=paid>0?'Partial':'Unpaid';return '<div class="list-item"><div class="list-main"><strong>'+esc(s.full_name)+'</strong><span>'+fmtMoney(balance)+' remaining</span></div><span class="badge '+(paid>0?'warn':'danger')+'">'+status+'</span></div>';}).join('')+'</div>':overpaymentTotal>0?'':empty('All current fees are fully paid or free.'))) : '<div class="section-note">Use Attendance and Academic Records from the menu to manage your teaching work.</div>')+
  '</div></section></div>';
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
      const rows=payments.map(p=>'<tr><td>'+new Date(p.fee_month+'T00:00:00').toLocaleDateString('en-GB',{month:'short',year:'numeric'})+'</td><td>'+fmtDate(p.paid_at)+'</td><td class="num">'+fmtMoney(p.amount)+'</td><td>'+humanize(p.method)+'</td></tr>').join('');
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
  const rows=groups.map(g=>{const n=students.filter(s=>s.group_id===g.id).length;return '<tr><td><strong>'+esc(g.name)+'</strong><div class="muted">'+esc(g.level||'')+'</div></td><td>'+esc(g.schedule||'—')+'</td><td>'+esc(g.staff?.full_name||'—')+'</td><td>'+n+' / '+g.capacity+'</td><td class="num">'+fmtMoney(g.default_monthly_fee)+'</td><td><span class="badge '+(g.active?'success':'')+'">'+(g.active?'Active':'Inactive')+'</span></td><td>'+(can('owner','admin')?actionButton('Edit','group-edit',g.id):'')+'</td></tr>';}).join('');
  setTimeout(()=>bindGroupActions(groups,staff),0);
  return tablePage('Class groups',can('owner','admin')?'<button class="btn btn-primary" data-action="group-new">'+uiIcon('plus')+'Add group</button>':'',[['Group',''],['Schedule',''],['Teacher',''],['Students',''],['Default fee','num'],['Status',''],['','']],rows,'No groups found.');
}
function groupForm(g={},staff=[]){
  return '<div class="form-cols">'+field('Group name','name',g.name||'','','required')+field('Level','level',g.level||'')+field('Schedule','schedule',g.schedule||'')+field('Room','room',g.room||'')+
  selectField('Teacher','teacher_id',[['','Unassigned'],...staff.map(s=>[s.id,s.full_name])],g.teacher_id||'')+field('Capacity','capacity',g.capacity??20,'number','min="1"')+
  field('Default monthly fee','default_monthly_fee',g.default_monthly_fee??0,'number','min="0"')+field('Start date','start_date',g.start_date||'','date')+
  '<div class="field"><label>Status</label><label class="inline-check"><input type="checkbox" name="active" '+(g.active!==false?'checked':'')+'> Active group</label></div></div>';
}
function bindGroupActions(groups,staff){
  document.querySelector('[data-action="group-new"]')?.addEventListener('click',()=>openModal('Add group',groupForm({},staff),async f=>{
    await query(sb.from('groups').insert({name:val(f,'name'),level:val(f,'level')||null,schedule:val(f,'schedule')||null,room:val(f,'room')||null,teacher_id:val(f,'teacher_id')||null,capacity:Number(val(f,'capacity')||20),default_monthly_fee:Number(val(f,'default_monthly_fee')||0),start_date:val(f,'start_date')||null,active:checked(f,'active')}));
  }));
  document.querySelectorAll('[data-action="group-edit"]').forEach(b=>b.onclick=()=>{const g=groups.find(x=>x.id===b.dataset.id);openModal('Edit group',groupForm(g,staff),async f=>{
    await query(sb.from('groups').update({name:val(f,'name'),level:val(f,'level')||null,schedule:val(f,'schedule')||null,room:val(f,'room')||null,teacher_id:val(f,'teacher_id')||null,capacity:Number(val(f,'capacity')||20),default_monthly_fee:Number(val(f,'default_monthly_fee')||0),start_date:val(f,'start_date')||null,active:checked(f,'active')}).eq('id',g.id));
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
  payments.forEach(p=>paidMap.set(p.student_id,(paidMap.get(p.student_id)||0)+Number(p.amount||0)));
  const feeRows=students.map(s=>{
    const expected=s.is_free_place?0:Math.max(0,Number(s.monthly_fee||0)-Number(s.discount_amount||0));
    const paid=paidMap.get(s.id)||0;
    const balance=Math.max(0,expected-paid);
    const overpaid=Math.max(0,paid-expected);
    const status=s.is_free_place?'free':paid<=0?'unpaid':balance>0?'partial':overpaid>0?'overpaid':'paid';
    return {...s,expected,paid,balance,overpaid,payment_status:status};
  });
  const counts={paid:feeRows.filter(x=>x.payment_status==='paid').length,partial:feeRows.filter(x=>x.payment_status==='partial').length,unpaid:feeRows.filter(x=>x.payment_status==='unpaid').length,free:feeRows.filter(x=>x.payment_status==='free').length,overpaid:feeRows.filter(x=>x.payment_status==='overpaid').length};
  const expectedTotal=feeRows.reduce((a,x)=>a+x.expected,0);
  const collected=feeRows.reduce((a,x)=>a+Math.min(x.paid,x.expected),0);
  const outstanding=feeRows.reduce((a,x)=>a+x.balance,0);
  const overpaidTotal=feeRows.reduce((a,x)=>a+x.overpaid,0);
  const statusFilter=state.filters.paymentStatus||'attention';
  const visible=feeRows.filter(x=>{
    if(statusFilter==='attention')return x.payment_status==='unpaid'||x.payment_status==='partial';
    return x.payment_status===statusFilter;
  });
  const attentionCount=counts.unpaid+counts.partial;
  const rows=visible.map(s=>'<tr>'+
    '<td><strong>'+esc(s.full_name)+'</strong><div class="muted">'+esc(groupMap.get(s.group_id)||'Unassigned')+'</div></td>'+
    '<td class="num">'+fmtMoney(s.expected)+'</td>'+
    '<td class="num">'+fmtMoney(s.paid)+'</td>'+
    '<td class="num"><strong>'+fmtMoney(s.balance)+'</strong>'+(s.overpaid>0?'<div class="muted row-sub balance-due">+'+fmtMoney(s.overpaid)+' over</div>':'')+'</td>'+
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
  const historyRows=history.map(p=>'<tr><td>'+fmtDate(p.paid_at)+'</td><td><strong>'+esc(p.students?.full_name||'Student')+'</strong></td><td>'+new Date(p.fee_month+'T00:00:00').toLocaleDateString('en-GB',{month:'short',year:'numeric'})+'</td><td class="num">'+fmtMoney(p.amount)+'</td><td>'+esc(humanize(p.method))+'</td><td><div class="action-row"><span>'+esc(p.reference||'—')+'</span>'+(can('owner','admin','cashier')?'<button class="btn btn-sm btn-danger" data-action="payment-void" data-id="'+p.id+'">Correct</button>':'')+'</div></td></tr>').join('');
  setTimeout(()=>bindPaymentActions(students,feeRows),0);
  return '<div class="finance-summary">'+
    '<div class="finance-kpi"><span>Expected</span><strong>'+fmtMoney(expectedTotal)+'</strong></div>'+
    '<div class="finance-kpi success"><span>Collected</span><strong>'+fmtMoney(collected)+'</strong></div>'+
    '<div class="finance-kpi danger"><span>Outstanding</span><strong>'+fmtMoney(outstanding)+'</strong></div>'+
    '<div class="finance-kpi"><span>Collection rate</span><strong>'+(expectedTotal?Math.round(collected/expectedTotal*100):0)+'%</strong></div>'+
  '</div>'+
  (overpaidTotal>0?'<div class="section-note correction-note"><strong>Correction needed:</strong> '+fmtMoney(overpaidTotal)+' exceeds expected fees for this month. Use <strong>Correct</strong> in payment history for duplicate or mistaken entries.</div>':'')+
  '<section class="panel"><div class="panel-head"><div><h2>Monthly fee status</h2><p>See exactly who has paid, partially paid, or still owes for the selected course month.</p></div><button class="btn btn-primary" data-action="payment-new">'+uiIcon('plus')+'Record payment</button></div>'+
    '<div class="panel-body">'+
      '<div class="payment-workspace-head"><div class="month-control"><label>Course month</label><input class="input" id="payment-month-filter" type="month" value="'+esc(selectedMonth)+'"></div><div class="payment-workspace-note">Students move automatically between spaces when their balance changes.</div></div>'+
      '<div class="payment-spaces">'+
        '<button class="payment-space attention '+(statusFilter==='attention'?'active':'')+'" data-payment-status="attention"><span class="payment-space-icon">'+uiIcon('alert')+'</span><span class="payment-space-copy"><strong>Needs payment</strong><small>Unpaid or partially paid</small></span><b>'+attentionCount+'</b></button>'+
        '<button class="payment-space paid '+(statusFilter==='paid'?'active':'')+'" data-payment-status="paid"><span class="payment-space-icon">'+uiIcon('attendance')+'</span><span class="payment-space-copy"><strong>Paid</strong><small>Balance fully cleared</small></span><b>'+counts.paid+'</b></button>'+
        '<button class="payment-space free '+(statusFilter==='free'?'active':'')+'" data-payment-status="free"><span class="payment-space-icon">'+uiIcon('students')+'</span><span class="payment-space-copy"><strong>Free places</strong><small>No monthly payment due</small></span><b>'+counts.free+'</b></button>'+
        '<button class="payment-space correction '+(statusFilter==='overpaid'?'active':'')+'" data-payment-status="overpaid"><span class="payment-space-icon">'+uiIcon('refresh')+'</span><span class="payment-space-copy"><strong>Corrections</strong><small>Overpayments to review</small></span><b>'+counts.overpaid+'</b></button>'+
      '</div>'+
      '<div class="payment-space-title"><div><h3>'+(statusFilter==='attention'?'Needs payment':statusFilter==='paid'?'Paid students':statusFilter==='free'?'Free places':'Corrections')+'</h3><p>'+(statusFilter==='attention'?'These students still have a balance for this course month.':statusFilter==='paid'?'These students have completed their payment for this course month.':statusFilter==='free'?'These students are not expected to pay for this course month.':'These students have payments above their expected fee and need review.')+'</p></div>'+(statusFilter==='attention'?'<span class="queue-count">'+attentionCount+' remaining</span>':'')+'</div>'+
      (rows?'<div class="table-wrap"><table><thead><tr><th>Student</th><th class="num">Fee</th><th class="num">Paid</th><th class="num">Balance</th><th>Status</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div>':empty(statusFilter==='attention'?'Everyone has completed payment for this month.':statusFilter==='paid'?'No students have fully paid yet.':statusFilter==='free'?'No free-place students.':'No payment corrections needed.'))+
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
  document.querySelectorAll('[data-payment-status]').forEach(b=>b.onclick=()=>{state.filters.paymentStatus=b.dataset.paymentStatus;renderRoute();});
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
  const [staff,payroll]=await Promise.all([
    query(sb.from('staff').select('*').order('full_name')),
    query(sb.from('payroll').select('*, staff(full_name)').order('paid_at',{ascending:false}).limit(300))
  ]);
  const rows=staff.map(s=>'<tr><td><strong>'+esc(s.full_name)+'</strong></td><td>'+esc(s.role_title||'—')+'</td><td>'+esc(s.phone||'—')+'</td><td class="num">'+fmtMoney(s.monthly_salary)+'</td><td><span class="badge '+(s.active?'success':'')+'">'+(s.active?'Active':'Inactive')+'</span></td><td>'+actionButton('Edit','staff-edit',s.id)+'</td></tr>').join('');
  setTimeout(()=>bindStaffActions(staff),0);
  const staffTable=tablePage('Staff records','<button class="btn btn-primary" data-action="staff-new">'+uiIcon('plus')+'Add staff</button>',[['Name',''],['Role',''],['Phone',''],['Monthly salary','num'],['Status',''],['','']],rows,'No staff records.');
  const pRows=payroll.map(p=>'<tr><td>'+fmtDate(p.paid_at)+'</td><td>'+esc(p.staff?.full_name||'Staff')+'</td><td>'+new Date(p.salary_month+'T00:00:00').toLocaleDateString('en-GB',{month:'long',year:'numeric'})+'</td><td class="num">'+fmtMoney(p.amount)+'</td><td>'+esc(p.notes||'—')+'</td></tr>').join('');
  setTimeout(()=>document.querySelector('[data-action=payroll-new]')?.addEventListener('click',()=>openModal('Record payroll','<div class="form-cols">'+selectField('Staff member','staff_id',staff.filter(s=>s.active).map(s=>[s.id,s.full_name]))+field('Salary month','salary_month',monthStart().slice(0,7),'month','required')+field('Amount','amount','','number','required min="1"')+field('Paid date','paid_at',today(),'date','required')+textArea('Notes','notes','')+'</div>',async f=>{const m=val(f,'salary_month');return query(sb.from('payroll').insert({staff_id:val(f,'staff_id'),salary_month:m+'-01',amount:Number(val(f,'amount')),paid_at:val(f,'paid_at'),notes:val(f,'notes')||null,created_by:state.session.user.id}));})),0);
  return staffTable+'<div style="height:16px"></div>'+tablePage('Payroll history',staff.some(s=>s.active)?'<button class="btn btn-primary" data-action="payroll-new">'+uiIcon('plus')+'Record salary</button>':'<button class="btn btn-primary" disabled>No active staff</button>',[['Paid on',''],['Staff',''],['Salary month',''],['Amount','num'],['Notes','']],pRows,'No payroll entries.');
}
function staffForm(s={}){
  return '<div class="form-cols">'+field('Full name','full_name',s.full_name||'','','required')+field('Role title','role_title',s.role_title||'')+field('Phone','phone',s.phone||'','tel')+field('Monthly salary','monthly_salary',s.monthly_salary??0,'number','min="0"')+field('Start date','start_date',s.start_date||'','date')+'<div class="field"><label>Status</label><label class="inline-check"><input type="checkbox" name="active" '+(s.active!==false?'checked':'')+'> Active staff member</label></div></div>';
}
function bindStaffActions(staff){
  document.querySelector('[data-action=staff-new]')?.addEventListener('click',()=>openModal('Add staff member',staffForm(),async f=>query(sb.from('staff').insert({full_name:val(f,'full_name'),role_title:val(f,'role_title')||null,phone:val(f,'phone')||null,monthly_salary:Number(val(f,'monthly_salary')||0),start_date:val(f,'start_date')||null,active:checked(f,'active')}))));
  document.querySelectorAll('[data-action=staff-edit]').forEach(b=>b.onclick=()=>{const s=staff.find(x=>x.id===b.dataset.id);openModal('Edit staff member',staffForm(s),async f=>query(sb.from('staff').update({full_name:val(f,'full_name'),role_title:val(f,'role_title')||null,phone:val(f,'phone')||null,monthly_salary:Number(val(f,'monthly_salary')||0),start_date:val(f,'start_date')||null,active:checked(f,'active')}).eq('id',s.id)));});
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
  const rows=users.map(u=>'<tr><td><strong>'+esc(u.full_name||'—')+'</strong><div class="muted">'+esc(u.email||'')+'</div></td><td><span class="badge info">'+esc(humanize(u.role))+'</span></td><td><span class="badge '+(u.active?'success':'danger')+'">'+(u.active?'Active':'Inactive')+'</span></td><td>'+fmtDate((u.last_sign_in_at||'').slice(0,10))+'</td><td>'+(u.id!==state.session.user.id?'<div class="action-row">'+actionButton('Change role','user-role',u.id)+(u.active?actionButton('Deactivate','user-deactivate',u.id,'danger'):'<span class="muted">Deactivated</span>')+'</div>':'<span class="muted">Current user</span>')+'</td></tr>').join('');
  setTimeout(()=>bindUserActions(users,staff),0);
  return '<div class="section-note"><strong>Staff access</strong><br>Create teacher or cashier login accounts and link them to an existing staff record when possible.</div>'+tablePage('Login accounts','<button class="btn btn-primary" data-action="user-new">'+uiIcon('plus')+'Create account</button>',[['User',''],['Role',''],['Status',''],['Last sign-in',''],['','']],rows,'No accounts found.');
}
function bindUserActions(users,staff){
  document.querySelector('[data-action=user-new]')?.addEventListener('click',()=>{
    const available=staff.filter(s=>s.active&&!s.user_id);
    const staffOptions=[['','Create a new staff record'],...available.map(s=>[s.id,s.full_name+' — '+(s.role_title||'Staff')])];
    openModal('Create login account','<div class="form-cols">'+selectField('Link staff record','staff_id',staffOptions,'')+field('Full name','full_name','','','required')+field('Email','email','','email','required')+passwordInput('Temporary password','password','required minlength="8" autocomplete="new-password"')+field('Phone','phone','','tel')+selectField('Role','role',[['teacher','Teacher'],['cashier','Cashier']],'teacher')+'</div>',async f=>{
      const {data,error}=await sb.functions.invoke('manage-users',{body:{action:'create',full_name:val(f,'full_name'),email:val(f,'email'),password:val(f,'password'),phone:val(f,'phone'),role:val(f,'role'),staff_id:val(f,'staff_id')||null}}); if(error) throw error;if(data?.error)throw new Error(data.error);
    },'Create account');
    const staffEl=modalRoot.querySelector('[name=staff_id]');
    staffEl.onchange=()=>{
      const s=available.find(x=>x.id===staffEl.value);
      if(!s)return;
      modalRoot.querySelector('[name=full_name]').value=s.full_name||'';
      modalRoot.querySelector('[name=phone]').value=s.phone||'';
      modalRoot.querySelector('[name=role]').value=(s.role_title||'').toLowerCase().includes('cash')?'cashier':'teacher';
    };
  });
  document.querySelectorAll('[data-action=user-role]').forEach(b=>b.onclick=()=>{const u=users.find(x=>x.id===b.dataset.id);openModal('Change role',selectField('Role','role',[['teacher','Teacher'],['cashier','Cashier']],u.role),async f=>{const {data,error}=await sb.functions.invoke('manage-users',{body:{action:'set_role',user_id:u.id,role:val(f,'role')}});if(error)throw error;if(data?.error)throw new Error(data.error);},'Update role');});
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

async function renderRoute(force=false){
  if(!state.session){renderLogin();return;}
  if(!state.profile) await loadIdentity();
  const hash=(location.hash||'').replace('#','');
  if(hash && allowedRoutes().some(n=>n.id===hash)) state.route=hash;
  if(!allowedRoutes().some(n=>n.id===state.route)) state.route='dashboard';
  try{
    renderShell('<div class="panel"><div class="panel-body">Loading…</div></div>');
    let content='';
    switch(state.route){
      case 'dashboard': content=await dashboardPage(); break;
      case 'leads': content=await leadsPage(); break;
      case 'students': content=await studentsPage(); break;
      case 'groups': content=await groupsPage(); break;
      case 'attendance': content=await attendancePage(); break;
      case 'academic': content=await academicPage(); break;
      case 'payments': content=await paymentsPage(); break;
      case 'expenses': content=await expensesPage(); break;
      case 'staff': content=await staffPage(); break;
      case 'reports': content=await reportsPage(); break;
      case 'users': content=await usersPage(); break;
      case 'settings': content=await settingsPage(); break;
      default: content=await dashboardPage();
    }
    renderShell(content);
  }catch(e){console.error(e);renderShell('<section class="panel"><div class="panel-body"><div class="login-error"><strong>Could not load this page.</strong><br>'+esc(e.message||e)+'</div><button class="btn btn-primary" id="retry">Try again</button></div></section>');document.getElementById('retry').onclick=()=>renderRoute(true);}
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
  if(render) await renderRoute();
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
