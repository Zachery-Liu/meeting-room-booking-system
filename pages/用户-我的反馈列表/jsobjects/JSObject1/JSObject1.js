export default async function() {
  try {
    // 1. 校验：必须选中表格行 + 选择处理状态
    if (!MyFeedbackTable.selectedRow) {
      showAlert('请先选中一条反馈记录！', 'error'); // Appsmith内置提示函数
      return; // 终止执行
    }
    if (!MyFeedbackTable.selectedRow.feedback_id) {
      showAlert('选中的记录无反馈ID！', 'error');
      return;
    }
    if (!HandleStatusDropdown.selectedOptionValue) {
      showAlert('请选择处理状态！', 'error');
      return;
    }

    // 2. 给页面变量赋值（Appsmith官方赋值方式）
    setPageVariable('selectedFeedbackId', MyFeedbackTable.selectedRow.feedback_id);

    // 3. 执行更新反馈状态的MySQL API（await等待执行完成）
    const updateResult = await updateFeedbackStatus.run();

    // 4. 成功回调（API执行成功）
    if (updateResult.status === 'success') {
      showAlert('处理状态更新成功！', 'success');
      HandleFeedbackModal.close(); // 关闭弹窗（Appsmith弹窗组件的官方方法）
      await getAllFeedbackList.run(); // 刷新反馈列表
      HandleNote.setText(''); // 清空处理备注输入框（可选）
    }

  } catch (error) {
    // 5. 失败回调（API执行出错）
    showAlert(`更新失败：${error.message || '网络/数据库错误'}`, 'error');
    console.error('反馈处理失败详情：', error); // 控制台调试（左下角「调试器」可看）
  }
}