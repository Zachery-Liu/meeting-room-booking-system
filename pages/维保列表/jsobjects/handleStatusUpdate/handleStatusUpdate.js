export default {
  async run() {
    try {
      // 1. 先执行"更新维保状态"的SQL查询
      await updateMaintenanceStatus.run();

      // 2. 检查维保状态是否为"执行中"
      const newStatus = MaintenanceStatusDropdown.selectedOptionValue;
      if (newStatus === '执行中') {
        // 3. 若为"执行中"，执行"更新会议室状态为0"的查询
        await updateRoomToBusy.run();
      }

      // 4. 无论是否更新会议室，都刷新列表+关闭弹窗+提示成功
      getAllMaintenances.run(); // 刷新维保列表
      closeModal(UpdateStatusModal); // 关闭状态更新弹窗
      showAlert('状态更新成功！', 'success');

    } catch (error) {
      // 5. 出错时提示错误信息
      showAlert('更新失败：' + error.message, 'error');
    }
  }
};