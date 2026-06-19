import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: 'tv.danmaku.bili',
  name: '哔哩哔哩',
  groups: [
    {
      key: 0,
      name: '自动点击-立即购票',
      desc: '自动点击"立即购票"',
      resetMatch: 'app',
      actionCd: 200,
      rules: [
        {
          key: 0,
          matches:
            'TextView[text*="合计 ¥"] +(n) Button[text="立即购票" || text="立即预定"]',
        },
        // rules: [
        //   {
        //     key: 0,
        //     matches: '[text="即将开售" || text="立即预定"]',
        //   },
        // {
        //   key: 1,
        //   matches: 'Button[text="立即购票"]',
        //   excludeMatches: '[text="倒计时"]',
        // },
      ],
    },
    {
      key: 1,
      name: '自动点击-提交订单',
      desc: '"再试一次"出现时等待，消失后立即点击"提交订单"锁票',
      resetMatch: 'app',
      actionCd: 100,
      fastQuery: true,
      rules: [
        {
          key: 0,
          matches: '[text="提交订单"]',
          excludeMatches: '[text="再试一次"]',
        },
      ],
    },
    {
      key: 2,
      name: '自动点击-再试一次',
      desc: '极速循环点击"再试一次"直到不再出现，为提交订单扫清障碍',
      resetMatch: 'app',
      actionCd: 50,
      fastQuery: true,
      rules: [
        {
          key: 0,
          matches: '[text="再试一次"]',
        },
      ],
    },
  ],
});
