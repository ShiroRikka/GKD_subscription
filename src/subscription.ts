import { defineGkdSubscription } from '@gkd-kit/define';
import { batchImportApps } from '@gkd-kit/tools';
import categories from './categories';
import globalGroups from './globalGroups';

export default defineGkdSubscription({
  id: 612,
  name: 'ShiroRikka的GKD订阅',
  version: 5,
  author: 'ShiroRikka',
  updateUrl:
    'https://gh-proxy.org/https://raw.githubusercontent.com/shirorikka/GKD_subscription/main/dist/gkd.json5',
  supportUri: 'https://github.com/ShiroRikka/GKD_subscription',
  checkUpdateUrl: './gkd.version.json5',
  apps: await batchImportApps(`${import.meta.dirname}/apps`),
  globalGroups,
  categories,
});
