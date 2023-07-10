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

  // 我的分享列表
  async list() {
    const { ctx, app } = this;
    const user_id = ctx.authUser.id;
    const list = await app.model.Share.findAndCountAll({ where: { user_id }, include: [{ model: app.model.File }] });
    ctx.apiSuccess(list);
  }

  // 查看分享
  async read() {
    const { ctx, app, service } = this;
    const sharedurl = ctx.params.sharedurl;
    if (!sharedurl) {
      return ctx.apiFail('非法参数');
    }
    const file_id = ctx.query.file_id;
    // 分享是否存在
    const s = await service.share.isExist(sharedurl);
    const where = { user_id: s.user_id };
    if (!file_id) {
      where.id = s.file_id;
    } else {
      where.file_id = file_id;
    }
    const rows = await app.model.File.findAll({ where, order: [['isdir', 'desc']] });
    ctx.apiSuccess(rows);
  }
}

module.exports = ShareController;
