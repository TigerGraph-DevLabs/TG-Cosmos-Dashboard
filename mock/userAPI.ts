const users = [
  { nickname: 'Movie', host: 'https://d3b2e31968b941df9e6b6608cc43341e.i.tgcloud.io', graphname:'RatingMethod', username:'tiger', password:'123456' },
  { nickname: 'Airbnb', host: 'https://airbnb.i.tgcloud.io/', graphname:'Test', username:'tiger', password:'123456' },
];

export default {
  'GET /api/v1/queryUserList': (req: any, res: any) => {
    res.json({
      success: true,
      data: { list: users },
      errorCode: 0,
    });
  },
  'PUT /api/v1/user/': (req: any, res: any) => {
    res.json({
      success: true,
      errorCode: 0,
    });
  },
};
