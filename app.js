/* FUNNATION 공용 스크립트 — index.html(홈) · live.html(라이브 방송) 에서 함께 사용 */
(function () {
  var KEY = "funnation-theme";
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    btn.setAttribute("aria-checked", theme === "light" ? "true" : "false");
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  // ?theme=light / ?theme=dark 로 강제 지정 가능 (공유·검수용)
  var forced = new URLSearchParams(location.search).get("theme");
  apply(forced === "light" || forced === "dark" ? forced
        : saved === "light" ? "light" : "dark");

  btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    try { localStorage.setItem(KEY, next); } catch (e) {}
    // 지원 브라우저에선 이전·다음 화면을 교차 페이드 (그라디언트 배경·아이콘 교체까지 부드럽게)
    if (document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.startViewTransition(function () { apply(next); });
    } else {
      apply(next);
    }
  });
})();

/* LNB 열기 / 접기 — GNB 햄버거 버튼
   데스크톱: 펼침(full) ↔ 아이콘 레일(mini), 선택 저장
   모바일(767px 이하): 좌측 드로어 열기 ↔ 닫기, 저장하지 않음
   자동 접힘(768~1439px): [구현 제안 · Figma 미확정] 기본을 접힘(mini)으로 — 1440 Figma 기준 화면은 펼침 유지 */
(function () {
  var KEY = "funnation-lnb";
  var root = document.documentElement;
  var btn = document.getElementById("lnb-toggle");
  var btnMo = document.getElementById("lnb-toggle-mo");
  var backdrop = document.getElementById("lnb-backdrop");
  var mobile = matchMedia("(max-width: 767px)");
  // [구현 제안] LNB 자동 접힘 구간 — Figma 에서 확정된 breakpoint 아님.
  // 1440(Desktop 시안)과 모바일(767 이하)에 영향이 없는 최소 범위로만 잡음
  var autoMini = matchMedia("(min-width: 768px) and (max-width: 1439px)");

  // 접힌 상태에선 라벨이 숨으므로 툴팁으로 메뉴 이름 노출
  var items = document.querySelectorAll(".lnb__item, .creator");
  for (var k = 0; k < items.length; k++) {
    var label = items[k].querySelector(".creator__name") || items[k];
    var badge = label.querySelector(".lnb__beta"); // BETA 배지는 툴팁에서 뺌
    items[k].title = label.textContent.replace(badge ? badge.textContent : "", "").trim();
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  // ?lnb=mini / ?lnb=full 로 강제 지정 가능 (공유·검수용)
  var forced = new URLSearchParams(location.search).get("lnb");
  var desktopState = forced === "mini" || forced === "full" ? forced
                   : saved === "mini" ? "mini" : "full";
  var drawerOpen = false;
  // 자동 접힘 구간에서 버튼(또는 ?lnb=)으로 바꾼 상태 — 저장하지 않고, 구간을 벗어나면 초기화
  var autoState = forced === "mini" || forced === "full" ? forced : null;
  function currentDesktopState() {
    return autoMini.matches ? autoState || "mini" : desktopState;
  }
  // 영상 상세(watch.html · fun-watch.html) · PC 정책안내(terms.html) · PC 서비스 소개(about.html)는 LNB 를 숨겨 두고 햄버거로 본문 위에 겹쳐 엶 (펼침/접힘 저장과 무관)
  var page = root.getAttribute("data-page");
  function overlay() {
    return page === "watch" || ((page === "fun-watch" || page === "terms" || page === "about") && !mobile.matches);
  }

  function render() {
    if (overlay()) {
      // 펀네이션 라이브 상세(66132:100915)는 닫혀 있을 때 접힌 LNB 70 을 보여줌
      root.setAttribute("data-lnb", page === "fun-watch" && !drawerOpen ? "mini" : "full");
      root.setAttribute("data-drawer", drawerOpen ? "open" : "closed");
      btn.setAttribute("aria-expanded", drawerOpen ? "true" : "false");
      btn.setAttribute("aria-label", drawerOpen ? "메뉴 닫기" : "메뉴 열기");
      return;
    }
    if (mobile.matches) {
      // 모바일 드로어는 항상 펼친 LNB 를 보여준다
      root.setAttribute("data-lnb", "full");
      root.setAttribute("data-drawer", drawerOpen ? "open" : "closed");
      btnMo.setAttribute("aria-expanded", drawerOpen ? "true" : "false");
      btnMo.setAttribute("aria-label", drawerOpen ? "메뉴 닫기" : "메뉴 열기");
    } else {
      drawerOpen = false;
      root.removeAttribute("data-drawer");
      var state = currentDesktopState();
      root.setAttribute("data-lnb", state);
      btn.setAttribute("aria-expanded", state === "full" ? "true" : "false");
      btn.setAttribute("aria-label", state === "full" ? "메뉴 접기" : "메뉴 펼치기");
    }
  }

  // 데스크톱 펼침 ↔ 접힘 — 클릭으로 바꿀 때만 트랜지션 (첫 로드·화면 폭 변경 땐 바로 적용)
  var lnb = document.getElementById("lnb");
  var reduced = matchMedia("(prefers-reduced-motion: reduce)");
  function endAnim(e) {
    if (e && (e.target !== lnb || e.propertyName !== "width")) return;
    root.removeAttribute("data-lnb-anim");
  }
  lnb.addEventListener("transitionend", endAnim);
  lnb.addEventListener("transitioncancel", endAnim);

  btn.addEventListener("click", function () {
    if (overlay()) {
      drawerOpen = !drawerOpen;
      render();
      return;
    }
    if (autoMini.matches) {
      // 자동 접힘 구간에서는 이번 화면에서만 바꾸고 저장하지 않음 (넓은 화면의 선택을 덮어쓰지 않게)
      autoState = currentDesktopState() === "mini" ? "full" : "mini";
    } else {
      desktopState = desktopState === "mini" ? "full" : "mini";
      try { localStorage.setItem(KEY, desktopState); } catch (e) {}
    }
    if (!reduced.matches) {
      // 연달아 누르면 내용 페이드를 처음부터 다시 재생
      root.removeAttribute("data-lnb-anim");
      void lnb.offsetWidth;
      root.setAttribute("data-lnb-anim", "");
    }
    render();
  });
  // 모바일 헤더 우측 메뉴 버튼 — 드로어 열기/닫기
  btnMo.addEventListener("click", function () {
    drawerOpen = !drawerOpen;
    render();
  });
  function close() {
    if (!drawerOpen) return;
    drawerOpen = false;
    render();
  }
  backdrop.addEventListener("click", close);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
  mobile.addEventListener("change", render);
  autoMini.addEventListener("change", function () {
    autoState = null;
    render();
  });
  render();
})();

/* 로그인 / 로그아웃 상태 */
(function () {
  var KEY = "funnation-auth";
  var root = document.documentElement;

  function apply(state) {
    root.setAttribute("data-auth", state);
    try { localStorage.setItem(KEY, state); } catch (e) {}
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  var forced = new URLSearchParams(location.search).get("auth");
  root.setAttribute("data-auth",
    forced === "out" || forced === "in" ? forced : saved === "out" ? "out" : "in");

  // 플로팅 버튼 — 현재 상태의 반대로 전환
  document.getElementById("auth-btn").addEventListener("click", function () {
    var next = root.getAttribute("data-auth") === "out" ? "in" : "out";
    apply(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* 로그인 화면 — 주소 #login 일 때 본문 대신 로그인 폼을 보여준다.
     PC: 상단 로그인 버튼 / 모바일: 하단 내비 사람 아이콘(로그아웃 상태) */
  // 섹션 id 를 "login" 으로 두면 #login 앵커 스크롤이 .page 를 밀어 GNB 가 잘린다
  var view = document.getElementById("login-view");
  var form = document.getElementById("login-form");
  var moTitle = document.getElementById("mo-title");
  // 홈 앱바 제목은 로고 이미지라 innerHTML 로 보관했다가 되돌린다 (검색·알림 화면도 같은 값을 씀)
  var pageTitle = moTitle.innerHTML;
  moTitle.setAttribute("data-page-title", pageTitle);
  var pushed = false;

  function render() {
    var open = location.hash === "#login" && root.getAttribute("data-auth") === "out";
    var was = root.getAttribute("data-view") === "login";
    view.hidden = !open;
    // 검색·알림 화면이 쓰는 data-view·앱바 제목은 건드리지 않음 — 로그인 화면이 열려 있던 경우만 되돌림
    if (open) {
      root.setAttribute("data-view", "login");
      moTitle.textContent = "로그인";
    } else if (was) {
      root.removeAttribute("data-view");
      moTitle.innerHTML = pageTitle;
    }
    // 하단 내비 선택 표시("내 정보")는 아래 하단 내비 내 정보 코드가 data-view 를 보고 맞춤
    form.classList.remove("is-error");
  }
  function openLogin() {
    if (location.hash !== "#login") {
      location.hash = "login";
      pushed = true;
    }
    render();
    window.scrollTo(0, 0);
    form.elements.id.focus({ preventScroll: true });
  }
  function closeLogin() {
    if (location.hash !== "#login") return;
    if (pushed) {
      pushed = false;
      history.back();
    } else {
      history.replaceState(null, "", location.pathname + location.search);
      render();
    }
  }
  function signIn() {
    apply("in");
    closeLogin();
    render();
  }

  document.getElementById("login-btn").addEventListener("click", openLogin);
  // 하단 내비 "내 정보" — 로그아웃이면 로그인 화면, 로그인 상태면 프로필·등급이 있는 메뉴 드로어
  document.getElementById("bn-account").addEventListener("click", function (e) {
    e.preventDefault();
    if (root.getAttribute("data-auth") === "out") openLogin();
    // 로그인 상태 — 내 정보 페이지로 (이미 내 정보면 그대로)
    else if (!document.querySelector(".page--profile")) location.href = "profile.html";
  });
  var backs = document.querySelectorAll("[data-login-back]");
  for (var b = 0; b < backs.length; b++) {
    backs[b].addEventListener("click", function (e) {
      // 로그인 화면이면 로그인만 닫는다. 아니면 라이브 방송은 홈 링크, 홈은 브라우저 뒤로 가기
      // 회원가입 화면은 회원가입 스크립트가 단계별로 처리
      if (root.getAttribute("data-view") === "signup") return;
      if (root.getAttribute("data-view") === "login") {
        e.preventDefault();
        closeLogin();
      } else if (this.hasAttribute("data-history-back") && history.length > 1) {
        history.back();
      }
    });
  }
  window.addEventListener("hashchange", function () {
    if (location.hash !== "#login") pushed = false;
    render();
    if (!view.hidden) window.scrollTo(0, 0);
  });

  // 서버 연동 전 데모 — 아이디만 있으면 비밀번호와 상관없이 로그인
  // (틀린 비밀번호 화면 64316:166222 의 is-error 스타일은 서버 연동 때 쓰도록 남겨 둠)
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var id = form.elements.id;
    if (!id.value.trim()) { id.focus(); return; }
    form.elements.password.removeAttribute("aria-invalid");
    form.reset();
    signIn();
  });
  // 입력칸 오른쪽 버튼 — 값이 있을 때만 지우기, 비밀번호 보기 토글. 누르는 동안 입력칸 포커스 유지
  var fields = form.querySelectorAll(".field");
  for (var f = 0; f < fields.length; f++) (function (field) {
    var input = field.querySelector(".field__input");
    var clear = field.querySelector(".field__clear");
    var reveal = field.querySelector(".field__reveal");
    function sync() {
      if (clear) clear.classList.toggle("has-value", !!input.value);
    }
    input.addEventListener("input", sync);
    form.addEventListener("reset", function () {
      setTimeout(sync);
      if (reveal) {
        input.type = "password";
        reveal.setAttribute("aria-pressed", "false");
        reveal.setAttribute("aria-label", "비밀번호 보기");
      }
    });
    field.addEventListener("mousedown", function (e) {
      if (e.target.closest(".field__action")) e.preventDefault();
    });
    if (clear) clear.addEventListener("click", function () {
      input.value = "";
      sync();
      input.focus();
    });
    if (reveal) reveal.addEventListener("click", function () {
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      reveal.setAttribute("aria-pressed", show ? "true" : "false");
      reveal.setAttribute("aria-label", show ? "비밀번호 숨기기" : "비밀번호 보기");
      input.focus();
    });
    sync();
  })(fields[f]);

  form.elements.password.addEventListener("input", function () {
    form.classList.remove("is-error");
    this.removeAttribute("aria-invalid");
  });
  var sns = form.querySelectorAll("[data-sns]");
  for (var n = 0; n < sns.length; n++) sns[n].addEventListener("click", signIn);

  // 플로팅 버튼 등으로 로그인 상태가 바뀌면 로그인 화면도 다시 판단
  new MutationObserver(render).observe(root, { attributes: true, attributeFilter: ["data-auth"] });
  render();
  if (!view.hidden) window.scrollTo(0, 0);
})();

/* 검색(64162:201098)·알림(64162:200698) 화면 — 모바일 시안. 로그인 화면처럼 주소 #search · #notice 로 열고
   앱바 왼쪽 뒤로(검색)·닫기(알림) 버튼이나 브라우저 뒤로 가기로 닫는다 */
(function () {
  var root = document.documentElement;
  var VIEWS = { search: "검색", notice: "알림" };
  var moTitle = document.getElementById("mo-title");
  var pageTitle = moTitle.getAttribute("data-page-title");
  var pushed = false;

  function current() {
    var name = location.hash.slice(1);
    return VIEWS.hasOwnProperty(name) ? name : null;
  }
  function render() {
    var name = current();
    var was = root.getAttribute("data-view");
    for (var key in VIEWS) document.getElementById(key + "-view").hidden = key !== name;
    if (name) {
      root.setAttribute("data-view", name);
      moTitle.textContent = VIEWS[name];
    } else if (VIEWS.hasOwnProperty(was)) {
      root.removeAttribute("data-view");
      moTitle.innerHTML = pageTitle;
    }
  }
  function open(name) {
    if (location.hash !== "#" + name) {
      // 검색 → 알림처럼 화면끼리 옮길 때는 기록을 쌓지 않아 닫기 한 번에 본문으로 돌아감
      if (current()) history.replaceState(null, "", "#" + name);
      else { location.hash = name; pushed = true; }
    }
    render();
    window.scrollTo(0, 0);
  }
  function close() {
    if (!current()) return;
    if (pushed) {
      pushed = false;
      history.back();
    } else {
      history.replaceState(null, "", location.pathname + location.search);
      render();
    }
  }

  var search = document.querySelector(".mo-appbar__search");
  if (search) search.addEventListener("click", function () {
    open("search");
    document.querySelector("#search-form input").focus({ preventScroll: true });
  });
  var bells = document.querySelectorAll(".mo-appbar__bell, .mo-appbar__home-bell");
  for (var i = 0; i < bells.length; i++) bells[i].addEventListener("click", function () { open("notice"); });
  var closes = document.querySelectorAll("[data-subview-close]");
  for (var c = 0; c < closes.length; c++) closes[c].addEventListener("click", close);
  window.addEventListener("hashchange", function () {
    if (!current()) pushed = false;
    render();
  });

  // 최근 검색어 — 서버 연동 전 데모: 검색하면 맨 위에 추가, X 로 하나씩 / 전체삭제로 모두 지움 (저장 안 함)
  var form = document.getElementById("search-form");
  var list = document.getElementById("recent-list");
  var template = list.firstElementChild.cloneNode(true);
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = form.elements.q.value.trim();
    if (!q) return;
    var items = list.querySelectorAll("a > span:last-child");
    for (var k = 0; k < items.length; k++) {
      if (items[k].textContent === q) list.removeChild(items[k].closest("li"));
    }
    var li = template.cloneNode(true);
    li.querySelector("a > span:last-child").textContent = q;
    li.querySelector("[data-recent-remove]").setAttribute("aria-label", q + " 삭제");
    list.insertBefore(li, list.firstChild);
    form.reset();
  });
  // 지우기(reset) 뒤에도 바로 이어서 입력할 수 있게
  form.addEventListener("reset", function () {
    setTimeout(function () { form.elements.q.focus(); });
  });
  list.addEventListener("click", function (e) {
    var remove = e.target.closest("[data-recent-remove]");
    if (remove) list.removeChild(remove.closest("li"));
    else if (e.target.closest("a")) {
      e.preventDefault();
      form.elements.q.value = e.target.closest("a").textContent;
      form.elements.q.focus();
    }
  });
  document.querySelector("#search-view [data-recent-clear]").addEventListener("click", function () {
    list.innerHTML = "";
  });

  render();
})();

/* PC 상단 검색 (64299:162675) — 누르면 포커스 상태 + 최근 검색어 패널, 입력하면 지우기 버튼.
   바깥을 누르거나 Esc 로 닫는다. 최근 검색어는 모바일과 같은 데모 동작 (저장 안 함) */
(function () {
  var form = document.getElementById("nav-search");
  if (!form) return;
  var input = form.elements.q;
  var clear = form.querySelector(".nav-search__clear");
  var panel = form.querySelector(".nav-search__panel");
  var list = form.querySelector(".nav-search__list");
  var template = list.firstElementChild.cloneNode(true);
  var placeholder = input.placeholder;

  function sync() {
    clear.hidden = !input.value;
    panel.hidden = !list.children.length;
  }
  function open() {
    form.classList.add("is-open");
    input.placeholder = input.getAttribute("data-focus-placeholder");
  }
  function close() {
    form.classList.remove("is-open");
    input.placeholder = placeholder;
  }

  input.addEventListener("focus", open);
  input.addEventListener("input", sync);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { close(); input.blur(); }
  });
  // 패널·지우기 버튼을 눌러도 인풋 포커스(=열린 상태)가 유지되도록
  form.addEventListener("mousedown", function (e) {
    if (e.target !== input) e.preventDefault();
  });
  form.addEventListener("click", function (e) {
    if (e.target === form || e.target.closest(".nav-search__icon")) input.focus();
  });
  document.addEventListener("mousedown", function (e) {
    if (!form.contains(e.target)) close();
  });
  input.addEventListener("blur", function () {
    // 탭 키로 빠져나갈 때도 닫힘
    setTimeout(function () { if (!form.contains(document.activeElement)) close(); });
  });

  clear.addEventListener("click", function () {
    input.value = "";
    sync();
    input.focus();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q) return;
    var items = list.querySelectorAll("a > span:last-child");
    for (var k = 0; k < items.length; k++) {
      if (items[k].textContent === q) list.removeChild(items[k].closest("li"));
    }
    var li = template.cloneNode(true);
    li.querySelector("a > span:last-child").textContent = q;
    li.querySelector("[data-recent-remove]").setAttribute("aria-label", q + " 삭제");
    list.insertBefore(li, list.firstChild);
    input.value = "";
    sync();
  });
  list.addEventListener("click", function (e) {
    var remove = e.target.closest("[data-recent-remove]");
    if (remove) list.removeChild(remove.closest("li"));
    else if (e.target.closest("a")) {
      e.preventDefault();
      input.value = e.target.closest("a").textContent;
    }
    sync();
    input.focus();
  });
  form.querySelector("[data-recent-clear]").addEventListener("click", function () {
    list.innerHTML = "";
    sync();
    input.focus();
  });

  sync();
})();

/* 히어로 슬라이더 — 로그인 상태와 무관하게 순환 */
(function () {
  var hero = document.getElementById("hero");
  if (!hero) return; // 라이브 방송 페이지에는 히어로가 없음
  var slides = hero.querySelectorAll(".hero__slide");
  var i = 0, timer;

  // ?slide=N 으로 특정 슬라이드 고정 (공유·검수용)
  var forced = new URLSearchParams(location.search).get("slide");

  function go(n) {
    i = (n + slides.length) % slides.length;
    for (var k = 0; k < slides.length; k++) {
      slides[k].classList.toggle("is-active", k === i);
    }
  }
  function start() {
    stop();
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer = setInterval(function () { go(i + 1); }, 5000);
  }
  function stop() { clearInterval(timer); }

  hero.addEventListener("click", function (e) {
    var dot = e.target.closest("[data-slide]");
    var arrow = e.target.closest("[data-dir]");
    if (dot) go(Number(dot.dataset.slide));
    else if (arrow) go(i + Number(arrow.dataset.dir));
    else return;
    start();
  });
  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", start);

  if (forced !== null) {
    go(Number(forced));
  } else {
    start();
  }
})();

/* 추천 라이브 (66498:205419) — 로그인 상태 PC 에서 히어로 대신 보이는 플레이어 + 채팅.
   보일 때만 YouTube 를 불러오고, 로그아웃 · 모바일로 바뀌면 src 를 비워 소리 · 재생을 멈춤.
   자동 넘김 없음(영상 재생 중) — 점 · 화살표로만 바꿈.
   ytId: 데모로 영상 상세(watch.html)와 같은 라이브 ID 를 씀 — 실제 추천 라이브 ID 로 바꿔야 함 */
(function () {
  var root = document.documentElement;
  var box = document.getElementById("hero-live");
  if (!box) return;

  var YT_DEMO = "0sfDth4lMLc";
  var FEATURED = [
    { name: "YM상사", title: "YM상사 시즌7 7화 팀전", tags: ["엑셀", "팀플레이", "서바이벌"], viewers: "584", avatar: "assets/watch/v4/avatar-ymss.jpg", ytId: YT_DEMO },
    { name: "YC레이블", title: "YC레이블 21회차, 팀전대결!", tags: ["#인디", "팀플레이", "서바이벌"], viewers: "2,051", avatar: "assets/home/avatar/chatting.png", ytId: YT_DEMO },
    { name: "[앙엔터] 앙앙~진국 (Jinguk)", title: "[앙스티보이즈 17회차] 일반 회차", tags: ["#인디", "팀플레이", "서바이벌"], viewers: "2,051", avatar: "assets/home/avatar/lol.png", ytId: YT_DEMO },
    { name: "목격자K", title: "목격자K 나이트 워치", tags: ["#인디", "팀플레이", "서바이벌"], viewers: "857", avatar: "assets/home/avatar/default.svg", ytId: YT_DEMO },
    { name: "큰별TV", title: "🔴 WORLD CUP SEMIFINAL", tags: ["#버추얼", "관전", "스포츠"], viewers: "2,051", avatar: "assets/home/avatar/vtuber-white.png", ytId: YT_DEMO },
    { name: "리르", title: "NEW리르💙마크 그냥", tags: ["#게임", "마인크래프트", "NEW"], viewers: "857", avatar: "assets/home/avatar/vtuber-purple.png", ytId: YT_DEMO },
    { name: "침착맨 원본 박물관", title: "침펄풍 매력적인 악당 월드컵", tags: ["#LIVE", "#TALK"], viewers: "2,051", avatar: "assets/home/avatar/chim.png", ytId: YT_DEMO },
    { name: "우왁굳의 게임방송", title: "파산게임2 팀전 리턴즈", tags: ["#인디", "팀플레이", "서바이벌"], viewers: "2,051", avatar: "assets/home/avatar/bear.jpg", ytId: YT_DEMO },
    { name: "견자희의 게임방송", title: "파이널판타지 리버스 데모 플레이", tags: ["#LIVE", "플스5", "콘솔", "데모"], viewers: "20", avatar: "assets/home/avatar/vtuber-blue.png", ytId: YT_DEMO }
  ];

  var player = box.querySelector("[data-hl-player]");
  var chat = box.querySelector("[data-hl-chat]");
  var muteBtn = box.querySelector("[data-hl-mute]");
  var dotsWrap = box.querySelector("[data-hl-dots]");
  var host = location.hostname;
  var blocked = location.protocol === "file:" || !host; // 파일로 열면 YouTube 가 막음(오류 153)
  var i = 0;
  var muted = true;
  var loadedId = null;

  if (blocked) {
    player.hidden = true;
    chat.hidden = true;
    box.querySelector("[data-hl-player-off]").hidden = false;
    box.querySelector("[data-hl-chat-off]").hidden = false;
  }

  // 점 — 추천 수만큼
  var dots = FEATURED.map(function (_, n) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "hero-live__dot";
    b.setAttribute("aria-label", (n + 1) + "번 추천 라이브");
    b.addEventListener("click", function () { go(n); });
    dotsWrap.appendChild(b);
    return b;
  });

  function visible() {
    return getComputedStyle(box).display !== "none";
  }
  function chatSrc(id) {
    var dark = root.getAttribute("data-theme") !== "light";
    return "https://www.youtube.com/live_chat?v=" + id + "&embed_domain=" + encodeURIComponent(host) + (dark ? "&dark_theme=1" : "");
  }
  function command(func) {
    if (!player.contentWindow) return;
    player.contentWindow.postMessage(JSON.stringify({ event: "command", func: func, args: [] }), "*");
  }

  function render() {
    var f = FEATURED[i];
    box.querySelector("[data-hl-name]").textContent = f.name;
    box.querySelector("[data-hl-title]").textContent = f.title;
    box.querySelector("[data-hl-viewers]").textContent = f.viewers;
    box.querySelector("[data-hl-avatar]").src = f.avatar;
    var tags = box.querySelector("[data-hl-tags]");
    tags.textContent = "";
    f.tags.forEach(function (t) {
      var li = document.createElement("li");
      li.textContent = t;
      tags.appendChild(li);
    });
    for (var d = 0; d < dots.length; d++) {
      if (d === i) dots[d].setAttribute("aria-current", "true");
      else dots[d].removeAttribute("aria-current");
    }
    sync();
  }

  // 보일 때만 영상 · 채팅을 불러오고, 안 보이면 비움
  function sync() {
    if (blocked) return;
    var id = FEATURED[i].ytId;
    if (!visible()) {
      if (loadedId) {
        player.removeAttribute("src");
        chat.removeAttribute("src");
        loadedId = null;
      }
      return;
    }
    if (loadedId === id + ":" + i) return;
    loadedId = id + ":" + i;
    player.src = "https://www.youtube.com/embed/" + id + "?autoplay=1&mute=1&playsinline=1&enablejsapi=1&origin=" + encodeURIComponent(location.origin);
    chat.src = chatSrc(id);
  }

  // 새 영상을 불러온 뒤에도 소리를 켜 둔 상태면 다시 켬
  player.addEventListener("load", function () {
    if (!muted) setTimeout(function () { command("unMute"); }, 600);
  });

  function go(n) {
    i = (n + FEATURED.length) % FEATURED.length;
    render();
  }

  box.addEventListener("click", function (e) {
    var arrow = e.target.closest("[data-hl-dir]");
    if (arrow) go(i + Number(arrow.getAttribute("data-hl-dir")));
  });

  muteBtn.addEventListener("click", function () {
    muted = !muted;
    command(muted ? "mute" : "unMute");
    muteBtn.setAttribute("aria-pressed", muted ? "false" : "true");
    muteBtn.setAttribute("aria-label", muted ? "음소거 해제" : "음소거");
  });

  // 로그인 · 로그아웃, 화면 폭이 바뀌면 다시 확인 / 테마가 바뀌면 채팅을 같은 테마로
  new MutationObserver(function (list) {
    for (var m = 0; m < list.length; m++) {
      if (list[m].attributeName === "data-theme" && loadedId && !blocked) {
        var next = chatSrc(FEATURED[i].ytId);
        if (chat.src !== next) chat.src = next;
      }
    }
    sync();
  }).observe(root, { attributes: true, attributeFilter: ["data-auth", "data-theme", "data-view"] });
  matchMedia("(min-width: 768px)").addEventListener("change", sync);

  render();
})();

/* 히어로 배경 효과 — Predictive Arc (Originkit) 를 바닐라 WebGL 로 옮김.
   기본은 꺼 둠 — ?fx=on 일 때만 켬. WebGL 이 없거나 셰이더가 실패하면 캔버스만 숨기고 기존 배너 그대로 */
(function () {
  var hero = document.getElementById("hero");
  if (!hero) return;
  // 모바일(767px 이하)에서는 배경 효과를 켜지 않음 — WebGL 자체를 만들지 않아 성능 부담도 없앰
  if (matchMedia("(max-width: 767px)").matches) {
    hero.classList.add("hero--no-fx");
    return;
  }
  var canvases = hero.querySelectorAll(".hero__arc");
  if (new URLSearchParams(location.search).get("fx") !== "on") {
    hero.classList.add("hero--no-fx");
    return;
  }

  // 프리셋 (원본 __originkitPresetProps 를 셰이더 값으로 환산)
  var P = {
    bg: [0, 0, 0],                       // 화면 합성(screen)이라 검정 = 투명
    base: hex("#494FE7"),
    accent: hex("#A4A7F3"),
    high: hex("#494FE7"),
    density: 78,
    dotSize: 137 / 100,
    speed: 100 / 50,
    peak: 100 / 100,
    archHeight: 0 / 100,
    thickness: 206 / 100,
    falloff: 600 / 100,
    pointerRadius: 236,
    pointerStrength: 34 / 100
  };
  var MAX_DPR = 2;

  var VERT = "attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0.0,1.0);}";
  var FRAG = [
    "#ifdef GL_FRAGMENT_PRECISION_HIGH",
    "precision highp float;",
    "#else",
    "precision mediump float;",
    "#endif",
    "uniform vec2 uRes;",
    "uniform float uTime,uDpr,uCell,uDot;",
    "uniform float uPeak,uHeight,uThick,uFall;",
    "uniform vec3 uBg,uBase,uAccent,uHigh;",
    "uniform vec2 uMouse;",
    "uniform float uMouseRadius,uMouseStrength;",
    "void main(){",
    "  float cs=max(uCell,2.0);",
    "  vec2 ci=floor(gl_FragCoord.xy/cs);",
    "  vec2 cc=(ci+0.5)*cs;",
    "  float x=cc.x/uDpr;",
    "  float y=(uRes.y-cc.y)/uDpr;",
    "  float w=uRes.x/uDpr;",
    "  float h=uRes.y/uDpr;",
    "  float normX=(x-w*0.5)/(w*0.75);",
    "  float curveY=h*uPeak+normX*normX*(h*uHeight);",
    "  float mdx=x-uMouse.x;",
    "  float influence=uMouseStrength*exp(-(mdx*mdx)/(2.0*uMouseRadius*uMouseRadius+1.0));",
    "  curveY=mix(curveY,uMouse.y,influence);",
    "  float dist=abs(y-curveY);",
    "  float th=(140.0+(1.0-abs(normX))*80.0)*uThick;",
    "  vec3 col=uBg;",
    "  if(dist<th){",
    "    float i=1.0-dist/th;",
    "    float waveX=sin(x*0.015+uTime);",
    "    float waveY=cos(y*0.02+uTime);",
    "    i=i*0.7+waveX*waveY*0.3*i;",
    "    i*=max(0.0,1.0-pow(abs(normX),uFall));",
    "    if(i>0.02){",
    "      float side=uDot*i*uDpr;",
    "      vec2 d=abs(gl_FragCoord.xy-cc);",
    "      float cov=1.0-smoothstep(side*0.5-1.0,side*0.5+1.0,max(d.x,d.y));",
    "      vec3 ink=mix(uBase,uAccent,clamp(pow(i,1.1),0.0,1.0));",
    "      ink=mix(ink,uHigh,smoothstep(0.72,1.0,i));",
    "      col=mix(uBg,ink,cov*clamp(i*1.6,0.0,1.0));",
    "    }",
    "  }",
    "  gl_FragColor=vec4(col,1.0);",
    "}"
  ].join("\n");

  function hex(s) {
    return [1, 3, 5].map(function (k) { return parseInt(s.substr(k, 2), 16) / 255; });
  }

  function setup(canvas) {
    var gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false });
    if (!gl) return null;
    function compile(type, src) {
      var sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("PredictiveArc shader:", gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    }
    var vs = compile(gl.VERTEX_SHADER, VERT);
    var fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("PredictiveArc link:", gl.getProgramInfoLog(prog));
      return null;
    }
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    var locs = {};
    function u(name) {
      if (!(name in locs)) locs[name] = gl.getUniformLocation(prog, name);
      return locs[name];
    }
    gl.uniform3fv(u("uBg"), P.bg);
    gl.uniform3fv(u("uBase"), P.base);
    gl.uniform3fv(u("uAccent"), P.accent);
    gl.uniform3fv(u("uHigh"), P.high);
    gl.uniform1f(u("uPeak"), P.peak);
    gl.uniform1f(u("uHeight"), P.archHeight);
    gl.uniform1f(u("uThick"), P.thickness);
    gl.uniform1f(u("uFall"), P.falloff);
    gl.uniform1f(u("uMouseRadius"), P.pointerRadius);
    return { canvas: canvas, gl: gl, u: u };
  }

  var views = [];
  for (var k = 0; k < canvases.length; k++) {
    var v = setup(canvases[k]);
    if (v) views.push(v);
  }
  if (!views.length) {
    hero.classList.add("hero--no-fx");
    return;
  }

  // 포인터 — 원본은 y 를 아래 기준으로 넘겨 곡선이 커서 반대쪽으로 갔음. 셰이더와 같은 위 기준으로 맞춤
  var ps = { x: 0, y: 0, tx: 0, ty: 0, a: 0, ta: 0 };
  hero.addEventListener("pointermove", function (e) {
    var r = hero.getBoundingClientRect();
    ps.tx = e.clientX - r.left;
    ps.ty = e.clientY - r.top;
    ps.ta = 1;
  });
  hero.addEventListener("pointerleave", function () { ps.ta = 0; });
  hero.addEventListener("pointercancel", function () { ps.ta = 0; });

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var raf = 0, last = performance.now(), clock = 0, visible = true;

  function draw(view, dpr) {
    var gl = view.gl, u = view.u, c = view.canvas;
    var bw = Math.max(1, Math.round(c.clientWidth * dpr));
    var bh = Math.max(1, Math.round(c.clientHeight * dpr));
    if (c.width !== bw || c.height !== bh) {
      c.width = bw;
      c.height = bh;
    }
    gl.viewport(0, 0, bw, bh);
    var pitch = Math.min(bw, bh) / dpr / P.density;
    gl.uniform2f(u("uRes"), bw, bh);
    gl.uniform1f(u("uTime"), clock);
    gl.uniform1f(u("uDpr"), dpr);
    gl.uniform1f(u("uCell"), Math.max(2, pitch * dpr));
    gl.uniform1f(u("uDot"), pitch * 1.2 * P.dotSize);
    gl.uniform2f(u("uMouse"), ps.x, ps.y);
    gl.uniform1f(u("uMouseStrength"), P.pointerStrength * ps.a);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    clock = (clock + dt * 0.9 * P.speed) % 6283;
    var posLerp = Math.min(1, dt * 12), actLerp = Math.min(1, dt * 6);
    ps.x += (ps.tx - ps.x) * posLerp;
    ps.y += (ps.ty - ps.y) * posLerp;
    ps.a += (ps.ta - ps.a) * actLerp;
    var dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    for (var k = 0; k < views.length; k++) draw(views[k], dpr);
    raf = visible && !reduced ? requestAnimationFrame(frame) : 0;
  }

  // 화면 밖이거나 탭이 숨겨지면 멈춤
  function resume() {
    if (raf || !visible || reduced || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function pause() {
    cancelAnimationFrame(raf);
    raf = 0;
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      visible ? resume() : pause();
    }).observe(hero);
  }
  document.addEventListener("visibilitychange", function () {
    document.hidden ? pause() : resume();
  });
  // 움직임 줄이기 설정이면 정지된 한 프레임만
  if (reduced) {
    frame(performance.now());
    window.addEventListener("resize", function () { frame(performance.now()); });
  } else {
    resume();
  }
})();

/* 광고 배너 "오늘 그만 보기" — PC 상단 배너·모바일 프로모 배너 공용.
   시안 검수용이라 누르면 숨기기만 하고 저장하지 않음 → 새로고침하면 다시 나옴 */
(function () {
  try { localStorage.removeItem("funnation-ad-hidden"); } catch (e) {} // 예전 버전에서 저장한 기록 정리
  var btns = document.querySelectorAll("[data-ad-close]");
  for (var k = 0; k < btns.length; k++) {
    btns[k].addEventListener("click", function () {
      document.documentElement.setAttribute("data-ad", "hidden");
    });
  }
})();

/* 후원 컨텐츠 영상 카드 13장 (assets/donation/v2-NN.mp4) — 올림·포커스 중에만 영상 재생, 설명 문구는 글자마다 지연을 줘 차례로 떠오르게.
   영상 파일이 아직 없는 카드는 재생이 조용히 실패하고 정지 이미지 + 문구만 보임.
   글자 나누기는 흐르는 목록이 카드를 복제하기 전에 해 둠(복제본도 같은 구조) · 이벤트는 목록에 위임 */
(function () {
  var list = document.querySelector(".donation-list");
  if (!list) return;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var splits = list.querySelectorAll("[data-split]");
  for (var s = 0; s < splits.length; s++) {
    var el = splits[s];
    var text = el.textContent.trim();
    var n = 0;
    el.textContent = "";
    text.split(" ").forEach(function (word, wi) {
      if (wi) el.appendChild(document.createTextNode(" "));
      var w = document.createElement("span");
      w.className = "w";
      Array.prototype.forEach.call(word, function (ch) {
        var c = document.createElement("span");
        c.className = "c";
        c.style.setProperty("--i", n++);
        c.textContent = ch;
        w.appendChild(c);
      });
      el.appendChild(w);
    });
  }
  function activate(card, on) {
    if (card.classList.contains("is-active") === on) return;
    card.classList.toggle("is-active", on);
    var video = card.querySelector("video");
    clearTimeout(card._rewind);
    if (on) {
      if (!reduced.matches) {
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
      }
    } else {
      // 영상이 사라진 뒤(0.3초) 멈추고 처음으로
      card._rewind = setTimeout(function () {
        video.pause();
        video.currentTime = 0;
      }, 300);
    }
  }
  function cardOf(node) {
    return node && node.closest ? node.closest(".donation-card--video") : null;
  }
  list.addEventListener("mouseover", function (e) {
    var card = cardOf(e.target);
    if (card && !card.contains(e.relatedTarget)) activate(card, true);
  });
  list.addEventListener("mouseout", function (e) {
    var card = cardOf(e.target);
    if (card && !card.contains(e.relatedTarget)) activate(card, false);
  });
  list.addEventListener("focusin", function (e) {
    var card = cardOf(e.target);
    if (card) activate(card, true);
  });
  list.addEventListener("focusout", function (e) {
    var card = cardOf(e.target);
    if (card) activate(card, false);
  });
})();

/* 후원 컨텐츠 카드 — 폭이 좁아 가려지는 카드가 있을 때만 왼쪽으로 계속 흐름.
   카드를 한 벌 복제해 뒤에 붙이고, 한 벌만큼 지나가면 처음 위치로 되돌려 끊김 없이 반복.
   마우스 올림·터치·포커스 중엔 멈추고(손으로 넘기기 가능), 화면 밖·다른 탭·동작 줄이기 설정이면 움직이지 않음 */
(function () {
  var list = document.querySelector(".donation-list");
  if (!list) return;
  var SPEED = 30; // px/초
  var originals = Array.prototype.slice.call(list.children);
  var clones = [];
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var pos = 0, last = 0, raf = 0;
  var paused = false, visible = true, on = false;

  function overflowing() {
    var cs = getComputedStyle(list);
    var room = list.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    var first = originals[0], end = originals[originals.length - 1];
    return end.offsetLeft + end.offsetWidth - first.offsetLeft > room + 1;
  }
  // 복제본 첫 카드까지의 거리 = 한 벌 폭(카드 사이 간격 포함)
  function loopWidth() {
    return clones[0].offsetLeft - originals[0].offsetLeft;
  }
  function frame(t) {
    raf = 0;
    if (!running()) return;
    if (last) {
      pos += (t - last) / 1000 * SPEED;
      var w = loopWidth();
      if (pos >= w) pos -= w;
      list.scrollLeft = pos;
    }
    last = t;
    raf = requestAnimationFrame(frame);
  }
  function running() {
    return on && !paused && visible && !reduced.matches && !document.hidden;
  }
  function kick() {
    if (running() && !raf) {
      pos = list.scrollLeft; // 손으로 넘긴 위치에서 이어서
      last = 0;
      raf = requestAnimationFrame(frame);
    }
  }
  function update() {
    var need = overflowing();
    if (need && !on) {
      originals.forEach(function (li) {
        var c = li.cloneNode(true);
        c.setAttribute("aria-hidden", "true");
        if (c.hasAttribute("tabindex")) c.setAttribute("tabindex", "-1");
        list.appendChild(c);
        clones.push(c);
      });
      on = true;
      list.classList.add("is-marquee");
    } else if (!need && on) {
      clones.forEach(function (c) { c.remove(); });
      clones = [];
      on = false;
      list.classList.remove("is-marquee");
      list.scrollLeft = 0;
    }
    kick();
  }

  function pause() { paused = true; }
  function resume() { paused = false; kick(); }
  list.addEventListener("mouseenter", pause);
  list.addEventListener("mouseleave", resume);
  list.addEventListener("touchstart", pause, { passive: true });
  list.addEventListener("touchend", function () { setTimeout(resume, 1500); });
  list.addEventListener("focusin", pause);
  list.addEventListener("focusout", resume);
  // 손으로 넘기다 끝(복제본 구간)에 닿아도 이어지도록 한 벌 폭만큼 되감기
  list.addEventListener("scroll", function () {
    if (on && paused && list.scrollLeft >= loopWidth()) list.scrollLeft -= loopWidth();
  }, { passive: true });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      visible = es[0].isIntersecting;
      kick();
    }).observe(list);
  }
  document.addEventListener("visibilitychange", kick);
  if (reduced.addEventListener) reduced.addEventListener("change", kick);
  if ("ResizeObserver" in window) new ResizeObserver(update).observe(list);
  else window.addEventListener("resize", update);
  update();
})();

/* 카테고리 탭(칩) — 누른 탭으로 선택 표시만 옮김. 탭별 콘텐츠 전환은 추후 연동 */
(function () {
  var groups = document.querySelectorAll(".chips");
  for (var g = 0; g < groups.length; g++) {
    (function (group) {
      var buttons = group.querySelectorAll("button");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].setAttribute("aria-pressed", buttons[i].classList.contains("is-active") ? "true" : "false");
      }
      group.addEventListener("click", function (e) {
        var btn = e.target.closest("button");
        if (!btn || !group.contains(btn) || btn.classList.contains("is-active")) return;
        for (var j = 0; j < buttons.length; j++) {
          buttons[j].classList.remove("is-active");
          buttons[j].setAttribute("aria-pressed", "false");
        }
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
      });
    })(groups[g]);
  }
})();

/* 정렬 칩 (65771:60928) + 정렬 메뉴 (65771:60849) — 칩을 누르면 메뉴, 고르면 칩 글자만 바뀜. 실제 정렬은 추후 연동 */
(function () {
  var sorts = document.querySelectorAll("[data-sort]");
  for (var s = 0; s < sorts.length; s++) {
    (function (wrap) {
      var btn = wrap.querySelector(".sort__btn");
      var pop = wrap.querySelector(".sort__pop");
      var label = wrap.querySelector("[data-sort-label]");
      var items = pop.querySelectorAll(".sort__item");
      function close(focusBtn) {
        if (pop.hidden) return;
        pop.hidden = true;
        btn.setAttribute("aria-expanded", "false");
        if (focusBtn) btn.focus();
      }
      btn.addEventListener("click", function () {
        if (!pop.hidden) return close();
        pop.hidden = false;
        btn.setAttribute("aria-expanded", "true");
      });
      for (var i = 0; i < items.length; i++) {
        items[i].addEventListener("click", function () {
          for (var j = 0; j < items.length; j++) items[j].setAttribute("aria-checked", items[j] === this ? "true" : "false");
          label.textContent = this.textContent;
          close(true);
        });
      }
      document.addEventListener("click", function (e) {
        if (!wrap.contains(e.target)) close();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && !pop.hidden) close(true);
      });
    })(sorts[s]);
  }
})();

/* 크리에이터 카드 팔로우 하트 (65415:42570) — 누를 때마다 빈 하트 ↔ 채운 하트. 서버 연동 전이라 저장하지 않음 */
(function () {
  var btns = document.querySelectorAll("[data-follow]");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      var on = this.getAttribute("aria-pressed") !== "true";
      this.setAttribute("aria-pressed", on ? "true" : "false");
      this.querySelector("img").src = "assets/v2/creator/" + (on ? "heart-on.svg" : "heart.svg");
    });
  }
})();

/* 즐겨찾기 관리 (PC 팝업 66465:76167 · 모바일 목록 화면 66390:73796) — 제목 줄 "즐겨찾기 관리"로 엶.
   PC: 팝업(X · 바깥 · ESC 로 닫힘, 이름 검색). 모바일: 본문 대신 목록 화면(#manage), 앱바 뒤로 가기로 복귀.
   하트를 누르면 즐겨찾기 해제 표시만 바꿈 (서버 연동 전) */
(function () {
  var open = document.querySelector("[data-fav-manage]");
  var root = document.querySelector("[data-fav-view]");
  var modal = document.getElementById("fav-manage-modal");
  if (!open || !root || !modal) return;
  var view = root.querySelector(".fav-manage-view");
  var mobile = matchMedia("(max-width: 767px)");
  var search = modal.querySelector("[data-fav-search]");
  var empty = modal.querySelector("[data-fav-empty]");

  function setModal(on) {
    modal.hidden = !on;
    if (on) { search.value = ""; filter(""); search.focus(); }
    else open.focus();
  }
  function setView() {
    var on = location.hash === "#manage" && mobile.matches;
    root.setAttribute("data-fav-view", on ? "manage" : "main");
    view.hidden = !on;
    if (on) window.scrollTo(0, 0);
  }
  function filter(q) {
    var rows = modal.querySelectorAll(".fav-manage"), shown = 0;
    q = q.trim().toLowerCase();
    for (var i = 0; i < rows.length; i++) {
      var hit = !q || rows[i].querySelector(".fav-manage__name").textContent.toLowerCase().indexOf(q) > -1;
      rows[i].hidden = !hit;
      if (hit) shown++;
    }
    empty.hidden = shown > 0;
  }

  open.addEventListener("click", function () {
    if (mobile.matches) location.hash = "manage";
    else setModal(true);
  });
  modal.addEventListener("click", function (e) {
    if (e.target === modal || e.target.closest("[data-fav-close]")) setModal(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) setModal(false);
  });
  search.addEventListener("input", function () { filter(search.value); });
  document.addEventListener("click", function (e) {
    var heart = e.target.closest("[data-fav-heart]");
    if (!heart) return;
    var on = heart.getAttribute("aria-pressed") !== "true";
    heart.setAttribute("aria-pressed", on ? "true" : "false");
    var name = heart.closest(".fav-manage").querySelector(".fav-manage__name").textContent;
    heart.setAttribute("aria-label", name + (on ? " 즐겨찾기 해제" : " 즐겨찾기 다시 추가"));
  });
  // 모바일 목록 화면에서 앱바 뒤로 가기 → 즐겨찾기 본문으로
  document.addEventListener("click", function (e) {
    if (root.getAttribute("data-fav-view") !== "manage") return;
    if (e.target.closest(".mo-appbar [data-login-back]")) {
      e.preventDefault();
      e.stopImmediatePropagation();
      history.back();
    }
  }, true);
  window.addEventListener("hashchange", setView);
  mobile.addEventListener("change", function () {
    setView();
    if (mobile.matches && !modal.hidden) setModal(false);
  });
  setView();
})();

/* 크리에이터 찾기 모바일 2뎁스 정렬 탭 — PC 정렬 칩과 같은 선택 상태 (목록 정렬은 서버 연동 전) */
(function () {
  var tabs = document.querySelectorAll("[data-creator-sort]");
  var chips = document.querySelectorAll(".creators-chips button");
  if (!tabs.length || !chips.length) return;
  function sync() {
    for (var i = 0; i < tabs.length; i++) {
      var on = chips[+tabs[i].getAttribute("data-creator-sort")].classList.contains("is-active");
      tabs[i].classList.toggle("subnav__tab--active", on);
      tabs[i].setAttribute("aria-pressed", on ? "true" : "false");
    }
  }
  for (var t = 0; t < tabs.length; t++) {
    tabs[t].addEventListener("click", function () {
      chips[+this.getAttribute("data-creator-sort")].click();
    });
  }
  for (var c = 0; c < chips.length; c++) chips[c].addEventListener("click", function () { setTimeout(sync); });
  sync();
})();

/* 라이브 방송 서브탭 — 인기라이브 ↔ 전체라이브(64586:116579) 화면 전환.
   새로고침 없이 바꾸고 주소에 ?tab=all 을 남겨 공유·새로고침해도 같은 탭이 열림 */
(function () {
  var tabs = document.querySelectorAll("[data-live-tab]");
  var views = document.querySelectorAll("[data-live-view]");
  if (!tabs.length || !views.length) return;

  function show(name) {
    for (var i = 0; i < tabs.length; i++) {
      var on = tabs[i].getAttribute("data-live-tab") === name;
      tabs[i].classList.toggle("subnav__tab--active", on);
      if (on) tabs[i].setAttribute("aria-current", "page");
      else tabs[i].removeAttribute("aria-current");
    }
    for (var j = 0; j < views.length; j++) {
      views[j].hidden = views[j].getAttribute("data-live-view") !== name;
    }
  }

  var params = new URLSearchParams(location.search);
  show(params.get("tab") === "all" ? "all" : "popular");

  for (var k = 0; k < tabs.length; k++) {
    tabs[k].addEventListener("click", function (e) {
      e.preventDefault();
      var name = this.getAttribute("data-live-tab");
      show(name);
      var p = new URLSearchParams(location.search);
      if (name === "all") p.set("tab", "all");
      else p.delete("tab");
      var q = p.toString();
      history.replaceState(history.state, "", location.pathname + (q ? "?" + q : "") + location.hash);
      window.scrollTo(0, 0);
    });
  }
})();

/* 회원가입 (64454:202039) — 주소 #signup 일 때 본문 대신 표시. 로그인 화면의 "회원가입" 링크로 열림.
   약관동의 → 본인인증 → 정보입력 → 가입완료 4단계는 주소를 바꾸지 않고 화면 안에서 넘김.
   앱바 뒤로 가기: 2·3단계는 이전 단계, 1·4단계는 회원가입 닫기. 서버 연동 전 데모라 입력값은 저장하지 않음 */
(function () {
  var root = document.documentElement;
  var view = document.getElementById("signup-view");
  if (!view) return;
  var moTitle = document.getElementById("mo-title");
  var pages = view.querySelectorAll("[data-signup-step]");
  var steps = view.querySelectorAll(".steps__item");
  var form = document.getElementById("signup-form");
  var step = 1;
  // 비밀번호 보기 — 버튼마다 같은 칸의 입력값을 보이고 숨김
  var reveals = form.querySelectorAll(".sfield__reveal");
  function setReveal(btn, show) {
    var input = btn.parentNode.querySelector(".sfield__input");
    var label = btn.getAttribute("aria-label").replace(/ (보기|숨기기)$/, "");
    input.type = show ? "text" : "password";
    btn.setAttribute("aria-pressed", show ? "true" : "false");
    btn.setAttribute("aria-label", label + (show ? " 숨기기" : " 보기"));
  }
  for (var rv = 0; rv < reveals.length; rv++) {
    reveals[rv].addEventListener("mousedown", function (e) { e.preventDefault(); });
    reveals[rv].addEventListener("click", function () {
      setReveal(this, this.getAttribute("aria-pressed") !== "true");
    });
  }
  var pushed = false;

  function isOpen() {
    return location.hash === "#signup" && root.getAttribute("data-auth") === "out";
  }
  function setStep(n) {
    step = n;
    view.setAttribute("data-step", n);
    for (var i = 0; i < pages.length; i++) pages[i].hidden = +pages[i].getAttribute("data-signup-step") !== n;
    for (var j = 0; j < steps.length; j++) {
      steps[j].classList.toggle("is-reached", j < n);
      steps[j].classList.toggle("is-current", j === n - 1);
      steps[j].classList.toggle("is-passed", j < n - 1);
      if (j === n - 1) steps[j].setAttribute("aria-current", "step");
      else steps[j].removeAttribute("aria-current");
    }
    window.scrollTo(0, 0);
  }
  function reset() {
    var inputs = view.querySelectorAll("input");
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].type === "checkbox" || inputs[i].type === "radio") inputs[i].checked = false;
      else inputs[i].value = "";
    }
    dupChecked.id = dupChecked.nickname = false;
    view.querySelector(".verified").hidden = true;
    for (var r = 0; r < reveals.length; r++) setReveal(reveals[r], false);
    var fs = form.querySelectorAll(".sfield");
    for (var k = 0; k < fs.length; k++) setMsg(fs[k], null);
    syncTerms();
    syncVerify();
    setStep(1);
  }
  function render() {
    var open = isOpen();
    var was = root.getAttribute("data-view") === "signup";
    view.hidden = !open;
    if (open) {
      if (!was) reset();
      root.setAttribute("data-view", "signup");
      moTitle.textContent = "회원가입";
    } else if (was) {
      root.removeAttribute("data-view");
      moTitle.innerHTML = moTitle.getAttribute("data-page-title");
    }
    // 하단 내비 "내 정보" 선택은 아래 하단 내비 내 정보 코드가 data-view 를 보고 맞춤
  }
  function close() {
    if (location.hash !== "#signup") return;
    if (pushed) {
      pushed = false;
      history.back();
    } else {
      history.replaceState(null, "", location.pathname + location.search);
      render();
    }
  }

  var opens = document.querySelectorAll("[data-signup-open]");
  for (var o = 0; o < opens.length; o++) opens[o].addEventListener("click", function (e) {
    e.preventDefault();
    if (location.hash !== "#signup") {
      location.hash = "signup";
      pushed = true;
    }
  });
  window.addEventListener("hashchange", function () {
    if (location.hash !== "#signup") pushed = false;
    render();
  });
  new MutationObserver(render).observe(root, { attributes: true, attributeFilter: ["data-auth"] });

  // 앱바 뒤로 가기
  var backs = document.querySelectorAll("[data-login-back]");
  for (var b = 0; b < backs.length; b++) backs[b].addEventListener("click", function (e) {
    if (root.getAttribute("data-view") !== "signup") return;
    e.preventDefault();
    if (step === 2 || step === 3) setStep(step - 1);
    else close();
  });
  var prevs = view.querySelectorAll("[data-signup-prev]");
  for (var p = 0; p < prevs.length; p++) prevs[p].addEventListener("click", function () { setStep(step - 1); });

  /* 1. 약관 — 전체 동의는 전부 켜고 끔, 필수 4개가 모두 켜져야 다음 */
  var all = view.querySelector("[data-terms-all]");
  var terms = view.querySelectorAll("[data-terms]");
  var next1 = pages[0].querySelector("[data-signup-next]");
  function syncTerms() {
    var every = true, required = true;
    for (var i = 0; i < terms.length; i++) {
      if (!terms[i].checked) {
        every = false;
        if (terms[i].required) required = false;
      }
    }
    all.checked = every;
    next1.disabled = !required;
  }
  all.addEventListener("change", function () {
    for (var i = 0; i < terms.length; i++) terms[i].checked = all.checked;
    syncTerms();
  });
  for (var t = 0; t < terms.length; t++) terms[t].addEventListener("change", syncTerms);
  next1.addEventListener("click", function () { setStep(2); });

  /* 2. 본인인증 — 수단을 고르면 다음. 데모: 실제 인증 창 없이 바로 인증 완료로 표시 */
  var methods = view.querySelectorAll('input[name="verify"]');
  var next2 = pages[1].querySelector("[data-signup-next]");
  var verified = view.querySelector(".verified");
  function syncVerify() {
    var picked = false;
    for (var i = 0; i < methods.length; i++) if (methods[i].checked) picked = true;
    next2.disabled = !picked;
    verified.hidden = !picked;
  }
  for (var m = 0; m < methods.length; m++) methods[m].addEventListener("change", syncVerify);
  next2.addEventListener("click", function () {
    setStep(3);
    form.elements.id.focus({ preventScroll: true });
  });

  /* 3. 정보 입력 — 칸을 벗어날 때와 가입하기를 누를 때 검사 */
  // 아이디·닉네임은 중복 확인을 눌러야 통과. 값을 고치면 다시 확인
  var dupChecked = { id: false, nickname: false };
  var TAKEN = { // 데모용 이미 쓰는 값
    id: ["admin", "funnation", "test", "guest"],
    nickname: ["펀네", "운영자", "관리자"]
  };
  var RULES = {
    id: function (v) {
      if (!v) return "아이디를 입력해주세요.";
      if (!/^[a-z0-9]{4,16}$/.test(v)) return "영문 소문자, 숫자 4~16자로 입력해주세요.";
      if (!dupChecked.id) return "아이디 중복 확인을 해주세요.";
      return "";
    },
    password: function (v) {
      if (!v) return "비밀번호를 입력해주세요.";
      if (v.length < 8 || !/[A-Za-z]/.test(v) || !/[0-9]/.test(v) || !/[^A-Za-z0-9]/.test(v))
        return "영문·숫자·특수문자를 모두 포함해 8~20자로 입력해주세요.";
      return "";
    },
    password2: function (v) {
      if (!v) return "비밀번호를 한 번 더 입력해주세요.";
      if (v !== form.elements.password.value) return "비밀번호가 일치하지 않아요.";
      return "";
    },
    nickname: function (v) {
      if (!v) return "닉네임을 입력해주세요.";
      if (!/^[가-힣A-Za-z0-9]{2,10}$/.test(v)) return "한글, 영문, 숫자 2~10자로 입력해주세요.";
      if (!dupChecked.nickname) return "닉네임 중복 확인을 해주세요.";
      return "";
    },
    email: function (v) {
      if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "이메일 형식이 올바르지 않아요.";
      return "";
    }
  };
  var OK = {
    id: "사용 가능한 아이디예요.",
    password: "사용 가능한 비밀번호예요.",
    password2: "비밀번호가 일치해요.",
    nickname: "사용 가능한 닉네임이에요."
  };
  var hints = {};
  var sfields = form.querySelectorAll(".sfield");
  for (var h = 0; h < sfields.length; h++) {
    var msg = sfields[h].querySelector(".sfield__msg");
    hints[sfields[h].querySelector("input").name] = msg.textContent;
  }
  // state: null = 안내 문구, "error" = 빨강, "ok" = 파랑
  function setMsg(field, state, text) {
    var input = field.querySelector("input");
    var msg = field.querySelector(".sfield__msg");
    field.classList.toggle("is-error", state === "error");
    field.classList.toggle("is-ok", state === "ok");
    if (state === "error") input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
    msg.textContent = text != null ? text : hints[input.name];
  }
  function check(input) {
    var field = input.closest(".sfield");
    // 비밀번호는 공백도 문자로 취급, 나머지는 앞뒤 공백 무시
    var v = input.name.indexOf("password") === 0 ? input.value : input.value.trim();
    var err = RULES[input.name](v);
    if (err) setMsg(field, "error", err);
    else if (OK[input.name] && input.value) setMsg(field, "ok", OK[input.name]);
    else setMsg(field, null);
    return !err;
  }
  var inputs = form.querySelectorAll(".sfield__input");
  // 아래 버튼을 누르는 중이면 칸을 벗어날 때 검사하지 않음 — 문구가 새로 생겨 버튼이 밀리면 클릭이 빠짐.
  // 다음은 누를 때 전체를 검사하고, 뒤로가기는 검사할 필요 없음
  var pressing = false;
  var actions3 = form.querySelector(".signup__actions");
  actions3.addEventListener("pointerdown", function () { pressing = true; });
  document.addEventListener("pointerup", function () { pressing = false; });
  document.addEventListener("pointercancel", function () { pressing = false; });
  for (var q = 0; q < inputs.length; q++) {
    inputs[q].addEventListener("blur", function () {
      // 비어 있는 칸을 그냥 지나칠 땐 혼내지 않음
      if (this.value && !pressing) check(this);
    });
    inputs[q].addEventListener("input", function () {
      var field = this.closest(".sfield");
      if (this.name in dupChecked) dupChecked[this.name] = false;
      if (field.classList.contains("is-error")) check(this);
      if (this.name === "password" && form.elements.password2.value) check(form.elements.password2);
    });
  }
  // 중복 확인 — 형식이 맞으면 데모 목록과 비교
  var dups = view.querySelectorAll("[data-dup-check]");
  for (var u = 0; u < dups.length; u++) dups[u].addEventListener("click", function () {
    var name = this.getAttribute("data-dup-check");
    var input = form.elements[name];
    var field = input.closest(".sfield");
    var v = input.value.trim();
    dupChecked[name] = true; // 형식 검사만 보려고 잠시 통과로 둠
    var err = RULES[name](v);
    dupChecked[name] = false;
    if (!err && TAKEN[name].indexOf(v) !== -1)
      err = name === "id" ? "이미 사용 중인 아이디예요." : "이미 사용 중인 닉네임이에요.";
    if (err) {
      setMsg(field, "error", err);
      input.focus();
      return;
    }
    dupChecked[name] = true;
    setMsg(field, "ok", OK[name]);
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    // 시안 확인용: 필수 칸이 모두 채워져 있으면 형식·중복 확인 오류가 있어도 다음으로 넘김
    var filled = true;
    for (var f = 0; f < inputs.length; f++) {
      if (inputs[f].required && !inputs[f].value) filled = false;
    }
    if (filled) { finish(); return; }
    var first = null;
    for (var i = 0; i < inputs.length; i++) {
      if (!check(inputs[i]) && !first) first = inputs[i];
    }
    if (first) { first.focus(); return; }
    finish();
  });

  /* 4. 가입 완료 — 시작하기를 누르면 로그인 상태로 홈 화면 */
  function finish() {
    setStep(4);
  }
  view.querySelector("[data-signup-finish]").addEventListener("click", function () {
    history.replaceState(null, "", location.pathname + location.search);
    pushed = false;
    root.setAttribute("data-auth", "in");
    try { localStorage.setItem("funnation-auth", "in"); } catch (e) {}
    render();
    window.scrollTo(0, 0);
  });

  render();
})();

/* 홈 · 라이브 방송 — 방송/영상 썸네일을 누르면 영상 상세(watch.html)로 이동.
   펀네이션 라이브(fun-live.html)와 홈의 펀네이션 라이브 섹션(data-watch)은 자체 스트리밍 상세(fun-watch.html)로.
   서버 연동 전이라 어떤 썸네일이든 같은 데모 영상을 연다. 광고 카드는 제외 */
(function () {
  var thumbs = document.querySelectorAll(".card:not(.card--ad) .card__thumb, .vod-card .vod-card__thumb");
  for (var i = 0; i < thumbs.length; i++) {
    var card = thumbs[i].closest(".card, .vod-card");
    var title = card && card.querySelector(".card__title, .vod-card__title");
    thumbs[i].setAttribute("role", "link");
    thumbs[i].setAttribute("tabindex", "0");
    thumbs[i].setAttribute("aria-label", (title ? title.textContent.trim() + " " : "") + "영상 보기");
    thumbs[i].classList.add("is-link");
    thumbs[i].addEventListener("click", go);
    thumbs[i].addEventListener("keydown", function (e) {
      if (e.key === "Enter") go.call(this);
    });
  }
  var target = /fun-live\.html$/.test(location.pathname) ? "fun-watch.html" : "watch.html";
  function go() {
    var area = this.closest("[data-watch]");
    // 세로 썸네일은 영상 상세를 세로 레이아웃으로 (YouTube 상세만)
    var vertical = !area && target === "watch.html" && this.classList.contains("thumb--vertical");
    location.href = area ? area.getAttribute("data-watch") : target + (vertical ? "?orient=vertical" : "");
  }
})();

/* 영상 상세 ver.3 (64795:14999) — 채팅 · 후원 패널 4종. 서버 연동 전 데모라 보내거나 결제하지 않음
   펀네이션 라이브 상세(.fwatch)도 같은 후원 패널(후원 · 시그니처)을 써서 이 부분을 함께 씀 */
(function () {
  var root = document.documentElement;
  var watch = document.querySelector(".watch, .fwatch");
  if (!watch) return;

  /* YouTube 임베드 — 영상 ID 는 .watch 의 data-yt-id. 라이브 채팅은 embed_domain 이 지금 주소의 도메인과 같아야 하고
     라이브 · 최초 공개 영상에서만 보임. file:// 로 열면 YouTube 가 막아 안내 문구를 보여줌 */
  // 가로 · 세로 — ?orient=vertical 이면 세로 레이아웃, 세로 데모 영상 ID 가 있으면 그 영상으로
  var vertical = /[?&]orient=vertical(&|$)/.test(location.search) && watch.hasAttribute("data-orient");
  if (vertical) watch.setAttribute("data-orient", "portrait");
  var ytId = (vertical && watch.getAttribute("data-yt-id-vertical")) || watch.getAttribute("data-yt-id");
  watch.setAttribute("data-yt-current", ytId); // 더보기 메뉴(YouTube에서 보기 · 채팅 새 창)가 씀
  var player = watch.querySelector("[data-yt-player]");
  var ytChat = watch.querySelector("[data-yt-chat]");
  var host = location.hostname;
  // YouTube 상세(watch.html)에만 있음 — 펀네이션 라이브 상세는 자체 플레이어
  if (player) {
    // 파일로 열면 Referer 가 없어 YouTube 가 "동영상 플레이어 구성 오류(153)" 를 냄 → 플레이어 · 채팅 대신 안내 문구
    if (location.protocol === "file:" || !host) {
      player.hidden = true;
      ytChat.hidden = true;
      watch.querySelector("[data-yt-player-off]").hidden = false;
      watch.querySelector("[data-yt-chat-off]").hidden = false;
    } else {
      player.src = "https://www.youtube.com/embed/" + ytId + "?autoplay=1&mute=1&playsinline=1&origin=" + encodeURIComponent(location.origin);
    }
    function chatSrc() {
      var dark = root.getAttribute("data-theme") !== "light";
      return "https://www.youtube.com/live_chat?v=" + ytId + "&embed_domain=" + encodeURIComponent(host) + (dark ? "&dark_theme=1" : "");
    }
    if (!ytChat.hidden) {
      ytChat.src = chatSrc();
      // 테마를 바꾸면 채팅도 같은 테마로 다시 불러옴
      new MutationObserver(function () {
        var next = chatSrc();
        if (ytChat.src !== next) ytChat.src = next;
      }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    }
  }

  /* 채팅 ↔ 후원하기 탭 — 후원하기는 종류 탭(일반후원·시그니처·영상·미션) + 패널, 마지막에 고른 종류를 기억.
     show(null) 은 채팅으로 돌아감 */
  var chat = document.getElementById("wchat");
  var modeTabs = watch.querySelectorAll("[data-chat-tab]");
  var tabs = watch.querySelectorAll("[data-donate]");
  var panels = watch.querySelectorAll("[data-donate-panel]");
  var current = null;
  var lastKind = "general";
  function show(key) {
    current = key;
    if (key && key !== "settings") lastKind = key;
    var mode = key === "settings" ? "settings" : key ? "donate" : "chat";
    chat.setAttribute("data-mode", mode);
    for (var m = 0; m < modeTabs.length; m++) modeTabs[m].setAttribute("aria-selected", modeTabs[m].getAttribute("data-chat-tab") === mode ? "true" : "false");
    for (var i = 0; i < panels.length; i++) panels[i].hidden = panels[i].getAttribute("data-donate-panel") !== key;
    // 모바일 YouTube 상세는 탭(role=tab), 나머지는 눌림 버튼
    for (var j = 0; j < tabs.length; j++) tabs[j].setAttribute(tabs[j].getAttribute("role") === "tab" ? "aria-selected" : "aria-pressed", tabs[j].getAttribute("data-donate") === key ? "true" : "false");
    // 펀네이션 라이브 상세 — 채팅 보이스(후원 팝오버 안에서 여는 목록)는 패널이 바뀌면 함께 닫음
    var voice = document.getElementById("fvoice");
    if (voice) voice.hidden = true;
  }
  window.funDonateShow = show;
  window.funDonateCurrent = function () { return current; };
  var modeBtns = watch.querySelectorAll("[data-chat-tab]");
  for (var b = 0; b < modeBtns.length; b++) modeBtns[b].addEventListener("click", function () {
    var tab = this.getAttribute("data-chat-tab");
    show(tab === "donate" ? lastKind : tab === "settings" ? "settings" : null);
  });

  /* 채팅 설정 (fun-watch 66076:95140 · watch 66098:114862) — 글자 크기 · 칭호 배지는 하나만 선택,
     설정 저장은 채팅 탭으로 돌아감 (저장 동작은 시안에 없어 화면 상태만). 펀네이션 라이브는 아래에서 채팅 글자 크기도 바꿈 */
  watch.addEventListener("click", function (e) {
    var pick = e.target.closest("[data-fset-size], [data-fchat-size], [data-fset-badge]");
    if (pick && pick.closest(".fset")) {
      var group = pick.parentNode.children;
      for (var i = 0; i < group.length; i++) group[i].setAttribute("aria-pressed", group[i] === pick ? "true" : "false");
      var label = pick.closest(".dbox").querySelector("[data-fset-size-label]");
      if (label && !pick.hasAttribute("data-fset-badge")) label.textContent = pick.getAttribute("aria-label");
      // YouTube 상세 — 채팅 칸 전체 배율 (1 · 1.15 · 1.3)
      var zoom = pick.getAttribute("data-fset-size");
      if (zoom) chat.style.setProperty("--chat-zoom", zoom);
    }
    if (e.target.closest("[data-fset-save]")) watch.querySelector('[data-chat-tab="chat"]').click();
  });
  // data-donate-toggle 버튼(펀네이션 라이브 상세의 후원 · 시그니처 · 설정)은 열린 패널을 다시 누르면 닫음
  for (var k = 0; k < tabs.length; k++) tabs[k].addEventListener("click", function () {
    var key = this.getAttribute("data-donate");
    show(this.hasAttribute("data-donate-toggle") && current === key ? null : key);
  });
  // 패널 X · ESC — 닫고 채팅으로 (후원 실패 창이 떠 있으면 그 창이 먼저 ESC 를 받음)
  watch.addEventListener("click", function (e) {
    if (e.target.closest("[data-donate-close]")) show(null);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || !current || !watch.querySelector("[data-donate-close]")) return;
    var opener = watch.querySelector('[data-donate="' + current + '"][data-donate-toggle]');
    show(null);
    if (opener) opener.focus();
  });

  // 글자 수 표시 (0/200) — 200자를 넘겨 입력할 수 있고, 넘으면 오류 문구로 알림
  var counted = watch.querySelectorAll("[data-count]");
  for (var n = 0; n < counted.length; n++) counted[n].addEventListener("input", function () {
    var box = this.closest(".dmsg__box, .dmission__field");
    box.querySelector(".dmsg__count, .dmission__count").textContent = this.value.length + "/200";
  });

  // 익명 — 켜면 닉네임 자리에 "익명"
  var anons = watch.querySelectorAll("[data-donate-anon]");
  for (var a = 0; a < anons.length; a++) anons[a].addEventListener("change", function () {
    this.closest(".dmsg").querySelector("[data-donate-nick]").textContent = this.checked ? "익명" : "토비라마";
  });

  // 음성 읽기 켜기/끄기 · 목소리 바꾸기
  var VOICES = ["야옹이", "유나", "민준", "서연"];
  var vols = watch.querySelectorAll("[data-donate-vol]");
  for (var v = 0; v < vols.length; v++) vols[v].addEventListener("click", function () {
    var on = this.getAttribute("aria-pressed") !== "true";
    this.setAttribute("aria-pressed", on ? "true" : "false");
  });
  var voices = watch.querySelectorAll("[data-donate-voice]");
  for (var w = 0; w < voices.length; w++) voices[w].addEventListener("click", function () {
    if (this.hasAttribute("aria-controls")) return; // 펀네이션 라이브 상세는 채팅 보이스 목록을 엶 (아래 펀네이션 라이브 코드)
    var label = this.querySelector("span");
    label.textContent = VOICES[(VOICES.indexOf(label.textContent) + 1) % VOICES.length];
  });

  /* 후원 금액 — 숫자만 받아 천 단위 쉼표, 칩은 더하기, 전액은 내 펀캐시 전부. 0원이면 지우기 버튼 숨김 */
  var BALANCE = 100000;
  function fmt(n) { return n.toLocaleString("ko-KR"); }
  function setAmount(input, n, typing) {
    input.value = n || !typing ? fmt(n) : "";
    input.closest(".damount__box").classList.toggle("is-empty", !n);
  }
  function amountOf(input) { return +input.value.replace(/[^0-9]/g, "") || 0; }
  watch.addEventListener("click", function (e) {
    var chip = e.target.closest("[data-add]");
    var clear = e.target.closest("[data-donate-clear]");
    if (!chip && !clear) return;
    var input = (chip || clear).closest(".damount").querySelector("[data-donate-amount]");
    if (clear) setAmount(input, 0);
    else {
      var add = chip.getAttribute("data-add");
      setAmount(input, add === "all" ? BALANCE : Math.min(amountOf(input) + +add, 99999999));
    }
    var sig = input.closest(".donate").querySelector('.dsig__item[aria-pressed="true"]');
    if (sig) sig.setAttribute("aria-pressed", "false");
    check(input.closest(".donate"));
  });
  var amounts = watch.querySelectorAll("[data-donate-amount]");
  for (var m = 0; m < amounts.length; m++) amounts[m].addEventListener("input", function () {
    setAmount(this, Math.min(amountOf(this), 99999999), true);
  });

  // 시그니처 — 고르면 그 금액이 들어감, 오른쪽 화살표로 다음 묶음. 항목이 없으면 "등록된 시그니처 없음"
  var sigs = watch.querySelectorAll(".dsig__item");
  for (var g = 0; g < sigs.length; g++) sigs[g].addEventListener("click", function () {
    for (var i = 0; i < sigs.length; i++) sigs[i].setAttribute("aria-pressed", sigs[i] === this ? "true" : "false");
    setAmount(this.closest(".donate").querySelector("[data-donate-amount]"), +this.getAttribute("data-price"));
    check(this.closest(".donate"));
  });
  var grid = watch.querySelector("[data-sig-grid]");
  watch.querySelector("[data-sig-next]").addEventListener("click", function () {
    var end = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 2;
    grid.scrollLeft = end ? 0 : grid.scrollLeft + 188;
  });
  if (!sigs.length) {
    grid.parentNode.hidden = true;
    watch.querySelector("[data-sig-empty]").hidden = false;
  }

  // 영상 시작·종료 시간 — 숫자만, mm:ss 로 맞춤
  var times = watch.querySelectorAll("[data-time]");
  for (var h = 0; h < times.length; h++) times[h].addEventListener("input", function () {
    var d = this.value.replace(/[^0-9]/g, "").slice(0, 4);
    this.value = d.length > 2 ? d.slice(0, d.length - 2) + ":" + d.slice(-2) : d;
  });

  /* 입력 확인 (64617:28170) — 서버 연동 전 데모 규칙.
     글자 수·금지어·금액은 입력하는 대로, 빈 필수 항목은 후원하기를 누른 뒤부터 알림.
     최소 금액은 영상 후원 10,000원(시안 "최소금액표시"), 나머지 1,000원 */
  var BANNED = ["씨발", "시발", "병신", "개새끼"];
  var MAX_CLIP = 300; // 영상 후원 최대 재생 시간(초)
  function secOf(input) {
    var d = input.value.replace(/[^0-9]/g, "");
    if (!d) return null;
    return (d.length > 2 ? +d.slice(0, -2) : 0) * 60 + +d.slice(-2);
  }
  function warn(el, msg, field) {
    el.textContent = msg ? "⚠️ " + msg : "";
    el.hidden = !msg;
    if (field) for (var i = 0; i < field.length; i++) field[i].classList.toggle("is-warn", !!msg);
    return !msg;
  }
  function check(panel, all) {
    if (panel.hasAttribute("data-tried")) all = true;
    var ok = true;
    var msg = panel.querySelector("[data-donate-msg]");
    var text = msg.value;
    ok = warn(msg.closest(".dmsg").querySelector("[data-warn]"),
      text.length > 200 ? "후원메세지는 200자 이내로 입력해주세요"
        : BANNED.some(function (b) { return text.indexOf(b) > -1; }) ? "후원메세지에 사용할 수 없는 표현이 포함되어 있어요" : "",
      [msg.closest(".dmsg__box")]) && ok;

    var amount = panel.querySelector("[data-donate-amount]");
    var won = amountOf(amount);
    var min = panel.getAttribute("data-donate-panel") === "video" ? 10000 : 1000;
    ok = warn(amount.closest(".damount").querySelector("[data-warn]"),
      won > BALANCE ? "보유캐시가 부족합니다" : (won || all) && won < min ? "최소 " + fmt(min) + "원 이상" : "",
      [amount.closest(".damount__box")]) && ok;

    var key = panel.getAttribute("data-donate-panel");
    if (key === "signature") {
      var picked = panel.querySelector('.dsig__item[aria-pressed="true"]');
      ok = warn(panel.querySelector("[data-warn-sig]"),
        picked && picked.hasAttribute("data-unavailable") ? "선택한 시그니처를 사용할 수 없습니다. 다른 항목을 선택해주세요"
          : all && !picked && sigs.length ? "후원할 시그니처를 선택해주세요" : "") && ok;
    }
    if (key === "video") {
      var url = panel.querySelector("[data-video-url]");
      var u = url.value.trim();
      ok = warn(panel.querySelector("#d-video-url-warn"),
        !u ? (all ? "영상 URL을 입력해주세요" : "")
          : /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/|live\/)|youtu\.be\/)[\w-]{6,}/.test(u) ? ""
          : "지원되는 Youtube 영상 URL을 입력해주세요",
        [url.closest(".dfield")]) && ok;
      var start = panel.querySelector("[data-video-start]");
      var end = panel.querySelector("[data-video-end]");
      var s0 = secOf(start), s1 = secOf(end);
      ok = warn(panel.querySelector("#d-video-time-warn"),
        s0 === null || s1 === null ? ""
          : s1 <= s0 ? "종료 시간은 시작 시간보다 늦어야 합니다"
          : s1 - s0 > MAX_CLIP ? "허용된 영상 재생 시간을 초과했습니다" : "",
        [start.closest(".dfield"), end.closest(".dfield")]) && ok;
    }
    if (key === "mission") {
      var title = panel.querySelector("[data-mission-title]");
      var body = panel.querySelector("[data-mission-body]");
      var LONG = "입력 가능한 글자 수를 초과했습니다";
      ok = warn(panel.querySelector("#d-mission-title-warn"),
        title.value.length > 200 ? LONG : all && !title.value.trim() ? "미션 제목을 입력해주세요" : "",
        [title.closest(".dmission__box")]) && ok;
      ok = warn(panel.querySelector("#d-mission-body-warn"), body.value.length > 200 ? LONG : "",
        [body.closest(".dmission__box")]) && ok;
    }
    panel.querySelector("[data-warn-form]").hidden = ok || !panel.hasAttribute("data-tried");
    return ok;
  }
  for (var q = 0; q < panels.length; q++) {
    if (!panels[q].querySelector("[data-donate-amount]")) continue; // 설정 패널처럼 후원 입력이 없는 패널은 확인하지 않음
    panels[q].addEventListener("input", function () { check(this); });
    check(panels[q]);
  }

  /* 후원하기 — 확인을 통과하면 펀캐시를 빼고 채팅에 후원 메시지를 남긴 뒤 패널을 닫음.
     실패 화면(64624:81159)은 주소에 ?donate=fail 을 붙이면 첫 시도에서 한 번 보여줌 (오프라인이면 늘) */
  var fail = watch.querySelector("#donate-fail");
  var failOnce = /[?&]donate=fail\b/.test(location.search);
  var pending = null;
  function reset(panel) {
    panel.removeAttribute("data-tried");
    var fields = panel.querySelectorAll("textarea, input[type=text]:not([data-donate-amount]), input[type=url]");
    for (var i = 0; i < fields.length; i++) {
      fields[i].value = "";
      fields[i].dispatchEvent(new Event("input", { bubbles: true }));
    }
    setAmount(panel.querySelector("[data-donate-amount]"), 5000);
    var picked = panel.querySelector('.dsig__item[aria-pressed="true"]');
    if (picked) picked.setAttribute("aria-pressed", "false");
    check(panel);
  }
  function donate(panel) {
    if (failOnce || !navigator.onLine) {
      failOnce = false;
      pending = panel;
      fail.hidden = false;
      fail.querySelector("[data-donate-retry]").focus();
      return;
    }
    var won = amountOf(panel.querySelector("[data-donate-amount]"));
    BALANCE -= won;
    var bals = watch.querySelectorAll("[data-donate-balance]");
    for (var i = 0; i < bals.length; i++) bals[i].textContent = fmt(BALANCE);
    reset(panel);
    show(null);
  }
  var submits = watch.querySelectorAll("[data-donate-submit]");
  for (var t = 0; t < submits.length; t++) submits[t].addEventListener("click", function () {
    var panel = this.closest(".donate");
    panel.setAttribute("data-tried", "");
    if (check(panel)) donate(panel);
    else {
      var bad = panel.querySelector(".is-warn input, .is-warn textarea, .dwarn:not([hidden])");
      if (bad) bad.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  });
  function closeFail() {
    fail.hidden = true;
    var panel = pending;
    pending = null;
    return panel;
  }
  fail.querySelector("[data-donate-retry]").addEventListener("click", function () {
    var panel = closeFail();
    if (panel) donate(panel);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !fail.hidden) {
      e.stopImmediatePropagation();
      var panel = closeFail();
      if (panel) panel.querySelector("[data-donate-submit]").focus();
    }
  }, true);
})();

/* 영상 상세 방송 정보 · 다시보기 (66098:111836 · 111904) — 팔로우, 후원하기(채팅 쪽 후원 탭으로), 공유, 설명 더보기, 정렬 칩.
   펀네이션 라이브 상세(.fwatch, 66132:101009)도 같은 방송 정보 · 다시보기 틀이라 함께 씀 */
(function () {
  var watch = document.querySelector(".watch, .fwatch");
  if (!watch) return;
  var isFun = watch.classList.contains("fwatch");
  // 팔로우 — PC 방송 정보와 모바일 앱바 버튼이 같은 상태
  var follows = watch.querySelectorAll("[data-watch-follow]");
  for (var f = 0; f < follows.length; f++) follows[f].addEventListener("click", function () {
    var on = this.getAttribute("aria-pressed") !== "true";
    for (var k = 0; k < follows.length; k++) {
      follows[k].setAttribute("aria-pressed", on ? "true" : "false");
      (follows[k].querySelector("span") || follows[k]).textContent = on ? "팔로잉" : "팔로우";
    }
  });
  // 모바일 뒤로 — 같은 사이트에서 왔으면 이전 화면, 아니면 홈
  var back = watch.querySelector("[data-watch-back]");
  if (back) back.addEventListener("click", function (e) {
    if (history.length > 1 && document.referrer.indexOf(location.origin) === 0) {
      e.preventDefault();
      history.back();
    }
  });
  // 후원하기 — YouTube 상세는 채팅의 후원하기 탭, 펀네이션 라이브는 아래 후원 버튼(이미 열려 있으면 그대로)
  var donate = watch.querySelector("[data-watch-donate]");
  if (donate) donate.addEventListener("click", function () {
    var tab = watch.querySelector('[data-chat-tab="donate"]') || watch.querySelector('[data-donate="general"]');
    if (tab.getAttribute("aria-pressed") !== "true") tab.click();
    tab.focus();
  });
  var shares = watch.querySelectorAll("[data-watch-share]");
  for (var sh = 0; sh < shares.length; sh++) shares[sh].addEventListener("click", function () {
    var btn = this;
    if (navigator.share) {
      navigator.share({ title: document.title, url: location.href }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(location.href).then(function () {
        btn.setAttribute("aria-label", "링크를 복사했어요");
        setTimeout(function () { btn.setAttribute("aria-label", "공유하기"); }, 2000);
      });
    }
  });
  var toggle = watch.querySelector("[data-wdesc-toggle]");
  if (toggle) toggle.addEventListener("click", function () {
    var open = this.getAttribute("aria-expanded") !== "true";
    this.setAttribute("aria-expanded", open ? "true" : "false");
    this.textContent = open ? "간략히" : "...더보기";
    this.closest(".wdesc").setAttribute("data-expanded", open ? "true" : "false");
  });
  /* 더보기 메뉴 (모바일 66146:13940 · PC 66098:153613) — ⋮ 로 열고, 바깥 클릭 · ESC · 항목 선택으로 닫힘.
     연결 화면이 없는 항목은 data-coming-soon("준비 중"). 관리자 페이지는 로그인 연동 전이라 데모로 항상 보임 */
  var ytNow = watch.getAttribute("data-yt-current") || watch.getAttribute("data-yt-id");
  var ytLinks = watch.querySelectorAll("[data-yt-open]");
  for (var y = 0; y < ytLinks.length; y++) ytLinks[y].href = "https://www.youtube.com/watch?v=" + ytNow;
  var menuBtns = watch.querySelectorAll("[data-wmenu-btn]");
  var openBtn = null;
  function menuOf(btn) { return document.getElementById(btn.getAttribute("aria-controls")); }
  function closeMenu(focus) {
    if (!openBtn) return;
    menuOf(openBtn).hidden = true;
    openBtn.setAttribute("aria-expanded", "false");
    if (focus) openBtn.focus();
    openBtn = null;
  }
  for (var mb = 0; mb < menuBtns.length; mb++) menuBtns[mb].addEventListener("click", function (e) {
    e.stopPropagation();
    var same = openBtn === this;
    closeMenu();
    if (same) return;
    openBtn = this;
    menuOf(this).hidden = false;
    this.setAttribute("aria-expanded", "true");
  });
  document.addEventListener("click", function (e) {
    if (!openBtn) return;
    var menu = menuOf(openBtn);
    var item = e.target.closest(".wmenu__item");
    if (item && menu.contains(item)) {
      var btn = openBtn;
      closeMenu();
      if (item.hasAttribute("data-wmenu-lang") && window.funOpenLangPop) setTimeout(function () { window.funOpenLangPop(btn); }, 0);
      if (item.hasAttribute("data-chat-popout") && !isFun) {
        window.open("https://www.youtube.com/live_chat?is_popout=1&v=" + ytNow, "fun-chat", "width=420,height=720");
      } // 펀네이션 라이브는 아래 펀네이션 라이브 코드가 자체 채팅 창을 엶
      return;
    }
    if (!menu.contains(e.target)) closeMenu();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && openBtn) closeMenu(true);
  });

  var sorts = watch.querySelectorAll("[data-wmore-sort] button");
  for (var i = 0; i < sorts.length; i++) sorts[i].addEventListener("click", function () {
    for (var j = 0; j < sorts.length; j++) {
      sorts[j].classList.toggle("is-active", sorts[j] === this);
      sorts[j].setAttribute("aria-pressed", sorts[j] === this ? "true" : "false");
    }
  });
})();

/* 펀네이션 라이브 영상 상세 (v2.0 66132:92982) — 자체 스트리밍 플레이어 · 채팅 (방송 정보 · 다시보기는 위 영상 상세 코드).
   서버 연동 전 데모: 송출 주소가 없으면 시안 화면(포스터)만 보이고, 채팅은 시안 메시지에 몇 초마다 새 메시지를 더함.
   후원 · 시그니처 패널은 위 영상 상세 코드가 함께 처리 */
(function () {
  var root = document.documentElement;
  var fw = document.querySelector(".fwatch");
  if (!fw) return;
  // 채팅 팝업 창(?chat=popout) — 채팅만 화면 가득
  if (/[?&]chat=popout(&|$)/.test(location.search)) root.setAttribute("data-chat-popout", "");

  /* 플레이어 — .fplayer 의 data-stream-src 에 송출 주소를 넣으면 재생.
     HLS(.m3u8)는 Safari 만 바로 재생되고, 다른 브라우저는 hls.js 같은 재생기를 붙여야 함 (아직 없음) */
  var box = fw.querySelector(".fplayer");
  var video = fw.querySelector("[data-fplayer-video]");
  var src = box.getAttribute("data-stream-src");
  if (src) {
    video.src = src;
    video.play().catch(function () {
      // 소리 있는 자동 재생이 막히면 음소거로 다시 시도
      video.muted = true;
      sync();
      video.play().catch(function () {});
    });
  }
  var playBtn = fw.querySelector("[data-fplayer-play]");
  var muteBtn = fw.querySelector("[data-fplayer-mute]");
  var demoPaused = false;
  // aria-pressed="true" 면 꺼진 아이콘(재생 · 음소거)을 보여줌
  function sync() {
    var paused = src ? video.paused : demoPaused;
    playBtn.setAttribute("aria-pressed", paused ? "true" : "false");
    playBtn.setAttribute("aria-label", paused ? "재생" : "일시정지");
    muteBtn.setAttribute("aria-pressed", video.muted ? "true" : "false");
    muteBtn.setAttribute("aria-label", video.muted ? "음소거 해제" : "음소거");
  }
  video.addEventListener("play", sync);
  video.addEventListener("pause", sync);
  video.addEventListener("volumechange", sync);
  playBtn.addEventListener("click", function () {
    if (!src) demoPaused = !demoPaused;
    else if (video.paused) video.play();
    else video.pause();
    sync();
  });
  muteBtn.addEventListener("click", function () {
    video.muted = !video.muted;
    sync();
  });
  // 실시간 — 라이브 맨 끝으로 이동해 재생
  fw.querySelector("[data-fplayer-live]").addEventListener("click", function () {
    if (src && video.seekable.length) video.currentTime = video.seekable.end(video.seekable.length - 1);
    if (src) video.play();
    demoPaused = false;
    sync();
  });

  // 화질 — 목록에서 고르면 버튼 글자만 바뀜 (화질별 송출 주소는 서버 연동 때)
  var qBtn = fw.querySelector("[data-fquality-btn]");
  var qMenu = document.getElementById("fquality-menu");
  function qToggle(open) {
    qMenu.hidden = !open;
    qBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  qBtn.addEventListener("click", function () { qToggle(qMenu.hidden); });
  qMenu.addEventListener("click", function (e) {
    var item = e.target.closest("[role=menuitemradio]");
    if (!item) return;
    var items = qMenu.querySelectorAll("[role=menuitemradio]");
    for (var i = 0; i < items.length; i++) items[i].setAttribute("aria-checked", items[i] === item ? "true" : "false");
    fw.querySelector("[data-fquality-label]").textContent = item.textContent;
    qToggle(false);
    qBtn.focus();
  });
  document.addEventListener("click", function (e) {
    if (!qMenu.hidden && !e.target.closest(".fquality")) qToggle(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !qMenu.hidden) {
      qToggle(false);
      qBtn.focus();
    }
  });

  // 소리만 듣기 · 기본 화면(끄면 화면 꽉 채움) — [구현 제안] 시안은 버튼 모양만 있음
  fw.querySelector("[data-fplayer-audio]").addEventListener("click", function () {
    var on = this.getAttribute("aria-pressed") !== "true";
    this.setAttribute("aria-pressed", on ? "true" : "false");
    box.classList.toggle("is-audio", on);
    fw.querySelector("[data-fplayer-audio-note]").hidden = !on;
  });
  fw.querySelector("[data-fplayer-fit]").addEventListener("click", function () {
    var fit = this.getAttribute("aria-pressed") !== "true";
    this.setAttribute("aria-pressed", fit ? "true" : "false");
    this.setAttribute("aria-label", fit ? "기본 화면" : "꽉 찬 화면");
    box.classList.toggle("is-cover", !fit);
  });
  // 작은 창 — 영상이 재생 중일 때만 (포스터만 있는 데모에선 동작 안 함)
  fw.querySelector("[data-fplayer-pip]").addEventListener("click", function () {
    if (document.pictureInPictureElement) document.exitPictureInPicture();
    else if (document.pictureInPictureEnabled && video.readyState > 0) video.requestPictureInPicture().catch(function () {});
  });
  var fullBtn = fw.querySelector("[data-fplayer-full]");
  fullBtn.addEventListener("click", function () {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (box.requestFullscreen) box.requestFullscreen();
  });
  document.addEventListener("fullscreenchange", function () {
    var on = document.fullscreenElement === box;
    fullBtn.setAttribute("aria-pressed", on ? "true" : "false");
    fullBtn.setAttribute("aria-label", on ? "전체화면 종료" : "전체화면");
  });
  sync();

  // 멈춤 상태면 컨트롤을 계속 보여줌 (PC 는 평소 마우스를 올렸을 때만 보임)
  function pausedClass() { box.classList.toggle("is-paused", playBtn.getAttribute("aria-pressed") === "true"); }
  playBtn.addEventListener("click", pausedClass);
  video.addEventListener("pause", pausedClass);
  video.addEventListener("play", pausedClass);

  // 방송 시간 — 1초마다 늘어남 (모바일 플레이어 위 시간)
  var uptime = fw.querySelector("[data-fwatch-uptime]");
  if (uptime) {
    var sec = +uptime.getAttribute("data-fwatch-uptime");
    var two = function (n) { return (n < 10 ? "0" : "") + n; };
    setInterval(function () {
      sec++;
      uptime.textContent = two(Math.floor(sec / 3600)) + ":" + two(Math.floor(sec / 60) % 60) + ":" + two(sec % 60);
    }, 1000);
  }

  // 채팅 접기 · 펼치기 — 접으면 왼쪽(플레이어 · 정보)이 오른쪽 끝까지 넓어짐
  var foldBtn = fw.querySelector("[data-fchat-fold]");
  function fold(folded) {
    fw.classList.toggle("is-folded", folded);
    foldBtn.setAttribute("aria-expanded", folded ? "false" : "true");
    foldBtn.setAttribute("aria-label", folded ? "채팅 펼치기" : "채팅 접기");
  }
  foldBtn.addEventListener("click", function () { fold(!fw.classList.contains("is-folded")); });
  // 방송 정보 후원하기 — 채팅을 펼침 (후원 팝오버는 위 방송 정보 코드가 엶)
  var infoDonate = fw.querySelector("[data-watch-donate]");
  if (infoDonate) infoDonate.addEventListener("click", function () { fold(false); });

  // 후원 랭킹 펼치기 · 접기 — [구현 제안] 시안은 펼친 상태만 있어, 6명 ⌄ 를 누르면 카드 줄을 접음
  var rankBtn = fw.querySelector("[data-frank-toggle]");
  rankBtn.addEventListener("click", function () {
    var open = this.getAttribute("aria-expanded") !== "true";
    this.setAttribute("aria-expanded", open ? "true" : "false");
    document.getElementById("frank-body").hidden = !open;
  });
  // 모바일 랭킹 줄 ⌄ — [구현 제안] 펼치면 PC 와 같은 2 · 1 · 3위 카드 + 한방 최고를 줄 아래로
  var rank = fw.querySelector(".frank");
  var rankMore = fw.querySelector("[data-frank-more]");
  rankMore.addEventListener("click", function () {
    var open = !rank.classList.contains("is-mo-open");
    rank.classList.toggle("is-mo-open", open);
    this.setAttribute("aria-expanded", open ? "true" : "false");
    this.setAttribute("aria-label", open ? "후원 랭킹 접기" : "후원 랭킹 펼치기");
  });

  /* 모바일 재생화면 탭 (66132:100340) — 플레이어를 누르면 앱바 대신 플레이어 위 버튼 · 아래 방송 정보, 다시 누르거나 ⌄ 로 닫음 */
  var mobile = matchMedia("(max-width: 767px)");
  function tapped(on) { fw.classList.toggle("is-tapped", on); }
  box.addEventListener("click", function (e) {
    if (!mobile.matches || e.target.closest("button, a, .fquality__menu")) return;
    tapped(!fw.classList.contains("is-tapped"));
  });
  fw.querySelector("[data-fpm-close]").addEventListener("click", function () { tapped(false); });
  // 재생화면 탭의 실시간 · 소리 · 전체화면은 PC 컨트롤 버튼과 같은 동작
  var fpmMap = { live: "[data-fplayer-live]", mute: "[data-fplayer-mute]", full: "[data-fplayer-full]" };
  var fpms = fw.querySelectorAll("[data-fpm]");
  for (var fp = 0; fp < fpms.length; fp++) fpms[fp].addEventListener("click", function () {
    fw.querySelector(fpmMap[this.getAttribute("data-fpm")]).click();
  });

  var chat = document.getElementById("wchat");
  var list = fw.querySelector("[data-fchat-list]");

  // 글자 크기 3단계 (설정 66132:103272) — 채팅 목록 글자만
  var sizes = fw.querySelectorAll("[data-fchat-size]");
  for (var z = 0; z < sizes.length; z++) sizes[z].addEventListener("click", function () {
    var px = this.getAttribute("data-fchat-size");
    for (var i = 0; i < sizes.length; i++) sizes[i].setAttribute("aria-pressed", sizes[i].getAttribute("data-fchat-size") === px ? "true" : "false");
    list.style.setProperty("--fmsg-size", px + "px");
  });

  /* 설정 토글 (66132:103285~) — 배지 표시 · 메시지 시간 표시 · 채팅 얼리기.
     [구현 제안] 시간은 이름 앞 작은 글자, 얼리기는 켜 둔 동안 새 메시지를 모아 두었다가 끄면 한꺼번에 보여줌 */
  var frozen = false;
  var queue = [];
  var opts = fw.querySelectorAll("[data-fopt]");
  for (var o = 0; o < opts.length; o++) opts[o].addEventListener("change", function () {
    var key = this.getAttribute("data-fopt");
    if (key === "badge") chat.classList.toggle("is-nobadge", !this.checked);
    if (key === "time") chat.classList.toggle("is-time", this.checked);
    if (key === "freeze") {
      frozen = this.checked;
      if (!frozen) {
        var follow = atBottom();
        while (queue.length) list.appendChild(queue.shift());
        trim();
        if (follow) list.scrollTop = list.scrollHeight;
      }
    }
  });
  // 바깥을 누르면 설정 카드를 닫음
  var settings = document.getElementById("fchat-settings");
  document.addEventListener("click", function (e) {
    if (settings.hidden || settings.contains(e.target) || e.target.closest('[data-donate="settings"]')) return;
    if (window.funDonateCurrent && window.funDonateCurrent() === "settings") window.funDonateShow(null);
  });

  // 채팅 팝업 · 채팅 새 창으로 보기 — 이 화면을 채팅만 보이는 작은 창으로 (?chat=popout)
  var popouts = fw.querySelectorAll("[data-chat-popout]");
  for (var po = 0; po < popouts.length; po++) popouts[po].addEventListener("click", function () {
    window.open(location.pathname + "?chat=popout", "fun-chat", "width=420,height=760");
  });

  /* 채팅 목록 — 맨 아래에 있을 때만 새 메시지를 따라 내려감 (위로 올려 읽는 중이면 그대로) */
  function atBottom() { return list.scrollHeight - list.scrollTop - list.clientHeight < 40; }
  function trim() { while (list.children.length > 200) list.removeChild(list.firstElementChild); }
  function now() {
    var d = new Date();
    return (d.getHours() < 10 ? "0" : "") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
  }
  // m = { name, text, badge?, rank? } — 배지는 [crown 순위] 또는 칭호 글자
  function add(m) {
    var li = document.createElement("li");
    li.className = "fmsg";
    var time = document.createElement("time");
    time.className = "fmsg__time";
    time.textContent = now();
    var who = document.createElement("button");
    who.type = "button";
    who.className = "fmsg__name";
    who.setAttribute("data-fuser", "");
    who.textContent = m.name;
    li.appendChild(time);
    li.appendChild(who);
    if (m.badge) {
      var b = document.createElement("span");
      b.className = "fmsg__badge" + (m.rank ? " fmsg__badge--rank" : "");
      if (m.rank) {
        var crown = document.createElement("img");
        crown.src = "assets/fun-watch/badge-crown.svg";
        crown.width = crown.height = 12;
        crown.alt = "";
        b.appendChild(crown);
      }
      b.appendChild(document.createTextNode(m.badge));
      li.appendChild(b);
    }
    var text = document.createElement("span");
    text.className = "fmsg__text";
    text.textContent = m.text;
    li.appendChild(text);
    if (frozen) {
      queue.push(li);
      return;
    }
    var follow = atBottom();
    list.appendChild(li);
    trim();
    if (follow) list.scrollTop = list.scrollHeight;
  }
  list.scrollTop = list.scrollHeight;
  // 데모 새 메시지 — 모바일 시안(66132:100189)의 메시지
  var DEMO = [
    { name: "커피", text: "송피아 도하나 맛나게 먹어라" },
    { name: "불금", text: "피아는 안먹어도 될 거 같은데?", badge: "골드노블레스" },
    { name: "살려단", text: "ㅋㅋㅋㅋㅋ" },
    { name: "도파민고퀴", text: "송피아 도하나 맛나게 먹어라" },
    { name: "@Sasha.l9ve", text: "lol moon", badge: "#3", rank: true },
    { name: "초사단_미카엘", text: "ㅋㅋㅋ" },
    { name: "은버들", text: "오늘 방송 재밌네요" },
    { name: "청림호수", text: "다들 반가워요" }
  ];
  var d = 0;
  setInterval(function () {
    if (document.hidden) return;
    add(DEMO[d++ % DEMO.length]);
  }, 3500);

  // 보내기 — Enter 로 보내고 Shift+Enter 는 줄바꿈. 로그아웃 상태면 로그인 화면으로
  var form = fw.querySelector("[data-fchat-form]");
  var input = fw.querySelector("[data-fchat-input]");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (root.getAttribute("data-auth") === "out") {
      location.hash = "login";
      return;
    }
    var text = input.value.trim();
    if (!text) return;
    list.scrollTop = list.scrollHeight;
    add({ name: "토비라마", text: text });
    input.value = "";
    input.dispatchEvent(new Event("input"));
  });
  // 모바일 — 글이 있으면 입력칸 오른쪽 보내기 버튼을 보여줌 (66132:110337)
  input.addEventListener("input", function () {
    form.classList.toggle("has-text", !!this.value.trim());
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  /* 채팅 보이스 (66132:105659) — 후원 팝오버의 목소리 버튼으로 열면 그 팝오버 자리에 목록. ← 로 돌아감,
     줄을 누르면 그 목소리로 바꾸고 돌아감 [구현 제안] */
  var voice = document.getElementById("fvoice");
  var voiceFrom = null;
  function voiceBack(focus) {
    if (voice.hidden) return;
    voice.hidden = true;
    if (voiceFrom) {
      voiceFrom.hidden = false;
      if (focus) voiceFrom.querySelector("[data-donate-voice]").focus();
    }
    voiceFrom = null;
  }
  var voiceBtns = fw.querySelectorAll("[data-donate-voice]");
  for (var vb = 0; vb < voiceBtns.length; vb++) voiceBtns[vb].addEventListener("click", function () {
    voiceFrom = this.closest(".donate");
    voiceFrom.hidden = true;
    voice.hidden = false;
    voice.querySelector('.fvoice__item[aria-pressed="true"]').focus();
  });
  voice.querySelector("[data-fvoice-back]").addEventListener("click", function () { voiceBack(true); });
  var voiceItems = voice.querySelectorAll("[data-fvoice]");
  for (var vi = 0; vi < voiceItems.length; vi++) voiceItems[vi].addEventListener("click", function () {
    var name = this.getAttribute("data-fvoice");
    for (var i = 0; i < voiceItems.length; i++) voiceItems[i].setAttribute("aria-pressed", voiceItems[i] === this ? "true" : "false");
    for (var j = 0; j < voiceBtns.length; j++) voiceBtns[j].querySelector("span").textContent = name;
    voiceBack(true);
  });

  /* 유저 찾기 (66132:107275) — 참여자 수 버튼으로 열고 X · ESC 로 닫음. 검색어가 들어간 이름만 보여줌 */
  var users = document.getElementById("fusers");
  // PC 는 채팅 메뉴의 참여자 수, 모바일은 재생화면 탭 정보의 참여자 수(66132:100461)
  var usersBtns = fw.querySelectorAll("[data-fusers-btn]");
  var usersBtn = usersBtns[0];
  var search = users.querySelector("[data-fusers-search]");
  function usersToggle(open) {
    users.hidden = !open;
    for (var i = 0; i < usersBtns.length; i++) usersBtns[i].setAttribute("aria-expanded", open ? "true" : "false");
    if (open) search.focus();
    else closeUser();
  }
  for (var ub = 0; ub < usersBtns.length; ub++) usersBtns[ub].addEventListener("click", function () {
    usersBtn = this;
    usersToggle(users.hidden);
  });
  users.querySelector("[data-fusers-close]").addEventListener("click", function () {
    usersToggle(false);
    usersBtn.focus();
  });
  search.addEventListener("input", function () {
    var q = this.value.trim().toLowerCase();
    var groups = users.querySelectorAll(".fusers__group");
    var any = false;
    for (var g = 0; g < groups.length; g++) {
      var rows = groups[g].querySelectorAll("li");
      var shown = 0;
      for (var r = 0; r < rows.length; r++) {
        var hit = !q || rows[r].textContent.toLowerCase().indexOf(q) > -1;
        rows[r].hidden = !hit;
        if (hit) shown++;
      }
      groups[g].hidden = !shown;
      if (shown) any = true;
    }
    users.querySelector("[data-fusers-none]").hidden = any;
  });

  /* 유저 팝업 (66132:107341) — 채팅 이름 · 랭킹 · 유저 찾기 줄을 누르면 그 줄 높이에 맞춰 채팅 왼쪽에 띄움.
     X · 바깥 클릭 · ESC 로 닫힘. 팔로우 날짜 · 프로필 사진은 서버 연동 전이라 시안 값 */
  var pop = document.getElementById("fuser");
  var popFrom = null;
  function closeUser(focus) {
    if (pop.hidden) return;
    pop.hidden = true;
    if (popFrom) {
      popFrom.classList.remove("is-on");
      if (focus) popFrom.focus();
    }
    popFrom = null;
  }
  fw.addEventListener("click", function (e) {
    var who = e.target.closest("[data-fuser]");
    if (!who) return;
    var same = popFrom === who;
    closeUser();
    if (same) return;
    popFrom = who;
    who.classList.add("is-on");
    var name = who.querySelector("span, b") || who;
    pop.querySelector("[data-fuser-name]").textContent = name.textContent.trim();
    pop.hidden = false;
    // 모바일은 아래 시트로 뜨고, PC 는 누른 줄 높이에 맞춤 (채팅 칸 안으로)
    if (matchMedia("(min-width: 768px)").matches) {
      var box = chat.getBoundingClientRect();
      var at = who.getBoundingClientRect();
      var top = Math.max(8, Math.min(at.top - box.top - 12, box.height - pop.offsetHeight - 8));
      pop.style.top = top + "px";
    } else pop.style.top = "";
    pop.querySelector("[data-fuser-close]").focus();
  });
  pop.querySelector("[data-fuser-close]").addEventListener("click", function () { closeUser(true); });
  document.addEventListener("click", function (e) {
    if (!pop.hidden && !pop.contains(e.target) && !e.target.closest("[data-fuser]")) closeUser();
  });
  // ESC — 유저 팝업 → 채팅 보이스 → 유저 찾기 순서로 하나씩 닫음 (후원 팝오버 ESC 보다 먼저)
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (!pop.hidden) closeUser(true);
    else if (!voice.hidden) voiceBack(true);
    else if (!users.hidden) {
      usersToggle(false);
      usersBtn.focus();
    } else return;
    e.stopImmediatePropagation();
  }, true);
})();

/* 하단 내비 "내 정보" (65183:65641) — 로그인/로그아웃 × 선택/선택 안 됨 4가지.
   선택: 로그아웃이면 로그인 · 회원가입 화면, 로그인이면 "내 정보"로 여는 모바일 메뉴 드로어가 열려 있을 때.
   "내 정보"가 선택되면 지금 페이지 메뉴(홈 · 라이브 · 크리에이터)의 선택 표시는 끔 */
(function () {
  var root = document.documentElement;
  var account = document.getElementById("bn-account");
  if (!account) return;
  var current = document.querySelector(".bottom-nav__item.is-active:not(#bn-account)");
  var mobile = matchMedia("(max-width: 767px)");
  function sync() {
    var view = root.getAttribute("data-view");
    // data-current: "내 정보" 자체가 지금 페이지 (설정)
    var on = (account.hasAttribute("data-current") && !view) || view === "login" || view === "signup" ||
      (root.getAttribute("data-auth") !== "out" && mobile.matches && root.getAttribute("data-drawer") === "open");
    account.classList.toggle("is-active", on);
    if (current) current.classList.toggle("is-active", !on);
  }
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ["data-view", "data-auth", "data-drawer"] });
  mobile.addEventListener("change", sync);
  sync();
})();

/* PC 알림 팝업 (64686:113964) — GNB 종 아이콘으로 열고 닫음. X · 바깥 클릭 · ESC 로도 닫힘.
   목록은 모바일 알림 화면(#notice-view)과 같은 내용이라 복사해 씀 */
(function () {
  var btn = document.getElementById("notice-btn");
  var pop = document.getElementById("notice-pop");
  if (!btn || !pop) return;
  var body = pop.querySelector("[data-notice-body]");
  var groups = document.querySelectorAll("#notice-view .notice-group");
  for (var i = 0; i < groups.length; i++) {
    var copy = groups[i].cloneNode(true);
    copy.removeAttribute("data-node-id");
    body.appendChild(copy);
  }
  function toggle(open) {
    pop.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  btn.addEventListener("click", function () { toggle(pop.hidden); });
  pop.querySelector("[data-notice-close]").addEventListener("click", function () {
    toggle(false);
    btn.focus();
  });
  document.addEventListener("click", function (e) {
    if (!pop.hidden && !pop.contains(e.target) && !btn.contains(e.target)) toggle(false);
  });
  // 캡처 단계에서 먼저 받아, 영상 상세의 후원 패널처럼 ESC 를 쓰는 다른 화면은 함께 닫히지 않게 함
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !pop.hidden) {
      e.stopImmediatePropagation();
      toggle(false);
      btn.focus();
    }
  }, true);
})();

/* 언어 변경 팝업 (65514:33873) — PC 지구본 아이콘(로그인 · 로그아웃 상태 각각) · 모바일 앱바 언어 아이콘으로 열고 닫음.
   팝업 하나를 누른 아이콘이 있는 헤더로 옮겨, 아이콘 아래 3px · 가운데에 띄움 (화면 밖으로는 8px 안쪽까지).
   바깥 클릭 · ESC 로 닫힘. 번역 기능은 아직 없어 선택 표시만 바꿈 */
(function () {
  var pop = document.getElementById("lang-pop");
  var btns = document.querySelectorAll("[data-lang-btn]");
  if (!pop || !btns.length) return;
  var items = pop.querySelectorAll(".lang-pop__item");
  var owner = null;

  function close() {
    if (pop.hidden) return;
    pop.hidden = true;
    if (owner) owner.setAttribute("aria-expanded", "false");
  }
  function place() {
    var wrap = pop.offsetParent.getBoundingClientRect();
    var r = owner.getBoundingClientRect();
    var w = pop.offsetWidth;
    var left = Math.min(Math.max(r.left + r.width / 2 - w / 2, 8), window.innerWidth - w - 8);
    pop.style.left = left - wrap.left + "px";
    pop.style.top = r.bottom + 3 - wrap.top + "px";
  }
  function open(btn) {
    owner = btn;
    var host = btn.closest(".top-nav__inner, .mo-appbar, .wbar");
    if (host && pop.parentNode !== host) host.appendChild(pop);
    pop.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    place();
  }
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      var same = owner === this && !pop.hidden;
      close();
      if (!same) open(this);
    });
  }
  for (var k = 0; k < items.length; k++) {
    items[k].addEventListener("click", function () {
      for (var j = 0; j < items.length; j++) items[j].setAttribute("aria-checked", items[j] === this ? "true" : "false");
      close();
      owner.focus();
    });
  }
  document.addEventListener("click", function (e) {
    if (!pop.hidden && !pop.contains(e.target) && !owner.contains(e.target)) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !pop.hidden) {
      e.stopImmediatePropagation();
      close();
      owner.focus();
    }
  }, true);
  // 영상 상세 더보기 메뉴의 "언어 변경"에서 ⋮ 버튼 아래로 엶
  window.funOpenLangPop = function (btn) {
    close();
    open(btn);
  };
  // 창 폭이 바뀌면 아이콘 위치도 바뀌므로 다시 맞춤
  // PC ↔ 모바일 폭을 넘어가 누른 아이콘이 사라지면 닫음
  window.addEventListener("resize", function () {
    if (pop.hidden) return;
    if (owner.offsetParent) place();
    else close();
  });
})();

/* GNB 아이콘 호버 레이어 — data-tooltip 이 있는 버튼에 마우스를 올리면 바로 띄우고, 벗어나면 닫음.
   body 에 붙인 레이어 하나를 버튼 아래 가운데로 옮겨 씀. 키보드 포커스에서도 같은 레이어 표시 */
(function () {
  var targets = document.querySelectorAll("[data-tooltip]");
  if (!targets.length) return;
  var layer = document.createElement("div");
  layer.className = "hover-layer";
  layer.setAttribute("role", "tooltip");
  layer.hidden = true;
  document.body.appendChild(layer);
  var current = null;

  function show(el) {
    // 알림 팝업처럼 버튼이 연 창이 떠 있으면 겹치지 않게 띄우지 않음
    if (el.getAttribute("aria-expanded") === "true") return hide();
    current = el;
    layer.textContent = el.getAttribute("data-tooltip");
    layer.hidden = false;
    // 버튼(48px) 대신 보이는 아이콘 그림(24px) 기준으로 아래 10px 에 띄움
    var icon = el.querySelector("img") || el;
    var r = icon.getBoundingClientRect();
    var w = layer.offsetWidth;
    // 화면 밖으로 나가지 않게 좌우 8px 안쪽으로 맞춤
    var left = Math.min(Math.max(r.left + r.width / 2 - w / 2, 8), window.innerWidth - w - 8);
    layer.style.left = left + "px";
    layer.style.top = r.bottom + 10 + "px";
  }
  function hide() {
    current = null;
    layer.hidden = true;
  }

  for (var i = 0; i < targets.length; i++) {
    targets[i].addEventListener("mouseenter", function () { show(this); });
    targets[i].addEventListener("mouseleave", hide);
    targets[i].addEventListener("focus", function () {
      if (this.matches(":focus-visible")) show(this);
    });
    targets[i].addEventListener("blur", hide);
    // 누르면 팝업 등이 열리므로 일단 닫고, 마우스가 남아 있으면 바뀐 상태에 맞춰 다시 판단
    targets[i].addEventListener("click", function () {
      var el = this;
      hide();
      setTimeout(function () { if (el.matches(":hover")) show(el); }, 0);
    });
  }
  // 레이어는 화면 고정 위치라 스크롤·크기 변경 시 버튼과 어긋나지 않게 닫음
  window.addEventListener("scroll", function () { if (current) hide(); }, { passive: true });
  window.addEventListener("resize", function () { if (current) hide(); });
})();

// 서비스 소개 — WHY FUNNATION 카드 캐러셀 (화살표 · 점 · 좌우 밀기)
(function () {
  var root = document.querySelector("[data-about-carousel]");
  if (!root) return;
  var track = root.querySelector("[data-carousel-track]");
  var cards = track.children;
  var dots = root.querySelectorAll("[data-carousel-dot]");
  var prev = root.querySelector("[data-carousel-prev]");
  var next = root.querySelector("[data-carousel-next]");
  var index = 0;

  // 시안은 첫 카드에서도 양쪽 화살표가 모두 켜져 있음 — 끝에서 처음으로 돌아감
  function go(i) {
    index = (i + cards.length) % cards.length;
    track.style.setProperty("--index", index);
    for (var c = 0; c < cards.length; c++) {
      cards[c].classList.toggle("is-active", c === index);
      cards[c].classList.toggle("is-before", c < index);
      cards[c].setAttribute("aria-hidden", c === index ? "false" : "true");
    }
    for (var d = 0; d < dots.length; d++) {
      dots[d].classList.toggle("is-active", d === index);
      dots[d].setAttribute("aria-current", d === index ? "true" : "false");
    }
  }

  prev.addEventListener("click", function () { go(index - 1); });
  next.addEventListener("click", function () { go(index + 1); });
  for (var d = 0; d < dots.length; d++) {
    dots[d].addEventListener("click", (function (n) { return function () { go(n); }; })(d));
  }
  // 옆에 걸친 카드를 누르면 그 카드로
  for (var c = 0; c < cards.length; c++) {
    cards[c].addEventListener("click", (function (n) { return function () { if (n !== index) go(n); }; })(c));
  }

  // 터치로 좌우 밀기 — 40px 넘게 밀면 넘김
  var startX = null;
  track.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    startX = null;
    var to = index + (dx < 0 ? 1 : -1);
    if (Math.abs(dx) > 40 && to >= 0 && to < cards.length) go(to);
  });

  go(0);
})();

/* 준비 중 메뉴 (LNB 크리에이터 랭킹 등) — 이동하지 않고 알림만 띄움. data-coming-soon 을 단 링크·버튼 공통 */
document.addEventListener("click", function (e) {
  var el = e.target.closest("[data-coming-soon]");
  if (!el) return;
  e.preventDefault();
  alert("서비스 준비 중입니다.");
});

/* ============================================================
   설정 (settings.html · Figma 66318:13684) — 계정 · 알림 · 보안 탭, 모달 · 시트 · 토스트.
   서버 연동 전이라 저장 · 연결 · 탈퇴는 화면 상태만 바꿈
   ============================================================ */
(function () {
  var page = document.querySelector(".page--settings");
  if (!page) return;
  var mobile = matchMedia("(max-width: 767px)");

  /* ---------- 토스트 (3초) ---------- */
  var toastEl = document.querySelector(".st-toast");
  var toastTimer;
  function toast(text) {
    toastEl.querySelector("[data-toast-text]").textContent = text;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 3000);
  }

  /* ---------- 모달 · 시트 ---------- */
  var openStack = [];
  function openLayer(id, opener) {
    var el = document.getElementById(id);
    if (!el) return;
    // 시트에서 모달을 열면 시트는 닫고 모달만
    if (openStack.length && el.classList.contains("st-modal")) {
      var top = openStack[openStack.length - 1];
      if (top.el.classList.contains("st-sheet")) closeLayer(true);
    }
    el.hidden = false;
    openStack.push({ el: el, opener: opener || document.activeElement });
    var f = el.querySelector(".st-modal__btn--primary, .st-modal__btn--danger, .st-modal__btn, .st-sheet__item, .st-seg__item");
    if (f) f.focus();
  }
  function closeLayer(keepFocus) {
    var item = openStack.pop();
    if (!item) return;
    item.el.hidden = true;
    if (!keepFocus && item.opener && item.opener.focus) item.opener.focus();
  }
  document.addEventListener("click", function (e) {
    var op = e.target.closest("[data-modal-open], [data-sheet-open]");
    if (op && !op.disabled) {
      e.preventDefault();
      openLayer(op.getAttribute("data-modal-open") || op.getAttribute("data-sheet-open"), op);
      return;
    }
    if (e.target.closest("[data-modal-close]")) { closeLayer(); return; }
    // 어두운 바깥을 누르면 닫힘
    if (e.target.classList && (e.target.classList.contains("st-modal") || e.target.classList.contains("st-sheet"))) closeLayer();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && openStack.length) closeLayer();
  });

  /* ---------- 탭 (#account · #notify · #security) ---------- */
  var tabs = page.querySelectorAll("[data-settings-tab]");
  var panels = page.querySelectorAll("[data-settings-panel]");
  var pendingLeave = null; // 저장 안 한 변경이 있을 때 "나가기" 뒤 할 일
  function show(name) {
    if (!page.querySelector('[data-settings-panel="' + name + '"]')) name = "account";
    for (var i = 0; i < tabs.length; i++) {
      var on = tabs[i].getAttribute("data-settings-tab") === name;
      tabs[i].classList.toggle("subnav__tab--active", on);
      tabs[i].setAttribute("aria-selected", on ? "true" : "false");
      if (on) tabs[i].setAttribute("aria-current", "page"); else tabs[i].removeAttribute("aria-current");
    }
    for (var j = 0; j < panels.length; j++) panels[j].hidden = panels[j].getAttribute("data-settings-panel") !== name;
  }
  function currentTab() { return location.hash.replace("#", "") || "account"; }
  for (var t = 0; t < tabs.length; t++) {
    tabs[t].addEventListener("click", function (e) {
      e.preventDefault();
      var name = this.getAttribute("data-settings-tab");
      if (name === currentTab()) return;
      var go = function () { history.replaceState(null, "", "#" + name); show(name); };
      if (isDirty()) { pendingLeave = function () { resetAccount(); go(); }; openLayer("unsaved-modal", this); }
      else go();
    });
  }
  window.addEventListener("hashchange", function () { show(currentTab()); });
  show(currentTab());

  /* ---------- 계정 ---------- */
  var nickInput = page.querySelector("[data-nickname-input]");
  var nickBtn = page.querySelector("[data-nickname-change]");
  var bio = page.querySelector("[data-bio-input]");
  var bioCount = page.querySelector("[data-bio-count]");
  var saved = { nick: nickInput.value, bio: bio.value };
  function isDirty() { return bio.value !== saved.bio || nickInput.value.trim() !== saved.nick; }
  function resetAccount() { bio.value = saved.bio; nickInput.value = saved.nick; syncNick(); syncBio(); }
  function syncNick() { var v = nickInput.value.trim(); nickBtn.disabled = !v || v === saved.nick; }
  function syncBio() { bioCount.textContent = bio.value.length; }
  nickInput.addEventListener("input", syncNick);
  bio.addEventListener("input", syncBio);
  nickBtn.addEventListener("click", function () {
    document.querySelector("[data-nickname-from]").textContent = saved.nick;
    document.querySelector("[data-nickname-to]").textContent = nickInput.value.trim();
    openLayer("nickname-modal", nickBtn);
  });
  document.querySelector("[data-nickname-confirm]").addEventListener("click", function () {
    saved.nick = nickInput.value.trim();
    nickInput.value = saved.nick;
    var labels = document.querySelectorAll("[data-nickname-label], .profile__name");
    for (var i = 0; i < labels.length; i++) labels[i].textContent = saved.nick;
    syncNick();
    closeLayer();
    toast("변경사항을 저장했어요.");
  });
  page.querySelector("[data-account-save]").addEventListener("click", function () {
    saved.bio = bio.value;
    toast("변경사항을 저장했어요.");
  });
  // 프로필 사진 — 고른 파일을 바로 미리 보여 줌 / 삭제하면 기본 이미지
  var photoImgs = page.querySelectorAll("[data-profile-img]");
  function setPhoto(src, isDefault) {
    for (var i = 0; i < photoImgs.length; i++) {
      photoImgs[i].src = src;
      photoImgs[i].parentNode.classList.toggle("is-default", !!isDefault);
    }
  }
  var photoInputs = document.querySelectorAll("[data-photo-input]");
  for (var p = 0; p < photoInputs.length; p++) {
    photoInputs[p].addEventListener("change", function () {
      var file = this.files && this.files[0];
      this.value = "";
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () { setPhoto(reader.result, false); };
      reader.readAsDataURL(file);
      if (openStack.length) closeLayer(true);
      toast("변경사항을 저장했어요.");
    });
  }
  document.querySelector("[data-photo-delete]").addEventListener("click", function () {
    setPhoto("assets/imgAccountCircle.svg", true);
    closeLayer();
  });
  // 저장 안 하고 홈으로 나가기
  var back = page.querySelector("[data-settings-leave]");
  back.addEventListener("click", function (e) {
    if (!isDirty() || currentTab() !== "account") return;
    e.preventDefault();
    var href = this.href;
    pendingLeave = function () { location.href = href; };
    openLayer("unsaved-modal", this);
  });
  document.querySelector("[data-unsaved-leave]").addEventListener("click", function () {
    closeLayer(true);
    if (pendingLeave) pendingLeave();
    pendingLeave = null;
  });

  /* ---------- 알림 — 바꾸면 바로 저장 ---------- */
  function notifySaved() { toast("알림 설정을 저장했어요."); }
  var table = page.querySelector("[data-notify-table]");
  var appNote = page.querySelector("[data-app-off-note]");
  function syncApp(on) {
    table.classList.toggle("is-app-off", !on);
    appNote.hidden = on;
    var cells = table.querySelectorAll('.st-check[data-col="app"]');
    for (var i = 0; i < cells.length; i++) {
      if (on) cells[i].removeAttribute("aria-disabled"); else cells[i].setAttribute("aria-disabled", "true");
    }
  }
  var dndSwitches = page.querySelectorAll("[data-dnd-switch]");
  var timeBtns = page.querySelectorAll("[data-time-btn]");
  function syncDnd(on) {
    for (var i = 0; i < dndSwitches.length; i++) dndSwitches[i].setAttribute("aria-checked", on ? "true" : "false");
    for (var j = 0; j < timeBtns.length; j++) timeBtns[j].disabled = !on;
  }
  page.addEventListener("click", function (e) {
    var sw = e.target.closest(".st-switch");
    if (sw) {
      var on = sw.getAttribute("aria-checked") !== "true";
      sw.setAttribute("aria-checked", on ? "true" : "false");
      if (sw.getAttribute("data-channel") === "app") syncApp(on);
      if (sw.hasAttribute("data-dnd-switch")) syncDnd(on);
      if (sw.hasAttribute("data-notify-change")) notifySaved();
      return;
    }
    var ck = e.target.closest(".st-check");
    if (ck && ck.getAttribute("aria-disabled") !== "true") {
      ck.setAttribute("aria-checked", ck.getAttribute("aria-checked") === "true" ? "false" : "true");
      notifySaved();
    }
  });
  syncApp(page.querySelector('[data-channel="app"]').getAttribute("aria-checked") === "true");

  // 방해금지 시간 — 0~47 (30분 단위)
  var times = { start: 44, end: 16 };
  // 입력칸은 "오전 08:00", 드롭다운 목록은 "오후 9:00" (시안 66318:17170)
  function label(i, noPad) {
    var h = Math.floor(i / 2), m = i % 2 ? "30" : "00";
    var ampm = h < 12 ? "오전" : "오후";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return ampm + " " + (h12 < 10 && !noPad ? "0" + h12 : h12) + ":" + m;
  }
  function renderTimes() {
    ["start", "end"].forEach(function (k) {
      var els = document.querySelectorAll('[data-time-value="' + k + '"], [data-seg-value="' + k + '"]');
      for (var i = 0; i < els.length; i++) els[i].textContent = label(times[k]);
    });
    page.querySelector("[data-dnd-summary]").textContent = "매일 " + label(times.start) + " ~ " + label(times.end);
  }
  // PC 드롭다운
  var menus = page.querySelectorAll("[data-time-menu]");
  function closeMenus() {
    for (var i = 0; i < menus.length; i++) menus[i].hidden = true;
    for (var j = 0; j < timeBtns.length; j++) timeBtns[j].setAttribute("aria-expanded", "false");
  }
  function openMenu(key, btn) {
    var menu = page.querySelector('[data-time-menu="' + key + '"]');
    var html = "";
    for (var i = 0; i < 48; i++) html += '<li role="option" data-i="' + i + '" aria-selected="' + (i === times[key]) + '">' + label(i, true) + "</li>";
    menu.innerHTML = html;
    closeMenus();
    menu.hidden = false;
    btn.setAttribute("aria-expanded", "true");
    var sel = menu.querySelector('[aria-selected="true"]');
    menu.scrollTop = sel.offsetTop - 6 - 72;
    menu.onclick = function (e) {
      var li = e.target.closest("li");
      if (!li) return;
      times[key] = +li.getAttribute("data-i");
      renderTimes();
      closeMenus();
      btn.focus();
      notifySaved();
    };
  }
  for (var tb = 0; tb < timeBtns.length; tb++) {
    timeBtns[tb].addEventListener("click", function (e) {
      e.stopPropagation();
      var key = this.getAttribute("data-time-btn");
      if (mobile.matches) { openSheet(key, this); return; }
      if (this.getAttribute("aria-expanded") === "true") closeMenus(); else openMenu(key, this);
    });
  }
  document.addEventListener("click", function (e) { if (!e.target.closest(".st-menu")) closeMenus(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenus(); });

  // 모바일 시간 시트 — 오전/오후 · 시 · 분 휠 (스크롤 스냅)
  var draft = { start: 0, end: 0 }, seg = "start";
  var cols = {
    ampm: document.querySelector('[data-wheel-col="ampm"]'),
    hour: document.querySelector('[data-wheel-col="hour"]'),
    min: document.querySelector('[data-wheel-col="min"]')
  };
  cols.ampm.innerHTML = "<li>오전</li><li>오후</li>";
  var hh = ""; for (var h = 1; h <= 12; h++) hh += "<li>" + h + "</li>";
  cols.hour.innerHTML = hh;
  cols.min.innerHTML = "<li>00</li><li>30</li>";
  function colIndex(col) { return Math.max(0, Math.min(col.children.length - 1, Math.round(col.scrollTop / 48))); }
  function markCol(col) {
    var idx = colIndex(col);
    for (var i = 0; i < col.children.length; i++) col.children[i].classList.toggle("is-on", i === idx);
  }
  function wheelValue() {
    var pm = colIndex(cols.ampm) === 1, h12 = colIndex(cols.hour) + 1, half = colIndex(cols.min);
    var h24 = (h12 % 12) + (pm ? 12 : 0);
    return h24 * 2 + half;
  }
  function setWheel(i) {
    var h = Math.floor(i / 2);
    cols.ampm.scrollTop = (h >= 12 ? 1 : 0) * 48;
    cols.hour.scrollTop = ((h % 12 === 0 ? 12 : h % 12) - 1) * 48;
    cols.min.scrollTop = (i % 2) * 48;
    Object.keys(cols).forEach(function (k) { markCol(cols[k]); });
  }
  Object.keys(cols).forEach(function (k) {
    var col = cols[k];
    col.addEventListener("scroll", function () {
      markCol(col);
      draft[seg] = wheelValue();
      document.querySelector('[data-seg-value="' + seg + '"]').textContent = label(draft[seg]);
    });
    col.addEventListener("click", function (e) {
      var li = e.target.closest("li");
      if (li) col.scrollTo({ top: Array.prototype.indexOf.call(col.children, li) * 48, behavior: "smooth" });
    });
  });
  var segBtns = document.querySelectorAll("[data-seg]");
  function selectSeg(key) {
    seg = key;
    for (var i = 0; i < segBtns.length; i++) segBtns[i].setAttribute("aria-selected", segBtns[i].getAttribute("data-seg") === key ? "true" : "false");
    setWheel(draft[key]);
  }
  for (var sb = 0; sb < segBtns.length; sb++) segBtns[sb].addEventListener("click", function () { selectSeg(this.getAttribute("data-seg")); });
  function openSheet(key, opener) {
    draft.start = times.start; draft.end = times.end;
    renderTimes();
    openLayer("time-sheet", opener);
    selectSeg(key);
  }
  document.querySelector("[data-time-sheet-ok]").addEventListener("click", function () {
    times.start = draft.start; times.end = draft.end;
    renderTimes();
    closeLayer();
    notifySaved();
  });
  renderTimes();

  /* ---------- 보안 ---------- */
  var pwForm = page.querySelector("[data-pw-form]");
  var pwInputs = pwForm.querySelectorAll("[data-pw-input]");
  var pwSubmit = pwForm.querySelector("[data-pw-submit]");
  var pwMismatch = pwForm.querySelector("[data-pw-mismatch]");
  function syncPw() {
    var a = pwInputs[0].value, b = pwInputs[1].value, c = pwInputs[2].value;
    var mismatch = !!c && b !== c;
    pwMismatch.hidden = !mismatch;
    pwSubmit.disabled = !a || !b || !c || mismatch;
  }
  for (var pi = 0; pi < pwInputs.length; pi++) pwInputs[pi].addEventListener("input", syncPw);
  pwForm.addEventListener("click", function (e) {
    var eye = e.target.closest(".st-eye");
    if (!eye) return;
    var input = eye.parentNode.querySelector("input");
    var show = input.type === "password";
    input.type = show ? "text" : "password";
    eye.setAttribute("aria-pressed", show ? "true" : "false");
    eye.setAttribute("aria-label", show ? "비밀번호 숨기기" : "비밀번호 보기");
  });
  pwForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (pwSubmit.disabled) return;
    pwForm.reset();
    syncPw();
    openLayer("pw-done-modal", pwSubmit);
  });

  // 로그인 연결 계정 — 연결하기 ↔ 연결 해제(확인 모달)
  var unlinkRow = null;
  page.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-sns-btn]");
    if (!btn) return;
    var row = btn.closest("[data-sns]");
    var name = row.getAttribute("data-sns-name");
    if (row.classList.contains("is-linked")) {
      unlinkRow = row;
      var slots = document.querySelectorAll("[data-sns-name-slot]");
      for (var i = 0; i < slots.length; i++) slots[i].textContent = name;
      openLayer("sns-unlink-modal", btn);
    } else {
      row.classList.add("is-linked");
      row.querySelector("[data-sns-state]").textContent = "연결됨";
      btn.textContent = "연결 해제";
      toast(name + " 계정을 연결했어요.");
    }
  });
  document.querySelector("[data-sns-unlink]").addEventListener("click", function () {
    if (unlinkRow) {
      unlinkRow.classList.remove("is-linked");
      unlinkRow.querySelector("[data-sns-state]").textContent = "연결 안 됨";
      unlinkRow.querySelector("[data-sns-btn]").textContent = "연결하기";
    }
    closeLayer();
  });
  // 연결된 서비스 끊기
  document.querySelector("[data-app-unlink]").addEventListener("click", function () {
    var row = page.querySelector("[data-app-row]");
    if (row) row.remove();
    page.querySelector("[data-apps-empty]").hidden = false;
    closeLayer(true);
  });

  // 회원 탈퇴 — '탈퇴합니다' 그대로 입력해야 버튼이 켜짐
  var leaveInput = page.querySelector("[data-leave-input]");
  var leaveBtn = page.querySelector("[data-leave-submit]");
  leaveInput.addEventListener("input", function () { leaveBtn.disabled = leaveInput.value.trim() !== "탈퇴합니다"; });
  document.querySelector("[data-leave-confirm]").addEventListener("click", function () {
    closeLayer(true);
    openLayer("leave-done-modal");
  });

  /* ---------- 모바일 짧은 안내 문구 (placeholder) ---------- */
  var phs = page.querySelectorAll("[data-mo-placeholder]");
  for (var q = 0; q < phs.length; q++) phs[q].setAttribute("data-pc-placeholder", phs[q].placeholder);
  function syncPh() {
    for (var i = 0; i < phs.length; i++) phs[i].placeholder = phs[i].getAttribute(mobile.matches ? "data-mo-placeholder" : "data-pc-placeholder");
  }
  mobile.addEventListener("change", syncPh);
  syncPh();
})();

/* GNB 사람 아이콘 "내 정보" (PC) — 내 정보 페이지로 이동 */
(function () {
  var btns = document.querySelectorAll('.top-nav .nav-icon[aria-label="내 정보"]');
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      if (!document.querySelector(".page--profile")) location.href = "profile.html";
    });
  }
})();

/* 내 정보 (profile.html · Figma "내 정보" 보드 66398:153864) — 확인 모달 · 표시 토글(바로 저장 + 토스트) · 다음 등급 미리보기 */
(function () {
  var page = document.querySelector(".page--profile");
  if (!page) return;
  var root = document.documentElement;
  var lastFocus = null;

  function openModal(id) {
    var m = document.getElementById(id);
    if (!m) return;
    lastFocus = document.activeElement;
    m.hidden = false;
    var b = m.querySelector("button");
    if (b) b.focus();
  }
  function closeModals() {
    var open = document.querySelectorAll(".st-modal:not([hidden])");
    for (var i = 0; i < open.length; i++) open[i].hidden = true;
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener("click", function (e) {
    var opener = e.target.closest("[data-modal-open]");
    if (opener) { e.preventDefault(); openModal(opener.getAttribute("data-modal-open")); return; }
    if (e.target.closest("[data-modal-close]") || e.target.classList.contains("st-modal")) closeModals();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.querySelector(".st-modal:not([hidden])")) closeModals();
  });

  // 로그아웃 — 화면 로그인 상태만 끄고 홈으로
  var logout = document.querySelector("[data-logout-confirm]");
  if (logout) logout.addEventListener("click", function () {
    closeModals();
    var auth = document.getElementById("auth-btn");
    if (auth && root.getAttribute("data-auth") !== "out") auth.click();
    location.href = "index.html";
  });
  // 크리에이터 화면 — 크리에이터 화면은 아직 없어 닫고 토스트만
  var creator = document.querySelector("[data-creator-confirm]");
  if (creator) creator.addEventListener("click", function () {
    closeModals();
    toast("크리에이터 화면은 준비 중이에요.");
  });

  var toastEl = document.querySelector(".st-toast");
  var toastTimer;
  function toast(text) {
    if (!toastEl) return;
    toastEl.querySelector("[data-toast-text]").textContent = text;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 3000);
  }

  var switches = page.querySelectorAll("[data-profile-switch]");
  for (var i = 0; i < switches.length; i++) {
    switches[i].addEventListener("click", function () {
      var on = this.getAttribute("aria-checked") !== "true";
      this.setAttribute("aria-checked", on ? "true" : "false");
      var name = this.getAttribute("data-profile-switch");
      var code = name.charCodeAt(name.length - 1) - 0xac00;
      var josa = code >= 0 && code < 11172 && code % 28 === 0 ? "를" : "을";
      toast(name + josa + (on ? " 켰어요." : " 껐어요."));
    });
  }

  // 다음 등급 미리보기 — VIP → VVIP 모습, 되돌리기로 복귀
  var card = page.querySelector("[data-grade-card]");
  if (!card) return;
  var q = function (s) { return card.querySelector(s); };
  var steps = card.querySelectorAll(".grade-step");
  var states = {
    now: { name: "VIP", recent: "최근 30일 300,000원", fill: "23%", from: "VIP", pct: "23%", to: "VVIP",
      next: "다음 등급까지 <strong>999,000원</strong> 후원 필요", benefit: "후원 알림에 VIP 배지 · 채팅 닉네임 반짝임", cur: 1 },
    preview: { name: "VVIP", recent: "최근 30일 1,299,000원부터", fill: "100%", from: "VIP", pct: "100%", to: "VVIP",
      next: "VVIP 달성 시 이렇게 보여요.", benefit: "후원 알림에 VVIP 배지 · 입장 알림 강조 · 채팅 닉네임 반짝임", cur: 2 }
  };
  function show(key) {
    var s = states[key];
    var preview = key === "preview";
    card.classList.toggle("is-preview", preview);
    q("[data-grade-name]").textContent = s.name;
    q("[data-grade-preview-badge]").hidden = !preview;
    q("[data-grade-recent]").textContent = s.recent;
    q("[data-grade-fill]").style.width = s.fill;
    q("[data-grade-from]").textContent = s.from;
    q("[data-grade-pct]").textContent = s.pct;
    q("[data-grade-to]").textContent = s.to;
    q("[data-grade-next]").innerHTML = s.next;
    q("[data-grade-benefit]").textContent = s.benefit;
    q("[data-grade-reset]").hidden = !preview;
    q("[data-grade-preview]").hidden = preview;
    for (var j = 0; j < steps.length; j++) {
      steps[j].classList.toggle("is-done", j < s.cur);
      steps[j].classList.toggle("is-current", j === s.cur);
      var dot = steps[j].querySelector(".grade-step__dot");
      dot.innerHTML = j < s.cur ? '<img src="assets/v2/profile/check-12.svg" width="12" height="12" alt="">'
        : j > s.cur ? '<img src="assets/v2/profile/lock-12.svg" width="12" height="12" alt="">' : "";
    }
  }
  q("[data-grade-preview]").addEventListener("click", function () { show("preview"); });
  q("[data-grade-reset]").addEventListener("click", function () { show("now"); });
})();

/* 개인 방송국 진입 — 크리에이터 찾기 카드, 영상 목록 · 영상 상세의 방송인 사진 · 이름을 누르면 방송국(station.html)으로.
   카드 전체 링크(영상 재생)보다 먼저 받아서 영상으로 넘어가지 않게 캡처 단계에서 처리 */
(function () {
  var SEL = ".creator-card__thumb, .creator-card__name, .winfo__pic, .winfo__name, .wbar__pic, .fbar__channel img, .card__avatar, .card__channel, .fav-card__avatar, .fav-card__channel";
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest(SEL);
    if (!t) return;
    e.preventDefault();
    e.stopPropagation();
    location.href = "station.html";
  }, true);
})();

/* ============================================================
   이벤트 (events.html · Figma 66606:178434) — 진행 중 / 종료 탭(#ongoing · #ended), 카드 목록, 빈 화면.
   서버 연동 전 샘플: 진행 중 9개(시안 그대로) · 종료 0개(→ 빈 화면 66606:181952).
   카드 · 자세히 보기는 상세 페이지 준비 전이라 "준비 중" 알림
   ============================================================ */
(function () {
  var page = document.querySelector(".page--events");
  if (!page) return;

  var ONGOING = [
    ["card-01", "12.01 ~ 12.25", "크리스마스 홀리데이 라이브", "따뜻한 연말 밤, 크리에이터와 함께 라이브를 즐겨보세요."],
    ["card-02", "11.20 ~ 12.25", "크리스마스 트리 꾸미기", "후원 하트를 모아 우리만의 크리스마스 트리를 완성해보세요."],
    ["card-03", "11.10 ~ 12.10", "나의 새로운 최애 찾기", "취향 맞춤 추천으로 새로운 크리에이터를 만나보세요."],
    ["card-04", "12.05 ~ 12.31", "윈터 시티 라이브 페스타", "도심 대형 스크린에서 펼쳐지는 겨울 라이브 축제에 참여하세요."],
    ["card-05", "11.25 ~ 12.20", "눈사람 노래자랑", "크리에이터의 무대에 투표하고 특별한 선물을 받아가세요."],
    ["card-06", "11.02 ~ 12.25", "연말 선물상자 대잔치", "미션 완료하고 매일 열리는 선물상자 혜택을 받아보세요."],
    ["card-07", "12.10 ~ 12.24", "산타 게이머 챌린지", "게임 크리에이터와 함께하는 크리스마스 챌린지에 도전하세요."],
    ["card-08", "12.01 ~ 12.31", "겨울 출석체크 이벤트", "매일 출석하고 스탬프를 모아 따뜻한 보상을 받아가세요."],
    ["card-09", "12.26 ~ 12.31", "카운트다운 라이브 페스티벌", "크리에이터들과 함께 2027년 새해를 맞이해보세요."]
  ];
  var ENDED = [];
  var TABS = {
    ongoing: { title: "진행 중인 이벤트", empty: "진행 중인 이벤트가 없습니다.", list: ONGOING, status: "진행중", hero: true },
    ended: { title: "종료된 이벤트", empty: "종료된 이벤트가 없습니다.", list: ENDED, status: "종료", hero: false }
  };

  var hero = document.getElementById("event-hero");
  var grid = document.getElementById("event-grid");
  var empty = document.getElementById("event-empty");
  var emptyText = document.getElementById("event-empty-text");
  var title = document.getElementById("event-list-title");
  var tabs = page.querySelectorAll("[data-event-tab]");

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function render() {
    var key = location.hash.replace("#", "");
    if (!TABS[key]) key = "ongoing";
    var t = TABS[key];
    tabs.forEach(function (a) {
      var on = a.getAttribute("data-event-tab") === key;
      a.classList.toggle("subnav__tab--active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    title.textContent = t.title;
    hero.hidden = !(t.hero && t.list.length);
    grid.innerHTML = t.list.map(function (e) {
      return '<a class="event-card" href="#" data-coming-soon>' +
        '<span class="event-card__thumb"><img src="assets/v2/event/' + e[0] + '.webp" width="1792" height="768" alt="" loading="lazy"></span>' +
        '<span class="event-card__body">' +
          '<span class="event-card__meta"><span class="event-card__status">' + t.status + '</span><span class="event-card__date">' + esc(e[1]) + '</span></span>' +
          '<span class="event-card__text"><strong class="event-card__title">' + esc(e[2]) + '</strong><span class="event-card__desc">' + esc(e[3]) + '</span></span>' +
        '</span></a>';
    }).join("");
    grid.hidden = !t.list.length;
    empty.hidden = !!t.list.length;
    emptyText.textContent = t.empty;
  }

  window.addEventListener("hashchange", render);
  render();
})();

/* ============================================================
   지갑 충전내역 — 건수에 따른 표 상태 (2026-11 시안).
   7줄보다 적으면 빈 줄(선만)로 채우고(65571:45287), 0건이면 "내역이 없습니다."(65571:45179) · 페이지 1 · "0건".
   서버 연동 전이라 미리보기용: wallet.html#one(1건) · #empty(0건). 그 외는 샘플 7줄 그대로
   ============================================================ */
(function () {
  var page = document.querySelector(".page--wallet");
  if (!page) return;
  var tbody = page.querySelector(".wallet-table tbody");
  var count = page.querySelector(".wallet-count");
  var pager = page.querySelector(".wallet-pager .pager");
  if (!tbody || !count || !pager) return;
  var ROWS = 7;
  var original = Array.prototype.slice.call(tbody.rows);
  var pagerHTML = pager.innerHTML;
  var countText = count.textContent;

  function blankRow() {
    var tr = document.createElement("tr");
    tr.className = "wallet-table__blank";
    tr.setAttribute("aria-hidden", "true");
    for (var i = 0; i < 8; i++) tr.appendChild(document.createElement("td"));
    return tr;
  }

  function onePage() {
    pager.innerHTML = pagerHTML;
    pager.querySelectorAll(".pager__num").forEach(function (b, i) { if (i) b.remove(); });
    pager.querySelectorAll(".pager__arrow").forEach(function (b) { b.disabled = true; });
  }

  function render() {
    var mode = location.hash.replace("#", "");
    var rows = mode === "empty" ? [] : mode === "one" ? original.slice(0, 1) : original;
    tbody.innerHTML = "";
    if (!rows.length) {
      tbody.innerHTML = '<tr class="wallet-table__empty"><td colspan="8">내역이 없습니다.</td></tr>';
      count.textContent = "0건";
      onePage();
      return;
    }
    rows.forEach(function (r) { tbody.appendChild(r); });
    for (var i = rows.length; i < ROWS; i++) tbody.appendChild(blankRow());
    if (rows.length === original.length) {
      count.textContent = countText;
      pager.innerHTML = pagerHTML;
    } else {
      count.textContent = rows.length + "건";
      onePage();
    }
  }

  window.addEventListener("hashchange", function () {
    if (/^#(one|empty)?$/.test(location.hash)) render();
  });
  render();
})();

/* ============================================================
   크리에이터 찾기 — 검색 (creators.html). 서버 연동 전이라 화면의 카드 이름으로 거름.
   맞는 카드가 없으면 "검색결과가 없습니다." (66606:182395). 검색어를 지우면 전체로 돌아감
   ============================================================ */
(function () {
  var form = document.getElementById("creators-search");
  var empty = document.getElementById("creators-empty");
  var grid = document.querySelector(".creator-grid");
  if (!form || !empty || !grid) return;
  var input = form.querySelector("input");
  var cards = Array.prototype.slice.call(grid.querySelectorAll(".creator-card"));

  function run() {
    var q = input.value.trim().toLowerCase().replace(/\s+/g, "");
    var shown = 0;
    cards.forEach(function (c) {
      var name = (c.querySelector(".creator-card__name") || {}).textContent || "";
      var hit = !q || name.toLowerCase().replace(/\s+/g, "").indexOf(q) > -1;
      c.hidden = !hit;
      if (hit) shown++;
    });
    grid.hidden = !shown;
    empty.hidden = !!shown;
  }
  form.addEventListener("submit", function (e) { e.preventDefault(); run(); });
  /* 지우기(×) · 빈 값이면 바로 전체 복귀 */
  input.addEventListener("input", function () { if (!input.value.trim()) run(); });
})();
