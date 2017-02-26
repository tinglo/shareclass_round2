# Account System Document for Developer

## 實作解說
目前的版本主要是將一般帳戶與 OAuth 帳戶分開實作
一般帳戶利用 account.views.py 實作大部分的功能，OAuth 則利用 Django 套件串接

## 一般帳戶

#### Configuration

* AWS SES Config using SMTP-SSL
```
shareclass/settings.py

# EMAIL
EMAIL_BACKEND = 'django_smtp_ssl.SSLEmailBackend'
EMAIL_HOST = 'email-smtp.us-west-2.amazonaws.com'
EMAIL_PORT = 465
EMAIL_HOST_USER = aws_credentials['ses_user']
EMAIL_HOST_PASSWORD = aws_credentials['ses_password']
EMAIL_USE_TLS = True
```

#### 操作
* 註冊 (GeneralSignUpView): 使用者必須在尚未登入的情況下，填寫完資料完成註冊
	* 註冊帳號: Email （必須為 Unique）
	* 密碼 ( 6 - 20位 英文數字夾雜）
	* 確認密碼

* 登入 (LoginView): 在尚未登入的情況下填寫資料登入，並設置 Cookies。
	* 帳號
	* 密碼

* 登出 (LogoutView): 必須在已經登入的情況下執行，會清理 Cookies。

* 修改密碼 (ChangePasswordView): 必須是已登入情況才可以修改密碼， OAuth 帳戶不可以設置，修改密碼。
	* 原本密碼
	* 新密碼
	* 確認新密碼

* 尋找密碼 (FindPasswordView): 利用 uuid 產生 URL TOKEN 讓使用者重置密碼，並且在信中夾帶驗證碼驗證身份，避免他人盜取 URL TOKEN 之後，可以重設別人的密碼。寄發信件使用 AWS SES 服務，目前是以 smtp + ssl 實作，未來有優化空間。
	* 註冊 Email 帳號


#### 驗證密碼
* 驗證密碼格式的方法由於每個 Service 都不盡相同，所以在這裡我們使用 regex 來實作，並實作於 `account/utils`
* 需要驗證的時機：會寫入密碼到 Database 的時機, eg: 註冊，更改密碼，重置密碼。登入時不驗證，因為錯誤會被 authenticate 拋出。
	
## OAuth 帳戶

主要使用 python-social-auth, 引入的 App 為: 'social_django'

#### OAuth General Config 

```
shareclass/settings.py

AUTHENTICATION_BACKENDS = (
    'social_core.backends.google.GoogleOAuth2',
    'social_core.backends.facebook.FacebookOAuth2',
    'rest_framework_social_oauth2.backends.DjangoOAuth2',
)

SOCIAL_AUTH_URL_NAMESPACE = 'social'

SOCIAL_AUTH_PIPELINE = (
    'social_core.pipeline.social_auth.social_details',
    'social_core.pipeline.social_auth.social_uid',
    'social_core.pipeline.social_auth.auth_allowed',
    'social_core.pipeline.social_auth.social_user',
    'social_core.pipeline.user.get_username',
    'social_core.pipeline.user.create_user',
    'social_core.pipeline.social_auth.associate_user',
    'social_core.pipeline.social_auth.load_extra_data',
    'social_core.pipeline.user.user_details',
    'account.pipelines.save_profile',
)

SOCIAL_AUTH_ADMIN_USER_SEARCH_FIELDS = ['username']

SOCIAL_AUTH_LOGIN_REDIRECT_URL = "/accounts/social_success"
SOCIAL_AUTH_LOGIN_URL = '/accounts/social_success'
```

#### Google

- SOCIAL_AUTH_GOOGLE_OAUTH2_KEY, SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET: API credentials
- SOCIAL_AUTH_GOOGLE_OAUTH2_IGNORE_DEFAULT_SCOPE: 使否採用原本預設欄位
- SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE: 指令索取使用者資料欄位

```
shareclass/settings.py

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = oauth_credentials['google_key']
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = oauth_credentials['google_secret']
SOCIAL_AUTH_GOOGLE_OAUTH2_IGNORE_DEFAULT_SCOPE = True
SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
]
```

#### Facebook

- SOCIAL_AUTH_FACEBOOK_SECRET, SOCIAL_AUTH_FACEBOOK_SECRET: API credentials
- SOCIAL_AUTH_FACEBOOK_PROFILE_EXTRA_PARAMS: 獲取使用者的欄位

```
shareclass/settings.py

SOCIAL_AUTH_FACEBOOK_KEY = oauth_credentials['facebook_key']
SOCIAL_AUTH_FACEBOOK_SECRET = oauth_credentials['facebook_secret']
SOCIAL_AUTH_FACEBOOK_PROFILE_EXTRA_PARAMS = {
  'fields': 'id, name, email, picture'
}
```

#### 操作
* 註冊，登入：這兩者在 OAuth 上是沒有太大差別的，差別只在於第一次的時候必須自己判斷，創建 User Profile
* 登出：同一般登出，使用相同的 Handler

#### Pipeline
`account/pipelines.py`
相較於一般帳戶能夠由我們控制 UserProfile 初始化的時機，OAuth 因為利用套件的關係，我們沒辦法直接做到。
但是 python-social-auth 提供 Pipeline 的機制，讓我們可以在進行一連串登入動作的時候，插入 Code Block


## Database Model
* User Profile Model: 用來儲存跟使用者相關的個人資料，因為跟帳戶系統不同，所以跟 User Model 必須分離降低耦合。

* Reset Password Token Model: 用來處理使用者是否要求重置密碼的相關處理。因為這個功能只有一般使用者可以用。所以在創建以及初始化都是與一般使用者註冊同步處理。

## Signal
* Signal: 
是 Django Model 的同步機制。<br>
在這裏的用法是當 User Model 被創建之後，隨後即在 Database 創建該 User 的 User Profile。<br>
目前，Signal 的 function 是寫在 account/models.py: create_profile<br>
可以創建 signals.py 將其移到新檔案中。


## FAQ
1. 為什麼 OAuth 使用者不可以設置密碼？
因為我們覺得 OAuth 使用者，使用 OAuth 登入是最方便快速的。
所以不建議讓他設置密碼登入，再加上一開始透過 OAuth 註冊的時候，
不是每個人都能夠抓取到 Email。在尋找密碼的時候，便會發生錯誤 

2. TBD
