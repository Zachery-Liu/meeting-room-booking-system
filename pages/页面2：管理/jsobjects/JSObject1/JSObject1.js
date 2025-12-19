export default async function handleAddBuilding(buildingName, buildingCode, buildingDesc) {
  try {
    if (!buildingName || !buildingCode) {
      showAlert('请输入建筑名称和编码', 'warning');
      return;
    }
    await addBuilding.run({ buildingName, buildingCode, buildingDesc });
    showAlert('建筑新增成功', 'success');
    await getBuildings.run();
    Modal_building.close(); // 替换为你的弹窗名称
  } catch (error) {
    showAlert('新增失败：' + error.message, 'error');
  }
}