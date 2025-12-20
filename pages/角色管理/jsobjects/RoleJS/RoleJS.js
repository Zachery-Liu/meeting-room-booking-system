export default {
    deleteRole: async () => {
        try {
            // 1. 先检查有没有人用
            const checkRes = await Check_Role_User_Count.run();
            const userCount = checkRes[0].count;

            // 2. 如果有人用，严厉拒绝
            if (userCount > 0) {
                showAlert(`无法删除：当前有 ${userCount} 个用户拥有此角色！请先解除他们的授权。`, 'error');
                return;
            }

            // 3. 如果没人用，且不是系统核心角色 (可选保护)
            const roleCode = Table1.triggeredRow.role_code;
            if (roleCode === 'ADMIN' || roleCode === 'USER') {
                 showAlert('系统内置角色禁止删除！', 'warning');
                 return;
            }

            // 4. 执行删除
            await Delete_Role.run();
            showAlert('角色已删除', 'success');
            Get_All_Roles.run(); // 刷新列表

        } catch (error) {
            showAlert('删除失败: ' + error.message, 'error');
        }
    }
}