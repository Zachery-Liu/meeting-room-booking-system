export default {
  async fetchUserList() {
    // 1. 修正权限校验逻辑（判断"无user_id 或 角色不是admin"）
    if (!appsmith.store || !appsmith.store.user_id || appsmith.store.role !== 'admin') {
      showAlert('无管理员权限，禁止访问！', 'error');
      navigateTo('Login_Page');
      return;
    }

    try {
      // 2. 查询用户列表（修正SQL中的空格/语法问题）
      const userList = await db_auth.query(`
        SELECT u.*, d.dept_name 
        FROM User u 
        LEFT JOIN Department d ON u.dept_id = d.dept_id 
        ORDER BY u.create_time DESC
      `);

      // 3. 渲染表格 + 补充返回值（消除提示）
      table_users.setData(userList || []);
      return userList; // 补充返回值，消除"无返回数据"提示
      
    } catch (error) {
      showAlert(`查询失败：${error.message}`, 'error');
      console.error('查询错误：', error);
      return null;
    }
  }
};