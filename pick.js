/* 고르기 모드 — 화면에서 고칠 곳을 눌러 "위치 이름"을 복사하는 작업용 도구.
   켜기 · 끄기: Shift 두 번 또는 Option(Alt) + Shift + P (app.js) · 주소 끝 ?pick=1 / ?pick=0 · 아래 막대의 "끄기"
   켜 두면 같은 탭에서 다른 페이지로 가도 계속 켜져 있음(sessionStorage).
   일반 사용자 화면에는 아무것도 보이지 않는다. */
(function () {
  "use strict";
  var KEY = "funnation-pick";
  var q = location.search + location.hash;
  try {
    if (/[?&#]pick=0\b/.test(q)) { sessionStorage.removeItem(KEY); return; }
    if (/[?&#]pick(=1)?\b/.test(q)) sessionStorage.setItem(KEY, "1");
    if (sessionStorage.getItem(KEY) !== "1") return;
  } catch (e) { if (!/[?&#]pick(=1)?\b/.test(q)) return; }

  var PAGE = {
    "index.html": "홈", "": "홈", "station.html": "내 방송국", "creators.html": "크리에이터 찾기",
    "fun-watch.html": "펀네이션 영상 상세", "fun-live.html": "펀네이션 라이브", "live.html": "라이브",
    "watch.html": "영상 상세", "favorites.html": "팔로우", "profile.html": "내 정보",
    "settings.html": "설정", "wallet.html": "지갑", "events.html": "이벤트", "about.html": "소개",
    "terms.html": "약관", "404.html": "404"
  };
  /* 자주 쓰는 클래스의 우리말 이름 (없으면 클래스 이름 그대로) */
  var NAME = {
    gnb: "GNB(맨 위 메뉴줄)", lnb: "LNB(왼쪽 메뉴)", gside: "LNB(왼쪽 메뉴)", footer: "푸터",
    "crew-card": "크루원 카드", "crew-card__av": "사진", "crew-card__name": "이름", "crew-card__sns": "SNS 아이콘",
    "crew-card__bar": "아래 버튼 줄", "crew-card__live": "LIVE 라벨", "creator-grid": "카드 목록",
    "crew-grid": "카드 목록", modal: "팝업", popover: "팝오버", toast: "토스트", banner: "배너",
    pfring: "프로필 테두리", avring: "프로필 테두리", av: "사진", tabs: "탭",
    /* 펀네이션 영상 상세 (fun-watch, 2026-11-23) */
    "lw-top": "상단 바", "lw-player": "플레이어", "lw-ctl": "플레이어 컨트롤", "lw-info": "방송 정보",
    "lw-info__title": "방송 제목", "lw-streamer": "방송인", "lw-info__actions": "팔로우 · 후원 버튼 줄",
    "lw-chat": "채팅", "lw-chat__head": "채팅 머리", "lw-rankbar": "후원 순위 줄", "lw-rankpop": "후원 랭킹 팝업",
    "lw-pin": "고정 영역", "lw-chat__list": "채팅 목록", "lw-msg": "채팅 메시지", "lw-dono": "후원 카드",
    "lw-input": "채팅 입력칸", "lw-dock": "아래 막대", "lw-donate": "후원 패널", "lw-settings": "채팅 설정",
    "lw-user": "유저 카드", "lw-people__pop": "참여자 목록", "lw-newmsg": "새 메시지 미리보기"
  };

  var css = document.createElement("style");
  css.textContent =
    "#pk-box{position:fixed;z-index:2147483646;pointer-events:none;outline:2px solid #ff4fd8;background:rgba(255,79,216,.12);border-radius:2px;transition:all .06s}" +
    "#pk-box.lock{outline-color:#3cf08a;background:rgba(60,240,138,.14)}" +
    "#pk-tip{position:fixed;z-index:2147483647;pointer-events:none;max-width:min(420px,90vw);padding:4px 8px;border-radius:4px;background:#ff4fd8;color:#000;font:600 12px/1.4 Pretendard,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    "#pk-tip.lock{background:#3cf08a}" +
    "#pk-bar{position:fixed;z-index:2147483647;left:50%;bottom:12px;transform:translateX(-50%);display:flex;gap:6px;align-items:center;padding:6px 8px;border-radius:10px;background:#000;color:#fff;border:1px solid #ff4fd8;font:500 12px/1.3 Pretendard,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.5);max-width:calc(100vw - 16px)}" +
    "#pk-bar b{color:#ff4fd8;white-space:nowrap}#pk-bar span{opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}" +
    "#pk-bar button{all:unset;cursor:pointer;padding:5px 9px;border-radius:6px;background:#222;color:#fff;white-space:nowrap}" +
    "#pk-bar button:hover{background:#444}#pk-bar button[aria-pressed=true]{background:#ff4fd8;color:#000}";
  document.head.appendChild(css);

  var box = document.createElement("div"); box.id = "pk-box";
  var tip = document.createElement("div"); tip.id = "pk-tip";
  var bar = document.createElement("div"); bar.id = "pk-bar";
  bar.innerHTML = '<b>고르기</b><span id="pk-msg">고칠 곳을 누르세요</span>' +
    '<button type="button" data-pk="up" title="키보드 ↑">넓게</button>' +
    '<button type="button" data-pk="down" title="키보드 ↓">좁게</button>' +
    '<button type="button" data-pk="pause" aria-pressed="false" title="잠깐 멈추고 평소처럼 누르기">멈춤</button>' +
    '<button type="button" data-pk="off" title="Shift 두 번 또는 Option + Shift + P">끄기</button>';
  function mount() { document.body.append(box, tip, bar); hide(); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);

  var msg = function (t) { var m = document.getElementById("pk-msg"); if (m) m.textContent = t; };
  var paused = false, cur = null, locked = null, trail = [];

  function mine(el) { return el && el.closest && el.closest("#pk-bar,#pk-box,#pk-tip"); }
  function hide() { box.style.display = tip.style.display = "none"; }

  function classes(el) {
    return [].filter.call(el.classList || [], function (c) { return !/^(is-|on$|active$|open$|show$|lock$)/.test(c); });
  }
  function part(el) {
    if (el.id) return "#" + el.id;
    var c = classes(el);
    return el.tagName.toLowerCase() + (c.length ? "." + c.slice(0, 2).join(".") : "");
  }
  function korean(el) {
    var c = classes(el);
    for (var i = 0; i < c.length; i++) if (NAME[c[i]]) return NAME[c[i]];
    return "";
  }
  function words(el) {
    var t = el.getAttribute("aria-label") || el.getAttribute("alt") || el.getAttribute("title") ||
      (el.innerText || el.textContent || "");
    t = t.replace(/\s+/g, " ").trim();
    return t.length > 30 ? t.slice(0, 30) + "…" : t;
  }
  /* 아이디나 클래스가 있는 조상만 골라 최대 4단계 */
  function path(el) {
    var out = [], n = el;
    while (n && n !== document.body && out.length < 4) {
      if (n.id || classes(n).length) out.unshift(n);
      n = n.parentElement;
    }
    if (!out.length || out[out.length - 1] !== el) out.push(el);
    return out;
  }
  function nth(el) {
    var p = el.parentElement; if (!p) return "";
    var same = [].filter.call(p.children, function (k) { return k.tagName === el.tagName && k.className === el.className; });
    return same.length > 1 ? " (" + (same.indexOf(el) + 1) + "번째 / " + same.length + "개 중)" : "";
  }
  function label(el) {
    var ko = path(el).map(korean).filter(Boolean);
    var p = path(el).map(part).slice(-2).join(" › ");
    return (ko.length ? ko.join(" › ") + " · " : "") + p;
  }
  function report(el) {
    var w = innerWidth, dev = w < 768 ? "모바일" : "PC";
    var file = location.pathname.split("/").pop();
    var p = path(el), ko = p.map(korean).filter(Boolean), r = el.getBoundingClientRect();
    var lines = [
      "[고르기] " + (PAGE[file] || file) + " · " + dev + "(" + w + ")" + (location.hash && !/pick/.test(location.hash) ? " · " + location.hash : ""),
      ko.length ? "이름: " + ko.join(" › ") : "",
      "위치: " + p.map(part).join(" › ") + nth(el),
      words(el) ? '글자: "' + words(el) + '"' : "",
      "크기: " + Math.round(r.width) + "×" + Math.round(r.height)
    ];
    return lines.filter(Boolean).join("\n");
  }
  function show(el, lock) {
    if (!el || el === document.documentElement || el === document.body) return hide();
    var r = el.getBoundingClientRect();
    box.style.cssText = "display:block;left:" + r.left + "px;top:" + r.top + "px;width:" + r.width + "px;height:" + r.height + "px";
    box.className = tip.className = lock ? "lock" : "";
    tip.textContent = label(el);
    tip.style.display = "block";
    var ty = r.top - 24 < 0 ? r.bottom + 4 : r.top - 24;
    tip.style.left = Math.max(4, Math.min(r.left, innerWidth - tip.offsetWidth - 4)) + "px";
    tip.style.top = ty + "px";
  }
  function copy(text) {
    function fallback() {
      var ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (e) {}
      ta.remove();
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).catch(fallback); else fallback();
    console.log(text);
  }
  window.pickReport = report;
  function pick(el) {
    locked = el; show(el, true); copy(report(el));
    msg("복사됨 — 채팅창에 붙여넣기 하세요 (" + label(el) + ")");
  }

  document.addEventListener("mouseover", function (e) {
    if (paused || locked || mine(e.target)) return;
    cur = e.target; trail = []; show(cur, false);
  }, true);
  document.addEventListener("mouseleave", function () { if (!locked) hide(); });
  ["pointerdown", "mousedown", "mouseup", "touchstart", "touchend", "submit"].forEach(function (t) {
    document.addEventListener(t, function (e) {
      if (paused || mine(e.target)) return;
      e.preventDefault(); e.stopPropagation();
    }, { capture: true, passive: false });
  });
  document.addEventListener("click", function (e) {
    if (mine(e.target)) {
      var b = e.target.closest("[data-pk]"); if (!b) return;
      e.preventDefault(); e.stopPropagation();
      var a = b.getAttribute("data-pk");
      if (a === "up") widen(); else if (a === "down") narrow();
      else if (a === "pause") {
        paused = !paused; b.setAttribute("aria-pressed", paused); locked = null; hide();
        msg(paused ? "멈춤 — 평소처럼 눌러 화면을 옮기세요" : "고칠 곳을 누르세요");
      } else if (a === "off") {
        try { sessionStorage.removeItem(KEY); } catch (er) {}
        location.href = location.href.replace(/([?&])pick(=1)?(&|$)/, "$1").replace(/[?&]$/, "").replace(/#pick(=1)?$/, "");
      }
      return;
    }
    if (paused) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    if (locked && locked !== e.target) { locked = null; }
    trail = []; pick(e.target);
  }, true);

  function widen() {
    var el = locked || cur; if (!el || !el.parentElement || el.parentElement === document.body) return;
    trail.push(el); pick(el.parentElement);
  }
  function narrow() {
    var el = locked || cur; if (!el) return;
    var next = trail.pop() || el.firstElementChild; if (next) pick(next);
  }
  document.addEventListener("keydown", function (e) {
    if (paused) return;
    if (e.key === "ArrowUp") { e.preventDefault(); widen(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); narrow(); }
    else if (e.key === "Escape") { locked = null; hide(); msg("고칠 곳을 누르세요"); }
  }, true);
  addEventListener("scroll", function () { if (locked) show(locked, true); else hide(); }, true);
  addEventListener("resize", function () { if (locked) show(locked, true); });
})();
