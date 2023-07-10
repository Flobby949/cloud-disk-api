'use strict';
const Controller = require('egg').Controller;
class ShareController extends Controller {
  // 创建分享
  async create() {
    const { ctx, app, service } = this;
    const user_id = ctx.authUser.id;
    ctx.validate({ file_id: { type: 'int', required: true, desc: '文件ID' } });
    const { file_id } = ctx.request.body;
    const f = await app.model.File.findOne({ where: { id: file_id, user_id } });
    if (!f) {
      return ctx.throw(404, '文件不存在');
    }
    const sharedurl = ctx.genID(15);
    const s = await app.model.Share.create({ sharedurl, file_id, iscancel: 0, user_id });
    const url = 'http://127.0.0.1:7001/sharepage/' + sharedurl;
    ctx.apiSuccess('分享链接：' + url);
  }
}

module.exports = ShareController;
