// JSObject2 完整代码
export default {
  // 定义函数（比如命名为 addUser）
  async addUser() {
    // 原新增用户的代码（放到这里）
    const formData = form_user.formData;
    if (!formData.user_name || !formData.dept_id || !formData.role_id) {
      showAlert('用户名/部门/角色不能为空！', 'warning');
      return;
    }
    const addRes = await db_auth.query(`
      INSERT INTO User (user_name, dept_id, role_id, password, status, create_time)
      VALUES (?, ?, ?, MD5(?), 1, NOW())
    `, [
      formData.user_name,
      formData.dept_id,
      formData.role_id,
      formData.password || '123456'
    ]);
    if (addRes.affectedRows > 0) {
      showAlert('用户新增成功！', 'success');
      modal_user.close();
      form_user.reset();
      await JSObject1.fetchUserList(); // 调用JSObject1的查询函数刷新列表
    } else {
      showAlert('新增失败，请检查数据！', 'error');
    }
  }
};