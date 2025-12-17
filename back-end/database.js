const mysql = require('mysql2/promise');

const RESET_DB = true;

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const WORDS = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur",
    "adipiscing", "elit", "sed", "do", "eiusmod", "tempor",
    "incididunt", "ut", "labore", "dolore", "magna", "aliqua",
    "veniam", "quis", "nostrud", "exercitation", "ullamco",
    "laboris", "aliquip", "commodo", "consequat", "duis",
    "aute", "irure", "reprehenderit", "voluptate"
];

const generateText = (numWords = 50) => {
    const sentence = Array.from({ length: numWords }, () =>
        WORDS[Math.floor(Math.random() * WORDS.length)]
    ).join(" ");

    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
};

const generateParagraphs = (numParagraphs = 3, wordsPerParagraph = 80) =>
    Array.from({ length: numParagraphs }, () => generateText(wordsPerParagraph))
        .join("\n\n");

const dbhost = process.env.DB_HOST;
const dbuser = process.env.DB_USER;
const dbpass = process.env.DB_PASSWORD
const database = process.env.DB_NAME;
// ======================= DATABASE SETUP =======================
async function setupDatabase() {
    try {
        const conn = await mysql.createConnection({
            host: dbhost,
            user: dbuser,
            password: dbpass,
        });

        await conn.query('CREATE DATABASE IF NOT EXISTS studytracker');
        await conn.end();

        const db = await mysql.createConnection({
            host: dbhost,
            user: dbuser,
            password: dbpass,
            database: database,
            multipleStatements: true,
        });

        console.log('✅ Connected with database "studytracker"');

        const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS providers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        website VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        provider_id INT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
        FOREIGN KEY (provider_id) REFERENCES providers (id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS chapters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        position INT,
        FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS lessons (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chapter_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        position INT,
        FOREIGN KEY (chapter_id) REFERENCES chapters (id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS user_progress (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        course_id INT NOT NULL,
        chapter_id INT,
        lesson_id INT,
        completed TINYINT(1) NOT NULL DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE,
        FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
      );
    `;
        await db.query(schema);
        console.log('✅ Tables have been checked or created if they were not there.');

        const [count] = await db.query('SELECT COUNT(*) AS total FROM users');
        const isEmpty = count[0].total === 0;

        if (isEmpty) {
            console.log('📭 Database is empty start seeding...');
            await seedDatabase(db);
        } else {
            console.log('📚 Database already contains data skipping seeding');
        }

        return db;

    } catch (err) {
        console.error('❌ Error with setup:', err);
    }
}

// ======================= RESET & SEED =======================
async function resetDatabase(db) {
    console.log('🧹 Database is being cleaned...');
    await db.query(`
        SET FOREIGN_KEY_CHECKS = 0;
        TRUNCATE TABLE user_progress;
        TRUNCATE TABLE lessons;
        TRUNCATE TABLE chapters;
        TRUNCATE TABLE courses;
        TRUNCATE TABLE providers;
        TRUNCATE TABLE users;
        SET FOREIGN_KEY_CHECKS = 1;
    `);
    console.log('✅ Database Clean.');
}

async function seedDatabase(db) {
    console.log('🌱 Seeding started...');

    const users = Array.from({ length: 20 }, (_, i) => [`User ${i + 1}`, `user${i + 1}@example.com`]);
    await db.query('INSERT INTO users (name, email) VALUES ?', [users]);
    const [userRows] = await db.query('SELECT * FROM users');

    const providers = [
        ['Zenva', 'https://zenva.com'],
        ['Udemy', 'https://udemy.com'],
        ['Coursera', 'https://coursera.org'],
        ['Codecademy', 'https://codecademy.com']
    ];
    await db.query('INSERT INTO providers (name, website) VALUES ?', [providers]);
    const [providerRows] = await db.query('SELECT * FROM providers');

    const courseTitles = [
        "JavaScript Basics", "Python Essentials", "React Fundamentals", "Node.js Deep Dive",
        "SQL Mastery", "Data Structures", "Algorithms 101", "Web Security",
        "DevOps Intro", "Cloud Computing", "Machine Learning", "AI Concepts",
        "UI/UX Design", "Docker for Beginners", "Linux Administration"
    ];

    const images = ["/images/blue-sky.jpg", "/images/people-on-a-street.jpg"];

    const courses = [];
    userRows.forEach((user) => {
        const numCourses = user.id >= 2 && user.id <= 5 ? randInt(2, 5) : 1;
        for (let i = 0; i < numCourses; i++) {
            const provider = providerRows[randInt(0, providerRows.length - 1)];
            const title = courseTitles[randInt(0, courseTitles.length - 1)];
            const description = generateParagraphs(3, 60);
            const image_url = images[i % images.length];
            courses.push([user.id, provider.id, title, description, image_url]);
        }
    });
    await db.query('INSERT INTO courses (user_id, provider_id, title, description, image_url) VALUES ?', [courses]);
    const [courseRows] = await db.query('SELECT * FROM courses');

    const chapters = [];
    courseRows.forEach((course) => {
        for (let ch = 1; ch <= 10; ch++) {
            chapters.push([
                course.id,
                `Hoofdstuk ${ch} - ${course.title}`,
                generateParagraphs(1, 80),
                ch
            ]);
        }
    });
    await db.query('INSERT INTO chapters (course_id, title, description, position) VALUES ?', [chapters]);
    const [chapterRows] = await db.query('SELECT * FROM chapters');

    const lessons = [];
    chapterRows.forEach((chapter) => {
        const numLessons = randInt(1, 30);
        for (let l = 1; l <= numLessons; l++) {
            lessons.push([
                chapter.id,
                `Les ${l} van ${chapter.title}`,
                generateParagraphs(1, 50),
                l
            ]);
        }
    });
    await db.query('INSERT INTO lessons (chapter_id, title, content, position) VALUES ?', [lessons]);
    const [lessonRows] = await db.query('SELECT * FROM lessons');

    const progress = [];
    const usersWithCourses = userRows.slice(0, 10);

    usersWithCourses.forEach((user, uIdx) => {
        courseRows.forEach((course, cIdx) => {
            const chaptersOfCourse = chapterRows.filter(ch => ch.course_id === course.id);
            chaptersOfCourse.forEach((chapter) => {
                const lessonsOfChapter = lessonRows.filter(l => l.chapter_id === chapter.id);
                lessonsOfChapter.forEach((lesson) => {
                    let completed = 0;
                    if (uIdx === 0 && cIdx === 0) completed = 1;
                    else if (!(uIdx === 9 && cIdx === 0)) completed = Math.random() < 0.5 ? 1 : 0;
                    progress.push([user.id, course.id, chapter.id, lesson.id, completed]);
                });
            });
        });
    });

    await db.query(
        `INSERT INTO user_progress (user_id, course_id, chapter_id, lesson_id, completed) VALUES ?`,
        [progress]
    );

    console.log('✅ Example data added to database!');
}

// ======================= HYBRIDE EXECUTION =======================
if (require.main === module) {
    setupDatabase().then(async (db) => {
        if (RESET_DB) {
            await resetDatabase(db);
            await seedDatabase(db);
        }
        console.log('✅ Setup finished!');
        await db.end();
        console.log('🔒 Connection closed.');
    });
} else {
    module.exports = setupDatabase;
}
