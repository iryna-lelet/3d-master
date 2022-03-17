const { Router } = require('express');
const router = Router();
const Mailer = require('../utils/Mailer');
const { join } = require('path');
const crypto = require('crypto');
const fs = require('fs');

const dirname = 'uploads';

router.post('/', (req, res, next) => {
  try {
    const { email, firstname, lastname, source } = req.body;
    const filename = `${Date.now()}.${crypto.randomBytes(8).toString('hex')}.png`;
    const base64 = source.split(';base64,').pop();
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname);
    }
    fs.writeFileSync(join(dirname, filename), base64, { encoding: 'base64' });
    const url = `${req.protocol}://${req.hostname}/${dirname}/${filename}`;
    Mailer.send({
      to: email,
      template: 'thanks',
      data: {
        firstname,
        lastname,
        src: url
      }
    });
    res.json({ url });
  } catch (err) {
    next(err);
  }
});

module.exports = router;