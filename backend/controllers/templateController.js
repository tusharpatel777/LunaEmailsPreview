const EmailTemplate = require('../models/EmailTemplate');

/**
 * Utility: Extract variable names from HTML content.
 * Scans for {{variableName}} placeholders and returns unique names.
 * Example: "Hello {{name}}, your order {{order_id}}" → ["name", "order_id"]
 *
 * @param {string} html - Raw HTML string
 * @returns {string[]} Array of unique variable names
 */
const extractVariables = (html) => {
  const regex = /\{\{(\w+)\}\}/g;
  const found = new Set();
  let match;
  while ((match = regex.exec(html)) !== null) {
    found.add(match[1]);
  }
  return Array.from(found);
};

// ─────────────────────────────────────────────────────────────
// CREATE TEMPLATE
// POST /api/templates
// ─────────────────────────────────────────────────────────────

/**
 * Create a new email template.
 * Auto-extracts variables from htmlContent before saving.
 */
const createTemplate = async (req, res, next) => {
  try {
    const { name, subject, htmlContent } = req.body;

    // Extract dynamic variables from HTML (e.g. {{name}})
    const variables = extractVariables(htmlContent || '');

    const template = await EmailTemplate.create({
      name,
      subject,
      htmlContent,
      variables,
    });

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET ALL TEMPLATES
// GET /api/templates
// ─────────────────────────────────────────────────────────────

/**
 * Retrieve all non-deleted email templates.
 * Sorted by latest first (createdAt descending).
 */
const getAllTemplates = async (req, res, next) => {
  try {
    const templates = await EmailTemplate.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .select('name subject variables createdAt updatedAt'); // Exclude heavy htmlContent from list

    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// GET TEMPLATE BY ID
// GET /api/templates/:id
// ─────────────────────────────────────────────────────────────

/**
 * Fetch a single template by its MongoDB ObjectId.
 * Returns full document including htmlContent for editing/preview.
 */
const getTemplateById = async (req, res, next) => {
  try {
    const template = await EmailTemplate.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!template) {
      const err = new Error('Template not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error) {
    // Handle invalid ObjectId format from Mongoose
    if (error.name === 'CastError') {
      const err = new Error('Invalid template ID format');
      err.statusCode = 400;
      return next(err);
    }
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// UPDATE TEMPLATE
// PUT /api/templates/:id
// ─────────────────────────────────────────────────────────────

/**
 * Update an existing template by ID.
 * Re-extracts variables from updated HTML content automatically.
 */
const updateTemplate = async (req, res, next) => {
  try {
    const { name, subject, htmlContent } = req.body;

    // Re-extract variables whenever HTML is updated
    const variables = extractVariables(htmlContent || '');

    const template = await EmailTemplate.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { name, subject, htmlContent, variables },
      { new: true, runValidators: true } // Return updated doc; run schema validators
    );

    if (!template) {
      const err = new Error('Template not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      success: true,
      message: 'Template updated successfully',
      data: template,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      const err = new Error('Invalid template ID format');
      err.statusCode = 400;
      return next(err);
    }
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE TEMPLATE (soft delete)
// DELETE /api/templates/:id
// ─────────────────────────────────────────────────────────────

/**
 * Soft delete a template by setting isDeleted = true.
 * The record remains in the database for audit/recovery purposes.
 */
const deleteTemplate = async (req, res, next) => {
  try {
    const template = await EmailTemplate.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!template) {
      const err = new Error('Template not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(200).json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (error) {
    if (error.name === 'CastError') {
      const err = new Error('Invalid template ID format');
      err.statusCode = 400;
      return next(err);
    }
    next(error);
  }
};

module.exports = {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
};
