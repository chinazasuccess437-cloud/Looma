import { generateCustomUiDesign, type CustomDesignRequest } from '../../server/aiDesign.js';

interface VercelReq {
  method?: string;
  body?: unknown;
}

interface VercelRes {
  status: (code: number) => { json: (data: unknown) => void };
}

export default async function handler(req: VercelReq, res: VercelRes) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    let payload: CustomDesignRequest = {};
    if (typeof req.body === 'string') {
      payload = JSON.parse(req.body) as CustomDesignRequest;
    } else if (req.body && typeof req.body === 'object') {
      payload = req.body as CustomDesignRequest;
    }

    const result = await generateCustomUiDesign(payload);
    res.status(200).json(result);
  } catch (error) {
    const err = error as Error & { statusCode?: number; status?: number };
    const status = err.statusCode || err.status || 500;
    res.status(status >= 400 && status < 600 ? status : 500).json({
      error: err.message || 'Failed to generate custom design.',
    });
  }
}
