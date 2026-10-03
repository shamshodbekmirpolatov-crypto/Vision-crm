(() => {
'use strict';

const app=document.getElementById('parent-app');
const toastEl=document.getElementById('parent-toast');
const SUPABASE_URL='https://ctdzmoaftajdkvreyqox.supabase.co';
const SUPABASE_KEY='sb_publishable_DW6EY5_aJ6TShRxhq3x28g_TGJ-kEBJ';
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});

let portalData=null;
let portalAuth=null;
let activeLang='uz';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const fmtDateTime=v=>v?new Date(v).toLocaleString(activeLang==='ru'?'ru-RU':activeLang==='uz'?'uz-UZ':'en-GB',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}):'—';
function toast(message){toastEl.textContent=message;toastEl.className='student-toast show';clearTimeout(toastEl.t);toastEl.t=setTimeout(()=>toastEl.className='student-toast',2800);}

const COPY={
  uz:{
    kicker:"OTA-ONA PORTALI",line1:"Farzandingiz haqida",line2:"muhim ma’lumotlar bir joyda.",
    body:"Guruh, dars jadvali va Vision xabarnomalari — barchasi bitta xavfsiz portalda.",
    welcome:"Xush kelibsiz",intro:"Telefon raqamingiz va parolingizni kiriting.",
    phone:"Telefon raqami",password:"Parol",open:"Portalni ochish",
    note:"Birinchi parol vaqtinchalik. Ilk kirishda uni yangi shaxsiy parolga almashtirasiz.",
    change:"Yangi parol yarating",newPassword:"Yangi parol",confirm:"Parolni tasdiqlang",
    save:"Saqlash",children:"Farzandlar",notifications:"Xabarnomalar",noNotifications:"Hozircha xabarnoma yo‘q.",
    markRead:"O‘qildi deb belgilash",signOut:"Chiqish",unread:"o‘qilmagan"
  },
  ru:{
    kicker:"ПОРТАЛ ДЛЯ РОДИТЕЛЕЙ",line1:"Важная информация",line2:"о вашем ребёнке в одном месте.",
    body:"Группа, расписание и уведомления Vision — в одном защищённом портале.",
    welcome:"Добро пожаловать",intro:"Введите номер телефона и пароль.",
    phone:"Номер телефона",password:"Пароль",open:"Открыть портал",
    note:"Первый пароль временный. При первом входе вы создадите новый личный пароль.",
    change:"Создайте новый пароль",newPassword:"Новый пароль",confirm:"Подтвердите пароль",
    save:"Сохранить",children:"Дети",notifications:"Уведомления",noNotifications:"Пока уведомлений нет.",
    markRead:"Отметить как прочитанное",signOut:"Выйти",unread:"непрочитанных"
  },
  en:{
    kicker:"PARENT PORTAL",line1:"Important information",line2:"about your child in one place.",
    body:"Group details, lesson schedule and Vision notifications in one secure portal.",
    welcome:"Welcome",intro:"Enter your phone number and password.",
    phone:"Phone number",password:"Password",open:"Open portal",
    note:"Your first password is temporary. You must create a private password on first login.",
    change:"Create a new password",newPassword:"New password",confirm:"Confirm password",
    save:"Save password",children:"Children",notifications:"Notifications",noNotifications:"No notifications yet.",
    markRead:"Mark as read",signOut:"Sign out",unread:"unread"
  }
};

function renderLanguageButtons(){
  return '<div class="parent-language-row">'+['uz','ru','en'].map(lang=>'<button type="button" data-lang="'+lang+'" class="'+(lang===activeLang?'active':'')+'">'+lang.toUpperCase()+'</button>').join('')+'</div>';
}
function bindLanguages(rerender){
  app.querySelectorAll('[data-lang]').forEach(btn=>btn.onclick=()=>{
    activeLang=btn.dataset.lang;
    rerender();
  });
}

function renderLogin(error='',phone=''){
  const c=COPY[activeLang];
  app.innerHTML='<div class="student-login">'+
    '<section class="student-login-hero">'+
      '<div class="student-brand"><img src="./vision-logo.jpg" alt="Vision Learning Centre"><div><strong>VISION</strong><span>LEARNING CENTRE</span></div></div>'+
      '<div class="student-hero-copy"><small>'+esc(c.kicker)+'</small><h1>'+esc(c.line1)+'<br><em>'+esc(c.line2)+'</em></h1><p>'+esc(c.body)+'</p></div>'+
    '</section>'+
    '<section class="student-login-panel"><div class="student-login-card">'+
      renderLanguageButtons()+
      '<div class="mini-brand"><img src="./vision-logo.jpg" alt="Vision Learning Centre"><div><strong>'+esc(c.kicker)+'</strong><span>Vision Learning Centre</span></div></div>'+
      '<h2>'+esc(c.welcome)+'</h2><p>'+esc(c.intro)+'</p>'+
      (error?'<div class="login-error">'+esc(error)+'</div>':'')+
      '<form id="parent-login-form" class="login-form">'+
        '<div class="field parent-login-phone"><label for="parent-phone">'+esc(c.phone)+'</label><div class="input-shell"><input id="parent-phone" name="phone" inputmode="tel" autocomplete="username" value="'+esc(phone)+'" placeholder="+998…" required></div></div>'+
        '<div class="field"><label for="parent-password">'+esc(c.password)+'</label><div class="input-shell"><input id="parent-password" name="password" type="password" autocomplete="current-password" placeholder="••••••" required></div></div>'+
        '<button class="login-button" type="submit"><span>'+esc(c.open)+'</span><span>→</span></button>'+
      '</form>'+
      '<div class="login-note">'+esc(c.note)+'</div>'+
    '</div></section>'+
  '</div>';
  bindLanguages(()=>renderLogin(error,phone));
  document.getElementById('parent-login-form').onsubmit=login;
}

function renderPasswordChange(error=''){
  const c=COPY[activeLang];
  app.innerHTML='<div class="student-login"><section class="student-login-hero">'+
    '<div class="student-brand"><img src="./vision-logo.jpg" alt="Vision Learning Centre"><div><strong>VISION</strong><span>LEARNING CENTRE</span></div></div>'+
    '<div class="student-hero-copy"><small>'+esc(c.kicker)+'</small><h1>'+esc(c.change)+'</h1><p>'+esc(c.note)+'</p></div></section>'+
    '<section class="student-login-panel"><div class="student-login-card">'+renderLanguageButtons()+
    '<h2>'+esc(c.change)+'</h2>'+(error?'<div class="login-error">'+esc(error)+'</div>':'')+
    '<form id="parent-change-form" class="login-form">'+
      '<div class="field"><label>'+esc(c.newPassword)+'</label><div class="input-shell"><input name="newPassword" minlength="6" maxlength="64" type="password" autocomplete="new-password" required></div></div>'+
      '<div class="field"><label>'+esc(c.confirm)+'</label><div class="input-shell"><input name="confirmPassword" minlength="6" maxlength="64" type="password" autocomplete="new-password" required></div></div>'+
      '<button class="login-button" type="submit"><span>'+esc(c.save)+'</span><span>→</span></button>'+
    '</form></div></section></div>';
  bindLanguages(()=>renderPasswordChange(error));
  document.getElementById('parent-change-form').onsubmit=changePassword;
}

async function invoke(body){
  const {data,error}=await sb.functions.invoke('parent-portal',{body});
  if(error){
    let message=error.message;
    try{const parsed=await error.context?.json?.();if(parsed?.error)message=parsed.error;}catch{}
    throw new Error(message);
  }
  if(data?.error)throw new Error(data.error);
  return data;
}

async function login(e){
  e.preventDefault();
  const form=e.currentTarget;
  const phone=form.phone.value.trim();
  const password=form.password.value;
  try{
    const data=await invoke({phone,password});
    portalAuth={phone,password};
    if(data.password_change_required){renderPasswordChange();return;}
    portalData=data;
    renderPortal();
  }catch(error){renderLogin(error.message,phone);}
}

async function changePassword(e){
  e.preventDefault();
  if(!portalAuth)return renderLogin();
  const form=e.currentTarget;
  const next=form.newPassword.value;
  const confirm=form.confirmPassword.value;
  if(next.length<6)return renderPasswordChange('Use at least 6 characters.');
  if(next!==confirm)return renderPasswordChange('The passwords do not match.');
  if(next===portalAuth.password)return renderPasswordChange('Choose a different password.');
  try{
    const data=await invoke({action:'change_password',phone:portalAuth.phone,current_password:portalAuth.password,new_password:next});
    portalAuth={phone:portalAuth.phone,password:next};
    portalData=data;
    renderPortal();
    toast('Password changed.');
  }catch(error){renderPasswordChange(error.message);}
}

function renderPortal(){
  const c=COPY[activeLang];
  const children=Array.isArray(portalData?.children)?portalData.children:[];
  const notifications=Array.isArray(portalData?.notifications)?portalData.notifications:[];
  const unread=Number(portalData?.unread_count||0);

  const childCards=children.length?children.map(child=>{
    const days=Array.isArray(child.meeting_days)?child.meeting_days.join(' / '):'—';
    const time=[child.start_time?.slice?.(0,5),child.end_time?.slice?.(0,5)].filter(Boolean).join('–')||'—';
    return '<article class="parent-child-card"><strong>'+esc(child.full_name||'Student')+'</strong><span>'+esc(child.relationship||'guardian')+'</span>'+
      '<div class="parent-child-meta"><div><small>Group</small><b>'+esc(child.group||'—')+'</b></div><div><small>Level</small><b>'+esc(child.level||'—')+'</b></div><div><small>Schedule</small><b>'+esc(days+' · '+time)+'</b></div><div><small>Teacher</small><b>'+esc(child.teacher||'—')+'</b></div></div></article>';
  }).join(''):'<div class="parent-empty">No linked students.</div>';

  const inbox=notifications.length?notifications.map(n=>{
    const isUnread=n.status!=='read';
    return '<article class="parent-notification '+(isUnread?'unread':'')+'"><div class="parent-notification-head"><h3>'+esc(n.title)+'</h3><time>'+esc(fmtDateTime(n.created_at))+'</time></div><p>'+esc(n.body)+'</p>'+
      (isUnread?'<div class="parent-notification-actions"><button class="parent-read-button" data-read="'+esc(n.id)+'">'+esc(c.markRead)+'</button></div>':'')+'</article>';
  }).join(''):'<div class="parent-empty">'+esc(c.noNotifications)+'</div>';

  app.innerHTML='<div class="portal"><header class="portal-header"><div class="portal-header-inner"><div class="portal-brand"><img src="./vision-logo.jpg" alt="Vision Learning Centre"><div><strong>Vision Parent Portal</strong><span>VISION LEARNING CENTRE</span></div></div><button class="signout" id="parent-signout">'+esc(c.signOut)+'</button></div></header>'+
    '<main class="parent-portal-main"><section class="student-welcome"><div><small>'+esc(c.kicker)+'</small><h1>Vision Learning Centre</h1><p>'+children.length+' student link(s)</p></div><span class="parent-unread-badge">'+unread+' '+esc(c.unread)+'</span></section>'+
    '<div class="parent-language-row">'+['uz','ru','en'].map(lang=>'<button type="button" data-lang="'+lang+'" class="'+(lang===activeLang?'active':'')+'">'+lang.toUpperCase()+'</button>').join('')+'</div>'+
    '<div class="parent-top-grid"><section class="parent-panel"><h2>'+esc(c.children)+'</h2><p>Linked Vision student accounts.</p><div class="parent-child-list">'+childCards+'</div></section>'+
    '<section class="parent-panel"><h2>'+esc(c.notifications)+'</h2><p>Updates from Vision Learning Centre.</p><div class="parent-inbox">'+inbox+'</div></section></div></main></div>';

  bindLanguages(renderPortal);
  document.getElementById('parent-signout').onclick=()=>{portalAuth=null;portalData=null;renderLogin();};
  app.querySelectorAll('[data-read]').forEach(btn=>btn.onclick=()=>markRead(btn.dataset.read));
}

async function markRead(id){
  if(!portalAuth)return renderLogin();
  try{
    const data=await invoke({action:'mark_notification_read',phone:portalAuth.phone,password:portalAuth.password,notification_id:id});
    portalData={...portalData,...data};
    renderPortal();
  }catch(error){toast(error.message);}
}

renderLogin();
})();
