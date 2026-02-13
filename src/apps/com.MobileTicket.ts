import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: 'com.MobileTicket',
  name: '铁路12306',
  groups: [
    {
      key: 0,
      name: '自动点击-预填信息购票-确定',
      desc: '自动点击点击灰色的“预填信息购票”后显示的“确定”',
      resetMatch: 'app',
      actionCd: 50,
      fastQuery: true,
      rules: [
        {
          matches: 'Button[text="确定"]',
        },
      ],
    },
    {
      key: 1,
      name: '自动点击-预填信息购票-自动购票',
      desc: '测试中的功能',
      resetMatch: 'app',
      actionCd: 50,
      fastQuery: true,
      rules: [
        {
          key: 0,
          matches: 'Button[text="按预填信息购票"]',
          excludeMatches:
            'TextView[text="未起售"] + Button[text="按预填信息购票"]',
        },
      ],
    },
  ],
});
