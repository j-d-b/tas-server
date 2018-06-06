// given user database object, and requiredRole string
// returns true if user role matches or is above requiredRole
function checkPermission(user, requiredRole) {
  if (requiredRole === 'customer') return true; // base role; all registered users have access

  const userRole = user.role;

  if (requiredRole === 'operator') {
    const isOperator = userRole === 'operator';
    return isOperator || userRole === 'admin'; // true if admin or operator
  }

  return userRole === requiredRole; // if admin, must match exactly
}


// checks if the user object (from HTTP header) exists
// throws error if not
module.exports.isAuthenticated = (user) => {
  if (!user) throw new Error('You are not authenticated');
  return true;
}


// checks if user is in database
// checks if user role matches/is above the requiredRole
// throws semantic error if does not pass any check
module.exports.isAuthorized = (users, user, requiredRole) => {
  const userInDb = users.by('email', user.email);
  if (!userInDb) throw new Error('You are not a registered user');

  if (!checkPermission(userInDb, requiredRole)) throw new Error('You do not have access to this resource');

  return true;
};


// checks to see if password meets the criteria, throws errors otherwise
// at least 6 char
module.exports.checkPass = (password) => {
  if (password.length < 6) throw new Error('Password must be at least 6 characters');
};
