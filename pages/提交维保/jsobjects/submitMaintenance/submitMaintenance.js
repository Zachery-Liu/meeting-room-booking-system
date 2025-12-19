export default {
  async run() {
    // 1. 校验必填项
    if (!RoomDropdown.selectedOptionValue) {
      showAlert("请先选择会议室！", "warning");
      return;
    }
    if (!AdminDropdown.selectedOptionValue) {
      showAlert("请先选择管理员！", "warning");
      return;
    }

    // 2. 执行插入查询
    try {
      await createMaintenanceNew.run();
      
      // 3. 成功后操作（修正组件方法）
      showAlert("维保申请提交成功！", "success");
      
      
      

    } catch (error) {
      showAlert("提交失败：" + error.message, "error");
    }
  }
};