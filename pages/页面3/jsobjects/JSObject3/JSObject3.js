export default {
  // 定义权限校验函数，可在页面 onLoad 或按钮点击事件中调用
  async checkUserPermission() {
    // 容错：处理 store/permissions 未定义的情况
    const userPerms = appsmith.store?.permissions || [];
    const targetPermission = 'user:manage';

    // 1. 校验权限（兼容权限列表为字符串/数组的情况）
    let hasPermission = false;
    if (Array.isArray(userPerms)) {
      hasPermission = userPerms.includes(targetPermission);
    } else if (typeof userPerms === 'string') {
      // 若 permissions 是逗号分隔的字符串（如 "user:manage,role:manage"）
      hasPermission = userPerms.split(',').includes(targetPermission);
    }

    // 2. 无权限时提示并跳转
    if (!hasPermission) {
      showAlert('无此操作权限！', 'error');
      // 替换为你 Appsmith 中实际的"首页"页面名称（比如"首页"/"HomePage"）
      navigateTo('Home_Page');
      return false; // 返回false标识无权限
    }

    // 有权限时返回true，可继续后续逻辑
    return true;
  }
};