// utils/requisition.utils.ts

export const getItemKey = (item: any): string => {
  if (item.item_unit_id) {
    return `unit-${item.item_unit_id}`;
  }
  const itemId = item.item_id ?? item.id; // 👈
  const locationId = item.location_id ?? item.source_location_id; // 👈
  return `supply-${itemId}-${locationId || null}`;
};