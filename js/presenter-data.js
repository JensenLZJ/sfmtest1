/**
 * samudrafm presenter data – notes, social links, and copy per presenter.
 * Used by the hero presenter card and anywhere we show presenter info.
 * Keys are matched case-insensitively to API/schedule names (e.g. "autoDJ", "Jensen").
 */
(function () {
  'use strict';

  var PRESENTER_DATA = {
    AutoDJ: {
      name: 'autoDJ',
      description: 'Non-stop music on samudrafm.com.',
      timeLabel: 'Streaming 24/7.',
      notes: '',
      instagram: 'https://www.instagram.com/samudrafm/',
      facebook: null,
      profileUrl: '/profile',
      art: 'assets/brandmark/autoDJ.jpg'
    },
    Jensen: {
      name: 'Jensen',
      description: '',
      timeLabel: '',
      notes: '',
      instagram: null,
      facebook: null,
      profileUrl: '/profile',
      art: null
    },
    JensenL: {
      name: 'Jensen',
      description: '',
      timeLabel: '',
      notes: '',
      instagram: null,
      facebook: null,
      profileUrl: '/profile',
      art: null
    },
    Srishti: {
      name: 'Srishti',
      description: '',
      timeLabel: '',
      notes: '',
      instagram: null,
      facebook: null,
      profileUrl: '/profile',
      art: null
    },
    Justin: {
      name: 'Justin',
      description: '',
      timeLabel: '',
      notes: '',
      instagram: null,
      facebook: null,
      profileUrl: '/profile',
      art: null
    },
    Vyshavi: {
      name: 'Vyshavi',
      description: '',
      timeLabel: '',
      notes: '',
      instagram: null,
      facebook: null,
      profileUrl: '/profile',
      art: null
    },
    Noelle: {
      name: 'Noelle',
      description: '',
      timeLabel: '',
      notes: '',
      instagram: null,
      facebook: null,
      profileUrl: '/profile',
      art: null
    },
    Benjamin: {
      name: 'Benjamin',
      description: '',
      timeLabel: '',
      notes: '',
      instagram: null,
      facebook: null,
      profileUrl: '/profile',
      art: null
    },
    'Qing Qing': {
      name: 'Qing Qing',
      description: '',
      timeLabel: '',
      notes: '',
      instagram: null,
      facebook: null,
      profileUrl: '/profile',
      art: null
    },
    Airil: {
      name: 'Airil',
      description: '',
      timeLabel: '',
      notes: '',
      instagram: null,
      facebook: null,
      profileUrl: '/profile',
      art: null
    },
    Karisemma: {
      name: 'Karisemma',
      description: '',
      timeLabel: '',
      notes: '',
      instagram: null,
      facebook: null,
      profileUrl: '/profile',
      art: null
    },
    Ryan: {
      name: 'Ryan',
      description: '',
      timeLabel: '',
      notes: '',
      instagram: null,
      facebook: null,
      profileUrl: '/profile',
      art: null
    },
    Michelle: {
      name: 'Michelle',
      description: '',
      timeLabel: '',
      notes: '',
      instagram: null,
      facebook: null,
      profileUrl: '/profile',
      art: null
    },
    Shayna: {
      name: 'Shayna',
      description: '',
      timeLabel: '',
      notes: '',
      instagram: null,
      facebook: null,
      profileUrl: '/profile',
      art: null
    },
    Sereena: {
      name: 'Sereena',
      description: '',
      timeLabel: '',
      notes: '',
      instagram: null,
      facebook: null,
      profileUrl: '/profile',
      art: null
    }
  };

  /**
   * Get presenter data by name (case-insensitive, trimmed).
   * @param {string} name - Presenter name from API or schedule (e.g. "autoDJ", "Jensen").
   * @returns {Object|null} Presenter entry or null.
   */
  function getPresenterData(name) {
    if (!name || typeof name !== 'string') return null;
    var key = name.trim();
    if (PRESENTER_DATA[key]) return PRESENTER_DATA[key];
    var lower = key.toLowerCase();
    for (var k in PRESENTER_DATA) {
      if (k.toLowerCase() === lower) return PRESENTER_DATA[k];
    }
    return null;
  }

  if (typeof window !== 'undefined') {
    window.PRESENTER_DATA = PRESENTER_DATA;
    window.getPresenterData = getPresenterData;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PRESENTER_DATA, getPresenterData };
  }
})();
