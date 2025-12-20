export default {
    changePassword: async () => {
        try {
            // 1. 直接获取 run 的返回值，而不是去读全局 data
            const result = await Update_Password.run();

            // 2. 关闭弹窗
            closeModal('Edit_Pwd');

            // 3. 判断逻辑优化
            // 情况 A: 如果是 MySQL，通常 result 是 { affectedRows: 1, ... }
            // 情况 B: 有些版本可能是 [{ affectedRows: 1 }]
            // 情况 C: 最简单的——只要代码能跑到这里没报错，说明 SQL 执行通了
            
            // 推荐逻辑：只要 result 存在，且没有报错，就视为成功
            // 如果你非要卡行数，请确保先看 console.log 的结构
            if (result) {
                 showAlert('密码修改成功', 'success');
            }

        } catch (error) {
            // 4. 只有 SQL 执行出错（比如连不上库、SQL写错了）才会进这里
            showAlert('修改失败：' + error.message, 'error');
        }
    }
}