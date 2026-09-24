(() => {
'use strict';

const vocab = {
  focus_on:{term:'focus on',level:'B1',uz:'e’tiborni ...ga qaratmoq'},
  retain_information:{term:'retain information',level:'B2–C1',uz:'ma’lumotni eslab qolmoq'},
  consolidate_memories:{term:'consolidate memories',level:'B2–C1',uz:'xotiralarni mustahkamlamoq'},
  get_enough_sleep:{term:'get enough sleep',level:'B1',uz:'yetarlicha uxlash'},
  improve:{term:'improve',level:'B1',uz:'yaxshilamoq'},
  cognitive_performance:{term:'cognitive performance',level:'B2–C1',uz:'aqliy faoliyat samaradorligi'},
  pay_attention:{term:'pay attention',level:'B1',uz:'diqqat qilmoq'},
  deal_with:{term:'deal with',level:'B1',uz:'uddalamoq / bilan kurashmoq'},
  sleep_deprivation:{term:'sleep deprivation',level:'B2–C1',uz:'uyqu yetishmasligi'},
  interfere_with:{term:'interfere with',level:'B2–C1',uz:'xalaqit bermoq'},
  mentally_demanding:{term:'mentally demanding',level:'B2–C1',uz:'katta aqliy kuch talab qiladigan'},
  take_a_break:{term:'take a break',level:'B1',uz:'tanaffus qilmoq'},
  routine:{term:'routine',level:'B1',uz:'tartib / odatiy rejim'},
  consistent:{term:'consistent',level:'B2–C1',uz:'muntazam / barqaror'},
  make_progress:{term:'make progress',level:'B1',uz:'rivojlanmoq / oldinga siljimoq'},
  long_term:{term:'long term',level:'B2–C1',uz:'uzoq muddat'}
};

const article = {
  id:'sleep-learning',
  title:'Why Sleep Helps You Learn Better',
  kicker:'LEARNING & HEALTH',
  level:'B1+–B2',
  minutes:'5 min read',
  sentences:[
    {
      parts:['Many students ',{v:'focus_on'},' studying for more hours when exams are close.'],
      uz:'Ko‘p o‘quvchilar imtihonlar yaqinlashganda ko‘proq soat o‘qishga e’tibor qaratadi.'
    },
    {
      parts:['However, working late into the night does not always help them ',{v:'retain_information'},'.'],
      uz:'Biroq, kechgacha o‘qish ularga ma’lumotni eslab qolishda har doim ham yordam bermaydi.'
    },
    {
      parts:['The brain needs rest to organize what you learn during the day.'],
      uz:'Miya kun davomida o‘rgangan narsalaringizni tartibga solish uchun dam olishga muhtoj.'
    },
    {
      parts:['During sleep, it begins to ',{v:'consolidate_memories'},', which makes important information easier to remember later.'],
      uz:'Uyqu paytida miya xotiralarni mustahkamlashni boshlaydi, bu esa muhim ma’lumotni keyinroq eslashni osonlashtiradi.'
    },
    {
      parts:[{v:'get_enough_sleep',cap:true},' can also ',{v:'improve'},' your ',{v:'cognitive_performance'},'.'],
      uz:'Yetarlicha uxlash aqliy faoliyat samaradorligini ham yaxshilashi mumkin.'
    },
    {
      parts:['Students who sleep well usually find it easier to ',{v:'pay_attention'},' and ',{v:'deal_with'},' difficult tasks in class.'],
      uz:'Yaxshi uxlaydigan o‘quvchilar odatda darsda diqqat qilish va qiyin vazifalarni uddalashni osonroq deb biladi.'
    },
    {
      parts:['By contrast, ',{v:'sleep_deprivation',cap:true},' can ',{v:'interfere_with'},' concentration, mood, and decision-making.'],
      uz:'Aksincha, uyqu yetishmasligi diqqat, kayfiyat va qaror qabul qilishga xalaqit berishi mumkin.'
    },
    {
      parts:['This is especially noticeable after ',{v:'mentally_demanding'},' study sessions.'],
      uz:'Bu ayniqsa katta aqliy kuch talab qiladigan o‘qish mashg‘ulotlaridan keyin seziladi.'
    },
    {
      parts:['Short breaks during the day matter too.'],
      uz:'Kun davomida qisqa tanaffuslar ham muhim.'
    },
    {
      parts:['When you ',{v:'take_a_break'},', your brain gets a chance to recover before you ',{v:'focus_on'},' the next task.'],
      uz:'Tanaffus qilganingizda, keyingi vazifaga e’tibor qaratishdan oldin miyangiz tiklanish imkoniyatiga ega bo‘ladi.'
    },
    {
      parts:['A ',{v:'consistent'},' evening ',{v:'routine'},' may help you fall asleep more easily and ',{v:'make_progress'},' over the ',{v:'long_term'},'.'],
      uz:'Muntazam kechki tartib tezroq uxlashingizga va uzoq muddat davomida rivojlanishingizga yordam berishi mumkin.'
    },
    {
      parts:['The goal is not to study as many hours as possible, but to combine effective study with enough recovery.'],
      uz:'Maqsad imkon qadar ko‘p soat o‘qish emas, balki samarali o‘qishni yetarli tiklanish bilan birlashtirishdir.'
    }
  ]
};

const readingArticles=[article];
let activeArticle=readingArticles[0];

const paragraphBreaks = new Set([2,4,6,8,10]);

const exerciseQuestions = [
  {
    prompt:'If something is “mentally demanding”, it...',
    options:['requires a lot of mental effort','is very easy to finish','only uses physical strength'],
    answer:0
  },
  {
    prompt:'What does “interfere with” mean?',
    options:['to improve something quickly','to make something harder or disturb it','to remember something clearly'],
    answer:1
  },
  {
    prompt:'Sleep helps the brain ______ important memories.',
    options:['take a break','consolidate','deal with'],
    answer:1
  },
  {
    prompt:'Students who sleep well may find it easier to ______ in class.',
    options:['pay attention','sleep deprivation','long term'],
    answer:0
  },
  {
    prompt:'A fixed bedtime can help you build a healthy ______.',
    options:['routine','cognitive performance','information'],
    answer:0
  },
  {
    prompt:'To remember knowledge later is to ______ it.',
    options:['interfere with','retain','take a break'],
    answer:1
  },
  {
    prompt:'Not getting enough sleep for a period of time is called...',
    options:['sleep deprivation','consistent routine','mental recovery'],
    answer:0
  },
  {
    prompt:'Which phrase means “oldinga siljimoq / rivojlanmoq”?',
    options:['focus on','make progress','pay attention'],
    answer:1
  }
];

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

function wordHtml(key,cap){
  const item=vocab[key];
  const text=cap?item.term.charAt(0).toUpperCase()+item.term.slice(1):item.term;
  const cls=item.level==='B1'?'b1':'b2';
  return '<span class="vocab-word '+cls+'" role="button" tabindex="0" data-vocab="'+esc(key)+'">'+
    esc(text)+
    '<span class="vocab-popover" aria-hidden="true"><small>'+esc(item.level)+'</small><strong>'+esc(item.term)+'</strong><em>'+esc(item.uz)+'</em></span>'+
  '</span>';
}

function sentenceHtml(sentence,index){
  const body=sentence.parts.map(part=>{
    if(typeof part==='string')return esc(part);
    return wordHtml(part.v,part.cap);
  }).join('');
  return '<span class="article-sentence" data-sentence="'+index+'" tabindex="0">'+body+'</span>'+
         '<span class="sentence-translation" data-translation="'+index+'">'+esc(sentence.uz)+'</span> ';
}

function header(active){
  return '<header class="portal-header"><div class="portal-header-inner">'+
    '<div class="portal-brand"><img src="./vision-logo.jpg" alt="Vision Learning Centre"><div><strong>Vision Student Progress</strong><span>VISION LEARNING CENTRE</span></div></div>'+
    '<div class="portal-header-actions"><button class="signout refresh-button" id="practice-refresh" type="button">↻ Refresh</button><button class="signout" id="practice-signout" type="button">Sign out</button></div>'+
  '</div></header>'+
  '<div class="student-section-nav-wrap"><nav class="student-section-nav" aria-label="Student portal sections">'+
    '<button class="student-section-tab '+(active==='dashboard'?'active':'')+'" id="practice-dashboard-tab" type="button">Dashboard</button>'+
    '<button class="student-section-tab '+(active==='practice'?'active':'')+'" type="button">Practice</button>'+
  '</nav></div>';
}

function practiceHomeHtml(data){
  const student=data?.student||{};
  return '<div class="portal practice-view">'+header('practice')+
    '<main class="portal-main practice-main">'+
      '<section class="practice-hero"><div><small>PRACTICE</small><h1>Practice</h1><p>Choose what you want to practise.</p></div><div class="practice-student">'+esc(student.full_name||'Student')+'</div></section>'+
      '<section class="practice-category-list" aria-label="Practice categories">'+
        '<button class="practice-category-row" id="open-reading-library" type="button">'+
          '<div class="practice-category-icon">R</div>'+
          '<div class="practice-category-copy"><strong>Reading</strong><span>Articles, useful vocabulary, translations and interactive exercises</span></div>'+
          '<div class="practice-category-arrow">→</div>'+
        '</button>'+
        '<button class="practice-category-row" id="open-listening-library" type="button">'+
          '<div class="practice-category-icon">L</div>'+
          '<div class="practice-category-copy"><strong>Listening</strong><span>Listening materials and practice activities</span></div>'+
          '<div class="practice-category-arrow">→</div>'+
        '</button>'+
      '</section>'+
    '</main></div>';
}

function libraryHtml(data){
  const student=data?.student||{};
  const articleRows=readingArticles.map((item,index)=>
    '<button class="reading-list-row" data-article-index="'+index+'" type="button">'+
      '<div class="reading-list-number">'+(index+1)+'</div>'+
      '<div class="reading-list-copy"><strong>Article '+(index+1)+'</strong><span>'+esc(item.title)+'</span></div>'+
      '<div class="reading-list-meta"><small>'+esc(item.level)+'</small><small>'+esc(item.minutes)+'</small></div>'+
      '<div class="reading-list-arrow">→</div>'+
    '</button>'
  ).join('');
  const count=readingArticles.length;
  return '<div class="portal practice-view">'+header('practice')+
    '<main class="portal-main practice-main">'+
      '<button class="back-to-reading" id="back-to-practice" type="button">← Practice</button>'+
      '<section class="practice-hero"><div><small>PRACTICE</small><h1>Reading</h1><p>Choose an article to read and practise.</p></div><div class="practice-student">'+esc(student.full_name||'Student')+'</div></section>'+
      '<section class="reading-library">'+
        '<div class="section-title-row"><div><span>READING MATERIALS</span><h2>Articles</h2></div><small>'+count+' '+(count===1?'article':'articles')+'</small></div>'+
        '<div class="reading-list">'+articleRows+'</div>'+
      '</section>'+
    '</main></div>';
}

function listeningHtml(data){
  const student=data?.student||{};
  return '<div class="portal practice-view">'+header('practice')+
    '<main class="portal-main practice-main">'+
      '<button class="back-to-reading" id="back-to-practice" type="button">← Practice</button>'+
      '<section class="practice-hero"><div><small>PRACTICE</small><h1>Listening</h1><p>Listen, understand, and build useful vocabulary.</p></div><div class="practice-student">'+esc(student.full_name||'Student')+'</div></section>'+
      '<section class="reading-library listening-empty">'+
        '<div class="section-title-row"><div><span>LISTENING MATERIALS</span><h2>Listening</h2></div><small>0 materials</small></div>'+
        '<div class="practice-empty-state"><strong>Listening materials will appear here.</strong><p>We are building Reading first, then we can add the Listening system in this section.</p></div>'+
      '</section>'+
    '</main></div>';
}

function articleBodyHtml(){
  let out='';
  let paragraph='';
  activeArticle.sentences.forEach((s,i)=>{
    paragraph+=sentenceHtml(s,i);
    if(paragraphBreaks.has(i)||i===activeArticle.sentences.length-1){
      out+='<p>'+paragraph+'</p>';
      paragraph='';
    }
  });
  return out;
}

function exercisesHtml(){
  return exerciseQuestions.map((q,i)=>
    '<div class="exercise-question" data-question="'+i+'" data-answer="'+q.answer+'">'+
      '<div class="exercise-number">'+(i+1)+'</div>'+
      '<div class="exercise-content"><p>'+esc(q.prompt)+'</p><div class="exercise-options">'+
        q.options.map((o,idx)=>'<button type="button" data-option="'+idx+'">'+esc(o)+'</button>').join('')+
      '</div></div>'+
    '</div>'
  ).join('');
}

function articleHtml(){
  return '<div class="portal practice-view">'+header('practice')+
    '<main class="portal-main practice-main">'+
      '<button class="back-to-reading" id="back-to-reading" type="button">← Reading library</button>'+
      '<article class="reading-article-shell" id="reading-article-shell">'+
        '<div class="article-topbar">'+
          '<div><span class="article-kicker">'+esc(activeArticle.kicker)+'</span><h1>'+esc(activeArticle.title)+'</h1><div class="article-meta"><span>'+esc(activeArticle.level)+'</span><span>'+esc(activeArticle.minutes)+'</span><span>'+Object.keys(vocab).length+' key items</span></div></div>'+
          '<button class="translation-toggle" id="translation-toggle" type="button" aria-pressed="false"><span class="toggle-track"><i></i></span><span><b>Translation mode</b><small id="translation-mode-label">Off</small></span></button>'+
        '</div>'+
        '<div class="article-guide"><span class="guide-dot b1"></span><b>B1 useful English</b><span class="guide-dot b2"></span><b>B2–C1 vocabulary</b><p>Tap a bold word for its Uzbek translation. Turn on Translation Mode to translate full sentences.</p></div>'+
        '<div class="article-copy" id="article-copy">'+articleBodyHtml()+'</div>'+
      '</article>'+
      '<section class="vocab-practice-section">'+
        '<div class="practice-section-head"><div><span>AFTER READING</span><h2>Vocabulary practice</h2><p>Choose the best answer. You can change an answer before checking your score.</p></div><div class="exercise-score" id="exercise-score">Not checked</div></div>'+
        '<div class="exercise-list" id="exercise-list">'+exercisesHtml()+'</div>'+
        '<div class="exercise-actions"><button class="check-answers" id="check-answers" type="button">Check answers</button><button class="retry-exercises" id="retry-exercises" type="button">Try again</button></div>'+
      '</section>'+
    '</main></div>';
}

function bindHeader(root,callbacks){
  const dash=root.querySelector('#practice-dashboard-tab');
  const refresh=root.querySelector('#practice-refresh');
  const signout=root.querySelector('#practice-signout');
  if(dash)dash.onclick=()=>callbacks.onDashboard&&callbacks.onDashboard();
  if(refresh)refresh.onclick=()=>callbacks.onRefresh&&callbacks.onRefresh();
  if(signout)signout.onclick=()=>callbacks.onSignOut&&callbacks.onSignOut();
}

function renderHome(root,data,callbacks){
  root.innerHTML=practiceHomeHtml(data);
  bindHeader(root,callbacks);
  root.querySelector('#open-reading-library').onclick=()=>renderLibrary(root,data,callbacks);
  root.querySelector('#open-listening-library').onclick=()=>renderListening(root,data,callbacks);
}

function renderLibrary(root,data,callbacks){
  root.innerHTML=libraryHtml(data);
  bindHeader(root,callbacks);
  root.querySelector('#back-to-practice').onclick=()=>renderHome(root,data,callbacks);
  root.querySelectorAll('.reading-list-row').forEach(row=>{
    row.onclick=()=>{
      const index=Number(row.dataset.articleIndex);
      activeArticle=readingArticles[index]||readingArticles[0];
      renderArticle(root,data,callbacks);
    };
  });
}

function renderListening(root,data,callbacks){
  root.innerHTML=listeningHtml(data);
  bindHeader(root,callbacks);
  root.querySelector('#back-to-practice').onclick=()=>renderHome(root,data,callbacks);
}

function renderArticle(root,data,callbacks){
  root.innerHTML=articleHtml();
  bindHeader(root,callbacks);
  root.querySelector('#back-to-reading').onclick=()=>renderLibrary(root,data,callbacks);

  const shell=root.querySelector('#reading-article-shell');
  const toggle=root.querySelector('#translation-toggle');
  const label=root.querySelector('#translation-mode-label');

  function closeWords(except){
    root.querySelectorAll('.vocab-word.open').forEach(el=>{if(el!==except)el.classList.remove('open');});
  }

  root.querySelector('#article-copy').addEventListener('click',e=>{
    const word=e.target.closest('.vocab-word');
    if(word){
      e.stopPropagation();
      const wasOpen=word.classList.contains('open');
      closeWords(word);
      word.classList.toggle('open',!wasOpen);
      return;
    }
    const sentence=e.target.closest('.article-sentence');
    if(sentence&&shell.classList.contains('translation-on')){
      sentence.classList.toggle('translated');
      const t=root.querySelector('[data-translation="'+sentence.dataset.sentence+'"]');
      if(t)t.classList.toggle('show',sentence.classList.contains('translated'));
    }
  });

  root.querySelector('#article-copy').addEventListener('keydown',e=>{
    if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('vocab-word')){
      e.preventDefault();
      e.target.click();
    }
    if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('article-sentence')&&shell.classList.contains('translation-on')){
      e.preventDefault();
      e.target.click();
    }
  });

  document.addEventListener('click',function outsideClose(e){
    if(!root.isConnected){document.removeEventListener('click',outsideClose);return;}
    if(!e.target.closest('.vocab-word'))closeWords();
  });

  toggle.onclick=()=>{
    const on=!shell.classList.contains('translation-on');
    shell.classList.toggle('translation-on',on);
    toggle.classList.toggle('on',on);
    toggle.setAttribute('aria-pressed',String(on));
    label.textContent=on?'On':'Off';
    if(!on){
      root.querySelectorAll('.article-sentence.translated').forEach(el=>el.classList.remove('translated'));
      root.querySelectorAll('.sentence-translation.show').forEach(el=>el.classList.remove('show'));
    }
  };

  root.querySelectorAll('.exercise-question').forEach(q=>{
    q.querySelectorAll('.exercise-options button').forEach(btn=>{
      btn.onclick=()=>{
        q.querySelectorAll('.exercise-options button').forEach(b=>b.classList.remove('selected'));
        btn.classList.add('selected');
        q.classList.remove('correct','wrong');
      };
    });
  });

  root.querySelector('#check-answers').onclick=()=>{
    let correct=0;
    let answered=0;
    root.querySelectorAll('.exercise-question').forEach(q=>{
      const selected=q.querySelector('.exercise-options button.selected');
      q.querySelectorAll('.exercise-options button').forEach(b=>b.classList.remove('correct-option','wrong-option'));
      q.classList.remove('correct','wrong');
      if(!selected)return;
      answered++;
      const isCorrect=Number(selected.dataset.option)===Number(q.dataset.answer);
      if(isCorrect){
        correct++;
        q.classList.add('correct');
        selected.classList.add('correct-option');
      }else{
        q.classList.add('wrong');
        selected.classList.add('wrong-option');
        const correctBtn=q.querySelector('.exercise-options button[data-option="'+q.dataset.answer+'"]');
        if(correctBtn)correctBtn.classList.add('correct-option');
      }
    });
    const score=root.querySelector('#exercise-score');
    score.textContent=correct+' / '+exerciseQuestions.length+' correct';
    score.className='exercise-score '+(correct===exerciseQuestions.length?'excellent':correct>=6?'good':'keep-going');
    if(answered<exerciseQuestions.length)score.textContent=correct+' / '+exerciseQuestions.length+' correct · '+(exerciseQuestions.length-answered)+' unanswered';
  };

  root.querySelector('#retry-exercises').onclick=()=>{
    root.querySelectorAll('.exercise-question').forEach(q=>{
      q.classList.remove('correct','wrong');
      q.querySelectorAll('.exercise-options button').forEach(b=>b.classList.remove('selected','correct-option','wrong-option'));
    });
    const score=root.querySelector('#exercise-score');
    score.textContent='Not checked';
    score.className='exercise-score';
  };
}

function render({root,data,onDashboard,onRefresh,onSignOut}){
  renderHome(root,data,{onDashboard,onRefresh,onSignOut});
}

window.VisionStudentPractice={render};
})();