(() => {
'use strict';

const CATEGORIES=[
  ['educational','Educational'],
  ['vocabulary','Vocabulary'],
  ['grammar','Grammar'],
  ['quiz','Quiz'],
  ['speaking','Speaking'],
  ['english_tip','English tip'],
  ['vision_life','Vision life'],
  ['promotion','Promotion'],
  ['announcement','Announcement']
];
const LEVELS=['all','Beginner','Elementary','Pre-Intermediate','Intermediate','Pre-IELTS','IELTS','CEFR'];

const cleanTag=v=>String(v||'').trim().replace(/\s+/g,' ');
const normalizeChannelInput=value=>{
  const raw=String(value||'').trim();
  if(!raw)return '';
  if(/^-?\d+$/.test(raw))return raw;
  const cleaned=raw
    .replace(/^https?:\/\/(?:www\.)?(?:t\.me|telegram\.me)\//i,'')
    .replace(/^(?:t\.me|telegram\.me)\//i,'')
    .split(/[?/#]/)[0]
    .replace(/^@/,'')
    .trim();
  return cleaned?'@'+cleaned:'';
};
const tagsFrom=v=>[...new Set(String(v||'').split(',').map(cleanTag).filter(Boolean))].slice(0,24);
const safeName=name=>String(name||'media').normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/-+/g,'-').slice(-120);
const fileSize=n=>{
  const value=Number(n||0);
  if(value<1024)return value+' B';
  if(value<1024*1024)return (value/1024).toFixed(1)+' KB';
  return (value/1024/1024).toFixed(value>10*1024*1024?0:1)+' MB';
};
const prettyStatus=v=>String(v||'').replaceAll('_',' ').replace(/\b\w/g,m=>m.toUpperCase());
const localInputValue=value=>{
  if(!value)return '';
  const d=new Date(value);
  const z=n=>String(n).padStart(2,'0');
  return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate())+'T'+z(d.getHours())+':'+z(d.getMinutes());
};
const fmtWhen=value=>value?new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(value)):'Not scheduled';

async function mediaMetadata(file){
  const basic={width:null,height:null,duration_seconds:null,orientation:null};
  const url=URL.createObjectURL(file);
  try{
    if(file.type.startsWith('image/')){
      const img=new Image();
      const result=await new Promise((resolve,reject)=>{
        img.onload=()=>resolve({width:img.naturalWidth,height:img.naturalHeight});
        img.onerror=reject;
        img.src=url;
      });
      const width=result.width||0,height=result.height||0;
      return {...basic,width,height,orientation:width===height?'square':width>height?'landscape':'portrait'};
    }
    if(file.type.startsWith('video/')){
      const video=document.createElement('video');
      video.preload='metadata';
      video.muted=true;
      const result=await new Promise((resolve,reject)=>{
        video.onloadedmetadata=()=>resolve({width:video.videoWidth,height:video.videoHeight,duration:video.duration});
        video.onerror=reject;
        video.src=url;
      });
      const width=result.width||0,height=result.height||0;
      return {...basic,width,height,duration_seconds:Number.isFinite(result.duration)?Math.round(result.duration*10)/10:null,orientation:width===height?'square':width>height?'landscape':'portrait'};
    }
    return basic;
  }catch{
    return basic;
  }finally{
    URL.revokeObjectURL(url);
  }
}

async function signedPreview(sb,asset){
  try{
    const {data,error}=await sb.storage.from('vision-media').createSignedUrl(asset.storage_path,3600);
    if(error)throw error;
    return data?.signedUrl||'';
  }catch{
    return '';
  }
}

function connectionMarkup(connection,esc){
  if(!connection||connection.ok===false){
    return '<div class="tgm-connection tgm-connection-warn"><strong>Connection check unavailable</strong><span>'+esc(connection?.error||'Try again from the Telegram Manager.')+'</span></div>';
  }
  if(!connection.configured){
    return '<div class="tgm-connection tgm-connection-warn"><strong>Bot token not connected yet</strong><span>The token stays server-side; it is never stored in this browser.</span></div>';
  }
  if(connection.ready){
    const bot=connection.bot?.username?'@'+connection.bot.username:(connection.bot?.name||'Telegram bot');
    const channel=connection.channel?.username?'@'+connection.channel.username:(connection.channel?.title||'channel');
    return '<div class="tgm-connection tgm-connection-good"><strong>'+esc(bot)+' is ready</strong><span>Connected to '+esc(channel)+' with permission to post.</span></div>';
  }
  return '<div class="tgm-connection tgm-connection-warn"><strong>Bot found, channel not ready</strong><span>'+esc(connection.error||'Add the bot as a channel administrator with permission to post messages.')+'</span></div>';
}

function badge(value,kind=''){
  return '<span class="tgm-badge '+kind+'">'+String(value||'')+'</span>';
}

function mediaCard(asset,esc){
  const src=asset._preview||'';
  const visual=src
    ? asset.media_type==='video'
      ? '<video src="'+esc(src)+'" muted preload="metadata"></video><span class="tgm-play">▶</span>'
      : '<img src="'+esc(src)+'" alt="">'
    : '<div class="tgm-media-placeholder">'+(asset.media_type==='video'?'VIDEO':'PHOTO')+'</div>';
  const privacyKind=asset.privacy_status==='public_safe'?'good':asset.privacy_status==='do_not_use'?'bad':'warn';
  const reviewKind=asset.review_status==='approved'?'good':asset.review_status==='rejected'?'bad':'';
  return '<article class="tgm-media-card" data-media-id="'+esc(asset.id)+'">'+
    '<div class="tgm-media-thumb">'+visual+'</div>'+
    '<div class="tgm-media-copy">'+
      '<div class="tgm-media-title"><strong>'+esc(asset.title||asset.file_name)+'</strong><span>'+esc(fileSize(asset.size_bytes))+(asset.orientation?' · '+esc(asset.orientation):'')+'</span></div>'+
      '<div class="tgm-badges">'+badge(prettyStatus(asset.review_status),reviewKind)+badge(prettyStatus(asset.privacy_status),privacyKind)+'</div>'+
      (asset.tags?.length?'<div class="tgm-tags">'+asset.tags.slice(0,5).map(t=>'<span>#'+esc(t)+'</span>').join('')+'</div>':'')+
      '<div class="tgm-media-meta"><span>Used '+Number(asset.usage_count||0)+'×</span><button class="btn btn-sm btn-secondary" type="button" data-tgm-action="review-media" data-id="'+esc(asset.id)+'">Review</button></div>'+
    '</div>'+
  '</article>';
}

function postCard(post,media,esc){
  const linked=media?.find(m=>m.asset_id===post.id)||null;
  const isPublished=post.status==='published';
  const statusKind=post.status==='published'?'good':post.status==='approved'?'good':post.status==='error'?'bad':post.status==='skipped'?'warn':'';
  return '<article class="tgm-post-card" data-post-id="'+esc(post.id)+'">'+
    '<div class="tgm-post-top"><div><span class="tgm-post-date">'+esc(fmtWhen(post.scheduled_for))+'</span><h3>'+esc(post.title||prettyStatus(post.category))+'</h3></div>'+badge(prettyStatus(post.status),statusKind)+'</div>'+
    '<div class="tgm-post-meta">'+badge(prettyStatus(post.category))+badge(post.target_level||'all')+(linked?badge('Media attached','good'):'')+'</div>'+
    '<p>'+esc((post.content_text||'No text yet.').slice(0,260))+(String(post.content_text||'').length>260?'…':'')+'</p>'+
    (post.error_message?'<div class="tgm-post-error">'+esc(post.error_message)+'</div>':'')+
    '<div class="tgm-post-actions">'+
      (!isPublished?'<button class="btn btn-sm btn-secondary" type="button" data-tgm-action="edit-post" data-id="'+esc(post.id)+'">Edit</button>':'')+
      (post.status==='draft'?'<button class="btn btn-sm btn-primary" type="button" data-tgm-action="approve-post" data-id="'+esc(post.id)+'">Approve</button>':'')+
      (post.status==='approved'||(!post.approval_required&&post.status==='draft')?'<button class="btn btn-sm btn-primary" type="button" data-tgm-action="publish-post" data-id="'+esc(post.id)+'">Publish now</button>':'')+
      (!isPublished&&post.status!=='skipped'?'<button class="btn btn-sm btn-ghost" type="button" data-tgm-action="skip-post" data-id="'+esc(post.id)+'">Skip</button>':'')+
    '</div>'+
  '</article>';
}

async function loadModel(ctx){
  const {sb,query,invokeEdge}=ctx;
  const [settings,posts,assets,links,connection]=await Promise.all([
    query(sb.from('telegram_settings').select('*').eq('id',1).single()),
    query(sb.from('telegram_posts').select('*').order('created_at',{ascending:false}).limit(60)),
    query(sb.from('media_assets').select('*').order('created_at',{ascending:false}).limit(100)),
    query(sb.from('telegram_post_media').select('post_id,asset_id,position,role')),
    invokeEdge('telegram-publish',{action:'status'},15000).catch(error=>({ok:false,error:error.message}))
  ]);
  const previews=await Promise.all((assets||[]).slice(0,60).map(async asset=>({...asset,_preview:await signedPreview(sb,asset)})));
  const previewById=new Map(previews.map(a=>[a.id,a]));
  const merged=(assets||[]).map(a=>previewById.get(a.id)||a);
  return {settings,posts:posts||[],assets:merged,links:links||[],connection};
}

function settingsPanel(model,esc){
  const s=model.settings;
  const publicReady=model.assets.filter(a=>a.review_status==='approved'&&a.privacy_status==='public_safe').length;
  const drafts=model.posts.filter(p=>['draft','approved','error'].includes(p.status)).length;
  const published=model.posts.filter(p=>p.status==='published').length;
  return '<div class="tgm-stats">'+
    '<div class="tgm-stat"><span>Reusable media</span><strong>'+publicReady+'</strong><small>Approved + public-safe</small></div>'+
    '<div class="tgm-stat"><span>Posts in queue</span><strong>'+drafts+'</strong><small>Draft / approved / needs attention</small></div>'+
    '<div class="tgm-stat"><span>Published</span><strong>'+published+'</strong><small>Recorded by the manager</small></div>'+
    '<div class="tgm-stat"><span>Default time</span><strong>'+esc(String(s.daily_post_time||'19:00').slice(0,5))+'</strong><small>'+esc(s.timezone||'Asia/Tashkent')+'</small></div>'+
  '</div>'+
  '<div class="tgm-grid tgm-grid-settings">'+
    '<section class="panel"><div class="panel-head"><div><h2>Telegram connection</h2><p>Bot credentials stay server-side.</p></div><button type="button" class="btn btn-secondary" id="tgm-check-connection">Check connection</button></div><div class="panel-body">'+
      connectionMarkup(model.connection,esc)+
      '<form id="tgm-settings-form" class="tgm-settings-form">'+
        '<div class="field"><label>Channel username or ID</label><input class="input" name="channel_username" placeholder="@VisionLearningCentre" value="'+esc(s.channel_username||'')+'"></div>'+
        '<div class="field"><label>Default post time</label><input class="input" name="daily_post_time" type="time" value="'+esc(String(s.daily_post_time||'19:00').slice(0,5))+'"></div>'+
        '<label class="tgm-switch"><input type="checkbox" name="approval_required" '+(s.approval_required?'checked':'')+'><span><strong>Approval required</strong><small>Recommended while the agent learns Vision’s style.</small></span></label>'+
        '<button class="btn btn-primary" type="submit">Save settings</button>'+
      '</form>'+
    '</div></section>'+
    '<section class="panel"><div class="panel-head"><div><h2>Weekly content rhythm</h2><p>The agent will use this as its default mix.</p></div></div><div class="panel-body"><div class="tgm-week">'+
      Object.entries(s.weekly_plan||{}).map(([day,type])=>'<div><strong>'+esc(day[0].toUpperCase()+day.slice(1))+'</strong><span>'+esc(type)+'</span></div>').join('')+
    '</div><div class="section-note tgm-note">Daily AI generation is not switched on until an AI provider and Telegram bot secret are connected. The Media Library and approval queue work now.</div></div></section>'+
  '</div>';
}

function pageMarkup(model,esc){
  const queue=model.posts.filter(p=>p.status!=='published'&&p.status!=='skipped');
  const history=model.posts.filter(p=>p.status==='published'||p.status==='skipped').slice(0,12);
  return '<div class="tgm-page">'+
    '<section class="tgm-hero"><div><span>VISION CONTENT SYSTEM</span><h2>Telegram Manager</h2><p>Build a reusable classroom media library, prepare posts, approve them, and publish from one place.</p></div><div class="tgm-hero-actions"><button class="btn btn-secondary" type="button" id="tgm-upload">Upload media</button><input id="tgm-upload-input" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm" multiple hidden><button class="btn btn-primary" type="button" id="tgm-new-post">New post</button></div></section>'+
    settingsPanel(model,esc)+
    '<section class="panel tgm-section"><div class="panel-head"><div><h2>Upcoming posts</h2><p>Draft → approve → publish.</p></div><button type="button" class="btn btn-secondary" id="tgm-new-post-2">Create draft</button></div><div class="panel-body">'+
      (queue.length?'<div class="tgm-post-grid">'+queue.map(p=>postCard(p,model.links.map(l=>({asset_id:l.post_id,media_id:l.asset_id})),esc)).join('')+'</div>':'<div class="empty"><strong>No posts queued</strong>Create your first Vision post or let the agent fill this queue later.</div>')+
    '</div></section>'+
    '<section class="panel tgm-section"><div class="panel-head"><div><h2>Media Library</h2><p>Only Approved + Public-safe media can be published.</p></div><div class="tgm-media-tools"><input id="tgm-media-search" class="input" placeholder="Search tags or file names"><select id="tgm-media-filter" class="select"><option value="all">All media</option><option value="ready">Ready to reuse</option><option value="review">Needs review</option><option value="blocked">Do not use</option></select></div></div><div class="panel-body">'+
      (model.assets.length?'<div class="tgm-media-grid" id="tgm-media-grid">'+model.assets.map(a=>mediaCard(a,esc)).join('')+'</div>':'<div class="empty"><strong>Your media library is empty</strong>Upload classroom photos and videos. They stay private until you mark them safe for public use.</div>')+
    '</div></section>'+
    (history.length?'<section class="panel tgm-section"><div class="panel-head"><div><h2>Recent history</h2><p>Published and skipped posts.</p></div></div><div class="panel-body"><div class="tgm-history">'+history.map(p=>postCard(p,model.links.map(l=>({asset_id:l.post_id,media_id:l.asset_id})),esc)).join('')+'</div></div></section>':'')+
  '</div>';
}

function assetEditor(ctx,model,asset){
  const {openModal,query,sb,esc}=ctx;
  const levels=new Set(asset.target_levels||['all']);
  openModal('Review media',
    '<div class="form-cols">'+
      '<div class="field span-2"><label>Display title</label><input class="input" name="title" value="'+esc(asset.title||'')+'" placeholder="'+esc(asset.file_name)+'"></div>'+
      '<div class="field span-2"><label>Tags <span class="muted">(comma separated)</span></label><input class="input" name="tags" value="'+esc((asset.tags||[]).join(', '))+'" placeholder="classroom, speaking, teenagers, group work"></div>'+
      '<div class="field"><label>Review status</label><select class="select" name="review_status"><option value="raw" '+(asset.review_status==='raw'?'selected':'')+'>Needs review</option><option value="approved" '+(asset.review_status==='approved'?'selected':'')+'>Approved</option><option value="rejected" '+(asset.review_status==='rejected'?'selected':'')+'>Rejected</option></select></div>'+
      '<div class="field"><label>Privacy</label><select class="select" name="privacy_status"><option value="internal_only" '+(asset.privacy_status==='internal_only'?'selected':'')+'>Internal only</option><option value="public_safe" '+(asset.privacy_status==='public_safe'?'selected':'')+'>Public-safe</option><option value="do_not_use" '+(asset.privacy_status==='do_not_use'?'selected':'')+'>Do not use</option></select></div>'+
      '<div class="field span-2"><label>Suitable levels</label><div class="tgm-level-checks">'+LEVELS.map(level=>'<label><input type="checkbox" name="level_'+level.replace(/[^a-z0-9]/gi,'_')+'" value="'+esc(level)+'" '+(levels.has(level)?'checked':'')+'>'+esc(level)+'</label>').join('')+'</div></div>'+
      '<div class="field span-2"><label>Notes</label><textarea class="textarea" name="description" placeholder="What is happening in this photo/video?">'+esc(asset.description||'')+'</textarea></div>'+
    '</div>',
    async form=>{
      const targetLevels=LEVELS.filter(level=>form.elements['level_'+level.replace(/[^a-z0-9]/gi,'_')]?.checked);
      await query(sb.from('media_assets').update({
        title:form.title.value.trim()||null,
        tags:tagsFrom(form.tags.value),
        review_status:form.review_status.value,
        privacy_status:form.privacy_status.value,
        target_levels:targetLevels.length?targetLevels:['all'],
        description:form.description.value.trim()||null,
        updated_at:new Date().toISOString()
      }).eq('id',asset.id));
      await renderRoute(true);
    },
    'Save media'
  );
}

function postEditor(ctx,model,post=null){
  const {openModal,query,sb,esc,state}=ctx;
  const linked=model.links.find(l=>l.post_id===post?.id);
  const usable=model.assets.filter(a=>a.review_status==='approved'&&a.privacy_status==='public_safe');
  openModal(post?'Edit Telegram post':'Create Telegram post',
    '<div class="form-cols">'+
      '<div class="field span-2"><label>Internal title</label><input class="input" name="title" value="'+esc(post?.title||'')+'" placeholder="e.g. Monday vocabulary"></div>'+
      '<div class="field"><label>Category</label><select class="select" name="category">'+CATEGORIES.map(([v,l])=>'<option value="'+esc(v)+'" '+((post?.category||'educational')===v?'selected':'')+'>'+esc(l)+'</option>').join('')+'</select></div>'+
      '<div class="field"><label>Target level</label><select class="select" name="target_level">'+LEVELS.map(v=>'<option value="'+esc(v)+'" '+((post?.target_level||'all')===v?'selected':'')+'>'+esc(v)+'</option>').join('')+'</select></div>'+
      '<div class="field span-2"><label>Schedule</label><input class="input" type="datetime-local" name="scheduled_for" value="'+esc(localInputValue(post?.scheduled_for))+'"></div>'+
      '<div class="field span-2"><label>Reuse media <span class="muted">(optional)</span></label><select class="select" name="asset_id"><option value="">No media / text only</option>'+usable.map(a=>'<option value="'+esc(a.id)+'" '+(linked?.asset_id===a.id?'selected':'')+'>'+esc(a.title||a.file_name)+' · '+esc(a.media_type)+'</option>').join('')+'</select><small class="muted">Only media already marked Approved + Public-safe appears here.</small></div>'+
      '<div class="field span-2"><label>Post text</label><textarea class="textarea tgm-post-text" name="content_text" maxlength="4096" placeholder="Write the Telegram post here…">'+esc(post?.content_text||'')+'</textarea><small class="muted">Keep media captions concise. Long text-only posts can be up to 4,096 characters.</small></div>'+
    '</div>',
    async form=>{
      const scheduled=form.scheduled_for.value?new Date(form.scheduled_for.value).toISOString():null;
      const payload={
        title:form.title.value.trim()||null,
        category:form.category.value,
        target_level:form.target_level.value,
        scheduled_for:scheduled,
        content_text:form.content_text.value.trim(),
        approval_required:model.settings.approval_required,
        status:'draft',
        approved_by:null,
        approved_at:null,
        error_message:null,
        updated_at:new Date().toISOString()
      };
      let id=post?.id;
      if(id){
        await query(sb.from('telegram_posts').update(payload).eq('id',id));
      }else{
        const created=await query(sb.from('telegram_posts').insert({...payload,created_by:state.session.user.id}).select('id').single());
        id=created.id;
      }
      await query(sb.from('telegram_post_media').delete().eq('post_id',id));
      if(form.asset_id.value){
        await query(sb.from('telegram_post_media').insert({post_id:id,asset_id:form.asset_id.value,position:0,role:'source'}));
      }
      await renderRoute(true);
    },
    post?'Save changes':'Create draft'
  );
}

async function uploadFiles(ctx,files){
  const {sb,state,query,toast}=ctx;
  if(!files?.length)return;
  let done=0;
  toast('Uploading '+files.length+' media file'+(files.length===1?'':'s')+'…');
  for(const file of files){
    if(!/^image\/(jpeg|png|webp)$/.test(file.type)&&!/^video\/(mp4|quicktime|webm)$/.test(file.type)){
      throw new Error(file.name+' is not a supported photo or video format.');
    }
    if(file.size>100*1024*1024)throw new Error(file.name+' is larger than the 100 MB media limit.');
    const meta=await mediaMetadata(file);
    const date=new Date();
    const folder=date.getFullYear()+'/'+String(date.getMonth()+1).padStart(2,'0');
    const path=folder+'/'+crypto.randomUUID()+'-'+safeName(file.name);
    const {error:uploadError}=await sb.storage.from('vision-media').upload(path,file,{contentType:file.type,cacheControl:'3600',upsert:false});
    if(uploadError)throw uploadError;
    try{
      await query(sb.from('media_assets').insert({
        storage_path:path,
        file_name:file.name,
        mime_type:file.type,
        media_type:file.type.startsWith('video/')?'video':'photo',
        size_bytes:file.size,
        width:meta.width,
        height:meta.height,
        duration_seconds:meta.duration_seconds,
        orientation:meta.orientation,
        created_by:state.session.user.id
      }));
    }catch(error){
      await sb.storage.from('vision-media').remove([path]).catch(()=>{});
      throw error;
    }
    done++;
    toast('Uploaded '+done+' of '+files.length+'.');
  }
}

function bind(ctx,model){
  const root=document.querySelector('[data-route-page="telegram"]');
  if(!root||root.dataset.tgmBound==='true')return;
  root.dataset.tgmBound='true';
  const {sb,state,query,invokeEdge,toast,fail,renderRoute}=ctx;

  const newPost=()=>postEditor(ctx,model,null);
  root.querySelector('#tgm-new-post')?.addEventListener('click',newPost);
  root.querySelector('#tgm-new-post-2')?.addEventListener('click',newPost);

  const fileInput=root.querySelector('#tgm-upload-input');
  root.querySelector('#tgm-upload')?.addEventListener('click',()=>fileInput?.click());
  fileInput?.addEventListener('change',async()=>{
    try{
      const files=[...fileInput.files];
      fileInput.value='';
      await uploadFiles(ctx,files);
      await renderRoute(true);
      toast('Media uploaded. Review it before public use.');
    }catch(error){fail(error);}
  });

  root.querySelector('#tgm-settings-form')?.addEventListener('submit',async e=>{
    e.preventDefault();
    const form=e.currentTarget;
    const btn=form.querySelector('[type="submit"]');
    if(btn)btn.disabled=true;
    try{
      await query(sb.from('telegram_settings').update({
        channel_username:normalizeChannelInput(form.channel_username.value)||null,
        daily_post_time:form.daily_post_time.value||'19:00',
        approval_required:form.approval_required.checked,
        updated_by:state.session.user.id,
        updated_at:new Date().toISOString()
      }).eq('id',1));
      toast('Telegram settings saved.');
      await renderRoute(true);
    }catch(error){fail(error);}
    finally{if(btn)btn.disabled=false;}
  });

  root.querySelector('#tgm-check-connection')?.addEventListener('click',async e=>{
    const btn=e.currentTarget;
    btn.disabled=true;btn.textContent='Checking…';
    try{
      const status=await invokeEdge('telegram-publish',{action:'status'},15000);
      if(status.ready)toast('Telegram bot and channel are ready.');
      else if(!status.configured)toast('Bot token is not connected yet.','error');
      else toast(status.error||'Bot exists, but channel permissions are not ready.','error');
      await renderRoute(true);
    }catch(error){fail(error);}
    finally{btn.disabled=false;btn.textContent='Check connection';}
  });

  root.addEventListener('click',async e=>{
    const button=e.target.closest('[data-tgm-action]');
    if(!button)return;
    const action=button.dataset.tgmAction,id=button.dataset.id;
    const post=model.posts.find(p=>p.id===id);
    const asset=model.assets.find(a=>a.id===id);
    try{
      if(action==='review-media'&&asset){assetEditor(ctx,model,asset);return;}
      if(action==='edit-post'&&post){postEditor(ctx,model,post);return;}
      if(action==='approve-post'&&post){
        await query(sb.from('telegram_posts').update({
          status:'approved',
          approved_by:state.session.user.id,
          approved_at:new Date().toISOString(),
          error_message:null,
          updated_at:new Date().toISOString()
        }).eq('id',id));
        toast('Post approved.');
        await renderRoute(true);
        return;
      }
      if(action==='skip-post'&&post){
        await query(sb.from('telegram_posts').update({status:'skipped',updated_at:new Date().toISOString()}).eq('id',id));
        toast('Post skipped.');
        await renderRoute(true);
        return;
      }
      if(action==='publish-post'&&post){
        button.disabled=true;button.textContent='Publishing…';
        await invokeEdge('telegram-publish',{post_id:id},45000);
        toast('Published to Telegram.');
        await renderRoute(true);
        return;
      }
    }catch(error){fail(error);}
  });

  const search=root.querySelector('#tgm-media-search');
  const filter=root.querySelector('#tgm-media-filter');
  const applyMediaFilter=()=>{
    const q=String(search?.value||'').trim().toLowerCase();
    const f=filter?.value||'all';
    root.querySelectorAll('.tgm-media-card').forEach(card=>{
      const asset=model.assets.find(a=>a.id===card.dataset.mediaId);
      if(!asset)return;
      const hay=[asset.file_name,asset.title,asset.description,...(asset.tags||[])].filter(Boolean).join(' ').toLowerCase();
      const textOk=!q||hay.includes(q);
      const statusOk=f==='all'||
        (f==='ready'&&asset.review_status==='approved'&&asset.privacy_status==='public_safe')||
        (f==='review'&&asset.review_status==='raw')||
        (f==='blocked'&&(asset.privacy_status==='do_not_use'||asset.review_status==='rejected'));
      card.hidden=!(textOk&&statusOk);
    });
  };
  search?.addEventListener('input',applyMediaFilter);
  filter?.addEventListener('change',applyMediaFilter);
}

window.VisionTelegramManager={
  async page(ctx){
    const model=await loadModel(ctx);
    setTimeout(()=>bind(ctx,model),0);
    return pageMarkup(model,ctx.esc);
  }
};
})();