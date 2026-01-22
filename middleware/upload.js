const multer = require('multer');
const path = require('path');

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

// The 'upload' object is the configured multer middleware
const upload = multer({ storage: storage });

module.exports = upload;