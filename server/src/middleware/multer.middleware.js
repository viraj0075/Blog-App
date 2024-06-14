import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./uploads");
    console.log(req.file)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
export const upload = multer({storage,})