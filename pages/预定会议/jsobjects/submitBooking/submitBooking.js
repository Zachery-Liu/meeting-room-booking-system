export default {
    // 提交预约的核心函数
    handleSubmit: async () => {
        // 1. 【基础校验】防止空值提交
        if (!input_subject.text) {
            showAlert("请填写会议主题！", "warning");
            return;
        }
        if (!appsmith.store.target_room_id) {
            showAlert("请选择会议室！", "warning");
            return;
        }

        // 2. 【安全校验】结束时间必须大于开始时间
        if (moment(date_end.formattedDate).isSameOrBefore(date_start.formattedDate)) {
            showAlert("结束时间必须晚于开始时间！", "error");
            return;
        }

        try {
            // 3. 【核心算法】提交前再做一次冲突检测 (Double Check)
            const conflictCheck = await Check_Conflict.run(); 
            if (conflictCheck[0].count > 0) {
                showAlert("下手慢了！该时间段刚才被人抢订了，请换个时间。", "error");
                return; 
            }

            // 4. 【执行写入】如果没有冲突，正式写入数据库
            // 新增：接收 Create_Booking 返回的 bookingId
            const bookingResult = await Create_Booking.run(); 
            
            // 5. (可选) 写入日志，凑够3张表工作量
            // await Log_Action.run(); 

            // 6. 【UI反馈】成功的收尾工作
            showAlert("预约提交成功！", "success");
            closeModal("New_Modal");      
            await Search_Rooms.run();     

            // --------------------------
            // 新增核心代码（仅4行）：获取bookingId并跳转
            // --------------------------
            // 取新生成的bookingId（适配MySQL，PostgreSQL改bookingResult[0]?.booking_id）
            const bookingId = bookingResult[0]?.LAST_INSERT_ID; 
            if (bookingId) {
                navigateTo("Meeting_Detail", { bookingId: bookingId }); // 替换成你的页面名
            }
            // --------------------------

        } catch (error) {
            // 兜底错误处理
            showAlert("提交失败：" + error.message, "error");
        }
    }
}