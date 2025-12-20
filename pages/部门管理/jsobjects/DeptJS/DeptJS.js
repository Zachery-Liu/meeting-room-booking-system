export default {
    // ============================================================
    // 1. 新增部门 (带非空校验)
    // ============================================================
    createDept: async () => {
        // 校验：部门名称不能为空
        if (!Input_DeptName.text.trim()) {
            showAlert('请填写部门名称！', 'warning');
            return;
        }

        try {
            await Create_Dept.run();
            
            showAlert('部门创建成功！', 'success');
            closeModal('Modal_CreateDept');
            await Get_All_Depts.run(); // 刷新列表
            
            // 清空输入框
            resetWidget('Modal_CreateDept', true);
            
        } catch (error) {
            if (error.message.includes('Duplicate')) {
                showAlert('创建失败：该部门名称已存在！', 'error');
            } else {
                showAlert('创建失败：' + error.message, 'error');
            }
        }
    },

    // ============================================================
    // 2. 修改部门
    // ============================================================
    updateDept: async () => {
        // 校验
        if (!Input_DeptNameUpdate.text.trim()) {
            showAlert('部门名称不能为空！', 'warning');
            return;
        }

        try {
            await Update_Dept.run();
            
            showAlert('部门修改成功！', 'success');
            closeModal('Modal_CreateDeptCopy');
            await Get_All_Depts.run(); // 刷新列表
            
        } catch (error) {
            showAlert('修改失败：' + error.message, 'error');
        }
    },

    // ============================================================
    // 3. 删除部门 (带安全保护锁 🔒)
    // ============================================================
    deleteDept: async () => {
        try {
            // A. 第一步：检查部门里有没有人
            // 注意：这里用 triggeredRow，因为你是点击行内的删除按钮
            const checkRes = await Check_Dept_Usage.run();
            const userCount = checkRes[0].count;

            // B. 第二步：如果有人，严厉拒绝
            if (userCount > 0) {
                showAlert(`无法删除：该部门下还有 ${userCount} 名员工！请先将他们转移到其他部门。`, 'error');
                return; // ⛔️ 停止执行，保护数据
            }

            // C. 第三步：如果没人，执行删除
            // (可选) 可以在这里加个 showModal('ConfirmDelete') 做二次确认，更稳妥
            await Delete_Dept.run();
            
            showAlert('部门已删除', 'success');
            await Get_All_Depts.run(); // 刷新列表

        } catch (error) {
            showAlert('删除失败：' + error.message, 'error');
        }
    }
}