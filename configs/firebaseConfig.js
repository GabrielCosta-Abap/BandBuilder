var admin = require("firebase-admin");

var serviceAccount = require("./firebaseKey.json");

const urlBucket = "gs://bandbuilder-6c8b4.appspot.com"

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
	storageBucket: urlBucket
});

const uploadImage = (req, res, next) => {
	if(!req.file) return next();

	const imagem = req.file;

	const time = new Date().getTime();

	const filename = `${time}_${file.originalname}`

	const file = bucket.file(filename);

	const stream = file.createWriteStream({
		metadata: {
			contentType: imagem.mimetype,
		}
	})
}


const bucket = admin.storage().bucket();