const express = require('express');
const supabase = require('../lib/supabase');
const { hashPassword, comparePassword } = require('../lib/hash');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, phone, password, role = 'customer' } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  try {
    const { data: existing, error: existingError } = await supabase
      .from('User')
      .select('id')
      .eq('email', email)
      .limit(1);

    if (existingError) {
      return res.status(500).json({ error: existingError.message || 'Registration failed.' });
    }

    if (existing && existing.length > 0) {
      return res.status(409).json({ error: 'Email already in use.' });
    }

    const hashedPassword = await hashPassword(password);
    const { data, error } = await supabase
      .from('User')
      .insert([{ name, email, phone, password: hashedPassword, role }])
      .select('id, name, email, phone, role')
      .single();

    if (error) {
      return res.status(500).json({ error: error.message || 'Registration failed.' });
    }

    return res.status(201).json({ success: true, user: data });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Registration failed.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('User')
      .select('id, name, email, password, role')
      .eq('email', email)
      .limit(1);

    if (error) {
      return res.status(500).json({ error: error.message || 'Database query failed.' });
    }

    if (!data || data.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = data[0];
    const passwordMatches = await comparePassword(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const responseUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return res.json({ success: true, user: responseUser });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Login failed.' });
  }
});

module.exports = router;
