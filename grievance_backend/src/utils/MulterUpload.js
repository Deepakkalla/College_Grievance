const multer = require("multer")
const path = require("node:path")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Safe absolute path use karna behtar hota hai
        cb(null, path.join(__dirname, "../public/uploads"));
    },
    filename: function (req, file, cb) {
        // Clean template literal
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname); // Spelling fixed: originalname
        
        const filename = `img-${uniqueSuffix}${ext}`;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
