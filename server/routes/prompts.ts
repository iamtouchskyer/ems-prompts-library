
import express from 'express';
import db from '../db';

const router = express.Router();

// Get all prompts
router.get('/', (req, res) => {
  const prompts = db.prepare(`
    SELECT p.*, u.username as author_name, u.avatar_url
    FROM prompts p
    LEFT JOIN users u ON p.author_id = u.id
  `).all();
  res.json(prompts);
});

// Create new prompt
router.post('/', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const { title, description, tags } = req.body;
  const stmt = db.prepare(`
    INSERT INTO prompts (title, description, author_id, tags)
    VALUES (?, ?, ?, ?)
  `);
  
  const result = stmt.run(title, description, req.user.id, JSON.stringify(tags));
  
  // Record change in history
  const historyStmt = db.prepare(`
    INSERT INTO change_history (prompt_id, user_id, change_type, change_description)
    VALUES (?, ?, ?, ?)
  `);
  historyStmt.run(result.lastInsertRowid, req.user.id, 'create', 'Created new prompt');
  
  res.json({ id: result.lastInsertRowid });
});

// Update prompt
router.put('/:id', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  const { title, description, tags } = req.body;
  const stmt = db.prepare(`
    UPDATE prompts 
    SET title = ?, description = ?, tags = ?
    WHERE id = ?
  `);
  
  const result = stmt.run(title, description, JSON.stringify(tags), req.params.id);
  
  // Record change in history
  const historyStmt = db.prepare(`
    INSERT INTO change_history (prompt_id, user_id, change_type, change_description)
    VALUES (?, ?, ?, ?)
  `);
  historyStmt.run(req.params.id, req.user.id, 'update', 'Updated prompt');
  
  res.json({ success: true });
});

export default router;
