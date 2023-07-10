'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/list', controller.home.list);
  // 用户注册
  router.post('/reg', controller.user.reg);
  // 用户登录
  router.post('/login', controller.user.login);
  // 登出
  router.post('/logout', controller.user.logout);
  // 文件上传
  router.post('/upload', controller.file.upload);
  // 剩余容量
  router.get('/getSize', controller.user.getSize);
  // 文件列表
  router.get('/file', controller.file.list);
};
