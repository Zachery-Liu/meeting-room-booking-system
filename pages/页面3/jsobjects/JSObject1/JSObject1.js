export default {
  async fetchRolePermissions() {
    // 1. 使用真实的"角色表格"组件ID
    const selectedRole = 角色列表.selectedRow;
    if (!selectedRole) {
      showAlert('请选择要查询的角色！', 'warning');
      return;
    }

    try {
      // 2. 使用真实的数据源名称
      const rolePerms = await 会议预约管理系统数据库.query(`
        SELECT p.*
        FROM Permission p
        JOIN Role_Permission_Map rpm ON p.permission_id = rpm.permission_id
        WHERE rpm.role_id = ?
      `, [selectedRole.role_id]);

      // 3. 使用真实的"角色权限表格"组件ID
      权限列表.setData(rolePerms || []);
      
    } catch (error) {
      showAlert(`查询失败：${error.message}`, 'error');
    }
  }
};