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
const monthStart = d => {
  const x = d ? new Date(d) : new Date();
  return new Date(x.getFullYear(),x.getMonth(),1).toISOString().slice(0,10);
};
const today = () => new Date().toISOString().slice(0,10);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const initials = name => (name||'V').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
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
  let lastGroup='';
  const nav=allowedRoutes().map(n=>{
    const heading=n.group!==lastGroup ? '<div class="nav-group">'+esc(n.group)+'</div>' : '';
    lastGroup=n.group;
    return heading+'<button class="nav-btn '+(state.route===n.id?'active':'')+'" data-route="'+n.id+'"><span class="nav-icon">'+n.icon+'</span>'+esc(n.label)+'</button>';
  }).join('');
  app.className='';
  app.innerHTML =
    '<div class="shell">'+
      '<aside class="sidebar '+(state.sidebarOpen?'open':'')+'">'+
        '<div class="sidebar-brand"><div class="brand-mark">V</div><div><strong>Vision CRM</strong><span>Learning Centre</span></div></div>'+
        '<nav class="nav">'+nav+'</nav>'+
        '<div class="sidebar-foot"><div class="user-mini"><div class="avatar">'+esc(initials(state.profile?.full_name))+'</div><div><strong>'+esc(state.profile?.full_name||'User')+'</strong><span>'+esc(role())+'</span></div></div>'+
        '<button id="signout" class="nav-btn" style="width:100%;margin-top:4px"><span class="nav-icon">↪</span>Sign out</button></div>'+
      '</aside>'+
      (state.sidebarOpen?'<div class="mobile-overlay" id="overlay"></div>':'')+
      '<main class="main">'+
        '<header class="topbar"><div class="topbar-left"><button class="icon-btn menu-btn" id="menu">☰</button><div class="page-title"><h1>'+esc(meta[0])+'</h1><p>'+esc(meta[1])+'</p></div></div>'+
        '<div class="top-actions"><span class="badge info desktop-only">'+esc(role())+'</span><button class="btn btn-secondary desktop-only" id="refresh">Refresh</button></div></header>'+
        '<div class="content">'+content+'</div>'+
      '</main>'+
    '</div>';
  document.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>go(b.dataset.route));
  document.getElementById('signout').onclick=async()=>{await sb.auth.signOut();};
  document.getElementById('refresh').onclick=()=>renderRoute(true);
  document.getElementById('menu').onclick=()=>{state.sidebarOpen=!state.sidebarOpen;renderRoute();};
  document.getElementById('overlay')?.addEventListener('click',()=>{state.sidebarOpen=false;renderRoute();});
}
function go(routeName){
  if(!allowedRoutes().some(n=>n.id===routeName)) routeName='dashboard';
  state.route=routeName; state.sidebarOpen=false;
  history.replaceState(null,'','#'+routeName);
  renderRoute();
}

function renderLogin(error=''){
  app.className='';
  app.innerHTML =
    '<div class="auth-wrap">'+
      '<section class="auth-hero"><div class="auth-logo"><div class="brand-mark">V</div>VISION LEARNING CENTRE</div>'+
        '<div class="auth-hero-copy"><h1>Your centre.<br>One clear system.</h1><p>Manage students, groups, attendance, payments, staff and academic progress in one secure place.</p><div class="auth-badges"><span class="auth-badge">Students</span><span class="auth-badge">Attendance</span><span class="auth-badge">Payments</span><span class="auth-badge">Reports</span></div></div>'+
        '<div style="font-size:12px;color:#9fc4d8">Vision CRM • Internal management system</div></section>'+
      '<section class="auth-panel"><div class="auth-card"><h2>Welcome back</h2><p class="sub">Sign in with your Vision CRM account.</p>'+
        (error?'<div class="login-error">'+esc(error)+'</div>':'')+
        '<form id="login-form" class="form-grid">'+field('Email','email','','email','required autocomplete="email"')+field('Password','password','','password','required autocomplete="current-password"')+
        '<button class="btn btn-primary btn-block" type="submit">Sign in</button></form>'+
        '<div class="auth-help"><span>Accounts are created by the owner.</span><button class="link-btn" id="forgot">Forgot password?</button></div>'+
      '</div></section></div>';
  document.getElementById('login-form').onsubmit=async e=>{
    e.preventDefault();
    const b=e.currentTarget.querySelector('button'); b.disabled=true;b.textContent='Signing in…';
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
  app.innerHTML='<div class="auth-wrap"><section class="auth-hero"><div class="auth-logo"><div class="brand-mark">V</div>VISION LEARNING CENTRE</div><div class="auth-hero-copy"><h1>Set a new password.</h1><p>Choose a strong password for your Vision CRM account.</p></div><div></div></section><section class="auth-panel"><div class="auth-card"><h2>New password</h2><p class="sub">Use at least 8 characters.</p><form id="pw-form" class="form-grid">'+field('New password','password','','password','required minlength="8"')+'<button class="btn btn-primary" type="submit">Update password</button></form></div></section></div>';
  document.getElementById('pw-form').onsubmit=async e=>{
    e.preventDefault(); const {error}=await sb.auth.updateUser({password:val(e.currentTarget,'password')});
    if(error) return fail(error); toast('Password updated.'); state.route='dashboard'; await renderRoute();
  };
}

async function dashboardPage(){
  const first=monthStart();
  const last=new Date(new Date(first).getFullYear(),new Date(first).getMonth()+1,0).toISOString().slice(0,10);
  const [students,groups,payments,attendance] = await Promise.all([
    query(sb.from('students').select('id,full_name,status,group_id,monthly_fee,discount_amount,is_free_place').eq('status','active')),
    query(sb.from('groups').select('id,name,capacity,active,default_monthly_fee').eq('active',true)),
    can('owner','admin','cashier') ? query(sb.from('payments').select('id,amount,paid_at,student_id').gte('paid_at',first).lte('paid_at',last)) : Promise.resolve([]),
    can('owner','admin','teacher') ? query(sb.from('attendance').select('id,status,lesson_date,student_id').gte('lesson_date',first).lte('lesson_date',last)) : Promise.resolve([])
  ]);
  const revenue=payments.reduce((s,x)=>s+Number(x.amount),0);
  const expected=students.reduce((s,x)=>s+(x.is_free_place?0:Math.max(0,Number(x.monthly_fee)-Number(x.discount_amount))),0);
  const attendanceRate=attendance.length?Math.round(attendance.filter(x=>x.status==='present'||x.status==='late').length/attendance.length*100):0;
  const paidStudentIds=new Set(payments.map(x=>x.student_id));
  const unpaid=students.filter(x=>!x.is_free_place&&!paidStudentIds.has(x.id));
  const fill=groups.reduce((a,g)=>a+students.filter(s=>s.group_id===g.id).length,0);
  const capacity=groups.reduce((a,g)=>a+Number(g.capacity||0),0);
  return '<div class="cards">'+
    statCard('Active students',students.length,'Across '+groups.length+' active groups','◉')+
    statCard(can('owner','admin','cashier')?'Collected this month':'My active groups',can('owner','admin','cashier')?fmtMoney(revenue):groups.length,can('owner','admin','cashier')?Math.round(expected?revenue/expected*100:0)+'% of expected fees':'Assigned teaching view','₸')+
    statCard(can('owner','admin','teacher')?'Attendance rate':'Group capacity',can('owner','admin','teacher')?attendanceRate+'%':(capacity?Math.round(fill/capacity*100):0)+'%',can('owner','admin','teacher')?attendance.length+' attendance records':fill+' / '+capacity+' places','✓')+
    statCard(can('owner','admin','cashier')?'Unpaid students':'Active learners',can('owner','admin','cashier')?unpaid.length:students.length,can('owner','admin','cashier')?'Current month':'Visible to your account','!')+
  '</div>'+
  '<div class="grid-2"><section class="panel"><div class="panel-head"><div><h2>Groups overview</h2><p>Current occupancy and monthly fee</p></div></div><div class="panel-body">'+
    (groups.length?'<div class="kpi-list">'+groups.map(g=>{const c=students.filter(s=>s.group_id===g.id).length;const pct=Math.min(100,Math.round(c/Number(g.capacity||1)*100));return '<div class="kpi-line"><div class="kpi-line-head"><strong>'+esc(g.name)+'</strong><span>'+c+' / '+g.capacity+'</span></div><div class="progress"><span style="width:'+pct+'%"></span></div><div class="muted" style="font-size:11px">'+fmtMoney(g.default_monthly_fee)+' default fee</div></div>';}).join('')+'</div>':empty('No active groups.'))+
  '</div></section><section class="panel"><div class="panel-head"><div><h2>'+ (can('owner','admin','cashier')?'Payment attention':'Today') +'</h2><p>'+ (can('owner','admin','cashier')?'Students without a payment this month':'Teaching snapshot') +'</p></div></div><div class="panel-body">'+
    (can('owner','admin','cashier') ? (unpaid.length?'<div class="list">'+unpaid.slice(0,8).map(s=>'<div class="list-item"><div class="list-main"><strong>'+esc(s.full_name)+'</strong><span>'+fmtMoney(Math.max(0,Number(s.monthly_fee)-Number(s.discount_amount)))+' due</span></div><span class="badge warn">Unpaid</span></div>').join('')+'</div>':empty('Everyone visible has a payment this month.')) : '<div class="section-note">Use Attendance and Academic Records from the menu to manage your teaching work.</div>')+
  '</div></section></div>';
}
function statCard(label,value,note,icon){return '<div class="stat"><div class="stat-top"><span class="stat-label">'+esc(label)+'</span><span class="stat-icon">'+icon+'</span></div><div class="stat-value">'+esc(value)+'</div><div class="stat-note">'+esc(note)+'</div></div>';}

async function studentsPage(){
  const [students,groups]=await Promise.all([
    query(sb.from('students').select('*, groups(name)').order('full_name')),
    query(sb.from('groups').select('id,name,default_monthly_fee').eq('active',true).order('name'))
  ]);
  state.cache.groups=groups;
  const add=can('owner','admin','cashier')?'<button class="btn btn-primary" data-action="student-new">+ Add student</button>':'';
  const rows=students.map(s=>'<tr><td><strong>'+esc(s.full_name)+'</strong><div class="muted">'+esc(s.grade_or_age||'')+'</div></td><td>'+esc(s.groups?.name||'Unassigned')+'</td><td>'+esc(s.phone||'—')+'</td><td class="num">'+fmtMoney(s.is_free_place?0:Math.max(0,Number(s.monthly_fee)-Number(s.discount_amount)))+'</td><td><span class="badge '+(s.status==='active'?'success':s.status==='paused'?'warn':'')+'">'+esc(s.status)+'</span></td><td><div class="action-row">'+(can('owner','admin','cashier')?actionButton('Edit','student-edit',s.id):'')+'</div></td></tr>').join('');
  setTimeout(()=>bindStudentActions(students,groups),0);
  return tablePage('Student records',add,[
    ['Student',''],['Group',''],['Phone',''],['Monthly due','num'],['Status',''],['','']
  ],rows,'No students found.');
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
    selectField('Status','status',['active','paused','left'],s.status||'active')+
    '<div class="field"><label>Free place</label><label class="inline-check"><input type="checkbox" name="is_free_place" '+(s.is_free_place?'checked':'')+'> Student studies free</label></div>'+
    textArea('Notes','notes',s.notes||'')+'</div>';
}
function bindStudentActions(students,groups){
  document.querySelector('[data-action="student-new"]')?.addEventListener('click',()=>openModal('Add student',studentForm({},groups),async f=>{
    const gid=val(f,'group_id'); const g=groups.find(x=>x.id===gid);
    const payload={full_name:val(f,'full_name'),grade_or_age:val(f,'grade_or_age')||null,phone:val(f,'phone')||null,parent_phone:val(f,'parent_phone')||null,group_id:gid||null,join_date:val(f,'join_date')||today(),monthly_fee:Number(val(f,'monthly_fee')||g?.default_monthly_fee||0),discount_amount:Number(val(f,'discount_amount')||0),is_free_place:checked(f,'is_free_place'),status:val(f,'status'),notes:val(f,'notes')||null};
    await query(sb.from('students').insert(payload));
  }));
  document.querySelectorAll('[data-action="student-edit"]').forEach(b=>b.onclick=()=>{
    const s=students.find(x=>x.id===b.dataset.id); openModal('Edit student',studentForm(s,groups),async f=>{
      const payload={full_name:val(f,'full_name'),grade_or_age:val(f,'grade_or_age')||null,phone:val(f,'phone')||null,parent_phone:val(f,'parent_phone')||null,group_id:val(f,'group_id')||null,join_date:val(f,'join_date'),monthly_fee:Number(val(f,'monthly_fee')||0),discount_amount:Number(val(f,'discount_amount')||0),is_free_place:checked(f,'is_free_place'),status:val(f,'status'),notes:val(f,'notes')||null};
      await query(sb.from('students').update(payload).eq('id',s.id));
    });
  });
}

async function groupsPage(){
  const [groups,staff,students]=await Promise.all([
    query(sb.from('groups').select('*, staff(full_name)').order('name')),
    can('owner','admin')?query(sb.from('staff').select('id,full_name,role_title,active').eq('active',true).order('full_name')):Promise.resolve([]),
    query(sb.from('students').select('id,group_id,status').eq('status','active'))
  ]);
  const rows=groups.map(g=>{const n=students.filter(s=>s.group_id===g.id).length;return '<tr><td><strong>'+esc(g.name)+'</strong><div class="muted">'+esc(g.level||'')+'</div></td><td>'+esc(g.schedule||'—')+'</td><td>'+esc(g.staff?.full_name||'—')+'</td><td>'+n+' / '+g.capacity+'</td><td class="num">'+fmtMoney(g.default_monthly_fee)+'</td><td><span class="badge '+(g.active?'success':'')+'">'+(g.active?'Active':'Inactive')+'</span></td><td>'+(can('owner','admin')?actionButton('Edit','group-edit',g.id):'')+'</td></tr>';}).join('');
  setTimeout(()=>bindGroupActions(groups,staff),0);
  return tablePage('Class groups',can('owner','admin')?'<button class="btn btn-primary" data-action="group-new">+ Add group</button>':'',[['Group',''],['Schedule',''],['Teacher',''],['Students',''],['Default fee','num'],['Status',''],['','']],rows,'No groups found.');
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
  const leads=await query(sb.from('leads').select('*').order('created_at',{ascending:false}));
  const rows=leads.map(l=>'<tr><td><strong>'+esc(l.full_name)+'</strong><div class="muted">'+esc(l.grade_or_age||'')+'</div></td><td>'+esc(l.phone||l.parent_phone||'—')+'</td><td>'+esc(l.interested_course||'—')+'</td><td>'+esc(l.source||'—')+'</td><td><span class="badge info">'+esc(l.status.replaceAll('_',' '))+'</span></td><td>'+fmtDate(l.next_follow_up)+'</td><td>'+actionButton('Edit','lead-edit',l.id)+'</td></tr>').join('');
  setTimeout(()=>bindLeadActions(leads),0);
  return tablePage('Prospective students','<button class="btn btn-primary" data-action="lead-new">+ Add lead</button>',[['Name',''],['Phone',''],['Course',''],['Source',''],['Status',''],['Follow-up',''],['','']],rows,'No leads yet.');
}
function leadForm(l={}){
  return '<div class="form-cols">'+field('Full name','full_name',l.full_name||'','','required')+field('Grade / age','grade_or_age',l.grade_or_age||'')+field('Phone','phone',l.phone||'','tel')+field('Parent phone','parent_phone',l.parent_phone||'','tel')+field('Interested course','interested_course',l.interested_course||'')+field('Source','source',l.source||'')+
  selectField('Status','status',[['new','New'],['contacted','Contacted'],['trial_booked','Trial booked'],['trial_attended','Trial attended'],['enrolled','Enrolled'],['lost','Lost']],l.status||'new')+field('Next follow-up','next_follow_up',l.next_follow_up||'','date')+textArea('Notes','notes',l.notes||'')+'</div>';
}
function bindLeadActions(leads){
  document.querySelector('[data-action="lead-new"]')?.addEventListener('click',()=>openModal('Add lead',leadForm(),async f=>query(sb.from('leads').insert({full_name:val(f,'full_name'),grade_or_age:val(f,'grade_or_age')||null,phone:val(f,'phone')||null,parent_phone:val(f,'parent_phone')||null,interested_course:val(f,'interested_course')||null,source:val(f,'source')||null,status:val(f,'status'),next_follow_up:val(f,'next_follow_up')||null,notes:val(f,'notes')||null}))));
  document.querySelectorAll('[data-action="lead-edit"]').forEach(b=>b.onclick=()=>{const l=leads.find(x=>x.id===b.dataset.id);openModal('Edit lead',leadForm(l),async f=>query(sb.from('leads').update({full_name:val(f,'full_name'),grade_or_age:val(f,'grade_or_age')||null,phone:val(f,'phone')||null,parent_phone:val(f,'parent_phone')||null,interested_course:val(f,'interested_course')||null,source:val(f,'source')||null,status:val(f,'status'),next_follow_up:val(f,'next_follow_up')||null,notes:val(f,'notes')||null}).eq('id',l.id)));});
}

async function paymentsPage(){
  const [payments,students]=await Promise.all([
    query(sb.from('payments').select('*, students(full_name)').order('paid_at',{ascending:false}).limit(500)),
    query(sb.from('students').select('id,full_name,monthly_fee,discount_amount,is_free_place,status').eq('status','active').order('full_name'))
  ]);
  const rows=payments.map(p=>'<tr><td>'+fmtDate(p.paid_at)+'</td><td><strong>'+esc(p.students?.full_name||'Student')+'</strong></td><td>'+new Date(p.fee_month+'T00:00:00').toLocaleDateString('en-GB',{month:'long',year:'numeric'})+'</td><td class="num">'+fmtMoney(p.amount)+'</td><td>'+esc(p.method.replace('_',' / '))+'</td><td>'+esc(p.reference||'—')+'</td></tr>').join('');
  setTimeout(()=>bindPaymentActions(students),0);
  return tablePage('Fee payments','<button class="btn btn-primary" data-action="payment-new">+ Record payment</button>',[['Paid on',''],['Student',''],['Fee month',''],['Amount','num'],['Method',''],['Reference','']],rows,'No payments recorded.');
}
function bindPaymentActions(students){
  document.querySelector('[data-action="payment-new"]')?.addEventListener('click',()=>{
    const body='<div class="form-cols">'+selectField('Student','student_id',students.map(s=>[s.id,s.full_name]),students[0]?.id||'')+field('Fee month','fee_month',monthStart(),'month','required')+field('Amount','amount','','number','required min="1"')+field('Paid date','paid_at',today(),'date','required')+selectField('Method','method',[['cash','Cash'],['card_transfer','Card / transfer'],['other','Other']],'cash')+field('Reference','reference','')+textArea('Notes','notes','')+'</div>';
    openModal('Record payment',body,async f=>{
      const s=students.find(x=>x.id===val(f,'student_id')); let amount=Number(val(f,'amount'));
      if(!amount&&s) amount=s.is_free_place?0:Math.max(0,Number(s.monthly_fee)-Number(s.discount_amount));
      if(amount<=0) throw new Error('Payment amount must be greater than zero.');
      const m=val(f,'fee_month'); await query(sb.from('payments').insert({student_id:val(f,'student_id'),fee_month:m.length===7?m+'-01':monthStart(m),amount,paid_at:val(f,'paid_at'),method:val(f,'method'),reference:val(f,'reference')||null,notes:val(f,'notes')||null,created_by:state.session.user.id}));
    });
    const studentEl=modalRoot.querySelector('[name=student_id]'), amountEl=modalRoot.querySelector('[name=amount]');
    const setAmount=()=>{const s=students.find(x=>x.id===studentEl.value);if(s) amountEl.value=s.is_free_place?0:Math.max(0,Number(s.monthly_fee)-Number(s.discount_amount));};
    studentEl.onchange=setAmount; setAmount();
  });
}

async function attendancePage(){
  const [students,groups]=await Promise.all([
    query(sb.from('students').select('id,full_name,group_id,status').eq('status','active').order('full_name')),
    query(sb.from('groups').select('id,name').eq('active',true).order('name'))
  ]);
  const selectedGroup=groups[0]?.id||'';
  setTimeout(()=>setupAttendance(students,groups,selectedGroup),0);
  return '<section class="panel"><div class="panel-head"><div><h2>Mark attendance</h2><p>Select a group and lesson date, then save.</p></div></div><div class="panel-body"><div class="toolbar"><div class="toolbar-left"><select class="select" id="att-group">'+groups.map(g=>'<option value="'+g.id+'">'+esc(g.name)+'</option>').join('')+'</select><input class="input" id="att-date" type="date" value="'+today()+'"></div><div class="toolbar-right"><button class="btn btn-primary" id="att-save">Save attendance</button></div></div><div id="att-list">'+empty('Choose a group.')+'</div></div></section>';
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
  return tablePage('Academic progress','<button class="btn btn-primary" data-action="academic-new">+ Add record</button>',[['Date',''],['Student',''],['Type',''],['Topic',''],['Score',''],['Teacher note','']],rows,'No academic records yet.');
}

async function expensesPage(){
  const expenses=await query(sb.from('expenses').select('*').order('expense_date',{ascending:false}).limit(500));
  const rows=expenses.map(e=>'<tr><td>'+fmtDate(e.expense_date)+'</td><td>'+esc(e.category)+'</td><td>'+esc(e.description||'—')+'</td><td class="num">'+fmtMoney(e.amount)+'</td><td>'+esc(e.method.replace('_',' / '))+'</td></tr>').join('');
  setTimeout(()=>document.querySelector('[data-action=expense-new]')?.addEventListener('click',()=>openModal('Add expense','<div class="form-cols">'+field('Date','expense_date',today(),'date','required')+field('Category','category','','','required')+field('Amount','amount','','number','required min="1"')+selectField('Method','method',[['cash','Cash'],['card_transfer','Card / transfer'],['other','Other']],'cash')+textArea('Description','description','')+'</div>',async f=>query(sb.from('expenses').insert({expense_date:val(f,'expense_date'),category:val(f,'category'),amount:Number(val(f,'amount')),method:val(f,'method'),description:val(f,'description')||null,created_by:state.session.user.id})))),0);
  return tablePage('Centre expenses','<button class="btn btn-primary" data-action="expense-new">+ Add expense</button>',[['Date',''],['Category',''],['Description',''],['Amount','num'],['Method','']],rows,'No expenses recorded.');
}

async function staffPage(){
  const [staff,payroll]=await Promise.all([
    query(sb.from('staff').select('*').order('full_name')),
    query(sb.from('payroll').select('*, staff(full_name)').order('paid_at',{ascending:false}).limit(300))
  ]);
  const rows=staff.map(s=>'<tr><td><strong>'+esc(s.full_name)+'</strong></td><td>'+esc(s.role_title||'—')+'</td><td>'+esc(s.phone||'—')+'</td><td class="num">'+fmtMoney(s.monthly_salary)+'</td><td><span class="badge '+(s.active?'success':'')+'">'+(s.active?'Active':'Inactive')+'</span></td><td>'+actionButton('Edit','staff-edit',s.id)+'</td></tr>').join('');
  setTimeout(()=>bindStaffActions(staff),0);
  const staffTable=tablePage('Staff records','<button class="btn btn-primary" data-action="staff-new">+ Add staff</button>',[['Name',''],['Role',''],['Phone',''],['Monthly salary','num'],['Status',''],['','']],rows,'No staff records.');
  const pRows=payroll.map(p=>'<tr><td>'+fmtDate(p.paid_at)+'</td><td>'+esc(p.staff?.full_name||'Staff')+'</td><td>'+new Date(p.salary_month+'T00:00:00').toLocaleDateString('en-GB',{month:'long',year:'numeric'})+'</td><td class="num">'+fmtMoney(p.amount)+'</td><td>'+esc(p.notes||'—')+'</td></tr>').join('');
  setTimeout(()=>document.querySelector('[data-action=payroll-new]')?.addEventListener('click',()=>openModal('Record payroll','<div class="form-cols">'+selectField('Staff member','staff_id',staff.filter(s=>s.active).map(s=>[s.id,s.full_name]))+field('Salary month','salary_month',monthStart().slice(0,7),'month','required')+field('Amount','amount','','number','required min="1"')+field('Paid date','paid_at',today(),'date','required')+textArea('Notes','notes','')+'</div>',async f=>{const m=val(f,'salary_month');return query(sb.from('payroll').insert({staff_id:val(f,'staff_id'),salary_month:m+'-01',amount:Number(val(f,'amount')),paid_at:val(f,'paid_at'),notes:val(f,'notes')||null,created_by:state.session.user.id}));})),0);
  return staffTable+'<div style="height:16px"></div>'+tablePage('Payroll history','<button class="btn btn-primary" data-action="payroll-new">+ Record salary</button>',[['Paid on',''],['Staff',''],['Salary month',''],['Amount','num'],['Notes','']],pRows,'No payroll entries.');
}
function staffForm(s={}){
  return '<div class="form-cols">'+field('Full name','full_name',s.full_name||'','','required')+field('Role title','role_title',s.role_title||'')+field('Phone','phone',s.phone||'','tel')+field('Monthly salary','monthly_salary',s.monthly_salary??0,'number','min="0"')+field('Start date','start_date',s.start_date||'','date')+'<div class="field"><label>Status</label><label class="inline-check"><input type="checkbox" name="active" '+(s.active!==false?'checked':'')+'> Active staff member</label></div></div>';
}
function bindStaffActions(staff){
  document.querySelector('[data-action=staff-new]')?.addEventListener('click',()=>openModal('Add staff member',staffForm(),async f=>query(sb.from('staff').insert({full_name:val(f,'full_name'),role_title:val(f,'role_title')||null,phone:val(f,'phone')||null,monthly_salary:Number(val(f,'monthly_salary')||0),start_date:val(f,'start_date')||null,active:checked(f,'active')}))));
  document.querySelectorAll('[data-action=staff-edit]').forEach(b=>b.onclick=()=>{const s=staff.find(x=>x.id===b.dataset.id);openModal('Edit staff member',staffForm(s),async f=>query(sb.from('staff').update({full_name:val(f,'full_name'),role_title:val(f,'role_title')||null,phone:val(f,'phone')||null,monthly_salary:Number(val(f,'monthly_salary')||0),start_date:val(f,'start_date')||null,active:checked(f,'active')}).eq('id',s.id)));});
}

async function reportsPage(){
  const first=monthStart(); const yearStart=new Date().getFullYear()+'-01-01';
  const [students,groups,payments,expenses,payroll] = await Promise.all([
    query(sb.from('students').select('id,status,monthly_fee,discount_amount,is_free_place,group_id')),
    query(sb.from('groups').select('id,name,capacity,active')),
    query(sb.from('payments').select('amount,paid_at,student_id').gte('paid_at',yearStart)),
    query(sb.from('expenses').select('amount,expense_date,category').gte('expense_date',yearStart)),
    query(sb.from('payroll').select('amount,paid_at').gte('paid_at',yearStart))
  ]);
  const active=students.filter(s=>s.status==='active');
  const monthRevenue=payments.filter(p=>p.paid_at>=first).reduce((s,x)=>s+Number(x.amount),0);
  const monthExpenses=expenses.filter(e=>e.expense_date>=first).reduce((s,x)=>s+Number(x.amount),0);
  const monthPayroll=payroll.filter(p=>p.paid_at>=first).reduce((s,x)=>s+Number(x.amount),0);
  const expected=active.reduce((s,x)=>s+(x.is_free_place?0:Math.max(0,Number(x.monthly_fee)-Number(x.discount_amount))),0);
  const ytdRevenue=payments.reduce((s,x)=>s+Number(x.amount),0);
  const ytdCosts=expenses.reduce((s,x)=>s+Number(x.amount),0)+payroll.reduce((s,x)=>s+Number(x.amount),0);
  const groupRows=groups.map(g=>{const n=active.filter(s=>s.group_id===g.id).length;return '<tr><td>'+esc(g.name)+'</td><td>'+n+'</td><td>'+g.capacity+'</td><td>'+Math.round(n/Number(g.capacity||1)*100)+'%</td></tr>';}).join('');
  return '<div class="report-grid">'+reportCard('Expected monthly fees',fmtMoney(expected))+reportCard('Collected this month',fmtMoney(monthRevenue))+reportCard('Collection rate',(expected?Math.round(monthRevenue/expected*100):0)+'%')+reportCard('Operating expenses',fmtMoney(monthExpenses))+reportCard('Payroll this month',fmtMoney(monthPayroll))+reportCard('Month net cash',fmtMoney(monthRevenue-monthExpenses-monthPayroll))+reportCard('YTD revenue',fmtMoney(ytdRevenue))+reportCard('YTD total costs',fmtMoney(ytdCosts))+reportCard('YTD net cash',fmtMoney(ytdRevenue-ytdCosts))+'</div><div style="height:16px"></div>'+
  '<section class="panel"><div class="panel-head"><div><h2>Group occupancy</h2><p>Active students against group capacity</p></div></div><div class="panel-body"><div class="table-wrap"><table><thead><tr><th>Group</th><th>Students</th><th>Capacity</th><th>Occupancy</th></tr></thead><tbody>'+groupRows+'</tbody></table></div></div></section>';
}
function reportCard(label,value){return '<div class="report-card"><h3>'+esc(label)+'</h3><div class="report-value">'+esc(value)+'</div></div>';}

async function usersPage(){
  const {data,error}=await sb.functions.invoke('manage-users',{body:{action:'list'}});
  if(error) throw error;
  const users=data?.users||[];
  const rows=users.map(u=>'<tr><td><strong>'+esc(u.full_name||'—')+'</strong><div class="muted">'+esc(u.email||'')+'</div></td><td><span class="badge info">'+esc(u.role)+'</span></td><td><span class="badge '+(u.active?'success':'danger')+'">'+(u.active?'Active':'Inactive')+'</span></td><td>'+fmtDate((u.last_sign_in_at||'').slice(0,10))+'</td><td>'+(u.id!==state.session.user.id?'<div class="action-row">'+actionButton('Role','user-role',u.id)+actionButton('Deactivate','user-deactivate',u.id,'danger')+'</div>':'<span class="muted">Current user</span>')+'</td></tr>').join('');
  setTimeout(()=>bindUserActions(users),0);
  return '<div class="section-note">Teacher and cashier accounts can be created here. Owner/admin rights are protected from accidental changes.</div>'+tablePage('Login accounts','<button class="btn btn-primary" data-action="user-new">+ Create account</button>',[['User',''],['Role',''],['Status',''],['Last sign-in',''],['','']],rows,'No accounts found.');
}
function bindUserActions(users){
  document.querySelector('[data-action=user-new]')?.addEventListener('click',()=>openModal('Create login account','<div class="form-cols">'+field('Full name','full_name','','','required')+field('Email','email','','email','required')+field('Temporary password','password','','password','required minlength="8"')+field('Phone','phone','','tel')+selectField('Role','role',[['teacher','Teacher'],['cashier','Cashier']],'teacher')+'</div>',async f=>{
    const {data,error}=await sb.functions.invoke('manage-users',{body:{action:'create',full_name:val(f,'full_name'),email:val(f,'email'),password:val(f,'password'),phone:val(f,'phone'),role:val(f,'role')}}); if(error) throw error;if(data?.error)throw new Error(data.error);
  },'Create account'));
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
