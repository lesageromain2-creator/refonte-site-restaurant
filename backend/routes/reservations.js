// backend/routes/reservations.js
const express = require('express');
const { query, queryOne } = require('../../database/db');

const router = express.Router();

// Middleware pour vérifier l'authentification
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  next();
};

// Créer une réservation
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      reservation_date,
      reservation_time,
      number_of_people,
      special_requests
    } = req.body;

    // Validation
    if (!reservation_date || !reservation_time || !number_of_people) {
      return res.status(400).json({ 
        error: 'Date, heure et nombre de personnes requis' 
      });
    }

    if (number_of_people < 1 || number_of_people > 20) {
      return res.status(400).json({ 
        error: 'Le nombre de personnes doit être entre 1 et 20' 
      });
    }

    // Vérifier que la date est future
    const reservationDateTime = new Date(`${reservation_date} ${reservation_time}`);
    if (reservationDateTime < new Date()) {
      return res.status(400).json({ 
        error: 'La date de réservation doit être future' 
      });
    }

    // Vérifier les horaires d'ouverture (12h-14h30, 19h-22h30)
    const hour = parseInt(reservation_time.split(':')[0]);
    const minute = parseInt(reservation_time.split(':')[1]);
    const timeInMinutes = hour * 60 + minute;

    const lunchStart = 12 * 60; // 12h00
    const lunchEnd = 14 * 60 + 30; // 14h30
    const dinnerStart = 19 * 60; // 19h00
    const dinnerEnd = 22 * 60 + 30; // 22h30

    const isLunchTime = timeInMinutes >= lunchStart && timeInMinutes <= lunchEnd;
    const isDinnerTime = timeInMinutes >= dinnerStart && timeInMinutes <= dinnerEnd;

    if (!isLunchTime && !isDinnerTime) {
      return res.status(400).json({ 
        error: 'Horaires de réservation : 12h-14h30 et 19h-22h30' 
      });
    }

    // Vérifier la disponibilité (max 50 personnes par service)
    const [{ total_people }] = await query(
      `SELECT COALESCE(SUM(number_of_people), 0) as total_people
       FROM reservations 
       WHERE reservation_date = ? 
       AND reservation_time BETWEEN ? AND ?
       AND status = 'confirmed'`,
      [
        reservation_date,
        isLunchTime ? '12:00:00' : '19:00:00',
        isLunchTime ? '14:30:00' : '22:30:00'
      ]
    );

    if (parseInt(total_people) + parseInt(number_of_people) > 50) {
      return res.status(400).json({ 
        error: 'Plus de disponibilité pour ce créneau' 
      });
    }

    // Créer la réservation
    const result = await query(
      `INSERT INTO reservations 
       (id_user, reservation_date, reservation_time, number_of_people, special_requests, status, created_at) 
       VALUES (?, ?, ?, ?, ?, 'pending', NOW())`,
      [req.session.userId, reservation_date, reservation_time, number_of_people, special_requests]
    );

    res.status(201).json({
      message: 'Réservation créée avec succès',
      id_reservation: result.insertId,
      status: 'pending'
    });
  } catch (error) {
    console.error('Erreur create reservation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer les réservations de l'utilisateur connecté
router.get('/my', requireAuth, async (req, res) => {
  try {
    const reservations = await query(
      `SELECT * FROM reservations 
       WHERE id_user = ? 
       ORDER BY reservation_date DESC, reservation_time DESC`,
      [req.session.userId]
    );

    res.json({ reservations });
  } catch (error) {
    console.error('Erreur get my reservations:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer une réservation par ID
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const reservation = await queryOne(
      `SELECT r.*, u.firstname, u.lastname, u.email
       FROM reservations r
       JOIN users u ON r.id_user = u.id_user
       WHERE r.id_reservation = ?`,
      [req.params.id]
    );

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    // Vérifier que l'utilisateur est le propriétaire ou admin
    if (reservation.id_user !== req.session.userId && req.session.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    res.json(reservation);
  } catch (error) {
    console.error('Erreur get reservation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Annuler une réservation
router.put('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const reservation = await queryOne(
      'SELECT * FROM reservations WHERE id_reservation = ?',
      [req.params.id]
    );

    if (!reservation) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (reservation.id_user !== req.session.userId && req.session.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    // Vérifier que la réservation n'est pas déjà annulée
    if (reservation.status === 'cancelled') {
      return res.status(400).json({ error: 'Réservation déjà annulée' });
    }

    // Vérifier que la réservation est au moins 2h dans le futur
    const reservationDateTime = new Date(`${reservation.reservation_date} ${reservation.reservation_time}`);
    const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);

    if (reservationDateTime < twoHoursFromNow) {
      return res.status(400).json({ 
        error: 'Impossible d\'annuler moins de 2h avant la réservation' 
      });
    }

    await query(
      'UPDATE reservations SET status = ?, cancelled_at = NOW() WHERE id_reservation = ?',
      ['cancelled', req.params.id]
    );

    res.json({ message: 'Réservation annulée avec succès' });
  } catch (error) {
    console.error('Erreur cancel reservation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer toutes les réservations (admin uniquement)
router.get('/admin/all', requireAuth, async (req, res) => {
  try {
    if (req.session.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const { date, status } = req.query;
    let sql = `
      SELECT r.*, u.firstname, u.lastname, u.email
      FROM reservations r
      JOIN users u ON r.id_user = u.id_user
      WHERE 1=1
    `;
    const params = [];

    if (date) {
      sql += ' AND r.reservation_date = ?';
      params.push(date);
    }

    if (status) {
      sql += ' AND r.status = ?';
      params.push(status);
    }

    sql += ' ORDER BY r.reservation_date DESC, r.reservation_time DESC';

    const reservations = await query(sql, params);

    res.json({ reservations });
  } catch (error) {
    console.error('Erreur get all reservations:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Confirmer une réservation (admin uniquement)
router.put('/:id/confirm', requireAuth, async (req, res) => {
  try {
    if (req.session.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    await query(
      'UPDATE reservations SET status = ? WHERE id_reservation = ?',
      ['confirmed', req.params.id]
    );

    res.json({ message: 'Réservation confirmée avec succès' });
  } catch (error) {
    console.error('Erreur confirm reservation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Vérifier les disponibilités pour une date/heure
router.post('/check-availability', async (req, res) => {
  try {
    const { reservation_date, reservation_time, number_of_people } = req.body;

    if (!reservation_date || !reservation_time || !number_of_people) {
      return res.status(400).json({ error: 'Paramètres manquants' });
    }

    // Déterminer le service (déjeuner ou dîner)
    const hour = parseInt(reservation_time.split(':')[0]);
    const isLunchTime = hour >= 12 && hour < 15;

    const [{ total_people }] = await query(
      `SELECT COALESCE(SUM(number_of_people), 0) as total_people
       FROM reservations 
       WHERE reservation_date = ? 
       AND reservation_time BETWEEN ? AND ?
       AND status = 'confirmed'`,
      [
        reservation_date,
        isLunchTime ? '12:00:00' : '19:00:00',
        isLunchTime ? '14:30:00' : '22:30:00'
      ]
    );

    const available_seats = 50 - parseInt(total_people);
    const is_available = available_seats >= parseInt(number_of_people);

    res.json({
      available: is_available,
      available_seats,
      requested_seats: parseInt(number_of_people)
    });
  } catch (error) {
    console.error('Erreur check availability:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;