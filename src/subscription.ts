import { defineGkdSubscription } from '@gkd-kit/define';
import { batchImportApps } from '@gkd-kit/tools';
import categories from './categories';
import globalGroups from './globalGroups';

export default defineGkdSubscription({
  id: 5119,
  name: 'ShiroRikka的GKD订阅',
  version: 5,
  author: 'ShiroRikka',
  checkUpdateUrl: './gkd.version.json5',
  supportUri: 'https://github.com/ShiroRikka/GKD_subscription',
  categories,
  globalGroups,
  apps: await batchImportApps(`${import.meta.dirname}/apps`),
});
