declare global {
  namespace Express {
    interface Request {
      userId?: import('mongodb').ObjectId; //  req.userId is allowed
    }
  }
}

export {}; // This makes it a module