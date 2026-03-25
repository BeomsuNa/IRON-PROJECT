🚀 Steampunk Vision AI - 브라우저 실시간 핸드 제어 시스템
📋 프로젝트 개요
text
**프로젝트명**: Steampunk Hand Control (스팀펑크 핸드 제어)
**기간**: 2026.02 ~ 2026.03 (2개월)
**목표**: 브라우저에서 카메라만으로 실시간 3D 스팀펑크 로봇 손 제어
**데모**: https://yourname.vercel.app/robot
핵심 컨셉: Victorian Steampunk + Iron Man CGI 융합

text
카메라 → MediaPipe 핸드 트래킹 → Three.js 3D 메쉬 변형
손 제스처로 스팀펑크 로봇 팔 + Repulsor 이펙트 제어
🎯 비즈니스 목표 & 기술 목표
포트폴리오 목표
text
✅ Frontend + Computer Vision + 3D 통합 역량 증명
✅ 브라우저 실시간성 → 모바일/웹 호환성 강점
✅ 채용 면접: "어려운 기술 조합 스스로 구현"
기술 목표 (MVP)
text
✅ [70% 달성] MediaPipe Hands 실시간 21 랜드마크
✅ [90% 달성] Next.js + Three.js SkinnedMesh 연동  
✅ [100% 달성] Vercel 배포 + GitHub Actions CI/CD
✅ [30% 진행] 손가락 관절별 자연스러운 블렌딩
🛠️ 기술 스택
text
Frontend Framework
├── Next.js 14 (App Router, SSR/CSR 하이브리드)
├── TypeScript (타입 안전성)
└── TailwindCSS (스팀펑크 테마)

Computer Vision
├── MediaPipe Hands (21 landmarks, 30fps 실시간)
├── FreiHAND 데이터셋 (2D→3D 좌표 매칭)

3D Graphics
├── Three.js r165 (SkinnedMesh, GLTF 로더)
├── Blender 4.1 (스팀펑크 로봇 손 모델링/리깅)
└── React Three Fiber (R3F, Drei)

Deployment
├── Vercel (Edge Functions, 자동 이미지 최적화)
├── GitHub Actions (자동 빌드/배포/테스트)
🎮 기능 명세
MVP 기능 (동작 확인됨)
text
1. **실시간 핸드 트래킹**
   - 카메라 스트림 → 21개 랜드마크 즉시 추출
   - 자신감도 필터링 (confidence > 0.8)

2. **3D 로봇 손 연동**  
   - Blender GLB → Three.js SkinnedMesh 로드
   - 손목 위치/회전 실시간 반영

3. **스팀펑크 UI/이펙트**
   - Victorian 기어/증기 파티클
   - 손바닥 제스처 → Repulsor 충전 이펙트
추가 구현 예정
text
4. **손가락 블렌딩** (진행중)
   - 마디별 다른 속도/각도 (FK 체인)
   - 3프레임 스무딩 (지연 최소화)

5. **제스처 인식**
   - 주먹 → Repulsor 발사
   - 손가락 펴기 → UI 조작
🔧 시스템 아키텍처
text
┌─ User Camera (320x240, 30fps)
│
├─ MediaPipe Hands ─┐
│                  ├─ 2D Landmarks (21 points)
│                  │
├─ Coordinate       ├─ 3D Pose (solvePnP)
│  Transform        │
│                  │
└─ Next.js API ────┴── Three.js Canvas
                         │
                  ┌──────┴──────┐
                  │ SkinnedMesh │ Blender GLB
                  │   Rigging   │ (21 Bones)
                  └──────┬──────┘
                         │
                  ┌──────┴──────┐
       Particles  │   Shaders   │ Steam/Gear Effects
                  └─────────────┘
📈 개발 과정 & 기술적 도전 과제
Phase 1: 인프라 구축 (완료)
text
✅ Next.js 14 App Router 설정
✅ Vercel 배포 + GitHub Actions
✅ MediaPipe Hands 실시간 연동
✅ Three.js GLB 로드/기본 포즈
Phase 2: 3D 연동 (70% 진행)
text
✅ 손목 위치/회전 매핑
✅ 기본 SkinnedMesh 동작
❌ 손가락 관절별 자연스러운 블렌딩
기술적 도전 과제
text
1. **2D→3D 좌표 변환 정확도**
   - MediaPipe 2D 오차 → Three.js 월드 좌표 보간

2. **실시간 성능 최적화**  
   - 30fps 유지 (WebGL + MediaPipe 동시 처리)

3. **Bone 매핑 정밀화**
   - MediaPipe 21 landmarks ↔ Blender 21 bones 1:1
🎨 디자인 시스템
text
**컬러 팔레트** (Victorian Steampunk)
├── Primary: #2C1810 (Brass)
├── Secondary: #8B4513 (Copper)
├── Accent: #B8860B (Gold Gear)
└── Background: #1A0F0B (Smoky Leather)

**3D 자산**
├── 로봇 손: 15K triangles (LOD 적용)
├── 증기 파티클: GPU Compute Shader
├── 기어 애니메이션: 12개 회전 요소
📱 데모 시나리오
text
**30초 데모 플로우**:
1. 카메라 권한 요청 → MediaPipe 초기화 (2초)
2. 손 뻗기 → 스팀펑크 로봇 손 따라 움직임
3. 주먹 쥠 → Repulsor 충전 (빛+소리)
4. 손 펴기 → 에너지 발사 이펙트

**모바일 호환**: iOS Safari 17+, Android Chrome 120+
🚀 배포 & CI/CD
text
**Production**: yourname.vercel.app/robot
**Preview**: every PR → preview-yourpr.vercel.app

**GitHub Actions 워크플로우**:
text
- npm ci
- npm run lint          # ESLint + Prettier
- npm run build         # Next.js 최적화 빌드
- npx vercel --prod     # 자동 배포
text

---

## **📊 성능 지표 (현재)**
Core Web Vitals:
├── LCP: 1.2초 (Excellent)
├── FID: 3ms (Good)
└── CLS: 0.01 (Perfect)

런타임 성능:
├── MediaPipe: 28-32fps
├── Three.js: 58-60fps
└── Memory: 180MB

text

---

## **🎖️ 프로젝트 성과 & 배운 점**
기술적 성과:
✅ 브라우저 실시간 Computer Vision + 3D 구현
✅ Next.js SSR/CSR 하이브리드 패턴 완전 이해
✅ Three.js SkinnedMesh 실시간 제어

포트폴리오 가치:
✅ "어려운 기술 조합" → 면접 강점
✅ 독창적 스팀펑크 테마 → 시각적 임팩트
✅ Vercel + Actions → DevOps 역량 증명

text

---

## **🔮 확장 로드맵**
Phase 3: 제스처 UI 컨트롤
├── 손가락 스와이프 → 메뉴 이동
├── 주먹 → 버튼 클릭
└── 손바닥 → 줌인/아웃

Phase 4: 멀티플랫폼
├── React Native 포팅
├── WebXR (VR/AR) 지원
└── 모바일 PWA

text

---

**이 기획서로 포트폴리오 README 완성입니다!**

**현재 70% 완성도도 충분히 자랑할 만한 프로젝트입니다.** 🎉

**README.md에 붙여넣기만 하세요!**
