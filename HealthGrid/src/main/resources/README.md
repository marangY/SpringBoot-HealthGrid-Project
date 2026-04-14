# HealthGrid — Spring Boot Thymeleaf 연동 가이드

## 디렉토리 구조

```
healthgrid-thymeleaf/
├── templates/                  ← src/main/resources/templates/ 에 복사
│   ├── fragments/
│   │   ├── head.html           ← 공통 <head> fragment
│   │   └── sidebar.html        ← 공통 사이드바 fragment
│   ├── index.html              ← 대시보드 (GET /)
│   ├── login.html              ← 로그인 (GET /login)
│   ├── register.html           ← 회원가입 (GET /register)
│   ├── profile.html            ← 체형 정보 (GET /profile)
│   ├── diet.html               ← 식단 관리 (GET /diet)
│   ├── exercise.html           ← 운동 관리 (GET /exercise)
│   └── community.html          ← 커뮤니티 (GET /community)
└── static/                     ← src/main/resources/static/ 에 복사
    ├── css/
    │   └── style.css
    └── js/
        └── app.js
```

## Spring Boot 프로젝트 설정

### 1. 의존성 (build.gradle 또는 pom.xml)

```gradle
// build.gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'nz.net.ultraq.thymeleaf:thymeleaf-layout-dialect'
    // Google Authenticator (TOTP)
    implementation 'com.warrenstrange:googleauth:1.5.0'
    // 이미지 처리 (식단 분석)
    implementation 'org.springframework.boot:spring-boot-starter-webflux'
}
```

### 2. application.yml 설정

```yaml
spring:
  thymeleaf:
    prefix: classpath:/templates/
    suffix: .html
    cache: false   # 개발 중에는 false, 운영에서는 true
    encoding: UTF-8
  web:
    resources:
      static-locations: classpath:/static/
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB
```

### 3. 파일 복사 위치

```
src/main/resources/
├── templates/          ← healthgrid-thymeleaf/templates/ 내용 복사
│   ├── fragments/
│   ├── index.html
│   ├── login.html
│   └── ...
└── static/             ← healthgrid-thymeleaf/static/ 내용 복사
    ├── css/style.css
    └── js/app.js
```

---

## 각 페이지별 컨트롤러 및 DTO 요약

### 공통: 사이드바 fragment
사이드바에서 `user.name`, `user.email`을 사용합니다.
모든 컨트롤러에서 `model.addAttribute("user", userDto)` 필수.

---

### 대시보드 (index.html)
**Controller:** `GET /`

| Model Attribute | 타입 | 설명 |
|---|---|---|
| `user` | `UserDto` | 로그인 사용자 정보 |
| `todayCalories` | `int` | 오늘 섭취 칼로리 합계 |
| `todayBurned` | `int` | 오늘 소모 칼로리 합계 |
| `todayMeals` | `List<MealDto>` | 오늘 식단 목록 |
| `todayExercises` | `List<ExerciseLogDto>` | 오늘 운동 기록 목록 |

---

### 로그인 (login.html)
**Controller:** `GET /login`, `POST /login`, `POST /login/otp`

| Model Attribute | 타입 | 설명 |
|---|---|---|
| `loginForm` | `LoginForm` | 로그인 폼 객체 |
| `errorMessage` | `String` | 로그인 실패 메시지 (null 가능) |

---

### 회원가입 (register.html)
**Controller:** `GET /register`, `POST /register`

| Model Attribute | 타입 | 설명 |
|---|---|---|
| `registerForm` | `RegisterForm` | 회원가입 폼 객체 |
| `qrCodeBase64` | `String` | Google Authenticator QR 코드 (Base64 PNG) |
| `secretKey` | `String` | TOTP 수동 입력 키 |
| `globalError` | `String` | 전역 오류 메시지 (null 가능) |

---

### 체형 정보 (profile.html)
**Controller:** `GET /profile`, `POST /profile/update`, `POST /profile/goal`

| Model Attribute | 타입 | 설명 |
|---|---|---|
| `user` | `UserDto` | 사용자 정보 (gender, age, height, weight, targetWeight, muscleGoal, targetCalories) |
| `profileForm` | `ProfileForm` | 신체 정보 수정 폼 |
| `goalForm` | `GoalForm` | 목표 설정 폼 |
| `bmi` | `double` | 계산된 BMI 값 |
| `bmiStatus` | `String` | BMI 상태 (저체중/정상/과체중/비만) |
| `bmiPercent` | `int` | BMI 스케일 위치 (0~100) |
| `weightProgress` | `int` | 목표 체중 달성률 (0~100) |
| `carbsGrams` | `int` | 일일 탄수화물 목표 (g) |
| `proteinGrams` | `int` | 일일 단백질 목표 (g) |
| `fatGrams` | `int` | 일일 지방 목표 (g) |
| `carbsPercent` | `int` | 탄수화물 비율 (%) |
| `proteinPercent` | `int` | 단백질 비율 (%) |
| `fatPercent` | `int` | 지방 비율 (%) |

---

### 식단 관리 (diet.html)
**Controller:** `GET /diet`, `POST /diet/upload`

| Model Attribute | 타입 | 설명 |
|---|---|---|
| `user` | `UserDto` | 사용자 정보 |
| `weeklyDataJson` | `String` | 7일 칼로리 데이터 JSON 문자열 |
| `targetCalories` | `int` | 일일 목표 칼로리 |
| `allMeals` | `List<MealDto>` | 전체 식단 목록 |
| `nutritionComment` | `String` | 영양 분석 코멘트 |
| `uploadForm` | `MealUploadForm` | 식단 업로드 폼 |
| `successMessage` | `String` | 저장 성공 메시지 (flash) |

**weeklyDataJson 예시 (컨트롤러에서 ObjectMapper로 직렬화):**
```json
[
  {"label":"월","totalCalories":1850,"carbsCalories":925,"proteinCalories":462,"fatCalories":463},
  {"label":"화","totalCalories":2100,"carbsCalories":1050,"proteinCalories":525,"fatCalories":525},
  ...
]
```

---

### 운동 관리 (exercise.html)
**Controller:** `GET /exercise`, `POST /exercise/log`

| Model Attribute | 타입 | 설명 |
|---|---|---|
| `user` | `UserDto` | 사용자 정보 |
| `recommendations` | `List<RecommendedExerciseDto>` | 맞춤 운동 추천 목록 (5~10개) |
| `todayLogs` | `List<ExerciseLogDto>` | 오늘 운동 기록 |
| `todayBurned` | `int` | 오늘 총 소모 칼로리 |
| `dailyTarget` | `int` | 일일 목표 소모 칼로리 |
| `achievePercent` | `int` | 달성률 (0~100) |
| `logForm` | `ExerciseLogForm` | 운동 기록 폼 |

---

### 커뮤니티 (community.html)
**Controller:** `GET /community`, `POST /community/write`, `POST /community/edit/{id}`, `POST /community/delete/{id}`

| Model Attribute | 타입 | 설명 |
|---|---|---|
| `currentUser` | `UserDto` | 현재 로그인 사용자 |
| `posts` | `List<PostDto>` | 게시글 목록 (페이지네이션) |
| `hasMore` | `boolean` | 다음 페이지 존재 여부 |
| `currentPage` | `int` | 현재 페이지 번호 |
| `filterAuthorId` | `String` | 작성자 필터 ID (null이면 전체) |
| `filterAuthorName` | `String` | 필터 작성자 이름 |
| `writeForm` | `WritePostForm` | 글쓰기 폼 |

---

## Google Authenticator (TOTP) 연동

```java
// build.gradle: implementation 'com.warrenstrange:googleauth:1.5.0'

@Service
public class TotpService {
    private final GoogleAuthenticator gAuth = new GoogleAuthenticator();

    public GoogleAuthenticatorKey generateCredentials() {
        return gAuth.createCredentials();
    }

    public String getQrCodeUrl(String username, String secretKey) {
        return GoogleAuthenticatorQRGenerator.getOtpAuthTotpURL(
            "HealthGrid", username,
            new GoogleAuthenticatorKey.Builder(secretKey).build()
        );
    }

    public boolean verifyCode(String secretKey, int code) {
        return gAuth.authorize(secretKey, code);
    }
}
```

---

## 보안 설정 (Spring Security)

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/login", "/register", "/css/**", "/js/**").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/", true)
                .permitAll()
            )
            .logout(logout -> logout
                .logoutSuccessUrl("/login")
            );
        return http.build();
    }
}
```
