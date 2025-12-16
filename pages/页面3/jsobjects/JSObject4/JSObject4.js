export default {
  async fetchUserListByPage() {
    try {
      // 1. 权限校验（可选，复用之前的权限逻辑）
      if (!appsmith.store || !appsmith.store.user_id || appsmith.store.role !== 'admin') {
        showAlert('无管理员权限，禁止访问！', 'error');
        navigateTo('登录页'); // 替换为你实际的登录页面名称
        return;
      }

      // 2. 获取分页参数（兼容输入框未定义/空值）
      // 替换 input_page_num 为你实际的页码输入框组件ID
      const pageNum = input_page_num?.value ? Number(input_page_num.value) : 1;
      const pageSize = 10; // 每页条数，可改为变量（如 input_page_size.value）
      const offset = (pageNum - 1) * pageSize;

      // 3. 分页查询（替换 db_auth 为你实际的数据源名称）
      // 若数据库表名是小写，改为 FROM user
      const userList = await db_auth.query(`
        SELECT u.*, d.dept_name 
        FROM User u 
        LEFT JOIN Department d ON u.dept_id = d.dept_id 
        LIMIT ? OFFSET ?
      `, [pageSize, offset]);

      // 4. 渲染到表格（替换 table_users 为你实际的用户表格组件ID）
      table_users.setData(userList || []);

      // 5. 可选：查询总条数，用于分页器显示
      const totalRes = await db_auth.query(`SELECT COUNT(*) AS total FROM User`);
      const total = totalRes[0]?.total || 0;
      // 若有分页器组件，设置总条数（替换 pagination_users 为实际分页器ID）
      if (pagination_users) {
        pagination_users.setTotalItems(total);
      }

      return userList;
    } catch (error) {
      showAlert(`分页查询失败：${error.message}`, 'error');
      console.error('分页查询错误：', error);
      return [];
    }
  }
};