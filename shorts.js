/* ============================================================
   쇼츠 (shorts.html · 2026-11-27 사용자 요청)
   SOOP Catch 플레이어(vod.sooplive.com/player/…/catch)의 기능 · 구성을 그대로, 펀네이션 DS 로 [구현 제안 · 시안 없음]
   - PC: 가운데 9:16 영상(뒤 같은 그림 흐림) · 오른쪽 위 정보 영역 열고/닫기 · 이전/다음(↑ ↓ 키 · 휠) · 음소거 ·
         아래 재생바(재생/멈춤 · 시간 · 눌러서 이동) · 영상 누르면 재생/멈춤
         정보 영역 = 올린 사람(방송국) · 조회수 · 공유 · 더보기(신고하기 · 원본 영상) · 제목 · 원본 방송인 + 태그 ·
         설명 더보기 · 좋아요 · 팔로우 · 후원 · 구독 · 다른 쇼츠(가로 넘김) · 댓글(좋아요 · 이모티콘 · 유저 태그 · 등록)
         정보 영역이 닫혀 있으면 영상 아래에 올린 사람 · 제목
   - 모바일(<768): 전체 화면 세로 넘김(한 장씩 붙음) · 오른쪽 버튼 줄(좋아요 · 댓글 · 공유 · 더보기) · 아래 올린 사람 · 팔로우 · 제목 · 태그 ·
         댓글 · 더보기는 아래 시트
   - 서버 · 영상 파일 연동 전: 영상은 썸네일(assets/v2/station/shorts)로 대신하고 재생 시간만 흐름(끝나면 다음 쇼츠).
     좋아요 · 댓글은 이 브라우저(localStorage funnation-shorts)에 저장, 팔로우는 사이트 공통 목록(window.FunFav)
   - shorts.html#s=<번호> 로 들어오면 그 쇼츠부터
   ============================================================ */
(function () {
  var root = document.getElementById("shorts");
  if (!root) return;

  var html = document.documentElement;
  var KEY = "funnation-shorts-v2"; // 11-27 유튜브 영상으로 바꾸며 새 저장(예전 썸네일판 댓글과 섞이지 않게)
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var mobile = matchMedia("(max-width: 767px)");
  var reduce = matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- 아이콘 (선 아이콘 — 펀네이션 홈 · 채팅톡과 같은 두께) ---------- */
  var IC = {
    up: '<path d="M6 15l6-6 6 6"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    left: '<path d="M15 6l-6 6 6 6"/>',
    right: '<path d="M9 6l6 6-6 6"/>',
    panelOpen: '<path d="M20 5v14"/><path d="M15 12H4M9 7l-5 5 5 5"/>',
    panelClose: '<path d="M4 5v14"/><path d="M9 12h11M15 7l5 5-5 5"/>',
    volOn: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
    volOff: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9.5l5 5M22 9.5l-5 5"/>',
    play: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>',
    pause: '<path d="M8 5h3v14H8zM13 5h3v14h-3z" fill="currentColor" stroke="none"/>',
    share: '<path d="M14 5l6 6-6 6"/><path d="M20 11h-8a7 7 0 0 0-7 7v1"/>',
    more: '<circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>',
    moreV: '<circle cx="12" cy="5" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="19" r="1.6" fill="currentColor"/>',
    like: '<path d="M7 10v10H4V10zM7 10l4-7c1.7 0 2.6 1.2 2.3 2.9L12.8 9H19a2 2 0 0 1 2 2.3l-1.2 6.9A2.2 2.2 0 0 1 17.6 20H7"/>',
    likeOn: '<path d="M7 10v10H4V10z" fill="currentColor"/><path d="M7 10l4-7c1.7 0 2.6 1.2 2.3 2.9L12.8 9H19a2 2 0 0 1 2 2.3l-1.2 6.9A2.2 2.2 0 0 1 17.6 20H7z" fill="currentColor"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20z"/>',
    heartOn: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10C19.5 15.4 12 20 12 20z" fill="currentColor"/>',
    gift: '<path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13"/><path d="M12 7S10.5 3 8 3.6C6 4.1 6.6 7 9 7M12 7s1.5-4 4-3.4c2 .5 1.4 3.4-1 3.4"/>',
    crown: '<path d="M4 18h16M5 15l-1-8 5 4 3-6 3 6 5-4-1 8z"/>',
    comment: '<path d="M4 5h16v11H9l-5 4z"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
    smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0"/><path d="M9 9.5v.5M15 9.5v.5"/>',
    image: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M20 16l-5-5-8 8"/>',
    at: '<circle cx="12" cy="12" r="3.5"/><path d="M15.5 12v1.5a2.5 2.5 0 0 0 5 0V12a8.5 8.5 0 1 0-3.3 6.7"/>',
    flag: '<path d="M5 21V4h12l-2 4 2 4H5"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>',
    wave: '<path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    back: '<path d="M15 6l-6 6 6 6"/>',
    play2: '<path d="M7 5v14l11-7z"/>',
    talkEmpty: '<path d="M5 4h14v12H10l-5 4z"/><path d="M8.5 8.5h7M8.5 11.5h5"/>'
  };
  function ic(n, s, sw) {
    s = s || 20;
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.8) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[n] + "</svg>";
  }

  /* ---------- 데이터 (홈 '인기 Shorts' 카드와 같은 12개) ---------- */
  /* 유튜브 세로 쇼츠(2026-11-27 사용자 요청 — 임베드 허용 · 9:16 을 oEmbed 로 확인). 제목 · 채널은 유튜브 원본 그대로, 조회 · 좋아요 · 팔로워 수는 데모 값 */
  var AVS = {
    "치지직 젤리윤": "assets/v2/creator/av-seoharin.webp", "채현찌": "assets/v2/creator/av-luna.webp", "웅필": "assets/home/avatar/bear.jpg",
    "아이노 시아【Aino Sia】": "assets/home/avatar/vtuber-purple.png", "겜클립스": "assets/home/avatar/lol.png", "여름이0908": "assets/v2/creator/av-daon.webp",
    "송밤": "assets/home/avatar/vtuber-blue.png", "노래리니": "assets/v2/creator/av-mindoyun.webp", "솜하치": "assets/home/avatar/vtuber-white.png",
    "라코코 라즈베리": "assets/home/avatar/vtuber-green.png", "김가비 GABI": "assets/home/avatar/pixel.png"
  };
  var DATA = [
    ["aKhltCHW-QE", "아이브 뱅뱅 챌린지", "치지직 젤리윤", 46000, ["챌린지", "아이브", "스트리머"], 1280],
    ["86vCdq8wW3A", "헬륨가스 마시고 스트리머 속이기ㅋㅋ", "채현찌", 38000, ["웃긴영상", "스트리머"], 964],
    ["XC9oXcI7xBM", "처음 후원 받은 스트리머", "웅필", 29000, ["후원", "게임", "하꼬"], 812],
    ["gS0J1-6dnFE", "버튜버 5초 챌린지 !!", "아이노 시아【Aino Sia】", 21000, ["버튜버", "챌린지"], 655],
    ["LsWlu2VCtAQ", "공포게임 하다 영혼 탈출한 스트리머들ㅋㅋ", "겜클립스", 18000, ["공포게임", "게임"], 540],
    ["Ef9PrZRfzy8", "시집을 등진자", "여름이0908", 15000, ["치지직", "코스프레"], 421],
    ["w4Qyz409JME", "흔한 버튜버의 쇼츠각 뽑는 법", "송밤", 12000, ["버튜버", "쇼츠"], 377],
    ["bm2hM3-zYrA", "키세스 리액션", "노래리니", 11000, ["리액션", "방송"], 302],
    ["weTPq4CzLH8", "0점 맞은 썰", "솜하치", 9800, ["버튜버", "치지직"], 266],
    ["gchxG8Yw9r0", "이럴 때만 지능 상승하는 라코코", "라코코 라즈베리", 8700, ["버튜버", "라코코"], 214],
    ["PCcD-uX5kks", "쇼츠 보고 왔어요", "김가비 GABI", 7600, ["버튜버", "티키타카"], 188],
    ["1GeWD8GHd8M", "호주가 영어로 뭐에요?", "여름이0908", 6400, ["치지직", "일상", "토크"], 153]
  ].map(function (a, i) {
    return {
      id: i, yt: a[0], title: a[1], ch: a[2], av: AVS[a[2]] || "assets/home/avatar/default.svg", views: a[3], len: 0, tags: a[4], likes: a[5],
      img: "https://i.ytimg.com/vi/" + a[0] + "/oardefault.jpg",
      followers: 1200 + ((i * 7919) % 48000),
      date: "2026.11." + String(26 - (i % 9)).padStart(2, "0"),
      desc: "원본 영상: YouTube · " + a[2] + "\n펀네이션 쇼츠 화면 시안용으로 유튜브 영상을 불러와 보여 주고 있어요."
    };
  });
  /* 채널 사진 — 펀네이션 샘플 프사(assets/home/avatar · assets/v2/creator)로 대신 (2026-11-27 사용자 요청) */
  var SEED_C = [
    ["월요병환자", "와 이 장면 진짜 레전드ㅋㅋㅋ", 3, 18], ["결재대기중", "몇 번째 돌려보는지 모르겠어요", 26, 9],
    ["칼퇴요정", "브금 뭐예요?? 알려주세요", 95, 4], ["회식팀장", "오늘 방송도 기대할게요 🔥", 240, 2]
  ];
  var ME = { n: "텔레토비", av: "assets/imgWhiteBg-photo.png" };
  var EMO = ["😂", "🔥", "😍", "👏", "😮", "😭", "💙", "👍"];

  /* ---------- 저장 ---------- */
  var store = (function () { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } })();
  store.like = store.like || {};
  store.c = store.c || {};
  if (typeof store.panel !== "boolean") store.panel = false; // SOOP 처럼 처음엔 정보 영역 닫힘
  if (typeof store.muted !== "boolean") store.muted = true;
  /* 자동 재생 — 브라우저는 사용자가 이 페이지를 한 번이라도 누르기 전엔 소리 있는 자동 재생을 막아(유튜브가 멈춤).
     그래서 처음엔 늘 소리 끈 채로 재생하고, 첫 누름(아무 곳) 뒤에 저장된 '소리 켬'을 적용 (2026-11-27) */
  var activated = !!(navigator.userActivation && navigator.userActivation.hasBeenActive);
  function muted() { return store.muted || !activated; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }
  function comments(id) {
    if (!store.c[id]) {
      var now = Date.now();
      store.c[id] = id % 4 === 3 ? [] : SEED_C.slice(0, 2 + (id % 3)).map(function (c, k) {
        return { k: "s" + id + "-" + k, n: c[0], av: "", text: c[1], at: now - c[2] * 60000, likes: c[3] + id, liked: false };
      });
    }
    return store.c[id];
  }
  function liked(id) { return !!store.like[id]; }
  function likeN(d) { return d.likes + (liked(d.id) ? 1 : 0); }

  /* ---------- 상태 ---------- */
  var S = { i: 0, t: 0, playing: true, descOpen: false, more: false, emo: false, otherX: 0 };
  var m = /(?:^#|&)s=(\d+)/.exec(location.hash);
  if (m && DATA[+m[1]]) S.i = +m[1];

  /* ---------- 보조 ---------- */
  function fmtN(n) {
    if (n >= 10000) return (Math.round(n / 1000) / 10).toString().replace(/\.0$/, "") + "만";
    return n.toLocaleString("ko-KR");
  }
  function fmtT(s) { s = Math.max(0, Math.floor(s)); return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); }
  function ago(at) {
    var d = Math.max(0, Date.now() - at) / 60000;
    if (d < 1) return "방금";
    if (d < 60) return Math.floor(d) + "분 전";
    if (d < 1440) return Math.floor(d / 60) + "시간 전";
    return Math.floor(d / 1440) + "일 전";
  }
  function avSrc(c) {
    if (c.av) return c.av;
    var h = 0; for (var k = 0; k < c.n.length; k++) h = (h * 31 + c.n.charCodeAt(k)) % 997;
    return "assets/home/avatar/" + ["chim.png", "bear.jpg", "pixel.png", "lol.png", "chatting.png", "vtuber-blue.png", "vtuber-green.png"][h % 7];
  }
  function loggedOut() { return html.getAttribute("data-auth") === "out"; }
  function needLogin() { if (loggedOut()) { sheetClose(); location.hash = "#login"; return true; } return false; }
  function fav() { return window.FunFav || null; }
  function following(d) { var f = fav(); return !!(f && f.has(d.ch)); }
  var stationHref = "station.html";

  var toastEl, toastTimer;
  function toast(text) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "sh-toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = text;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 3000);
  }

  /* ---------- 공통 조각 ---------- */
  function chipsHTML(d) {
    return d.tags.map(function (t) { return '<span class="sh-chip">' + esc(t) + "</span>"; }).join("");
  }
  function commentsHTML(d) {
    var l = comments(d.id).slice().sort(function (a, b) { return b.at - a.at; });
    if (!l.length) return '<div class="sh-cempty">' + ic("talkEmpty", 48, 1.4) + "<p>아직 등록된 댓글이 없어요.<br>첫 번째 댓글의 주인공이 되어 보세요!</p></div>";
    return '<ul class="sh-clist">' + l.map(function (c) {
      return '<li class="sh-c"><img class="sh-c__av" src="' + esc(avSrc(c)) + '" width="32" height="32" alt=""><div class="sh-c__body"><p class="sh-c__head"><b>' + esc(c.n) + "</b><time>" + ago(c.at) + "</time></p><p class=\"sh-c__text\">" +
        esc(c.text).replace(/(@[^\s@]+)/g, '<span class="sh-c__at">$1</span>') + '</p></div><button class="sh-c__like' + (c.liked ? " is-on" : "") + '" type="button" data-clike="' + esc(c.k) + '" aria-pressed="' + c.liked + '" aria-label="댓글 좋아요">' + ic(c.liked ? "heartOn" : "heart", 16) + "<span>" + (c.likes || "") + "</span></button></li>";
    }).join("") + "</ul>";
  }
  /* 팔로우 하트 — 사이트 팔로우 아이콘(LNB assets/v2/lnb-follow.svg 와 같은 모양), 팔로잉이면 속이 참 */
  function followIc(on) {
    return '<svg class="sh-fic" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10C3 4 10 3.5 12 8.19444C14 3.5 21 4 21 10C21 16.0001 12 21 12 21C12 21 3 16.0001 3 10Z" fill="' + (on ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function inputHTML(where) {
    var out = loggedOut();
    return '<form class="sh-cin" data-cform="' + where + '"><div class="sh-cin__box">' +
      '<input class="sh-cin__field" type="text" maxlength="300" autocomplete="off" placeholder="' + (out ? "로그인 후 댓글을 쓸 수 있어요" : "댓글 입력") + '" aria-label="댓글 입력"' + (out ? " readonly data-need-login" : "") + ">" +
      '<button class="sh-cin__ib" type="button" data-emo aria-label="이모티콘" title="이모티콘"><img src="assets/fun-watch/v4/face-smile-24.svg" width="24" height="24" alt=""></button>' +
      '<button class="sh-cin__ib sh-cin__go" type="submit" aria-label="등록" aria-disabled="true"><img class="sh-cin__go-off" src="assets/fun-watch/v3/send-off.svg" width="24" height="24" alt=""><img class="sh-cin__go-on" src="assets/fun-watch/v2/send.svg" width="24" height="24" alt=""></button></div>' +
      '<button class="sh-cin__send" type="submit" aria-label="등록"><img src="assets/fun-watch/v2/send.svg" width="24" height="24" alt=""></button>' +
      '<div class="sh-emo" hidden>' + EMO.map(function (e) { return '<button type="button" data-emo-pick="' + e + '">' + e + "</button>"; }).join("") + "</div></form>";
  }
  function moreMenuHTML() {
    return '<button type="button" data-act="report">' + ic("flag", 20) + "신고하기</button>" +
      '<button type="button" data-act="full">' + ic("video", 20) + "원본 영상 보기</button>";
  }

  /* ---------- PC ---------- */
  function pcHTML() {
    return '<div class="sh-pc">' +
      '<div class="sh-stage" data-stage>' +
        '<div class="sh-bg" aria-hidden="true"><img alt=""></div>' +
        '<div class="sh-video" data-video role="button" tabindex="0" aria-label="재생/멈춤">' +
          '<img class="sh-video__img" alt=""><div class="sh-yt" data-yt-pc></div><div class="sh-hit" aria-hidden="true"></div>' +
          '<span class="sh-flash" aria-hidden="true"></span>' +
          '<div class="sh-cap"></div>' +
          '<div class="sh-ctrl"><button class="sh-ctrl__pp" type="button" data-pp aria-label="재생/멈춤"></button>' +
            '<div class="sh-bar" data-seek role="slider" aria-label="재생 위치" tabindex="0"><span class="sh-bar__fill"></span><span class="sh-bar__dot"></span></div>' +
            '<span class="sh-ctrl__time"></span></div>' +
        "</div>" +
        '<button class="sh-fab sh-fab--panel" type="button" data-panel aria-label="정보 영역 열고/닫기"></button>' +
        '<div class="sh-fabs"><button class="sh-fab" type="button" data-prev aria-label="이전 쇼츠">' + ic("up", 22) + '</button><button class="sh-fab" type="button" data-next aria-label="다음 쇼츠">' + ic("down", 22) + "</button></div>" +
        '<button class="sh-fab sh-fab--vol" type="button" data-mute></button>' +
      "</div>" +
      '<aside class="sh-panel" aria-label="쇼츠 정보"><div class="sh-panel__scroll" data-pscroll></div><div class="sh-panel__foot" data-pfoot></div></aside>' +
    "</div>";
  }
  function panelHTML(d) {
    var f = following(d), others = DATA.filter(function (x) { return x.id !== d.id; });
    return '<div class="sh-info">' +
      '<div class="sh-info__head"><a class="sh-info__who" href="' + stationHref + '"><img src="' + esc(d.av) + '" width="48" height="48" alt=""><span><b>' + esc(d.ch) + "</b><small>" + ic("play2", 12, 2) + fmtN(d.views) + "</small></span></a>" +
        '<button class="sh-follow' + (f ? " is-on" : "") + '" type="button" data-follow aria-pressed="' + f + '">' + followIc(f) + (f ? "팔로잉" : "팔로우") + "</button>" +
        '<div class="sh-info__tools">' +
        '<div class="sh-more"><button class="sh-ib" type="button" data-more aria-label="더 보기" title="더 보기" aria-expanded="' + S.more + '">' + ic("more", 22) + "</button>" +
        '<div class="sh-menu" role="menu"' + (S.more ? "" : " hidden") + ">" + moreMenuHTML() + "</div></div></div></div>" +
      '<h1 class="sh-info__title">' + esc(d.title) + "</h1>" +
      '<div class="sh-chips">' + chipsHTML(d) + "</div>" +
      '<div class="sh-acts">' +
        '<button class="sh-act' + (liked(d.id) ? " is-on" : "") + '" type="button" data-like aria-pressed="' + liked(d.id) + '" title="좋아요">' + ic(liked(d.id) ? "likeOn" : "like", 18) + "<span>" + fmtN(likeN(d)) + "</span></button>" +
        '<a class="sh-act" href="' + stationHref + '#modal=donate&amp;from=shorts" title="후원하기">' + ic("gift", 18) + "<span>후원</span></a>" +
        '<button class="sh-act" type="button" data-share title="공유하기">' + ic("share", 18) + "<span>공유</span></button>" +
      "</div>" +
      "</div>" +
      '<section class="sh-other"><h2><a href="' + stationHref + '#view=shorts">다른 쇼츠' + ic("right", 14, 2) + "</a></h2>" +
        '<div class="sh-other__wrap"><div class="sh-other__row" data-orow>' + others.map(function (x) {
          return '<button class="sh-ocard" type="button" data-go="' + x.id + '"><img src="' + x.img + '" alt="" loading="lazy"><span>' + esc(x.title) + "</span></button>";
        }).join("") + '</div><button class="sh-other__nav sh-other__nav--prev" type="button" data-onav="-1" aria-label="이전">' + ic("left", 16, 2) + '</button><button class="sh-other__nav sh-other__nav--next" type="button" data-onav="1" aria-label="다음">' + ic("right", 16, 2) + "</button></div>" +
      "</section>" +
      '<section class="sh-cmt"><h2>댓글 <b>' + comments(d.id).length + "</b></h2>" + commentsHTML(d) + "</section>";
  }
  function capHTML(d) {
    return '<a class="sh-cap__av" href="' + stationHref + '"><img src="' + esc(d.av) + '" width="40" height="40" alt=""></a><div class="sh-cap__txt"><p class="sh-cap__title">' + esc(d.title) + '</p><p class="sh-cap__meta"><a href="' + stationHref + '">' + esc(d.ch) + "</a></p></div>";
  }

  /* ---------- 모바일 ---------- */
  function moHTML() {
    return '<div class="sh-mo">' +
      /* 위 줄은 사이트 공통 모바일 앱바(뒤로 · 쇼츠 · 왕관 · 언어 · 메뉴)를 투명하게 씀 — shorts.css */
      '<div class="sh-feed" data-feed>' + DATA.map(function (d) {
        return '<section class="sh-slide" data-slide="' + d.id + '" aria-label="' + esc(d.title) + '"><img class="sh-slide__img" src="' + d.img + '" alt="" loading="' + (Math.abs(d.id - S.i) < 2 ? "eager" : "lazy") + '"><div class="sh-yt" data-yt-slot="' + d.id + '"></div>' +
          '<span class="sh-flash" aria-hidden="true"></span><div class="sh-slide__shade" aria-hidden="true"></div>' +
          '<div class="sh-side" data-side="' + d.id + '"></div>' +
          '<div class="sh-mcap" data-mcap="' + d.id + '"></div>' +
          '<div class="sh-mbar"><span class="sh-bar__fill"></span></div></section>';
      }).join("") + "</div>" +
    "</div>";
  }
  /* 모바일 오른쪽 버튼 줄 — 소리 · 좋아요 · 댓글 · 후원 · 공유 · ⋯ (2026-11-27 사용자 요청: 하트 · 구독 삭제). PC 정보 영역도 이 묶음 기준(좋아요 · 후원 · 공유 + 이름 옆 팔로우 · 위 ⋯ · 무대 소리, 댓글은 아래 댓글 칸이 늘 보여 버튼 없음) */
  function sideHTML(d) {
    var l = liked(d.id);
    var b = function (attrs, icon, label, on) { return '<button class="sh-sbtn' + (on ? " is-on" : "") + '" type="button" ' + attrs + ">" + ic(icon, 26, 1.8) + (label !== "" ? "<span>" + label + "</span>" : "") + "</button>"; };
    var a = function (href, icon, label) { return '<a class="sh-sbtn" href="' + href + '" aria-label="' + label + '">' + ic(icon, 26, 1.8) + "<span>" + label + "</span></a>"; };
    return b('data-mute aria-label="' + (muted() ? "소리 켜기" : "소리 끄기") + '"', muted() ? "volOff" : "volOn", muted() ? "소리 꺼짐" : "소리") +
      b('data-like aria-pressed="' + l + '" aria-label="좋아요"', l ? "likeOn" : "like", fmtN(likeN(d)), l) +
      b('data-csheet aria-label="댓글"', "comment", comments(d.id).length) +
      a(stationHref + "#modal=donate&from=shorts", "gift", "후원") +
      b('data-share aria-label="공유"', "share", "공유") +
      b('data-msheet aria-label="더 보기"', "more", "");
  }
  function mcapHTML(d) {
    var f = following(d), open = S.descOpen && d.id === S.i;
    return '<div class="sh-mcap__who"><a href="' + stationHref + '"><img src="' + esc(d.av) + '" width="32" height="32" alt=""><b>' + esc(d.ch) + "</b></a>" +
      '<button class="sh-mfollow' + (f ? " is-on" : "") + '" type="button" data-follow aria-pressed="' + f + '">' + followIc(f) + (f ? "팔로잉" : "팔로우") + "</button></div>" +
      '<button class="sh-mcap__title' + (open ? " is-open" : "") + '" type="button" data-desc>' + esc(d.title) + (open ? '<span class="sh-mcap__desc">' + esc(d.desc).replace(/\n/g, "<br>") + "<br>" + d.date + " 업로드 · 조회 " + d.views.toLocaleString("ko-KR") + "회</span>" : "") + "</button>" +
      '<div class="sh-chips sh-chips--mo">' + chipsHTML(d) + "</div>";
  }
  function sheetOpen(kind) {
    var d = DATA[S.i], sh = sheetEl, box = $(".sh-sheet__box", sh);
    if (kind === "c") {
      box.className = "sh-sheet__box sh-sheet__box--c";
      box.setAttribute("aria-label", "댓글");
      box.innerHTML = '<span class="sh-sheet__grip" aria-hidden="true"></span><div class="sh-sheet__head"><h2>댓글 <b>' + comments(d.id).length + '</b></h2><button class="sh-mo__ib" type="button" data-sheet-x aria-label="닫기">' + ic("close", 22, 2) + '</button></div><div class="sh-sheet__body">' + commentsHTML(d) + "</div>" + inputHTML("sheet");
    } else {
      box.className = "sh-sheet__box sh-sheet__box--m";
      box.setAttribute("aria-label", "더 보기");
      box.innerHTML = '<span class="sh-sheet__grip" aria-hidden="true"></span><div class="sh-sheet__menu">' + moreMenuHTML() + "</div>";
    }
    sh.hidden = false;
    sh.setAttribute("data-kind", kind);
    requestAnimationFrame(function () { sh.classList.add("is-open"); });
  }
  function sheetClose() {
    var sh = sheetEl;
    if (sh.hidden) return;
    sh.classList.remove("is-open");
    setTimeout(function () { sh.hidden = true; }, reduce.matches ? 0 : 250);
  }

  /* ---------- 그리기 ---------- */
  root.innerHTML = pcHTML() + moHTML();
  // 아래 시트는 하단 내비(z 40)보다 위에 떠야 해서 body 에 붙임 — 이벤트는 root 와 같은 처리기를 씀
  var sheetEl = document.createElement("div");
  sheetEl.className = "sh-sheet shorts-sheet";
  sheetEl.setAttribute("data-sheet", "");
  sheetEl.hidden = true;
  sheetEl.innerHTML = '<div class="sh-sheet__dim" data-sheet-x></div><div class="sh-sheet__box" role="dialog" aria-modal="true"></div>';
  document.body.appendChild(sheetEl);
  var stage = $("[data-stage]", root), video = $("[data-video]", root), feed = $("[data-feed]", root);

  function paintStatic() {
    var d = DATA[S.i];
    root.classList.toggle("is-panel", store.panel);
    $(".sh-bg img", root).src = d.img;
    $(".sh-video__img", root).src = d.img;
    $(".sh-cap", root).innerHTML = capHTML(d);
    $("[data-panel]", root).innerHTML = store.panel
      ? '<img src="assets/fun-watch/v4/arrow-right-to-line-20.svg" width="20" height="20" alt="">'
      : '<img src="assets/fun-watch/v4/message-more-20.svg" width="20" height="20" alt="">';
    $("[data-panel]", root).setAttribute("aria-label", store.panel ? "정보 영역 닫기" : "정보 영역 열기");
    $("[data-panel]", root).setAttribute("aria-expanded", store.panel);
    $("[data-prev]", root).hidden = S.i === 0;
    $("[data-next]", root).hidden = S.i === DATA.length - 1;
    $$(".sh-fab[data-mute]", root).forEach(function (b) { b.innerHTML = ic(muted() ? "volOff" : "volOn", 22); b.setAttribute("aria-label", muted() ? "소리 켜기" : "소리 끄기"); });
    paintPanel();
    paintMobile();
    paintPlay();
    ytMount();
    document.title = "FUNNATION — " + d.title;
  }
  function paintPanel() {
    var d = DATA[S.i], sc = $("[data-pscroll]", root), keep = sc.scrollTop, ox = S.otherX;
    sc.innerHTML = panelHTML(d);
    $("[data-pfoot]", root).innerHTML = inputHTML("panel");
    sc.scrollTop = keep;
    var row = $("[data-orow]", root);
    if (row) { row.scrollLeft = ox; oNav(); }
  }
  function paintMobile() {
    DATA.forEach(function (d) {
      var s = $('[data-side="' + d.id + '"]', root), c = $('[data-mcap="' + d.id + '"]', root);
      if (s) s.innerHTML = sideHTML(d);
      if (c) c.innerHTML = mcapHTML(d);
    });
  }
  function paintPlay() {
    var d = DATA[S.i], pct = d.len ? Math.min(100, S.t / d.len * 100) : 0;
    $("[data-pp]", root).innerHTML = ic(S.playing ? "pause" : "play", 20);
    $(".sh-ctrl__time", root).textContent = fmtT(S.t) + " / " + (d.len ? fmtT(d.len) : "--:--");
    $(".sh-ctrl .sh-bar__fill", root).style.width = pct + "%";
    $(".sh-ctrl .sh-bar__dot", root).style.left = pct + "%";
    $("[data-seek]", root).setAttribute("aria-valuenow", Math.floor(S.t));
    $("[data-seek]", root).setAttribute("aria-valuemax", d.len);
    $$(".sh-slide", root).forEach(function (sl) {
      var on = +sl.getAttribute("data-slide") === S.i;
      sl.classList.toggle("is-cur", on);
      $(".sh-mbar .sh-bar__fill", sl).style.width = on ? pct + "%" : "0%";
    });
    root.classList.toggle("is-paused", !S.playing);
  }
  function flash(icon) {
    $$(".sh-flash", root).forEach(function (f) {
      f.innerHTML = ic(icon, 34);
      f.classList.remove("is-on"); void f.offsetWidth; f.classList.add("is-on");
    });
  }

  /* ---------- 이동 ---------- */
  var lastGo = 0;
  function go(i, dir, fromScroll) {
    if (i < 0 || i >= DATA.length || i === S.i) return;
    lastGo = Date.now();
    S.i = i; S.t = 0; S.playing = true; S.descOpen = false; S.more = false; S.otherX = 0; ytInfoAt = 0; S.retried = false; S.kicked = false;
    history.replaceState(null, "", "#s=" + i);
    paintStatic();
    if (!mobile.matches && !reduce.matches && dir) {
      video.classList.remove("is-up", "is-down"); void video.offsetWidth;
      video.classList.add(dir > 0 ? "is-up" : "is-down");
    }
    if (!fromScroll && mobile.matches) scrollToSlide(i, true);
  }
  function scrollToSlide(i, smooth) {
    var sl = $('[data-slide="' + i + '"]', root);
    if (sl) feed.scrollTo({ top: sl.offsetTop, behavior: smooth && !reduce.matches ? "smooth" : "auto" });
  }

  /* ---------- 유튜브 플레이어 (iframe 하나를 지금 쇼츠 자리로 옮겨 씀) ----------
     YouTube IFrame API 를 스크립트 없이 postMessage 로: 명령(playVideo · pauseVideo · mute · unMute · seekTo) 보내고,
     infoDelivery(currentTime · duration · playerState)를 받아 우리 재생바 · 시간을 그림. 유튜브 자체 컨트롤은 숨김(controls=0),
     영상 위는 투명 막(.sh-hit)이 눌림을 받아 재생/멈춤. 끝나면(playerState 0) 다음 쇼츠 */
  var yt = document.createElement("iframe");
  yt.className = "sh-yt__frame";
  yt.title = "쇼츠 영상";
  yt.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
  yt.setAttribute("tabindex", "-1");
  var ytSrcId = "", ytInfoT = 0, ytInfoAt = 0, ytListen = null;
  function ytPost(func, args) {
    if (!yt.contentWindow) return;
    yt.contentWindow.postMessage(JSON.stringify({ event: "command", func: func, args: args || [] }), "*");
  }
  function ytMount() {
    var d = DATA[S.i];
    var slot = mobile.matches ? $('[data-yt-slot="' + d.id + '"]', root) : $("[data-yt-pc]", root);
    if (!slot) return;
    var moved = yt.parentNode !== slot;
    if (moved) slot.appendChild(yt);
    if (ytSrcId !== d.yt || moved) {
      root.classList.remove("is-yt-on");
      ytSrcId = d.yt;
      yt.src = "https://www.youtube.com/embed/" + d.yt + "?autoplay=1&mute=1&playsinline=1&controls=0&disablekb=1&fs=0&iv_load_policy=3&rel=0&modestbranding=1&enablejsapi=1&origin=" + encodeURIComponent(location.origin);
    }
  }
  yt.addEventListener("load", function () {
    // 플레이어 상태를 받겠다고 알림 (YouTube IFrame API 와 같은 방식)
    clearInterval(ytListen);
    var n = 0;
    ytListen = setInterval(function () {
      if (!yt.contentWindow || n++ > 20) { clearInterval(ytListen); return; }
      yt.contentWindow.postMessage(JSON.stringify({ event: "listening", id: "sh-yt", channel: "widget" }), "*");
    }, 250);
  });
  window.addEventListener("message", function (e) {
    if (e.source !== yt.contentWindow || String(e.origin).indexOf("youtube") < 0) return;
    var m; try { m = typeof e.data === "string" ? JSON.parse(e.data) : e.data; } catch (er) { return; }
    if (!m) return;
    if (m.event === "onReady" || m.event === "initialDelivery") {
      clearInterval(ytListen);
      if (muted()) ytPost("mute"); else ytPost("unMute");
      ytPost(S.playing ? "playVideo" : "pauseVideo");
    }
    var info = m.info;
    if (!info || typeof info !== "object") return;
    var d = DATA[S.i];
    if (typeof info.duration === "number" && info.duration > 0) d.len = info.duration;
    if (typeof info.currentTime === "number") { ytInfoT = info.currentTime; ytInfoAt = performance.now(); S.t = ytInfoT; }
    if (typeof info.playerState === "number") {
      if (info.playerState === 1) { root.classList.add("is-yt-on"); if (!S.userPlay) S.playing = true; }
      if (info.playerState === 2 && !S.userPlay) {
        // 소리 있는 자동 재생이 막혀 멈춘 경우 — 소리 끄고 다시 재생
        if (S.playing && !S.retried) { S.retried = true; ytPost("mute"); ytPost("playVideo"); }
        else S.playing = false;
      }
      if ((info.playerState === -1 || info.playerState === 5) && S.playing && !S.kicked) { S.kicked = true; ytPost("mute"); ytPost("playVideo"); }
      if (info.playerState === 0) { if (S.i < DATA.length - 1) go(S.i + 1, 1); else S.playing = false; }
    }
    paintPlay();
  });
  // 재생 중엔 받은 시간 사이를 이어 그려 재생바가 부드럽게
  function tick(ts) {
    if (S.playing && !document.hidden && ytInfoAt && DATA[S.i].len) {
      S.t = Math.min(DATA[S.i].len, ytInfoT + (ts - ytInfoAt) / 1000);
      paintPlay();
    }
    requestAnimationFrame(tick);
  }
  function togglePlay() {
    S.playing = !S.playing;
    S.userPlay = true; clearTimeout(S.upT); S.upT = setTimeout(function () { S.userPlay = false; }, 800);
    if (S.playing) { ytInfoT = S.t; ytInfoAt = performance.now(); ytPost("playVideo"); } else ytPost("pauseVideo");
    paintPlay(); flash(S.playing ? "play" : "pause");
  }
  function seek(t) { S.t = t; ytInfoT = t; ytInfoAt = performance.now(); ytPost("seekTo", [t, true]); paintPlay(); }
  function setMuted(v) { activated = true; store.muted = v; save(); ytPost(v ? "mute" : "unMute"); paintStatic(); }
  function onFirstAct() {
    if (activated) return;
    activated = true;
    if (!store.muted) { ytPost("unMute"); paintStatic(); }
  }
  ["pointerdown", "keydown", "touchend"].forEach(function (ev) { document.addEventListener(ev, onFirstAct, { capture: true, passive: true }); });

  /* ---------- 다른 쇼츠 가로 넘김 ---------- */
  function oNav() {
    var row = $("[data-orow]", root);
    if (!row) return;
    var p = $('[data-onav="-1"]', root), n = $('[data-onav="1"]', root);
    if (p) p.hidden = row.scrollLeft <= 2;
    if (n) n.hidden = row.scrollLeft >= row.scrollWidth - row.clientWidth - 2;
  }

  /* ---------- 댓글 ---------- */
  function addComment(text) {
    var d = DATA[S.i];
    comments(d.id).push({ k: "m" + Date.now(), n: ME.n, av: ME.av, text: text, at: Date.now(), likes: 0, liked: false });
    save();
    paintPanel(); paintMobile();
    if (!sheetEl.hidden && sheetEl.getAttribute("data-kind") === "c") {
      $(".sh-sheet__body", sheetEl).innerHTML = commentsHTML(d);
      $(".sh-sheet__head b", sheetEl).textContent = comments(d.id).length;
      $(".sh-sheet__body", sheetEl).scrollTop = 0;
    } else {
      var sc = $("[data-pscroll]", root), cm = $(".sh-cmt", root);
      if (sc && cm) sc.scrollTop = cm.offsetTop - 8;
    }
    toast("댓글을 등록했어요");
  }

  /* ---------- 이벤트 ---------- */
  function onClick(e) {
    var t = e.target, b;
    var d = DATA[S.i];
    if (!t.closest(".sh-more") && S.more) { S.more = false; var mm = $(".sh-menu", root); if (mm) mm.hidden = true; }
    if ((b = t.closest("[data-need-login]"))) { needLogin(); return; }
    if (t.closest(".sh-ctrl") && !t.closest("[data-pp]")) { if (!t.closest("[data-seek]")) return; }
    if ((b = t.closest("[data-pp]"))) { e.stopPropagation(); togglePlay(); return; }
    if ((b = t.closest("[data-seek]"))) {
      var r = b.getBoundingClientRect();
      if (d.len) seek(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * d.len); return;
    }
    if (t.closest(".sh-cap a")) return;
    if (t.closest("[data-video]")) { togglePlay(); return; }
    if ((b = t.closest("[data-panel]"))) { store.panel = !store.panel; save(); paintStatic(); return; }
    if (t.closest("[data-prev]")) { go(S.i - 1, -1); return; }
    if (t.closest("[data-next]")) { go(S.i + 1, 1); return; }
    if (t.closest("[data-mute]")) { setMuted(!store.muted); toast(store.muted ? "소리를 껐어요" : "소리를 켰어요"); return; }
    if (t.closest("[data-share]")) {
      var url = location.href.split("#")[0] + "#s=" + d.id;
      if (navigator.clipboard) navigator.clipboard.writeText(url).catch(function () {});
      toast("링크를 복사했어요"); return;
    }
    if (t.closest("[data-more]")) { S.more = !S.more; var menu = $(".sh-menu", root); menu.hidden = !S.more; $("[data-more]", root).setAttribute("aria-expanded", S.more); return; }
    if ((b = t.closest("[data-act]"))) {
      var a = b.getAttribute("data-act");
      S.more = false; sheetClose();
      if (a === "report") toast("신고가 접수되었어요");
      if (a === "full") { window.open("https://www.youtube.com/shorts/" + d.yt, "_blank", "noopener"); return; }
      paintPanel(); return;
    }
    if (t.closest("[data-desc]")) { S.descOpen = !S.descOpen; paintPanel(); paintMobile(); return; }
    if (t.closest("[data-like]")) {
      if (needLogin()) return;
      store.like[d.id] = !liked(d.id); save(); paintPanel(); paintMobile();
      if (liked(d.id)) flash("likeOn");
      return;
    }
    if (t.closest("[data-follow]")) {
      if (needLogin()) return;
      var f = fav();
      if (!f) return;
      if (f.has(d.ch)) { f.remove(d.ch); toast("팔로우를 취소했어요"); } else { f.add(d.ch, d.av); toast("팔로우했어요"); }
      paintPanel(); paintMobile(); return;
    }
    if ((b = t.closest("[data-go]"))) { var row = $("[data-orow]", root); S.otherX = row ? row.scrollLeft : 0; go(+b.getAttribute("data-go"), 1); return; }
    if ((b = t.closest("[data-onav]"))) {
      var rw = $("[data-orow]", root);
      rw.scrollBy({ left: +b.getAttribute("data-onav") * (rw.clientWidth + 8), behavior: reduce.matches ? "auto" : "smooth" }); return;
    }
    if ((b = t.closest("[data-clike]"))) {
      if (needLogin()) return;
      var k = b.getAttribute("data-clike"), c = comments(d.id).filter(function (x) { return x.k === k; })[0];
      if (!c) return;
      c.liked = !c.liked; c.likes += c.liked ? 1 : -1; save();
      b.classList.toggle("is-on", c.liked); b.setAttribute("aria-pressed", c.liked);
      b.innerHTML = ic(c.liked ? "heartOn" : "heart", 16) + "<span>" + (c.likes || "") + "</span>";
      return;
    }
    if ((b = t.closest("[data-emo]"))) { if (needLogin()) return; var em = $(".sh-emo", b.closest("form")); em.hidden = !em.hidden; return; }
    if ((b = t.closest("[data-emo-pick]"))) { var fm = b.closest("form"), inp = $(".sh-cin__field", fm); inp.value += b.getAttribute("data-emo-pick"); inp.dispatchEvent(new Event("input", { bubbles: true })); inp.focus(); return; }
    if (t.closest("[data-cimg]")) { if (needLogin()) return; toast("사진 첨부는 준비 중이에요"); return; }
    if ((b = t.closest("[data-at]"))) { if (needLogin()) return; var ip = $(".sh-cin__field", b.closest("form")); ip.value += (ip.value && !/\s$/.test(ip.value) ? " " : "") + "@"; ip.dispatchEvent(new Event("input", { bubbles: true })); ip.focus(); return; }
    if (t.closest("[data-csheet]")) { sheetOpen("c"); return; }
    if (t.closest("[data-msheet]")) { sheetOpen("m"); return; }
    if (t.closest("[data-sheet-x]")) { sheetClose(); return; }
    if (t.closest(".sh-slide") && !t.closest("a,button,.sh-chips")) { togglePlay(); return; }
  }
  root.addEventListener("click", onClick);
  sheetEl.addEventListener("click", onClick);
  function onInput(e) {
    if (e.target.classList.contains("sh-cin__field")) {
      var f = e.target.closest("form"), on = !!e.target.value.trim();
      f.classList.toggle("has-text", on); $(".sh-cin__go", f).setAttribute("aria-disabled", String(!on));
    }
  }
  root.addEventListener("input", onInput);
  sheetEl.addEventListener("input", onInput);
  function onSubmit(e) {
    e.preventDefault();
    if (needLogin()) return;
    var inp = $(".sh-cin__field", e.target), v = inp.value.trim();
    if (!v) return;
    inp.value = "";
    e.target.classList.remove("has-text"); $(".sh-cin__go", e.target).setAttribute("aria-disabled", "true");
    addComment(v);
  }
  root.addEventListener("submit", onSubmit);
  sheetEl.addEventListener("submit", onSubmit);
  function onFocus(e) { if (e.target.hasAttribute && e.target.hasAttribute("data-need-login")) { e.target.blur(); needLogin(); } }
  root.addEventListener("focusin", onFocus);
  sheetEl.addEventListener("focusin", onFocus);

  // 재생바 끌기
  var drag = null;
  root.addEventListener("pointerdown", function (e) {
    var b = e.target.closest("[data-seek]");
    if (!b) return;
    drag = b; b.setPointerCapture(e.pointerId);
  });
  root.addEventListener("pointermove", function (e) {
    if (!drag) return;
    var r = drag.getBoundingClientRect();
    if (DATA[S.i].len) seek(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * DATA[S.i].len);
  });
  root.addEventListener("pointerup", function () { drag = null; });

  // PC 휠 · 키보드
  var wheelLock = 0;
  stage.addEventListener("wheel", function (e) {
    e.preventDefault();
    if (Date.now() - wheelLock < 700 || Math.abs(e.deltaY) < 12) return;
    wheelLock = Date.now();
    go(S.i + (e.deltaY > 0 ? 1 : -1), e.deltaY > 0 ? 1 : -1);
  }, { passive: false });
  document.addEventListener("keydown", function (e) {
    if (e.target.closest && e.target.closest("input,textarea,select,[contenteditable]")) return;
    if (html.getAttribute("data-view")) return;
    if (e.key === "Escape") { sheetClose(); if (S.more) { S.more = false; paintPanel(); } return; }
    if (e.key === "ArrowDown") { e.preventDefault(); go(S.i + 1, 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); go(S.i - 1, -1); }
    else if (e.key === " " || e.key === "k") { if (e.target.closest && e.target.closest("button,a")) return; e.preventDefault(); togglePlay(); }
    else if (e.key === "m") setMuted(!store.muted);
  });
  root.addEventListener("scroll", function (e) { if (e.target.matches && e.target.matches("[data-orow]")) oNav(); }, true);

  // 모바일 — 스크롤로 넘기면 지금 쇼츠 바꿈
  var io = new IntersectionObserver(function (ents) {
    if (!mobile.matches) return;
    ents.forEach(function (en) {
      if (en.isIntersecting && en.intersectionRatio >= 0.6) {
        var i = +en.target.getAttribute("data-slide");
        if (i !== S.i) go(i, 0, true);
      }
    });
  }, { root: feed, threshold: [0.6] });
  $$(".sh-slide", root).forEach(function (sl) { io.observe(sl); });
  function syncMode() { if (mobile.matches) scrollToSlide(S.i, false); sheetClose(); ytMount(); }
  mobile.addEventListener ? mobile.addEventListener("change", syncMode) : mobile.addListener(syncMode);

  // 로그인 상태 · 팔로우 목록이 바뀌면 다시 그림
  new MutationObserver(function () { paintPanel(); paintMobile(); }).observe(html, { attributes: true, attributeFilter: ["data-auth"] });
  if (fav() && fav().onChange) fav().onChange(function () { paintPanel(); paintMobile(); });
  window.addEventListener("hashchange", function () {
    var mm = /(?:^#|&)s=(\d+)/.exec(location.hash);
    if (mm && DATA[+mm[1]] && +mm[1] !== S.i) go(+mm[1], +mm[1] > S.i ? 1 : -1);
  });

  paintStatic();
  if (mobile.matches) requestAnimationFrame(function () { scrollToSlide(S.i, false); });
  requestAnimationFrame(tick);
})();
