const express = require('express');
const supabase = require('../lib/supabase');

const router = express.Router();

router.get('/', async (req, res) => {
  const { service_type, available } = req.query;
  let query = supabase.from('providers').select('*');

  if (service_type) {
    query = query.eq('service_type', service_type);
  }

  if (available != null) {
    query = query.eq('available', available === 'true');
  }

  try {
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message || 'Failed to load providers.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to load providers.' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase.from('providers').select('*').eq('id', id).single();
    if (error) return res.status(404).json({ error: error.message || 'Provider not found.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch provider.' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const { data, error } = await supabase.from('providers').update(updates).eq('id', id).select().single();
    if (error) return res.status(400).json({ error: error.message || 'Failed to update provider.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update provider.' });
  }
});

module.exports = router;
