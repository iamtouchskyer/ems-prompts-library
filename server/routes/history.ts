
import express from 'express';
import db from '../db';

const router = express.Router();

router.get('/', (req, res) => {
  const history = db.prepare(`
    SELECT 
      h.*,
      u.username as user_name,
      p.title as prompt_title
    FROM change_history h
    LEFT JOIN users u ON h.user_id = u.id
    LEFT JOIN prompts p ON h.prompt_id = p.id
    ORDER BY h.created_at DESC
  `).all();
  
  res.json(history);
});

export default router;
