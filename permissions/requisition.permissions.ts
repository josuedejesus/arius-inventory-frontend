export enum modes {
  VIEW,
  EDIT,
  APPROVE,
  EXECUTE,
  RECEIVE,
}

export const ACTIONS_BY_ROLE = {
  OPERATOR: ["EDIT", "CREATE", "EXECUTE"],
  MANAGER: ["APPROVE"],
  ADMIN: ["ALL", "APPROVE"],
};

export const VIEW_MODE_BY_ROLE_STATUS: Record<string, Record<string, modes>> = {
  WAREHOUSE_MANAGER: {
    DRAFT: modes.APPROVE,
    APPROVED: modes.EXECUTE,
    IN_PROGRESS: modes.RECEIVE,
  },
  ADMINISTRATIVE_MANAGER: {
    DRAFT: modes.APPROVE,
    APPROVED: modes.VIEW,
  },
  ADMIN: {
    DRAFT: modes.APPROVE,
    APPROVED: modes.EXECUTE,
    IN_PROGRESS: modes.RECEIVE,
  },
  CONTRACTOR: {
    DRAFT: modes.VIEW,
    APPROVED: modes.VIEW,
  },
  CLIENT: {
    DRAFT: modes.VIEW,
    APPROVED: modes.VIEW,
  },
};
