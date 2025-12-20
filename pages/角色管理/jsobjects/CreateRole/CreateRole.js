export default {
    createRole: async () => {
        // =========================================================
        // 1. 非空校验 (Validation)
        // =========================================================
        
        // 检查名称和代号是否为空
        // .trim() 用于去除用户不小心输入的前后空格
        if (!Input_Name.text.trim() || !Input_Code.text.trim()) {
            showAlert('请务必填写"角色名称"和"角色代号"！', 'warning');
            return; // 【核心】如果没填全，直接打断，不发请求
        }

        // =========================================================
        // 2. 格式校验 (可选 - 建议代号只允许英文大写)
        // =========================================================
        // 正则表达式：只允许 A-Z, 0-9 和 下划线
        const codePattern = /^[A-Z0-9_]+$/;
        if (!codePattern.test(Input_Code.text.trim())) {
            showAlert('角色代号建议使用大写字母、数字或下划线 (例如 MANAGER)', 'warning');
            // return; // 如果你想强制规范，就把这行注释打开
        }

        // =========================================================
        // 3. 执行创建 (Execution)
        // =========================================================
        try {
            await Create_Role.run(); // 运行你的 INSERT SQL

            showAlert('角色创建成功！', 'success');
            closeModal('Modal1'); // 关闭弹窗
            await Get_All_Roles.run();      // 刷新列表
            
            // 清空输入框 (下次打开是干净的)
            resetWidget('Modal1', true);

        } catch (error) {
            // =====================================================
            // 4. 错误处理 (Error Handling)
            // =====================================================
            
            // 如果数据库报 "Duplicate entry" (说明代号重复了)
            if (error.message.includes('Duplicate')) {
                showAlert('创建失败：该角色代号 (Role Code) 已存在！', 'error');
            } else {
                showAlert('创建失败：' + error.message, 'error');
            }
        }
    }
}