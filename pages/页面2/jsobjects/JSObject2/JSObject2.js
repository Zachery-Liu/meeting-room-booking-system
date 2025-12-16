export default async function handleEditBuilding(buildingId, buildingName, buildingCode, buildingDesc) {
  try {
    if (!buildingId || !buildingName || !buildingCode) {
      showAlert('参数不能为空', 'warning');
      return;
    }
    await editBuilding.run({ buildingId, buildingName, buildingCode, buildingDesc });
    showAlert('建筑编辑成功', 'success');
    await getBuildings.run();
    Modal_building.close();
  } catch (error) {
    showAlert('编辑失败：' + error.message, 'error');
  }
}