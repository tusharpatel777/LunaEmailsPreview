const mongoose = require('mongoose');

/**
 * EmailTemplate Schema
 *
 * Stores HTML email templates with optional dynamic variable support.
 * Soft delete via isDeleted flag — records are never physically removed.
 *
 * Fields:
 *  - name        : Human-readable template name (e.g. "Welcome Email")
 *  - subject     : Email subject line
 *  - htmlContent : Raw HTML body of the email
 *  - variables   : Array of placeholder names found in template (e.g. ["name", "order_id"])
 *  - isDeleted   : Soft delete flag; true means hidden from normal queries
 *  - timestamps  : createdAt and updatedAt auto-managed by Mongoose
 */
const emailTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Template name is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Email subject is required'],
      trim: true,
    },
    htmlContent: {
      type: String,
      required: [true, 'HTML content is required'],
    },
    variables: {
      // Stores variable names extracted from placeholders like {{name}}
      type: [String],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);
