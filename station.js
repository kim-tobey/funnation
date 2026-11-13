
/* =====================================================================
   개인 방송국 (station.html)
   기획서 프로토타입(yuujaeh.wixsite.com/funnation) 의 동작 · 데이터를 옮기고,
   GNB · LNB 틀 · 푸터 · 하단 내비는 펀네이션 공통 마크업(app.js)을 그대로 씀.
   ===================================================================== */
(function(){
'use strict';
/* 프로토타입은 #main 안에서 스크롤했지만 펀네이션은 문서 전체가 스크롤 — 같은 인터페이스로 창 스크롤을 다룸 */
const MAINS={
  get scrollTop(){return window.scrollY},
  set scrollTop(v){window.scrollTo(0,v)},
  getBoundingClientRect(){return {top:0,left:0}},
  addEventListener(t,f,o){window.addEventListener(t,f,o)}
};
/* ---------- utils ---------- */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Number(n).toLocaleString('en-US');
const TODAY='2026.11.05';
const P={
search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
home:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
crown:'<path d="M3 8l4 4 5-7 5 7 4-4-2 11H5z"/>',
video:'<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
star:'<path d="M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9z"/>',
users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14.5c3 0 5 1.5 5 4.5"/>',
gift:'<rect x="3" y="8" width="18" height="4"/><path d="M5 12v9h14v-9M12 8v13M12 8c-2-4-6-3-5 0 .5 1.5 3 1 5 0zM12 8c2-4 6-3 5 0-.5 1.5-3 1-5 0z"/>',
trophy:'<path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 21h8M9 18h6"/>',
headset:'<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
tag:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1"/>',
info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
heart:'<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
antenna:'<circle cx="12" cy="12" r="2"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2"/>',
bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>',
bellOff:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4M4 4l16 16"/>',
bellRing:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4M2 8c.5-2 1.5-3.5 3-4.5M22 8c-.5-2-1.5-3.5-3-4.5"/>',
more:'<circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/>',
lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
pin:'<path d="M9 3h6l-1 6 3 3v2H7v-2l3-3zM12 14v7"/>',
x:'<path d="M5 5l14 14M19 5L5 19"/>',
check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
play:'<path d="M8 5l12 7-12 7z" fill="currentColor"/>',
moon:'<path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z"/>',
pencil:'<path d="M4 20l1-4L16 5l3 3L8 19zM14 7l3 3"/>',
link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5-5-9 9"/>',
thumb:'<path d="M7 11v9H4v-9zM7 11l4-7c2 0 3 1 3 3v3h5a2 2 0 0 1 2 2l-1.5 6a2 2 0 0 1-2 1.5H7"/>',
chevR:'<path d="M9 6l6 6-6 6"/>',chevL:'<path d="M15 6l-6 6 6 6"/>',chevD:'<path d="M6 9l6 6 6-6"/>',
youtube:'<rect x="3" y="6" width="18" height="12" rx="4"/><path d="M10 9.5l4.5 2.5-4.5 2.5z"/>',
instagram:'<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/><path d="M16.8 7.2v.1"/>',
xlogo:'<path d="M5 4l14 16M19 4L5 20"/>',
discord:'<path d="M7 7c3-1.5 7-1.5 10 0l2 9c-1.5 1.5-3 2-4.5 2l-1-1.5M7 7l-2 9c1.5 1.5 3 2 4.5 2l1-1.5M9 12.5v.1M15 12.5v.1"/>',
cafe:'<path d="M5 8h11v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4zM16 9h2a2 2 0 0 1 0 5h-2M8 3v2M12 3v2"/>',
calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
share:'<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 11l7.6-4M8.2 13l7.6 4"/>',
flag:'<path d="M5 21V4h12l-2 4 2 4H5"/>',
mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
ext:'<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
facebook:'<path d="M14 8h2V4h-2.5A3.5 3.5 0 0 0 10 7.5V10H8v4h2v6h4v-6h2.5l.5-4h-3V8z"/>',tiktok:'<path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.5 2.5 2 4 4.5 4.5"/>',
settings:'<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
ban:'<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',userx:'<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6 7-6M17 9l5 5M22 9l-5 5"/>',
sparkle:'<path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>',coin:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5c.5-1 1.5-1.5 2.5-1.5 1.5 0 2.5.8 2.5 2s-1 1.8-2.5 2-2.5.8-2.5 2 1 2 2.5 2c1 0 2-.5 2.5-1.5M12 6v2M12 16v2"/>',
history:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2"/>',sidebarR:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>',rect:'<rect x="3" y="8" width="18" height="8" rx="1.5"/>',text:'<path d="M5 6h14M12 6v13M9 19h6"/>',
eyeoff:'<path d="M3 3l18 18M10.6 6.2A9 9 0 0 1 12 6c5 0 9 6 9 6a15 15 0 0 1-3 3.5M6.5 6.8C4 8.5 3 12 3 12s4 6 9 6c1.4 0 2.7-.4 3.8-1M10 10a3 3 0 0 0 4 4"/>',grip:'<circle cx="9" cy="7" r="1.2" fill="currentColor"/><circle cx="15" cy="7" r="1.2" fill="currentColor"/><circle cx="9" cy="12" r="1.2" fill="currentColor"/><circle cx="15" cy="12" r="1.2" fill="currentColor"/><circle cx="9" cy="17" r="1.2" fill="currentColor"/><circle cx="15" cy="17" r="1.2" fill="currentColor"/>'
};
/* 아이콘은 펀네이션 홈페이지와 같은 선 아이콘(벡터). 비트맵은 배너 · 등급 · 엠블럼에만 (2026-11-12 사용자 결정) */
const ic=(n,s=20)=>icV(n,s);
const icV=(n,s=20)=>`<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]||''}</svg>`;
const hue=n=>{let h=0;for(const c of String(n))h=(h*31+c.charCodeAt(0))%360;return h};
const PROFILE='assets/v2/station/profile.jpg';
/* 프로필 사진 — 이니셜 대신 작업 파일(assets)의 실제 프로필 이미지. 이름마다 겹치지 않게 차례로 배정(풀을 다 쓰면 다시 처음부터) */
const AVPOOL=['assets/v2/creator/photo1.png','assets/home/avatar/vtuber-blue.png','assets/logout/avatar3.png','assets/watch/v3/avatar/chaeyoung.png','assets/home/avatar/bear.jpg','assets/v2/notice/avatar1.png','assets/v2/creator/photo4.png','assets/home/avatar/vtuber-green.png','assets/logout/avatar4.png','assets/watch/v3/avatar/joker.png','assets/home/avatar/chim.png','assets/v2/creator/photo2.png','assets/home/avatar/vtuber-purple.png','assets/logout/avatar5.png','assets/watch/v3/avatar/eurat.png','assets/logout/avatar1.png','assets/v2/notice/avatar2.png','assets/v2/creator/photo5.png','assets/home/avatar/pixel.png','assets/watch/v3/avatar/frokynn.png','assets/logout/avatar6.png','assets/home/avatar/vtuber-white.png','assets/watch/v3/avatar/trangam.png','assets/logout/avatar2.png','assets/watch/v3/avatar/ippeun.png','assets/v2/creator/photo3.png','assets/watch/v3/avatar/ym.png','assets/watch/v3/avatar/love.png','assets/watch/v4/avatar-ymss.jpg','assets/watch/v3/avatar/nightbot.png'];
const AVMAP=new Map();
function avSrc(n){n=String(n);if(AVMAP.has(n))return AVMAP.get(n);const N=AVPOOL.length;let i=(hue(n)>>>0)%N;const used=new Set(AVMAP.values());if(AVMAP.size<N){while(used.has(AVPOOL[i]))i=(i+1)%N}const src=AVPOOL[i];AVMAP.set(n,src);return src}
const av=(n,s=40)=>`<span class="av pf" style="width:${s}px;height:${s}px"><img src="${n==='\ud380\uc0c1\uc0ac'?PROFILE:avSrc(n)}" alt="" loading="lazy" decoding="async"></span>`;
const TIERN={none:'후원 없음',dirt:'흙수저',gold:'금수저',dia:'노블레스',black:'골드프라임'};
const TIERO={none:-1,dirt:0,gold:1,dia:2,black:3};
const tb=t=>`<span class="tb t-${t}">${TIERN[t]}</span>`;
const thumb=(title,i,badges='')=>`<div class="th" style="background:linear-gradient(135deg,hsl(${(i*47+205)%360} 42% 26%),var(--thumb))"><span class="th-t">${esc(String(title).split(' ')[0].replace(/[\[\]]/g,''))}</span>${badges}</div>`;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

/* ---------- data ---------- */
const D={
 name:'펀상사',intro:'펀레이블 대표 펀상사의 직급제 후원 방송국',
 introLong:['펀상사는 펀레이블 크루의 대표가 운영하는 방송국입니다. 크루원이 직급을 걸고 방송하는 시즌제 방송을 진행하며, 직급전·퇴근전쟁·룰렛 미션 다시보기를 제공합니다.','오늘의 순위는 방송 화면의 엑셀표에서 확인하세요.'],
 info:[['방송 시간','월·수·금 20:00'],['주 콘텐츠','직급전, 퇴근전쟁, 룰렛 미션'],['개설일','2026.10.05'],['누적 방송 시간','312시간']],
 rules:['1. 출근(방송 시작) 시간을 지켜 주세요','2. 다른 멤버·팬을 비방하지 않습니다','3. 후원 강요, 선정적 발언은 금지합니다','4. 직급전 결과는 방송 종료 후 공지에 게시합니다','5. 규칙 위반 시 경고, 반복 시 퇴사(채팅 제한) 처리합니다'],
 live:{title:'[펀레이블] 시즌1 9화 정시 출근 + 퇴근전쟁',cat:'직급전',since:'2시간 14분 전',next:'11.06(금) 20:00',last:'3시간 전'}
};
const SNS=[['YouTube','youtube','youtube.com/@funsangsa-demo'],['Instagram','instagram','instagram.com/funsangsa.demo'],['X','xlogo','x.com/funsangsa_demo'],['Discord','discord','discord.gg/demo-funlabel'],['네이버 카페','cafe','cafe.naver.com/funsangsademo']];
const FANS=[
['월요병환자','black','회장','2024.04',2],['결재대기중','black','부회장','2024.05',1],['칼퇴요정','dia','','2024.06',5],['회식팀장','dia','','2024.08',3],['탕비실주인','dia','','2024.09',7],
['보너스봉투','gold','','2024.11',4],['팀장님의미소','gold','','2025.01',9],['엑셀표지킴이','gold','','2025.03',6],['월급루팡','gold','','2025.06',10],['회장님비서','gold','','2025.09',8],
['주주총회참석','dirt','','2025.10',0],['법카요정','dirt','','2025.11',0],['승진기원','dirt','','2025.12',0],['야근전사','dirt','','2026.01',0],['낙수받는이','dirt','','2026.02',0],
['믹스커피장인','dirt','','2026.03',0],['인사팀서기','dirt','','2026.04',0],['결산담당','dirt','','2026.05',0],['대리의한숨','dirt','','2026.06',0],['사원증목걸이','dirt','','2026.07',0]
].map((a,i)=>({n:a[0],t:a[1],title:'',since:a[3],m:a[4],rank:i+1}));
const fanOf=n=>FANS.find(f=>f.n===n);
const LIVE_DONORS=[['결재대기중','gyeoljae_wait',152000],['월요병환자','wolyobyeong',98000],['회식팀장','hoesik_leader',50000],['칼퇴요정','kaltoe_fairy',33000],['탕비실주인','tangbisil_owner',20000]].map(a=>({n:a[0],id:a[1],a:a[2]}));
const SUBS=[['월요병환자',2,19,'2025.04.02'],['결재대기중',2,17,'2025.06.11'],['회식팀장',2,14,'2025.09.03'],['칼퇴요정',1,13,'2025.10.20'],['탕비실주인',1,11,'2025.12.08'],['엑셀표지킴이',2,9,'2026.02.14'],['주주총회참석',1,7,'2026.04.01'],['팀장님의미소',1,6,'2026.05.09'],['법카요정',1,4,'2026.07.17'],['야근전사',1,3,'2026.08.22'],['결산담당',2,2,'2026.09.30'],['사원증목걸이',1,1,'2026.10.25']].map(a=>({n:a[0],tier:a[1],mo:a[2],start:a[3]}));
const REPLAYS=[['[펀레이블] 시즌1 11화 인턴 전환 직급전','직급전','3:48:20','2026.11.04',3120,''],['[펀레이블] 시즌1 10화 회식 특집 · 건배 룰렛','특집','4:12:05','2026.11.04',4580,''],['[펀레이블] 시즌1 9화 중간 직급전 · 승진 발표','직급전','3:55:41','2026.11.02',6210,''],['[펀레이블] 시즌1 8화 퇴근전쟁 · 탕비실 미션','퇴근전쟁','3:22:10','2026.10.28',5874,''],['[펀레이블] 시즌1 6화 합방 특집 · 야근 미션','합방','4:05:33','2026.10.21',7102,''],['[펀레이블] 시즌1 4화 1차 직급전 결과 발표','직급전','3:10:02','2026.10.14',8830,''],['[펀레이블] 시즌1 2화 사옥 밥전쟁 + 룰렛 벌금','밥전쟁','2:55:40','2026.10.07',9120,''],['[펀레이블] 시즌1 1화 개업식 · 첫 직급전','직급전','3:33:21','2026.10.05',12480,'']].map((a,i)=>({id:i,title:a[0],cat:a[1],len:a[2],date:a[3],views:a[4],exp:a[5]}));
const VIDEOS=[['펀상사 사옥 투어 · 대표실부터 탕비실까지','일상','8:12','2026.11.03','1.2만',12000],['시즌1 직급전 하이라이트 TOP 5','직급전','12:40','2026.11.01','2.4만',24000],['신입사원 면접 현장 (압박 질문 모음)','일상','9:05','2026.10.30','8,930',8930],['퇴근전쟁 역전극 모음','퇴근전쟁','15:22','2026.10.27','6,120',6120],['룰렛 벌금 레전드 리액션','룰렛·미션','10:10','2026.10.24','3.1만',31000],['펀레이블 첫 회식 비하인드','일상','9:48','2026.10.20','1.8만',18000],['엑셀표 보는 법 · 직급과 순위 설명','직급전','6:52','2026.10.16','1.1만',11000],['인턴 수습의여왕 성장기','일상','18:30','2026.10.12','7,540',7540],['월요 조회 대표 훈화 모음','일상','11:02','2026.10.09','5,210',5210],['사옥 탕비실 간식 랭킹','룰렛·미션','7:34','2026.10.06','4.6만',46000]].map((a,i)=>({id:i,title:a[0],cat:a[1],len:a[2],date:a[3],vs:a[4],v:a[5]}));
const CREW=[['펀상사','크루장',2,12480,'펀레이블 사옥의 주인. 출근 도장은 제일 먼저, 퇴근은 제일 마지막.','','대표'],['새벽결재','크루원',0,8920,'새벽에도 결재 버튼은 눌러야 합니다. 서명은 정성스럽게.','','부장'],['야근요정하루','크루원',1,5310,'퇴근전쟁 단골 참전. 오늘도 불 끄고 나가겠습니다.','퇴근전쟁 단골 참전 · 야근 중계','차장'],['탕비실지킴이','크루원',0,3210,'간식 재고는 제가 관리합니다. 탕비실 미션 담당.','','과장'],['칼퇴희망','크루원',1,2140,'목표는 칼퇴, 현실은 연장 근무. 룰렛 앞에서 작아집니다.','룰렛 앞에서 작아지는 중','과장'],['복사기고장','크루원',0,1875,'회의 자료 인쇄 중 오류 발생. 리액션 담당 대리입니다.','','대리'],['신입은말해요','크루원',0,960,'입사 3주차. 질문은 많고 대답은 아직 연습 중입니다.','','사원'],['수습의여왕','크루원',0,720,'인턴 마지막 달. 정규직 전환 직급전을 앞두고 있습니다.','','인턴']].map(a=>({n:a[0],role:a[1],live:a[2],fav:a[3],intro:a[4],lt:a[5],rank:a[6]}));
const OVQ=[{n:'월요병환자',a:10000,m:'오늘도 출근 완료'},{n:'익명',a:1000,m:'결재 올립니다'},{n:'회식팀장',a:5000,m:'탕비실 간식 보급'},{n:'결재대기중',a:30000,m:'',s:'꼬마선장'},{n:'탕비실주인',a:3000,m:'커피 한 잔 하세요'}];
/* 시그니처 103종 — 실서비스 펀네이션 이헤이LeeHEY 방송국(funnation.co.kr/store/leehey957) 시그니처 배너 그대로 (2026-11-13). 원본 720×390 PNG/GIF → assets/v2/station/sig WebP(GIF 7종은 540 움직이는 WebP) */
const SIGS0=[["이쁜이는 뒤를 돌아봅니다",1000,"",0,"",77,6797,"assets/v2/station/sig/sig-001.webp",720,390,80884],["외모체크",1500,"",0,"",55,5556,"assets/v2/station/sig/sig-002.webp",720,390,85202],["아봉",1800,"",1,"",92,4783,"assets/v2/station/sig/sig-003.webp",720,390,92970],["모찌송",2000,"",1,"",70,3874,"assets/v2/station/sig/sig-004.webp",720,390,73112],["간바떼",2200,"",0,"",48,3527,"assets/v2/station/sig/sig-005.webp",720,390,89102],["#SELFIE",2500,"",0,"",85,3289,"assets/v2/station/sig/sig-006.webp",720,390,81488],["냥냥펀치",3000,"",1,"",63,2725,"assets/v2/station/sig/sig-007.webp",720,390,78588],["햄토리",3300,"",0,"",41,2616,"assets/v2/station/sig/sig-008.webp",720,390,80670],["고양이소리를 따라해보자",3500,"",0,"",78,2547,"assets/v2/station/sig/sig-009.webp",720,390,82594],["닭비트",3800,"",0,"",56,2110,"assets/v2/station/sig/sig-010.webp",720,390,86340],["귀여워서 미안해",4000,"",0,"",93,2096,"assets/v2/station/sig/sig-011.webp",720,390,70856],["사랑받을 준비완료",4400,"",0,"",71,2102,"assets/v2/station/sig/sig-012.webp",720,390,77350],["킹받쥬",4800,"",0,"",49,1724,"assets/v2/station/sig/sig-013.webp",720,390,89656],["크레이지러브",5000,"",0,"",86,1759,"assets/v2/station/sig/sig-014.webp",720,390,105872],["야호",5050,"",0,"",64,1805,"assets/v2/station/sig/sig-015.webp",720,390,91222],["파라파라",5100,"",0,"",42,1459,"assets/v2/station/sig/sig-016.webp",720,390,97976],["팬서비스",5150,"",0,"",79,1521,"assets/v2/station/sig/sig-017.webp",720,390,90078],["캐치캐치",5200,"",0,"",57,1590,"assets/v2/station/sig/sig-018.webp",720,390,83130],["예쁜나이25살",5250,"",0,"",94,1265,"assets/v2/station/sig/sig-019.webp",720,390,99254],["홀리몰리",5300,"",0,"",72,1345,"assets/v2/station/sig/sig-020.webp",720,390,100664],["나랑사귈래",5400,"",0,"",50,1428,"assets/v2/station/sig/sig-021.webp",720,390,75480],["무아",5500,"",0,"",87,1116,"assets/v2/station/sig/sig-022.webp",720,390,79932],["씨바레쓰고",5600,"",0,"",65,1207,"assets/v2/station/sig/sig-023.webp",720,390,89244],["아로아로",5650,"",0,"",43,1301,"assets/v2/station/sig/sig-024.webp",720,390,96818],["러브쉐이크",5700,"",0,"",80,998,"assets/v2/station/sig/sig-025.webp",720,390,85406],["오빠바이러스",5800,"",0,"",58,1097,"assets/v2/station/sig/sig-026.webp",720,390,97192],["이프유럽미",5900,"",0,"",95,1198,"assets/v2/station/sig/sig-027.webp",720,390,80620],["트월킹덕",6000,"",0,"",73,901,"assets/v2/station/sig/sig-028.webp",720,390,92126],["하트하트",6100,"",0,"",51,1006,"assets/v2/station/sig/sig-029.webp",720,390,86162],["빛을따라서",6200,"",0,"",88,1112,"assets/v2/station/sig/sig-030.webp",720,390,102718],["버터플라이",6300,"",0,"",66,820,"assets/v2/station/sig/sig-031.webp",720,390,101308],["불도저",6400,"",0,"",44,929,"assets/v2/station/sig/sig-032.webp",720,390,99934],["라부부",6500,"",0,"",81,1040,"assets/v2/station/sig/sig-033.webp",720,390,95908],["솜사탕",6600,"",0,"",59,751,"assets/v2/station/sig/sig-034.webp",720,390,80926],["슈퍼그럼요",6700,"",0,"",96,864,"assets/v2/station/sig/sig-035.webp",720,390,106036],["춤추고싶어",6800,"",0,"",74,977,"assets/v2/station/sig/sig-036.webp",720,390,104778],["아찔하게",6900,"",0,"",52,692,"assets/v2/station/sig/sig-037.webp",720,390,97792],["고민중독",7000,"",0,"",89,807,"assets/v2/station/sig/sig-038.webp",720,390,96960],["러브어택",7100,"",0,"",67,923,"assets/v2/station/sig/sig-039.webp",720,390,91266],["소다팝",7200,"",0,"",45,640,"assets/v2/station/sig/sig-040.webp",720,390,108632],["묵찌빠",7300,"",0,"",82,757,"assets/v2/station/sig/sig-041.webp",720,390,94214],["자기야화풀어",7400,"",0,"",60,875,"assets/v2/station/sig/sig-042.webp",720,390,80562],["스키",7500,"",0,"",97,593,"assets/v2/station/sig/sig-043.webp",720,390,116342],["스트로베리러쉬",7600,"",0,"",75,712,"assets/v2/station/sig/sig-044.webp",720,390,96802],["잇츠미",7700,"",0,"",53,832,"assets/v2/station/sig/sig-045.webp",720,390,103632],["왜요왜요",7800,"",0,"",90,552,"assets/v2/station/sig/sig-046.webp",720,390,97040],["미스터츄",7900,"",0,"",68,672,"assets/v2/station/sig/sig-047.webp",720,390,86508],["아자스",8000,"",0,"",46,793,"assets/v2/station/sig/sig-048.webp",720,390,90424],["레몬에이드",8100,"",0,"",83,514,"assets/v2/station/sig/sig-049.webp",720,390,108786],["퇴사할게요",8200,"",0,"",61,636,"assets/v2/station/sig/sig-050.webp",720,390,88202],["프리티걸",8300,"",0,"",98,758,"assets/v2/station/sig/sig-051.webp",720,390,88908],["핫해",8400,"",0,"",76,480,"assets/v2/station/sig/sig-052.webp",720,390,100780],["진압해",8500,"",0,"",54,603,"assets/v2/station/sig/sig-053.webp",720,390,100408],["푸른산호초",8600,"",0,"",91,726,"assets/v2/station/sig/sig-054.webp",720,390,109940],["하얀그리움",8700,"",0,"",69,449,"assets/v2/station/sig/sig-055.webp",720,390,97722],["패스트카",8800,"",0,"",47,572,"assets/v2/station/sig/sig-056.webp",720,390,86544],["짧은치마",8900,"",0,"",84,696,"assets/v2/station/sig/sig-057.webp",720,390,96282],["미니언즈",9000,"",0,"",62,820,"assets/v2/station/sig/sig-058.webp",720,390,112262],["첫눈",9100,"",0,"",40,544,"assets/v2/station/sig/sig-059.webp",720,390,127698],["눈물참기",9200,"",0,"",77,669,"assets/v2/station/sig/sig-060.webp",720,390,107968],["GGEZ",9300,"",0,"",55,793,"assets/v2/station/sig/sig-061.webp",720,390,96720],["헤비머신건",9400,"",0,"",92,518,"assets/v2/station/sig/sig-062.webp",720,390,99184],["노바티다오",9500,"",0,"",70,643,"assets/v2/station/sig/sig-063.webp",720,390,107026],["핑크레이디",9600,"",0,"",48,768,"assets/v2/station/sig/sig-064.webp",720,390,79776],["럼블",9700,"",0,"",85,493,"assets/v2/station/sig/sig-065.webp",720,390,107352],["체온",9800,"",0,"",63,619,"assets/v2/station/sig/sig-066.webp",720,390,92532],["사마귀",9900,"",0,"",41,745,"assets/v2/station/sig/sig-067.webp",720,390,121114],["결국너야",10000,"",0,"",78,470,"assets/v2/station/sig/sig-068.webp",720,390,64262],["LSD",10500,"",0,"",56,596,"assets/v2/station/sig/sig-069.webp",720,390,116340],["엉큰녀",11500,"",0,"",93,722,"assets/v2/station/sig/sig-070.webp",720,390,96360],["바우치",12000,"",0,"",71,449,"assets/v2/station/sig/sig-071.webp",720,390,78456],["오빠달려붕붕",12500,"",0,"",49,575,"assets/v2/station/sig/sig-072.webp",720,390,92374],["EDM",13000,"",0,"",86,701,"assets/v2/station/sig/sig-073.webp",720,390,117258],["출항",14000,"",0,"",64,428,"assets/v2/station/sig/sig-074.webp",720,390,79638],["코카인",15500,"",0,"",42,555,"assets/v2/station/sig/sig-075.webp",720,390,110264],["너네 오빠 불러와",15800,"",0,"",79,682,"assets/v2/station/sig/sig-076.webp",720,390,117390],["오빠왔다",15900,"",0,"",57,409,"assets/v2/station/sig/sig-077.webp",720,390,109722],["헨타이",16000,"",0,"",94,536,"assets/v2/station/sig/sig-078.webp",720,390,106704],["아헤가오",16500,"",0,"",72,663,"assets/v2/station/sig/sig-079.webp",720,390,74936],["오빠하앙",17000,"",0,"",50,390,"assets/v2/station/sig/sig-080.webp",720,390,100638],["모또하야쿠",17500,"",0,"",87,517,"assets/v2/station/sig/sig-081.webp",720,390,107614],["누나가 알려줄게",18000,"",0,"",65,645,"assets/v2/station/sig/sig-082.webp",720,390,97418],["센세",19000,"",0,"",43,372,"assets/v2/station/sig/sig-083.webp",720,390,119712],["오렌지디스코",20000,"",0,"",80,500,"assets/v2/station/sig/sig-084.webp",720,390,77426],["드라군",21500,"",0,"",58,627,"assets/v2/station/sig/sig-085.webp",720,390,101454],["마티니",22000,"",0,"",95,355,"assets/v2/station/sig/sig-086.webp",720,390,106672],["영보스",25000,"",0,"",73,483,"assets/v2/station/sig/sig-087.webp",720,390,75320],["바비걸",28200,"",0,"",51,611,"assets/v2/station/sig/sig-088.webp",720,390,118604],["꼬마선장",30000,"",1,"",88,338,"assets/v2/station/sig/sig-089.webp",720,390,104418],["ASS UP",33000,"",0,"",66,466,"assets/v2/station/sig/sig-090.webp",720,390,104258],["루니솔라",35000,"",0,"",44,594,"assets/v2/station/sig/sig-091.webp",720,390,110902],["호텔파티",40000,"",0,"",81,323,"assets/v2/station/sig/sig-092.webp",720,390,123944],["사기캐",45000,"",0,"",59,451,"assets/v2/station/sig/sig-093.webp",720,390,141202],["백갑숙도 포카치고",50000,"",0,"",96,579,"assets/v2/station/sig/sig-094.webp",720,390,109150],["살아있네",66000,"",0,"",74,307,"assets/v2/station/sig/sig-095.webp",720,390,99416],["계엄령",88000,"",0,"",52,436,"assets/v2/station/sig/sig-096.webp",720,390,86814],["VIP",100000,"",1,"",89,564,"assets/v2/station/sig/sig-097.webp",540,293,2507812],["청혼",124860,"",0,"",67,292,"assets/v2/station/sig/sig-098.webp",540,293,3373472],["VVIP",200000,"",0,"",45,421,"assets/v2/station/sig/sig-099.webp",540,293,2092722],["VVVIP",300000,"",0,"",82,550,"assets/v2/station/sig/sig-100.webp",540,293,2545450],["SVIP",500000,"",0,"",60,278,"assets/v2/station/sig/sig-101.webp",540,293,2446042],["SSVIP",1000000,"",0,"",97,407,"assets/v2/station/sig/sig-102.webp",540,293,3912178],["SSSVIP",2000000,"",0,"",75,535,"assets/v2/station/sig/sig-103.webp",540,293,3211208]].map((a,i)=>({id:i+1,n:a[0],amt:a[1],desc:a[2],hot:!!a[3],link:a[4],rec:a[5],pop:a[6],img:{data:a[7],name:a[7].split('/').pop(),w:a[8],h:a[9],size:a[10]}}));
const SG=()=>S.station.sigs;const SIGAMT=()=>SG().map(s=>s.amt);
const AMTS=[10000,100000,300000,500000,1000000];
const BOARDS={
 board1:{name:'기본 게시판 1',desc:'스트리머가 이름을 바꿀 수 있는 기본 게시판이에요',qa:'L-04'},
 board2:{name:'기본 게시판 2',desc:'누구나 글을 쓸 수 있는 기본 게시판이에요',qa:'L-05'},
 board3:{name:'기본 게시판 3',desc:'이름과 설명은 관리에서 바꿀 수 있어요',qa:'L-06'},
 board4:{name:'기본 게시판 4',desc:'VIP(팬 랭킹 20위 이내) 전용 이야기 공간이에요',qa:'L-07'},
 board5:{name:'기본 게시판 5',desc:'VVIP(팬 랭킹 10위 이내) 전용 이야기 공간이에요',qa:'L-08'}
};
const RAW={
board1:[['[공지] 펀레이블 시즌1 직급전 일정 및 직급표 안내','펀상사','2026.11.03',1820,14,'np',0,'',32],['[공지] 방송 규칙 및 후원 매너 안내 (필독)','펀상사','2026.10.05',2410,9,'np',0,'',27],['오늘 출근 도장 찍고 갑니다','월요병환자','2026.11.04',154,12,'N',0,'',12],['탕비실 간식 추천 받습니다','믹스커피장인','2026.11.03',201,5,'',0,'',4],['엑셀표 처음 보는데 보는 법 알려주세요','신입팬','2026.11.02',97,4,'',0,'',7],['직급전 결과 예상해 봅니다','예측왕','2026.10.30',388,21,'i',0,'',15],['어제 퇴근전쟁 진짜 소름','새벽출근러','2026.10.29',420,3,'i',0,'',3],['야근하면서 다시보기 틀어놨어요','야근메이트','2026.10.27',76,2,'',0,'',1]],
board2:[['시즌1 9화 후기 (역전 명장면 정리)','후기담당','2026.11.03',310,25,'N',0,'',21],['룰렛 벌금 장면 웃겨서 세 번 봄','룰렛러버','2026.11.02',132,9,'N',0,'',6],['회식 특집 비하인드 풀어봅니다','회식참석','2026.10.31',177,11,'',0,'',9],['합방 때 대표님 표정 모음','표정수집가','2026.10.28',264,18,'i',0,'',13],['인턴 전환 직급전 후기','지켜보는사람','2026.10.22',64,5,'',0,'',5],['퇴근전쟁 팁(?) 공유','전쟁참모','2026.10.18',45,3,'',0,'',2]],
board3:[['직급전 일정 사전 공지 부탁드립니다','일정러','2026.11.03',210,7,'',5,'',11],['다시보기 시즌별 묶어 주세요','정주행러','2026.10.30',302,12,'',4,'',8],['시그니처 영상 길이 조금 줄여도 될까요','시그팬','2026.10.27',95,3,'',1,'',3],['엑셀표 글자 크기 키워 주세요','모바일시청','2026.10.21',140,5,'',2,'',5],['쇼츠 업로드 주기 궁금합니다','쇼츠애청자','2026.10.16',188,8,'',1,'',2],['후원 순위 갱신 간격 질문','순위궁금','2026.10.10',61,1,'',0,'',1]],
board4:[['VIP 전용 사옥 투어 후기','팬랭킹7위','2026.11.03',64,10,'',0,'',14],['시즌1 종료 기념 응원 영상 제작 모집','편집담당','2026.10.29',58,14,'',0,'',9],['VIP 정모 장소 투표','총무','2026.10.25',41,8,'',0,'',6],['직급전 날 응원 방식 의견 받습니다','응원단장','2026.10.20',39,6,'',0,'',4],['사옥 굿즈 시안 평가','굿즈연구원','2026.10.10',30,4,'',0,'',10],['VIP 이용 매너 다시 확인해요','질서지킴이','2026.10.03',52,7,'',0,'',2]],
board5:[['VVIP 시즌 결산 모임 안건','팬랭킹1위','2026.11.02',12,2,'',0,'',18],['대표님께 드리는 연말 선물 논의','선물담당','2026.10.30',10,3,'',0,'',12],['VVIP 전용 질문 시간 아이디어','질문러','2026.10.24',11,2,'',0,'',7],['시즌2 요청사항 모음','건의대장','2026.10.18',8,1,'',0,'',8],['직급전 응원 일정 조율','조율러','2026.10.12',9,2,'',0,'',3],['VVIP 공유 메모','기록담당','2026.10.05',12,2,'',0,'',2]]
};
const CMT=['저도 그렇게 생각해요!','좋은 글 감사합니다 :)','오늘도 방송 잘 봤어요','다음에도 기대할게요','공감 백 퍼센트예요','이런 거 너무 좋아요'];
function buildPosts(){
  const out={};
  Object.keys(RAW).forEach(b=>{
    const list=RAW[b];let no=list.filter(r=>r[5].indexOf('n')<0||r[5].indexOf('N')>=0).length;
    out[b]=list.map((r,i)=>{
      const f=r[5];const notice=f.indexOf('n')>=0;
      const p={id:b+'-'+i,title:r[0],author:r[1],date:r[2],views:r[3],comments:r[4],notice,img:f.indexOf('i')>=0,isNew:f.indexOf('N')>=0,
        no:notice?0:no--,pin:(notice&&f.indexOf('p')>=0),t:0,likes:(r[8]!==undefined?r[8]:r[4]*2+3),liked:false,rec:r[6]||0,recd:false,link:r[7]||'',
        body:`${r[0].replace(/^\[공지\]\s*/,'')}에 대해 이야기하고 싶어서 글을 남겨요.\n\n함께 보고 느낀 점을 편하게 나눠 주세요. 서로 존중하면서 즐거운 공간을 만들어 가요.`,
        cl:[0,1,2].map(k=>({n:FANS[(i*3+k+2)%FANS.length].n,t:(k+1)+'시간 전',x:CMT[(i+k)%CMT.length]}))};
      if(notice)p.body='시즌1 직급전 일정과 직급표를 안내드립니다. 11월 18일 2차 직급전, 12월 14일 최종 직급전이 예정되어 있어요. 규칙을 지켜 즐겁게 이용해 주세요.';
      return p;
    });
  });
  return out;
}
const IMGSVG=(w,h,c1,c2,t1,t2,f1,f2)=>'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/><text x="50%" y="${t2?'46%':'55%'}" fill="#ffffff" font-size="${f1}" font-weight="800" text-anchor="middle" font-family="sans-serif">${t1}</text>${t2?`<text x="50%" y="72%" fill="#dfe5ed" font-size="${f2}" text-anchor="middle" font-family="sans-serif">${t2}</text>`:''}</svg>`);
const IMGOBJ=(w,h,c1,c2,t1,t2,f1,f2,name)=>({data:IMGSVG(w,h,c1,c2,t1,t2,f1,f2),name:name,w:w,h:h,size:1400});
const SLOT={title:{rw:1920,rh:336,mb:5,label:'타이틀 이미지'},rbanner:{rw:300,rh:600,mb:3,label:'우측 배너'},mbanner:{rw:1600,rh:200,mb:5,label:'중간 배너'}};
const SAMPLE_COL=[['#1a2a4a','#4a92ff','파랑'],['#290247','#a81690','보라'],['#004854','#48d481','초록']];
function sampleImg(slot,n){
  const s=SLOT[slot],c=SAMPLE_COL[n];
  const t=slot==='title'?['펀상사, 오늘도 출근합니다','샘플 이미지 '+(n+1),84,44]:slot==='sigs'?['시그니처','샘플 이미지 '+(n+1),64,26]:slot==='rbanner'?['펀상사 팬카페','샘플 이미지 '+(n+1),32,20]:['펀레이블 시즌1 · 지금 정주행 시작','샘플 이미지 '+(n+1),60,30];
  return IMGOBJ(s.rw,s.rh,c[0],c[1],t[0],t[1],t[2],t[3],'샘플'+(n+1)+'('+c[2]+').svg');
}
function genEvents(){
  const EVT=[['2026.10.05','20:00','정규','시즌1 1화 개업식 · 첫 직급전'],['2026.10.07','20:00','정규','시즌1 2화 사옥 밥전쟁'],['2026.10.12','20:00','정규','시즌1 3화 월요 조회'],['2026.10.14','20:00','직급전','1차 직급전'],['2026.10.16','20:00','정규','시즌1 5화 룰렛 미션'],['2026.10.21','20:00','합방','합방 특집 · 야근 미션'],['2026.10.28','20:00','정규','시즌1 8화 퇴근전쟁'],['2026.10.30','21:00','특집','할로윈 사옥 분장'],
   ['2026.11.02','20:00','직급전','중간 직급전 · 승진 발표'],['2026.11.04','20:00','정규','회식 특집'],['2026.11.06','20:00','정규','시즌1 12화 탕비실 미션'],['2026.11.09','20:00','정규','시즌1 13화 월요 조회'],['2026.11.13','20:00','합방','크루 합방 · 사옥 밥전쟁'],['2026.11.18','20:00','직급전','2차 직급전'],['2026.11.25','20:00','정규','시즌1 17화 룰렛 벌금'],['2026.11.27','21:00','특집','팬 초대 회식 특집'],
   ['2026.12.02','20:00','정규','시즌1 19화 연말 결산 준비'],['2026.12.04','20:00','정규','시즌1 20화 퇴근전쟁'],['2026.12.09','20:00','합방','연말 합방 특집'],['2026.12.14','20:00','직급전','최종 직급전'],['2026.12.18','20:00','정규','시즌1 23화 송년 룰렛'],['2026.12.23','20:00','특집','시즌1 종영 파티'],['2026.12.25','21:00','특집','크리스마스 대표 출근 방송']];
  return EVT.map((e,i)=>({id:'e'+(i+1),date:e[0],start:e[1],end:'',title:e[3],kind:e[2]}));
}
/* ---- 11차: 쪽지 목업 데이터 (초기 상태 생성 시 필요하므로 여기에 둠) ---- */
const MSGU=[['funsangsa','펀상사'],['harukeeper','사옥청소부'],['wolyobyeong','월요병환자'],['gyeoljae_wait','결재대기중'],['kaltoe_fairy','칼퇴요정'],['hoesik_leader','회식팀장'],['tangbisil_owner','탕비실주인'],['bonus_bag','보너스봉투'],['salary_lupin','월급루팡'],['agm_attend','주주총회참석'],['lunch_guard','점심시간지킴이'],['stamp_bang','출근도장쾅'],['rank_oracle','직급전예측왕'],['war_advisor','퇴근전쟁참모'],['saebyeokgyeoljae','새벽결재'],['haru_overtime','야근요정하루'],['tangbisil','탕비실지킴이'],['kaltoe_hope','칼퇴희망'],['copier_down','복사기고장'],['teamlead_smile','팀장님의미소'],['excel_guard','엑셀표지킴이'],['chairman_sec','회장님비서']].map(a=>({id:a[0],n:a[1]}));
const msgUser=id=>MSGU.find(u=>u.id===id)||{id:id,n:id};
function initLdr(){return LIVE_DONORS.map(d=>({n:d.n,id:d.id,a:d.a})).concat([{n:'보너스봉투',id:'bonus_bag',a:18000},{n:'월급루팡',id:'salary_lupin',a:14000},{n:'팀장님의미소',id:'teamlead_smile',a:11000}])}
function initMsg(){
  let k=0;const it=(box,uid,text,t,read)=>({id:'m'+(++k),box:box,peer:msgUser(uid),text:text,t:t,read:read});
  return {seq:100,blocked:['rank_oracle','war_advisor'],items:[
    it('in','wolyobyeong','오늘 직급전 하이라이트 너무 재밌었어요! 다음 회차도 기대할게요.','2026.11.02 22:31',false),
    it('in','gyeoljae_wait','퇴근전쟁 응원 갈게요. 같이 순위표 정리할까요?','2026.11.02 20:10',false),
    it('in','harukeeper','[운영 안내] 11월 게시판 이용 규칙이 일부 바뀌었어요. 공지를 확인해 주세요.','2026.11.02 18:05',false),
    it('in','lunch_guard','처음 쪽지 보내봐요. 방송 잘 보고 있어요!','2026.11.02 09:12',false),
    it('in','hoesik_leader','지난 회식 특집 캡처 보내드려요. 마음에 드시면 쓰셔도 돼요.','2026.11.01 23:12',true),
    it('in','kaltoe_fairy','룰렛 벌금 장면 다시 볼 수 있을까요?','2026.11.01 02:40',true),
    it('in','tangbisil_owner','탕비실 미션 영상 편집본 잘 봤어요. 고생 많으셨어요.','2026.10.31 19:20',true),
    it('in','funsangsa','후원해 주셔서 감사합니다. 방송에서 꼭 읽어드릴게요.','2026.10.30 21:44',true),
    it('in','bonus_bag','팬카페 이벤트 참여하셨나요? 링크는 공지에 있어요.','2026.10.28 16:30',true),
    it('in','copier_down','직급전 응원 글 올려주셔서 감사해요.','2026.10.26 13:02',true),
    it('sent','funsangsa','직급전 결과 알려주세요. 다음 방송 전에 확인하고 싶어요.','2026.11.01 22:05',true),
    it('sent','hoesik_leader','캡처 잘 받았어요. 감사합니다!','2026.11.01 23:30',true),
    it('sent','wolyobyeong','답장 감사해요. 다음 방송에서 봐요.','2026.10.31 20:15',true),
    it('sent','tangbisil','탕비실 미션 기대할게요. 간식 추천도 알려주세요.','2026.10.27 18:44',false),
    it('sent','kaltoe_hope','퇴근전쟁 방송 잘 봤어요. 큰 도움이 됐어요.','2026.10.22 23:50',true),
    it('keep','saebyeokgyeoljae','합방 일정 정리: 11.13 20:00 크루 합방, 11.18 20:00 2차 직급전.','2026.10.29 15:20',true),
    it('keep','haru_overtime','야근 미션 때 쓸 규칙 모음이에요. 미리 읽어봐 주세요.','2026.10.20 11:08',true),
    it('keep','kaltoe_hope','직급표 해설 링크를 남겨요. (더미 링크)','2026.10.12 21:30',true),
    it('blk','rank_oracle','방송에서 제 채팅은 왜 안 읽어주나요? 진짜 별로네요.','2026.11.02 21:02',false),
    it('blk','war_advisor','[광고] 무료 이벤트에 참여하세요. (더미 광고 쪽지)','2026.11.01 04:18',false),
    it('blk','rank_oracle','답장 안 하시네요. 서운합니다.','2026.10.30 22:47',false),
    it('blk','war_advisor','[광고] 같은 내용 다시 보내드려요. (더미 광고 쪽지)','2026.10.29 03:51',false)
  ]};
}
function initStation(){
  return {
    bannerImg:null,
    intro:D.intro,introText:D.introLong.join('\n\n'),rulesText:D.rules.join('\n'),
    links:[{type:'youtube',url:'https://youtube.com/@funsangsa-demo'},{type:'instagram',url:'https://instagram.com/funsangsa.demo'},{type:'tiktok',url:'https://tiktok.com/@funsangsa.demo'},{type:'home',url:'https://cafe.naver.com/funsangsademo'}],
    rightBanners:[],
    midBanners:[],
    seq:100,
    crew:{name:'펀레이블',list:CREW.map(c=>({id:({'펀상사':'funsangsa','새벽결재':'saebyeokgyeoljae','야근요정하루':'haru_overtime','탕비실지킴이':'tangbisil','칼퇴희망':'kaltoe_hope','복사기고장':'copier_down','신입은말해요':'newbie_talk','수습의여왕':'suseup_queen'})[c.n],n:c.n,role:c.role,live:c.live,fav:c.fav,intro:c.intro,lt:c.lt,rank:c.rank}))},
    boardList:[
      {id:'board1',type:'board',name:'기본 게시판 1',desc:'스트리머가 이름을 바꿀 수 있는 기본 게시판이에요',read:'all',write:'all',vip:null},
      {id:'board2',type:'board',name:'기본 게시판 2',desc:'누구나 글을 쓸 수 있는 기본 게시판이에요',read:'all',write:'all',vip:null},
      {id:'board3',type:'board',name:'기본 게시판 3',desc:'이름과 설명은 관리에서 바꿀 수 있어요',read:'all',write:'all',vip:null},
      {id:'div1',type:'divider',label:'등급 전용'},
      {id:'board4',type:'board',name:'기본 게시판 4',desc:'VIP(팬 랭킹 20위 이내) 전용 이야기 공간이에요',read:'vip',write:'vip',vip:'vip'},
      {id:'board5',type:'board',name:'기본 게시판 5',desc:'VVIP(팬 랭킹 10위 이내) 전용 이야기 공간이에요',read:'vip',write:'vip',vip:'vvip'}
    ],
    banwords:{on:true,list:['광고문의','무료충전','도배','홍보링크','바보']},
    managers:[{id:'harukeeper',n:'사옥청소부',since:'2025.02.10',perm:{station:true,chat:true,notice:false}},{id:'wolyobyeong',n:'월요병환자',since:'2024.06.01',perm:{station:false,chat:true,notice:true}}],
    sanctions:[
      {id:'stamp_bang',n:'출근도장쾅',type:'ban',dur:'영구',exp:null,memo:'외부 사이트 광고 글 반복 게시',by:'펀상사',date:'2026.10.12'},
      {id:'rank_oracle',n:'직급전예측왕',type:'chat',dur:'7일',exp:'2026.11.05',memo:'다른 시청자 비방',by:'사옥청소부',date:'2026.10.29'},
      {id:'war_advisor',n:'퇴근전쟁참모',type:'board',dur:'30일',exp:'2026.11.20',memo:'같은 글 반복 게시',by:'월요병환자',date:'2026.10.21'}
    ],
    pinned:{b:'board2',id:'board2-0'},
    schedule:{events:genEvents(),memo:''},
    sigs:SIGS0.map(s=>Object.assign({},s)),
    tierCfg:{vip:20,vvip:10,showRank:true,showAmt:true},
    log:[
      {t:'2026.11.01 23:40',by:'사옥청소부',role:'매니저',grp:'게시판',menu:'금칙어',text:'금칙어 추가: 홍보링크'},
      {t:'2026.10.30 21:05',by:'펀상사',role:'스트리머',grp:'부가',menu:'공지',text:'홈 상단 고정: [공지] 11월 방송 일정 안내'},
      {t:'2026.10.29 22:31',by:'사옥청소부',role:'매니저',grp:'권한',menu:'유저 제재',text:'직급전예측왕 채팅 금지 7일 (다른 시청자 비방)'},
      {t:'2026.10.21 00:12',by:'월요병환자',role:'매니저',grp:'권한',menu:'유저 제재',text:'퇴근전쟁참모 게시판 이용 금지 30일 (같은 글 반복 게시)'},
      {t:'2026.10.12 19:48',by:'펀상사',role:'스트리머',grp:'권한',menu:'유저 제재',text:'출근도장쾅 방송국 차단 영구'},
      {t:'2026.10.01 20:00',by:'펀상사',role:'스트리머',grp:'게시판',menu:'게시판',text:"게시판 설정 변경(구분선 '등급 전용' 추가)"}
    ]
  };
}
function newState(){
  return {live:true,loggedIn:true,myTier:'gold',mode:'viewer',view:'home',favorite:false,favCount:12480,
    alarm:{level:'off',live:true,replay:true,video:false,post:false,crew:false,push:true,email:false},
    overlay:true,station:initStation(),posts:buildPosts(),donations:[],donTotal:0,donCount:0,rankOv:'auto',msg:initMsg(),msgDemo:'',ldr:initLdr(),shell:'station',fn:{view:'fnhome',q:'',tab:'all',cid:null},play:null,viewers:1532,
    admin:{on:false,view:'title',last:'title',prevView:'home',dirty:false,draft:null,touched:new Set(),tried:false,nerr:0,sel:0,pv:'pc',fanTab:'fan',fanQ:'',fanRank:'all',mq:'',mres:null,mpick:null,sq:'',sres:null,spick:null,sfil:'전체',lgf:'전체',lgp:'전체'},
    ui:{rkTab:'don',rkPer:'all',bigPer:'all',bigPage:1,shIdx:0,cal:{y:2026,m:10,sel:'2026.11.06'},sigPrice:'전체',rkSub:'donate',rkN:10,introOpen:false,sigSort:'rec',shSort:'new',rank:'all',vidSort:'new',vidCat:'전체',vidMore:false,sigCat:'전체',repCat:'전체',subSort:'dur',subTier:'전체',crewF:'all',hotQ:'',board:{},mbi:0}};
}
let S=newState();
const TABS=[['home','홈','T-01'],['crew','크루원','T-02'],['signature','시그니처','T-04'],['ranker','랭커','T-05']];
const MENU=[];
const bui=id=>S.ui.board[id]||(S.ui.board[id]={q:'',sort:'new',detail:null});
/* actor & permission */
const actorId=()=>S.mode==='streamer'?'funsangsa':S.mode==='manager'?'harukeeper':'fun_viewer';
const actorName=()=>S.mode==='streamer'?'펀상사':S.mode==='manager'?'사옥청소부':'펀시청자';
const mgr=()=>S.loggedIn&&S.mode==='manager'?S.station.managers.find(m=>m.id==='harukeeper'):null;
const isStreamer=()=>S.loggedIn&&S.mode==='streamer';
const has=p=>isStreamer()||!!(mgr()&&mgr().perm[p]);
const canAdmin=()=>has('station')||has('chat');const canSt=()=>has('station');
const isMgrAny=()=>!!(mgr()&&Object.values(mgr().perm).some(Boolean));
const isFan=()=>S.loggedIn&&(S.myTier!=='none'||S.donTotal>0);
const THR={none:0,dirt:1,gold:100000,dia:500000,black:2000000};
const VIPN={vip:20,vvip:10},VIPL={vip:'VIP',vvip:'VVIP'},VIPD={vip:'VIP (팬랭킹 20위 이내)',vvip:'VVIP (팬랭킹 10위 이내)'};
const tierOK=b=>S.loggedIn&&myRankOK(b.vip);
const curSanction=()=>S.station.sanctions.find(x=>x.id===actorId());
const blocked=kind=>{const s=curSanction();if(!s)return false;return s.type==='ban'||(kind==='board'&&s.type==='board')};
function canRead(b){
  if(isStreamer())return true;
  if(b.read==='private')return has('station');
  if(isMgrAny())return true;
  return b.read==='all'||(b.read==='fan'&&isFan())||(b.read==='vip'&&tierOK(b));
}
function canWrite(b){
  if(!S.loggedIn)return false;if(isStreamer())return true;
  if(blocked('board'))return false;if(b.write==='none')return false;
  if(isMgrAny())return true;
  return b.write==='all'||(b.write==='fan'&&isFan())||(b.write==='vip'&&tierOK(b));
}
const getB=id=>S.station.boardList.find(b=>b.id===id&&b.type==='board')||null;
const isBoardView=v=>!!getB(v);
const bnm=id=>{const b=getB(id);return b?b.name:''};
const isLocked=id=>{const b=getB(id);return !!b&&!canRead(b)};
const KNOWNV=['cnotice','home','crew','videos','signature','ranker','hotfans','subfans','replay','shorts','play','write'];
function ensureView(){
  if(KNOWNV.indexOf(S.view)>=0)return false;
  const b=getB(S.view);
  if(!b){S.view='home';return false}
  if(b.read==='private'&&!canRead(b)){S.view='home';toast('볼 수 없는 게시판이에요');return true}
  return false;
}
/* date helpers */
const DOWN=['일','월','화','수','목','금','토'];
const pad=n=>String(n).padStart(2,'0');
const nowHM=()=>{const d=new Date();return pad(d.getHours())+':'+pad(d.getMinutes())};
function nextShow(sc){
  sc=sc||S.station.schedule;
  const up=(sc.events||[]).filter(e=>e.date>TODAY&&e.date.length===10).sort((a,b)=>a.date===b.date?(a.start<b.start?-1:1):(a.date<b.date?-1:1))[0];
  if(!up)return '미정';
  const d=new Date(+up.date.slice(0,4),+up.date.slice(5,7)-1,+up.date.slice(8,10));
  return pad(d.getMonth()+1)+'.'+pad(d.getDate())+'('+DOWN[d.getDay()]+') '+up.start;
}
const schTxt=sc=>{
  const ev=(sc.events||[]).filter(e=>e.kind==='정규'&&e.date.slice(0,7)===TODAY.slice(0,7));if(!ev.length)return '미정';
  const wd=e=>new Date(+e.date.slice(0,4),+e.date.slice(5,7)-1,+e.date.slice(8,10)).getDay();
  const ds=[1,2,3,4,5,6,0].filter(d=>ev.some(e=>wd(e)===d));
  const cn={};ev.forEach(e=>{cn[e.start]=(cn[e.start]||0)+1});const s0=Object.keys(cn).sort((a,b)=>cn[b]-cn[a])[0];
  const en=(ev.find(e=>e.start===s0)||{}).end;
  return ds.map(d=>DOWN[d]).join('·')+' '+s0+(en?'~'+en:'');
};
const schMemo=()=>S.station.schedule.memo?`<div class="sub" style="color:var(--accent);margin-top:4px">${esc(S.station.schedule.memo)}</div>`:'';
/* banword & log */
const norm=s=>String(s).toLowerCase().replace(/\s+/g,'');
function banHit(){const bw=S.station.banwords;if(!bw.on)return null;const t=norm(Array.prototype.join.call(arguments,' '));return bw.list.find(w=>t.indexOf(norm(w))>=0)||null}
function logAdd(grp,menu,text){S.station.log.unshift({t:TODAY+' '+nowHM(),by:actorName(),role:isStreamer()?'스트리머':'매니저',grp:grp,menu:menu,text:text});if(S.station.log.length>100)S.station.log.length=100}
const liveCount=()=>S.station.crew.list.filter(c=>c.live===1||(c.live===2&&S.live)).length;

/* ---------- layer: toast / modal / popover ---------- */
const layer=$('#layer');
function toast(msg,actLabel,actFn,qa){
  const box=$('#toasts');
  while(box.children.length>=3)box.lastChild.remove();
  const t=document.createElement('div');t.className='toast';if(qa)t.dataset.qa=qa;
  t.innerHTML=`<span>${esc(msg)}</span>`;
  if(actLabel){const b=document.createElement('button');b.textContent=actLabel;b.onclick=()=>{actFn&&actFn();t.remove()};t.appendChild(b)}
  box.insertBefore(t,box.firstChild);
  setTimeout(()=>t.remove(),actLabel?4000:3000);
}
const oos=()=>toast('프로토타입에서는 방송국 페이지만 제공돼요',null,null,'G-07');
const ext=u=>toast('외부 링크로 이동합니다: '+u+' (프로토타입에서는 이동하지 않아요)');
const modals=[];
function openModal(o){
  const opener=document.activeElement;
  const ov=document.createElement('div');ov.className='ov-back';
  if(o.qa)ov.dataset.qa=o.qa;
  ov.innerHTML=`<div class="modal ${o.cls||''}" role="dialog" aria-modal="true" aria-label="${esc(o.title)}"><div class="mh"><h2>${esc(o.title)}</h2><button class="x" data-act="mclose" aria-label="닫기">${ic('x')}</button></div><div class="mb">${o.body}</div>${o.foot?`<div class="mf">${o.foot}</div>`:''}</div>`;
  ov.addEventListener('mousedown',e=>{if(e.target===ov)closeModal(ov)});
  layer.appendChild(ov);
  modals.push({el:ov,opener,onClose:o.onClose});
  const f=$('input:not([readonly]):not([type=checkbox]):not([type=radio]):not([type=hidden]),textarea',ov)||$('.x',ov);
  if(f)f.focus({preventScroll:true});
  if(o.onOpen)o.onOpen(ov);
  return ov;
}
function closeModal(ov){
  const i=modals.findIndex(m=>m.el===ov);if(i<0)return;
  const m=modals.splice(i,1)[0];
  if(m.onClose)m.onClose();
  m.el.remove();
  if(m.opener&&document.body.contains(m.opener)&&m.opener.focus)try{m.opener.focus({preventScroll:true})}catch(e){}
}
function closeAllModals(){while(modals.length)closeModal(modals[modals.length-1].el)}
let pop=null;
function closePop(){if(pop){pop.el.remove();pop=null}}
function openPop(anchor,html,o={}){
  if(pop&&pop.anchor===anchor){closePop();return false}
  closePop();
  const w=o.w||260;
  const el=document.createElement('div');
  if(window.innerWidth<768){
    el.className='ov-back';el.innerHTML=`<div class="modal" role="dialog" aria-modal="true"><div class="mb" style="padding-top:16px">${html}</div></div>`;
    el.addEventListener('mousedown',e=>{if(e.target===el)closePop()});
    layer.appendChild(el);
  }else{
    el.className='pop';el.style.width=w+'px';el.innerHTML=html;layer.appendChild(el);
    const r=anchor.getBoundingClientRect();
    let left=r.left;if(left+w>window.innerWidth-8)left=r.right-w;left=Math.max(8,left);
    let top=r.bottom+8;const h=el.offsetHeight;if(top+h>window.innerHeight-8)top=Math.max(8,r.top-8-h);
    el.style.left=left+'px';el.style.top=top+'px';
  }
  pop={el,anchor};return true;
}
document.addEventListener('mousedown',e=>{if(!e.target||!e.target.closest)return;if(pop&&window.innerWidth>=768&&!pop.el.contains(e.target)&&!(pop.anchor&&pop.anchor.contains(e.target)))closePop();
  if(!e.target.closest('#demo')&&dpOpen){dpOpen=false;renderDemo()}});

/* ---------- login ---------- */
function need(){if(S.loggedIn)return true;openLogin();return false}
/* 펀네이션 공용 로그인 화면(#login, app.js)으로 — 로그인하면 data-auth=in 이 방송국에도 반영됨 */
function goLogin(){closeAllModals();closePop();const b=document.getElementById('login-btn');if(b)b.click();else location.hash='login'}
function openLogin(){
  openModal({title:'로그인이 필요해요',qa:'G-06',body:'<p>즐겨찾기·알림·후원·글쓰기는 로그인 후 이용할 수 있어요.</p>',
    foot:'<button class="btn sec" data-act="mclose">취소</button><button class="btn pri" data-act="loginOk">로그인</button>'});
}

/* ---------- header / sidebar / bnav ---------- */
const sb={collapsed:false,open:false};
function layoutSB(){
  const w=innerWidth,el=$('#gside');let c;
  c=w>=960?'exp':'exp drw'+(sb.open?' open':'');
  el.className='gside '+c;
  $('#sbback').hidden=!(sb.open&&w<960);
}
function renderBnav(){
  const it=[['홈','home'],['라이브','antenna'],['크리에이터','user'],['즐겨찾기','star'],['커뮤니티','users'],['MY','user']];
  $('#bnav').innerHTML=it.map(i=>`<button data-act="oos" class="${i[0]==='크리에이터'?'act':''}">${ic(i[1],22)}${i[0]}</button>`).join('');
}

/* ---------- station: top ---------- */
function alarmLabel(){const l=S.alarm.level;return l==='all'?['bellRing','전체 알림',1]:l==='live'?['bell','알림 켜짐',1]:['bellOff','알림',0]}
/* ---------- nav ---------- */
const isTab=v=>TABS.some(t=>t[0]===v);
function renderNav(){
  const ob=$('#chipbar'),sl=ob?ob.scrollLeft:0;
  $('#tabsw').innerHTML=`<div class="tabs" role="tablist">${tabsNow().map(t=>`<button class="tab" role="tab" aria-selected="${S.view===t[0]}" data-act="tab" data-arg="${t[0]}">${t[1]}</button>`).join('')}</div>`;
  renderSide();
  const nb=$('#chipbar');
  if(nb){nb.scrollLeft=sl;const a=$('.mchip.act',nb);if(a&&a.scrollIntoView)a.scrollIntoView({inline:'nearest',block:'nearest'})}
}
function itemInfo(id){
  if(id==='hotfans')return {name:'랭커',cnt:'20'};
  if(id==='subfans')return {name:'구독팬',cnt:'12'};
  if(id==='replay')return {name:'다시보기',cnt:'8'};
  return {name:bnm(id),cnt:''};
}
/* ---------- views ---------- */
function renderView(){
  const v=S.view;let h='';
  if(v==='home')h=homeView();else if(v==='crew')h=crewView();else if(v==='videos')h=videosView();else if(v==='signature')h=sigView();
  else if(v==='hotfans')h=hotView();else if(v==='subfans')h=subView();else if(v==='replay')h=replayView();
  else h=boardView(v);
  $('#view').innerHTML=h;
  if(v==='home')startOvSoon();
}
/* home */
function playerHTML(){
  if(!S.live){return `<div class="player off"><div class="pl-bg"></div><div class="offc">${ic('moon',48)}<b>지금은 방송 중이 아니에요</b><span>다음 방송 ${nextShow()}</span>${S.alarm.level==='off'?`<button class="btn pri" data-act="alarm">라이브 알림 받기</button>`:`<button class="btn sec" data-act="alarm" style="opacity:.7">알림 받는 중</button>`}</div></div>`}
  return `<div class="player"><div class="pl-bg"></div><button class="pl-play" data-act="plplay" aria-label="재생">${ic('play',28)}</button><span class="pl-tag">YouTube 임베드 영역</span>
   ${S.overlay?`<div class="ov-don" aria-live="polite"></div><div class="ov-goal"><b><span>목표: 퇴근전쟁 100승</span><span>62/100</span></b><i><u></u></i></div><div class="ov-top"><div>오늘 후원 TOP3</div><div><b>1</b>결재대기중</div><div><b>2</b>월요병환자</div><div><b>3</b>회식팀장</div></div>`:''}</div>`;
}
function infoHTML(){
  if(S.live)return `<div class="bdg"><span class="lv">LIVE</span><span>시청 <span class="vwr">${fmt(S.viewers)}</span>명</span></div><h3>${esc(D.live.title)}</h3><div class="sub">${D.live.cat} · ${D.live.since} 시작</div>
   <div class="ldr" data-qa="T-01-rank"><div class="ldr-h">현재 후원자 순위</div><ol>${LIVE_DONORS.slice(0,5).map((d,i)=>`<li class="l${i+1}"><b class="r${i+1}">${i+1}</b><span class="who"><em>${esc(d.n)}</em><small>@${esc(d.id)}</small></span><span class="ldr-amt">${fmt(d.a)}원</span></li>`).join('')}</ol></div>
   <button class="txtbtn" data-act="ovtoggle" aria-pressed="${S.overlay}">${S.overlay?'오버레이 끄기':'오버레이 켜기'}</button>`;
  const r=REPLAYS[0];
  return `<div class="bdg"><span class="ofb">OFFLINE</span></div><h3>지금은 방송 중이 아니에요</h3><div class="sub">다음 방송: ${nextShow()}<br>마지막 방송: ${D.live.last}</div>${schMemo()}
   <button class="vcard" style="margin-top:14px" data-act="replay" data-arg="0">${thumbR(`<span class="bd">다시보기</span><span class="dur">${r.len}</span>`)}<div class="vt">${esc(r.title)}</div><div class="vm">방송일 ${r.date} · 조회 ${fmt(r.views)}</div></button>
   <button class="link" style="margin-top:10px" data-act="nav" data-arg="replay">다시보기 전체 ›</button>`;
}
function vcard(v){return `<button class="vcard" data-act="video" data-arg="${v.id}">${thumb(v.title,v.id,`<span class="dur">${v.len}</span>`)}<div class="vt">${esc(v.title)}</div><div class="vm">조회 ${v.vs} · ${v.date}</div></button>`}
/* ranking */
/* crew */
function crewView(){
  const f=S.ui.crewF;
  let list=CRW().filter(c=>f==='all'||c.live===1||(c.live===2&&S.live));
  const lc=liveCount();
  const cards=list.map(c=>{
    const on=c.live===1||(c.live===2&&S.live),me=c.live===2;
    return `<div class="mc${on?' on':''}"><div class="avl">${on&&!me?`<button data-act="crewGo" data-arg="${c.n}" aria-label="${c.n} 방송국">${av(c.n,72)}</button>`:av(c.n,72)}${on?'<span class="livebdg">LIVE</span>':''}</div>
    <b>${c.n}</b><span class="rl${c.role==='크루장'?' cap':''}">${c.role}</span>${c.rank?`<span class="rl rk">${c.rank}</span>`:''}${me?'<span class="rl here">현재 방송국</span>':''}
    <div class="intro1">${esc(c.intro)}</div><div class="intro1">즐겨찾기 ${fmt(c.fav)}</div>${on&&c.lt?`<div class="lt">${esc(c.lt)}</div>`:on&&me?`<div class="lt">${esc(D.live.title.split(' #')[0])}</div>`:''}
    ${me?'<button class="btn sec sm dis" disabled>보는 중</button>':`<button class="btn sec sm" data-act="crewGo" data-arg="${c.n}">방송국 가기</button>`}</div>`;
  }).join('');
  return `<div data-qa="T-02">
   <div class="s-chips crf"><button class="chip${f==='all'?' act':''}" data-act="crewF" data-arg="all">전체 ${CRW().length}</button><button class="chip${f==='live'?' act':''}" data-act="crewF" data-arg="live">방송 중 ${lc}</button>${isStreamer()?`<button class="chip mine${f==='mine'?' act':''}" data-act="crewF" data-arg="mine" data-qa="CREW-mine">${ic('lock',14)}내가 속한 크루 ${mineList().length}</button>`:''}</div>
   ${list.length?`<div class="mgrid">${cards}</div>`:`<div class="empty">${ic('moon',32)}지금 방송 중인 크루원이 없어요</div>`}</div>`;
}
/* videos */
function videosView(){
  const u=S.ui;let list=VIDEOS.filter(v=>u.vidCat==='전체'||v.cat===u.vidCat);
  list=list.slice().sort((a,b)=>u.vidSort==='new'?(a.date<b.date?1:-1):b.v-a.v);
  const shown=u.vidMore?list:list.slice(0,8);
  const cats=['전체','직급전','퇴근전쟁','룰렛·미션','일상'];
  return `<div data-qa="T-03"><div class="vh"><h2>${u.vidCat==='전체'?'영상 10':'영상 '+list.length}</h2></div>
   <div class="s-chips"><button class="chip${u.vidSort==='new'?' act':''}" data-act="vsort" data-arg="new">최신순</button><button class="chip${u.vidSort==='pop'?' act':''}" data-act="vsort" data-arg="pop">인기순</button><span class="sepv"></span>${cats.map(c=>`<button class="chip${u.vidCat===c?' act':''}" data-act="vcat" data-arg="${c}">${c}</button>`).join('')}</div>
   ${list.length?`<div class="grid">${shown.map(vcard).join('')}</div>${list.length>8&&!u.vidMore?`<button class="more" data-act="vmore">더 보기 (8/${list.length}) +</button>`:''}`:'<div class="empty">이 분류의 영상이 아직 없어요</div>'}</div>`;
}
/* signature */
/* hotfans */
function hotView(){
  const my=hotMy();
  return `<div data-qa="L-01"><div class="vh"><h2>랭커 20</h2><p>누적 후원 상위 20명이에요</p></div>${my}
   <label class="fsearch">${ic('search',16)}<input id="hotq" data-in="hotq" placeholder="닉네임 검색" value="${esc(S.ui.hotQ)}"></label><div id="hotList">${hotList()}</div></div>`;
}
function hotList(){
  const q=S.ui.hotQ.trim();const l=FANS.filter(f=>!q||f.n.indexOf(q)>=0);
  if(!FANS.length)return `<div class="empty">아직 랭커가 없어요. 첫 랭커가 되어 보세요<button class="btn pri" data-act="donate">후원하기</button></div>`;
  if(!l.length)return '<div class="empty">검색 결과가 없어요</div>';
  return l.map(f=>`<button class="hrow" data-act="fan" data-arg="${f.n}"><span class="n">${f.rank}</span>${av(f.n,40)}<span class="nm">${esc(f.n)}${f.title?`<span class="rb ${f.title==='회장'?'':'vp'}">${f.title}</span>`:''}${tg(f.n)}</span><span class="sn">랭커 since ${f.since}</span></button>`).join('');
}
function subView(){
  const u=S.ui;let l=SUBS.filter(s=>u.subTier==='전체'||(u.subTier==='티어2'?s.tier===2:s.tier===1));
  l=l.slice().sort((a,b)=>u.subSort==='dur'?b.mo-a.mo:(a.start<b.start?1:-1));
  return `<div data-qa="L-02"><div class="vh"><h2>구독팬 12</h2></div>
   <div class="cta"><b>펀상사 구독하고 전용 이모티콘 받기</b><button class="btn pri" data-act="subscribe">구독하기</button></div>
   <div class="s-chips"><button class="chip${u.subSort==='dur'?' act':''}" data-act="ssort" data-arg="dur">구독 기간순</button><button class="chip${u.subSort==='rec'?' act':''}" data-act="ssort" data-arg="rec">최근 구독순</button><span class="sepv"></span>${['전체','티어2','티어1'].map(t=>`<button class="chip${u.subTier===t?' act':''}" data-act="stier" data-arg="${t}">${t}</button>`).join('')}</div>
   ${!SUBS.length?'<div class="empty">아직 구독팬이 없어요</div>':l.length?`<div class="sgrid">${l.map(s=>`<button class="sfan" data-act="fan" data-arg="${s.n}">${av(s.n,40)}<span><span class="nm">${esc(s.n)}<span class="tb ${s.tier===2?'tr2':'tr1'}">티어${s.tier}</span></span><small>구독 ${s.mo}개월 · ${s.start}</small></span></button>`).join('')}</div>`:'<div class="empty">해당 티어 구독팬이 없어요</div>'}</div>`;
}
function replayView(){
  const c=S.ui.repCat,cats=['전체','직급전','퇴근전쟁','밥전쟁','합방','특집'];
  const l=REPLAYS.filter(r=>c==='전체'||r.cat===c);
  return `<div data-qa="L-03"><div class="vh"><h2>다시보기 8</h2><p>방송이 끝나면 다시보기로 볼 수 있어요</p></div>
   ${!REPLAYS.length?'<div class="empty">아직 다시보기가 없어요</div>':l.length?`<div class="grid g3">${l.map(r=>`<button class="vcard" data-act="replay" data-arg="${r.id}">${thumbR(`<span class="bd">다시보기</span><span class="dur">${r.len}</span>`)}<div class="vt">${esc(r.title)}</div><div class="vm">방송일 ${r.date} · 조회 ${fmt(r.views)}</div></button>`).join('')}</div>`:'<div class="empty">이 분류의 다시보기가 없어요</div>'}</div>`;
}
/* boards */
const TIERLAD=[['dirt','1원~'],['gold','10만원~'],['dia','50만원~'],['black','200만원~']];
const AMOUNT={none:0,dirt:30000,gold:360000,dia:800000,black:2400000};
const BQA=id=>(BOARDS[id]&&BOARDS[id].qa)||'L-NEW';
const RICON={all:'users',fan:'heart',vip:'crown',manager:'shield',private:'eyeoff'};
function vipBadgeHTML(b,cls){return b.vip==='vvip'?`<span class="${cls||'gbadge'} sv">VVIP</span>`:b.vip==='vip'?`<span class="${cls||'gbadge'}">VIP</span>`:''}
function writeBtn(b){
  if(b.write==='none'&&!isStreamer())return '';
  const ok=canWrite(b);
  return `<button class="btn pri wr sm" ${ok?'':'aria-disabled="true" style="opacity:.5"'} data-act="write" data-arg="${b.id}">글쓰기</button>`;
}
function boardView(id){
  const b=getB(id);if(!b)return '';
  if(!canRead(b))return lockView(b);
  const u=bui(id);
  if(u.detail)return postDetail(id,u.detail);
  const raw=S.posts[id]||[];
  let l=raw.filter(p=>!u.q||p.title.toLowerCase().indexOf(u.q.toLowerCase())>=0||p.author.toLowerCase().indexOf(u.q.toLowerCase())>=0);
  const notices=l.filter(p=>p.notice);
  let rest=l.filter(p=>!p.notice);
  if(u.sort==='pop')rest.sort((a,c)=>c.views-a.views);else if(u.sort==='rec')rest.sort((a,c)=>c.rec-a.rec);
  const is3=id==='board3';
  const badge=b.read==='private'?'<span class="gbadge" style="border-color:var(--text-meta);color:var(--text-meta)">비공개</span>':(b.read==='vip'||b.write==='vip')?vipBadgeHTML(b):'';
  const pen=canSt()?`<button class="pencil" data-act="rename" data-arg="${id}" aria-label="게시판 이름 변경">${ic('pencil',16)}</button>`:'';
  const row=p=>`<div class="brow${p.notice?' notice':''}" role="button" tabindex="0" data-act="post" data-arg="${id}|${p.id}"><span class="c-num">${p.notice?'<span class="nb">공지</span>':p.no}</span>
    <span class="c-tit">${p.notice?'<span class="nb" style="display:none">공지</span>':''}<span class="tt">${esc(p.title)}</span>${p.img?ic('image',14):''}${p.comments?`<em class="cm">[${p.comments}]</em>`:''}${p.isNew?'<i class="nbadge">N</i>':''}${is3?`<span class="recn">${p.link?ic('link',13):''}추천 ${p.rec}</span>`:''}<span class="m-meta">${esc(p.author)} · ${p.date.slice(5)} · 조회 ${fmt(p.views)}</span></span>
    <span class="c-au">${esc(p.author)}</span><span class="c-dt">${p.date.slice(5)}</span><span class="c-vw">${fmt(p.views)}</span></div>`;
  let body;
  if(!raw.length)body=`<div class="empty">아직 올라온 글이 없습니다.${b.write==='none'&&!isStreamer()?'':`<button class="btn pri" data-act="write" data-arg="${id}">첫 글 쓰기</button>`}</div>`;
  else if(!l.length)body=`<div class="empty">'${esc(u.q)}' 검색 결과가 없어요<button class="btn sec" data-act="bclear" data-arg="${id}">검색 초기화</button></div>`;
  else body=`<div class="btab"><div class="brow bhead"><span class="c-num">번호</span><span>제목</span><span class="c-au">작성자</span><span class="c-dt">날짜</span><span class="c-vw">조회</span></div>${notices.map(row).join('')}${rest.map(row).join('')}</div><div class="s-pager"><span>${ic('chevL',16)}</span><span class="cur">1</span><span>${ic('chevR',16)}</span></div>`;
  return `<div data-qa="${BQA(id)}"><div class="bh"><h2>${esc(b.name)}</h2>${badge}${pen}${writeBtn(b)}</div>
   <div class="bdesc">${esc(b.desc)}</div>${id==='board1'?'<div class="bhint">게시판 이름은 스트리머가 바꿀 수 있어요</div>':''}
   <div class="bbar"><label class="fsearch">${ic('search',16)}<input id="bq" data-in="bq" data-arg="${id}" placeholder="제목·작성자 검색" value="${esc(u.q)}"></label>
     <div class="s-chips" style="margin:0"><button class="chip${u.sort==='new'?' act':''}" data-act="bsort" data-arg="${id}|new">최신순</button><button class="chip${u.sort==='pop'?' act':''}" data-act="bsort" data-arg="${id}|pop">인기순</button>${is3?`<button class="chip${u.sort==='rec'?' act':''}" data-act="bsort" data-arg="${id}|rec">추천순</button>`:''}</div></div>${body}</div>`;
}
function postDetail(id,pid){
  const p=(S.posts[id]||[]).find(x=>x.id===pid);if(!p){bui(id).detail=null;return boardView(id)}
  const f=fanOf(p.author);
  const au=p.author==='펀상사'?'<span class="rb">스트리머</span>':p.author==='사옥청소부'?'<span class="rb vp">매니저</span>':tb(f?f.t:'dirt');
  const is3=id==='board3';
  return `<div class="pd" data-qa="${BQA(id)}"><button class="back" data-act="back" data-arg="${id}">${ic('chevL',16)}목록</button>
   <div class="bhint" style="margin-bottom:6px">${esc(bnm(id))}</div><h1>${esc(p.title)}</h1>
   <div class="au">${av(p.author,28)}<b>${esc(p.author)}</b>${au}<span>${p.date}</span><span>조회 ${fmt(p.views)}</span></div>
   <div class="body">${esc(p.body)}</div>
   ${is3&&p.link?`<button class="lkc" data-act="ext" data-arg="${esc(p.link)}"><span class="lk-th">${ic('link',26)}</span><span><small>${esc(p.link.split('/')[0])}</small><b>${esc(p.title)}</b></span></button>`:''}
   <div class="lkacts"><button class="btn out${p.liked?' on':''}" data-act="like" data-arg="${id}|${pid}" aria-pressed="${p.liked}">${ic('heart',16)}좋아요 <span>${p.likes+(p.liked?1:0)}</span></button>
   ${is3?`<button class="btn out${p.recd?' on':''}" data-act="rec" data-arg="${id}|${pid}" aria-pressed="${p.recd}">${ic('thumb',16)}추천 <span>${p.rec+(p.recd?1:0)}</span></button>`:''}</div>
   <div class="cmts"><h3>댓글 <span id="cmtN">${p.comments}</span></h3><small class="hint">최근 댓글 일부만 표시돼요</small><div id="cmtList">${p.cl.map(c=>`<div class="cmt">${av(c.n,32)}<div><b>${esc(c.n)}</b><small>${c.t}</small><p>${esc(c.x)}</p></div></div>`).join('')}</div>
   <div class="cmtf"><textarea id="cmtIn" rows="2" maxlength="200" data-in="cmt" placeholder="댓글을 입력하세요"></textarea><div class="errm" id="cmtErr"></div><div style="display:flex;justify-content:space-between;align-items:center"><span class="cnt" id="cmtCnt">0/200</span><button class="btn pri sm" id="cmtBtn" data-act="cmtAdd" data-arg="${id}|${pid}" disabled>등록</button></div></div></div></div>`;
}
function lockView(b){
  const id=b.id,tier=S.myTier;
  let title,msg,ladder='',prog='',extra='',acts='';
  if(b.read==='fan'){
    title=esc(b.name)+'은(는) 팬 전용이에요';
    msg='이 방송국에 한 번이라도 후원한 팬만 볼 수 있어요';
    acts=`<div class="lacts">${S.loggedIn?'<button class="btn pri" data-act="donate">후원하기</button>':'<button class="btn pri" data-act="login">로그인하고 확인하기</button>'}</div>`;
  }else{
    title=esc(b.name)+'은(는) 매니저 전용이에요';
    msg='방송국 매니저만 볼 수 있는 게시판이에요';
  }
  const titles=(S.posts[id]||[]).slice(0,3).map(p=>`<div>${esc(p.title)}</div>`).join('');
  return `<div data-qa="${BQA(id)}"><div class="lock"><div class="lic">${ic('lock',34)}</div><h2>${title}</h2><p>${msg}</p>${ladder}${prog}${acts}
   <div class="blurl">${titles}<small>글 ${(S.posts[id]||[]).length}개</small></div></div></div>`;
}

/* ---------- modals: content ---------- */
function fanPop(anchor,name){
  const f=fanOf(name),s=SUBS.find(x=>x.n===name);
  const t=f?f.t:'dirt';
  const first=f?f.since+'.02':'2025.10.12';
  const hot=f&&f.rank<=20?`랭커 ${f.rank}위${f.title?' · '+f.title:''}`:'랭커 아님';
  openPop(anchor,`<div class="fanp">${av(name,44)}<span><b>${esc(name)}</b>${tg(name)}</span></div><div class="fanl">이 방송국 첫 후원 ${first}</div><div class="fanl" style="margin-top:4px">${hot}${s?' · 즐겨찾기 '+s.mo+'개월':''}</div>`,{w:260});
}
function setRank(p){const h=$('#rankHome');if(h)h.innerHTML=rankHTML()}
function playerBox(){return `<div class="player"><div class="pl-bg"></div><button class="pl-play" data-act="plplay" aria-label="재생">${ic('play',28)}</button><span class="pl-tag">YouTube 임베드 영역</span></div>`}
function openLockInfo(){}
let writing=false;
/* ---------- donation ---------- */
let don=null,donOv=null;
const PAYS=['신용카드','카카오페이','토스페이','휴대폰'];
function donInit(preset){
  don={step:1,key:null,custom:'',anon:false,msg:'',pay:null,consent:false,done:false,busy:false,sig:null,sq:''};
  if(preset&&typeof preset==='object'){const s=SG().find(x=>x.id===preset.sig);if(s){don.sig=s.id;if(AMTS.indexOf(s.amt)>=0)don.key=s.amt;else{don.key='custom';don.custom=fmt(s.amt)}}}
  else if(preset){if(AMTS.indexOf(preset)>=0)don.key=preset;else{don.key='custom';don.custom=fmt(preset)}}
}
function donAmount(){
  if(don.key==='custom'){
    const d=don.custom.replace(/\D/g,'');if(!d)return {v:0,err:''};
    const n=+d;
    if(n<1000)return {v:0,err:'1,000원 이상 입력해 주세요'};
    if(n>20000000)return {v:0,err:'1회 최대 20,000,000원까지 가능해요'};
    if(n%100&&SIGAMT().indexOf(n)<0)return {v:0,err:'100원 단위로 입력해 주세요'};
    return {v:n,err:''};
  }
  return {v:don.key||0,err:''};
}
function openDonate(preset){
  if(!need())return;
  if(blocked('donate')){toast('운영 정책에 따라 이 방송국에서 후원할 수 없어요');return}
  donInit(preset);
  donOv=openModal({title:'펀상사에게 후원하기',qa:'B-05',cls:'sheet',body:'<div id="donBox"></div>',onClose:()=>{if(don&&don.step===3&&!don.done)finalizeDon();donOv=null}});
  donRender();
  const fa=$('.amt',donOv);if(fa)fa.focus({preventScroll:true});
}
function donRender(){
  const box=$('#donBox',donOv);if(!box)return;
  const a=donAmount();
  if(don.step===1){
    box.innerHTML=`${donTotalBox()}<div style="display:flex;align-items:center;gap:10px">${av(D.name,32)}<b>${D.name}</b></div>
    ${sigPickHTML()}<div class="amts">${AMTS.map(x=>`<button class="amt${don.key===x?' act':''}" data-act="damt" data-arg="${x}">${amtL(x)}</button>`).join('')}<button class="amt${don.key==='custom'?' act':''}" data-act="damt" data-arg="custom">직접 입력</button></div>
    ${don.key==='custom'?`<input class="inp" id="dc" inputmode="numeric" data-in="dcustom" placeholder="1,000원 이상 입력" value="${esc(don.custom)}">`:''}<div class="errm" id="derr">${a.err}</div><div id="dsig"></div>
    <div class="fld"><label class="l">후원 닉네임</label><input class="inp" readonly value="${esc(actorName())}"><label class="ck"><input type="checkbox" data-ch="danon" ${don.anon?'checked':''}>익명으로 후원</label></div>
    <div class="fld"><textarea id="dm" rows="2" maxlength="100" data-in="dmsg" placeholder="스트리머에게 전할 메시지(선택)">${esc(don.msg)}</textarea><div class="cnt" id="dmc">${don.msg.length}/100</div></div>
    <div class="mf" style="margin:16px -20px -20px"><button class="btn pri" id="dnext" data-act="dnext" disabled>다음</button></div>`;
    donUpd();
  }else if(don.step===2){
    box.innerHTML=`${donTotalBox()}<div class="band">이 화면에서는 실제로 결제되지 않아요</div>
    <table class="kv"><tr><th>금액</th><td>${fmt(a.v)}원</td></tr><tr><th>메시지</th><td>${don.msg?esc(don.msg.slice(0,30))+(don.msg.length>30?'…':''):'(없음)'}</td></tr><tr><th>익명 여부</th><td>${don.anon?'익명':esc(actorName())}</td></tr></table>
    <div class="fld"><label class="l">결제 수단</label>${PAYS.map(p=>`<label class="pay"><input type="radio" name="pay" data-ch="dpay" value="${p}" ${don.pay===p?'checked':''}>${p}</label>`).join('')}</div>
    <label class="ck"><input type="checkbox" data-ch="dcons" ${don.consent?'checked':''}>후원 내용 확인</label><div class="errm" id="payhint">${don.pay&&don.consent?'':'결제 수단을 선택하고 내용을 확인해 주세요'}</div>
    <div class="mf" style="margin:16px -20px -20px"><button class="btn sec" data-act="dprev">이전</button><button class="btn pri" id="dpay" data-act="dpay" ${don.pay&&don.consent&&!don.busy?'':'disabled'}>${don.busy?'<span class="spin"></span>':''}결제하기</button></div>`;
  }else{
    const sg=SG().find(s=>s.amt===a.v);
    box.innerHTML=`<div class="s-done" data-qa="DON-done"><div class="ckc">${ic('check',32)}</div><h3 class="done-t">후원이 완료되었습니다.</h3><p class="done-d">후원한 내역은 누적되어 해당 스트리머의 라이브 방송에 입장하시면 일괄 노출됩니다.</p>
    <table class="kv done-kv" data-qa="DON-done-sum"><tr><th>이번 후원</th><td>${fmt(a.v)}원</td></tr>${don.msg?`<tr><th>메시지</th><td>${esc(don.msg.slice(0,30))}${don.msg.length>30?'…':''}</td></tr>`:''}${sg?`<tr><th>시그니처</th><td>${esc(sg.n)}</td></tr>`:''}<tr><th>현재까지 후원한 금액</th><td><b>${fmt(S.donTotal)}원</b> (${S.donCount}회)</td></tr></table></div>
    <div class="mf" style="margin:16px -20px -20px"><button class="btn sec" data-act="dmore" data-qa="DON-more">추가 후원하기</button><button class="btn pri" data-act="mclose" data-qa="DON-ok">확인</button></div>`;
  }
}
function payHint(){const h=$('#payhint',donOv);if(h)h.textContent=don.pay&&don.consent?'':'결제 수단을 선택하고 내용을 확인해 주세요'}
function donUpd(){
  if(!donOv||don.step!==1)return;
  const a=donAmount();
  const e=$('#derr',donOv);if(e)e.textContent=a.err;
  const nx=$('#dnext',donOv);if(nx)nx.disabled=!a.v;
  const sg=a.v&&SG().find(s=>s.amt===a.v);
  const sd=$('#dsig',donOv);if(sd)sd.innerHTML=sg?`<span class="sigchip">시그니처 '${esc(sg.n)}' 리액션이 나와요</span>`:'';
}
function finalizeDon(){
  if(!don||don.done)return;don.done=true;
  const a=donAmount();const sg=SG().find(s=>s.amt===a.v);
  const item={n:don.anon?'익명':esc(actorName()),a:a.v,m:don.msg,s:sg?sg.n:''};
  S.donations.push(item);S.donTotal+=a.v;S.donCount++;ldrBump(actorName(),actorId(),a.v);
  if(S.myTier==='none'){S.myTier='dirt';setTimeout(()=>toast('첫 후원으로 팬이 되었어요'),300);renderStation()}
  donDotUpd();if(S.view==='bigrank'||S.view==='hotfans')renderView();else setRank();
  if(S.live&&S.overlay){ovQ.unshift(item);if(S.view==='home'&&document.querySelector('.ov-don'))ovShow(item);else pendingMine=item}
}
/* ---------- alarm ---------- */
let ad=null;
function alarmHTML(){
  const d=ad,on=d.level==='all',bad=!d.push&&!d.email;
  return `<div id="alarmBox"><div class="ph">알림 설정</div>
   ${[['all','전체 알림','모든 소식을 받아요'],['live','라이브만','방송 시작만 받아요'],['off','끄기','알림을 받지 않아요']].map(r=>`<label class="rd"><input type="radio" name="alv" value="${r[0]}" data-ch="alv" ${d.level===r[0]?'checked':''}><span><b>${r[1]}</b><small>${r[2]}</small></span></label>`).join('')}
   <hr><div class="tgs${on?'':' dis'}">${[['live','라이브 시작'],['replay','다시보기 업로드'],['post','공지·게시글'],['crew','크루 합동 방송']].map(r=>`<label class="tg"><span>${r[1]}</span><input type="checkbox" class="sw" data-ch="atg" data-k="${r[0]}" ${d[r[0]]?'checked':''} ${on?'':'disabled'}></label>`).join('')}</div>
   <hr><div class="chs"><span>수신 채널</span><label><input type="checkbox" data-ch="ach" data-k="push" ${d.push?'checked':''}>앱 푸시</label><label><input type="checkbox" data-ch="ach" data-k="email" ${d.email?'checked':''}>이메일</label></div>
   ${bad?'<div class="err">수신 방법을 1개 이상 선택하세요</div>':''}
   <button class="btn pri block" data-act="alarmSave" ${bad?'disabled':''}>저장</button></div>`;
}
function alarmRefresh(){const b=$('#alarmBox');if(b)b.outerHTML=alarmHTML()}
function openAlarm(anchor){
  if(!need())return;
  if(pop&&pop.anchor===anchor){closePop();return}
  ad=JSON.parse(JSON.stringify(S.alarm));
  openPop(anchor,alarmHTML(),{w:300});
}
function saveAlarm(){
  let lvl=ad.level,msg;
  const any=ad.live||ad.replay||ad.video||ad.post||ad.crew;
  if(lvl==='all'&&!any){lvl='off';msg='선택한 알림이 없어 알림을 껐어요'}
  else msg=lvl==='all'?'전체 알림을 켰어요':lvl==='live'?'라이브 시작 알림만 받아요':'알림을 껐어요';
  ad.level=lvl;S.alarm=ad;closePop();renderTop();if(S.view==='home'&&!S.live)renderView();toast(msg);
}
/* ---------- overlay timers ---------- */
let ovI=0;const ovQ=OVQ.slice();let pendingMine=null;
function ovShow(it){
  $$('.ov-don').forEach(el=>{
    el.innerHTML=`<b>${esc(it.n)}님이 ${fmt(it.a)}원 후원!</b>${it.m?`<span>${esc(it.m)}</span>`:''}${it.s?`<em>시그니처: ${esc(it.s)}</em>`:''}`;
    el.classList.remove('show');void el.offsetWidth;el.classList.add('show');
    clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),4300);
  });
}
function ovTick(){return;if(!S.live||!S.overlay)return;if(!$('.ov-don'))return;const it=ovQ[ovI++%ovQ.length];ovShow(it)}
function startOvSoon(){if(!S.live||!S.overlay)return;setTimeout(()=>{if(!$('.ov-don'))return;if(pendingMine){const m=pendingMine;pendingMine=null;ovShow(m)}else if(!$('.ov-don.show'))ovShow(ovQ[ovI++%ovQ.length])},500)}
setInterval(ovTick,7000);
setInterval(()=>{if(!S.live)return;S.viewers=Math.max(1400,S.viewers+Math.floor(Math.random()*31)-15);$$('.vwr').forEach(e=>e.textContent=fmt(S.viewers))},10000);
/* ---------- demo panel ---------- */
let dpOpen=false;
/* ---------- events ---------- */
let favLock=0,rnReady=0;
const A={
 oos,oosMsg:()=>toast('프로토타입 데모 계정입니다'),
 gsearch:oos,
 sbtoggle(){if(innerWidth>=1240)sb.collapsed=!sb.collapsed;else sb.open=!sb.open;layoutSB()},
 sbdrawer(){sb.open=!sb.open;layoutSB()},
 login(){goLogin()},
 loginOk(){goLogin()},
 mclose(el){const ov=el.closest('.ov-back');if(ov&&ov.parentNode===layer&&modals.some(m=>m.el===ov))closeModal(ov);else closePop()},
 tab(el,arg){if(arg==='crew'&&S.view==='crew'){return}go(arg)},
 nav(el,arg){go(arg)},
 goLive(){go('home');setTimeout(()=>{const p=$('#playerWrap');if(p){const m=MAINS;m.scrollTop=p.getBoundingClientRect().top-m.getBoundingClientRect().top+m.scrollTop-8}},30)},
 intro:openIntro,introEdit:()=>toast('소개 편집은 정식 기획에서 제공돼요'),
 sns:(el,arg)=>ext(arg),snsEdit:()=>toast('SNS 편집은 정식 기획에서 제공돼요'),
 more(el){
  openPop(el,`<button class="mi2" data-act="copyLink">${ic('copy',16)}방송국 링크 복사</button><button class="mi2" data-act="oos">${ic('mail',16)}쪽지 보내기</button><button class="mi2" data-act="report">${ic('flag',16)}신고하기</button>`,{w:200});
 },
 copyLink(){closePop();toast('링크를 복사했어요')},report(){closePop();toast('신고가 접수되었어요')},
 fav(){
  if(!need())return;
  if(Date.now()-favLock<300)return;favLock=Date.now();
  if(!S.favorite){S.favorite=true;S.favCount++;renderTop();renderSide();toast('즐겨찾기에 추가했어요','알림 켜기',()=>{S.alarm.level='live';renderTop();if(S.view==='home'&&!S.live)renderView();toast('라이브 시작 알림만 받아요')})}
  else{
    openModal({title:'즐겨찾기를 해제할까요?',body:'<p>해제해도 알림 설정은 유지돼요</p>',foot:'<button class="btn sec" data-act="mclose">취소</button><button class="btn pri" data-act="favOff">해제</button>'});
  }
 },
 favOff(el){S.favorite=false;S.favCount--;closeModal(el.closest('.ov-back'));renderTop();renderSide();toast('즐겨찾기를 해제했어요')},
 alarm:(el)=>openAlarm(el),
 alarmSave:saveAlarm,
 donate:()=>openDonate(),
 plplay:()=>toast('실제 서비스에서는 유튜브 라이브가 재생돼요'),
 big(){
  openModal({title:D.live.title.split(' #')[0],cls:'wide',body:`${playerHTML()}<h3 style="font-size:18px">${esc(D.live.title)}</h3>`,foot:`<button class="btn pri" data-act="donate">${ic('heart',16)}후원하기</button>`});
  startOvSoon();
 },
 ovtoggle(){S.overlay=!S.overlay;renderView();toast(S.overlay?'오버레이를 켰어요':'오버레이를 껐어요')},
 rankP:(el,a)=>setRank(a),fan:(el,a)=>fanPop(el,a),
 noticeGo(){const n=S.posts.board2.find(p=>p.notice);openPost('board2',n.id)},
 video:(el,a)=>openVideo(+a),replay:(el,a)=>openReplay(+a),hl:()=>toast('해당 구간으로 이동'),share:()=>toast('링크를 복사했어요'),
 crewSched:openCrewSched,
 crewF(el,a){S.ui.crewF=a;renderView()},
 crewGo:(el,a)=>toast(a+' 방송국으로 이동합니다(프로토타입은 단일 방송국)'),
 vsort(el,a){S.ui.vidSort=a;renderView()},vcat(el,a){S.ui.vidCat=a;S.ui.vidMore=false;renderView()},vmore(){S.ui.vidMore=true;renderView()},
 scat(el,a){S.ui.sigCat=a;renderView()},sigOpen:(el,a)=>openSig(+a),sigAdd:()=>toast('시그니처 등록은 정식 기획에서 제공돼요'),
 sigDonate(el,a){closeAllModals();openDonate(+a)},
 ssort(el,a){S.ui.subSort=a;renderView()},stier(el,a){S.ui.subTier=a;renderView()},subscribe:()=>toast('구독 결제는 정식 기획에서 제공돼요'),
 rcat(el,a){S.ui.repCat=a;renderView()},
 post:(el,a)=>{const p=a.split('|');openPost(p[0],p[1])},
 back(el,a){bui(a).detail=null;renderView()},
 bsort(el,a){const p=a.split('|');bui(p[0]).sort=p[1];renderView()},
 bclear(el,a){bui(a).q='';renderView()},
 write:(el,a)=>openWrite(a),attach:()=>toast('이미지 첨부는 준비 중이에요'),wSubmit:(el,a)=>submitWrite(a,el),
 like(el,a){if(!need())return;const p=a.split('|'),x=S.posts[p[0]].find(q=>q.id===p[1]);x.liked=!x.liked;renderView()},
 rec(el,a){if(!need())return;const p=a.split('|'),x=S.posts[p[0]].find(q=>q.id===p[1]);x.recd=!x.recd;renderView()},
 ext:(el,a)=>ext(a),
 cmtAdd(el,a){
  if(!need())return;
  const p=a.split('|'),x=S.posts[p[0]].find(q=>q.id===p[1]),t=$('#cmtIn').value.trim();if(!t)return;
  x.cl.push({n:'펀시청자',t:'방금 전',x:t});x.comments++;renderView();toast('댓글을 등록했어요');
 },
 lockInfo:openLockInfo,
 rename:(el,a)=>openRename(a),
 rnDefault(el){const ov=el.closest('.ov-back'),id=ov.dataset.bid;$('#rn',ov).value=BOARDS[id].name;$('#rd',ov).value=BOARDS[id].desc;rnCheck(ov)},
 rnSave(el,a){
  const ov=el.closest('.ov-back');rnCheck(ov);if(el.disabled)return;
  const n=$('#rn',ov).value.trim(),d=$('#rd',ov).value.trim();
  S.boardNames[a]={name:n,desc:d||BOARDS[a].desc};closeModal(ov);renderNav();renderView();toast("게시판 이름을 '"+n+"'(으)로 바꿨어요");
 },
 damt(el,a){don.key=a==='custom'?'custom':+a;donRender();if(a==='custom'){const i=$('#dc',donOv);if(i)i.focus({preventScroll:true})}},
 dnext(){if(donAmount().v){don.step=2;donRender()}},dprev(){don.step=1;donRender()},
 dpay(el){
  if(don.busy)return;don.busy=true;donRender();
  setTimeout(()=>{if(!donOv)return;don.busy=false;don.step=3;finalizeDon();donRender()},1000);
 },
 dmore(){finalizeDon();const mine=don;donInit();donRender()},
 dtoggle(){dpOpen=!dpOpen;renderDemo()},
 dset(el,a){const p=a.split(':');dset(p[0],p[1])},
 dreset(){S=newState();ovQ.length=0;OVQ.forEach(x=>ovQ.push(x));pendingMine=null;closeAllModals();closePop();dpOpen=true;renderAll();toast('데이터를 초기화했어요')}
};
function openPost(b,pid){
  if(isLocked(b)){go(b);return}
  const p=S.posts[b].find(x=>x.id===pid);if(p)p.views++;
  S.view=b;bui(b).detail=pid;closePop();if(innerWidth<960&&sb.open){sb.open=false;layoutSB()}if(innerWidth<960&&sb.open){sb.open=false;layoutSB()}renderNav();renderView();scrollTabs();
}
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]');if(!el)return;
  const a=el.dataset.act;
  if(a==='tab'&&el.classList.contains('crewlink')){go('crew');return}
  if(A[a]){if(el.tagName==='A')e.preventDefault();A[a](el,el.dataset.arg,e)}
});
document.addEventListener('click',e=>{if(e.target.closest('a[href="#"]'))e.preventDefault()});
document.addEventListener('click',e=>{if(e.target.id==='sbback'){sb.open=false;layoutSB()}});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    if(pop){closePop();return}
    if(modals.length){closeModal(modals[modals.length-1].el);return}
    if(sb.open){sb.open=false;layoutSB();return}
    if(dpOpen){dpOpen=false;renderDemo()}
    return;
  }
  if(e.key==='Enter'||e.key===' '){
    const t=e.target;
    if(t.dataset&&t.dataset.act&&t.tagName!=='BUTTON'&&t.tagName!=='INPUT'&&t.tagName!=='A'&&t.tagName!=='TEXTAREA'){e.preventDefault();t.click();return}
    if(e.key==='Enter'&&t.id==='bq'){const id=t.dataset.arg;bui(id).q=t.value;renderView();return}
    if(e.key==='Enter'&&t.id==='gq'){oos()}
  }
});
const IN={
 hotq(el){S.ui.hotQ=el.value;$('#hotList').innerHTML=hotList()},
 cmt(el){$('#cmtCnt').textContent=el.value.length+'/200';$('#cmtBtn').disabled=!el.value.trim()},
 rn(el){rnCheck(el.closest('.ov-back'))},
 wr(el){const ov=el.closest('.ov-back');const b=$('#wb',ov);$('#wbc',ov).textContent=fmt(b.value.length)+'/1,000'},
 dcustom(el){
  const d=el.value.replace(/\D/g,'').slice(0,8);don.custom=d?fmt(+d):'';el.value=don.custom;donUpd();
 },
 dmsg(el){don.msg=el.value;$('#dmc',donOv).textContent=el.value.length+'/100'}
};
document.addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.in;if(k&&IN[k])IN[k](e.target)});
const CH={
 danon(el){don.anon=el.checked},
 dpay(el){don.pay=el.value;const b=$('#dpay',donOv);if(b)b.disabled=!(don.pay&&don.consent);payHint()},
 dcons(el){don.consent=el.checked;const b=$('#dpay',donOv);if(b)b.disabled=!(don.pay&&don.consent);payHint()},
 alv(el){ad.level=el.value;alarmRefresh()},
 atg(el){ad[el.dataset.k]=el.checked},
 ach(el){ad[el.dataset.k]=el.checked;alarmRefresh()},
 dtier(el){setMyGrade(+el.value);toast('내 등급: '+(S.myGrade?GRADEN[S.myGrade]:'후원 없음'));renderStation()},
 drank(el){const v=el.value;S.rankOv=v==='auto'?'auto':v==='none'?'none':+v;toast('내 팬 랭킹: '+(v==='auto'?'후원 누적 기준':v==='none'?'순위 밖':v+'위'));afterStateChange();renderDemo()}
};
document.addEventListener('change',e=>{const k=e.target.dataset&&e.target.dataset.ch;if(k&&CH[k])CH[k](e.target)});
window.addEventListener('resize',()=>{closePop();if(innerWidth>=960)sb.open=false;layoutSB();renderSide();layoutSB()});
const LTYPE={youtube:['유튜브','youtube','youtube.com|youtu.be'],instagram:['인스타그램','instagram','instagram.com'],facebook:['페이스북','facebook','facebook.com|fb.com'],tiktok:['틱톡','tiktok','tiktok.com'],home:['홈페이지','globe','']};
function snsRow(){
  const ls=S.station.links;
  const b=ls.map(s=>`<button class="snsb" data-act="sns" data-arg="${esc(s.url)}" data-tip="${LTYPE[s.type][0]}" aria-label="${LTYPE[s.type][0]}">${ic(LTYPE[s.type][1],16)}</button>`).join('');
  return b+(canSt()?'<button class="chip edit" data-act="snsEdit">+ 편집</button>':'');
}
function introBody(src,links){
  const paras=String(src.text||'').split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
  const body=paras.length?paras.map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join(''):(src.intro?`<p>${esc(src.intro)}</p>`:'');
  const rules=String(src.rules||'').split('\n').map(s=>s.trim()).filter(Boolean);
  const info=D.info.map((r,i)=>i===0?['방송 시간',schTxt(src.sch||S.station.schedule)]:r);
  const sns=(links||[]).map(s=>`<span class="snsb" data-tip="${LTYPE[s.type][0]}">${ic(LTYPE[s.type][1],16)}</span>`).join('');
  return `${body}<h3>방송 정보</h3><table class="kv">${info.map(r=>`<tr><th>${r[0]}</th><td>${esc(r[1])}</td></tr>`).join('')}</table>${rules.length?`<h3>방송 규칙</h3><table class="kv">${rules.map(r=>`<tr><td>${esc(r)}</td></tr>`).join('')}</table>`:''}${sns?`<div class="s-sns" style="margin-top:14px">${sns}</div>`:''}`;
}
function openIntro(){
  const st=S.station;
  const body=introBody({intro:st.intro,text:st.introText,rules:st.rulesText},st.links).replace(/<span class="snsb" data-tip="([^"]*)">/g,'<button class="snsb" data-act="snsX" data-tip="$1">').replace(/<\/svg><\/span>/g,'</svg></button>');
  const ov=openModal({title:'방송국 소개',qa:'',cls:'mid',body:body,foot:canSt()?'<button class="btn sec" data-act="introEdit">소개 수정</button>':''});
  $$('.snsb[data-act=snsX]',ov).forEach((el,i)=>{el.dataset.act='sns';el.dataset.arg=st.links[i].url});
}
function openSig(i){
  const s=SG().find(x=>x.id===+i);if(!s)return;
  openModal({title:'시그니처 미리보기',body:`<div class="ripple"><i></i><i></i><i></i><b>${esc(s.n)}</b></div><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b style="font-size:16px">${esc(s.n)}</b><span class="sigchip" style="margin:0">${fmt(s.amt)}원</span><span class="rl">${s.cat}</span></div><p style="margin-top:8px">${esc(s.desc)}</p>`,
   foot:`<button class="btn pri" data-act="sigDonate" data-arg="${s.id}">이 금액으로 후원</button>`});
}
function openRename(id){
  const cur=getB(id);if(!cur||!canSt())return;
  const ov=openModal({title:'게시판 이름 변경',body:`<div class="fld"><label class="l" for="rn">게시판 이름</label><input class="inp" id="rn" maxlength="10" value="${esc(cur.name)}" data-in="rn"><div class="cnt" id="rnc">${cur.name.length}/10</div><div class="errm" id="rne"></div></div>
   <div class="fld"><label class="l" for="rd">설명</label><input class="inp" id="rd" maxlength="40" value="${esc(cur.desc)}" data-in="rn"><div class="cnt" id="rdc">${cur.desc.length}/40</div></div>
   <button class="link" data-act="rnDefault" style="margin-top:8px">기본값으로</button>`,
   foot:`<button class="btn sec" data-act="mclose">취소</button><button class="btn pri" id="rnSave" data-act="rnSave" data-arg="${id}" disabled>저장</button>`});
  ov.dataset.bid=id;
}
function rnCheck(ov){
  const id=ov.dataset.bid,cur=getB(id),n=$('#rn',ov).value.trim(),d=$('#rd',ov).value.trim();
  $('#rnc',ov).textContent=$('#rn',ov).value.length+'/10';$('#rdc',ov).textContent=$('#rd',ov).value.length+'/40';
  let err='';
  if(!n)err='게시판 이름을 입력해 주세요';
  else if(S.station.boardList.some(x=>x.type==='board'&&x.id!==id&&x.name===n))err='이미 사용 중인 게시판 이름이에요';
  $('#rne',ov).textContent=err;
  $('#rnSave',ov).disabled=!!err||(n===cur.name&&d===cur.desc);
}
function writeDeny(b){
  const s=curSanction();
  if(blocked('board')){toast('운영 정책에 따라 글을 쓸 수 없어요 (만료 '+(s&&s.exp?s.exp:'영구')+')');return}
  if(b.write==='fan')toast('팬만 글을 쓸 수 있는 게시판이에요');
  else if(b.write==='vip')toast('팬 랭킹 '+VIPN[b.vip||'vip']+'위 이내('+(VIPL[b.vip]||'VIP')+')만 글을 쓸 수 있어요');
  else if(b.write==='manager')toast('매니저만 글을 쓸 수 있어요');
  else toast('스트리머만 글을 쓸 수 있는 게시판이에요');
}
function openWrite(id){
  if(!need())return;
  const b=getB(id);if(!b)return;
  if(!canWrite(b)){writeDeny(b);return}
  const is3=id==='board3';
  const ov=openModal({title:'글쓰기 · '+b.name,cls:'sheet',body:`<div class="fld"><label class="l" for="wt">제목</label><input class="inp" id="wt" maxlength="40" data-in="wr" placeholder="제목을 입력하세요"><div class="errm" id="wte"></div></div>
   <div class="fld"><label class="l" for="wb">내용</label><textarea id="wb" rows="6" maxlength="1000" data-in="wr" placeholder="내용을 입력하세요"></textarea><div class="cnt" id="wbc">0/1,000</div><div class="errm" id="wbe"></div></div>
   ${is3?`<div class="fld"><label class="l" for="wl">링크 URL (선택)</label><input class="inp" id="wl" placeholder="https://" data-in="wr"><div class="errm" id="wle"></div></div>`:''}
   <button class="btn sec sm" data-act="attach">${ic('image',14)}이미지 첨부</button>`,
   foot:`<button class="btn sec" data-act="mclose">취소</button><button class="btn pri" data-act="wSubmit" data-arg="${id}">등록</button>`});
  ov.dataset.bid=id;
}
function submitWrite(id,btn){
  const ov=btn.closest('.ov-back');if(writing)return;
  const t=$('#wt',ov).value.trim(),b=$('#wb',ov).value.trim(),l=$('#wl',ov)?$('#wl',ov).value.trim():'';
  let ok=true;
  $('#wte',ov).textContent=t?'':(ok=false,'제목을 입력해 주세요');
  $('#wbe',ov).textContent=b?'':(ok=false,'내용을 입력해 주세요');
  if($('#wl',ov)){$('#wle',ov).textContent='';if(l&&!/^https?:\/\//i.test(l)){$('#wle',ov).textContent='올바른 링크를 입력해 주세요';ok=false}}
  if(!ok)return;
  const hit=banHit(t,b,l);
  if(hit){const msg="금칙어가 포함되어 있어요: '"+hit+"'";
    const f=banHit(t)?'#wte':banHit(b)?'#wbe':'#wle';$(f,ov).textContent=msg;toast('금칙어가 포함되어 등록할 수 없어요');return}
  const bd=getB(id);if(!bd||!canWrite(bd)){writeDeny(bd||{write:'none'});return}
  writing=true;
  const list=S.posts[id];const max=list.reduce((m,p)=>Math.max(m,p.no),0);
  const p={id:id+'-n'+Date.now(),title:t,author:actorName(),date:TODAY,views:0,comments:0,notice:false,img:false,isNew:true,no:max+1,likes:0,liked:false,rec:0,recd:false,link:l.replace(/^https?:\/\//i,''),body:b,cl:[]};
  const ni=list.filter(x=>x.notice).length;list.splice(ni,0,p);
  closeModal(ov);writing=false;
  bui(id).q='';bui(id).sort='new';bui(id).detail=null;renderNav();renderView();toast('글을 등록했어요');
}

function renderBanner(){
  const b=$('.banner'),im=S.station.bannerImg;
  if(im){b.style.background="center/cover no-repeat url('"+im.data+"')";b.firstElementChild.style.display='none';b.classList.add('img')}
  else{b.style.background='';b.firstElementChild.style.display='';b.classList.remove('img')}
}
function renderRban(){
  const el=$('#rban'),cols=$('#cols');if(!el||!cols)return;
  const list=S.station.rightBanners.filter(b=>b.on);
  if(!list.length){el.hidden=true;el.innerHTML='';cols.classList.remove('hasr');return}
  el.hidden=false;cols.classList.add('hasr');el.dataset.qa='M-07v';
  el.innerHTML=list.map(b=>b.link?`<button class="rbi" data-act="ext" data-arg="${esc(b.link)}" aria-label="${esc(b.alt||'배너')}"><img src="${b.img.data}" alt="${esc(b.alt||'')}"></button>`:`<div class="rbi"><img src="${b.img.data}" alt="${esc(b.alt||'')}"></div>`).join('');
}
function midBannerHTML(){
  const list=S.station.midBanners.filter(b=>b.on);if(!list.length)return '';
  const n=list.length;let i=S.ui.mbi%n;
  return `<div class="sect mban" data-qa="M-08v" data-n="${n}"><div class="mb-view"><div class="mb-track" style="transform:translateX(-${i*100}%)">${list.map(b=>`<div class="mb-slide">${b.link?`<button data-act="ext" data-arg="${esc(b.link)}" aria-label="${esc(b.alt||'배너')}"><img src="${b.img.data}" alt="${esc(b.alt||'')}"></button>`:`<img src="${b.img.data}" alt="${esc(b.alt||'')}">`}</div>`).join('')}</div></div>${n>1?`<div class="mb-dots">${list.map((b,k)=>`<button class="${k===i?'on':''}" data-act="mbDot" data-arg="${k}" aria-label="배너 ${k+1}"></button>`).join('')}</div>`:''}</div>`;
}
function mbGo(i){
  const m=$('.mban');if(!m||!m.dataset.n)return;const n=+m.dataset.n;i=((i%n)+n)%n;S.ui.mbi=i;
  $('.mb-track',m).style.transform='translateX(-'+i*100+'%)';$$('.mb-dots button',m).forEach((b,k)=>b.classList.toggle('on',k===i));
}
let mbHold=false;
document.addEventListener('mouseover',e=>{if(e.target.closest&&e.target.closest('.mban'))mbHold=true});
document.addEventListener('mouseout',e=>{if(e.target.closest&&e.target.closest('.mban'))mbHold=false});
document.addEventListener('focusin',e=>{if(e.target.closest&&e.target.closest('.mban'))mbHold=true});
document.addEventListener('focusout',e=>{if(e.target.closest&&e.target.closest('.mban'))mbHold=false});
setInterval(()=>{const m=$('.mban');if(!m||+m.dataset.n<2||m.matches(':hover')||m.contains(document.activeElement)||S.admin.on)return;if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)return;mbGo(S.ui.mbi+1)},5000);
function pinnedPost(){const p=S.station.pinned;if(!p)return null;const b=getB(p.b);if(!b||!canRead(b))return null;const x=(S.posts[p.b]||[]).find(q=>q.id===p.id);return x?{b:p.b,p:x}:null}
function recentPosts(){
  const all=[];
  S.station.boardList.forEach(b=>{if(b.type!=='board'||b.read!=='all'||!canRead(b))return;(S.posts[b.id]||[]).forEach(p=>{if(!p.notice)all.push([b.id,p])})});
  all.sort((a,b)=>a[1].date<b[1].date?1:a[1].date>b[1].date?-1:b[1].no-a[1].no);
  return all.slice(0,3);
}
function sigView(){
  const c=S.ui.sigCat,cats=['전체','리액션','노래','미션'];
  const list=SG().filter(s=>c==='전체'||s.cat===c);
  return `<div data-qa="T-04"><div class="sigbn">아래 금액으로 후원하면 펀상사의 시그니처 리액션이 방송에 나와요</div>
   <div class="s-chips">${cats.map(x=>`<button class="chip${c===x?' act':''}" data-act="scat" data-arg="${x}">${x}</button>`).join('')}</div>
   ${list.length||canSt()?`<div class="sgrid4">${list.map(s=>`<button class="sgc" data-act="sigOpen" data-arg="${s.id}"><div class="sq" style="background:linear-gradient(135deg,hsl(${(s.id*47+205)%360} 45% 30%),hsl(${(s.id*47+245)%360} 40% 20%))">${esc(s.n[0]||'?')}<span class="amt">${fmt(s.amt)}원</span>${s.hot?'<span class="hot">HOT</span>':''}</div><b>${esc(s.n)}</b><small>${esc(s.desc)}</small></button>`).join('')}${canSt()?`<button class="sgc add" data-act="sigAdd"><div class="sq">${ic('plus',28)}+ 시그니처 추가</div></button>`:''}</div>`:'<div class="empty">등록된 시그니처가 없어요</div>'}</div>`;
}
function modeBadge(){return S.mode==='streamer'?'<span class="modebdg">스트리머 보기</span>':S.mode==='manager'?'<span class="modebdg">매니저 보기</span>':''}
function renderTop(){
  const al=alarmLabel(),st=S.station,sn=curSanction();
  let strip='';
  if(sn&&S.mode==='viewer'&&sn.type==='ban')strip='이 방송국에서 이용이 제한된 상태예요 (만료 '+(sn.exp||'영구')+')';
  else if(sn&&S.mode==='viewer'&&sn.type==='chat')strip='채팅이 제한된 상태예요 (만료 '+(sn.exp||'영구')+')';
  $('#restrict').innerHTML=strip?`<div class="restrict">${esc(strip)}</div>`:'';
  $('#top').innerHTML=`
   <div class="avw"><div class="avring">${av(D.name,90)}</div>${S.live?'<span class="livebdg">LIVE</span>':''}</div>
   <div class="pi"><h1>${D.name}${modeBadge()}</h1></div>
   <div class="btns">
     <button class="btn out msgb" id="msgBtn" data-act="msgBtn" data-qa="MSG-01" aria-label="${S.loggedIn&&unreadN()>0?'쪽지, 안 읽은 쪽지 '+unreadN()+'개':'쪽지'}">${ic('mail',18)}쪽지${msgBadgeHTML()}</button>
     <button class="btn pri" id="donBtn" data-act="donate" data-qa="B-05">${ic('heart',18)}후원하기${donDotHTML()}</button>
     <button class="btn out fav${S.favorite?' on':''}" data-act="fav" data-qa="B-04" aria-pressed="${S.favorite}">${S.favorite?`<svg class="ic" width="18" height="18" viewBox="0 0 24 24" fill="#f7df4e" stroke="#f7df4e" stroke-width="1.8" stroke-linejoin="round">${P.star}</svg>즐겨찾기 중`:ic('star',18)+'즐겨찾기'}</button>
     <button class="btn out${al[2]?' on':''}" data-act="alarm" data-qa="B-03">${ic(al[0],18)}${al[1]}</button>
     <button class="btn circ" data-act="more" aria-label="더보기">${ic('more',20)}</button>
   </div>
   <div class="intro${st.intro?'':' empty'}" data-qa="B-01">${st.intro?`<span class="t">${esc(st.intro)}</span> `:'<span class="t">아직 방송국 소개가 없어요</span> '}<button class="link" data-act="introT" aria-expanded="${!!S.ui.introOpen}" data-qa="B-01t">${S.ui.introOpen?'접기 ▴':'소개 더보기 ›'}</button>${S.ui.introOpen?`<div class="intro-full" data-qa="B-01x">${introBody({intro:st.intro,text:st.introText,rules:st.rulesText},st.links)}${canSt()?'<button class="btn sec sm" data-act="introEdit">소개 수정</button>':''}</div>`:''}</div>
   ${st.links.length||canSt()?`<div class="s-sns" data-qa="B-06">${snsRow()}</div>`:''}`;
}
function hasNew(id){return !!S.posts[id]&&!isLocked(id)&&S.posts[id].some(p=>p.isNew)}
function panelHTML(){
  const mi=(id,name,icn,qa,rt,cls,pen)=>`<div class="mi${S.view===id?' act':''}${cls||''}" role="button" tabindex="0" data-act="nav" data-arg="${id}" data-qa-nav="${qa}" title="${esc(name)}">${ic(icn,20)}<span class="nm">${esc(name)}</span>${pen||''}<span class="rt">${rt||''}</span></div>`;
  let h='<div class="pg">팬</div>'+mi('hotfans','랭커','user','L-01','20')+mi('subfans','구독팬','heart','L-02','12')+'<hr><div class="pg">콘텐츠</div>'+mi('replay','다시보기','video','L-03','8')+'<hr><div class="pg">게시판</div>';
  S.station.boardList.forEach(b=>{
    if(b.type==='divider'){h+='<hr>'+(b.label?`<div class="pg">${esc(b.label)}</div>`:'');return}
    if(b.read==='private'&&!canRead(b))return;
    const lk=!canRead(b);let rt='';
    if(lk)rt=ic('lock',14);else if(b.read==='private')rt='<span class="rb vp">비공개</span>';else if(b.read==='vip')rt=vipBadgeHTML(b,'rb');else if(hasNew(b.id))rt='<span class="nbd">N</span>';
    const pen=canSt()?`<span class="pen" data-act="rename" data-arg="${b.id}" role="button" tabindex="0" aria-label="게시판 이름 변경">${ic('pencil',14)}</span>`:'';
    h+=mi(b.id,b.name,RICON[b.read],BQA(b.id),rt,lk?' lk':'',pen);
  });
  return h;
}
function renderSide(){
  const el=$('#gside');
  if(S.admin.on&&canAdmin()){el.innerHTML=admSideHTML();return}
  if(S.shell==='fn'){el.innerHTML=fnSideHTML();return}
  el.innerHTML=`<div class="lnbtop"><div class="lt-pf">${av(D.name,40)}<span class="lbl"><b>${D.name}</b>${S.live?'<span class="lv">LIVE</span>':'<span class="ofb">OFFLINE</span>'}</span></div><button class="lbtn" data-act="oos" title="펀네이션 홈으로">${ic('chevL',14)}<span class="lbl">펀네이션 홈으로</span></button></div>${!S.loggedIn&&innerWidth<768?'<button class="loginbtn" style="width:100%;margin-bottom:10px" data-act="login">로그인</button>':''}<hr>${canAdmin()?`<button class="admbtn" data-qa="M-01" data-act="admEnter" title="방송국 관리">${ic('settings',18)}<span class="lbl">방송국 관리</span><span class="lbl chev">›</span></button>`:''}${panelHTML()}`;
}
function renderHeader(){
  const nm=actorName(),role=S.mode==='streamer'?'스트리머':S.mode==='manager'?'매니저':'';
  const login=S.loggedIn?`<button class="me" data-act="oosMsg" aria-label="내 계정">${av(nm,32)}<span>${nm}</span>${role?`<span class="mrole">${role}</span>`:''}${ic('chevD',16)}</button>`:`<button class="loginbtn" data-act="login">로그인</button>`;
  const ab=S.admin.on?'<span class="admbdg">관리 모드</span>':'';
  $('#hdr').innerHTML=`
   <div class="hl"><button class="ib pc-only menubtn" data-act="sbdrawer" aria-label="메뉴 열기">${ic('menu',22)}</button>
     <button class="ib mo-only" data-act="gsearchM" aria-label="검색" style="background:none">${ic('search',22)}</button>
     <a href="#" class="s-logo pc-only" data-act="oos" aria-label="FUNNATION">${ic('crown',24)}<span class="lgp">FUNNATION</span></a><span class="pc-only">${ab}</span></div>
   <div class="srch pc-only" id="gsrch"><input type="text" id="gq" placeholder="채널, 라이브, 동영상 검색" aria-label="검색" autocomplete="off" data-in="gq"><button data-act="gsearch" aria-label="검색">${ic('search',18)}</button></div>
   <div class="mo-only" style="justify-content:center;align-items:center;gap:6px"><a href="#" class="s-logo" data-act="oos"><span class="lgm">FUN</span></a>${ab}</div>
   <div class="hr"><button class="ib" data-act="oos" aria-label="언어">${ic('globe',22)}</button><span class="pc-only">${login}</span><button class="ib mo-only" data-act="sbdrawer" aria-label="메뉴">${ic('menu',22)}</button></div>`;
}
/* 데모 설정 패널은 삭제(2026-11-13) — 호출부가 많아 빈 함수로 남김. 상태 재현은 URL 해시(mode= · login= · live= …) */
function renderDemo(){}
function dset(k,v){
  if(k==='mode'){
    const run=()=>{S.mode=v;toast(v==='viewer'?'시청자 모드로 전환했어요':v==='manager'?'매니저 모드로 전환했어요(사옥청소부)':'스트리머 모드로 전환했어요');afterStateChange();renderDemo()};
    const a=S.admin;
    if(a.on&&a.dirty&&S.loggedIn&&(v==='streamer'||(v==='manager'&&mgrPermStation())))admGuard(run);else run();
    return;
  }
  if(k==='live'){S.live=v==='1';toast(S.live?'라이브 상태로 전환했어요':'오프라인 상태로 전환했어요')}
  else if(k==='login'){S.loggedIn=v==='1';toast(S.loggedIn?'로그인 상태로 전환했어요':'비로그인 상태로 전환했어요')}
  afterStateChange();renderDemo();
}
const mgrPermStation=()=>{const m=S.station.managers.find(x=>x.id==='harukeeper');return !!(m&&Object.values(m.perm).some(Boolean))};

/* ================= ADMIN (방송국 관리) ================= */
const clone=o=>JSON.parse(JSON.stringify(o));
const RL={all:'전체',fan:'팬',vip:'VIP',manager:'매니저',private:'비공개'};
const rwS=(k,b,M)=>k==='vip'?(VIPL[b.vip]||'VIP'):M[k];
const WL={all:'전체',fan:'팬',vip:'VIP',manager:'매니저',none:'없음'};
const RHELP={all:'누구나 볼 수 있어요',fan:'한 번 이상 후원한 팬만',manager:'매니저와 스트리머만',vip:'선택한 VIP 등급 이상만',private:'스트리머와 방송국 관리 매니저만, 메뉴에도 안 보여요'};
const WHELP={all:'로그인한 누구나 쓸 수 있어요',fan:'한 번 이상 후원한 팬만',manager:'매니저와 스트리머만',vip:'선택한 VIP 등급 이상만',none:'스트리머만 글을 쓸 수 있어요'};
const LV={all:0,fan:1,vip:2,manager:3,private:4,none:4};
const minW=r=>r==='private'?3:LV[r];
const wAllowed=(r,w)=>LV[w]>=minW(r);
const TL={chat:'채팅 금지',board:'게시판 이용 금지',ban:'방송국 차단'};
const AVIEWS=[
 ['title','타이틀 이미지','image','기본설정','M-04'],['intro','방송국 소개','text','기본설정','M-05'],['links','외부 링크','link','기본설정','M-06'],['rbanner','우측 배너','sidebarR','기본설정','M-07'],['mbanner','중간 배너','rect','기본설정','M-08'],
 ['boards','게시판 관리','list','게시판 설정','M-09'],['banwords','금칙어 관리','ban','게시판 설정','M-11'],
 ['fans','팬 리스트','users','권한 관리','M-12'],['managers','매니저 관리','shield','권한 관리','M-13',()=>isStreamer()],['sanctions','유저 제재','userx','권한 관리','M-14',()=>has('chat')],
 ['notices','공지·상단 고정','pin','부가 설정','M-16',()=>has('notice')],['schedule','스케줄','calendar','부가 설정','M-17'],['sigs','시그니처 관리','sparkle','부가 설정','M-18'],['log','관리 활동 로그','history','부가 설정','M-20',()=>canAdmin()]
].map(a=>({id:a[0],label:a[1],ic:a[2],grp:a[3],qa:a[4],ok:a[5]||canSt}));
const AVIEW=id=>AVIEWS.find(v=>v.id===id);
const DESC={title:'방송국 상단에 보이는 이미지예요',intro:'방송국 소개 줄과 소개 모달에 보여요',links:'소개 아래 아이콘으로 보여요',rbanner:'PC 화면 오른쪽에 세로로 보이는 배너예요',mbanner:'홈 탭 중간에 가로로 보이는 배너예요',boards:'게시판을 추가하고 공개·글쓰기 권한과 순서를 정해요',banwords:'금칙어가 들어간 게시글·댓글은 등록되지 않아요',fans:'후원한 팬과 즐겨찾기한 팔로워를 확인해요',managers:'방송국 운영을 도와줄 매니저를 지정하고 권한을 나눠요',sanctions:'아이디를 검색해 제재하고 사유를 메모로 남겨요',notices:'게시판 공지를 관리하고 홈 상단에 고정해요',schedule:'방송 요일과 시간을 정하면 방송국 곳곳에 반영돼요',sigs:'특정 금액 후원 시 나오는 시그니처 리액션을 관리해요',tier:'VIP 게시판 기준 칭호와 후원 랭킹 노출을 정해요',log:'관리 화면에서 한 변경 기록이에요'};
const SLICE={
 title:{get:s=>({img:s.bannerImg}),set:(s,v)=>{s.bannerImg=v.img}},
 intro:{get:s=>({intro:s.intro,text:s.introText,rules:s.rulesText}),set:(s,v)=>{s.intro=v.intro.trim();s.introText=v.text;s.rulesText=v.rules}},
 links:{get:s=>s.links,set:(s,v)=>{s.links=v.map(l=>({type:l.type,url:l.url.trim()}))}},
 rbanner:{get:s=>s.rightBanners,set:(s,v)=>{s.rightBanners=v}},
 mbanner:{get:s=>s.midBanners,set:(s,v)=>{s.midBanners=v}},
 boards:{get:s=>s.boardList,set:(s,v)=>{
  v.forEach(b=>{if(b.type==='board'){b.name=b.name.trim();b.desc=(b.desc||'').trim()}else b.label=(b.label||'').trim()});
  const o=s.boardList.filter(b=>b.type==='board').map(b=>b.id),n=v.filter(b=>b.type==='board').map(b=>b.id);
  n.forEach(id=>{if(!S.posts[id])S.posts[id]=[]});o.forEach(id=>{if(n.indexOf(id)<0)delete S.posts[id]});s.boardList=v}},
 schedule:{get:s=>s.schedule,set:(s,v)=>{s.schedule=v}},
 sigs:{get:s=>s.sigs,set:(s,v)=>{s.sigs=v.map(x=>Object.assign({},x,{n:x.n.trim()}))}},
 tier:{get:s=>s.tierCfg,set:(s,v)=>{s.tierCfg=v}}
};
const LG={title:['기본설정','타이틀 이미지'],intro:['기본설정','방송국 소개'],links:['기본설정','외부 링크'],rbanner:['기본설정','우측 배너'],mbanner:['기본설정','중간 배너'],boards:['게시판','게시판'],schedule:['부가','스케줄'],sigs:['부가','시그니처'],tier:['부가','후원·등급']};
const makeDraft=v=>SLICE[v]?{v:clone(SLICE[v].get(S.station))}:null;
const FORMV=v=>!!SLICE[v];
function setPath(o,p,val){const k=p.split('.');let c=o;for(let i=0;i<k.length-1;i++)c=c[k[i]];c[k[k.length-1]]=val}
function admDirty(){const a=S.admin,sl=SLICE[a.view];if(!sl||!a.draft)return false;return JSON.stringify(sl.get(S.station))!==JSON.stringify(a.draft.v)}
const URLRE=/^https?:\/\/[^\s.]+\.[^\s]+$/;
function domOK(type,url){const d=LTYPE[type][2];if(!d)return true;let h='';try{h=new URL(url).hostname.replace(/^www\./,'')}catch(e){return false}return d.split('|').some(x=>h===x||h.endsWith('.'+x))}
function admErr(v){
  const a=S.admin,d=a.draft&&a.draft.v,e={};if(!d)return e;
  if(v==='intro'){const n=String(d.rules||'').split('\n').map(s=>s.trim()).filter(Boolean).length;if(n>10)e['v.rules']='규칙은 10개까지 쓸 수 있어요'}
  if(v==='links'){const seen={};d.forEach((l,i)=>{const u=l.url.trim();let m='';if(!u)m='링크를 입력해 주세요';else if(!URLRE.test(u))m='http:// 또는 https://로 시작하는 주소를 입력해 주세요';else if(!domOK(l.type,u))m=LTYPE[l.type][0]+' 주소가 아니에요';else if(seen[u])m='이미 등록된 링크예요';if(u)seen[u]=1;if(m)e['v.'+i+'.url']=m})}
  if(v==='rbanner'||v==='mbanner'){d.forEach((b,i)=>{const u=(b.link||'').trim();if(u&&!URLRE.test(u))e['v.'+i+'.link']='http:// 또는 https://로 시작하는 주소를 입력해 주세요'})}
  if(v==='boards'){const names={};d.forEach((b,i)=>{if(b.type!=='board')return;const n=(b.name||'').trim();let m='';if(!n)m='게시판 제목을 입력해 주세요';else if(names[n]!==undefined)m='이미 사용 중인 게시판 이름이에요';if(n)names[n]=i;if(m)e['v.'+i+'.name']=m;if((b.read==='vip'||b.write==='vip')&&!b.vip)e['v.'+i+'.vip']='VIP 등급을 선택해 주세요'})}
  if(v==='schedule'){if(d.start===d.end)e['v.end']='시작과 종료 시간이 같아요'}
  if(v==='sigs'){const seen={};d.forEach((s,i)=>{if(!s.n.trim())e['v.'+i+'.n']='이름을 입력해 주세요';if(!(s.amt>=1000&&s.amt<=1000000))e['v.'+i+'.amt']='1,000~1,000,000원으로 입력해 주세요';else if(seen[s.amt]!==undefined)e['v.'+i+'.amt']='같은 금액의 시그니처가 있어요';seen[s.amt]=i})}
  if(v==='tier'){if(TIERO[d.svip]<TIERO[d.vvip])e['v.svip']='SVIP 기준은 VVIP 기준과 같거나 높아야 해요'}
  return e;
}
/* mode / enter / exit */
function applyAdminMode(){const a=S.admin,fn=S.shell==='fn';$('.st').hidden=a.on||fn;$('#admin').hidden=!a.on;const fv=$('#fnv');if(fv)fv.hidden=a.on||!fn;document.body.classList.toggle('admm',a.on);document.body.classList.toggle('fnshell',fn&&!a.on)}
function admSetView(v){const a=S.admin;a.view=v;a.last=v;a.draft=makeDraft(v);a.touched=new Set();a.tried=false;a.dirty=false;a.nerr=0;a.sel=0;a.mres=null;a.mpick=null;a.merr='';a.sres=null;a.spick=null;a.serr='';a.mq='';a.sq='';a.imgwarn='';a.autoMsg='';a.fanQ='';a.hl=null}
function adminEnter(v){
  if(!canAdmin())return;const a=S.admin;a.prevView=S.view;a.on=true;
  const t=v&&AVIEW(v)&&AVIEW(v).ok()?v:(AVIEW(a.last)&&AVIEW(a.last).ok()?a.last:AVIEWS.find(x=>x.ok()).id);
  admSetView(t);closePop();sb.open=false;applyAdminMode();renderHeader();layoutSB();renderSide();admRender();MAINS.scrollTop=0;
}
function admGo(v,after){
  const a=S.admin;if(v===a.view&&!after)return;
  admGuard(()=>{admSetView(v);closePop();sb.open=false;layoutSB();renderSide();admRender();if(after)after();MAINS.scrollTop=0});
}
function admViewTarget(v){
  if(v==='sigs')return 'signature';
  if(v==='boards'){const b=S.station.boardList.find(x=>x.type==='board'&&canRead(x));return b?b.id:'home'}
  return 'home';
}
function admExit(target){
  const a=S.admin;
  admGuard(()=>{a.on=false;a.dirty=false;a.draft=null;S.view=target||a.prevView||'home';closeAllModals();closePop();sb.open=false;ensureView();applyAdminMode();renderAll();layoutSB()});
}
let guardFn=null;
function admGuard(fn){
  const a=S.admin;if(!a.on||!a.dirty){fn();return}
  guardFn=fn;
  openModal({title:'저장하지 않은 변경사항이 있어요',qa:'M-03g',body:'<p>이동하면 변경한 내용이 사라져요.</p>',foot:'<button class="btn sec" id="gC" data-act="gContinue">계속 편집</button><button class="btn out" data-act="gDiscard">저장하지 않고 이동</button><button class="btn pri" data-act="gSave">저장 후 이동</button>'});
  const c=$('#gC');if(c)c.focus({preventScroll:true});
}
let cfmFn=null,cfmNo=null;
function confirmM(title,body,okLabel,okFn,noFn,danger){
  cfmFn=okFn;cfmNo=noFn||null;
  /* 확인 모달 = 디자인 시스템 Alert(363) — 제목 H6 가운데 · 설명 14/21 Depth 300 · 버튼 50 (취소 BG Cancel · 확인 Primary · 위험 Error) */
  openModal({cls:'alert',title:title,body:'<p>'+body+'</p>',onClose:()=>{},foot:`<button class="btn sec" data-act="cfmNo">취소</button><button class="btn pri${danger!==false?' dng':''}" data-act="cfmOk">${okLabel}</button>`});
}
/* forced exit after permission change */
function afterStateChange(){
  closePop();const a=S.admin;
  if(a.on&&!canAdmin()){a.on=false;a.dirty=false;a.draft=null;applyAdminMode();toast('관리 권한이 없어 방송국으로 돌아왔어요')}
  else if(a.on&&!AVIEW(a.view).ok()){const f=AVIEWS.find(x=>x.ok());a.dirty=false;admSetView(f.id);toast('이 메뉴에 접근할 권한이 없어요')}
  ensureView();renderAll();layoutSB();
}
/* save bar */
function savebarHTML(){return `<div class="savebar" id="savebar" data-qa="M-03"><span class="sbmsg" id="sbmsg"></span><span class="sbbtns"><button class="btn sec" id="sbcancel" data-act="admCancel">취소</button><button class="btn pri" id="sbsave" data-act="admSave">저장</button></span></div>`}
function updSaveBar(){
  const a=S.admin,m=$('#sbmsg');if(!m)return;
  const bad=a.nshown>0;
  m.className='sbmsg'+(bad?' bad':a.dirty?' dirty':'');
  m.textContent=bad?'수정이 필요한 항목 '+a.nshown+'개':a.dirty?'● 저장하지 않은 변경사항이 있어요':'모든 변경사항이 저장됐어요';
  $('#sbcancel').disabled=!a.dirty;$('#sbsave').disabled=!a.dirty||bad;
}
function admTouch(){
  const a=S.admin;if(!a.on||!a.draft)return;const was=a.dirty;a.dirty=admDirty();
  const er=admErr(a.view);a.nerr=Object.keys(er).length;a.nshown=Object.keys(er).filter(p=>a.tried||a.touched.has(p)).length;const root=$('#admin');
  $$('[data-err]',root).forEach(e=>{const p=e.dataset.err,m=er[p];const show=!!m&&(a.tried||a.touched.has(p));e.textContent=show?m:'';const i=$('[data-p="'+p+'"]',root);if(i)i.classList.toggle('bad',show)});
  $$('[data-cnt]',root).forEach(e=>{const i=$('[data-p="'+e.dataset.cnt+'"]',root);if(i)e.textContent=i.value.length+'/'+i.maxLength});
  updSaveBar();if(was!==a.dirty)renderSide();
  if(a.view==='intro')updIntroPrev();if(a.view==='schedule')updSchPrev();
}
function admSave(){
  const a=S.admin;if(a.saveLock||!a.draft)return false;
  a.tried=true;admTouch();
  if(a.nerr>0){const f=$('.bad',$('#admin'));if(f){const m=MAINS;m.scrollTop=f.getBoundingClientRect().top-m.getBoundingClientRect().top+m.scrollTop-160;if(f.focus)f.focus({preventScroll:true})}updSaveBar();return false}
  if(!a.dirty)return true;
  a.saveLock=true;setTimeout(()=>{a.saveLock=false},400);
  const v=a.view,sl=SLICE[v],before=clone(sl.get(S.station));
  sl.set(S.station,clone(a.draft.v));
  admLogSave(v,before);
  a.draft=makeDraft(v);a.tried=false;a.touched=new Set();a.dirty=false;a.nerr=0;
  ensureView();refreshStation();admRender();renderSide();
  toast('저장했어요. 방송국에 바로 반영돼요','방송국에서 보기',()=>admExit(admViewTarget(v)));
  return true;
}
function admLogSave(v,before){
  let t;const g=LG[v];
  if(v==='title')t=S.station.bannerImg?'타이틀 이미지 변경':'타이틀 이미지 삭제';
  else if(v==='links')t='외부 링크 변경('+S.station.links.length+'개)';
  else if(v==='boards'){
    const o=before.filter(b=>b.type==='board').map(b=>b.id),n=S.station.boardList.filter(b=>b.type==='board').map(b=>b.id);
    const add=n.filter(x=>o.indexOf(x)<0).length,rem=o.filter(x=>n.indexOf(x)<0).length;
    const nAll=S.station.boardList.map(b=>b.id),oAll=before.map(b=>b.id);
    const so=oAll.filter(x=>nAll.indexOf(x)>=0).join(','),sn=nAll.filter(x=>oAll.indexOf(x)>=0).join(',');
    t='게시판 설정 변경(추가 '+add+'·삭제 '+rem+(so!==sn?'·순서 변경':'')+')';
  }else t=g[1]+' 변경';
  logAdd(g[0],g[1],t);
}
function refreshStation(){renderBanner();renderTop();renderNav();renderView();renderRban()}
/* admin render */
function admSideHTML(){
  const a=S.admin;
  let h=`<div class="lnbtop"><div class="lt-pf">${av(D.name,40)}<span class="lbl"><b>${D.name}</b><span class="admbdg" style="margin:2px 0 0;display:inline-block">관리 모드</span></span></div><button class="lbtn" data-act="admBack" title="방송국으로 돌아가기">${ic('chevL',14)}<span class="lbl">방송국으로 돌아가기</span></button></div><hr>`;
  let g='';
  AVIEWS.forEach(v=>{if(!v.ok())return;if(v.grp!==g){g=v.grp;h+=`<div class="pg">${g}</div>`}
    h+=`<div class="mi${a.view===v.id?' act':''}" role="button" tabindex="0" data-act="admMenu" data-arg="${v.id}" data-qa-nav="${v.qa}" title="${v.label}">${ic(v.ic,20)}<span class="nm">${v.label}</span><span class="rt">${a.dirty&&a.view===v.id?'<i class="dot"></i>':''}</span></div>`});
  return h;
}
function admRender(){
  const a=S.admin,v=AVIEW(a.view),root=$('#admin');if(!a.on||!root)return;
  root.innerHTML=`<div class="adm-in" data-qa="M-02"><div class="admtop"><button class="btn sec sm" data-act="admBack">${ic('chevL',14)}방송국</button><button class="btn out sm admsel" data-act="sbdrawer">${esc(v.label)} ${ic('chevD',14)}</button></div>
   <div class="crumb">방송국 관리 › ${v.grp} › ${v.label}</div><h1>${v.label}</h1><p class="adesc">${DESC[a.view]}</p>
   <div id="abody" class="adm-view" data-qa="${v.qa}">${ADMBODY[a.view]()}</div>${INST.indexOf(a.view)>=0?'<div class="instbar" data-qa="M-03i"><i class="dot"></i>이 화면의 변경은 바로 저장돼요 · 별도 저장 버튼이 없어요</div>':''}</div>
   <input type="file" id="fileIn" data-ch="fileIn" accept="image/png,image/jpeg,image/gif,image/webp" hidden>`;
  admTouch();
}
function admBodyRefresh(){const b=$('#abody');if(b){b.innerHTML=ADMBODY[S.admin.view]();admTouch()}}
/* form helpers */
const fmtSize=b=>b>=1048576?(b/1048576).toFixed(1)+'MB':Math.max(1,Math.round(b/1024))+'KB';
const errEl=p=>`<div class="errm" data-err="${p}"></div>`;
const finp=(p,val,o)=>{o=o||{};return `<input class="inp" data-p="${p}" data-in="dbind" value="${esc(val)}" ${o.max?`maxlength="${o.max}"`:''} ${o.ph?`placeholder="${o.ph}"`:''} ${o.num?'data-num="1" inputmode="numeric"':''}>`};
const tgl=(p,on,dis)=>`<input type="checkbox" class="sw" data-p="${p}" data-ch="dbind" ${on?'checked':''} ${dis?'disabled':''}>`;
const cntEl=p=>`<span class="cnt" data-cnt="${p}"></span>`;
const IMGNOTE={title:'권장 1920×336px(약 6:1), 최대 5MB, JPG·PNG·GIF·WEBP. PC 높이 168px·모바일 88px에 맞춰 가운데 기준으로 잘려요. 프로토타입에서는 새로고침하면 사라져요.',rbanner:'권장 300×600px(1:2), 최대 3MB. PC 화면(1240px 이상)의 오른쪽에 폭 200px로 보여요.',mbanner:'권장 1600×200px(8:1), 최대 5MB. 홈 탭 중간에 본문 폭에 맞춰 보이고, 모바일에서도 같은 비율로 줄어들어요.'};
const FILEHINT='파일 선택 창이 열리지 않으면 [샘플 이미지 선택]을 사용해 주세요.';
const ADMBODY={};
ADMBODY.title=function(){
  const a=S.admin,d=a.draft.v.img;
  return `<div class="s-card"><div class="s-chips"><button class="chip${a.pv==='pc'?' act':''}" data-act="admPv" data-arg="pc">PC</button><button class="chip${a.pv==='m'?' act':''}" data-act="admPv" data-arg="m">모바일</button></div>
  <div class="tpv${a.pv==='m'?' m':''}" id="tpv" style="${d?`background:center/cover no-repeat url('${d.data}')`:''}">${d?'':'<span>펀상사, 오늘도 출근합니다</span>'}</div>
  <div class="fanl" style="margin-top:8px">${d?`${esc(d.name)} · ${d.w}×${d.h} · ${fmtSize(d.size)}`:'기본 이미지 사용 중'}</div><div class="errm warn" id="imgmsg">${esc(a.imgwarn||'')}</div>
  <div class="arow" style="margin-top:10px"><button class="btn sec" data-act="pickImg" data-arg="title">${ic('image',16)}이미지 추가</button><button class="btn out" data-act="sampleImg" data-arg="title|-1">샘플 이미지 선택</button>${d?'<button class="btn out del" data-act="delImg">이미지 삭제</button>':''}</div>
  <p class="note">${IMGNOTE.title}<br>${FILEHINT}</p></div>`;
};
ADMBODY.intro=function(){
  const d=S.admin.draft.v;
  return `<div class="two"><div class="s-card"><div class="fld"><label class="l">한 줄 소개</label>${finp('v.intro',d.intro,{max:60})}<div class="cnt">${cntEl('v.intro')}</div>${errEl('v.intro')}</div>
  <div class="fld"><label class="l">상세 소개 (빈 줄로 문단을 나눠요)</label><textarea class="inp" rows="8" maxlength="1000" data-p="v.text" data-in="dbind">${esc(d.text)}</textarea><div class="cnt">${cntEl('v.text')}</div></div>
  <div class="fld"><label class="l">방송 규칙 (한 줄에 규칙 1개)</label><textarea class="inp" rows="5" maxlength="300" data-p="v.rules" data-in="dbind">${esc(d.rules)}</textarea><div class="cnt">${cntEl('v.rules')}</div>${errEl('v.rules')}</div></div>
  <div class="s-card"><h3>소개 모달 미리보기</h3><div id="ipv" class="ipv"></div></div></div>`;
};
function updIntroPrev(){const e=$('#ipv');if(!e)return;const d=S.admin.draft.v;e.innerHTML=introBody({intro:d.intro,text:d.text,rules:d.rules},S.station.links)}
ADMBODY.links=function(){
  const d=S.admin.draft.v;
  const rows=d.map((l,i)=>`<div class="lrow"><div class="arow"><select class="inp" style="width:140px" data-p="v.${i}.type" data-ch="dbind">${Object.keys(LTYPE).map(k=>`<option value="${k}" ${l.type===k?'selected':''}>${LTYPE[k][0]}</option>`).join('')}</select>${finp(`v.${i}.url`,l.url,{ph:'https://'})}<button class="btn out xs" data-act="linkUp" data-arg="${i}" ${i===0?'disabled':''} aria-label="위로 이동">▲</button><button class="btn out xs" data-act="linkDn" data-arg="${i}" ${i===d.length-1?'disabled':''} aria-label="아래로 이동">▼</button><button class="btn out xs del" data-act="linkDel" data-arg="${i}" aria-label="삭제">${ic('x',14)}</button></div>${errEl(`v.${i}.url`)}</div>`).join('');
  return `<div class="s-card">${d.length?rows:'<div class="emptyb">등록된 외부 링크가 없어요. 링크를 추가하면 방송국 소개 아래에 아이콘으로 보여요</div>'}
  <div class="arow" style="margin-top:12px"><button class="btn sec" data-act="linkAdd" ${d.length>=10?'disabled':''}>+ 링크 추가</button>${d.length>=10?'<span class="errm" style="margin:0">링크는 10개까지 등록할 수 있어요</span>':''}<span class="fanl">${d.length}/10</span></div></div>`;
};
function bannerBody(kind){
  const a=S.admin,d=a.draft.v,R=kind==='rbanner',max=3;
  const diag=R?`<div class="diag"><i>LNB</i><i class="mid">본문</i><i class="hl">우측 칸</i></div>`:`<div class="diag v"><i>플레이어</i><i>공지</i><i class="hl">중간 배너</i><i>후원 랭킹</i></div>`;
  const cards=d.map((b,i)=>`<div class="bncard"><div class="bnimg ${R?'r':'m'}"><img src="${b.img.data}" alt=""></div><div class="bnf"><div class="fanl">${esc(b.img.name)} · ${b.img.w}×${b.img.h} · ${fmtSize(b.img.size)}</div><div class="arow"><button class="btn sec sm" data-act="pickImg" data-arg="${kind}|${i}">이미지 변경</button></div>
   <label class="l">링크 URL (선택)</label>${finp(`v.${i}.link`,b.link||'',{ph:'https://'})}${errEl(`v.${i}.link`)}
   <label class="l">대체 텍스트 (선택)</label>${finp(`v.${i}.alt`,b.alt||'',{max:30})}
   <div class="arow" style="margin-top:8px"><label class="ck" style="margin:0">${tgl(`v.${i}.on`,b.on)} 노출</label><span class="sp"></span><button class="btn out xs" data-act="bnUp" data-arg="${i}" ${i===0?'disabled':''} aria-label="위로 이동">▲</button><button class="btn out xs" data-act="bnDn" data-arg="${i}" ${i===d.length-1?'disabled':''} aria-label="아래로 이동">▼</button><button class="btn out xs del" data-act="bnDel" data-arg="${i}">삭제</button></div></div></div>`).join('');
  return `<div class="s-card">${diag}<p class="note">${R?'PC(1240px 이상) 방송국 모든 화면 오른쪽에 보여요. 1240px 미만에서는 숨겨져요':'홈 탭의 방송 영역·공지 아래, 후원 랭킹 위에 보여요'}</p></div>
  <div class="s-card" style="margin-top:16px">${d.length?cards:`<div class="emptyb">${R?'등록된 우측 배너가 없어요. 배너가 없으면 시청자 화면에서 우측 칸이 사라져요':'등록된 중간 배너가 없어요. 배너가 없으면 홈 탭에서 이 자리가 사라져요'}</div>`}
  <div class="errm warn" id="imgmsg">${esc(a.imgwarn||'')}</div>
  <div class="arow" style="margin-top:12px"><button class="btn pri" data-act="pickImg" data-arg="${kind}|-1" ${d.length>=max?'disabled':''}>+ 배너 추가</button><button class="btn out" data-act="sampleImg" data-arg="${kind}|-1" ${d.length>=max?'disabled':''}>샘플로 추가</button><span class="fanl">${d.length}/${max}</span></div>
  <p class="note">${IMGNOTE[kind]}<br>${FILEHINT}</p></div>`;
}
ADMBODY.rbanner=()=>bannerBody('rbanner');
ADMBODY.mbanner=()=>bannerBody('mbanner');
/* image pick */
let imgCtx=null;
function pickImg(arg){const p=String(arg).split('|');imgCtx={slot:p[0],idx:p[1]===undefined?-1:+p[1]};const f=$('#fileIn');if(f)f.click()}
function imgMsg(t){const e=$('#imgmsg');if(e){e.textContent=t||'';e.className='errm'}if(t)toast(t)}
function procFile(file){
  const c=imgCtx;if(!c||!file)return;const s=SLOT[c.slot];
  if(!/^image\/(png|jpeg|gif|webp)$/.test(file.type)){imgMsg('JPG, PNG, GIF, WEBP 이미지만 올릴 수 있어요');return}
  if(file.size>s.mb*1048576){imgMsg(s.mb+'MB 이하 이미지만 올릴 수 있어요');return}
  const fr=new FileReader();
  fr.onload=()=>{const im=new Image();im.onload=()=>applyImg(c,{data:fr.result,name:file.name,w:im.naturalWidth,h:im.naturalHeight,size:file.size});im.onerror=()=>imgMsg('이미지를 읽을 수 없어요');im.src=fr.result};
  fr.onerror=()=>imgMsg('이미지를 읽을 수 없어요');fr.readAsDataURL(file);
}
function applyImg(c,obj){
  const a=S.admin;if(!a.on||a.view!==c.slot)return;const s=SLOT[c.slot];
  const w=[];const r=obj.w/obj.h,rr=s.rw/s.rh;
  if(Math.abs(r-rr)/rr>0.15)w.push('권장 비율과 달라 일부가 잘려 보일 수 있어요');
  if(obj.w<s.rw*0.5)w.push('이미지가 작아 흐리게 보일 수 있어요');
  a.imgwarn=w.join(' · ');
  if(c.slot==='title')a.draft.v.img=obj;
  else if(c.idx<0)a.draft.v.push({id:++S.station.seq,img:obj,link:'',alt:'',on:true});
  else a.draft.v[c.idx].img=obj;
  a.touched.add('img');admRender();
}
function openSamples(arg){
  const p=String(arg).split('|');imgCtx={slot:p[0],idx:p[1]===undefined?-1:+p[1]};
  openModal({title:'샘플 이미지 선택',cls:'mid',body:`<div class="smp">${[0,1,2].map(n=>`<button class="smpi" data-act="useSample" data-arg="${n}"><img src="${sampleImg(p[0],n).data}" alt="샘플 ${n+1}"><span>샘플 ${n+1} (${SAMPLE_COL[n][2]})</span></button>`).join('')}</div><p class="note">로컬 파일 대신 쓸 수 있는 샘플 이미지예요.</p>`});
}
/* boards */
ADMBODY.boards=function(){
  const a=S.admin,d=a.draft.v;if(a.sel>=d.length)a.sel=Math.max(0,d.length-1);
  const nb=d.filter(x=>x.type==='board').length,nd=d.filter(x=>x.type==='divider').length;
  let warn=false;d.forEach((b,i)=>{if(b.type==='divider'&&(!d[i+1]||d[i+1].type==='divider'))warn=true});
  return `<div class="two bd"><div class="s-card" style="padding:14px"><div class="arow"><button class="btn sec sm" data-act="bdAdd" ${nb>=20?'disabled title="게시판은 최대 20개까지 만들 수 있어요"':''}>+ 게시판 추가</button><button class="btn sec sm" data-act="bdDiv" ${nd>=5?'disabled title="구분선은 최대 5개예요"':''}>+ 구분선 추가</button><span class="fanl">${nb}/20</span></div>${nb>=20?'<div class="errm">게시판은 최대 20개까지 만들 수 있어요</div>':''}<div id="bdlist" style="margin-top:10px">${bdListHTML()}</div>${warn?'<div class="errm warn">구분선이 연달아 있거나 맨 끝에 있어요</div>':''}</div>
  <div class="s-card" id="bdedit">${bdEditHTML()}</div></div>`;
};
function bdListHTML(){
  const a=S.admin,d=a.draft.v,er=admErr('boards'),nb=d.filter(x=>x.type==='board').length;
  return d.map((b,i)=>{
    const ud=`<span class="sp"></span><button class="btn out xs" data-act="bdUp" data-arg="${i}" ${i===0?'disabled':''} aria-label="위로 이동">▲</button><button class="btn out xs" data-act="bdDn" data-arg="${i}" ${i===d.length-1?'disabled':''} aria-label="아래로 이동">▼</button>`;
    if(b.type==='divider')return `<div class="bdrow dv${i===a.sel?' sel':''}" data-act="bdSel" data-arg="${i}" role="button" tabindex="0"><span class="dl">┄ ${esc(b.label||'구분선')} ┄</span>${ud}<button class="btn out xs del" data-act="bdDel" data-arg="${i}">삭제</button></div>`;
    const bad=er['v.'+i+'.name']||er['v.'+i+'.vip'];
    return `<div class="bdrow${i===a.sel?' sel':''}" data-act="bdSel" data-arg="${i}" role="button" tabindex="0"><span class="grip">${ic('grip',14)}</span>${ic(RICON[b.read],16)}<span class="bn">${esc(b.name||'(제목 없음)')}</span><span class="chip sm">${rwS(b.read,b,RL)}·${rwS(b.write,b,WL)}</span>${bad?'<i class="dot red"></i>':''}${ud}<button class="btn out xs del" data-act="bdDel" data-arg="${i}" ${nb<=1?'disabled title="게시판은 1개 이상 있어야 해요"':''}>삭제</button></div>`;
  }).join('');
}
function bdEditHTML(){
  const a=S.admin,d=a.draft.v,i=a.sel,b=d[i];if(!b)return '';
  if(b.type==='divider')return `<h3>편집: 구분선</h3><div class="fld"><label class="l">라벨 (0~10자, 비우면 선만 보여요)</label>${finp(`v.${i}.label`,b.label||'',{max:10})}<div class="cnt">${cntEl(`v.${i}.label`)}</div></div>`;
  const cnt=(S.posts[b.id]||[]).length,nn=(S.posts[b.id]||[]).filter(p=>p.notice).length;
  const rr=['all','fan','manager','vip','private'].map(k=>`<label class="rd"><input type="radio" name="rd${i}" value="${k}" data-p="v.${i}.read" data-ch="dbind" data-bd="read" ${b.read===k?'checked':''}><span><b>${RL[k]}</b><small>${RHELP[k]}</small></span></label>`).join('');
  const ww=['all','fan','manager','vip','none'].map(k=>{const ok=wAllowed(b.read,k);return `<label class="rd" ${ok?'':'title="공개 범위보다 넓게 설정할 수 없어요" style="opacity:.45"'}><input type="radio" name="wd${i}" value="${k}" data-p="v.${i}.write" data-ch="dbind" ${b.write===k?'checked':''} ${ok?'':'disabled'}><span><b>${WL[k]}</b><small>${WHELP[k]}</small></span></label>`}).join('');
  const tc=S.station.tierCfg;
  return `<h3>편집: ${esc(b.name||'새 게시판')}</h3>
  <div class="fld"><label class="l">게시판 제목*</label>${finp(`v.${i}.name`,b.name,{max:10})}<div class="cnt">${cntEl(`v.${i}.name`)}</div>${errEl(`v.${i}.name`)}</div>
  <div class="fld"><label class="l">설명</label>${finp(`v.${i}.desc`,b.desc||'',{max:40})}<div class="cnt">${cntEl(`v.${i}.desc`)}</div></div>
  <div class="fld"><label class="l">공개 설정</label><div class="rds">${rr}</div></div>
  ${b.read==='vip'||b.write==='vip'?`<div class="fld"><label class="l">VIP 기준</label><select class="inp" data-p="v.${i}.vip" data-ch="dbind"><option value="vip" ${b.vip==='vip'?'selected':''}>${VIPD.vip}</option><option value="vvip" ${b.vip==='vvip'?'selected':''}>${VIPD.vvip}</option></select>${errEl(`v.${i}.vip`)}</div>`:''}
  <div class="fld"><label class="l">글쓰기 권한</label><div class="rds">${ww}</div>${a.autoMsg?`<div class="errm warn" style="margin-top:6px">${esc(a.autoMsg)}</div>`:''}</div>
  <div class="fanl">게시글 ${cnt}개 · 공지 ${nn}개</div>`;
}
/* banwords */
function bwBody(){
  const bw=S.station.banwords;
  return `<div class="s-card"><div class="arow"><b>금칙어 사용</b><span class="sp"></span><label class="ck" style="margin:0"><span id="bwst">${bw.on?'ON':'OFF'}</span><input type="checkbox" class="sw" data-ch="bwOn" ${bw.on?'checked':''}></label></div>
  <p class="note">금칙어가 들어간 게시글·댓글은 등록되지 않아요<br><b>방송국 공통 목록이며 모든 게시판·댓글에 적용돼요</b></p>${bw.on?'':'<p class="errm">필터가 꺼져 있어 적용되지 않아요</p>'}
  <div class="tagbox" style="${bw.on?'':'opacity:.5'}"><div class="tbh">등록된 금칙어 ${bw.list.length}/100</div><div class="s-tags">${bw.list.length?bw.list.map((w,i)=>`<span class="s-tag">${esc(w)}<button data-act="bwDel" data-arg="${i}" aria-label="${esc(w)} 삭제">${ic('x',12)}</button></span>`).join(''):'<span class="emptyt">등록된 금칙어가 없어요</span>'}</div></div>
  <div class="arow" style="margin-top:12px"><input class="inp" id="bwIn" maxlength="100" placeholder="금칙어 입력 (쉼표로 여러 개)" data-in="noop"><button class="btn pri" data-act="bwAdd">입력</button></div><div class="errm" id="bwErr"></div></div>`;
}
ADMBODY.banwords=bwBody;
let lastDel=null;
function bwAddFn(){
  const bw=S.station.banwords,i=$('#bwIn'),er=$('#bwErr');if(!i)return;
  const parts=i.value.split(',').map(s=>s.trim()).filter(Boolean);
  if(!parts.length){er.textContent='금칙어를 입력해 주세요';return}
  if(parts.some(w=>w.length<1||w.length>20)){er.textContent='1~20자로 입력해 주세요';return}
  const add=[],dups=[];
  parts.forEach(w=>{if(bw.list.some(x=>norm(x)===norm(w))||add.some(x=>norm(x)===norm(w)))dups.push(w);else add.push(w)});
  if(!add.length){er.textContent='이미 등록된 금칙어예요: '+dups.join(', ');return}
  if(bw.list.length+add.length>100){er.textContent='금칙어는 100개까지 등록할 수 있어요';return}
  bw.list=add.concat(bw.list);
  logAdd('게시판','금칙어','금칙어 추가: '+add.join(', '));
  toast('금칙어 '+add.length+'개를 추가했어요');
  admBodyRefresh();const n=$('#bwIn');if(n){n.focus({preventScroll:true});const e=$('#bwErr');if(dups.length)e.textContent='이미 등록된 금칙어예요: '+dups.join(', ')}
}
/* fans */
const FOL=[['사옥청소부','2025.01.30',1],['점심시간지킴이','2026.11.01',1],['주주총회참석','2026.10.30',0],['법카요정','2026.10.28',1],['승진기원','2026.10.27',0],['야근전사','2026.10.25',1],['낙수받는이','2026.10.22',1],['믹스커피장인','2026.10.20',0],['인사팀서기','2026.10.18',1],['결산담당','2026.10.15',1],['대리의한숨','2026.10.11',0],['사원증목걸이','2026.10.09',1],['연차쓰는중','2026.10.05',1],['야근메이트','2026.10.02',0],['퇴근길라이브','2026.09.29',1]];
const AMT_ALL=[3420000,2980000,1150000,870000,610000,420000,305000,240000,160000,85000,70000,60000,50000,42000,36000,30000,26000,22000,18000,15000];
const AMT_MON=[310000,280000,260000,210000,190000,170000,150000,120000,95000,70000];
function allUsers(){const u=USERS0.slice();FANS.forEach((f,i)=>{if(!u.some(x=>x.n===f.n))u.push({id:'fan_'+(i+1),n:f.n})});return u}
const uidOf=n=>{const u=allUsers().find(x=>x.n===n);return u?u.id:'fan_x'};
function ubadges(u){
  let h='';const st=S.station;
  if(u.id==='funsangsa')h+='<span class="rb">스트리머</span>';
  if(st.managers.some(m=>m.id===u.id))h+='<span class="rb vp">매니저</span>';
  if(st.sanctions.some(s=>s.id===u.id))h+='<span class="rb" style="border-color:#ff6363;color:#ff6363">제재 중</span>';
  const f=fanOf(u.n);if(f||(u.id==='fun_viewer'&&S.myTier!=='none'))h+='<span class="rb" style="border-color:#57dff7;color:#57dff7">팬</span>';
  if(FOL.some(x=>x[0]===u.n)||u.id==='harukeeper')h+='<span class="rb" style="border-color:var(--text-meta);color:var(--text-meta)">팔로워</span>';
  return h;
}
ADMBODY.fans=function(){
  const a=S.admin;
  return `<div class="s-chips"><button class="chip${a.fanTab==='fan'?' act':''}" data-act="fanTab" data-arg="fan">팬 ${FANS.length}</button><button class="chip${a.fanTab==='fol'?' act':''}" data-act="fanTab" data-arg="fol">팔로워 ${fmt(S.favCount)}</button><button class="chip${a.fanTab==='rank'?' act':''}" data-act="fanTab" data-arg="rank">랭킹</button></div>
  <label class="fsearch">${ic('search',16)}<input id="fanq" data-in="fanq" placeholder="닉네임·아이디 검색" value="${esc(a.fanQ)}"></label><div id="fanlist">${fanListHTML()}</div>`;
};
function fanListHTML(){
  const a=S.admin,q=a.fanQ.trim().toLowerCase();let rows='',note='';
  const match=n=>!q||n.toLowerCase().indexOf(q)>=0||uidOf(n).toLowerCase().indexOf(q)>=0;
  if(a.fanTab==='fan'){
    const l=FANS.filter(f=>match(f.n));
    if(!FANS.length)return '<div class="empty">아직 후원한 팬이 없어요</div>';
    rows=l.map(f=>{const s=SUBS.find(x=>x.n===f.n);return `<div class="trow"><span class="tn">${av(f.n,32)}<span><b>${esc(f.n)}</b><small>@${uidOf(f.n)}</small></span></span>${tg(f.n)}<span class="tm">첫 후원 ${f.since}.02</span><span class="tm">랭커 ${f.rank}위${f.title?' · '+f.title:''}${s?' · 팔로워':''}</span><button class="btn out xs" data-act="fanMenu" data-arg="${esc(f.n)}" aria-label="메뉴">${ic('more',16)}</button></div>`}).join('');
    if(!l.length)return '<div class="empty">검색 결과가 없어요</div>';
  }else if(a.fanTab==='fol'){
    let l=FOL.map(x=>({n:x[0],d:x[1],al:x[2]}));
    if(S.favorite)l.unshift({n:'펀시청자',d:'방금',al:S.alarm.level!=='off'?1:0});
    l=l.filter(x=>match(x.n));note=`<div class="fanl" style="margin-bottom:8px">방송국을 즐겨찾기한 유저예요 · 전체 ${fmt(S.favCount)}명 중 최근 ${l.length}명만 보여요</div>`;
    if(!l.length)return '<div class="empty">검색 결과가 없어요</div>';
    rows=l.map(x=>`<div class="trow"><span class="tn">${av(x.n,32)}<span><b>${esc(x.n)}</b>${ttBadge(x.n,true)}<small>@${x.n==='펀시청자'?'fun_viewer':uidOf(x.n)}</small></span></span><span class="tm">즐겨찾기한 날 ${x.d}</span><span class="tm">알림 ${x.al?'받음':'안 받음'}</span><button class="btn out xs" data-act="fanMenu" data-arg="${esc(x.n)}" aria-label="메뉴">${ic('more',16)}</button></div>`).join('');
  }else{
    const p=a.fanRank,l=rankList(p).filter(f=>match(f.n));
    note=`<div class="s-chips"><button class="chip${p==='all'?' act':''}" data-act="fanRk" data-arg="all">역대</button><button class="chip${p==='month'?' act':''}" data-act="fanRk" data-arg="month">이번 달</button></div>`;
    if(!l.length)return note+'<div class="empty">검색 결과가 없어요</div>';
    rows=l.map(f=>`<div class="trow"><span class="n" style="width:24px;font-weight:700">${rankList(p).indexOf(f)+1}</span><span class="tn">${av(f.n,32)}<span><b>${esc(f.n)}</b><small>@${uidOf(f.n)}</small></span></span>${tg(f.n)}<span class="tm"><b>${fmt(rankAmt(f,p))}원</b></span></div>`).join('');
  }
  return note+`<div class="ttab">${rows}</div>`;
}
/* managers */
const PL={station:'방송국 관리',chat:'채팅 관리',notice:'공지 관리'};
function uRow(u,act){return `<div class="trow"><span class="tn">${av(u.n,32)}<span><b>${esc(u.n)}</b><small>@${u.id}</small></span></span><span class="tbd">${ubadges(u)}</span><span class="sp"></span>${act||''}</div>`}
function userSearch(q){
  q=q.trim();if(!q)return {err:'아이디를 입력해 주세요'};if(q.length<2)return {err:'2자 이상 입력해 주세요'};
  const l=allUsers().filter(u=>u.id.toLowerCase().indexOf(q.toLowerCase())>=0||u.n.toLowerCase().indexOf(q.toLowerCase())>=0).slice(0,5);
  if(!l.length)return {err:"'"+q+"'와 일치하는 유저가 없어요"};return {list:l};
}
ADMBODY.managers=function(){
  const a=S.admin,ms=S.station.managers;
  return `<div class="s-card"><h3>매니저 추가</h3><div class="arow"><input class="inp" id="mq" data-in="mq" placeholder="아이디 또는 닉네임 검색" value="${esc(a.mq)}"><button class="btn sec" data-act="mgrSearch">검색</button></div><div class="errm" id="mqErr">${esc(a.merr||'')}</div><div id="mres">${mresHTML()}</div></div>
  <div class="s-card" style="margin-top:16px"><h3>매니저 목록 ${ms.length}/10</h3>${ms.length?ms.map(m=>`<div class="trow"><span class="tn">${av(m.n,32)}<span><b>${esc(m.n)}</b><small>@${m.id} · 지정 ${m.since}</small></span></span><span class="sp"></span>${Object.keys(PL).map(k=>`<label class="pl">${PL[k]}<input type="checkbox" class="sw" data-ch="mgrPerm" data-id="${m.id}" data-k="${k}" ${m.perm[k]?'checked':''}></label>`).join('')}<button class="btn out xs del" data-act="mgrDel" data-arg="${m.id}">해제</button></div>`).join(''):'<div class="emptyb">지정된 매니저가 없어요. 위에서 아이디를 검색해 추가하세요</div>'}</div>`;
};
function mresHTML(){
  const a=S.admin;if(!a.mres)return '';
  let h=a.mres.map(u=>{
    let act,msg='';
    if(u.id==='funsangsa')msg='본인은 지정할 수 없어요';
    else if(S.station.managers.some(m=>m.id===u.id))msg='이미 매니저예요';
    else if(S.station.sanctions.some(s=>s.id===u.id))msg='제재 중인 유저는 매니저로 지정할 수 없어요';
    act=msg?`<small class="fanl">${msg}</small>`:`<button class="btn sec sm" data-act="mgrPick" data-arg="${u.id}">선택</button>`;
    return uRow(u,act)}).join('');
  if(a.mpick){const u=allUsers().find(x=>x.id===a.mpick.id),p=a.mpick.perm,none=!Object.values(p).some(Boolean);
    h+=`<div class="ppanel"><b>${esc(u.n)}님 권한</b>${Object.keys(PL).map(k=>`<label class="ck"><input type="checkbox" data-ch="mgrNewPerm" data-k="${k}" ${p[k]?'checked':''}>${PL[k]} <small class="fanl">${k==='station'?'방송국 관리 메뉴에 들어올 수 있어요':k==='chat'?'채팅 관리·유저 제재를 할 수 있어요':'게시판 글쓰기에서 공지 등록·상단 고정을 할 수 있어요'}</small></label>`).join('')}${none?'<div class="errm">권한을 1개 이상 선택해 주세요</div>':''}<div class="arow" style="margin-top:8px"><button class="btn pri" data-act="mgrAdd" ${none?'disabled':''}>매니저로 지정</button></div></div>`}
  return h;
}
/* sanctions */
const dateAdd=n=>{const d=new Date(2026,10,5+n);return d.getFullYear()+'.'+pad(d.getMonth()+1)+'.'+pad(d.getDate())};
ADMBODY.sanctions=function(){
  const a=S.admin,ss=S.station.sanctions;
  const f=a.sfil,l=ss.filter(s=>f==='전체'||(f==='채팅'&&s.type==='chat')||(f==='게시판'&&s.type==='board')||(f==='차단'&&s.type==='ban'));
  return `<div class="s-card"><h3>유저 검색</h3><div class="arow"><input class="inp" id="sq" data-in="sq" placeholder="아이디 또는 닉네임 검색" value="${esc(a.sq)}"><button class="btn sec" data-act="sanSearch">검색</button></div><div class="errm" id="sqErr">${esc(a.serr||'')}</div><div id="sres">${sresHTML()}</div></div>
  <div class="s-card" style="margin-top:16px"><h3>제재 목록 ${ss.length}</h3><div class="s-chips">${['전체','채팅','게시판','차단'].map(x=>`<button class="chip${f===x?' act':''}" data-act="sanFil" data-arg="${x}">${x}</button>`).join('')}</div>
  ${!ss.length?'<div class="emptyb">제재 중인 유저가 없어요</div>':!l.length?'<div class="emptyb">해당 유형의 제재가 없어요</div>':l.map(s=>`<div class="trow${a.hl===s.id?' hl':''}" data-sid="${s.id}"><span class="tn">${av(s.n,32)}<span><b>${esc(s.n)}</b><small>@${s.id}</small></span></span><span class="rb" style="border-color:#ff6363;color:#ff6363">${TL[s.type]}</span><span class="tm">${s.exp?'~'+s.exp:'영구'}</span><span class="tm memo" title="${esc(s.memo)}">${esc(s.memo)}</span><span class="tm">${esc(s.by)} · ${s.date}</span><button class="btn out xs del" data-act="sanDel" data-arg="${s.id}">해제</button></div>`).join('')}</div>`;
};
function sresHTML(){
  const a=S.admin;if(!a.sres)return '';
  let h=a.sres.map(u=>{
    let msg='';
    if(u.id==='funsangsa')msg='스트리머는 제재할 수 없어요';
    else if(u.id===actorId())msg='본인은 제재할 수 없어요';
    else if(S.station.managers.some(m=>m.id===u.id))msg='매니저는 먼저 매니저에서 해제한 뒤 제재할 수 있어요';
    else if(S.station.sanctions.some(s=>s.id===u.id))msg='이미 제재 중인 유저예요. 아래 목록에서 확인하세요';
    const act=msg?`<small class="fanl">${msg}</small>`:`<button class="btn sec sm" data-act="sanPick" data-arg="${u.id}">제재</button>`;
    return uRow(u,act)}).join('');
  if(a.spick){const u=allUsers().find(x=>x.id===a.spick.id),p=a.spick;
    h+=`<div class="ppanel"><b>${esc(u.n)}님 제재</b><div class="fld"><label class="l">제재 유형</label><div class="arow">${Object.keys(TL).map(k=>`<label class="ck" style="margin:0"><input type="radio" name="sty" data-ch="sanType" value="${k}" ${p.type===k?'checked':''}>${TL[k]}</label>`).join('')}</div></div>
    <div class="fld"><label class="l">기간</label><div class="arow">${['1일','7일','30일','영구'].map(k=>`<label class="ck" style="margin:0"><input type="radio" name="sdu" data-ch="sanDur" value="${k}" ${p.dur===k?'checked':''}>${k}</label>`).join('')}</div></div>
    <div class="fld"><label class="l">메모(블랙 사유)*</label><textarea class="inp" id="smemo" rows="3" maxlength="100" data-in="smemo" placeholder="제재 사유를 입력하세요. 관리자만 볼 수 있어요">${esc(p.memo)}</textarea><div class="cnt" id="smc">${p.memo.length}/100</div><div class="errm" id="smerr"></div></div>
    <button class="btn pri dng" data-act="sanGo">제재 처리</button></div>`}
  return h;
}
/* notices */
function allNotices(){const o=[];S.station.boardList.forEach(b=>{if(b.type!=='board')return;(S.posts[b.id]||[]).forEach(p=>{if(p.notice)o.push({b:b,p:p})})});return o}
ADMBODY.notices=function(){
  const pin=S.station.pinned,l=allNotices();
  return `<div class="s-card"><div class="arow"><h3 style="margin:0">공지 목록</h3><span class="sp"></span><button class="btn sec sm" data-act="ntWrite">+ 공지 작성</button></div>
  ${l.length?`<div class="ttab"><label class="trow"><input type="radio" name="ntp" data-ch="ntPin" value="" ${!pin?'checked':''}><span class="tm"><b>홈에 고정하지 않음</b></span></label>${l.map(x=>`<div class="trow"><input type="radio" name="ntp" data-ch="ntPin" value="${x.b.id}|${x.p.id}" ${pin&&pin.id===x.p.id?'checked':''} aria-label="홈 고정"><span class="chip sm">${esc(x.b.name)}</span><span class="tm" style="flex:1"><b>${esc(x.p.title)}</b></span><span class="tm">${esc(x.p.author)} · ${x.p.date}</span><button class="btn out xs del" data-act="ntDel" data-arg="${x.b.id}|${x.p.id}">공지 해제</button></div>`).join('')}</div>`:'<div class="emptyb">등록된 공지가 없어요 <button class="btn pri sm" data-act="ntWrite">공지 작성</button></div>'}</div>`;
};
function openNoticeWrite(){
  const bs=S.station.boardList.filter(b=>b.type==='board'&&b.read!=='private');
  const ov=openModal({title:'공지 작성',body:`<div class="fld"><label class="l">게시판</label><select class="inp" id="nwb">${bs.map(b=>`<option value="${b.id}">${esc(b.name)}</option>`).join('')}</select></div><div class="fld"><label class="l">제목</label><input class="inp" id="nwt" maxlength="40"><div class="errm" id="nwte"></div></div><div class="fld"><label class="l">내용</label><textarea class="inp" id="nwc" rows="5" maxlength="1000"></textarea><div class="errm" id="nwce"></div></div><label class="ck"><input type="checkbox" id="nwp">홈 상단에 고정</label>`,foot:'<button class="btn sec" data-act="mclose">취소</button><button class="btn pri" data-act="ntSubmit">등록</button>'});
}
/* schedule */
const TIMES=(()=>{const o=[];for(let h=0;h<24;h++){o.push(pad(h)+':00');o.push(pad(h)+':30')}return o})();
ADMBODY.schedule=function(){
  const d=S.admin.draft.v;
  return `<div class="s-card"><div class="fld"><label class="l">방송 요일</label><div class="s-chips">${[1,2,3,4,5,6,0].map(k=>`<button class="chip${d.days.indexOf(k)>=0?' act':''}" data-act="schDay" data-arg="${k}" aria-pressed="${d.days.indexOf(k)>=0}">${DOWN[k]}</button>`).join('')}</div></div>
  <div class="arow"><div class="fld" style="flex:1"><label class="l">시작 시간</label><select class="inp" data-p="v.start" data-ch="dbind">${TIMES.map(t=>`<option ${d.start===t?'selected':''}>${t}</option>`).join('')}</select></div><div class="fld" style="flex:1"><label class="l">종료 시간 <span id="nextd"></span></label><select class="inp" data-p="v.end" data-ch="dbind">${TIMES.map(t=>`<option ${d.end===t?'selected':''}>${t}</option>`).join('')}</select>${errEl('v.end')}</div></div>
  <div class="fld"><label class="l">휴방일 (${d.off.length}/10)</label><div class="arow"><input type="date" class="inp" id="offIn" style="max-width:200px"><button class="btn sec sm" data-act="schOff">추가</button></div><div class="errm" id="offErr"></div><div class="s-tags" style="margin-top:6px">${d.off.map((k,i)=>{const x=new Date(+k.slice(0,4),+k.slice(5,7)-1,+k.slice(8,10));return `<span class="s-tag">${k.slice(5).replace('.','.')}(${DOWN[x.getDay()]})<button data-act="schOffDel" data-arg="${i}" aria-label="삭제">${ic('x',12)}</button></span>`}).join('')}</div></div>
  <div class="fld"><label class="l">일정 메모</label>${finp('v.memo',d.memo,{max:40,ph:'예: 이번 주 토요일은 크루 합방'})}<div class="cnt">${cntEl('v.memo')}</div></div>
  <div class="ppanel" id="schprev"></div></div>`;
};
function updSchPrev(){const e=$('#schprev');if(!e)return;const d=S.admin.draft.v;e.innerHTML='<b>미리보기</b><div>다음 방송: '+nextShow(d)+'</div><div class="fanl">방송 시간: '+schTxt(d)+(d.end<=d.start&&d.days.length?' (다음 날 종료)':'')+'</div>'}
/* sigs */
ADMBODY.sigs=function(){
  const d=S.admin.draft.v;
  return `<div class="s-card">${d.length?d.map((s,i)=>`<div class="srow"><div class="arow">${finp(`v.${i}.n`,s.n,{max:12,ph:'이름'})}${finp(`v.${i}.amt`,s.amt?fmt(s.amt):'',{num:1,ph:'금액'})}<select class="inp" style="width:110px" data-p="v.${i}.cat" data-ch="dbind">${['리액션','노래','미션'].map(c=>`<option ${s.cat===c?'selected':''}>${c}</option>`).join('')}</select></div>${errEl(`v.${i}.n`)}${errEl(`v.${i}.amt`)}
   <div class="arow">${finp(`v.${i}.desc`,s.desc,{max:40,ph:'설명 (0~40자)'})}<label class="ck" style="margin:0">${tgl(`v.${i}.hot`,s.hot)} HOT</label><button class="btn out xs" data-act="sgUp" data-arg="${i}" ${i===0?'disabled':''} aria-label="위로 이동">▲</button><button class="btn out xs" data-act="sgDn" data-arg="${i}" ${i===d.length-1?'disabled':''} aria-label="아래로 이동">▼</button><button class="btn out xs del" data-act="sgDel" data-arg="${i}">삭제</button></div></div>`).join(''):'<div class="emptyb">등록된 시그니처가 없어요</div>'}
  <div class="arow" style="margin-top:12px"><button class="btn sec" data-act="sgAdd" ${d.length>=20?'disabled':''}>+ 시그니처 추가</button><span class="fanl">${d.length}/20</span></div></div>`;
};
/* tier */
ADMBODY.tier=function(){
  const d=S.admin.draft.v;const opt=(p,v)=>`<select class="inp" data-p="${p}" data-ch="dbind">${['gold','dia','black'].map(k=>`<option value="${k}" ${v===k?'selected':''}>${TIERN[k]}</option>`).join('')}</select>`;
  return `<div class="s-card"><div class="fld"><label class="l">VVIP 기준 칭호</label>${opt('v.vvip',d.vvip)}</div><div class="fld"><label class="l">SVIP 기준 칭호</label>${opt('v.svip',d.svip)}${errEl('v.svip')}</div>
  <div class="arow"><b>후원 랭킹 노출</b><span class="sp"></span>${tgl('v.showRank',d.showRank)}</div><div class="arow" style="margin-top:10px"><b>랭킹 금액 공개</b><span class="sp"></span>${tgl('v.showAmt',d.showAmt,!d.showRank)}</div>
  <table class="kv" style="margin-top:14px"><tr><th>칭호</th><th>누적 후원 기준</th></tr>${TIERLAD.map(t=>`<tr><td>${tb(t[0])}</td><td>${t[1]}</td></tr>`).join('')}</table><p class="note">칭호 기준 금액은 펀네이션 공통 기준이에요</p></div>`;
};
/* log */
ADMBODY.log=function(){
  const a=S.admin,l=S.station.log.filter(x=>(a.lgf==='전체'||x.grp===a.lgf)&&(a.lgp==='전체'||x.by===a.lgp));
  return `<div class="s-chips">${['전체','기본설정','게시판','권한','부가'].map(x=>`<button class="chip${a.lgf===x?' act':''}" data-act="lgF" data-arg="${x}">${x}</button>`).join('')}<select class="inp" style="width:140px;height:28px;padding:0 8px" data-ch="lgP">${['전체','펀상사','사옥청소부','월요병환자'].map(x=>`<option ${a.lgp===x?'selected':''}>${x}</option>`).join('')}</select></div>
  ${l.length?`<div class="ttab">${l.map(x=>`<div class="trow lgrow"><span class="tm">${x.t}</span><span class="tm"><b>${esc(x.by)}</b> <span class="rb ${x.role==='스트리머'?'':'vp'}">${x.role}</span></span><span class="chip sm">${x.menu}</span><span class="tm" style="flex:1">${esc(x.text)}</span></div>`).join('')}</div>`:'<div class="empty">조건에 맞는 기록이 없어요</div>'}`;
};

/* ---------- admin handlers ---------- */
const eul=w=>{const c=String(w).charCodeAt(String(w).length-1);return c>=0xAC00&&c<=0xD7A3&&(c-0xAC00)%28!==0?'을':'를'};
const USERS0=[['funsangsa','펀상사'],['harukeeper','사옥청소부'],['wolyobyeong','월요병환자'],['gyeoljae_wait','결재대기중'],['kaltoe_fairy','칼퇴요정'],['hoesik_leader','회식팀장'],['tangbisil_owner','탕비실주인'],['bonus_bag','보너스봉투'],['salary_lupin','월급루팡'],['agm_attend','주주총회참석'],['lunch_guard','점심시간지킴이'],['stamp_bang','출근도장쾅'],['rank_oracle','직급전예측왕'],['war_advisor','퇴근전쟁참모'],['fun_viewer','펀시청자'],['saebyeokgyeoljae','새벽결재'],['haru_overtime','야근요정하루'],['tangbisil','탕비실지킴이'],['kaltoe_hope','칼퇴희망'],['copier_down','복사기고장'],['sori_pop','소리팝'],['night_owl','밤부엉이'],['cookie_bear','쿠키곰'],['moon_fox','달여우'],['star_mong','별몽이']].map(a=>({id:a[0],n:a[1],st:!['stamp_bang','rank_oracle','war_advisor','fun_viewer','harukeeper','wolyobyeong','gyeoljae_wait','kaltoe_fairy','hoesik_leader','tangbisil_owner','bonus_bag','salary_lupin','agm_attend','lunch_guard'].includes(a[0])}));
function mgrPermLog(m,k,on){logAdd('권한','매니저',m.n+': '+PL[k]+' 권한 '+(on?'부여':'해제'))}
Object.assign(A,{
 admEnter(){adminEnter()},
 admBack(){admExit()},
 admMenu(el,a){admGo(a)},
 admPv(el,a){S.admin.pv=a;admBodyRefresh()},
 gContinue(el){closeModal(el.closest('.ov-back'));guardFn=null},
 gDiscard(el){closeModal(el.closest('.ov-back'));S.admin.dirty=false;const f=guardFn;guardFn=null;if(f)f()},
 gSave(el){closeModal(el.closest('.ov-back'));const f=guardFn;guardFn=null;if(admSave()&&f)f()},
 cfmOk(el){closeModal(el.closest('.ov-back'));const f=cfmFn;cfmFn=null;cfmNo=null;if(f)f()},
 cfmNo(el){closeModal(el.closest('.ov-back'));const f=cfmNo;cfmFn=null;cfmNo=null;if(f)f()},
 admSave(){admSave()},
 admCancel(){const a=S.admin;a.draft=makeDraft(a.view);a.touched=new Set();a.tried=false;a.imgwarn='';a.autoMsg='';admRender();toast('변경사항을 취소했어요')},
 /* images */
 pickImg(el,a){pickImg(a)},
 sampleImg(el,a){openSamples(a)},
 useSample(el,a){closeModal(el.closest('.ov-back'));const c=imgCtx;if(!c)return;applyImg(c,sampleImg(c.slot,+a))},
 delImg(){S.admin.draft.v.img=null;S.admin.imgwarn='';S.admin.touched.add('img');admRender()},
 /* links */
 linkAdd(){const d=S.admin.draft.v;if(d.length>=10)return;d.push({type:'home',url:''});admBodyRefresh()},
 linkUp(el,a){const d=S.admin.draft.v,i=+a;if(i>0){const t=d[i];d[i]=d[i-1];d[i-1]=t;admBodyRefresh()}},
 linkDn(el,a){const d=S.admin.draft.v,i=+a;if(i<d.length-1){const t=d[i];d[i]=d[i+1];d[i+1]=t;admBodyRefresh()}},
 linkDel(el,a){S.admin.draft.v.splice(+a,1);admBodyRefresh()},
 /* banners */
 bnUp(el,a){const d=S.admin.draft.v,i=+a;if(i>0){const t=d[i];d[i]=d[i-1];d[i-1]=t;admBodyRefresh()}},
 bnDn(el,a){const d=S.admin.draft.v,i=+a;if(i<d.length-1){const t=d[i];d[i]=d[i+1];d[i+1]=t;admBodyRefresh()}},
 bnDel(el,a){S.admin.draft.v.splice(+a,1);admBodyRefresh()},
 /* boards */
 bdSel(el,a){S.admin.sel=+a;S.admin.autoMsg='';const l=$('#bdlist'),e=$('#bdedit');if(l){l.innerHTML=bdListHTML();e.innerHTML=bdEditHTML();admTouch();if(innerWidth<960){const m=MAINS;m.scrollTop=e.getBoundingClientRect().top-m.getBoundingClientRect().top+m.scrollTop-70}}},
 bdAdd(){
  const a=S.admin,d=a.draft.v;if(d.filter(x=>x.type==='board').length>=20)return;
  let n='새 게시판',k=1;while(d.some(x=>x.type==='board'&&x.name===n)){k++;n='새 게시판 '+k}
  d.push({id:'bd'+(++S.station.seq),type:'board',name:n,desc:'',read:'all',write:'all',vip:null});a.sel=d.length-1;a.autoMsg='';admBodyRefresh();
 },
 bdDiv(){const a=S.admin,d=a.draft.v;if(d.filter(x=>x.type==='divider').length>=5)return;const at=d.length?a.sel+1:0;d.splice(at,0,{id:'dv'+(++S.station.seq),type:'divider',label:''});a.sel=at;admBodyRefresh()},
 bdUp(el,a){const s=S.admin,d=s.draft.v,i=+a;if(i>0){const t=d[i];d[i]=d[i-1];d[i-1]=t;if(s.sel===i)s.sel=i-1;else if(s.sel===i-1)s.sel=i;admBodyRefresh()}},
 bdDn(el,a){const s=S.admin,d=s.draft.v,i=+a;if(i<d.length-1){const t=d[i];d[i]=d[i+1];d[i+1]=t;if(s.sel===i)s.sel=i+1;else if(s.sel===i+1)s.sel=i;admBodyRefresh()}},
 bdDel(el,a){
  const s=S.admin,d=s.draft.v,i=+a,b=d[i];
  const go=()=>{d.splice(i,1);if(s.sel>=d.length)s.sel=d.length-1;if(s.sel<0)s.sel=0;admBodyRefresh()};
  if(b.type==='divider'){go();return}
  if(d.filter(x=>x.type==='board').length<=1)return;
  confirmM("'"+b.name+"' 게시판을 삭제할까요?","게시글 "+(S.posts[b.id]||[]).length+"개도 함께 삭제돼요. 저장하기 전에는 [취소]로 되돌릴 수 있어요",'삭제',go);
 },
 /* banwords */
 bwAdd(){bwAddFn()},
 bwDel(el,a){const bw=S.station.banwords,i=+a,w=bw.list[i];bw.list.splice(i,1);logAdd('게시판','금칙어','금칙어 삭제: '+w);admBodyRefresh();toast("'"+w+"'"+eul(w)+" 삭제했어요",'되돌리기',()=>{bw.list.splice(i,0,w);logAdd('게시판','금칙어','금칙어 삭제 되돌림: '+w);if(S.admin.on&&S.admin.view==='banwords')admBodyRefresh()})},
 /* fans */
 fanTab(el,a){S.admin.fanTab=a;S.admin.fanQ='';admBodyRefresh()},
 fanRk(el,a){S.admin.fanRank=a;$('#fanlist').innerHTML=fanListHTML()},
 fanMenu(el,a){
  const id=uidOf(a);
  let h='';
  if(isStreamer())h+=`<button class="mi2" data-act="fanMgr" data-arg="${id}">${ic('shield',16)}매니저로 지정</button>`;
  if(has('chat'))h+=`<button class="mi2" data-act="fanSan" data-arg="${id}">${ic('userx',16)}제재하기</button>`;
  h+=`<button class="mi2" data-act="fanProf" data-arg="${esc(a)}">${ic('user',16)}프로필 보기</button>`;
  openPop(el,h,{w:200});
 },
 fanMgr(el,a){closePop();admGo('managers',()=>{S.admin.mq=a;const i=$('#mq');if(i)i.value=a;A.mgrSearch()})},
 fanSan(el,a){closePop();admGo('sanctions',()=>{S.admin.sq=a;const i=$('#sq');if(i)i.value=a;A.sanSearch()})},
 fanProf(el,a){closePop();const r=$('#fanlist');fanPop(r.firstElementChild||r,a)},
 /* managers */
 mgrSearch(){const a=S.admin;const i=$('#mq');if(i)a.mq=i.value;const r=userSearch(a.mq);a.merr=r.err||'';a.mres=r.list||null;a.mpick=null;const e=$('#mqErr'),m=$('#mres');if(e){e.textContent=a.merr;m.innerHTML=mresHTML()}},
 mgrPick(el,a){S.admin.mpick={id:a,perm:{station:false,chat:false,notice:false}};$('#mres').innerHTML=mresHTML()},
 mgrAdd(){
  const a=S.admin,p=a.mpick;if(!p||!Object.values(p.perm).some(Boolean))return;
  if(S.station.managers.length>=10){toast('매니저는 10명까지 지정할 수 있어요');return}
  const u=allUsers().find(x=>x.id===p.id);
  S.station.managers.unshift({id:u.id,n:u.n,since:TODAY,perm:Object.assign({},p.perm)});
  logAdd('권한','매니저',u.n+' 매니저 지정('+Object.keys(PL).filter(k=>p.perm[k]).map(k=>PL[k]).join('·')+')');
  toast(u.n+'님을 매니저로 지정했어요');a.mres=null;a.mpick=null;a.mq='';a.merr='';admBodyRefresh();renderSide();
 },
 mgrDel(el,a){
  const m=S.station.managers.find(x=>x.id===a);
  confirmM(m.n+'님을 매니저에서 해제할까요?','해제하면 매니저 권한이 모두 사라져요','해제',()=>{
    S.station.managers=S.station.managers.filter(x=>x.id!==a);logAdd('권한','매니저',m.n+' 매니저 해제');toast(m.n+'님을 매니저에서 해제했어요');admBodyRefresh();afterStateChange()});
 },
 /* sanctions */
 sanSearch(){const a=S.admin;const i=$('#sq');if(i)a.sq=i.value;const r=userSearch(a.sq);a.serr=r.err||'';a.sres=r.list||null;a.spick=null;const e=$('#sqErr'),m=$('#sres');if(e){e.textContent=a.serr;m.innerHTML=sresHTML()}},
 sanPick(el,a){S.admin.spick={id:a,type:'chat',dur:'7일',memo:''};$('#sres').innerHTML=sresHTML()},
 sanFil(el,a){S.admin.sfil=a;admBodyRefresh()},
 sanGo(){
  const a=S.admin,p=a.spick;if(!p)return;const memo=($('#smemo')?$('#smemo').value:p.memo).trim();p.memo=memo;
  if(!memo){$('#smerr').textContent='제재 사유를 입력해 주세요';return}
  const u=allUsers().find(x=>x.id===p.id);
  confirmM(u.n+'님을 '+TL[p.type]+' '+p.dur+' 처리할까요?','사유: '+esc(memo),'제재',()=>{
    const days={'1일':1,'7일':7,'30일':30}[p.dur];
    S.station.sanctions.unshift({id:u.id,n:u.n,type:p.type,dur:p.dur,exp:days?dateAdd(days):null,memo:memo,by:actorName(),date:TODAY});
    logAdd('권한','유저 제재',u.n+' '+TL[p.type]+' '+p.dur+' ('+memo+')');toast('제재를 처리했어요');
    a.spick=null;a.sres=null;a.sq='';a.serr='';admBodyRefresh();renderTop();renderNav();renderView();
  });
 },
 sanDel(el,a){
  const s=S.station.sanctions.find(x=>x.id===a);
  confirmM(s.n+'님의 제재를 해제할까요?','사유: '+esc(s.memo),'해제',()=>{
    S.station.sanctions=S.station.sanctions.filter(x=>x.id!==a);logAdd('권한','유저 제재',s.n+' 제재 해제 (사유: '+s.memo+')');toast('제재를 해제했어요');admBodyRefresh();renderTop();renderNav();renderView()},null,false);
 },
 /* notices */
 ntWrite(){openNoticeWrite()},
 ntSubmit(el){
  const ov=el.closest('.ov-back'),bid=$('#nwb',ov).value,t=$('#nwt',ov).value.trim(),c=$('#nwc',ov).value.trim(),pin=$('#nwp',ov).checked;
  let ok=true;$('#nwte',ov).textContent=t?'':(ok=false,'제목을 입력해 주세요');$('#nwce',ov).textContent=c?'':(ok=false,'내용을 입력해 주세요');if(!ok)return;
  const hit=banHit(t,c);if(hit){const m="금칙어가 포함되어 있어요: '"+hit+"'";if(banHit(t))$('#nwte',ov).textContent=m;else $('#nwce',ov).textContent=m;toast('금칙어가 포함되어 등록할 수 없어요');return}
  const id=bid+'-n'+Date.now(),list=S.posts[bid];
  list.unshift({id:id,title:'[공지] '+t,author:actorName(),date:TODAY,views:0,comments:0,notice:true,img:false,isNew:false,no:0,likes:0,liked:false,rec:0,recd:false,link:'',body:c,cl:[]});
  if(pin){S.station.pinned={b:bid,id:list[0].id}}
  logAdd('부가','공지','공지 작성: [공지] '+t+(pin?' (홈 고정)':''));toast('공지를 등록했어요');closeModal(ov);admBodyRefresh();renderStation();
 },
 ntDel(el,a){
  const p=a.split('|'),x=(S.posts[p[0]]||[]).find(q=>q.id===p[1]);if(!x)return;
  confirmM('공지를 해제할까요?',"'"+esc(x.title)+"' 글이 일반 글로 바뀌어요",'해제',()=>{
    x.notice=false;x.no=(S.posts[p[0]].reduce((m,q)=>Math.max(m,q.no),0))+1;
    if(S.station.pinned&&S.station.pinned.id===x.id)S.station.pinned=null;
    logAdd('부가','공지','공지 해제: '+x.title);toast('공지를 해제했어요');admBodyRefresh();renderStation()},null,false);
 },
 /* schedule */
 schDay(el,a){const d=S.admin.draft.v.days,k=+a,i=d.indexOf(k);if(i>=0)d.splice(i,1);else d.push(k);S.admin.touched.add('days');admBodyRefresh()},
 schOff(){
  const d=S.admin.draft.v,i=$('#offIn'),e=$('#offErr');const v=i.value;if(!v){e.textContent='날짜를 선택해 주세요';return}
  const k=v.replace(/-/g,'.');
  if(k<TODAY){e.textContent='지난 날짜는 추가할 수 없어요';return}
  if(d.off.indexOf(k)>=0){e.textContent='이미 추가된 날짜예요';return}
  if(d.off.length>=10){e.textContent='휴방일은 10개까지 추가할 수 있어요';return}
  d.off.push(k);d.off.sort();admBodyRefresh();
 },
 schOffDel(el,a){S.admin.draft.v.off.splice(+a,1);admBodyRefresh()},
 /* sigs */
 sgAdd(){const d=S.admin.draft.v;if(d.length>=20)return;d.push({id:++S.station.seq,n:'',amt:0,cat:'리액션',desc:'',hot:false});admBodyRefresh()},
 sgUp(el,a){const d=S.admin.draft.v,i=+a;if(i>0){const t=d[i];d[i]=d[i-1];d[i-1]=t;admBodyRefresh()}},
 sgDn(el,a){const d=S.admin.draft.v,i=+a;if(i<d.length-1){const t=d[i];d[i]=d[i+1];d[i+1]=t;admBodyRefresh()}},
 sgDel(el,a){S.admin.draft.v.splice(+a,1);admBodyRefresh()},
 /* log */
 lgF(el,a){S.admin.lgf=a;admBodyRefresh()},
 mbDot(el,a){mbGo(+a)},
 /* overrides */
 introEdit(el){const ov=el.closest('.ov-back');if(ov)closeModal(ov);adminEnter('intro')},
 snsEdit(){adminEnter('links')},
 sigAdd(){adminEnter('sigs');setTimeout(()=>{if(S.admin.on&&S.admin.view==='sigs')A.sgAdd()},0)},
 noticeGo(){const pn=pinnedPost();if(pn)openPost(pn.b,pn.p.id)},
 cmtAdd(el,a){
  if(!need())return;
  const p=a.split('|'),x=S.posts[p[0]].find(q=>q.id===p[1]),t=$('#cmtIn').value.trim();if(!t)return;
  if(blocked('board')){const s=curSanction();toast('운영 정책에 따라 글을 쓸 수 없어요 (만료 '+(s&&s.exp?s.exp:'영구')+')');return}
  const hit=banHit(t);if(hit){$('#cmtErr').textContent="금칙어가 포함되어 있어요: '"+hit+"'";toast('금칙어가 포함되어 등록할 수 없어요');return}
  x.cl.push({n:actorName(),t:'방금 전',x:t});x.comments++;renderView();toast('댓글을 등록했어요');
 },
 rnDefault(el){const ov=el.closest('.ov-back'),id=ov.dataset.bid;$('#rn',ov).value=BOARDS[id]?BOARDS[id].name:'새 게시판';$('#rd',ov).value=BOARDS[id]?BOARDS[id].desc:'';rnCheck(ov)},
 rnSave(el,a){
  const ov=el.closest('.ov-back');rnCheck(ov);if(el.disabled)return;
  const n=$('#rn',ov).value.trim(),d=$('#rd',ov).value.trim(),b=getB(a);
  b.name=n;b.desc=d||(BOARDS[a]?BOARDS[a].desc:'');closeModal(ov);logAdd('게시판','게시판',"게시판 이름 변경: '"+n+"'");renderNav();renderView();toast("게시판 이름을 '"+n+"'(으)로 바꿨어요");
  if(S.admin.on&&S.admin.view==='boards'){S.admin.draft=makeDraft('boards');admRender()}
 },
 dreset(){S=newState();ovQ.length=0;OVQ.forEach(x=>ovQ.push(x));pendingMine=null;closeAllModals();closePop();dpOpen=true;guardFn=null;applyAdminMode();renderAll();toast('데이터를 초기화했어요')}
});
A.rename=(el,a)=>openRename(a);
Object.assign(IN,{
 dbind(el){
  const a=S.admin;if(!a.draft)return;let val=el.value;
  if(el.dataset.num){const n=+String(val).replace(/\D/g,'').slice(0,8)||0;val=n;el.value=n?fmt(n):''}
  setPath(a.draft,el.dataset.p,val);a.touched.add(el.dataset.p);
  if(a.view==='boards'){const l=$('#bdlist');if(l)l.innerHTML=bdListHTML();const h=$('#bdedit h3');if(h&&/\.name$/.test(el.dataset.p))h.textContent='편집: '+(val||'새 게시판')}
  admTouch();
 },
 fanq(el){S.admin.fanQ=el.value;$('#fanlist').innerHTML=fanListHTML()},
 mq(el){S.admin.mq=el.value},sq(el){S.admin.sq=el.value},
 smemo(el){const p=S.admin.spick;if(p){p.memo=el.value;$('#smc').textContent=el.value.length+'/100';$('#smerr').textContent=''}},
 noop(){}
});
Object.assign(CH,{
 dbind(el){
  const a=S.admin;if(!a.draft)return;
  let val=el.type==='checkbox'?el.checked:el.value;
  setPath(a.draft,el.dataset.p,val);a.touched.add(el.dataset.p);
  if(a.view==='boards'){
    const m=/^v\.(\d+)\./.exec(el.dataset.p),b=a.draft.v[m?+m[1]:-1];
    if(b&&el.dataset.bd==='read'){
      a.autoMsg='';
      if(!wAllowed(b.read,b.write)){const nw=['all','fan','vip','manager','none'].find(k=>LV[k]>=minW(b.read)&&wAllowed(b.read,k));b.write=nw;a.autoMsg="글쓰기 권한도 '"+WL[nw]+"'(으)로 바뀌었어요"}
    }
    if(b&&b.type==='board'&&(b.read==='vip'||b.write==='vip')&&!b.vip)b.vip='vip';
    $('#bdlist').innerHTML=bdListHTML();$('#bdedit').innerHTML=bdEditHTML();
  }
  if(a.view==='tier'&&el.dataset.p==='v.showRank'&&!val)a.draft.v.showAmt=false;
  if(a.view==='tier'||a.view==='schedule'&&false)admBodyRefresh();else admTouch();
 },
 fileIn(el){const f=el.files&&el.files[0];el.value='';if(f)procFile(f)},
 bwOn(el){const bw=S.station.banwords;bw.on=el.checked;logAdd('게시판','금칙어','금칙어 필터 '+(bw.on?'ON':'OFF'));toast(bw.on?'금칙어 필터를 켰어요':'금칙어 필터를 껐어요');admBodyRefresh()},
 mgrPerm(el){
  const m=S.station.managers.find(x=>x.id===el.dataset.id),k=el.dataset.k,on=el.checked;
  const apply=()=>{m.perm[k]=on;mgrPermLog(m,k,on);toast(m.n+': '+PL[k]+' 권한을 '+(on?'부여':'해제')+'했어요');admBodyRefresh();afterStateChange()};
  if(!on&&Object.keys(m.perm).filter(x=>x!==k).every(x=>!m.perm[x])){
    confirmM('모든 권한을 끄면 매니저에서 해제돼요',esc(m.n)+'님의 마지막 권한을 끄면 매니저에서 해제돼요','해제',()=>{S.station.managers=S.station.managers.filter(x=>x.id!==m.id);logAdd('권한','매니저',m.n+' 매니저 해제(모든 권한 해제)');toast(m.n+'님을 매니저에서 해제했어요');admBodyRefresh();afterStateChange()},()=>admBodyRefresh());
    return;
  }
  apply();
 },
 mgrNewPerm(el){const p=S.admin.mpick;if(!p)return;p.perm[el.dataset.k]=el.checked;$('#mres').innerHTML=mresHTML()},
 sanType(el){S.admin.spick.type=el.value},sanDur(el){S.admin.spick.dur=el.value},
 ntPin(el){const v=el.value;S.station.pinned=v?{b:v.split('|')[0],id:v.split('|')[1]}:null;logAdd('부가','공지',v?'홈 상단 고정 변경':'홈 상단 고정 해제');toast('홈 상단 공지를 바꿨어요');renderStation()},
 lgP(el){S.admin.lgp=el.value;admBodyRefresh()}
});
document.addEventListener('compositionend',e=>{const k=e.target.dataset&&e.target.dataset.in;if(k&&IN[k])IN[k](e.target)});
document.addEventListener('keydown',e=>{
  const t=e.target;if(!t||e.isComposing||e.keyCode===229)return;
  if(e.key==='Enter'){
    if(t.id==='bwIn'){e.preventDefault();bwAddFn()}
    else if(t.id==='mq'){e.preventDefault();A.mgrSearch()}
    else if(t.id==='sq'){e.preventDefault();A.sanSearch()}
  }
});

function renderAll(){applyAdminMode();renderHeader();layoutSB();renderBanner();renderTop();renderNav();renderView();renderRban();renderFn();renderDemo();renderBnav();if(S.admin.on)admRender()}
function scrollTabs(){
  const m=MAINS,t=$('#tabsw');
  const y=t.getBoundingClientRect().top-m.getBoundingClientRect().top+m.scrollTop;
  if(m.scrollTop>y)m.scrollTop=y;
}
function renderStation(){ensureView();renderBanner();renderTop();renderNav();renderView();renderRban()}
function go(v,opts){
  S.view=v;
  if(isBoardView(v)){if(opts&&opts.detail!==undefined)bui(v).detail=opts.detail;else if(!(opts&&opts.keep))bui(v).detail=null}
  closePop();if(innerWidth<960&&sb.open){sb.open=false;layoutSB()}
  ensureView();renderNav();renderView();scrollTabs();
}
/* ===== 6차: 상하 레이아웃 + 크루원 관리 ===== */
const CRW=()=>S.station.crew.list;
const crewLeader=()=>{const l=CRW().find(x=>x.role==='크루장');return l?l.n:'미정'};
const SVT=(h)=>h;
const SAVEDV={
 title(){const im=S.station.bannerImg;return `<div class="tpv sv" style="${im?`background:center/cover no-repeat url('${im.data}')`:''}">${im?'':'<span>펀상사, 오늘도 출근합니다</span>'}</div><div class="fanl" style="margin-top:6px">${im?esc(im.name)+' · '+im.w+'×'+im.h+' · '+fmtSize(im.size):'기본 이미지 사용 중'}</div>`},
 intro(){const s=S.station;return `<div class="sv-one">${s.intro?esc(s.intro):'<span class="emptyt">한 줄 소개가 없어요</span>'}</div><div class="ipv">${introBody({intro:s.intro,text:s.introText,rules:s.rulesText},s.links)}</div>`},
 links(){const l=S.station.links;return l.length?`<div class="ttab">${l.map(x=>`<div class="trow"><span class="tn">${ic(LTYPE[x.type][1],18)}<b>${LTYPE[x.type][0]}</b></span><span class="tm" style="flex:1">${esc(x.url)}</span></div>`).join('')}</div>`:'<div class="emptyb">등록된 외부 링크가 없어요</div>'},
 rbanner(){return bnSaved(S.station.rightBanners,'r')},
 mbanner(){return bnSaved(S.station.midBanners,'m')},
 boards(){return `<div class="ttab">${S.station.boardList.map(b=>b.type==='divider'?`<div class="trow"><span class="tm">┄ ${esc(b.label||'구분선')} ┄</span></div>`:`<div class="trow"><span class="tn">${ic(RICON[b.read],16)}<b>${esc(b.name)}</b></span><span class="chip sm">공개 ${rwS(b.read,b,RL)}</span><span class="chip sm">글쓰기 ${rwS(b.write,b,WL)}</span><span class="tm" style="flex:1">${esc(b.desc||'')}</span></div>`).join('')}</div>`},
 schedule(){const sc=S.station.schedule;return `<div class="trow"><span class="tm">방송 시간</span><b>${schTxt(sc)}</b></div><div class="trow"><span class="tm">다음 방송</span><b>${nextShow()}</b></div><div class="trow"><span class="tm">휴방일</span><span class="s-tags">${sc.off.length?sc.off.map(k=>`<span class="s-tag" style="padding-right:12px">${k.slice(5)}</span>`).join(''):'<span class="emptyt">없음</span>'}</span></div><div class="trow"><span class="tm">메모</span><span>${esc(sc.memo||'없음')}</span></div>`},
 sigs(){const l=S.station.sigs;return l.length?`<div class="s-tags">${l.map(s=>`<span class="s-tag" style="padding-right:12px">${esc(s.n)} · ${fmt(s.amt)}원${s.hot?' · HOT':''}</span>`).join('')}</div>`:'<div class="emptyb">등록된 시그니처가 없어요</div>'},
 tier(){const t=S.station.tierCfg;return `<div class="trow"><span class="tm">VVIP 기준</span>${tb(t.vvip)}</div><div class="trow"><span class="tm">SVIP 기준</span>${tb(t.svip)}</div><div class="trow"><span class="tm">후원 랭킹 노출</span><b>${t.showRank?'ON':'OFF'}</b></div><div class="trow"><span class="tm">랭킹 금액 공개</span><b>${t.showAmt?'ON':'OFF'}</b></div>`}
};
function bnSaved(l,k){return l.length?`<div class="svbs">${l.map(b=>`<div class="svb ${k}"><img src="${b.img.data}" alt=""><small>${b.on?'노출':'숨김'}${b.link?' · 링크':''}</small></div>`).join('')}</div>`:'<div class="emptyb">등록된 배너가 없어요</div>'}
const wrapAdm=v=>{
  const orig=ADMBODY[v];
  ADMBODY[v]=function(){return '<div class="s-card edit"><h3>설정</h3>'+orig()+savebarHTML()+'</div><div class="s-card cur"><h3>현재 저장된 설정</h3>'+SAVEDV[v]()+'</div>'};
};
Object.keys(SAVEDV).forEach(wrapAdm);
/* crew admin */
AVIEWS.splice(5,0,{id:'crew',label:'크루원 관리',ic:'users',grp:'기본설정',qa:'M-22',ok:canSt});
DESC.crew='아이디를 입력해 크루원을 추가하고, 방송국의 크루원 탭에 바로 반영해요';
ADMBODY.crew=function(){
  const cr=S.station.crew;
  return `<div class="s-card"><h3>현재 크루원 ${cr.list.length}/20 · ${esc(cr.name)}</h3><p class="note">직책은 인턴~부장 중에서 정해요. 크루장 펀상사는 '대표'로 고정이고, 저장하면 크루원 카드에 반영돼요</p>${cr.list.length?`<div class="ttab">${cr.list.map(m=>`<div class="trow"><span class="tn">${av(m.n,32)}<span><b>${esc(m.n)}</b><small>@${m.id}</small></span></span><span class="rl${m.role==='크루장'?' cap':''}">${m.role}</span>${m.role==='크루장'?'<span class="cbd cap">대표</span>':`<select class="inp crsel" data-ch="crewRank" data-id="${m.id}" aria-label="${esc(m.n)} 직책">${RKS.map(r=>`<option ${(m.rank||'인턴')===r?'selected':''}>${r}</option>`).join('')}</select>`}<span class="sp"></span><button class="btn out xs del" data-act="crewDel" data-arg="${m.id}" ${m.live===2?'disabled title="크루장은 삭제할 수 없어요"':''}>삭제</button></div>`).join('')}</div>`:'<div class="emptyb">등록된 크루원이 없어요</div>'}</div>
  <div class="s-card" style="margin-top:16px"><h3>크루원 추가</h3><label class="l" style="display:block;font-size:12px;color:var(--text-meta);margin-bottom:4px">크루원 아이디</label><div class="arow"><input class="inp" id="crewIn" maxlength="30" placeholder="아이디 입력 (예: sori_pop)" data-in="noop"><button class="btn pri" data-act="crewAdd">추가</button></div><div class="errm" id="crewErr"></div><p class="note">추가해 볼 수 있는 예시 아이디: sori_pop, night_owl, cookie_bear, moon_fox, star_mong</p></div>
  <div class="s-card" style="margin-top:16px"><h3>크루명</h3><label class="l" style="display:block;font-size:12px;color:var(--text-meta);margin-bottom:4px">크루명 (1~10자)</label><div class="arow"><input class="inp" id="crewNm" maxlength="10" value="${esc(cr.name)}" data-in="noop"><button class="btn sec" data-act="crewRename">변경</button></div><div class="errm" id="crewNmErr"></div></div>`;
};
Object.assign(A,{
 crewAdd(){
  const i=$('#crewIn'),er=$('#crewErr');if(!i||!canSt())return;const v=i.value.trim().toLowerCase();
  const fail=m=>{er.textContent=m;i.focus({preventScroll:true})};
  if(!v)return fail('아이디를 입력해 주세요');
  const u=allUsers().find(x=>x.id.toLowerCase()===v);
  if(!u)return fail("'"+i.value.trim()+"'와 일치하는 유저가 없어요");
  if(u.id==='funsangsa')return fail('본인은 이미 크루장이에요');
  if(CRW().some(m=>m.id===u.id))return fail('이미 크루원이에요');
  if(S.station.sanctions.some(s=>s.id===u.id))return fail('제재 중인 유저는 크루원으로 추가할 수 없어요');
  if(!u.st)return fail('방송국이 있는 스트리머만 크루원으로 추가할 수 있어요');
  if(CRW().length>=20)return fail('크루원은 20명까지 추가할 수 있어요');
  CRW().push({id:u.id,n:u.n,role:'크루원',live:0,fav:1000+(u.id.length*137)%2000,intro:'새로 합류한 크루원이에요',lt:''});
  logAdd('기본설정','크루원',u.n+' 크루원 추가');toast(u.n+'님을 크루원으로 추가했어요');
  admBodyRefresh();refreshStation();const n=$('#crewIn');if(n)n.focus({preventScroll:true});
 },
 crewDel(el,a){
  const m=CRW().find(x=>x.id===a);if(!m||m.live===2||!canSt())return;
  confirmM(m.n+'님을 크루원에서 삭제할까요?','크루원 탭에서 바로 사라져요','삭제',()=>{
   S.station.crew.list=CRW().filter(x=>x.id!==a);logAdd('기본설정','크루원',m.n+' 크루원 삭제');toast(m.n+'님을 크루원에서 삭제했어요');admBodyRefresh();refreshStation()});
 },
 crewRename(){
  const i=$('#crewNm'),er=$('#crewNmErr'),n=i.value.trim();if(!canSt())return;
  if(!n){er.textContent='크루명을 입력해 주세요';return}
  if(n===S.station.crew.name){er.textContent='변경된 내용이 없어요';return}
  S.station.crew.name=n;logAdd('기본설정','크루원','크루명 변경: '+n);toast("크루명을 '"+n+"'(으)로 바꿨어요");admBodyRefresh();refreshStation();
 }
});
document.addEventListener('keydown',e=>{
  if(e.key==='Enter'&&!e.isComposing&&e.keyCode!==229){const t=e.target;
    if(t&&t.id==='crewIn'){e.preventDefault();A.crewAdd()}else if(t&&t.id==='crewNm'){e.preventDefault();A.crewRename()}}
});

/* ===== 9차: 홈 개편 / LNB / 관리 순서·일정·시그니처 ===== */
const INST=['banwords','managers','sanctions','notices','crew'];
document.body.insertAdjacentHTML('afterbegin','<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><linearGradient id="wgG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd49c"/><stop offset=".5" stop-color="#f7df4e"/><stop offset="1" stop-color="#d17600"/></linearGradient><linearGradient id="wgS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#c2c9d1"/><stop offset="1" stop-color="#7c8594"/></linearGradient><linearGradient id="wgB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd49c"/><stop offset=".5" stop-color="#ff9b61"/><stop offset="1" stop-color="#9c5800"/></linearGradient></defs></svg>');
/* ---------- ranking ---------- */
const rng=seed=>{let t=seed>>>0;return()=>{t=(t+0x6D2B79F5)>>>0;let r=Math.imul(t^(t>>>15),1|t);r^=r+Math.imul(r^(r>>>7),61|r);return((r^(r>>>14))>>>0)/4294967296}};
const rkCache={};
function rankData(tab,per){
  const key=tab+'|'+per;if(rkCache[key])return rkCache[key];
  const pi=per==='all'?0:+per.slice(1);
  const r=rng(pi*131+(tab==='act'?7:3)*977);
  const rows=FANS.map((f,i)=>{
    let v;
    if(tab==='don')v=per==='all'?AMT_ALL[i]:Math.round(AMT_ALL[i]*(0.02+0.2*r())/1000)*1000;
    else v=per==='all'?Math.round(60000*(0.15+0.85*r())/10)*10:Math.round(6000*(0.1+0.9*r()));
    return {f:f,v:v};
  });
  rows.sort((a,b)=>b.v-a.v);
  return rkCache[key]=rows;
}
function rankVal(tab,per,name){const x=rankData(tab,per).find(r=>r.f.n===name);return x?x.v:0}
const rkVal=(tab,v)=>tab==='don'?fmt(v)+'원':fmt(v)+'회';
function rkControls(){
  const u=S.ui,tab=u.rkTab,per=u.rkPer;
  return `<div class="rk-tabs" role="tablist"><button class="rkt${tab==='don'?' on':''}" role="tab" aria-selected="${tab==='don'}" data-act="rkTab" data-arg="don">${ic('coin',16)}후원 랭커</button><button class="rkt${tab==='act'?' on':''}" role="tab" aria-selected="${tab==='act'}" data-act="rkTab" data-arg="act">${ic('users',16)}활동 랭커</button></div>
  <p class="rk-desc">${tab==='don'?'후원 금액이 많은 순서예요':'채팅·출석·게시글 활동을 합산한 점수 순서예요'}</p>
  <div class="rk-per"><button class="chip${per==='all'?' act':''}" data-act="rkPer" data-arg="all">역대</button><button class="chip${per==='m11'?' act':''}" data-act="rkPer" data-arg="m11">이번 달</button><select class="rk-mon" data-ch="rkMon" aria-label="2026년 월별 선택"><option value="">2026년 월별</option>${[1,2,3,4,5,6,7,8,9,10,11].map(m=>`<option value="m${m}" ${per==='m'+m?'selected':''}>2026년 ${m}월</option>`).join('')}</select></div>`;
}
/* ---------- calendar ---------- */
const evKey=(y,m,d)=>y+'.'+pad(m+1)+'.'+pad(d);
const evAll=()=>S.station.schedule.events.filter(e=>e.date&&e.date.length===10).slice().sort((a,b)=>a.date===b.date?(a.start<b.start?-1:1):(a.date<b.date?-1:1));
const evOf=k=>evAll().filter(e=>e.date===k);
const dkLabel=k=>{const d=new Date(+k.slice(0,4),+k.slice(5,7)-1,+k.slice(8,10));return (d.getMonth()+1)+'월 '+d.getDate()+'일 ('+DOWN[d.getDay()]+')'};
const KCLS={'정규':'kn','직급전':'kz','합방':'kj','특집':'ks'};
const refreshCal=()=>{const e=$('#calHome');if(e)e.innerHTML=calHTML()};
function calShift(n){const c=S.ui.cal;let m=c.m+n,y=c.y;if(m<0){m=0}else if(m>11){m=11}c.m=m;c.y=y;c.sel=null;refreshCal()}
Object.assign(A,{
 calPrev(){calShift(-1)},calNext(){calShift(1)},
 calPick(el,k){S.ui.cal.sel=S.ui.cal.sel===k?null:k;refreshCal()},
 calToday(){const c=S.ui.cal;c.y=2026;c.m=10;c.sel=TODAY;refreshCal()},
 rkTab(el,a){S.ui.rkTab=a;setRank()},rkPer(el,a){S.ui.rkPer=a;setRank()},
 crewSched(){openCrewSched()}
});
CH.rkMon=el=>{if(el.value){S.ui.rkPer=el.value;setRank()}};
function openCrewSched(){
  const l=evAll().filter(e=>e.kind==='합방'&&e.date>=TODAY).slice(0,8);
  openModal({title:'크루 합방 일정',body:l.length?`<table class="kv"><tr><th>일시</th><th>제목</th></tr>${l.map(e=>`<tr><td>${dkLabel(e.date)} ${e.start}</td><td>${esc(e.title)}</td></tr>`).join('')}</table>`:'<div class="emptyb">예정된 합방 일정이 없어요</div>'});
}
/* ---------- shorts ---------- */
const SHORTS=[['칼퇴 5초 전 룰렛 대참사','0:58',46000,'2026.11.03'],['대표님 결재 도장 소리','0:32',38200,'2026.11.02'],['복사기 고장 난 대리의 표정','0:47',29100,'2026.10.31'],['직급전 1위 발표 순간','0:55',21400,'2026.10.29'],['탕비실 간식 쟁탈전','0:41',18700,'2026.10.27'],['신입사원 첫 출근 인사','0:36',15200,'2026.10.25'],['퇴근 도장 쾅','0:29',12900,'2026.10.23'],['야근 3시간 차 팀장 목소리','0:44',11200,'2026.10.20'],['인턴 정규직 전환 눈물','0:23',9800,'2026.10.17'],['회식 건배사 실패','0:58',8700,'2026.10.14'],['엑셀표 순위 역전 3초','0:19',7600,'2026.10.11'],['월요일 출근 리액션','0:51',6400,'2026.10.08']].map((a,i)=>({id:i,title:a[0],len:a[1],v:a[2],date:a[3]}));
const vs=n=>n>=10000?(n/10000).toFixed(1)+'만':fmt(n);
const shBg=i=>`linear-gradient(165deg,hsl(${(i*53+210)%360} 52% 36%),hsl(${(i*53+250)%360} 48% 14%))`;
/* 쇼츠 썸네일 샘플 — SOOP Catch 세로 영상 썸네일(9:16, 단일 컷) 12장, assets/v2/station/shorts (2026-11-13, 시안용 샘플) */
const shImg=i=>`assets/v2/station/shorts/short-${String(((i%12)+12)%12+1).padStart(2,'0')}.webp`;
const shCard=s=>`<button class="shc" data-act="short" data-arg="${s.id}"><div class="sht" style="background:center/cover no-repeat url('${shImg(s.id)}'),${shBg(s.id)}"><span class="shbd">SHORTS</span><span class="shv">${ic('play',12)} ${vs(s.v)}</span><span class="shl">${s.len}</span></div><b>${esc(s.title)}</b><small>조회 ${vs(s.v)}회 · ${s.date.slice(5)}</small></button>`;
function shortsView(){
  const u=S.ui;const l=SHORTS.slice().sort((a,b)=>u.shSort==='new'?(a.date<b.date?1:-1):b.v-a.v);
  return `<div data-qa="L-09"><div class="vh"><h2>쇼츠 ${SHORTS.length}</h2><p>짧고 굵은 하이라이트 모음이에요</p></div><div class="s-chips"><button class="chip${u.shSort==='new'?' act':''}" data-act="shSort" data-arg="new">최신순</button><button class="chip${u.shSort==='pop'?' act':''}" data-act="shSort" data-arg="pop">인기순</button></div><div class="shgrid">${l.map(shCard).join('')}</div></div>`;
}
Object.assign(A,{shSort(el,a){S.ui.shSort=a;renderView()}});
/* ---------- signature ---------- */
const PRICE=[['전체',0,Infinity],['10만 미만',0,1e5],['10만~15만',1e5,15e4],['15만~20만',15e4,2e5],['20만~30만',2e5,3e5],['30만~50만',3e5,5e5],['50만~100만',5e5,1e6],['100만~300만',1e6,3e6],['300만~500만',3e6,5e6],['500만~1000만',5e6,1e7],['1000만 이상',1e7,Infinity]];
const SIGSORT=[['rec','추천순'],['pop','인기순'],['low','금액 낮은순'],['high','금액 높은순'],['name','이름순']];
function ytId(u){
  u=String(u||'').trim();
  const m=/^https?:\/\/(?:www\.|m\.)?youtu\.be\/([\w-]{11})(?:[?&#].*)?$/.exec(u)||/^https?:\/\/(?:www\.|m\.)?youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)([\w-]{11})(?:[&#?].*)?$/.exec(u);
  return m?m[1]:'';
}
const DEFYT='6TlVAKiyiME';
function sigList(){
  const u=S.ui,pr=PRICE.find(p=>p[0]===u.sigPrice)||PRICE[0];
  let l=SG().filter(s=>s.amt>=pr[1]&&s.amt<pr[2]);
  const so=u.sigSort;
  l=l.slice().sort((a,b)=>so==='rec'?(b.rec||0)-(a.rec||0):so==='pop'?(b.pop||0)-(a.pop||0):so==='low'?a.amt-b.amt:so==='high'?b.amt-a.amt:String(a.n).localeCompare(String(b.n),'ko'));
  return l;
}
function sigCard(s){
  return `<button class="sgc" data-act="sigOpen" data-arg="${s.id}"><div class="sq" style="${s.img?`background:center/cover no-repeat url('${s.img.data}')`:`background:linear-gradient(135deg,hsl(${(s.id*47+205)%360} 45% 30%),hsl(${(s.id*47+245)%360} 40% 20%))`}">${s.img?'':esc((s.n[0]||'?'))}<span class="amt">${fmt(s.amt)}원</span>${s.hot?'<span class="hot">HOT</span>':''}<span class="sgplay">${ic('play',14)}</span></div><b>${esc(s.n)}</b><small>${esc(s.desc||'')}</small></button>`;
}
sigView=function(){
  const u=S.ui,list=sigList();
  const cnt=p=>SG().filter(s=>s.amt>=p[1]&&s.amt<p[2]).length;
  return `<div data-qa="T-04"><div class="sigbn">아래 금액으로 후원하면 펀상사의 시그니처 리액션이 방송에 나와요</div>
   <div class="sort-bar sigtool">${sortChip(SIGSORT,u.sigSort,'sigSortSet')}<div class="sort-bar__chips sigprice" role="group" aria-label="가격대">${PRICE.map(p=>`<button class="chip${u.sigPrice===p[0]?' act':''}" data-act="sigPrice" data-arg="${p[0]}">${p[0]}${p[0]==='전체'?'':' '+cnt(p)}</button>`).join('')}</div></div>
   <div class="fanl" style="margin:2px 0 12px">시그니처 ${list.length}개</div>
   ${list.length||canSt()?`<div class="sgrid4">${list.map(sigCard).join('')}${canSt()?`<button class="sgc add" data-act="sigAdd"><div class="sq">${ic('plus',28)}+ 시그니처 추가</div></button>`:''}</div>`:'<div class="empty">이 가격대의 시그니처가 없어요</div>'}</div>`;
};
openSig=function(i){
  const s=SG().find(x=>x.id===+i);if(!s)return;
  const id=ytId(s.link)||DEFYT;
  openModal({title:s.n,cls:'mid sigm sheet',qa:'T-04-m',body:`<div class="ytw"><iframe src="https://www.youtube.com/embed/${id}?rel=0" title="${esc(s.n)} 시그니처 영상" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
   <div class="sgi"><b>${esc(s.n)}</b><span class="sigchip" style="margin:0">${fmt(s.amt)}원</span></div><p style="margin-top:6px">${esc(s.desc||'')}</p><a class="link ytl" href="https://youtu.be/${id}" target="_blank" rel="noopener noreferrer">영상이 안 보이면 YouTube에서 보기 ›</a>`,
   foot:`<button class="btn pri" data-act="sigDonate" data-arg="${s.id}">이 금액으로 후원</button>`});
};
Object.assign(A,{sigOpen(el,a){openSig(+a)},sigPrice(el,a){S.ui.sigPrice=a;renderView()}});
CH.sigSort=el=>{S.ui.sigSort=el.value;renderView()};
/* ---------- followers / views / LNB ---------- */
itemInfo=function(id){
  if(id==='hotfans')return {name:'랭커',cnt:'20'};
  if(id==='subfans')return {name:'팔로워',cnt:fmt(S.favCount)};
  if(id==='replay')return {name:'다시보기',cnt:'8'};
  if(id==='shorts')return {name:'쇼츠',cnt:'12'};
  return {name:bnm(id),cnt:''};
};
renderView=function(){
  const v=S.view;let h='';
  if(v==='home')h=homeView();else if(v==='crew')h=crewView();else if(v==='videos')h=videosView();else if(v==='signature')h=sigView();
  else if(v==='hotfans')h=hotView();else if(v==='subfans')h=subView();else if(v==='replay')h=replayView();else if(v==='shorts')h=shortsView();
  else h=boardView(v);
  $('#view').innerHTML=h;
  if(v==='home')startOvSoon();
};
panelHTML=function(){
  const mi=(id,name,icn,qa,rt,cls,pen)=>`<div class="mi${S.view===id?' act':''}${cls||''}" role="button" tabindex="0" data-act="nav" data-arg="${id}" data-qa-nav="${qa}" title="${esc(name)}">${ic(icn,20)}<span class="nm">${esc(name)}</span>${pen||''}<span class="rt">${rt||''}</span></div>`;
  const t3=FANS.slice(0,3);
  const hot=`<div class="hot3" data-qa="L-01-top3"><div class="h3h"><span class="h3t0">${ic('crown',14)}TOP 3 랭커</span><button class="h3all" data-act="nav" data-arg="ranker" data-qa-nav="L-01">전체 보기 ›</button></div>${t3.map((f,i)=>`<button class="h3r h${i+1}" data-act="fan" data-arg="${esc(f.n)}" title="${esc(f.n)}">${gkEmblem(i+1,f.n,'mini')}<span class="h3t"><b>${esc(f.n)}</b><small>${esc(f.title||GRADEN[gradeOf(f.n)])}</small></span></button>`).join('')}</div>`;
  let h='<div class="pg">팬</div>'+hot+mi('subfans','팔로워','heart','L-02',fmt(S.favCount))+'<hr><div class="pg">콘텐츠</div>'+mi('replay','다시보기','video','L-03','8')+mi('shorts','쇼츠','play','L-09','12')+'<hr><div class="pg">게시판</div>';
  S.station.boardList.forEach(b=>{
    if(b.type==='divider'){h+='<hr>'+(b.label?`<div class="pg">${esc(b.label)}</div>`:'');return}
    if(b.read==='private'&&!canRead(b))return;
    const lk=!canRead(b);let rt='';
    if(lk)rt=ic('lock',14);else if(b.read==='private')rt='<span class="rb vp">비공개</span>';else if(b.read==='vip')rt=vipBadgeHTML(b,'rb');else if(hasNew(b.id))rt='<span class="nbd">N</span>';
    const pen=canSt()?`<span class="pen" data-act="rename" data-arg="${b.id}" role="button" tabindex="0" aria-label="게시판 이름 변경">${ic('pencil',14)}</span>`:'';
    h+=mi(b.id,b.name,RICON[b.read],BQA(b.id),rt,lk?' lk':'',pen);
  });
  return h;
};
/* ---------- admin: bodies ---------- */
const ADLBL=(t,f)=>`<label class="l"${f?` for="${f}"`:''} style="display:block;font-size:12px;color:var(--text-meta);margin-bottom:4px">${t}</label>`;
bwBody=function(){
  const bw=S.station.banwords;
  return `<div class="s-card"><div class="arow"><b>금칙어 사용</b><span class="sp"></span><label class="ck" style="margin:0"><span id="bwst">${bw.on?'ON':'OFF'}</span><input type="checkbox" class="sw" data-ch="bwOn" ${bw.on?'checked':''}></label></div>
  <p class="note">금칙어가 들어간 게시글·댓글은 등록되지 않아요<br><b>방송국 공통 목록이며 모든 게시판·댓글에 적용돼요</b></p>${bw.on?'':'<p class="errm">필터가 꺼져 있어 적용되지 않아요</p>'}
  <div style="margin-top:12px">${ADLBL('금칙어 추가 (쉼표로 여러 개)','bwIn')}<div class="arow"><input class="inp" id="bwIn" maxlength="100" placeholder="금칙어 입력" data-in="noop"><button class="btn pri" data-act="bwAdd">추가</button></div><div class="errm" id="bwErr"></div></div></div>
  <div class="s-card" style="margin-top:16px"><h3>현재 등록된 금칙어 ${bw.list.length}/100</h3><div class="tagbox" style="${bw.on?'':'opacity:.5'}"><div class="s-tags">${bw.list.length?bw.list.map((w,i)=>`<span class="s-tag">${esc(w)}<button data-act="bwDel" data-arg="${i}" aria-label="${esc(w)} 삭제">${ic('x',12)}</button></span>`).join(''):'<span class="emptyt">등록된 금칙어가 없어요</span>'}</div></div></div>`;
};
ADMBODY.banwords=bwBody;
ADMBODY.crew=function(){
  const cr=S.station.crew;
  return `<div class="s-card"><h3>크루원 추가</h3>${ADLBL('크루원 아이디','crewIn')}<div class="arow"><input class="inp" id="crewIn" maxlength="30" placeholder="아이디 입력 (예: sori_pop)" data-in="noop"><button class="btn pri" data-act="crewAdd">추가</button></div><div class="errm" id="crewErr"></div><p class="note">방송국이 있는 스트리머만 추가할 수 있어요. 추가해 볼 수 있는 예시 아이디: sori_pop, night_owl, cookie_bear, moon_fox, star_mong</p></div>
  <div class="s-card" style="margin-top:16px"><h3>크루명</h3>${ADLBL('크루명 (1~10자)','crewNm')}<div class="arow"><input class="inp" id="crewNm" maxlength="10" value="${esc(cr.name)}" data-in="noop"><button class="btn sec" data-act="crewRename">변경</button></div><div class="errm" id="crewNmErr"></div></div>
  <div class="s-card" style="margin-top:16px"><h3>현재 크루원 ${cr.list.length}/20 · ${esc(cr.name)}</h3><p class="note">직책은 인턴~부장 중에서 정해요. 크루장 펀상사는 '대표'로 고정이고, 저장하면 크루원 카드에 반영돼요</p>${cr.list.length?`<div class="ttab">${cr.list.map(m=>`<div class="trow"><span class="tn">${av(m.n,32)}<span><b>${esc(m.n)}</b><small>@${m.id}</small></span></span><span class="rl${m.role==='크루장'?' cap':''}">${m.role}</span>${m.role==='크루장'?'<span class="cbd cap">대표</span>':`<select class="inp crsel" data-ch="crewRank" data-id="${m.id}" aria-label="${esc(m.n)} 직책">${RKS.map(r=>`<option ${(m.rank||'인턴')===r?'selected':''}>${r}</option>`).join('')}</select>`}<span class="sp"></span><button class="btn out xs del" data-act="crewDel" data-arg="${m.id}" ${m.live===2?'disabled title="크루장은 삭제할 수 없어요"':''}>삭제</button></div>`).join('')}</div>`:'<div class="emptyb">등록된 크루원이 없어요</div>'}</div>`;
};
/* boards: dropdown */
bdEditHTML=function(){
  const a=S.admin,d=a.draft.v,i=a.sel,b=d[i];if(!b)return '';
  if(b.type==='divider')return `<h3>편집: 구분선</h3><div class="fld"><label class="l">라벨 (0~10자, 비우면 선만 보여요)</label>${finp(`v.${i}.label`,b.label||'',{max:10})}<div class="cnt">${cntEl(`v.${i}.label`)}</div></div>`;
  const cnt=(S.posts[b.id]||[]).length,nn=(S.posts[b.id]||[]).filter(p=>p.notice).length;
  const rs=['all','fan','manager','vip','private'].map(k=>`<option value="${k}" ${b.read===k?'selected':''}>${RL[k]}</option>`).join('');
  const ws=['all','fan','manager','vip','none'].map(k=>{const ok=wAllowed(b.read,k);return `<option value="${k}" ${b.write===k?'selected':''} ${ok?'':'disabled'}>${WL[k]}${ok?'':' (공개 범위보다 넓어요)'}</option>`}).join('');
  const tc=S.station.tierCfg;
  return `<h3>편집: ${esc(b.name||'새 게시판')}</h3>
  <div class="fld"><label class="l">게시판 제목*</label>${finp(`v.${i}.name`,b.name,{max:10})}<div class="cnt">${cntEl(`v.${i}.name`)}</div>${errEl(`v.${i}.name`)}</div>
  <div class="fld"><label class="l">설명</label>${finp(`v.${i}.desc`,b.desc||'',{max:40})}<div class="cnt">${cntEl(`v.${i}.desc`)}</div></div>
  <div class="fld"><label class="l" for="bdRead${i}">공개 설정</label><select class="inp" id="bdRead${i}" data-p="v.${i}.read" data-ch="dbind" data-bd="read">${rs}</select><div class="fanl" style="margin-top:4px">${RHELP[b.read]}</div></div>
  ${b.read==='vip'||b.write==='vip'?`<div class="fld"><label class="l">VIP 기준</label><select class="inp" data-p="v.${i}.vip" data-ch="dbind"><option value="vip" ${b.vip==='vip'?'selected':''}>${VIPD.vip}</option><option value="vvip" ${b.vip==='vvip'?'selected':''}>${VIPD.vvip}</option></select>${errEl(`v.${i}.vip`)}</div>`:''}
  <div class="fld"><label class="l" for="bdWrite${i}">글쓰기 권한</label><select class="inp" id="bdWrite${i}" data-p="v.${i}.write" data-ch="dbind">${ws}</select><div class="fanl" style="margin-top:4px">${WHELP[b.write]}</div>${a.autoMsg?`<div class="errm warn" style="margin-top:6px">${esc(a.autoMsg)}</div>`:''}</div>
  <div class="fanl">게시글 ${cnt}개 · 공지 ${nn}개</div>`;
};
/* schedule (date based) */
ADMBODY.schedule=function(){
  const a=S.admin,d=a.draft.v,sm=a.schM||(a.schM={y:2026,m:10});
  const mk=sm.y+'.'+pad(sm.m+1);
  const idx=d.events.map((e,i)=>i).filter(i=>(d.events[i].date||'').slice(0,7)===mk).sort((x,y)=>{const p=d.events[x],q=d.events[y];return p.date===q.date?(p.start<q.start?-1:1):(p.date<q.date?-1:1)});
  const topt=(v,empty)=>(empty?`<option value="" ${v===''?'selected':''}>종료 미정</option>`:'')+TIMES.map(t=>`<option ${v===t?'selected':''}>${t}</option>`).join('');
  const kopt=v=>['정규','직급전','합방','특집'].map(k=>`<option ${v===k?'selected':''}>${k}</option>`).join('');
  const rows=idx.map(i=>{const e=d.events[i],dv=(e.date||'').replace(/\./g,'-');
    return `<div class="evr"><div class="evg"><div class="fld"><label class="l">날짜</label><input type="date" class="inp" value="${dv}" data-ch="evd" data-i="${i}" data-p="v.events.${i}.date" min="2026-01-01" max="2026-12-31">${errEl(`v.events.${i}.date`)}</div><div class="fld"><label class="l">시작</label><select class="inp" data-p="v.events.${i}.start" data-ch="dbind">${topt(e.start)}</select></div><div class="fld"><label class="l">종료</label><select class="inp" data-p="v.events.${i}.end" data-ch="dbind">${topt(e.end,1)}</select>${errEl(`v.events.${i}.end`)}</div><div class="fld"><label class="l">구분</label><select class="inp" data-p="v.events.${i}.kind" data-ch="dbind">${kopt(e.kind)}</select></div></div>
    <div class="arow"><div class="fld" style="flex:1;margin:0"><label class="l">제목</label>${finp(`v.events.${i}.title`,e.title||'',{max:20,ph:'방송 제목'})}<div class="cnt">${cntEl(`v.events.${i}.title`)}</div>${errEl(`v.events.${i}.title`)}</div><button class="btn out sm del evdel" data-act="evDel" data-arg="${i}">삭제</button></div></div>`}).join('');
  return `<div class="evadd"><h4 class="sub-h">일정 추가</h4><div class="evg"><div class="fld"><label class="l" for="evDate">날짜*</label><input type="date" class="inp" id="evDate" data-in="noop" min="2026-01-01" max="2026-12-31"></div><div class="fld"><label class="l" for="evStart">시작*</label><select class="inp" id="evStart" data-in="noop">${topt('20:00')}</select></div><div class="fld"><label class="l" for="evEnd">종료</label><select class="inp" id="evEnd" data-in="noop">${topt('',1)}</select></div><div class="fld"><label class="l" for="evKind">구분</label><select class="inp" id="evKind" data-in="noop">${kopt('정규')}</select></div></div>
   <div class="arow"><div class="fld" style="flex:1;margin:0"><label class="l" for="evTitle">제목 (비우면 '정규 방송')</label><input class="inp" id="evTitle" maxlength="20" placeholder="예: 크루 합방" data-in="evt"><div class="cnt" id="evTc">0/20</div></div><button class="btn pri" data-act="evAdd">+ 일정 추가</button></div><div class="errm" id="evErr"></div></div>
  <div class="evlist"><div class="arow evmh"><h4 class="sub-h" style="margin:0">${sm.y}년 ${sm.m+1}월 일정 (${idx.length}건)</h4><span class="sp"></span><button class="ib sm" data-act="evMonth" data-arg="-1" aria-label="이전 달">${ic('chevL',16)}</button><button class="ib sm" data-act="evMonth" data-arg="1" aria-label="다음 달">${ic('chevR',16)}</button></div>${idx.length?rows:'<div class="emptyb">이 달에는 등록된 일정이 없어요. 위에서 추가해 보세요</div>'}</div>
  <div class="fld" style="margin-top:14px"><label class="l">일정 메모</label>${finp('v.memo',d.memo,{max:40,ph:'예: 이번 주 토요일은 크루 합방'})}<div class="cnt">${cntEl('v.memo')}</div></div>
  <div class="ppanel" id="schprev"></div>`;
};
updSchPrev=function(){const e=$('#schprev');if(!e)return;const d=S.admin.draft.v;e.innerHTML='<b>미리보기</b><div>다음 방송: '+nextShow(d)+'</div><div class="fanl">정규 방송 시간: '+schTxt(d)+' · 등록된 일정 '+d.events.length+'건</div>'};
/* sigs admin */
SLOT.sigs={rw:400,rh:400,mb:3,label:'시그니처 이미지'};
IMGNOTE.sigs='권장 400×400px(1:1), 최대 3MB. 시그니처 탭 카드 이미지로 보여요. 프로토타입에서는 새로고침하면 사라져요.';
ADMBODY.sigs=function(){
  const d=S.admin.draft.v;
  const rows=d.map((s,i)=>`<div class="sgrow"><div class="sgimgc">${s.img?`<img src="${s.img.data}" alt="">`:`<span class="sgph">${ic('image',22)}</span>`}</div><div class="sgfs">
   <div class="sgg"><div class="fld"><label class="l">이름*</label>${finp(`v.${i}.n`,s.n,{max:12,ph:'시그니처 이름'})}${errEl(`v.${i}.n`)}</div><div class="fld"><label class="l">금액*(원)</label>${finp(`v.${i}.amt`,s.amt?fmt(s.amt):'',{num:1,ph:'예: 30,000'})}${errEl(`v.${i}.amt`)}</div></div>
   <div class="fld"><label class="l">설명</label>${finp(`v.${i}.desc`,s.desc||'',{max:40,ph:'설명 (0~40자)'})}</div>
   <div class="fld"><label class="l">링크 (유튜브, 선택)</label>${finp(`v.${i}.link`,s.link||'',{ph:'https://youtu.be/...'})}${errEl(`v.${i}.link`)}</div>
   <div class="arow"><button class="btn sec sm" data-act="pickImg" data-arg="sigs|${i}">${ic('image',14)}이미지 선택</button><button class="btn out sm" data-act="sampleImg" data-arg="sigs|${i}">샘플 이미지</button>${s.img?`<button class="btn out sm del" data-act="sgImgDel" data-arg="${i}">이미지 제거</button>`:''}<span class="sp"></span><label class="ck" style="margin:0">${tgl(`v.${i}.hot`,s.hot)} HOT</label><button class="btn out xs" data-act="sgUp" data-arg="${i}" ${i===0?'disabled':''} aria-label="위로 이동">▲</button><button class="btn out xs" data-act="sgDn" data-arg="${i}" ${i===d.length-1?'disabled':''} aria-label="아래로 이동">▼</button><button class="btn out xs del" data-act="sgDel" data-arg="${i}">삭제</button></div></div></div>`).join('');
  return `${d.length?rows:'<div class="emptyb">등록된 시그니처가 없어요</div>'}<p class="note">${IMGNOTE.sigs}<br>${FILEHINT}</p><div class="arow" style="margin-top:12px"><button class="btn sec" data-act="sgAdd" ${d.length>=30?'disabled':''}>+ 시그니처 추가</button><span class="fanl">${d.length}/30</span></div>`;
};
SLICE.sigs.set=(s,v)=>{s.sigs=v.map(x=>Object.assign({},x,{n:x.n.trim(),link:(x.link||'').trim()}))};
/* saved views */
SAVEDV.schedule=function(){
  const sc=S.station.schedule,up=evAll().filter(e=>e.date>TODAY);
  return `<div class="trow"><span class="tm">다음 방송</span><b>${nextShow()}</b></div><div class="trow"><span class="tm">정규 방송 시간</span><b>${schTxt(sc)}</b></div><div class="trow"><span class="tm">등록된 일정</span><b>전체 ${sc.events.length}건 · 다가오는 일정 ${up.length}건</b></div>${up.length?`<div class="ttab" style="margin-top:6px">${up.slice(0,8).map(e=>`<div class="trow"><span class="tm">${dkLabel(e.date)}</span><span>${e.start}${e.end?'~'+e.end:''}</span><span style="flex:1">${esc(e.title)}</span><span class="chip sm">${e.kind}</span></div>`).join('')}</div>`:'<div class="emptyb">다가오는 일정이 없어요</div>'}<div class="trow"><span class="tm">메모</span><span>${esc(sc.memo||'없음')}</span></div>`;
};
SAVEDV.sigs=function(){
  const l=S.station.sigs.slice().sort((a,b)=>a.amt-b.amt);
  return l.length?`<div class="svsig">${l.map(s=>`<div class="svs">${s.img?`<img src="${s.img.data}" alt="">`:`<span class="sgph">${ic('sparkle',18)}</span>`}<span class="svn"><b>${esc(s.n)}</b><small>${esc(s.desc||'')}</small></span><span class="svamt">${fmt(s.amt)}원</span>${s.link?`<span class="chip sm">${ic('youtube',12)}영상</span>`:''}${s.hot?'<span class="chip sm">HOT</span>':''}</div>`).join('')}</div>`:'<div class="emptyb">등록된 시그니처가 없어요</div>';
};
wrapAdm('schedule');wrapAdm('sigs');
DESC.schedule='날짜별 스케줄을 등록하면 홈 스케줄 캘린더와 다음 방송 안내에 반영돼요';
DESC.sigs='특정 금액 후원 시 나오는 시그니처의 이미지·금액·설명·영상 링크를 관리해요';
DESC.crew='아이디를 입력해 크루원을 추가하고, 방송국의 크루원 탭에 바로 반영해요';
/* validation */
const __admErr=admErr;
admErr=function(v){
  const a=S.admin,d=a.draft&&a.draft.v,e={};
  if(v==='schedule'){
    if(!d)return e;const seen={};
    d.events.forEach((x,i)=>{
      if(!/^\d{4}\.\d{2}\.\d{2}$/.test(x.date||''))e['v.events.'+i+'.date']='날짜를 선택해 주세요';
      else{const kk=x.date+' '+x.start;if(seen[kk]!==undefined)e['v.events.'+i+'.date']='같은 날짜·시간에 이미 일정이 있어요';seen[kk]=i}
      if((x.title||'').length>20)e['v.events.'+i+'.title']='제목은 20자까지 쓸 수 있어요';
      if(x.end&&x.end===x.start)e['v.events.'+i+'.end']='시작과 종료 시간이 같아요';
    });
    return e;
  }
  if(v==='sigs'){
    if(!d)return e;const seen={};
    d.forEach((s,i)=>{
      if(!s.n.trim())e['v.'+i+'.n']='이름을 입력해 주세요';
      if(!(s.amt>=1000&&s.amt<=20000000))e['v.'+i+'.amt']='1,000원~20,000,000원으로 입력해 주세요';
      else if(seen[s.amt]!==undefined)e['v.'+i+'.amt']='같은 금액의 시그니처가 있어요';
      seen[s.amt]=i;
      const L=(s.link||'').trim();if(L&&!ytId(L))e['v.'+i+'.link']='유튜브 주소(youtu.be 또는 youtube.com)를 입력해 주세요';
    });
    return e;
  }
  return __admErr(v);
};
/* admin actions */
Object.assign(A,{
 evAdd(){
  const a=S.admin,d=a.draft.v,er=$('#evErr');if(!er)return;
  const dv=$('#evDate').value,st=$('#evStart').value,en=$('#evEnd').value,ti=$('#evTitle').value.trim(),ki=$('#evKind').value;
  if(!dv){er.textContent='날짜를 선택해 주세요';return}
  const k=dv.replace(/-/g,'.');
  if(d.events.some(e=>e.date===k&&e.start===st)){er.textContent='같은 날짜·시간에 이미 일정이 있어요';return}
  if(en&&en===st){er.textContent='시작과 종료 시간이 같아요';return}
  if(d.events.length>=300){er.textContent='일정은 300건까지 등록할 수 있어요';return}
  d.events.push({id:'e'+(++S.station.seq),date:k,start:st,end:en,title:ti||'정규 방송',kind:ki});
  a.schM={y:+k.slice(0,4),m:+k.slice(5,7)-1};a.touched.add('events');admBodyRefresh();
  toast(dkLabel(k)+' 일정을 추가했어요. 저장하면 홈 캘린더에 반영돼요');
 },
 evDel(el,a){const s=S.admin;s.draft.v.events.splice(+a,1);s.touched.add('events');admBodyRefresh()},
 evMonth(el,a){const s=S.admin,m=s.schM||(s.schM={y:2026,m:10});m.m=Math.max(0,Math.min(11,m.m+(+a)));admBodyRefresh()},
 sgImgDel(el,a){S.admin.draft.v[+a].img=null;S.admin.touched.add('img');admBodyRefresh()},
 sgAdd(){const d=S.admin.draft.v;if(d.length>=30)return;d.push({id:++S.station.seq,n:'',amt:0,desc:'',hot:false,link:'',rec:50,pop:0,img:null});admBodyRefresh();const l=$$('.sgrow').pop();if(l)l.scrollIntoView({block:'center'})}
});
CH.evd=el=>{const s=S.admin,i=+el.dataset.i,v=el.value.replace(/-/g,'.');if(!v||!s.draft)return;s.draft.v.events[i].date=v;s.touched.add('v.events.'+i+'.date');admBodyRefresh()};

/* ===== 10차: 즉시 반영 5화면 저장 방식 통일 / 팔로워 문구 / 왕관 날개 ===== */
INST.length=0;
const DV=()=>S.admin.draft.v;
const pend=t=>`<span class="pend">${t||'저장 대기'}</span>`;
const permTxt=p=>Object.keys(PL).filter(k=>p[k]).map(k=>PL[k]).join('·')||'없음';
const tagRow=(w,extra)=>`<span class="s-tag">${esc(w)}${extra||''}</span>`;
/* ---- slices ---- */
SLICE.banwords={get:s=>({on:s.banwords.on,list:s.banwords.list}),set:(s,v)=>{s.banwords={on:v.on,list:v.list}}};
SLICE.crew={get:s=>({name:s.crew.name,list:s.crew.list}),set:(s,v)=>{s.crew={name:v.name.trim(),list:v.list}}};
SLICE.managers={get:s=>s.managers,set:(s,v)=>{s.managers=v}};
SLICE.sanctions={get:s=>s.sanctions,set:(s,v)=>{s.sanctions=v}};
SLICE.notices={get:s=>({pinned:s.pinned,removed:[],added:[]}),set:(s,v)=>{
  const map={};
  v.added.forEach(x=>{const id=x.bid+'-n'+Date.now()+Math.random().toString(36).slice(2,5);S.posts[x.bid].unshift({id:id,title:'[공지] '+x.title,author:actorName(),date:TODAY,views:0,comments:0,notice:true,img:false,isNew:false,no:0,likes:0,liked:false,rec:0,recd:false,link:'',body:x.content,cl:[]});map[x.tmp]=id});
  v.removed.forEach(k=>{const p=k.split('|'),x=(S.posts[p[0]]||[]).find(q=>q.id===p[1]);if(x){x.notice=false;x.no=(S.posts[p[0]].reduce((m,q)=>Math.max(m,q.no),0))+1}});
  let pn=v.pinned;if(pn&&map[pn.id])pn={b:pn.b,id:map[pn.id]};
  if(pn&&v.removed.indexOf(pn.b+'|'+pn.id)>=0)pn=null;
  s.pinned=pn;
}};
/* ---- banwords ---- */
ADMBODY.banwords=function(){
  const d=DV(),sv=S.station.banwords,removed=sv.list.map((w,i)=>[w,i]).filter(x=>d.list.indexOf(x[0])<0);
  return `<div class="arow"><b>금칙어 사용</b>${d.on!==sv.on?pend('변경 대기'):''}<span class="sp"></span><label class="ck" style="margin:0"><span>${d.on?'ON':'OFF'}</span><input type="checkbox" class="sw" data-ch="bwOn" ${d.on?'checked':''}></label></div>
  <p class="note">금칙어가 들어간 게시글·댓글은 등록되지 않아요<br><b>방송국 공통 목록이며 모든 게시판·댓글에 적용돼요</b></p>${d.on?'':'<p class="errm">필터가 꺼져 있어 적용되지 않아요</p>'}
  <div style="margin-top:12px">${ADLBL('금칙어 추가 (쉼표로 여러 개)','bwIn')}<div class="arow"><input class="inp" id="bwIn" maxlength="100" placeholder="금칙어 입력" data-in="noop"><button class="btn pri" data-act="bwAdd">추가</button></div><div class="errm" id="bwErr"></div></div>
  <div class="tagbox" style="margin-top:12px;${d.on?'':'opacity:.6'}"><div class="tbh">금칙어 ${d.list.length}/100</div><div class="s-tags">${d.list.length||removed.length?d.list.map((w,i)=>`<span class="s-tag">${esc(w)}${sv.list.indexOf(w)<0?pend('추가 대기'):''}<button data-act="bwDel" data-arg="${i}" aria-label="${esc(w)} 삭제">${ic('x',12)}</button></span>`).join('')+removed.map(x=>`<span class="s-tag rmd">${esc(x[0])}${pend('삭제 대기')}<button data-act="bwUndo" data-arg="${x[1]}" aria-label="되돌리기">${ic('check',12)}</button></span>`).join(''):'<span class="emptyt">등록된 금칙어가 없어요</span>'}</div></div>`;
};
SAVEDV.banwords=function(){const bw=S.station.banwords;return `<div class="trow"><span class="tm">금칙어 사용</span><b>${bw.on?'ON':'OFF'}</b></div><div class="s-tags" style="margin-top:8px">${bw.list.length?bw.list.map(w=>tagRow(w)).join(''):'<span class="emptyt">등록된 금칙어가 없어요</span>'}</div>`};
bwAddFn=function(){
  const d=DV(),i=$('#bwIn'),er=$('#bwErr');if(!i||!d)return;
  const parts=i.value.split(',').map(s=>s.trim()).filter(Boolean);
  if(!parts.length){er.textContent='금칙어를 입력해 주세요';return}
  if(parts.some(w=>w.length>20)){er.textContent='1~20자로 입력해 주세요';return}
  const add=[],dups=[];
  parts.forEach(w=>{if(d.list.some(x=>norm(x)===norm(w))||add.some(x=>norm(x)===norm(w)))dups.push(w);else add.push(w)});
  if(!add.length){er.textContent='이미 등록된 금칙어예요: '+dups.join(', ');return}
  if(d.list.length+add.length>100){er.textContent='금칙어는 100개까지 등록할 수 있어요';return}
  d.list=add.concat(d.list);admBodyRefresh();
  const n=$('#bwIn');if(n){n.focus({preventScroll:true});if(dups.length)$('#bwErr').textContent='이미 등록된 금칙어예요: '+dups.join(', ')}
};
/* ---- crew ---- */
ADMBODY.crew=function(){
  const d=DV(),sv=S.station.crew,removed=sv.list.filter(m=>!d.list.some(x=>x.id===m.id));
  const row=(m,rm)=>`<div class="trow${rm?' rmd':''}"><span class="tn">${av(m.n,32)}<span><b>${esc(m.n)}</b>${rm?pend('삭제 대기'):sv.list.some(x=>x.id===m.id)?'':pend('추가 대기')}<small>@${m.id}</small></span></span><span class="rl${m.role==='크루장'?' cap':''}">${m.role}</span>${m.role==='크루장'?'<span class="cbd cap">대표</span>':`<select class="inp crsel" data-ch="crewRank" data-id="${m.id}" aria-label="${esc(m.n)} 직책" ${rm?'disabled':''}>${RKS.map(r=>`<option ${(m.rank||'인턴')===r?'selected':''}>${r}</option>`).join('')}</select>${(sv.list.find(x=>x.id===m.id)||{}).rank!==undefined&&(sv.list.find(x=>x.id===m.id)).rank!==(m.rank||'인턴')?pend('직책 변경 대기'):''}`}<span class="sp"></span>${rm?`<button class="btn out xs" data-act="crewUndo" data-arg="${m.id}">되돌리기</button>`:`<button class="btn out xs del" data-act="crewDel" data-arg="${m.id}" ${m.live===2?'disabled title="크루장은 삭제할 수 없어요"':''}>삭제</button>`}</div>`;
  return `<div>${ADLBL('크루원 아이디','crewIn')}<div class="arow"><input class="inp" id="crewIn" maxlength="30" placeholder="아이디 입력 (예: sori_pop)" data-in="noop"><button class="btn pri" data-act="crewAdd">추가</button></div><div class="errm" id="crewErr"></div><p class="note">방송국이 있는 스트리머만 추가할 수 있어요. 추가해 볼 수 있는 예시 아이디: sori_pop, night_owl, cookie_bear, moon_fox, star_mong</p></div>
  <div class="fld" style="margin-top:12px"><label class="l">크루명 (1~10자)${d.name!==sv.name?pend('변경 대기'):''}</label>${finp('v.name',d.name,{max:10})}${errEl('v.name')}</div>
  <h4 class="sub-h" style="margin-top:16px">크루원 ${d.list.length}/20 · ${esc(d.name)}</h4>
  ${d.list.length||removed.length?`<div class="ttab">${d.list.map(m=>row(m,0)).join('')}${removed.map(m=>row(m,1)).join('')}</div>`:'<div class="emptyb">등록된 크루원이 없어요</div>'}`;
};
SAVEDV.crew=function(){const cr=S.station.crew;return `<div class="trow"><span class="tm">크루명</span><b>${esc(cr.name)}</b></div><div class="ttab">${cr.list.map(m=>`<div class="trow"><span class="tn">${av(m.n,28)}<span><b>${esc(m.n)}</b><small>@${m.id}</small></span></span><span class="rl${m.role==='크루장'?' cap':''}">${m.role}</span><span class="cbd${m.role==='크루장'?' cap':''}">${esc(crewRankOf(m))}</span></div>`).join('')}</div>`};
Object.assign(A,{
 bwDel(el,a){DV().list.splice(+a,1);admBodyRefresh()},
 bwUndo(el,a){const w=S.station.banwords.list[+a];if(w!==undefined&&DV().list.indexOf(w)<0)DV().list.push(w);admBodyRefresh()},
 crewAdd(){
  const d=DV(),i=$('#crewIn'),er=$('#crewErr');if(!i||!d||!canSt())return;const v=i.value.trim().toLowerCase();
  const fail=m=>{er.textContent=m;i.focus({preventScroll:true})};
  if(!v)return fail('아이디를 입력해 주세요');
  const u=allUsers().find(x=>x.id.toLowerCase()===v);
  if(!u)return fail("'"+i.value.trim()+"'와 일치하는 유저가 없어요");
  if(u.id==='funsangsa')return fail('본인은 이미 크루장이에요');
  if(d.list.some(m=>m.id===u.id))return fail('이미 크루원이에요');
  if(S.station.sanctions.some(s=>s.id===u.id))return fail('제재 중인 유저는 크루원으로 추가할 수 없어요');
  if(!u.st)return fail('방송국이 있는 스트리머만 크루원으로 추가할 수 있어요');
  if(d.list.length>=20)return fail('크루원은 20명까지 추가할 수 있어요');
  d.list.push({id:u.id,n:u.n,role:'크루원',live:0,fav:1000+(u.id.length*137)%2000,intro:'새로 합류한 크루원이에요',lt:''});
  admBodyRefresh();const n=$('#crewIn');if(n)n.focus({preventScroll:true});
 },
 crewDel(el,a){const d=DV(),i=d.list.findIndex(x=>x.id===a);if(i<0||d.list[i].live===2||!canSt())return;d.list.splice(i,1);admBodyRefresh()},
 crewUndo(el,a){const m=S.station.crew.list.find(x=>x.id===a),d=DV();if(m&&!d.list.some(x=>x.id===a))d.list.push(clone(m));admBodyRefresh()},
 crewRename(){}
});
CH.bwOn=el=>{DV().on=el.checked;admBodyRefresh()};
/* ---- managers ---- */
function mresHTML(){
  const a=S.admin;if(!a.mres)return '';
  let h=a.mres.map(u=>{
    let msg='';
    if(u.id==='funsangsa')msg='본인은 지정할 수 없어요';
    else if(DV().some(m=>m.id===u.id))msg='이미 매니저예요';
    else if(S.station.sanctions.some(s=>s.id===u.id))msg='제재 중인 유저는 매니저로 지정할 수 없어요';
    const act=msg?`<small class="fanl">${msg}</small>`:`<button class="btn sec sm" data-act="mgrPick" data-arg="${u.id}">선택</button>`;
    return uRow(u,act)}).join('');
  if(a.mpick){const u=allUsers().find(x=>x.id===a.mpick.id),p=a.mpick.perm,none=!Object.values(p).some(Boolean);
    h+=`<div class="ppanel"><b>${esc(u.n)}님 권한</b>${Object.keys(PL).map(k=>`<label class="ck"><input type="checkbox" data-ch="mgrNewPerm" data-k="${k}" ${p[k]?'checked':''}>${PL[k]} <small class="fanl">${k==='station'?'방송국 관리 메뉴에 들어올 수 있어요':k==='chat'?'채팅 관리·유저 제재를 할 수 있어요':'게시판 글쓰기에서 공지 등록·상단 고정을 할 수 있어요'}</small></label>`).join('')}${none?'<div class="errm">권한을 1개 이상 선택해 주세요</div>':''}<div class="arow" style="margin-top:8px"><button class="btn pri" data-act="mgrAdd" ${none?'disabled':''}>매니저 지정(저장 대기)</button></div></div>`}
  return h;
}
ADMBODY.managers=function(){
  const a=S.admin,d=DV(),sv=S.station.managers,removed=sv.filter(m=>!d.some(x=>x.id===m.id));
  const row=(m,i)=>{const s=sv.find(x=>x.id===m.id);const st=!s?pend('지정 대기'):JSON.stringify(s.perm)!==JSON.stringify(m.perm)?pend('권한 변경 대기'):'';
    return `<div class="trow"><span class="tn">${av(m.n,32)}<span><b>${esc(m.n)}</b>${st}<small>@${m.id} · 지정 ${m.since}</small></span></span><span class="sp"></span>${Object.keys(PL).map(k=>`<label class="pl">${PL[k]}<input type="checkbox" class="sw" data-ch="mgrPerm" data-i="${i}" data-k="${k}" ${m.perm[k]?'checked':''}></label>`).join('')}<button class="btn out xs del" data-act="mgrDel" data-arg="${i}">해제</button>${errEl(`v.${i}.perm`)}</div>`};
  return `<h4 class="sub-h">매니저 추가</h4><div class="arow"><input class="inp" id="mq" data-in="mq" placeholder="아이디 또는 닉네임 검색" value="${esc(a.mq)}"><button class="btn sec" data-act="mgrSearch">검색</button></div><div class="errm" id="mqErr">${esc(a.merr||'')}</div><div id="mres">${mresHTML()}</div>
  <h4 class="sub-h" style="margin-top:16px">매니저 목록 ${d.length}/10</h4>
  ${d.length||removed.length?`<div class="ttab">${d.map(row).join('')}${removed.map(m=>`<div class="trow rmd"><span class="tn">${av(m.n,32)}<span><b>${esc(m.n)}</b>${pend('해제 대기')}<small>@${m.id}</small></span></span><span class="sp"></span><button class="btn out xs" data-act="mgrUndo" data-arg="${m.id}">되돌리기</button></div>`).join('')}</div>`:'<div class="emptyb">지정된 매니저가 없어요. 위에서 아이디를 검색해 추가하세요</div>'}`;
};
SAVEDV.managers=function(){const ms=S.station.managers;return ms.length?`<div class="ttab">${ms.map(m=>`<div class="trow"><span class="tn">${av(m.n,28)}<span><b>${esc(m.n)}</b><small>@${m.id} · 지정 ${m.since}</small></span></span><span class="tm">${permTxt(m.perm)}</span></div>`).join('')}</div>`:'<div class="emptyb">지정된 매니저가 없어요</div>'};
Object.assign(A,{
 mgrAdd(){const a=S.admin,p=a.mpick,d=DV();if(!p||!Object.values(p.perm).some(Boolean))return;if(d.length>=10){toast('매니저는 10명까지 지정할 수 있어요');return}
  const u=allUsers().find(x=>x.id===p.id);d.unshift({id:u.id,n:u.n,since:TODAY,perm:Object.assign({},p.perm)});a.mres=null;a.mpick=null;a.mq='';a.merr='';admBodyRefresh()},
 mgrDel(el,a){DV().splice(+a,1);admBodyRefresh()},
 mgrUndo(el,a){const m=S.station.managers.find(x=>x.id===a),d=DV();if(m&&!d.some(x=>x.id===a))d.push(clone(m));admBodyRefresh()}
});
CH.mgrPerm=el=>{const d=DV(),m=d[+el.dataset.i];if(!m)return;m.perm[el.dataset.k]=el.checked;S.admin.touched.add('v.'+el.dataset.i+'.perm');admBodyRefresh()};
/* ---- sanctions ---- */
function sresHTML(){
  const a=S.admin;if(!a.sres)return '';
  let h=a.sres.map(u=>{
    let msg='';
    if(u.id==='funsangsa')msg='스트리머는 제재할 수 없어요';
    else if(u.id===actorId())msg='본인은 제재할 수 없어요';
    else if(S.station.managers.some(m=>m.id===u.id))msg='매니저는 먼저 매니저에서 해제한 뒤 제재할 수 있어요';
    else if(DV().some(s=>s.id===u.id))msg='이미 제재 중인 유저예요. 아래 목록에서 확인하세요';
    const act=msg?`<small class="fanl">${msg}</small>`:`<button class="btn sec sm" data-act="sanPick" data-arg="${u.id}">제재</button>`;
    return uRow(u,act)}).join('');
  if(a.spick){const u=allUsers().find(x=>x.id===a.spick.id),p=a.spick;
    h+=`<div class="ppanel"><b>${esc(u.n)}님 제재</b><div class="fld"><label class="l">제재 유형</label><div class="arow">${Object.keys(TL).map(k=>`<label class="ck" style="margin:0"><input type="radio" name="sty" data-ch="sanType" value="${k}" ${p.type===k?'checked':''}>${TL[k]}</label>`).join('')}</div></div>
    <div class="fld"><label class="l">기간</label><div class="arow">${['1일','7일','30일','영구'].map(k=>`<label class="ck" style="margin:0"><input type="radio" name="sdu" data-ch="sanDur" value="${k}" ${p.dur===k?'checked':''}>${k}</label>`).join('')}</div></div>
    <div class="fld"><label class="l">메모(블랙 사유)*</label><textarea class="inp" id="smemo" rows="3" maxlength="100" data-in="smemo" placeholder="제재 사유를 입력하세요. 관리자만 볼 수 있어요">${esc(p.memo)}</textarea><div class="cnt" id="smc">${p.memo.length}/100</div><div class="errm" id="smerr"></div></div>
    <button class="btn pri dng" data-act="sanGo">제재 추가(저장 대기)</button></div>`}
  return h;
}
ADMBODY.sanctions=function(){
  const a=S.admin,d=DV(),sv=S.station.sanctions,f=a.sfil;
  const removed=sv.filter(s=>!d.some(x=>x.id===s.id));
  const match=s=>f==='전체'||(f==='채팅'&&s.type==='chat')||(f==='게시판'&&s.type==='board')||(f==='차단'&&s.type==='ban');
  const row=(s,rm)=>`<div class="trow${rm?' rmd':''}${a.hl===s.id?' hl':''}" data-sid="${s.id}"><span class="tn">${av(s.n,32)}<span><b>${esc(s.n)}</b>${rm?pend('해제 대기'):sv.some(x=>x.id===s.id)?'':pend('제재 대기')}<small>@${s.id}</small></span></span><span class="rb" style="border-color:#ff6363;color:#ff6363">${TL[s.type]}</span><span class="tm">${s.exp?'~'+s.exp:'영구'}</span><span class="tm memo" title="${esc(s.memo)}">${esc(s.memo)}</span><span class="tm">${esc(s.by)} · ${s.date}</span>${rm?`<button class="btn out xs" data-act="sanUndo" data-arg="${s.id}">되돌리기</button>`:`<button class="btn out xs del" data-act="sanDel" data-arg="${s.id}">해제</button>`}</div>`;
  const l=d.filter(match).map(s=>row(s,0)).join('')+removed.filter(match).map(s=>row(s,1)).join('');
  return `<h4 class="sub-h">유저 검색</h4><div class="arow"><input class="inp" id="sq" data-in="sq" placeholder="아이디 또는 닉네임 검색" value="${esc(a.sq)}"><button class="btn sec" data-act="sanSearch">검색</button></div><div class="errm" id="sqErr">${esc(a.serr||'')}</div><div id="sres">${sresHTML()}</div>
  <h4 class="sub-h" style="margin-top:16px">제재 목록 ${d.length}</h4><div class="s-chips">${['전체','채팅','게시판','차단'].map(x=>`<button class="chip${f===x?' act':''}" data-act="sanFil" data-arg="${x}">${x}</button>`).join('')}</div>
  ${!d.length&&!removed.length?'<div class="emptyb">제재 중인 유저가 없어요</div>':!l?'<div class="emptyb">해당 유형의 제재가 없어요</div>':`<div class="ttab">${l}</div>`}`;
};
SAVEDV.sanctions=function(){const ss=S.station.sanctions;return ss.length?`<div class="ttab">${ss.map(s=>`<div class="trow"><span class="tn">${av(s.n,28)}<span><b>${esc(s.n)}</b><small>@${s.id}</small></span></span><span class="rb" style="border-color:#ff6363;color:#ff6363">${TL[s.type]}</span><span class="tm">${s.exp?'~'+s.exp:'영구'}</span><span class="tm memo" title="${esc(s.memo)}">${esc(s.memo)}</span></div>`).join('')}</div>`:'<div class="emptyb">제재 중인 유저가 없어요</div>'};
Object.assign(A,{
 sanGo(){
  const a=S.admin,p=a.spick,d=DV();if(!p)return;const memo=($('#smemo')?$('#smemo').value:p.memo).trim();p.memo=memo;
  if(!memo){$('#smerr').textContent='제재 사유를 입력해 주세요';return}
  const u=allUsers().find(x=>x.id===p.id),days={'1일':1,'7일':7,'30일':30}[p.dur];
  d.unshift({id:u.id,n:u.n,type:p.type,dur:p.dur,exp:days?dateAdd(days):null,memo:memo,by:actorName(),date:TODAY});
  a.spick=null;a.sres=null;a.sq='';a.serr='';admBodyRefresh();
 },
 sanDel(el,a){const d=DV(),i=d.findIndex(x=>x.id===a);if(i>=0)d.splice(i,1);admBodyRefresh()},
 sanUndo(el,a){const s=S.station.sanctions.find(x=>x.id===a),d=DV();if(s&&!d.some(x=>x.id===a))d.push(clone(s));admBodyRefresh()}
});
/* ---- notices ---- */
ADMBODY.notices=function(){
  const d=DV(),sv=S.station.pinned,l=allNotices();
  const pinSame=JSON.stringify(d.pinned)===JSON.stringify(sv);
  const rm=(b,p)=>d.removed.indexOf(b+'|'+p)>=0;
  return `<div class="arow"><h4 class="sub-h" style="margin:0">공지 목록</h4><span class="sp"></span><button class="btn sec sm" data-act="ntWrite">+ 공지 작성</button></div>
  <div class="ttab" style="margin-top:10px"><label class="trow"><input type="radio" name="ntp" data-ch="ntPin" value="" ${!d.pinned?'checked':''}><span class="tm"><b>홈에 고정하지 않음</b></span>${pinSame?'':pend('고정 변경 대기')}</label>
  ${l.map(x=>{const k=x.b.id+'|'+x.p.id,r=rm(x.b.id,x.p.id);return `<div class="trow${r?' rmd':''}"><input type="radio" name="ntp" data-ch="ntPin" value="${k}" ${d.pinned&&d.pinned.id===x.p.id?'checked':''} ${r?'disabled':''} aria-label="홈 고정"><span class="chip sm">${esc(x.b.name)}</span><span class="tm" style="flex:1"><b>${esc(x.p.title)}</b></span><span class="tm">${esc(x.p.author)} · ${x.p.date}</span>${r?pend('해제 대기')+`<button class="btn out xs" data-act="ntUndo" data-arg="${k}">되돌리기</button>`:`<button class="btn out xs del" data-act="ntDel" data-arg="${k}">공지 해제</button>`}</div>`}).join('')}
  ${d.added.map(x=>`<div class="trow"><input type="radio" name="ntp" data-ch="ntPin" value="${x.bid}|${x.tmp}" ${d.pinned&&d.pinned.id===x.tmp?'checked':''} aria-label="홈 고정"><span class="chip sm">${esc(bnm(x.bid))}</span><span class="tm" style="flex:1"><b>[공지] ${esc(x.title)}</b></span><span class="tm">${esc(actorName())} · ${TODAY}</span>${pend('등록 대기')}<button class="btn out xs" data-act="ntCancel" data-arg="${x.tmp}">취소</button></div>`).join('')}
  ${!l.length&&!d.added.length?'<div class="emptyb">등록된 공지가 없어요</div>':''}</div>`;
};
SAVEDV.notices=function(){const l=allNotices(),pin=S.station.pinned;return l.length?`<div class="ttab">${l.map(x=>`<div class="trow"><span class="chip sm">${esc(x.b.name)}</span><span class="tm" style="flex:1"><b>${esc(x.p.title)}</b></span>${pin&&pin.id===x.p.id?'<span class="chip sm">홈 고정</span>':''}<span class="tm">${esc(x.p.author)} · ${x.p.date}</span></div>`).join('')}</div>`:'<div class="emptyb">등록된 공지가 없어요</div>'};
Object.assign(A,{
 ntSubmit(el){
  const ov=el.closest('.ov-back'),bid=$('#nwb',ov).value,t=$('#nwt',ov).value.trim(),c=$('#nwc',ov).value.trim(),pin=$('#nwp',ov).checked;
  let ok=true;$('#nwte',ov).textContent=t?'':(ok=false,'제목을 입력해 주세요');$('#nwce',ov).textContent=c?'':(ok=false,'내용을 입력해 주세요');if(!ok)return;
  const hit=banHit(t,c);if(hit){const m="금칙어가 포함되어 있어요: '"+hit+"'";if(banHit(t))$('#nwte',ov).textContent=m;else $('#nwce',ov).textContent=m;toast('금칙어가 포함되어 등록할 수 없어요');return}
  const d=DV(),tmp='t'+Date.now();d.added.push({tmp:tmp,bid:bid,title:t,content:c,pin:pin});if(pin)d.pinned={b:bid,id:tmp};
  closeModal(ov);admBodyRefresh();toast('공지를 대기 목록에 추가했어요. [저장]하면 등록돼요');
 },
 ntDel(el,a){const d=DV();if(d.removed.indexOf(a)<0)d.removed.push(a);if(d.pinned&&d.pinned.b+'|'+d.pinned.id===a)d.pinned=null;admBodyRefresh()},
 ntUndo(el,a){const d=DV(),i=d.removed.indexOf(a);if(i>=0)d.removed.splice(i,1);admBodyRefresh()},
 ntCancel(el,a){const d=DV();d.added=d.added.filter(x=>x.tmp!==a);if(d.pinned&&d.pinned.id===a)d.pinned=null;admBodyRefresh()}
});
CH.ntPin=el=>{const v=el.value;DV().pinned=v?{b:v.split('|')[0],id:v.split('|')[1]}:null;admBodyRefresh()};
['banwords','crew','managers','sanctions','notices'].forEach(wrapAdm);
/* ---- validation / confirm / log ---- */
const __admErr2=admErr;
admErr=function(v){
  const a=S.admin,d=a.draft&&a.draft.v;
  if(v==='crew'){const e={};if(d&&!d.name.trim())e['v.name']='크루명을 입력해 주세요';return e}
  if(v==='managers'){const e={};if(d)d.forEach((m,i)=>{if(!Object.values(m.perm).some(Boolean))e['v.'+i+'.perm']='권한을 1개 이상 선택하거나 목록에서 해제해 주세요'});return e}
  if(v==='banwords'||v==='sanctions'||v==='notices')return {};
  return __admErr2(v);
};
const __admSave=admSave;
admSave=function(){
  const a=S.admin;
  if(a.on&&a.view==='sanctions'&&a.draft&&!a._cf&&!a.saveLock){
    const sv=S.station.sanctions,d=a.draft.v,add=d.filter(x=>!sv.some(s=>s.id===x.id)),rem=sv.filter(s=>!d.some(x=>x.id===s.id));
    if(add.length||rem.length){
      confirmM('제재 변경을 저장할까요?','제재 추가 '+add.length+'건 · 해제 '+rem.length+'건이 시청자 화면에 바로 반영돼요'+(add.length?'<br>'+add.map(x=>esc(x.n)+' '+TL[x.type]+' '+x.dur).join(', '):''),'저장',()=>{a._cf=1;try{admSave()}finally{a._cf=0}});
      return false;
    }
  }
  return __admSave();
};
const LOGMAP={banwords:['게시판','금칙어'],crew:['기본설정','크루원'],managers:['권한','매니저'],sanctions:['권한','유저 제재'],notices:['부가','공지']};
const LOGDIFF={
 banwords:(b,d)=>{const t=[];const ad=d.list.filter(w=>b.list.indexOf(w)<0),rm=b.list.filter(w=>d.list.indexOf(w)<0);if(ad.length)t.push('금칙어 추가: '+ad.join(', '));if(rm.length)t.push('금칙어 삭제: '+rm.join(', '));if(b.on!==d.on)t.push('금칙어 필터 '+(d.on?'ON':'OFF'));return t},
 crew:(b,d)=>{const t=[];d.list.filter(m=>!b.list.some(x=>x.id===m.id)).forEach(m=>t.push(m.n+' 크루원 추가'));b.list.filter(m=>!d.list.some(x=>x.id===m.id)).forEach(m=>t.push(m.n+' 크루원 삭제'));if(b.name!==d.name.trim())t.push('크루명 변경: '+d.name.trim());return t},
 managers:(b,d)=>{const t=[];d.forEach(m=>{const o=b.find(x=>x.id===m.id);if(!o)t.push(m.n+' 매니저 지정('+permTxt(m.perm)+')');else Object.keys(PL).forEach(k=>{if(!!o.perm[k]!==!!m.perm[k])t.push(m.n+': '+PL[k]+' 권한 '+(m.perm[k]?'부여':'해제'))})});b.filter(m=>!d.some(x=>x.id===m.id)).forEach(m=>t.push(m.n+' 매니저 해제'));return t},
 sanctions:(b,d)=>{const t=[];d.filter(s=>!b.some(x=>x.id===s.id)).forEach(s=>t.push(s.n+' '+TL[s.type]+' '+s.dur+' ('+s.memo+')'));b.filter(s=>!d.some(x=>x.id===s.id)).forEach(s=>t.push(s.n+' 제재 해제 (사유: '+s.memo+')'));return t},
 notices:(b,d)=>{const t=[];d.added.forEach(x=>t.push('공지 작성: [공지] '+x.title+(x.pin?' (홈 고정)':'')));d.removed.forEach(k=>{const p=k.split('|'),x=(S.posts[p[0]]||[]).find(q=>q.id===p[1]);t.push('공지 해제: '+(x?x.title:k))});if(JSON.stringify(b.pinned)!==JSON.stringify(S.station.pinned)&&!d.added.some(x=>x.pin))t.push(S.station.pinned?'홈 상단 고정 변경':'홈 상단 고정 해제');return t}
};
const __als=admLogSave;
admLogSave=function(v,before){
  if(!LOGDIFF[v])return __als(v,before);
  const g=LOGMAP[v],t=LOGDIFF[v](before,S.admin.draft.v);
  (t.length?t:[g[1]+' 변경']).forEach(x=>logAdd(g[0],g[1],x));
};
/* ---- schedule summary: 더보기 ---- */
SAVEDV.schedule=function(){
  const sc=S.station.schedule,up=evAll().filter(e=>e.date>TODAY),more=!!S.admin.svMore,shown=more?up:up.slice(0,8);
  return `<div class="trow"><span class="tm">다음 방송</span><b>${nextShow()}</b></div><div class="trow"><span class="tm">정규 방송 시간</span><b>${schTxt(sc)}</b></div><div class="trow"><span class="tm">등록된 일정</span><b>전체 ${sc.events.length}건 · 다가오는 일정 ${up.length}건</b></div>${up.length?`<div class="ttab" style="margin-top:6px">${shown.map(e=>`<div class="trow"><span class="tm">${dkLabel(e.date)}</span><span>${e.start}${e.end?'~'+e.end:''}</span><span style="flex:1">${esc(e.title)}</span><span class="chip sm">${e.kind}</span></div>`).join('')}</div>${up.length>8?`<button class="more" data-act="svMore">${more?'접기 ▲':'더 보기 ('+shown.length+'/'+up.length+') +'}</button>`:''}`:'<div class="emptyb">다가오는 일정이 없어요</div>'}<div class="trow"><span class="tm">메모</span><span>${esc(sc.memo||'없음')}</span></div>`;
};
A.svMore=()=>{S.admin.svMore=!S.admin.svMore;admBodyRefresh()};
/* ---- followers wording (M-2) ---- */
subView=function(){
  const u=S.ui;let l=SUBS.slice();
  if(u.subTier==='팬')l=l.filter(s=>fanOf(s.n));else if(u.subTier==='일반')l=l.filter(s=>!fanOf(s.n));
  l=l.sort((a,b)=>u.subSort==='dur'?b.mo-a.mo:(a.start<b.start?1:-1));
  return `<div data-qa="L-02"><div class="vh"><h2>팔로워 ${fmt(S.favCount)}</h2><p>방송국을 즐겨찾기한 유저예요 · 최근 ${SUBS.length}명만 보여요</p></div>
   <div class="s-chips"><button class="chip${u.subSort==='dur'?' act':''}" data-act="ssort" data-arg="dur">즐겨찾기 오래된순</button><button class="chip${u.subSort==='rec'?' act':''}" data-act="ssort" data-arg="rec">최근 즐겨찾기순</button><span class="sepv"></span>${['전체','팬','일반'].map(t=>`<button class="chip${u.subTier===t?' act':''}" data-act="stier" data-arg="${t}">${t}</button>`).join('')}</div>
   ${l.length?`<div class="sgrid">${l.map(s=>`<button class="sfan" data-act="fan" data-arg="${s.n}">${av(s.n,40)}<span><span class="nm">${esc(s.n)}${fanOf(s.n)?'<span class="tb tr1">팬</span>':''}</span><small>즐겨찾기 ${s.mo}개월 · ${s.start}</small></span></button>`).join('')}</div>`:'<div class="empty">해당하는 팔로워가 없어요</div>'}</div>`;
};

/* ================= 11차: 쪽지 · 누적 후원 · 후원 랭커 · 스케줄 · 쇼츠 슬라이드 · 게임형 랭크 엠블럼 ================= */
/* ---- 랭크 엠블럼(금속 그라디언트 + 다층 깃털 날개) 정의 ---- */
(function(){
  const lg=(id,st)=>`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${st.map(s=>`<stop offset="${s[0]}" stop-color="${s[1]}"/>`).join('')}</linearGradient>`;
  const FE='M0 0C-10-14-50-18-98-8L-106 1C-60 4-16 10 0 0Z';
  const CFG=[null,{a:[64,52,40,28,16,4,-8,-20],s:[.46,.6,.74,.88,1,.98,.84,.66]},{a:[58,44,30,16,2,-12,-24],s:[.5,.68,.84,1,.96,.8,.62]},{a:[54,38,22,6,-10,-24],s:[.52,.74,.94,1,.82,.62]}];
  const MET=[null,['mtG','mtG2'],['mtS','mtS2'],['mtB','mtB2']];
  const fe=(a,s,f)=>`<path d="${FE}" transform="rotate(${a}) scale(${s})" fill="url(#${f})" stroke="rgba(0,0,0,.78)" stroke-width="1" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>`;
  const vein=(a,s)=>`<path d="M-8 -.5L-92 -4.5" transform="rotate(${a}) scale(${s})" stroke="rgba(255,255,255,.55)" stroke-width="1" fill="none" vector-effect="non-scaling-stroke" stroke-linecap="round"/>`;
  function grp(k){
    const c=CFG[k],m=MET[k],idx=c.a.map((a,i)=>i).sort((x,y)=>c.s[y]-c.s[x]);
    let p1=idx.map(i=>fe(c.a[i],c.s[i],m[0])+vein(c.a[i],c.s[i])).join('');
    let p2=idx.map(i=>fe(c.a[i]+5,c.s[i]*.58,m[1])).join('');
    let p3=k===1?c.a.map((a,i)=>fe(a-3,c.s[i]*.3,m[0])).join(''):'';
    return `<g id="gkw${k}"><g transform="translate(112 60)">${p1}${p2}${p3}</g></g>`;
  }
  document.body.insertAdjacentHTML('afterbegin',`<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
${lg('mtG',[[0,'#fee6c6'],[.32,'#f7df4e'],[.68,'#ffa938'],[1,'#663a00']])}${lg('mtG2',[[0,'#ffc06e'],[.5,'#9c5800'],[1,'#663a00']])}
${lg('mtS',[[0,'#ffffff'],[.32,'#dfe5ed'],[.68,'#969da8'],[1,'#515e71']])}${lg('mtS2',[[0,'#c2c9d1'],[.5,'#7c8594'],[1,'#2a2d3f']])}
${lg('mtB',[[0,'#ffd49c'],[.32,'#ff9b61'],[.68,'#9c5800'],[1,'#592100']])}${lg('mtB2',[[0,'#ff9b61'],[.5,'#663a00'],[1,'#361e00']])}
${grp(1)}${grp(2)}${grp(3)}</defs></svg>`);
})();
function rankList(p){return rankData('don',p==='all'?'all':'m11').slice(0,10).map(x=>x.f)}
const GKT={1:'LEGEND',2:'MASTER',3:'ELITE'};
function gkEmblem(k,name,mini){
  const w=s=>`<svg class="wg ${s}" viewBox="0 0 120 100" aria-hidden="true" focusable="false"><use href="#gkw${k}"/></svg>`;
  return `<span class="gke gk${k}${mini?' mini':''}">${w('l')}${w('r')}<span class="gkf"><span class="gki">${av(name,64)}</span></span><span class="gkg"></span><span class="gkn"><i>${k}</i></span></span>`;
}
/* ---- 후원 랭커 데이터(100명, 시드 생성) ---- */
const BIGW=['야근','출근','퇴근','결재','회식','월급','승진','연차','칼퇴','탕비실','보너스','복사기','사원증','회의','점심','연말'];
const BIGN=['요정','전사','러버','장인','대장','지킴이','수집가','담당','메이트','마스터','주민','참모','연구원','왕','귀신','도사'];
const BIGUSERS=(()=>{
  const ids=allUsers();
  const base=FANS.map((f,i)=>({n:f.n,t:f.t,title:f.title,id:(ids.find(u=>u.n===f.n)||{id:'fan_'+(i+1)}).id,all:AMT_ALL[i]}));
  const r=rng(1103),combos=[];
  BIGW.forEach(x=>BIGN.forEach(y=>combos.push(x+y)));
  for(let i=combos.length-1;i>0;i--){const j=Math.floor(r()*(i+1));const t=combos[i];combos[i]=combos[j];combos[j]=t}
  const names=combos.filter(n=>!FANS.some(f=>f.n===n)&&!ids.some(u=>u.n===n)).slice(0,80);
  const ex=names.map((n,j)=>({n:n,t:'dirt',title:'',id:'user'+(31000+j*173),all:Math.max(1000,Math.round((14400-13300*Math.pow(j/79,1.15))/100)*100)}));
  return base.concat(ex);
})();
const idOf=n=>{const u=BIGUSERS.find(x=>x.n===n);return u?u.id:(n===actorName()?actorId():'')};
const bigCache={};
function bigBase(per){
  if(bigCache[per])return bigCache[per];
  let rows;
  if(per==='all')rows=BIGUSERS.map(u=>({u:u,v:u.all}));
  else{const r=rng(+per.slice(1)*977+31);rows=BIGUSERS.map(u=>({u:u,v:Math.max(1000,Math.round(u.all*(0.04+0.2*r())/100)*100)}))}
  rows.sort((a,b)=>b.v-a.v);
  return bigCache[per]=rows;
}
function bigList(per){
  const rows=bigBase(per).map(x=>({f:x.u,v:x.v}));
  if(S.loggedIn&&S.donTotal>0&&(per==='all'||per==='m11')){
    rows.push({f:{n:actorName(),t:S.myTier==='none'?'dirt':S.myTier,title:'',id:actorId()},v:S.donTotal,me:true});
    rows.sort((a,b)=>b.v-a.v);
  }
  return rows;
}
fanPop=function(anchor,name){
  const f=fanOf(name),s=SUBS.find(x=>x.n===name),bu=BIGUSERS.find(x=>x.n===name);
  const t=f?f.t:bu?bu.t:name===actorName()?(S.myTier==='none'?'dirt':S.myTier):'dirt';
  const first=f?f.since+'.02':'2025.10.12';
  const hot=f&&f.rank<=20?`랭커 ${f.rank}위${f.title?' · '+f.title:''}`:'랭커 아님';
  openPop(anchor,`<div class="fanp">${av(name,44)}<span><b>${esc(name)}</b>${tg(name)}</span></div><div class="fanl">이 방송국 첫 후원 ${first}</div><div class="fanl" style="margin-top:4px">${hot}${s?' · 즐겨찾기 '+s.mo+'개월':''}</div>`,{w:260});
};
/* ---- 랭킹 카드 / 행 ---- */
function gkCard(r,i,tab){
  const k=i+1,f=r.f;
  return `<div class="gkcw gk${k}"><button class="gkc${r.me?' me':''}" data-act="fan" data-arg="${esc(f.n)}" aria-label="${k}위 ${esc(f.n)}" data-qa="BIG-top${k}"><span class="in"><i class="sp s1"></i><i class="sp s2"></i><i class="sp s3"></i><span class="gkt">${GKT[k]}</span>${gkEmblem(k,f.n)}<b class="gkb">${esc(f.n)}${r.me?'<em class="mee">나</em>':''}</b>${tg(f.n)}<span class="gkv">${rkVal(tab,r.v)}</span></span></button></div>`;
}
function gkRow(r,no,tab){
  const f=r.f,id=f.id||idOf(f.n);
  return `<button class="gkrow${r.me?' me':''}" data-act="fan" data-arg="${esc(f.n)}" data-qa="BIG-row"><span class="gkrn">${no}</span>${av(f.n,38)}<span class="gknm"><b>${esc(f.n)}${r.me?'<em class="mee">나</em>':''}</b><small>${id?'@'+esc(id):''}</small></span>${f.title?`<span class="rb ${f.title==='회장'?'':'vp'}">${f.title}</span>`:''}${tg(f.n)}<span class="gkv">${rkVal(tab,r.v)}</span></button>`;
}
const gkPodium=(rows,tab)=>`<div class="gkpod" data-qa="BIG-podium">${gkCard(rows[1],1,tab)}${gkCard(rows[0],0,tab)}${gkCard(rows[2],2,tab)}</div>`;
function rkBody(n){
  const tab=S.ui.rkTab,per=S.ui.rkPer;
  const rows=tab==='don'?bigList(per).slice(0,n):rankData(tab,per).slice(0,n).map(r=>({f:r.f,v:r.v}));
  return gkPodium(rows,tab)+`<div class="gkrows">${rows.slice(3).map((r,i)=>gkRow(r,i+4,tab)).join('')}</div>`;
};
function rankHTML(){return `<div class="rkw gkw">${rkControls()}${rkBody(5)}<button class="link all" data-act="rankAll" data-qa="BIG-all">랭커 전체보기 ›</button></div>`};
/* ---- 후원 랭커 탭 ---- */
function bigMy(per,all){
  if(!S.loggedIn)return `<div class="gkmy" data-qa="BIG-my"><span>로그인하면 내 순위를 볼 수 있어요</span><button class="btn pri sm" data-act="login">로그인</button></div>`;
  if(S.donTotal<=0)return `<div class="gkmy" data-qa="BIG-my"><span><b>내 순위</b> 순위 밖 · 후원하면 순위에 올라요</span><button class="btn pri sm" data-act="donate">후원하기</button></div>`;
  if(per!=='all'&&per!=='m11')return `<div class="gkmy" data-qa="BIG-my"><span><b>내 순위</b> 이 기간에는 내 후원 내역이 없어요</span></div>`;
  const i=all.findIndex(r=>r.me);
  if(i<0||i>=100)return `<div class="gkmy" data-qa="BIG-my"><span><b>내 순위 100위 밖</b> · 누적 ${fmt(S.donTotal)}원</span><button class="btn pri sm" data-act="donate">후원하기</button></div>`;
  return `<div class="gkmy" data-qa="BIG-my"><span><b>내 순위 ${i+1}위</b> · 누적 ${fmt(S.donTotal)}원</span><button class="btn sec sm" data-act="bigMe" data-arg="${i}">내 위치 보기</button></div>`;
}
function pgWin(pg){const s=new Set([1,10,pg-1,pg,pg+1]);if(pg<=2){s.add(2);s.add(3)}if(pg>=9){s.add(8);s.add(9)}const a=[...s].filter(n=>n>=1&&n<=10).sort((x,y)=>x-y),o=[];a.forEach((n,i)=>{if(i&&n-a[i-1]>1)o.push(0);o.push(n)});return o}
function hotMy(){
  if(!S.loggedIn)return `<div class="s-card myrank" data-qa="HOT-my"><span>로그인하면 내 순위를 볼 수 있어요</span><button class="btn pri sm" data-act="login">로그인</button></div>`;
  const all=bigList('all'),i=all.findIndex(r=>r.me),a20=FANS.length?AMT_ALL[FANS.length-1]:0;
  if(S.donTotal<=0||i<0)return `<div class="s-card myrank" data-qa="HOT-my"><span>내 순위: 순위 밖 · 후원하면 후원 랭커와 같은 기준으로 순위가 매겨져요</span><button class="btn pri sm" data-act="donate">후원하기</button></div>`;
  if(i<FANS.length)return `<div class="s-card myrank" data-qa="HOT-my"><span><b>내 순위 ${i+1}위</b> · 누적 ${fmt(S.donTotal)}원 (랭커 20위 안)</span><button class="btn sec sm" data-act="donate">후원하기</button></div>`;
  return `<div class="s-card myrank" data-qa="HOT-my"><span><b>내 순위 ${i+1}위</b> · 누적 ${fmt(S.donTotal)}원 · 랭커(20위)까지 ${fmt(Math.max(1,a20-S.donTotal+1))}원 더 후원이 필요해요</span><button class="btn pri sm" data-act="donate">후원하기</button></div>`;
}function bigView(){
  const u=S.ui,per=u.bigPer,all=bigList(per),list=all.slice(0,100);
  const pg=Math.min(Math.max(u.bigPage,1),10);u.bigPage=pg;
  const st=(pg-1)*10,cur=list.slice(st,st+10);
  const body=pg===1?gkPodium(cur.slice(0,3),'don')+`<div class="gkrows" data-qa="BIG-list">${cur.slice(3).map((r,i)=>gkRow(r,4+i,'don')).join('')}</div>`
    :`<div class="gkrows" data-qa="BIG-list">${cur.map((r,i)=>gkRow(r,st+1+i,'don')).join('')}</div>`;
  const pager=`<nav class="gkpg" aria-label="후원 랭커 페이지" data-qa="BIG-pager"><button class="gkpn prev" data-act="bigPage" data-arg="${pg-1}" ${pg<=1?'disabled':''} aria-label="이전 페이지" data-qa="BIG-prev">${ic('chevL',16)}이전</button><span class="gkpl full">${Array.from({length:10},(_,i)=>`<button class="gkp${pg===i+1?' on':''}" data-act="bigPage" data-arg="${i+1}" ${pg===i+1?'aria-current="page"':''} aria-label="${i+1}페이지" data-qa="BIG-p${i+1}">${i+1}</button>`).join('')}</span><span class="gkpl compact" data-qa="BIG-compact">${pgWin(pg).map(n=>n===0?'<span class="gkel" aria-hidden="true">…</span>':`<button class="gkp${pg===n?' on':''}" data-act="bigPage" data-arg="${n}" ${pg===n?'aria-current="page"':''} aria-label="${n}페이지">${n}</button>`).join('')}</span><button class="gkpn next" data-act="bigPage" data-arg="${pg+1}" ${pg>=10?'disabled':''} aria-label="다음 페이지" data-qa="BIG-next">다음${ic('chevR',16)}</button></nav>`;
  return `<div data-qa="T-05"><div class="vh"><h2>후원 랭커</h2><p>후원 금액이 많은 순서예요 · 최대 100위까지 볼 수 있어요</p></div>
  <div class="rkw gkw"><div class="gkper" data-qa="BIG-per"><button class="chip${per==='all'?' act':''}" data-act="bigPer" data-arg="all">역대</button><button class="chip${per==='m11'?' act':''}" data-act="bigPer" data-arg="m11">이번 달</button><select class="rk-mon" data-ch="bigMon" aria-label="2026년 월별 선택"><option value="">2026년 월별</option>${[1,2,3,4,5,6,7,8,9,10,11].map(m=>`<option value="m${m}" ${per==='m'+m?'selected':''}>2026년 ${m}월</option>`).join('')}</select></div>
  ${bigMy(per,all)}${body}<div class="gkrange">${st+1}–${st+10}위 / 100위</div>${pager}</div></div>`;
}
/* ---- 후원: 누적 금액 / 레드닷 ---- */
function donTotalBox(){
  if(!S.loggedIn)return '';
  return `<div class="dtot" data-qa="DON-total"><span class="dtl">현재까지 후원한 금액</span><b>${fmt(S.donTotal)}원</b><span class="dtc">(${S.donCount}회)</span>${S.donCount?'':'<small>아직 후원한 내역이 없어요</small>'}</div>`;
}
const donDotHTML=()=>S.loggedIn&&S.donTotal>0?'<span class="rdot" data-qa="DON-dot" role="img" aria-label="누적 후원 내역 있음"></span>':'';
function donDotUpd(){const b=$('#donBtn');if(!b)return;const d=$('.rdot',b);if(S.loggedIn&&S.donTotal>0){if(!d)b.insertAdjacentHTML('beforeend',donDotHTML())}else if(d)d.remove()}
/* ---- 쪽지 ---- */
const MTAB=[['in','받은 쪽지'],['sent','보낸 쪽지'],['keep','보관함'],['blk','수신거부함']];
const MEMPTY={in:'받은 쪽지가 없어요',sent:'보낸 쪽지가 없어요',keep:'보관함이 비어 있어요',blk:'수신거부함이 비어 있어요'};
const MBTN={in:[['keep','보관함으로'],['block','수신거부'],['del','삭제']],sent:[['del','삭제']],keep:[['restore','받은 쪽지로 복원'],['del','삭제']],blk:[['unblock','수신거부 해제'],['del','삭제']]};
let msgOv=null,msgSimK=0;
const mu={tab:'in',view:'list',sel:[],id:null,to:'',text:'',quote:null,from:'list'};
const mItems=b=>S.msg.items.filter(x=>x.box===b).sort((a,c)=>a.t<c.t?1:a.t>c.t?-1:0);
const mItem=id=>S.msg.items.find(x=>x.id===id);
const unreadN=()=>S.msg.items.filter(x=>x.box==='in'&&!x.read).length;
const mTime=t=>t.slice(0,10)===TODAY?t.slice(11):t.slice(5,10);
function msgBadgeHTML(){const n=S.loggedIn?unreadN():0;return n>0?`<span class="mbadge" data-qa="MSG-badge" aria-hidden="true">${n>99?'99+':n}</span>`:''}
function msgBadgeUpd(){
  const b=$('#msgBtn');if(!b)return;const n=S.loggedIn?unreadN():0;let s=$('.mbadge',b);
  if(n>0){if(!s){b.insertAdjacentHTML('beforeend',msgBadgeHTML());s=$('.mbadge',b)}s.textContent=n>99?'99+':n;b.setAttribute('aria-label','쪽지, 안 읽은 쪽지 '+n+'개')}
  else{if(s)s.remove();b.setAttribute('aria-label','쪽지')}
}
function openMsg(tab,to){
  if(!S.loggedIn){toast('로그인 후 쪽지를 이용할 수 있어요',null,null,'MSG-login');return}
  if(msgOv&&document.body.contains(msgOv)){if(to!==undefined){startWrite(to)}else if(tab){mu.tab=tab;mu.view='list';mu.sel=[];msgRender()}return}
  Object.assign(mu,{tab:tab||'in',view:'list',sel:[],id:null,to:'',text:'',quote:null,from:'list'});
  msgOv=openModal({title:'쪽지함',cls:'mid msgm sheet',qa:'MSG-02',body:'<div id="msgBox"></div>',onClose:()=>{msgOv=null}});
  if(to!==undefined)startWrite(to);else msgRender();
}
function msgRender(){
  const box=msgOv&&$('#msgBox',msgOv);if(!box)return;
  box.innerHTML=mu.view==='detail'?msgDetail():mu.view==='write'?msgWrite():mu.view==='block'?msgBlockMgr():msgList();
  msgBadgeUpd();
  if(mu.view==='write'){mToCheck();const f=mu.to?$('#mtx',msgOv):$('#mto',msgOv);if(f)f.focus({preventScroll:true})}
  else if(mu.view==='list')msgToolUpd();
}
function msgList(){
  const tab=mu.tab,items=mItems(tab);
  const tabs=MTAB.map(t=>{const n=S.msg.items.filter(x=>x.box===t[0]).length,un=t[0]==='in'?unreadN():0;
    return `<button class="mtab${tab===t[0]?' on':''}" role="tab" aria-selected="${tab===t[0]}" data-act="msgTab" data-arg="${t[0]}" data-qa="MSG-tab-${t[0]}">${t[1]}<span class="mcn">${n}</span>${un?`<i class="mun" aria-label="안 읽음 ${un}개">${un}</i>`:''}</button>`}).join('');
  const sent=tab==='sent';
  const rows=items.map(x=>{
    const un=!sent&&!x.read,ck=mu.sel.indexOf(x.id)>=0;
    return `<div class="mrow${un?' unread':''}${ck?' sel':''}" data-qa="MSG-row"><label class="mckw"><input type="checkbox" data-ch="msgSel" value="${x.id}" ${ck?'checked':''} aria-label="${esc(x.peer.n)} 쪽지 선택"></label><button class="mmain" data-act="msgOpen" data-arg="${x.id}"><span class="mfrom" data-up="${esc(x.peer.id)}" title="프로필 보기">${av(x.peer.n,30)}<span class="mnm"><b>${sent?'<em class="mto">받는 사람</em>':''}${esc(x.peer.n)}</b><small>@${esc(x.peer.id)}</small></span></span><span class="mpv">${esc(x.text)}</span><span class="mmeta"><span class="mst${un?' un':''}">${un?'안 읽음':'읽음'}</span><time>${mTime(x.t)}</time></span></button></div>`}).join('');
  const tool=items.length?`<div class="mtool"><label class="ck"><input type="checkbox" id="msgAll" data-ch="msgAll">전체 선택</label><span class="msel"></span><span class="sp"></span>${MBTN[tab].map(b=>`<button class="btn sec sm" data-act="msgBulk" data-arg="${b[0]}" data-qa="MSG-bulk-${b[0]}" disabled>${b[1]}</button>`).join('')}</div>`:'';
  const note=tab==='blk'?`<div class="mnote" data-qa="MSG-blk-note">${ic('bellOff',16)}<span>수신거부한 유저가 보낸 쪽지만 여기에 쌓여요. 수신거부함의 쪽지는 알림(배지·토스트)이 가지 않아요. 수신거부를 해제하면 받은 쪽지로 돌아와요.</span></div>`:'';
  return `<div class="msgtop"><button class="btn pri sm" data-act="msgWrite" data-qa="MSG-write">${ic('pencil',14)}쪽지 쓰기</button><button class="link" data-act="msgBlockMgr" data-qa="MSG-blockmgr">수신거부 유저 관리 (${S.msg.blocked.length}명) ›</button></div>
  <div class="mtabs" role="tablist" data-qa="MSG-tabs">${tabs}</div>${tool}
  <div class="mlist" data-qa="MSG-list">${rows||`<div class="empty" data-qa="MSG-empty">${ic('mail',30)}${MEMPTY[tab]}</div>`}</div>${note}`;
}
function msgToolUpd(){
  if(!msgOv||mu.view!=='list')return;
  const n=mu.sel.length,tot=mItems(mu.tab).length;
  const s=$('.msel',msgOv);if(s)s.textContent=n?n+'개 선택':'';
  $$('.mtool [data-act=msgBulk]',msgOv).forEach(b=>b.disabled=!n);
  const a=$('#msgAll',msgOv);if(a){a.checked=tot>0&&n===tot;a.indeterminate=n>0&&n<tot}
  $$('.mrow',msgOv).forEach(r=>{const c=$('input',r);r.classList.toggle('sel',!!(c&&c.checked))});
}
function msgDetail(){
  const x=mItem(mu.id);if(!x){mu.view='list';return msgList()}
  const sent=x.box==='sent',b=x.box;
  const acts=b==='in'?[['reply','답장','pri'],['keep','보관함으로','sec'],['block','수신거부','sec'],['del','삭제','dng']]:b==='keep'?[['reply','답장','pri'],['restore','받은 쪽지로 복원','sec'],['del','삭제','dng']]:b==='blk'?[['unblock','수신거부 해제','pri'],['del','삭제','dng']]:[['del','삭제','dng']];
  const label=MTAB.find(t=>t[0]===b)[1];
  return `<div class="mdet" data-qa="MSG-detail"><button class="back" data-act="msgBack">${ic('chevL',16)}${label}</button>
  <div class="mdhead"><span class="mup" data-up="${esc(x.peer.id)}" title="프로필 보기" role="button" tabindex="0">${av(x.peer.n,40)}</span><span class="mnm" data-up="${esc(x.peer.id)}" title="프로필 보기" role="button" tabindex="0"><b>${sent?'받는 사람 · ':''}${esc(x.peer.n)}</b><small>@${esc(x.peer.id)}</small></span><span class="tm">${x.t}<br>${label}</span></div>
  ${b==='blk'?`<div class="mnote" style="margin-top:10px">${ic('bellOff',16)}<span>수신거부한 유저의 쪽지예요. 도착했을 때 알림이 가지 않았어요.</span></div>`:''}
  <div class="mdbody">${esc(x.text)}</div>
  <div class="mdacts">${acts.map(a=>`<button class="btn ${a[2]==='dng'?'sec dng':a[2]}" data-act="${a[0]==='reply'?'msgReply':'msgBulk'}" data-arg="${a[0]}" data-qa="MSG-d-${a[0]}">${a[1]}</button>`).join('')}</div></div>`;
}
function startWrite(to,quote){mu.view='write';mu.to=to||'';mu.text='';mu.quote=quote||null;msgRender()}
function msgWrite(){
  const q=mu.quote;
  return `<div class="mwrite" data-qa="MSG-write-view"><button class="back" data-act="msgBack">${ic('chevL',16)}${mu.from==='detail'?'쪽지':'목록'}</button><h3 style="margin:4px 0 0;font-size:16px">쪽지 쓰기</h3>
  <div class="fld"><label class="l" for="mto" style="display:block;font-size:12px;color:var(--text-meta);margin-bottom:4px">받는 사람</label><input class="inp" id="mto" data-in="mto" placeholder="닉네임 또는 @아이디" value="${esc(mu.to)}" autocomplete="off" data-qa="MSG-to"><div class="mtoh" id="mtoh"></div></div>
  <div class="fld"><label class="l" for="mtx" style="display:block;font-size:12px;color:var(--text-meta);margin-bottom:4px">내용</label><textarea id="mtx" rows="6" maxlength="500" data-in="mtx" placeholder="보낼 내용을 입력하세요 (최대 500자)" data-qa="MSG-text">${esc(mu.text)}</textarea><div class="cnt" id="mtc">${mu.text.length}/500</div></div>
  ${q?`<div class="mquote"><small>원본 쪽지 · ${esc(q.peer.n)}</small><p>${esc(q.text)}</p></div>`:''}
  <div class="mf" style="margin:16px -20px -20px"><button class="btn sec" data-act="msgBack">취소</button><button class="btn pri" id="msend" data-act="msgSend" data-qa="MSG-send" disabled>보내기</button></div></div>`;
}
function mFind(q){q=String(q).trim().replace(/^@/,'');if(!q)return null;const l=q.toLowerCase();return MSGU.find(u=>u.id.toLowerCase()===l||u.n===q)||null}
function mToCheck(){
  const q=mu.to.trim();let u=null,err='',ok='';
  if(q){u=mFind(q);if(!u)err='존재하지 않는 사용자예요';else if(u.id===actorId()){err='나에게는 쪽지를 보낼 수 없어요';u=null}else ok=u.n+' (@'+u.id+')'+(u.id==='funsangsa'?' · 이 방송국 스트리머':'')+(S.msg.blocked.indexOf(u.id)>=0?' · 내가 수신거부한 유저예요':'')}
  const h=$('#mtoh',msgOv);if(h){h.className='mtoh'+(err?' bad':ok?' ok':'');h.textContent=err||ok||'닉네임 또는 아이디를 입력해 주세요'}
  const b=$('#msend',msgOv);if(b)b.disabled=!(u&&mu.text.trim().length>0);
  return u;
}
function msgBlockMgr(){
  const bl=S.msg.blocked;
  return `<div class="mblk" data-qa="MSG-block-view"><button class="back" data-act="msgBack">${ic('chevL',16)}목록</button><h3 style="margin:4px 0 6px;font-size:16px">수신거부 유저 ${bl.length}명</h3>
  <div class="mnote" style="margin:0 0 8px">${ic('bellOff',16)}<span>수신거부한 유저의 쪽지는 수신거부함에만 쌓이고 알림이 가지 않아요. 받은 쪽지에서 [수신거부]를 눌러 추가할 수 있어요.</span></div>
  ${bl.length?bl.map(id=>{const u=msgUser(id),n=S.msg.items.filter(x=>x.box==='blk'&&x.peer.id===id).length;return `<div class="mbr" data-qa="MSG-block-row">${av(u.n,34)}<span class="mnm"><b>${esc(u.n)}</b><small>@${esc(u.id)} · 수신거부함 쪽지 ${n}개</small></span><span class="sp"></span><button class="btn sec sm" data-act="msgUnb" data-arg="${esc(id)}" data-qa="MSG-unblock">수신거부 해제</button></div>`}).join(''):`<div class="empty">수신거부한 유저가 없어요</div>`}</div>`;
}
/* 일괄 동작 */
const mOps={
  keep(ids){ids.forEach(id=>{const x=mItem(id);if(x&&x.box==='in')x.box='keep'});return '쪽지 '+ids.length+'개를 보관함으로 옮겼어요'},
  restore(ids){ids.forEach(id=>{const x=mItem(id);if(x&&x.box==='keep')x.box='in'});return '쪽지 '+ids.length+'개를 받은 쪽지로 되돌렸어요'},
  del(ids){S.msg.items=S.msg.items.filter(x=>ids.indexOf(x.id)<0);return '쪽지 '+ids.length+'개를 삭제했어요'},
  block(ids){
    const ps=[];ids.forEach(id=>{const x=mItem(id);if(x&&ps.indexOf(x.peer.id)<0)ps.push(x.peer.id)});
    ps.forEach(p=>{if(S.msg.blocked.indexOf(p)<0)S.msg.blocked.push(p);S.msg.items.forEach(x=>{if(x.peer.id===p&&x.box==='in')x.box='blk'})});
    return ps.map(p=>msgUser(p).n).join(', ')+'님을 수신거부했어요. 이 유저의 쪽지는 수신거부함에만 쌓이고 알림이 가지 않아요';
  },
  unblock(ids){
    const ps=[];ids.forEach(id=>{const x=mItem(id);if(x&&ps.indexOf(x.peer.id)<0)ps.push(x.peer.id)});
    ps.forEach(p=>{S.msg.blocked=S.msg.blocked.filter(q=>q!==p);S.msg.items.forEach(x=>{if(x.peer.id===p&&x.box==='blk')x.box='in'})});
    return ps.map(p=>msgUser(p).n).join(', ')+'님의 수신거부를 해제했어요. 쪽지가 받은 쪽지로 돌아왔어요';
  }
};
function msgRun(op,ids){
  const t=mOps[op](ids);mu.sel=[];if(mu.view==='detail'||mu.view==='block')mu.view='list';
  msgRender();msgBadgeUpd();toast(t);
}
function msgArrive(kind){
  const bl=S.msg.blocked,k=msgSimK++;
  const pool=kind==='blocked'?MSGU.filter(u=>bl.indexOf(u.id)>=0):MSGU.filter(u=>bl.indexOf(u.id)<0&&u.id!==actorId()&&u.id!=='stamp_bang'&&u.id!=='war_advisor'&&u.id!=='rank_oracle');
  if(!pool.length){S.msgDemo='수신거부한 유저가 없어요. 받은 쪽지에서 먼저 수신거부해 보세요';renderDemo();return}
  const u=pool[k%pool.length],TX=['안녕하세요! 방송 잘 보고 있어요.','오늘 직급전은 몇 시에 시작하나요?','다음 크루 합방은 언제인가요?','응원합니다. 건강 챙기세요!','저번 방송 다시보기는 어디서 볼 수 있어요?'];
  S.msg.items.push({id:'m'+(++S.msg.seq),box:kind==='blocked'?'blk':'in',peer:u,text:TX[k%TX.length],t:TODAY+' '+nowHM(),read:false});
  if(kind==='blocked'){S.msgDemo=u.n+'(수신거부 유저)의 쪽지 → 수신거부함에만 저장 · 배지·토스트 알림 없음'}
  else{
    S.msgDemo=u.n+'의 쪽지 도착 → 받은 쪽지에 저장'+(S.loggedIn?' · 배지 +1 · 토스트 알림':' · 비로그인이라 알림이 보이지 않아요');
    if(S.loggedIn)toast('새 쪽지가 도착했어요 · '+u.n,'보기',()=>openMsg('in'));
  }
  msgBadgeUpd();if(msgOv)msgRender();renderDemo();
}
Object.assign(A,{
 msgBtn(){openMsg('in')},
 msgTab(el,a){mu.tab=a;mu.sel=[];mu.view='list';msgRender()},
 msgOpen(el,id){const x=mItem(id);if(!x)return;mu.id=id;mu.view='detail';if(x.box!=='sent'&&!x.read){x.read=true;msgBadgeUpd()}msgRender()},
 msgBack(){mu.view=(mu.view==='write'&&mu.from==='detail')?'detail':'list';mu.from='list';msgRender()},
 msgWrite(){mu.from='list';startWrite(actorId()==='funsangsa'?'':'funsangsa')},
 msgReply(){const x=mItem(mu.id);if(!x)return;mu.from='detail';startWrite(x.peer.id,x)},
 msgBlockMgr(){mu.view='block';msgRender()},
 msgUnb(el,id){S.msg.blocked=S.msg.blocked.filter(q=>q!==id);S.msg.items.forEach(x=>{if(x.peer.id===id&&x.box==='blk')x.box='in'});msgRender();msgBadgeUpd();toast(msgUser(id).n+'님의 수신거부를 해제했어요. 쪽지가 받은 쪽지로 돌아왔어요')},
 msgSend(){
  const u=mToCheck(),t=mu.text.trim();if(!u||!t)return;
  S.msg.items.push({id:'m'+(++S.msg.seq),box:'sent',peer:u,text:t,t:TODAY+' '+nowHM(),read:false});
  mu.tab='sent';mu.view='list';mu.from='list';mu.sel=[];msgRender();toast('쪽지를 보냈어요 · '+u.n);
 },
 msgBulk(el,op){
  const ids=mu.view==='detail'?[mu.id]:mu.sel.slice();if(!ids.length)return;
  if(op==='del')confirmM('쪽지를 삭제할까요?','선택한 쪽지 '+ids.length+'개를 삭제하면 복구할 수 없어요','삭제',()=>msgRun('del',ids));
  else if(op==='block'){const ns=[];ids.forEach(id=>{const x=mItem(id);if(x&&ns.indexOf(x.peer.n)<0)ns.push(x.peer.n)});
    confirmM('수신거부할까요?',esc(ns.join(', '))+'님이 보내는 쪽지는 앞으로 수신거부함에만 쌓이고 알림이 가지 않아요','수신거부',()=>msgRun('block',ids),null,false)}
  else msgRun(op,ids);
 },
 msgTo(){closePop();openMsg('in',actorId()==='funsangsa'?'':'funsangsa')},
 dmsg(el,a){msgArrive(a)},
 more(el){
  openPop(el,`<button class="mi2" data-act="copyLink">${ic('copy',16)}방송국 링크 복사</button><button class="mi2" data-act="msgTo" data-qa="MSG-more">${ic('mail',16)}쪽지 보내기</button><button class="mi2" data-act="report">${ic('flag',16)}신고하기</button>`,{w:200});
 },
 rankAll(){const u=S.ui;u.bigPer=u.rkPer;u.bigPage=1;go('bigrank')},
 bigPer(el,a){S.ui.bigPer=a;S.ui.bigPage=1;renderView()},
 bigPage(el,a){const n=Math.min(10,Math.max(1,+a));if(n===S.ui.bigPage)return;S.ui.bigPage=n;renderView();scrollTabs()},
 bigMe(el,i){S.ui.bigPage=Math.floor(+i/10)+1;renderView()}
});
Object.assign(CH,{
 msgSel(el){const i=mu.sel.indexOf(el.value);if(el.checked&&i<0)mu.sel.push(el.value);else if(!el.checked&&i>=0)mu.sel.splice(i,1);msgToolUpd()},
 msgAll(el){mu.sel=el.checked?mItems(mu.tab).map(x=>x.id):[];$$('.mrow input[type=checkbox]',msgOv).forEach(c=>c.checked=el.checked);msgToolUpd()},
 bigMon(el){if(el.value){S.ui.bigPer=el.value;S.ui.bigPage=1;renderView()}}
});
Object.assign(IN,{
 evt(el){const c=document.querySelector('#evTc');if(c)c.textContent=el.value.length+'/20'},
 mto(el){mu.to=el.value;mToCheck()},
 mtx(el){mu.text=el.value;const c=$('#mtc',msgOv);if(c)c.textContent=el.value.length+'/500';mToCheck()}
});
/* ---- 스케줄 캘린더: 날짜 칸 안에 텍스트 ---- */
function calHTML(){
  const c=S.ui.cal,first=new Date(c.y,c.m,1),dim=new Date(c.y,c.m+1,0).getDate(),lead=first.getDay();
  const cells=[];for(let i=0;i<lead;i++)cells.push('<span class="cd off"></span>');
  let cnt=0;
  for(let d=1;d<=dim;d++){
    const k=evKey(c.y,c.m,d),ev=evOf(k);cnt+=ev.length;
    const txt=ev.slice(0,2).map(e=>`<span class="ce ${KCLS[e.kind]}" title="${esc(e.start+' '+(e.title||'정규 방송'))}"><i>${e.start}</i><span>${esc(e.title||'정규 방송')}</span></span>`).join('')+(ev.length>2?`<span class="cmore" data-qa="SCH-more">+${ev.length-2}</span>`:'');
    cells.push(`<button class="cd${ev.length?' has':''}${k===TODAY?' today':''}${c.sel===k?' sel':''}${k<TODAY?' past':''}" data-act="calPick" data-arg="${k}" aria-label="${dkLabel(k)}${ev.length?' 스케줄 '+ev.length+'건':''}"><span class="dn">${d}</span>${ev.length?`<span class="cet" data-qa="SCH-text">${txt}</span><span class="dots">${ev.slice(0,3).map(e=>`<i class="${KCLS[e.kind]}"></i>`).join('')}</span>`:''}</button>`);
  }
  while(cells.length%7)cells.push('<span class="cd off"></span>');
  const sel=c.sel,evs=sel?evOf(sel):[];
  const detail=sel?(evs.length?`<div class="evl">${evs.map(e=>`<div class="evc ${KCLS[e.kind]}"><b>${e.start}${e.end?' ~ '+e.end:''}</b><span class="evt">${esc(e.title||'정규 방송')}</span><span class="evk">${e.kind}</span></div>`).join('')}</div>`:'<div class="emptyb">이 날은 스케줄이 없어요</div>'):(cnt===0?'<div class="emptyb">이 달에는 등록된 스케줄이 없어요</div>':'<div class="emptyb">날짜를 선택하면 스케줄이 보여요</div>');
  return `<div class="calw" data-qa="SCH-cal"><div class="cal-h"><button class="ib sm" data-act="calPrev" aria-label="이전 달">${ic('chevL',16)}</button><b class="cal-t">${c.y}년 ${c.m+1}월</b><button class="ib sm" data-act="calNext" aria-label="다음 달">${ic('chevR',16)}</button><button class="chip" data-act="calToday">오늘</button><span class="sp"></span><span class="cal-leg"><i class="kn"></i>정규<i class="kz"></i>직급전<i class="kj"></i>합방<i class="ks"></i>특집</span></div>
  <div class="cal-b"><div class="cal-g"><div class="cal-w">${DOWN.map((d,i)=>`<span class="${i===0?'su':i===6?'sa':''}">${d}</span>`).join('')}</div><div class="cal-c">${cells.join('')}</div></div><div class="cal-d" data-qa="SCH-detail"><div class="cal-dh">${sel?dkLabel(sel):(c.m+1)+'월 스케줄'}</div>${detail}</div></div></div>`;
};
/* ---- 쇼츠 슬라이드 ---- */
const SHN=10;
function shSlider(){
  return `<div class="shs" data-qa="SHO-01"><div class="shvp" id="shvp"><div class="shtrack" id="shtrack">${SHORTS.slice(0,SHN).map(shCard).join('')}</div></div><button class="shnav prev" data-act="shPrev" data-qa="SHO-prev" aria-label="이전 쇼츠">${ic('chevL',22)}</button><button class="shnav next" data-act="shNext" data-qa="SHO-next" aria-label="다음 쇼츠">${ic('chevR',22)}</button><div class="shpg" id="shpg" data-qa="SHO-pg"></div></div>`;
}
const shN=()=>{const t=$('#shtrack');if(!t)return 6;void t.offsetWidth;void t.getBoundingClientRect();const n=parseInt(getComputedStyle(t).getPropertyValue('--n'));return n>0?n:6};
function shApply(noAnim){
  const t=$('#shtrack');if(!t)return;
  const n=shN(),mx=Math.max(0,SHN-n),i=Math.min(Math.max(S.ui.shIdx,0),mx);S.ui.shIdx=i;
  if(noAnim){t.style.transition='none'}
  t.style.setProperty('--i',i);
  if(noAnim){void t.offsetWidth;t.style.transition=''}
  const p=$('[data-act=shPrev]'),x=$('[data-act=shNext]');
  if(p){p.disabled=i<=0}if(x){x.disabled=i>=mx}
  const g=$('#shpg');if(g)g.textContent=(i+1)+'–'+Math.min(SHN,i+n)+' / '+SHN;
}
Object.assign(A,{
 shNext(){S.ui.shIdx=Math.min(SHN-shN(),S.ui.shIdx+shN());shApply()},
 shPrev(){S.ui.shIdx=Math.max(0,S.ui.shIdx-shN());shApply()}
});
let shTx=null;
document.addEventListener('touchstart',e=>{const v=e.target.closest&&e.target.closest('.shvp');shTx=v&&e.touches[0]?e.touches[0].clientX:null},{passive:true});
document.addEventListener('touchend',e=>{if(shTx===null)return;const dx=(e.changedTouches[0]?e.changedTouches[0].clientX:shTx)-shTx;shTx=null;if(Math.abs(dx)>40)(dx<0?A.shNext:A.shPrev)()},{passive:true});
window.addEventListener('resize',()=>shApply(true));
/* ---- 홈 / 뷰 ---- */
function homeView(){
  const pn=pinnedPost(),rp=recentPosts(),firstB=(S.station.boardList.find(b=>b.type==='board'&&canRead(b))||{id:'board2'}).id;
  return `<div data-qa="T-01"><div class="sect" id="playerWrap"><div class="bc"><div>${playerHTML()}</div><div class="binfo" id="binfo">${infoHTML()}</div></div></div>
   ${noticeCardsHTML()}
   ${midBannerHTML()}
   ${S.station.tierCfg.showRank?`<div class="sect" data-qa="B-02"><div class="sec-h"><h2>랭킹</h2></div><div id="rankHome">${rankHTML()}</div></div>`:''}
   <div class="sect" data-qa="B-07"><div class="sec-h"><h2>스케줄</h2><span class="cal-next">다음 방송 <b>${nextShow()}</b></span></div><div id="calHome">${calHTML()}</div></div>
   <div class="sect" data-qa="B-09"><div class="sec-h"><h2>최근 다시보기</h2><button class="link" data-act="nav" data-arg="replay">전체보기 ›</button></div><div class="grid">${REPLAYS.slice(0,4).map(r=>`<button class="vcard" data-act="replay" data-arg="${r.id}">${thumbR(`<span class="bd">다시보기</span><span class="dur">${r.len}</span>`)}<div class="vt">${esc(r.title)}</div><div class="vm">방송일 ${r.date} · 조회 ${fmt(r.views)}</div></button>`).join('')}</div></div>
   <div class="sect" data-qa="B-08"><div class="sec-h"><h2>쇼츠</h2><button class="link" data-act="nav" data-arg="shorts">전체보기 ›</button></div>${shSlider()}</div>
   <div class="sect"><div class="sec-h"><h2>최근 게시글</h2><button class="link" data-act="nav" data-arg="${firstB}">전체보기 ›</button></div>
   ${rp.length?`<div class="btab">${rp.map(r=>`<div class="brow" role="button" tabindex="0" style="grid-template-columns:auto minmax(0,1fr) auto auto" data-act="post" data-arg="${r[0]}|${r[1].id}"><span class="nb" style="background:var(--surface-3)">${esc(bnm(r[0]))}</span><span class="c-tit"><span class="tt">${esc(r[1].title)}</span></span><span class="c-au" style="display:block">${esc(r[1].author)}</span><span class="c-dt" style="display:block">${r[1].date.slice(5)}</span></div>`).join('')}</div>`:'<div class="empty">아직 올라온 글이 없습니다.</div>'}</div></div>`;
};
renderView=function(){
  const v=S.view;let h='';
  if(v==='home')h=homeView();else if(v==='crew')h=crewView();else if(v==='videos')h=videosView();else if(v==='signature')h=sigView();else if(v==='ranker')h=rankerView();else if(v==='play')h=playView();else if(v==='write')h=writeView();
  else if(v==='hotfans')h=hotView();else if(v==='subfans')h=subView();else if(v==='replay')h=replayView();else if(v==='shorts')h=shortsView();
  else h=boardView(v);
  $('#view').innerHTML=h;
  const stEl=$('.st');if(stEl)stEl.classList.toggle('focus',v==='play'||v==='write');
  if(v==='write')wrBodyUpd();
  if(v==='home'){startOvSoon();shApply(true);ncInit()}
};

/* ================= 12차: 모바일 최적화 · 와이어프레임 모드 · 영역 번호 · URL 해시 ================= */
const W={wire:false,areas:false,min:false,hide:false};
const AREA_SEL=['#hdr','#gside','.banner','.top .avw','.top .pi','.top .btns','.top .intro','.top .s-sns','#tabsw','#rban',
 '#playerWrap .bc>div:first-child','#binfo','.cnn-wrap','.mban','#rankHome','#calHome','[data-qa=B-08] .shs','#view .sect .grid','#view .sect .btab',
 '#view .vh','#view .gkper','#view .gkmy','#view .gkpod,#view .apod','#view .gkrows','#view .gkpg','#view .sigtool','#view .sgrid4','#view .cc','#view .mgrid','#view .sgrid',
 '#view .bh','#view .bbar','#view .btabs2','#view .wrp>.fld','#view .wrp .wnotice','#view .wrp .wfiles','#view .wrp .wacts','#view .plp .plmain','#view .plrel','#view .plsg','#view .plinfo','#fnv .vh','#fnv .fnq','#fnv .fnsec','#fnv .fncp','#admin .admmonth','#admin .asec','#view>div>.btab','#view .s-pager','#view .pd','#view .lock','#view .shgrid','#view .hrow:first-of-type','.foot','#bnav',
 '#admin .adm-in>.s-card','#admin .savebar',
 '.modal .mh','.modal .dtot','.modal .msgtop','.modal .mtabs','.modal .mtool','.modal .mlist','.modal .mwrite .fld','.modal .mdet','.modal #donBox>*:not(.mf):not(.dtot)','.modal .mb>*:not(.dtot):not(.msgtop):not(.mtabs):not(.mtool):not(.mlist):not(.mwrite):not(.mdet):not(#msgBox):not(#donBox)','.modal .mf'];
let areaT=0;
function tagAreas(){
  cancelAnimationFrame(areaT);
  areaT=requestAnimationFrame(()=>{
    $$('[data-area]').forEach(e=>{e.removeAttribute('data-area');e.style.removeProperty('--ax');e.style.removeProperty('--ay')});
    if(!W.areas)return;
    let k=0,km=0;
    $$(AREA_SEL.join(',')).forEach(e=>{
      if(e.offsetParent===null&&getComputedStyle(e).position!=='fixed')return;
      const r=e.getBoundingClientRect();if(r.width<8||r.height<8)return;
      e.setAttribute('data-area',String(e.closest('.ov-back')?++km:++k));
      /* 번호 위치: 박스 바깥 좌상단(-9,-9). 클리핑 조상/화면 가장자리에 가까우면 안쪽(3,3) */
      let ox=-9,oy=-9;
      for(let p=e;p&&p!==document.body;p=p.parentElement){const cs=getComputedStyle(p);const clip=p!==e&&(cs.overflow!=='visible'||cs.overflowX!=='visible'||cs.overflowY!=='visible')||(p===e&&cs.overflow!=='visible');if(clip){const pr=p.getBoundingClientRect();if(r.left-pr.left<12)ox=3;if(r.top-pr.top<12)oy=3}}
      if(r.left<12)ox=3;if(r.top<12)oy=3;
      if(getComputedStyle(e).position==='static'){
        const op=e.offsetParent;
        if(op&&op!==document.body){const pr=op.getBoundingClientRect();e.style.setProperty('--ax',(r.left-pr.left-op.clientLeft+op.scrollLeft+ox)+'px');e.style.setProperty('--ay',(r.top-pr.top-op.clientTop+op.scrollTop+oy)+'px')}
        else{e.style.setProperty('--ax',(r.left+scrollX+ox)+'px');e.style.setProperty('--ay',(r.top+scrollY+oy)+'px')}
      }else{e.style.setProperty('--ax',ox+'px');e.style.setProperty('--ay',oy+'px')}
    });
  });
}
window.addEventListener('resize',()=>{if(W.areas)tagAreas()});
MAINS.addEventListener('scroll',()=>{},{passive:true});new MutationObserver(()=>{if(W.areas)tagAreas()}).observe(document.body,{childList:true,subtree:true});
function applyWire(){
  document.body.classList.toggle('wire',W.wire);
  document.body.classList.toggle('areas',W.areas);
  document.body.classList.toggle('nopanel',W.hide);
  const d=$('#demo');if(d)d.classList.toggle('min',W.min);
  tagAreas();
}
Object.assign(A,{
 dw(el,a){const p=a.split(':');W[p[0]]=p[1]==='1';applyWire();renderDemo()},
 dpmin(){W.min=true;dpOpen=false;applyWire();renderDemo()},
 dpmax(){W.min=false;dpOpen=true;applyWire();renderDemo()}
});
/* ---- URL 해시로 화면/상태 직접 열기 ---- */
const HASHKEYS=['view','live','login','mode','tier','wire','areas','panel','min','modal','msgtab','admin','don','per','page','rk','rkper','sec','drawer','cal','sigid','st'];
function parseHash(){
  /* 공용 화면(로그인 · 회원가입 · 검색 · 알림)은 app.js 가 처리 — 방송국 상태로 읽지 않음 */
  if(/^#(login|signup|search|notice)$/.test(location.hash))return {};
  const o={};location.hash.replace(/^#/,'').split('&').forEach(p=>{if(!p)return;const i=p.indexOf('=');const k=decodeURIComponent(i<0?p:p.slice(0,i));o[k]=i<0?'1':decodeURIComponent(p.slice(i+1))});
  return o;
}
function applyHash(){
  const o=parseHash();if(!Object.keys(o).length)return;
  closeAllModals();closePop();
  S=newState();ovQ.length=0;OVQ.forEach(x=>ovQ.push(x));pendingMine=null;sb.open=false;
  if(o.live!==undefined)S.live=o.live!=='0';
  if(o.login!==undefined)S.loggedIn=o.login!=='0';
  if(o.tier&&TIERN[o.tier]!==undefined)S.myTier=o.tier;
  if(o.mode&&['viewer','manager','streamer'].indexOf(o.mode)>=0)S.mode=o.mode;
  if(o.admin&&S.mode==='viewer')S.mode='streamer';
  if(o.view)S.view=o.view;
  if(o.view==='play')S.play={kind:o.kind||'video',id:+(o.id||0),from:'videos'};
  if(['search','fnhome','fnlive','fnyt','fnfind','fnfav','creator'].indexOf(o.view)>=0){S.shell='fn';S.fn={view:o.view,q:o.q||'',tab:o.stab||'all',cid:o.cid||null};S.view='home'}
  if(o.view==='write')S.view='home';
  if(o.rank)S.rankOv=o.rank==='none'?'none':o.rank==='auto'?'auto':+o.rank;
  if(o.rk==='act'||o.rk==='don')S.ui.rkTab=o.rk;
  if(o.rkper)S.ui.rkPer=o.rkper;
  if(o.per)S.ui.bigPer=o.per;
  if(o.page)S.ui.bigPage=Math.min(10,Math.max(1,+o.page||1));
  if(o.cal){S.ui.cal.sel=o.cal;S.ui.cal.y=+o.cal.slice(0,4);S.ui.cal.m=+o.cal.slice(5,7)-1}
  if(o.don){const n=Math.max(0,+o.don||0);S.donTotal=n;S.donCount=n?1:0}
  W.wire=o.wire==='1';W.areas=o.areas==='1';W.hide=o.panel==='0';W.min=o.min==='1';
  ensureView();renderAll();applyWire();
  if(o.view==='write')openWrite(o.board||'board1');
  if(o.admin){adminEnter(AVIEW(o.admin)?o.admin:undefined)}
  if(o.drawer==='1'){sb.open=true;layoutSB()}
  const md=o.modal;
  if(md==='donate')openDonate();
  else if(md==='donate-step2'){openDonate(10000);don.step=2;donRender()}
  else if(md==='donate-done'){openDonate(10000);don.step=3;finalizeDon();donRender()}
  else if(md==='msg')openMsg(o.msgtab||'in');
  else if(md==='msg-detail'){openMsg(o.msgtab||'in');const x=mItems(mu.tab)[0];if(x)A.msgOpen(null,x.id)}
  else if(md==='msg-write')openMsg('in','funsangsa');
  else if(md==='msg-blocked'){openMsg('in');A.msgBlockMgr()}
  else if(md==='sig'){const s=SG()[+(o.sigid||4)];if(s)openSig(s.id)}
  else if(md==='intro')openIntro();
  else if(md==='video')openPlay('video',0);
  else if(md==='replay')openPlay('replay',0);
  else if(md==='short')openPlay('short',0);
  else if(md==='login'){S.loggedIn=false;renderAll();applyWire();openLogin()}
  else if(md==='crewsched')openCrewSched();
  else if(md==='write')openWrite(o.board||(isBoardView(S.view)?S.view:'board1'));
  if(o.sec){const t={player:'#playerWrap',rank:'#rankHome',cal:'#calHome',shorts:'[data-qa=B-08]',videos:'#view .sect .grid',posts:'#view .sect:last-child'}[o.sec];
    setTimeout(()=>{const e=t&&$(t);if(e){const m=MAINS;m.scrollTop=e.getBoundingClientRect().top-m.getBoundingClientRect().top+m.scrollTop-12}},60)}
  renderDemo();tagAreas();
}
window.addEventListener('hashchange',applyHash);

/* ================= 13차: 기능 수정 (랭커·고정 LNB·검색·재생 페이지·게시판·글쓰기·VIP 랭킹·후원 시그니처·플레이어·관리 개편) ================= */
/* ---- 목업 데이터 교체 지점 안내: 데이터 상수는 D / FANS / LIVE_DONORS / SUBS / REPLAYS / VIDEOS / CREW / SHORTS / SIGS0 / RAW(게시판 글) / genEvents(스케줄) / BANN(배너 문구) 에 모여 있다 ---- */
const FNMB=1048576,FILELIMIT=20*FNMB;
const fmtMB=n=>(n/FNMB).toFixed(1)+' MB';
const canNotice=()=>S.loggedIn&&has('notice');
/* ---- VIP 기준: 팬 랭킹(후원 랭커 역대) ---- */
function myFanRank(){
  if(!S.loggedIn)return null;
  if(S.rankOv==='none')return null;
  if(typeof S.rankOv==='number')return S.rankOv;
  if(S.donTotal<=0)return null;
  const i=bigList('all').findIndex(r=>r.me);return i<0?null:i+1;
}
function myRankOK(k){const r=myFanRank();return r!==null&&r<=(VIPN[k]||20)}
const __lock0=lockView;
lockView=function(b){
  if(b.read!=='vip')return __lock0(b);
  const id=b.id,k=b.vip||'vip',need=VIPN[k],r=myFanRank(),nth=bigBase('all')[need-1].v;
  const pct=S.donTotal>0?Math.min(99,Math.round(S.donTotal/nth*100)):0;
  const titles=(S.posts[id]||[]).slice(0,3).map(p=>`<div>${esc(p.title)}</div>`).join('');
  const lad=['vip','vvip'].map(x=>`<div class="lcell${x===k?' req':''}"><b>${VIPL[x]}</b><span>팬 랭킹 ${VIPN[x]}위 이내</span>${S.loggedIn&&myRankOK(x)?'<span class="me">나</span>':''}</div>`).join('');
  const prog=S.loggedIn?`<div class="prog"><div>내 팬 랭킹: <b>${r?r+'위':'순위 밖'}</b>${S.rankOv==='auto'?' · 내 누적 후원 '+fmt(S.donTotal)+'원':' (데모 지정)'} · ${need}위 기준 ${fmt(nth)}원</div><div class="bar"><u style="width:${pct}%"></u></div></div>`:`<div style="margin-bottom:16px"><button class="btn pri" data-act="login">로그인하고 내 팬 랭킹 확인하기</button></div>`;
  return `<div data-qa="${BQA(id)}"><div class="lock"><div class="lic">${ic('lock',34)}</div><h2>${esc(b.name)}는 ${VIPL[k]} 전용이에요</h2><p>이 방송국 팬 랭킹(후원 랭커 역대 기준) ${need}위 이내인 팬만 입장할 수 있어요</p><div class="ladder">${lad}</div>${prog}
   <div class="lacts"><button class="btn pri" data-act="donate">후원하고 랭킹 올리기</button><button class="btn sec" data-act="nav" data-arg="bigrank">후원 랭커 보기</button><button class="btn sec" data-act="lockInfo">${VIPL[k]} 안내</button></div>
   <div class="blurl">${titles}<small>글 ${(S.posts[id]||[]).length}개</small></div></div></div>`;
};
openLockInfo=function(){
  const r=myFanRank(),b=bigBase('all'),row=k=>{const need=VIPN[k],nth=b[need-1].v,ok=S.loggedIn&&myRankOK(k);return `<tr><td><b>${VIPL[k]}</b></td><td>팬 랭킹 ${need}위 이내</td><td>${S.loggedIn?(ok?'<span class="abadge ok">충족</span>':(r?'현재 '+r+'위 · '+need+'위 진입까지 '+Math.max(0,nth-S.donTotal+1).toLocaleString()+'원':fmt(nth)+'원 이상')):'로그인 후 확인'}</td></tr>`};
  openModal({title:'VIP · VVIP 안내',body:`<table class="kv"><tr><th>구분</th><th>입장 기준</th><th>내 상태</th></tr>${row('vip')}${row('vvip')}</table><p style="margin-top:10px">기준은 이 방송국 <b>후원 랭커(누적 후원 금액 순위)</b>예요.<br>내 현재 순위: <b>${S.loggedIn?(r?r+'위':'순위 밖'):'로그인 필요'}</b><br>칭호는 표시용 설명이며 입장 기준과 무관해요.</p>`,foot:'<button class="btn sec" data-act="lockClose">닫기</button><button class="btn pri" data-act="lockRank">후원 랭커 보기</button>'});
};
A.lockInfo=openLockInfo;
A.lockClose=function(){closeAllModals()};
A.lockRank=function(){closeAllModals();go('bigrank')};
RHELP.vip='팬 랭킹 기준(VIP 20위·VVIP 10위 이내)만';WHELP.vip='팬 랭킹 기준(VIP 20위·VVIP 10위 이내)만';
/* ---- 게시판: [전체] [인기글] 탭 ---- */
const likeN=p=>p.likes+(p.liked?1:0);
const postCmp=(a,c)=>a.date<c.date?1:a.date>c.date?-1:((c.t||0)-(a.t||0))||(c.no-a.no);
function boardView(id){
  const b=getB(id);if(!b)return '';
  if(!canRead(b))return lockView(b);
  const u=bui(id);
  if(u.detail)return postDetail(id,u.detail);
  const tab=b.read==='vip'?'all':(u.tab||'all');
  const raw=S.posts[id]||[];
  const qq=(u.q||'').toLowerCase();
  const l=raw.filter(p=>!qq||p.title.toLowerCase().indexOf(qq)>=0||p.author.toLowerCase().indexOf(qq)>=0);
  const pinned=l.filter(p=>p.notice&&p.pin).sort(postCmp),notices=l.filter(p=>p.notice&&!p.pin).sort(postCmp);
  let rest=l.filter(p=>!p.notice).sort(postCmp);
  const popAll=raw.filter(p=>!p.notice&&likeN(p)>=10).length;
  if(tab==='pop')rest=rest.filter(p=>likeN(p)>=10);
  const top=tab==='all'?pinned.concat(notices):[];
  const is3=id==='board3';
  const badge=b.read==='private'?'<span class="gbadge" style="border-color:var(--text-meta);color:var(--text-meta)">비공개</span>':(b.read==='vip'||b.write==='vip')?vipBadgeHTML(b):'';
  const pen=canSt()?`<button class="pencil" data-act="rename" data-arg="${id}" aria-label="게시판 이름 변경">${ic('pencil',16)}</button>`:'';
  const row=p=>`<div class="brow${p.notice?' notice':''}${p.pin?' pinned':''}" role="button" tabindex="0" data-act="post" data-arg="${id}|${p.id}"><span class="c-num">${p.notice?`<span class="nb">공지</span>`:p.no}</span>
    <span class="c-tit">${p.pin?`<span class="pinic" title="상단 고정">${ic('pin',14)}고정</span>`:''}<span class="tt">${esc(p.title)}</span>${p.img?ic('image',14):''}${p.files&&p.files.length?ic('link',13):''}${p.comments?`<em class="cm">[${p.comments}]</em>`:''}${p.isNew?'<i class="nbadge">N</i>':''}${likeN(p)>=10?`<span class="recn">${ic('heart',12)} ${likeN(p)}</span>`:''}<span class="m-meta">${esc(p.author)} · ${p.date.slice(5)} · 조회 ${fmt(p.views)}</span></span>
    <span class="c-au">${esc(p.author)}</span><span class="c-dt">${p.date.slice(5)}</span><span class="c-vw">${fmt(p.views)}</span></div>`;
  let body;
  if(!raw.length)body=`<div class="empty">아직 올라온 글이 없습니다.${b.write==='none'&&!isStreamer()?'':`<button class="btn pri" data-act="write" data-arg="${id}">첫 글 쓰기</button>`}</div>`;
  else if(!top.length&&!rest.length)body=tab==='pop'&&!qq?`<div class="empty">아직 인기글이 없어요<small class="fanl">좋아요 10개 이상을 받은 글이 인기글이 돼요</small></div>`:`<div class="empty">'${esc(u.q||'')}' 검색 결과가 없어요<button class="btn sec" data-act="bclear" data-arg="${id}">검색 초기화</button></div>`;
  else body=`<div class="btab"><div class="brow bhead"><span class="c-num">번호</span><span>제목</span><span class="c-au">작성자</span><span class="c-dt">날짜</span><span class="c-vw">조회</span></div>${top.map(row).join('')}${rest.map(row).join('')}</div><div class="s-pager"><span>${ic('chevL',16)}</span><span class="cur">1</span><span>${ic('chevR',16)}</span></div>`;
  return `<div data-qa="${BQA(id)}"><div class="bh"><h2>${esc(b.name)}</h2>${badge}${pen}${writeBtn(b)}</div>
   <div class="bdesc">${esc(b.desc)}</div>${id==='board1'?'<div class="bhint">게시판 이름은 스트리머가 바꿀 수 있어요</div>':''}
   <div class="bbar">${b.read==='vip'?'':`<div class="btabs2" role="tablist" data-qa="BRD-tabs"><button class="bt2${tab==='all'?' on':''}" role="tab" aria-selected="${tab==='all'}" data-act="btab" data-arg="${id}|all" data-qa="BRD-tab-all">전체</button><button class="bt2${tab==='pop'?' on':''}" role="tab" aria-selected="${tab==='pop'}" data-act="btab" data-arg="${id}|pop" data-qa="BRD-tab-pop">인기글<span class="bt2n">${popAll}</span></button><span class="bhint2">좋아요 10개 이상 글</span></div>`}
     <label class="fsearch">${ic('search',16)}<input id="bq" data-in="bq" data-arg="${id}" placeholder="제목·작성자 검색" value="${esc(u.q||'')}"></label></div>${body}</div>`;
}
Object.assign(A,{btab(el,a){const p=a.split('|');bui(p[0]).tab=p[1];renderView()}});
/* ---- 공지 / 고정 ---- */
function pinnedPost(){
  let best=null;
  S.station.boardList.forEach(bd=>{if(bd.type!=='board'||!canRead(bd))return;(S.posts[bd.id]||[]).forEach(p=>{if(p.notice&&p.pin&&(!best||postCmp(p,best.p)<0))best={b:bd.id,p:p}})});
  return best;
}
A.noticeGo=function(){const n=pinnedPost();if(n)openPost(n.b,n.p.id)};
function sanitizeHTML(html){
  const doc=new DOMParser().parseFromString('<body>'+html+'</body>','text/html');
  const ALLOW={B:1,STRONG:1,I:1,EM:1,U:1,S:1,STRIKE:1,DEL:1,FONT:['color'],SPAN:['style'],H2:1,H3:1,H4:1,P:1,DIV:1,BR:1,UL:1,OL:1,LI:1,BLOCKQUOTE:1,A:['href'],IMG:['src','alt'],HR:1};
  const walk=n=>{Array.from(n.childNodes).forEach(c=>{
    if(c.nodeType===3)return;
    if(c.nodeType!==1){c.remove();return}
    const rule=ALLOW[c.tagName];
    if(!rule){walk(c);while(c.firstChild)c.parentNode.insertBefore(c.firstChild,c);c.remove();return}
    Array.from(c.attributes).forEach(at=>{if(!(Array.isArray(rule)&&rule.indexOf(at.name)>=0))c.removeAttribute(at.name)});
    if(c.tagName==='A'){const h=c.getAttribute('href')||'';if(/^https?:\/\//i.test(h)){c.setAttribute('target','_blank');c.setAttribute('rel','noopener noreferrer')}else c.removeAttribute('href')}
    if(c.tagName==='IMG'){const s=c.getAttribute('src')||'';if(!/^(data:image\/(png|jpe?g|gif|webp|svg\+xml)|https?:\/\/)/i.test(s)){c.remove();return}}
    if(c.tagName==='SPAN'){const m=/color:\s*([#\w(),.\s%]+)/i.exec(c.getAttribute('style')||'');if(m)c.setAttribute('style','color:'+m[1].replace(/[^#\w(),.\s%]/g,''));else c.removeAttribute('style')}
    walk(c)})};
  walk(doc.body);return doc.body.innerHTML;
}
function postDetail(id,pid){
  const p=(S.posts[id]||[]).find(x=>x.id===pid);if(!p){bui(id).detail=null;return boardView(id)}
  const f=fanOf(p.author);
  const au=p.author==='펀상사'?'<span class="rb">스트리머</span>':p.author==='사옥청소부'?'<span class="rb vp">매니저</span>':tb(f?f.t:'dirt');
  const is3=id==='board3';
  const cn=canNotice()&&p.notice;
  const files=p.files&&p.files.length?`<div class="pfiles" data-qa="PST-files"><b>첨부파일 ${p.files.length}개</b>${p.files.map(x=>`<button class="pfile" data-act="pfile" data-arg="${esc(x.name)}">${ic('link',14)}<span>${esc(x.name)}</span><small>${fmtMB(x.size)}</small></button>`).join('')}</div>`:'';
  return `<div class="pd" data-qa="${BQA(id)}"><button class="back" data-act="back" data-arg="${id}">${ic('chevL',16)}목록</button>
   <div class="bhint" style="margin-bottom:6px">${esc(bnm(id))}</div><h1>${p.notice?'<span class="nb" style="margin-right:8px;vertical-align:middle">공지</span>':''}${p.pin?`<span class="pinic">${ic('pin',14)}고정</span>`:''}${esc(p.title)}</h1>
   <div class="au">${av(p.author,28)}<b>${esc(p.author)}</b>${au}<span>${p.date}</span><span>조회 ${fmt(p.views)}</span></div>
   ${cn?`<div class="pnact" data-qa="PST-notice-act"><span class="fanl">공지 관리</span><button class="btn out sm" data-act="pnUnnotice" data-arg="${id}|${pid}">공지 해제</button>${p.pin?`<button class="btn out sm" data-act="pnUnpin" data-arg="${id}|${pid}">고정 해제</button>`:`<button class="btn out sm" data-act="pnPin" data-arg="${id}|${pid}">상단 고정</button>`}</div>`:''}
   ${p.html?`<div class="body rich">${p.html}</div>`:`<div class="body">${esc(p.body)}</div>`}${files}
   ${is3&&p.link?`<button class="lkc" data-act="ext" data-arg="${esc(p.link)}"><span class="lk-th">${ic('link',26)}</span><span><small>${esc(p.link.split('/')[0])}</small><b>${esc(p.title)}</b></span></button>`:''}
   <div class="lkacts"><button class="btn out${p.liked?' on':''}" data-act="like" data-arg="${id}|${pid}" aria-pressed="${p.liked}">${ic('heart',16)}좋아요 <span>${likeN(p)}</span></button>
   ${is3?`<button class="btn out${p.recd?' on':''}" data-act="rec" data-arg="${id}|${pid}" aria-pressed="${p.recd}">${ic('thumb',16)}추천 <span>${p.rec+(p.recd?1:0)}</span></button>`:''}</div>
   <div class="cmts"><h3>댓글 <span id="cmtN">${p.comments}</span></h3><small class="hint">최근 댓글 일부만 표시돼요</small><div id="cmtList">${p.cl.map(c=>`<div class="cmt">${av(c.n,32)}<div><b>${esc(c.n)}</b><small>${c.t}</small><p>${esc(c.x)}</p></div></div>`).join('')}</div>
   <div class="cmtf"><textarea id="cmtIn" rows="2" maxlength="200" data-in="cmt" placeholder="댓글을 입력하세요"></textarea><div class="errm" id="cmtErr"></div><div style="display:flex;justify-content:space-between;align-items:center"><span class="cnt" id="cmtCnt">0/200</span><button class="btn pri sm" id="cmtBtn" data-act="cmtAdd" data-arg="${id}|${pid}" disabled>등록</button></div></div></div></div>`;
}
const postOf=a=>{const p=a.split('|');return (S.posts[p[0]]||[]).find(x=>x.id===p[1])};
Object.assign(A,{
 pnUnnotice(el,a){const p=postOf(a);if(!p||!canNotice())return;p.notice=false;p.pin=false;p.no=Math.max.apply(null,[0].concat((S.posts[a.split('|')[0]]||[]).map(x=>x.no)))+1;logAdd('게시판','공지','공지 해제: '+p.title);renderNav();renderView();toast('공지를 해제했어요')},
 pnUnpin(el,a){const p=postOf(a);if(!p||!canNotice())return;p.pin=false;logAdd('게시판','공지','고정 해제: '+p.title);renderView();toast('상단 고정을 해제했어요')},
 pnPin(el,a){const p=postOf(a);if(!p||!canNotice())return;p.pin=true;logAdd('게시판','공지','상단 고정: '+p.title);renderView();toast('상단에 고정했어요. 홈의 고정 공지에도 표시돼요')},
 pfile:(el,a)=>toast('첨부파일 다운로드는 준비 중이에요: '+a)
});
/* ---- 글쓰기 페이지 ---- */
let wrRange=null;
const WRCOLORS=[['기본','#dfe5ed'],['빨강','#ff6363'],['주황','#ffa938'],['초록','#48d481'],['파랑','#4a92ff'],['보라','#9e86fc']];
function wrState(){return S.ui.wr}
function openWrite(id){
  if(!need())return;
  const b=getB(id);if(!b)return;
  if(!canWrite(b)){writeDeny(b);return}
  const d=(S.ui.wrDraft||(S.ui.wrDraft={}))[id];
  S.ui.wr={b:id,title:d?d.title:'',html:d?d.html:'',files:d?d.files.slice():[],notice:!!(d&&d.notice),pin:!!(d&&d.pin),link:d?d.link:'',restored:!!d,seq:(S.ui.wr&&S.ui.wr.seq)||0};
  go('write');
}
function wrSumSize(w){return w.files.reduce((s,f)=>s+f.size,0)}
function writeView(){
  const w=wrState();if(!w)return '<div class="empty">작성 중인 글이 없어요</div>';
  const b=getB(w.b);if(!b)return '';
  const is3=w.b==='board3',sum=wrSumSize(w);
  const tb=[['bold','굵게','B'],['italic','기울임','I'],['underline','밑줄','U'],['strikeThrough','취소선','S']].map(x=>`<button type="button" class="rtb" data-act="rtCmd" data-arg="${x[0]}" aria-label="${x[1]}" title="${x[1]}" data-qa="WR-${x[0]}"><span class="rtl rt-${x[2]}">${x[2]}</span></button>`).join('');
  return `<div class="wrp" data-qa="W-01"><button class="back" data-act="wCancel">${ic('chevL',16)}${esc(b.name)}</button>
   <h2 class="wrh">${w.edit?'글 수정':'글쓰기'} <small>${esc(b.name)}</small></h2>
   ${w.restored?'<div class="mnote" style="margin:0 0 12px"><span>임시저장한 글을 불러왔어요</span></div>':''}
   <div class="fld"><label class="l" for="wt">제목</label><input class="inp" id="wt" maxlength="60" data-in="wt" placeholder="제목을 입력하세요" value="${esc(w.title)}" data-qa="WR-title"><div class="cnt" id="wtc">${w.title.length}/60</div><div class="errm" id="wte"></div></div>
   ${canNotice()?`<div class="wnotice" data-qa="WR-notice"><b>공지 설정</b><label class="ck"><input type="checkbox" id="wn" data-ch="wNotice" aria-label="공지로 등록" ${w.notice?'checked':''}>공지로 등록</label><label class="ck"><input type="checkbox" id="wp" data-ch="wPin" aria-label="상단 고정" ${w.pin?'checked':''} ${w.notice?'':'disabled'}>상단 고정</label><small class="fanl">공지는 목록 상단에 라벨로 표시되고, 상단 고정한 최신 글은 홈 고정 공지로 보여요</small></div>`:''}
   <div class="fld"><label class="l">내용</label>
    <div class="rte-tb" role="toolbar" aria-label="글 서식" data-qa="WR-toolbar">${tb}
     <select class="rts" data-ch="rtSize" aria-label="제목 크기"><option value="p">본문</option><option value="h2">큰 제목</option><option value="h3">중간 제목</option><option value="h4">작은 제목</option></select>
     <select class="rts" data-ch="rtColor" aria-label="글자색">${WRCOLORS.map(c=>`<option value="${c[1]}">${c[0]}</option>`).join('')}</select>
     <button type="button" class="rtb" data-act="rtCmd" data-arg="insertUnorderedList" aria-label="글머리 목록" title="글머리 목록" data-qa="WR-ul"><span class="rtl">&bull;</span></button>
     <button type="button" class="rtb" data-act="rtCmd" data-arg="insertOrderedList" aria-label="번호 목록" title="번호 목록" data-qa="WR-ol"><span class="rtl">1.</span></button>
     <button type="button" class="rtb" data-act="rtQuote" aria-label="인용" title="인용" data-qa="WR-quote"><span class="rtl">&ldquo;</span></button>
     <button type="button" class="rtb" data-act="rtLink" aria-label="링크" title="링크" data-qa="WR-link">${ic('link',16)}</button>
     <button type="button" class="rtb" data-act="rtImg" aria-label="이미지 삽입" title="이미지 삽입" data-qa="WR-img">${ic('image',16)}</button>
     <button type="button" class="rtb" data-act="rtHr" aria-label="구분선" title="구분선" data-qa="WR-hr"><span class="rtl">&mdash;</span></button></div>
    <div class="rte-lk" id="rtlk" hidden><input class="inp" id="rtlkIn" placeholder="https://" aria-label="링크 주소"><button type="button" class="btn pri sm" data-act="rtLinkOk">삽입</button><button type="button" class="btn sec sm" data-act="rtLinkNo">닫기</button></div>
    <div class="rte-im" id="rtim" hidden><button type="button" class="btn sec sm" data-act="rtImgFile">내 컴퓨터에서 선택</button><button type="button" class="btn out sm" data-act="rtImgSample">샘플 이미지 삽입</button><button type="button" class="btn sec sm" data-act="rtImgNo">닫기</button></div>
    <div class="rte" id="wb" contenteditable="true" role="textbox" aria-multiline="true" aria-label="글 내용" data-in="wb" data-ph="내용을 입력하세요" data-qa="WR-body">${w.html}</div>
    <div class="cnt" id="wbc"></div><div class="errm" id="wbe"></div></div>
   ${is3?`<div class="fld"><label class="l" for="wl">링크 URL (선택)</label><input class="inp" id="wl" placeholder="https://" data-in="wl" value="${esc(w.link)}"><div class="errm" id="wle"></div></div>`:''}
   <div class="fld wfiles" data-qa="WR-files"><label class="l">첨부파일</label>
    <div class="wfhead"><button type="button" class="btn sec sm" data-act="wFile" data-qa="WR-file-add">${ic('plus',14)}파일 추가</button><button type="button" class="btn out sm" data-act="wSample" data-qa="WR-file-sample">샘플 파일 추가(8 MB)</button><span class="wfsum${sum>FILELIMIT?' over':''}" id="wfsum" data-qa="WR-file-sum">${fmtMB(sum)} / 20 MB</span></div>
    <div class="errm" id="wfe"></div>
    <ul class="wfl" id="wfl">${w.files.map((f,i)=>`<li><span class="wfn">${ic('link',14)}${esc(f.name)}</span><small>${fmtMB(f.size)}</small><button type="button" class="btn out sm" data-act="wFileDel" data-arg="${i}" aria-label="${esc(f.name)} 삭제">삭제</button></li>`).join('')||'<li class="wfe0">첨부한 파일이 없어요 · 여러 개 추가할 수 있고 합계 20 MB까지예요</li>'}</ul>
    <input type="file" id="wfi" multiple hidden data-ch="wFiles"><input type="file" id="wii" accept="image/png,image/jpeg,image/gif,image/webp" hidden data-ch="wImgFile"></div>
   <div class="wacts"><button class="btn out" data-act="wCancel" data-qa="WR-cancel">취소</button>${w.edit?'':'<button class="btn sec" data-act="wDraft" data-qa="WR-draft">임시저장</button>'}<button class="btn pri" data-act="wSubmit" data-qa="WR-submit">${w.edit?'수정 완료':'등록'}</button></div></div>`;
}
function wrBodyUpd(){
  const e=$('#wb');if(!e)return;const w=wrState();w.html=e.innerHTML;
  const n=e.textContent.length;const c=$('#wbc');if(c)c.textContent=fmt(n)+'자';
  e.classList.toggle('empty',!n&&!e.querySelector('img,hr'));
}
function wrFilesUpd(){
  const w=wrState();if(!w)return;const sum=wrSumSize(w);
  const s=$('#wfsum');if(s){s.textContent=fmtMB(sum)+' / 20 MB';s.classList.toggle('over',sum>FILELIMIT)}
  const l=$('#wfl');if(l)l.innerHTML=w.files.map((f,i)=>`<li><span class="wfn">${ic('link',14)}${esc(f.name)}</span><small>${fmtMB(f.size)}</small><button type="button" class="btn out sm" data-act="wFileDel" data-arg="${i}" aria-label="${esc(f.name)} 삭제">삭제</button></li>`).join('')||'<li class="wfe0">첨부한 파일이 없어요 · 여러 개 추가할 수 있고 합계 20 MB까지예요</li>';
}
function wrAddFile(name,size){
  const w=wrState(),er=$('#wfe');
  if(wrSumSize(w)+size>FILELIMIT){if(er)er.textContent='첨부파일은 합계 20 MB까지 추가할 수 있어요 ('+name+' '+fmtMB(size)+' 추가 시 '+fmtMB(wrSumSize(w)+size)+')';return false}
  w.files.push({name:name,size:size});if(er)er.textContent='';return true;
}
function wrSaveRange(){const s=getSelection();if(s&&s.rangeCount){const r=s.getRangeAt(0);if($('#wb')&&$('#wb').contains(r.commonAncestorContainer))wrRange=r.cloneRange()}}
function wrRestoreRange(){const e=$('#wb');if(!e)return;e.focus();if(wrRange){const s=getSelection();s.removeAllRanges();s.addRange(wrRange)}}
function wrCmd(c,v){wrRestoreRange();document.execCommand(c,false,v||null);wrSaveRange();wrBodyUpd()}
function wrDraftObj(){const w=wrState();wrBodyUpd();return {title:w.title,html:w.html,files:w.files.slice(),notice:w.notice,pin:w.pin,link:w.link}}
function wrDirty(){const w=wrState();if(!w)return false;return !!(w.title.trim()||($('#wb')&&$('#wb').textContent.trim())||w.files.length||(w.html&&w.html.replace(/<[^>]*>/g,'').trim()))}
function wrBack(){const w=wrState();const b=w?w.b:'board1';S.ui.wr=null;go(b)}
Object.assign(A,{
 write:(el,a)=>openWrite(a),
 rtCmd(el,a){wrCmd(a)},
 rtQuote(){wrCmd('formatBlock','blockquote')},
 rtHr(){wrCmd('insertHorizontalRule')},
 rtLink(){wrSaveRange();const b=$('#rtlk');b.hidden=!b.hidden;$('#rtim').hidden=true;if(!b.hidden)$('#rtlkIn').focus()},
 rtLinkNo(){$('#rtlk').hidden=true},
 rtLinkOk(){const u=$('#rtlkIn').value.trim();if(!/^https?:\/\/[^\s.]+\.[^\s]+$/i.test(u)){toast('http:// 또는 https://로 시작하는 주소를 입력해 주세요');return}wrCmd('createLink',u);$('#rtlk').hidden=true;$('#rtlkIn').value=''},
 rtImg(){wrSaveRange();const b=$('#rtim');b.hidden=!b.hidden;$('#rtlk').hidden=true},
 rtImgNo(){$('#rtim').hidden=true},
 rtImgFile(){$('#wii').click()},
 rtImgSample(){const n=(S.ui.wr.seq=(S.ui.wr.seq||0)+1)%3;const c=SAMPLE_COL[n];wrCmd('insertImage',IMGSVG(640,360,c[0],c[1],'샘플 이미지 '+(n+1),'',40,0));$('#rtim').hidden=true},
 wFile(){$('#wfi').click()},
 wSample(){const w=wrState();if(wrAddFile('샘플파일_'+(w.files.length+1)+'.zip',8*FNMB))wrFilesUpd()},
 wFileDel(el,a){const w=wrState();w.files.splice(+a,1);const er=$('#wfe');if(er)er.textContent='';wrFilesUpd()},
 wDraft(){const w=wrState();(S.ui.wrDraft||(S.ui.wrDraft={}))[w.b]=wrDraftObj();toast('임시저장했어요. 다시 글쓰기를 열면 불러와요')},
 wCancel(){if(wrDirty())confirmM('작성을 취소할까요?','작성 중인 내용이 사라져요. 필요하면 먼저 임시저장해 주세요','작성 취소',()=>wrBack());else wrBack()},
 wSubmit(){submitWrite()}
});
Object.assign(IN,{
 wt(el){const w=wrState();w.title=el.value;const c=$('#wtc');if(c)c.textContent=el.value.length+'/60'},
 wb(){wrBodyUpd()},
 wl(el){wrState().link=el.value}
});
Object.assign(CH,{
 wNotice(el){const w=wrState();w.notice=el.checked;const p=$('#wp');if(p){p.disabled=!el.checked;if(!el.checked){p.checked=false;w.pin=false}}},
 wPin(el){wrState().pin=el.checked},
 rtSize(el){wrCmd('formatBlock',el.value==='p'?'p':el.value)},
 rtColor(el){wrCmd('foreColor',el.value)},
 wFiles(el){
  const fs=Array.from(el.files||[]);fs.forEach(f=>wrAddFile(f.name,f.size));el.value='';wrFilesUpd();
 },
 wImgFile(el){
  const f=el.files&&el.files[0];if(!f)return;
  if(f.size>5*FNMB){toast('이미지는 5 MB까지 넣을 수 있어요');el.value='';return}
  const r=new FileReader();r.onload=()=>{wrCmd('insertImage',r.result);$('#rtim').hidden=true};r.readAsDataURL(f);el.value='';
 }
});
document.addEventListener('mousedown',e=>{if(e.target.closest&&e.target.closest('.rte-tb button'))e.preventDefault()});
document.addEventListener('keyup',e=>{if(e.target&&e.target.id==='wb')wrSaveRange()});
document.addEventListener('mouseup',e=>{if(e.target&&e.target.closest&&e.target.closest('#wb'))wrSaveRange()});
function submitWrite(){
  const w=wrState();if(!w||S.ui.wrBusy)return;
  const id=w.b,bd=getB(id);
  wrBodyUpd();
  const e=$('#wb'),t=w.title.trim(),text=e.textContent.trim(),hasMedia=!!e.querySelector('img,hr');
  let ok=true;
  const te=$('#wte'),be=$('#wbe'),le=$('#wle');te.textContent='';be.textContent='';if(le)le.textContent='';
  if(!t){te.textContent='제목을 입력해 주세요';ok=false}
  if(!text&&!hasMedia){be.textContent='내용을 입력해 주세요';ok=false}
  const lk=w.link.trim();
  if(le&&lk&&!/^https?:\/\//i.test(lk)){le.textContent='올바른 링크를 입력해 주세요';ok=false}
  if(!ok){const f=$('.errm:not(:empty)');if(f)f.scrollIntoView({block:'center'});return}
  const hit=banHit(t,text,lk);
  if(hit){const m="금칙어가 포함되어 있어요: '"+hit+"'";(banHit(t)?te:banHit(text)?be:le).textContent=m;toast('금칙어가 포함되어 등록할 수 없어요');return}
  if(!w.edit&&(!bd||!canWrite(bd))){writeDeny(bd||{write:'none'});return}
  if(w.edit){submitEdit(w,id,t,text,lk);return}
  S.ui.wrBusy=true;
  const clean=sanitizeHTML(w.html);
  const list=S.posts[id];const max=list.reduce((m,p)=>Math.max(m,p.no),0);
  const nt=canNotice()&&w.notice,pin=nt&&w.pin;
  const p={id:id+'-n'+Date.now(),t:Date.now(),title:t,author:actorName(),date:TODAY,views:0,comments:0,notice:nt,pin:pin,img:/<img/i.test(clean),isNew:true,no:nt?0:max+1,likes:0,liked:false,rec:0,recd:false,link:lk.replace(/^https?:\/\//i,''),html:clean,body:text,files:w.files.slice(),cl:[]};
  list.push(p);
  if(nt)logAdd('게시판','공지','공지 등록'+(pin?'(상단 고정)':'')+': '+t);
  if(S.ui.wrDraft)delete S.ui.wrDraft[id];
  S.ui.wr=null;S.ui.wrBusy=false;
  const u=bui(id);u.q='';u.tab='all';u.detail=null;
  go(id);toast(nt?(pin?'공지로 등록하고 상단에 고정했어요':'공지로 등록했어요'):'글을 등록했어요');
}

/* ---- 재생 페이지 (영상 · 쇼츠 · 다시보기) ---- */
const YT_MAIN='vk5BHoDxXf0',YT_SIG='6TlVAKiyiME';
const ytEmbed=id=>'https://www.youtube.com/embed/'+id+'?rel=0&modestbranding=1';
const LIVE_SRC='https://www.youtube.com/embed/vk5BHoDxXf0?autoplay=1&mute=1&loop=1&playlist=vk5BHoDxXf0&controls=0&modestbranding=1&playsinline=1';
function playItem(){
  const p=S.play||{kind:'video',id:0};
  if(p.kind==='short'){const s=SHORTS[p.id]||SHORTS[0];return {kind:'short',id:s.id,title:s.title,views:vs(s.v),date:s.date,len:s.len,tag:'쇼츠',vn:s.v}}
  if(p.kind==='replay'){const r=REPLAYS[p.id]||REPLAYS[0];return {kind:'replay',id:r.id,title:r.title,views:fmt(r.views),date:r.date,len:r.len,tag:r.cat,vn:r.views}}
  const v=VIDEOS[p.id]||VIDEOS[0];return {kind:'video',id:v.id,title:v.title,views:v.vs,date:v.date,len:v.len,tag:v.cat,vn:v.v};
}
const PLDESC={video:'펀상사 방송의 하이라이트를 모은 영상이에요. 풀영상은 다시보기에서 볼 수 있어요.\n재미있게 감상하고 좋아요와 댓글로 응원해 주세요.',replay:'방송을 처음부터 끝까지 다시 볼 수 있는 다시보기예요.\n아래 타임라인을 눌러 하이라이트 구간으로 이동할 수 있어요.',short:'짧고 굵은 하이라이트 쇼츠예요.'};
function plComments(key){
  let h=0;for(const c of key)h=(h*31+c.charCodeAt(0))%997;
  const base=[0,1,2,3,4].map(k=>({n:FANS[(h+k*3)%FANS.length].n,t:(k+1)+'시간 전',x:CMT[(h+k)%CMT.length]}));
  return (S.ui.plCm&&S.ui.plCm[key]||[]).slice().reverse().concat(base);
}
function relItem(kind,x){
  const meta=kind==='replay'?`방송일 ${x.date} · 조회 ${fmt(x.views)}`:kind==='short'?`조회 ${vs(x.v)}회 · ${x.date.slice(5)}`:`조회 ${x.vs} · ${x.date}`;
  const len=x.len;
  return `<button class="rel" data-act="playGo" data-arg="${kind}|${x.id}" data-qa="PLAY-rel">${thumb(x.title,x.id+(kind==='replay'?3:0),`<span class="dur">${len}</span>`)}<span class="rel-t"><b>${esc(x.title)}</b><small>${meta}</small></span></button>`;
}
function playView(){
  const it=playItem(),key=it.kind+it.id,liked=!!(S.ui.plLike&&S.ui.plLike[key]);
  const likes=(it.kind==='short'?128:it.kind==='replay'?240:310)+it.id*7+(liked?1:0);
  const cms=plComments(key);
  const from=S.play&&S.play.from||'home';
  const backLbl={videos:'영상 목록',replay:'다시보기 목록',shorts:'쇼츠 목록',home:'홈'}[from]||'목록';
  const cmBox=`<div class="cmts" data-qa="PLAY-cm"><h3>댓글 <span>${cms.length}</span></h3><div class="cmtf"><textarea id="plIn" rows="2" maxlength="200" data-in="plcm" placeholder="댓글을 입력하세요"></textarea><div style="display:flex;justify-content:space-between;align-items:center"><span class="cnt" id="plCnt">0/200</span><button class="btn pri sm" id="plBtn" data-act="plCmAdd" disabled>등록</button></div></div><div id="plCmList">${cms.map(c=>`<div class="cmt">${av(c.n,32)}<div><b>${esc(c.n)}</b><small>${c.t}</small><p>${esc(c.x)}</p></div></div>`).join('')}</div></div>`;
  const acts=`<div class="plact"><button class="btn out${liked?' on':''}" data-act="plLike" aria-pressed="${liked}" data-qa="PLAY-like">${ic('heart',16)}좋아요 <span>${fmt(likes)}</span></button><button class="btn out" data-act="share" data-qa="PLAY-share">${ic('share',16)}공유</button><button class="btn pri" data-act="donate">${ic('heart',16)}후원하기</button></div>`;
  if(it.kind==='short'){
    const i=SHORTS.findIndex(s=>s.id===it.id),pv=SHORTS[i-1],nx=SHORTS[i+1];
    return `<div class="plp shortp" data-qa="PLAY-01"><button class="back" data-act="plBack">${ic('chevL',16)}${backLbl}</button>
     <div class="plsg"><button class="plnav" data-act="plGoS" data-arg="${pv?pv.id:''}" ${pv?'':'disabled'} aria-label="이전 쇼츠" data-qa="PLAY-prev">${ic('chevL',22)}</button>
      <div class="plsc"><div class="ytw vert" data-qa="PLAY-yt"><iframe src="${ytEmbed(YT_MAIN)}" title="${esc(it.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div></div>
      <button class="plnav" data-act="plGoS" data-arg="${nx?nx.id:''}" ${nx?'':'disabled'} aria-label="다음 쇼츠" data-qa="PLAY-next">${ic('chevR',22)}</button></div>
     <div class="plinfo"><h1 class="plt">${esc(it.title)}</h1><div class="plmeta">조회 ${it.views}회 · ${it.date} · ${it.len}</div>${acts}</div>
     ${cmBox}
     <div class="pl-more"><h3>다른 쇼츠</h3><div class="shgrid pl">${SHORTS.filter(s=>s.id!==it.id).slice(0,6).map(shCard).join('')}</div></div></div>`;
  }
  const list=it.kind==='replay'?REPLAYS:VIDEOS;
  const rel=list.filter(x=>x.id!==it.id).slice(0,8).map(x=>relItem(it.kind,x)).join('');
  const chap=it.kind==='replay'?`<div class="plch"><div class="fanl" style="margin-bottom:6px">타임라인 하이라이트</div><div class="s-chips">${['00:42:10 시작 인사','01:30:05 합방 연결','02:58:40 엔딩 멘트'].map(t=>`<button class="chip" data-act="hl">${t}</button>`).join('')}</div></div>`:'';
  return `<div class="plp" data-qa="PLAY-01"><button class="back" data-act="plBack">${ic('chevL',16)}${backLbl}</button>
   <div class="plg"><div class="plmain"><div class="ytw" data-qa="PLAY-yt"><iframe src="${ytEmbed(YT_MAIN)}" title="${esc(it.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
    <h1 class="plt">${esc(it.title)}</h1><div class="plmeta">${it.kind==='replay'?'방송일':'게시일'} ${it.date} · 조회 ${it.views}회 · ${it.len}${it.tag?' · '+it.tag:''}</div>${acts}
    <div class="pldesc" data-qa="PLAY-desc">${esc(PLDESC[it.kind]).replace(/\n/g,'<br>')}</div>${chap}${cmBox}</div>
   <aside class="plrel" data-qa="PLAY-related"><h3>관련 ${it.kind==='replay'?'다시보기':'영상'}</h3>${rel}</aside></div></div>`;
}
function openPlay(kind,id){
  closeAllModals();
  const from=S.view==='play'&&S.play?S.play.from:S.view;
  S.play={kind:kind,id:id,from:from};
  S.shell='station';S.view='play';sb.open=false;renderAll();MAINS.scrollTop=0;
}
Object.assign(A,{
 video:(el,a)=>openPlay('video',+a),replay:(el,a)=>openPlay('replay',+a),short:(el,a)=>openPlay('short',+a),
 playGo(el,a){const p=a.split('|');S.play.kind=p[0];S.play.id=+p[1];renderView();MAINS.scrollTop=0},
 plGoS(el,a){if(a==='')return;S.play.id=+a;renderView();MAINS.scrollTop=0},
 plBack(){const f=S.play&&S.play.from&&S.play.from!=='play'?S.play.from:'home';go(f)},
 plLike(){const it=playItem(),k=it.kind+it.id;(S.ui.plLike||(S.ui.plLike={}))[k]=!S.ui.plLike[k];renderView()},
 plCmAdd(){if(!need())return;const t=$('#plIn').value.trim();if(!t)return;const it=playItem(),k=it.kind+it.id;((S.ui.plCm||(S.ui.plCm={}))[k]||(S.ui.plCm[k]=[])).push({n:actorName(),t:'방금 전',x:t});renderView();toast('댓글을 등록했어요')}
});
IN.plcm=el=>{$('#plCnt').textContent=el.value.length+'/200';$('#plBtn').disabled=!el.value.trim()};
/* ---- 펀네이션 기본 화면(공통 사이드바) + 검색 ---- */
const FNX=[['mocha_label','모카레이블','요리·먹방·저스트채팅',1,'모카레이블의 야식 먹방 라이브'],['kiwi_sang','키위상사','토크·고민 상담',0,''],['sol_label','솔레이블','기타·버스킹',1,'솔레이블 버스킹 라이브'],['moon_sang','달밤상사','심야 게임 방송',0,''],['star_label','별빛레이블','댄스·커버',1,'별빛레이블 안무 연습 라이브'],['pop_sang','팝콘상사','영화·드라마 리뷰',0,'']];
function fnCreators(){
  const base=S.station.crew.list.map(c=>({id:c.id,n:c.n,intro:c.intro,live:c.live===1||(c.live===2&&S.live),lt:c.lt||(c.live===2?D.live.title.split(' #')[0]:''),own:c.id==='funsangsa',fav:c.fav}));
  const ex=FNX.map(x=>({id:x[0],n:x[1],intro:x[2],live:!!x[3],lt:x[4],own:false,fav:3000}));
  return base.concat(ex);
}
const fnVids=()=>VIDEOS.map(v=>({id:v.id,title:v.title,by:'펀상사',vs:v.vs,date:v.date,len:v.len}));
function fnMatch(q){
  q=String(q||'').trim().toLowerCase();
  const m=s=>!q||String(s).toLowerCase().indexOf(q)>=0;
  const cs=fnCreators();
  return {creators:cs.filter(c=>m(c.n)||m(c.id)||m(c.intro)),lives:cs.filter(c=>c.live&&(m(c.n)||m(c.lt))),videos:fnVids().filter(v=>m(v.title)||m(v.by))};
}
function closeSdrop(){const d=$('#sdrop');if(d)d.remove()}
function showSdrop(q){
  closeSdrop();q=String(q||'').trim();if(!q)return;
  const r=fnMatch(q),host=$('#gsrch');if(!host)return;
  const grp=(t,items)=>items.length?`<div class="sdg"><div class="sdh">${t}</div>${items}</div>`:'';
  const h=grp('크리에이터',r.creators.slice(0,3).map(c=>`<button class="sdi" data-act="fnCreator" data-arg="${c.id}" data-qa="SRCH-creator">${av(c.n,28)}<span><b>${esc(c.n)}</b><small>${esc(c.intro)}</small></span>${c.live?'<span class="lv">LIVE</span>':''}</button>`).join(''))
   +grp('라이브',r.lives.slice(0,3).map(c=>`<button class="sdi" data-act="fnCreator" data-arg="${c.id}" data-qa="SRCH-live"><span class="sdth">${ic('antenna',16)}</span><span><b>${esc(c.lt)}</b><small>${esc(c.n)}</small></span><span class="lv">LIVE</span></button>`).join(''))
   +grp('영상',r.videos.slice(0,3).map(v=>`<button class="sdi" data-act="video" data-arg="${v.id}" data-qa="SRCH-video"><span class="sdth">${ic('video',16)}</span><span><b>${esc(v.title)}</b><small>${esc(v.by)} · 조회 ${v.vs}</small></span></button>`).join(''));
  const d=document.createElement('div');d.className='sdrop';d.id='sdrop';d.setAttribute('role','listbox');d.dataset.qa='SRCH-drop';
  d.innerHTML=(h||'<div class="sdn">검색 결과가 없어요</div>')+`<button class="sdall" data-act="fnSearch" data-arg="${esc(q)}" data-qa="SRCH-all">${ic('search',14)} '${esc(q)}' 검색 결과 전체 ›</button>`;
  host.appendChild(d);
}
function fnSideHTML(){
  const it=(v,icn,label)=>`<div class="mi${S.fn.view===v?' act':''}" role="button" tabindex="0" data-act="fnNav" data-arg="${v}" data-qa="FN-nav-${v}">${ic(icn,20)}<span class="nm">${label}</span></div>`;
  const favs=fnCreators().slice(0,6).map(c=>`<div class="mi" role="button" tabindex="0" data-act="fnCreator" data-arg="${c.id}">${av(c.n,24)}<span class="nm">${esc(c.n)}</span><span class="rt">${c.live?'<span class="lv">LIVE</span>':''}</span></div>`).join('');
  return `<div class="lnbtop"><div class="lt-pf"><span class="fnlogo">${ic('crown',24)}</span><span class="lbl"><b>FUNNATION</b></span></div><button class="lbtn" data-act="fnBack" data-qa="FN-back">${ic('chevL',14)}<span class="lbl">${D.name} 방송국으로 돌아가기</span></button></div>${!S.loggedIn&&innerWidth<768?'<button class="loginbtn" style="width:100%;margin-bottom:10px" data-act="login">로그인</button>':''}<hr>
   ${it('fnhome','home','홈')}${it('fnlive','antenna','펀네이션 라이브')}${it('fnyt','youtube','유튜브 라이브')}${it('fnfind','search','크리에이터 찾기')}${it('fnfav','star','즐겨찾기')}<hr><div class="pg">즐겨찾기한 크리에이터</div>${favs}`;
}
function fnLiveCard(c,i){return `<button class="fnc" data-act="fnCreator" data-arg="${c.id}" data-qa="FN-live">${thumb(c.lt||c.n,i,`<span class="bd live">LIVE</span>`)}<div class="vt">${esc(c.lt||c.n+' 라이브')}</div><div class="vm">${esc(c.n)} · 시청 ${fmt(300+i*137)}명</div></button>`}
function fnCreatorCard(c){return `<div class="fncr" data-qa="FN-creator">${av(c.n,56)}<div class="fncb"><b>${esc(c.n)}${c.live?'<span class="lv">LIVE</span>':''}</b><small>${esc(c.intro)}</small><small>즐겨찾기 ${fmt(c.fav)}</small></div><button class="btn sec sm" data-act="fnCreator" data-arg="${c.id}">${c.own?'방송국 가기':'채널 보기'}</button></div>`}
function fnVidCard(v,i){return `<button class="vcard" data-act="video" data-arg="${v.id}">${thumb(v.title,v.id,`<span class="dur">${v.len}</span>`)}<div class="vt">${esc(v.title)}</div><div class="vm">${esc(v.by)} · 조회 ${v.vs} · ${v.date}</div></button>`}
function fnView(){
  const f=S.fn,cs=fnCreators();
  if(f.view==='search'){
    const r=fnMatch(f.q),tab=f.tab||'all',n=r.creators.length+r.lives.length+r.videos.length;
    const tabs=[['all','전체',n],['creators','크리에이터',r.creators.length],['lives','라이브',r.lives.length],['videos','영상',r.videos.length]].map(t=>`<button class="chip${tab===t[0]?' act':''}" data-act="fnTab" data-arg="${t[0]}">${t[1]} ${t[2]}</button>`).join('');
    const sec=(t,html,show)=>show&&html?`<section class="fnsec"><h3>${t}</h3>${html}</section>`:'';
    const body=n?sec('크리에이터',`<div class="fncl">${r.creators.map(fnCreatorCard).join('')}</div>`,tab==='all'||tab==='creators')+sec('라이브',`<div class="grid g3">${r.lives.map(fnLiveCard).join('')}</div>`,(tab==='all'||tab==='lives')&&r.lives.length)+sec('영상',`<div class="grid g3">${r.videos.map(fnVidCard).join('')}</div>`,(tab==='all'||tab==='videos')&&r.videos.length):`<div class="empty">${ic('search',32)}'${esc(f.q)}' 검색 결과가 없어요<small class="fanl">다른 검색어로 찾아보세요</small></div>`;
    return `<div class="fnh" data-qa="FN-search"><div class="vh"><h2>${f.q?`'${esc(f.q)}' 검색 결과`:'검색'}</h2><p>크리에이터·라이브·영상을 한 번에 찾아봐요</p></div>
     <label class="fsearch fnq">${ic('search',16)}<input id="fnq" data-in="fnq" placeholder="채널, 라이브, 동영상 검색" value="${esc(f.q)}" aria-label="검색어"></label><div class="s-chips">${tabs}</div>${body}</div>`;
  }
  if(f.view==='creator'){
    const c=cs.find(x=>x.id===f.cid)||cs[0];
    return `<div class="fnh" data-qa="FN-creatorpage"><button class="back" data-act="fnNav" data-arg="search">${ic('chevL',16)}검색 결과</button><div class="fncp">${av(c.n,88)}<div><h2>${esc(c.n)}${c.live?'<span class="lv">LIVE</span>':''}</h2><p>${esc(c.intro)}</p><small class="fanl">즐겨찾기 ${fmt(c.fav)}</small></div><div class="fncpb">${c.own?`<button class="btn pri" data-act="fnBack" data-qa="FN-go-station">${D.name} 방송국 가기</button>`:`<button class="btn sec" data-act="crewGo" data-arg="${c.n}">방송국 가기</button>`}<button class="btn out" data-act="oos">${ic('star',16)}즐겨찾기</button></div></div>
     ${c.live?`<section class="fnsec"><h3>지금 라이브</h3><div class="grid g3">${fnLiveCard(c,1)}</div></section>`:''}
     <section class="fnsec"><h3>최근 영상</h3><div class="grid g3">${fnVids().slice(0,3).map(fnVidCard).join('')}</div></section></div>`;
  }
  const titles={fnhome:['펀네이션 홈','지금 인기 있는 라이브와 크리에이터예요'],fnlive:['펀네이션 라이브','펀네이션에서 방송 중인 라이브예요'],fnyt:['유튜브 라이브','유튜브로 송출 중인 라이브예요'],fnfind:['크리에이터 찾기','마음에 드는 크리에이터를 찾아보세요'],fnfav:['즐겨찾기','즐겨찾기한 크리에이터와 라이브예요']}[f.view]||['펀네이션',''];
  const lives=cs.filter(c=>c.live);
  let body;
  if(f.view==='fnfind'||f.view==='fnfav')body=`<div class="fncl">${cs.filter(c=>f.view==='fnfind'||c.own||c.fav>2000).map(fnCreatorCard).join('')}</div>`;
  else if(f.view==='fnhome')body=`<section class="fnsec"><h3>지금 라이브</h3><div class="grid g3">${lives.map(fnLiveCard).join('')}</div></section><section class="fnsec"><h3>인기 크리에이터</h3><div class="fncl">${cs.slice(0,4).map(fnCreatorCard).join('')}</div></section>`;
  else body=lives.length?`<div class="grid g3">${lives.map(fnLiveCard).join('')}</div>`:'<div class="empty">지금 방송 중인 라이브가 없어요</div>';
  return `<div class="fnh" data-qa="FN-page"><div class="vh"><h2>${titles[0]}</h2><p>${titles[1]}</p></div>${body}</div>`;
}
function renderFn(){const e=$('#fnv');if(!e)return;if(S.shell==='fn'&&!S.admin.on)e.innerHTML=fnView();else e.innerHTML=''}
function fnSearch(q){S.shell='fn';S.fn={view:'search',q:String(q||'').trim(),tab:'all',cid:null};closeSdrop();closePop();sb.open=false;renderAll();MAINS.scrollTop=0}
Object.assign(A,{
 gsearch(){const i=$('#gq');fnSearch(i?i.value:'')},
 fnSearch(el,a){fnSearch(a!==undefined?a:($('#gq')?$('#gq').value:''))},
 fnNav(el,a){S.shell='fn';S.fn.view=a;if(a!=='search')S.fn.tab='all';sb.open=false;layoutSB();renderSide();renderFn();MAINS.scrollTop=0},
 fnCreator(el,a){closeSdrop();S.shell='fn';S.fn.view='creator';S.fn.cid=a;if(!S.fn.q)S.fn.q='';sb.open=false;renderAll();MAINS.scrollTop=0},
 fnTab(el,a){S.fn.tab=a;renderFn()},
 fnBack(){S.shell='station';closeSdrop();sb.open=false;renderAll();MAINS.scrollTop=0},
 gsearchM(){fnSearch('')}
});
Object.assign(IN,{
 gq(el){showSdrop(el.value)},
 fnq(el){S.fn.q=el.value.trim();S.fn.tab='all';const h=$('#fnv .fnh');const pos=el.selectionStart;renderFn();const n=$('#fnq');if(n){n.focus();n.setSelectionRange(pos,pos)}}
});
document.addEventListener('mousedown',e=>{if(e.target.closest&&!e.target.closest('#gsrch'))closeSdrop()});
document.addEventListener('keydown',e=>{
  if(e.target&&e.target.id==='gq'){
    if(e.key==='Enter'&&!e.isComposing){e.preventDefault();fnSearch(e.target.value)}
    else if(e.key==='Escape')closeSdrop();
  }
  if(e.target&&e.target.id==='fnq'&&e.key==='Enter')e.preventDefault();
},true);
document.addEventListener('focusin',e=>{if(e.target&&e.target.id==='gq'&&e.target.value.trim())showSdrop(e.target.value)});
/* ---- 후원: 시그니처로 후원 ---- */
function dsigList(){
  const q=String(don.sq||'').trim(),nq=q.replace(/\D/g,'');
  return SG().slice().sort((a,b)=>a.amt-b.amt).filter(s=>!q||s.n.indexOf(q)>=0||(nq&&String(s.amt).indexOf(nq)>=0));
}
let dsigCards=list=>list.length?list.map(s=>`<button type="button" class="dsc${don.sig===s.id?' on':''}" role="listitem" data-act="dsig" data-arg="${s.id}" aria-pressed="${don.sig===s.id}" data-qa="DON-sig-${s.id}"><span class="dsn">${esc(s.n)}</span><b>${fmt(s.amt)}원</b></button>`).join(''):'<div class="fanl" style="padding:8px">검색 결과가 없어요</div>';
function sigPickHTML(){
  const sel=don.sig&&SG().find(s=>s.id===don.sig);
  return `<div class="s-dsig" id="dsigpick" data-qa="DON-sig"><div class="dsh"><b>시그니처로 후원</b><span class="fanl">선택하면 금액이 자동으로 입력돼요</span></div>
   <div class="dsel" id="dsel" data-qa="DON-sig-sel">${sel?`선택: <b>${esc(sel.n)}</b> · ${fmt(sel.amt)}원 <button type="button" class="link" data-act="dsig" data-arg="${sel.id}">선택 해제</button>`:'<span class="fanl">선택한 시그니처가 없어요</span>'}</div>
   <div class="dsl" id="dsl" role="list">${dsigCards(dsigList())}</div></div>`;
}
function sigPickRefresh(){const e=$('#dsigpick',donOv);if(!e)return;const q=$('#dsq',donOv),v=q?q.value:'',f=document.activeElement===q;e.outerHTML=sigPickHTML();if(f){const n=$('#dsq',donOv);n.focus();n.setSelectionRange(v.length,v.length)}}
Object.assign(A,{
 dsig(el,a){
  const id=+a;
  if(don.sig===id){don.sig=null;don.key=null;don.custom=''}
  else{const s=SG().find(x=>x.id===id);if(!s)return;don.sig=id;if(AMTS.indexOf(s.amt)>=0){don.key=s.amt;don.custom=''}else{don.key='custom';don.custom=fmt(s.amt)}}
  donRender();
 },
 damt(el,a){
  don.key=a==='custom'?'custom':+a;
  if(don.sig){const s=SG().find(x=>x.id===don.sig);if(!s||donAmount().v!==s.amt)don.sig=null}
  donRender();if(a==='custom'){const i=$('#dc',donOv);if(i)i.focus({preventScroll:true})}
 },
 sigDonate(el,a){closeAllModals();openDonate({sig:+a})}
});
IN.dsq=el=>{don.sq=el.value;const l=$('#dsl',donOv);if(l)l.innerHTML=dsigCards(dsigList())};
const __dcustom=IN.dcustom;
IN.dcustom=el=>{__dcustom(el);if(don.sig){const s=SG().find(x=>x.id===don.sig);if(!s||donAmount().v!==s.amt){don.sig=null;sigPickRefresh()}}};

/* ---- 홈 플레이어(라이브 자동 재생) + 현재 후원자 순위 애니메이션 ---- */
function ldrTop(n){return S.ldr.slice().sort((a,b)=>b.a-a.a).slice(0,n||5)}
function ldrRowHTML(d,i){return `<li class="l${i+1}" data-id="${esc(d.id)}" data-amt="${d.a}"><b class="r${i+1}">${i+1}</b><span class="who"><em>${esc(d.n)}</em><small>@${esc(d.id)}</small></span><span class="ldr-amt">${fmt(d.a)}원</span></li>`}
function playerHTML(){
  if(!S.live){return `<div class="player off"><div class="pl-bg"></div><div class="offc">${ic('moon',48)}<b>지금은 방송 중이 아니에요</b><span>다음 방송 ${nextShow()}</span>${S.alarm.level==='off'?`<button class="btn pri" data-act="alarm">라이브 알림 받기</button>`:`<button class="btn sec" data-act="alarm" style="opacity:.7">알림 받는 중</button>`}</div></div>`}
  const t3=ldrTop(3);
  return `<div class="player live" data-qa="HOME-player"><iframe class="plyt" src="${LIVE_SRC}" title="라이브 방송 영상(음소거 자동 재생)" allow="autoplay; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" tabindex="-1"></iframe><div class="pl-live"><span class="lv">LIVE</span><span>시청 <span class="vwr">${fmt(S.viewers)}</span>명</span></div><span class="pl-tag">음소거로 자동 재생돼요</span>
   ${S.overlay?`<div class="ov-don" aria-live="polite"></div><div class="ov-goal"><b><span>목표: 퇴근전쟁 100승</span><span>62/100</span></b><i><u></u></i></div><div class="ov-top"><div>오늘 후원 TOP3</div>${t3.map((d,i)=>`<div><b>${i+1}</b>${esc(d.n)}</div>`).join('')}</div>`:''}</div>`;
}
function infoHTML(){
  if(S.live)return `<div class="bdg"><span class="lv">LIVE</span><span>시청 <span class="vwr">${fmt(S.viewers)}</span>명</span></div><h3>${esc(D.live.title)}</h3><div class="sub">${D.live.cat} · ${D.live.since} 시작</div>
   <div class="ldr" data-qa="T-01-rank"><div class="ldr-h">현재 후원자 순위</div><ol id="ldrol">${ldrTop(5).map(ldrRowHTML).join('')}</ol></div>
   <button class="txtbtn" data-act="ovtoggle" aria-pressed="${S.overlay}">${S.overlay?'오버레이 끄기':'오버레이 켜기'}</button>`;
  const r=REPLAYS[0];
  return `<div class="bdg"><span class="ofb">OFFLINE</span></div><h3>지금은 방송 중이 아니에요</h3><div class="sub">다음 방송: ${nextShow()}<br>마지막 방송: ${D.live.last}</div>${schMemo()}
   <button class="vcard" style="margin-top:14px" data-act="replay" data-arg="0">${thumbR(`<span class="bd">다시보기</span><span class="dur">${r.len}</span>`)}<div class="vt">${esc(r.title)}</div><div class="vm">방송일 ${r.date} · 조회 ${fmt(r.views)}</div></button>
   <button class="link" style="margin-top:10px" data-act="nav" data-arg="replay">다시보기 전체 ›</button>`;
}
const reduceMotion=()=>(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)||document.body.classList.contains('wire');
function countUp(el,from,to){
  if(reduceMotion()){el.textContent=fmt(to)+'원';return}
  const t0=performance.now(),dur=500;
  const step=t=>{const k=Math.max(0,Math.min(1,(performance.now()-t0)/dur)),e=1-Math.pow(1-k,3);const v=Math.max(0,Math.max(Math.min(from,to),Math.min(to,Math.round(from+(to-from)*e))));el.textContent=fmt(v)+'원';if(k<1&&el.isConnected)requestAnimationFrame(step)};
  requestAnimationFrame(step);
}
function ldrRender(animate,hlId){
  const ol=$('#ldrol');if(!ol)return;
  const top=ldrTop(5),old=new Map();
  $$('li',ol).forEach(li=>old.set(li.dataset.id,{top:li.getBoundingClientRect().top,amt:+li.dataset.amt}));
  const order=[];
  top.forEach((d,i)=>{
    let li=$$('li',ol).find(x=>x.dataset.id===d.id);const isNew=!li;
    if(!li){li=document.createElement('li');li.dataset.id=d.id;li.innerHTML='<b></b><span class="who"><em></em><small></small></span><span class="ldr-amt"></span>';li.querySelector('em').textContent=d.n;li.querySelector('small').textContent='@'+d.id}
    li.className='l'+(i+1)+(isNew&&animate?' enter':'');
    const b=li.querySelector('b');b.className='r'+(i+1);b.textContent=i+1;
    const amtEl=li.querySelector('.ldr-amt'),prev=old.get(d.id);
    if(animate&&prev&&prev.amt!==d.a)countUp(amtEl,prev.amt,d.a);else amtEl.textContent=fmt(d.a)+'원';
    li.dataset.amt=d.a;order.push(li);
  });
  $$('li',ol).forEach(li=>{if(!top.some(d=>d.id===li.dataset.id))li.remove()});
  order.forEach(li=>ol.appendChild(li));
  if(animate){
    order.forEach(li=>{const p=old.get(li.dataset.id);if(!p)return;const dy=p.top-li.getBoundingClientRect().top;
      if(Math.abs(dy)>1){ol.dataset.flip=(+ol.dataset.flip||0)+1;li.style.transition='none';li.style.transform='translateY('+dy+'px)';void li.offsetHeight;li.style.transition='transform .5s cubic-bezier(.22,.8,.3,1)';li.style.transform='';li.addEventListener('transitionend',()=>{li.style.transition=''},{once:true})}});
    if(hlId){const h=$$('li',ol).find(x=>x.dataset.id===hlId);if(h){h.classList.add('hl');setTimeout(()=>h.classList.remove('hl'),1600)}}
  }
  $$('.ov-top').forEach(e=>{e.innerHTML='<div>오늘 후원 TOP3</div>'+ldrTop(3).map((d,i)=>`<div><b>${i+1}</b>${esc(d.n)}</div>`).join('')});
}
function ldrAdd(d,amt,animate){d.a+=amt;ldrRender(animate&&!reduceMotion(),d.id)}
function ldrBump(name,id,amt){let d=S.ldr.find(x=>x.id===id);if(!d){d={n:name,id:id,a:0};S.ldr.push(d)}ldrAdd(d,amt,true)}
function ldrTick(){
  if(S.live){
    const L=S.ldr.slice().sort((a,b)=>b.a-a.a),cand=[];
    for(let i=1;i<=5&&i<L.length;i++)cand.push({i:i,gap:L[i-1].a-L[i].a});
    const ok=cand.filter(c=>c.gap<=40000),pick=ok.length?ok[Math.floor(Math.random()*ok.length)]:cand.slice().sort((a,b)=>a.gap-b.gap)[0];
    const d=L[pick.i],amt=pick.gap+[1000,2000,3000,5000][Math.floor(Math.random()*4)];
    ldrAdd(d,amt,true);
    if(S.overlay&&$('.ov-don')&&!reduceMotion())ovShow({n:d.n,a:amt,m:'',s:''});
  }
  setTimeout(ldrTick,2500+Math.random()*1000);
}
setTimeout(ldrTick,3000);
/* ---- 설정 연동: 데모 패널 내 팬 랭킹 / 시그니처 링크 기본값 ---- */

AVIEWS.splice(AVIEWS.findIndex(v=>v.id==='notices'),1);
/* ---- 방송국 관리: 위 = 현재 적용 중(결과) / 아래 = 설정 변경 ---- */
const adl=rows=>`<dl class="adl">${rows.map(r=>`<div class="adr"><dt>${r[0]}</dt><dd>${r[1]===''||r[1]==null?'<span class="aempty">설정 없음</span>':r[1]}</dd></div>`).join('')}</dl>`;
const atab=(head,rows,empty)=>rows.length?`<div class="atbl"><table><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:`<div class="aempty block">${empty||'설정 없음'}</div>`;
const abadge=(t,c)=>`<span class="abadge${c?' '+c:''}">${t}</span>`;
const readLabel=b=>b.read==='vip'?(VIPL[b.vip]||'VIP')+' (팬랭킹 '+VIPN[b.vip||'vip']+'위 이내)':RL[b.read];
const writeLabel=b=>b.write==='vip'?(VIPL[b.vip]||'VIP')+' (팬랭킹 '+VIPN[b.vip||'vip']+'위 이내)':WL[b.write];
const bnCards=(l,k)=>l.length?`<div class="abns ${k}">${l.map(b=>`<div class="abn"><div class="abni"><img src="${b.img.data}" alt=""></div><div class="abnm">${abadge(b.on?'노출 중':'숨김',b.on?'ok':'off')}${b.link?`<span class="aurl">${esc(b.link)}</span>`:'<span class="aempty">링크 없음</span>'}<small>${esc(b.alt||'')}</small></div></div>`).join('')}</div>`:'<div class="aempty block">기본 이미지 사용 중 · 등록하면 이 자리에 보여요</div>';
Object.assign(SAVEDV,{
 title(){const im=S.station.bannerImg;return `<div class="athumb wide" style="${im?`background:center/cover no-repeat url('${im.data}')`:''}">${im?'':``}</div>${adl([['파일',im?esc(im.name):''],['크기',im?im.w+' × '+im.h+' · '+fmtSize(im.size):''],['상태',im?abadge('사용 중','ok'):abadge('기본 이미지 사용 중','off')]])}`},
 intro(){const s=S.station,rules=String(s.rulesText||'').split('\n').map(x=>x.trim()).filter(Boolean);return adl([['한 줄 소개',s.intro?`<b>${esc(s.intro)}</b>`:''],['방송 시간',`<b>${esc(schTxt(s.schedule))}</b>`],['소개글',s.introText?`<div class="apre">${esc(s.introText)}</div>`:''],['방송 규칙',rules.length?`<ol class="aol">${rules.map(r=>`<li>${esc(r.replace(/^\d+\.\s*/,''))}</li>`).join('')}</ol>`:''],['외부 링크',s.links.length+'개']])},
 links(){const l=S.station.links;return atab(['종류','주소'],l.map(x=>[`<b>${LTYPE[x.type][0]}</b>`,`<span class="aurl">${esc(x.url)}</span>`]),'등록된 외부 링크가 없어요')},
 rbanner(){return bnCards(S.station.rightBanners,'r')},
 mbanner(){return bnCards(S.station.midBanners,'m')},
 crew(){const cr=S.station.crew;return adl([['크루명',`<b>${esc(cr.name)}</b>`],['크루원',cr.list.length+'명 / 20명']])+atab(['크루원','아이디','역할','직급'],cr.list.map(m=>[`<span class="atn">${av(m.n,28)}<b>${esc(m.n)}</b></span>`,'@'+esc(m.id),`<span class="rl${m.role==='크루장'?' cap':''}">${m.role}</span>`,`<span class="cbd${m.role==='크루장'?' cap':''}">${esc(crewRankOf(m))}</span>`]),'등록된 크루원이 없어요')},
 boards(){return atab(['게시판','공개 범위','글쓰기 권한','설명'],S.station.boardList.map(b=>b.type==='divider'?[`<span class="aempty">— 구분선 ${b.label?'· '+esc(b.label):''} —</span>`,'','','']:[`<span class="atn">${ic(RICON[b.read],16)}<b>${esc(b.name)}</b></span>`,abadge(readLabel(b)),abadge(writeLabel(b)),`<span class="asub">${esc(b.desc||'')}</span>`]),'게시판이 없어요')},
 banwords(){const bw=S.station.banwords;return adl([['금칙어 필터',bw.on?abadge('ON','ok'):abadge('OFF','off')],['등록된 금칙어',bw.list.length+'개 / 100개'],['목록',bw.list.length?`<div class="s-tags">${bw.list.map(w=>`<span class="s-tag" style="padding-right:12px">${esc(w)}</span>`).join('')}</div>`:'']])},
 managers(){const ms=S.station.managers;return atab(['매니저','아이디','권한','지정일'],ms.map(m=>[`<span class="atn">${av(m.n,28)}<b>${esc(m.n)}</b></span>`,'@'+esc(m.id),Object.keys(PL).filter(k=>m.perm[k]).map(k=>abadge(PL[k])).join(' ')||'<span class="aempty">권한 없음</span>',m.since]),'지정된 매니저가 없어요')},
 sanctions(){const ss=S.station.sanctions;return atab(['대상','유형','기간','사유','등록'],ss.map(s=>[`<span class="atn">${av(s.n,28)}<b>${esc(s.n)}</b></span>`,abadge(TL[s.type],'bad'),s.exp?'~'+s.exp:'영구',`<span class="asub">${esc(s.memo)}</span>`,esc(s.by)+' · '+s.date.slice(5)]),'제재 중인 유저가 없어요')},
 sigs(){const l=S.station.sigs.slice().sort((a,b)=>a.amt-b.amt);return atab(['','시그니처','금액','영상','표시'],l.map(s=>[s.img?`<img class="asgi" src="${s.img.data}" alt="">`:`<span class="asgi ph">${ic('sparkle',16)}</span>`,`<b>${esc(s.n)}</b><div class="asub">${esc(s.desc||'')}</div>`,`<b class="aamt">${fmt(s.amt)}원</b>`,s.link?abadge('영상 연결','ok'):'<span class="aempty">기본 영상</span>',s.hot?abadge('HOT','hot'):'']),'등록된 시그니처가 없어요')},
 schedule(){
  const a=S.admin,sm=a.schM||(a.schM={y:2026,m:10}),sc=S.station.schedule,mk=sm.y+'.'+pad(sm.m+1);
  const evs=sc.events.filter(e=>(e.date||'').slice(0,7)===mk).sort((x,y)=>x.date===y.date?(x.start<y.start?-1:1):(x.date<y.date?-1:1));
  const first=new Date(sm.y,sm.m,1),dim=new Date(sm.y,sm.m+1,0).getDate(),lead=first.getDay();
  const cells=[];for(let i=0;i<lead;i++)cells.push('<span class="ac off"></span>');
  for(let d=1;d<=dim;d++){const k=sm.y+'.'+pad(sm.m+1)+'.'+pad(d),ev=evs.filter(e=>e.date===k);cells.push(`<div class="ac${ev.length?' has':''}"><span class="dn">${d}</span>${ev.slice(0,2).map(e=>`<span class="ce ${KCLS[e.kind]}"><i>${e.start}</i><span>${esc(e.title)}</span></span>`).join('')}${ev.length>2?`<span class="cmore">+${ev.length-2}</span>`:''}</div>`)}
  while(cells.length%7)cells.push('<span class="ac off"></span>');
  return adl([['선택한 달',`<b>${sm.y}년 ${sm.m+1}월</b> · 등록된 스케줄 ${evs.length}건`],['정규 방송 시간',esc(schTxt(sc))],['다음 방송',`<b>${nextShow()}</b>`],['메모',esc(sc.memo||'')]])
   +`<div class="asc-t"><button type="button" class="chip" data-act="schCal" aria-expanded="${!!a.calOpen}">${a.calOpen?'달력 접기':'달력으로 보기'}</button><span class="fanl">달력은 접어 두면 아래 설정이 더 빨리 보여요</span></div>`+(a.calOpen?`<div class="acal" data-qa="ADM-sch-cal"><div class="acw">${DOWN.map((d,i)=>`<span class="${i===0?'su':i===6?'sa':''}">${d}</span>`).join('')}</div><div class="acc">${cells.join('')}</div></div>`:'')
   +(evs.length?atab(['날짜','시간','제목','구분'],evs.map(e=>[dkLabel(e.date),e.start+(e.end?' ~ '+e.end:''),`<b>${esc(e.title)}</b>`,abadge(e.kind,e.kind==='합방'?'pink':e.kind==='특집'?'gold':e.kind==='직급전'?'hot':'')])):'<div class="aempty block">이 달에는 등록된 스케줄이 없어요</div>');
 }
});
const AFLASH={};
const ADMLBL={fans:'팬 현황',log:'관리 활동 기록'};
function admMonthBar(){
  const sm=S.admin.schM||(S.admin.schM={y:2026,m:10});
  return `<div class="admmonth" data-qa="SCH-month"><button class="ib sm" data-act="evMonth" data-arg="-1" aria-label="이전 달">${ic('chevL',16)}</button><select class="inp" data-ch="smY" aria-label="연도">${[2025,2026,2027].map(y=>`<option ${y===sm.y?'selected':''} value="${y}">${y}년</option>`).join('')}</select><select class="inp" data-ch="smM" aria-label="월">${Array.from({length:12},(_,i)=>`<option value="${i}" ${i===sm.m?'selected':''}>${i+1}월</option>`).join('')}</select><button class="ib sm" data-act="evMonth" data-arg="1" aria-label="다음 달">${ic('chevR',16)}</button><span class="fanl">선택한 달의 스케줄만 보고, 등록·수정·삭제해요</span></div>`;
}
function admComposed(v){
  const html=ADMBODY[v]();
  const box=document.createElement('div');box.innerHTML=html;
  const edit=box.querySelector(':scope>.s-card.edit'),cur=box.querySelector(':scope>.s-card.cur');
  const fl=S.admin.flash&&Date.now()-S.admin.flash<2500?' flash':'';
  if(!edit||!cur)return `<section class="asec cur" data-qa="ADM-cur"><header class="ash"><span class="astep">${ic('list',16)}</span><div><h2>${ADMLBL[v]||AVIEW(v).label}</h2><small>조회 화면이에요</small></div></header><div class="asb">${html}</div></section>`;
  const eh=edit.querySelector(':scope>h3'),ch=cur.querySelector(':scope>h3');if(eh)eh.remove();if(ch)ch.remove();
  return (v==='schedule'?admMonthBar():'')
   +`<section class="asec cur${fl}" data-qa="ADM-cur"><header class="ash"><span class="astep">1</span><div><h2>현재 적용 중</h2><small>방송국에 지금 보이는 설정이에요</small></div><span class="abadge ok">적용됨</span></header><div class="asb">${cur.innerHTML}</div></section>
   <div class="aarrow" aria-hidden="true">${ic('chevD',16)}아래에서 설정을 바꾸고 [저장]하면 위 결과에 바로 적용돼요</div>
   <section class="asec edit" data-qa="ADM-edit"><header class="ash"><span class="astep">2</span><div><h2>설정 변경</h2><small>여기서 바꾼 내용은 저장하기 전까지 방송국에 반영되지 않아요</small></div></header><div class="asb">${edit.innerHTML}</div></section>`;
}
function admRender(){
  const a=S.admin,v=AVIEW(a.view),root=$('#admin');if(!a.on||!root)return;
  root.innerHTML=`<div class="adm-in" data-qa="M-02"><div class="admtop"><button class="btn sec sm" data-act="admBack">${ic('chevL',14)}방송국</button><button class="btn out sm admsel" data-act="sbdrawer">${esc(v.label)} ${ic('chevD',14)}</button></div>
   <div class="crumb">방송국 관리 › ${v.grp} › ${v.label}</div><h1>${v.label}</h1><p class="adesc">${DESC[a.view]}</p>
   <div id="abody" class="adm-view" data-qa="${v.qa}">${admComposed(a.view)}</div></div>
   <input type="file" id="fileIn" data-ch="fileIn" accept="image/png,image/jpeg,image/gif,image/webp" hidden>`;
  admTouch();
}
function admBodyRefresh(){const b=$('#abody');if(b){b.innerHTML=admComposed(S.admin.view);admTouch()}}
const __admSaveF=admSave;
admSave=function(){
  const a=S.admin,was=a.dirty,r=__admSaveF.apply(this,arguments);
  if(r===true&&was&&!a.dirty){a.flash=Date.now();admBodyRefresh();requestAnimationFrame(admScrollCur);setTimeout(()=>{if(S.admin.flash&&Date.now()-S.admin.flash>=2400){S.admin.flash=0}},2600)}
  return r;
};
/* 스케줄: 월 선택 · 그 달 날짜만 */
const smBounds=()=>{const sm=S.admin.schM||(S.admin.schM={y:2026,m:10});return {min:sm.y+'-'+pad(sm.m+1)+'-01',max:sm.y+'-'+pad(sm.m+1)+'-'+pad(new Date(sm.y,sm.m+1,0).getDate()),def:sm.y+'-'+pad(sm.m+1)+'-01'}};
const __schBody=ADMBODY.schedule;
ADMBODY.schedule=function(){
  let h=__schBody(),b=smBounds();
  h=h.split('min="2026-01-01" max="2026-12-31"').join('min="'+b.min+'" max="'+b.max+'"');
  h=h.replace('id="evDate" data-in="noop"','id="evDate" data-in="noop" value="'+b.def+'"');
  h=h.replace(/<span class="sp"><\/span><button class="ib sm" data-act="evMonth" data-arg="-1"[^>]*>.*?<\/button><button class="ib sm" data-act="evMonth" data-arg="1"[^>]*>.*?<\/button>/,'');
  return h;
};
const __evAdd=A.evAdd;
A.evAdd=function(){
  const er=$('#evErr'),dv=$('#evDate')&&$('#evDate').value,b=smBounds();
  if(er&&dv&&(dv<b.min||dv>b.max)){er.textContent='선택한 '+(S.admin.schM.m+1)+'월의 날짜만 등록할 수 있어요';return}
  __evAdd();
};
Object.assign(A,{
 evMonth(el,a){const s=S.admin,m=s.schM||(s.schM={y:2026,m:10});let n=m.y*12+m.m+(+a);n=Math.max(2025*12,Math.min(2027*12+11,n));m.y=Math.floor(n/12);m.m=n%12;admBodyRefresh()}
});
Object.assign(CH,{
 smY(el){const m=S.admin.schM;m.y=+el.value;admBodyRefresh()},
 smM(el){const m=S.admin.schM;m.m=+el.value;admBodyRefresh()}
});


/* ===== 14차: 관리 저장 후 결과 스크롤 · 긴 결과 요약(접기) · 게시글 수정/삭제 ===== */
const ACOL=6;
function acolScroller(el){let p=el.parentElement;while(p&&p!==document.body){const o=getComputedStyle(p).overflowY;if((o==='auto'||o==='scroll')&&p.scrollHeight>p.clientHeight+2)return p;p=p.parentElement}return document.scrollingElement||document.documentElement}
function admScrollCur(){
  const root=$('#abody');if(!root)return;
  const tgt=root.firstElementChild;if(!tgt)return;
  const sc=acolScroller(tgt),isDoc=sc===document.scrollingElement||sc===document.documentElement;
  let off=16;const tp=$('.admtop');if(tp&&getComputedStyle(tp).position==='sticky')off+=tp.offsetHeight;
  const top=tgt.getBoundingClientRect().top-(isDoc?0:sc.getBoundingClientRect().top)+sc.scrollTop-off;
  sc.scrollTo({top:Math.max(0,top),behavior:reduceMotion()?'auto':'smooth'});
}
let acolObs=null,acolBusy=false;
function acolApply(){
  const root=$('#abody');if(!root)return;
  const host=$('#admin');if(acolObs)acolObs.disconnect();
  const ex=S.admin.exp||(S.admin.exp={});
  $$('.acolbtn',root).forEach(b=>b.remove());
  let n=0;
  $$('.asec.cur tbody, .asec.cur .ttab',root).forEach(el=>{
    const rows=Array.from(el.children).filter(c=>c.matches('tr,.trow'));
    if(rows.length<=ACOL+1){rows.forEach(r=>r.classList.remove('acol'));return}
    const key=S.admin.view+'|'+(S.admin.fanTab||'')+'|'+(n++),open=!!ex[key];
    rows.forEach((r,i)=>r.classList.toggle('acol',!open&&i>=ACOL));
    const b=document.createElement('button');b.type='button';b.className='btn out sm acolbtn';b.dataset.act='acolT';b.dataset.arg=key;b.setAttribute('aria-expanded',open?'true':'false');
    b.textContent=open?'접기':'전체 '+rows.length+'개 보기 ('+ACOL+'개만 표시 중)';
    (el.closest('.atbl')||el).insertAdjacentElement('afterend',b);
  });
  if(acolObs&&host)acolObs.observe(host,{childList:true,subtree:true});
}
(function(){const host=$('#admin');if(!host||!window.MutationObserver)return;
  acolObs=new MutationObserver(()=>{if(acolBusy)return;acolBusy=true;Promise.resolve().then(()=>{try{acolApply()}finally{acolBusy=false}})});
  acolObs.observe(host,{childList:true,subtree:true});
})();
Object.assign(A,{
 acolT(el,a){const ex=S.admin.exp||(S.admin.exp={});ex[a]=!ex[a];acolApply()},
 schCal(){S.admin.calOpen=!S.admin.calOpen;admBodyRefresh()}
});

/* 게시글 수정 · 삭제 · 공지 지정 */
const canModPost=p=>!!p&&S.loggedIn&&(p.author===actorName()||isStreamer()||isMgrAny());
const __pd14=postDetail;
postDetail=function(id,pid){
  let h=__pd14(id,pid);const p=(S.posts[id]||[]).find(x=>x.id===pid);if(!p)return h;
  if(p.edited)h=h.replace('<span>조회 ','<span>수정됨</span><span>조회 ');
  if(canModPost(p)){
    const key=id+'|'+pid;
    const bar=`<div class="pdact" data-qa="PST-mine"><button class="btn out sm" data-act="pEdit" data-arg="${key}" data-qa="PST-edit">수정</button><button class="btn out sm dng" data-act="pDel" data-arg="${key}" data-qa="PST-del">삭제</button>${canNotice()&&!p.notice?`<button class="btn out sm" data-act="pnNotice" data-arg="${key}" data-qa="PST-mknotice">공지로 등록</button>`:''}</div>`;
    h=h.replace(/(<div class="body)/,bar+'$1');
  }
  return h;
};
Object.assign(A,{
 pEdit(el,a){
  const x=a.split('|'),p=postOf(a);if(!p||!canModPost(p))return;
  if(blocked('board')){const s=curSanction();toast('운영 정책에 따라 글을 쓸 수 없어요 (만료 '+(s&&s.exp?s.exp:'영구')+')');return}
  S.ui.wr={b:x[0],edit:p.id,title:p.title,html:p.html||('<p>'+esc(p.body||'').replace(/\n/g,'<br>')+'</p>'),files:(p.files||[]).map(f=>({name:f.name,size:f.size})),notice:!!p.notice,pin:!!p.pin,link:p.link?'https://'+p.link:'',restored:false,seq:0};
  go('write');
 },
 pDel(el,a){
  const x=a.split('|'),p=postOf(a);if(!p||!canModPost(p))return;
  confirmM('글을 삭제할까요?',"'"+esc(p.title)+"' 글과 댓글이 함께 삭제돼요. 삭제한 글은 되돌릴 수 없어요",'삭제',()=>{
    const l=S.posts[x[0]],i=l?l.findIndex(q=>q.id===x[1]):-1;if(i>=0)l.splice(i,1);
    if(p.author!==actorName())logAdd('게시판','게시판','게시글 삭제: '+p.title);
    const u=bui(x[0]);u.detail=null;renderNav();go(x[0]);toast('글을 삭제했어요');
  });
 },
 pnNotice(el,a){const p=postOf(a);if(!p||!canNotice())return;p.notice=true;p.pin=false;p.no=0;logAdd('게시판','공지','공지 등록: '+p.title);renderNav();renderView();toast('공지로 등록했어요')}
});
function submitEdit(w,id,t,text,lk){
  const p=(S.posts[id]||[]).find(x=>x.id===w.edit);
  if(!p||!canModPost(p)){toast('수정 권한이 없어요');return}
  const clean=sanitizeHTML(w.html);
  p.title=t;p.html=clean;p.body=text;p.img=/<img/i.test(clean);p.files=w.files.slice();p.link=lk.replace(/^https?:\/\//i,'');p.edited=true;
  if(canNotice()){const was=p.notice;p.notice=!!w.notice;p.pin=!!(w.notice&&w.pin);if(was&&!p.notice)p.no=(S.posts[id]||[]).reduce((m,q)=>Math.max(m,q.no),0)+1;if(!was)p.no=p.notice?0:p.no}
  if(p.author!==actorName())logAdd('게시판','게시판','게시글 수정: '+t);
  S.ui.wr=null;const u=bui(id);u.q='';u.detail=p.id;renderNav();go(id,{detail:p.id});toast('글을 수정했어요');
}


/* ===== 16차: 4단계 1·2단계 (R-01~R-13) ===== */
const go16=go;
go=function(v,o){if(v==='bigrank'||v==='hotfans')v='ranker';if(v==='videos')v='replay';return go16(v,o)};

/* ---- R-02: 크루 공지 카드 ---- */
const CNOTICE=[
 ['새벽결재','[공지] 직급전 날 새벽 결재 라이브 안내','직급전 날에는 새벽 결재 라이브가 평소보다 30분 일찍 시작해요. 서류 지참 필수입니다.','2026.11.04'],
 ['야근요정하루','[공지] 야근 중계 방송 시간 변경','이번 주 야근 중계는 수요일 대신 목요일 밤 10시에 진행해요.','2026.11.03'],
 ['탕비실지킴이','[공지] 탕비실 간식 협찬 신청 받아요','간식 협찬은 게시판 댓글로 신청해 주세요. 이번 달 선착순 5명이에요.','2026.11.05'],
 ['칼퇴희망','[공지] 룰렛 벌금 영수증 공개 일정','지난 방송 룰렛 벌금 영수증은 금요일 방송에서 한꺼번에 공개합니다.','2026.11.02'],
 ['칼퇴희망','[공지] 12월 합방 일정 사전 안내(예약)','12월 합방 일정을 미리 안내해요.','2026.11.08'],
 ['복사기고장','[공지] 복사기 수리 기간 리액션 방송','수리 기간에는 리액션 방송만 진행해요. 편하게 놀러 오세요.','2026.10.30'],
 ['신입은말해요','[공지] 입사 한 달 질문 코너 오픈','입사 한 달 기념으로 질문 코너를 열어요. 댓글로 질문을 남겨 주세요.','2026.10.28'],
 ['수습의여왕','[공지] 정규직 전환 직급전 출전 안내','정규직 전환 직급전에 출전해요. 응원 많이 부탁드립니다.','2026.11.04']
];
let NCL=[];
function noticeItems(){
  const out=[],pn=pinnedPost();
  const all=[];S.station.boardList.forEach(bd=>{if(bd.type!=='board'||!canRead(bd))return;(S.posts[bd.id]||[]).forEach(p=>{if(p.notice&&p.date<=TODAY)all.push({b:bd.id,p:p})})});
  all.sort((a,c)=>postCmp(a.p,c.p));
  const mine=all[0];
  const crewRank=n=>{const c=CRW().find(x=>x.n===n);return c?(c.live===2?'대표':(c.rank||'인턴')):''};
  if(pn&&pn.p.date<=TODAY)out.push({n:'펀상사',rank:'대표',title:pn.p.title,sum:String(pn.p.body||'').slice(0,80),date:pn.p.date,b:pn.b,id:pn.p.id,pin:true});
  else if(mine)out.push({n:'펀상사',rank:'대표',title:mine.p.title,sum:String(mine.p.body||'').slice(0,80),date:mine.p.date,b:mine.b,id:mine.p.id});
  const rest=[];
  CRW().forEach(c=>{
    if(c.live===2)return;
    const l=CNOTICE.filter(x=>x[0]===c.n&&x[3]<=TODAY).sort((a,b)=>a[3]<b[3]?1:-1)[0];
    if(l)rest.push({n:c.n,rank:crewRank(c.n),title:l[1],sum:l[2],date:l[3]});
  });
  rest.sort((a,b)=>a.date<b.date?1:a.date>b.date?-1:0);
  return out.concat(rest);
}
function noticeCardsHTML(){
  NCL=noticeItems();if(!NCL.length)return '';
  return `<div class="sect cnn-wrap" data-qa="B-10"><div class="sec-h"><h2>크루 공지</h2><span class="fanl">크루원별 최신 공지 · 오늘까지 등록분</span></div>
   <div class="cnn-v"><button class="cnn-arr prev" data-act="ncGo" data-arg="-1" aria-label="이전 공지" hidden>${ic('chevL',18)}</button><div class="cnn-track" id="cnnTrack" tabindex="0" aria-label="크루 공지 목록">${NCL.map((x,i)=>`<button class="cnn-card${x.pin?' pin':''}" data-act="ncOpen" data-arg="${i}" data-qa="NOTICE-card"><span class="cnn-h">${av(x.n,36)}<span class="cnn-n"><b>${esc(x.n)}</b><small>${esc(x.rank)}${x.pin?' · 상단 고정':''}</small></span></span><b class="cnn-t">${esc(x.title)}</b><span class="cnn-s">${esc(x.sum)}</span><span class="cnn-d">${x.date}</span></button>`).join('')}</div><button class="cnn-arr next" data-act="ncGo" data-arg="1" aria-label="다음 공지" hidden>${ic('chevR',18)}</button></div></div>`;
}
function ncUpd(){
  const t=$('#cnnTrack');if(!t)return;const w=t.closest('.cnn-v');
  const ov=t.scrollWidth>t.clientWidth+4;
  $('.cnn-arr.prev',w).hidden=!ov||t.scrollLeft<=8;
  $('.cnn-arr.next',w).hidden=!ov||t.scrollLeft+t.clientWidth>=t.scrollWidth-8;
}
function ncInit(){const t=$('#cnnTrack');if(!t)return;t.addEventListener('scroll',ncUpd,{passive:true});ncUpd();setTimeout(ncUpd,300)}
window.addEventListener('resize',()=>{ncUpd()});
Object.assign(A,{
 ncGo(el,a){const t=$('#cnnTrack');if(!t)return;const tl=t.getBoundingClientRect().left,cs=[...t.children].map(c=>c.getBoundingClientRect().left-tl);let d=0;if(+a>0){const n=cs.find(x=>x>6);d=n===undefined?0:n}else{const p=cs.filter(x=>x<-6);d=p.length?p[p.length-1]:0}t.scrollBy({left:d,behavior:reduceMotion()?'auto':'smooth'});setTimeout(ncUpd,450)},
 ncOpen(el,a){
  const x=NCL[+a];if(!x)return;
  if(x.b){openPost(x.b,x.id);return}
  openModal({title:x.n+' 방송국 공지',body:`<div class="cn-d"><b>${esc(x.title)}</b><div class="fanl" style="margin:6px 0 10px">${esc(x.n)} · ${esc(x.rank)} · ${x.date}</div><p>${esc(x.sum)}</p><p class="fanl" style="margin-top:12px">이 공지는 ${esc(x.n)} 방송국 게시글이에요. 방송국 바로가기로 이동하면 전체 게시판을 볼 수 있어요.</p></div>`,foot:`<button class="btn sec" data-act="mclose">닫기</button><button class="btn pri" data-act="crewGo" data-arg="${esc(x.n)}">방송국 바로가기</button>`});
 }
});

/* ---- R-03: 소개 펼침/접기 ---- */
A.introT=function(){S.ui.introOpen=!S.ui.introOpen;renderTop()};
A.intro=A.introT;
openIntro=function(){S.ui.introOpen=true;renderTop()};

/* ---- R-08 / R-09: 랭커 ---- */
const actCache={};
function actBase(per){
  if(actCache[per])return actCache[per];
  const pi=per==='all'?0:+per.slice(1),r=rng(pi*211+4099),all=per==='all';
  const rows=BIGUSERS.map(u=>{
    const chat=Math.round((300+r()*5200)*(all?1:.14)),att=Math.round((4+r()*60)*(all?1:.4)),post=Math.round((1+r()*70)*(all?1:.3)),streak=Math.floor(r()*r()*58)+2;
    return {f:u,v:chat+att*30+post*20,chat:chat,att:att,post:post,streak:streak};
  });
  rows.sort((a,b)=>b.v-a.v);return actCache[per]=rows;
}
function laurelSVG(k){
  const leaf=(i,side)=>{
    const th=(262-i*17)*Math.PI/180,R=42,cx=60,cy=58,x=cx-R*Math.cos(th+Math.PI)*-1,y=cy-R*Math.sin(th);
    const px=cx+R*Math.cos(th),py=cy-R*Math.sin(th),ang=Math.atan2(Math.cos(th),Math.sin(th))*180/Math.PI;
    const o=(i%2?22:-22);
    return `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(10.5-i*.4).toFixed(1)}" ry="4.2" transform="rotate(${(ang+o).toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)})"/>`;
  };
  let l='';for(let i=0;i<9;i++)l+=leaf(i);
  return `<svg class="lrs" viewBox="0 0 120 116" aria-hidden="true" focusable="false"><defs><linearGradient id="lg${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#acfcc7"/><stop offset="1" stop-color="#006e25"/></linearGradient></defs><g fill="url(#lg${k})" opacity=".95">${l}<g transform="translate(120 0) scale(-1 1)">${l}</g></g></svg>`;
}
const FLAME='<svg class="flm" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2s5.2 4.6 5.2 10.2A5.2 5.2 0 0 1 12 17.4a5.2 5.2 0 0 1-5.2-5.2c0-2.1 1-3.6 2.1-4.7.1 1.7.9 2.8 2 2.8C10.4 7.2 12 2 12 2z"/></svg>';
function actEmblem(k,name){return `<span class="lre lre${k}">${laurelSVG(k)}<span class="lrf">${av(name,60)}</span><span class="lrn">${k}</span></span>`}
function actMax(rows){return rows.length?rows[0].v:1}
function actCard(r,i,mx){
  const k=i+1,f=r.f,pct=Math.max(8,Math.round(r.v/mx*100));
  return `<div class="akw ak${k}"><button class="akc" data-act="fan" data-arg="${esc(f.n)}" aria-label="${k}위 ${esc(f.n)}" data-qa="ACT-top${k}">${actEmblem(k,f.n)}<b class="akn">${esc(f.n)}</b><span class="akg"><span class="akgl">활동 점수 <b>${fmt(r.v)}</b></span><span class="akbar" role="img" aria-label="활동 지표 ${pct}%"><i style="width:${pct}%"></i></span></span><span class="aks">${FLAME}<b>${r.streak}일 연속</b></span><span class="akm">채팅 ${fmt(r.chat)} · 출석 ${r.att}일 · 글 ${r.post}</span></button></div>`;
}
function actRow(r,no,mx){
  const f=r.f,pct=Math.max(6,Math.round(r.v/mx*100));
  return `<button class="gkrow akrow" data-act="fan" data-arg="${esc(f.n)}" data-qa="ACT-row"><span class="gkrn aktn">${no}</span>${av(f.n,38)}<span class="gknm"><b>${esc(f.n)}</b><small>@${esc(f.id||idOf(f.n)||'')}</small></span><span class="akbar mini" role="img" aria-label="활동 지표 ${pct}%"><i style="width:${pct}%"></i></span><span class="aks sm">${FLAME}${r.streak}일</span><span class="gkv akv">${fmt(r.v)}점</span></button>`;
}
const actPodium=rows=>{const mx=actMax(rows);return `<div class="apod" data-qa="ACT-podium">${actCard(rows[1],1,mx)}${actCard(rows[0],0,mx)}${actCard(rows[2],2,mx)}</div>`};
rkBody=function(n){
  const tab=S.ui.rkTab,per=S.ui.rkPer;
  if(tab==='act'){const rows=actBase(per).slice(0,n),mx=actMax(rows);return actPodium(rows)+`<div class="gkrows">${rows.slice(3).map((r,i)=>actRow(r,i+4,mx)).join('')}</div>`}
  const rows=bigList(per).slice(0,n);
  return gkPodium(rows,'don')+`<div class="gkrows">${rows.slice(3).map((r,i)=>gkRow(r,i+4,'don')).join('')}</div>`;
};
function rkMy(sub,per,all){
  if(!S.loggedIn)return `<div class="gkmy" data-qa="RNK-my"><span>로그인하면 내 순위를 볼 수 있어요</span><button class="btn pri sm" data-act="login">로그인</button></div>`;
  if(sub==='activity')return `<div class="gkmy" data-qa="RNK-my"><span><b>내 활동</b> 채팅·출석·게시글 활동이 쌓이면 순위에 올라요</span><button class="btn sec sm" data-act="nav" data-arg="${(S.station.boardList.find(b=>b.type==='board')||{id:'board1'}).id}">게시판 가기</button></div>`;
  if(S.donTotal<=0)return `<div class="gkmy" data-qa="RNK-my"><span><b>내 순위</b> 순위 밖 · 후원하면 순위에 올라요</span><button class="btn pri sm" data-act="donate">후원하기</button></div>`;
  if(per!=='all'&&per!=='m11')return `<div class="gkmy" data-qa="RNK-my"><span><b>내 순위</b> 이 기간에는 내 후원 내역이 없어요</span></div>`;
  const i=all.findIndex(r=>r.me);
  if(i<0||i>=50)return `<div class="gkmy" data-qa="RNK-my"><span><b>내 순위 50위 밖</b> · 누적 ${fmt(S.donTotal)}원</span><button class="btn pri sm" data-act="donate">후원하기</button></div>`;
  return `<div class="gkmy" data-qa="RNK-my"><span><b>내 순위 ${i+1}위</b> · 누적 ${fmt(S.donTotal)}원</span></div>`;
}
function rankerView(){
  const u=S.ui,sub=u.rkSub==='activity'?'activity':'donate',per=u.bigPer,N=Math.min(50,u.rkN||10),isD=sub==='donate';
  const all=isD?bigList(per).slice(0,50):actBase(per).slice(0,50),rows=all.slice(0,N),mx=actMax(all);
  const body=(isD?gkPodium(rows,'don'):actPodium(rows))+`<div class="gkrows" data-qa="RNK-list">${rows.slice(3).map((r,i)=>isD?gkRow(r,i+4,'don'):actRow(r,i+4,mx)).join('')}</div>`;
  const more=N<50?`<button class="btn sec rkmore" data-act="rkMore" data-qa="RNK-more">더보기 (${N+1}–${Math.min(50,N+10)}위)</button>`:'';
  return `<div data-qa="T-05"><div class="vh"><h2>랭커</h2><p>${isD?'후원 금액이 많은 순서예요':'채팅·출석·게시글 활동을 합산한 점수 순서예요'} · 최대 50위까지 볼 수 있어요</p></div>
  <div class="rkw gkw${isD?'':' actw'}"><div class="rk-tabs" role="tablist" data-qa="RNK-sub"><button class="rkt${isD?' on':''}" role="tab" aria-selected="${isD}" data-act="rkSub" data-arg="donate" data-qa="RNK-sub-donate">${ic('coin',16)}후원 랭커</button><button class="rkt${isD?'':' on'}" role="tab" aria-selected="${!isD}" data-act="rkSub" data-arg="activity" data-qa="RNK-sub-activity">${ic('users',16)}활동 랭커</button></div>
  <div class="gkper" data-qa="RNK-per"><button class="chip${per==='all'?' act':''}" data-act="bigPer" data-arg="all">역대</button><button class="chip${per==='m11'?' act':''}" data-act="bigPer" data-arg="m11">이번 달</button><select class="rk-mon" data-ch="bigMon" aria-label="2026년 월별 선택"><option value="">2026년 월별</option>${[1,2,3,4,5,6,7,8,9,10,11].map(m=>`<option value="m${m}" ${per==='m'+m?'selected':''}>2026년 ${m}월</option>`).join('')}</select></div>
  ${rkMy(sub,per,all)}${body}<div class="gkrange" data-qa="RNK-range">1–${N}위 / 50위</div>${more}</div></div>`;
}
Object.assign(A,{
 rkSub(el,a){S.ui.rkSub=a;S.ui.rkN=10;renderView()},
 rkMore(){S.ui.rkN=Math.min(50,(S.ui.rkN||10)+10);renderView()},
 rankAll(){const u=S.ui;u.bigPer=u.rkPer;u.rkSub=u.rkTab==='act'?'activity':'donate';u.rkN=10;go('ranker')},
 bigPer(el,a){S.ui.bigPer=a;S.ui.rkN=10;renderView()}
});
CH.bigMon=function(el){if(el.value){S.ui.bigPer=el.value;S.ui.rkN=10;renderView()}};

/* ---- R-04: 크루원 카드 · 직책(A1) · 방송국 바로가기(D1) ---- */
const RKS=['인턴','사원','대리','과장','차장','부장'];
const crewRankOf=c=>c.live===2?'대표':(c.rank||'인턴');
const rkIdx=c=>{const i=['대표'].concat(RKS.slice().reverse()).indexOf(crewRankOf(c));return i<0?99:i};
const CREWX={'펀상사':[1,1,1],'새벽결재':[1,1,1],'야근요정하루':[1,0,1],'탕비실지킴이':[0,1,1],'칼퇴희망':[1,1,0],'복사기고장':[1,0,1],'신입은말해요':[0,1,1],'수습의여왕':[1,1,1]};
const SOOPI='<svg class="soopi" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="11" fill="currentColor" opacity=".18"/><text x="12" y="16.5" text-anchor="middle" font-size="12" font-weight="800" fill="currentColor">S</text></svg>';
function crewCardHTML(c){
  const on=c.live===1||(c.live===2&&S.live),cap=c.live===2,here=(S.sw?S.sw===c.n:cap),x=CREWX[c.n]||[0,0,0];
  const sn=(ok,svg,lb)=>`<button type="button" class="csn${ok?'':' off'}" ${ok?`data-act="csn" data-arg="${lb}"`:'disabled'} aria-label="${lb}${ok?'':' (등록 안 됨)'}">${svg}</button>`;
  return `<div class="cc${on?' on':''}${here?' here':''}" data-qa="CREW-card"><div class="cav">${av(c.n,88)}${on?'<span class="clv">LIVE</span>':''}</div>
   <div class="cnr"><span class="cbd${cap?' cap':''}">${esc(crewRankOf(c))}</span><b>${esc(c.n)}</b></div>
   <div class="csns" role="group" aria-label="SNS">${sn(x[0],ic('youtube',16),'유튜브')}${sn(x[1],ic('instagram',16),'인스타그램')}${sn(x[2],SOOPI,'SOOP')}</div>
   <div class="cbt" role="group" aria-label="크루원 정보"><button type="button" data-act="cmod" data-arg="profile|${esc(c.n)}"><i class="d1"></i>프로필</button><button type="button" data-act="cmod" data-arg="pledge|${esc(c.n)}"><i class="d2"></i>공약</button><button type="button" data-act="cmod" data-arg="sig|${esc(c.n)}"><i class="d3"></i>시그</button></div>
   ${here?'<button class="btn sec sm cgo" disabled>보는 중인 방송국</button>':`<button class="btn pri sm cgo" data-act="crewGo" data-arg="${esc(c.n)}" data-qa="CREW-go">방송국 바로가기</button>`}</div>`;
}
crewView=function(){
  const f=S.ui.crewF;
  const all=CRW().slice().sort((a,b)=>rkIdx(a)-rkIdx(b));
  const list=all.filter(c=>f==='all'||c.live===1||(c.live===2&&S.live)),lc=liveCount();
  return `<div data-qa="T-02"><div class="vh"><h2>크루원 ${CRW().length}</h2><p>${esc(S.station.crew.name)} · 크루원 카드에서 프로필·공약·시그를 보고 방송국으로 이동해요</p></div>
   <div class="s-chips crf"><button class="chip${f==='all'?' act':''}" data-act="crewF" data-arg="all">전체 ${CRW().length}</button><button class="chip${f==='live'?' act':''}" data-act="crewF" data-arg="live">방송 중 ${lc}</button>${isStreamer()?`<button class="chip mine${f==='mine'?' act':''}" data-act="crewF" data-arg="mine" data-qa="CREW-mine">${ic('lock',14)}내가 속한 크루 ${mineList().length}</button>`:''}</div>
   ${f==='mine'&&isStreamer()?mineHTML():list.length?`<div class="mgrid cgrid" data-qa="CREW-grid">${list.map(crewCardHTML).join('')}</div>`:`<div class="empty">${ic('moon',32)}지금 방송 중인 크루원이 없어요</div>`}</div>`;
};
function cimg(label,cls){return `<figure class="cfig ${cls||''}"><div class="cimg" role="img" aria-label="${esc(label)} 이미지 자리">${ic('image',30)}<small>이미지가 들어갈 자리</small></div>${label?`<figcaption>${esc(label)}</figcaption>`:''}</figure>`}
Object.assign(A,{
 csn(el,a){toast(a+' 채널로 이동해요')},
 cmod(el,a){
  const p=a.split('|'),k=p[0],n=p.slice(1).join('|');
  const T={profile:'프로필',pledge:'공약',sig:'시그'}[k]||'프로필';
  const body=k==='pledge'?`<div class="cpl">${cimg('일반회차 공약','v')}${cimg('직급전 공약','v')}</div>`:cimg('','sq');
  openModal({title:n+' · '+T,cls:'cmodal',qa:'CREW-modal',body:body+'<p class="fanl cnone">등록된 이미지가 없습니다 · 실제 서비스에서는 크루원이 등록한 이미지가 보여요</p>',foot:'<button class="btn sec" data-act="mclose">닫기</button>'});
 },
 crewGo(el,a){swTo(a)},
 swBack(){swBack()}
});
let LT0=null;
function swTo(n){
  const c=CRW().find(x=>x.n===n);if(!c)return;
  if(c.live===2){if(S.sw)swBack();else toast('지금 보고 있는 방송국이에요');return}
  if(!S.sw){S.liveHome=S.live;LT0=D.live.title}S.sw=n;D.name=n;S.live=c.live===1;D.live.title=c.lt||D.live.title;S.ui.introOpen=false;closeAllModals();S.view='home';renderAll();const mm=document.getElementById('main');if(mm)mm.scrollTop=0;toast(n+' 방송국으로 이동했어요');
}
function swBack(){S.sw=null;D.name='펀상사';if(S.liveHome!==undefined)S.live=S.liveHome;if(LT0)D.live.title=LT0;closeAllModals();S.view='home';renderAll();const mm=document.getElementById('main');if(mm)mm.scrollTop=0;toast('펀상사 방송국으로 돌아왔어요')}
const renderTop16=renderTop;
renderTop=function(){
  if(!S.sw&&D.name!=='펀상사'){D.name='펀상사';if(LT0)D.live.title=LT0}
  renderTop16();
  if(S.sw){
    const c=CRW().find(x=>x.n===S.sw);if(!c)return;
    const h=$('#top .pi h1');if(h)h.insertAdjacentHTML('afterbegin',`<span class="cbd">${esc(crewRankOf(c))}</span> `);
    const t=$('#top .intro .t');if(t)t.textContent=c.intro;
    const r=$('#restrict');if(r)r.innerHTML=`<div class="swbar" data-qa="SW-bar"><button class="btn sec sm" data-act="swBack">${ic('chevL',14)}펀상사 방송국으로 돌아가기</button><span>${esc(S.sw)} 방송국을 보고 있어요 · 같은 크루 구성으로 보여요</span></div>`+r.innerHTML;
  }
};
CH.crewRank=function(el){const d=S.admin.draft&&S.admin.draft.v,m=d&&d.list&&d.list.find(x=>x.id===el.dataset.id);if(!m||!canSt())return;m.rank=el.value;S.admin.touched.add('v.list.'+m.id+'.rank');admBodyRefresh()};

/* ---- R-10: 팔로워 칭호 ---- */
const TTK={black:'gp',dia:'nb',gold:'gs',dirt:'ds'};const FOLT=(()=>{const o={};FANS.forEach(f=>{o[f.n]=TTK[f.t]||'ds'});return o})();
const TTL={ds:['흙수저','#663a00','#ffffff'],gs:['금수저','#ffa938','#361e00'],nb:['노블레스','#6541f2','#ffffff'],gp:['골드프라임','#ffa938','#361e00']};
const STARI='<svg class="ttst" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z" fill="currentColor"/></svg>';
/* 닉네임 옆 등급 — 글자 라벨(골드프라임 등) 대신 20단계 등급 아이콘(2026-11-13) */
const ttBadge=(n,force)=>{if(!FOLT[n]&&!force)return '';const g=gradeOf(n);return `<img class="ttic" src="${GIMG}grade-${pad(g)}-s.webp" width="20" height="20" alt="${GRADEN[g]} 등급" title="${GRADEN[g]} 등급" data-qa="FOL-title">`};
const rkBadge=n=>{const f=fanOf(n);return f&&f.rank<=20?`<span class="rkb" data-qa="FOL-ranker">랭커 ${f.rank}위</span>`:''};
const FOLLOWERS=FANS.map(f=>{const h=String(f.n).split('').reduce((a,c)=>a+c.charCodeAt(0),0),d=1+h%27,y=+f.since.slice(0,4),m=+f.since.slice(5,7);let mo=(2026*12+11)-(y*12+m)-(5<d?1:0);return {n:f.n,mo:Math.max(1,mo),start:f.since+'.'+pad(d)}});
/* 팔로워 정렬 — 홈 · 영상 목록과 같은 정렬 칩(65771:60928) + 정렬 메뉴(65771:60849) + 구분선(65771:56827) + 필터 칩.
   styles.css 의 .sort · .chip-bar__divider 를 그대로 씀 */
const FOL_SORT=[['rec','최근 즐겨찾기순'],['dur','즐겨찾기 오래된순']];
function sortChip(items,curKey,act){
  const cur=items.find(x=>x[0]===curKey)||items[0];
  return `<div class="sort"><button class="sort__btn" type="button" aria-haspopup="menu" aria-expanded="false" data-act="sortPop"><img src="assets/v2/sort-ascending.svg" width="16" height="16" alt=""><span>${cur[1]}</span></button>
   <div class="sort__pop" role="menu" aria-label="정렬" hidden>${items.map(x=>`<button class="sort__item" type="button" role="menuitemradio" aria-checked="${x[0]===cur[0]}" data-act="${act}" data-arg="${x[0]}">${x[1]}</button>`).join('')}</div></div>
   <span class="chip-bar__divider" aria-hidden="true"></span>`;
}
function folSortBar(u,flt){
  return `<div class="sort-bar">${sortChip(FOL_SORT,u.subSort,'ssort')}<div class="sort-bar__chips">${flt.map(t=>`<button class="chip${u.subTier===t?' act':''}" data-act="stier" data-arg="${t}">${t}</button>`).join('')}</div></div>`;
}
A.sortPop=el=>{const p=el.nextElementSibling;p.hidden=!p.hidden;el.setAttribute('aria-expanded',String(!p.hidden))};
A.sigSortSet=(el,a)=>{S.ui.sigSort=a;renderView()};
document.addEventListener('click',e=>{document.querySelectorAll('.stn .sort-bar .sort__pop:not([hidden])').forEach(p=>{if(!p.parentNode.contains(e.target)){p.hidden=true;p.previousElementSibling.setAttribute('aria-expanded','false')}})});
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;document.querySelectorAll('.stn .sort-bar .sort__pop:not([hidden])').forEach(p=>{p.hidden=true;p.previousElementSibling.setAttribute('aria-expanded','false');p.previousElementSibling.focus()})});
subView=function(){
  const u=S.ui;let l=FOLLOWERS.slice();
  const flt=['전체','골드프라임','노블레스','금수저','흙수저'];
  if(flt.indexOf(u.subTier)<0)u.subTier='전체';
  if(u.subTier!=='전체')l=l.filter(s=>TTL[FOLT[s.n]][0]===u.subTier);
  l=l.sort((a,b)=>u.subSort==='dur'?(a.start<b.start?-1:1):(a.start<b.start?1:-1));
  return `<div data-qa="L-02"><div class="vh"><h2>팔로워 ${fmt(S.favCount)}</h2><p>방송국을 즐겨찾기한 유저예요 · 최근 ${FOLLOWERS.length}명만 보여요</p></div>
   ${folSortBar(u,flt)}
   ${l.length?`<div class="sgrid">${l.map(s=>`<button class="sfan" data-act="fan" data-arg="${s.n}">${av(s.n,40)}<span><span class="nm">${ttBadge(s.n)}${esc(s.n)}${rkBadge(s.n)}</span><small>즐겨찾기 ${s.mo}개월 · ${s.start}</small></span></button>`).join('')}</div>`:'<div class="empty">해당하는 팔로워가 없어요</div>'}</div>`;
};

/* ---- R-13: 후원 창 시그니처 (가격대 필터 + 이미지형 카드) ---- */
const DSP=[['전체',0,Infinity],['10만 미만',0,1e5],['10만~30만',1e5,3e5],['30만~60만',3e5,6e5],['60만~80만',6e5,8e5],['80만~100만',8e5,1e6],['100만 이상',1e6,Infinity]];
dsigList=function(){
  const q=String(don.sq||'').trim(),nq=q.replace(/\D/g,''),p=DSP.find(x=>x[0]===(don.sp||'전체'))||DSP[0];
  return SG().slice().sort((a,b)=>a.amt-b.amt).filter(s=>s.amt>=p[1]&&s.amt<p[2]).filter(s=>!q||s.n.indexOf(q)>=0||(nq&&String(s.amt).indexOf(nq)>=0));
};
const CHK='<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
dsigCards=list=>list.length?list.map(s=>`<button type="button" class="dsc dsci${don.sig===s.id?' on':''}" role="listitem" data-act="dsig" data-arg="${s.id}" aria-pressed="${don.sig===s.id}" data-qa="DON-sig-${s.id}"><span class="dsimg">${s.img?`<img src="${s.img.data}" alt="">`:ic('image',22)}${don.sig===s.id?`<span class="dsck">${CHK}</span>`:''}</span><span class="dsn">${esc(s.n)}</span><b>${fmt(s.amt)}원</b></button>`).join(''):`<div class="fanl dsempty">${don.sq&&String(don.sq).trim()?'검색 결과가 없어요':'이 가격대의 시그니처가 없어요'}</div>`;
sigPickHTML=function(){
  const sel=don.sig&&SG().find(s=>s.id===don.sig),cur=don.sp||'전체';
  return `<div class="s-dsig" id="dsigpick" data-qa="DON-sig"><div class="dsh"><b>시그니처로 후원</b><span class="fanl">선택하면 금액이 자동으로 입력돼요</span></div>
   <div class="dsp" role="group" aria-label="가격대" data-qa="DON-sig-price">${DSP.map(p=>`<button type="button" class="chip${cur===p[0]?' act':''}" data-act="dsp" data-arg="${p[0]}">${p[0]}</button>`).join('')}</div>
   <div class="dsel" id="dsel" data-qa="DON-sig-sel">${sel?`선택: <b>${esc(sel.n)}</b> · ${fmt(sel.amt)}원 <button type="button" class="link" data-act="dsig" data-arg="${sel.id}">선택 해제</button>`:'<span class="fanl">선택한 시그니처가 없어요</span>'}</div>
   <div class="dsl dsgrid" id="dsl" role="list">${dsigCards(dsigList())}</div></div>`;
};
A.dsp=function(el,a){don.sp=a;sigPickRefresh()};

/* ---- 해시·와이어 ---- */
const __ah16=applyHash;
applyHash=function(){
  const o=parseHash();
  __ah16();
  if(!Object.keys(o).length)return;
  let ch=false;
  if(S.view==='bigrank'||S.view==='videos'){S.view=S.view==='videos'?'replay':'ranker';ch=true}
  if(o.view==='videos'){S.view='replay';ch=true}
  if(o.view==='ranker'||o.view==='bigrank'){
    S.view='ranker';ch=true;
    if(o.rk==='activity'||o.rk==='act')S.ui.rkSub='activity';else if(o.rk==='donate'||o.rk==='don')S.ui.rkSub='donate';
    if(o.rkn)S.ui.rkN=Math.min(50,Math.max(10,+o.rkn||10));
  }
  if(o.intro==='1'){S.ui.introOpen=true;ch=true}
  if(o.sw){const c=CRW().find(x=>x.n===o.sw||x.id===o.sw);if(c&&c.live!==2){swTo(c.n);ch=false}}
  if(ch){renderAll();applyWire()}
  if(o.modal==='cprofile'||o.modal==='cpledge'||o.modal==='csig')A.cmod(null,o.modal.slice(1)+'|'+(o.name||'새벽결재'));
  if(o.view==='crew'||o.view==='home'||o.view==='signature'){}
};


const PLTHUMB='assets/v2/station/player-thumb.jpg';

/* ===== 19차: 시그 페이지 · 금액 버튼 · 크루 공지 이동 · 기본 배너 · 크루원 탭 조건 · 홈 썸네일 플레이어 ===== */
const amtL=x=>(x/10000)+'만';
/* 후원 시그니처: 한 줄 3개 + 이전/다음 */
const DSPER=3;
function dsPages(){return Math.max(1,Math.ceil(dsigList().length/DSPER))}
dsigCards=list=>list.length?list.map(s=>`<button type="button" class="dsc dsci${don.sig===s.id?' on':''}" role="listitem" data-act="dsig" data-arg="${s.id}" aria-pressed="${don.sig===s.id}" data-qa="DON-sig-${s.id}"><span class="dsimg">${s.img?`<img src="${s.img.data}" alt="">`:ic('image',20)}${don.sig===s.id?`<span class="dsck">${CHK}</span>`:''}</span><span class="dsn">${esc(s.n)}</span><b>${fmt(s.amt)}원</b></button>`).join(''):`<div class="fanl dsempty">${don.sq&&String(don.sq).trim()?'검색 결과가 없어요':'이 가격대의 시그니처가 없어요'}</div>`;
sigPickHTML=function(){
  const sel=don.sig&&SG().find(s=>s.id===don.sig),cur=don.sp||'전체',all=dsigList(),np=Math.max(1,Math.ceil(all.length/DSPER));
  if((don.sgp||0)>=np)don.sgp=np-1;const pg=don.sgp||0,page=all.slice(pg*DSPER,pg*DSPER+DSPER);
  return `<div class="s-dsig" id="dsigpick" data-qa="DON-sig"><div class="dsh"><b>시그니처로 후원</b><span class="fanl">선택하면 금액이 자동으로 입력돼요</span></div>
   <div class="dsp" role="group" aria-label="가격대" data-qa="DON-sig-price">${DSP.map(p=>`<button type="button" class="chip${cur===p[0]?' act':''}" data-act="dsp" data-arg="${p[0]}">${p[0]}</button>`).join('')}</div>
   <div class="dsel" id="dsel" data-qa="DON-sig-sel">${sel?`선택: <b>${esc(sel.n)}</b> · ${fmt(sel.amt)}원 <button type="button" class="link" data-act="dsig" data-arg="${sel.id}">선택 해제</button>`:'<span class="fanl">선택한 시그니처가 없어요</span>'}</div>
   <div class="dsl dsgrid" id="dsl" role="list">${dsigCards(page)}</div>
   <div class="dspg" data-qa="DON-sig-pager"><button type="button" class="btn out sm" data-act="dsPg" data-arg="-1" ${pg<=0?'disabled':''}>‹ 이전</button><span class="dspn" aria-live="polite">${pg+1} / ${np}</span><button type="button" class="btn out sm" data-act="dsPg" data-arg="1" ${pg>=np-1?'disabled':''}>다음 ›</button></div></div>`;
};
A.dsp=function(el,a){don.sp=a;don.sgp=0;sigPickRefresh()};
A.dsPg=function(el,a){don.sgp=Math.max(0,(don.sgp||0)+(+a));sigPickRefresh()};
IN.dsq=function(el){don.sq=el.value;don.sgp=0;sigPickRefresh()};

/* ---- 기본 배너 이미지(글자 없음) ---- */
const defSVG=(w,h,v)=>{const c=[['#1a2a4a','#4a92ff'],['#1a2a4a','#7d5ef7'],['#004854','#48d481']][v%3];return 'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/><circle cx="${w*.15}" cy="${h*.2}" r="${Math.min(w,h)*.55}" fill="#ffffff" opacity=".06"/><circle cx="${w*.85}" cy="${h*.9}" r="${Math.min(w,h)*.45}" fill="#ffffff" opacity=".07"/><path d="M0 ${h*.75} C ${w*.3} ${h*.55}, ${w*.6} ${h*.95}, ${w} ${h*.7} L${w} ${h} L0 ${h} Z" fill="#ffffff" opacity=".05"/></svg>`)};
/* 기본 배너는 비트맵(Figma AI 생성, 2026-11-12) — 상단 6:1 · 우측 1:2 · 중간 8:1 */
const DEFBN='assets/v2/station/banner/title.webp',DEFRB='assets/v2/station/banner/right.webp',DEFMB='assets/v2/station/banner/mid.webp';
const renderBanner19=renderBanner;
renderBanner=function(){
  renderBanner19();
  const b=$('.banner'),e=b&&b.firstElementChild;if(!b||!e)return;
  if(!S.station.bannerImg){b.style.background="center/cover no-repeat url('"+DEFBN+"')";e.textContent='';e.style.display='none';b.classList.add('def')}else b.classList.remove('def');
};
renderRban=function(){
  const el=$('#rban'),cols=$('#cols');if(!el||!cols)return;
  const list=S.station.rightBanners.filter(b=>b.on);
  el.hidden=false;cols.classList.add('hasr');el.dataset.qa='M-07v';
  if(!list.length){el.innerHTML=`<div class="rbi def" data-qa="M-07d" role="img" aria-label="기본 배너 이미지"><img src="${DEFRB}" alt=""></div>`;return}
  el.innerHTML=list.map(b=>b.link?`<button class="rbi" data-act="ext" data-arg="${esc(b.link)}" aria-label="${esc(b.alt||'배너')}"><img src="${b.img.data}" alt="${esc(b.alt||'')}"></button>`:`<div class="rbi"><img src="${b.img.data}" alt="${esc(b.alt||'')}"></div>`).join('');
};
const midBanner19=midBannerHTML;
midBannerHTML=function(){
  const list=S.station.midBanners.filter(b=>b.on);
  if(!list.length)return `<div class="sect mban def" data-qa="M-08d"><div class="mb-view"><div class="mb-slide"><img src="${DEFMB}" alt="" role="presentation"></div></div></div>`;
  return midBanner19();
};

/* ---- 크루원 탭 노출 조건 ---- */
const crewCount=()=>S.noCrew?0:CRW().filter(c=>c.live!==2).length;
const crewTabOn=()=>crewCount()>0||isStreamer();
const TABS_ALL=TABS.slice();
function tabsNow(){return TABS_ALL.filter(t=>t[0]!=='crew'||crewTabOn())}
A.dcrew=function(el,a){S.noCrew=a==='0';if(S.noCrew&&S.view==='crew')S.view='home';renderAll()};

/* ---- 크루 공지 → 크루원 방송국 공지 상세 ---- */
CNOTICE.forEach(x=>{if(!x[4])x[4]=x[2]+'\n\n자세한 내용은 방송 중에도 안내드릴게요. 궁금한 점은 댓글로 남겨 주세요.'});
function crewNoticeList(n){return CNOTICE.filter(x=>x[0]===n&&x[3]<=TODAY).sort((a,b)=>a[3]<b[3]?1:-1)}
function crewNoticeView(){
  const x=S.cn;if(!x)return '<div class="empty">공지를 찾을 수 없어요</div>';
  const c=CRW().find(m=>m.n===x.n),l=crewNoticeList(x.n);
  return `<div class="pd" data-qa="CN-detail"><button class="back" data-act="swHome">${ic('chevL',16)}홈</button>
   <div class="bhint" style="margin-bottom:6px">${esc(x.n)} 방송국 · 공지</div><h1><span class="nb" style="margin-right:8px;vertical-align:middle">공지</span>${esc(x.title)}</h1>
   <div class="au">${av(x.n,28)}<b>${esc(x.n)}</b><span class="cbd">${esc(c?crewRankOf(c):'')}</span><span>${x.date}</span><span>조회 ${fmt(120+x.title.length*7)}</span></div>
   <div class="body">${String(x.body||x.sum).split(/\n\s*\n/).map(p=>`<p>${esc(p)}</p>`).join('')}</div>
   <div class="cmts"><h3>공지 목록 <span>${l.length}</span></h3><div class="btab">${l.map(r=>`<div class="brow" style="grid-template-columns:auto minmax(0,1fr) auto"><span class="nb">공지</span><span class="c-tit"><span class="tt">${esc(r[1])}</span></span><span class="c-dt" style="display:block">${r[3].slice(5)}</span></div>`).join('')}</div></div></div>`;
}
Object.assign(A,{
 swHome(){S.cn=null;S.view='home';renderAll()},
 ncOpen(el,a){
  const x=NCL[+a];if(!x)return;
  if(x.b){if(S.sw){S.sw=null;D.name='펀상사';if(S.liveHome!==undefined)S.live=S.liveHome;if(LT0)D.live.title=LT0;S.cn=null;renderAll()}openPost(x.b,x.id);return}
  const it=CNOTICE.find(r=>r[0]===x.n&&r[1]===x.title);
  swTo(x.n);S.cn={n:x.n,title:x.title,sum:x.sum,date:x.date,body:it?it[4]:x.sum};S.view='cnotice';renderAll();
  const mm=document.getElementById('main');if(mm)mm.scrollTop=0;
 }
});
const noticeItems19=noticeItems;
noticeItems=function(){const l=noticeItems19();return crewCount()>0?l:l.filter(x=>x.n==='펀상사')};

/* ---- 홈 플레이어: 썸네일 + 재생 버튼 ---- */
const PLAY_SRC='https://www.youtube.com/embed/KGK2KZOFAPE?autoplay=1&rel=0';
const __pl19=playerHTML;
playerHTML=function(){
  if(!S.live)return __pl19();
  const t3=ldrTop(3);
  const media=S.plPlay?`<iframe class="plyt" src="${PLAY_SRC}" title="라이브 방송 영상" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`:`<button type="button" class="plthumb" data-act="plplay" aria-label="영상 재생" data-qa="HOME-thumb"><img src="${PLTHUMB}" alt=""><span class="plbtn">${ic('play',34)}</span></button>`;
  return `<div class="player live${S.plPlay?' playing':''}" data-qa="HOME-player">${media}${S.plPlay?'':`<div class="pl-live"><span class="lv">LIVE</span><span>시청 <span class="vwr">${fmt(S.viewers)}</span>명</span></div>`}
   ${S.overlay&&!S.plPlay?`<div class="ov-don" aria-live="polite"></div><div class="ov-top">${t3.length?'<div>오늘 후원 TOP3</div>'+t3.map((d,i)=>`<div><b>${i+1}</b>${esc(d.n)}</div>`).join(''):''}</div>`:''}</div>`;
};
A.plplay=function(){S.plPlay=true;const p=$('.player.live');if(p){const tmp=document.createElement('div');tmp.innerHTML=playerHTML();p.replaceWith(tmp.firstElementChild)}};
const go19=go;
go=function(v,o){if(v!=='home')S.plPlay=false;if(v!=='cnotice')S.cn=null;return go19(v,o)};
const __rv19=renderView;
renderView=function(){if(S.view==='crew'&&!crewTabOn())S.view='home';if(S.view==='cnotice'){$('#view').innerHTML=crewNoticeView();return}__rv19()};
const __ah19=applyHash;
applyHash=function(){
  const o=parseHash();__ah19();
  if(!Object.keys(o).length)return;
  if(o.nocrew==='1'){S.noCrew=true;renderAll();applyWire()}
  if(o.view==='cnotice'){const c=CRW().find(x=>x.n===(o.sw||'새벽결재')||x.id===o.sw);const l=c&&crewNoticeList(c.n)[0];if(c&&l){swTo(c.n);S.cn={n:c.n,title:l[1],sum:l[2],date:l[3],body:l[4]};S.view='cnotice';renderAll();applyWire()}}
  if(o.play==='1'){A.plplay()}
};

/* ---- 오프라인·다시보기 썸네일 통일 ---- */
const thumbR=(badges)=>`<div class="th thimg"><img src="${PLTHUMB}" alt="">${badges||''}</div>`;
const __pl19b=playerHTML;
playerHTML=function(){return __pl19b()};
const __pv19=playView;
playView=function(){
  const h=__pv19(),it=playItem();if(it.kind!=='replay')return h;
  const key=it.kind+it.id,on=S.plrOn===key;
  const rep=on?`<div class="ytw" data-qa="PLAY-yt"><iframe src="${PLAY_SRC}" title="${esc(it.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`:`<div class="ytw" data-qa="PLAY-yt"><button type="button" class="plthumb" data-act="plrPlay" data-arg="${key}" aria-label="다시보기 재생"><img src="${PLTHUMB}" alt=""><span class="plbtn">${ic('play',34)}</span></button></div>`;
  return h.replace(/<div class="ytw" data-qa="PLAY-yt">[\s\S]*?<\/iframe><\/div>/,rep);
};
A.plrPlay=function(el,a){S.plrOn=a;renderView()};
/* ===== 21차: 내가 속한 크루 · 쪽지 프로필 카드 ===== */
const MINE0=[
 {id:'m1',crew:'야근클럽',owner:'밤샘방장',oid:'night_chief',rank:'사원',date:'2026.10.14',by:'밤샘방장'},
 {id:'m2',crew:'점심원정대',owner:'도시락대장',oid:'lunch_cap',rank:'인턴',date:'2026.10.22',by:'도시락대장'},
 {id:'m3',crew:'주말출근단',owner:'휴일반장',oid:'holiday_lead',rank:'대리',date:'2026.11.01',by:'휴일반장'}
];
const mineList=()=>S.mine||(S.mine=MINE0.map(x=>Object.assign({},x)));
const mineBlk=()=>S.mineBlk||(S.mineBlk=[]);
const BLOCKED_ME=['moon_fox'];
function mineHTML(){
  const l=mineList(),b=mineBlk();
  const row=x=>`<div class="mrw" data-qa="MINE-row"><span class="mrc"><span class="mra">${av(x.owner,40)}</span><span class="mrn"><b>${esc(x.crew)}</b><small>크루장 ${esc(x.owner)} · @${esc(x.oid)}</small></span></span><span class="mrf"><small>나의 직책</small><span class="cbd">${esc(x.rank)}</span></span><span class="mrf"><small>설정일</small>${x.date}</span><span class="mrf"><small>설정한 사람</small>${esc(x.by)}</span><span class="mrb"><button type="button" class="btn out sm" data-act="mineRm" data-arg="${x.id}" data-qa="MINE-remove">제거</button><button type="button" class="btn out sm dng" data-act="mineBk" data-arg="${x.id}" data-qa="MINE-block">차단</button></span></div>`;
  return `<div class="mine" data-qa="CREW-mine-view"><div class="mineinfo" data-qa="CREW-mine-info"><div class="mi1">${ic('lock',18)}${ic('eyeoff',18)}<b>이 페이지는 유저 본인만 볼 수 있는 페이지입니다</b></div><p>현재 내가 크루원으로 설정된 방송국 리스트입니다. 혹시 잘못 설정된 크루가 있다면 리스트에서 제거를 눌러주시고, 지속적으로 크루로 설정된다면 해당 방송국을 차단해주시기 바랍니다</p></div>
   <h3 class="mh3">내가 속한 크루 <span>${l.length}</span></h3>
   ${l.length?`<div class="mlist">${l.map(row).join('')}</div>`:'<div class="empty">내가 크루원으로 설정된 방송국이 없어요</div>'}
   ${b.length?`<h3 class="mh3">차단한 방송국 <span>${b.length}</span></h3><div class="mlist blk">${b.map(x=>`<div class="mrw" data-qa="MINE-blocked"><span class="mrc"><span class="mra">${av(x.owner,36)}</span><span class="mrn"><b>${esc(x.crew)}</b><small>크루장 ${esc(x.owner)} · 차단일 ${x.bdate}</small></span></span><span class="mrb"><button type="button" class="btn sec sm" data-act="mineUnbk" data-arg="${x.id}" data-qa="MINE-unblock">차단 해제</button></span></div>`).join('')}</div>`:''}</div>`;
}
Object.assign(A,{
 mineRm(el,a){const x=mineList().find(r=>r.id===a);if(!x)return;confirmM(x.crew+' 크루에서 나갈까요?','해당 크루의 크루원 목록에서 빠져요.','제거',()=>{S.mine=mineList().filter(r=>r.id!==a);toast(x.crew+' 크루에서 나갔어요');renderView()})},
 mineBk(el,a){const x=mineList().find(r=>r.id===a);if(!x)return;confirmM(x.crew+' 방송국을 차단할까요?','차단하면 이 방송국은 나를 크루원으로 추가할 수 없어요. 현재 크루에서도 나가게 돼요.','차단',()=>{S.mine=mineList().filter(r=>r.id!==a);mineBlk().push(Object.assign({},x,{bdate:TODAY}));toast(x.crew+' 방송국을 차단했어요');renderView()})},
 mineUnbk(el,a){const x=mineBlk().find(r=>r.id===a);if(!x)return;S.mineBlk=mineBlk().filter(r=>r.id!==a);toast(x.crew+' 방송국 차단을 해제했어요');renderView()}
});
/* 크루원 추가: 상대가 나를 차단한 경우 */
const __crewAdd21=A.crewAdd;
A.crewAdd=function(){
  const i=$('#crewIn'),er=$('#crewErr');
  if(i&&er&&BLOCKED_ME.indexOf(i.value.trim().toLowerCase())>=0){er.textContent='이 스트리머는 크루원 추가를 허용하지 않아요';i.focus({preventScroll:true});return}
  return __crewAdd21.apply(this,arguments);
};

/* ---- 쪽지 프로필 카드 ---- */
const MSGTIER={funsangsa:'gp',harukeeper:'nb',saebyeokgyeoljae:'nb',haru_overtime:'gs',tangbisil:'gs',kaltoe_hope:'ds',copier_down:'ds',stamp_bang:'ds',rank_oracle:'gs',war_advisor:'gs',lunch_guard:'ds',teamlead_smile:'ds'};
const userKey=(id,n)=>{const f=fanOf(n);if(f)return TTK[f.t]||'ds';return MSGTIER[id]||'ds'};
let UPO=null,RPO=null;
function openUserProf(id){
  const u=MSGU.find(x=>x.id===id)||{id:id,n:id};
  const k=userKey(u.id,u.n),t=TTL[k],hi=k==='gp'||k==='nb';
  UPO=openModal({title:'프로필',cls:'upcard',qa:'USER-profile',body:`<div class="upc${hi?' hi hi-'+k:''}" data-qa="USER-card"><div class="upav">${av(u.n,76)}</div><b class="upn">${esc(u.n)}</b><small class="upid">@${esc(u.id)}</small>
   <div class="upt"><span class="ttl big" style="background:${t[1]};color:${t[2]}" data-qa="USER-title">${k==='gp'?STARI:''}${t[0]}</span>${hi?'<span class="hitier" data-qa="USER-hitier">고티어</span>':''}${rkBadge(u.n)}</div>
   <p class="upd">${hi?'펀네이션 상위 칭호('+t[0]+') 유저예요.':'펀네이션 칭호는 후원 누적 기준이에요.'}</p></div>`,foot:'<button class="btn sec" data-act="mclose">닫기</button><button class="btn out dng" data-act="upReport" data-arg="'+esc(u.id)+'" data-qa="USER-report">'+ic('flag',16)+'신고하기</button>'});
}
const RPREASON=['스팸·광고','욕설·비방','사칭','음란','기타'];
function openReport(id){
  const u=MSGU.find(x=>x.id===id)||{id:id,n:id};
  RPO=openModal({title:'신고하기',qa:'USER-report-modal',body:`<p class="fanl" style="margin-bottom:8px">${esc(u.n)}님을 신고하는 이유를 선택해 주세요</p><div class="rpl">${RPREASON.map((r,i)=>`<label class="pay"><input type="radio" name="rp" value="${r}" data-ch="rpPick">${r}</label>`).join('')}</div><textarea class="inp" id="rpx" rows="3" maxlength="200" placeholder="기타 사유를 입력해 주세요" hidden data-in="noop"></textarea><div class="errm" id="rpe"></div>`,foot:`<button class="btn sec" data-act="mclose">취소</button><button class="btn pri" data-act="rpSend" data-arg="${esc(u.id)}" data-qa="USER-report-send">신고 접수</button>`});
}
Object.assign(A,{
 upReport(el,a){openReport(a)},
 rpSend(el,a){
  const r=document.querySelector('input[name=rp]:checked'),e=$('#rpe'),x=$('#rpx');
  if(!r){e.textContent='신고 사유를 선택해 주세요';return}
  if(r.value==='기타'&&!x.value.trim()){e.textContent='기타 사유를 입력해 주세요';x.focus();return}
  if(RPO)closeModal(RPO);if(UPO)closeModal(UPO);toast('신고가 접수되었어요. 확인 후 조치할게요');
 }
});
CH.rpPick=function(el){const x=$('#rpx');if(x)x.hidden=el.value!=='기타';const e=$('#rpe');if(e)e.textContent=''};
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-up]');if(!t)return;e.stopImmediatePropagation();e.preventDefault();openUserProf(t.dataset.up)},true);
document.addEventListener('keydown',e=>{if(e.key!=='Enter')return;const t=e.target.closest&&e.target.closest('[data-up]');if(!t)return;e.preventDefault();openUserProf(t.dataset.up)},true);

/* ---- 해시 ---- */
const __ah21=applyHash;
applyHash=function(){
  const o=parseHash();__ah21();
  if(!Object.keys(o).length)return;
  if(o.cf){if(o.cf==='mine'&&!isStreamer()){S.mode='streamer';S.loggedIn=true}S.ui.crewF=o.cf;S.view='crew';renderAll();applyWire()}
  if(o.modal==='userprof')openUserProf(o.uid||'wolyobyeong');
  if(o.modal==='report')openReport(o.uid||'wolyobyeong');
  if(o.minerm==='1'){}
};



/* ===== 등급 · 랭킹 엠블럼 — 벡터 대신 비트맵 (assets/grade 원본 2048 → assets/v2/station/grade 360×301 WebP)
   등급 아이콘 1~20 위에, 랭킹 날개(1위 · 2위 · 3위 · 4~10위 · 11~20위)를 뒤에 겹침. 두 이미지는 같은 캔버스·같은 잘라내기라 그대로 포개면 맞음 ===== */
const GRADEN=['','동화','은화','금화','백금화','다이아','사파이어','에메랄드','루비','토파즈','자수정','크라운 다이아','크라운 사파이어','크라운 에메랄드','크라운 루비','크라운 토파즈','크라운 자수정','스텔라 시리우스','스텔라 헬리오스','스텔라 갤럭시','스텔라 코스모스'];
const GIMG='assets/v2/station/grade/';
/* 예시 데이터: 누적 후원액(1천원 ~ 342만원)을 20단계로 — 실제 등급 기준은 서버 값 사용 */
function gradeOf(name){
  const u=BIGUSERS.find(x=>x.n===name);
  const a=u?u.all:(name===actorName()?S.donTotal:0);
  if(!a)return 1;
  return Math.max(1,Math.min(20,1+Math.floor(19*Math.log(a/1000)/Math.log(3420000/1000))));
}
const wingOf=r=>r===1?'1':r===2?'2':r===3?'3':r>=4&&r<=10?'4-10':r>=11&&r<=20?'11-20':'';
function emb(rank,name,cls){
  const g=gradeOf(name),w=wingOf(rank);
  return `<span class="gemb ${cls||''}" title="${GRADEN[g]} 등급${w?' · '+rank+'위':''}">${w?`<img class="gemb__w" src="${GIMG}wing-${w}.webp" alt="">`:''}<img class="gemb__g" src="${GIMG}grade-${pad(g)}.webp" alt="${GRADEN[g]} 등급">${rank>=1&&rank<=3?`<span class="gemb__n">${rank}</span>`:''}</span>`;
}
gkEmblem=function(k,name,mini){return emb(k,name,mini?'gemb--mini':'gemb--lg')};
const __gkRowImg=gkRow;
gkRow=function(r,no,tab){return __gkRowImg(r,no,tab).replace(av(r.f.n,38),emb(no,r.f.n,'gemb--row'))};

/* 등급 배지(글자) — 기획서의 흙수저 · 금수저 · 노블레스 · 골드프라임 대신 20단계 등급 이름 + 작은 등급 아이콘 */
function tg(name){const g=gradeOf(name);return `<span class="tb tg"><img src="${GIMG}grade-${pad(g)}-s.webp" width="16" height="16" alt="">${GRADEN[g]}</span>`}

/* 데모 설정 '내 후원 등급' — 20단계 등급으로. 기존 로직(팬 여부 · VIP)은 S.myTier 를 쓰므로 함께 맞춤 */
function demoGradeOpts(){const cur=S.myGrade||0;let h=`<option value="0" ${cur===0?'selected':''}>후원 없음</option>`;for(let g=1;g<=20;g++)h+=`<option value="${g}" ${cur===g?'selected':''}>${g}. ${GRADEN[g]}</option>`;return h}
function setMyGrade(g){S.myGrade=g;S.myTier=!g?'none':g<=4?'dirt':g<=10?'gold':g<=16?'dia':'black'}
const __gradeOf=gradeOf;
gradeOf=function(name){return name===actorName()&&S.myGrade?S.myGrade:__gradeOf(name)};
/* ===================== 펀네이션 셸 연결 ===================== */
const ROOT=document.documentElement;
const moMQ=matchMedia('(max-width: 767px)');
/* LNB: 펀네이션 햄버거(app.js)가 data-lnb=full/mini · data-drawer 를 바꾸면 방송국 메뉴도 펼침/아이콘 레일로 */
layoutSB=function(){
  const el=$('#gside');if(!el)return;
  const rail=!moMQ.matches&&ROOT.getAttribute('data-lnb')==='mini';
  el.className='gside '+(rail?'rail':'exp');
  const b=$('#sbback');if(b)b.hidden=true;
};
new MutationObserver(()=>layoutSB()).observe(ROOT,{attributes:true,attributeFilter:['data-lnb']});
/* 로그인 상태: 펀네이션 data-auth(in/out) ↔ 방송국 S.loggedIn */
let authSync=false;
function pushAuth(){authSync=true;ROOT.setAttribute('data-auth',S.loggedIn?'in':'out');authSync=false}
new MutationObserver(()=>{
  if(authSync)return;
  const on=ROOT.getAttribute('data-auth')==='in';
  if(on!==S.loggedIn){S.loggedIn=on;closeAllModals();closePop();renderAll()}
}).observe(ROOT,{attributes:true,attributeFilter:['data-auth']});
S.loggedIn=ROOT.getAttribute('data-auth')!=='out';
const __ahShell=applyHash;
applyHash=function(){__ahShell();if(location.hash.length>1)pushAuth()};
/* "펀네이션 홈으로" → 실제 홈 */
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#gside .lbtn');if(b){e.preventDefault();e.stopPropagation();location.href='index.html'}},true);

/* 시안 캡처용 — #...&cap=1 : 데모 설정 · 플로팅 로그인 버튼 숨김, &fix=1 : 화면 높이로 잘라 모달을 가운데에 */
function capMode(){const h=location.hash;ROOT.classList.toggle('is-cap',/(^#|&)cap=1(&|$)/.test(h));ROOT.classList.toggle('is-cap-fix',/(^#|&)fix=1(&|$)/.test(h))}
window.addEventListener('hashchange',capMode);capMode();
renderAll();
applyHash();
})();
