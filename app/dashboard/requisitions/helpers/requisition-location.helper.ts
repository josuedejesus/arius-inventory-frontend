import { LocationType } from "../../locations/types/location-type.enum";
import { LocationViewModel } from "../../locations/types/location-view-model";
import { MovementType } from "../types/movement-type";
import { RequisitionType } from "../types/requisition-type.enum";

type LocationRule = {
  allowed: LocationType[] | null;  // null = no necesita ubicación
  requiresDestination: boolean;    // false = no mostrar selector de destino
};

const LOCATION_RULES: Record<RequisitionType, Record<MovementType, LocationRule>> = {
  [RequisitionType.ADJUSTMENT]: {
    [MovementType.IN]:  { allowed: [LocationType.WAREHOUSE], requiresDestination: true  },
    [MovementType.OUT]: { allowed: null,                     requiresDestination: false },
    [MovementType.INT]: { allowed: [LocationType.WAREHOUSE], requiresDestination: true  },
  },
  [RequisitionType.PURCHASE_RECEIPT]: {
    [MovementType.IN]:  { allowed: [LocationType.WAREHOUSE], requiresDestination: true  },
    [MovementType.OUT]: { allowed: null,                     requiresDestination: false },
    [MovementType.INT]: { allowed: [LocationType.WAREHOUSE], requiresDestination: true  },
  },
  [RequisitionType.RETURN]: {
    [MovementType.IN]:  { allowed: [LocationType.WAREHOUSE], requiresDestination: true  },
    [MovementType.OUT]: { allowed: null,                     requiresDestination: false },
    [MovementType.INT]: { allowed: null,                     requiresDestination: false },
  },
  [RequisitionType.INTERNAL_TRANSFER]: {
    [MovementType.IN]:  { allowed: [LocationType.WAREHOUSE], requiresDestination: true  },
    [MovementType.OUT]: { allowed: [LocationType.WAREHOUSE], requiresDestination: true  },
    [MovementType.INT]: { allowed: [LocationType.WAREHOUSE], requiresDestination: true  },
  },
  [RequisitionType.RENT]: {
    [MovementType.IN]:  { allowed: null,                     requiresDestination: false },
    [MovementType.OUT]: { allowed: [LocationType.PROJECT],   requiresDestination: true  },
    [MovementType.INT]: { allowed: null,                     requiresDestination: false },
  },
  [RequisitionType.CONSUMPTION]: {
    [MovementType.IN]:  { allowed: null,                     requiresDestination: false },
    [MovementType.OUT]: { allowed: [LocationType.PROJECT],   requiresDestination: true  },
    [MovementType.INT]: { allowed: null,                     requiresDestination: false },
  },
  [RequisitionType.TRANSFER]: {
    [MovementType.IN]:  { allowed: [LocationType.WAREHOUSE], requiresDestination: true  },
    [MovementType.OUT]: { allowed: [LocationType.PROJECT],   requiresDestination: true  },
    [MovementType.INT]: { allowed: [LocationType.WAREHOUSE, LocationType.PROJECT], requiresDestination: true },
  },
  [RequisitionType.SALE]: {
    [MovementType.IN]:  { allowed: null,                     requiresDestination: false },
    [MovementType.OUT]: { allowed: [LocationType.PROJECT],   requiresDestination: true },
    [MovementType.INT]: { allowed: null,                     requiresDestination: false },
  },
  [RequisitionType.MAINTENANCE]: {
    [MovementType.IN]:  { allowed: [LocationType.WAREHOUSE],    requiresDestination: true  },
    [MovementType.OUT]: { allowed: [LocationType.MAINTENANCE],  requiresDestination: true  },
    [MovementType.INT]: { allowed: null,                        requiresDestination: false },
  },
  [RequisitionType.OUT_OF_SERVICE]: {
    [MovementType.IN]:  { allowed: null, requiresDestination: false },
    [MovementType.OUT]: { allowed: null, requiresDestination: false },
    [MovementType.INT]: { allowed: null, requiresDestination: false },
  },
};

const DEFAULT_RULE: LocationRule = { allowed: null, requiresDestination: false };

export const getLocationRule = (
  requisitionType: RequisitionType,
  movement: MovementType,
): LocationRule => {
  return LOCATION_RULES[requisitionType]?.[movement] ?? DEFAULT_RULE;
};

export const filterLocationsByRule = (
  locations: LocationViewModel[],
  requisitionType: RequisitionType,
  movement: MovementType,
): LocationViewModel[] => {
  const { allowed } = getLocationRule(requisitionType, movement);
  if (!allowed) return [];
  return locations.filter((l) => allowed.includes(l.type));
};

export const requiresDestination = (
  requisitionType: RequisitionType,
  movement: MovementType,
): boolean => {
  return getLocationRule(requisitionType, movement).requiresDestination;
};