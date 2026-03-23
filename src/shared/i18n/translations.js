import { DEFAULT_LANGUAGE } from './locale.js';

const EXACT_TRANSLATIONS = {
  az: {
    Home: 'Ana səhifə',
    'Find Work': 'İş tap',
    'Find By Category': 'Kateqoriyaya görə tap',
    Talent: 'Mütəxəssislər',
    Pricing: 'Qiymətlər',
    'My Orders': 'Sifarişlərim',
    Messages: 'Mesajlar',
    Notifications: 'Bildirişlər',
    Wallet: 'Pulqabı',
    Reviews: 'Rəylər',
    Security: 'Təhlükəsizlik',
    Main: 'Əsas',
    Explore: 'Kəşf et',
    'Find By Categories': 'Kateqoriyalara bax',
    'Learn more': 'Ətraflı',
    Search: 'Axtar',
    'Open search': 'Axtarışı aç',
    'Close search': 'Axtarışı bağla',
    'Toggle navigation': 'Naviqasiyanı aç və ya bağla',
    'Open profile': 'Profili aç',
    'Sign out': 'Çıxış et',
    'Post Job': 'İş paylaş',
    'Sign In': 'Daxil ol',
    Register: 'Qeydiyyat',
    'Forgot password?': 'Şifrəni unutmusunuz?',
    'Remember me': 'Məni xatırla',
    'Email or Username': 'Email və ya istifadəçi adı',
    Password: 'Şifrə',
    'Please enter your email or username': 'Emailinizi və ya istifadəçi adınızı daxil edin',
    'Please enter your password': 'Şifrənizi daxil edin',
    'Signing In...': 'Daxil olunur...',
    "Don't have an account?": 'Hesabınız yoxdur?',
    'Sign up': 'Qeydiyyatdan keçin',
    'Already have an account?': 'Artıq hesabınız var?',
    'Join Now': 'İndi qoşul',
    'Creating Account...': 'Hesab yaradılır...',
    'First Name': 'Ad',
    'Last Name': 'Soyad',
    'User Name': 'İstifadəçi adı',
    'Your Email': 'Emailiniz',
    Role: 'Rol',
    Client: 'Müştəri',
    Freelancer: 'Frilanser',
    'Retype Password': 'Şifrəni təkrar yazın',
    'Please enter first name': 'Adınızı daxil edin',
    'Please enter last name': 'Soyadınızı daxil edin',
    'Please enter user name': 'İstifadəçi adını daxil edin',
    'Please enter your email': 'Emailinizi daxil edin',
    'Please enter password': 'Şifrəni daxil edin',
    'Please retype password': 'Şifrəni yenidən daxil edin',
    'Back to sign in': 'Girişə qayıt',
    'Enter the code from your email and set a new password for your account.': 'Emailinizə gələn kodu daxil edin və hesabınız üçün yeni şifrə təyin edin.',
    'We will send a verification code to your email so you can safely reset your password.': 'Şifrənizi təhlükəsiz şəkildə yeniləmək üçün emailinizə təsdiq kodu göndərəcəyik.',
    'The backend will handle the email delivery. This screen only sends the request and prepares the reset step.': 'Təhlükəsiz təsdiq kodu almaq üçün email ünvanınızı daxil edin.',
    'Send code': 'Kodu göndər',
    'Reset password': 'Şifrəni yenilə',
    'Email address': 'Email ünvanı',
    'Send Verification Code': 'Təsdiq kodunu göndər',
    'Sending Code...': 'Kod göndərilir...',
    'Code destination': 'Kodun göndərildiyi ünvan',
    'Verification code': 'Təsdiq kodu',
    'Enter the code from your email': 'Emailinizə gələn kodu daxil edin',
    'New password': 'Yeni şifrə',
    'Please enter new password': 'Yeni şifrəni daxil edin',
    'Confirm password': 'Şifrəni təsdiqlə',
    'Retype new password': 'Yeni şifrəni təkrar yazın',
    'Change email': 'Emaili dəyiş',
    'Resend code': 'Kodu yenidən göndər',
    'Resending...': 'Yenidən göndərilir...',
    'Updating Password...': 'Şifrə yenilənir...',
    'Save New Password': 'Yeni şifrəni yadda saxla',
    'Remembered your password?': 'Şifrənizi xatırladınız?',
    'Secure recovery flow': 'Təhlükəsiz bərpa axını',
    'Send a recovery request and let the backend deliver the verification code.': 'Bərpa sorğusunu göndərin və təsdiq kodunu emaildə alın.',
    'Use the verification code from email and replace the old password in one flow.': 'Emaildəki kodla şifrəni bir addımda yeniləyin.',
    'Email code request': 'Emailə kod sorğusu',
    'Reset with code': 'Kod ilə yenilə',
    'Verification code will arrive to the selected email address.': 'Təsdiq kodu seçilmiş email ünvanına göndəriləcək.',
    'Premium freelance marketplace': 'Premium frilans platforması',
    'Build faster with specialists already matched to your goals.': 'Məqsədlərinizə uyğun seçilmiş mütəxəssislərlə daha sürətli irəliləyin.',
    'Search verified freelancers, compare portfolios and move from brief to delivery with a cleaner workflow.': 'Təsdiqlənmiş frilanserləri axtarın, portfelləri müqayisə edin və işi daha səliqəli axınla çatdırın.',
    'Search by skill, role or category': 'Bacarığa, rola və ya kateqoriyaya görə axtarın',
    'Find matches': 'Uyğun namizədləri tap',
    'Explore talent': 'Mütəxəssislərə bax',
    'Client sign in': 'Müştəri girişi',
    'Verified profiles': 'Təsdiqlənmiş profillər',
    'Secure hiring flow': 'Təhlükəsiz işə qəbul axını',
    'Transparent pricing': 'Şəffaf qiymətlər',
    'Live dashboard preview': 'Canlı panel önizləməsi',
    'Top marketplace overview': 'Platformanın ümumi görünüşü',
    Online: 'Onlayn',
    'Talent pipeline': 'Mütəxəssis axını',
    'Matched profiles in minutes': 'Uyğun profillər dəqiqələr içində',
    'Shortlist, compare rates and move directly into project scope.': 'Qısa siyahı hazırlayın, qiymətləri müqayisə edin və birbaşa layihəyə keçin.',
    'Best for': 'Ən uyğun',
    'Design, AI, product builds': 'Dizayn, AI və məhsul inkişafı',
    'Marketplace health': 'Platforma aktivliyi',
    'Best ways moving hire': 'İstedadı tapmağın ən yaxşı yolları',
    'Comprehensive range of talent services to meet your every need': 'Bütün ehtiyaclarınız üçün geniş istedad xidmətləri',
    'Explore a broad range of categories, from tech experts to fashion stylists, voice artists and growth specialists.': 'Texnologiya mütəxəssislərindən dizaynerlərə, səs sənətçilərindən growth mütəxəssislərinə qədər müxtəlif kateqoriyaları araşdırın.',
    'Selected category': 'Seçilmiş kateqoriya',
    'avg rate': 'orta qiymət',
    Selected: 'Seçildi',
    'Explore All': 'Hamısına bax',
    'Top talents': 'Ön mütəxəssislər',
    'Meet the professionals ready for your next project': 'Növbəti layihəniz üçün hazır olan peşəkarlarla tanış olun',
    'Filter by category, rate and relevance to narrow down your shortlist faster.': 'Kateqoriya, qiymət və uyğunluq üzrə filtrləyərək seçiminizi daha tez daraldın.',
    'Profiles matched': 'Tapılan profillər',
    'Filter by title, skill or location': 'Vəzifə, bacarıq və ya məkana görə filtrlə',
    'All budgets': 'Bütün büdcələr',
    'Under $50/hr': '$50/saatdan aşağı',
    '$50 - $80/hr': '$50 - $80/saat',
    '$80+/hr': '$80+/saat',
    'Top rated': 'Ən yüksək reytinq',
    'Most reviews': 'Ən çox rəy',
    'Lowest rate': 'Ən aşağı qiymət',
    'Highest rate': 'Ən yüksək qiymət',
    Reset: 'Sıfırla',
    'No matching talent found': 'Uyğun mütəxəssis tapılmadı',
    'Adjust the category, search or budget filter to widen the shortlist.': 'Seçimi genişləndirmək üçün kateqoriyanı, axtarışı və ya büdcə filtrini dəyişin.',
    'Clear filters': 'Filtrləri təmizlə',
    'Load more talents': 'Daha çox profil yüklə',
    'Start a project brief': 'Layihə brifi yarat',
    'Best plans to win': 'Qazandıran planlar',
    'Tailored packages for every business stage and size': 'Hər biznes mərhələsi və ölçüsü üçün uyğun paketlər',
    'Choose a plan for sourcing, visibility and better project throughput.': 'Tapıntı, görünürlük və daha güclü iş axını üçün plan seçin.',
    Monthly: 'Aylıq',
    Yearly: 'İllik',
    'Get Started': 'Başlayın',
    'Insights and perspectives, exploring the boundless horizons': 'Yeni baxışlar və faydalı ideyalar',
    'Explore diverse topics to gain fresh ideas, workflow improvements and practical hiring insights.': 'Yeni ideyalar, iş axını təkmilləşdirmələri və praktik işə qəbul tövsiyələri üçün müxtəlif mövzulara baxın.',
    '5 min read': '5 dəq oxu',
    '4 min read': '4 dəq oxu',
    'Explore More': 'Daha çox bax',
    'Join and get a unique opportunity': 'Qoşulun və yeni imkan qazanın',
    'Connect with skilled professionals, optimize collaborations, and unlock success.': 'Bacarıqlı peşəkarlarla əlaqə qurun, əməkdaşlığı gücləndirin və uğura yaxınlaşın.',
    'Get Started Now': 'İndi başlayın',
    'Our platform helps businesses hire top freelancers and discover digital services with speed.': 'Platformamız bizneslərə güclü frilanserləri daha sürətli tapmağa və rəqəmsal xidmətləri kəşf etməyə kömək edir.',
    'Top Rated Categories': 'Ən populyar kateqoriyalar',
    'Post Free To Share Your Question': 'Suallarınız üçün bizimlə əlaqə saxlayın',
    'We Love Our Client Feedback': 'Müştəri rəylərini sevirik',
    'Previous testimonial': 'Əvvəlki rəy',
    'Next testimonial': 'Növbəti rəy',
    'View task details': 'Tapşırıq detallarına bax',
    Tools: 'Alətlər',
    rating: 'reytinq',
    duration: 'müddət',
    rate: 'qiymət',
    Remote: 'Uzaqdan',
    'Available soon': 'Tezliklə əlçatan',
    'Featured profile': 'Seçilmiş profil',
    'Featured Talent': 'Seçilmiş mütəxəssis',
    'Digital Marketing': 'Rəqəmsal marketinq',
    'Graphics & Design': 'Qrafika və dizayn',
    'Programming & Tech': 'Proqramlaşdırma və texnologiya',
    'Smart AI Services': 'Ağıllı AI xidmətləri',
    'Writing & Translation': 'Yazı və tərcümə',
    'Music & Audio': 'Musiqi və audio',
    Creative: 'Yaradıcı',
    Inspiration: 'İlham',
    Growth: 'Böyümə',
    AI: 'AI',
    'AI Development': 'AI inkişafı',
    'Graphic Design': 'Qrafik dizayn',
    Programming: 'Proqramlaşdırma',
    'Video Editing': 'Video montaj'
  },
  ru: {
    Home: 'Главная',
    'Find Work': 'Найти работу',
    'Find By Category': 'По категориям',
    Talent: 'Специалисты',
    Pricing: 'Тарифы',
    'My Orders': 'Мои заказы',
    Messages: 'Сообщения',
    Notifications: 'Уведомления',
    Wallet: 'Кошелек',
    Reviews: 'Отзывы',
    Security: 'Безопасность',
    Main: 'Главная',
    Explore: 'Обзор',
    'Find By Categories': 'По категориям',
    'Learn more': 'Подробнее',
    Search: 'Поиск',
    'Open search': 'Открыть поиск',
    'Close search': 'Закрыть поиск',
    'Toggle navigation': 'Переключить навигацию',
    'Open profile': 'Открыть профиль',
    'Sign out': 'Выйти',
    'Post Job': 'Разместить задачу',
    'Sign In': 'Войти',
    Register: 'Регистрация',
    'Forgot password?': 'Забыли пароль?',
    'Remember me': 'Запомнить меня',
    'Email or Username': 'Email или имя пользователя',
    Password: 'Пароль',
    'Please enter your email or username': 'Введите email или имя пользователя',
    'Please enter your password': 'Введите пароль',
    'Signing In...': 'Вход...',
    "Don't have an account?": 'Нет аккаунта?',
    'Sign up': 'Зарегистрируйтесь',
    'Already have an account?': 'Уже есть аккаунт?',
    'Join Now': 'Присоединиться',
    'Creating Account...': 'Создание аккаунта...',
    'First Name': 'Имя',
    'Last Name': 'Фамилия',
    'User Name': 'Имя пользователя',
    'Your Email': 'Ваш email',
    Role: 'Роль',
    Client: 'Клиент',
    Freelancer: 'Фрилансер',
    'Retype Password': 'Повторите пароль',
    'Please enter first name': 'Введите имя',
    'Please enter last name': 'Введите фамилию',
    'Please enter user name': 'Введите имя пользователя',
    'Please enter your email': 'Введите ваш email',
    'Please enter password': 'Введите пароль',
    'Please retype password': 'Повторно введите пароль',
    'Back to sign in': 'Назад ко входу',
    'Enter the code from your email and set a new password for your account.': 'Введите код из email и задайте новый пароль для аккаунта.',
    'We will send a verification code to your email so you can safely reset your password.': 'Мы отправим код подтверждения на ваш email для безопасного сброса пароля.',
    'The backend will handle the email delivery. This screen only sends the request and prepares the reset step.': 'Введите email, чтобы получить безопасный код подтверждения.',
    'Send code': 'Отправить код',
    'Reset password': 'Сбросить пароль',
    'Email address': 'Email адрес',
    'Send Verification Code': 'Отправить код подтверждения',
    'Sending Code...': 'Отправка кода...',
    'Code destination': 'Куда отправлен код',
    'Verification code': 'Код подтверждения',
    'Enter the code from your email': 'Введите код из письма',
    'New password': 'Новый пароль',
    'Please enter new password': 'Введите новый пароль',
    'Confirm password': 'Подтвердите пароль',
    'Retype new password': 'Повторите новый пароль',
    'Change email': 'Изменить email',
    'Resend code': 'Отправить код снова',
    'Resending...': 'Повторная отправка...',
    'Updating Password...': 'Обновление пароля...',
    'Save New Password': 'Сохранить новый пароль',
    'Remembered your password?': 'Вспомнили пароль?',
    'Secure recovery flow': 'Безопасное восстановление',
    'Send a recovery request and let the backend deliver the verification code.': 'Отправьте запрос на восстановление и получите код подтверждения на email.',
    'Use the verification code from email and replace the old password in one flow.': 'Используйте код из письма и смените пароль за один шаг.',
    'Email code request': 'Запрос кода на email',
    'Reset with code': 'Сброс по коду',
    'Verification code will arrive to the selected email address.': 'Код подтверждения будет отправлен на выбранный email.',
    'Premium freelance marketplace': 'Премиальная платформа фриланса',
    'Build faster with specialists already matched to your goals.': 'Работайте быстрее со специалистами, уже подходящими под ваши цели.',
    'Search verified freelancers, compare portfolios and move from brief to delivery with a cleaner workflow.': 'Ищите проверенных фрилансеров, сравнивайте портфолио и переходите от брифа к результату в более удобном процессе.',
    'Search by skill, role or category': 'Поиск по навыку, роли или категории',
    'Find matches': 'Найти подходящих',
    'Explore talent': 'Смотреть специалистов',
    'Client sign in': 'Вход для клиентов',
    'Verified profiles': 'Проверенные профили',
    'Secure hiring flow': 'Безопасный найм',
    'Transparent pricing': 'Прозрачные цены',
    'Live dashboard preview': 'Предпросмотр панели',
    'Top marketplace overview': 'Обзор платформы',
    Online: 'Онлайн',
    'Talent pipeline': 'Поток специалистов',
    'Matched profiles in minutes': 'Подходящие профили за минуты',
    'Shortlist, compare rates and move directly into project scope.': 'Соберите шортлист, сравните ставки и сразу переходите к проекту.',
    'Best for': 'Лучше всего для',
    'Design, AI, product builds': 'Дизайн, AI и продуктовая разработка',
    'Marketplace health': 'Активность платформы',
    'Best ways moving hire': 'Лучшие способы найти специалистов',
    'Comprehensive range of talent services to meet your every need': 'Широкий спектр услуг под любые задачи',
    'Explore a broad range of categories, from tech experts to fashion stylists, voice artists and growth specialists.': 'Изучайте разные категории: от техспециалистов до дизайнеров, голосовых артистов и growth-экспертов.',
    'Selected category': 'Выбранная категория',
    'avg rate': 'средняя ставка',
    Selected: 'Выбрано',
    'Explore All': 'Смотреть все',
    'Top talents': 'Лучшие специалисты',
    'Meet the professionals ready for your next project': 'Познакомьтесь со специалистами для вашего следующего проекта',
    'Filter by category, rate and relevance to narrow down your shortlist faster.': 'Фильтруйте по категории, ставке и релевантности, чтобы быстрее сузить выбор.',
    'Profiles matched': 'Найдено профилей',
    'Filter by title, skill or location': 'Фильтр по роли, навыку или локации',
    'All budgets': 'Любой бюджет',
    'Under $50/hr': 'До $50/час',
    '$50 - $80/hr': '$50 - $80/час',
    '$80+/hr': '$80+/час',
    'Top rated': 'Топ по рейтингу',
    'Most reviews': 'Больше всего отзывов',
    'Lowest rate': 'Самая низкая ставка',
    'Highest rate': 'Самая высокая ставка',
    Reset: 'Сбросить',
    'No matching talent found': 'Подходящие специалисты не найдены',
    'Adjust the category, search or budget filter to widen the shortlist.': 'Измените категорию, поиск или бюджетный фильтр, чтобы расширить выбор.',
    'Clear filters': 'Очистить фильтры',
    'Load more talents': 'Загрузить еще',
    'Start a project brief': 'Создать бриф проекта',
    'Best plans to win': 'Тарифы для роста',
    'Tailored packages for every business stage and size': 'Пакеты для любого этапа и масштаба бизнеса',
    'Choose a plan for sourcing, visibility and better project throughput.': 'Выберите тариф для поиска, видимости и более сильного рабочего процесса.',
    Monthly: 'Ежемесячно',
    Yearly: 'Ежегодно',
    'Get Started': 'Начать',
    'Insights and perspectives, exploring the boundless horizons': 'Идеи и полезные взгляды',
    'Explore diverse topics to gain fresh ideas, workflow improvements and practical hiring insights.': 'Изучайте разные темы, чтобы находить идеи, улучшать процессы и получать практические рекомендации по найму.',
    '5 min read': '5 мин чтения',
    '4 min read': '4 мин чтения',
    'Explore More': 'Смотреть больше',
    'Join and get a unique opportunity': 'Присоединяйтесь и открывайте новые возможности',
    'Connect with skilled professionals, optimize collaborations, and unlock success.': 'Работайте с сильными специалистами, улучшайте сотрудничество и быстрее достигайте результата.',
    'Get Started Now': 'Начать сейчас',
    'Our platform helps businesses hire top freelancers and discover digital services with speed.': 'Наша платформа помогает бизнесу быстрее находить сильных фрилансеров и цифровые услуги.',
    'Top Rated Categories': 'Популярные категории',
    'Post Free To Share Your Question': 'Свяжитесь с нами',
    'We Love Our Client Feedback': 'Нам важны отзывы клиентов',
    'Previous testimonial': 'Предыдущий отзыв',
    'Next testimonial': 'Следующий отзыв',
    'View task details': 'Смотреть детали задачи',
    Tools: 'Инструменты',
    rating: 'рейтинг',
    duration: 'срок',
    rate: 'ставка',
    Remote: 'Удаленно',
    'Available soon': 'Скоро доступен',
    'Featured profile': 'Рекомендуемый профиль',
    'Featured Talent': 'Рекомендуемый специалист',
    'Digital Marketing': 'Цифровой маркетинг',
    'Graphics & Design': 'Графика и дизайн',
    'Programming & Tech': 'Программирование и технологии',
    'Smart AI Services': 'AI-услуги',
    'Writing & Translation': 'Тексты и перевод',
    'Music & Audio': 'Музыка и аудио',
    Creative: 'Креатив',
    Inspiration: 'Вдохновение',
    Growth: 'Рост',
    AI: 'AI',
    'AI Development': 'Разработка AI',
    'Graphic Design': 'Графический дизайн',
    Programming: 'Программирование',
    'Video Editing': 'Видеомонтаж'
  },
  en: {
    'The backend will handle the email delivery. This screen only sends the request and prepares the reset step.': 'Enter your email address to receive a secure verification code.'
  }
};

Object.assign(EXACT_TRANSLATIONS.az, {
  'Enter your email address to receive a verification code and continue the password reset securely.':
    'Email ünvanınızı daxil edin, təsdiq kodunu alın və şifrənizi təhlükəsiz yeniləyin.',
  'Send a recovery request and receive the verification code in your email.':
    'Bərpa sorğusunu göndərin və təsdiq kodunu emailinizdə alın.',
  'Some sections are currently showing preview content while new updates sync in.':
    'Bəzi bölmələr hazırda önizləmə məzmunu ilə göstərilir.',
  'Fresh activity will appear here as soon as it becomes available.':
    'Yeni fəaliyyət burada əlçatan olan kimi görünəcək.',
  'Profile details updated successfully.': 'Profil məlumatları uğurla yeniləndi.',
  'Add an image URL or upload a local preview file.':
    'Image URL əlavə edin və ya lokal önizləmə faylı yükləyin.'
});

Object.assign(EXACT_TRANSLATIONS.ru, {
  'Enter your email address to receive a verification code and continue the password reset securely.':
    'Введите email, получите код подтверждения и безопасно продолжите сброс пароля.',
  'Send a recovery request and receive the verification code in your email.':
    'Отправьте запрос на восстановление и получите код подтверждения на email.',
  'Some sections are currently showing preview content while new updates sync in.':
    'Некоторые разделы сейчас показывают предварительный контент, пока обновления синхронизируются.',
  'Fresh activity will appear here as soon as it becomes available.':
    'Новая активность появится здесь, как только станет доступной.',
  'Profile details updated successfully.': 'Данные профиля успешно обновлены.',
  'Add an image URL or upload a local preview file.':
    'Добавьте URL изображения или загрузите локальный файл предпросмотра.'
});

Object.assign(EXACT_TRANSLATIONS.en, {
  'Enter your email address to receive a verification code and continue the password reset securely.':
    'Enter your email address to receive a verification code and continue the password reset securely.',
  'Send a recovery request and receive the verification code in your email.':
    'Send a recovery request and receive the verification code in your email.',
  'Some sections are currently showing preview content while new updates sync in.':
    'Some sections are currently showing preview content while new updates sync in.',
  'Fresh activity will appear here as soon as it becomes available.':
    'Fresh activity will appear here as soon as it becomes available.',
  'Profile details updated successfully.': 'Profile details updated successfully.',
  'Add an image URL or upload a local preview file.':
    'Add an image URL or upload a local preview file.'
});

const PATTERN_TRANSLATORS = [
  {
    test: /^(\d+) reviews$/i,
    render(language, [, count]) {
      if (language === 'az') return `${count} rəy`;
      if (language === 'ru') return `${count} отзывов`;
      return `${count} reviews`;
    }
  },
  {
    test: /^(\d+) completed$/i,
    render(language, [, count]) {
      if (language === 'az') return `${count} tamamlanıb`;
      if (language === 'ru') return `${count} завершено`;
      return `${count} completed`;
    }
  },
  {
    test: /^(\d+) items$/i,
    render(language, [, count]) {
      if (language === 'az') return `${count} element`;
      if (language === 'ru') return `${count} элементов`;
      return `${count} items`;
    }
  },
  {
    test: /^(\d+) talents$/i,
    render(language, [, count]) {
      if (language === 'az') return `${count} profil`;
      if (language === 'ru') return `${count} специалистов`;
      return `${count} talents`;
    }
  },
  {
    test: /^(\d+)\+ briefs$/i,
    render(language, [, count]) {
      if (language === 'az') return `${count}+ brif`;
      if (language === 'ru') return `${count}+ брифов`;
      return `${count}+ briefs`;
    }
  },
  {
    test: /^(\d+)\+ live briefs$/i,
    render(language, [, count]) {
      if (language === 'az') return `${count}+ aktiv brif`;
      if (language === 'ru') return `${count}+ активных брифов`;
      return `${count}+ live briefs`;
    }
  },
  {
    test: /^(\d+)\+ briefs this week$/i,
    render(language, [, count]) {
      if (language === 'az') return `Bu həftə ${count}+ brif`;
      if (language === 'ru') return `${count}+ брифов на этой неделе`;
      return `${count}+ briefs this week`;
    }
  },
  {
    test: /^Page (\d+) of (\d+)$/i,
    render(language, [, page, total]) {
      if (language === 'az') return `Səhifə ${page} / ${total}`;
      if (language === 'ru') return `Страница ${page} из ${total}`;
      return `Page ${page} of ${total}`;
    }
  },
  {
    test: /^Due (.+)$/i,
    render(language, [, value]) {
      if (language === 'az') return `Son tarix ${value}`;
      if (language === 'ru') return `Срок ${value}`;
      return `Due ${value}`;
    }
  },
  {
    test: /^(\d+)% complete$/i,
    render(language, [, value]) {
      if (language === 'az') return `${value}% tamamlanıb`;
      if (language === 'ru') return `${value}% завершено`;
      return `${value}% complete`;
    }
  },
  {
    test: /^(\d+) unread messages$/i,
    render(language, [, count]) {
      if (language === 'az') return `${count} oxunmamış mesaj`;
      if (language === 'ru') return `${count} непрочитанных сообщений`;
      return `${count} unread messages`;
    }
  },
  {
    test: /^Go to testimonial (\d+)$/i,
    render(language, [, index]) {
      if (language === 'az') return `${index}-ci rəyi aç`;
      if (language === 'ru') return `Открыть отзыв ${index}`;
      return `Go to testimonial ${index}`;
    }
  },
  {
    test: /^Preview (\d+)$/i,
    render(language, [, index]) {
      if (language === 'az') return `Önizləmə ${index}`;
      if (language === 'ru') return `Превью ${index}`;
      return `Preview ${index}`;
    }
  }
];

function preserveWhitespace(source, translated) {
  const leading = source.match(/^\s*/)?.[0] || '';
  const trailing = source.match(/\s*$/)?.[0] || '';

  return `${leading}${translated}${trailing}`;
}

export function translateText(language = DEFAULT_LANGUAGE, text = '') {
  if (typeof text !== 'string') {
    return text;
  }

  const trimmed = text.trim();

  if (!trimmed) {
    return text;
  }

  const exactMatch = EXACT_TRANSLATIONS[language]?.[trimmed];
  if (exactMatch) {
    return preserveWhitespace(text, exactMatch);
  }

  for (const item of PATTERN_TRANSLATORS) {
    const match = trimmed.match(item.test);
    if (match) {
      return preserveWhitespace(text, item.render(language, match));
    }
  }

  return text;
}
