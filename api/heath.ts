import type { Request, Response } from 'express';
import healthHandler from './health.ts';

/**
 * Endpoint alias for /api/heath requested specifically in prompt
 */
export default function handler(req: Request, res: Response): void {
  return healthHandler(req, res);
}
