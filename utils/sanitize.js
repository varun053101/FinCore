/**
 * Strips internal fields from a user record before sending it in a response.
 * Password and any other sensitive fields are always excluded.
 *
 * @param {object} user - Raw user row from the database
 * @returns {object} Public-safe user representation
 */
const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
});

module.exports = { sanitizeUser };
