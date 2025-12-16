// JSObject3 完整代码（需确保JSObject名称与实际一致）
export default {
  // 定义"编辑用户回显"函数
  async editUserEcho() {
    // 1. 修复组件名称：确保table_users是实际表格组件ID
    const selectedRow = table_users.selectedRow;
    if (!selectedRow) {
      showAlert('请选择要编辑的用户！', 'warning');
      return;
    }
    // 2. 修复组件名称：确保form_user是实际表单组件ID
    form_user.setFormData({
      user_id: selectedRow.user_id,
      user_name: selectedRow.user_name,
      dept_id: selectedRow.dept_id,
      role_id: selectedRow.role_id,
      status: selectedRow.status
    });
    // 3. 修复组件名称：确保modal_user是实际弹窗组件ID
    modal_user.open();
  },

  // 定义"编辑提交"函数
  async editUserSubmit() {
    // 1. 修复组件名称：确保form_user是实际表单组件ID
    const formData = form_user.formData;
    // 2. 修复数据源名称：确保db_auth是实际数据源名称（无空格）
    const editRes = await db_auth.query(`
      UPDATE User 
      SET user_name = ?, dept_id = ?, role_id = ?, status = ?
      WHERE user_id = ?
    `, [
      formData.user_name,
      formData.dept_id,
      formData.role_id,
      formData.status,
      formData.user_id
    ]);
    if (editRes.affectedRows > 0) {
      showAlert('用户编辑成功！', 'success');
      // 修复组件名称：确保modal_user、form_user是实际组件ID
      modal_user.close();
      form_user.reset();
      // 修复：调用JSObject1的查询函数刷新列表（替代page.onLoad）
      await JSObject1.fetchUserList();
    } else {
      showAlert('编辑失败，请检查数据！', 'error');
    }
  }
};