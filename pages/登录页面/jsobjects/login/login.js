export default {
    doLogin: async () => {
        try {
            // =================================================
            // 第一步：验证账号密码
            // =================================================
            const userResult = await Query1.run(); // 加了 await，程序会在这里暂停等待数据库

            // 检查是否查到了用户
            if (!userResult || userResult.length === 0) {
                showAlert('用户名或密码错误', 'error');
                return; // 没查到就直接结束
            }

            const user = userResult[0];

            // =================================================
            // 第二步：存入基础信息
            // =================================================
            // 使用 await storeValue 确保存进去了，再进行下一步
            await storeValue('user_id', user.id);
            await storeValue('username', user.username);
            // 存角色代码，供 Query3 使用
            await storeValue('role_code', user.role_code); 

            // =================================================
            // 第三步：【核心修正】获取权限
            // =================================================
            // 必须加 await！否则还没查回来你就去 map，必挂无疑
            // 这里假设 Query3 里的 SQL 引用了 {{appsmith.store.role_code}}
            const permsData = await Query3.run();

            // 防御性编程：万一该角色没有任何权限，给个空数组
            const permArray = (permsData || []).map(item => item.perm_code);

            // 存入全局权限 (第三个参数 true 表示持久化)
            await storeValue('GLOBAL_PERMS', permArray, true);

            // =================================================
            // 第四步：登录成功跳转
            // =================================================
            showAlert(`欢迎回来，${user.real_name || user.username}`, 'success');
            navigateTo('主页'); // 确保页面名称完全一致

        } catch (error) {
            // 这里会捕获 SQL 报错或 JS 逻辑报错
            showAlert('登录流程异常: ' + error.message, 'error');
            console.error(error);
        }
    }
}