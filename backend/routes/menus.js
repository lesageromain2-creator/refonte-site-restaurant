// backend/routes/menus.js
const express = require('express');
const { query, queryOne } = require('../../database/db');

const router = express.Router();

// Récupérer tous les menus
router.get('/', async (req, res) => {
  try {
    const { limit = 20, available = true } = req.query;

    let sql = 'SELECT * FROM menus WHERE 1=1';
    const params = [];

    if (available === 'true' || available === true) {
      sql += ' AND (available_date IS NULL OR available_date >= CURDATE())';
    }

    sql += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const menus = await query(sql, params);

    // Compter le total
    const [{ total }] = await query(
      'SELECT COUNT(*) as total FROM menus WHERE available_date IS NULL OR available_date >= CURDATE()'
    );

    res.json({
      menus,
      total
    });
  } catch (error) {
    console.error('Erreur get menus:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer un menu par ID
router.get('/:id', async (req, res) => {
  try {
    const menu = await queryOne(
      'SELECT * FROM menus WHERE id_menu = ?',
      [req.params.id]
    );

    if (!menu) {
      return res.status(404).json({ error: 'Menu non trouvé' });
    }

    // Récupérer les plats du menu
    const dishes = await query(
      `SELECT d.*, md.course_order, md.course_type
       FROM menu_dishes md
       JOIN dishes d ON md.id_dish = d.id_dish
       WHERE md.id_menu = ?
       ORDER BY md.course_order ASC`,
      [req.params.id]
    );

    menu.dishes = dishes;

    res.json(menu);
  } catch (error) {
    console.error('Erreur get menu:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer un menu (admin uniquement)
router.post('/', async (req, res) => {
  try {
    if (!req.session.userId || req.session.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const { title, description, price, available_date, image } = req.body;

    if (!title || !price) {
      return res.status(400).json({ error: 'Titre et prix requis' });
    }

    const result = await query(
      `INSERT INTO menus (title, description, price, available_date, image, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [title, description, price, available_date, image]
    );

    res.status(201).json({
      message: 'Menu créé avec succès',
      id_menu: result.insertId
    });
  } catch (error) {
    console.error('Erreur create menu:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Ajouter un plat à un menu (admin uniquement)
router.post('/:id/dishes', async (req, res) => {
  try {
    if (!req.session.userId || req.session.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const { id_dish, course_type, course_order } = req.body;

    await query(
      `INSERT INTO menu_dishes (id_menu, id_dish, course_type, course_order) 
       VALUES (?, ?, ?, ?)`,
      [req.params.id, id_dish, course_type, course_order]
    );

    res.status(201).json({ message: 'Plat ajouté au menu avec succès' });
  } catch (error) {
    console.error('Erreur add dish to menu:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Retirer un plat d'un menu (admin uniquement)
router.delete('/:menuId/dishes/:dishId', async (req, res) => {
  try {
    if (!req.session.userId || req.session.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    await query(
      'DELETE FROM menu_dishes WHERE id_menu = ? AND id_dish = ?',
      [req.params.menuId, req.params.dishId]
    );

    res.json({ message: 'Plat retiré du menu avec succès' });
  } catch (error) {
    console.error('Erreur remove dish from menu:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mettre à jour un menu (admin uniquement)
router.put('/:id', async (req, res) => {
  try {
    if (!req.session.userId || req.session.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const { title, description, price, available_date, image } = req.body;

    await query(
      `UPDATE menus 
       SET title = ?, description = ?, price = ?, available_date = ?, image = ?
       WHERE id_menu = ?`,
      [title, description, price, available_date, image, req.params.id]
    );

    res.json({ message: 'Menu mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur update menu:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer un menu (admin uniquement)
router.delete('/:id', async (req, res) => {
  try {
    if (!req.session.userId || req.session.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    // Supprimer d'abord les associations avec les plats
    await query('DELETE FROM menu_dishes WHERE id_menu = ?', [req.params.id]);

    // Puis supprimer le menu
    await query('DELETE FROM menus WHERE id_menu = ?', [req.params.id]);

    res.json({ message: 'Menu supprimé avec succès' });
  } catch (error) {
    console.error('Erreur delete menu:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;