import express from 'express';
import { getAboutPageData, getPrivacyPolicy, getTermsCondition } from '../controllers/siteController.js';

const router = express.Router();

router.get('/about', getAboutPageData);
router.get('/privacy', getPrivacyPolicy);
router.get('/terms', getTermsCondition);

export default router;
