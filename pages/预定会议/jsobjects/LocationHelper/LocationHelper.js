export default {
    // 将扁平数据转为树形数据
    generateTreeData: () => {
        const rawData = Get_Location_Tree.data; // 读取刚才的 SQL 结果
        const treeMap = {};
        const result = [];

        rawData.forEach(item => {
            // 1. 如果这个楼栋还没加进 map，先初始化楼栋节点
            if (!treeMap[item.building_id]) {
                treeMap[item.building_id] = {
                    label: item.building_name,
                    // 【技巧】给楼栋ID加个前缀，防止和楼层ID冲突
                    // 虽然最后我们要的是楼层ID，但父节点必须有唯一 Value
                    value: "BUILDING_" + item.building_id, 
                    children: []
                };
                result.push(treeMap[item.building_id]);
            }

            // 2. 把当前行对应的楼层，加到对应楼栋的 children 里
            treeMap[item.building_id].children.push({
                label: item.floor_name,
                value: item.floor_id // 这里直接用 int 类型的 floor_id
            });
        });

        return result;
    }
}