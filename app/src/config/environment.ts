import { invariant } from '../utils/invariant';

const hintApiBase = import.meta.env.VITE_HINT_API_BASE as string | undefined;

invariant(
  Boolean(hintApiBase),
  'Missing VITE_HINT_API_BASE. Deploy the hint Lambda behind API Gateway and expose the invoke URL via this variable.'
);

export const environment = {
  hintApiBase
};
