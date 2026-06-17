const express = require('express');
const supabase = require('../lib/supabase');

const router = express.Router();

router.post('/rooms', async (req, res) => {
  const { booking_id } = req.body;
  if (!booking_id) {
    return res.status(400).json({ error: 'booking_id is required.' });
  }

  try {
    const { data, error } = await supabase
      .from('chat_rooms')
      .upsert({ booking_id }, { onConflict: ['booking_id'] })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message || 'Failed to create or retrieve chat room.' });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create or retrieve chat room.' });
  }
});

router.get('/rooms/:bookingId', async (req, res) => {
  const { bookingId } = req.params;

  try {
    const { data, error } = await supabase.from('chat_rooms').select('*').eq('booking_id', bookingId).single();
    if (error) return res.status(404).json({ error: error.message || 'Chat room not found.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch chat room.' });
  }
});

router.post('/messages', async (req, res) => {
  const { room_id, sender_id, message } = req.body;
  if (!room_id || !sender_id || !message) {
    return res.status(400).json({ error: 'room_id, sender_id, and message are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ room_id, sender_id, message }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message || 'Failed to send message.' });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to send message.' });
  }
});

router.get('/messages/:roomId', async (req, res) => {
  const { roomId } = req.params;

  try {
    const { data, error } = await supabase.from('messages').select('*').eq('room_id', roomId).order('created_at', { ascending: true });
    if (error) return res.status(500).json({ error: error.message || 'Failed to load messages.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to load messages.' });
  }
});

module.exports = router;
