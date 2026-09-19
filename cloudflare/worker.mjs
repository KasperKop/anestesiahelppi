// Cloudflare runtime module; validated by Wrangler during bundle checks.
// eslint-disable-next-line import/no-unresolved
import { DurableObject } from 'cloudflare:workers';
import corpus from '../server/data/corpus.json';
import { handleRequest, reserveQuota } from './handler.mjs';

export class DemoQuota extends DurableObject {
  async reserve() {
    return reserveQuota(this.ctx.storage);
  }
}
export default {
  fetch(request, env) {
    return handleRequest(request, env, {
      corpus,
      reserve: () => env.DEMO_QUOTA.getByName('global-demo-v1').reserve(),
    });
  },
};
