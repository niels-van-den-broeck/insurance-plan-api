import passport from 'passport';
import Boom from '@hapi/boom';

import { RouteRegistration } from '../../../../@types/RouteRegistrationHandler';
import { UserDocument } from '../../../../domain/models/User';

const registerRoutes: RouteRegistration = (router) => {
  router.post('/login', passport.authenticate('local'), async (req, res, next) => {
    if (!req.user) return next(Boom.unauthorized('Unable to login'));

    const user = req.user as UserDocument;
    return res.json({ userName: user.userName });
  });
};

export default registerRoutes;
