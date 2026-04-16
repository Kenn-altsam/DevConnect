const { admin, initFirebase } = require('../config/firebase');
const {
  normalizeLanguage,
  validateDeveloperApplicationPayload
} = require('../utils/validateDeveloperApplicationPayload');

function getDeveloperApplicationResponseMessages(lang) {
  const messages = {
    en: {
      created: 'Developer application submitted successfully.',
      listFailed: 'Unable to load developer profiles right now.',
      createFailed: 'Unable to submit the application right now.'
    },
    ru: {
      created: 'Заявка разработчика успешно отправлена.',
      listFailed: 'Сейчас не удалось загрузить профили разработчиков.',
      createFailed: 'Сейчас не удалось отправить заявку.'
    },
    kk: {
      created: 'Әзірлеуші өтінімі сәтті жіберілді.',
      listFailed: 'Қазір әзірлеуші профильдерін жүктеу мүмкін болмады.',
      createFailed: 'Қазір өтінімді жіберу мүмкін болмады.'
    }
  };

  return messages[lang] || messages.en;
}

function getDeveloperApplicationsCollection() {
  const db = initFirebase();
  const collectionName = process.env.FIREBASE_DEVELOPER_APPLICATIONS_COLLECTION || 'developerApplications';
  return db.collection(collectionName);
}

function mapDeveloperProfile(doc) {
  const data = doc.data();

  return {
    id: doc.id,
    fullName: data.fullName,
    role: data.role,
    location: data.location,
    mainStack: data.mainStack,
    portfolioLinks: data.portfolioLinks,
    experienceSummary: data.experienceSummary,
    status: data.status || 'new',
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null
  };
}

async function listDeveloperApplications(req, res) {
  const lang = normalizeLanguage(req.get('Accept-Language'));
  const messages = getDeveloperApplicationResponseMessages(lang);

  try {
    const snapshot = await getDeveloperApplicationsCollection()
      .orderBy('createdAt', 'desc')
      .limit(24)
      .get();

    return res.json({
      success: true,
      developers: snapshot.docs.map(mapDeveloperProfile)
    });
  } catch (err) {
    console.error('Failed to load developer profiles from Firebase:', err);

    return res.status(500).json({
      success: false,
      message: messages.listFailed
    });
  }
}

async function createDeveloperApplication(req, res) {
  const lang = normalizeLanguage(req.get('Accept-Language'));
  const messages = getDeveloperApplicationResponseMessages(lang);
  const { error, value } = validateDeveloperApplicationPayload(req.body, lang);

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  try {
    const docRef = await getDeveloperApplicationsCollection().add({
      ...value,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(201).json({
      success: true,
      id: docRef.id,
      message: messages.created
    });
  } catch (err) {
    console.error('Failed to store developer application in Firebase:', err);

    return res.status(500).json({
      success: false,
      message: messages.createFailed
    });
  }
}

module.exports = {
  createDeveloperApplication,
  listDeveloperApplications
};
