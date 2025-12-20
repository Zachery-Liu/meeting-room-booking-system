export default {
		logout: async () => {
        // 1. 二次确认 (可选，防止手滑)
        // const isConfirmed = await showModal('确认要退出登录吗？'); // 如果你想要弹窗确认
        
        // 2. 【核心】清空所有缓存
        // clearStore() 会把 appsmith.store 里的东西全部删光，最彻底、最安全
        await clearStore();

        // 如果你只想删特定的（比如想保留个主题设置），可以用 removeValue：
        // await removeValue('user_id');
        // await removeValue('GLOBAL_PERMS');
        // await removeValue('role_code');

        // 3. 提示反馈
        showAlert('已安全退出', 'success');

        // 4. 跳转回登录页
        navigateTo('登录页面');
    }
}