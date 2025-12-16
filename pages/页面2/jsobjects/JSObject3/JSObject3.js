export default async function handleDeleteBuilding(buildingId) {
  try {
    // 校验：建筑下是否有楼层
    const floors = await getFloors.run();
    const hasFloors = floors.some(floor => floor.building_id === buildingId);
    if (hasFloors) {
      showAlert('该建筑下有楼层，无法删除', 'warning');
      return;
    }
    const confirm = await showConfirm('确定删除该建筑吗？', '警告');
    if (!confirm) return;
    await deleteBuilding.run({ buildingId });
    showAlert('建筑删除成功', 'success');
    await getBuildings.run();
  } catch (error) {
    showAlert('删除失败：' + error.message, 'error');
  }
}