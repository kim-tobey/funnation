/* ============================================================
   채팅톡 (talk.html · 2026-11-23)
   - 왼쪽 목록: 1:1 메시지 · 알림(대화 요청 수락/거절 · 안내), 이름 검색
   - 오른쪽 대화방: 날짜 구분 · 말풍선 묶음 · 전송 실패(다시 보내기 · 삭제) · 입력 중 표시 · 더보기(방송국 · 알림 끄기 · 차단 · 나가기)
   - 모바일: 목록 → 대화방 전체 화면(#c=<아이디>, 뒤로 가기로 목록)
   - 서버 연동 전: 대화는 이 브라우저(localStorage funnation-talk)에 저장, 상대 답장은 데모로 자동 생성
   - talk.html?to=<아이디> 로 들어오면 그 사람 대화방을 엶 (없으면 새로 만듦)
   ============================================================ */
(function () {
  var root = document.getElementById("talk");
  if (!root) return;

  var KEY = "funnation-talk";
  var html = document.documentElement;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var mobile = matchMedia("(max-width: 767px)");
  var MIN = 60000, HOUR = 60 * MIN, DAY = 24 * HOUR;

  /* ---------- 아이콘 (선 아이콘, 펀네이션 홈과 같은 두께) ---------- */
  var IC = {
    back: '<path d="M15 6l-6 6 6 6"/>',
    more: '<circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/>',
    home: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>',
    bellOff: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4M4 4l16 16"/>',
    ban: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
    flag: '<path d="M5 21V4h12l-2 4 2 4H5"/>',
    out: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H3"/>',
    talk: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/>',
    user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>'
  };
  function ic(n, s) {
    s = s || 20;
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[n] + "</svg>";
  }

  /* ---------- 샘플 데이터 ---------- */
  function seed() {
    var now = Date.now();
    var ago = function (ms) { return now - ms; };
    function c(id, n, av, role, extra, msgs) {
      var o = { id: id, n: n, av: av, role: role, live: false, mute: false, blocked: false, unread: 0, msgs: msgs };
      for (var k in extra) o[k] = extra[k];
      return o;
    }
    function m(me, t, x, fail) { return { me: me, t: t, x: x, fail: !!fail }; }
    return {
      v: 1,
      convs: [
        c("funsangsa", "펀상사", "assets/v2/station/profile.jpg", "creator", { live: true, unread: 3 }, [
          m(false, ago(DAY + 3 * HOUR), "지난 방송 와주셔서 감사해요!"),
          m(true, ago(DAY + 3 * HOUR - 2 * MIN), "덕분에 퇴근길이 즐거웠어요 ㅎㅎ"),
          m(false, ago(32 * MIN), "오늘 9시에 퇴근전쟁 시즌1 9화 해요"),
          m(false, ago(31 * MIN), "직급제 이벤트도 같이 열어요 🎉"),
          m(false, ago(30 * MIN), "시간 되시면 놀러 오세요!")
        ]),
        c("ymss", "YM상사", "assets/watch/v4/avatar-ymss.jpg", "creator", { unread: 1 }, [
          m(true, ago(3 * HOUR), "어제 팀전 너무 재밌었어요"),
          m(false, ago(2 * HOUR), "다음 주 시즌7 8화도 기대해 주세요 ㅋㅋ")
        ]),
        c("saebyeokgyeoljae", "새벽결재", "assets/home/avatar/vtuber-blue.png", "creator", {}, [
          m(false, ago(5 * HOUR), "합방 일정 확인 부탁드려요"),
          m(true, ago(5 * HOUR - 4 * MIN), "네! 금요일 저녁 맞죠?"),
          m(false, ago(5 * HOUR - 6 * MIN), "맞아요 8시 시작이에요"),
          m(true, ago(5 * HOUR - 7 * MIN), "좋아요 그때 봐요!", true)
        ]),
        c("kaltoe_hope", "칼퇴희망", "assets/home/avatar/vtuber-green.png", "user", {}, [
          m(false, ago(DAY + 5 * HOUR), "아까 그 장면 클립 있으세요?"),
          m(true, ago(DAY + 4 * HOUR), "다시보기 1시간 12분쯤이에요")
        ]),
        c("tangbisil", "탕비실지킴이", "assets/home/avatar/pixel.png", "creator", { mute: true }, [
          m(false, ago(2 * DAY), "간식 후원 감사합니다 🍪")
        ]),
        c("haru_overtime", "야근요정하루", "assets/home/avatar/vtuber-purple.png", "creator", {}, [
          m(true, ago(3 * DAY), "새벽 방송 잘 봤어요"),
          m(false, ago(3 * DAY - HOUR), "늦게까지 함께해 주셔서 고마워요!")
        ]),
        c("copier_down", "복사기고장", "assets/home/avatar/bear.jpg", "user", {}, [
          m(false, ago(4 * DAY), "다음 시그니처 뭐 할지 투표했어요?")
        ]),
        c("suseup_queen", "수습의여왕", "assets/home/avatar/chim.png", "creator", {}, [
          m(false, ago(5 * DAY), "방송국 게시판에 공지 올렸어요")
        ]),
        c("newbie_talk", "신입은말해요", "assets/logout/avatar1.png", "user", {}, [
          m(true, ago(7 * DAY), "처음 왔는데 분위기 좋네요"),
          m(false, ago(7 * DAY - 10 * MIN), "환영해요! 자주 놀러 오세요")
        ])
      ],
      notis: [
        { id: "r1", kind: "req", from: { id: "coffee_fairy", n: "커피한잔요정", av: "assets/logout/avatar3.png", role: "user" }, x: "안녕하세요! 방송 같이 보는 사이 맞죠?", t: ago(20 * MIN), read: false },
        { id: "r2", kind: "req", from: { id: "monday_blues", n: "월요병환자", av: "assets/logout/avatar4.png", role: "user" }, x: "랭킹 이벤트 질문이 있어요", t: ago(6 * HOUR), read: false },
        { id: "s1", kind: "info", x: "채팅톡이 열렸어요. 팔로우한 크리에이터와 1:1 로 이야기해 보세요.", t: ago(DAY), read: true }
      ]
    };
  }

  var S;
  try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) { S = null; }
  if (!S || S.v !== 1 || !S.convs) S = seed();
  /* 차단은 방송인 팝오버와 같은 목록(app.js FunBlock)을 따름 */
  if (window.FunBlock) S.convs.forEach(function (c) { c.blocked = FunBlock.has(c.n); });
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} document.dispatchEvent(new Event("talk:change")); }

  var ui = { tab: "msg", q: "", open: null, menu: false, typing: {} };

  /* ---------- 시간 표시 ---------- */
  function hm(t) {
    var d = new Date(t), h = d.getHours(), mm = d.getMinutes();
    return (h < 12 ? "오전 " : "오후 ") + ((h % 12) || 12) + ":" + (mm < 10 ? "0" : "") + mm;
  }
  function dayKey(t) { var d = new Date(t); return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate(); }
  function dayLabel(t) {
    var d = new Date(t), today = new Date();
    if (dayKey(t) === dayKey(today)) return "오늘";
    if (dayKey(t) === dayKey(today - DAY)) return "어제";
    var w = "일월화수목금토"[d.getDay()];
    return d.getFullYear() + "년 " + (d.getMonth() + 1) + "월 " + d.getDate() + "일 " + w + "요일";
  }
  function ago(t) {
    var g = Date.now() - t;
    if (g < MIN) return "방금";
    if (g < HOUR) return Math.floor(g / MIN) + "분 전";
    if (dayKey(t) === dayKey(Date.now())) return Math.floor(g / HOUR) + "시간 전";
    if (dayKey(t) === dayKey(Date.now() - DAY)) return "어제";
    if (g < 7 * DAY) return Math.max(2, Math.floor(g / DAY)) + "일 전";
    var d = new Date(t);
    return (d.getMonth() + 1) + "월 " + d.getDate() + "일";
  }

  /* ---------- 공통 ---------- */
  function conv(id) { for (var i = 0; i < S.convs.length; i++) if (S.convs[i].id === id) return S.convs[i]; return null; }
  function last(c) { return c.msgs[c.msgs.length - 1]; }
  function sorted() { return S.convs.slice().sort(function (a, b) { return (last(b) ? last(b).t : 0) - (last(a) ? last(a).t : 0); }); }
  function loggedIn() { return html.getAttribute("data-auth") !== "out"; }
  function avHTML(c, cls) {
    return '<span class="talk-av' + (c.live ? " is-live" : "") + (cls ? " " + cls : "") + '"><img src="' + esc(c.av) + '" alt="" loading="lazy" decoding="async"></span>';
  }

  var toastEl, toastTimer;
  function toast(text) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "talk-toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = text;
    toastEl.classList.toggle("is-room", root.classList.contains("is-room-open"));
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 3000);
  }

  function confirmBox(title, text, okLabel, danger, onOk) {
    var wrap = document.createElement("div");
    wrap.className = "talk-modal";
    wrap.innerHTML = '<div class="talk-modal__box" role="alertdialog" aria-modal="true" aria-labelledby="talk-mt"><h2 id="talk-mt">' + esc(title) + "</h2><p>" + esc(text) + '</p><div class="talk-modal__acts"><button class="talk-btn talk-btn--sec" type="button" data-x>취소</button><button class="talk-btn ' + (danger ? "talk-btn--danger" : "talk-btn--pri") + '" type="button" data-ok>' + esc(okLabel) + "</button></div></div>";
    document.body.appendChild(wrap);
    var close = function () { wrap.remove(); document.removeEventListener("keydown", onKey); };
    var onKey = function (e) { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    wrap.addEventListener("click", function (e) {
      if (e.target === wrap || e.target.closest("[data-x]")) close();
      else if (e.target.closest("[data-ok]")) { close(); onOk(); }
    });
    $("[data-ok]", wrap).focus();
  }

  /* ---------- 목록 ---------- */
  var rowsEl = $("[data-talk-rows]", root), roomEl = $("[data-talk-room]", root), tabsEl = $(".talk-tabs", root);

  function renderCounts() {
    var n = 0;
    S.convs.forEach(function (c) { if (!c.mute && !c.blocked) n += c.unread; });
    var u = $("[data-talk-unread]", root); u.hidden = !n || !loggedIn(); u.textContent = n > 99 ? "99+" : n;
    var r = S.notis.filter(function (x) { return !x.read; }).length;
    var v = $("[data-talk-noti-n]", root); v.hidden = !r || !loggedIn(); v.textContent = r;
  }

  function renderList() {
    renderCounts();
    tabsEl.setAttribute("data-tab", ui.tab);
    [].forEach.call(tabsEl.querySelectorAll("[data-talk-tab]"), function (b) { b.setAttribute("aria-selected", b.getAttribute("data-talk-tab") === ui.tab ? "true" : "false"); });
    $("[data-talk-search]", root).hidden = ui.tab !== "msg" || !loggedIn();

    if (!loggedIn()) {
      rowsEl.innerHTML = '<li class="talk-empty">' + ic("talk", 48) + "로그인하고 채팅톡을 시작해 보세요<small>팔로우한 크리에이터와 1:1 로 이야기할 수 있어요</small><a class=\"talk-btn talk-btn--pri\" href=\"#login\">로그인</a></li>";
      return;
    }
    if (ui.tab === "noti") {
      if (!S.notis.length) { rowsEl.innerHTML = '<li class="talk-empty">' + ic("bell", 48) + "새 알림이 없어요</li>"; return; }
      rowsEl.innerHTML = S.notis.map(function (x) {
        if (x.kind === "req") {
          return '<li class="talk-noti">' + avHTML(x.from) + '<div class="talk-noti__body"><p class="talk-noti__text"><b>' + esc(x.from.n) + "</b>님이 대화를 요청했어요<br>“" + esc(x.x) + '”</p><span class="talk-noti__time">' + ago(x.t) + '</span><div class="talk-noti__acts"><button class="talk-btn talk-btn--pri talk-btn--sm" type="button" data-req-ok="' + x.id + '">수락</button><button class="talk-btn talk-btn--sec talk-btn--sm" type="button" data-req-no="' + x.id + '">거절</button></div></div></li>';
        }
        return '<li class="talk-noti"><span class="talk-noti__icon">' + ic("info", 22) + '</span><div class="talk-noti__body"><p class="talk-noti__text">' + esc(x.x) + '</p><span class="talk-noti__time">' + ago(x.t) + "</span></div></li>";
      }).join("");
      return;
    }
    var q = ui.q.trim().toLowerCase();
    var list = sorted().filter(function (c) { return !q || c.n.toLowerCase().indexOf(q) >= 0; });
    if (!list.length) {
      rowsEl.innerHTML = '<li class="talk-empty">' + (q ? '<img src="assets/v2/creator/search-empty.svg" width="48" height="48" alt="">검색결과가 없어요' : ic("talk", 48) + "아직 대화가 없어요<small>방송국의 TALK 버튼으로 대화를 시작해 보세요</small>") + "</li>";
      return;
    }
    rowsEl.innerHTML = list.map(function (c) {
      var l = last(c), un = c.unread > 0;
      var prev = l ? (l.me ? "나: " : "") + l.x : "대화를 시작해 보세요";
      if (c.blocked) prev = "차단한 사용자예요";
      return '<li><button class="talk-row' + (un ? " is-unread" : "") + '" type="button" data-open="' + esc(c.id) + '"' + (ui.open === c.id ? ' aria-current="true"' : "") + ">" + avHTML(c) +
        '<span class="talk-row__body"><span class="talk-row__top"><span class="talk-row__name">' + esc(c.n) + "</span>" + (c.live ? '<span class="talk-live">LIVE</span>' : "") + (c.mute ? '<span class="talk-row__mute" title="알림 꺼짐">' + ic("bellOff", 14) + "</span>" : "") +
        '<span class="talk-row__time">' + (l ? ago(l.t) : "") + '</span></span><span class="talk-row__bottom"><span class="talk-row__preview">' + esc(prev) + "</span>" +
        (l && l.fail ? '<span class="talk-row__fail">전송 실패</span>' : un ? '<span class="talk-row__badge" aria-label="안 읽은 메시지 ' + c.unread + '개">' + (c.unread > 99 ? "99+" : c.unread) + "</span>" : "") +
        "</span></span></button></li>";
    }).join("");
  }

  /* ---------- 대화방 ---------- */
  function renderRoom(keepScroll) {
    var c = ui.open && conv(ui.open);
    root.classList.toggle("is-room-open", !!c);
    if (!c || !loggedIn()) {
      roomEl.innerHTML = '<div class="talk-empty">' + ic("talk", 48) + "대화를 선택하면 채팅이 여기에 표시돼요</div>";
      return;
    }
    var msgsEl = $("[data-talk-msgs]", roomEl);
    var prevTop = msgsEl ? msgsEl.scrollTop : 0;
    var atBottom = !msgsEl || msgsEl.scrollHeight - msgsEl.scrollTop - msgsEl.clientHeight < 40;
    var draft = $("textarea", roomEl) ? $("textarea", roomEl).value : "";
    var sameRoom = roomEl.getAttribute("data-id") === c.id;

    var head = '<header class="talk-room__head"><button class="talk-ib talk-room__back" type="button" aria-label="대화 목록으로" data-back>' + ic("back", 24) + "</button>" +
      (c.role === "creator" ? '<a class="talk-room__who" href="station.html" title="방송국 가기">' : '<div class="talk-room__who">') + avHTML(c) +
      '<span class="talk-room__name"><b><span>' + esc(c.n) + "</span>" + (c.live ? '<span class="talk-live">LIVE</span>' : "") + "</b><small>" + (c.role === "creator" ? (c.live ? "지금 방송 중" : "크리에이터") : "@" + esc(c.id)) + (c.mute ? " · 알림 꺼짐" : "") + "</small></span>" +
      (c.role === "creator" ? "</a>" : "</div>") +
      '<button class="talk-ib" type="button" aria-label="더보기" aria-haspopup="menu" aria-expanded="' + ui.menu + '" data-more>' + ic("more", 22) + "</button>" +
      (ui.menu ? '<div class="talk-menu" role="menu">' +
        (c.role === "creator" ? '<a role="menuitem" href="station.html">' + ic("home", 18) + "방송국 가기</a>" : "") +
        '<button role="menuitem" type="button" data-mute>' + ic(c.mute ? "bell" : "bellOff", 18) + (c.mute ? "알림 켜기" : "알림 끄기") + "</button>" +
        '<button role="menuitem" type="button" data-block>' + ic("ban", 18) + (c.blocked ? "차단 풀기" : "차단하기") + "</button>" +
        '<button role="menuitem" type="button" data-report>' + ic("flag", 18) + "신고하기</button>" +
        '<button role="menuitem" type="button" class="is-danger" data-leave>' + ic("out", 18) + "대화방 나가기</button></div>" : "") +
      "</header>";

    var body = "", prevDay = "", prevSender = null, prevT = 0;
    c.msgs.forEach(function (m, i) {
      var dk = dayKey(m.t);
      if (dk !== prevDay) { body += '<div class="talk-date">' + dayLabel(m.t) + "</div>"; prevDay = dk; prevSender = null; }
      var next = c.msgs[i + 1];
      var newGroup = prevSender !== m.me || m.t - prevT > 3 * MIN;
      var endGroup = !next || next.me !== m.me || next.t - m.t > 3 * MIN || dayKey(next.t) !== dk || m.fail;
      body += '<div class="talk-msg' + (m.me ? " talk-msg--me" : "") + (newGroup ? " is-new-group" : "") + (m.fail ? " is-fail" : "") + '">' +
        (m.me ? "" : '<span class="talk-msg__av' + (newGroup ? "" : " is-blank") + '"><img src="' + esc(c.av) + '" alt=""></span>') +
        '<div class="talk-msg__col"><div class="talk-bubble">' + esc(m.x) + "</div>" +
        (m.fail ? '<div class="talk-msg__meta"><span class="is-fail">전송 실패</span><button type="button" data-retry="' + i + '">다시 보내기</button><button type="button" data-del="' + i + '">삭제</button></div>'
          : endGroup ? '<div class="talk-msg__meta">' + hm(m.t) + "</div>" : "") +
        "</div></div>";
      prevSender = m.me; prevT = m.t;
    });
    if (ui.typing[c.id]) body += '<div class="talk-msg is-new-group"><span class="talk-msg__av"><img src="' + esc(c.av) + '" alt=""></span><div class="talk-msg__col"><div class="talk-bubble talk-typing" aria-label="' + esc(c.n) + '님이 입력 중"><i></i><i></i><i></i></div></div></div>';
    if (c.blocked) body += '<p class="talk-sys">차단한 사용자예요. 차단을 풀면 다시 이야기할 수 있어요.</p>';

    var input = '<form class="talk-input" data-form><textarea rows="1" maxlength="500" placeholder="' + (c.blocked ? "차단한 사용자에게는 보낼 수 없어요" : "메시지를 입력하세요") + '" aria-label="메시지 입력"' + (c.blocked ? " disabled" : "") + "></textarea>" +
      '<button class="talk-send" type="submit" disabled>전송</button></form>';

    roomEl.setAttribute("data-id", c.id);
    roomEl.innerHTML = head + '<div class="talk-msgs" data-talk-msgs role="log" aria-live="polite">' + body + "</div>" + input;
    var ta = $("textarea", roomEl);
    if (sameRoom && draft) { ta.value = draft; fit(ta); }
    $(".talk-send", roomEl).disabled = !ta.value.trim() || c.blocked;
    msgsEl = $("[data-talk-msgs]", roomEl);
    if (keepScroll && sameRoom && !atBottom) msgsEl.scrollTop = prevTop;
    else msgsEl.scrollTop = msgsEl.scrollHeight;
    return ta;
  }

  function fit(ta) { ta.style.height = "auto"; ta.style.height = Math.min(120, ta.scrollHeight + 2) + "px"; }

  function open(id, focus) {
    var c = conv(id);
    if (!c) return;
    ui.open = id; ui.menu = false;
    if (c.unread) { c.unread = 0; save(); }
    if (location.hash !== "#c=" + id) {
      var push = mobile.matches && location.hash.indexOf("#c=") !== 0;
      history[push ? "pushState" : "replaceState"](null, "", "#c=" + id);
      if (push) ui.pushed = true;
    }
    renderList();
    var ta = renderRoom();
    if (focus !== false && ta && !mobile.matches) ta.focus();
  }
  function closeRoom() {
    ui.open = null; ui.menu = false;
    renderList(); renderRoom();
  }

  /* ---------- 보내기 · 데모 답장 ---------- */
  var REPLIES = ["좋아요! 😊", "확인했어요, 고마워요", "방송에서 또 봬요!", "ㅋㅋㅋ 맞아요", "네네 그렇게 할게요", "오 좋은 생각이에요"];
  function send(c, text) {
    var failNow = /실패/.test(text); // 데모: "실패"가 들어가면 전송 실패 상태를 보여 줌
    c.msgs.push({ me: true, t: Date.now(), x: text, fail: failNow });
    save();
    renderList(); renderRoom();
    if (failNow || c.blocked) return;
    reply(c);
  }
  function reply(c) {
    clearTimeout(ui.typing[c.id + "_t"]);
    setTimeout(function () {
      ui.typing[c.id] = true;
      if (ui.open === c.id) renderRoom(true);
      ui.typing[c.id + "_t"] = setTimeout(function () {
        ui.typing[c.id] = false;
        c.msgs.push({ me: false, t: Date.now(), x: REPLIES[Math.floor(Math.random() * REPLIES.length)], fail: false });
        if (ui.open !== c.id) c.unread++;
        save();
        renderList();
        if (ui.open === c.id) renderRoom(true);
      }, 1400);
    }, 600);
  }

  /* ---------- 이벤트 ---------- */
  tabsEl.addEventListener("click", function (e) {
    var b = e.target.closest("[data-talk-tab]");
    if (!b) return;
    ui.tab = b.getAttribute("data-talk-tab");
    if (ui.tab === "noti") { S.notis.forEach(function (x) { if (x.kind === "info") x.read = true; }); save(); }
    renderList();
  });
  $("[data-talk-q]", root).addEventListener("input", function (e) { ui.q = e.target.value; renderList(); });

  rowsEl.addEventListener("click", function (e) {
    var b = e.target.closest("[data-open]");
    if (b) { open(b.getAttribute("data-open")); return; }
    var ok = e.target.closest("[data-req-ok]"), no = e.target.closest("[data-req-no]");
    if (ok || no) {
      var id = (ok || no).getAttribute(ok ? "data-req-ok" : "data-req-no");
      var x = S.notis.filter(function (n) { return n.id === id; })[0];
      S.notis = S.notis.filter(function (n) { return n.id !== id; });
      if (ok && x) {
        if (!conv(x.from.id)) S.convs.push({ id: x.from.id, n: x.from.n, av: x.from.av, role: x.from.role, live: false, mute: false, blocked: false, unread: 1, msgs: [{ me: false, t: x.t, x: x.x, fail: false }] });
        save();
        ui.tab = "msg";
        open(x.from.id);
        toast(x.from.n + "님과 대화를 시작했어요");
      } else {
        save(); renderList();
        toast("대화 요청을 거절했어요");
      }
    }
  });

  roomEl.addEventListener("click", function (e) {
    var c = ui.open && conv(ui.open);
    if (!c) return;
    if (e.target.closest("[data-back]")) {
      if (ui.pushed) { ui.pushed = false; history.back(); }
      else { history.replaceState(null, "", location.pathname + location.search); closeRoom(); }
      return;
    }
    if (e.target.closest("[data-more]")) { ui.menu = !ui.menu; renderRoom(true); return; }
    if (e.target.closest("[data-mute]")) { c.mute = !c.mute; ui.menu = false; save(); renderList(); renderRoom(true); toast(c.mute ? "이 대화방 알림을 껐어요" : "이 대화방 알림을 켰어요"); return; }
    if (e.target.closest("[data-block]")) {
      ui.menu = false;
      if (c.blocked) { c.blocked = false; if (window.FunBlock) FunBlock.remove(c.n); save(); renderList(); renderRoom(true); toast("차단을 풀었어요"); return; }
      renderRoom(true);
      confirmBox(c.n + "님을 차단할까요?", "차단하면 서로 메시지를 보낼 수 없어요. 차단은 언제든 풀 수 있어요.", "차단하기", true, function () { c.blocked = true; if (window.FunBlock) FunBlock.add(c.n); save(); renderList(); renderRoom(); toast("차단했어요"); });
      return;
    }
    if (e.target.closest("[data-report]")) { ui.menu = false; renderRoom(true); toast("신고는 준비 중이에요"); return; }
    if (e.target.closest("[data-leave]")) {
      ui.menu = false; renderRoom(true);
      confirmBox("대화방을 나갈까요?", "나가면 대화 내용이 모두 지워지고 되돌릴 수 없어요.", "나가기", true, function () {
        S.convs = S.convs.filter(function (x) { return x.id !== c.id; });
        save();
        history.replaceState(null, "", location.pathname + location.search);
        closeRoom();
        toast("대화방을 나갔어요");
      });
      return;
    }
    var r = e.target.closest("[data-retry]"), d = e.target.closest("[data-del]");
    if (r) { var m = c.msgs.splice(+r.getAttribute("data-retry"), 1)[0]; m.fail = false; m.t = Date.now(); c.msgs.push(m); save(); renderList(); renderRoom(); reply(c); return; }
    if (d) { c.msgs.splice(+d.getAttribute("data-del"), 1); save(); renderList(); renderRoom(true); return; }
    if (ui.menu && !e.target.closest(".talk-menu")) { ui.menu = false; renderRoom(true); }
  });
  roomEl.addEventListener("input", function (e) {
    if (e.target.tagName !== "TEXTAREA") return;
    fit(e.target);
    $(".talk-send", roomEl).disabled = !e.target.value.trim();
  });
  roomEl.addEventListener("keydown", function (e) {
    if (e.target.tagName === "TEXTAREA" && e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); $("[data-form]", roomEl).requestSubmit(); }
  });
  roomEl.addEventListener("submit", function (e) {
    e.preventDefault();
    var c = conv(ui.open), ta = $("textarea", roomEl), v = ta.value.trim();
    if (!c || !v || c.blocked) return;
    ta.value = "";
    send(c, v);
    var nt = $("textarea", roomEl); if (nt) nt.focus();
  });
  document.addEventListener("click", function (e) {
    if (ui.menu && !e.target.closest(".talk-menu") && !e.target.closest("[data-more]")) { ui.menu = false; renderRoom(true); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || document.querySelector(".talk-modal")) return;
    if (ui.menu) { ui.menu = false; renderRoom(true); }
    else if (ui.open && mobile.matches) closeRoom();
  });

  /* 해시 — #c=<아이디> 면 그 대화방, 아니면 목록 (모바일 뒤로 가기) */
  function fromHash() {
    var m = location.hash.match(/^#c=(.+)$/);
    if (m && conv(decodeURIComponent(m[1]))) { if (ui.open !== decodeURIComponent(m[1])) open(decodeURIComponent(m[1]), false); }
    else if (ui.open && mobile.matches) { ui.pushed = false; closeRoom(); }
  }
  window.addEventListener("hashchange", fromHash);
  window.addEventListener("popstate", fromHash);

  /* 다른 탭에서 바뀐 대화 */
  window.addEventListener("storage", function (e) {
    if (e.key !== KEY) return;
    try { var n = JSON.parse(e.newValue); if (n && n.v === 1) { S = n; renderList(); renderRoom(true); } } catch (x) {}
  });
  /* 로그인 상태 바뀜 */
  new MutationObserver(function () { renderList(); renderRoom(); }).observe(html, { attributes: true, attributeFilter: ["data-auth"] });
  /* PC ↔ 모바일 */
  mobile.addEventListener("change", function () { renderRoom(true); });
  /* 목록 시간 표시 1분마다 */
  setInterval(function () { if (ui.tab === "msg") renderList(); }, MIN);

  /* ---------- 시작 ---------- */
  var qs = new URLSearchParams(location.search);
  var to = qs.get("to");
  if (to && !conv(to)) {
    /* 방송인 팝오버 "채팅톡하기" — 이름(n) · 사진(av)으로 옴. 같은 이름 대화가 있으면 그 방, 없으면 새 방 */
    var byName = S.convs.filter(function (c) { return c.n === (qs.get("n") || to); })[0];
    var known = { funsangsa: ["펀상사", "assets/v2/station/profile.jpg", "creator", true] }[to];
    if (byName) to = byName.id;
    else if (known) { S.convs.push({ id: to, n: known[0], av: known[1], role: known[2], live: known[3], mute: false, blocked: false, unread: 0, msgs: [] }); save(); }
    else if (qs.get("n")) { S.convs.push({ id: to, n: qs.get("n"), av: qs.get("av") || "assets/imgAccountCircle.svg", role: "creator", live: false, mute: false, blocked: window.FunBlock ? FunBlock.has(qs.get("n")) : false, unread: 0, msgs: [] }); save(); }
  }
  renderList();
  var startId = to && conv(to) ? to : (location.hash.match(/^#c=(.+)$/) || [])[1];
  if (startId && conv(decodeURIComponent(startId))) open(decodeURIComponent(startId), false);
  else renderRoom(); /* PC 도 처음엔 빈 대화방(참고 시안처럼 "대화를 선택하면…") — 첫 대화를 자동으로 열면 안 읽음이 바로 사라져서 */
})();
