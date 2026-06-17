const express = require('express');
const supabase = require('../lib/supabase');

const router = express.Router();

router.post('/', async (req, res) => {
  const { booking_id, customer_id, provider_id, rating, comment } = req.body;

  if (!booking_id || !customer_id || !provider_id || rating == null) {
    return res.status(400).json({ error: 'booking_id, customer_id, provider_id, and rating are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ booking_id, customer_id, provider_id, rating, comment }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message || 'Failed to create review.' });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create review.' });
  }
});

router.get('/', async (req, res) => {
  const { provider_id, customer_id, booking_id } = req.query;
  let query = supabase.from('reviews').select('*');

  if (provider_id) query = query.eq('provider_id', provider_id);
  if (customer_id) query = query.eq('customer_id', customer_id);
  if (booking_id) query = query.eq('booking_id', booking_id);

  try {
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message || 'Failed to load reviews.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to load reviews.' });
  }
});

module.exports = router;
