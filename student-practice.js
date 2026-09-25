(() => {
'use strict';

const vocab = {};

const readingArticles=[];
let activeArticleIndex=0;
let activeArticle=null;

function completionKey(data){
  const student=data?.student||{};
  const id=student.id||[student.full_name,student.group,student.grade_or_age].filter(Boolean).join('|')||'student';
  return 'vision-reading-completed:v2:'+String(id);
}

function getCompletedArticles(data){
  try{
    const saved=JSON.parse(localStorage.getItem(completionKey(data))||'[]');
    return new Set(Array.isArray(saved)?saved.map(Number):[]);
  }catch{
    return new Set();
  }
}

function markArticleCompleted(data,index){
  const completed=getCompletedArticles(data);
  completed.add(Number(index));
  try{localStorage.setItem(completionKey(data),JSON.stringify([...completed]));}catch{}
}

const paragraphBreaks = new Set([]);
const exerciseQuestions = [];


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
  const completed=getCompletedArticles(data);
  const articleRows=readingArticles.map((item,index)=>{
    const isDone=completed.has(index);
    return '<button class="reading-list-row'+(isDone?' completed':'')+'" data-article-index="'+index+'" type="button">'+
      '<strong class="reading-list-label">Article '+(index+1)+'</strong>'+
      '<div class="reading-list-status'+(isDone?' done':'')+'">'+(isDone?'✓':'→')+'</div>'+
    '</button>';
  }).join('');
  const count=readingArticles.length;
  return '<div class="portal practice-view">'+header('practice')+
    '<main class="portal-main practice-main">'+
      '<button class="back-to-reading" id="back-to-practice" type="button">← Practice</button>'+
      '<section class="practice-hero"><div><small>PRACTICE</small><h1>Reading</h1><p>Choose an article to read and practise.</p></div><div class="practice-student">'+esc(student.full_name||'Student')+'</div></section>'+
      '<section class="reading-library">'+
        '<div class="section-title-row"><div><span>READING MATERIALS</span><h2>Articles</h2></div><small>'+count+' '+(count===1?'article':'articles')+'</small></div>'+
        (count?'<div class="reading-list">'+articleRows+'</div>':'<div class="practice-empty-state"><strong>No articles yet.</strong><p>Your reading materials will appear here after they are added.</p></div>')+
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
  if(!activeArticle)return '';
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
      activeArticleIndex=Number.isFinite(index)?index:0;
      activeArticle=readingArticles[activeArticleIndex]||readingArticles[0];
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
  if(!activeArticle){renderLibrary(root,data,callbacks);return;}
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
    if(answered<exerciseQuestions.length){
      score.textContent=correct+' / '+exerciseQuestions.length+' correct · '+(exerciseQuestions.length-answered)+' unanswered';
    }else{
      markArticleCompleted(data,activeArticleIndex);
    }
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