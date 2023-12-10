function transferItems(arrSourceItems, arrItemsToTransfer, arrTargetItems) {
  console.log('arrSourceItems',arrSourceItems)
  console.log('arrItemsToTransfer',arrItemsToTransfer)
  console.log('arrTargetItems',arrTargetItems)
  let allowTransfer = true

  arrItemsToTransfer.forEach(currentItem => {

    let sourceId = arrSourceItems.findIndex(sourceItem => {
      return (sourceItem.name === currentItem.name && sourceItem.amount >= currentItem.amount)
    })
    if (sourceId < 0) {allowTransfer = false; return}
    // arrSourceItems[sourceId].amount -= currentItem.amount 
    if((arrSourceItems[sourceId].amount -= currentItem.amount) === 0) arrSourceItems.splice(sourceId, 1)

    let targetId = arrTargetItems.findIndex(targetItem => targetItem.name === currentItem.name)

    if (targetId >= 0) {
      arrTargetItems[targetId].amount += currentItem.amount
    } else {
      arrTargetItems.push(currentItem)
    }
  });
  console.log('allowTransfer', allowTransfer)

  return {allowTransfer, updatedSourceItems: arrSourceItems, updatedTargetItems: arrTargetItems}
}


export default { transferItems }