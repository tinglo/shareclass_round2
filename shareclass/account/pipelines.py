from django.contrib.auth.models import User

from .models import UserProfile

# 這個 pipeline 只有在處理 Oauth Account 的時候會用到
def save_profile(backend, *args, **kwargs):
    # TODO 利用 kwargs 來判別是不是第一次登入
    # 並且要 Survey 從 kwargs 取得的判斷資訊，會不會因為時間而清空

    username = kwargs.get('username')
    details = kwargs.get('details')
    email = details.get('email')
    fullname = details.get('fullname')

    # clean email to disable find password
    user = User.objects.get(username=username)
    
    # init user profile
    profile = user.userprofile
    if profile.nickname == "":
        profile.nickname = fullname[:30]

    if profile.contact_email == "":
        profile.contact_email = email

    profile.save()
