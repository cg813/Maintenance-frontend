import urlJoin from 'url-join';

export const assetServiceUrl = urlJoin(
  process.env.REACT_APP_SERVICE_URL_ASSET || `${window.location.origin}/services/asset`,
);
export const fileServiceUrl = urlJoin(
  process.env.REACT_APP_SERVICE_URL_FILE || `${window.location.origin}/services/file`,
);
export const maintenanceServiceUrl = urlJoin(
  process.env.REACT_APP_SERVICE_URL_MAINTENANCE || `${window.location.origin}/services/maintenance`,
);
export const userServiceUrl = urlJoin(
  process.env.REACT_APP_SERVICE_URL_USER || `${window.location.origin}/services/user`,
);
export const hubServiceUrl = urlJoin(
  process.env.REACT_APP_SERVICE_URL_HUB || `${window.location.origin}/services/hub`,
);
