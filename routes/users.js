const express = require('express');
const supabase = require('../lib/supabase');

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase.from('User').select('*').eq('id', id).single();
    if (error) return res.status(404).json({ error: error.message || 'User not found.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch user.' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const { data, error } = await supabase.from('User').update(updates).eq('id', id).select().single();
    if (error) return res.status(400).json({ error: error.message || 'Failed to update user.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update user.' });
  }
});

module.exports = router;
