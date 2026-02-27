const express = require('express');
const router = express.Router();

const {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} = require('../controllers/templateController');

/**
 * Template REST API Routes
 *
 * Base path: /api/templates (registered in server.js)
 *
 * POST   /           → Create new template
 * GET    /           → Get all templates (soft-deleted excluded)
 * GET    /:id        → Get single template by ID
 * PUT    /:id        → Update template by ID
 * DELETE /:id        → Soft delete template by ID
 */
router.route('/').post(createTemplate).get(getAllTemplates);

router
  .route('/:id')
  .get(getTemplateById)
  .put(updateTemplate)
  .delete(deleteTemplate);

module.exports = router;
