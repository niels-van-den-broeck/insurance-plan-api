import passport from 'passport';

import { RouteRegistration } from '../../../../@types/RouteRegistrationHandler';
import { UserDocument } from '../../../../domain/models/User';

const registerRoutes: RouteRegistration = (router) => {
  router.post('/login', passport.authenticate('local'), async (req, res) => {
    const user = req.user as UserDocument;

    res.json({ userName: user.userName });
  });
};

export default registerRoutes;
