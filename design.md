# 펀네이션 v2.0 — 디자인 구현 규칙

기준일: 2026-10-27  
대상: 펀네이션 v2.0 디자인 시스템 + 홈 UI  
테마: Dark

이 문서는 UI 구현 시 항상 적용할 핵심 디자인 규칙이다.

전체 색상 토큰, 전체 텍스트 스타일, 세부 Figma 실측값과 원본 차이는 `design-reference.md`를 필요한 경우 확인한다.

---

# 1. 기준 Figma

## 디자인 시스템

https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/펀네이션-v2.0?node-id=64800-100375

## 홈 화면

https://www.figma.com/design/7zkpaY37QfFiFvikeX9P6J/펀네이션-v2.0?node-id=65092-44587

## 주요 기준 프레임

PC Home

- 로그인 상태 프레임: `65161:72175`
- 지갑·스튜디오 상태 프레임: `65183:66457`

Mobile Home

- `65183:130577`

공통 스타일은 디자인 시스템의 Theme / Font / Spacing / Layout을 따른다.

실제 화면 배치와 화면별 override는 Home 프레임을 따른다.

---

# 2. 적용 우선순위

디자인을 적용할 때 아래 순서를 따른다.

1. 기존 코드 구조 확인
2. 폰트
3. 색상
4. 스페이싱
5. radius
6. 공통 UI 요소
7. GNB / LNB
8. Hero
9. 퀵카드
10. 콘텐츠 카드
11. Footer
12. 모바일
13. 실제 브라우저 검수

기존 기능과 DOM 구조를 불필요하게 변경하지 않는다.

---

# 3. 핵심 색상

## Brand

| 역할 | 값 |
|---|---|
| Primary | `#4A92FF` |
| Secondary | `#4962FF` |
| Tertial | `#A72FC5` |

## Background

| 역할 | 값 |
|---|---|
| BG 100 | `#0E0E14` |
| BG 200 | `#12131A` |
| BG 300 | `#191B24` |
| BG 400 | `#1F212E` |
| BG Cancel | `#2A2D3F` |

## Text / On-Surface

| 역할 | 값 |
|---|---|
| Strong | `#FFFFFF` |
| Normal | `#DFE5ED` |
| Depth 300 | `#969DA8` |
| Depth 400 | `#7C8594` |
| Depth 500 | `#515E71` |

## Border

| 역할 | 값 |
|---|---|
| Border 100 | `#1F212E` |
| Border 200 | `#262838` |
| Border 300 | `#2A2D3F` |
| Border 400 | `#31354F` |

## Interaction

| 역할 | 값 |
|---|---|
| Primary | `#4A92FF` |
| Hovered | `#3569D1` |
| Pressed | `#2C5DBB` |
| Focus | `#81B3FF` |

동일한 HEX라도 역할이 다르면 하나의 토큰으로 합치지 않는다.

---

# 4. PC Home 배경

PC 홈 Body는 단색이 아니다.

다음 방사형 그라데이션을 기준으로 한다.

```css
radial-gradient(
  /* Figma 원본의 위치와 범위 확인 */
  #1a2a4a 0%,
  #0e1428 40%,
  #07070d 75%
)
```

단순 `#0E0E14` 배경으로 대체하지 않는다.

---

# 5. 타이포그래피

## 기본 원칙

기본 UI 폰트는 `Pretendard`.

Display와 일부 Headline에는 별도 서체가 사용된다.

- Pretendard
- Sandoll Mapssi
- Sandoll Gyeokdonggulim
- S-Core Dream

실제 프로젝트에서 폰트 파일 또는 웹폰트 로딩 여부를 확인한 뒤 적용한다.

fallback 상태를 최종 구현이라고 판단하지 않는다.

## 주요 스타일

| 역할 | Font | Size | Weight | Line-height | Letter-spacing |
|---|---|---:|---:|---|---|
| PC Hero / D1 | Sandoll Mapssi | 40px | Regular | `0.8` | `-0.01em` |
| 띠광고 / D2 | Sandoll Gyeokdonggulim | 26px | Regular | `29px` | `-0.01em` |
| Page Title / H5 | S-Core Dream | 28px | 700 | `1` | `-0.01em` |
| Section Title / H6 | S-Core Dream | 19px | 700 | `1` | `-0.01em` |
| Card Title / S1 | Pretendard | 16px | 700 | `20px` | `0` |
| Hero Small / S2 | Pretendard | 16px | 600 | `1` | `-0.01em` |
| Hero Description / S3 | Pretendard | 14px | 600 | `1.6` | `-0.01em` |
| Quick Card Description / S4 | Pretendard | 13px | 600 | `1.6` | `-0.01em` |
| Body / B1 | Pretendard | 14px | 400 | `1.5` | `0` |
| Search / I5 | Pretendard | 14px | 500 | `22px` | `0.25px` |
| GNB Button / L | Pretendard | 15px | 600 | `13.235294px` | `0` |
| See All / M+ | Pretendard | 14px | 600 | `1` | `-0.01em` |
| Filter / Meta | Pretendard | 12px | 500 | `16px` | `0` |
| Footer | Pretendard | 12px | 400 | `1.6` | `-0.01em` |

Figma의 `-1%` letter-spacing은 CSS `-0.01em`이다.

`-1px`로 바꾸지 않는다.

---

# 6. 스페이싱

## 기본 규칙

기본 spacing unit:

```text
4px
```

기본적으로 4px 배수를 사용한다.

시각 보정:

```text
2px
```

불가피한 미세 조정:

```text
1px
```

실제 Figma 화면에 `10px`, `14px` 등이 있으면 임의로 8px 또는 16px로 정규화하지 않는다.

---

# 7. Radius

기본 radius scale:

```text
4
6
8
10
12
16
20
```

Pill / Circle은 별도 규격을 따른다.

예:

```text
24
50
99
100%
```

---

# 8. Grid / Breakpoint

## Mobile

```text
< 768px
```

기본:

- 2 columns
- 좌우 16px
- gutter 16px

이 grid가 홈 추천카드 2열을 의미하는 것은 아니다.

## Desktop

```text
768px – 1599px
```

기본:

- 12 columns
- 좌우 28px
- gutter 20px

## XL

```text
>= 1600px
```

- 콘텐츠 최대 폭: 1480px
- 좌우 28px 포함 container 최대: 1536px

---

# 9. Navigation

## GNB

PC:

```text
height: 64px
padding-x: 16px
padding-y: 8px
```

Menu:

```text
40 × 40px
```

Logo:

```text
191 × 30px
```

Search:

```text
396 × 36px
radius: 99px
padding-x: 16px
background: BG400
border: Border400 1px
```

## LNB

```text
Expanded: 260px
Collapsed: 70px
```

자동 collapse가 시작되는 breakpoint는 현재 확정되지 않았다.

임의로 확정하지 않는다.

---

# 10. PC Home Layout

기준 viewport:

```text
1440px
```

구조:

```text
전체 1440
- LNB 260
= 1180

1180
- 좌측 28
- 우측 28
= content 1124
```

따라서 PC 홈 주요 콘텐츠 기준 폭:

```text
1124px
```

---

# 11. Hero

## PC

```text
width: 1124px
height: 320px
radius: 10px
padding-left/right: 50px
main gap: 20px
```

CTA:

```text
약 139 × 42px
padding: 14px 24px
radius: 8px

font:
Pretendard
SemiBold
14px
line-height: 1
letter-spacing: -0.01em
```

## Mobile

```text
height: 220px
padding-left/right: 50px
main gap: 10px
```

Hero title:

```text
Sandoll Mapssi
32px
line-height: 0.8
```

CTA:

```text
약 138 × 42px
padding: 14px 24px
radius: 8px

Pretendard ExtraBold
14px
```

모바일 CTA는 원본에서 `#4782FF`를 직접 사용한다.

전역 Primary `#4A92FF`와 다른 화면별 override로 유지한다.

---

# 12. Quick Cards

PC:

```text
3 columns
gap: 20px
height: 90px
padding-x: 16px
radius: 10px
background: BG400
```

Title:

```text
S-Core Dream
19px
700
```

Description:

```text
Pretendard
13px
600
line-height: 1.6
```

---

# 13. PC 주요 Section 간격

다음 큰 구역의 기본 간격:

```text
Hero
↓ 28px

Quick Cards
↓ 28px

띠광고
↓ 28px

추천 토크 채널
```

세부 section 내부 spacing은 해당 Figma 프레임 또는 `design-reference.md`를 확인한다.

---

# 14. 추천 채널

Section title → Filter:

```text
20px
```

Filter → Cards:

```text
20px
```

Cards:

```text
4 columns
horizontal gap: 20px
row gap: 40px
```

Card 기준 폭:

```text
약 266px
```

Thumbnail:

```text
266 × 163px
radius: 8px
```

Thumbnail → Body:

```text
14px
```

Avatar:

```text
40px
```

Body internal gap:

```text
5px
```

---

# 15. Filter

```text
height: 28px
radius: 24px
gap between filters: 8px
```

기본 typography:

```text
Pretendard
12px
Medium
line-height: 16px
```

`전체`와 같이 활성 상태는 Bold override가 존재할 수 있다.

디자인 시스템의 큰 Chip과 홈 작은 Filter는 서로 다른 variant다.

---

# 16. Tag

```text
height: 20px
padding: 2px 8px
radius: 20px
gap: 5px
background: #31354F
```

---

# 17. Footer

```text
padding: 44px
group gap: 24px
top border: Border100 1px
```

---

# 18. PC Home Section 순서

```text
Hero

Quick Cards

띠광고

추천 토크 채널

라이브 탑50

신입 스트리머

후원 콘텐츠

Footer
```

Figma 화면 전체 높이 `2972px`는 고정 page height가 아니다.

콘텐츠의 자연스러운 flow와 scroll을 유지한다.

---

# 19. Mobile Home

기준 시안:

```text
375 × 868
```

이 값은 breakpoint가 아니라 비교용 Figma viewport다.

Top Nav:

```text
height: 56px
button slot: 48px
icon: 24px
```

Hero:

```text
height: 220px
horizontal padding: 50px
gap: 10px
```

Ad:

```text
margin-left/right: 10px
width: 약 355px
height: 약 42px
radius: 10px
Hero와 gap: 10px
```

Bottom Navigation:

```text
시안 기준 약 84px
```

단, Figma 안의 Home Indicator 영역을 웹 콘텐츠로 직접 구현하지 않는다.

---

# 20. 모바일에서 구현하지 말아야 할 기기 표현

다음은 웹 UI로 복제하지 않는다.

- Status Bar
- Dynamic Island
- Device Frame
- Home Indicator

실제 브라우저에서는 `safe-area-inset-*`가 필요한지만 확인한다.

---

# 21. 모바일 피드

제공된 Mobile Home Figma에는 추천 피드 / 추천 카드의 실제 배치가 없다.

따라서:

- 기존 구현이 있다면 기능을 유지한다.
- 새로운 배치를 임의로 Figma 확정 규칙이라고 만들지 않는다.
- 새 제안이 필요하면 "제안"으로 구분한다.

---

# 22. Search / Notification 프레임 구분

다음 프레임은 Home 본문이 아니다.

```text
65183:135805 = Search Default
65183:136304 = Search Input
65183:136807 = Notification
```

프레임 이름에 `메인홈`이 포함되어 있어도 홈 본문으로 합치지 않는다.

---

# 23. 확인된 디자인 예외

다음 차이는 실수로 일괄 통일하지 않는다.

## Primary

Global:

```text
#4A92FF
```

Mobile Hero CTA:

```text
#4782FF
```

Search / Notification 일부 selected:

```text
#6CA6FF
```

## Button

DS Button/S:

```text
Pretendard Bold 14px
letter-spacing: 0
```

PC Hero CTA:

```text
Pretendard SemiBold 14px
letter-spacing: -0.01em
```

Mobile Hero CTA:

```text
Pretendard ExtraBold 14px
letter-spacing: -0.01em
```

이들은 서로 다른 사용 사례다.

---

# 24. 현재 미확정 항목

다음은 코드 또는 추가 Figma 확인이 필요하다.

- 실제 폰트 파일 위치
- `@font-face` 구성
- 기존 CSS token 구조
- 기존 공통 UI 구조
- 실제 홈 route
- LNB 자동 collapse breakpoint
- 모바일 추천 feed
- 인증 상태별 모바일 메뉴
- Light theme

미확정 항목 때문에 이미 확인된 색상·간격·타이포그래피 적용을 중단하지 않는다.

---

# 25. 구현 규칙

기존 저장소를 먼저 확인한다.

현재 값과 Figma 기준을 비교한 뒤 수정한다.

다음은 유지한다.

- 기존 HTML 구조
- 기존 JavaScript 동작
- API
- 인증
- 링크
- 라우팅
- 실제 콘텐츠

디자인 때문에 기능을 제거하지 않는다.

---

# 26. Assets

로고, 배너, 아이콘, 썸네일은 기존 프로젝트에 정확한 자산이 있으면 우선 재사용한다.

Figma MCP에서 제공하는 asset URL은 임시 URL일 수 있다.

그 URL을 최종 HTML/CSS/JS의 런타임 소스로 저장하지 않는다.

---

# 27. 완료 기준

## Figma 기준 화면

아래 viewport는 실제 Figma 시안과 비교하는 기준이다.

### Desktop
- 1440px

### Mobile
- 375px

이 두 값만 Figma 시안 비교 기준으로 사용한다.

## 반응형 안정성 QA

아래 viewport는 Figma 디자인 규칙이 아니라 구현 안정성 확인용이다.

- 767px
- 768px
- 1599px
- 1600px

이 값들은 breakpoint 경계에서 다음 문제를 확인하기 위한 테스트값이다.

- horizontal overflow
- 요소 겹침
- fixed / sticky 요소 충돌
- 레이아웃 전환 오류

이 QA viewport를 Figma에서 정의한 화면 규격, 디자인 토큰, 고정 레이아웃 값으로 해석하지 않는다.

검수 시에는 다음을 확인한다.

- 실제 font-family
- font-weight
- font-size
- line-height
- letter-spacing
- 색상
- 배경
- border
- radius
- padding
- gap
- width
- height
- 줄바꿈
- overflow
- fixed navigation overlap

빌드 성공만으로 디자인 검수가 완료됐다고 판단하지 않는다.

Figma와 비교할 때는 1440px과 375px을 기준으로 하고,
767/768/1599/1600은 반응형 안정성 확인에만 사용한다.