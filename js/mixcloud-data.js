/**
 * Mixcloud data layer – fetches episodes (cloudcasts) for Latest Episodes and player.
 * Uses CORS proxy when direct API request fails (Mixcloud can block browser CORS).
 */

(function (global) {
  'use strict';

  var CORS_PROXY = 'https://api.allorigins.win/raw?url=';
  var MIXCLOUD_API_BASE = 'https://api.mixcloud.com/';

  /**
   * Fetch a URL; on failure (e.g. CORS), retry via CORS proxy.
   * @param {string} url - Full URL to fetch
   * @returns {Promise<string>} Response text
   */
  function fetchUrl(url) {
    return fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: { Accept: 'application/json' }
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .catch(function () {
        var proxyUrl = CORS_PROXY + encodeURIComponent(url);
        return fetch(proxyUrl, { method: 'GET', mode: 'cors' })
          .then(function (res) {
            if (!res.ok) throw new Error('Proxy HTTP ' + res.status);
            return res.text();
          });
      });
  }

  /**
   * Normalize a cloudcast item to the shape used by the site (episode cards + player).
   * @param {Object} item - Raw Mixcloud cloudcast
   * @returns {Object} Normalized episode
   */
  function normalizeEpisode(item) {
    if (!item) return null;
    var pics = item.pictures || {};
    var picture = pics.extra_large || pics.large || pics.medium || pics.small || '';
    return {
      url: item.url,
      name: item.name,
      created: item.created_time ? new Date(item.created_time) : null,
      created_time: item.created_time,
      picture: picture,
      pictures: {
        extra_large: pics.extra_large,
        large: pics.large,
        medium: pics.medium,
        small: pics.small
      },
      user: item.user || null
    };
  }

  /**
   * Fetch cloudcasts (episodes) from Mixcloud API.
   * @param {string} username - Mixcloud username (e.g. 'samudrafm')
   * @param {Object} [opts] - Options
   * @param {number} [opts.limit=12] - Max number of episodes
   * @param {string} [opts.nextUrl] - Pagination URL (if provided, used instead of limit)
   * @returns {Promise<{ data: Array<Object>, paging: Object }>}
   */
  function getMixcloudCloudcasts(username, opts) {
    opts = opts || {};
    var limit = opts.limit != null ? opts.limit : 12;
    var nextUrl = opts.nextUrl;
    var url = nextUrl || (MIXCLOUD_API_BASE + username + '/cloudcasts/?limit=' + limit);

    return fetchUrl(url).then(function (text) {
      var json = JSON.parse(text);
      var rawData = json.data || [];
      var data = rawData.map(normalizeEpisode).filter(Boolean);
      return {
        data: data,
        paging: json.paging || {}
      };
    });
  }

  /**
   * Fetch the latest single episode (for hero player).
   * @param {string} username - Mixcloud username
   * @returns {Promise<Object|null>} Normalized episode or null
   */
  function getMixcloudLatest(username) {
    return getMixcloudCloudcasts(username, { limit: 1 }).then(function (result) {
      return result.data && result.data[0] ? result.data[0] : null;
    });
  }

  // Expose on window for classic script usage
  if (typeof global.window !== 'undefined') {
    global.window.getMixcloudCloudcasts = getMixcloudCloudcasts;
    global.window.getMixcloudLatest = getMixcloudLatest;
  }
  if (typeof global !== 'undefined') {
    global.getMixcloudCloudcasts = getMixcloudCloudcasts;
    global.getMixcloudLatest = getMixcloudLatest;
  }
})(typeof window !== 'undefined' ? window : this);
