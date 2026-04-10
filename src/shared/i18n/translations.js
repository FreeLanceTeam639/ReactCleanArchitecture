import { DEFAULT_LANGUAGE } from './locale.js';
import { TRANSLATION_OVERRIDES } from './translationOverrides.js';
import { PROFILE_TRANSLATION_OVERRIDES } from './profileTranslationOverrides.js';
import { TASK_DETAIL_TRANSLATION_OVERRIDES } from './taskDetailTranslationOverrides.js';
import { WORKSPACE_TRANSLATION_OVERRIDES } from './workspaceTranslationOverrides.js';
import { decodeMojibake } from '../lib/text/decodeMojibake.js';

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

Object.assign(EXACT_TRANSLATIONS.az, {
  Hide: 'Gizlət',
  Show: 'Göstər',
  'Language switcher': 'Dil seçimi',
  'Featured talent': 'Seçilmiş mütəxəssis',
  'Categories live': 'Canlı kateqoriyalar',
  'Live job posts': 'Canlı iş elanları',
  'Build faster with': 'Daha sürətli qurun',
  specialists: 'mütəxəssislərlə',
  'already matched to your goals.': 'məqsədlərinizə uyğun seçilmiş.',
  'Search by skill, focus or category': 'Bacarıq, fokus və ya kateqoriya ilə axtar',
  'Search members': 'Üzvləri axtar',
  'Live activity': 'Canlı aktivlik',
  Categories: 'Kateqoriyalar',
  'Loading categories...': 'Kateqoriyalar yüklənir...',
  'categories online': 'kateqoriya onlayndır',
  'job posts live': 'iş elanı aktivdir',
  'Professional service lanes built for faster decisions': 'Daha sürətli qərarlar üçün qurulmuş peşəkar xidmət istiqamətləri',
  'Explore the categories members use most, compare active briefs and see how each lane is performing right now.':
    'Üzvlərin ən çox istifadə etdiyi kateqoriyaları araşdırın, aktiv brifləri müqayisə edin və hər istiqamətin indi necə işlədiyini görün.',
  'live briefs': 'aktiv brif',
  'active briefs': 'aktiv brif',
  'View details': 'Detallara bax',
  'Live opportunities': 'Canlı imkanlar',
  'Recent verified briefs, delivery windows and budgets stay visible so the marketplace feels active and trustworthy.':
    'Son təsdiqlənmiş briflər, icra müddətləri və büdcələr görünən qalır ki, platforma daha aktiv və etibarlı hiss olunsun.',
  'Open briefs': 'Açıq briflər',
  'Updated from the real backend feed': 'Real backend axınından yenilənir',
  'Verified member': 'Təsdiqlənmiş üzv',
  'Active member': 'Aktiv üzv',
  Verified: 'Təsdiqləndi',
  'Open brief': 'Brifi aç',
  'The next published jobs will appear here.': 'Növbəti paylaşılmış iş elanları burada görünəcək.',
  'As soon as members publish new briefs, this section will showcase them automatically.':
    'Üzvlər yeni brif paylaşan kimi bu bölmə onları avtomatik göstərəcək.',
  'Open workspace': 'İş sahəsini aç',
  'Join the marketplace': 'Platformaya qoşul',
  profiles: 'profil',
  'Filter members': 'Üzvləri filter et',
  'Load more profiles': 'Daha çox profil yüklə',
  'Our platform helps businesses discover verified members and launch digital collaborations with speed.':
    'Platformamız bizneslərə təsdiqlənmiş üzvləri daha sürətli tapmağa və rəqəmsal əməkdaşlıqları başlatmağa kömək edir.',
  'Copyright 2026 FreelanceAze': 'Müəllif hüquqları 2026 FreelanceAze',
  'Pricing built for growth': 'Böyümə üçün qiymətləndirmə',
  'Simple plans for cleaner project publishing and collaboration': 'Daha səliqəli layihə paylaşımı və əməkdaşlıq üçün sadə planlar',
  'Pick the billing period and choose the plan that fits your current workflow. Clean, fast and easy to compare.':
    'Ödəniş dövrünü seçin və cari iş axınınıza uyğun planı götürün. Təmiz, sürətli və müqayisəsi asandır.',
  Free: 'Pulsuz',
  'per month, billed annually': 'aylıq, illik ödənişlə',
  '/month': '/ay',
  'Ideal for testing the workflow and publishing your first brief.': 'İş axınını yoxlamaq və ilk brifinizi paylaşmaq üçün idealdır.',
  'A strong starting point for verified discovery and active briefs.': 'Təsdiqlənmiş görünürlük və aktiv briflər üçün güclü başlanğıcdır.',
  'For heavier collaboration, faster routing and stronger visibility.': 'Daha güclü əməkdaşlıq, daha sürətli yönləndirmə və daha yüksək görünürlük üçündür.',
  Profile: 'Profil',
  'Search talent, services, jobs': 'Mütəxəssis, xidmət və iş axtar',
  'Close navigation': 'Naviqasiyanı bağla',
  'Please enter your email or username & password to access your account':
    'Hesabınıza daxil olmaq üçün email və ya istifadəçi adınızı və şifrənizi daxil edin',
  'Hide password': 'Şifrəni gizlət',
  'Show password': 'Şifrəni göstər',
  'Every account starts as a client account and can unlock job posting after verification.':
    'Hər hesab müştəri hesabı kimi başlayır və təsdiqdən sonra iş paylaşımını aça bilir.',
  Country: 'Ölkə',
  'Select your country': 'Ölkənizi seçin',
  'Phone Number': 'Telefon nömrəsi',
  'Join once as a client account, then request verification when you are ready to post jobs.':
    'Bir dəfə müştəri hesabı kimi qoşulun, sonra iş paylaşmağa hazır olanda təsdiq istəyin.',
  'Forgot password steps': 'Şifrə bərpası addımları',
  'Login successful. Redirecting you to your profile...': 'Giriş uğurludur. Profil səhifəsinə yönləndirilirsiniz...',
  'Login successful': 'Giriş uğurlu oldu',
  'You have signed in to your account.': 'Hesabınıza daxil oldunuz.',
  'Unable to sign in right now.': 'Hazırda daxil olmaq mümkün olmadı.',
  'Login failed': 'Giriş uğursuz oldu',
  'Passwords do not match.': 'Şifrələr uyğun gəlmir.',
  'Passwords do not match': 'Şifrələr uyğun gəlmir',
  'Registration failed': 'Qeydiyyat tamamlanmadı',
  'Registration completed successfully. Redirecting you to sign in...': 'Qeydiyyat uğurla tamamlandı. Giriş səhifəsinə keçirsiniz...',
  'Registration completed': 'Qeydiyyat tamamlandı',
  'Your account has been created. You can sign in now.': 'Hesabınız yaradıldı. İndi daxil ola bilərsiniz.',
  'Unable to complete registration right now.': 'Hazırda qeydiyyatı tamamlamaq mümkün olmadı.',
  'Verification code sent to your email.': 'Təsdiq kodu email ünvanınıza göndərildi.',
  'Code sent': 'Kod göndərildi',
  'Code not sent': 'Kod göndərilmədi',
  'A new verification code was sent to your email.': 'Yeni təsdiq kodu email ünvanınıza göndərildi.',
  'New code sent': 'Yeni kod göndərildi',
  'Unable to resend the verification code.': 'Təsdiq kodunu yenidən göndərmək mümkün olmadı.',
  'Enter the verification code from your email.': 'Emailinizə gələn təsdiq kodunu daxil edin.',
  'Verification code missing': 'Təsdiq kodu daxil edilməyib',
  'Your new password must be at least 8 characters long.': 'Yeni şifrəniz minimum 8 simvol olmalıdır.',
  'Password is too short': 'Şifrə qısadır',
  'Your password has been reset. You can sign in now.': 'Şifrəniz yeniləndi. İndi daxil ola bilərsiniz.',
  'Password updated': 'Şifrə yeniləndi',
  'Unable to reset your password right now.': 'Hazırda şifrəni yeniləmək mümkün olmadı.',
  'Password was not updated': 'Şifrə yenilənmədi',
  Starter: 'Starter',
  Pro: 'Pro',
  Popular: 'Populyar',
  'Member sign in': 'Üzv girişi'
});

Object.assign(EXACT_TRANSLATIONS.ru, {
  Hide: 'Скрыть',
  Show: 'Показать',
  'Language switcher': 'Переключатель языка',
  'Featured talent': 'Рекомендуемый специалист',
  'Categories live': 'Активные категории',
  'Live job posts': 'Активные вакансии',
  'Build faster with': 'Работайте быстрее с',
  specialists: 'специалистами',
  'already matched to your goals.': 'уже подобранными под ваши цели.',
  'Search by skill, focus or category': 'Поиск по навыку, фокусу или категории',
  'Search members': 'Поиск участников',
  'Live activity': 'Живая активность',
  Categories: 'Категории',
  'Loading categories...': 'Категории загружаются...',
  'categories online': 'категорий онлайн',
  'job posts live': 'активных вакансий',
  'Professional service lanes built for faster decisions': 'Профессиональные направления услуг для более быстрых решений',
  'Explore the categories members use most, compare active briefs and see how each lane is performing right now.':
    'Изучайте самые востребованные категории, сравнивайте активные брифы и смотрите, как работает каждое направление.',
  'live briefs': 'активных брифов',
  'active briefs': 'активных брифов',
  'View details': 'Смотреть детали',
  'Live opportunities': 'Живые возможности',
  'Recent verified briefs, delivery windows and budgets stay visible so the marketplace feels active and trustworthy.':
    'Недавние проверенные брифы, сроки и бюджеты остаются видимыми, чтобы платформа ощущалась активной и надежной.',
  'Open briefs': 'Открытые брифы',
  'Updated from the real backend feed': 'Обновляется из реального backend-потока',
  'Verified member': 'Проверенный участник',
  'Active member': 'Активный участник',
  Verified: 'Проверено',
  'Open brief': 'Открыть бриф',
  'The next published jobs will appear here.': 'Следующие опубликованные задачи появятся здесь.',
  'As soon as members publish new briefs, this section will showcase them automatically.':
    'Как только участники публикуют новые брифы, этот раздел покажет их автоматически.',
  'Open workspace': 'Открыть workspace',
  'Join the marketplace': 'Присоединиться к платформе',
  profiles: 'профилей',
  'Filter members': 'Фильтровать участников',
  'Load more profiles': 'Загрузить больше профилей',
  'Our platform helps businesses discover verified members and launch digital collaborations with speed.':
    'Наша платформа помогает бизнесу находить проверенных участников и быстро запускать цифровое сотрудничество.',
  'Copyright 2026 FreelanceAze': 'Авторские права 2026 FreelanceAze',
  'Pricing built for growth': 'Тарифы для роста',
  'Simple plans for cleaner project publishing and collaboration': 'Простые планы для более удобной публикации и сотрудничества',
  'Pick the billing period and choose the plan that fits your current workflow. Clean, fast and easy to compare.':
    'Выберите период оплаты и тариф, который подходит вашему рабочему процессу. Чисто, быстро и удобно сравнивать.',
  Free: 'Бесплатно',
  'per month, billed annually': 'в месяц при ежегодной оплате',
  '/month': '/мес',
  'Ideal for testing the workflow and publishing your first brief.': 'Идеально для теста рабочего процесса и публикации первого брифа.',
  'A strong starting point for verified discovery and active briefs.': 'Сильный старт для проверенного охвата и активных брифов.',
  'For heavier collaboration, faster routing and stronger visibility.': 'Для более активного сотрудничества, быстрого роутинга и лучшей видимости.',
  Profile: 'Профиль',
  'Search talent, services, jobs': 'Поиск специалистов, услуг и задач',
  'Close navigation': 'Закрыть навигацию',
  'Please enter your email or username & password to access your account':
    'Введите email или имя пользователя и пароль, чтобы войти в аккаунт',
  'Hide password': 'Скрыть пароль',
  'Show password': 'Показать пароль',
  'Every account starts as a client account and can unlock job posting after verification.':
    'Каждый аккаунт начинается как клиентский и может открыть публикацию задач после проверки.',
  Country: 'Страна',
  'Select your country': 'Выберите страну',
  'Phone Number': 'Номер телефона',
  'Join once as a client account, then request verification when you are ready to post jobs.':
    'Присоединяйтесь как клиент, а затем запросите верификацию, когда будете готовы публиковать задачи.',
  'Forgot password steps': 'Шаги восстановления пароля',
  'Login successful. Redirecting you to your profile...': 'Вход выполнен. Перенаправляем вас в профиль...',
  'Login successful': 'Вход выполнен',
  'You have signed in to your account.': 'Вы вошли в свой аккаунт.',
  'Unable to sign in right now.': 'Сейчас не удалось выполнить вход.',
  'Login failed': 'Вход не выполнен',
  'Passwords do not match.': 'Пароли не совпадают.',
  'Passwords do not match': 'Пароли не совпадают',
  'Registration failed': 'Регистрация не завершена',
  'Registration completed successfully. Redirecting you to sign in...': 'Регистрация успешно завершена. Перенаправляем на вход...',
  'Registration completed': 'Регистрация завершена',
  'Your account has been created. You can sign in now.': 'Ваш аккаунт создан. Теперь вы можете войти.',
  'Unable to complete registration right now.': 'Сейчас не удалось завершить регистрацию.',
  'Verification code sent to your email.': 'Код подтверждения отправлен на ваш email.',
  'Code sent': 'Код отправлен',
  'Code not sent': 'Код не отправлен',
  'A new verification code was sent to your email.': 'Новый код подтверждения отправлен на ваш email.',
  'New code sent': 'Новый код отправлен',
  'Unable to resend the verification code.': 'Не удалось повторно отправить код подтверждения.',
  'Enter the verification code from your email.': 'Введите код подтверждения из письма.',
  'Verification code missing': 'Код подтверждения не введен',
  'Your new password must be at least 8 characters long.': 'Новый пароль должен быть не короче 8 символов.',
  'Password is too short': 'Пароль слишком короткий',
  'Your password has been reset. You can sign in now.': 'Пароль обновлен. Теперь вы можете войти.',
  'Password updated': 'Пароль обновлен',
  'Unable to reset your password right now.': 'Сейчас не удалось сбросить пароль.',
  'Password was not updated': 'Пароль не был обновлен',
  Starter: 'Starter',
  Pro: 'Pro',
  Popular: 'Популярно',
  'Member sign in': 'Вход участника'
});

Object.assign(EXACT_TRANSLATIONS.az, {
  'Explore members': 'İstifadəçiləri kəşf et',
  'Browse sellers and review every published task in one cleaner workspace.':
    'Satıcıları nəzərdən keçirin və paylaşılmış bütün tapşırıqlara daha səliqəli bir iş sahəsində baxın.',
  'Filter by budget, category, delivery timeline, seller name and keyword. Each row keeps the member profile on the left and all active tasks in a horizontal task lane on the right.':
    'Büdcə, kateqoriya, icra müddəti, satıcı adı və açar söz üzrə filter edin. Hər sətirdə solda üzv profili, sağda isə bütün aktiv tapşırıqlar üfüqi zolaqda görünür.',
  Filters: 'Filtrlər',
  'Refine results': 'Nəticələri dəqiqləşdir',
  Keyword: 'Açar söz',
  'Task title, brief, category': 'Tapşırıq adı, brief, kateqoriya',
  'Seller name': 'Satıcı adı',
  'Search seller': 'Satıcı axtar',
  Category: 'Kateqoriya',
  'All categories': 'Bütün kateqoriyalar',
  'Task duration': 'Tapşırıq müddəti',
  'All durations': 'Bütün müddətlər',
  'Min budget': 'Min büdcə',
  'Max budget': 'Maks büdcə',
  'Sort by': 'Sıralama',
  'Recently updated': 'Son yenilənənlər',
  'Most tasks': 'Ən çox tapşırıq',
  'Highest budget': 'Ən yüksək büdcə',
  'Lowest budget': 'Ən aşağı büdcə',
  'Reset filters': 'Filtrləri sıfırla',
  'Live directory': 'Canlı siyahı',
  'Members and their published task lanes': 'Üzvlər və onların paylaşdığı tapşırıq zolaqları',
  'Refreshing live sellers and task rows...': 'Canlı satıcılar və tapşırıq sətirləri yenilənir...',
  'Loading explore directory...': 'Kəşf siyahısı yüklənir...',
  'Member rows and task lanes are being prepared.': 'Üzv sətirləri və tapşırıq zolaqları hazırlanır.',
  'No matching member found': 'Uyğun üzv tapılmadı',
  'Try widening the category, budget or keyword filters to see more active task lanes.':
    'Daha çox aktiv tapşırıq görmək üçün kateqoriya, büdcə və ya açar söz filtrlərini genişləndirin.',
  Members: 'Üzvlər',
  'Live tasks': 'Canlı tapşırıqlar',
  'Open task': 'Tapşırığı aç',
  'Published tasks': 'Paylaşılmış tapşırıqlar',
  'Scroll tasks left': 'Tapşırıqları sola sürüşdür',
  'Scroll tasks right': 'Tapşırıqları sağa sürüşdür',
  'Browse tasks': 'Tapşırıqlara bax',
  'Fixed Price': 'Sabit qiymət',
  Hourly: 'Saatlıq',
  'Flexible timeline': 'Elastik müddət',
  'Verified Member': 'Təsdiqlənmiş üzv',
  'Active Member': 'Aktiv üzv',
  'Available now': 'Hazırda əlçatandır',
  'Verification pending': 'Təsdiq gözləyir',
  'Limited availability': 'Məhdud əlçatanlıq',
  Unavailable: 'Əlçatan deyil',
  General: 'Ümumi'
});

Object.assign(EXACT_TRANSLATIONS.ru, {
  'Explore members': 'Обзор участников',
  'Browse sellers and review every published task in one cleaner workspace.':
    'Просматривайте продавцов и каждую опубликованную задачу в одном более удобном пространстве.',
  'Filter by budget, category, delivery timeline, seller name and keyword. Each row keeps the member profile on the left and all active tasks in a horizontal task lane on the right.':
    'Фильтруйте по бюджету, категории, сроку, имени продавца и ключевому слову. В каждой строке слева профиль участника, а справа все активные задачи в горизонтальной ленте.',
  Filters: 'Фильтры',
  'Refine results': 'Уточните результаты',
  Keyword: 'Ключевое слово',
  'Task title, brief, category': 'Название задачи, бриф, категория',
  'Seller name': 'Имя продавца',
  'Search seller': 'Поиск продавца',
  Category: 'Категория',
  'All categories': 'Все категории',
  'Task duration': 'Срок задачи',
  'All durations': 'Все сроки',
  'Min budget': 'Мин. бюджет',
  'Max budget': 'Макс. бюджет',
  'Sort by': 'Сортировать по',
  'Recently updated': 'Недавно обновлено',
  'Most tasks': 'Больше всего задач',
  'Highest budget': 'Самый высокий бюджет',
  'Lowest budget': 'Самый низкий бюджет',
  'Reset filters': 'Сбросить фильтры',
  'Live directory': 'Живой каталог',
  'Members and their published task lanes': 'Участники и их опубликованные ленты задач',
  'Refreshing live sellers and task rows...': 'Обновляются продавцы и строки задач...',
  'Loading explore directory...': 'Загрузка каталога...',
  'Member rows and task lanes are being prepared.': 'Строки участников и ленты задач подготавливаются.',
  'No matching member found': 'Подходящий участник не найден',
  'Try widening the category, budget or keyword filters to see more active task lanes.':
    'Попробуйте расширить фильтры категории, бюджета или ключевых слов, чтобы увидеть больше активных задач.',
  Members: 'Участники',
  'Live tasks': 'Активные задачи',
  'Open task': 'Открыть задачу',
  'Published tasks': 'Опубликованные задачи',
  'Scroll tasks left': 'Прокрутить задачи влево',
  'Scroll tasks right': 'Прокрутить задачи вправо',
  'Browse tasks': 'Смотреть задачи',
  'Fixed Price': 'Фиксированная цена',
  Hourly: 'Почасово',
  'Flexible timeline': 'Гибкий срок',
  'Verified Member': 'Проверенный участник',
  'Active Member': 'Активный участник',
  'Available now': 'Доступен сейчас',
  'Verification pending': 'Ожидает проверки',
  'Limited availability': 'Ограниченная доступность',
  Unavailable: 'Недоступен',
  General: 'Общее'
});

Object.assign(EXACT_TRANSLATIONS.en, {
  'Explore members': 'Explore members',
  'Browse sellers and review every published task in one cleaner workspace.':
    'Browse sellers and review every published task in one cleaner workspace.',
  'Filter by budget, category, delivery timeline, seller name and keyword. Each row keeps the member profile on the left and all active tasks in a horizontal task lane on the right.':
    'Filter by budget, category, delivery timeline, seller name and keyword. Each row keeps the member profile on the left and all active tasks in a horizontal task lane on the right.',
  Filters: 'Filters',
  'Refine results': 'Refine results',
  Keyword: 'Keyword',
  'Task title, brief, category': 'Task title, brief, category',
  'Seller name': 'Seller name',
  'Search seller': 'Search seller',
  Category: 'Category',
  'All categories': 'All categories',
  'Task duration': 'Task duration',
  'All durations': 'All durations',
  'Min budget': 'Min budget',
  'Max budget': 'Max budget',
  'Sort by': 'Sort by',
  'Recently updated': 'Recently updated',
  'Most tasks': 'Most tasks',
  'Highest budget': 'Highest budget',
  'Lowest budget': 'Lowest budget',
  'Reset filters': 'Reset filters',
  'Live directory': 'Live directory',
  'Members and their published task lanes': 'Members and their published task lanes',
  'Refreshing live sellers and task rows...': 'Refreshing live sellers and task rows...',
  'Loading explore directory...': 'Loading explore directory...',
  'Member rows and task lanes are being prepared.': 'Member rows and task lanes are being prepared.',
  'No matching member found': 'No matching member found',
  'Try widening the category, budget or keyword filters to see more active task lanes.':
    'Try widening the category, budget or keyword filters to see more active task lanes.',
  Members: 'Members',
  'Live tasks': 'Live tasks',
  'Open task': 'Open task',
  'Published tasks': 'Published tasks',
  'Scroll tasks left': 'Scroll tasks left',
  'Scroll tasks right': 'Scroll tasks right',
  'Browse tasks': 'Browse tasks',
  'Fixed Price': 'Fixed Price',
  Hourly: 'Hourly',
  'Flexible timeline': 'Flexible timeline',
  'Verified Member': 'Verified Member',
  'Active Member': 'Active Member',
  'Available now': 'Available now',
  'Verification pending': 'Verification pending',
  'Limited availability': 'Limited availability',
  Unavailable: 'Unavailable',
  General: 'General'
});

Object.assign(EXACT_TRANSLATIONS.az, {
  'Marketplace update': 'Marketplace yeniləməsi',
  'A few sections are taking longer than usual. The rest of the marketplace is ready to use.':
    'Bəzi bölmələr adi haldan bir az gec yüklənir. Qalan marketplace artıq istifadəyə hazırdır.',
  'Pricing plans are syncing. You can continue browsing the marketplace.':
    'Qiymət planları sinxronlaşdırılır. Marketplace-də baxmağa davam edə bilərsiniz.',
  'Member discovery is refreshing. Please try again in a moment.':
    'Üzv kəşf bölməsi yenilənir. Bir az sonra yenidən yoxlayın.',
  'More profiles could not be loaded right now.':
    'Hazırda daha çox profil yüklənə bilmədi.',
  'Saved state could not be updated.':
    'Yadda saxlama vəziyyəti yenilənə bilmədi.',
  'Verified digital marketplace': 'Təsdiqlənmiş rəqəmsal marketplace',
  'Search verified members, compare portfolios and move from brief to delivery with a cleaner workflow.':
    'Təsdiqlənmiş üzvləri axtarın, portfelləri müqayisə edin və briefdən təhvillə qədər daha səliqəli axınla irəliləyin.',
  'Search by skill, focus or category': 'Bacarıq, fokus və ya kateqoriyaya görə axtarın',
  'Search members': 'Üzvləri axtar',
  'Categories live': 'Canlı kateqoriyalar',
  'Live job posts': 'Canlı iş elanları',
  'Loading job posts...': 'İş elanları yüklənir...',
  'No matching profile found': 'Uyğun profil tapılmadı',
  'Adjust the category, search or budget filter to widen the shortlist.':
    'Seçimi genişləndirmək üçün kateqoriya, axtarış və ya büdcə filtrini dəyişin.',
  'Simple plans for cleaner project publishing and collaboration':
    'Layihə paylaşımı və əməkdaşlıq üçün daha təmiz planlar',
  'Pick the billing period and choose the plan that fits your current workflow. Clean, fast and easy to compare.':
    'Ödəniş dövrünü seçin və hazırkı iş axınınıza uyğun planı götürün. Təmiz, sürətli və müqayisəsi asandır.',
  'Conversation indexing, unread state and reply flow run through the endpoint-first service layer.':
    'Söhbət indekslənməsi, oxunmamış vəziyyəti və cavab axını endpoint-first service layer üzərindən işləyir.',
  'Search conversations': 'Söhbətləri axtar',
  'Write a reply...': 'Cavab yazın...',
  Sending: 'Göndərilir',
  'Sending...': 'Göndərilir...',
  Send: 'Göndər',
  'Select a conversation to start replying.': 'Cavab yazmağa başlamaq üçün bir söhbət seçin.',
  'In Review': 'Yoxlamada',
  'Total Value': 'Ümumi dəyər',
  'Search jobs, updates, categories': 'İşləri, yenilikləri, kateqoriyaları axtarın',
  'Open chat': 'Çatı aç',
  'Open profile view': 'Profil görünüşünü aç',
  'Go to Post Job': 'İş paylaşmağa keç',
  'Submit a short review ticket and wait for admin approval.':
    'Qısa yoxlama bileti göndərin və admin təsdiqini gözləyin.',
  'Request account verification for posting jobs': 'İş paylaşımı üçün hesab təsdiqi istəyin',
  'Briefly explain what you want to post, who you are, and any proof the admin should review.':
    'Nə paylaşmaq istədiyinizi, kim olduğunuzu və adminin baxmalı olduğu sübutu qısa izah edin.',
  'Submitting...': 'Göndərilir...',
  'Send verification ticket': 'Təsdiq biletini göndər',
  'Your account is already verified.': 'Hesabınız artıq təsdiqlənib.',
  'A verification request is already pending. You can submit another one after review.':
    'Təsdiq sorğusu artıq gözləmədədir. Yoxlamadan sonra yenisini göndərə bilərsiniz.',
  'Unread, payment and security events are managed through a dedicated endpoint flow.':
    'Oxunmamış, ödəniş və təhlükəsizlik hadisələri ayrıca endpoint axını ilə idarə olunur.',
  Payments: 'Ödənişlər',
  'Search notifications': 'Bildirişləri axtar',
  'Mark all read': 'Hamısını oxunmuş et',
  'Updating...': 'Yenilənir...',
  'Balance, payout and transaction history are loaded through the wallet service layer.':
    'Balans, ödəniş çıxarışı və əməliyyat tarixçəsi wallet service layer üzərindən yüklənir.',
  'All transactions': 'Bütün əməliyyatlar',
  'Enter amount': 'Məbləği daxil edin',
  'Requesting...': 'Sorğu göndərilir...',
  'Request withdrawal': 'Çıxarış sorğusu göndər',
  'Review visibility, featured state and rating filters are managed through the workspace service layer.':
    'Rəy görünürlüğü, seçilmiş vəziyyəti və reytinq filtrləri workspace service layer üzərindən idarə olunur.',
  'Remove feature': 'Seçilmişdən çıxar',
  Feature: 'Seçilmiş et',
  '2FA, login alerts and active session controls are connected to the dedicated security endpoint layer.':
    '2FA, giriş bildirişləri və aktiv sessiya idarəsi ayrıca security endpoint layer-ə qoşulub.',
  'The frontend shows the current state while change requests go through the service layer.':
    'Frontend cari vəziyyəti göstərir, dəyişiklik sorğuları isə service layer üzərindən gedir.',
  'Two-factor authentication': 'İki addımlı doğrulama',
  'Extra verification during sign-in.': 'Daxil olarkən əlavə yoxlama.',
  'Email and in-app alerts for new sign-ins.': 'Yeni girişlər üçün email və tətbiqdaxili bildirişlər.',
  'Session lock': 'Sessiya kilidi',
  'Require device approval before a new session starts.': 'Yeni sessiya başlamazdan əvvəl cihaz təsdiqi tələb et.',
  'Revoking...': 'Ləğv edilir...',
  Revoke: 'Ləğv et',
  'Your account hub is loading...': 'Hesab mərkəziniz yüklənir...',
  'We could not open your account right now.': 'Hazırda hesabınızı aça bilmədik.',
  'Return home': 'Ana səhifəyə qayıt',
  'Ongoing Tasks': 'Davam edən tapşırıqlar',
  'No active tasks yet': 'Hələ aktiv tapşırıq yoxdur',
  'Your current jobs and active deliveries will appear here as soon as work starts.':
    'Hazırkı işləriniz və aktiv təhvil axınlarınız iş başladıqdan sonra burada görünəcək.',
  Seen: 'Görüldü',
  'Saving...': 'Yadda saxlanılır...',
  'No conversations yet': 'Hələ söhbət yoxdur',
  'New conversations will appear here as soon as you connect with another member.':
    'Başqa bir üzvlə əlaqə qurduğunuz anda yeni söhbətlər burada görünəcək.',
  'No notifications right now': 'Hazırda bildiriş yoxdur',
  'Verification updates, security alerts and collaboration activity will appear here.':
    'Təsdiq yenilikləri, təhlükəsizlik bildirişləri və əməkdaşlıq aktivliyi burada görünəcək.',
  'Open orders': 'Sifarişləri aç',
  'Account Summary': 'Hesab xülasəsi',
  'Change profile details': 'Profil məlumatlarını dəyiş',
  'Open messages workspace': 'Mesajlar bölməsini aç',
  'Check wallet and payouts': 'Pulqabı və çıxarışları yoxla',
  'Open security settings': 'Təhlükəsizlik ayarlarını aç',
  'Sign out from current session': 'Cari sessiyadan çıx',
  'No listings published yet': 'Hələ elan paylaşılmayıb',
  'Create your first job post to start receiving interest and managing it from this panel.':
    'Maraqlar toplamaq və onları bu paneldən idarə etmək üçün ilk iş elanınızı yaradın.',
  Pause: 'Dayandır',
  Activate: 'Aktiv et',
  'No proposals yet': 'Hələ proposal yoxdur',
  'Once you start conversations from public profiles, your proposal activity will appear here.':
    'İctimai profillərdən söhbətlərə başladıqdan sonra proposal aktivliyiniz burada görünəcək.',
  'Browse members': 'Üzvlərə bax',
  'No reviews yet': 'Hələ rəy yoxdur',
  'Reviews will appear after completed collaborations and published work.':
    'Rəylər tamamlanan əməkdaşlıqlardan və yayımlanan işlərdən sonra görünəcək.',
  'No saved items yet': 'Hələ yadda saxlanan element yoxdur',
  'Save strong member profiles to compare them later from one clean place.':
    'Güclü üzv profillərini sonra bir yerdən müqayisə etmək üçün yadda saxlayın.',
  'Full name': 'Tam ad',
  Profession: 'Peşə',
  Headline: 'Başlıq',
  'Select country': 'Ölkə seçin',
  'Phone number': 'Telefon nömrəsi',
  'Hourly rate': 'Saatlıq qiymət',
  'Profile image': 'Profil şəkli',
  'Paste an image URL or upload a JPG, PNG or WEBP file to save it on your profile.':
    'Şəkil URL-i yapışdırın və ya JPG, PNG, WEBP faylı yükləyin ki, profilinizdə saxlanılsın.',
  Skills: 'Bacarıqlar',
  'Save Changes': 'Dəyişiklikləri yadda saxla',
  'Job posting is locked until your verification request is approved.':
    'Təsdiq sorğunuz qəbul olunana qədər iş paylaşımı kilidlidir.',
  'Open verification center': 'Təsdiq mərkəzini aç',
  'Edit Profile': 'Profili redaktə et',
  Dashboard: 'Panel',
  'This Month Earnings': 'Bu ayın gəliri',
  'Tasks Completed': 'Tamamlanan tapşırıqlar',
  'Response Rate': 'Cavab faizi',
  'Pending Requests': 'Gözləyən sorğular',
  'Saved Items': 'Yadda saxlananlar',
  'Avg. Response': 'Orta cavab',
  'Search conversations': 'Söhbətləri axtar',
  'Search notifications': 'Bildirişləri axtar'
});

Object.assign(EXACT_TRANSLATIONS.ru, {
  'Marketplace update': 'Обновление маркетплейса',
  'A few sections are taking longer than usual. The rest of the marketplace is ready to use.':
    'Некоторые разделы загружаются дольше обычного. Остальная часть маркетплейса уже готова к использованию.',
  'Pricing plans are syncing. You can continue browsing the marketplace.':
    'Тарифные планы синхронизируются. Вы можете продолжить просмотр маркетплейса.',
  'Member discovery is refreshing. Please try again in a moment.':
    'Раздел поиска участников обновляется. Попробуйте снова через минуту.',
  'More profiles could not be loaded right now.':
    'Сейчас не удалось загрузить больше профилей.',
  'Saved state could not be updated.':
    'Не удалось обновить состояние сохранения.',
  'Verified digital marketplace': 'Проверенный цифровой маркетплейс',
  'Search verified members, compare portfolios and move from brief to delivery with a cleaner workflow.':
    'Ищите проверенных участников, сравнивайте портфолио и переходите от брифа к результату через более чистый рабочий поток.',
  'Search by skill, focus or category': 'Поиск по навыку, фокусу или категории',
  'Search members': 'Поиск участников',
  'Categories live': 'Категории онлайн',
  'Live job posts': 'Живые вакансии',
  'Loading job posts...': 'Загрузка вакансий...',
  'No matching profile found': 'Подходящий профиль не найден',
  'Adjust the category, search or budget filter to widen the shortlist.':
    'Измените категорию, поиск или фильтр бюджета, чтобы расширить список кандидатов.',
  'Simple plans for cleaner project publishing and collaboration':
    'Простые планы для более чистой публикации проектов и сотрудничества',
  'Pick the billing period and choose the plan that fits your current workflow. Clean, fast and easy to compare.':
    'Выберите период оплаты и тариф, который подходит вашему текущему процессу. Чисто, быстро и удобно для сравнения.',
  'Conversation indexing, unread state and reply flow run through the endpoint-first service layer.':
    'Индексирование диалогов, непрочитанное состояние и ответы работают через service layer с endpoint-first подходом.',
  'Search conversations': 'Поиск диалогов',
  'Write a reply...': 'Напишите ответ...',
  'Sending...': 'Отправка...',
  Send: 'Отправить',
  'Select a conversation to start replying.': 'Выберите диалог, чтобы начать отвечать.',
  'In Review': 'На проверке',
  'Total Value': 'Общая стоимость',
  'Search jobs, updates, categories': 'Искать задачи, обновления, категории',
  'Open chat': 'Открыть чат',
  'Open profile view': 'Открыть профиль',
  'Go to Post Job': 'Перейти к публикации задачи',
  'Submit a short review ticket and wait for admin approval.':
    'Отправьте короткий запрос на проверку и дождитесь одобрения администратора.',
  'Request account verification for posting jobs': 'Запросить проверку аккаунта для публикации задач',
  'Briefly explain what you want to post, who you are, and any proof the admin should review.':
    'Кратко объясните, что вы хотите публиковать, кто вы и какие подтверждения должен проверить администратор.',
  'Submitting...': 'Отправка...',
  'Send verification ticket': 'Отправить заявку на проверку',
  'Your account is already verified.': 'Ваш аккаунт уже подтверждён.',
  'A verification request is already pending. You can submit another one after review.':
    'Запрос на проверку уже ожидает рассмотрения. Вы сможете отправить новый после проверки.',
  'Unread, payment and security events are managed through a dedicated endpoint flow.':
    'Непрочитанные, платежные и защитные события управляются через отдельный endpoint flow.',
  Payments: 'Платежи',
  'Search notifications': 'Поиск уведомлений',
  'Mark all read': 'Отметить все как прочитанные',
  'Updating...': 'Обновление...',
  'Balance, payout and transaction history are loaded through the wallet service layer.':
    'Баланс, вывод средств и история транзакций загружаются через wallet service layer.',
  'All transactions': 'Все транзакции',
  'Enter amount': 'Введите сумму',
  'Requesting...': 'Отправка запроса...',
  'Request withdrawal': 'Запросить вывод средств',
  'Review visibility, featured state and rating filters are managed through the workspace service layer.':
    'Видимость отзывов, статус featured и фильтры рейтинга управляются через workspace service layer.',
  'Remove feature': 'Убрать из избранного',
  Feature: 'Сделать избранным',
  '2FA, login alerts and active session controls are connected to the dedicated security endpoint layer.':
    '2FA, уведомления о входе и управление активными сессиями подключены к отдельному security endpoint layer.',
  'The frontend shows the current state while change requests go through the service layer.':
    'Фронтенд показывает текущее состояние, а запросы на изменения проходят через service layer.',
  'Two-factor authentication': 'Двухфакторная аутентификация',
  'Extra verification during sign-in.': 'Дополнительная проверка при входе.',
  'Email and in-app alerts for new sign-ins.': 'Email и уведомления в приложении о новых входах.',
  'Session lock': 'Блокировка сессии',
  'Require device approval before a new session starts.': 'Требовать подтверждение устройства перед началом новой сессии.',
  'Revoking...': 'Отзыв...',
  Revoke: 'Отозвать',
  'Your account hub is loading...': 'Загружается центр вашего аккаунта...',
  'We could not open your account right now.': 'Сейчас не удалось открыть ваш аккаунт.',
  'Return home': 'Вернуться на главную',
  'Ongoing Tasks': 'Текущие задачи',
  'No active tasks yet': 'Пока нет активных задач',
  'Your current jobs and active deliveries will appear here as soon as work starts.':
    'Ваши текущие задачи и активные этапы доставки появятся здесь, как только работа начнется.',
  Seen: 'Просмотрено',
  'Saving...': 'Сохранение...',
  'No conversations yet': 'Пока нет диалогов',
  'New conversations will appear here as soon as you connect with another member.':
    'Новые диалоги появятся здесь, как только вы свяжетесь с другим участником.',
  'No notifications right now': 'Сейчас нет уведомлений',
  'Verification updates, security alerts and collaboration activity will appear here.':
    'Здесь будут появляться обновления проверки, уведомления безопасности и активность по сотрудничеству.',
  'Open orders': 'Открыть заказы',
  'Account Summary': 'Сводка аккаунта',
  'Change profile details': 'Изменить профиль',
  'Open messages workspace': 'Открыть сообщения',
  'Check wallet and payouts': 'Проверить кошелек и выплаты',
  'Open security settings': 'Открыть настройки безопасности',
  'Sign out from current session': 'Выйти из текущей сессии',
  'No listings published yet': 'Пока нет опубликованных объявлений',
  'Create your first job post to start receiving interest and managing it from this panel.':
    'Создайте свою первую задачу, чтобы начать получать отклики и управлять ими из этой панели.',
  Pause: 'Пауза',
  Activate: 'Активировать',
  'No proposals yet': 'Пока нет предложений',
  'Once you start conversations from public profiles, your proposal activity will appear here.':
    'Как только вы начнете диалоги из публичных профилей, активность по предложениям появится здесь.',
  'Browse members': 'Смотреть участников',
  'No reviews yet': 'Пока нет отзывов',
  'Reviews will appear after completed collaborations and published work.':
    'Отзывы появятся после завершенных сотрудничеств и опубликованных работ.',
  'No saved items yet': 'Пока нет сохраненных элементов',
  'Save strong member profiles to compare them later from one clean place.':
    'Сохраняйте сильные профили участников, чтобы позже сравнить их в одном месте.',
  'Full name': 'Полное имя',
  Profession: 'Профессия',
  Headline: 'Заголовок',
  'Select country': 'Выберите страну',
  'Phone number': 'Номер телефона',
  'Hourly rate': 'Почасовая ставка',
  'Profile image': 'Фото профиля',
  'Paste an image URL or upload a JPG, PNG or WEBP file to save it on your profile.':
    'Вставьте URL изображения или загрузите JPG, PNG или WEBP, чтобы сохранить его в профиле.',
  Skills: 'Навыки',
  'Save Changes': 'Сохранить изменения',
  'Job posting is locked until your verification request is approved.':
    'Публикация задач заблокирована до одобрения вашей проверки.',
  'Open verification center': 'Открыть центр проверки',
  'Edit Profile': 'Редактировать профиль',
  Dashboard: 'Панель',
  'This Month Earnings': 'Доход за этот месяц',
  'Tasks Completed': 'Завершено задач',
  'Response Rate': 'Процент ответов',
  'Pending Requests': 'Ожидающие запросы',
  'Saved Items': 'Сохраненные элементы',
  'Avg. Response': 'Средний ответ'
});

Object.assign(EXACT_TRANSLATIONS.en, {
  'Marketplace update': 'Marketplace update',
  'A few sections are taking longer than usual. The rest of the marketplace is ready to use.':
    'A few sections are taking longer than usual. The rest of the marketplace is ready to use.',
  'Pricing plans are syncing. You can continue browsing the marketplace.':
    'Pricing plans are syncing. You can continue browsing the marketplace.',
  'Member discovery is refreshing. Please try again in a moment.':
    'Member discovery is refreshing. Please try again in a moment.',
  'More profiles could not be loaded right now.':
    'More profiles could not be loaded right now.',
  'Saved state could not be updated.':
    'Saved state could not be updated.',
  'Verified digital marketplace': 'Verified digital marketplace',
  'Search verified members, compare portfolios and move from brief to delivery with a cleaner workflow.':
    'Search verified members, compare portfolios and move from brief to delivery with a cleaner workflow.',
  'Search by skill, focus or category': 'Search by skill, focus or category',
  'Search members': 'Search members',
  'Categories live': 'Categories live',
  'Live job posts': 'Live job posts',
  'Loading job posts...': 'Loading job posts...',
  'No matching profile found': 'No matching profile found',
  'Adjust the category, search or budget filter to widen the shortlist.':
    'Adjust the category, search or budget filter to widen the shortlist.',
  'Simple plans for cleaner project publishing and collaboration':
    'Simple plans for cleaner project publishing and collaboration',
  'Pick the billing period and choose the plan that fits your current workflow. Clean, fast and easy to compare.':
    'Pick the billing period and choose the plan that fits your current workflow. Clean, fast and easy to compare.',
  Free: 'Free',
  '/month': '/month',
  'Ideal for testing the workflow and publishing your first brief.':
    'Ideal for testing the workflow and publishing your first brief.',
  'A strong starting point for verified discovery and active briefs.':
    'A strong starting point for verified discovery and active briefs.',
  'For heavier collaboration, faster routing and stronger visibility.':
    'For heavier collaboration, faster routing and stronger visibility.',
  'Conversation indexing, unread state and reply flow run through the endpoint-first service layer.':
    'Conversation indexing, unread state and reply flow run through the endpoint-first service layer.',
  'Search conversations': 'Search conversations',
  'Write a reply...': 'Write a reply...',
  'Sending...': 'Sending...',
  Send: 'Send',
  'Select a conversation to start replying.': 'Select a conversation to start replying.',
  'In Review': 'In Review',
  'Total Value': 'Total Value',
  'Search jobs, updates, categories': 'Search jobs, updates, categories',
  'Open chat': 'Open chat',
  'Open profile view': 'Open profile view',
  'Go to Post Job': 'Go to Post Job',
  'Submit a short review ticket and wait for admin approval.':
    'Submit a short review ticket and wait for admin approval.',
  'Request account verification for posting jobs': 'Request account verification for posting jobs',
  'Briefly explain what you want to post, who you are, and any proof the admin should review.':
    'Briefly explain what you want to post, who you are, and any proof the admin should review.',
  'Submitting...': 'Submitting...',
  'Send verification ticket': 'Send verification ticket',
  'Your account is already verified.': 'Your account is already verified.',
  'A verification request is already pending. You can submit another one after review.':
    'A verification request is already pending. You can submit another one after review.',
  'Unread, payment and security events are managed through a dedicated endpoint flow.':
    'Unread, payment and security events are managed through a dedicated endpoint flow.',
  Payments: 'Payments',
  'Search notifications': 'Search notifications',
  'Mark all read': 'Mark all read',
  'Updating...': 'Updating...',
  'Balance, payout and transaction history are loaded through the wallet service layer.':
    'Balance, payout and transaction history are loaded through the wallet service layer.',
  'All transactions': 'All transactions',
  'Enter amount': 'Enter amount',
  'Requesting...': 'Requesting...',
  'Request withdrawal': 'Request withdrawal',
  'Review visibility, featured state and rating filters are managed through the workspace service layer.':
    'Review visibility, featured state and rating filters are managed through the workspace service layer.',
  'Remove feature': 'Remove feature',
  Feature: 'Feature',
  '2FA, login alerts and active session controls are connected to the dedicated security endpoint layer.':
    '2FA, login alerts and active session controls are connected to the dedicated security endpoint layer.',
  'The frontend shows the current state while change requests go through the service layer.':
    'The frontend shows the current state while change requests go through the service layer.',
  'Two-factor authentication': 'Two-factor authentication',
  'Extra verification during sign-in.': 'Extra verification during sign-in.',
  'Email and in-app alerts for new sign-ins.': 'Email and in-app alerts for new sign-ins.',
  'Session lock': 'Session lock',
  'Require device approval before a new session starts.': 'Require device approval before a new session starts.',
  'Revoking...': 'Revoking...',
  Revoke: 'Revoke',
  'Your account hub is loading...': 'Your account hub is loading...',
  'We could not open your account right now.': 'We could not open your account right now.',
  'Return home': 'Return home',
  'Ongoing Tasks': 'Ongoing Tasks',
  'No active tasks yet': 'No active tasks yet',
  'Your current jobs and active deliveries will appear here as soon as work starts.':
    'Your current jobs and active deliveries will appear here as soon as work starts.',
  Seen: 'Seen',
  'Saving...': 'Saving...',
  'No conversations yet': 'No conversations yet',
  'New conversations will appear here as soon as you connect with another member.':
    'New conversations will appear here as soon as you connect with another member.',
  'No notifications right now': 'No notifications right now',
  'Verification updates, security alerts and collaboration activity will appear here.':
    'Verification updates, security alerts and collaboration activity will appear here.',
  'Open orders': 'Open orders',
  'Account Summary': 'Account Summary',
  'Change profile details': 'Change profile details',
  'Open messages workspace': 'Open messages workspace',
  'Check wallet and payouts': 'Check wallet and payouts',
  'Open security settings': 'Open security settings',
  'Sign out from current session': 'Sign out from current session',
  'No listings published yet': 'No listings published yet',
  'Create your first job post to start receiving interest and managing it from this panel.':
    'Create your first job post to start receiving interest and managing it from this panel.',
  Pause: 'Pause',
  Activate: 'Activate',
  'No proposals yet': 'No proposals yet',
  'Once you start conversations from public profiles, your proposal activity will appear here.':
    'Once you start conversations from public profiles, your proposal activity will appear here.',
  'Browse members': 'Browse members',
  'No reviews yet': 'No reviews yet',
  'Reviews will appear after completed collaborations and published work.':
    'Reviews will appear after completed collaborations and published work.',
  'No saved items yet': 'No saved items yet',
  'Save strong member profiles to compare them later from one clean place.':
    'Save strong member profiles to compare them later from one clean place.',
  'Full name': 'Full name',
  Profession: 'Profession',
  Headline: 'Headline',
  'Select country': 'Select country',
  'Phone number': 'Phone number',
  'Hourly rate': 'Hourly rate',
  'Profile image': 'Profile image',
  'Paste an image URL or upload a JPG, PNG or WEBP file to save it on your profile.':
    'Paste an image URL or upload a JPG, PNG or WEBP file to save it on your profile.',
  Skills: 'Skills',
  'Save Changes': 'Save Changes',
  'Job posting is locked until your verification request is approved.':
    'Job posting is locked until your verification request is approved.',
  'Open verification center': 'Open verification center',
  'Edit Profile': 'Edit Profile',
  Dashboard: 'Dashboard',
  'This Month Earnings': 'This Month Earnings',
  'Tasks Completed': 'Tasks Completed',
  'Response Rate': 'Response Rate',
  'Pending Requests': 'Pending Requests',
  'Saved Items': 'Saved Items',
  'Avg. Response': 'Avg. Response'
});

Object.assign(EXACT_TRANSLATIONS.az, {
  '1 active job post with 15-day active duration.': '1 aktiv iş elanı ilə 15 günlük aktivlik verir.',
  '5 active job posts with 30-day renewal cycle.': '5 aktiv iş elanı verir və hər 30 gündən bir yenilənir.',
  'Unlimited active job posts with no renewal deadline.': 'Limitsiz iş elanı verir və yenilənmə müddəti yoxdur.',
  'Welcome back!': 'Xoş gəldiniz!',
  'Please enter your details': 'Zəhmət olmasa məlumatlarınızı daxil edin'
});

Object.assign(EXACT_TRANSLATIONS.ru, {
  '1 active job post with 15-day active duration.': '1 активное объявление с активностью на 15 дней.',
  '5 active job posts with 30-day renewal cycle.': '5 активных объявлений с обновлением каждые 30 дней.',
  'Unlimited active job posts with no renewal deadline.': 'Безлимитные объявления без срока обновления.',
  'Welcome back!': 'С возвращением!',
  'Please enter your details': 'Пожалуйста, введите ваши данные'
});

Object.assign(EXACT_TRANSLATIONS.en, {
  '1 active job post with 15-day active duration.': '1 active job post with 15-day active duration.',
  '5 active job posts with 30-day renewal cycle.': '5 active job posts with 30-day renewal cycle.',
  'Unlimited active job posts with no renewal deadline.': 'Unlimited active job posts with no renewal deadline.',
  'Welcome back!': 'Welcome back!',
  'Please enter your details': 'Please enter your details'
});

Object.assign(EXACT_TRANSLATIONS.az, {
  'Verification code must be 4 digits.': 'Təsdiq kodu 4 rəqəmdən ibarət olmalıdır.',
  'Enter the 4-digit code from your email.': 'Emailinizə gələn 4 rəqəmli kodu daxil edin.'
});

Object.assign(EXACT_TRANSLATIONS.ru, {
  'Verification code must be 4 digits.': 'Код подтверждения должен состоять из 4 цифр.',
  'Enter the 4-digit code from your email.': 'Введите 4-значный код из письма.'
});

Object.assign(EXACT_TRANSLATIONS.en, {
  'Verification code must be 4 digits.': 'Verification code must be 4 digits.',
  'Enter the 4-digit code from your email.': 'Enter the 4-digit code from your email.'
});

const PATTERN_TRANSLATORS = [
  {
    test: /^(\d+) sellers matched your current filters\.$/i,
    render(language, [, count]) {
      if (language === 'az') return `${count} satıcı cari filtrlərə uyğun gəldi.`;
      if (language === 'ru') return `${count} продавцов соответствуют текущим фильтрам.`;
      return `${count} sellers matched your current filters.`;
    }
  },
  {
    test: /^(\d+) tasks from (.+)$/i,
    render(language, [, count, name]) {
      if (language === 'az') return `${name} tərəfindən ${count} tapşırıq`;
      if (language === 'ru') return `${count} задач от ${name}`;
      return `${count} tasks from ${name}`;
    }
  },
  {
    test: /^(\d+) active tasks$/i,
    render(language, [, count]) {
      if (language === 'az') return `${count} aktiv tapşırıq`;
      if (language === 'ru') return `${count} активных задач`;
      return `${count} active tasks`;
    }
  },
  {
    test: /^(\d+) reviews$/i,
    render(language, [, count]) {
      if (language === 'az') return `${count} rəy`;
      if (language === 'ru') return `${count} отзывов`;
      return `${count} reviews`;
    }
  },
  {
    test: /^(\d+) review$/i,
    render(language, [, count]) {
      if (language === 'az') return `${count} rəy`;
      if (language === 'ru') return `${count} отзыв`;
      return `${count} review`;
    }
  },
  {
    test: /^(\d+(?:\.\d+)?) rating$/i,
    render(language, [, value]) {
      if (language === 'az') return `${value} reytinq`;
      if (language === 'ru') return `${value} рейтинг`;
      return `${value} rating`;
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
    test: /^Member since (.+)$/i,
    render(language, [, value]) {
      if (language === 'az') return `${value} tarixindən üzvdür`;
      if (language === 'ru') return `Участник с ${value}`;
      return `Member since ${value}`;
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

Object.assign(EXACT_TRANSLATIONS.az, {
  'Starting from': 'Başlanğıc qiymət',
  'User review': 'istifadəçi rəyi'
});

Object.assign(EXACT_TRANSLATIONS.ru, {
  'Starting from': 'Стартовая цена',
  'User review': 'отзыв пользователя'
});

Object.assign(EXACT_TRANSLATIONS.en, {
  'Starting from': 'Starting from',
  'User review': 'User review'
});

Object.assign(EXACT_TRANSLATIONS.az, TRANSLATION_OVERRIDES.az);
Object.assign(EXACT_TRANSLATIONS.ru, TRANSLATION_OVERRIDES.ru);
Object.assign(EXACT_TRANSLATIONS.en, TRANSLATION_OVERRIDES.en);
Object.assign(EXACT_TRANSLATIONS.az, PROFILE_TRANSLATION_OVERRIDES.az);
Object.assign(EXACT_TRANSLATIONS.ru, PROFILE_TRANSLATION_OVERRIDES.ru);
Object.assign(EXACT_TRANSLATIONS.en, PROFILE_TRANSLATION_OVERRIDES.en);
Object.assign(EXACT_TRANSLATIONS.az, TASK_DETAIL_TRANSLATION_OVERRIDES.az);
Object.assign(EXACT_TRANSLATIONS.ru, TASK_DETAIL_TRANSLATION_OVERRIDES.ru);
Object.assign(EXACT_TRANSLATIONS.en, TASK_DETAIL_TRANSLATION_OVERRIDES.en);
Object.assign(EXACT_TRANSLATIONS.az, WORKSPACE_TRANSLATION_OVERRIDES.az);
Object.assign(EXACT_TRANSLATIONS.ru, WORKSPACE_TRANSLATION_OVERRIDES.ru);
Object.assign(EXACT_TRANSLATIONS.en, WORKSPACE_TRANSLATION_OVERRIDES.en);

function normalizeTranslationKey(value) {
  return String(value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const NORMALIZED_TRANSLATIONS = Object.fromEntries(
  Object.entries(EXACT_TRANSLATIONS).map(([language, dictionary]) => [
    language,
    Object.fromEntries(
      Object.entries(dictionary).map(([key, value]) => [normalizeTranslationKey(key), value])
    )
  ])
);

function preserveWhitespace(source, translated) {
  const leading = source.match(/^\s*/)?.[0] || '';
  const trailing = source.match(/\s*$/)?.[0] || '';

  return `${leading}${decodeMojibake(translated)}${trailing}`;
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

  const normalizedMatch = NORMALIZED_TRANSLATIONS[language]?.[normalizeTranslationKey(trimmed)];
  if (normalizedMatch) {
    return preserveWhitespace(text, normalizedMatch);
  }

  for (const item of PATTERN_TRANSLATORS) {
    const match = trimmed.match(item.test);
    if (match) {
      return preserveWhitespace(text, item.render(language, match));
    }
  }

  return decodeMojibake(text);
}
