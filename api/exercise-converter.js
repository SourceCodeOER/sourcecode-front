import express from 'express'
// In ES-6 (ES-2015)
import nodePandoc from 'node-pandoc'

const app = express();

app.use(express.json());

app.post('/', async (req, res) => {

  let src = req.body['raw'];

  let args = '-f rst -t html';

  const callback = (err, result) => {

    if (err) {
      return res.status(422).json({
        errors: {
          message: 'Une erreur est survenue lors de la conversion du fichier'
        }
      })
    } else {
      return res.status(200).json({
        data: result
      })
    }
  };

  nodePandoc(src, args, callback);

});

export default {
  path: '/intern-api/exercise-converter',
  handler: app
}
