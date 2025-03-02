/**
 * Are we in development mode?
 */
function inDev() {
  return process.env.NODE_ENV == "development";
}

// Export helpers
module.exports = {
  inDev,
};
