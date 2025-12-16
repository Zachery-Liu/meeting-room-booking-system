export default {
  async deleteUser() {
    // 1. 修复组件名称：确保table_users是实际表格组件ID（无空格）
    const selectedRow = table_users.selectedRow;
    if (!selectedRow) {
      showAlert('请选择要删除的用户！', 'warning');
      return;
    }

    // 2. 确认删除
    const confirmDel = await showModal('确认删除', '删除后数据不可恢复，是否确认？', ['取消', '确认']);
    if (confirmDel !== '确认') return;

    try {
      // 3. 修复数据源名称：确保db_auth是实际数据源名称（无空格）
      const delRes = await db_auth.query(`
        DELETE FROM User WHERE user_id = ?
      `, [selectedRow.user_id]);

      // 4. 反馈+刷新
      if (delRes.affectedRows > 0) {
        showAlert('用户删除成功！', 'success');
        // 修复：调用JSObject1的查询函数刷新列表（替代page.onLoad）
        await JSObject1.fetchUserList();
      }
    } catch (error) {
      showAlert(`删除失败：${error.message}`, 'error');
    }
  }
};