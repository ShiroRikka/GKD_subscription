import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: 'tv.danmaku.bili',
  name: '哔哩哔哩',
  groups: [
    {
      key: 1,
      name: '自动点击-抢票-合计+购票/预定',
      desc: '自动点击合计页面的"立即购票"或"立即预定"按钮',
      forcedTime: 7200000,
      actionCd: 0,
      resetMatch: 'app',
      rules: [
        {
          key: 1,
          name: '点击立即购票',
          matches: 'TextView[text*="合计"] +(n) Button[text="立即购票"]',
          excludeMatches: '[text^="请选择"]',
          action: 'clickCenter',
        },
        {
          key: 2,
          name: '点击立即预定',
          matches: 'TextView[text*="合计"] +(n) Button[text="立即预定"]',
          excludeMatches: '[text^="请选择"]',
          action: 'clickCenter',
        },
      ],
    },
    {
      key: 2,
      name: '自动点击-抢票-再试一次',
      desc: '自动点击"再试一次"',
      forcedTime: 7200000,
      actionCd: 350,
      resetMatch: 'app',
      rules: [
        {
          key: 1,
          name: '点击再试一次',
          matches: 'Button[text="再试一次"]',
          action: 'clickCenter',
        },
      ],
    },
    {
      key: 3,
      name: '自动点击-抢票-提交订单',
      desc: '页面中不存在"再试一次"时点击"提交订单"',
      forcedTime: 7200000,
      actionCd: 350,
      resetMatch: 'app',
      rules: [
        {
          key: 1,
          name: '点击提交订单',
          matches: 'TextView[text*="合计"] +(n) Button[text="提交订单"]',
          excludeMatches: '[text="再试一次"]',
          action: 'clickCenter',
        },
      ],
    },
    {
      key: 4,
      name: '自动点击-蹲回流票-立即购票',
      desc: '[测试功能，谨慎使用]你来刷新，我来点，我们是最棒的！',
      enable: false,
      forcedTime: 7200000,
      actionCd: 0,
      resetMatch: 'app',
      rules: [
        {
          key: 1,
          name: '点击首页的立即购票',
          matches: [
            '[text="活动介绍"]',
            'Button[text="立即购票" || text="立即预定"]',
          ],
          excludeMatches: '[text^="请选择"]',
          action: 'clickCenter',
        },
        {
          key: 2,
          name: '选择日期',
          preKeys: [1],
          matches: '[text="2026-07-11 周六"]',
          action: 'clickCenter',
        },
        {
          key: 3,
          name: '选择票种',
          preKeys: [2],
          matches: '[text="¥128(游园票)"]',
          action: 'clickCenter',
        },
        {
          key: 4,
          name: '点击合计立即购票',
          preKeys: [3],
          matches:
            'TextView[text*="合计"] +(n) Button[text="立即购票" || text="立即预定"]',
          excludeMatches: '[text^="请选择"]',
          action: 'clickCenter',
        },
        {
          key: 5,
          name: '未出现合计则返回',
          preKeys: [3],
          matches: '[text="¥128(游园票)"]',
          excludeMatches: 'TextView[text*="合计"]',
          matchDelay: 500,
          action: 'back',
        },
      ],
    },
  ],
});
