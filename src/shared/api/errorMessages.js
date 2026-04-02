function collectErrorMessages(errors) {
  if (!errors || typeof errors !== 'object') {
    return [];
  }

  return Object.values(errors)
    .flatMap((value) => {
      if (Array.isArray(value)) {
        return value;
      }

      return value ? [value] : [];
    })
    .map((value) => String(value).trim())
    .filter(Boolean);
}

function fallbackMessageByStatus(status) {
  switch (status) {
    case 400:
      return 'Gonderdiyiniz melumatlarda problem var. Zehmet olmasa yeniden yoxlayin.';
    case 401:
      return 'Sessiyaniz bitib. Zehmet olmasa yeniden daxil olun.';
    case 403:
      return 'Bu emeliyyat ucun icazeniz yoxdur.';
    case 404:
      return 'Axtardiginiz melumat tapilmadi.';
    case 409:
      return 'Bu emeliyyat hazirki veziyyetle uzlesmir.';
    case 422:
      return 'Melumatlar tesdiqden kecmedi. Zehmet olmasa saheleri yeniden yoxlayin.';
    case 500:
      return 'Server terefde gozlenilmez xeta bas verdi. Bir az sonra yeniden cehd edin.';
    default:
      return 'Emeliyyati tamamlamak mumkun olmadi. Bir daha cehd edin.';
  }
}

function toFriendlyErrorMessage(message, status) {
  const normalizedMessage = String(message || '').trim();
  const lowerMessage = normalizedMessage.toLowerCase();

  if (!normalizedMessage || normalizedMessage === '[object Object]') {
    return fallbackMessageByStatus(status);
  }

  if (
    lowerMessage === `http ${status}` ||
    lowerMessage.startsWith('http ') ||
    lowerMessage.includes('validation failed')
  ) {
    return fallbackMessageByStatus(status || 400);
  }

  const knownMessages = [
    {
      match: ['failed to fetch', 'networkerror'],
      message: 'Servere qosulmaq mumkun olmadi. Internetinizi ve backend servisini yoxlayin.'
    },
    {
      match: ['plan allows up to', 'upgrade your plan to publish more'],
      message: 'Cari abunelik limitiniz dolub. Daha cox is elani paylasmaq ucun paketinizi yenileyin.'
    },
    {
      match: ['you must be verified before posting a job'],
      message: 'Is elani paylasmaq ucun once hesabiniz verify olunmalidir.'
    },
    {
      match: ['you cannot start a conversation with yourself', 'your own profile', 'your own job post'],
      message: 'Ozunuz ile conversation baslada bilmezsiniz.'
    },
    {
      match: ['message text is required'],
      message: 'Mesaj metnini yazin.'
    },
    {
      match: ['conversation not found'],
      message: 'Conversation tapilmadi.'
    },
    {
      match: ['notification was not found'],
      message: 'Bildiris tapilmadi.'
    },
    {
      match: ['session was not found'],
      message: 'Sessiya tapilmadi.'
    },
    {
      match: ['review was not found'],
      message: 'Rey tapilmadi.'
    },
    {
      match: ['withdrawal amount must be greater than zero'],
      message: 'Cixarish meblegini duzgun daxil edin.'
    },
    {
      match: ['wallet balance is not enough', 'balance is not enough for this hire'],
      message: 'Balansiniz kifayet etmir. Zehmet olmasa once balansinizi artirin.'
    },
    {
      match: ['current password is required'],
      message: 'Cari sifreni daxil edin.'
    },
    {
      match: ['new password is required'],
      message: 'Yeni sifreni daxil edin.'
    },
    {
      match: ['password confirmation does not match'],
      message: 'Sifre tesdiqi uygun gelmir.'
    },
    {
      match: ['only jpg, png and webp images can be uploaded'],
      message: 'Yalniz JPG, PNG ve WEBP sekilleri yukleye bilersiniz.'
    },
    {
      match: ['image size cannot exceed 2 mb'],
      message: 'Sekilin olcusu boyukdur. Zehmet olmasa daha kicik sekil secin.'
    },
    {
      match: ['image preview data is invalid', 'file could not be read'],
      message: 'Secdiyiniz sekil oxuna bilmedi. Zehmet olmasa yeniden secin.'
    }
  ];

  const matchedMessage = knownMessages.find((item) =>
    item.match.some((value) => lowerMessage.includes(value))
  );

  return matchedMessage?.message || normalizedMessage;
}

export function extractErrorMessage(payload, status) {
  const validationMessages = collectErrorMessages(payload?.errors);

  if (validationMessages.length) {
    return fallbackMessageByStatus(status || 400);
  }

  if (typeof payload === 'string') {
    return toFriendlyErrorMessage(payload, status);
  }

  return toFriendlyErrorMessage(payload?.message || payload?.error || `HTTP ${status}`, status);
}
