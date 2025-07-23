import _ from "lodash";

function getEnvValue(name, defaultValue = "") {
  const env = import.meta.env;
  return _.get(env, name, defaultValue);
}

const env = {
  serverUrl: getEnvValue("VITE_API_URL", "http://localhost:80"),
  interval_refresh_token:
    _.toNumber(getEnvValue("VITE_INTERVAL_REFRESHTOKEN", "7200")) * 1000 * 0.9, 
};

export default env;
