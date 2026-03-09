/**
 * Mixcloud data layer – fetches episodes (cloudcasts) for Latest Episodes and player.
 * Uses the Cloudflare-backed SamudraFM API, which securely handles the Mixcloud API key.
 */

(function (global) {
  'use strict';

  var MIXCLOUD_PROXY_BASE = 'https://api.samudrafm.com/mixcloud';

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

    // Build request URL to your Cloudflare-backed Mixcloud proxy
    var url = MIXCLOUD_PROXY_BASE;
    var params = [];

    if (username) {
      params.push('username=' + encodeURIComponent(username));
    }
    if (nextUrl) {
      // When paginating, pass the Mixcloud paging URL through so the worker can proxy it
      params.push('next_url=' + encodeURIComponent(nextUrl));
    } else if (limit != null) {
      params.push('limit=' + encodeURIComponent(limit));
    }

    if (params.length) {
      url += '?' + params.join('&');
    }

    return fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: { Accept: 'application/json' }
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (json) {
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
