/**
 * Generate a random password
 * @param {number} length - Password length (default: 12)
 * @returns {string} - Generated password
 */
const generateRandomPassword = (length = 12) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one character from each category
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  
  // Add one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest with random characters
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Generate a registration number
 * @param {string} batchNo - Batch number
 * @param {number} userId - User ID
 * @returns {string} - Generated registration number
 */
const generateRegistrationNumber = (batchNo, userId) => {
  const year = new Date().getFullYear();
  const paddedUserId = userId.toString().padStart(4, '0');
  return `REG${year}${batchNo}${paddedUserId}`;
};

module.exports = {
  generateRandomPassword,
  generateRegistrationNumber
};
