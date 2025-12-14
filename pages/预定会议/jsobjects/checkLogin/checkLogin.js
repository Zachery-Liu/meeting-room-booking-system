export default {
    checkLogin: () => {
        // 检查缓存里有没有 user_id
        if (!appsmith.store.user_id) {
            // 如果没有（说明没登录），强制踢回登录页
            showAlert("请先登录！", "warning");
            navigateTo('Login_Page'); 
        } else {
            // 如果已登录，欢迎一下
            showAlert("欢迎回来，" + appsmith.store.user_name, "success");
            // 刷新列表数据
            List_Bookings.run();
        }
    }
}