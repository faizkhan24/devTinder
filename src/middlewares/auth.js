 const adminAuth = (req, res, next) => {
    console.log("Auth Checked!");
    
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if (!isAdminAuthorized) {
      res.send("Unauthorized request");
    } else {
      next();
    }
  }
 const userAuth = (req, res, next) => {
    console.log(" User Auth Checked!");
    
    const token = "xyzabc";
    const isAdminAuthorized = token === "xyz";
    if (!isAdminAuthorized) {
      res.send("Unauthorized request");
    } else {
      next();
    }
  }


  module.exports = {
    adminAuth,
    userAuth,

  };