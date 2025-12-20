export default {
    createPerm: async () => {
        // 1. 非空校验
        if (!Input_PermName.text || !Input_PermCode.text || !Input_MenuPath.text) {
            showAlert('请务必填写所有项！', 'warning');
            return; // 这里在函数里用 return 是完全合法的
        }

        // 2. 执行插入
        try {
            await Create_Permission.run();

            showAlert('权限创建成功！', 'success');
            closeModal('Modal3'); 
            await Get_All_Permissions.run(); // 刷新
            resetWidget('Modal3', true);     // 清空

        } catch (error) {
            if (error.message.includes('Duplicate')) {
                showAlert('创建失败：该权限代号已存在！', 'error');
            } else {
                showAlert('创建失败：' + error.message, 'error');
            }
        }
    }
}