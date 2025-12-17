const express = require('express');
const cors = require('cors');
const setupDatabase = require('./database');

const app = express();
const PORT = process.env.port;

app.use(cors());
app.use(express.json());

let db;

// ======================= STARTUP =======================
(async () => {
    try {
        db = await setupDatabase();
        console.log('🚀 Connected to MySQL database');

        // ======================= USERS =======================

        // GET alle users
        app.get('/users', async (req, res) => {
            try {
                const [rows] = await db.query('SELECT * FROM users');
                res.json(rows);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        // GET user with ID
        app.get('/users/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
                if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
                res.json(rows[0]);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        // POST new user
        app.post('/users', async (req, res) => {
            try {
                const { name, email } = req.body;
                const [result] = await db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
                res.status(201).json({ id: result.insertId, name, email });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        // ======================= USER DETAILS =======================
        app.get("/users/:id/details", async (req, res) => {
            const { id } = req.params;

            try {
                const [userRows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
                if (userRows.length === 0) {
                    return res.status(404).json({ error: "User not found" });
                }
                const user = userRows[0];

                const [courseRows] = await db.query(`
      SELECT c.*, p.name AS provider_name, p.id AS provider_id
      FROM courses c
      LEFT JOIN providers p ON c.provider_id = p.id
      WHERE c.user_id = ?;
    `, [id]);

                if (courseRows.length === 0) {
                    return res.json({ ...user, courses: [] });
                }

                const courses = [];

                for (const course of courseRows) {
                    const [chapterRows] = await db.query(
                        'SELECT * FROM chapters WHERE course_id = ? ORDER BY position ASC',
                        [course.id]
                    );

                    const chapters = [];
                    let totalLessons = 0;
                    let totalCompleted = 0;

                    for (const chapter of chapterRows) {
                        const [lessonRows] = await db.query(`
          SELECT l.*, COALESCE(up.completed, 0) AS completed
          FROM lessons l
          LEFT JOIN user_progress up
            ON up.lesson_id = l.id AND up.user_id = ?
          WHERE l.chapter_id = ?
          ORDER BY l.position ASC
        `, [id, chapter.id]);

                        const completedCount = lessonRows.filter(l => l.completed === 1).length;
                        totalLessons += lessonRows.length;
                        totalCompleted += completedCount;

                        chapters.push({ ...chapter, lessons: lessonRows });
                    }

                    const progress = totalLessons > 0
                        ? Math.round((totalCompleted / totalLessons) * 100)
                        : 0;

                    courses.push({
                        ...course,
                        provider: { id: course.provider_id, name: course.provider_name },
                        chapters,
                        progress
                    });
                }

                res.json({ ...user, courses });

            } catch (err) {
                console.error('❌ Fout bij ophalen user details:', err);
                res.status(500).json({ error: err.message });
            }
        });

        // ======================= Extra route so progress gets managed ============================

        // ======================= USER PROGRESS TOGGLE =======================
        app.patch("/api/progress/toggle", async (req, res) => {
            const { user_id, course_id, chapter_id, lesson_id, completed } = req.body;

            if (!user_id || !course_id || !chapter_id || !lesson_id) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            try {
                const [existing] = await db.query(
                    `
            SELECT id
            FROM user_progress
            WHERE user_id = ?
            AND course_id = ?
            AND chapter_id = ?
            AND lesson_id = ?
            `,
                    [user_id, course_id, chapter_id, lesson_id]
                );

                if (existing.length > 0) {
                    await db.query(
                        `
                UPDATE user_progress
                SET completed = ?
                WHERE id = ?
                `,
                        [completed, existing[0].id]
                    );

                    return res.json({ message: "updated", updated: true });
                }

                await db.query(
                    `
            INSERT INTO user_progress (user_id, course_id, chapter_id, lesson_id, completed)
            VALUES (?, ?, ?, ?, ?)
            `,
                    [user_id, course_id, chapter_id, lesson_id, completed]
                );

                res.json({ message: "inserted", updated: false });

            } catch (err) {
                console.error("❌ Error toggling progress:", err);
                res.status(500).json({ error: err.message });
            }
        });



        // ======================= PROVIDERS =======================

        // GET all providers
        app.get('/providers', async (req, res) => {
            try {
                const [rows] = await db.query('SELECT * FROM providers');
                res.json(rows);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        // GET provider with ID
        app.get('/providers/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const [rows] = await db.query('SELECT * FROM providers WHERE id = ?', [id]);
                if (rows.length === 0) return res.status(404).json({ error: 'Provider niet gevonden' });
                res.json(rows[0]);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        // GET courses from provider
        app.get('/providers/:providerId/courses', async (req, res) => {
            try {
                const { providerId } = req.params;
                const [rows] = await db.query('SELECT * FROM courses WHERE provider_id = ?', [providerId]);
                res.json(rows);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        // POST new provider
        app.post('/providers', async (req, res) => {
            try {
                const { name, website } = req.body;
                const [result] = await db.query('INSERT INTO providers (name, website) VALUES (?, ?)', [name, website]);
                res.status(201).json({ id: result.insertId, name, website });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        // ======================= COURSES =======================

        // GET all courses
        app.get('/courses', async (req, res) => {
            try {
                const [rows] = await db.query('SELECT * FROM courses');
                res.json(rows);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        // GET courses from user
        app.get('/users/:userId/courses', async (req, res) => {
            try {
                const { userId } = req.params;
                const [rows] = await db.query('SELECT * FROM courses WHERE user_id = ?', [userId]);
                res.json(rows);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        // GET course with user info
        app.get('/courses/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const [rows] = await db.query(`
          SELECT courses.*, users.name AS user_name, users.email AS user_email
          FROM courses
          Left JOIN users ON users.id = courses.user_id
          WHERE courses.id = ?`, [id]);
                if (rows.length === 0) return res.status(404).json({ error: 'Course not found' });
                res.json(rows[0]);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        // POST new course
        app.post('/courses', async (req, res) => {
            try {
                const { user_id, provider_id, title, description, image_url } = req.body;
                const [result] = await db.query(
                    'INSERT INTO courses (user_id, provider_id, title, description, image_url) VALUES (?, ?, ?, ?, ?)',
                    [user_id, provider_id, title, description, image_url]
                );
                res.status(201).json({ id: result.insertId, user_id, title, description, image_url });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        // ======================= CHAPTERS =======================

        app.get('/courses/:courseId/chapters', async (req, res) => {
            try {
                const { courseId } = req.params;
                const [rows] = await db.query(
                    'SELECT * FROM chapters WHERE course_id = ? ORDER BY position ASC', 
                    [courseId]);
                res.json(rows);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        app.post('/chapters', async (req, res) => {
            try {
                const { course_id, title, position } = req.body;
                const [result] = await db.query(
                    'INSERT INTO chapters (course_id, title, position) VALUES (?, ?, ?)', 
                    [course_id, title, position]);
                res.status(201).json({ id: result.insertId, course_id, title, position });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        // ======================= LESSONS =======================

        app.get('/chapters/:chapterId/lessons', async (req, res) => {
            try {
                const { chapterId } = req.params;
                const [rows] = await db.query(
                    'SELECT * FROM lessons WHERE chapter_id = ? ORDER BY position ASC', 
                    [chapterId]);
                res.json(rows);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        app.post('/lessons', async (req, res) => {
            try {
                const { chapter_id, title, content, position } = req.body;
                const [result] = await db.query(
                    'INSERT INTO lessons (chapter_id, title, content, position) VALUES (?, ?, ?, ?)', 
                    [chapter_id, title, content, position]);
                res.status(201).json({ id: result.insertId, chapter_id, title, content, position });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        // ======================= USER PROGRESS =======================

        app.get('/users/:userId/courses/:courseId/progress', async (req, res) => {
            const { userId, courseId } = req.params;
            try {
                const [chapters] = await db.query('SELECT * FROM chapters WHERE course_id = ?', [courseId]);
                if (chapters.length === 0)
                    return res.json({ course_id: courseId, course_progress: 0, chapters: [] });

                const progressPerChapter = [];
                for (const chapter of chapters) {
                    const [rows] = await db.query(`
            SELECT COUNT(*) AS total,
                   SUM(CASE WHEN completed=1 THEN 1 ELSE 0 END) AS completed
            FROM user_progress
            WHERE user_id = ? AND chapter_id = ?`,
                    [userId, chapter.id]);
                    const total = rows[0].total || 0;
                    const completed = rows[0].completed || 0;
                    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
                    progressPerChapter.push({
                        chapter_id: chapter.id,
                        chapter_title: chapter.title,
                        total_lessons: total,
                        completed_lessons: completed,
                        progress: percentage,
                    });
                }

                const courseProgress =
          progressPerChapter.reduce((acc, ch) => acc + ch.progress, 0) / progressPerChapter.length;

                res.json({
                    course_id: parseInt(courseId),
                    course_progress: Math.round(courseProgress),
                    chapters: progressPerChapter,
                });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        // ======================= LOGIN =======================
        app.post('/login', async (req, res) => {
            try {
                const { email } = req.body;
                if (!email) return res.status(400).json({ error: 'Email is verplicht' });

                const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
                if (rows.length === 0) return res.status(404).json({ error: 'Gebruiker niet gevonden' });

                res.json(rows[0]);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });

        // ======================= COURSE + (OPT.) NEW PROVIDER + CHAPTERS + LESSONS =======================
        app.post('/courses/full', async (req, res) => {
            const { title, description, image_url, user_id, chapters, provider_id, provider } = req.body;

            if (!title) {
                return res.status(400).json({ error: "Titel is verplicht" });
            }

            try {
                const setupDatabase = require('./database');
                const db = await setupDatabase();
                await db.beginTransaction();

                let finalProviderId = null;

                if (provider_id) {
                    finalProviderId = provider_id;
                } else if (provider && provider.name) {
                    const [provResult] = await db.query(
                        `INSERT INTO providers (name, website) VALUES (?, ?)`,
                        [provider.name, provider.website || null]
                    );
                    finalProviderId = provResult.insertId;
                }

                const [courseResult] = await db.query(
                    `
      INSERT INTO courses (user_id, provider_id, title, description, image_url)
      VALUES (?, ?, ?, ?, ?)
      `,
                    [user_id || null, finalProviderId, title, description || '', image_url || null]
                );

                const courseId = courseResult.insertId;

                if (Array.isArray(chapters)) {
                    for (let chIndex = 0; chIndex < chapters.length; chIndex++) {
                        const ch = chapters[chIndex];
                        const [chapterResult] = await db.query(
                            `
          INSERT INTO chapters (course_id, title, description, position)
          VALUES (?, ?, ?, ?)
          `,
                            [courseId, ch.title || `Hoofdstuk ${chIndex + 1}`, ch.description || '', chIndex + 1]
                        );

                        const chapterId = chapterResult.insertId;

                        if (Array.isArray(ch.lessons)) {
                            for (let lsIndex = 0; lsIndex < ch.lessons.length; lsIndex++) {
                                const ls = ch.lessons[lsIndex];
                                await db.query(
                                    `
              INSERT INTO lessons (chapter_id, title, content, position)
              VALUES (?, ?, ?, ?)
              `,
                                    [chapterId, ls.title || `Les ${lsIndex + 1}`, ls.content || '', lsIndex + 1]
                                );
                            }
                        }
                    }
                }

                await db.commit();
                res.status(201).json({
                    success: true,
                    message: "Cursus succesvol aangemaakt",
                    course_id: courseId,
                    provider_id: finalProviderId || null,
                });
            } catch (err) {
                console.error("❌ Fout bij aanmaken volledige cursus:", err);
                try {
                    const setupDatabase = require('./database');
                    const db = await setupDatabase();
                    await db.rollback();
                } catch (rollbackErr) { 
                    console.error("Warning: Rollback Failed", rollbackErr);
                }
                res.status(500).json({ error: "Internal servererror" });
            }
        });

        app.post("/providers", async (req, res) => {
            const { name, website } = req.body;

            if (!name) {
                return res.status(400).json({ error: "Naam van provider is verplicht" });
            }

            try {
                const setupDatabase = require('./database');
                const db = await setupDatabase();

                const [result] = await db.query(
                    `INSERT INTO providers (name, website) VALUES (?, ?)`,
                    [name, website || null]
                );

                res.status(201).json({
                    id: result.insertId,
                    name,
                    website,
                    message: "Provider succesvol toegevoegd"
                });
            } catch (err) {
                console.error("❌ Fout bij toevoegen provider:", err);
                res.status(500).json({ error: "Interne serverfout" });
            }
        });


        // ======================= SERVER STARTED =======================
        app.listen(PORT, () => console.log(`📚 StudieTracker API Running on http://localhost:${PORT}`));
    } catch (err) {
        console.error('❌ Error with starting the server:', err);
    }
})();
