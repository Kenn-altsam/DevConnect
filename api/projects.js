import admin from 'firebase-admin';

const SUPPORTED_LANGUAGES = ['en', 'ru', 'kk'];

function normalizeLanguage(lang) {
  if (typeof lang !== 'string') return 'en';
  const normalized = lang.trim().toLowerCase().split(/[-_]/)[0];
  return SUPPORTED_LANGUAGES.includes(normalized) ? normalized : 'en';
}

function getMessages(lang) {
  const messages = {
    en: {
      methodNotAllowed: 'Method not allowed.',
      titleRequired: 'Project title is required.',
      budgetRequired: 'Budget is required.',
      timelineRequired: 'Timeline is required.',
      stackRequired: 'Tech stack is required.',
      descriptionRequired: 'Project description must be between 20 and 3000 characters.',
      outcomeRequired: 'Expected outcome must be between 10 and 1500 characters.',
      listFailed: 'Unable to load projects right now.',
      createFailed: 'Unable to publish the project right now.',
      created: 'Project published successfully.'
    },
    ru: {
      methodNotAllowed: 'Метод не поддерживается.',
      titleRequired: 'Укажите название проекта.',
      budgetRequired: 'Укажите бюджет.',
      timelineRequired: 'Укажите срок.',
      stackRequired: 'Укажите технологический стек.',
      descriptionRequired: 'Описание проекта должно содержать от 20 до 3000 символов.',
      outcomeRequired: 'Ожидаемый результат должен содержать от 10 до 1500 символов.',
      listFailed: 'Сейчас не удалось загрузить проекты.',
      createFailed: 'Сейчас не удалось опубликовать проект.',
      created: 'Проект успешно опубликован.'
    },
    kk: {
      methodNotAllowed: 'Бұл әдіске рұқсат етілмейді.',
      titleRequired: 'Жоба атауын енгізіңіз.',
      budgetRequired: 'Бюджетті енгізіңіз.',
      timelineRequired: 'Мерзімді енгізіңіз.',
      stackRequired: 'Технологиялық стекті енгізіңіз.',
      descriptionRequired: 'Жоба сипаттамасы 20 мен 3000 таңба аралығында болуы керек.',
      outcomeRequired: 'Күтілетін нәтиже 10 мен 1500 таңба аралығында болуы керек.',
      listFailed: 'Қазір жобаларды жүктеу мүмкін болмады.',
      createFailed: 'Қазір жобаны жариялау мүмкін болмады.',
      created: 'Жоба сәтті жарияланды.'
    }
  };

  return messages[normalizeLanguage(lang)];
}

function initFirebase() {
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error(
      'Missing Firebase configuration. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.'
    );
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    });
  }

  return admin.firestore();
}

function normalizeField(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validateProjectPayload(payload = {}, lang = 'en') {
  const messages = getMessages(lang);
  const projectTitle = normalizeField(payload.projectTitle);
  const budget = normalizeField(payload.budget);
  const timeline = normalizeField(payload.timeline);
  const techStack = normalizeField(payload.techStack);
  const projectDescription = normalizeField(payload.projectDescription);
  const expectedOutcome = normalizeField(payload.expectedOutcome);

  if (projectTitle.length < 3 || projectTitle.length > 120) {
    return { error: messages.titleRequired };
  }

  if (!budget || budget.length > 80) {
    return { error: messages.budgetRequired };
  }

  if (!timeline || timeline.length > 80) {
    return { error: messages.timelineRequired };
  }

  if (!techStack || techStack.length > 200) {
    return { error: messages.stackRequired };
  }

  if (projectDescription.length < 20 || projectDescription.length > 3000) {
    return { error: messages.descriptionRequired };
  }

  if (expectedOutcome.length < 10 || expectedOutcome.length > 1500) {
    return { error: messages.outcomeRequired };
  }

  return {
    value: {
      projectTitle,
      budget,
      timeline,
      techStack,
      projectDescription,
      expectedOutcome
    }
  };
}

function mapProject(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    projectTitle: data.projectTitle,
    budget: data.budget,
    timeline: data.timeline,
    techStack: data.techStack,
    projectDescription: data.projectDescription,
    expectedOutcome: data.expectedOutcome,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null
  };
}

export default async function handler(req, res) {
  const lang = normalizeLanguage(req.headers['accept-language']);
  const messages = getMessages(lang);

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, message: messages.methodNotAllowed });
  }

  try {
    const db = initFirebase();
    const collectionName = process.env.FIREBASE_PROJECTS_COLLECTION || 'projects';
    const collection = db.collection(collectionName);

    if (req.method === 'GET') {
      const snapshot = await collection.orderBy('createdAt', 'desc').limit(24).get();
      const projects = snapshot.docs.map(mapProject);
      return res.status(200).json({ success: true, projects });
    }

    const { error, value } = validateProjectPayload(req.body, lang);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const docRef = await collection.add({
      ...value,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const createdDoc = await docRef.get();
    return res.status(201).json({
      success: true,
      message: messages.created,
      project: mapProject(createdDoc)
    });
  } catch (error) {
    console.error('Projects API error:', error);
    const message = req.method === 'GET' ? messages.listFailed : messages.createFailed;
    return res.status(500).json({ success: false, message });
  }
}
