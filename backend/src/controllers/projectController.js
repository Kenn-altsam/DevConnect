const { admin, initFirebase } = require('../config/firebase');
const { normalizeLanguage, validateProjectPayload } = require('../utils/validateProjectPayload');

function getProjectResponseMessages(lang) {
  const messages = {
    en: {
      created: 'Project published successfully.',
      listFailed: 'Unable to load projects right now.',
      createFailed: 'Unable to publish the project right now.'
    },
    ru: {
      created: 'Проект успешно опубликован.',
      listFailed: 'Сейчас не удалось загрузить проекты.',
      createFailed: 'Сейчас не удалось опубликовать проект.'
    },
    kk: {
      created: 'Жоба сәтті жарияланды.',
      listFailed: 'Қазір жобаларды жүктеу мүмкін болмады.',
      createFailed: 'Қазір жобаны жариялау мүмкін болмады.'
    }
  };

  return messages[lang] || messages.en;
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

function getProjectsCollection() {
  const db = initFirebase();
  const collectionName = process.env.FIREBASE_PROJECTS_COLLECTION || 'projects';
  return db.collection(collectionName);
}

async function listProjects(req, res) {
  const lang = normalizeLanguage(req.get('Accept-Language'));
  const messages = getProjectResponseMessages(lang);

  try {
    const snapshot = await getProjectsCollection()
      .orderBy('createdAt', 'desc')
      .limit(24)
      .get();

    return res.json({
      success: true,
      projects: snapshot.docs.map(mapProject)
    });
  } catch (err) {
    console.error('Failed to load projects from Firebase:', err);

    return res.status(500).json({
      success: false,
      message: messages.listFailed
    });
  }
}

async function createProject(req, res) {
  const lang = normalizeLanguage(req.get('Accept-Language'));
  const messages = getProjectResponseMessages(lang);
  const { error, value } = validateProjectPayload(req.body, lang);

  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  try {
    const docRef = await getProjectsCollection().add({
      ...value,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    const createdDoc = await docRef.get();

    return res.status(201).json({
      success: true,
      message: messages.created,
      project: mapProject(createdDoc)
    });
  } catch (err) {
    console.error('Failed to store project in Firebase:', err);

    return res.status(500).json({
      success: false,
      message: messages.createFailed
    });
  }
}

module.exports = {
  createProject,
  listProjects
};
