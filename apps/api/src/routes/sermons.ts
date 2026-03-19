import { Router } from 'express';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.use(authenticate);

// List sermons
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.json({
      success: true,
      data: [],
      message: 'Sermons endpoint - implementation pending',
    });
  })
);

// Get sermon by ID
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      data: null,
      message: `Sermon ${req.params.id} - implementation pending`,
    });
  })
);

// Create sermon
router.post(
  '/',
  requireRole(['ADMIN', 'PASTOR', 'MEDIA_TEAM', 'SUPER_ADMIN']),
  asyncHandler(async (_req, res) => {
    res.status(201).json({
      success: true,
      data: null,
      message: 'Create sermon - implementation pending',
    });
  })
);

// Update sermon
router.patch(
  '/:id',
  requireRole(['ADMIN', 'PASTOR', 'MEDIA_TEAM', 'SUPER_ADMIN']),
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      data: null,
      message: `Update sermon ${req.params.id} - implementation pending`,
    });
  })
);

// Delete sermon
router.delete(
  '/:id',
  requireRole(['ADMIN', 'PASTOR', 'SUPER_ADMIN']),
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      message: `Delete sermon ${req.params.id} - implementation pending`,
    });
  })
);

export { router as sermonsRouter };
