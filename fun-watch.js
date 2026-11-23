/* ============================================================
   펀네이션 라이브 방송 상세 (fun-watch.html) — 2026-11-23
   실서비스(funnation.co.kr/store/{id}/live/broadcast) 기능 기준.
   서버 연동 전이라 채팅 · 랭킹 · 펀캐시는 샘플 데이터로 동작하고,
   이 기기 설정(채팅 폭 · 글자 크기 · 고정 영역 등)은 브라우저에 저장.
   ============================================================ */
/* 고르기 모드(작업용) — app.js 맨 위와 같은 코드. 이 페이지는 app.js 를 안 불러서 따로 둠.
   Shift 두 번(입력칸 밖) 또는 Option(Alt) + Shift + P 로 켜기 / 끄기, ?pick=1 · ?pick=0 */
(function () {
  var KEY = "funnation-pick", q = location.search + location.hash, on = false;
  function load() {
    if (document.querySelector('script[src^="pick.js"]')) return;
    var s = document.createElement("script"); s.src = "pick.js?v=20261123b"; document.head.appendChild(s);
  }
  try {
    if (/[?&#]pick=0\b/.test(q)) sessionStorage.removeItem(KEY);
    else on = /[?&#]pick(=1)?\b/.test(q) || sessionStorage.getItem(KEY) === "1";
  } catch (e) { on = /[?&#]pick(=1)?\b/.test(q); }
  if (on) load();
  function toggle() {
    if (document.getElementById("pk-bar")) {
      try { sessionStorage.removeItem(KEY); } catch (er) {}
      var u = location.href.replace(/([?&])pick(=1)?(&|$)/, "$1").replace(/[?&](#|$)/, "$1").replace(/#pick(=1)?$/, "");
      if (u === location.href) location.reload(); else location.href = u;
    } else {
      try { sessionStorage.setItem(KEY, "1"); } catch (er) {}
      load();
    }
  }
  function typing(t) { return t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)); }
  var lastShift = 0, clean = false;
  document.addEventListener("keydown", function (e) {
    if (e.altKey && e.shiftKey && e.code === "KeyP") { e.preventDefault(); toggle(); return; }
    if (e.key === "Shift") { if (!e.repeat) clean = true; return; }
    clean = false; lastShift = 0;
  }, true);
  document.addEventListener("keyup", function (e) {
    if (e.key !== "Shift" || !clean || typing(e.target)) return;
    var now = Date.now();
    if (now - lastShift < 400) { lastShift = 0; toggle(); } else lastShift = now;
  }, true);
})();

(function () {
  "use strict";

  var lw = document.getElementById("lw");
  if (!lw) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var POPOUT = /[?&]chat=popout(&|$)/.test(location.search);

  /* ---------- 저장 ---------- */
  var STORE = "funnation-fwatch";
  var prefs = { stack: false, rankbar: true, pindonate: true, pinmsg: true, badge: true, lite: false, size: "m", chatW: 340, voice: "혜리 (여)", name: "토비", nameAt: 0, chatview: false };
  try { var saved = JSON.parse(localStorage.getItem(STORE) || "{}"); for (var k in saved) if (k in prefs) prefs[k] = saved[k]; } catch (e) {}
  function save() { try { localStorage.setItem(STORE, JSON.stringify(prefs)); } catch (e) {} }

  /* 로그인 상태 — 다른 페이지와 같은 저장값(app.js "funnation-auth"), ?auth=out 으로 미리보기 */
  var auth = "in";
  try { auth = localStorage.getItem("funnation-auth") || "in"; } catch (e) {}
  var forced = new URLSearchParams(location.search).get("auth");
  if (forced === "in" || forced === "out") auth = forced;
  lw.setAttribute("data-auth", auth);
  function needLogin() {
    if (auth !== "out") return false;
    location.href = "index.html#login";
    return true;
  }

  /* ---------- 토스트 (3초) ---------- */
  var toastEl = $("[data-toast]"), toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.hidden = true; }, 3000);
  }

  var won = function (n) { return n.toLocaleString("ko-KR"); };
  var shortWon = function (n) {
    if (n >= 100000000) return (n / 100000000).toFixed(n % 100000000 ? 1 : 0).replace(/\.0$/, "") + "억원";
    if (n >= 10000) return (Math.round(n / 1000) / 10).toString().replace(/\.0$/, "") + "만원";
    if (n >= 1000) return (Math.round(n / 100) / 10).toString().replace(/\.0$/, "") + "천원";
    return n + "원";
  };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* ---------- 레이아웃 — 좌우(1024 이상 · 가로형 560 이상) / 세로 ---------- */
  var sideMq = window.matchMedia("(min-width: 1024px), (min-aspect-ratio: 5/4) and (min-width: 560px)");
  function layout() {
    var side = sideMq.matches && !prefs.stack && !POPOUT;
    lw.setAttribute("data-layout", side ? "side" : "stack");
    if (POPOUT) lw.setAttribute("data-popout", "");
    measureDock();
  }
  if (sideMq.addEventListener) sideMq.addEventListener("change", layout); else sideMq.addListener(layout);

  /* 채팅 팝업 창 — 채팅만 화면 가득 */
  if (POPOUT) {
    document.title = "채팅 — YM상사";
    $(".lw-top").remove();
    $(".lw-main").remove();
    $(".lw-resize").remove();
    lw.classList.add("lw--popout");
    var st = document.createElement("style");
    st.textContent = ".lw--popout .lw-chat{flex:1;width:auto;border:0}.lw--popout [data-chat-fold],.lw--popout [data-chat-popout],.lw--popout [data-dock-chat]{display:none!important}";
    document.head.appendChild(st);
  }

  /* ---------- 채팅 폭 조절 ---------- */
  // 원하는 폭(prefs.chatW)은 끌어서 바꿀 때만 저장, 화면이 좁으면 보이는 폭만 줄임
  function setChatW(w, keep) {
    var max = Math.max(280, Math.min(560, window.innerWidth - 480));
    var v = Math.round(Math.max(280, Math.min(max, w)));
    if (!keep) prefs.chatW = v;
    lw.style.setProperty("--chat-w", v + "px");
  }
  setChatW(prefs.chatW, true);
  var handle = $("[data-resize]");
  if (handle) {
    handle.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      handle.setPointerCapture(e.pointerId);
      lw.setAttribute("data-resizing", "");
      var move = function (ev) { setChatW(window.innerWidth - ev.clientX); };
      var up = function () {
        lw.removeAttribute("data-resizing");
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", up);
        save();
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", up);
    });
    handle.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { setChatW(prefs.chatW + 20); save(); }
      if (e.key === "ArrowRight") { setChatW(prefs.chatW - 20); save(); }
    });
    window.addEventListener("resize", function () { setChatW(prefs.chatW, true); });
  }

  /* ============================================================
     플레이어
     ============================================================ */
  var player = $("#lw-player");
  if (player) (function () {
    var video = $("video", player);
    var src = player.getAttribute("data-stream-src");
    var playBtn = $("[data-play]", player), muteBtn = $("[data-mute]", player), unmute = $("[data-unmute]", player);
    var vol = $("[data-volume]", player);
    var demoPaused = false;
    if (src) {
      video.src = src;
      video.muted = true; // 자동 재생은 음소거로 시작 → "눌러서 소리 켜기"
      video.play().catch(function () {});
    } else if (video.getAttribute("data-poster")) {
      video.poster = video.getAttribute("data-poster");
    }
    function sync() {
      var paused = src ? video.paused : demoPaused;
      playBtn.setAttribute("aria-label", paused ? "재생" : "일시정지");
      $(".ic", playBtn).className = "ic " + (paused ? "ic--play" : "ic--pause");
      var muted = video.muted || video.volume === 0;
      muteBtn.setAttribute("aria-label", muted ? "음소거 해제" : "음소거");
      $(".ic", muteBtn).className = "ic " + (muted ? "ic--mute" : "ic--volume");
      unmute.hidden = !muted;
      vol.value = muted ? 0 : Math.round(video.volume * 100);
    }
    video.addEventListener("play", sync);
    video.addEventListener("pause", function () { player.setAttribute("data-behind", ""); sync(); });
    video.addEventListener("volumechange", sync);
    playBtn.addEventListener("click", function () {
      if (!src) demoPaused = !demoPaused;
      else if (video.paused) video.play(); else video.pause();
      sync();
    });
    function setMuted(m) {
      video.muted = m;
      if (!m && video.volume === 0) video.volume = 0.6;
      sync();
    }
    muteBtn.addEventListener("click", function () { setMuted(!(video.muted || video.volume === 0)); });
    unmute.addEventListener("click", function (e) { e.stopPropagation(); setMuted(false); });
    vol.addEventListener("input", function () {
      video.volume = vol.value / 100;
      video.muted = +vol.value === 0;
    });
    $("[data-golive]", player).addEventListener("click", function () {
      if (src && video.seekable.length) video.currentTime = video.seekable.end(video.seekable.length - 1);
      if (src) video.play();
      demoPaused = false;
      player.removeAttribute("data-behind");
      sync();
    });

    // 컨트롤은 마우스를 움직이면 보이고 3초 뒤 숨김
    var uiT;
    function showUI() {
      player.setAttribute("data-ui", "");
      clearTimeout(uiT);
      uiT = setTimeout(function () {
        if (!player.querySelector(".lw-menu:not([hidden])") && !player.matches(":focus-within")) player.removeAttribute("data-ui");
      }, 3000);
    }
    player.addEventListener("pointermove", showUI);
    player.addEventListener("pointerdown", showUI);
    player.addEventListener("focusin", showUI);
    player.addEventListener("pointerleave", function () {
      if (!player.querySelector(".lw-menu:not([hidden])")) player.removeAttribute("data-ui");
    });

    // 화질
    var qBtn = $("[data-quality-btn]", player), qMenu = $("#lw-quality-menu");
    function qOpen(o) { qMenu.hidden = !o; qBtn.setAttribute("aria-expanded", o ? "true" : "false"); }
    qBtn.addEventListener("click", function (e) { e.stopPropagation(); qOpen(qMenu.hidden); });
    qMenu.addEventListener("click", function (e) {
      var it = e.target.closest("[role=menuitemradio]");
      if (!it) return;
      $$("[role=menuitemradio]", qMenu).forEach(function (b) { b.setAttribute("aria-checked", b === it ? "true" : "false"); });
      $("[data-quality-label]", player).textContent = it.textContent === "자동" ? "자동" : it.textContent;
      qOpen(false);
    });
    document.addEventListener("click", function (e) { if (!qMenu.hidden && !e.target.closest(".lw-quality")) qOpen(false); });

    // 소리만 듣기
    var audioBtn = $("[data-audio-only]", player), audioNote = $(".lw-player__audio", player);
    audioBtn.addEventListener("click", function () {
      var on = audioBtn.getAttribute("aria-pressed") !== "true";
      audioBtn.setAttribute("aria-pressed", on ? "true" : "false");
      audioNote.hidden = !on;
      player.toggleAttribute("data-audio", on);
      if (on && video.muted) setMuted(false);
    });

    // 작은 창(PIP)
    $("[data-pip]", player).addEventListener("click", function () {
      if (document.pictureInPictureElement) document.exitPictureInPicture();
      else if (video.requestPictureInPicture && src) video.requestPictureInPicture().catch(function () { toast("이 브라우저에서는 작은 창으로 볼 수 없어요"); });
      else toast("이 브라우저에서는 작은 창으로 볼 수 없어요");
    });

    // 넓은 화면 ↔ 기본 화면
    var wideBtn = $("[data-wide]", player);
    wideBtn.addEventListener("click", function () {
      var on = !lw.hasAttribute("data-wide");
      lw.toggleAttribute("data-wide", on);
      wideBtn.setAttribute("aria-pressed", on ? "true" : "false");
      wideBtn.setAttribute("aria-label", on ? "기본 화면" : "넓은 화면");
    });

    // 전체화면
    var fullBtn = $("[data-full]", player);
    fullBtn.addEventListener("click", function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (player.requestFullscreen) player.requestFullscreen();
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    });
    document.addEventListener("fullscreenchange", function () {
      fullBtn.setAttribute("aria-label", document.fullscreenElement ? "전체화면 종료" : "전체화면");
    });

    // 키보드 — 스페이스 재생/정지, M 음소거, F 전체화면 (입력 중 제외)
    document.addEventListener("keydown", function (e) {
      if (e.target.closest("input, textarea, [contenteditable]")) return;
      if (e.key === " " && e.target === document.body) { e.preventDefault(); playBtn.click(); }
      else if (e.key === "m" || e.key === "M") muteBtn.click();
      else if (e.key === "f" || e.key === "F") fullBtn.click();
    });
    sync();
  })();

  /* ---------- 방송 시간 · 시청자 ---------- */
  var up = $("[data-uptime]");
  if (up) {
    var sec = +up.getAttribute("data-uptime");
    var pad = function (n) { return (n < 10 ? "0" : "") + n; };
    var tick = function () { up.textContent = Math.floor(sec / 3600) + ":" + pad(Math.floor(sec / 60) % 60) + ":" + pad(sec % 60); sec++; };
    tick(); setInterval(tick, 1000);
  }
  var viewers = 184;
  setInterval(function () {
    viewers = Math.max(120, viewers + Math.round((Math.random() - 0.45) * 4));
    $$("[data-viewers]").forEach(function (el) { el.textContent = won(viewers); });
  }, 8000);

  /* ---------- 즐겨찾기 · 공유 · 더보기 ----------
     2026-11-23 팔로우 → 즐겨찾기로 통일. 방송인 팝오버 · 즐겨찾기 페이지와 같은 브라우저 저장
     (app.js window.FunFav 의 "funnation-fav-creators", 항목 { n: 이름, p: 사진 }) 을 직접 읽고 씀 — 이 페이지는 app.js 를 안 씀 */
  var FAV_KEY = "funnation-fav-creators";
  var FAV_DEFAULT = ["채이", "김예슬", "한량왕자", "조유정", "큰별TV", "송피아", "부아앙", "차수아", "쎄랑", "장군이TV"];
  function favList() {
    var raw = null, l = null;
    try { raw = localStorage.getItem(FAV_KEY); } catch (e) {}
    if (raw !== null) { try { l = JSON.parse(raw); } catch (e) {} }
    if (!Array.isArray(l)) return FAV_DEFAULT.map(function (n) { return { n: n }; });
    if (l.length && typeof l[0] === "string") {
      var out = FAV_DEFAULT.map(function (n) { return { n: n }; });
      l.forEach(function (n) { if (FAV_DEFAULT.indexOf(n) < 0) out.push({ n: n }); });
      return out;
    }
    return l.filter(function (x) { return x && typeof x.n === "string"; });
  }
  function favSave(l) { try { localStorage.setItem(FAV_KEY, JSON.stringify(l)); } catch (e) {} }
  var follow = $("[data-follow]");
  if (follow) {
    var favName = follow.getAttribute("data-fav-name"), favPic = follow.getAttribute("data-fav-pic");
    var fc = $("[data-followers]"), baseCount = fc ? +fc.textContent.replace(/,/g, "") : 0; /* 2026-11-23 방송 정보를 유튜브 라이브 모양으로 바꾸며 팔로워 수 줄은 없앰 */
    var favHas = function () { return favList().some(function (x) { return x.n === favName; }); };
    var favSync = function () {
      var on = favHas();
      follow.setAttribute("aria-pressed", on ? "true" : "false");
      $("span", follow).textContent = on ? "팔로잉" : "팔로우";
      if (fc) fc.textContent = won(baseCount + (on ? 1 : 0));
    };
    follow.addEventListener("click", function () {
      if (needLogin()) return;
      var l = favList(), on = !favHas();
      if (on) { var item = { n: favName }; if (favPic) item.p = favPic; l.push(item); }
      else l = l.filter(function (x) { return x.n !== favName; });
      favSave(l);
      favSync();
      toast(on ? "팔로우했어요" : "팔로우를 취소했어요");
    });
    window.addEventListener("storage", function (e) { if (e.key === FAV_KEY || e.key === null) favSync(); });
    favSync();
  }
  var share = $("[data-share]");
  if (share) share.addEventListener("click", function () {
    var url = location.href.split("#")[0];
    if (navigator.share && matchMedia("(pointer: coarse)").matches) {
      navigator.share({ title: document.title, url: url }).catch(function () {});
      return;
    }
    (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(
      function () { toast("방송 링크를 복사했어요"); },
      function () { toast("링크를 복사하지 못했어요"); }
    );
  });
  function bindMenu(btn, menu) {
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var o = menu.hidden;
      menu.hidden = !o;
      btn.setAttribute("aria-expanded", o ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!menu.hidden && !menu.contains(e.target)) { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); }
    });
  }
  bindMenu($("[data-more-btn]"), $("#lw-more-menu"));
  /* 설명 더보기 · 다시보기 정렬 칩 — 유튜브 라이브 영상 상세(app.js)와 같은 동작. 정렬은 선택 표시만(서버 연동 전) */
  var wdescBtn = $("[data-wdesc-toggle]");
  if (wdescBtn) wdescBtn.addEventListener("click", function () {
    var open = this.getAttribute("aria-expanded") !== "true";
    this.setAttribute("aria-expanded", open ? "true" : "false");
    this.textContent = open ? "간략히" : "...더보기";
    this.closest(".wdesc").setAttribute("data-expanded", open ? "true" : "false");
  });
  $$("[data-wmore-sort] button").forEach(function (b, _, all) {
    b.addEventListener("click", function () {
      $$("[data-wmore-sort] button").forEach(function (x) { x.classList.toggle("is-active", x === b); x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    });
  });
  $$("[data-report]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (needLogin()) return;
      $("#lw-more-menu").hidden = true;
      toast(b.getAttribute("data-report") + " 신고를 접수했어요");
    });
  });

  /* ============================================================
     채팅
     ============================================================ */
  var GRADES = { 1: "동화", 2: "은화", 3: "금화", 4: "백금화", 5: "다이아", 6: "사파이어", 7: "에메랄드", 8: "루비", 9: "토파즈", 10: "자수정", 11: "크라운", 17: "시리우스", 18: "헬리오스", 19: "갤럭시", 20: "코스모스" };
  var COLORS = ["#ff9f43", "#c4b5fd", "#57dff7", "#7bed9f", "#ffd336", "#ff8fab", "#a0c4ff", "#f7b267"];
  var USERS = {
    "YM상사": { role: "creator" },
    "초사단_미카엘": { grade: 5 }, "은버들": { grade: 2 }, "청림호수": { grade: 8, role: "manager" },
    "불법충": { grade: 10 }, "더유니크이예또팬": { grade: 6, role: "manager" }, "백마토끼": { grade: 18 },
    "한량왕자": { grade: 17 }, "부아앙": { grade: 11 }, "산책중입니다": {}, "오늘도함께": { grade: 1 }, "예또팬": { grade: 3 }
  };
  function colorOf(name) {
    var h = 0;
    for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return COLORS[h % COLORS.length];
  }
  var list = $("[data-chat-list]"), scroller = $("[data-chat-scroll]");
  var hidden = {};
  var atBottom = true;

  function badgeHtml(name) {
    var u = USERS[name] || {};
    if (u.role === "creator") return '<span class="lw-msg__badge lw-msg__badge--creator">크리에이터</span>';
    if (!u.grade) return "";
    var g = u.grade < 10 ? "0" + u.grade : String(u.grade);
    return '<span class="lw-msg__badge" style="color:' + colorOf(GRADES[u.grade] || "") + '"><img src="assets/v2/station/grade/grade-' + g + '-s.webp" alt="">' + esc(GRADES[u.grade] || "") + "</span>";
  }
  function addNode(li) {
    list.appendChild(li);
    while (list.children.length > 300) list.removeChild(list.children[1]);
    if (atBottom) scroller.scrollTop = scroller.scrollHeight;
    else showNew(li);
  }
  function addMsg(name, text, opts) {
    opts = opts || {};
    var u = USERS[name] || {};
    var li = document.createElement("li");
    li.className = "lw-msg" + (u.role === "creator" ? " lw-msg--creator" : "") + (opts.me ? " lw-msg--me" : "");
    li.setAttribute("data-user", name);
    if (hidden[name]) li.classList.add("lw-msg--hidden");
    var color = u.role === "creator" ? "" : ' style="color:' + colorOf(name) + '"';
    li.innerHTML = badgeHtml(name) + '<span class="lw-msg__name" role="button" tabindex="0" data-user-btn' + (opts.me ? "" : color) + ">" + esc(name) + "</span>" + '<span class="lw-msg__text">' + esc(text) + "</span>";
    addNode(li);
  }
  function addDono(name, amount, text) {
    var li = document.createElement("li");
    li.className = "lw-dono";
    li.setAttribute("data-user", name);
    li.innerHTML = '<span class="lw-dono__head">' + esc(name) + '</span><span class="lw-dono__won">' + won(amount) + "원</span>" + (text ? '<p class="lw-dono__text">' + esc(text) + "</p>" : "");
    addNode(li);
  }

  // 처음 메시지
  var seed = [
    ["YM상사", "오늘도 방송 와주셔서 감사합니다 🎃 후원 점수는 만원 이상부터 적용돼요!"],
    ["불법충", "예또팬님 깡통까지는 본인이 계산 때려봐야할거같고 본계정은 10억 찍히네여", 100],
    ["초사단_미카엘", "칭호빼면됨"],
    ["은버들", "나 신규가입이고 등급신청안해서 아무것도 없었는데 그냥 들어가니 인사했어"],
    ["초사단_미카엘", "ㅋㅋ"],
    ["초사단_미카엘", "닉때문에 걸리신듯"],
    ["YM상사", "다들 반가워요~ 오늘은 할로윈 특집!"],
    ["은버들", "어쩔수없이 후원했는..."],
    ["청림호수", "유튜브닉보면 형들은 거의다아는"],
    ["불법충", "ㅋㅋㅋㅋ 설정란에서 R 안뜨게 숨길수있어요 그거 안숨기면 열혈팬배처럼 떠요", 100],
    ["초사단_미카엘", "미카엘은 6명이상봄"],
    ["청림호수", "펀네이션은 생소한형들이 많음"],
    ["더유니크이예또팬", "불법님 숲 닉 뭐임?"]
  ];
  seed.forEach(function (m) { if (m[2]) addDono(m[0], m[2], m[1]); else addMsg(m[0], m[1]); });
  var div = document.createElement("li");
  div.className = "lw-divider";
  div.setAttribute("role", "separator");
  div.textContent = "여기부터 새 채팅";
  list.appendChild(div);
  addDono("불법충", 100, "닉 깔거였으면 불법충으로 안왔죠 ㅋㅋㅋ 그냥 산책중입니다");
  addMsg("초사단_미카엘", "숲닉 내분캐아는분 없어서 모름.");
  scroller.scrollTop = scroller.scrollHeight;

  // 새 메시지 미리보기 — 위로 올려 읽는 중일 때
  var newBtn = $("[data-newmsg]"), newText = $("[data-newmsg-text]");
  function showNew(li) {
    if (li.classList.contains("lw-msg--hidden")) return;
    var name = li.getAttribute("data-user") || "";
    var txt = li.classList.contains("lw-dono") ? $(".lw-dono__won", li).textContent + " 후원" : ($(".lw-msg__text", li) || li).textContent;
    newText.innerHTML = "<b>" + esc(name) + "</b>" + esc(txt);
    newBtn.hidden = false;
  }
  scroller.addEventListener("scroll", function () {
    if (scroller.clientHeight === 0) return;
    atBottom = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 40;
    if (atBottom) newBtn.hidden = true;
  });
  // 화면 크기 · 패널이 바뀌어도 맨 아래를 보던 중이면 맨 아래 유지
  if (window.ResizeObserver) new ResizeObserver(function () {
    if (atBottom) scroller.scrollTop = scroller.scrollHeight;
  }).observe(scroller);
  newBtn.addEventListener("click", function () {
    scroller.scrollTop = scroller.scrollHeight;
    atBottom = true;
    newBtn.hidden = true;
  });
  // 새 메시지 알림 자리 = 입력칸 + 아래 막대 높이 위
  function measureDock() {
    var h = 0;
    [".lw-input", ".lw-donate", ".lw-dock"].forEach(function (s) { var el = $(s); if (el && el.offsetParent) h += el.offsetHeight; });
    lw.style.setProperty("--dock-h", h + "px");
  }
  window.addEventListener("resize", measureDock);

  // 다른 시청자 메시지 (샘플)
  var LINES = ["ㅋㅋㅋ", "오 대박", "브금 좋다", "할로윈 분위기 미쳤다", "형님 오늘 몇시까지 해요?", "ㅎㅇㅎㅇ", "이거 무슨 노래에요?", "화질 좋네요", "가즈아", "오늘 텐션 좋다", "👏👏", "ㅇㅈ"];
  var NAMES = ["초사단_미카엘", "은버들", "청림호수", "더유니크이예또팬", "산책중입니다", "오늘도함께", "예또팬", "부아앙"];
  (function loop() {
    setTimeout(function () {
      if (Math.random() < 0.07) {
        var n = NAMES[Math.floor(Math.random() * NAMES.length)];
        var a = [1000, 5000, 10000, 30000][Math.floor(Math.random() * 4)];
        addDono(n, a, "방송 잘 보고 있어요!");
        addRank(n, a);
      } else {
        addMsg(NAMES[Math.floor(Math.random() * NAMES.length)], LINES[Math.floor(Math.random() * LINES.length)]);
      }
      loop();
    }, 1800 + Math.random() * 2600);
  })();

  // 보내기
  var form = $("[data-chat-form]"), input = $("[data-chat-input]");
  if (auth === "out") input.placeholder = "로그인 후 채팅에 참여할 수 있어요";
  input.addEventListener("focus", function () { if (auth === "out") { input.blur(); needLogin(); } });
  input.addEventListener("input", function () { form.toggleAttribute("data-has", !!input.value.trim()); });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (needLogin()) return;
    var v = input.value.trim();
    if (!v) return;
    USERS[prefs.name] = USERS[prefs.name] || { grade: 7 };
    atBottom = true;
    addMsg(prefs.name, v, { me: true });
    input.value = "";
    form.removeAttribute("data-has");
  });

  // 이모지
  var emojiBtn = $("[data-emoji-btn]"), emojiPop = $("[data-emoji-pop]");
  "😀 😂 🤣 😍 🥰 😎 🤔 😭 😡 👍 👏 🙏 🔥 💯 🎉 ❤️ 💙 🎃 👻 💀 🤡 😱 🥲 🫶".split(" ").forEach(function (em) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = em;
    b.setAttribute("aria-label", em);
    b.addEventListener("click", function () {
      input.value += em;
      form.setAttribute("data-has", "");
      input.focus();
    });
    emojiPop.appendChild(b);
  });
  emojiBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (needLogin()) return;
    emojiPop.hidden = !emojiPop.hidden;
    emojiBtn.setAttribute("aria-expanded", emojiPop.hidden ? "false" : "true");
  });
  document.addEventListener("click", function (e) {
    if (!emojiPop.hidden && !e.target.closest("[data-emoji-pop]")) { emojiPop.hidden = true; emojiBtn.setAttribute("aria-expanded", "false"); }
  });

  /* ---------- 유저 카드 ---------- */
  var card = $("#lw-user"), cardName = $("#lw-user-name"), hideBtn = $("[data-user-hide]");
  var cardUser = "";
  function openCard(name, anchor) {
    cardUser = name;
    cardName.textContent = name;
    hideBtn.setAttribute("aria-pressed", hidden[name] ? "true" : "false");
    hideBtn.textContent = hidden[name] ? "보이기" : "안 보이기";
    card.hidden = false;
    var chat = $("#lw-chat").getBoundingClientRect();
    var r = anchor.getBoundingClientRect();
    var top = r.top - chat.top - card.offsetHeight - 8;
    if (top < 40) top = r.bottom - chat.top + 8;
    card.style.top = Math.min(top, chat.height - card.offsetHeight - 8) + "px";
    card.style.bottom = "auto";
  }
  list.addEventListener("click", function (e) {
    var n = e.target.closest("[data-user-btn]");
    if (n) { e.stopPropagation(); openCard(n.textContent, n); }
  });
  list.addEventListener("keydown", function (e) {
    var n = e.target.closest("[data-user-btn]");
    if (n && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openCard(n.textContent, n); }
  });
  $("[data-user-close]").addEventListener("click", function () { card.hidden = true; });
  hideBtn.addEventListener("click", function () {
    var on = !hidden[cardUser];
    if (on) hidden[cardUser] = true; else delete hidden[cardUser];
    $$('[data-user="' + cardUser.replace(/"/g, '\\"') + '"]', list).forEach(function (li) { li.classList.toggle("lw-msg--hidden", on); });
    card.hidden = true;
    toast(on ? cardUser + "님의 채팅을 가렸어요" : cardUser + "님의 채팅을 다시 보여요");
  });
  $("[data-user-talk]").addEventListener("click", function (e) { e.preventDefault(); if (!needLogin()) toast("TALK 대화방은 준비 중이에요"); });
  $("[data-user-report]").addEventListener("click", function () {
    if (needLogin()) return;
    card.hidden = true;
    toast(cardUser + "님을 신고했어요");
  });
  document.addEventListener("click", function (e) { if (!card.hidden && !card.contains(e.target)) card.hidden = true; });

  /* ---------- 참여자 목록 ---------- */
  var pBtn = $("[data-people-btn]"), pPop = $("#lw-people-pop"), pList = $("[data-people-list]"), pSearch = $("[data-people-search]");
  var ROLE = { creator: "크리에이터", manager: "매니저" };
  Object.keys(USERS).forEach(function (n) {
    var u = USERS[n];
    var li = document.createElement("li");
    li.innerHTML = '<button type="button" data-people-name="' + esc(n) + '"><span>' + esc(n) + "</span>" + (u.role ? '<small class="' + (u.role === "creator" ? "is-creator" : "") + '">' + ROLE[u.role] + "</small>" : "") + "</button>";
    pList.appendChild(li);
  });
  bindMenu(pBtn, pPop);
  pBtn.addEventListener("click", function () { if (!pPop.hidden) pSearch.focus(); });
  pSearch.addEventListener("input", function () {
    var q = pSearch.value.trim().toLowerCase(), any = false;
    $$("li", pList).forEach(function (li) {
      var hit = !q || li.textContent.toLowerCase().indexOf(q) > -1;
      li.hidden = !hit;
      if (hit) any = true;
    });
    $("[data-people-none]").hidden = any;
  });
  pList.addEventListener("click", function (e) {
    var b = e.target.closest("[data-people-name]");
    if (!b) return;
    e.stopPropagation();
    pPop.hidden = true;
    pBtn.setAttribute("aria-expanded", "false");
    openCard(b.getAttribute("data-people-name"), pBtn);
  });

  /* ============================================================
     후원 랭킹 — 순위 줄 · 팝업 · 고정 후원
     ============================================================ */
  var ranks = [["백마토끼", 3924000], ["한량왕자", 2824000], ["부아앙", 1724000], ["초사단_미카엘", 512000], ["청림호수", 230000], ["은버들", 120000], ["불법충", 300]];
  var best = { name: "백마토끼", amount: 1227000 };
  var MEDAL = ["assets/fun-watch/medal-1.svg", "assets/fun-watch/medal-2.svg", "assets/fun-watch/medal-3.svg"];
  function addRank(name, amount) {
    var r = ranks.filter(function (x) { return x[0] === name; })[0];
    if (r) r[1] += amount; else ranks.push([name, amount]);
    ranks.sort(function (a, b) { return b[1] - a[1]; });
    if (amount > best.amount) best = { name: name, amount: amount };
    renderRank();
  }
  var rankbar = $("[data-rankbar]"), rankpop = $("#lw-rankpop"), rankBtn = $("[data-rankpop-btn]");
  var pinDonate = $("[data-pin-donate]");
  var lastDono = null;
  function renderRank() {
    var top = ranks[0];
    rankbar.innerHTML = (top ? '<span class="lw-rankbar__item"><img src="' + MEDAL[0] + '" alt="1위"><b>' + esc(top[0]) + "</b><em>" + shortWon(top[1]) + "</em></span>" : "") +
      '<span class="lw-rankbar__sep" aria-hidden="true"></span>' +
      '<span class="lw-rankbar__item"><img src="assets/fun-watch/v2/high-voltage.svg" alt="" style="width:14px;height:14px"><span class="lw-hanbang">한방</span><b>' + esc(best.name) + "</b><em>" + shortWon(best.amount) + "</em></span>";
    $("[data-rank-top]").textContent = Math.min(10, ranks.length) + "위";
    $("[data-rank-count]").textContent = ranks.length + "명";
    $("[data-rank-best]").innerHTML = '<img src="assets/fun-watch/v2/high-voltage.svg" width="16" height="16" alt=""><span class="lw-best__label">한방 최고</span><b>' + esc(best.name) + "</b><em>" + won(best.amount) + "원</em>";
    var max = ranks.length ? ranks[0][1] : 1;
    $("[data-rank-list]").innerHTML = ranks.slice(0, 10).map(function (r, i) {
      var no = i < 3 ? '<img src="' + MEDAL[i] + '" alt="' + (i + 1) + '위">' : '<span class="lw-rk__no">' + (i + 1) + "</span>";
      return "<li>" + no + '<span class="lw-rk__name">' + esc(r[0]) + '</span><span class="lw-rk__won">' + won(r[1]) + '원</span><span class="lw-rk__bar"><i style="width:' + Math.max(3, r[1] / max * 100) + '%"></i></span></li>';
    }).join("") || '<li class="lw-rankpop__empty">아직 후원이 없어요</li>';
  }
  function renderPin() {
    if (!lastDono) { pinDonate.hidden = true; return; }
    pinDonate.hidden = !prefs.pindonate;
    pinDonate.innerHTML = '<i class="ic ic--gift" aria-hidden="true"></i><b>' + esc(lastDono.name) + "</b><span>" + esc(lastDono.text || "후원 감사합니다") + "</span><em>" + won(lastDono.amount) + "원</em>";
  }
  renderRank();
  rankBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    closeSettings();
    rankpop.hidden = !rankpop.hidden;
    rankBtn.setAttribute("aria-expanded", rankpop.hidden ? "false" : "true");
  });
  $("[data-rankpop-close]").addEventListener("click", function () { rankpop.hidden = true; rankBtn.setAttribute("aria-expanded", "false"); });
  document.addEventListener("click", function (e) {
    if (!rankpop.hidden && !rankpop.contains(e.target) && !e.target.closest("[data-rankpop-btn]")) { rankpop.hidden = true; rankBtn.setAttribute("aria-expanded", "false"); }
  });

  // 고정 메시지 접기
  var pinMsg = $(".lw-pin--msg"), pinFold = $("[data-pin-fold]");
  pinFold.addEventListener("click", function () {
    var f = !pinMsg.hasAttribute("data-folded");
    pinMsg.toggleAttribute("data-folded", f);
    pinFold.setAttribute("aria-expanded", f ? "false" : "true");
    pinFold.setAttribute("aria-label", f ? "고정 메시지 펼치기" : "고정 메시지 접기");
  });

  /* ============================================================
     후원 패널
     ============================================================ */
  var donate = $("#lw-donate"), dockDonate = $("[data-dock-donate]");
  var amountIn = $("[data-amount]"), amountBox = $(".lw-amount"), warn = $("[data-amount-warn]"), goBtn = $("[data-donate-go]");
  var balance = auth === "out" ? 0 : 999990000;
  $("[data-balance]").textContent = won(balance);
  $("[data-donate-name]").placeholder = "비우면 내 닉네임(" + prefs.name + ")";
  var getAmount = function () { return +amountIn.value.replace(/[^0-9]/g, "") || 0; };
  function checkAmount() {
    var a = getAmount();
    var msg = "";
    if (a < 100) msg = "최소 후원 금액은 100원이에요";
    else if (a > balance) msg = "보유 펀캐시가 부족해요";
    warn.textContent = msg;
    warn.hidden = !msg;
    amountBox.toggleAttribute("data-error", !!msg && a > 0);
    goBtn.disabled = !!msg;
  }
  amountIn.addEventListener("input", function () {
    var a = getAmount();
    amountIn.value = a ? won(a) : "";
    checkAmount();
  });
  $$("[data-add]").forEach(function (b) {
    b.addEventListener("click", function () {
      var v = b.getAttribute("data-add");
      amountIn.value = won(v === "all" ? balance : getAmount() + +v);
      checkAmount();
    });
  });
  var msgIn = $("[data-donate-msg]");
  msgIn.addEventListener("input", function () { $("[data-msg-count]").textContent = msgIn.value.length; });

  // 채팅 읽어주기 목소리
  var VOICES = ["혜리 (여)", "서현 (여)", "문정 (여)", "은경 (여)", "지선 (여)", "박창수 (남)", "필재 (남)", "현준 (남)", "승재 (남)", "준우 (아동남)", "진우 (남)", "다은 (여)", "한영 (여)", "강일 (남)", "혜진 (여)", "예슬 (여)", "이겸 (남)", "유나 Pro (여·감정)", "고은 Pro (여·감정)", "다인 Pro (여·감정)", "혜리 Pro (여)", "기서 (여)", "예지 (여)", "늘봄 (여)", "은영 (여)", "동현 Pro (남)", "우식 (남)", "시윤 (남)", "준영 (남)", "은우 (남)", "야옹이 (캐릭터)", "멍멍이 (캐릭터)", "하준 (아동남)", "다인 (아동여)", "가람 (아동여)", "마녀 사비나 (캐릭터)", "최무비 (영화더빙)", "박리뷰 (리뷰톤)", "미경 Pro (여·감정)", "대성 (남·감정)"];
  var vBtn = $("[data-voice-btn]"), vList = $("[data-voice-list]"), vNow = $("[data-voice-now]");
  function renderVoices() {
    vNow.textContent = prefs.voice;
    vList.innerHTML = VOICES.map(function (v) {
      return '<li><button type="button" role="option" aria-selected="' + (v === prefs.voice) + '" data-voice="' + esc(v) + '">' + esc(v) + "</button></li>";
    }).join("");
  }
  renderVoices();
  vBtn.addEventListener("click", function () {
    vList.hidden = !vList.hidden;
    vBtn.setAttribute("aria-expanded", vList.hidden ? "false" : "true");
  });
  vList.addEventListener("click", function (e) {
    var b = e.target.closest("[data-voice]");
    if (!b) return;
    prefs.voice = b.getAttribute("data-voice");
    save();
    renderVoices();
    vList.hidden = true;
    vBtn.setAttribute("aria-expanded", "false");
  });

  function openDonate(open) {
    if (open && needLogin()) return;
    if (open) unfoldChat();
    if (open && lw.getAttribute("data-layout") === "stack") setChatClosed(false);
    donate.hidden = !open;
    dockDonate.setAttribute("aria-pressed", open ? "true" : "false");
    if (open) { closeSettings(); checkAmount(); }
    measureDock();
    if (atBottom) scroller.scrollTop = scroller.scrollHeight;
  }
  dockDonate.addEventListener("click", function () { openDonate(donate.hidden); });
  $$("[data-open-donate]").forEach(function (b) { b.addEventListener("click", function () { openDonate(true); }); });
  goBtn.addEventListener("click", function () {
    checkAmount();
    if (goBtn.disabled) return;
    var a = getAmount();
    var anon = $("[data-donate-anon]").checked;
    var name = anon ? "익명" : ($("[data-donate-name]").value.trim() || prefs.name);
    var text = msgIn.value.trim();
    balance -= a;
    $("[data-balance]").textContent = won(balance);
    atBottom = true;
    addDono(name, a, text);
    addRank(name, a);
    lastDono = { name: name, amount: a, text: text };
    renderPin();
    msgIn.value = "";
    $("[data-msg-count]").textContent = "0";
    amountIn.value = "100";
    openDonate(false);
    toast(won(a) + "원을 후원했어요");
  });

  /* ============================================================
     채팅 접기 · 팝업 · 채팅뷰 · 세로 배치 채팅 탭
     ============================================================ */
  function unfoldChat() { lw.removeAttribute("data-folded"); }
  $("[data-chat-fold]").addEventListener("click", function () { lw.setAttribute("data-folded", ""); closeSettings(); });
  $("[data-chat-unfold]").addEventListener("click", unfoldChat);
  $("[data-chat-popout]").addEventListener("click", function () {
    window.open(location.pathname + "?chat=popout", "funnation-chat", "width=380,height=720");
  });

  var dockChat = $("[data-dock-chat]");
  function setChatClosed(c) {
    lw.toggleAttribute("data-chat-closed", c);
    dockChat.setAttribute("aria-pressed", c ? "false" : "true");
    if (c) { donate.hidden = true; dockDonate.setAttribute("aria-pressed", "false"); }
    measureDock();
  }
  dockChat.addEventListener("click", function () { setChatClosed(!lw.hasAttribute("data-chat-closed")); });

  var dockView = $("[data-dock-view]");
  function setChatView(on) {
    prefs.chatview = on;
    lw.toggleAttribute("data-chatview", on);
    dockView.setAttribute("aria-pressed", on ? "true" : "false");
    measureDock();
    scroller.scrollTop = scroller.scrollHeight;
  }
  dockView.addEventListener("click", function () { setChatView(!prefs.chatview); save(); });

  /* ============================================================
     채팅 설정
     ============================================================ */
  var settings = $("#lw-settings");
  var setBtns = $$("[data-settings-btn]");
  function closeSettings() {
    settings.hidden = true;
    setBtns.forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
  }
  setBtns.forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      var o = settings.hidden;
      closeSettings();
      rankpop.hidden = true;
      rankBtn.setAttribute("aria-expanded", "false");
      if (o) {
        settings.hidden = false;
        b.setAttribute("aria-expanded", "true");
        if (lw.getAttribute("data-layout") === "stack") setChatClosed(false);
      }
    });
  });
  document.addEventListener("click", function (e) {
    if (!settings.hidden && !settings.contains(e.target)) closeSettings();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    closeSettings();
    card.hidden = true;
    rankpop.hidden = true;
    emojiPop.hidden = true;
    $$(".lw-menu, .lw-people__pop").forEach(function (m) { m.hidden = true; });
  });

  function applyPrefs() {
    $$("[data-pref-btn]").forEach(function (b) {
      var k = b.getAttribute("data-pref-btn");
      b.setAttribute("aria-checked", prefs[k] ? "true" : "false");
    });
    $$("[data-pref-area]").forEach(function (el) {
      var k = el.getAttribute("data-pref-area");
      if (k === "pindonate") { renderPin(); return; }
      el.hidden = !prefs[k];
    });
    lw.setAttribute("data-pref-badge", prefs.badge ? "on" : "off");
    lw.setAttribute("data-pref-lite", prefs.lite ? "on" : "off");
    lw.setAttribute("data-size", prefs.size);
    $$("[data-size]", settings).forEach(function (b) { b.setAttribute("aria-checked", b.getAttribute("data-size") === prefs.size ? "true" : "false"); });
    layout();
  }
  $$("[data-pref-btn]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      var k = b.getAttribute("data-pref-btn");
      prefs[k] = !prefs[k];
      save();
      applyPrefs();
    });
  });
  $$("[data-size]", settings).forEach(function (b) {
    b.addEventListener("click", function () {
      prefs.size = b.getAttribute("data-size");
      save();
      applyPrefs();
      if (atBottom) scroller.scrollTop = scroller.scrollHeight;
    });
  });

  // 채팅 이름 — 하루 1번 · 1~10자 · 금칙어 · 중복 불가
  var nameForm = $("[data-name-form]"), nameIn = $("[data-name-input]"), nameSave = $("[data-name-save]"), nameNote = $("[data-name-note]");
  var BAD = ["운영자", "관리자", "펀네이션", "admin"];
  var NOTE = "하루 1번 · 1~10자 · 중복·금칙어 불가";
  nameIn.value = prefs.name;
  if (auth === "out") { nameIn.disabled = true; nameIn.value = ""; nameIn.placeholder = "로그인이 필요해요"; }
  function nameCheck() {
    var v = nameIn.value.trim(), err = "";
    if (!v || v === prefs.name) err = "";
    else if (v.length > 10) err = "1~10자로 입력해주세요";
    else if (BAD.some(function (w) { return v.toLowerCase().indexOf(w) > -1; })) err = "사용할 수 없는 단어가 들어 있어요";
    else if (USERS[v] && v !== prefs.name) err = "이미 사용 중인 이름이에요";
    else if (Date.now() - prefs.nameAt < 864e5) err = "채팅 이름은 하루에 한 번만 바꿀 수 있어요";
    nameNote.textContent = err || NOTE;
    nameNote.style.color = err ? "#ff6363" : "";
    nameSave.disabled = !v || v === prefs.name || !!err;
  }
  nameIn.addEventListener("input", nameCheck);
  nameForm.addEventListener("submit", function (e) {
    e.preventDefault();
    nameCheck();
    if (nameSave.disabled) return;
    prefs.name = nameIn.value.trim();
    prefs.nameAt = Date.now();
    save();
    $("[data-donate-name]").placeholder = "비우면 내 닉네임(" + prefs.name + ")";
    nameCheck();
    toast("채팅 이름을 ‘" + prefs.name + "’(으)로 바꿨어요");
  });

  if (prefs.chatview && !POPOUT) setChatView(true);
  applyPrefs();
  measureDock();
})();
