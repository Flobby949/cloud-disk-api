'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  // 注册
  async reg() {
    const { ctx, app } = this;
    // 请求体
    const { username, password } = ctx.request.body;

    // 用户名是否存在
    if (
      await app.model.User.findOne({
        where: {
          username,
        },
      })
    ) {
      ctx.throw(400, '用户名已存在');
    }

    // 创建用户
    let user = await app.model.User.create({
      username,
      password,
    });

    if (!user) {
      ctx.throw(400, '注册失败');
    }

    // 返回结果隐藏密码
    user = JSON.parse(JSON.stringify(user));
    delete user.password;

    ctx.apiSuccess(user);
  }
}

module.exports = UserController;
