export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

export const setCookie = (name, value, options = {}) => {
  let cookieString = `${name}=${value}; path=${options.path || "/"};`;

  if (options.expires) {
    cookieString += ` expires=${options.expires.toUTCString()};`;
  }

  if (options.secure) {
    cookieString += " Secure;";
  }

  if (options.sameSite) {
    cookieString += ` SameSite=${options.sameSite};`;
  }

  document.cookie = cookieString;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure;`;
};
