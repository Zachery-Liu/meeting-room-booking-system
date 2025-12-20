export default {
    saveRoles: async () => {
        const userId = Table_Permissions.triggeredRow.id;
        const roleIds = MultiSelect1.selectedOptionValues; 

        // 1. 先删旧数据 (假设你已有 Delete_Query)
        await Delete_Old_Roles.run(); 

        // 2. 循环插入
        for (const roleId of roleIds) {
            // 【核心】把当前要插的 roleId 存入临时缓存 'temp_role_id'
            // 第三个参数 false 表示不持久化到硬盘，速度更快
            await storeValue('temp_role_id', roleId, false);
            
            // 【核心】直接运行，不需要传参了
            await Insert_One_Role.run();
        }
        
        showAlert('授权成功', 'success');
        closeModal('Modal1');
			await Get_All_Permissions.run()
    }
}