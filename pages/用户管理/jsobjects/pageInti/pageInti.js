export default {
    initPage: async () => {
        
        // =========================================================
        // 第一关：身份校验 (Authentication) - 检查是否登录
        // =========================================================
        // 检查 user_id 是否存在，且权限缓存是否有效
        if (!appsmith.store.user_id || !appsmith.store.GLOBAL_PERMS) {
            showAlert("会话已过期或未登录，请重新登录！", "warning");
            navigateTo('登录页面'); 
            return; // 【核心】验证失败，立刻中断，不往下执行
        }

        // =========================================================
        // 第二关：权限校验 (Authorization) - 检查是否有权看这个页面
        // =========================================================
        
        // 【⚠️ 每个页面只需改这里】：当前页面对应的权限代号
        // 例如：用户管理页填 'PAGE_USER_MANAGE'，维保页填 'PAGE_MAINTENANCE'
        const currentContextPerm = 'MANAGE:USER'; 

        // 从缓存拿所有权限 (加 || [] 防止报错)
        const myPerms = appsmith.store.GLOBAL_PERMS || [];

        // 检查是否包含当前页面的权限
        if (!myPerms.includes(currentContextPerm)) {
            showAlert('权限不足：您无权访问此页面', 'error');
            navigateTo('主页'); // 或者是 'Dashboard'
            return; // 【核心】权限不够，立刻中断，不加载敏感数据
        }
    }
}