const { omdbiapikey } = require('../config'),
      axios = require('axios'),
      isLoggedIn = require('../middlewares/isLoggedIn'),
      User = require('../models/user'),
      Pocket = require('../models/pocket');

module.exports = app => {
  app.get('/:type/:imdbID', async(req, res) => {
    const { imdbID } = req.params;
    const query = `http://www.omdbapi.com/?apikey=${omdbiapikey}&i=${imdbID}&plot=full`;
    const { data } = await axios(query);
    let alreadyInPocket = false;
    if(req.user) {
      const theUser = await User.findById(req.user._id).populate('pocket');
      alreadyInPocket = theUser.pocket.some(one => one.imdbID === imdbID);
    }
    res.locals.mainTitle = `${data.Title} - Movie Pocket`;
    res.render('single', { data, alreadyInPocket });
  });
}
