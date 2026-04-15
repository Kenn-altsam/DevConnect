const { admin, initFirebase } = require('../config/firebase');
const { validateContactPayload, normalizeLanguage } = require('../utils/validateContactPayload');

function getContactResponseMessages(lang) {
  const messages = {
    en: {
      stored: 'Contact request stored successfully.',
      failed: 'Unable to send the request right now.'
    },
    ru: {
      stored: 'Запрос успешно сохранен.',
      failed: 'Сейчас не удалось отправить запрос.'
    },
    kk: {
      stored: 'Сұраныс сәтті сақталды.',
      failed: 'Қазір сұранысты жіберу мүмкін болмады.'
    }
  };

  return messages[lang] || messages.en;
}

async function createContactRequest(req, res) {
  const lang = normalizeLanguage(req.get('Accept-Language'));
  const messages = getContactResponseMessages(lang);
  const { error, value } = validateContactPayload(req.body, lang);

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  try {
    const db = initFirebase();
    const collectionName = process.env.FIREBASE_CONTACT_COLLECTION || 'contactRequests';

    const docRef = await db.collection(collectionName).add({
      ...value,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(201).json({
      success: true,
      id: docRef.id,
      message: messages.stored
    });
  } catch (err) {
    console.error('Failed to store contact request in Firebase:', err);

    return res.status(500).json({
      success: false,
      message: messages.failed
    });
  }
}

module.exports = { createContactRequest };
