const express = require('express');
const supabase = require('../lib/supabase');

const router = express.Router();

router.post('/', async (req, res) => {
  const {
    customer_id,
    provider_id,
    service_id,
    booking_date,
    duration,
    address,
    notes,
    total_price,
  } = req.body;

  if (!customer_id || !service_id || !booking_date || !duration || !address || total_price == null) {
    return res.status(400).json({
      error: 'customer_id, service_id, booking_date, duration, address and total_price are required.',
    });
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          customer_id,
          provider_id,
          service_id,
          booking_date,
          duration,
          address,
          notes,
          total_price,
          status: 'PENDING',
        },
      ])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message || 'Failed to create booking.' });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create booking.' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('bookings').select('*');
    if (error) return res.status(500).json({ error: error.message || 'Failed to load bookings.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to load bookings.' });
  }
});

router.get('/customer/:customerId', async (req, res) => {
  const { customerId } = req.params;

  try {
    const { data, error } = await supabase.from('bookings').select('*').eq('customer_id', customerId);
    if (error) return res.status(500).json({ error: error.message || 'Failed to load customer bookings.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to load customer bookings.' });
  }
});

router.get('/provider/:providerId', async (req, res) => {
  const { providerId } = req.params;

  try {
    const { data, error } = await supabase.from('bookings').select('*').eq('provider_id', providerId);
    if (error) return res.status(500).json({ error: error.message || 'Failed to load provider bookings.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to load provider bookings.' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();
    if (error) return res.status(404).json({ error: error.message || 'Booking not found.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch booking.' });
  }
});

router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message || 'Failed to update booking status.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update booking status.' });
  }
});

module.exports = router;
