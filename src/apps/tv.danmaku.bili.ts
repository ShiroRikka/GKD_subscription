import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: 'tv.danmaku.bili',
  name: '哔哩哔哩',
  groups: [
    {
      key: 0,
      name: '自动点击-演唱会购票-立即预定',
      desc: '自动点击"立即预定"按钮，连点直到按钮状态变化',
      resetMatch: 'app',
      actionCd: 150,
      fastQuery: true,
      rules: [
        {
          key: 0,
          matches: '[text="立即预定"]',
        },
      ],
    },
    {
      key: 1,
      name: '自动点击-演唱会购票-提交订单',
      desc: '遇到"再试一次"时自动放弃点击，等再试一次消失后立即点击提交订单',
      resetMatch: 'app',
      actionCd: 50,
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
      name: '自动点击-演唱会购票-再试一次',
      desc: '极速循环点击"再试一次"直到不再出现',
      resetMatch: 'app',
      actionCd: 30,
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
