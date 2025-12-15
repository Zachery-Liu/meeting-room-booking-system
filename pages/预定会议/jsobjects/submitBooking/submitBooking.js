export default {
    // 提交预约的核心函数
    handleSubmit: async () => {
        // 1. 【基础校验】防止空值提交
        // 主题是唯一需要读组件的地方，因为这是用户刚填的
        if (!input_subject.text) {
            showAlert("请填写会议主题！", "warning");
            return;
        }
        // 房间ID从缓存读（防篡改）
        if (!appsmith.store.target_room_id) {
            showAlert("系统参数丢失，请重新选择会议室！", "warning");
            return;
        }

        // 2. 【时间校验】
        const start = moment(appsmith.store.target_start_time);
        const end = moment(appsmith.store.target_end_time);

        // 校验 A: 结束必须晚于开始
        if (end.isSameOrBefore(start)) {
            showAlert("结束时间必须晚于开始时间！", "error");
            return;
        }

        // 【新增】校验 B: 时长不能超过 8 小时
        // diff 函数用于计算两个时间差，'hours' 表示单位，true 表示保留小数
        const duration = end.diff(start, 'hours', true);
        
        if (duration > 8) {
            showAlert("单次预约时长不能超过 8 小时！请调整时间。", "error");
            return;
        }

        try {
            // 3. 【核心算法】提交前再做一次冲突检测 (Double Check)
            // 这一步会执行 Check_Conflict 查询，请确保该 SQL 里绑定的是 appsmith.store
            const conflictCheck = await Check_Conflict.run(); 
            
            // 这里的 [0].count 是 SQL count(*) 的返回结果
            if (conflictCheck && conflictCheck[0] && conflictCheck[0].count > 0) {
                showAlert("下手慢了！该时间段刚才被人抢订了，请换个时间。", "error");
                return; // 终止流程
            }

            // 4. 【执行写入】如果没有冲突，正式写入数据库
            // 这一步会执行 Create_Booking 查询
            await Create_Booking.run(); 
            
            // 5. (可选) 写入日志，凑够3张表工作量
            // 如果你做了 Log_Action 查询，就把下面这行注释打开
            await Log_Action_Create_Booking.run(); 

            // 6. 【UI反馈】成功的收尾工作
            showAlert("预约提交成功！", "success");
            closeModal("booking_modal");      // 关掉弹窗
					  closeModal("confirm_booking_modal");
            
            // 【关键】刷新外面的查询列表
            // 这样你刚才订的那个房间，在列表上就会瞬间变成红色（不可订）
            await Search_Rooms.run();     
            
        } catch (error) {
            // 兜底错误处理，把具体错误打印出来方便调试
            showAlert("提交失败：" + error.message, "error");
        }
    }
}