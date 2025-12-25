module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'replace_this_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  activationExpiresIn: process.env.ACTIVATION_TOKEN_EXPIRES || '24h',
  resetExpiresInMinutes: Number(process.env.RESET_EXPIRES_MINUTES || 60)
};
