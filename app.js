/* Design studies. Reference art is a replaceable composition example, not a public-site asset.
   A 1600 × 900 canvas is both the preview and the export source, avoiding capture differences. */
const variant='b';
const titles={a:['A · 에디토리얼 스텝','밝은 여백과 네 개의 계단식 포트레이트'],b:['B · 노트 갤러리','문서형 프로필과 단정한 계단식 갤러리'],c:['C · 시네마틱 프로필','넓은 배너와 큰 닉네임, 깊은 검정 바탕']};
const groups={'연령':['성인','청소년','비공개'],'트윗 성향':['RT','마음','일상','앓이','후기','제작','홍보','OOC 배포'],'활동 성향':['제작','소비'],'선호 커플링':['HL','BL','GL','NCP'],'관계 정리':['블언블','블락','언팔'],'맞팔로우':['RT','마음','멘션','선팔로우']};
const palette=['#c85a5a','#ce725c','#d18c58','#d9bc62','#b7c56b','#6d9c70','#4e7860','#5d9a91','#88b9cb','#638db8','#536486','#77709f','#9279a6','#a57198','#d49baa','#e3bdc7','#94725d','#b59a69','#d5c5ac','#f1ecdf','#ffffff','#d4d5d1','#999b96','#343632'];
const bannerHeight=280;
const paletteNames=['빨강','다홍','주황','노랑','연두','초록','진초록','청록','하늘색','파랑','남색','남보라','보라','자주','분홍','연분홍','갈색','황토','베이지','아이보리','흰색','연회색','회색','검정'];
const galleryLayout={x:582,y:402,w:224,rise:25,h:400,gap:18};
const state={background:'#faf9f5',nickname:'닉네임',platform:'',ng:'',color:variant==='c'?'#f3f2ee':'#343632',selected:{'연령':['성인'],'트윗 성향':['RT','마음','일상'],'활동 성향':['제작','소비'],'선호 커플링':['HL','BL'],'관계 정리':['블언블'],'맞팔로우':['선팔로우']},images:Array(5).fill(null),position:[50,0,0,0,0],demo:false};
document.title='트친소 스튜디오';
document.body.innerHTML=`<header><div class="brand">트친소 스튜디오<span>PROFILE IMAGE MAKER</span></div><button class="export" id="export">PNG 저장 ↗</button><nav class="mobile-nav" aria-label="편집 화면 이동"><a href="#preview">미리보기</a><a href="#editor">내용 편집</a></nav></header><dialog id="savePreview" aria-labelledby="saveTitle"><div class="save-heading"><h2 id="saveTitle">트친소 이미지 저장</h2><button id="closeSave" type="button" aria-label="저장 창 닫기">닫기</button></div><p>PNG 다운로드를 누르세요. 이미지를 길게 눌러 기기에 저장할 수도 있습니다.</p><img id="savedImage" alt="완성된 트친소 이미지"><a id="downloadImage" class="export">PNG 다운로드</a></dialog><div class="layout"><aside id="editor"><h2>나의 프로필 만들기</h2><div class="muted">선택한 내용만 이미지에 표시됩니다.</div><section class="controls"><label class="title" for="nickname">닉네임</label><input id="nickname" type="text" maxlength="18" value="닉네임"><div id="fields"></div></section>${colorSection('color','글자 색상')}${colorSection('background','배경 색상')}<section class="controls"><label class="title">이미지</label><div class="muted">배너 1장 · 캐릭터 4장<br>JPG, PNG, WebP · 파일당 최대 20MB</div><div id="uploads"></div></section><div class="status" id="status" role="status" aria-live="polite"></div><p class="muted">이미지와 입력 내용은 이 브라우저에서 처리됩니다. 새로고침하면 초기화됩니다.</p></aside><main id="preview"><div class="previewbar"><div><div class="eyebrow">MY PROFILE</div><h1>트친소</h1></div><div class="preview-tools"><span class="badge">16:9 · 1600 × 900</span><div class="zoom-controls" role="group" aria-label="미리보기 확대 및 축소"><button id="zoomOut" type="button" aria-label="미리보기 축소">−</button><select id="zoomLevel" aria-label="미리보기 배율">${[50,75,100,125,150,175,200,225,250].map(n=>`<option value="${n}" ${n===100?'selected':''}>${n}%</option>`).join('')}</select><button id="zoomIn" type="button" aria-label="미리보기 확대">＋</button><button id="zoomFit" type="button">화면 맞춤</button></div></div></div><div class="stage" tabindex="0" aria-label="트친소 미리보기. 확대하면 스크롤로 이동할 수 있습니다."><div class="canvas-wrap"><canvas id="canvas" width="1600" height="900" aria-label="트친소 이미지 실시간 미리보기"></canvas><div id="dropzones"></div></div></div><div class="note"><div><strong>왼쪽은 나의 이야기, 오른쪽은 좋아하는 캐릭터.</strong><br>태그를 고르고 이미지를 넣어 나만의 트친소를 완성해 보세요.</div><div>배너와 캐릭터 칸을 클릭하거나 이미지를 끌어다 놓으세요.<br>각 이미지의 세로 위치는 왼쪽에서 조절할 수 있습니다.</div></div></main></div>`;
const fields=document.querySelector('#fields');
for(const name of ['연령','트윗 성향','활동 성향','주 활동 플랫폼','선호 커플링','관계 정리','맞팔로우','NG']){
 const el=document.createElement('div');el.className='field';
 if(groups[name]){el.innerHTML=`<label class="title">${name}</label><div class="chips" role="group" aria-label="${name}">${groups[name].map(word=>`<button class="chip" aria-pressed="${state.selected[name].includes(word)}">${word}</button>`).join('')}</div>`;for(const button of el.querySelectorAll('button'))button.onclick=()=>{let arr=state.selected[name],word=button.textContent;state.selected[name]=name==='연령'?(arr.includes(word)?[]:[word]):(arr.includes(word)?arr.filter(x=>x!==word):[...arr,word]);for(const b of el.querySelectorAll('button'))b.setAttribute('aria-pressed',state.selected[name].includes(b.textContent));draw();};}
 else {const key=name==='NG'?'ng':'platform';el.innerHTML=`<label class="title" for="${key}">${name}</label><textarea id="${key}" maxlength="${key==='ng'?90:60}" placeholder="직접 입력해 주세요"></textarea>`;el.querySelector('textarea').oninput=e=>{state[key]=e.target.value;draw();};}fields.append(el);
}
for(let i=0;i<5;i++){
 const name=i===0?'상단 배너':`캐릭터 ${i}`;const el=document.createElement('div');
 el.innerHTML=`<div class="uploadrow"><label>${name} <span style="float:right">＋</span><input id="image-${i}" type="file" accept="image/png,image/jpeg,image/webp" aria-label="${name} 업로드"></label><button class="small" aria-label="${name} 삭제">삭제</button></div><details><summary>${name} 세로 위치</summary><input type="range" min="0" max="100" value="${i===0?50:0}" aria-label="${name} 세로 위치"></details>`;
 el.querySelector('input[type=file]').onchange=async e=>{const file=e.target.files[0];if(file)await loadImage(i,file);e.target.value='';};
 el.querySelector('button').onclick=()=>{imageRequests[i]++;state.images[i]=false;draw();message(`${name} 이미지를 삭제했습니다.`);};el.querySelector('input[type=range]').oninput=e=>{state.position[i]=Number(e.target.value);draw();};document.querySelector('#uploads').append(el);
}
const canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d');
let statusTimer;function message(text){clearTimeout(statusTimer);document.querySelector('#status').textContent=text;statusTimer=setTimeout(()=>{document.querySelector('#status').textContent='';},4500);}
function colorSection(key,label){const hexId=key==='color'?'hex':'backgroundHex';return `<section class="controls"><label class="title" for="${key}">${label}</label><p class="color-hint" id="${key}Hint">색상 코드 입력 가능</p><div class="colorrow"><input type="color" id="${key}" value="${state[key]}"><input type="text" id="${hexId}" maxlength="7" value="${state[key]}" aria-label="${label} HEX 코드" aria-describedby="${key}Hint"></div><div class="swatches" role="group" aria-label="${label} 계통색 24색 팔레트">${palette.map((c,i)=>`<button type="button" style="background:${c}" data-color="${c}" data-target="${key}" aria-label="${label} ${paletteNames[i]} ${c}" title="${paletteNames[i]} · ${c}" aria-pressed="${c===state[key]}"></button>`).join('')}</div></section>`;}
function setColor(value,key='color'){if(!/^#[\da-f]{6}$/i.test(value))return false;state[key]=value.toLowerCase();document.querySelector(`#${key}`).value=value;const hex=document.querySelector(key==='color'?'#hex':'#backgroundHex');hex.value=value;hex.setCustomValidity('');document.querySelectorAll(`[data-target="${key}"]`).forEach(b=>b.setAttribute('aria-pressed',b.dataset.color===state[key]));draw();return true;}
document.querySelector('#nickname').oninput=e=>{state.nickname=e.target.value;draw();};
for(const key of ['color','background']){document.querySelector(`#${key}`).oninput=e=>setColor(e.target.value,key);document.querySelector(key==='color'?'#hex':'#backgroundHex').oninput=e=>{if(!setColor(e.target.value,key))e.target.setCustomValidity('#으로 시작하는 6자리 색상 코드를 입력해 주세요.');};}
document.querySelectorAll('[data-color]').forEach(b=>b.onclick=()=>setColor(b.dataset.color,b.dataset.target));
function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}
function text(value,x,y,size=22,weight=400,color=state.color){ctx.fillStyle=color;ctx.font=`${weight} ${size}px "Malgun Gothic", sans-serif`;ctx.fillText(value,x,y);}
function line(x,y,x2,y2,color){ctx.strokeStyle=color;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();}
function wrap(value,x,y,width,size=21,maxLines=2){ctx.font=`400 ${size}px "Malgun Gothic",sans-serif`;let lines=[''];for(const ch of value){let last=lines.length-1;if(ch==='\n'||ctx.measureText(lines[last]+ch).width>width){if(lines.length>=maxLines){lines[last]=lines[last].replace(/.{0,2}$/u,'')+'…';break;}lines.push(ch==='\n'?'':ch);}else lines[last]+=ch;}lines.forEach((s,i)=>text(s,x,y+i*(size+9),size));}
function cover(img,x,y,w,h,pos=50,source){const s=source||[0,0,img.naturalWidth,img.naturalHeight];const scale=Math.max(w/s[2],h/s[3]),sw=w/scale,sh=h/scale;ctx.drawImage(img,s[0]+(s[2]-sw)/2,s[1]+(s[3]-sh)*pos/100,sw,sh,x,y,w,h);}
function picture(i,x,y,w,h){const img=state.images[i];if(img){cover(img,x,y,w,h,state.position[i]);return;}rect(x,y,w,h,'#e4e5df');ctx.save();ctx.textAlign='center';text('이미지 업로드',x+w/2,y+h/2-3,i===0?25:22,400,'#777c70');text(i===0?`권장 이미지 크기 1600 × ${bannerHeight} px`:`권장 크기 ${w} × ${h} px`,x+w/2,y+h/2+27,i===0?16:14,400,'#777c70');ctx.restore();}
function bannerNickname(){const name=state.nickname||'닉네임';ctx.font='800 62px "Malgun Gothic", sans-serif';const bounds=ctx.measureText(name);const ascent=bounds.actualBoundingBoxAscent||48,descent=bounds.actualBoundingBoxDescent||0;text(name,45,bannerHeight+(ascent-descent)/2,62,800);}
function draw(){const rule='#c9ccc4';ctx.clearRect(0,0,1600,900);rect(0,0,1600,900,state.background);
 picture(0,0,0,1600,bannerHeight);bannerNickname();
 info(45,370,458,53);line(541,350,541,815,rule);
 const g=galleryLayout;gallery(g.x,g.y,g.w,g.rise,g.h,g.gap);text('FAVORITES',582,374,15,700);
 line(32,855,1568,855,rule);ctx.save();ctx.textAlign='right';text('@Mmong404',1568,880,16,400,'#999999');ctx.restore();
}
function info(x,y,w,step){const values={'연령':state.selected['연령'].join(' · '),'트윗 성향':state.selected['트윗 성향'].join(' · '),'활동 성향':state.selected['활동 성향'].join(' · '),'주 활동 플랫폼':state.platform,'선호 커플링':state.selected['선호 커플링'].join(' · '),'관계 정리':state.selected['관계 정리'].join(' · '),'맞팔로우':state.selected['맞팔로우'].join(' · '),'NG':state.ng};let offset=0;for(const [label,value]of Object.entries(values)){text(label,x,y+offset,17,700);wrap(value||'—',x+143,y+offset,w-143,20,2);offset+=step+(label==='트윗 성향'?19:0);} }
function gallery(x,y,w,rise,h,gap){for(let i=1;i<=4;i++){const px=x+(i-1)*(w+gap),py=y-(i-1)*rise;picture(i,px,py,w,h);rect(px+w-110,py+h-42,110,28,variant==='c'?'#d95858':'#d5e394');text(`FAVORITE 0${i}`,px+w-101,py+h-22,12,700,'#232721');}}
let savedImageUrl=null;
document.querySelector('#closeSave').onclick=()=>document.querySelector('#savePreview').close();
document.querySelector('#export').onclick=()=>{const button=document.querySelector('#export');button.disabled=true;canvas.toBlob(blob=>{button.disabled=false;if(!blob){message('PNG를 생성하지 못했습니다.');return;}if(savedImageUrl)URL.revokeObjectURL(savedImageUrl);savedImageUrl=URL.createObjectURL(blob);const filename=`트친소-${(state.nickname||'프로필').replace(/[\\/:*?"<>|]/g,'')}-${variant.toUpperCase()}.png`;
 if(matchMedia('(max-width:900px)').matches&&navigator.maxTouchPoints>0){const link=document.querySelector('#downloadImage');link.href=savedImageUrl;link.download=filename;document.querySelector('#savedImage').src=savedImageUrl;document.querySelector('#savePreview').showModal();message('저장할 이미지를 준비했습니다.');}
 else {const a=document.createElement('a');a.href=savedImageUrl;a.download=filename;a.click();message('1600 × 900 PNG 다운로드를 요청했습니다.');}
 },'image/png');};
async function loadImage(i,file){
 const name=i===0?'상단 배너':`캐릭터 ${i}`;
 if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>20*1024*1024){message('20MB 이하의 JPG, PNG, WebP 이미지를 선택해 주세요.');return;}
 const request=++imageRequests[i];
 try{const url=URL.createObjectURL(file);const img=new Image();try{img.src=url;await img.decode();}finally{URL.revokeObjectURL(url);}if(request!==imageRequests[i])return;state.images[i]=img;draw();message(`${name} 이미지를 적용했습니다.`);}catch{message('이미지를 읽을 수 없습니다. 다른 파일을 선택해 주세요.');}
}
const imageRequests=Array(5).fill(0);
const g=galleryLayout;
const zones=[[0,0,1600,bannerHeight],...Array.from({length:4},(_,i)=>[g.x+i*(g.w+g.gap),g.y-i*g.rise,g.w,g.h])];
zones.forEach(([x,y,w,h],i)=>{
 const name=i===0?'상단 배너':`캐릭터 ${i}`;
 const button=document.createElement('button');button.type='button';button.className='dropzone';button.dataset.slot=i;button.setAttribute('aria-label',`${name} 이미지 업로드`);button.title=`${name}: 클릭 또는 드래그앤드랍으로 이미지 업로드`;button.innerHTML='<span>클릭 또는 드래그앤드랍</span>';
 Object.assign(button.style,{left:`${x/16}%`,top:`${y/9}%`,width:`${w/16}%`,height:`${h/9}%`});
 button.onclick=()=>document.querySelector(`#image-${i}`).click();
 button.ondragover=e=>{e.preventDefault();e.dataTransfer.dropEffect='copy';button.classList.add('dragging');};
 button.ondragleave=()=>button.classList.remove('dragging');
 button.ondrop=async e=>{e.preventDefault();button.classList.remove('dragging');const files=e.dataTransfer.files;if(files.length!==1){message('한 칸에 이미지 한 장을 넣어 주세요.');return;}await loadImage(i,files[0]);};
 document.querySelector('#dropzones').append(button);
});
// Prevent a misplaced file drop from navigating away and losing the current profile.
window.addEventListener('dragover',e=>{if(e.dataTransfer.types.includes('Files'))e.preventDefault();});
window.addEventListener('drop',e=>{if(e.dataTransfer.types.includes('Files'))e.preventDefault();});
let previewZoom=100;
function setZoom(value){const next=Math.max(50,Math.min(250,Number(value)));previewZoom=next;document.querySelector('.canvas-wrap').style.width=`${next}%`;document.querySelector('#zoomLevel').value=next;document.querySelector('#zoomOut').disabled=next===50;document.querySelector('#zoomIn').disabled=next===250;}
document.querySelector('#zoomOut').onclick=()=>setZoom(previewZoom-25);
document.querySelector('#zoomIn').onclick=()=>setZoom(previewZoom+25);
document.querySelector('#zoomFit').onclick=()=>{setZoom(100);const stage=document.querySelector('.stage');stage.scrollLeft=0;stage.scrollTop=0;};
document.querySelector('#zoomLevel').onchange=e=>setZoom(e.target.value);
document.querySelector('.stage').onkeydown=e=>{if(e.target!==e.currentTarget)return;if(['+','=','-','0'].includes(e.key)){e.preventDefault();setZoom(e.key==='0'?100:previewZoom+(e.key==='-'?-25:25));}};
draw();window.__ready=true;






