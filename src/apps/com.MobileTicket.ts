import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: 'com.MobileTicket',
  name: '铁路12306',
  groups: [
    {
      key: 0,
      name: '自动点击-预填信息购票-确定',
      resetMatch: 'app',
      priorityTime: 10000,
      actionCd: 100,
      fastQuery: true,
      rules: [
        {
          matches: '[vid="sure"][visibleToUser=true]',
        },
      ],
    },
  ],
});
