export default {
  // 定义校验+赋值的函数
  run: function() {
    // 校验是否选中反馈行
    if (!MyFeedbackTable.selectedRow || !MyFeedbackTable.selectedRow.feedback_id) {
      showAlert('请先选中一条反馈记录！', 'error');
      return false; // 校验失败，终止后续操作
    }
    // 校验是否选择处理状态
    if (!HandleStatusDropdown.selectedOptionValue) {
      showAlert('请选择处理状态！', 'error');
      return false;
    }
    // 给页面变量赋值（需提前创建selectedFeedbackId）
    const selectedFeedbackId = MyFeedbackTable.selectedRow.feedback_id;
    return true; // 校验通过export default {
 
}
  }

