const express = require('express');
const supabase = require('../lib/supabase');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('Services').select('*');
    if (error) return res.status(500).json({ error: error.message || 'Failed to load services.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to load services.' });
  }
});

router.post('/', async (req, res) => {
  const { name, description, image_url, base_price } = req.body;
  if (!name || !description || base_price == null) {
    return res.status(400).json({ error: 'name, description and base_price are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('Services')
      .insert([{ name, description, image_url, base_price }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message || 'Failed to create service.' });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create service.' });
  }
});

module.exports = router;
