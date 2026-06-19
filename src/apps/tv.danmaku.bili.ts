import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: 'tv.danmaku.bili',
  name: '哔哩哔哩',
  groups: [
    {
      key: 1,
      name: '自动点击-演出票-进入抢票页面',
      desc: '开票前点击"即将开售"进入半屏页面，每次进入该页面只触发一次',
      fastQuery: true,
      rules: [
        {
          key: 1,
          name: '点击即将开售',
          matches: 'Button[text="即将开售"]',
          action: 'clickCenter',
          actionMaximum: 1,
          actionCd: 2000,
        },
      ],
    },
    {
      key: 2,
      name: '自动点击-演出票-购票/预定按钮',
      desc: '倒计时结束后自动点击变为可点击状态的"立即购票"或"立即预定"按钮',
      fastQuery: true,
      actionCd: 50,
      rules: [
        {
          key: 1,
          name: '点击立即购票',
          matches: 'Button[text="立即购票"]',
          excludeMatches: '[text^="请选择"]',
          action: 'clickCenter',
        },
        {
          key: 2,
          name: '点击立即预定',
          matches: 'Button[text="立即预定"]',
          excludeMatches: '[text^="请选择"]',
          action: 'clickCenter',
        },
      ],
    },
    {
      key: 3,
      name: '自动点击-演出票-提交订单循环',
      desc: '自动循环点击"再试一次"；"再试一次"消失后立即点击"提交订单"',
      fastQuery: true,
      actionCd: 50,
      rules: [
        {
          key: 1,
          name: '点击再试一次',
          matches: 'Button[text="再试一次"]',
          action: 'clickCenter',
        },
        {
          key: 2,
          name: '点击提交订单',
          matches: 'Button[text="提交订单"]',
          excludeMatches: '[text="再试一次"]',
          action: 'clickCenter',
        },
      ],
    },
  ],
});
