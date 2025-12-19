export default {
    handleSubmit: async () => {
        // --- 1. 基础校验 (保持不变) ---
        if (!input_subject.text) { showAlert("请填写会议主题！", "warning"); return; }
        if (!appsmith.store.target_room_id) { showAlert("请重新选择会议室！", "warning"); return; }
        const start = moment(appsmith.store.target_start_time);
        const end = moment(appsmith.store.target_end_time);
        if (end.isSameOrBefore(start)) { showAlert("结束时间必须晚于开始时间！", "error"); return; }
        if (end.diff(start, 'hours', true) > 8) { showAlert("时长不能超过 8 小时！", "error"); return; }

        // --- 2. 核心：带重试机制的写入循环 ---
        let attempt = 0;
        const maxRetries = 3; // 最多重试 3 次

        while (attempt < maxRetries) {
            try {
                // A. 生成 ID (带随机数)
                // 每次循环都会生成一个新的随机数
                const newId = "B" + moment().format("YYYYMMDDHHmmss") + Math.floor(Math.random() * 900 + 100).toString();
                await storeValue('temp_booking_id', newId);

                // B. 尝试写入 (原子操作)
                const result = await Create_Booking.run();

                // C. 检查是否因"时间冲突"被 SQL 拦截 (WHERE NOT EXISTS)
                // 注意：这里是业务逻辑失败，不是报错，所以不需要重试，直接退出
                if (result === 0 || (result.affectedRows !== undefined && result.affectedRows === 0)) {
                    showAlert("手慢了！该时间段刚刚被别人抢订了。", "error");
                    return; 
                }

                // D. 写入成功！跳出循环，继续后续操作
                break; 

            } catch (error) {
                // E. 捕获错误
                const errorMsg = error.message || "";
                
                // 如果是"主键重复"错误 (Duplicate entry)，则增加计数，进入下一次循环(重试)
                if (errorMsg.includes("Duplicate entry")) {
                    console.log(`ID冲突，正在进行第 ${attempt + 1} 次重试...`);
                    attempt++;
                    if (attempt >= maxRetries) {
                        showAlert("系统拥堵，请稍后重试 (ID生成失败)", "error");
                        return;
                    }
                    // 继续下一次 while 循环，重新生成 ID
                    continue; 
                } else {
                    // 如果是其他错误（比如断网、数据库挂了），直接报错并退出
                    showAlert("提交失败：" + errorMsg, "error");
                    return;
                }
            }
        }

        // --- 3. 成功后的收尾 (保持不变) ---
        // 能走到这里说明 break 出来了，也就是写入成功了
        try {
            await Log_Action_Create_Booking.run(); // 写日志
            showAlert("预约提交成功！", "success");
            closeModal("booking_modal");
            closeModal("confirm_booking_modal");
            await Search_Rooms.run();
            await Get_Daily_Schedule.run();
        } catch (logError) {
            // 日志写失败不影响主流程，提示一下即可
            console.error(logError);
        }
    }
}